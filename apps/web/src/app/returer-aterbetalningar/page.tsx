import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { SportPageHero } from "@/components/storefront/sport/sport-page-hero";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";


const fallbackSteps = [
  { title: "Skapa din retur", text: "Logga in på Mina sidor och registrera din retur enkelt." },
  { title: "Packa varan", text: "Packa produkten i originalförpackning med alla lappar kvar." },
  { title: "Skicka tillbaka", text: "Använd förbetald retursedel som du får via e-post." },
  { title: "Vi behandlar din retur", text: "När vi mottagit och godkänt din retur behandlar vi den inom 1-3 arbetsdagar." },
  { title: "Återbetalning", text: "Du får pengarna tillbaka till samma betalningsmetod inom 3-5 arbetsdagar." },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.1">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StepIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.7-3 4.2-4.5 7-4.5S17.3 17 19 20" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8l8-4 8 4-8 4-8-4Z" />
        <path d="M4 8v8l8 4 8-4V8" />
        <path d="M12 12v8" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="8" width="11" height="8" rx="1.5" />
        <path d="M13 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17" r="1.4" />
        <circle cx="17" cy="17" r="1.4" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20 16.5 16.5" />
        <path d="m8.5 11 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="8" cy="14" r="1" />
    </svg>
  );
}

type ReturerAterbetalningarPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function ReturerAterbetalningarPage({ searchParams }: ReturerAterbetalningarPageProps) {
  const definition = getCmsPage("returer-aterbetalningar");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("returer-aterbetalningar", { blocks: fallbackBlocks });
  const params = await searchParams;
  const accountView = getParam(params.account) === "1";
  const faqItems = [1, 2, 3, 4, 5, 6]
    .map((index) => ({
      question: getCmsBlockField(cms.blocks, "faq", `q${index}`, ""),
      answer: getCmsBlockField(cms.blocks, "faq", `a${index}`, ""),
    }))
    .filter((item) => item.question.trim().length > 0);
  const faqColumns = [
    faqItems.slice(0, Math.ceil(faqItems.length / 2)),
    faqItems.slice(Math.ceil(faqItems.length / 2)),
  ];
  const steps = fallbackSteps.map((step, index) => ({
    title: getCmsBlockField(cms.blocks, "steps", `item${index + 1}Title`, step.title),
    text: getCmsBlockField(cms.blocks, "steps", `item${index + 1}Text`, step.text),
  }));
  const refundsRaw = [1, 2, 3, 4].map((index) =>
    getCmsBlockField(cms.blocks, "cards", `refundsMethod${index}`, ""),
  );
  const refundRows = refundsRaw
    .map((item) => {
      const [label, value] = item.split("|");
      return { label: (label || "").trim(), value: (value || "").trim() };
    })
    .filter((item) => item.label.length > 0 || item.value.length > 0);

  if (accountView) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/konto/login?next=/returer-aterbetalningar%3Faccount%3D1");
    }
  }

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const isSport = normalizeThemeKey(settings?.theme_key) === "sport";

  if (isSport) {
    const sportInner = (
      <>
        {/* Steg */}
        <section className="w-full px-6 py-12 lg:px-10">
          <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#4a7c00]">Process</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.02em] text-[#0a0f08] lg:text-4xl">
            {getCmsBlockField(cms.blocks, "sections", "howItWorksTitle", "Så funkar en retur")}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, idx) => (
              <article key={step.title} className="border-2 border-[#0a0f08] bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center bg-[#b3ff00] text-sm font-black text-[#0a0f08]">{idx + 1}</span>
                <p className="mt-3 text-base font-black uppercase tracking-[-0.01em] text-[#0a0f08]">{step.title}</p>
                <p className="mt-1 text-[13px] font-medium text-[#0a0f08]/60">{step.text}</p>
              </article>
            ))}
          </div>
          {accountView ? (
            <Link
              href={getCmsBlockField(cms.blocks, "steps", "createReturnHref", "/returer-aterbetalningar/skapa-retur?account=1")}
              className="mt-6 inline-flex items-center gap-2 bg-[#0a0f08] px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#1a2113]"
            >
              {getCmsBlockField(cms.blocks, "steps", "createReturnLabel", "Skapa din retur")}
              <ArrowRightIcon />
            </Link>
          ) : null}
        </section>

        {/* Öppet köp + Återbetalning */}
        <section className="w-full bg-[#0a0f08] px-6 py-12 text-white lg:px-10">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="border-2 border-[#b3ff00] bg-white/5 p-6">
              <h3 className="text-xl font-black uppercase tracking-[-0.01em] text-[#b3ff00]">
                {getCmsBlockField(cms.blocks, "cards", "returnsTitle", "30 dagars öppet köp")}
              </h3>
              <p className="mt-2 text-[13px] font-medium text-white/60">
                {getCmsBlockField(cms.blocks, "cards", "returnsText", "Du har alltid 30 dagars öppet köp från den dag du mottagit din vara.")}
              </p>
              <ul className="mt-4 space-y-2 text-[13px] font-medium text-white/80">
                <li className="flex items-center gap-2"><span className="text-[#b3ff00]">▸</span>{getCmsBlockField(cms.blocks, "cards", "returnsItem1", "Varan är i originalskick")}</li>
                <li className="flex items-center gap-2"><span className="text-[#b3ff00]">▸</span>{getCmsBlockField(cms.blocks, "cards", "returnsItem2", "Alla lappar och originalförpackning finns med")}</li>
                <li className="flex items-center gap-2"><span className="text-[#b3ff00]">▸</span>{getCmsBlockField(cms.blocks, "cards", "returnsItem3", "Returkostnad: 49 kr")}</li>
              </ul>
              <Link
                href={getCmsBlockField(cms.blocks, "cards", "returnsButtonHref", "/returer-aterbetalningar/skapa-retur?account=1")}
                className="mt-5 inline-flex items-center gap-2 bg-[#b3ff00] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-[#0a0f08] transition hover:bg-[#9fe600]"
              >
                {getCmsBlockField(cms.blocks, "cards", "returnsButtonLabel", "Skapa en retur")}
                <ArrowRightIcon />
              </Link>
            </article>
            <article className="border-2 border-white/15 bg-white/5 p-6">
              <h3 className="text-xl font-black uppercase tracking-[-0.01em] text-white">
                {getCmsBlockField(cms.blocks, "cards", "refundsTitle", "Återbetalningar")}
              </h3>
              <p className="mt-2 text-[13px] font-medium text-white/60">
                {getCmsBlockField(cms.blocks, "cards", "refundsText", "När vi mottagit och godkänt din retur återbetalas beloppet till samma betalningsmetod.")}
              </p>
              {refundRows.length > 0 ? (
                <div className="mt-4 space-y-2 text-[13px]">
                  {refundRows.map((row, index) => (
                    <div key={`${row.label}-${index}`} className="flex items-center justify-between border-b border-white/10 pb-1 font-medium text-white/80">
                      <span>{row.label}</span>
                      <span className="text-[#b3ff00]">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 ? (
          <section className="w-full px-6 py-12 lg:px-10">
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#4a7c00]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.02em] text-[#0a0f08] lg:text-4xl">
              {getCmsBlockField(cms.blocks, "sections", "faqTitle", "Vanliga frågor")}
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {faqColumns.map((items, colIdx) => (
                <div key={`faq-col-${colIdx}`} className="space-y-3">
                  {items.map((item) => (
                    <details key={item.question} className="group border-2 border-[#0a0f08] bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-[#0a0f08]">
                        <span>{item.question}</span>
                        <span className="text-[#4a7c00] text-lg leading-none transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="border-t-2 border-[#0a0f08] px-4 py-3 text-[13px] font-medium text-[#0a0f08]/60">{item.answer}</p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </>
    );

    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Kundservice" cartCount={0} />
          <SportPageHero
            eyebrow="Returer"
            title={getCmsBlockField(cms.blocks, "hero", "title", "Enkelt\natt ångra.")}
            description={getCmsBlockField(cms.blocks, "hero", "description", "Inte rätt passform? 30 dagars öppet köp och smidig retur — inga krångel.")}
          />
        </div>
        {accountView ? (
          <div className="mx-auto grid w-full max-w-[1380px] gap-6 px-6 py-8 lg:grid-cols-[230px_1fr] lg:px-10">
            <AccountSidebar activeHref="/returer-aterbetalningar?account=1" />
            <div>{sportInner}</div>
          </div>
        ) : (
          sportInner
        )}
      </main>
    );
  }

  const content = (
    <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <StorefrontHeader activeNav="Kundservice" cartCount={0} />

      <section className="grid border-b border-[#ebe5da] lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2 px-8 py-8">
          <p className="text-xs text-slate-500">
            <Link href="/kundservice" className="hover:text-slate-700">Kundservice</Link>
            <span className="mx-1">›</span>
            <Link href={accountView ? "/returer-aterbetalningar?account=1" : "/returer-aterbetalningar"} className="hover:text-slate-700">
              {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Returer & återbetalningar")}
            </Link>
          </p>
          <h1 className="text-[52px] font-semibold leading-[1.03] text-slate-900">
            {getCmsBlockField(cms.blocks, "hero", "title", "Returer & återbetalningar")}
          </h1>
          <p className="max-w-[580px] text-[17px] leading-relaxed text-slate-700">
            {getCmsBlockField(
              cms.blocks,
              "hero",
              "description",
              "Vi vill att du ska vara 100 % nöjd med ditt köp. Skulle något ändå inte bli rätt har du alltid 30 dagars öppet köp och enkel retur.",
            )}
          </p>
        </div>
        <div className="relative min-h-[250px] overflow-hidden border-l border-[#ebe5da] bg-gradient-to-br from-[#f5f5f5] via-[#d8d6d2] to-[#aca8a1]">
          <div className="absolute right-16 top-8 h-36 w-60 -rotate-[14deg] rounded-md bg-[#11100e] shadow-2xl" />
          <div className="absolute right-4 top-18 h-36 w-36 rotate-12 rounded-md bg-[#8c6d47]/95" />
          <div className="absolute right-24 top-24 h-24 w-24 rounded bg-black/20" />
        </div>
      </section>

      <section className="border-b border-[#ebe5da] px-8 py-7">
        <h2 className="text-[42px] font-semibold text-slate-900">
          {getCmsBlockField(cms.blocks, "sections", "howItWorksTitle", "Så här fungerar en retur")}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          {steps.map((step, idx) => (
            <article key={step.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#e8e2d7] bg-white">
                <StepIcon index={idx} />
              </div>
              <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-semibold text-white">
                {idx + 1}
              </span>
              <p className="mt-2 text-[25px] font-semibold text-slate-900">{step.title}</p>
              <p className="mx-auto max-w-[205px] text-[13px] leading-relaxed text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
        {accountView ? (
          <div className="mt-5">
            <Link
              href={getCmsBlockField(cms.blocks, "steps", "createReturnHref", "/returer-aterbetalningar/skapa-retur?account=1")}
              className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-900"
            >
              {getCmsBlockField(cms.blocks, "steps", "createReturnLabel", "Skapa din retur")}
              <ArrowRightIcon />
            </Link>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 border-b border-[#ebe5da] px-8 py-6 lg:grid-cols-2">
        <article className="rounded-lg border border-[#ebe5da] bg-white p-5">
          <h3 className="flex items-center gap-2 text-[37px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 5v5h-5" />
              <path d="M4 19v-5h5" />
              <path d="M19 10a7 7 0 0 0-12-3" />
              <path d="M5 14a7 7 0 0 0 12 3" />
            </svg>
            {getCmsBlockField(cms.blocks, "cards", "returnsTitle", "30 dagars öppet köp")}
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-slate-600">
            {getCmsBlockField(cms.blocks, "cards", "returnsText", "Du har alltid 30 dagars öppet köp från den dag du mottagit din vara.")}
          </p>
          <ul className="mt-3 space-y-2 text-[13px] text-slate-700">
            <li className="flex items-center gap-2"><CheckIcon />{getCmsBlockField(cms.blocks, "cards", "returnsItem1", "Varan är i originalskick")}</li>
            <li className="flex items-center gap-2"><CheckIcon />{getCmsBlockField(cms.blocks, "cards", "returnsItem2", "Alla lappar och originalförpackning finns med")}</li>
            <li className="flex items-center gap-2"><CheckIcon />{getCmsBlockField(cms.blocks, "cards", "returnsItem3", "Returkostnad: 49 kr (dras av från återbetalningen)")}</li>
          </ul>
          <Link
            href={getCmsBlockField(cms.blocks, "cards", "returnsButtonHref", "/returer-aterbetalningar/skapa-retur?account=1")}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-[13px] font-semibold text-white"
          >
            {getCmsBlockField(cms.blocks, "cards", "returnsButtonLabel", "Skapa en retur")}
            <ArrowRightIcon />
          </Link>
        </article>
        <article className="rounded-lg border border-[#ebe5da] bg-white p-5">
          <h3 className="flex items-center gap-2 text-[37px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 10h18" />
              <circle cx="8" cy="14" r="1" />
            </svg>
            {getCmsBlockField(cms.blocks, "cards", "refundsTitle", "Återbetalningar")}
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-slate-600">
            {getCmsBlockField(cms.blocks, "cards", "refundsText", "När vi har mottagit och godkänt din retur återbetalas beloppet till samma betalningsmetod som användes vid köpet.")}
          </p>
          <div className="mt-4 space-y-2 text-[13px]">
            {refundRows.map((row, index) => (
              <div
                key={`${row.label}-${index}`}
                className={`flex items-center justify-between ${index < refundRows.length - 1 ? "border-b border-slate-100 pb-1" : ""}`}
              >
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-3 border-b border-[#ebe5da] px-8 py-5 lg:grid-cols-[0.32fr_1fr_0.7fr]">
        <div className="h-[116px] rounded-lg border border-[#ebe5da] bg-gradient-to-br from-[#f7f5f3] via-[#ddd9d2] to-[#b8b2aa]" />
        <article className="rounded-lg border border-[#ebe5da] bg-[#faf7f2] px-5 py-4">
          <p className="flex items-center gap-2 text-[29px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5" />
              <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
            </svg>
            {getCmsBlockField(cms.blocks, "notice", "noticeTitle", "Observera")}
          </p>
          <p className="text-[13px] leading-relaxed text-slate-600">
            {getCmsBlockField(cms.blocks, "notice", "noticeText", "Av hygienskäl kan vi inte acceptera returer av strumpor, underkläder, hörlurar och kosttillskott om förpackningen har brutits.")}
          </p>
        </article>
        <article className="rounded-lg border border-[#ebe5da] bg-[#faf7f2] px-5 py-4">
          <p className="flex items-center gap-2 text-[29px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h16v10H8l-4 4V6Z" />
            </svg>
            {getCmsBlockField(cms.blocks, "notice", "supportTitle", "Har du frågor?")}
          </p>
          <p className="text-[13px] leading-relaxed text-slate-600">
            {getCmsBlockField(cms.blocks, "notice", "supportText", "Kontakta vårt kundserviceteam så hjälper vi dig gärna.")}
          </p>
          <Link
            href={getCmsBlockField(cms.blocks, "notice", "supportButtonHref", "/kundservice")}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-900"
          >
            {getCmsBlockField(cms.blocks, "notice", "supportButtonLabel", "Till kundservice")}
            <ArrowRightIcon />
          </Link>
        </article>
      </section>

      <section className="px-8 py-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[42px] font-semibold text-slate-900">
            {getCmsBlockField(cms.blocks, "sections", "faqTitle", "Vanliga frågor")}
          </h2>
          <button className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700">
            {getCmsBlockField(cms.blocks, "sections", "faqViewAllLabel", "Se alla frågor")}
            <ArrowRightIcon />
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {faqColumns.map((items, colIdx) => (
            <div key={`faq-col-${colIdx}`} className="space-y-2">
              {items.map((item) => (
                <details key={item.question} className="group rounded-md border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-[13px] font-medium text-slate-900">
                    <span>{item.question}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <p className="border-t border-slate-200 px-4 py-2.5 text-[13px] leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        {accountView ? (
          <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
            <AccountSidebar activeHref="/returer-aterbetalningar?account=1" />
            {content}
          </div>
        ) : (
          content
        )}
      </section>
    </main>
  );
}
