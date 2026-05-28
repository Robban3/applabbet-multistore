import { LegalHero } from "@/components/legal-hero";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";

function SectionIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.8-3.1 4.3-4.7 7-4.7s5.2 1.6 7 4.7" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="10" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3.5 19c1.3-2.8 3.2-4.2 5.5-4.2s4.2 1.4 5.5 4.2" />
        <path d="M14.3 16.8c.8-1.6 2-2.4 3.6-2.4 1.4 0 2.6.8 3.4 2.4" />
      </svg>
    );
  }
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 19 6v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      </svg>
    );
  }
  if (index === 5) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }
  if (index === 6) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }
  if (index === 7) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20h16" />
        <path d="m8 16 8-8" />
        <path d="m15 7 2 2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  );
}

export default async function IntegritetspolicyPage() {
  const definition = getCmsPage("integritetspolicy");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("integritetspolicy", { blocks: fallbackBlocks });
  const brandName = await getStoreBrandName();

  const tocItems = Array.from({ length: 9 }, (_, index) => ({
    id: `section-${index + 1}`,
    label: getCmsBlockField(cms.blocks, "toc", `item${index + 1}`, `Punkt ${index + 1}`),
  }));

  const sections = Array.from({ length: 9 }, (_, index) => ({
    id: `section-${index + 1}`,
    title: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Title`, `Sektion ${index + 1}`),
    text: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Text`, "")
      .replaceAll("Applabbet", brandName),
  }));

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <StorefrontHeader cartCount={0} />

          <LegalHero
            currentHref="/integritetspolicy"
            currentLabel={getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Integritetspolicy")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Integritetspolicy")}
            subtitle={getCmsBlockField(
              cms.blocks,
              "hero",
              "subtitle",
              "Så här samlar vi in, använder och skyddar dina personuppgifter.",
            )}
          />

          <section className="grid gap-6 px-8 py-8 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-lg border border-[#e8e1d6] bg-[#fbf8f3] p-4 lg:sticky lg:top-6">
              <p className="text-sm font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "toc", "title", "Innehåll")}
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
