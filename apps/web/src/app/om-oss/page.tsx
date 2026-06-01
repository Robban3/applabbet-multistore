import { CmsInlineText } from "@/components/cms-inline-text";
import { StorefrontHeader } from "@/components/storefront-header";
import { SportPageHero } from "@/components/storefront/sport/sport-page-hero";
import { MinimalHeader } from "@/components/storefront/minimal";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { applyThemePlaceholdersToDefaults } from "@/lib/cms/theme-placeholders";
import { getStoreBrandName } from "@/lib/store-brand";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

const fallbackStats = [
  { value: "100 000+", label: "Nöjda kunder" },
  { value: "250+", label: "Premium varumärken" },
  { value: "4,8 / 5", label: "Snitt i betyg" },
  { value: "10+", label: "År av passion" },
];

const fallbackValues = [
  {
    title: "Kvalitet utan kompromisser",
    text: "Vi väljer produkter vi själva använder och litar på. Hög kvalitet, alltid.",
  },
  {
    title: "Hållbart i fokus",
    text: "Vi jobbar aktivt för en mer hållbar framtid - för oss och kommande generationer.",
  },
  {
    title: "För alla, varje dag",
    text: "Oavsett nivå eller mål finns vi här för att stötta din resa - varje steg på vägen.",
  },
  {
    title: "Prestation & utveckling",
    text: "Vi inspirerar till rörelse, utveckling och att bli den bästa versionen av dig själv.",
  },
];

const fallbackTeamMembers = [
  { name: "Markus Lind", role: "Grundare & CEO" },
  { name: "Sara Eriksson", role: "Produkt & Sortiment" },
  { name: "Daniel Berg", role: "Kundupplevelse" },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M15 18a4.3 4.3 0 0 1 5.5-3.9" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
      <path d="M4 8.5V16l8 4 8-4V8.5" />
      <path d="M12 13v7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3.6 2.6 5.2 5.8.8-4.2 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8L3.6 9.6l5.8-.8L12 3.6Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="9" r="4" />
      <path d="m9.5 13.5-1.6 6L12 17l4.1 2.5-1.6-6" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 4c-7.5.3-12.1 3.6-13.6 10.2-.5 2.1.6 4.3 2.7 5 6.5 2 11.3-2.7 10.9-15.2Z" />
      <path d="M8 14c2.3-1.8 4.9-3.2 7.8-4.2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.2C4.8 15.3 3.5 10.7 5.1 7.8A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 6.9 1.2c1.6 2.9.3 7.5-6.9 12.4Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13.5 2 6 13h5l-1 9 8-12h-5l.5-8Z" />
    </svg>
  );
}

