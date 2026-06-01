import type { ReactNode } from "react";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorAccountPage, usesMinaSidorTabShell, type MinaSidorAccountContext } from "@/lib/mina-sidor-shell";

export type ReturerFlowPageOptions = {
  title: string;
  subtitle?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
};

/** Laddar kontext efter inloggning. */
export async function loadReturerAccountContext() {
  return loadAccountContext();
}

export function isReturerTabShellTheme(ctx: MinaSidorAccountContext) {
  return usesMinaSidorTabShell(ctx);
}

/**
 * Om temat har flikmeny på Mina sidor: returnera wrapped page.
 * Annars null — anroparen renderar klassisk boxad layout.
 */
export function renderReturerAccountPage(ctx: MinaSidorAccountContext, options: ReturerFlowPageOptions) {
  return (
    <MinaSidorAccountPage ctx={ctx} title={options.title} subtitle={options.subtitle} headerExtra={options.headerExtra}>
      {options.children}
    </MinaSidorAccountPage>
  );
}
