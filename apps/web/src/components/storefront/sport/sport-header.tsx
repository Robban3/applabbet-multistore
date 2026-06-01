import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type SportHeaderLink = { label: string; href: string };

export type SportHeaderProps = {
  brandName: string;
  links: SportHeaderLink[];
  cartInitialCount?: number;
  activeNav?: string;
  isLoggedIn?: boolean;
};

function Swoosh() {
  return (
    <svg viewBox="0 0 80 28" className="h-5 w-14" fill="none" aria-hidden="true">
      <path
        d="M6 19.5C10 21 14 20.2 19 18L74 1c1.6-.5 1.9.4.6 1.3L24.5 24.5c-5 2.4-9.7 3.6-13.6 2.4-3.6-1.1-5.2-3.8-4.9-7.4Z"
        fill="#0a0f08"
      />
    </svg>
  );
}

export function SportHeader({ brandName, links, cartInitialCount = 0, activeNav, isLoggedIn = false }: SportHeaderProps) {
  const utilityLinks = [
    { label: "Hitta butik", href: "/kundservice" },
    { label: "Hjälp", href: "/kundservice" },
    isLoggedIn
      ? { label: "Mina sidor", href: "/mina-sidor" }
      : { label: "Logga in", href: "/konto/login" },
  ];

  return (
    <div className="bg-white">
      {/* ── Topp utility-bar ── */}
      <div className="hidden border-b border-black/5 bg-[#f5f5f5] sm:block">
        <div className="flex items-center justify-end gap-5 px-6 py-1.5 lg:px-10">
          {utilityLinks.map((u, i) => (
            <span key={u.label} className="flex items-center gap-5">
              <Link href={u.href} className="text-[11px] font-medium text-[#0a0f08]/70 transition hover:text-[#0a0f08]">
                {u.label}
              </Link>
              {i < utilityLinks.length - 1 ? <span className="text-black/15">|</span> : null}
            </span>
          ))}
        </div>
      </div>

      {/* ── Huvudheader ── */}
      <header className="relative flex items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Swoosh />
          <span className="text-[15px] font-black uppercase tracking-[0.08em] text-[#0a0f08]">{brandName}</span>
        </Link>

        {/* Nav (centrerad) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 xl:flex">
          {links.map((item, idx) => {
            const isActive = activeNav ? item.label === activeNav : idx === 0;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`relative py-1 text-[13px] font-black uppercase tracking-[0.04em] transition ${
                  isActive ? "text-[#0a0f08]" : "text-[#0a0f08]/65 hover:text-[#0a0f08]"
                }`}
              >
                {item.label}
                {isActive ? <span className="absolute -bottom-0.5 left-0 h-[3px] w-full bg-[#b3ff00]" /> : null}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Sök-pill */}
          <Link
            href="/sok"
            aria-label="Sök"
            className="hidden items-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-2 text-[#0a0f08]/60 transition hover:bg-[#ececec] sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
            </svg>
            <span className="text-[12px] font-semibold">Sök</span>
          </Link>

          <Link href="/sok" aria-label="Sök" className="inline-flex text-[#0a0f08] transition hover:opacity-60 sm:hidden">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
            </svg>
          </Link>

          <Link href="/mina-sidor" aria-label="Konto" className="text-[#0a0f08] transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
            </svg>
          </Link>

          <Link href="/cart" aria-label="Varukorg" className="relative text-[#0a0f08] transition hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
              <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
            </svg>
            <CartCountBadge initialCount={cartInitialCount} />
          </Link>

          {/* Mobilmeny */}
          <details className="relative xl:hidden">
            <summary className="inline-flex h-8 w-8 cursor-pointer list-none items-center justify-center text-[#0a0f08] transition hover:opacity-60">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="fixed inset-x-0 top-0 z-[120] overflow-hidden bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <span className="text-[15px] font-black uppercase tracking-[0.08em] text-[#0a0f08]">{brandName}</span>
                <span className="text-[#0a0f08]/50">✕</span>
              </div>
              {links.map((item, idx) => {
                const isActive = activeNav ? item.label === activeNav : idx === 0;
                return (
                  <Link
                    key={`m-${idx}`}
                    href={item.href}
                    className={`flex items-center justify-between border-b border-black/8 px-6 py-4 text-[14px] font-black uppercase tracking-[0.04em] transition ${
                      isActive ? "text-[#0a0f08] border-l-4 border-l-[#b3ff00]" : "text-[#0a0f08]/70 hover:text-[#0a0f08]"
                    }`}
                  >
                    {item.label}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </details>
        </div>
      </header>
    </div>
  );
}
