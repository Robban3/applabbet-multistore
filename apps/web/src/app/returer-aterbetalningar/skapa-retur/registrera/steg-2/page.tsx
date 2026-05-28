import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type ReturnStepTwoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function formatKr(minor: number) {
  return `${Math.round(minor / 100).toLocaleString("sv-SE")} kr`;
}

function StepIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8l8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
    </svg>
  );
}

export default async function ReturnStepTwoPage({ searchParams }: ReturnStepTwoPageProps) {
  const definition = getCmsPage("returer-aterbetalningar");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("returer-aterbetalningar", { blocks: fallbackBlocks });
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
        .eq("tenant_id", tenant.id)
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
        ];

  const orderLabel = order ? `Order #${String(order.id).slice(0, 5).toUpperCase()}` : "Order #10245";

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader activeNav="Nyheter" cartCount={0} />

          <section className="relative overflow-hidden border-b border-[#1d1812] bg-gradient-to-r from-[#0d0b09] via-[#17130f] to-[#231b13] px-6 py-6 text-white">
            <div className="relative z-10 max-w-[560px]">
              <p className="text-xs text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-1">›</span>
                <Link href="/returer-aterbetalningar?account=1" className="hover:text-white">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
                </Link>
                <span className="mx-1">›</span>
                <Link href={`/returer-aterbetalningar/skapa-retur/registrera?account=1&orderId=${encodeURIComponent(selectedOrder)}`} className="text-[#d7ad62]">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep2Label", "Steg 2")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")} {getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}
              </h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Markera vilka produkter du vill returnera.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Du väljer antal och anledning i nästa steg.")}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%]">
              <div className="absolute right-14 top-7 h-44 w-72 -rotate-[6deg] rounded-lg border border-white/15 bg-black/45" />
              <div className="absolute right-9 top-20 h-36 w-56 rounded-lg border border-[#c8a164]/40 bg-[#231b13]/60" />
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
                  <span className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${idx === 1 ? "bg-black text-white" : "bg-[#f2eee7] text-slate-900"}`}>
                    {idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 1 ? "text-[#d39d3d]" : "text-slate-700"}`}>{step}</p>
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
                      className="h-4 w-4 accent-[#d7ad62]"
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
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#d7ad62] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#e2ba75]">
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
        </div>
      </section>
    </main>
  );
}
