import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreateReturnRegistrationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

type ReturnStepOrder = {
  id: string;
  orderLabel: string;
  dateLabel: string;
  productsLabel: string;
  totalLabel: string;
  statusLabel: string;
  items: Array<{
    id: string;
    title: string;
    variant: string;
    priceLabel: string;
    quantityLabel: string;
  }>;
};

function formatDateLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatKr(minor: number) {
  return `${Math.round(minor / 100).toLocaleString("sv-SE")} kr`;
}

export default async function SkapaReturRegistreraPage({ searchParams }: CreateReturnRegistrationPageProps) {
  const definition = getCmsPage("returer-aterbetalningar");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("returer-aterbetalningar", { blocks: fallbackBlocks });
  const params = await searchParams;
  const accountView = getParam(params.account) === "1";
  const selectedOrderId = getParam(params.orderId).trim();
  if (!accountView) {
    redirect("/returer-aterbetalningar");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera%3Faccount%3D1");
  }

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);

  const { data: orderRows } =
    tenant && user.email
      ? await supabase
          .from("orders")
          .select("id, created_at, total_minor, status, fulfillment_status")
          .eq("tenant_id", tenant.id)
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false })
          .limit(5)
      : { data: [] };

  const orderIds = (orderRows || []).map((order) => order.id as string);
  const { data: itemRows } =
    tenant && orderIds.length > 0
      ? await supabase
          .from("order_items")
          .select("id, order_id, product_title, quantity, unit_price_minor")
          .eq("tenant_id", tenant.id)
          .in("order_id", orderIds)
      : { data: [] };

  const orderItemsMap = new Map<string, ReturnStepOrder["items"]>();
  for (const item of itemRows || []) {
    const orderId = String(item.order_id || "");
    if (!orderItemsMap.has(orderId)) orderItemsMap.set(orderId, []);
    orderItemsMap.get(orderId)?.push({
      id: String(item.id),
      title: String(item.product_title || "Produkt"),
      variant: "Standard",
      priceLabel: formatKr(Number(item.unit_price_minor || 0)),
      quantityLabel: `Antal: ${Number(item.quantity || 1)}`,
    });
  }

  const orders: ReturnStepOrder[] =
    (orderRows || []).length > 0
      ? (orderRows || []).map((order) => {
          const totalMinor = Number(order.total_minor || 0);
          const itemsForOrder = orderItemsMap.get(String(order.id)) || [];
          return {
            id: String(order.id),
            orderLabel: `Order #${String(order.id).slice(0, 5).toUpperCase()}`,
            dateLabel: formatDateLabel(String(order.created_at || "")),
            productsLabel: `${itemsForOrder.length || 1} produkter`,
            totalLabel: formatKr(totalMinor),
            statusLabel:
              String(order.fulfillment_status || "").toLowerCase() === "delivered"
                ? "Levererad"
                : "Pågående",
            items: itemsForOrder,
          };
        })
      : [
          {
            id: "fallback-1",
            orderLabel: "Order #10245",
            dateLabel: "15 april 2024",
            productsLabel: "3 produkter",
            totalLabel: "1 998 kr",
            statusLabel: "Levererad",
            items: [
              { id: "i1", title: "Premium Hörlurar Pro", variant: "Svart", priceLabel: "1 199 kr", quantityLabel: "Antal: 1" },
              { id: "i2", title: "Chrome Elite Klocka", variant: "Svart / Stål", priceLabel: "599 kr", quantityLabel: "Antal: 1" },
              { id: "i3", title: "Aviator Solglasögon", variant: "Guld / Brun", priceLabel: "199 kr", quantityLabel: "Antal: 1" },
            ],
          },
          {
            id: "fallback-2",
            orderLabel: "Order #10087",
            dateLabel: "3 mars 2024",
            productsLabel: "2 produkter",
            totalLabel: "1 398 kr",
            statusLabel: "Levererad",
            items: [],
          },
        ];
  const highlightedOrderId = selectedOrderId || orders[0]?.id || "";

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />

          <section className="relative overflow-hidden border-b border-[#1d1812] bg-gradient-to-r from-[#0d0b09] via-[#17130f] to-[#231b13] px-6 py-6 text-white">
            <div className="relative z-10 max-w-[560px]">
              <p className="text-xs text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-1">›</span>
                <Link href="/returer-aterbetalningar?account=1" className="hover:text-white">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
                </Link>
                <span className="mx-1">›</span>
                <Link href="/returer-aterbetalningar/skapa-retur?account=1" className="text-[color:var(--store-accent)]">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbCreateReturnLabel", "Skapa din retur")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")} {getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}
              </h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Följ stegen nedan för att returnera din vara.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Det tar bara några minuter.")}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%]">
              <div className="absolute right-14 top-7 h-44 w-72 -rotate-[6deg] rounded-lg border border-white/15 bg-black/45" />
              <div className="absolute right-9 top-20 h-36 w-56 rounded-lg border border-[var(--store-accent)]/40 bg-[#231b13]/60" />
            </div>
          </section>

          <section className="px-6 py-6">
            <div className="grid gap-3 md:grid-cols-5">
              {[
                getCmsBlockField(cms.blocks, "flowNavigation", "step1Label", "Välj order"),
                getCmsBlockField(cms.blocks, "flowNavigation", "step2Label", "Välj produkter"),
                getCmsBlockField(cms.blocks, "flowNavigation", "step3Label", "Ange returmetod"),
                getCmsBlockField(cms.blocks, "flowNavigation", "step4Label", "Returdetaljer"),
                getCmsBlockField(cms.blocks, "flowNavigation", "step5Label", "Bekräfta & skicka"),
              ].map((step, idx) => (
                <article key={step} className="text-center">
                  <span className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${idx === 0 ? "bg-[#0f0d0a] text-white" : "border-2 border-slate-200 bg-white text-slate-400"}`}>
                    {idx + 1}
                  </span>
                  <p className={`mt-2 text-[12px] font-semibold ${idx === 0 ? "text-slate-900" : "text-slate-400"}`}>{step}</p>
                </article>
              ))}
            </div>

            <section className="mt-5 rounded-xl border border-[#ece5d9] bg-[#fcfaf7] p-4">
              <p className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep1", "progressLabel", "Steg 1 av 5")}
              </p>
              <h2 className="mt-1 text-[42px] font-semibold leading-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep1", "title", "Välj order")}
              </h2>
              <p className="text-sm text-slate-600">
                {getCmsBlockField(cms.blocks, "flowStep1", "subtitle", "Välj den order du vill returnera från listan nedan.")}
              </p>

              <p className="mt-5 text-sm font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep1", "ordersTitle", "Dina senaste ordrar")}
              </p>

              <form
                method="GET"
                action="/returer-aterbetalningar/skapa-retur/registrera/steg-2"
                className="mt-2 space-y-3"
              >
                <input type="hidden" name="account" value="1" />
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className={`rounded-xl border bg-white px-4 py-3 ${
                      highlightedOrderId === order.id ? "border-[var(--store-accent)]" : "border-[#e9dfd1]"
                    }`}
                  >
                    <div className="grid items-center gap-3 md:grid-cols-[24px_1fr_auto]">
                      <input
                        type="radio"
                        name="orderId"
                        value={order.id}
                        defaultChecked={highlightedOrderId === order.id}
                        className="h-4 w-4 accent-[var(--store-accent)]"
                        id={`order-${order.id}`}
                      />
                      <label htmlFor={`order-${order.id}`} className="flex cursor-pointer flex-wrap items-center gap-4">
                        <p className="font-semibold text-slate-900">{order.orderLabel}</p>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {order.statusLabel}
                        </span>
                        <p className="text-sm text-slate-600">{order.dateLabel}</p>
                        <p className="text-sm text-slate-600">{order.productsLabel}</p>
                        <p className="font-semibold text-slate-900">{order.totalLabel}</p>
                      </label>
                      <Link
                        href={`/returer-aterbetalningar/skapa-retur/registrera?account=1&orderId=${encodeURIComponent(order.id)}`}
                        className="text-sm font-semibold text-slate-700 hover:text-[color:var(--store-accent)]"
                      >
                        {getCmsBlockField(cms.blocks, "flowStep1", "orderDetailsLabel", "Visa detaljer")}
                      </Link>
                    </div>

                    {highlightedOrderId === order.id ? (
                      <div className="mt-3 rounded-lg border border-[#efe6d9] bg-[#fffdfa] p-3">
                        <p className="mb-2 text-sm font-semibold text-slate-900">
                          {getCmsBlockField(cms.blocks, "flowStep1", "orderContentsTitle", "Orderinnehåll")}
                        </p>
                        {order.items.length > 0 ? (
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="grid items-center gap-3 md:grid-cols-[64px_1fr_auto]">
                                <div className="h-14 rounded-md bg-gradient-to-br from-[#2a2118] via-[#17120e] to-[#0d0b09]" />
                                <div>
                                  <p className="font-semibold text-slate-900">{item.title}</p>
                                  <p className="text-xs text-slate-600">{item.variant}</p>
                                  <p className="text-sm font-semibold text-slate-900">{item.priceLabel}</p>
                                </div>
                                <p className="text-sm text-slate-600">{item.quantityLabel}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600">Inga produkter kunde hämtas för den här ordern ännu.</p>
                        )}
                      </div>
                    ) : null}
                  </article>
                ))}

                <div className="pt-1 text-right">
                  <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--store-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--store-accent-fg)] hover:bg-[color:var(--store-accent)]">
                    {getCmsBlockField(cms.blocks, "flowStep1", "nextButtonLabel", "Fortsätt till steg 2")}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
