import { StorefrontHeader } from "@/components/storefront-header";
import { SportAccountTabs } from "@/components/storefront/sport/sport-account-tabs";
import { FashionAccountTabs } from "@/components/storefront/fashion";
import { MinimalAccountTabs } from "@/components/storefront/minimal";
import { loadAccountContext } from "@/lib/account-context";

/**
 * Tema-medveten layout för alla /mina-sidor/*.
 * - sport   → Nike-shell: header + tabs (vit)
 * - fashion → Filippa K-shell: header + tabs (cream)
 * - övriga  → children orörda (boxad shell i sidorna själva)
 *
 * Aktiv flik bestäms av client-component via usePathname.
 */
export default async function MinaSidorLayout({ children }: { children: React.ReactNode }) {
  const ctx = await loadAccountContext();

  if (ctx.isSport) {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} />
        <section className="bg-white px-6 pt-8 pb-4 lg:px-10">
          <p className="text-[12px] text-[#757575]">Konto</p>
          <h1 className="mt-1 text-[28px] font-medium text-[#111] lg:text-[36px]">
            Hej, {ctx.greetingName}
          </h1>
        </section>
        <SportAccountTabs items={ctx.sidebarItems} />
        <div data-mina-sidor-sport>{children}</div>
      </main>
    );
  }

  if (ctx.themeKey === "fashion") {
    return (
      <main className="bg-[#FAF9F6]">
        <StorefrontHeader cartCount={0} />
        <section className="bg-[#FAF9F6] px-8 pt-10 pb-5 lg:px-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#1A1A1A]/55">Mitt konto</p>
          <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[36px]">
            Hej, {ctx.greetingName}
          </h1>
        </section>
        <FashionAccountTabs items={ctx.sidebarItems} />
        {/* data-mina-sidor-sport återanvänds av CSS för att dölja boxad shell */}
        <div data-mina-sidor-sport>{children}</div>
      </main>
    );
  }

  if (ctx.themeKey === "minimal") {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} />
        <section className="bg-white px-6 pt-12 pb-4 text-center">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[40px]">
            Hej, {ctx.greetingName}
          </h1>
        </section>
        <MinimalAccountTabs items={ctx.sidebarItems} />
        <div data-mina-sidor-sport>{children}</div>
      </main>
    );
  }

  return <>{children}</>;
}
