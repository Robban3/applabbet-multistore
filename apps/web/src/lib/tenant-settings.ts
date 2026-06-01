import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { readDevThemeOverride } from "@/lib/dev-theme-override";
import type { StorefrontThemeKey } from "@/lib/themes/types";
import type { Tenant } from "@/types/commerce";

// Delade typer + konstanter (client-safe). Re-exporteras för bakåtkompat —
// klient-kod KAN importera direkt från shared-filen för minsta bundle.
import {
  defaultTrustBadges,
  defaultNavigationMenu,
  type PaymentMethods,
  type NavigationMenuItem,
  type TrustBadge,
  type TenantSettings,
} from "@/lib/tenant-settings-shared";

export { defaultTrustBadges, defaultNavigationMenu };
export type { PaymentMethods, NavigationMenuItem, TrustBadge, TenantSettings };

const defaultPaymentMethods: PaymentMethods = {
  stripe: true,
  klarna: false,
  swish: false,
};

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

export function normalizeThemeKey(input: unknown): StorefrontThemeKey {
  const value = String(input || "").trim().toLowerCase();
  if (
    value === "luxury" ||
    value === "sport" ||
    value === "fashion" ||
    value === "beauty" ||
    value === "electronics" ||
    value === "minimal"
  ) {
    return value;
  }

  if (value === "classic") {
    return "classic";
  }

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
  // Dev-cookie får BARA påverka utvecklingstenanten "applabbet-demo".
  // Riktiga tenants (sport-demo / luxury-demo / classic-demo) styrs av sin egen
  // theme_key i DB — annars skulle en användare som råkar ha dev_theme satt
  // se "fel" tema på en riktig butik.
  const allowDevOverride = tenant.slug === "applabbet-demo";
  const devTheme = allowDevOverride ? await readDevThemeOverride() : null;
  return {
    ...(data as Omit<TenantSettings, "payment_methods" | "payment_config" | "trust_badges" | "loyalty_program_enabled" | "theme_key">),
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
    theme_key: devTheme ?? normalizeThemeKey(data.theme_key),
  };
}
