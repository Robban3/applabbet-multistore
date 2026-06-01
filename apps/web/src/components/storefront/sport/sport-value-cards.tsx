type ValueCard = { title: string; text: string };

function CardIcon({ index }: { index: number }) {
  const cls = "h-8 w-8 text-[#111]";
  if (index === 0) return (
    <svg viewBox="0 0 32 32" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 4C10 4 6 9 6 14c0 6 10 14 10 14s10-8 10-14c0-5-4-10-10-10Z" />
      <circle cx="16" cy="14" r="3" />
    </svg>
  );
  if (index === 1) return (
    <svg viewBox="0 0 32 32" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 6v20M6 16h20" />
      <circle cx="16" cy="16" r="10" />
    </svg>
  );
  return (
    <svg viewBox="0 0 32 32" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 24l7-14 5 8 4-6 8 12H4Z" />
    </svg>
  );
}

export function SportValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <section className="w-full bg-white px-6 pb-14 lg:px-10">
      <div className="grid gap-px border border-[#e5e5e5] bg-[#e5e5e5] sm:grid-cols-3">
        {cards.map((card, index) => (
          <article key={card.title} className="flex flex-col bg-white px-8 py-10">
            <CardIcon index={index} />
            <h3 className="mt-5 text-[17px] font-medium leading-tight text-[#111]">{card.title}</h3>
            <div className="my-3 h-0.5 w-8 bg-[#b3ff00]" />
            <p className="text-[14px] leading-relaxed text-[#757575]">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
