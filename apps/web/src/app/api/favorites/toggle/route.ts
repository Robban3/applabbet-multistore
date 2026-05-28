import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeHost, resolveTenantByHost } from "@/lib/tenant";

export async function POST(request: Request) {
  const host = normalizeHost(request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost");
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant hittades inte." }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as { productId?: string };
  const productId = String(payload.productId || "").trim();
  if (!productId) {
    return NextResponse.json({ error: "Saknar productId." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("customer_favorites")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("customer_favorites")
      .delete()
      .eq("tenant_id", tenant.id)
      .eq("user_id", user.id)
      .eq("product_id", productId);
    return NextResponse.json({ favorited: false });
  }

  await supabase.from("customer_favorites").insert({
    tenant_id: tenant.id,
    user_id: user.id,
    product_id: productId,
  });

  return NextResponse.json({ favorited: true });
}
