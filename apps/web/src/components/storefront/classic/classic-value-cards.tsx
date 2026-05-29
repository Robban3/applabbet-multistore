export type ClassicValueCard = {
  title: string;
  text: string;
};

export type ClassicValueCardsProps = {
  cards: ClassicValueCard[];
};

function ValueCardIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#8a6a44]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3v18" />
        <path d="M5 10c3 0 4-2 7-2s4 2 7 2" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#8a6a44]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-5h4" />
        <path d="M4 13h4v5H6a2 2 0 0 1-2-2v-3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#8a6a44]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  );
}

export function ClassicValueCards({ cards }: ClassicValueCardsProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="rounded-[22px] border border-black/10 bg-[#faf7f2] p-6 shadow-[0_10px_30px_rgba(31,24,18,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <ValueCardIcon index={index} />
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#17120d]">
              {card.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#5f554a]">
              {card.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
