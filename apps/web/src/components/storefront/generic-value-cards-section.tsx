type ValueCard = { title: string; text: string };

type GenericValueCardsSectionProps = {
  cards: ValueCard[];
  isSport: boolean;
};

function ValueCardIcon({ index }: { index: number }) {
  if (index === 0) return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3v18" /><path d="M5 10c3 0 4-2 7-2s4 2 7 2" />
    </svg>
  );
  if (index === 1) return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-5h4" />
      <path d="M4 13h4v5H6a2 2 0 0 1-2-2v-3Z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  );
}

export function GenericValueCardsSection({ cards, isSport }: GenericValueCardsSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-5">
      <div
        className="grid gap-4 rounded-[14px] p-5 sm:grid-cols-3"
        style={{ background: isSport ? "#d8ef77" : "var(--store-soft-surface)" }}
      >
        {cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-sm ${isSport ? "bg-[#e5f59a]" : "bg-white"}`}
          >
            <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${isSport ? "border-[#9db92d] text-slate-900" : "border-slate-300 text-slate-600"}`}>
              <ValueCardIcon index={index} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{card.title}</p>
              <p className="mt-0.5 text-[13px] text-slate-600">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
