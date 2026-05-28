import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CarrierIntegration, ShippingMethod, Warehouse } from "@/types/commerce";

export default async function AdminLogisticsPage() {
  const access = await requireAdminAccess("/admin/logistics");

  if (access.status === "tenant_missing") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Ingen tenant hittades for host. Kontrollera tenant_domains.
      </p>
    );
  }

  if (access.status === "forbidden") {
    return (
      <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Ditt konto har inte åtkomst till den här adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: warehousesData }, { data: carriersData }, { data: methodsData }] =
    await Promise.all([
      supabase
        .from("warehouses")
        .select("id, tenant_id, name, code, address_line1, postal_code, city, country, is_default")
        .eq("tenant_id", access.tenant.id)
        .order("name", { ascending: true }),
      supabase
        .from("carrier_integrations")
        .select("id, tenant_id, carrier_code, display_name, tracking_base_url, is_active")
        .eq("tenant_id", access.tenant.id)
        .order("display_name", { ascending: true }),
      supabase
        .from("shipping_methods")
        .select("id, tenant_id, warehouse_id, carrier_integration_id, name, service_code, handling_days, transit_days_min, transit_days_max, cutoff_time, delivery_weekdays, base_price_minor, free_shipping_over_minor, sort_order, is_active")
        .eq("tenant_id", access.tenant.id)
        .order("sort_order", { ascending: true }),
    ]);

  const warehouses = (warehousesData || []) as Warehouse[];
  const carriers = (carriersData || []) as CarrierIntegration[];
  const shippingMethods = (methodsData || []) as ShippingMethod[];

  async function createWarehouseAction(formData: FormData) {
    "use server";
    const accessAction = await requireAdminAccess("/admin/logistics");
    if (accessAction.status !== "allowed") return;

    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("code") || "").trim().toUpperCase();
    if (!name || !code) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("warehouses").insert({
      tenant_id: accessAction.tenant.id,
      name,
      code,
      address_line1: String(formData.get("address_line1") || "").trim() || null,
      postal_code: String(formData.get("postal_code") || "").trim() || null,
      city: String(formData.get("city") || "").trim() || null,
      country: String(formData.get("country") || "").trim() || "Sverige",
      is_default: formData.get("is_default") === "on",
    });

    revalidatePath("/admin/logistics");
  }

  async function createCarrierAction(formData: FormData) {
    "use server";
    const accessAction = await requireAdminAccess("/admin/logistics");
    if (accessAction.status !== "allowed") return;

    const carrierCode = String(formData.get("carrier_code") || "").trim().toLowerCase();
    const displayName = String(formData.get("display_name") || "").trim();
    if (!carrierCode || !displayName) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("carrier_integrations").insert({
      tenant_id: accessAction.tenant.id,
      carrier_code: carrierCode,
      display_name: displayName,
      tracking_base_url: String(formData.get("tracking_base_url") || "").trim() || null,
      api_key: String(formData.get("api_key") || "").trim() || null,
      api_secret: String(formData.get("api_secret") || "").trim() || null,
      webhook_secret: String(formData.get("webhook_secret") || "").trim() || null,
      is_active: formData.get("is_active") === "on",
    });

    revalidatePath("/admin/logistics");
  }

  async function createShippingMethodAction(formData: FormData) {
    "use server";
    const accessAction = await requireAdminAccess("/admin/logistics");
    if (accessAction.status !== "allowed") return;

    const name = String(formData.get("name") || "").trim();
    if (!name) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("shipping_methods").insert({
      tenant_id: accessAction.tenant.id,
      warehouse_id: String(formData.get("warehouse_id") || "").trim() || null,
      carrier_integration_id: String(formData.get("carrier_integration_id") || "").trim() || null,
      name,
      service_code: String(formData.get("service_code") || "").trim() || null,
      handling_days: Number(formData.get("handling_days") || 1),
      transit_days_min: Number(formData.get("transit_days_min") || 1),
      transit_days_max: Number(formData.get("transit_days_max") || 3),
      cutoff_time: String(formData.get("cutoff_time") || "14:00"),
      delivery_weekdays: String(formData.get("delivery_weekdays") || "1,2,3,4,5"),
      base_price_minor: Number(formData.get("base_price_minor") || 0),
      free_shipping_over_minor: Number(formData.get("free_shipping_over_minor") || 0),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    });

    revalidatePath("/admin/logistics");
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Logistik & lager · {access.tenant.name}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Hantera leveransdagar, fraktkedjor och lagerställen.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Lagerställen</h3>
        <p className="mt-1 text-sm text-slate-600">
          Fyll i var lagret finns och markera vilket lager som ska vara standard vid lagerkoppling.
        </p>
        <form action={createWarehouseAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lagernamn</span>
            <input name="name" placeholder="t.ex. Centrallager" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lagerkod</span>
            <input name="code" placeholder="t.ex. STO-01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Adress</span>
            <input name="address_line1" placeholder="Gatuadress" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Postnummer</span>
            <input name="postal_code" placeholder="t.ex. 11122" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stad</span>
            <input name="city" placeholder="t.ex. Stockholm" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Land</span>
            <input name="country" defaultValue="Sverige" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_default" />
            Standardlager
          </label>
          <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Lägg till lager
          </button>
        </form>
        <div className="mt-3 text-sm text-slate-700">
          {warehouses.length === 0 ? "Inga lagerställen ännu." : warehouses.map((w) => `${w.name} (${w.code})`).join(" · ")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Fraktkedjor / carriers</h3>
        <p className="mt-1 text-sm text-slate-600">
          Koppla fraktleverantörer och eventuella API-uppgifter. Lämna nyckelfält tomma om du inte använder integration ännu.
        </p>
        <form action={createCarrierAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Carrier-kod</span>
            <input name="carrier_code" placeholder="postnord, dhl..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Visningsnamn</span>
            <input name="display_name" placeholder="t.ex. PostNord" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tracking URL (bas)</span>
            <input name="tracking_base_url" placeholder="https://..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">API key (valfri)</span>
            <input name="api_key" placeholder="API key" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">API secret (valfri)</span>
            <input name="api_secret" placeholder="API secret" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Webhook secret (valfri)</span>
            <input name="webhook_secret" placeholder="Webhook secret" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Aktiv integration
          </label>
          <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Lägg till fraktkedja
          </button>
        </form>
        <div className="mt-3 text-sm text-slate-700">
          {carriers.length === 0 ? "Inga fraktkedjor ännu." : carriers.map((c) => `${c.display_name} (${c.carrier_code})`).join(" · ")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Leveransdagar & fraktmetoder</h3>
        <p className="mt-1 text-sm text-slate-600">
          Skapa tydliga fraktregler genom att fylla i metod, leveranstider, pris och aktivering i sektionerna nedan.
        </p>
        <form action={createShippingMethodAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">1. Grundinformation</h4>
            <p className="mt-1 text-xs text-slate-500">Vad metoden heter och vilken lager/fraktkedja som ska användas.</p>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Metodnamn</span>
            <input name="name" placeholder="t.ex. Hemleverans" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Servicekod</span>
            <input name="service_code" placeholder="t.ex. HOME_STANDARD" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lager</span>
            <select name="warehouse_id" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Välj lager</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fraktkedja</span>
            <select name="carrier_integration_id" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Välj fraktkedja</option>
              {carriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-3 mt-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">2. Leveranstider</h4>
            <p className="mt-1 text-xs text-slate-500">
              Ange plock/pack-dagar, leveransintervall och cutoff-tid för order samma dag.
            </p>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Plock/pack-dagar</span>
            <input name="handling_days" type="number" defaultValue={1} min={0} placeholder="t.ex. 1" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Leverans min (dagar)</span>
            <input name="transit_days_min" type="number" defaultValue={1} min={0} placeholder="t.ex. 1" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Leverans max (dagar)</span>
            <input name="transit_days_max" type="number" defaultValue={3} min={0} placeholder="t.ex. 3" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cutoff-tid</span>
            <input name="cutoff_time" defaultValue="14:00" placeholder="HH:MM" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Leveransdagar</span>
            <input name="delivery_weekdays" defaultValue="1,2,3,4,5" placeholder="1-7, kommaseparerat" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <div className="md:col-span-3 mt-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">3. Prisregler</h4>
            <p className="mt-1 text-xs text-slate-500">
              Fyll i pris i minor-enheter (öre). Exempel: 4900 = 49 kr.
            </p>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fraktpris (minor/öre)</span>
            <input name="base_price_minor" type="number" defaultValue={0} min={0} placeholder="t.ex. 4900" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fri frakt över (minor/öre)</span>
            <input name="free_shipping_over_minor" type="number" defaultValue={0} min={0} placeholder="t.ex. 49900" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sorteringsordning</span>
            <input name="sort_order" type="number" defaultValue={0} placeholder="t.ex. 1" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <div className="md:col-span-3 mt-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">4. Aktivering</h4>
            <p className="mt-1 text-xs text-slate-500">
              Markera metoden som aktiv när den ska kunna användas i checkout.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Aktiv fraktmetod
          </label>
          <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Lägg till fraktmetod
          </button>
        </form>
        <div className="mt-3 text-sm text-slate-700">
          {shippingMethods.length === 0
            ? "Inga fraktmetoder ännu."
            : shippingMethods.map((m) => `${m.name} (${m.transit_days_min}-${m.transit_days_max} dagar)`).join(" · ")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Produktlager</h3>
        <p className="mt-1 text-sm text-slate-600">
          Produktlager hanteras i en egen flik för bättre överblick vid stora sortiment.
        </p>
        <Link
          href="/admin/inventory"
          className="mt-3 inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Öppna produktlager
        </Link>
      </section>
    </div>
  );
}
