import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import type { AccountSidebarItem } from "@/components/account-sidebar";

type SportAccountShellProps = {
  greetingName: string;
  /** Aktiv flik — matchas mot AccountSidebarItem.href */
  activeHref: string;
  items: AccountSidebarItem[];
  /** Egen rubrik (t.ex. "Mina ordrar"). Default = "Översikt". */
  heading?: string;
  subtitle?: string;
  /** Visa "Hej, X"-blocket bara på huvudsidan. */
  showGreeting?: boolean;
  children: React.ReactNode;
};

/**
 * Nike-stil wrapper för alla /mina-sidor/*-sidor.
 * Renderar: StorefrontHeader → (valfri Hej-block) → tab-rad → children.
 * Använd från layout.tsx eller direkt i en page.tsx för sport-tema.
 */
export function SportAccountShell({
  greetingName,
  activeHref,
  items,
  heading,
  subtitle,
  showGreeting = false,
  children,
}: SportAccountShellProps) {
  return (
    <main className="bg-white">
      <StorefrontHeader cartCount={0} />

      {showGreeting ? (
        <section className="bg-white px-6 pt-8 pb-4 lg:px-10">
          <p className="text-[12px] text-[#757575]">Konto</p>
          <h1 className="mt-1 text-[36px] font-medium text-[#111] lg:text-[44px]">
            Hej, {greetingName}
          </h1>
          <p className="mt-1 text-[15px] text-[#757575]">
            {subtitle ?? "Välkommen tillbaka. Här är din översikt."}
          </p>
        </section>
      ) : (
        <section className="bg-white px-6 pt-8 pb-4 lg:px-10">
          <p className="text-[12px] text-[#757575]">Konto</p>
          <h1 className="mt-1 text-[28px] font-medium text-[#111] lg:text-[36px]">
            {heading ?? "Mina sidor"}
          </h1>
          {subtitle ? <p className="mt-1 text-[15px] text-[#757575]">{subtitle}</p> : null}
        </section>
      )}

      {/* Tab-navigation (matchar kategori-flikarna på /products) */}
      <nav className="border-b border-[#e5e5e5] bg-white">
        <div className="flex flex-wrap items-center overflow-x-auto px-6 lg:px-10">
          {items.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap px-4 py-3 text-[13px] font-medium uppercase tracking-[0.04em] transition ${
                  isActive ? "text-[#111]" : "text-[#757575] hover:text-[#111]"
                }`}
              >
                {item.label}
                {isActive ? <span className="absolute inset-x-4 -bottom-px h-[3px] bg-[#111]" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Innehåll */}
      <section className="bg-white px-6 py-10 lg:px-10">{children}</section>
    </main>
  );
}
