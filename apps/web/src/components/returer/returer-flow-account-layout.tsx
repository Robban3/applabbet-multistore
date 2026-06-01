import Link from "next/link";
import type { ReactNode } from "react";
import { StorefrontHeader } from "@/components/storefront-header";
import { loadReturerAccountContext, renderReturerAccountPage } from "@/lib/returer-account-flow";

type ReturerFlowAccountLayoutProps = {
  title: string;
  subtitle: string;
  breadcrumb?: ReactNode;
  children: ReactNode;
};

/** Klassisk hero + box, eller flik-shell för sport/fashion/minimal/electronics. */
export async function ReturerFlowAccountLayout({
  title,
  subtitle,
  breadcrumb,
  children,
}: ReturerFlowAccountLayoutProps) {
  const accountCtx = await loadReturerAccountContext();

  const tabShellPage = renderReturerAccountPage(accountCtx, {
    title,
    subtitle,
    children,
  });
  if (tabShellPage) return tabShellPage;

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />
          <section className="relative overflow-hidden border-b border-[#1d1812] bg-gradient-to-r from-[#0d0b09] via-[#17130f] to-[#231b13] px-6 py-6 text-white">
            <div className="relative z-10 max-w-[560px]">
              {breadcrumb}
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.95] tracking-tight">{title}</h1>
              <p className="mt-3 text-[30px] leading-relaxed text-white/92">{subtitle}</p>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%]">
              <div className="absolute right-14 top-7 h-44 w-72 -rotate-[6deg] rounded-lg border border-white/15 bg-black/45" />
              <div className="absolute right-9 top-20 h-36 w-56 rounded-lg border border-[var(--store-accent)]/40 bg-[#231b13]/60" />
            </div>
          </section>
          {children}
        </div>
      </section>
    </main>
  );
}

export function ReturerFlowBreadcrumb({ children }: { children: ReactNode }) {
  return <p className="text-xs text-white/70">{children}</p>;
}

export function ReturerFlowBreadcrumbLink({ href, children, active }: { href: string; children: ReactNode; active?: boolean }) {
  return (
    <Link href={href} className={active ? "text-[color:var(--store-accent)]" : "hover:text-white"}>
      {children}
    </Link>
  );
}
