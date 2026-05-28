import Stripe from "stripe";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function getStripeClient() {
  const stripeSecret = env.stripeSecretKey();
  if (!stripeSecret) return null;
  return new Stripe(stripeSecret, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export async function ensureStripeCustomerProfile(params: {
  tenantId: string;
  userId: string;
  email: string;
  name?: string | null;
}) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("customer_payment_profiles")
    .select("stripe_customer_id")
    .eq("tenant_id", params.tenantId)
    .eq("user_id", params.userId)
    .maybeSingle();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id as string;
  }

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name || undefined,
    metadata: {
      tenant_id: params.tenantId,
      user_id: params.userId,
    },
  });

  await supabase.from("customer_payment_profiles").upsert(
    {
      tenant_id: params.tenantId,
      user_id: params.userId,
      email: params.email,
      stripe_customer_id: customer.id,
    },
    { onConflict: "tenant_id,user_id" },
  );

  return customer.id;
}
