import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type ClassicHeaderLink = {
  label: string;
  href: string;
};

export type ClassicHeaderProps = {
  brandName: string;
  storeName: string;
  links: ClassicHeaderLink[];
  cartInitialCount?: number;
};

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
      <polygon points="16,3 29,26 3,26" stroke="currentColor" strokeWidth="1.6" className="text-[color:var(--store-accent)]" fill="none" />
      <polygon points="16,10 23,23 9,23" fill="currentColor" className="text-[color:var(--store-accent)]" opacity="0.35" />
    </svg>
  );
}

export function ClassicHeader({
  brandName,
  storeName,
  links,
  cartInitialCount = 2,
}: ClassicHeaderProps) {
  return (
    <header className="relative flex items-center justify-between border-b border-white/10 bg-[#0b0b0d] px-6 py-3.5">
      <Link href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold tracking-[0.18em] text-white">
            {brandName.toUpperCase()}
          </span>
          {storeName && storeName !== brandName.toUpperCase() ? (
            <span className="mt-0.5 text-[9px] tracking-[0.15em] text-white/45">
              {storeName}
            </span>
          ) : null}
        </div>
      </Link>

      <nav className="hidden items-center gap-7 text-[13px] font-medium text-white/85 xl:flex">
        {links.map((item, idx) => (
          <Link
            key={`${item.href}-${item.label}-${idx}`}
            href={item.href}
            className={`inline-flex items-center gap-1 transition hover:text-[color:var(--store-accent)] ${
              idx === 0
                ? "border-b border-[color:var(--store-accent)] pb-1 text-white"
                : ""
            }`}
          >
            {item.label}
            {item.label === "Kategorier" ? (
              <svg viewBox="0 0 12 12" className="h-3 w-3 text-white/50" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 4l4 4 4-4" />
              </svg>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1.5 text-white/85">
        <details className="relative xl:hidden">
          <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div
            className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]"
            style={{ background: "var(--store-header-overlay-surface)" }}
          >
            {links.map((item, idx) => (
              <Link
                key={`mobile-${item.href}-${item.label}-${idx}`}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm ${
                  idx === 0 ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        <Link href="/sok" aria-label="Sök" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10">
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20L16.65 16.65" />
          </svg>
        </Link>

        <Link href="/mina-sidor" aria-label="Konto" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10">
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
          </svg>
        </Link>

        <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10">
          <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
            <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
          </svg>
          <CartCountBadge initialCount={cartInitialCount} />
        </Link>
      </div>
    </header>
  );
}
