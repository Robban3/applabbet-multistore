import Link from "next/link";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings } from "@/lib/tenant-settings";

export type AccountSidebarItem = {
  label: string;
  href: string;
};

const baseAccountSidebarItems: AccountSidebarItem[] = [
  { label: "Översikt", href: "/mina-sidor" },
  { label: "Mina ordrar", href: "/mina-sidor/ordrar" },
  { label: "Returer & återbetalningar", href: "/returer-aterbetalningar?account=1" },
  { label: "Mina adresser", href: "/mina-sidor/adresser" },
  { label: "Betalningsmetoder", href: "/mina-sidor/betalningsmetoder" },
  { label: "Mina uppgifter", href: "/mina-sidor/profil" },
  { label: "Favoriter", href: "/mina-sidor/favoriter" },
  { label: "Nyhetsbrev", href: "/mina-sidor/notiser" },
];

export function buildAccountSidebarItems(enableLoyaltyProgram = false): AccountSidebarItem[] {
  if (!enableLoyaltyProgram) {
    return [...baseAccountSidebarItems, { label: "Logga ut", href: "/mina-sidor/logga-ut" }];
  }
  return [
    ...baseAccountSidebarItems.slice(0, 7),
    { label: "Mina poäng", href: "/mina-sidor/poang" },
    ...baseAccountSidebarItems.slice(7),
    { label: "Logga ut", href: "/mina-sidor/logga-ut" },
  ];
}

export const accountSidebarItems: AccountSidebarItem[] = buildAccountSidebarItems(false);

function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 10h8" />
    </svg>
  );
}

type AccountSidebarProps = {
  activeHref: string;
  withIcons?: boolean;
  items?: AccountSidebarItem[];
};

async function getDefaultSidebarItems() {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return accountSidebarItems;
  const settings = await getTenantSettings(tenant);
  return buildAccountSidebarItems(settings.loyalty_program_enabled ?? false);
}

export async function AccountSidebar({ activeHref, withIcons = false, items }: AccountSidebarProps) {
  const resolvedItems = items ?? (await getDefaultSidebarItems());

  return (
    <aside className="space-y-1 rounded-xl border border-[#e6ddd1] bg-white p-3">
      {resolvedItems.map((item) => {
        const isLogout = item.href === "/mina-sidor/logga-ut";
        const isActive = item.href === activeHref;
        const baseClass = withIcons
          ? "flex items-center gap-2 rounded-md px-3 py-2 text-sm"
          : "block rounded-md px-3 py-2 text-sm";

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`${baseClass} ${
              isActive
                ? "bg-[#f7efe1] font-semibold text-slate-900"
                : isLogout
                  ? "mt-2 border border-rose-200 text-rose-700 hover:bg-rose-50"
                  : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {withIcons ? <SidebarIcon /> : null}
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
