import Link from "next/link";
import { redirect } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

type CreateReturnPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function StepIcon({ index }: { index: number }) {
  if (index === 0 || index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8 8h8M8 12h6M8 16h5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8l8-4 8 4-8 4-8-4Z" />
        <path d="M4 8v8l8 4 8-4V8" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="8" width="11" height="8" rx="1.5" />
        <path d="M13 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17" r="1.4" />
        <circle cx="17" cy="17" r="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="8" cy="14" r="1" />
    </svg>
  );
}

function SmallTrustIcon({ index }: { index: number }) {
  if (index === 0) return <path d="M12 6v6l4 2" />;
  if (index === 1) return <path d="M4 8l8-4 8 4-8 4-8-4Z" />;
  if (index === 2) return <path d="M3 6h18v12H3z" />;
  return <path d="M4 13v-1a8 8 0 0 1 16 0v1" />;
}

const fallbackFaqItems = [
  {
    question: "Hur lång tid har jag på mig att returnera en vara?",
    answer: "Du kan registrera retur inom 30 dagar från att du mottagit varan.",
  },
  {
    question: "När får jag tillbaka mina pengar?",
    answer: "När returen är godkänd återbetalas beloppet normalt inom 1-5 arbetsdagar.",
  },
  {
    question: "Vem betalar returfrakten?",
    answer: "Vid postretur kan returfrakt debiteras enligt aktuella villkor. Exakt kostnad visas i flödet.",
  },
  {
    question: "Kan jag byta vara istället för att returnera den?",
    answer: "Byten hanteras vanligtvis som retur + ny beställning för snabbast hantering.",
  },
];

