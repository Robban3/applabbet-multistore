import Link from "next/link";

type MinimalHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  heroImageUrl?: string;
};

/** Apple-stil hero: full-bleed bakgrundsbild med centrerad textoverlay. */
export function MinimalHero({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  heroImageUrl,
}: MinimalHeroProps) {
  return (
    <section className="relative min-h-[460px] overflow-hidden bg-[#1d1d1f] lg:min-h-[600px]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />
      <div className="relative mx-auto flex min-h-[460px] max-w-[980px] flex-col items-center justify-center px-6 py-16 text-center lg:min-h-[600px]">
        {eyebrow ? <p className="text-[19px] font-semibold tracking-[-0.01em] text-white">{eyebrow}</p> : null}
        <h1 className="mx-auto max-w-[900px] whitespace-pre-line font-semibold tracking-[-0.03em] text-white" style={{ fontSize: "clamp(40px, 6.5vw, 80px)", lineHeight: 1.05 }}>
          {title}
        </h1>
        {description ? <p className="mx-auto mt-4 max-w-[640px] text-[19px] tracking-[-0.01em] text-white/90 sm:text-[21px]">{description}</p> : null}
        <div className="mt-7 flex items-center justify-center gap-6">
          <Link href={primaryCtaHref} className="inline-flex h-11 items-center rounded-full bg-[#0071E3] px-6 text-[16px] font-medium text-white transition hover:bg-[#0077ED]">
            {primaryCtaLabel}
          </Link>
          {secondaryCtaHref && secondaryCtaLabel ? (
            <Link href={secondaryCtaHref} className="text-[17px] text-white hover:underline">
              {secondaryCtaLabel} ›
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
