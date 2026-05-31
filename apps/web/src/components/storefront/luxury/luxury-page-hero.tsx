type LuxuryPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function LuxuryPageHero({ eyebrow, title, description }: LuxuryPageHeroProps) {
  return (
    <section
      className="border-b border-white/8 px-8 py-16 sm:px-12 lg:px-14 lg:py-20"
      style={{ background: "var(--store-header-gradient)" }}
    >
      {eyebrow ? (
        <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className="mt-4 font-light text-white"
        style={{ fontSize: "clamp(36px, 4vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[560px] text-[14px] font-light leading-relaxed text-white/55">
          {description}
        </p>
      ) : null}
      <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
    </section>
  );
}
