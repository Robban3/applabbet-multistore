// Delade typer + konstanter som är säkra att importera från både server-
// och klient-komponenter. Här finns inga Node-only beroenden (cookies,
// supabase-admin, etc.) — bara rena data.

import type { StorefrontThemeKey } from "@/lib/themes/types";

export type PaymentMethods = {
  stripe: boolean;
  klarna: boolean;
  swish: boolean;
};

export type NavigationMenuItem = {
  label: string;
  href: string;
  slug: string;
  order: number;
  enabled: boolean;
};

export type TrustBadge = {
  title: string;
  text: string;
  icon: "truck" | "rotate" | "shield" | "star";
  enabled: boolean;
};

export type TenantSettings = {
  tenant_id: string;
  logo_url: string | null;
  brand_name: string | null;
  company_name: string | null;
  org_number: string | null;
  vat_number: string | null;
  support_email: string | null;
  support_phone: string | null;
  footer_show_company_name: boolean;
  footer_show_org_number: boolean;
  footer_show_support_phone: boolean;
  footer_show_support_email: boolean;
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  payment_methods: PaymentMethods;
  payment_config: Record<string, string>;
  trust_badges: TrustBadge[];
  navigation_menu: NavigationMenuItem[];
  loyalty_program_enabled: boolean;
  theme_key: StorefrontThemeKey;
};

export const defaultTrustBadges: TrustBadge[] = [
  { title: "Fri frakt över 499 kr", text: "Snabb & spårbar leverans", icon: "truck", enabled: true },
  { title: "30 dagars öppet köp", text: "Enkelt att returnera", icon: "rotate", enabled: true },
  { title: "Säker betalning", text: "Tryggt & säkert", icon: "shield", enabled: true },
];

export const defaultNavigationMenu: NavigationMenuItem[] = [
  { label: "Hem", href: "/", slug: "", order: 10, enabled: true },
  { label: "Kategorier", href: "/products", slug: "", order: 20, enabled: true },
  { label: "Nyheter", href: "/nyheter", slug: "", order: 30, enabled: true },
  { label: "Bästsäljare", href: "/bastsaljare", slug: "", order: 40, enabled: true },
  { label: "Om oss", href: "/om-oss", slug: "", order: 50, enabled: true },
  { label: "Kundservice", href: "/kundservice", slug: "", order: 60, enabled: true },
];
