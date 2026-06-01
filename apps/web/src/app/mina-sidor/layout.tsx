import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorAccountChrome, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";

/**
 * Tema-medveten layout för alla /mina-sidor/*.
 * - sport       → Nike-shell: header + tabs (vit)
 * - fashion     → Filippa K-shell: header + tabs (cream)
 * - minimal     → Apple-shell: header + tabs (vit)
 * - electronics → Komplett-shell: header + tabs (vit/blå)
 * - övriga      → children orörda (boxad shell i sidorna själva)
 *
 * Aktiv flik bestäms av client-component via usePathname.
 */
export default async function MinaSidorLayout({ children }: { children: React.ReactNode }) {
  const ctx = await loadAccountContext();

  if (usesMinaSidorTabShell(ctx)) {
    return <MinaSidorAccountChrome ctx={ctx}>{children}</MinaSidorAccountChrome>;
  }

  return <>{children}</>;
}
