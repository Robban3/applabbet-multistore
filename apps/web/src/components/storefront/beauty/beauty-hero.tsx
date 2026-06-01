import Link from "next/link";

type BeautyHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  heroImageUrl?: string;
};

/** KICKS.se-stil hero: full-bleed bakgrundsbild med textoverlay. */
export function BeautyHero({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  heroImageUrl,
}: BeautyHeroProps) {
  return (
    <section className="relative min-h-[440px] overflow-hidden bg-[#34202b] lg:min-h-[560px]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
      <div className="relative mx-auto flex min-h-[440px] max-w-[1320px] flex-col justify-center px-4 py-12 sm:px-6 lg:min-h-[560px]">
        <div className="max-w-[560px]">
          {eyebrow ? (
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#FF4DAE]">{eyebrow}</p>
          ) : null}
          <h1
            className="mt-3 whitespace-pre-line font-extrabold uppercase tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.0 }}
          >
            {title}
          </h1>
          {description ? <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-white/85">{description}</p> : null}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={primaryCtaHref} className="inline-flex h-12 items-center rounded-full bg-[#EC008C] px-7 text-[15px] font-bold uppercase tracking-[0.02em] text-white transition hover:bg-[#d1007d]">
              {primaryCtaLabel}
            </Link>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Link href={secondaryCtaHref} className="inline-flex h-12 items-center rounded-full border border-white px-7 text-[15px] font-bold uppercase tracking-[0.02em] text-white transition hover:bg-white hover:text-[#1A1A1A]">
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
