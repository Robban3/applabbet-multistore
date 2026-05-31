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

export function LuxuryHero({
  eyebrow, title, description,
  primaryCtaHref, primaryCtaLabel,
  secondaryCtaHref, secondaryCtaLabel,
  heroImageUrl,
}: LuxuryHeroProps) {
  return (
    <div className="relative flex min-h-[560px] lg:min-h-[620px]">
      {/* Vänster: text */}
      <div className="relative z-10 flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-14 lg:py-20">
        <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">
          {eyebrow}
        </p>

        <h1 className="mt-6 whitespace-pre-line font-light leading-[1.08] text-white"
          style={{ fontSize: "clamp(48px, 5vw, 80px)", letterSpacing: "-0.02em" }}>
          {title}
        </h1>

        <div className="mt-6 h-px w-12 bg-[#C41E3A]" />

        <p className="mt-6 max-w-[400px] text-[15px] font-light leading-relaxed text-white/60">
          {description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href={primaryCtaHref}
            className="inline-flex items-center gap-3 border border-[#C41E3A] bg-[#C41E3A] px-8 py-3.5 text-[11px] font-light tracking-[0.3em] uppercase text-white transition hover:bg-[#a01830]"
          >
            {primaryCtaLabel}
          </Link>
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center gap-3 border border-white/25 px-8 py-3.5 text-[11px] font-light tracking-[0.3em] uppercase text-white/70 transition hover:border-white hover:text-white"
          >
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      {/* Höger: bild */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        {heroImageUrl ? (
          <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a0d0d] via-[#120908] to-[#0c0806]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(196,30,58,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_70%,rgba(184,150,62,0.08),transparent_50%)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08] via-[#0c0a08]/30 to-transparent" />
      </div>
    </div>
  );
}
