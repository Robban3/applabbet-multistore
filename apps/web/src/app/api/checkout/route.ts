import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizePaymentMethods } from "@/lib/tenant-settings";
import { normalizeHost, resolveTenantByHost } from "@/lib/tenant";

interface CheckoutItem {
  productId: string;
  title: string;
  priceMinor: number;
  quantity: number;
  currency: string;
}

interface CheckoutPayload {
  email: string;
  name?: string;
  items: CheckoutItem[];
  paymentMethod?: "stripe" | "klarna" | "swish";
  shippingMethodId?: string | null;
}

function addBusinessDays(start: Date, days: number) {
  const result = new Date(start);
  let remaining = Math.max(0, days);
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    if (!payload.email || payload.items.length === 0) {
      return NextResponse.json({ error: "Ogiltig checkout payload." }, { status: 400 });
    }

    const host = normalizeHost(request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost");
    const tenant = await resolveTenantByHost(host);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant hittades inte för host." }, { status: 404 });
    }

    const itemsTotalMinor = payload.items.reduce(
      (sum, item) => sum + item.priceMinor * item.quantity,
      0,
    );

    const supabase = createSupabaseAdminClient();
    const { data: tenantSettings } = await supabase
      .from("tenant_settings")
      .select("payment_methods")
      .eq("tenant_id", tenant.id)
      .maybeSingle();

    const paymentMethods = normalizePaymentMethods(tenantSettings?.payment_methods);
    const requestedMethod = payload.paymentMethod || "stripe";
    let selectedPaymentMethod: "stripe" | "klarna" | "swish" | null = null;
    if (requestedMethod === "stripe" && paymentMethods.stripe) selectedPaymentMethod = "stripe";
    if (requestedMethod === "klarna" && paymentMethods.klarna) selectedPaymentMethod = "klarna";
    if (requestedMethod === "swish" && paymentMethods.swish) selectedPaymentMethod = "swish";
    if (!selectedPaymentMethod) {
      if (paymentMethods.stripe) selectedPaymentMethod = "stripe";
      else if (paymentMethods.klarna) selectedPaymentMethod = "klarna";
      else if (paymentMethods.swish) selectedPaymentMethod = "swish";
    }
    if (!selectedPaymentMethod) {
      return NextResponse.json({ error: "Inga betalmetoder är aktiverade för butiken." }, { status: 400 });
    }

    const { data: shippingMethods } = await supabase
      .from("shipping_methods")
      .select("id, name, service_code, handling_days, transit_days_min, transit_days_max, base_price_minor, free_shipping_over_minor, carrier_integration_id, is_active")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    const selectedShippingMethod =
      (shippingMethods || []).find((method) => method.id === payload.shippingMethodId) || shippingMethods?.[0] || null;

    let shippingCarrierName: string | null = null;
    if (selectedShippingMethod?.carrier_integration_id) {
      const { data: carrier } = await supabase
        .from("carrier_integrations")
        .select("display_name")
        .eq("tenant_id", tenant.id)
        .eq("id", selectedShippingMethod.carrier_integration_id)
        .maybeSingle();
      shippingCarrierName = (carrier?.display_name as string) || null;
    }

    const shippingMinor = selectedShippingMethod
      ? itemsTotalMinor < Number(selectedShippingMethod.free_shipping_over_minor || 0)
        ? Number(selectedShippingMethod.base_price_minor || 0)
        : 0
      : 0;
    const orderTotalMinor = itemsTotalMinor + shippingMinor;
    const dispatchDate = selectedShippingMethod
      ? addBusinessDays(new Date(), Number(selectedShippingMethod.handling_days || 0))
      : null;
    const deliveryStart = selectedShippingMethod
      ? addBusinessDays(
          dispatchDate || new Date(),
          Number(selectedShippingMethod.transit_days_min || 1),
        )
      : null;
    const deliveryEnd = selectedShippingMethod
      ? addBusinessDays(
          dispatchDate || new Date(),
          Number(selectedShippingMethod.transit_days_max || 3),
        )
      : null;

    const productIds = payload.items.map((item) => item.productId);
    const { data: inventoryRows } = await supabase
      .from("inventory_levels")
      .select("id, product_id, warehouse_id, on_hand_quantity, reserved_quantity")
      .eq("tenant_id", tenant.id)
      .in("product_id", productIds);
    const rowsByProduct = new Map<string, Array<{ id: string; available: number; reserved: number }>>();
    for (const row of inventoryRows || []) {
      const available = Number(row.on_hand_quantity || 0) - Number(row.reserved_quantity || 0);
      const current = rowsByProduct.get(row.product_id as string) || [];
      current.push({
        id: row.id as string,
        available,
        reserved: Number(row.reserved_quantity || 0),
      });
      rowsByProduct.set(row.product_id as string, current);
    }
    for (const item of payload.items) {
      const rows = rowsByProduct.get(item.productId) || [];
      if (rows.length === 0) continue;
      const availableTotal = rows.reduce((sum, row) => sum + Math.max(0, row.available), 0);
      if (availableTotal < item.quantity) {
        return NextResponse.json({ error: `Otillräckligt lagersaldo för ${item.title}.` }, { status: 400 });
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        tenant_id: tenant.id,
        customer_email: payload.email,
        customer_name: payload.name || null,
        payment_provider: selectedPaymentMethod,
        status: "pending",
        total_minor: orderTotalMinor,
        currency: payload.items[0].currency || tenant.default_currency,
        shipping_method_id: selectedShippingMethod?.id || null,
        shipping_method_name: selectedShippingMethod?.name || null,
        shipping_carrier: shippingCarrierName,
        shipping_service: (selectedShippingMethod?.service_code as string) || null,
        shipping_price_minor: shippingMinor,
        fulfillment_status: "allocated",
        estimated_dispatch_date: dispatchDate ? dispatchDate.toISOString().slice(0, 10) : null,
        estimated_delivery_start: deliveryStart ? deliveryStart.toISOString().slice(0, 10) : null,
        estimated_delivery_end: deliveryEnd ? deliveryEnd.toISOString().slice(0, 10) : null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Kunde inte skapa order." }, { status: 500 });
    }

    const orderItems = payload.items.map((item) => ({
      tenant_id: tenant.id,
      order_id: order.id,
      product_id: item.productId,
      product_title: item.title,
      quantity: item.quantity,
      unit_price_minor: item.priceMinor,
      line_total_minor: item.priceMinor * item.quantity,
    }));

    const { error: itemError } = await supabase.from("order_items").insert(orderItems);
    if (itemError) {
      return NextResponse.json({ error: "Kunde inte spara orderrader." }, { status: 500 });
    }

    for (const item of payload.items) {
      const rows = [...(rowsByProduct.get(item.productId) || [])].sort((a, b) => b.available - a.available);
      if (rows.length === 0) continue;
      let remaining = item.quantity;
      for (const row of rows) {
        if (remaining <= 0) break;
        const allocate = Math.min(remaining, Math.max(0, row.available));
        if (allocate <= 0) continue;
        row.available -= allocate;
        row.reserved += allocate;
        await supabase
          .from("inventory_levels")
          .update({ reserved_quantity: row.reserved })
          .eq("id", row.id);
        remaining -= allocate;
      }
    }

    const protocol = host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const successUrl = `${protocol}://${host}/order-confirmation?order_id=${order.id}`;
    const cancelUrl = `${protocol}://${host}/checkout?status=cancelled`;

    if (selectedPaymentMethod !== "stripe") {
      await supabase
        .from("orders")
        .update({
          payment_intent_id: `${selectedPaymentMethod}_${order.id}`,
        })
        .eq("id", order.id);

      return NextResponse.json({
        url: `${protocol}://${host}/order-confirmation?order_id=${order.id}`,
      });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe är inte konfigurerat på servern." }, { status: 500 });
    }

    let stripeCustomerId: string | null = null;
    const normalizedEmail = payload.email.trim().toLowerCase();
    const { data: paymentProfile } = await supabase
      .from("customer_payment_profiles")
      .select("stripe_customer_id")
      .eq("tenant_id", tenant.id)
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (paymentProfile?.stripe_customer_id) {
      stripeCustomerId = paymentProfile.stripe_customer_id as string;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: payload.email }),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenant_id: tenant.id,
        order_id: order.id,
      },
      line_items: [
        ...payload.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: item.currency.toLowerCase(),
            unit_amount: item.priceMinor,
            product_data: {
              name: item.title,
            },
          },
        })),
        ...(shippingMinor > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: (payload.items[0].currency || "SEK").toLowerCase(),
                  unit_amount: shippingMinor,
                  product_data: {
                    name: selectedShippingMethod?.name
                      ? `Frakt: ${selectedShippingMethod.name}`
                      : "Frakt",
                  },
                },
              },
            ]
          : []),
      ],
    });

    await supabase
      .from("orders")
      .update({ checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Checkout kunde inte initieras.",
      },
      { status: 500 },
    );
  }
}
