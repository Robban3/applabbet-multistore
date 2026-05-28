import { getTenantSettings } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const DEFAULT_BRAND_NAME = "APPLABBET";

export async function getStoreBrandName(): Promise<string> {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return DEFAULT_BRAND_NAME;

  const settings = await getTenantSettings(tenant);
  const fromSettings = settings?.brand_name?.trim();
  if (fromSettings) return fromSettings;

  const fromTenant = tenant.name?.trim();
  if (fromTenant) return fromTenant;

  return DEFAULT_BRAND_NAME;
}

export function toBrandGenitive(brandName: string): string {
  const trimmed = brandName.trim();
  if (!trimmed) return `${DEFAULT_BRAND_NAME}s`;
  return /s$/i.test(trimmed) ? trimmed : `${trimmed}s`;
}
