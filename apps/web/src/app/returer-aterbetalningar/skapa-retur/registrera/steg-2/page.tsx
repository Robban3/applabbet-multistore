import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ReturerFlowAccountLayout,
  ReturerFlowBreadcrumb,
  ReturerFlowBreadcrumbLink,
} from "@/components/returer/returer-flow-account-layout";
import { getCmsBlockField, loadThemedCmsPageContent, loadThemedCmsPageContentForCurrentTenant } from "@/lib/cms/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type ReturnStepTwoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.5">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function formatKr(minor: number) {
  return `${Math.round(minor / 100).toLocaleString("sv-SE")} kr`;
}

export default async function ReturnStepTwoPage({ searchParams }: ReturnStepTwoPageProps) {
  const cms = await loadThemedCmsPageContentForCurrentTenant("returer-aterbetalningar");
  const params = await searchParams;
  const accountView = getParam(params.account) === "1";
  if (!accountView) {
    redirect("/returer-aterbetalningar");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera/steg-2%3Faccount%3D1");
  }

  const selectedOrder = getParam(params.orderId).trim();
  if (!selectedOrder) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera?account=1");
  }

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera?account=1");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, created_at, total_minor, customer_email")
    .eq("tenant_id", tenant.id)
    .eq("id", selectedOrder)
    .eq("customer_email", user.email || "")
    .maybeSingle();

  const { data: orderItems } = order
    ? await supabase
        .from("order_items")
        .select("id, product_title, quantity, unit_price_minor")
        .eq("order_id", order.id)
    : { data: [] };

  const items =
    (orderItems || []).length > 0
      ? (orderItems || []).map((item) => ({
          id: String(item.id),
          title: String(item.product_title || "Produkt"),
          quantity: Number(item.quantity || 1),
          priceLabel: formatKr(Number(item.unit_price_minor || 0)),
          variant: "Standard",
        }))
      : [
          { id: "f1", title: "Premium Hörlurar Pro", quantity: 1, priceLabel: "1 199 kr", variant: "Svart" },
          { id: "f2", title: "Chrome Elite Klocka", quantity: 1, priceLabel: "599 kr", variant: "Svart / Stål" },
          { id: "f3", title: "Aviator Solglasögon", quantity: 1, priceLabel: "199 kr", variant: "Guld / Brun" },
        ];

  const orderLabel = order ? `Order #${String(order.id).slice(0, 5).toUpperCase()}` : "Order #10245";
  const flowTitle = getCmsBlockField(cms.blocks, "flowStep2", "title", "Välj produkter");
  const flowSubtitle = getCmsBlockField(cms.blocks, "flowStep2", "subtitleTemplate", "{order} - välj vilka produkter som ska returneras.").replace(
    "{order}",
    orderLabel,
  );

  return (
    <ReturerFlowAccountLayout
      title={flowTitle}
      subtitle={flowSubtitle}
      breadcrumb={
        <ReturerFlowBreadcrumb>
          <ReturerFlowBreadcrumbLink href="/">Hem</ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink href="/returer-aterbetalningar?account=1">
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
          </ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink
            href={`/returer-aterbetalningar/skapa-retur/registrera?account=1&orderId=${encodeURIComponent(selectedOrder)}`}
            active
          >
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep2Label", "Steg 2")}
          </ReturerFlowBreadcrumbLink>
        </ReturerFlowBreadcrumb>
      }
    >
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
                  <span className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${idx < 1 ? "bg-[#16a34a] text-white" : idx === 1 ? "bg-[#0f0d0a] text-white" : "border-2 border-slate-200 bg-white text-slate-400"}`}>
                    {idx < 1 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-[12px] font-semibold ${idx === 1 ? "text-slate-900" : idx < 1 ? "text-[#16a34a]" : "text-slate-400"}`}>{step}</p>
                </article>
              ))}
            </div>

            <section className="mt-5 rounded-xl border border-[#ece5d9] bg-[#fcfaf7] p-4">
              <p className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep2", "progressLabel", "Steg 2 av 5")}
              </p>
              <h2 className="mt-1 text-[42px] font-semibold leading-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep2", "title", "Välj produkter")}
              </h2>
              <p className="text-sm text-slate-600">
                {getCmsBlockField(cms.blocks, "flowStep2", "subtitleTemplate", "{order} - välj vilka produkter som ska returneras.").replace("{order}", orderLabel)}
              </p>

              <form
                method="GET"
                action="/returer-aterbetalningar/skapa-retur/registrera/steg-3"
                className="mt-4 space-y-3"
              >
                <input type="hidden" name="account" value="1" />
                <input type="hidden" name="orderId" value={selectedOrder} />

                {items.map((item) => (
                  <label
                    key={item.id}
                    className="grid cursor-pointer items-center gap-3 rounded-xl border border-[#e9dfd1] bg-white px-4 py-3 md:grid-cols-[24px_72px_1fr_auto]"
                  >
                    <input
                      type="checkbox"
                      name="itemId"
                      value={item.id}
                      defaultChecked
                      className="h-4 w-4 accent-[var(--store-accent)]"
                    />
                    <div className="h-14 rounded-md bg-gradient-to-br from-[#2a2118] via-[#17120e] to-[#0d0b09]" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-600">{item.variant}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.priceLabel}</p>
                    </div>
                    <p className="text-sm text-slate-600">Antal: {item.quantity}</p>
                  </label>
                ))}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/returer-aterbetalningar/skapa-retur/registrera?account=1&orderId=${encodeURIComponent(selectedOrder)}`}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    {getCmsBlockField(cms.blocks, "flowStep2", "backButtonLabel", "Tillbaka till steg 1")}
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--store-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--store-accent-fg)] hover:bg-[color:var(--store-accent)]">
                    {getCmsBlockField(cms.blocks, "flowStep2", "nextButtonLabel", "Fortsätt till steg 3")}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </form>
            </section>
      </section>
    </ReturerFlowAccountLayout>
  );
}
