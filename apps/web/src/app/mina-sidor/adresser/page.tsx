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

type MinaAdresserPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function getAddressContext() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return { tenantId: tenant.id, userId: user.id, userEmail: user.email || "", supabase };
}

function normalizeLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "standardadress") return "standardadress";
  if (normalized === "faktureringsadress") return "faktureringsadress";
  return "ovrig adress";
}

function displayLabel(value: string) {
  const normalized = normalizeLabel(value);
  if (normalized === "standardadress") return "Standardadress";
  if (normalized === "faktureringsadress") return "Faktureringsadress";
  return "Övrig adress";
}

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function MinaAdresserPage({ searchParams }: MinaAdresserPageProps) {
  const params = await searchParams;
  const showAddForm = getParam(params.mode) === "add";

  async function addAddressAction(formData: FormData) {
    "use server";
    const context = await getAddressContext();
    if (!context) return;

    const fullName = String(formData.get("full_name") || "").trim();
    const addressLine1 = String(formData.get("address_line1") || "").trim();
    const addressLine2 = String(formData.get("address_line2") || "").trim();
    const postalCode = String(formData.get("postal_code") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const country = String(formData.get("country") || "Sverige").trim();
    const phoneCountryCode = String(formData.get("phone_country_code") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const isDefaultShipping = formData.get("is_default_shipping") === "on";
    const isDefaultBilling = formData.get("is_default_billing") === "on";
    const selectedLabel = normalizeLabel(String(formData.get("label") || "ovrig adress"));
    const label = isDefaultShipping ? "standardadress" : selectedLabel;

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
      address_line1: addressLine2 ? `${addressLine1}\n${addressLine2}` : addressLine1,
      postal_code: postalCode,
      city,
      country: country || "Sverige",
      phone: phone ? `${phoneCountryCode || "+46"} ${phone}` : null,
      label,
      is_default_shipping: isDefaultShipping,
      is_default_billing: isDefaultBilling,
    });

    revalidatePath("/mina-sidor/adresser");
    redirect("/mina-sidor/adresser");
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
    const isDefaultShipping = formData.get("is_default_shipping") === "on";
    const isDefaultBilling = formData.get("is_default_billing") === "on";
    const selectedLabel = normalizeLabel(String(formData.get("label") || "ovrig adress"));
    const label = isDefaultShipping ? "standardadress" : selectedLabel;

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
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
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
              {showAddForm ? (
                <>
                  <span className="mx-1">&gt;</span>
                  <span className="text-slate-700">Lägg till ny adress</span>
                </>
              ) : null}
            </p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                  {showAddForm ? "Lägg till adress" : getCmsBlockField(cms.blocks, "hero", "title", "Mina adresser")}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {showAddForm
                    ? "Fyll i uppgifterna nedan för att spara din adress."
                    : getCmsBlockField(cms.blocks, "hero", "subtitle", "Här kan du lägga till, redigera och ta bort dina adresser.")}
                </p>
              </div>
              <Link
                href={showAddForm ? "/mina-sidor/adresser" : "/mina-sidor/adresser?mode=add"}
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold ${
                  showAddForm
                    ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                    : "bg-[color:var(--store-accent)] text-slate-900 hover:brightness-105"
                }`}
              >
                {showAddForm ? "Avbryt" : "Lägg till adress"}
              </Link>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
              <AccountSidebar activeHref="/mina-sidor/adresser" withIcons />

              <section className="space-y-3">
                {showAddForm ? (
                  <form action={addAddressAction} className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--store-card-border)" }}>
                    <div className="grid gap-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Namn *</span>
                          <input name="full_name" required placeholder="För- och efternamn" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Adressrad 1 *</span>
                          <input name="address_line1" required placeholder="Gatuadress, t.ex. Kungsgatan 1" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Adressrad 2 (valfritt)</span>
                          <input name="address_line2" placeholder="Lägenhet, våningsplan, portkod etc." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Postnummer *</span>
                          <input name="postal_code" required placeholder="t.ex. 111 22" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ort *</span>
                          <input name="city" required placeholder="t.ex. Stockholm" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Land *</span>
                          <select name="country" defaultValue="Sverige" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                            <option value="Sverige">Sverige</option>
                            <option value="Norge">Norge</option>
                            <option value="Danmark">Danmark</option>
                            <option value="Finland">Finland</option>
                          </select>
                        </label>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">E-postadress</span>
                          <input name="email" type="email" defaultValue={context.userEmail} placeholder="namn@exempel.se" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                        </label>
                        <div className="grid grid-cols-[92px_1fr] gap-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Kod</span>
                            <select name="phone_country_code" defaultValue="+46" className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm">
                              <option value="+46">+46</option>
                              <option value="+47">+47</option>
                              <option value="+45">+45</option>
                              <option value="+358">+358</option>
                            </select>
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Telefonnummer</span>
                            <input name="phone" placeholder="70 123 45 67" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                          </label>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Adressnamn (valfritt)</span>
                          <select name="label" defaultValue="ovrig adress" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                            <option value="standardadress">Standardadress</option>
                            <option value="faktureringsadress">Faktureringsadress</option>
                            <option value="ovrig adress">Övrig adress</option>
                          </select>
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                        <div className="flex flex-col gap-2">
                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" name="is_default_shipping" defaultChecked className="accent-[color:var(--store-accent)]" />
                            Använd som standardadress för leverans
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" name="is_default_billing" className="accent-[color:var(--store-accent)]" />
                            Använd som standardadress för fakturering
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link href="/mina-sidor/adresser" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                            Avbryt
                          </Link>
                          <button type="submit" className="inline-flex items-center rounded-full bg-[color:var(--store-accent)] px-6 py-2.5 text-sm font-semibold text-slate-900 hover:brightness-105">
                            Spara adress
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : null}

                <h2 className="text-3xl font-semibold text-slate-900">
                  {getCmsBlockField(cms.blocks, "addresses", "sectionTitle", "Dina sparade adresser")}
                </h2>
                {addresses.map((address) => (
                  <article key={address.id} className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-card-border)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="inline-flex rounded bg-[#eef8f1] px-2 py-0.5 text-xs font-semibold text-[#2f7d4f]">
                          {displayLabel(address.label)}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">{address.full_name}</p>
                        <p className="whitespace-pre-line text-sm text-slate-700">{address.address_line1}</p>
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
