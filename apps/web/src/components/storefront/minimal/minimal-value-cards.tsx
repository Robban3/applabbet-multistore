type ValueCard = { title: string; text: string };

export function MinimalValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-[1100px] gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[18px] bg-[#F5F5F7] p-8 text-center">
            <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">{card.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6E6E73]">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
