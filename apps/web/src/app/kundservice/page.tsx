import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";

const trustBottom = [
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

export default async function KundservicePage() {
  const definition = getCmsPage("kundservice");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("kundservice", { blocks: fallbackBlocks });
  const brandName = await getStoreBrandName();
  const contactCards = [
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
                  Chatta med oss
                </button>
                <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">Skicka e-post</button>
              </div>
            </div>
            <div className="min-h-[300px] bg-gradient-to-br from-[#d4d0cc] via-[#aaa49e] to-[#6f6962]" />
          </section>

          <section className="border-b border-[#e6ddd1] p-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-4xl font-semibold text-slate-900">
                {getCmsBlockField(cms.blocks, "faq", "title", "Vanliga frågor")}
              </h2>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                Se alla frågor
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
            <h2 className="text-4xl font-semibold text-slate-900">Kontakta oss</h2>
            <p className="text-sm text-slate-600">Välj det sätt som passar dig bäst.</p>
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
                <p className="text-2xl font-semibold">30 dagars öppet köp</p>
                <p className="text-sm text-slate-600">Inte nöjd? Inga problem. Du har alltid 30 dagars öppet köp och enkel retur.</p>
              </article>
              <Link href="/returer-aterbetalningar" className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white">
                Till returer & återbetalningar
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
