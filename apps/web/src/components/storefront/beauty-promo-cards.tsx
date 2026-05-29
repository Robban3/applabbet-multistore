export type BeautyPromoCard = {
  title: string;
  text: string;
  cta: string;
};

export type BeautyPromoCardsProps = {
  cards: BeautyPromoCard[];
};

export function BeautyPromoCards({ cards }: BeautyPromoCardsProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            className="rounded-[14px] border border-[#ecd4dd] bg-gradient-to-br from-[#fff5f8] to-[#f8e8ef] p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a16f84]">
              {card.title}
            </p>

            <p className="mt-2 text-sm text-slate-700">
              {card.text}
            </p>

            <button
              type="button"
              className="mt-4 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {card.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
