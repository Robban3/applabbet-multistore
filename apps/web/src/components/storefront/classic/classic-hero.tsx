import Link from "next/link";

type TrustItem = {
  title: string;
  text: string;
  icon?: string;
};

type ClassicHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  heroImageUrl?: string;
};

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function TrustIcon({ icon }: { icon?: string }) {
  if (icon === "truck") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 6h11v9H2z"/><path d="M13 9h4l3 3v3h-7z"/>
      <circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>
    </svg>
  );
  if (icon === "headset") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12a9 9 0 0 1 18 0"/><path d="M21 16a2 2 0 0 1-2 2h-1v-5h3Z"/>
      <path d="M3 16a2 2 0 0 0 2 2h1v-5H3Z"/><path d="M12 21a3 3 0 0 0 3-3"/>
    </svg>
  );
  if (icon === "star") return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7.5 13.5 11H17l-3 2.3 1.2 3.7L12 14.8l-3.2 2.2 1.2-3.7L7 11h3.5Z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#c9973d]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  );
}

export function ClassicHero({
  eyebrow, title, description,
  primaryCtaHref, primaryCtaLabel,
  secondaryCtaHref, secondaryCtaLabel,
  heroImageUrl,
}: ClassicHeroProps) {
  return (
    <div>
      {/* ── HERO ROW ── */}
      <div className="flex min-h-[520px] flex-col lg:flex-row">

        {/* Vänster: text */}
        <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-14 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9973d]">
            {eyebrow}
          </p>
          <h1 className="mt-4 whitespace-pre-line text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#c9973d] px-7 py-3 text-sm font-semibold text-[#17120d] transition hover:brightness-110"
            >
              {primaryCtaLabel}
              <ArrowRight />
            </Link>
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Höger: bild */}
        <div className="relative hidden lg:block lg:w-1/2">
          {heroImageUrl ? (
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1408] via-[#120e06] to-[#0a0806]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(201,151,61,0.2),transparent_60%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d]/40 to-transparent" />
        </div>
      </div>

    </div>
  );
}
