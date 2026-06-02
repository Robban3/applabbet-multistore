import { LegalHero } from "@/components/legal-hero";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, loadThemedCmsPageContent, loadThemedCmsPageContentForCurrentTenant } from "@/lib/cms/content";
import { getStoreBrandName } from "@/lib/store-brand";

function SectionIcon({ index }: { index: number }) {
  if (index % 4 === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }
  if (index % 4 === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.8-3.1 4.3-4.7 7-4.7s5.2 1.6 7 4.7" />
      </svg>
    );
  }
  if (index % 4 === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 19 6v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
    </svg>
  );
}

export default async function GdprPage() {
  const cms = await loadThemedCmsPageContentForCurrentTenant("gdpr");
  const brandName = await getStoreBrandName();

  const tocItems = Array.from({ length: 8 }, (_, index) => ({
    id: `section-${index + 1}`,
    label: getCmsBlockField(cms.blocks, "toc", `item${index + 1}`, `Punkt ${index + 1}`),
  }));

  const sections = Array.from({ length: 8 }, (_, index) => ({
    id: `section-${index + 1}`,
    title: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Title`, `Sektion ${index + 1}`),
    text: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Text`, "").replaceAll("Applabbet", brandName),
  }));

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <StorefrontHeader cartCount={0} />

          <LegalHero
            currentHref="/gdpr"
            currentLabel={getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "GDPR / Dataskydd")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "GDPR / Dataskydd")}
            subtitle={getCmsBlockField(
              cms.blocks,
              "hero",
              "subtitle",
              "Så här behandlar vi dina personuppgifter i enlighet med GDPR.",
            )}
          />

          <section className="grid gap-6 px-8 py-8 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-lg border border-[#e8e1d6] bg-[#fbf8f3] p-4 lg:sticky lg:top-6">
              <p className="text-sm font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "toc", "title", "GDPR / Dataskydd")}
              </p>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                {tocItems.map((item, index) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="inline-flex items-start gap-2 hover:text-slate-900">
                      <span className="mt-[1px] text-[#c8a164]">{index + 1}.</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <article key={section.id} id={section.id} className="scroll-mt-20">
                  <div className="grid grid-cols-[48px_1fr] gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e8e1d6] bg-[#faf6ef] text-slate-900">
                      <SectionIcon index={index} />
                    </span>
                    <div>
                      <h2 className="text-[36px] font-semibold leading-tight text-slate-900">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{section.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
