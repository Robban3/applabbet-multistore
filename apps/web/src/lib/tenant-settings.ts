import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Tenant } from "@/types/commerce";

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
  theme_key: "classic" | "sport" | "fashion" | "beauty" | "electronics" | "minimal";
};

const defaultPaymentMethods: PaymentMethods = {
  stripe: true,
  klarna: false,
  swish: false,
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

export function normalizePaymentMethods(input: unknown): PaymentMethods {
  const source = typeof input === "object" && input ? (input as Record<string, unknown>) : {};
  return {
    stripe: Boolean(source.stripe ?? defaultPaymentMethods.stripe),
    klarna: Boolean(source.klarna ?? defaultPaymentMethods.klarna),
    swish: Boolean(source.swish ?? defaultPaymentMethods.swish),
  };
}

export function normalizeTrustBadges(input: unknown): TrustBadge[] {
  const validIcons = new Set<TrustBadge["icon"]>(["truck", "rotate", "shield", "star"]);
  const source = Array.isArray(input) ? input : [];
  const normalized = source
    .map((item, index) => {
      const row = typeof item === "object" && item ? (item as Record<string, unknown>) : {};
      const title = String(row.title ?? "").trim();
      const text = String(row.text ?? "").trim();
      const iconCandidate = String(row.icon ?? "").trim() as TrustBadge["icon"];
      const icon = validIcons.has(iconCandidate)
        ? iconCandidate
        : defaultTrustBadges[Math.min(index, defaultTrustBadges.length - 1)]?.icon ?? "shield";
      const enabled = row.enabled === undefined ? true : Boolean(row.enabled);
      if (!title) return null;
      return { title, text, icon, enabled };
    })
    .filter((row): row is TrustBadge => Boolean(row))
    .slice(0, 4);

  if (normalized.length > 0) return normalized;

  return defaultTrustBadges.map((fallback, index) => ({
    title: normalized[index]?.title ?? fallback.title,
    text: normalized[index]?.text ?? fallback.text,
    icon: normalized[index]?.icon ?? fallback.icon,
    enabled: normalized[index]?.enabled ?? fallback.enabled,
  }));
}

export function normalizeLoyaltyProgramEnabled(input: unknown): boolean {
  return Boolean(input);
}

export function normalizeThemeKey(input: unknown): TenantSettings["theme_key"] {
  const value = String(input || "").trim().toLowerCase();
  if (value === "sport" || value === "fashion" || value === "beauty" || value === "electronics" || value === "minimal") return value;
  return "classic";
}

function resolveMenuHref(hrefInput: string, slugInput: string): string {
  const href = hrefInput.trim();
  const slug = slugInput.trim();
  if (href) return href;
  if (!slug) return "/";
  if (slug.startsWith("/")) return slug;
  return `/sidor/${slug}`;
}

export function normalizeNavigationMenu(input: unknown): NavigationMenuItem[] {
  const source = Array.isArray(input) ? input : [];
  const normalized = source
    .map((item, index) => {
      const row = typeof item === "object" && item ? (item as Record<string, unknown>) : {};
      const label = String(row.label ?? "").trim();
      const hrefInput = String(row.href ?? "").trim();
      const slug = String(row.slug ?? "").trim();
      if (!label) return null;
      const href = resolveMenuHref(hrefInput, slug);
      const order =
        typeof row.order === "number"
          ? row.order
          : Number.isFinite(Number(row.order))
            ? Number(row.order)
            : (index + 1) * 10;
      const enabled = row.enabled === undefined ? true : Boolean(row.enabled);
      return { label, href, slug, order, enabled };
    })
    .filter((item): item is NavigationMenuItem => Boolean(item))
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  return normalized.length > 0 ? normalized : defaultNavigationMenu;
}

export async function getTenantSettings(tenant: Tenant): Promise<TenantSettings | null> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("tenant_settings")
    .select(
      "tenant_id, logo_url, brand_name, company_name, org_number, vat_number, support_email, support_phone, footer_show_company_name, footer_show_org_number, footer_show_support_phone, footer_show_support_email, address_line1, postal_code, city, country, payment_methods, payment_config, trust_badges, navigation_menu, loyalty_program_enabled, theme_key",
    )
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  if (!data) return null;
  return {
    ...(data as Omit<TenantSettings, "payment_methods" | "payment_config" | "trust_badges" | "loyalty_program_enabled">),
    payment_methods: normalizePaymentMethods(data.payment_methods),
    footer_show_company_name: Boolean(data.footer_show_company_name ?? true),
    footer_show_org_number: Boolean(data.footer_show_org_number ?? false),
    footer_show_support_phone: Boolean(data.footer_show_support_phone ?? false),
    footer_show_support_email: Boolean(data.footer_show_support_email ?? true),
    payment_config:
      typeof data.payment_config === "object" && data.payment_config
        ? (data.payment_config as Record<string, string>)
        : {},
    trust_badges: normalizeTrustBadges(data.trust_badges),
    navigation_menu: normalizeNavigationMenu(data.navigation_menu),
    loyalty_program_enabled: normalizeLoyaltyProgramEnabled(data.loyalty_program_enabled),
    theme_key: normalizeThemeKey(data.theme_key),
  };
}
