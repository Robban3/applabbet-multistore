import { formatMinorPrice } from "@/lib/format";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order } from "@/types/commerce";

export default async function AdminOrdersPage() {
  const access = await requireAdminAccess("/admin/orders");

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
  const { data } = await supabase
    .from("orders")
    .select("id, tenant_id, customer_email, customer_name, status, payment_provider, total_minor, currency, shipping_method_name, shipping_carrier, shipping_price_minor, fulfillment_status, tracking_number, created_at")
    .eq("tenant_id", access.tenant.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const orders = (data || []) as Order[];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Orders for {access.tenant.name}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-3">Order</th>
              <th className="py-2 pr-3">Kund</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Leverans</th>
              <th className="py-2 pr-3">Summa</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2 pr-3">{order.id.slice(0, 8)}</td>
                <td className="py-2 pr-3">{order.customer_email}</td>
                <td className="py-2 pr-3">
                  <p>{order.status}</p>
                  <p className="text-xs text-slate-500">{order.payment_provider || "-"}</p>
                </td>
                <td className="py-2 pr-3">
                  <p>{order.shipping_method_name || "-"}</p>
                  <p className="text-xs text-slate-500">
                    {order.shipping_carrier || "-"} · {order.fulfillment_status || "-"}
                  </p>
                </td>
                <td className="py-2 pr-3">
                  {formatMinorPrice(order.total_minor, order.currency)}
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-slate-500">
                  Inga orders hittades.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
