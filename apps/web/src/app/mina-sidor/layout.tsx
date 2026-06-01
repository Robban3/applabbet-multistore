import { StorefrontHeader } from "@/components/storefront-header";
import { SportAccountTabs } from "@/components/storefront/sport/sport-account-tabs";
import { loadAccountContext } from "@/lib/account-context";

/**
 * Sport-layout för alla /mina-sidor/*.
 * - Tema = sport → wrap children med Nike-shell: header + tabs.
 * - Övriga teman → låter children vara orörda.
 *
 * Aktiv flik bestäms av client-componenten SportAccountTabs via usePathname.
 */
export default async function MinaSidorLayout({ children }: { children: React.ReactNode }) {
  const ctx = await loadAccountContext();
  if (!ctx.isSport) {
    return <>{children}</>;
  }

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

      {/* Sidans innehåll — markeras så CSS kan dölja boxad shell + AccountSidebar */}
      <div data-mina-sidor-sport>{children}</div>
    </main>
  );
}
