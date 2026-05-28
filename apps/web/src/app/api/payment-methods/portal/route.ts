import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureStripeCustomerProfile, getStripeClient } from "@/lib/payments";
import { normalizeHost, resolveTenantByHost } from "@/lib/tenant";

export async function GET(request: Request) {
  const host = normalizeHost(request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost");
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    return NextResponse.redirect(new URL("/mina-sidor/betalningsmetoder?error=tenant", request.url));
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.redirect(new URL("/mina-sidor/betalningsmetoder?error=stripe", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/mina-sidor/betalningsmetoder?error=auth", request.url));
  }

  const customerId = await ensureStripeCustomerProfile({
    tenantId: tenant.id,
    userId: user.id,
    email: user.email,
    name: (user.user_metadata?.full_name as string | undefined) || null,
  });
  if (!customerId) {
    return NextResponse.redirect(new URL("/mina-sidor/betalningsmetoder?error=stripe", request.url));
  }

  const protocol = host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const returnUrl = `${protocol}://${host}/mina-sidor/betalningsmetoder`;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return NextResponse.redirect(session.url);
}