export default async function OmOssPage() {
  const definition = getCmsPage("om-oss");
  const brandName = await getStoreBrandName();
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const isLuxury = themeKey === "luxury";
  const rawFallback = definition ? createDefaultBlocksContent(definition) : {};
  const fallbackBlocks = applyThemePlaceholdersToDefaults("om-oss", themeKey, rawFallback);
  const cms = await getPublishedPageContent("om-oss", { blocks: fallbackBlocks });
  const stats = fallbackStats.map((item, index) => {
    const itemNumber = index + 1;
    return {
      value: getCmsBlockField(cms.blocks, "stats", `item${itemNumber}Value`, item.value),
      label: getCmsBlockField(cms.blocks, "stats", `item${itemNumber}Label`, item.label),
    };
  });
  const values = fallbackValues.map((item, index) => {
    const itemNumber = index + 1;
    return {
      title: getCmsBlockField(cms.blocks, "values", `item${itemNumber}Title`, item.title),
      text: getCmsBlockField(cms.blocks, "values", `item${itemNumber}Text`, item.text),
    };
  });
  const teamMembers = fallbackTeamMembers.map((item, index) => {
    const itemNumber = index + 1;
    return {
      name: getCmsBlockField(cms.blocks, "story", `member${itemNumber}Name`, item.name),
      role: getCmsBlockField(cms.blocks, "story", `member${itemNumber}Role`, item.role),
    };
  });

  const isSport = themeKey === "sport";
  const isMinimal = themeKey === "minimal";

  if (isMinimal) {
    const navLinks = getStorefrontConfig(themeKey).navItems;
    return (
      <main className="bg-white">
        <MinimalHeader brandName={brandName} links={navLinks} activeNav="Om oss" />

        {/* Hero (Apple, centrerad) */}
        <section className="px-6 pt-20 pb-16 text-center">
          <CmsInlineText
            as="p"
            blockKey="hero"
            fieldKey="eyebrow"
            className="text-[19px] font-semibold tracking-[-0.01em] text-[#0066CC]"
            value={getCmsBlockField(cms.blocks, "hero", "eyebrow", `Om ${brandName}`)}
          />
          <CmsInlineText
            as="h1"
            blockKey="hero"
            fieldKey="title"
            className="mx-auto mt-3 max-w-[900px] whitespace-pre-line font-semibold tracking-[-0.03em] text-[#1D1D1F]"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.05 }}
            value={getCmsBlockField(cms.blocks, "hero", "title", "Skapat med omtanke.\nByggt för att hålla.")}
          />
          <CmsInlineText
            as="p"
            blockKey="hero"
            fieldKey="description"
            className="mx-auto mt-5 max-w-[640px] text-[19px] leading-relaxed text-[#6E6E73] sm:text-[21px]"
            value={getCmsBlockField(cms.blocks, "hero", "description", `${brandName} föddes ur en passion för enkelhet, kvalitet och funktion.`)}
          />
        </section>

        {/* Stats */}
        <section className="bg-[#F5F5F7] px-6 py-16">
          <div className="mx-auto grid max-w-[1024px] grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <CmsInlineText as="p" blockKey="stats" fieldKey={`item${index + 1}Value`}
                  className="text-[40px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[48px]" value={stat.value} />
                <CmsInlineText as="p" blockKey="stats" fieldKey={`item${index + 1}Label`}
                  className="mt-2 text-[15px] text-[#6E6E73]" value={stat.label} />
              </div>
            ))}
          </div>
        </section>

        {/* Värderingar */}
        <section className="px-6 py-16">
          <CmsInlineText as="h2" blockKey="values" fieldKey="title"
            className="text-center text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[40px]"
            value={getCmsBlockField(cms.blocks, "values", "title", "Det vi tror på")} />
          <div className="mx-auto mt-10 grid max-w-[1024px] gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <article key={value.title} className="rounded-[18px] bg-[#F5F5F7] p-8 text-center">
                <CmsInlineText as="h3" blockKey="values" fieldKey={`item${index + 1}Title`}
                  className="text-[21px] font-semibold tracking-[-0.01em] text-[#1D1D1F]" value={value.title} />
                <CmsInlineText as="p" blockKey="values" fieldKey={`item${index + 1}Text`}
                  className="mt-3 text-[15px] leading-relaxed text-[#6E6E73]" value={value.text} />
              </article>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-[#F5F5F7] px-6 py-16">
          <CmsInlineText as="h2" blockKey="story" fieldKey="teamTitle"
            className="text-center text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[40px]"
            value={getCmsBlockField(cms.blocks, "story", "teamTitle", "Människorna bakom")} />
          <div className="mx-auto mt-10 grid max-w-[900px] gap-6 sm:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="rounded-[18px] bg-white p-8 text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#ECECEE]" />
                <CmsInlineText as="p" blockKey="story" fieldKey={`member${index + 1}Name`}
                  className="text-[17px] font-semibold text-[#1D1D1F]" value={member.name} />
                <CmsInlineText as="p" blockKey="story" fieldKey={`member${index + 1}Role`}
                  className="mt-1 text-[14px] text-[#6E6E73]" value={member.role} />
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
          <StorefrontHeader activeNav="Om oss" cartCount={0} brandName={brandName} />
          <SportPageHero
            eyebrow={getCmsBlockField(cms.blocks, "hero", "eyebrow", "Om oss")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Mer än en sportbutik.\nEn drivkraft för bättre prestation.")}
            description={getCmsBlockField(cms.blocks, "hero", "description", "Vi föddes ur en passion för träning och viljan att hjälpa dig nå din fulla potential.")}
          />
        </div>
        <section className="border-b border-[#dce9cf]">
          <div className="grid grid-cols-2 divide-x divide-[#dce9cf] lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="px-8 py-10 text-center">
                <CmsInlineText as="p" blockKey="stats" fieldKey={`item${index + 1}Value`}
                  className="text-[38px] font-black leading-none text-[#0a0f08]" value={stat.value} />
                <CmsInlineText as="p" blockKey="stats" fieldKey={`item${index + 1}Label`}
                  className="mt-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#0a0f08]/50" value={stat.label} />
              </div>
            ))}
          </div>
        </section>
        <section className="px-6 py-14 lg:px-10">
          <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#b3ff00]">Vår filosofi</p>
          <CmsInlineText as="h2" blockKey="values" fieldKey="title"
            className="mt-3 text-[32px] font-black uppercase leading-tight text-[#0a0f08]"
            value={getCmsBlockField(cms.blocks, "values", "title", "Det vi står för")} />
          <div className="mt-4 h-1 w-12 bg-[#b3ff00]" />
          <div className="mt-8 grid gap-px bg-[#dce9cf] sm:grid-cols-2">
            {values.map((value, index) => (
              <div key={value.title} className="bg-[#eef5e7] p-8">
                <CmsInlineText as="h3" blockKey="values" fieldKey={`item${index + 1}Title`}
                  className="text-[14px] font-black uppercase tracking-[0.05em] text-[#0a0f08]" value={value.title} />
                <div className="my-3 h-0.5 w-8 bg-[#b3ff00]" />
                <CmsInlineText as="p" blockKey="values" fieldKey={`item${index + 1}Text`}
                  className="text-[13px] font-medium leading-relaxed text-[#0a0f08]/60" value={value.text} />
              </div>
            ))}
          </div>
        </section>
        <section className="border-t border-[#dce9cf] px-6 py-14 lg:px-10">
          <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#b3ff00]">Teamet</p>
          <CmsInlineText as="h2" blockKey="story" fieldKey="teamTitle"
            className="mt-3 text-[32px] font-black uppercase leading-tight text-[#0a0f08]"
            value={getCmsBlockField(cms.blocks, "story", "teamTitle", "Människorna bakom")} />
          <div className="mt-4 h-1 w-12 bg-[#b3ff00]" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="border-t-2 border-[#b3ff00] pt-5">
                <div className="mb-3 h-16 w-16 bg-[#dce9cf]" />
                <CmsInlineText as="p" blockKey="story" fieldKey={`member${index + 1}Name`}
                  className="text-[14px] font-black uppercase text-[#0a0f08]" value={member.name} />
                <CmsInlineText as="p" blockKey="story" fieldKey={`member${index + 1}Role`}
                  className="mt-1 text-[11px] font-bold tracking-[0.1em] uppercase text-[#0a0f08]/50" value={member.role} />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isLuxury) {
    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Om oss" cartCount={0} brandName={brandName} />
          <div className="px-8 py-20 sm:px-12 lg:px-14 border-b border-white/8">
            <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Maison</p>
            <CmsInlineText
              as="h1"
              blockKey="hero"
              fieldKey="title"
              className="mt-4 text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(44px, 5.5vw, 80px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.05 }}
              value={getCmsBlockField(cms.blocks, "hero", "title", `L'histoire de ${brandName}`)}
            />
            <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
            <CmsInlineText
              as="p"
              blockKey="hero"
              fieldKey="description"
              className="mt-6 max-w-[560px] text-[15px] font-light leading-relaxed text-white/55"
              value={getCmsBlockField(cms.blocks, "hero", "description", `${brandName} — en passion för det exceptionella, sedan grundandet.`)}
            />
          </div>
        </div>

        {/* Stats */}
        <section className="border-b border-[#EDE5DC]">
          <div className="grid grid-cols-2 divide-x divide-[#EDE5DC] lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="px-10 py-12 text-center">
                <CmsInlineText
                  as="p"
                  blockKey="stats"
                  fieldKey={`item${index + 1}Value`}
                  className="font-light text-[#17120d]"
                  style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
                  value={stat.value}
                />
                <CmsInlineText
                  as="p"
                  blockKey="stats"
                  fieldKey={`item${index + 1}Label`}
                  className="mt-2 text-[11px] font-light tracking-[0.2em] uppercase text-[#5f4a3a]"
                  value={stat.label}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Värderingar */}
        <section className="px-8 py-16 sm:px-12 lg:px-14">
          <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Nos valeurs</p>
          <CmsInlineText
            as="h2"
            blockKey="values"
            fieldKey="title"
            className="mt-4 text-3xl font-light tracking-[-0.02em] text-[#17120d] lg:text-4xl"
            value={getCmsBlockField(cms.blocks, "values", "title", "Det vi tror på")}
          />
          <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          <div className="mt-10 grid gap-px bg-[#EDE5DC] border border-[#EDE5DC] sm:grid-cols-2">
            {values.map((value, index) => (
              <div key={value.title} className="bg-[#FAF8F5] p-8">
                <CmsInlineText
                  as="h3"
                  blockKey="values"
                  fieldKey={`item${index + 1}Title`}
                  className="text-[13px] font-light tracking-[0.05em] text-[#17120d]"
                  value={value.title}
                />
                <div className="my-4 h-px w-8 bg-[#C41E3A]" />
                <CmsInlineText
                  as="p"
                  blockKey="values"
                  fieldKey={`item${index + 1}Text`}
                  className="text-[12px] font-light leading-relaxed text-[#5f4a3a]"
                  value={value.text}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-[#EDE5DC] px-8 py-16 sm:px-12 lg:px-14">
          <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">L'équipe</p>
          <CmsInlineText
            as="h2"
            blockKey="story"
            fieldKey="teamTitle"
            className="mt-4 text-3xl font-light tracking-[-0.02em] text-[#17120d] lg:text-4xl"
            value={getCmsBlockField(cms.blocks, "story", "teamTitle", "Människorna bakom")}
          />
          <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="border-t border-[#EDE5DC] pt-6">
                <div className="mb-4 h-20 w-20 bg-[#EDE5DC]" />
                <CmsInlineText
                  as="p"
                  blockKey="story"
                  fieldKey={`member${index + 1}Name`}
                  className="text-[13px] font-light tracking-[0.05em] text-[#17120d]"
                  value={member.name}
                />
                <CmsInlineText
                  as="p"
                  blockKey="story"
                  fieldKey={`member${index + 1}Role`}
                  className="mt-1 text-[11px] font-light tracking-[0.15em] uppercase text-[#5f4a3a]"
                  value={member.role}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader activeNav="Om oss" cartCount={0} brandName={brandName} />

          <section className="grid border-b border-[#e6ddd1] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4 p-7 lg:p-8">
              <CmsInlineText
                as="p"
                blockKey="hero"
                fieldKey="eyebrow"
                className="text-xs font-semibold uppercase tracking-wide text-[#b88f50]"
                value={getCmsBlockField(cms.blocks, "hero", "eyebrow", `Om ${brandName}`)}
              />
              <CmsInlineText
                as="h1"
                blockKey="hero"
                fieldKey="title"
                className="max-w-[680px] whitespace-pre-line text-5xl font-semibold leading-[1.06] text-slate-900 lg:text-[58px]"
                value={getCmsBlockField(cms.blocks, "hero", "title", "Mer än en sportbutik.\nEn drivkraft för bättre prestation.")}
              />
              <CmsInlineText
                as="p"
                blockKey="hero"
                fieldKey="description"
                className="max-w-[560px] text-[30px] leading-relaxed text-slate-700"
                value={getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  `${brandName} föddes ur en passion för träning, rörelse och viljan att hjälpa människor att nå sin fulla potential.`,
                )}
              />
              <button className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">
                <CmsInlineText
                  as="span"
                  blockKey="hero"
                  fieldKey="ctaLabel"
                  value={getCmsBlockField(cms.blocks, "hero", "ctaLabel", "Vår historia")}
                />
                <ArrowRightIcon />
              </button>
            </div>
            {getCmsBlockField(cms.blocks, "hero", "imageUrl", "").trim() ? (
              <div className="relative min-h-[340px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCmsBlockField(cms.blocks, "hero", "imageUrl", "")}
                  alt="Om oss hero"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative min-h-[340px] overflow-hidden bg-gradient-to-br from-[#5c5953] via-[#2d2a25] to-[#12110f]">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent opacity-90" />
                <div className="absolute -left-6 bottom-8 h-44 w-52 rounded-2xl bg-black/35" />
                <div className="absolute right-20 bottom-8 h-36 w-48 rounded-2xl border border-white/10 bg-[#1a1713]/80" />
                <div className="absolute right-6 bottom-10 h-44 w-24 rounded-[18px] border border-white/15 bg-black/45" />
              </div>
            )}
          </section>

          <section className="grid border-b border-[#e6ddd1] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <article key={item.label} className="border-t border-[#ece3d7] px-5 py-5 sm:border-r sm:last:border-r-0 sm:border-t-0">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[#c19a5e]">
                    {index === 0 ? <UsersIcon /> : null}
                    {index === 1 ? <BoxIcon /> : null}
                    {index === 2 ? <StarIcon /> : null}
                    {index === 3 ? <CalendarIcon /> : null}
                  </span>
                  <div>
                    <CmsInlineText
                      as="p"
                      blockKey="stats"
                      fieldKey={`item${index + 1}Value`}
                      className="text-[44px] font-semibold leading-none text-slate-900"
                      value={item.value}
                    />
                    <CmsInlineText
                      as="p"
                      blockKey="stats"
                      fieldKey={`item${index + 1}Label`}
                      className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                      value={item.label}
                    />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 border-b border-[#e6ddd1] p-7 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <CmsInlineText
                as="p"
                blockKey="values"
                fieldKey="eyebrow"
                className="text-xs font-semibold uppercase tracking-wide text-[#b88f50]"
                value={getCmsBlockField(cms.blocks, "values", "eyebrow", "Våra värderingar")}
              />
              <CmsInlineText
                as="h2"
                blockKey="values"
                fieldKey="title"
                className="mt-1 text-5xl font-semibold tracking-tight text-slate-900"
                value={getCmsBlockField(cms.blocks, "values", "title", "Det vi står för")}
              />
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {values.map((item, index) => (
                  <article key={item.title}>
                    <span className="text-[#c19a5e]">
                      {index === 0 ? <AwardIcon /> : null}
                      {index === 1 ? <LeafIcon /> : null}
                      {index === 2 ? <HeartIcon /> : null}
                      {index === 3 ? <BoltIcon /> : null}
                    </span>
                    <CmsInlineText
                      as="p"
                      blockKey="values"
                      fieldKey={`item${index + 1}Title`}
                      className="mt-2 text-[31px] font-semibold leading-tight text-slate-900"
                      value={item.title}
                    />
                    <CmsInlineText
                      as="p"
                      blockKey="values"
                      fieldKey={`item${index + 1}Text`}
                      className="mt-1 text-[15px] leading-relaxed text-slate-600"
                      value={item.text}
                    />
                  </article>
                ))}
              </div>
            </div>
            {getCmsBlockField(cms.blocks, "values", "imageUrl", "").trim() ? (
              <div className="min-h-[320px] overflow-hidden rounded-xl border border-[#e6ddd1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCmsBlockField(cms.blocks, "values", "imageUrl", "")}
                  alt="Värderingar bild"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="min-h-[320px] rounded-xl border border-[#e6ddd1] bg-gradient-to-br from-[#7a756e] via-[#57524c] to-[#312d28]" />
            )}
          </section>

          <section className="grid gap-5 p-7 lg:grid-cols-[1.1fr_0.85fr_1.05fr]">
            <article className="rounded-xl bg-gradient-to-r from-[#0f0f0f] to-[#1b1713] p-5 text-white">
              <CmsInlineText
                as="p"
                blockKey="story"
                fieldKey="historyEyebrow"
                className="text-xs font-semibold uppercase tracking-wide text-[#c8a164]"
                value={getCmsBlockField(cms.blocks, "story", "historyEyebrow", "Vår historia")}
              />
              <CmsInlineText
                as="h3"
                blockKey="story"
                fieldKey="historyTitle"
                className="mt-1 text-5xl font-semibold tracking-tight"
                value={getCmsBlockField(cms.blocks, "story", "historyTitle", "Från idé till rörelse")}
              />
              <CmsInlineText
                as="p"
                blockKey="story"
                fieldKey="historyText"
                className="mt-2 text-sm text-white/75"
                value={getCmsBlockField(
                  cms.blocks,
                  "story",
                  "historyText",
                  `Allt började 2014 med en enkel idé: att samla de bästa produkterna för träning och aktiv livsstil på ett ställe. Idag är ${brandName} en av Nordens snabbast växande sportbutiker.`,
                )}
              />
              <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#c8a164] px-4 py-2 text-sm font-semibold text-[#c8a164]">
                <CmsInlineText
                  as="span"
                  blockKey="story"
                  fieldKey="historyCtaLabel"
                  value={getCmsBlockField(cms.blocks, "story", "historyCtaLabel", "Läs hela vår resa")}
                />
                <ArrowRightIcon />
              </button>
            </article>

            <article className="rounded-xl border border-[#e6ddd1] bg-white p-5">
              <CmsInlineText
                as="h3"
                blockKey="story"
                fieldKey="teamTitle"
                className="text-4xl font-semibold"
                value={getCmsBlockField(cms.blocks, "story", "teamTitle", `Team ${brandName}`)}
              />
              <CmsInlineText
                as="p"
                blockKey="story"
                fieldKey="teamText"
                className="mt-2 text-sm text-slate-600"
                value={getCmsBlockField(
                  cms.blocks,
                  "story",
                  "teamText",
                  "Vi är ett team av träningsexperter, coacher och problemlösare som brinner för att ge dig den bästa upplevelsen - varje dag.",
                )}
              />
              <button className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#b88f50]">
                <CmsInlineText
                  as="span"
                  blockKey="story"
                  fieldKey="teamCtaLabel"
                  value={getCmsBlockField(cms.blocks, "story", "teamCtaLabel", "Möt teamet")}
                />
                <ArrowRightIcon />
              </button>
            </article>

            <div className="space-y-3">
              {getCmsBlockField(cms.blocks, "story", "historyImageUrl", "").trim() ? (
                <div className="h-44 overflow-hidden rounded-xl border border-[#e6ddd1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCmsBlockField(cms.blocks, "story", "historyImageUrl", "")}
                    alt="Historia bild"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 rounded-xl border border-[#e6ddd1] bg-gradient-to-br from-[#6d6861] via-[#58534c] to-[#2f2a25]" />
              )}
              <div className="grid grid-cols-3 gap-2">
                {teamMembers.map((member, index) => (
                  <article key={member.name} className="space-y-1">
                    {getCmsBlockField(cms.blocks, "story", `member${index + 1}ImageUrl`, "").trim() ? (
                      <div className="h-24 overflow-hidden rounded-lg border border-[#e6ddd1]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCmsBlockField(cms.blocks, "story", `member${index + 1}ImageUrl`, "")}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg border border-[#e6ddd1] bg-gradient-to-br from-[#6b665f] via-[#5b5650] to-[#3a352f]" />
                    )}
                    <CmsInlineText
                      as="p"
                      blockKey="story"
                      fieldKey={`member${index + 1}Name`}
                      className="text-sm font-semibold"
                      value={member.name}
                    />
                    <CmsInlineText
                      as="p"
                      blockKey="story"
                      fieldKey={`member${index + 1}Role`}
                      className="text-xs text-slate-500"
                      value={member.role}
                    />
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
