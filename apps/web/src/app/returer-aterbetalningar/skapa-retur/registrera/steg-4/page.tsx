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

type ReturnStepFourPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function getParams(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function formatKr(minor: number) {
  return `${Math.round(minor / 100).toLocaleString("sv-SE")} kr`;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.2">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function ReturnStepFourPage({ searchParams }: ReturnStepFourPageProps) {
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
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera/steg-4%3Faccount%3D1");
  }

  const orderId = getParam(params.orderId).trim();
  const method = getParam(params.returnMethod).trim();
  const selectedReason = getParam(params.reason).trim();
  const selectedComment = getParam(params.comment).trim();
  const selectedItems = getParams(params.itemId);
  const showReasonError = getParam(params.error) === "reason";
  if (!orderId || !method || selectedItems.length === 0) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1");
  }

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1");
  }

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, product_title, quantity, unit_price_minor")
    .eq("tenant_id", tenant.id)
    .eq("order_id", orderId)
    .in("id", selectedItems);

  const fallbackItemsById = new Map([
    ["f1", { id: "f1", title: "Premium Hörlurar Pro", variant: "Svart", quantity: 1, priceMinor: 119900 }],
    ["f2", { id: "f2", title: "Chrome Elite Klocka", variant: "Svart / Stål", quantity: 1, priceMinor: 59900 }],
  ]);

  const items =
    (orderItems || []).length > 0
      ? (orderItems || []).map((item) => ({
          id: String(item.id),
          title: String(item.product_title || "Produkt"),
          variant: "Svart",
          quantity: Number(item.quantity || 1),
          priceMinor: Number(item.unit_price_minor || 0),
        }))
      : selectedItems.map((itemId) =>
          fallbackItemsById.get(itemId) || {
            id: itemId,
            title: "Produkt",
            variant: "Standard",
            quantity: 1,
            priceMinor: 0,
          },
        );

  const totalMinor = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);

  async function saveStepFourAction(formData: FormData) {
    "use server";
    const reason = String(formData.get("reason") || "").trim();
    const comment = String(formData.get("comment") || "").trim();
    const formOrderId = String(formData.get("orderId") || "").trim();
    const formMethod = String(formData.get("returnMethod") || "").trim();
    const back = new URLSearchParams();
    back.set("account", "1");
    if (formOrderId) back.set("orderId", formOrderId);
    if (formMethod) back.set("returnMethod", formMethod);
    if (comment) back.set("comment", comment);
    for (const item of formData.getAll("itemId")) {
      const value = String(item || "").trim();
      if (value) back.append("itemId", value);
    }

    if (!reason) {
      back.set("error", "reason");
      redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-4?${back.toString()}`);
    }
    if (!formOrderId || !formMethod) {
      redirect("/returer-aterbetalningar/skapa-retur/registrera?account=1");
    }

    const next = new URLSearchParams(back);
    next.set("reason", reason);
    next.delete("error");
    redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-5?${next.toString()}`);
  }

  return (
    <ReturerFlowAccountLayout
      title={getCmsBlockField(cms.blocks, "flowStep4", "title", "Returdetaljer")}
      subtitle={getCmsBlockField(cms.blocks, "flowStep4", "subtitle", "Berätta varför du returnerar dina produkter.")}
      breadcrumb={
        <ReturerFlowBreadcrumb>
          <ReturerFlowBreadcrumbLink href="/">Hem</ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink href="/returer-aterbetalningar?account=1">
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
          </ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink
            href={`/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1&orderId=${encodeURIComponent(orderId)}`}
            active
          >
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep4Label", "Steg 4")}
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
                  <span
                    className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      idx < 3 ? "bg-[#16a34a] text-white" : idx === 3 ? "bg-[#0f0d0a] text-white" : "border-2 border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {idx < 3 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 3 ? "text-slate-900" : "text-slate-700"}`}>{step}</p>
                </article>
              ))}
            </div>

            <section className="mt-5 rounded-xl border border-[#ece5d9] bg-[#fcfaf7] p-4">
              <p className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep4", "progressLabel", "Steg 4 av 5")}
              </p>
              <h2 className="mt-1 text-[42px] font-semibold leading-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep4", "title", "Returdetaljer")}
              </h2>
              <p className="text-sm text-slate-600">{getCmsBlockField(cms.blocks, "flowStep4", "subtitle", "Berätta varför du returnerar dina produkter.")}</p>

              <form action={saveStepFourAction} className="mt-4 space-y-3">
                <input type="hidden" name="orderId" value={orderId} />
                <input type="hidden" name="returnMethod" value={method} />
                {selectedItems.map((itemId) => (
                  <input key={itemId} type="hidden" name="itemId" value={itemId} />
                ))}

                <div className="grid gap-3 lg:grid-cols-2">
                  <article className="rounded-xl border border-[#e9dfd1] bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {getCmsBlockField(cms.blocks, "flowStep4", "productsTitleTemplate", "Produkter du returnerar ({count})").replace("{count}", String(items.length))}
                    </p>
                    <div className="mt-2 divide-y divide-[#f0e8db]">
                      {items.map((item) => (
                        <div key={item.id} className="grid items-center gap-3 py-2 md:grid-cols-[64px_1fr_auto]">
                          <div className="h-14 rounded-md bg-gradient-to-br from-[#2a2118] via-[#17120e] to-[#0d0b09]" />
                          <div>
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-600">{item.variant}</p>
                            <p className="text-sm font-semibold text-slate-900">{formatKr(item.priceMinor)}</p>
                          </div>
                          <p className="text-sm text-slate-600">Antal: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between rounded-md bg-[#f8f3ea] px-3 py-2 text-sm font-semibold text-slate-900">
                      <span>{getCmsBlockField(cms.blocks, "flowStep4", "totalLabel", "Totalt värde att returnera")}</span>
                      <span>{formatKr(totalMinor)}</span>
                    </div>
                  </article>

                  <article className="rounded-xl border border-[#e9dfd1] bg-white p-4">
                    <label className="block">
                      <span className="mb-1 block text-sm font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep4", "reasonLabel", "Ange anledning till retur")}
                        <span className="ml-1 text-red-500">*</span>
                      </span>
                      <select
                        name="reason"
                        defaultValue={selectedReason || ""}
                        required
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 ${showReasonError ? "border-red-500" : "border-[var(--store-accent)]"}`}
                      >
                        <option value="" disabled>
                          {getCmsBlockField(cms.blocks, "flowStep4", "reasonPlaceholder", "Välj anledning")}
                        </option>
                        <option value="not-as-expected">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption1", "Produkten motsvarade inte mina förväntningar")}</option>
                        <option value="wrong-product">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption2", "Fel produkt")}</option>
                        <option value="damaged">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption3", "Skadad / trasig vara")}</option>
                        <option value="wrong-size">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption4", "Storleken passade inte")}</option>
                        <option value="regret">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption5", "Ångrat köp")}</option>
                        <option value="other">{getCmsBlockField(cms.blocks, "flowStep4", "reasonOption6", "Annat (vänligen specificera)")}</option>
                      </select>
                      {showReasonError && (
                        <p className="mt-1.5 text-sm text-red-500">Du måste ange en anledning till returen.</p>
                      )}
                    </label>

                    <label className="mt-3 block">
                      <span className="mb-1 block text-sm font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep4", "commentLabel", "Ytterligare information (valfritt)")}
                      </span>
                      <textarea
                        name="comment"
                        maxLength={300}
                        rows={5}
                        defaultValue={selectedComment}
                        placeholder={getCmsBlockField(cms.blocks, "flowStep4", "commentPlaceholder", "Skriv meddelande här...")}
                        className="w-full rounded-lg border border-[#e5dccf] bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      />
                    </label>
                    <p className="mt-1 text-right text-xs text-slate-500">0/300</p>
                  </article>
                </div>

                <article className="rounded-xl border border-[#ece5d9] bg-[#faf7f2] px-4 py-3">
                  <p className="text-[28px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "flowStep4", "infoTitle", "Tänk på detta")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    {getCmsBlockField(cms.blocks, "flowStep4", "infoText", "Produkter ska returneras i oförändrat skick, i originalförpackning med tillbehör och etiketter kvar.\nReturen ska skickas inom 10 arbetsdagar från att du anmält din retur.")}
                  </p>
                </article>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1&orderId=${encodeURIComponent(orderId)}${selectedItems.map((id) => `&itemId=${encodeURIComponent(id)}`).join("")}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M19 12H5" />
                      <path d="m11 6-6 6 6 6" />
                    </svg>
                    {getCmsBlockField(cms.blocks, "flowStep4", "backButtonLabel", "Tillbaka till steg 3")}
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--store-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--store-accent-fg)] hover:bg-[color:var(--store-accent)]">
                    {getCmsBlockField(cms.blocks, "flowStep4", "nextButtonLabel", "Fortsätt till steg 5")}
                    <ArrowRightIcon />
                  </button>
                </div>
              </form>
            </section>
      </section>
    </ReturerFlowAccountLayout>
  );
}
