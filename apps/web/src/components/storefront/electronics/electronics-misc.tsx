type ValueCard = { title: string; text: string };

export function ElectronicsBrands({ title, brands }: { title: string; brands: string[] }) {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-[1280px] rounded-[16px] border border-[#DCE6F5] px-8 py-10 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0A2540]/55">{title}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((b) => (
            <span key={b} className="text-[16px] font-bold tracking-[0.06em] text-[#0A2540]/35 transition hover:text-[#0A2540]/70">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ElectronicsValueCards({ cards }: { cards: ValueCard[] }) {
  return (
    <section className="bg-[#F4F7FC] px-6 py-14">
      <div className="mx-auto grid max-w-[1280px] gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[12px] border border-[#DCE6F5] bg-white p-7">
            <h3 className="text-[18px] font-bold text-[#0A2540]">{card.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[#0A2540]/65">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ElectronicsPageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="border-b border-[#DCE6F5] bg-[#F4F7FC] px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        {eyebrow ? <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#2f7dff]">{eyebrow}</p> : null}
        <h1 className="mt-1 text-[32px] font-bold tracking-[-0.02em] text-[#0A2540] lg:text-[44px]">{title}</h1>
        {description ? <p className="mt-3 max-w-[560px] text-[16px] text-[#0A2540]/65">{description}</p> : null}
      </div>
    </section>
  );
}
