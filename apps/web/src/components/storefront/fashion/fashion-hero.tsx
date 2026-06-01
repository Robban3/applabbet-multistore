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

/** Filippa K-stil hero: full-bleed bild, minimalistisk text nedre vänster. */
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
    <section className="relative min-h-[520px] overflow-hidden bg-[#EFEAE3] lg:min-h-[640px]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-white/55 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[520px] max-w-[1320px] flex-col justify-end px-6 py-14 lg:min-h-[640px] lg:px-14">
        <div className="max-w-[520px]">
          {eyebrow ? <p className="text-[11px] uppercase tracking-[0.32em] text-[#1A1A1A]/70">{eyebrow}</p> : null}
          <h1 className="mt-3 whitespace-pre-line font-light tracking-[-0.01em] text-[#1A1A1A]" style={{ fontSize: "clamp(36px, 5vw, 58px)", lineHeight: 1.06 }}>
            {title}
          </h1>
          {description ? <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-[#1A1A1A]/75">{description}</p> : null}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={primaryCtaHref} className="inline-flex h-12 items-center border border-[#1A1A1A] bg-[#1A1A1A] px-8 text-[12px] uppercase tracking-[0.18em] text-[#FAF9F6] transition hover:bg-transparent hover:text-[#1A1A1A]">
              {primaryCtaLabel}
            </Link>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Link href={secondaryCtaHref} className="inline-flex h-12 items-center border border-[#1A1A1A] px-8 text-[12px] uppercase tracking-[0.18em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-[#FAF9F6]">
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
