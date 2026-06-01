import Link from "next/link";

type FashionHeroProps = {
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
 * Filippa K-stil hero: enorm bild (cream-bakgrund som fallback),
 * minimalistisk text overlay i nedre vänstra hörnet, tunna svarta knappar.
 */
export function FashionHero({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  heroImageUrl,
}: FashionHeroProps) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#F5F1EA] lg:min-h-[85vh]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F1EA] via-[#EFEAE3] to-[#E0D6C6]" />
      )}

      {/* Subtil ljus gradient för läsbarhet av mörk text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6]/40 via-transparent to-transparent" />

      {/* Innehåll — nedre vänster hörn */}
      <div className="absolute inset-x-0 bottom-0 px-8 pb-14 lg:px-14 lg:pb-20">
        {eyebrow ? (
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A1A1A]/65">{eyebrow}</p>
        ) : null}
        <h1
          className="mt-3 max-w-[640px] whitespace-pre-line font-light leading-[0.98] text-[#1A1A1A]"
          style={{ fontSize: "clamp(44px, 6vw, 96px)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#1A1A1A]/75">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryCtaHref}
            className="inline-flex h-12 items-center bg-[#1A1A1A] px-8 text-[12px] tracking-[0.25em] uppercase text-[#FAF9F6] transition hover:bg-[#000]"
          >
            {primaryCtaLabel}
          </Link>
          {secondaryCtaHref && secondaryCtaLabel ? (
            <Link
              href={secondaryCtaHref}
              className="inline-flex h-12 items-center border border-[#1A1A1A] px-8 text-[12px] tracking-[0.25em] uppercase text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
            >
              {secondaryCtaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
