import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventoryLevel, Product, Warehouse } from "@/types/commerce";

type AdminInventoryPageProps = {
  searchParams: Promise<{
    q?: string;
    warehouse?: string;
  }>;
};

export default async function AdminInventoryPage({ searchParams }: AdminInventoryPageProps) {
  const access = await requireAdminAccess("/admin/inventory");
  const { q = "", warehouse = "" } = await searchParams;

  if (access.status === "tenant_missing") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Ingen tenant hittades för host. Kontrollera tenant_domains.
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
  const [{ data: warehousesData }, { data: productsData }, { data: inventoryData }] = await Promise.all([
    supabase
      .from("warehouses")
      .select("id, tenant_id, name, code, address_line1, postal_code, city, country, is_default")
      .eq("tenant_id", access.tenant.id)
      .order("is_default", { ascending: false })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("id, tenant_id, category_id, brand, is_new, product_features, product_colors, slug, title, description, image_url, price_minor, currency, status")
      .eq("tenant_id", access.tenant.id)
      .order("title", { ascending: true }),
    supabase
      .from("inventory_levels")
      .select("id, tenant_id, product_id, warehouse_id, on_hand_quantity, reserved_quantity, reorder_point")
      .eq("tenant_id", access.tenant.id),
  ]);

  const warehouses = (warehousesData || []) as Warehouse[];
  const products = (productsData || []) as Product[];
  const inventoryLevels = (inventoryData || []) as InventoryLevel[];

  const selectedWarehouse = warehouses.find((w) => w.id === warehouse) || warehouses[0] || null;
  const inventoryByKey = new Map(
    inventoryLevels.map((row) => [`${row.product_id}:${row.warehouse_id}`, row]),
  );

  const search = q.trim().toLowerCase();
  const visibleProducts = search
    ? products.filter((product) =>
        `${product.title} ${product.slug}`.toLowerCase().includes(search),
      )
    : products;

  async function saveInventoryAction(formData: FormData) {
    "use server";

    const actionAccess = await requireAdminAccess("/admin/inventory");
    if (actionAccess.status !== "allowed") return;

    const productId = String(formData.get("product_id") || "").trim();
    const warehouseId = String(formData.get("warehouse_id") || "").trim();
    if (!productId || !warehouseId) return;

    const onHand = Math.max(0, Number(formData.get("on_hand_quantity") || 0));
    const reserved = Math.max(0, Number(formData.get("reserved_quantity") || 0));
    const reorderPoint = Math.max(0, Number(formData.get("reorder_point") || 0));

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("inventory_levels").upsert(
      {
        tenant_id: actionAccess.tenant.id,
        product_id: productId,
        warehouse_id: warehouseId,
        on_hand_quantity: onHand,
        reserved_quantity: reserved,
        reorder_point: reorderPoint,
      },
      { onConflict: "tenant_id,product_id,warehouse_id" },
    );

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Produktlager</h2>
          <p className="mt-1 text-sm text-slate-600">
            Hantera lagersaldo per produkt i en separat vy för stora sortiment.
          </p>
        </div>
        <Link
          href="/admin/logistics"
          className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Till lagerställen & frakt
        </Link>
      </div>

      {warehouses.length === 0 ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Skapa minst ett lagerställe under Logistik & lager först.
        </p>
      ) : (
        <>
          <form className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_260px_auto]">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sök produkt</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Sök produktnamn eller slug..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lagerställe</span>
              <select
                name="warehouse"
                defaultValue={selectedWarehouse?.id || ""}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Filtrera
            </button>
          </form>

          <div className="space-y-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">I lager:</span> totalt antal enheter som finns fysiskt på lager.
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Reserverat:</span> antal enheter redan låsta för ordrar men ännu inte skickade.
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Beställningspunkt:</span> nivå där ni bör fylla på lagret.
              </p>
            </div>
            {visibleProducts.map((product) => {
              const row = selectedWarehouse
                ? inventoryByKey.get(`${product.id}:${selectedWarehouse.id}`)
                : null;
              return (
                <form
                  key={product.id}
                  action={saveInventoryAction}
                  className="grid items-end gap-2 rounded-md border border-slate-200 p-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]"
                >
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="warehouse_id" value={selectedWarehouse?.id || ""} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.title}</p>
                    <p className="text-xs text-slate-500">{product.slug}</p>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">I lager</span>
                    <input
                      name="on_hand_quantity"
                      type="number"
                      min={0}
                      defaultValue={row?.on_hand_quantity ?? 0}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Reserverat</span>
                    <input
                      name="reserved_quantity"
                      type="number"
                      min={0}
                      defaultValue={row?.reserved_quantity ?? 0}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Beställningspunkt</span>
                    <input
                      name="reorder_point"
                      type="number"
                      min={0}
                      defaultValue={row?.reorder_point ?? 0}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Spara
                  </button>
                </form>
              );
            })}
            {visibleProducts.length === 0 ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Inga produkter matchar filtret.
              </p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

