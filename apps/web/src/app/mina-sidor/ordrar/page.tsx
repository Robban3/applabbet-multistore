import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMinorPrice } from "@/lib/format";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type OrderTab = "alla" | "pagaende" | "levererade" | "returnerade";

type MinaOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function createOrdersQuery(basePath: string, activeTab: OrderTab, q: string) {
  const params = new URLSearchParams();
  if (activeTab !== "alla") params.set("tab", activeTab);
  if (q.trim()) params.set("q", q.trim());
  return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
}

type OrderRow = {
  id: string;
  date: string;
  title: string;
  quantity: number;
  price: string;
  status: string;
  note: string;
  action: string;
  tab: Exclude<OrderTab, "alla">;
};

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function mapOrderToRow(order: {
  id: string;
  status: string;
  fulfillment_status: string | null;
  created_at: string;
  total_minor: number;
  currency: string;
  estimated_delivery_end: string | null;
}, item: { product_title: string; quantity: number } | undefined): OrderRow {
  const delivered = order.fulfillment_status === "delivered";
  const refunded = order.status === "refunded";
  const shippedLike =
    order.fulfillment_status === "allocated" ||
    order.fulfillment_status === "packed" ||
    order.fulfillment_status === "shipped";

  const status = refunded ? "Returnerad" : delivered ? "Levererad" : shippedLike || order.status === "paid" ? "Skickad" : "Pågående";
  const tab: Exclude<OrderTab, "alla"> = refunded ? "returnerade" : delivered ? "levererade" : "pagaende";
  const note = refunded
    ? "Återbetalning genomförd"
    : delivered
      ? "Leveransen är avslutad"
      : order.estimated_delivery_end
        ? `Beräknad leverans ${formatDate(order.estimated_delivery_end)}`
        : "Beställningen behandlas";

  return {
    id: `#${order.id.slice(0, 8).toUpperCase()}`,
    date: formatDate(order.created_at),
    title: item?.product_title || "Beställning",
    quantity: item?.quantity || 1,
    price: formatMinorPrice(order.total_minor, order.currency),
    status,
    note,
    action: refunded ? "Visa retur" : status === "Skickad" ? "Spåra paket" : "Visa order",
    tab,
  };
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.65 16.65" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function MinaOrdersPage({ searchParams }: MinaOrdersPageProps) {
  const params = await searchParams;
  const tabParam = getParam(params.tab);
  const q = getParam(params.q).trim();
  const activeTab: OrderTab =
    tabParam === "pagaende" || tabParam === "levererade" || tabParam === "returnerade"
      ? tabParam
      : "alla";
  const definition = getCmsPage("mina-sidor-ordrar");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor-ordrar", { blocks: fallbackBlocks });

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!tenant || !user?.email) redirect("/konto/login?next=/mina-sidor/ordrar");

  const { data: ordersData } = await supabase
    .from("orders")
    .select("id, status, fulfillment_status, total_minor, currency, estimated_delivery_end, created_at")
    .eq("tenant_id", tenant.id)
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false })
    .limit(50);

  const orderIds = (ordersData || []).map((order) => order.id);
  const { data: itemsData } = orderIds.length
    ? await supabase
        .from("order_items")
        .select("order_id, product_title, quantity")
        .in("order_id", orderIds)
    : { data: [] as Array<{ order_id: string; product_title: string; quantity: number }> };

  const firstItemByOrder = new Map<string, { product_title: string; quantity: number }>();
  for (const item of itemsData || []) {
    if (!firstItemByOrder.has(item.order_id)) {
      firstItemByOrder.set(item.order_id, { product_title: item.product_title, quantity: item.quantity });
    }
  }

  const orderRows = (ordersData || []).map((order) =>
    mapOrderToRow(
      {
        id: order.id,
        status: order.status,
        fulfillment_status: order.fulfillment_status,
        created_at: order.created_at,
        total_minor: order.total_minor,
        currency: order.currency,
        estimated_delivery_end: order.estimated_delivery_end,
      },
      firstItemByOrder.get(order.id),
    ),
  );

  const filteredOrders = orderRows.filter((order) => {
    const matchesTab = activeTab === "alla" || activeTab === order.tab;
    const haystack = `${order.id} ${order.title} ${order.date}`.toLowerCase();
    const matchesQuery = !q || haystack.includes(q.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={2} />

          <div className="px-6 py-5">
            <p className="text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700">Hem</Link>
              <span className="mx-1">&gt;</span>
              <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
              <span className="mx-1">&gt;</span>
              <Link href="/mina-sidor/ordrar" className="hover:text-slate-700">
                {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Mina ordrar")}
              </Link>
            </p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">
              {getCmsBlockField(cms.blocks, "hero", "title", "Mina ordrar")}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {getCmsBlockField(cms.blocks, "hero", "subtitle", "Här kan du se alla dina ordrar och följa deras status.")}
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
              <AccountSidebar activeHref="/mina-sidor/ordrar" withIcons />

              <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-lg border border-[#e6ddd1] bg-white p-1 text-sm">
                    <Link
                      href={createOrdersQuery("/mina-sidor/ordrar", "alla", q)}
                      className={`rounded-md px-3 py-1.5 ${activeTab === "alla" ? "bg-[#f7efe1] font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      Alla ordrar
                    </Link>
                    <Link
                      href={createOrdersQuery("/mina-sidor/ordrar", "pagaende", q)}
                      className={`rounded-md px-3 py-1.5 ${activeTab === "pagaende" ? "bg-[#f7efe1] font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      Pågående
                    </Link>
                    <Link
                      href={createOrdersQuery("/mina-sidor/ordrar", "levererade", q)}
                      className={`rounded-md px-3 py-1.5 ${activeTab === "levererade" ? "bg-[#f7efe1] font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      Levererade
                    </Link>
                    <Link
                      href={createOrdersQuery("/mina-sidor/ordrar", "returnerade", q)}
                      className={`rounded-md px-3 py-1.5 ${activeTab === "returnerade" ? "bg-[#f7efe1] font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      Returnerade
                    </Link>
                  </div>

                  <form method="GET" action="/mina-sidor/ordrar" className="flex items-center gap-2">
                    {activeTab !== "alla" ? <input type="hidden" name="tab" value={activeTab} /> : null}
                    <label className="inline-flex items-center gap-2 rounded-md border border-[#e6ddd1] px-3 py-2 text-sm text-slate-500">
                      <SearchIcon />
                      <input
                        name="q"
                        defaultValue={q}
                        placeholder="Sök bland dina ordrar..."
                        className="w-52 outline-none"
                      />
                    </label>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-md border border-[#e6ddd1] px-3 py-2 text-sm font-semibold text-slate-700">
                      Filtrera
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <article key={order.id} className="grid items-center gap-3 rounded-xl border border-[#e6ddd1] bg-white p-3 md:grid-cols-[1fr_110px_1fr_1fr_auto]">
                      <div>
                        <p className="font-semibold text-slate-900">Order {order.id}</p>
                        <p className="text-xs text-slate-500">Lagd {order.date}</p>
                        <button className="mt-2 text-sm font-semibold text-slate-700">Visa detaljer</button>
                      </div>
                      <div className="h-20 rounded bg-gradient-to-br from-[#31271d] via-[#1b1611] to-[#0f0d0b]" />
                      <div>
                        <p className="font-semibold text-slate-900">{order.title}</p>
                        <p className="text-xs text-slate-500">{order.quantity} st</p>
                        <p className="mt-1 font-semibold">{order.price}</p>
                      </div>
                      <div>
                        <p
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                            order.status === "Skickad"
                              ? "bg-[#ebf3ff] text-[#2463be]"
                              : order.status === "Returnerad"
                                ? "bg-[#f4f4f5] text-slate-700"
                                : "bg-[#e6f7ed] text-[#2f7d4f]"
                          }`}
                        >
                          {order.status}
                        </p>
                        <p className="mt-2 text-xs text-slate-600">{order.note}</p>
                      </div>
                      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800">
                        {order.action}
                        <ArrowRightIcon />
                      </button>
                    </article>
                  ))}
                  {filteredOrders.length === 0 ? (
                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {getCmsBlockField(cms.blocks, "orders", "emptyState", "Inga ordrar matchar ditt filter.")}
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
