import Link from "next/link";
import { CookieSettingsPanel } from "@/components/cookie-settings-panel";
import { LegalHero } from "@/components/legal-hero";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, loadThemedCmsPageContent, loadThemedCmsPageContentForCurrentTenant } from "@/lib/cms/content";

function CookieTypeIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="5.5" />
        <path d="M12 4v2.3M12 17.7V20M4 12h2.3M17.7 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19V8" />
        <path d="M10 19V5" />
        <path d="M16 19v-8" />
        <path d="M22 19V10" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 14v-4l16-5v4" />
      <path d="M4 10v4l16 5v-4" />
      <path d="M12 8v8" />
    </svg>
  );
}

export default async function CookiesPage() {
  const cms = await loadThemedCmsPageContentForCurrentTenant("cookies");

  const cookieTypes = [
    {
      title: getCmsBlockField(cms.blocks, "types", "necessaryTitle", "Nödvändiga cookies"),
      text: getCmsBlockField(
        cms.blocks,
        "types",
        "necessaryText",
        "Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.",
      ),
      badge: getCmsBlockField(cms.blocks, "types", "necessaryBadge", "Alltid aktiva"),
    },
    {
      title: getCmsBlockField(cms.blocks, "types", "analyticsTitle", "Prestanda- och analyscookies"),
      text: getCmsBlockField(cms.blocks, "types", "analyticsText", "Dessa cookies hjälper oss att förstå hur webbplatsen används."),
      badge: "",
    },
    {
      title: getCmsBlockField(cms.blocks, "types", "functionalTitle", "Funktionella cookies"),
      text: getCmsBlockField(cms.blocks, "types", "functionalText", "Dessa cookies möjliggör utökad funktionalitet och personalisering."),
      badge: "",
    },
    {
      title: getCmsBlockField(cms.blocks, "types", "marketingTitle", "Marknadsföringscookies"),
      text: getCmsBlockField(cms.blocks, "types", "marketingText", "Dessa cookies används för relevanta annonser och kampanjuppföljning."),
      badge: "",
    },
  ];

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <StorefrontHeader cartCount={0} />

          <LegalHero
            currentHref="/cookies"
            currentLabel={getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Cookies")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Cookies")}
            subtitle={getCmsBlockField(
              cms.blocks,
              "hero",
              "subtitle",
              "Information om hur vi använder cookies och liknande tekniker på vår webbplats.",
            )}
          />

          <section className="space-y-7 px-8 py-8">
            <article>
              <h2 className="text-[38px] font-semibold leading-tight text-slate-900">
                1. {getCmsBlockField(cms.blocks, "intro", "title", "Vad är cookies?")}
              </h2>
              <p className="mt-1 max-w-[980px] text-[15px] leading-relaxed text-slate-700">
                {getCmsBlockField(
                  cms.blocks,
                  "intro",
                  "text",
                  "Cookies är små textfiler som lagras på din enhet när du besöker en webbplats.",
                )}
              </p>
            </article>

            <article>
              <h2 className="text-[38px] font-semibold leading-tight text-slate-900">
                2. {getCmsBlockField(cms.blocks, "types", "title", "Vilka typer av cookies använder vi?")}
              </h2>
              <div className="mt-3 space-y-2 rounded-xl border border-[#e9e1d4] bg-white p-2">
                {cookieTypes.map((type, index) => (
                  <div key={type.title} className="grid gap-3 rounded-lg border border-[#f1eadf] bg-[#fffdfa] p-3 md:grid-cols-[52px_1fr_2fr] md:items-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e8dfd1] bg-[#f9f4ec] text-slate-900">
                      <CookieTypeIcon index={index} />
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-[25px] font-semibold text-slate-900">{type.title}</p>
                      {type.badge ? (
                        <span className="rounded-full border border-[#d2c8ba] bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {type.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[14px] leading-relaxed text-slate-700">{type.text}</p>
                  </div>
                ))}
              </div>
            </article>

            <article>
              <h2 className="text-[38px] font-semibold leading-tight text-slate-900">
                3. {getCmsBlockField(cms.blocks, "manage", "title", "Hantera dina cookieinställningar")}
              </h2>
              <p className="mt-1 max-w-[980px] text-[15px] leading-relaxed text-slate-700">
                {getCmsBlockField(
                  cms.blocks,
                  "manage",
                  "text",
                  "Du kan när som helst ändra eller återkalla ditt samtycke till cookies via vår cookiepanel.",
                )}
              </p>
              <div className="mt-3 flex flex-wrap items-start gap-2">
                <CookieSettingsPanel
                  openButtonLabel={getCmsBlockField(
                    cms.blocks,
                    "manage",
                    "openButtonLabel",
                    "Hantera cookieinställningar",
                  )}
                />
                <Link
                  href="/integritetspolicy"
                  className="inline-flex self-start items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {getCmsBlockField(cms.blocks, "manage", "privacyButtonLabel", "Läs mer om integritet")}
                </Link>
              </div>
            </article>

            <article>
              <h2 className="text-[38px] font-semibold leading-tight text-slate-900">
                4. {getCmsBlockField(cms.blocks, "update", "title", "Uppdateringar")}
              </h2>
              <p className="mt-1 max-w-[980px] text-[15px] leading-relaxed text-slate-700">
                {getCmsBlockField(
                  cms.blocks,
                  "update",
                  "text",
                  "Denna cookiepolicy kan komma att uppdateras. Den senaste versionen finns alltid tillgänglig på denna sida.",
                )}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-semibold">
                  {getCmsBlockField(cms.blocks, "update", "updatedLabel", "Senast uppdaterad:")}
                </span>{" "}
                {getCmsBlockField(cms.blocks, "update", "updatedDate", "24 april 2024")}
              </p>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
