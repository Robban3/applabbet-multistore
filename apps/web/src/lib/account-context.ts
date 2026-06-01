import { cache } from "react";
import { buildAccountSidebarItems } from "@/components/account-sidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

const ELECTRONICS_DEV_HOSTS = new Set(["electronics.localhost"]);

export function isElectronicsStorefront(host: string, themeKey: string): boolean {
  return themeKey === "electronics" || ELECTRONICS_DEV_HOSTS.has(host);
}

/**
 * Server-side helper för alla /mina-sidor/*-sidor.
 * Returnerar tema, sidebar-items och inloggad användarens namn.
 * Anropare gör själv redirect till /konto/login om user saknas.
 */
export const loadAccountContext = cache(async function loadAccountContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const isSport = themeKey === "sport";
  const isElectronics = isElectronicsStorefront(host, themeKey);
  const loyaltyEnabled = settings?.loyalty_program_enabled ?? false;
  const sidebarItems = buildAccountSidebarItems(loyaltyEnabled);

  let greetingName = "där";
  if (user) {
    const fullNameMeta = String(user.user_metadata?.full_name || "").trim();
    const fallback = fullNameMeta || (user.email ? user.email.split("@")[0] : "");
    if (tenant) {
      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("first_name, last_name")
        .eq("tenant_id", tenant.id)
        .eq("user_id", user.id)
        .maybeSingle();
      const full = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
      greetingName = full || fallback || greetingName;
    } else if (fallback) {
      greetingName = fallback;
    }
  }

  return {
    user,
    tenant,
    settings,
    themeKey,
    isSport,
    isElectronics,
    loyaltyEnabled,
    sidebarItems,
    greetingName,
  };
});
