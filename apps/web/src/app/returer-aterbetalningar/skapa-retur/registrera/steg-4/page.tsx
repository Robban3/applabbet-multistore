import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
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
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
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
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera/steg-4%3Faccount%3D1");
  }

  const orderId = getParam(params.orderId).trim();
  const method = getParam(params.returnMethod).trim();
  const selectedReason = getParam(params.reason).trim();
  const selectedComment = getParam(params.comment).trim();
  const selectedItems = getParams(params.itemId);
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

  const items =
    (orderItems || []).length > 0
      ? (orderItems || []).map((item) => ({
          id: String(item.id),
          title: String(item.product_title || "Produkt"),
          variant: "Svart",
          quantity: Number(item.quantity || 1),
          priceMinor: Number(item.unit_price_minor || 0),
        }))
      : [
          { id: "f1", title: "Premium Hörlurar Pro", variant: "Svart", quantity: 1, priceMinor: 119900 },
          { id: "f2", title: "Chrome Elite Klocka", variant: "Svart / Stål", quantity: 1, priceMinor: 59900 },
        ];

  const totalMinor = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);

  async function saveStepFourAction(formData: FormData) {
    "use server";
    const reason = String(formData.get("reason") || "").trim();
    const comment = String(formData.get("comment") || "").trim();
    const formOrderId = String(formData.get("orderId") || "").trim();
    const formMethod = String(formData.get("returnMethod") || "").trim();
    if (!reason || !formOrderId || !formMethod) {
      redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1");
    }
    const next = new URLSearchParams();
    next.set("account", "1");
    next.set("orderId", formOrderId);
    next.set("returnMethod", formMethod);
    next.set("reason", reason);
    if (comment) next.set("comment", comment);
    for (const item of formData.getAll("itemId")) {
      const value = String(item || "").trim();
      if (value) next.append("itemId", value);
    }
    redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-5?${next.toString()}`);
  }

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
                <Link href={`/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1&orderId=${encodeURIComponent(orderId)}`} className="text-[#d7ad62]">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep4Label", "Steg 4")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")} {getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}
              </h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Berätta varför du returnerar din produkt.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Vi guidar dig hela vägen till bekräftelse.")}
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
                  <span
                    className={`mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      idx < 3 ? "bg-black text-white" : idx === 3 ? "bg-[#d7ad62] text-slate-900" : "bg-[#f2eee7] text-slate-900"
                    }`}
                  >
                    {idx < 3 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 3 ? "text-[#d39d3d]" : "text-slate-700"}`}>{step}</p>
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
                      </span>
                      <select
                        name="reason"
                        defaultValue={selectedReason || ""}
                        className="w-full rounded-lg border border-[#d7ad62] bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
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
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#d7ad62] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#e2ba75]">
                    {getCmsBlockField(cms.blocks, "flowStep4", "nextButtonLabel", "Fortsätt till steg 5")}
                    <ArrowRightIcon />
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
