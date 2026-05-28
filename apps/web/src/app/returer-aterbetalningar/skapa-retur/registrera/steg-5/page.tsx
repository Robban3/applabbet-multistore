import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type ReturnStepFivePageProps = {
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

function buildReturnId() {
  const stamp = Date.now().toString().slice(-8);
  return `RET-${stamp}`;
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

export default async function ReturnStepFivePage({ searchParams }: ReturnStepFivePageProps) {
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
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera/steg-5%3Faccount%3D1");
  }

  const orderId = getParam(params.orderId).trim();
  const returnMethod = getParam(params.returnMethod).trim();
  const reason = getParam(params.reason).trim();
  const comment = getParam(params.comment).trim();
  const selectedItems = getParams(params.itemId);
  const status = getParam(params.status).trim();
  const returnId = getParam(params.returnId).trim();
  if (!orderId || !returnMethod || !reason || selectedItems.length === 0) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1");
  }

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1");
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

  async function submitReturnAction(formData: FormData) {
    "use server";
    const accepted = formData.get("accept_terms") === "on";
    const formOrderId = String(formData.get("orderId") || "").trim();
    const formMethod = String(formData.get("returnMethod") || "").trim();
    const formReason = String(formData.get("reason") || "").trim();
    const formComment = String(formData.get("comment") || "").trim();
    const formItemIds = formData
      .getAll("itemId")
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    if (!accepted || !formOrderId || !formMethod || !formReason) {
      const failQuery = new URLSearchParams();
      failQuery.set("account", "1");
      failQuery.set("orderId", formOrderId);
      failQuery.set("returnMethod", formMethod);
      failQuery.set("reason", formReason);
      if (formComment) failQuery.set("comment", formComment);
      failQuery.set("status", "error");
      for (const itemId of formItemIds) {
        failQuery.append("itemId", itemId);
      }
      redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-5?${failQuery.toString()}`);
    }
    const query = new URLSearchParams();
    query.set("account", "1");
    query.set("orderId", formOrderId);
    query.set("returnMethod", formMethod);
    query.set("reason", formReason);
    if (formComment) query.set("comment", formComment);
    query.set("status", "sent");
    query.set("returnId", buildReturnId());
    for (const itemId of formItemIds) {
      query.append("itemId", itemId);
    }
    redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-5?${query.toString()}`);
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
                <Link href={`/returer-aterbetalningar/skapa-retur/registrera/steg-5?account=1&orderId=${encodeURIComponent(orderId)}`} className="text-[#d7ad62]">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep5Label", "Steg 5")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")} {getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}
              </h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Kontrollera dina uppgifter och skicka in din retur.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Du får en bekräftelse via e-post.")}
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
                      idx < 4 ? "bg-black text-white" : "bg-[#d7ad62] text-slate-900"
                    }`}
                  >
                    {idx < 4 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 4 ? "text-[#d39d3d]" : "text-slate-700"}`}>{step}</p>
                </article>
              ))}
            </div>

            <form action={submitReturnAction} className="mt-5 space-y-3 rounded-xl border border-[#ece5d9] bg-[#fcfaf7] p-4">
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="returnMethod" value={returnMethod} />
              <input type="hidden" name="reason" value={reason} />
              <input type="hidden" name="comment" value={comment} />
              {selectedItems.map((itemId) => (
                <input key={itemId} type="hidden" name="itemId" value={itemId} />
              ))}

              <p className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep5", "progressLabel", "Steg 5 av 5")}
              </p>
              <h2 className="mt-1 text-[42px] font-semibold leading-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep5", "title", "Bekräfta & skicka")}
              </h2>
              <p className="text-sm text-slate-600">{getCmsBlockField(cms.blocks, "flowStep5", "subtitle", "Kontrollera dina uppgifter och skicka in din retur. Du får en bekräftelse via e-post.")}</p>

              {status === "sent" ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {getCmsBlockField(cms.blocks, "flowStep5", "successTemplate", "Returen är registrerad. Ditt retur-ID är {returnId}.").replace("{returnId}", returnId || "-")}
                </div>
              ) : null}
              {status === "error" ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {getCmsBlockField(cms.blocks, "flowStep5", "errorText", "Du behöver godkänna villkoren innan returen kan skickas.")}
                </div>
              ) : null}

              <div className="grid gap-3 lg:grid-cols-3">
                <article className="rounded-xl border border-[#e9dfd1] bg-white p-4">
                  <p className="text-[28px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "flowStep5", "summaryTitle", "Retursammanfattning")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Order {orderId.slice(0, 5).toUpperCase()}</p>
                  <div className="mt-2 divide-y divide-[#f0e8db]">
                    {items.map((item) => (
                      <div key={item.id} className="grid items-center gap-3 py-2 md:grid-cols-[56px_1fr_auto]">
                        <div className="h-12 rounded-md bg-gradient-to-br from-[#2a2118] via-[#17120e] to-[#0d0b09]" />
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-600">{item.variant}</p>
                          <p className="text-sm font-semibold text-slate-900">{formatKr(item.priceMinor)}</p>
                        </div>
                        <p className="text-sm text-slate-600">Antal {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-md bg-[#f8f3ea] px-3 py-2 text-sm font-semibold text-slate-900">
                      <span>{getCmsBlockField(cms.blocks, "flowStep5", "summaryTotalLabel", "Totalt värde att returnera")}</span>
                    <span>{formatKr(totalMinor)}</span>
                  </div>
                </article>

                <article className="rounded-xl border border-[#e9dfd1] bg-white p-4">
                  <p className="text-[28px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "flowStep5", "returnInfoTitle", "Returinformation")}
                  </p>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-semibold">{getCmsBlockField(cms.blocks, "flowStep5", "returnMethodLabel", "Returmetod:")}</span> {returnMethod === "post" ? getCmsBlockField(cms.blocks, "flowStep5", "returnMethodPost", "Skicka med post (rekommenderas)") : getCmsBlockField(cms.blocks, "flowStep5", "returnMethodStore", "Lämna in i butik")}</p>
                    <p><span className="font-semibold">{getCmsBlockField(cms.blocks, "flowStep5", "returnLabelSentTo", "Retursedel skickas till:")}</span> {getCmsBlockField(cms.blocks, "flowStep5", "returnSentToText", "din e-post efter att du skapat returen.")}</p>
                    <p><span className="font-semibold">{getCmsBlockField(cms.blocks, "flowStep5", "returnFreightLabel", "Returfrakt:")}</span> {returnMethod === "post" ? getCmsBlockField(cms.blocks, "flowStep5", "returnFreightPost", "59 kr (dras av från återbetalningen)") : getCmsBlockField(cms.blocks, "flowStep5", "returnFreightStore", "Kostnadsfritt")}</p>
                    <p><span className="font-semibold">{getCmsBlockField(cms.blocks, "flowStep5", "additionalInfoLabel", "Ytterligare information:")}</span> {comment || reason}</p>
                  </div>
                  <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    {getCmsBlockField(cms.blocks, "flowStep5", "sustainabilityText", "Tack för att du handlar hållbart hos oss! Genom att returnera hjälper du oss att minska onödiga transporter och värna om miljön.")}
                  </div>
                </article>

                <article className="rounded-xl border border-[#e9dfd1] bg-white p-4">
                  <p className="text-[28px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "flowStep5", "nextHowTitle", "Så här gör du nu")}
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    <li>{getCmsBlockField(cms.blocks, "flowStep5", "nextHowItem1", "Packa varorna: Packa produkten i originalförpackning och se till att allt som hör till produkten är med.")}</li>
                    <li>{getCmsBlockField(cms.blocks, "flowStep5", "nextHowItem2", "Skriv ut retursedeln: Du får retursedel via e-post. Skriv ut och fäst på paketet.")}</li>
                    <li>{getCmsBlockField(cms.blocks, "flowStep5", "nextHowItem3", "Skicka paketet: Lämna in paket på ditt ombud. Kom ihåg att spara kvitto.")}</li>
                  </ul>
                </article>
              </div>

              <label className="flex items-center gap-2 rounded-md border border-[#ece5d9] bg-white px-3 py-2 text-sm">
                <input type="checkbox" name="accept_terms" className="h-4 w-4 accent-[#d7ad62]" />
                <span>
                  {getCmsBlockField(cms.blocks, "flowStep5", "termsLabel", "Jag har läst och godkänner villkoren för retur")}{" "}
                  <Link href="/kopvillkor" className="font-semibold underline underline-offset-2">
                    villkoren för retur
                  </Link>
                </span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Link
                  href={`/returer-aterbetalningar/skapa-retur/registrera/steg-4?account=1&orderId=${encodeURIComponent(orderId)}&returnMethod=${encodeURIComponent(returnMethod)}&reason=${encodeURIComponent(reason)}${comment ? `&comment=${encodeURIComponent(comment)}` : ""}${selectedItems.map((id) => `&itemId=${encodeURIComponent(id)}`).join("")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M19 12H5" />
                    <path d="m11 6-6 6 6 6" />
                  </svg>
                  {getCmsBlockField(cms.blocks, "flowStep5", "backButtonLabel", "Tillbaka till steg 4")}
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#d7ad62] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#e2ba75]">
                  {getCmsBlockField(cms.blocks, "flowStep5", "submitButtonLabel", "Skicka in retur")}
                  <ArrowRightIcon />
                </button>
              </div>

              <article className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="font-semibold">{getCmsBlockField(cms.blocks, "flowStep5", "confirmationTitle", "Nästa steg: Du får en bekräftelse via e-post")}</p>
                <p>{getCmsBlockField(cms.blocks, "flowStep5", "confirmationText", "När vi har mottagit och kontrollerat din retur återbetalar vi beloppet till dig inom 10 arbetsdagar.")}</p>
              </article>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
