import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type LuxuryHeaderLink = { label: string; href: string };

export type LuxuryHeaderProps = {
  brandName: string;
  links: LuxuryHeaderLink[];
  cartInitialCount?: number;
  activeNav?: string;
};

export function LuxuryHeader({ brandName, links, cartInitialCount = 0, activeNav }: LuxuryHeaderProps) {
  return (
    <header className="relative flex items-center justify-between border-b border-white/8 px-8 py-5 lg:px-14">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-start">
        <span className="text-[11px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">
          Maison
        </span>
        <span className="mt-0.5 text-lg font-light tracking-[0.3em] text-white uppercase">
          {brandName}
        </span>
      </Link>

      {/* Nav */}
      <nav className="hidden items-center gap-10 text-[11px] font-light tracking-[0.2em] text-white/70 uppercase xl:flex">
        {links.map((item, idx) => {
          const isActive = activeNav ? item.label === activeNav : idx === 0;
          return (
            <Link
              key={`${item.href}-${idx}`}
              href={item.href}
              className={`transition hover:text-white ${isActive ? "text-white border-b border-[#C41E3A] pb-0.5" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-6 text-white/75">
        <Link href="/sok" aria-label="Sök" className="transition hover:text-white">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
          </svg>
        </Link>
        <Link href="/mina-sidor" aria-label="Konto" className="transition hover:text-white">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
          </svg>
        </Link>
        <Link href="/cart" aria-label="Varukorg" className="relative transition hover:text-white">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
            <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
          </svg>
          <CartCountBadge initialCount={cartInitialCount} />
        </Link>

        {/* Mobile menu */}
        <details className="relative xl:hidden">
          <summary className="inline-flex h-8 w-8 cursor-pointer list-none items-center justify-center transition hover:text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="fixed inset-x-4 top-20 z-[120] overflow-hidden rounded-lg border border-white/10 shadow-2xl" style={{ background: "var(--store-header-overlay-surface)" }}>
            {links.map((item, idx) => {
              const isActive = activeNav ? item.label === activeNav : idx === 0;
              return (
              <Link key={`m-${idx}`} href={item.href} className={`block border-b border-white/8 px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase transition last:border-0 ${isActive ? "text-white border-l-2 border-l-[#C41E3A]" : "text-white/70 hover:text-white"}`}>
                {item.label}
              </Link>
              );
            })}
          </div>
        </details>
      </div>
    </header>
  );
}
