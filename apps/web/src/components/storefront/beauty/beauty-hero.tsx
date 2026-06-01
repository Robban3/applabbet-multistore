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

/**
 * KICKS.se-stil hero: stor banner med bild till höger och rosa-accentuerad
 * text + CTA-knappar till vänster. Vit/ljus bakgrund.
 */
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
    <section className="bg-[#FBE9F2]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          {eyebrow ? (
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#EC008C]">{eyebrow}</p>
          ) : null}
          <h1
            className="mt-3 whitespace-pre-line font-extrabold uppercase tracking-[-0.02em] text-[#1A1A1A]"
            style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.02 }}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-[#1A1A1A]/70">{description}</p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={primaryCtaHref}
              className="inline-flex h-12 items-center rounded-full bg-[#EC008C] px-7 text-[15px] font-bold uppercase tracking-[0.02em] text-white transition hover:bg-[#d1007d]"
            >
              {primaryCtaLabel}
            </Link>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Link
                href={secondaryCtaHref}
                className="inline-flex h-12 items-center rounded-full border border-[#1A1A1A] px-7 text-[15px] font-bold uppercase tracking-[0.02em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white"
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white/50 lg:aspect-[5/4]">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FBE9F2] via-[#f7d6e6] to-[#f3c2da]" />
          )}
        </div>
      </div>
    </section>
  );
}
