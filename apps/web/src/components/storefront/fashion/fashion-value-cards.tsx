type ValueCard = { title: string; text: string };

export function FashionValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <section className="bg-[#F5F2ED] px-8 py-20 lg:px-14">
      <div className="grid gap-12 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="border-t border-[#1A1A1A] pt-6">
            <h3 className="text-[17px] tracking-[0.02em] text-[#1A1A1A]">{card.title}</h3>
            <p className="mt-4 text-[14px] leading-relaxed text-[#1A1A1A]/70">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
