import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CarrierIntegration, InventoryLevel, Product, ShippingMethod, Warehouse } from "@/types/commerce";

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
        Ditt konto har inte access till den har adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: warehousesData }, { data: carriersData }, { data: methodsData }, { data: productsData }, { data: inventoryData }] =
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
      supabase
        .from("products")
        .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status")
        .eq("tenant_id", access.tenant.id)
        .order("title", { ascending: true }),
      supabase
        .from("inventory_levels")
        .select("id, tenant_id, product_id, warehouse_id, on_hand_quantity, reserved_quantity, reorder_point")
        .eq("tenant_id", access.tenant.id),
    ]);

  const warehouses = (warehousesData || []) as Warehouse[];
  const carriers = (carriersData || []) as CarrierIntegration[];
  const shippingMethods = (methodsData || []) as ShippingMethod[];
  const products = (productsData || []) as Product[];
  const inventoryLevels = (inventoryData || []) as InventoryLevel[];
  const inventoryByKey = new Map(inventoryLevels.map((row) => [`${row.product_id}:${row.warehouse_id}`, row]));

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

  async function upsertInventoryAction(formData: FormData) {
    "use server";
    const accessAction = await requireAdminAccess("/admin/logistics");
    if (accessAction.status !== "allowed") return;

    const productId = String(formData.get("product_id") || "").trim();
    const warehouseId = String(formData.get("warehouse_id") || "").trim();
    if (!productId || !warehouseId) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("inventory_levels").upsert(
      {
        tenant_id: accessAction.tenant.id,
        product_id: productId,
        warehouse_id: warehouseId,
        on_hand_quantity: Number(formData.get("on_hand_quantity") || 0),
        reserved_quantity: Number(formData.get("reserved_quantity") || 0),
        reorder_point: Number(formData.get("reorder_point") || 0),
      },
      { onConflict: "tenant_id,product_id,warehouse_id" },
    );

    revalidatePath("/admin/logistics");
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Logistik & lager · {access.tenant.name}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Hantera leveransdagar, fraktkedjor, lagerställen och lagernivåer per produkt.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Lagerställen</h3>
        <form action={createWarehouseAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Namn (t.ex. Centrallager)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="code" placeholder="Kod (t.ex. STO-01)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="address_line1" placeholder="Adress" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="postal_code" placeholder="Postnummer" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="city" placeholder="Stad" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="country" defaultValue="Sverige" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
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
        <form action={createCarrierAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <input name="carrier_code" placeholder="carrier_code (postnord, dhl...)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="display_name" placeholder="Visningsnamn" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="tracking_base_url" placeholder="Tracking URL bas" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="api_key" placeholder="API key (valfri)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="api_secret" placeholder="API secret (valfri)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="webhook_secret" placeholder="Webhook secret (valfri)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
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
        <form action={createShippingMethodAction} className="mt-3 grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Metodnamn (Hemleverans)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="service_code" placeholder="Servicekod" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <select name="warehouse_id" className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Välj lager</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select name="carrier_integration_id" className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Välj fraktkedja</option>
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name}
              </option>
            ))}
          </select>
          <input name="handling_days" type="number" defaultValue={1} min={0} placeholder="Plock/pack dagar" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="transit_days_min" type="number" defaultValue={1} min={0} placeholder="Leverans min dagar" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="transit_days_max" type="number" defaultValue={3} min={0} placeholder="Leverans max dagar" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="cutoff_time" defaultValue="14:00" placeholder="Cutoff tid HH:MM" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="delivery_weekdays" defaultValue="1,2,3,4,5" placeholder="Leveransdagar (1-7, kommaseparerat)" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="base_price_minor" type="number" defaultValue={0} min={0} placeholder="Fraktpris minor" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="free_shipping_over_minor" type="number" defaultValue={0} min={0} placeholder="Fri frakt över minor" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <input name="sort_order" type="number" defaultValue={0} placeholder="Sortering" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
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
        <h3 className="text-base font-semibold text-slate-900">Lagerhållning per produkt</h3>
        {warehouses.length === 0 ? (
          <p className="mt-2 text-sm text-amber-700">Skapa minst ett lagerställe först.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {products.map((product) => {
              const defaultWarehouse = warehouses[0];
              const key = `${product.id}:${defaultWarehouse.id}`;
              const current = inventoryByKey.get(key);
              return (
                <form key={product.id} action={upsertInventoryAction} className="grid items-center gap-2 rounded-md border border-slate-200 p-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
                  <input type="hidden" name="product_id" value={product.id} />
                  <p className="text-sm font-medium text-slate-800">{product.title}</p>
                  <select name="warehouse_id" defaultValue={defaultWarehouse.id} className="rounded-md border border-slate-300 px-2 py-1.5 text-sm">
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <input name="on_hand_quantity" type="number" min={0} defaultValue={current?.on_hand_quantity ?? 0} placeholder="I lager" className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
                  <input name="reserved_quantity" type="number" min={0} defaultValue={current?.reserved_quantity ?? 0} placeholder="Reserverat" className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
                  <input name="reorder_point" type="number" min={0} defaultValue={current?.reorder_point ?? 0} placeholder="Beställningspunkt" className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
                  <button type="submit" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    Spara
                  </button>
                </form>
              );
            })}
            {products.length === 0 ? <p className="text-sm text-slate-500">Inga produkter hittades.</p> : null}
          </div>
        )}
      </section>
    </div>
  );
}
