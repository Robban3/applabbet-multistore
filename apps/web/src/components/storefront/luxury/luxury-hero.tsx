import Link from "next/link";

type LuxuryHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  heroImageUrl?: string;
};

/** Cartier-stil hero: full-bleed bakgrundsbild med textoverlay. */
export function LuxuryHero({
  eyebrow, title, description,
  primaryCtaHref, primaryCtaLabel,
  secondaryCtaHref, secondaryCtaLabel,
  heroImageUrl,
}: LuxuryHeroProps) {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#0c0a08] lg:min-h-[640px]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0d0d] via-[#120908] to-[#0c0806]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08]/85 via-[#0c0a08]/45 to-transparent" />
      <div className="relative mx-auto flex min-h-[560px] max-w-[1320px] flex-col justify-center px-8 py-16 lg:min-h-[640px] lg:px-14">
        <div className="max-w-[560px]">
          <p className="text-[10px] font-light tracking-[0.5em] uppercase text-[#C41E3A]">{eyebrow}</p>
          <h1 className="mt-6 whitespace-pre-line leading-[1.05] text-white" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(52px, 5.5vw, 90px)", fontWeight: 300, letterSpacing: "0.01em", fontStyle: "italic" }}>
            {title}
          </h1>
          <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          <p className="mt-6 max-w-[420px] text-[15px] font-light leading-relaxed text-white/70">{description}</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href={primaryCtaHref} className="inline-flex items-center border border-[#C41E3A] bg-[#C41E3A] px-8 py-3.5 text-[11px] font-light tracking-[0.3em] uppercase text-white transition hover:bg-[#a01830]">
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryCtaHref} className="inline-flex items-center border border-white/30 px-8 py-3.5 text-[11px] font-light tracking-[0.3em] uppercase text-white/80 transition hover:border-white hover:text-white">
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
