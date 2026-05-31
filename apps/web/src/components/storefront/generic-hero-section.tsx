import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

type NavItem = { label: string; href: string };
type TrustCard = { title: string; text: string; icon?: string };

type GenericHeroSectionProps = {
  brandName: string;
  storeName: string;
  navItems: NavItem[];
  heroImageUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  isHeroContentRight: boolean;
  isSport: boolean;
  isBeauty: boolean;
  isElectronics: boolean;
  trustCards: TrustCard[];
  electronicsTrustStrip: TrustCard[];
  sportTopUtilityItems: string[];
  electronicsTopUtilityItems: string[];
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}

type IconType = "star" | "shield" | "truck" | "headset";

function TrustCardIcon({ icon }: { icon: IconType }) {
  if (icon === "star") return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3.8 14.8 9l5.7.9-4 4.2.9 5.7L12 17.1l-5.4 2.7.9-5.7-4-4.2L9.2 9 12 3.8Z" />
    </svg>
  );
  if (icon === "shield") return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
      <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
    </svg>
  );
  if (icon === "truck") return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M2 6h11v9H2z" /><path d="M13 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

export function GenericHeroSection({
  brandName, storeName, navItems,
  heroImageUrl, heroEyebrow, heroTitle, heroDescription,
  primaryCtaHref, primaryCtaLabel, secondaryCtaHref, secondaryCtaLabel,
  isHeroContentRight, isSport, isBeauty, isElectronics,
  trustCards, electronicsTrustStrip, sportTopUtilityItems, electronicsTopUtilityItems,
}: GenericHeroSectionProps) {
  const useHeroImageBackground = heroImageUrl.length > 0;

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
      <div
        className="overflow-hidden rounded-[18px] text-white shadow-2xl"
        style={{
          background: useHeroImageBackground
            ? `url('${heroImageUrl}') center/cover no-repeat`
            : "var(--store-header-gradient)",
        }}
      >
        {isSport ? (
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0b0b0d] px-5 py-2 text-[10px] font-semibold text-white/80">
            {sportTopUtilityItems.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {item}
                {index < sportTopUtilityItems.length - 1 ? <span className="text-white/35">|</span> : null}
              </span>
            ))}
          </div>
        ) : isBeauty ? (
          <div className="flex flex-wrap items-center gap-3 border-b border-[#efd6e0] bg-[#f7dbe5] px-5 py-2 text-[10px] font-semibold text-slate-700">
            <span>FRI FRAKT OVER 499 KR</span><span className="text-slate-400">|</span>
            <span>30 DAGARS OPPET KOP</span><span className="text-slate-400">|</span>
            <span>CLEAN BEAUTY</span><span className="text-slate-400">|</span>
            <span>SAKRA BETALNINGAR</span>
          </div>
        ) : isElectronics ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-2 text-[11px] text-white/75">
            <div className="flex flex-wrap items-center gap-4">
              {electronicsTopUtilityItems.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <span>Kundservice</span><span>Butiker</span>
            </div>
          </div>
        ) : null}

        <header className="relative flex items-center justify-between border-b border-white/10 bg-[#0b0b0d] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</span>
            <span className="text-[10px] text-white/60">{storeName}</span>
          </div>
          {isElectronics ? (
            <form method="GET" action="/sok" className="hidden flex-1 px-6 xl:block">
              <div className="flex items-center rounded-md border border-white/20 px-3 py-2" style={{ background: "var(--store-header-overlay-surface)" }}>
                <input name="q" placeholder="Sök produkt, kategori eller varumärke..." className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/45 focus:outline-none" />
                <button type="submit" aria-label="Sök">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
                  </svg>
                </button>
              </div>
            </form>
          ) : null}
          <nav className={`hidden items-center gap-7 text-[13px] font-medium text-white/90 ${isElectronics ? "xl:hidden" : "xl:flex"}`}>
            {navItems.map((item, idx) => (
              <Link key={`${item.href}-${idx}`} href={item.href} className={`transition hover:text-[color:var(--store-accent)] ${idx === 0 ? "border-b border-[color:var(--store-accent)] pb-1 text-white" : ""}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-white/85">
            <details className="relative xl:hidden">
              <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </summary>
              <div className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]" style={{ background: "var(--store-header-overlay-surface)" }}>
                {navItems.map((item, idx) => (
                  <Link key={`mobile-${idx}`} href={item.href} className={`block rounded-md px-3 py-2 text-sm ${idx === 0 ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <Link href="/sok" aria-label="Sök" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" /></svg>
            </Link>
            <Link href="/mina-sidor" aria-label="Konto" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="3.5" /><path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" /></svg>
            </Link>
            <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" /></svg>
              <CartCountBadge initialCount={2} />
            </Link>
          </div>
        </header>

        {isElectronics ? (
          <nav className="hidden items-center gap-6 border-b border-white/10 bg-[#0b0b0d] px-5 py-2.5 text-[13px] font-medium text-white/85 xl:flex">
            {navItems.map((item, idx) => (
              <Link key={`enav-${idx}`} href={item.href} className={`transition hover:text-[color:var(--store-accent)] ${idx === navItems.length - 1 ? "text-[color:var(--store-accent)]" : ""}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className={`relative z-10 px-6 ${isElectronics ? "py-7 min-h-[460px]" : isBeauty ? "py-10 min-h-[520px]" : "py-8 min-h-[480px]"} lg:px-10`}>
          <div className={`flex ${isHeroContentRight ? "justify-end" : "justify-start"}`}>
            <div className="flex max-w-[560px] flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--store-accent)]">{heroEyebrow}</p>
              <h1 className="mt-3 whitespace-pre-line text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-[62px] lg:leading-[0.98]">{heroTitle}</h1>
              <p className="mt-4 max-w-[430px] whitespace-pre-line text-lg text-white/80 sm:text-xl lg:text-[22px]">{heroDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={primaryCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a1a1f]">
                  {primaryCtaLabel}<ArrowRightIcon />
                </Link>
                <Link href={secondaryCtaHref} className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">
                  {secondaryCtaLabel}
                </Link>
              </div>
            </div>
          </div>
          <div className={`relative z-20 px-4 pb-1 sm:px-6 ${isElectronics ? "-mt-4" : isBeauty ? "-mt-5" : "-mt-7"}`}>
            <div
              className={`grid overflow-hidden rounded-xl border shadow-[0_8px_20px_rgba(21,17,12,0.14)] sm:grid-cols-2 ${isElectronics ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
              style={{
                borderColor: isBeauty ? "#efd9e2" : isSport ? "#d7decd" : "var(--store-card-border)",
                background: isBeauty ? "#ffffff" : isSport ? "#ffffff" : "var(--store-soft-surface)",
              }}
            >
              {(isElectronics ? electronicsTrustStrip : trustCards).map((card) => (
                <article
                  key={card.title}
                  className="flex min-h-[88px] items-center gap-3 border-t px-5 py-3 lg:min-h-[96px] lg:border-l lg:border-t-0 lg:first:border-l-0"
                  style={{ borderColor: isBeauty ? "#f1e3ea" : isSport ? "#e3e8dc" : "var(--store-footer-border)" }}
                >
                  {"icon" in card && typeof card.icon === "string" && ["star","shield","truck","headset"].includes(card.icon) ? (
                    <TrustCardIcon icon={card.icon as IconType} />
                  ) : (
                    <span className="h-3 w-3 rounded-full bg-[color:var(--store-accent)]" />
                  )}
                  <div>
                    <p className="text-[15px] font-semibold">{card.title}</p>
                    <p className="text-[13px] text-slate-600">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
