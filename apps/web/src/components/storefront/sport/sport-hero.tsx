import Link from "next/link";

type SportHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  heroImageUrl?: string;
};

export function SportHero({
  eyebrow, title, description,
  primaryCtaHref, primaryCtaLabel,
  secondaryCtaHref, secondaryCtaLabel,
  heroImageUrl,
}: SportHeroProps) {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[#0a0f08] lg:min-h-[88vh]">
      {/* Full-bleed bild */}
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2113] via-[#0d1509] to-[#0a0f08]" />
      )}

      {/* Läsbarhets-gradient i botten */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Innehåll — centrerat i botten (Nike-stil) */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-16 text-center lg:pb-20">
        <p className="text-[13px] font-medium tracking-[0.02em] text-white">
          {eyebrow}
        </p>
        <h1
          className="mt-2 whitespace-pre-line font-black uppercase leading-[0.92] text-white"
          style={{ fontSize: "clamp(56px, 8vw, 120px)", letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        <p className="mt-4 max-w-[460px] text-[15px] font-medium leading-relaxed text-white/80">
          {description}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryCtaHref}
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-[15px] font-medium text-black transition hover:bg-white/85"
          >
            {primaryCtaLabel}
          </Link>
          <Link
            href={secondaryCtaHref}
            className="inline-flex h-12 items-center rounded-full bg-black/40 px-8 text-[15px] font-medium text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-black/60"
          >
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
