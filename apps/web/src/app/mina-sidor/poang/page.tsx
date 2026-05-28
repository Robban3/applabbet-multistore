import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSidebar, buildAccountSidebarItems } from "@/components/account-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantSettings } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type SimpleItem = {
  title: string;
  text: string;
};

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8.5" r="4.5" />
      <path d="M9.3 12.2 7 20l5-2 5 2-2.3-7.8" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 12v8H4v-8" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 7v13" />
      <path d="M12 7s-1.8 0-3-1.1A2 2 0 0 1 9.5 2.5C11.5 2.5 12 7 12 7Z" />
      <path d="M12 7s1.8 0 3-1.1a2 2 0 0 0-.5-3.4C12.5 2.5 12 7 12 7Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="12" width="4" height="6" rx="2" />
      <rect x="17" y="12" width="4" height="6" rx="2" />
      <path d="M7 18a5 5 0 0 0 10 0" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 19.5a6.5 6.5 0 0 1 13 0" />
      <path d="M18 8v5" />
      <path d="M15.5 10.5h5" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="6" rx="5" ry="2.5" />
      <path d="M7 6v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V6" />
      <path d="M7 11v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 9h14l-1 11H6z" />
      <path d="M9 9V7a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default async function MinaPoangPage() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const loyaltyProgramEnabled = settings?.loyalty_program_enabled ?? false;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/konto/login?next=/mina-sidor/poang");
  }
  if (!loyaltyProgramEnabled) {
    redirect("/mina-sidor");
  }

  const definition = getCmsPage("mina-sidor-poang");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("mina-sidor-poang", { blocks: fallbackBlocks });
  const sidebarItems = buildAccountSidebarItems(true);

  const benefits: SimpleItem[] = [
    {
      title: getCmsBlockField(cms.blocks, "benefits", "card1Title", "Poäng på varje köp"),
      text: getCmsBlockField(cms.blocks, "benefits", "card1Text", "Tjäna poäng du kan använda som betalning."),
    },
    {
      title: getCmsBlockField(cms.blocks, "benefits", "card2Title", "Exklusiva erbjudanden"),
      text: getCmsBlockField(cms.blocks, "benefits", "card2Text", "Få tillgång till personliga kampanjer."),
    },
    {
      title: getCmsBlockField(cms.blocks, "benefits", "card3Title", "Tidiga tillgångar"),
      text: getCmsBlockField(cms.blocks, "benefits", "card3Text", "Först med det senaste i våra nyheter."),
    },
    {
      title: getCmsBlockField(cms.blocks, "benefits", "card4Title", "Prioriterad support"),
      text: getCmsBlockField(cms.blocks, "benefits", "card4Text", "Snabbare hjälp från kundservice."),
    },
  ];

  const steps: SimpleItem[] = [
    {
      title: getCmsBlockField(cms.blocks, "howItWorks", "step1Title", "Bli medlem"),
      text: getCmsBlockField(cms.blocks, "howItWorks", "step1Text", "Skapa ett konto och gå med kostnadsfritt."),
    },
    {
      title: getCmsBlockField(cms.blocks, "howItWorks", "step2Title", "Tjäna poäng"),
      text: getCmsBlockField(cms.blocks, "howItWorks", "step2Text", "Samla poäng på köp och kampanjer."),
    },
    {
      title: getCmsBlockField(cms.blocks, "howItWorks", "step3Title", "Få belöningar"),
      text: getCmsBlockField(cms.blocks, "howItWorks", "step3Text", "Använd poäng till rabatter och erbjudanden."),
    },
  ];

  const tiers = [
    {
      title: getCmsBlockField(cms.blocks, "tiers", "bronzeTitle", "Bronze"),
      text: getCmsBlockField(cms.blocks, "tiers", "bronzeText", "För dig som är ny medlem."),
      rate: getCmsBlockField(cms.blocks, "tiers", "bronzeRate", "Tjäna 1 poäng per 10 kr"),
      benefits: [
        getCmsBlockField(cms.blocks, "tiers", "bronzeBenefit1", "Födelsedagsrabatt"),
        getCmsBlockField(cms.blocks, "tiers", "bronzeBenefit2", "Tillgång till medlemspriser"),
        getCmsBlockField(cms.blocks, "tiers", "bronzeBenefit3", "Standard support"),
      ],
    },
    {
      title: getCmsBlockField(cms.blocks, "tiers", "silverTitle", "Silver"),
      text: getCmsBlockField(cms.blocks, "tiers", "silverText", "För dig som handlar regelbundet."),
      rate: getCmsBlockField(cms.blocks, "tiers", "silverRate", "Tjäna 1,5 poäng per 10 kr"),
      benefits: [
        getCmsBlockField(cms.blocks, "tiers", "silverBenefit1", "Födelsedagsrabatt"),
        getCmsBlockField(cms.blocks, "tiers", "silverBenefit2", "Exklusiva erbjudanden"),
        getCmsBlockField(cms.blocks, "tiers", "silverBenefit3", "Prioriterad support"),
      ],
    },
    {
      title: getCmsBlockField(cms.blocks, "tiers", "goldTitle", "Gold"),
      text: getCmsBlockField(cms.blocks, "tiers", "goldText", "För våra mest lojala kunder."),
      rate: getCmsBlockField(cms.blocks, "tiers", "goldRate", "Tjäna 2 poäng per 10 kr"),
      benefits: [
        getCmsBlockField(cms.blocks, "tiers", "goldBenefit1", "Födelsedagsrabatt"),
        getCmsBlockField(cms.blocks, "tiers", "goldBenefit2", "Exklusiva erbjudanden"),
        getCmsBlockField(cms.blocks, "tiers", "goldBenefit3", "Tidiga tillgångar och VIP-support"),
      ],
    },
  ];

  const faqItems = [
    {
      question: getCmsBlockField(cms.blocks, "faq", "q1", "Hur blir jag medlem i Loyalty Club?"),
      answer: getCmsBlockField(
        cms.blocks,
        "faq",
        "a1",
        "Skapa ett konto på Mina sidor. Medlemskapet aktiveras automatiskt när lojalitetsprogrammet är aktivt.",
      ),
    },
    {
      question: getCmsBlockField(cms.blocks, "faq", "q2", "Hur tjänar jag poäng?"),
      answer: getCmsBlockField(
        cms.blocks,
        "faq",
        "a2",
        "Du samlar poäng på köp och kampanjer. Hur mycket du får per köp beror på din medlemsnivå.",
      ),
    },
    {
      question: getCmsBlockField(cms.blocks, "faq", "q3", "När löper mina poäng ut?"),
      answer: getCmsBlockField(
        cms.blocks,
        "faq",
        "a3",
        "Poäng är giltiga i 12 månader från att de tjänas in om inget annat anges i kampanjvillkoren.",
      ),
    },
    {
      question: getCmsBlockField(cms.blocks, "faq", "q4", "Kan jag använda poäng på alla produkter?"),
      answer: getCmsBlockField(
        cms.blocks,
        "faq",
        "a4",
        "Poäng kan användas på de flesta ordinarie produkter. Undantag kan finnas för vissa kampanjer och presentkort.",
      ),
    },
  ].filter((item) => item.question.trim().length > 0);

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <StorefrontHeader cartCount={0} />
          <div className="px-6 py-5">
            <p className="text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700">
                Hem
              </Link>
              <span className="mx-1">&gt;</span>
              <Link href="/mina-sidor" className="hover:text-slate-700">
                Mina sidor
              </Link>
              <span className="mx-1">&gt;</span>
              <Link href="/mina-sidor/poang" className="hover:text-slate-700">
                {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Mina poäng")}
              </Link>
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
              <AccountSidebar activeHref="/mina-sidor/poang" items={sidebarItems} />

              <section className="space-y-6">
                <section className="overflow-hidden rounded-2xl p-6 text-white" style={{ background: "var(--store-header-gradient)" }}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--store-accent)]">Loyalty</p>
                  <h1 className="mt-2 text-5xl font-semibold tracking-tight">
                    {getCmsBlockField(cms.blocks, "hero", "title", "Loyalty Club")}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-white/85">
                    {getCmsBlockField(
                      cms.blocks,
                      "hero",
                      "subtitle",
                      "Förmåner, erbjudanden och exklusiva upplevelser - bara för våra medlemmar.",
                    )}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <article className="rounded-xl border border-white/15 bg-black/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-white/70">
                        {getCmsBlockField(cms.blocks, "hero", "memberPointsLabel", "Ditt poängsaldo")}
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-[color:var(--store-accent)]">
                        {getCmsBlockField(cms.blocks, "hero", "memberPointsValue", "120 poäng")}
                      </p>
                    </article>
                    <article className="rounded-xl border border-white/15 bg-black/25 p-4">
                      <p className="text-xs uppercase tracking-wide text-white/70">
                        {getCmsBlockField(cms.blocks, "hero", "memberTierLabel", "Nuvarande nivå")}
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-[color:var(--store-accent)]">
                        {getCmsBlockField(cms.blocks, "hero", "memberTierValue", "Bronze")}
                      </p>
                    </article>
                  </div>
                </section>

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {benefits.map((item, index) => (
                    <article key={item.title} className="rounded-xl border p-4" style={{ borderColor: "var(--store-card-border)", background: "var(--store-soft-surface)" }}>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-[#20170f]" style={{ borderColor: "var(--store-footer-border)" }}>
                        {index === 0 ? <MedalIcon /> : null}
                        {index === 1 ? <GiftIcon /> : null}
                        {index === 2 ? <BoltIcon /> : null}
                        {index === 3 ? <SupportIcon /> : null}
                      </span>
                      <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                    </article>
                  ))}
                </section>

                <section>
                  <h2 className="text-center text-4xl font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "howItWorks", "title", "Så fungerar det")}
                  </h2>
                  <div className="mx-auto mt-2 h-[2px] w-20 rounded-full bg-[color:var(--store-accent)]" />
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {steps.map((step, index) => (
                      <article key={step.title} className="rounded-xl border bg-white p-4 text-center" style={{ borderColor: "var(--store-card-border)" }}>
                        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border text-slate-900" style={{ borderColor: "var(--store-footer-border)", background: "var(--store-soft-surface)" }}>
                          {index === 0 ? <UserPlusIcon /> : null}
                          {index === 1 ? <CoinsIcon /> : null}
                          {index === 2 ? <BagIcon /> : null}
                        </span>
                        <span className="mx-auto mt-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[color:var(--store-accent)] px-2 text-xs font-semibold text-slate-900">
                          {index + 1}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{step.text}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-center text-4xl font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "tiers", "sectionTitle", "Medlemsnivåer")}
                  </h2>
                  <div className="mx-auto mt-2 h-[2px] w-20 rounded-full bg-[color:var(--store-accent)]" />

                  <div className="mt-5 grid gap-3 lg:grid-cols-3">
                    {tiers.map((tier) => (
                      <article
                        key={tier.title}
                        className="rounded-xl border p-5 text-white"
                        style={{ borderColor: "var(--store-footer-border)", background: "var(--store-footer-surface)" }}
                      >
                        <h3 className="text-3xl font-semibold">{tier.title}</h3>
                        <p className="mt-1 text-sm text-white/75">{tier.text}</p>
                        <p className="mt-4 text-base font-semibold text-[color:var(--store-accent)]">{tier.rate}</p>
                        <ul className="mt-3 space-y-2">
                          {tier.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2 text-sm text-white/90">
                              <CheckIcon />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-center text-4xl font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
                  </h2>
                  <div className="mx-auto mt-2 h-[2px] w-20 rounded-full bg-[color:var(--store-accent)]" />

                  <div className="mt-5 space-y-2">
                    {faqItems.map((item) => (
                      <details key={item.question} className="group rounded-lg border bg-white" style={{ borderColor: "var(--store-card-border)" }}>
                        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900">
                          {item.question}
                          <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
                        </summary>
                        <p className="border-t px-4 py-3 text-sm text-slate-600" style={{ borderColor: "var(--store-footer-border)" }}>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>

                <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 text-white" style={{ background: "var(--store-footer-surface)" }}>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {getCmsBlockField(cms.blocks, "support", "title", "Har du frågor om Loyalty Club?")}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      {getCmsBlockField(cms.blocks, "support", "text", "Vårt team hjälper dig gärna.")}
                    </p>
                  </div>
                  <Link
                    href={getCmsBlockField(cms.blocks, "support", "ctaHref", "/kundservice")}
                    className="inline-flex items-center rounded-full bg-[color:var(--store-accent)] px-5 py-2.5 text-sm font-semibold text-slate-900 hover:brightness-105"
                  >
                    {getCmsBlockField(cms.blocks, "support", "ctaLabel", "Kontakta oss")}
                  </Link>
                </section>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
