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

/** Nike-stil hero: full-bleed bakgrundsbild + textoverlay. */
export function SportHero({
  eyebrow, title, description,
  primaryCtaHref, primaryCtaLabel,
  secondaryCtaHref, secondaryCtaLabel,
  heroImageUrl,
}: SportHeroProps) {
  return (
    <section className="relative min-h-[460px] overflow-hidden bg-[#0a0f08] lg:min-h-[600px]">
      {heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="relative mx-auto flex min-h-[460px] max-w-[1320px] flex-col justify-end px-6 py-14 lg:min-h-[600px] lg:px-10">
        <div className="max-w-[680px]">
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#b3ff00]">{eyebrow}</p>
          <h1 className="mt-3 whitespace-pre-line font-black uppercase italic tracking-[-0.02em] text-white" style={{ fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 0.92 }}>
            {title}
          </h1>
          <p className="mt-4 max-w-[520px] text-[17px] font-medium leading-relaxed text-white/85">{description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={primaryCtaHref} className="inline-flex h-12 items-center rounded-full bg-white px-8 text-[15px] font-bold uppercase text-black transition hover:bg-[#b3ff00]">
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryCtaHref} className="inline-flex h-12 items-center rounded-full border border-white/70 px-8 text-[15px] font-bold uppercase text-white transition hover:bg-white hover:text-black">
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
