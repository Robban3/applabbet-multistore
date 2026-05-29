import Link from "next/link";

export type ClassicHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  imageUrl?: string;
  trustItems: string[];
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClassicHero({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  imageUrl,
  trustItems,
}: ClassicHeroProps) {
  const hasPrimaryCta = primaryCtaHref.length > 0 && primaryCtaLabel.length > 0;
  const hasSecondaryCta = secondaryCtaHref.length > 0 && secondaryCtaLabel.length > 0;

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
      <div className="overflow-hidden rounded-[22px] border border-black/10 bg-[#f7f2eb] shadow-[0_16px_60px_rgba(31,24,18,0.12)]">
        <div className="grid min-h-[560px] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a6a44]">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-[680px] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#17120d] sm:text-6xl lg:text-[76px]">
              {title}
            </h1>
            <p className="mt-6 max-w-[520px] text-base leading-7 text-[#5f554a] sm:text-lg">
              {description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {hasPrimaryCta ? (
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17120d] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  {primaryCtaLabel}
                  <ArrowRightIcon />
                </Link>
              ) : null}
              {hasSecondaryCta ? (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#17120d]/15 bg-white/60 px-6 py-3 text-sm font-semibold text-[#17120d] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
            {trustItems.length > 0 ? (
              <div className="mt-10 grid gap-3 border-t border-black/10 pt-5 sm:grid-cols-3">
                {trustItems.slice(0, 3).map((item) => (
                  <p key={item} className="text-xs font-medium uppercase tracking-[0.14em] text-[#6c6257]">
                    {item}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-[#d8cbbd] lg:min-h-full">
            {imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.03]"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.42),transparent_34%),linear-gradient(135deg,#c8b59c,#efe2d2_52%,#a58b70)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/35 bg-white/18 p-4 text-white shadow-2xl backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Utvalt sortiment</p>
              <p className="mt-2 text-xl font-semibold leading-tight">Design, kvalitet och trygg handel i samma upplevelse.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
