import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { CustomerAddress } from "@/types/commerce";

async function getAddressContext() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return { tenantId: tenant.id, userId: user.id, supabase };
}

function normalizeLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "standardadress") return "standardadress";
  if (normalized === "faktureringsadress") return "faktureringsadress";
  return "ovrig adress";
}

export default async function MinaAdresserPage() {
  async function addAddressAction(formData: FormData) {
    "use server";
    const context = await getAddressContext();
    if (!context) return;

    const fullName = String(formData.get("full_name") || "").trim();
    const addressLine1 = String(formData.get("address_line1") || "").trim();
    const postalCode = String(formData.get("postal_code") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const country = String(formData.get("country") || "Sverige").trim();
    const phone = String(formData.get("phone") || "").trim();
    const label = normalizeLabel(String(formData.get("label") || "ovrig adress"));
    const isDefaultShipping = formData.get("is_default_shipping") === "on";
    const isDefaultBilling = formData.get("is_default_billing") === "on";

    if (!fullName || !addressLine1 || !postalCode || !city) return;

    if (isDefaultShipping) {
      await context.supabase
        .from("customer_addresses")
        .update({ is_default_shipping: false })
        .eq("tenant_id", context.tenantId)
        .eq("user_id", context.userId);
    }
    if (isDefaultBilling) {
      await context.supabase
        .from("customer_addresses")
        .update({ is_default_billing: false })
        .eq("tenant_id", context.tenantId)
        .eq("user_id", context.userId);
    }

    await context.supabase.from("customer_addresses").insert({
      tenant_id: context.tenantId,
      user_id: context.userId,
      full_name: fullName,
      address_line1: addressLine1,
      postal_code: postalCode,
      city,
      country: country || "Sverige",
      phone: phone || null,
      label,
      is_default_shipping: isDefaultShipping,
      is_default_billing: isDefaultBilling,
    });

    revalidatePath("/mina-sidor/adresser");
  }

  async function updateAddressAction(formData: FormData) {
    "use server";
    const context = await getAddressContext();
    if (!context) return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    const fullName = String(formData.get("full_name") || "").trim();
    const addressLine1 = String(formData.get("address_line1") || "").trim();
    const postalCode = String(formData.get("postal_code") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const country = String(formData.get("country") || "Sverige").trim();
    const phone = String(formData.get("phone") || "").trim();
    const label = normalizeLabel(String(formData.get("label") || "ovrig adress"));
    const isDefaultShipping = formData.get("is_default_shipping") === "on";
    const isDefaultBilling = formData.get("is_default_billing") === "on";

    if (!fullName || !addressLine1 || !postalCode || !city) return;

    if (isDefaultShipping) {
      await context.supabase
        .from("customer_addresses")
        .update({ is_default_shipping: false })
        .eq("tenant_id", context.tenantId)
        .eq("user_id", context.userId);
    }
    if (isDefaultBilling) {
      await context.supabase
        .from("customer_addresses")
        .update({ is_default_billing: false })
        .eq("tenant_id", context.tenantId)
        .eq("user_id", context.userId);
    }

    await context.supabase
      .from("customer_addresses")
      .update({
        full_name: fullName,
        address_line1: addressLine1,
        postal_code: postalCode,
        city,
        country: country || "Sverige",
        phone: phone || null,
        label,
        is_default_shipping: isDefaultShipping,
        is_default_billing: isDefaultBilling,
      })
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.userId)
      .eq("id", id);

    revalidatePath("/mina-sidor/adresser");
  }

  async function deleteAddressAction(formData: FormData) {
    "use server";
    const context = await getAddressContext();
    if (!context) return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    await context.supabase
      .from("customer_addresses")
      .delete()
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.userId)
      .eq("id", id);

    revalidatePath("/mina-sidor/adresser");
  }

  async function setDefaultShippingAction(formData: FormData) {
    "use server";
    const context = await getAddressContext();
    if (!context) return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    await context.supabase
      .from("customer_addresses")
      .update({ is_default_shipping: false })
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.userId);

    await context.supabase
      .from("customer_addresses")
      .update({ is_default_shipping: true })
      .eq("tenant_id", context.tenantId)
      .eq("user_id", context.userId)
      .eq("id", id);

    revalidatePath("/mina-sidor/adresser");
  }

  const context = await getAddressContext();
  if (!context) redirect("/konto/login?next=/mina-sidor/adresser");

  const definition = getCmsPage("mina-sidor-adresser");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor-adresser", { blocks: fallbackBlocks });

  const { data } = await context.supabase
    .from("customer_addresses")
    .select("id, tenant_id, user_id, label, full_name, address_line1, postal_code, city, country, phone, is_default_shipping, is_default_billing")
    .eq("tenant_id", context.tenantId)
    .eq("user_id", context.userId)
    .order("created_at", { ascending: false });

  const addresses = (data || []) as CustomerAddress[];

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />
          <div className="px-6 py-5">
          <p className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700">Hem</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor/adresser" className="hover:text-slate-700">
              {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Mina adresser")}
            </Link>
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "hero", "title", "Mina adresser")}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "subtitle",
                  "Här kan du lägga till, redigera och ta bort dina adresser.",
                )}
              </p>
            </div>
            <details className="group rounded-md border border-slate-900 bg-slate-900 text-white">
              <summary className="cursor-pointer list-none px-4 py-2 text-sm font-semibold">+ Lägg till ny adress</summary>
              <form action={addAddressAction} className="grid w-[340px] gap-2 border-t border-white/15 bg-white p-3 text-slate-900">
                <input name="full_name" required placeholder="Namn" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <input name="address_line1" required placeholder="Adress" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input name="postal_code" required placeholder="Postnummer" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                  <input name="city" required placeholder="Stad" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="country" defaultValue="Sverige" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                  <input name="phone" placeholder="Telefon" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <select name="label" defaultValue="ovrig adress" className="rounded border border-slate-300 px-3 py-2 text-sm">
                  <option value="standardadress">Standardadress</option>
                  <option value="faktureringsadress">Faktureringsadress</option>
                  <option value="ovrig adress">Övrig adress</option>
                </select>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_default_shipping" /> Standard för leverans</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_default_billing" /> Standard för fakturering</label>
                <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Spara adress</button>
              </form>
            </details>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
            <AccountSidebar activeHref="/mina-sidor/adresser" />

            <section className="space-y-3">
              <h2 className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "addresses", "sectionTitle", "Dina sparade adresser")}
              </h2>
              {addresses.map((address) => (
                <article key={address.id} className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex rounded bg-[#eef8f1] px-2 py-0.5 text-xs font-semibold text-[#2f7d4f]">{address.label}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{address.full_name}</p>
                      <p className="text-sm text-slate-700">{address.address_line1}</p>
                      <p className="text-sm text-slate-700">{address.postal_code} {address.city}</p>
                      <p className="text-sm text-slate-700">{address.country}</p>
                      <p className="mt-2 text-sm text-slate-700">{address.phone || "-"}</p>
                    </div>
                    <div className="space-y-2">
                      {address.is_default_shipping ? <p className="text-sm font-semibold text-[#2f7d4f]">Används för leverans</p> : null}
                      {address.is_default_billing ? <p className="text-sm font-semibold text-[#2463be]">Används för fakturering</p> : null}
                      {!address.is_default_shipping ? (
                        <form action={setDefaultShippingAction}>
                          <input type="hidden" name="id" value={address.id} />
                          <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800">Använd som leveransadress</button>
                        </form>
                      ) : null}
                      <details>
                        <summary className="cursor-pointer text-sm font-semibold text-slate-700">Redigera</summary>
                        <form action={updateAddressAction} className="mt-2 grid gap-2 rounded-md border border-slate-200 p-3">
                          <input type="hidden" name="id" value={address.id} />
                          <input name="full_name" required defaultValue={address.full_name} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                          <input name="address_line1" required defaultValue={address.address_line1} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                          <div className="grid grid-cols-2 gap-2">
                            <input name="postal_code" required defaultValue={address.postal_code} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <input name="city" required defaultValue={address.city} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input name="country" defaultValue={address.country} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <input name="phone" defaultValue={address.phone || ""} className="rounded border border-slate-300 px-3 py-2 text-sm" />
                          </div>
                          <select name="label" defaultValue={address.label} className="rounded border border-slate-300 px-3 py-2 text-sm">
                            <option value="standardadress">Standardadress</option>
                            <option value="faktureringsadress">Faktureringsadress</option>
                            <option value="ovrig adress">Övrig adress</option>
                          </select>
                          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_default_shipping" defaultChecked={address.is_default_shipping} /> Standard för leverans</label>
                          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_default_billing" defaultChecked={address.is_default_billing} /> Standard för fakturering</label>
                          <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Spara ändringar</button>
                        </form>
                      </details>
                      <form action={deleteAddressAction}>
                        <input type="hidden" name="id" value={address.id} />
                        <button className="text-sm font-semibold text-rose-700">Ta bort</button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
              {addresses.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {getCmsBlockField(cms.blocks, "addresses", "emptyState", "Du har inga sparade adresser ännu.")}
                </p>
              ) : null}
            </section>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
