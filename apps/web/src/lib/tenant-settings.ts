import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Tenant } from "@/types/commerce";

export type PaymentMethods = {
  stripe: boolean;
  klarna: boolean;
  swish: boolean;
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
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  payment_methods: PaymentMethods;
  payment_config: Record<string, string>;
  trust_badges: TrustBadge[];
  loyalty_program_enabled: boolean;
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

export async function getTenantSettings(tenant: Tenant): Promise<TenantSettings | null> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("tenant_settings")
    .select(
      "tenant_id, logo_url, brand_name, company_name, org_number, vat_number, support_email, support_phone, address_line1, postal_code, city, country, payment_methods, payment_config, trust_badges, loyalty_program_enabled",
    )
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  if (!data) return null;
  return {
    ...(data as Omit<TenantSettings, "payment_methods" | "payment_config" | "trust_badges" | "loyalty_program_enabled">),
    payment_methods: normalizePaymentMethods(data.payment_methods),
    payment_config:
      typeof data.payment_config === "object" && data.payment_config
        ? (data.payment_config as Record<string, string>)
        : {},
    trust_badges: normalizeTrustBadges(data.trust_badges),
    loyalty_program_enabled: normalizeLoyaltyProgramEnabled(data.loyalty_program_enabled),
  };
}
