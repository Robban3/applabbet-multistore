import type { ReactNode } from "react";
import { StorefrontHeader } from "@/components/storefront-header";
import { FashionAccountTabs } from "@/components/storefront/fashion";
import { MinimalAccountTabs } from "@/components/storefront/minimal";
import { ElectronicsAccountTabs, ElectronicsMinaSidorContent } from "@/components/storefront/electronics";
import { SportAccountTabs } from "@/components/storefront/sport/sport-account-tabs";
import type { loadAccountContext } from "@/lib/account-context";

export type MinaSidorAccountContext = Awaited<ReturnType<typeof loadAccountContext>>;

/** Layouten renderar header + flikar för dessa teman. */
export function usesMinaSidorTabShell(ctx: MinaSidorAccountContext): boolean {
  return (
    ctx.isSport ||
    ctx.themeKey === "fashion" ||
    ctx.themeKey === "minimal" ||
    ctx.isElectronics
  );
}

/**
 * Innehåll under tab-layouten. Electronics får egen titel-rad;
 * sport/fashion/minimal returnerar bara children (layouten har hälsning + tabs).
 */
export function MinaSidorTabShellContent({
  ctx,
  title,
  subtitle,
  headerExtra,
  children,
}: {
  ctx: MinaSidorAccountContext;
  title: string;
  subtitle?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  if (ctx.isElectronics) {
    return (
      <ElectronicsMinaSidorContent title={title} subtitle={subtitle} headerExtra={headerExtra}>
        {children}
      </ElectronicsMinaSidorContent>
    );
  }

  // Enhetlig padding för sport/fashion/minimal så innehållet inte ligger
  // i skärmkanten (matchar konto-shellens horisontella padding per tema).
  const padding =
    ctx.themeKey === "fashion"
      ? "px-8 py-8 lg:px-14"
      : "px-6 py-8 lg:px-10";
  return <div className={padding}>{children}</div>;
}

/** Header + hälsning + flikar — samma chrome som mina-sidor/layout.tsx (för t.ex. returer?account=1). */
export function MinaSidorAccountChrome({
  ctx,
  children,
}: {
  ctx: MinaSidorAccountContext;
  children: ReactNode;
}) {
  const tabShell = (
    <div data-mina-sidor-sport data-mina-sidor-tab-shell>
      {children}
    </div>
  );

  if (ctx.isSport) {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} />
        <section className="bg-white px-6 pt-8 pb-4 lg:px-10">
          <p className="text-[12px] text-[#757575]">Konto</p>
          <h1 className="mt-1 text-[28px] font-medium text-[#111] lg:text-[36px]">Hej, {ctx.greetingName}</h1>
        </section>
        <SportAccountTabs items={ctx.sidebarItems} />
        {tabShell}
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
        {tabShell}
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
        {tabShell}
      </main>
    );
  }

  if (ctx.isElectronics) {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} />
        <section className="bg-white px-6 pt-8 pb-4 lg:px-10">
          <p className="text-[12px] font-medium text-[#2f7dff]">Mitt konto</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-[-0.02em] text-[#0A2540] lg:text-[36px]">
            Hej, {ctx.greetingName}
          </h1>
        </section>
        <ElectronicsAccountTabs items={ctx.sidebarItems} />
        {tabShell}
      </main>
    );
  }

  return <>{children}</>;
}

/** Konto-vy utanför /mina-sidor (t.ex. returer?account=1) med samma header + flikar. */
export function MinaSidorAccountPage({
  ctx,
  title,
  subtitle,
  headerExtra,
  children,
}: {
  ctx: MinaSidorAccountContext;
  title: string;
  subtitle?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  if (!usesMinaSidorTabShell(ctx)) return null;

  return (
    <MinaSidorAccountChrome ctx={ctx}>
      <MinaSidorTabShellContent ctx={ctx} title={title} subtitle={subtitle} headerExtra={headerExtra}>
        {children}
      </MinaSidorTabShellContent>
    </MinaSidorAccountChrome>
  );
}
