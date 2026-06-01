import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type MinimalHeaderLink = { label: string; href: string };

export type MinimalHeaderProps = {
  brandName: string;
  links: MinimalHeaderLink[];
  cartInitialCount?: number;
  activeNav?: string;
  isLoggedIn?: boolean;
};

/**
 * Apple.com-stil header: tunn, ljus, translucent. Centrerade nav-länkar,
 * liten logotyp vänster, sök + konto + bag-ikoner höger. Liten text (12px).
 */
export function MinimalHeader({
  brandName,
  links,
  cartInitialCount = 0,
  activeNav,
  isLoggedIn = false,
}: MinimalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">
          {brandName}
        </Link>

        {/* Nav (centrerad) */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item, idx) => {
            const isActive = activeNav ? item.label === activeNav : idx === 0;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`text-[12px] tracking-[-0.01em] transition hover:text-[#1D1D1F] ${
                  isActive ? "text-[#1D1D1F]" : "text-[#1D1D1F]/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Ikoner */}
        <div className="flex items-center gap-5 text-[#1D1D1F]">
          <Link href="/sok" aria-label="Sök" className="transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
            </svg>
          </Link>
          <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} aria-label="Konto" className="transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Varukorg" className="relative transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            <CartCountBadge initialCount={cartInitialCount} />
          </Link>

          {/* Mobilmeny */}
          <details className="relative lg:hidden">
            <summary className="inline-flex h-8 w-8 cursor-pointer list-none items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16M4 16h16" />
              </svg>
            </summary>
            <div className="fixed inset-x-0 top-12 z-[120] border-b border-black/5 bg-white/95 backdrop-blur-xl">
              {links.map((item, idx) => (
                <Link
                  key={`m-${idx}`}
                  href={item.href}
                  className="block border-b border-black/5 px-6 py-3.5 text-[15px] text-[#1D1D1F] last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
