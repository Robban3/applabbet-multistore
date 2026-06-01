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

/**
 * Apple.com-stil hero: centrerad text överst (stor fet rubrik + subhead +
 * blå text-länkar "Köp ›"), stor produktbild under. Ljus bakgrund.
 */
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
    <section className="bg-white pt-14 text-center">
      {eyebrow ? (
        <p className="text-[19px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">{eyebrow}</p>
      ) : null}
      <h1
        className="mx-auto max-w-[900px] whitespace-pre-line px-6 font-semibold tracking-[-0.03em] text-[#1D1D1F]"
        style={{ fontSize: "clamp(40px, 6.5vw, 80px)", lineHeight: 1.05 }}
      >
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-4 max-w-[640px] px-6 text-[19px] tracking-[-0.01em] text-[#1D1D1F] sm:text-[21px]">
          {description}
        </p>
      ) : null}

      {/* Blå text-länkar (Apple-pattern) */}
      <div className="mt-6 flex items-center justify-center gap-7">
        <Link href={primaryCtaHref} className="text-[17px] text-[#0066CC] hover:underline">
          {primaryCtaLabel} ›
        </Link>
        {secondaryCtaHref && secondaryCtaLabel ? (
          <Link href={secondaryCtaHref} className="text-[17px] text-[#0066CC] hover:underline">
            {secondaryCtaLabel} ›
          </Link>
        ) : null}
      </div>

      {/* Stor produktbild */}
      <div className="relative mx-auto mt-10 aspect-[16/10] w-full max-w-[1100px] overflow-hidden">
        {heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-contain" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7] to-[#ECECEE]" />
        )}
      </div>
    </section>
  );
}
