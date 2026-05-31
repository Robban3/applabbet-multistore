type ValueCard = { title: string; text: string };

function CardIcon({ index }: { index: number }) {
  if (index === 0) return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M16 4 C16 4 8 10 8 18 a8 8 0 0 0 16 0 C24 10 16 4 16 4Z" />
      <path d="M16 14 v8 M12 18 h8" />
    </svg>
  );
  if (index === 1) return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 10 v6 l4 4" />
    </svg>
  );
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-[#C41E3A]" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M16 4 L19 13 H28 L21 18.5 L23.5 28 L16 22.5 L8.5 28 L11 18.5 L4 13 H13 Z" />
    </svg>
  );
}

export function LuxuryValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-8 pb-16 sm:px-12 lg:px-14">
      <div className="grid gap-px bg-[#EDE5DC] border border-[#EDE5DC] sm:grid-cols-3">
        {cards.map((card, index) => (
          <article key={card.title} className="flex flex-col items-center bg-[#FAF8F5] px-8 py-12 text-center">
            <CardIcon index={index} />
            <h3 className="mt-6 text-[13px] font-light tracking-[0.1em] text-[#17120d]">{card.title}</h3>
            <div className="my-4 h-px w-6 bg-[#C41E3A]" />
            <p className="text-[12px] font-light leading-relaxed text-[#5f4a3a]">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