export default async function SkapaReturPage({ searchParams }: CreateReturnPageProps) {
  const definition = getCmsPage("returer-aterbetalningar");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("returer-aterbetalningar", { blocks: fallbackBlocks });
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const isFullPage = themeKey === "luxury" || themeKey === "sport";
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
    redirect("/konto/login?next=/returer-aterbetalningar/skapa-retur%3Faccount%3D1");
  }

  const steps = [1, 2, 3, 4, 5].map((index) => ({
    title: getCmsBlockField(cms.blocks, "flowStep1", `step${index}Title`, index === 1 ? "Hitta din order" : index === 2 ? "Välj produkter" : index === 3 ? "Välj returmetod" : index === 4 ? "Skicka tillbaka" : "Återbetalning"),
    text: getCmsBlockField(cms.blocks, "flowStep1", `step${index}Text`, ""),
  }));

  const trustItems = [1, 2, 3, 4].map((index) => ({
    title: getCmsBlockField(cms.blocks, "flowStep1", `trust${index}Title`, index === 1 ? "30 dagars öppet köp" : index === 2 ? "Enkel retur" : index === 3 ? "Återbetalning" : "Behöver du hjälp?"),
    text: getCmsBlockField(cms.blocks, "flowStep1", `trust${index}Text`, ""),
  }));

  const infoCards = [1, 2, 3, 4].map((index) => ({
    title: getCmsBlockField(cms.blocks, "flowStep1", `infoCard${index}Title`, ""),
    text: getCmsBlockField(cms.blocks, "flowStep1", `infoCard${index}Text`, ""),
    cta: getCmsBlockField(cms.blocks, "flowStep1", `infoCard${index}Cta`, ""),
    href: getCmsBlockField(cms.blocks, "flowStep1", `infoCard${index}Href`, "/"),
  }));

  const faqItems = [1, 2, 3, 4]
    .map((index) => ({
      question: getCmsBlockField(
        cms.blocks,
        "flowStep1",
        `faq${index}`,
        fallbackFaqItems[index - 1]?.question || "",
      ),
      answer: getCmsBlockField(
        cms.blocks,
        "flowStep1",
        `faqA${index}`,
        fallbackFaqItems[index - 1]?.answer || "",
      ),
    }))
    .filter((item) => item.question.trim().length > 0);

  const inner = (
    <>
          <StorefrontHeader cartCount={0} />

          <section className="relative overflow-hidden border-b border-white/10 px-6 py-6 text-white" style={{ background: "var(--store-header-gradient)" }}>
            <div className="relative z-10 max-w-[540px]">
              <p className="text-xs text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-1">›</span>
                <Link href="/returer-aterbetalningar?account=1" className="hover:text-white">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbReturerLabel", "Returer & ångerrätt")}
                </Link>
                <span className="mx-1">›</span>
                <Link href="/returer-aterbetalningar/skapa-retur?account=1" className="text-white">
                  {getCmsBlockField(cms.blocks, "flowNavigation", "breadcrumbCreateReturnLabel", "Skapa din retur")}
                </Link>
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">
                {getCmsBlockField(cms.blocks, "flowHero", "titlePrefix", "Skapa din")}{" "}
                <span className="text-[color:var(--store-accent)]">{getCmsBlockField(cms.blocks, "flowHero", "titleHighlight", "retur")}</span>
              </h1>
              <p className="mt-3 text-xl leading-relaxed text-white/90">
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine1", "Här kan du enkelt registrera din retur.")}
                <br />
                {getCmsBlockField(cms.blocks, "flowHero", "subtitleLine2", "Följ stegen så hjälper vi dig hela vägen.")}
              </p>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%]">
              <div className="absolute right-14 top-7 h-44 w-72 -rotate-[6deg] rounded-lg border border-white/15 bg-black/45" />
              <div className="absolute right-9 top-20 h-36 w-56 rounded-lg border border-[color:var(--store-accent)]/40 bg-[#231b13]/60" />
            </div>
            <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustItems.map((item, index) => (
                <article key={item.title || String(index)} className="rounded-lg border border-white/10 bg-black/25 px-3 py-3">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <SmallTrustIcon index={index} />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-white/75">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="px-6 py-7">
            <h2 className="text-center text-[48px] font-semibold leading-tight text-slate-900">
              {getCmsBlockField(cms.blocks, "flowStep1", "howItWorksTitle", "Så här skapar du din retur")}
            </h2>
            <div className="mx-auto mt-2 h-[2px] w-24 rounded-full bg-[color:var(--store-accent)]" />
            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {steps.map((step, idx) => (
                <article key={step.title} className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#e8e2d7] bg-[#fbf7f1]">
                    <StepIcon index={idx} />
                  </div>
                  <span className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--store-accent)] text-[11px] font-semibold text-[color:var(--store-accent-fg)]">
                    {idx + 1}
                  </span>
                  <p className="mt-2 text-[25px] font-semibold text-slate-900">{step.title}</p>
                  <p className="mx-auto max-w-[205px] text-[13px] leading-relaxed text-slate-600">{step.text}</p>
                </article>
              ))}
            </div>

            <section className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#11100d] px-5 py-4 text-white">
              <div>
                <p className="text-[30px] font-semibold">{getCmsBlockField(cms.blocks, "flowStep1", "ctaTitle", "Redo att skapa din retur?")}</p>
                <p className="text-sm text-white/75">{getCmsBlockField(cms.blocks, "flowStep1", "ctaText", "Hitta din order och starta din retur på bara några minuter.")}</p>
              </div>
              <Link
                href="/returer-aterbetalningar/skapa-retur/registrera?account=1"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--store-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--store-accent-fg)] hover:opacity-90"
              >
                {getCmsBlockField(cms.blocks, "flowStep1", "ctaButtonLabel", "Skapa din retur")}
                <ArrowRightIcon />
              </Link>
            </section>

            <section className="mt-4 grid gap-3 lg:grid-cols-4">
              {infoCards.map((card) => (
                <article key={card.title} className="rounded-lg border border-[#ebe5da] bg-[#faf7f2] px-4 py-4">
                  <p className="text-[27px] font-semibold">{card.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{card.text}</p>
                  <Link href={card.href} className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-900 hover:text-[color:var(--store-accent)]">
                    {card.cta}
                    <ArrowRightIcon />
                  </Link>
                </article>
              ))}
            </section>

            <section className="mt-7">
              <h3 className="text-center text-[46px] font-semibold">
                {getCmsBlockField(cms.blocks, "sections", "faqTitle", "Vanliga frågor")}
              </h3>
              <div className="mt-3 space-y-2">
                {faqItems.map((item) => (
                  <details key={item.question} className="group rounded-lg border border-[#e8e1d6] bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-900">
                      {item.question}
                      <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
                    </summary>
                    {item.answer.trim().length > 0 ? (
                      <p className="border-t border-[#ece6dc] px-4 py-3 text-[13px] leading-relaxed text-slate-600">
                        {item.answer}
                      </p>
                    ) : null}
                  </details>
                ))}
              </div>
            </section>
          </section>
    </>
  );

  if (isFullPage) {
    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div className="mx-auto w-full max-w-[1380px] px-4 py-2 sm:px-5">
          {inner}
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]" style={{ borderColor: "var(--store-footer-border)" }}>
          {inner}
        </div>
      </section>
    </main>
  );
}
