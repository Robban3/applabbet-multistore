import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type BeautyHeaderLink = { label: string; href: string };

export type BeautyHeaderProps = {
  brandName: string;
  links: BeautyHeaderLink[];
  cartInitialCount?: number;
  activeNav?: string;
  isLoggedIn?: boolean;
};

/**
 * KICKS.se-stil header: vit, svart "wordmark", stor central sökruta,
 * konto/club/hjärta/varukorg till höger, svart kategorinav-rad under.
 */
export function BeautyHeader({
  brandName,
  links,
  cartInitialCount = 0,
  activeNav,
  isLoggedIn = false,
}: BeautyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Utility-rad */}
      <div className="bg-[#1A1A1A] text-white">
        <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between px-4 text-[12px] tracking-[0.02em] sm:px-6">
          <span>Fri frakt över 499 kr</span>
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/kundservice" className="hover:text-[#EC008C]">Kundservice</Link>
            <Link href="/leverans" className="hover:text-[#EC008C]">Leverans</Link>
            <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} className="font-semibold text-[#EC008C]">
              Bli medlem i Club
            </Link>
          </div>
        </div>
      </div>

      {/* Huvudrad */}
      <div className="border-b border-[#ECECEC]">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="shrink-0 text-[26px] font-extrabold uppercase tracking-[-0.04em] text-[#1A1A1A]">
            {brandName}
          </Link>

          {/* Sökruta */}
          <form method="GET" action="/sok" className="relative mx-auto hidden w-full max-w-[620px] items-center md:flex">
            <input
              name="q"
              placeholder="Sök på produkt, varumärke eller kategori"
              className="h-11 w-full rounded-full border border-[#1A1A1A] bg-white pl-5 pr-12 text-[14px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/45 focus:border-[#EC008C] focus:outline-none"
            />
            <button type="submit" aria-label="Sök" className="absolute right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EC008C] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
              </svg>
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 text-[#1A1A1A] md:gap-5">
            <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} aria-label="Konto" className="flex flex-col items-center gap-0.5 transition hover:text-[#EC008C]">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="8" r="3.6" /><path d="M4 20c1.8-3.4 4.6-5 8-5s6.2 1.6 8 5" />
              </svg>
            </Link>
            <Link href="/mina-sidor/favoriter" aria-label="Favoriter" className="transition hover:text-[#EC008C]">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 20.2C4.8 15.3 3.5 10.7 5.1 7.8A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 6.9 1.2c1.6 2.9.3 7.5-6.9 12.4Z" />
              </svg>
            </Link>
            <Link href="/cart" aria-label="Varukorg" className="relative transition hover:text-[#EC008C]">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <CartCountBadge initialCount={cartInitialCount} />
            </Link>
          </div>
        </div>

        {/* Mobil sökruta */}
        <form method="GET" action="/sok" className="px-4 pb-3 md:hidden">
          <div className="relative flex items-center">
            <input
              name="q"
              placeholder="Sök…"
              className="h-10 w-full rounded-full border border-[#1A1A1A] bg-white pl-4 pr-11 text-[14px] focus:border-[#EC008C] focus:outline-none"
            />
            <button type="submit" aria-label="Sök" className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EC008C] text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Kategorinav */}
      <nav className="border-b border-[#ECECEC]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-6 overflow-x-auto px-4 sm:px-6">
          {links.map((item, idx) => {
            const isActive = activeNav ? item.label === activeNav : idx === 0;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`whitespace-nowrap border-b-2 py-3 text-[14px] font-semibold uppercase tracking-[0.02em] transition ${
                  isActive
                    ? "border-[#EC008C] text-[#1A1A1A]"
                    : "border-transparent text-[#1A1A1A] hover:border-[#EC008C]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
