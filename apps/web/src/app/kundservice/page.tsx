import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { SportPageHero } from "@/components/storefront/sport/sport-page-hero";
import { MinimalHeader } from "@/components/storefront/minimal";
import { BeautyHeader } from "@/components/storefront/beauty";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { getCmsBlockField, loadThemedCmsPageContent } from "@/lib/cms/content";
import { getStoreBrandName } from "@/lib/store-brand";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

const fallbackTrustBottom = [
  { title: "Snabb hjälp", text: "Vi svarar snabbt och löser ditt ärende effektivt." },
  { title: "Människor, inte robotar", text: "Riktig support från vårt team som bryr sig." },
  { title: "Tryggt & enkelt", text: "Starka lösningar och smidiga processer." },
  { title: "Nöjda kunder", text: "4.8/5 i betyg från över 100 000 kunder." },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ContactCardIcon({ title }: { title: string }) {
  if (title === "Livechat") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 6h16v10H8l-4 4V6Z" />
      </svg>
    );
  }
  if (title === "E-post") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (title === "Telefon") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M6 3h4l2 5-2 2a14 14 0 0 0 4 4l2-2 5 2v4c0 1.1-.9 2-2 2C10.7 20 4 13.3 4 5c0-1.1.9-2 2-2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default async function KundservicePage() {  const brandName = await getStoreBrandName();
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const cms = await loadThemedCmsPageContent("kundservice", themeKey);
  const isSport = themeKey === "sport";
  const fallbackContactCards = [
    {
      title: "Livechat",
      text: "Chatta med oss direkt så hjälper vi dig så snabbt vi kan.",
      action: "Starta chat",
      footer: "Öppet nu 08:00 - 20:00",
    },
    {
      title: "E-post",
      text: "Skicka oss ett meddelande så återkommer vi inom 24 timmar.",
      action: "Skicka e-post",
      footer: `info@${brandName.toLowerCase().replace(/\s+/g, "")}.se`,
    },
    {
      title: "Telefon",
      text: "Ring oss så hjälper vi dig vardagar 08:00 - 17:00.",
      action: "010 - 123 45 67",
      footer: "Vardagar 08:00 - 17:00",
    },
    {
      title: "Adress",
      text: `${brandName} AB\nBox 123, 131 54 Nacka\nSverige`,
      action: "",
      footer: "",
    },
  ];
  const contactCards = fallbackContactCards.map((card, index) => {
    const item = index + 1;
    return {
      title: getCmsBlockField(cms.blocks, "contact", `card${item}Title`, card.title),
      text: getCmsBlockField(cms.blocks, "contact", `card${item}Text`, card.text),
      action: getCmsBlockField(cms.blocks, "contact", `card${item}Action`, card.action),
      footer: getCmsBlockField(cms.blocks, "contact", `card${item}Footer`, card.footer),
    };
  });
  const trustBottom = fallbackTrustBottom.map((item, index) => ({
    title: getCmsBlockField(cms.blocks, "trustBottom", `item${index + 1}Title`, item.title),
    text: getCmsBlockField(cms.blocks, "trustBottom", `item${index + 1}Text`, item.text),
  }));
  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((index) => ({
      question: getCmsBlockField(cms.blocks, "faq", `q${index}`, ""),
      answer: getCmsBlockField(cms.blocks, "faq", `a${index}`, ""),
    }))
    .filter((item) => item.question.trim().length > 0);
  const faqColumns = [
    faqItems.slice(0, Math.ceil(faqItems.length / 2)),
    faqItems.slice(Math.ceil(faqItems.length / 2)),
  ];

  if (themeKey === "beauty") {
    const navLinks = getStorefrontConfig(themeKey).navItems;
    return (
      <main className="bg-white">
        <BeautyHeader brandName={brandName} links={navLinks} activeNav="Kundservice" />
        <section className="bg-[#FBE9F2] px-6 py-14 text-center">
          <h1 className="mx-auto max-w-[800px] font-extrabold uppercase tracking-[-0.02em] text-[#1A1A1A]" style={{ fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.05 }}>
            {getCmsBlockField(cms.blocks, "hero", "title", "Hur kan vi hjälpa dig?")}
          </h1>
          <p className="mx-auto mt-3 max-w-[600px] text-[17px] text-[#1A1A1A]/70">
            {getCmsBlockField(cms.blocks, "hero", "description", "Hitta svar snabbt eller kontakta vårt team.")}
          </p>
        </section>
        <section className="px-6 py-10">
          <div className="mx-auto grid max-w-[1100px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <article key={card.title} className="flex flex-col rounded-[14px] border border-[#ECECEC] bg-white p-6">
                <h3 className="text-[18px] font-bold text-[#1A1A1A]">{card.title}</h3>
                <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-[#6B6B6B]">{card.text}</p>
                {card.action ? <p className="mt-4 text-[15px] font-bold text-[#EC008C]">{card.action} ›</p> : null}
                {card.footer ? <p className="mt-1 text-[13px] text-[#9A9A9A]">{card.footer}</p> : null}
              </article>
            ))}
          </div>
        </section>
        {faqItems.length > 0 ? (
          <section className="px-6 py-14">
            <h2 className="text-center text-[28px] font-extrabold uppercase tracking-[-0.01em] text-[#1A1A1A] lg:text-[34px]">
              {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
            </h2>
            <div className="mx-auto mt-8 max-w-[820px] overflow-hidden rounded-[14px] border border-[#ECECEC]">
              {faqItems.map((item, idx) => (
                <details key={idx} className="group border-b border-[#ECECEC] last:border-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[16px] font-semibold text-[#1A1A1A]">
                    {item.question}
                    <span className="text-[#EC008C] transition group-open:rotate-180"><ChevronDownIcon /></span>
                  </summary>
                  <p className="px-6 pb-5 text-[15px] leading-relaxed text-[#6B6B6B]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <section className="bg-[#FAFAFA] px-6 py-14">
          <div className="mx-auto grid max-w-[1100px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustBottom.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-[16px] font-bold uppercase text-[#1A1A1A]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6B6B6B]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (themeKey === "minimal") {
    const navLinks = getStorefrontConfig(themeKey).navItems;
    return (
      <main className="bg-white">
        <MinimalHeader brandName={brandName} links={navLinks} activeNav="Kundservice" />

        {/* Hero */}
        <section className="px-6 pt-20 pb-12 text-center">
          <h1 className="mx-auto max-w-[800px] font-semibold tracking-[-0.03em] text-[#1D1D1F]" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.06 }}>
            {getCmsBlockField(cms.blocks, "hero", "title", "Hur kan vi hjälpa dig?")}
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-[19px] text-[#6E6E73]">
            {getCmsBlockField(cms.blocks, "hero", "description", "Hitta svar snabbt eller kontakta vårt team.")}
          </p>
        </section>

        {/* Kontaktkort */}
        <section className="px-6 pb-4">
          <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <article key={card.title} className="flex flex-col rounded-[18px] bg-[#F5F5F7] p-6">
                <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">{card.title}</h3>
                <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-[#6E6E73]">{card.text}</p>
                {card.action ? (
                  <p className="mt-4 text-[15px] font-medium text-[#0066CC]">{card.action} ›</p>
                ) : null}
                {card.footer ? <p className="mt-1 text-[13px] text-[#86868B]">{card.footer}</p> : null}
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 ? (
          <section className="px-6 py-16">
            <h2 className="text-center text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[40px]">
              {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
            </h2>
            <div className="mx-auto mt-8 max-w-[820px] overflow-hidden rounded-[18px] border border-[#D2D2D7]">
              {faqItems.map((item, idx) => (
                <details key={idx} className="group border-b border-[#D2D2D7] last:border-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[17px] font-medium text-[#1D1D1F]">
                    {item.question}
                    <span className="text-[#86868B] transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-[15px] leading-relaxed text-[#6E6E73]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* Trust */}
        <section className="bg-[#F5F5F7] px-6 py-16">
          <div className="mx-auto grid max-w-[1024px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustBottom.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-[17px] font-semibold text-[#1D1D1F]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6E6E73]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isSport) {
    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Kundservice" cartCount={3} brandName={brandName} />
          <SportPageHero
            eyebrow={getCmsBlockField(cms.blocks, "hero", "eyebrow", "Support")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Vi har\ndin rygg.")}
            description={getCmsBlockField(cms.blocks, "hero", "description", "Frågor om order, leverans eller retur? Vårt team löser det snabbt — så du kan fokusera på träningen.")}
          />
        </div>

        {/* Kontaktkort */}
        <section className="w-full px-6 py-12 lg:px-10">
          <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#4a7c00]">Kontakt</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.02em] text-[#0a0f08] lg:text-4xl">
            {getCmsBlockField(cms.blocks, "contact", "title", "Hör av dig")}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((card) => (
              <article key={card.title} className="border-2 border-[#0a0f08] bg-white p-5">
                <p className="text-lg font-black uppercase tracking-[-0.01em] text-[#0a0f08]">{card.title}</p>
                <p className="mt-2 whitespace-pre-line text-sm font-medium text-[#0a0f08]/70">{card.text}</p>
                {card.action ? (
                  <button
                    type="button"
                    data-live-chat-trigger={card.title === "Livechat" ? "true" : undefined}
                    className="mt-4 bg-[#b3ff00] px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#0a0f08] transition hover:bg-[#9fe600]"
                  >
                    {card.action}
                  </button>
                ) : null}
                {card.footer ? <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0a0f08]/45">{card.footer}</p> : null}
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full bg-[#0a0f08] px-6 py-12 text-white lg:px-10">
          <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#b3ff00]">FAQ</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.02em] lg:text-4xl">
            {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faqColumns.map((items, colIdx) => (
              <div key={`faq-col-${colIdx}`} className="space-y-3">
                {items.map((item) => (
                  <details key={item.question} className="group border border-white/15 bg-white/5">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-white">
                      <span>{item.question}</span>
                      <span className="text-[#b3ff00] transition group-open:rotate-45 text-lg leading-none">+</span>
                    </summary>
                    <p className="border-t border-white/10 px-4 py-3 text-sm font-medium text-white/60">{item.answer}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Retur-CTA */}
        <section className="w-full px-6 py-12 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-5 border-2 border-[#0a0f08] bg-[#b3ff00] p-7 md:flex-row md:items-center">
            <div>
              <p className="text-2xl font-black uppercase tracking-[-0.02em] text-[#0a0f08]">
                {getCmsBlockField(cms.blocks, "returnsCta", "title", "30 dagars öppet köp")}
              </p>
              <p className="mt-1 text-sm font-medium text-[#0a0f08]/70">
                {getCmsBlockField(cms.blocks, "returnsCta", "text", "Inte nöjd? Inga problem. Enkel retur, alltid.")}
              </p>
            </div>
            <Link
              href={getCmsBlockField(cms.blocks, "returnsCta", "buttonHref", "/returer-aterbetalningar")}
              className="inline-flex items-center gap-2 bg-[#0a0f08] px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#1a2113]"
            >
              {getCmsBlockField(cms.blocks, "returnsCta", "buttonLabel", "Till returer")}
              <ArrowRightIcon />
            </Link>
          </div>
        </section>

        {/* Trust strip */}
        <section className="grid w-full border-t border-[#dce9cf] sm:grid-cols-2 lg:grid-cols-4">
          {trustBottom.map((item) => (
            <article key={item.title} className="flex min-h-[88px] flex-col justify-center border-b border-[#dce9cf] bg-[#eef5e7] px-6 py-4 lg:border-b-0 lg:border-l lg:first:border-l-0">
              <p className="text-sm font-black uppercase tracking-[-0.01em] text-[#0a0f08]">{item.title}</p>
              <p className="mt-1 text-xs font-medium text-[#0a0f08]/60">{item.text}</p>
            </article>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader activeNav="Kundservice" cartCount={3} brandName={brandName} />

          <section className="grid border-b border-[#e6ddd1] lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4 p-7">
              <h1 className="text-6xl font-semibold leading-[1.03] text-slate-900">
                {getCmsBlockField(cms.blocks, "hero", "title", "Vi finns här för dig.")}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-700">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  "Har du frågor om din beställning, leverans, returer eller våra produkter? Vårt kundserviceteam hjälper dig gärna.",
                )}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-live-chat-trigger="true"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
                >
                  {getCmsBlockField(cms.blocks, "hero", "chatButtonLabel", "Chatta med oss")}
                </button>
                <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                  {getCmsBlockField(cms.blocks, "hero", "emailButtonLabel", "Skicka e-post")}
                </button>
              </div>
            </div>
            {getCmsBlockField(cms.blocks, "hero", "imageUrl", "").trim() ? (
              <div className="min-h-[300px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCmsBlockField(cms.blocks, "hero", "imageUrl", "")}
                  alt="Kundservice hero"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="min-h-[300px] bg-gradient-to-br from-[#d4d0cc] via-[#aaa49e] to-[#6f6962]" />
            )}
          </section>

          <section className="border-b border-[#e6ddd1] p-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-4xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
              </h2>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                {getCmsBlockField(cms.blocks, "faq", "viewAllLabel", "Se alla frågor")}
                <ArrowRightIcon />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {faqColumns.map((items, colIdx) => (
                <div key={`faq-col-${colIdx}`} className="space-y-2">
                  {items.map((item) => (
                    <details key={item.question} className="group rounded-md border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-900">
                        <span>{item.question}</span>
                        <span className="transition group-open:rotate-180">
                          <ChevronDownIcon />
                        </span>
                      </summary>
                      <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[#e6ddd1] p-7">
            <h2 className="text-4xl font-semibold text-slate-900">
              {getCmsBlockField(cms.blocks, "contact", "title", "Kontakta oss")}
            </h2>
            <p className="text-sm text-slate-600">
              {getCmsBlockField(cms.blocks, "contact", "subtitle", "Välj det sätt som passar dig bäst.")}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {contactCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-[#e6ddd1] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <ContactCardIcon title={card.title} />
                    <p className="text-2xl font-semibold">{card.title}</p>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{card.text}</p>
                  {card.action ? (
                    <button
                      type="button"
                      data-live-chat-trigger={card.title === "Livechat" ? "true" : undefined}
                      className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                    >
                      {card.action}
                    </button>
                  ) : null}
                  {card.footer ? <p className="mt-2 text-xs text-slate-500">{card.footer}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="border-b border-[#e6ddd1] p-7">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <article className="rounded-xl border border-[#e6ddd1] bg-white px-4 py-3">
                <p className="text-2xl font-semibold">
                  {getCmsBlockField(cms.blocks, "returnsCta", "title", "30 dagars öppet köp")}
                </p>
                <p className="text-sm text-slate-600">
                  {getCmsBlockField(cms.blocks, "returnsCta", "text", "Inte nöjd? Inga problem. Du har alltid 30 dagars öppet köp och enkel retur.")}
                </p>
              </article>
              <Link
                href={getCmsBlockField(cms.blocks, "returnsCta", "buttonHref", "/returer-aterbetalningar")}
                className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                {getCmsBlockField(cms.blocks, "returnsCta", "buttonLabel", "Till returer & återbetalningar")}
                <ArrowRightIcon />
              </Link>
            </div>
          </section>

          <section className="grid overflow-hidden bg-[#faf6ef] sm:grid-cols-2 lg:grid-cols-4">
            {trustBottom.map((item) => (
              <article key={item.title} className="flex min-h-[74px] flex-col justify-center border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0 lg:first:border-l-0">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-slate-600">{item.text}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
