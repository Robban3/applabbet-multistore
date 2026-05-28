import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";

type ShippingOption = {
  carrier: string;
  brand: string;
  description: string;
  eta: string;
  price: string;
  freeText: string;
};

type DeliveryInfoItem = {
  title: string;
  text: string;
};

const fallbackShippingOptions = [
  {
    carrier: "postnord",
    brand: "PostNord - Hemleverans",
    description: "Leverans direkt till din dörr eller brevlåda.\nSpårbart hela vägen.",
    eta: "1-3 arbetsdagar",
    price: "49 kr",
    freeText: "Fri frakt över 499 kr",
  },
  {
    carrier: "postnord",
    brand: "PostNord - Till ombud",
    description: "Levereras till ditt närmaste ombud.\nDu får ett SMS när paketet finns att hämta.",
    eta: "1-3 arbetsdagar",
    price: "39 kr",
    freeText: "Fri frakt över 499 kr",
  },
  {
    carrier: "DHL",
    brand: "DHL - Expressleverans",
    description: "För dig som vill ha det ännu snabbare.\nLeverans inom kl. 12 nästa arbetsdag.",
    eta: "1 arbetsdag",
    price: "129 kr",
    freeText: "Fri frakt över 999 kr",
  },
];

const fallbackDeliveryInfo = [
  { title: "Order före kl. 14.00", text: "Vi packar och skickar din order samma dag (vardagar)." },
  { title: "1-3 arbetsdagar", text: "Normal leveranstid för alla standardleveranser." },
  { title: "Hela Sverige", text: "Vi levererar till hela Sverige, inkl. öar och glesbygd." },
  { title: "Spåra din order", text: "Du får ett spårningsnummer via mejl så snart din order skickats." },
];

const fallbackGoodToKnow = [
  { title: "Fraktkostnad", text: "Fri frakt gäller för ordrar över 499 kr.\nUnder 499 kr tillkommer frakt enligt valt fraktmetod." },
  { title: "Utebliven leverans", text: "Om du inte är hemma lämnas paketet hos din närmaste ombud.\nDu får alltid en avisering." },
  { title: "Skadad leverans", text: "Kontrollera paketet vid leverans.\nVid skada, kontakta oss direkt så hjälper vi dig." },
  { title: "Hållbart leveransval", text: "Vi arbetar aktivt för att minska vår miljöpåverkan\noch väljer hållbara leveranslösningar." },
];

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}

function CardIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 9h16" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8l8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

function TrustIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 5v5h-5" />
        <path d="M4 19v-5h5" />
        <path d="M19 10a7 7 0 0 0-12-3" />
        <path d="M5 14a7 7 0 0 0 12 3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
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

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function LeveransPage() {
  const definition = getCmsPage("leverans");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("leverans", { blocks: fallbackBlocks });
  const shippingOptionsFromCms: ShippingOption[] = fallbackShippingOptions.map((fallback, index) => {
    const prefix = `option${index + 1}`;
    return {
      carrier: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}Carrier`, fallback.carrier),
      brand: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}Brand`, fallback.brand),
      description: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}Description`, fallback.description),
      eta: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}Eta`, fallback.eta),
      price: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}Price`, fallback.price),
      freeText: getCmsBlockField(cms.blocks, "shippingOptions", `${prefix}FreeText`, fallback.freeText),
    };
  });
  const deliveryInfoFromCms: DeliveryInfoItem[] = fallbackDeliveryInfo.map((fallback, index) => {
    const prefix = `item${index + 1}`;
    return {
      title: getCmsBlockField(cms.blocks, "deliveryTimes", `${prefix}Title`, fallback.title),
      text: getCmsBlockField(cms.blocks, "deliveryTimes", `${prefix}Text`, fallback.text),
    };
  });
  const goodToKnowFromCms: DeliveryInfoItem[] = fallbackGoodToKnow.map((fallback, index) => ({
    title: getCmsBlockField(cms.blocks, "goodToKnow", `item${index + 1}Title`, fallback.title),
    text: getCmsBlockField(cms.blocks, "goodToKnow", `item${index + 1}Text`, fallback.text),
  }));
  const trustBottom = [1, 2, 3, 4]
    .map((index) => ({
      title: getCmsBlockField(cms.blocks, "trustBottom", `item${index}Title`, ""),
      text: getCmsBlockField(cms.blocks, "trustBottom", `item${index}Text`, ""),
    }))
    .filter((item) => item.title.trim().length > 0);
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

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[6px] border border-[#ece7de] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <StorefrontHeader activeNav="Kundservice" cartCount={3} />

          <section className="grid border-b border-[#ebe5da] lg:grid-cols-[1fr_1fr]">
            <div className="space-y-2 px-8 py-8">
              <p className="text-xs text-slate-500">
                <Link href="/kundservice" className="hover:text-slate-700">
                  {getCmsBlockField(cms.blocks, "sections", "breadcrumbRoot", "Kundservice")}
                </Link>
                <span className="mx-1">›</span>
                <Link href="/leverans" className="hover:text-slate-700">
                  {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Fraktinformation")}
                </Link>
              </p>
              <h1 className="text-[52px] font-semibold leading-[1.03] text-slate-900">
                {getCmsBlockField(cms.blocks, "hero", "title", "Fraktinformation")}
              </h1>
              <p className="max-w-[560px] text-[17px] leading-relaxed text-slate-700">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  "Vi vill att din beställning ska komma fram snabbt, smidigt och tryggt. Här hittar du all information om våra fraktalternativ, leveranstider och vad som gäller för din leverans.",
                )}
              </p>
            </div>
            {getCmsBlockField(cms.blocks, "hero", "imageUrl", "").trim() ? (
              <div className="relative min-h-[250px] overflow-hidden border-l border-[#ebe5da]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCmsBlockField(cms.blocks, "hero", "imageUrl", "")}
                  alt="Leverans hero"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative min-h-[250px] overflow-hidden border-l border-[#ebe5da] bg-gradient-to-br from-[#f5f5f5] via-[#d8d6d2] to-[#aca8a1]">
                <div className="absolute right-16 top-8 h-36 w-60 -rotate-[8deg] rounded-md bg-[#11100e] shadow-2xl" />
                <div className="absolute right-2 top-8 h-44 w-36 rounded-md bg-[#11100e]/90" />
                <div className="absolute right-24 top-24 h-24 w-24 rounded bg-black/20" />
              </div>
            )}
          </section>

          <section className="border-b border-[#ebe5da] px-8 py-7">
            <h2 className="text-[42px] font-semibold text-slate-900">
              {getCmsBlockField(cms.blocks, "sections", "shippingTitle", "Våra fraktalternativ")}
            </h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#ebe5da] bg-white">
              {shippingOptionsFromCms.map((option, index) => (
                <article key={option.brand} className={`grid items-center gap-4 px-4 py-4 md:grid-cols-[0.95fr_1.9fr_1fr_0.9fr] ${index > 0 ? "border-t border-[#ebe5da]" : ""}`}>
                  <div>
                    <p className="text-[24px] font-semibold text-slate-900">{option.carrier}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-900">{option.brand}</p>
                    <p className="whitespace-pre-line text-[13px] text-slate-600">{option.description}</p>
                  </div>
                  <p className="inline-flex items-center gap-2 text-[13px] text-slate-700"><ClockIcon />{option.eta}</p>
                  <div className="text-right">
                    <p className="text-[31px] font-semibold text-slate-900">{option.price}</p>
                    <p className="text-[12px] text-slate-500">{option.freeText}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="border-b border-[#ebe5da] px-8 py-7">
            <h2 className="text-[42px] font-semibold text-slate-900">
              {getCmsBlockField(cms.blocks, "sections", "deliveryTimesTitle", "Leveranstider")}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {deliveryInfoFromCms.map((item, index) => (
                <article key={item.title} className="rounded-md border border-[#ebe5da] bg-white px-4 py-3">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200">
                    <CardIcon index={index} />
                  </div>
                  <p className="text-[14px] font-semibold text-slate-900">{item.title}</p>
                  <p className="text-[13px] leading-relaxed text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-b border-[#ebe5da] px-8 py-7">
            <h2 className="text-[42px] font-semibold text-slate-900">
              {getCmsBlockField(cms.blocks, "sections", "goodToKnowTitle", "Bra att veta")}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {goodToKnowFromCms.map((item, index) => (
                <article key={item.title} className="rounded-md border border-[#ebe5da] bg-white px-4 py-3">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200">
                    <CardIcon index={index} />
                  </div>
                  <p className="text-[14px] font-semibold text-slate-900">{item.title}</p>
                  <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
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

          <section className="grid overflow-hidden bg-gradient-to-r from-[#0f0f0f] to-[#171717] sm:grid-cols-2 lg:grid-cols-4">
            {trustBottom.map((item, index) => (
              <article key={item.title} className="flex items-center gap-3 border-t border-white/10 px-5 py-3 text-white sm:border-r sm:last:border-r-0 sm:border-t-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <TrustIcon index={Math.min(index, 2)} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold">{item.title}</p>
                  <p className="text-[12px] text-white/70">{item.text}</p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
