import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";

export type ElectronicsHeaderLink = { label: string; href: string };
export type ElectronicsMegaCategory = { name: string; slug: string };

export type ElectronicsHeaderProps = {
  brandName: string;
  links: ElectronicsHeaderLink[];
  megaCategories?: ElectronicsMegaCategory[];
  cartInitialCount?: number;
  activeNav?: string;
  isLoggedIn?: boolean;
};

/**
 * Komplett/Webhallen-hybrid header:
 *  - Övre rad: logo + STOR central sökruta + konto/varukorg
 *  - Undre rad: kategorinav med "Alla kategorier"-megameny (CSS-driven hover)
 */
export function ElectronicsHeader({
  brandName,
  links,
  megaCategories = [],
  cartInitialCount = 0,
  activeNav,
  isLoggedIn = false,
}: ElectronicsHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-[0_1px_0_#DCE6F5]">
      {/* Övre rad */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-6 py-3">
        <Link href="/" className="shrink-0 text-[20px] font-bold tracking-[-0.02em] text-[#0A2540]">
          {brandName}
        </Link>

        {/* Stor sök */}
        <form method="GET" action="/sok" className="relative flex-1">
          <input
            name="q"
            placeholder="Sök bland tusentals produkter…"
            className="h-11 w-full rounded-[10px] border border-[#DCE6F5] bg-[#F4F7FC] pl-11 pr-4 text-[15px] text-[#0A2540] placeholder:text-[#0A2540]/45 focus:border-[#2f7dff] focus:bg-white focus:outline-none"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0A2540]/45">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
            </svg>
          </span>
        </form>

        {/* Konto + varukorg */}
        <div className="flex shrink-0 items-center gap-4 text-[#0A2540]">
          <Link href={isLoggedIn ? "/mina-sidor" : "/konto/login"} className="hidden items-center gap-1.5 text-[13px] sm:flex">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="8" r="3.5" /><path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
            </svg>
            {isLoggedIn ? "Mitt konto" : "Logga in"}
          </Link>
          <Link href="/cart" className="relative inline-flex h-10 items-center gap-2 rounded-full bg-[#2f7dff] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1a6cf0]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 7h13l-1.5 11H7.5L6 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="hidden sm:inline">Varukorg</span>
            <CartCountBadge initialCount={cartInitialCount} />
          </Link>
        </div>
      </div>

      {/* Undre rad: kategorinav + megameny */}
      <nav className="border-t border-[#DCE6F5]">
        <div className="mx-auto flex max-w-[1280px] items-stretch gap-1 px-6">
          {/* Megameny */}
          {megaCategories.length > 0 ? (
            <div className="group relative">
              <button className="flex h-11 items-center gap-2 rounded-t-[8px] bg-[#2f7dff] px-4 text-[14px] font-semibold text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                Alla kategorier
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-[640px] rounded-b-[12px] border border-[#DCE6F5] bg-white p-6 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {megaCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${encodeURIComponent(c.slug)}`}
                      className="flex items-center justify-between rounded-[8px] px-3 py-2.5 text-[14px] text-[#0A2540] transition hover:bg-[#F4F7FC]"
                    >
                      {c.name}
                      <span className="text-[#0A2540]/35">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Snabb-länkar */}
          {links.map((item, idx) => {
            const isActive = activeNav ? item.label === activeNav : false;
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={`hidden h-11 items-center px-4 text-[14px] transition hover:text-[#2f7dff] lg:flex ${
                  isActive ? "font-semibold text-[#2f7dff]" : "text-[#0A2540]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
