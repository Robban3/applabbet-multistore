import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

export async function getStorefrontThemeKey(): Promise<string> {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return "classic";
  const settings = await getTenantSettings(tenant);
  return normalizeThemeKey(settings?.theme_key);
}
