import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ReturerFlowAccountLayout,
  ReturerFlowBreadcrumb,
  ReturerFlowBreadcrumbLink,
} from "@/components/returer/returer-flow-account-layout";
import { getCmsBlockField, loadThemedCmsPageContent, loadThemedCmsPageContentForCurrentTenant } from "@/lib/cms/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReturnStepThreePageProps = {
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

export default async function ReturnStepThreePage({ searchParams }: ReturnStepThreePageProps) {
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
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur/registrera/steg-3%3Faccount%3D1");
  }

  const orderId = getParam(params.orderId);
  const selectedItems = getParams(params.itemId);
  if (!orderId) {
    redirect("/returer-aterbetalningar/skapa-retur/registrera?account=1");
  }
  if (selectedItems.length === 0) {
    redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-2?account=1&orderId=${encodeURIComponent(orderId)}`);
  }

  async function saveStepThreeAction(formData: FormData) {
    "use server";
    const method = String(formData.get("returnMethod") || "").trim();
    const formOrderId = String(formData.get("orderId") || "").trim();
    if (!method || !formOrderId) {
      redirect("/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1");
    }
    const params = new URLSearchParams();
    params.set("account", "1");
    params.set("orderId", formOrderId);
    params.set("returnMethod", method);
    for (const item of formData.getAll("itemId")) {
      const value = String(item || "").trim();
      if (value) params.append("itemId", value);
    }
    redirect(`/returer-aterbetalningar/skapa-retur/registrera/steg-4?${params.toString()}`);
  }

  return (
    <ReturerFlowAccountLayout
      title={getCmsBlockField(cms.blocks, "flowStep3", "title", "Ange returmetod")}
      subtitle={getCmsBlockField(cms.blocks, "flowStep3", "subtitle", "Välj hur du vill returnera dina produkter.")}
      breadcrumb={
        <ReturerFlowBreadcrumb>
          <ReturerFlowBreadcrumbLink href="/">Hem</ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink href="/returer-aterbetalningar?account=1">
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
          </ReturerFlowBreadcrumbLink>
          <span className="mx-1">›</span>
          <ReturerFlowBreadcrumbLink
            href={`/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1&orderId=${encodeURIComponent(orderId)}`}
            active
          >
            {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep3Label", "Steg 3")}
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
                      idx < 2 ? "bg-[#16a34a] text-white" : idx === 2 ? "bg-[#0f0d0a] text-white" : "border-2 border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {idx < 2 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 2 ? "text-slate-900" : "text-slate-700"}`}>{step}</p>
                </article>
              ))}
            </div>

            <section className="mt-5 rounded-xl border border-[#ece5d9] bg-[#fcfaf7] p-4">
              <p className="text-3xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep3", "progressLabel", "Steg 3 av 5")}
              </p>
              <h2 className="mt-1 text-[42px] font-semibold leading-tight text-slate-900">
                {getCmsBlockField(cms.blocks, "flowStep3", "title", "Ange returmetod")}
              </h2>
              <p className="text-sm text-slate-600">
                {getCmsBlockField(cms.blocks, "flowStep3", "subtitle", "Välj hur du vill returnera dina produkter.")}
              </p>

              <form action={saveStepThreeAction} className="mt-4 space-y-3">
                <input type="hidden" name="orderId" value={orderId} />
                {selectedItems.map((itemId) => (
                  <input key={itemId} type="hidden" name="itemId" value={itemId} />
                ))}

                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="grid cursor-pointer gap-3 rounded-xl border border-[var(--store-accent)] bg-white px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="returnMethod" value="post" defaultChecked className="h-4 w-4 accent-[var(--store-accent)]" />
                      <p className="text-[26px] font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep3", "methodPostTitle", "Skicka med post (rekommenderas)")}
                      </p>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {getCmsBlockField(cms.blocks, "flowStep3", "methodPostBadge", "Enkelt & smidigt")}
                      </span>
                    </div>
                    <div className="ml-7 grid gap-2 text-sm text-slate-600">
                      <p>{getCmsBlockField(cms.blocks, "flowStep3", "methodPostText", "Vi skickar en retursedel till dig via e-post. Skriv ut den, fäst på paketet och lämna in hos valfritt ombud.")}</p>
                      <p className="rounded-md bg-[#f9f4ec] px-3 py-1.5 font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep3", "methodPostCost", "Kostnad: 59 kr (dras av från din återbetalning)")}
                      </p>
                    </div>
                  </label>

                  <label className="grid cursor-pointer gap-3 rounded-xl border border-[#e9dfd1] bg-white px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="returnMethod" value="store" className="h-4 w-4 accent-[var(--store-accent)]" />
                      <p className="text-[26px] font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep3", "methodStoreTitle", "Lämna in i butik")}
                      </p>
                    </div>
                    <div className="ml-7 grid gap-2 text-sm text-slate-600">
                      <p>{getCmsBlockField(cms.blocks, "flowStep3", "methodStoreText", "Lämna in din retur i någon av våra partnerbutiker. Ta med din orderbekräftelse.")}</p>
                      <p className="rounded-md bg-[#f8f6f2] px-3 py-1.5 font-semibold text-slate-900">
                        {getCmsBlockField(cms.blocks, "flowStep3", "methodStoreCost", "Kostnadsfritt")}
                      </p>
                    </div>
                  </label>
                </div>

                <article className="rounded-xl border border-[#ece5d9] bg-[#faf7f2] px-4 py-3">
                  <p className="text-[28px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "flowStep3", "infoTitle", "Bra att veta")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    {getCmsBlockField(cms.blocks, "flowStep3", "infoText", "Du har rätt att ångra ditt köp inom 30 dagar från den dag du mottog din vara.\nProdukten ska returneras i oförändrat skick och i originalförpackning.")}
                  </p>
                </article>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/returer-aterbetalningar/skapa-retur/registrera/steg-2?account=1&orderId=${encodeURIComponent(orderId)}${selectedItems.map((id) => `&itemId=${encodeURIComponent(id)}`).join("")}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M19 12H5" />
                      <path d="m11 6-6 6 6 6" />
                    </svg>
                    {getCmsBlockField(cms.blocks, "flowStep3", "backButtonLabel", "Tillbaka till steg 2")}
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--store-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--store-accent-fg)] hover:bg-[color:var(--store-accent)]">
                    {getCmsBlockField(cms.blocks, "flowStep3", "nextButtonLabel", "Fortsätt till steg 4")}
                    <ArrowRightIcon />
                  </button>
                </div>
              </form>
            </section>
      </section>
    </ReturerFlowAccountLayout>
  );
}
