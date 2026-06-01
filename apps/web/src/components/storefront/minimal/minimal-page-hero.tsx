type MinimalPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function MinimalPageHero({ eyebrow, title, description }: MinimalPageHeroProps) {
  return (
    <section className="bg-white px-6 py-16 text-center">
      {eyebrow ? (
        <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#0066CC]">{eyebrow}</p>
      ) : null}
      <h1 className="mx-auto mt-2 max-w-[800px] text-[40px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[56px]" style={{ lineHeight: 1.05 }}>
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-4 max-w-[600px] text-[19px] tracking-[-0.01em] text-[#6E6E73]">{description}</p>
      ) : null}
    </section>
  );
}
