import Link from "next/link";

export type ClassicHeroContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  showPrimaryCta: boolean;
  showSecondaryCta: boolean;
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClassicHeroContent({
  eyebrow,
  title,
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  showPrimaryCta,
  showSecondaryCta,
}: ClassicHeroContentProps) {
  return (
    <div className="flex max-w-[560px] flex-col justify-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--store-accent)]">
        {eyebrow}
      </p>

      <h1 className="mt-3 whitespace-pre-line text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-[62px] lg:leading-[0.98]">
        {title}
      </h1>

      <p className="mt-4 max-w-[430px] whitespace-pre-line text-lg text-white/80 sm:text-xl lg:text-[22px]">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {showPrimaryCta ? (
          <Link
            href={primaryCtaHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--store-accent)] px-7 py-3 text-sm font-semibold text-[#17120d] transition hover:brightness-110"
          >
            {primaryCtaLabel}
            <ArrowRightIcon />
          </Link>
        ) : null}

        {showSecondaryCta ? (
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            {secondaryCtaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
