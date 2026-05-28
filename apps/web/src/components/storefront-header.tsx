import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";
import { TopTrustStrip } from "@/components/top-trust-strip";
import {
  defaultNavigationMenu,
  defaultTrustBadges,
  getTenantSettings,
  type NavigationMenuItem,
  type TrustBadge,
} from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type StorefrontHeaderProps = {
  activeNav?: string;
  cartCount?: number;
  showAccountLabel?: boolean;
  searchActive?: boolean;
  brandName?: string;
  trustBadges?: TrustBadge[];
  trustStripSize?: "default" | "large";
};

export async function StorefrontHeader({
  activeNav,
  cartCount = 0,
  showAccountLabel = false,
  searchActive = false,
  brandName = "APPLABBET",
  trustBadges,
  trustStripSize = "default",
}: StorefrontHeaderProps) {
  let topTrust = trustBadges || defaultTrustBadges;
  let navItems: NavigationMenuItem[] = defaultNavigationMenu;
  if (!trustBadges) {
    const host = await getCurrentHost();
    const tenant = await resolveTenantByHost(host);
    if (tenant) {
      const settings = await getTenantSettings(tenant);
      topTrust = settings?.trust_badges || defaultTrustBadges;
      navItems = settings?.navigation_menu || defaultNavigationMenu;
    }
  }

  const normalizeNavHref = (href: string) => (href === "/products?sort=bestsellers" ? "/bastsaljare" : href);

  return (
    <>
      <header
        className="relative flex items-center justify-between px-4 py-3 text-white sm:px-6"
        style={{ background: "var(--store-header-gradient)" }}
      >
        <p className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</p>
        <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/90 xl:flex">
          {navItems
            .filter((item) => item.enabled)
            .map((item) => (
            <Link
              key={item.label}
              href={normalizeNavHref(item.href)}
              className={item.label === activeNav ? "border-b border-[color:var(--store-accent)] pb-1 text-white" : "hover:text-[color:var(--store-accent)]"}
            >
              {item.label}
            </Link>
            ))}
        </nav>
        <div className="flex items-center gap-2 text-white/85">
          <details className="relative xl:hidden">
            <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div
              className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]"
              style={{ background: "var(--store-header-overlay-surface)" }}
            >
              {navItems
                .filter((item) => item.enabled)
                .map((item) => (
                  <Link
                    key={`mobile-${item.label}`}
                    href={normalizeNavHref(item.href)}
                    className={`block rounded-md px-3 py-2 text-sm ${
                      item.label === activeNav ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </details>
          <Link
            href="/sok"
            aria-label="Sök"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 ${searchActive ? "border-b-2 border-[color:var(--store-accent)]" : ""}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L16.65 16.65" />
            </svg>
          </Link>
          <Link
            href="/mina-sidor"
            aria-label="Konto"
            className={showAccountLabel ? "inline-flex h-9 items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 text-sm" : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5"}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
            </svg>
            {showAccountLabel ? "Mina sidor" : null}
          </Link>
          <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
            </svg>
            <CartCountBadge initialCount={cartCount} />
          </Link>
        </div>
      </header>

      <TopTrustStrip items={topTrust} size={trustStripSize} />
    </>
  );
}
