type FashionPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function FashionPageHero({ eyebrow, title, description }: FashionPageHeroProps) {
  return (
    <section className="border-b border-[#E5E1DC] bg-[#FAF9F6] px-8 py-14 lg:px-14 lg:py-20">
      {eyebrow ? (
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A1A1A]/55">{eyebrow}</p>
      ) : null}
      <h1
        className="mt-3 font-light text-[#1A1A1A]"
        style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#1A1A1A]/70">{description}</p>
      ) : null}
    </section>
  );
}
