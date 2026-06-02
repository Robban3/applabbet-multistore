import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type FashionHeaderLink = { label: string; href: string };

export type FashionHeaderProps = {
  brandName: string;
  links: FashionHeaderLink[];
  cartInitialCount?: number;
  activeNav?: string;
  isLoggedIn?: boolean;
};

/**
 * Filippa K-stil header: vit bakgrund, light typografi, logo centrerad,
 * nav vänster om logon (eller under), ikoner höger. Inga uppercase tracking
 * — bara ren sentence case med generös letter-spacing.
 */
export function FashionHeader({
  brandName,
  links,
  cartInitialCount = 0,
  activeNav,
  isLoggedIn = false,
}: FashionHeaderProps) {
  return (
    <div className="border-b border-[#E5E1DC] bg-[#FAF9F6]">
      {/* Utility-bar */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-end gap-6 px-8 py-2 text-[11px] tracking-[0.05em] text-[#1A1A1A]/55 lg:px-12">
          <Link href="/kundservice" className="hover:text-[#1A1A1A]">Kundservice</Link>
          <Link href="/leverans" className="hover:text-[#1A1A1A]">Shipping</Link>
          <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} className="hover:text-[#1A1A1A]">
            {isLoggedIn ? "My account" : "Sign in"}
          </Link>
        </div>
      </div>

      {/* Huvud-header */}
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-8 py-5 lg:px-12 lg:py-6">
        {/* Vänster: nav */}
        <nav className="hidden items-center gap-8 text-[13px] tracking-[0.04em] text-[#1A1A1A] xl:flex">
          {links.slice(0, 4).map((item, idx) => {
            const isActive = activeNav ? item.label === activeNav : idx === 0;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`pb-0.5 transition hover:text-[#1A1A1A]/70 ${
                  isActive ? "border-b border-[#1A1A1A]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logo (centrerad) */}
        <Link href="/" className="text-center text-[15px] font-light tracking-[0.4em] text-[#1A1A1A] uppercase lg:text-[17px]">
          {brandName}
        </Link>

        {/* Höger: rest av nav + ikoner */}
        <div className="flex items-center justify-end gap-5">
          <nav className="hidden items-center gap-8 text-[13px] tracking-[0.04em] text-[#1A1A1A] xl:flex">
            {links.slice(4).map((item, idx) => {
              const realIdx = idx + 4;
              const isActive = activeNav ? item.label === activeNav : false;
              return (
                <Link
                  key={`${item.href}-${realIdx}`}
                  href={item.href}
                  className={`pb-0.5 transition hover:text-[#1A1A1A]/70 ${isActive ? "border-b border-[#1A1A1A]" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/sok" aria-label="Sök" className="text-[#1A1A1A] transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
            </svg>
          </Link>
          <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} aria-label="Konto" className="text-[#1A1A1A] transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Varukorg" className="relative text-[#1A1A1A] transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14l-1.5 12H6.5L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <CartCountBadge initialCount={cartInitialCount} />
          </Link>

          {/* Mobilmeny */}
          <details className="relative xl:hidden">
            <summary className="inline-flex h-8 w-8 cursor-pointer list-none items-center justify-center text-[#1A1A1A]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="fixed inset-x-0 top-0 z-[120] overflow-hidden bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E1DC] px-8 py-5">
                <span className="text-[15px] font-light tracking-[0.4em] uppercase text-[#1A1A1A]">{brandName}</span>
                <span className="text-[18px] text-[#1A1A1A]/50">×</span>
              </div>
              {links.map((item, idx) => (
                <Link
                  key={`m-${idx}`}
                  href={item.href}
                  className="block border-b border-[#E5E1DC]/50 px-8 py-4 text-[14px] tracking-[0.04em] text-[#1A1A1A] hover:bg-[#F5F2ED]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </header>
    </div>
  );
}
