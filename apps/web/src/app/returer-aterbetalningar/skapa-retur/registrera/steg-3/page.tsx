import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
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

export default async function ReturnStepThreePage({ searchParams }: ReturnStepThreePageProps) {
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
                <Link href={`/returer-aterbetalningar/skapa-retur/registrera/steg-3?account=1&orderId=${encodeURIComponent(orderId)}`} className="text-[#d7ad62]">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbStep3Label", "Steg 3")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")} {getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}
              </h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Välj hur du vill returnera produkterna.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Smidigt och tryggt, precis som det ska vara.")}
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
                      idx < 2 ? "bg-black text-white" : idx === 2 ? "bg-[#d7ad62] text-slate-900" : "bg-[#f2eee7] text-slate-900"
                    }`}
                  >
                    {idx < 2 ? <CheckIcon /> : idx + 1}
                  </span>
                  <p className={`mt-2 text-sm font-semibold ${idx === 2 ? "text-[#d39d3d]" : "text-slate-700"}`}>{step}</p>
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
                  <label className="grid cursor-pointer gap-3 rounded-xl border border-[#d7ad62] bg-white px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="returnMethod" value="post" defaultChecked className="h-4 w-4 accent-[#d7ad62]" />
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
                      <input type="radio" name="returnMethod" value="store" className="h-4 w-4 accent-[#d7ad62]" />
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
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#d7ad62] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#e2ba75]">
                    {getCmsBlockField(cms.blocks, "flowStep3", "nextButtonLabel", "Fortsätt till steg 4")}
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
