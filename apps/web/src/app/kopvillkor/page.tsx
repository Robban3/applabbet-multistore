import Link from "next/link";
import { LegalHero } from "@/components/legal-hero";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";

function TermsSectionIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h8l4 4v12H6z" />
        <path d="M14 4v4h4" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
        <path d="M6.5 10h11" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
        <path d="M6.5 10h11" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3.5 12.5h17" />
        <path d="M6 8h2.5" />
        <path d="M15 8h2.5" />
        <path d="M8.5 16h7" />
        <path d="M5 10V8a1.5 1.5 0 0 1 1.5-1.5h1.8" />
        <path d="M19 10V8a1.5 1.5 0 0 0-1.5-1.5h-1.8" />
      </svg>
    );
  }
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6.5 8.5h11v9h-11z" />
        <path d="M9.5 8.5V7a2.5 2.5 0 0 1 5 0v1.5" />
      </svg>
    );
  }
  if (index === 5) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 19 6v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h16" />
      <path d="m8 16 8-8" />
      <path d="m15 7 2 2" />
    </svg>
  );
}

export default async function KopvillkorPage() {
  const definition = getCmsPage("kopvillkor");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("kopvillkor", { blocks: fallbackBlocks });

  const tocItems = Array.from({ length: 7 }, (_, index) => ({
    id: `section-${index + 1}`,
    label: getCmsBlockField(cms.blocks, "toc", `item${index + 1}`, `Punkt ${index + 1}`),
  }));

  const sections = Array.from({ length: 7 }, (_, index) => ({
    id: `section-${index + 1}`,
    title: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Title`, `Sektion ${index + 1}`),
    text: getCmsBlockField(cms.blocks, "sections", `section${index + 1}Text`, ""),
  }));

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <StorefrontHeader cartCount={0} />

          <LegalHero
            currentHref="/kopvillkor"
            currentLabel={getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Köpvillkor")}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Köpvillkor")}
            subtitle={getCmsBlockField(
              cms.blocks,
              "hero",
              "subtitle",
              "Här hittar du våra köpvillkor. Genom att handla hos Applabbet accepterar du villkoren som beskrivs nedan.",
            )}
          />

          <section className="grid gap-6 px-8 py-8 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-lg border border-[#e8e1d6] bg-[#fbf8f3] p-4 lg:sticky lg:top-6">
              <p className="text-sm font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "toc", "title", "Köpvillkor")}
              </p>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="inline-flex items-start gap-2 hover:text-slate-900">
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="space-y-2 rounded-xl border border-[#f1ebe2] bg-white">
              {sections.map((section, index) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20 border-b border-[#f1ebe2] px-4 py-4 last:border-b-0"
                >
                  <div className="grid grid-cols-[56px_1fr] gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e8dfd1] bg-[#f9f4ec] text-slate-900">
                      <TermsSectionIcon index={index} />
                    </span>
                    <div>
                      <h2 className="text-[31px] font-semibold leading-tight text-slate-900">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="mt-1 text-[14px] leading-relaxed text-slate-700">{section.text}</p>
                    </div>
                  </div>
                </article>
              ))}

              <section className="m-3 flex flex-col gap-3 rounded-lg border border-[#ece2d4] bg-[#fdfaf5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[22px] font-semibold text-slate-900">
                    {getCmsBlockField(cms.blocks, "support", "title", "Frågor?")}
                  </p>
                  <p className="text-sm text-slate-700">
                    {getCmsBlockField(
                      cms.blocks,
                      "support",
                      "text",
                      "Har du frågor om våra köpvillkor? Kontakta oss så hjälper vi dig.",
                    )}
                  </p>
                </div>
                <Link
                  href={getCmsBlockField(cms.blocks, "support", "buttonHref", "/kundservice")}
                  className="inline-flex items-center justify-center rounded-md border border-[#e3d5c2] bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f9f5ef]"
                >
                  {getCmsBlockField(cms.blocks, "support", "buttonLabel", "Kontakta oss")}
                </Link>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
