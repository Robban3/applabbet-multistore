import Link from "next/link";

type ElectronicsHeroProps = {
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
 * Hybrid-hero: stor kampanjbanner med text vänster + produktbild höger,
 * blå CTA-knapp. Webhallen/Komplett deal-energi + Apple-renhet.
 */
export function ElectronicsHero({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  heroImageUrl,
}: ElectronicsHeroProps) {
  return (
    <section className="bg-white px-6 py-6">
      <div className="mx-auto grid max-w-[1280px] items-center gap-8 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#EAF1FB] to-[#DCE6F5] px-8 py-12 lg:grid-cols-2 lg:px-14">
        <div>
          {eyebrow ? (
            <p className="inline-flex rounded-full bg-[#E8362D] px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white">{eyebrow}</p>
          ) : null}
          <h1 className="mt-4 whitespace-pre-line font-bold leading-[1.02] text-[#0A2540]" style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-[460px] text-[17px] text-[#0A2540]/70">{description}</p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={primaryCtaHref} className="inline-flex h-12 items-center rounded-full bg-[#2f7dff] px-7 text-[15px] font-semibold text-white transition hover:bg-[#1a6cf0]">
              {primaryCtaLabel}
            </Link>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Link href={secondaryCtaHref} className="inline-flex h-12 items-center rounded-full border border-[#0A2540]/20 px-7 text-[15px] font-semibold text-[#0A2540] transition hover:bg-white">
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-contain" />
          ) : (
            <div className="absolute inset-0 rounded-[16px] bg-white/40" />
          )}
        </div>
      </div>
    </section>
  );
}
