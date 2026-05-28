import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Tenant } from "@/types/commerce";

const localhostAliases = new Set(["localhost", "127.0.0.1"]);

export function normalizeHost(value: string): string {
  const noPort = value.split(":")[0]?.trim().toLowerCase() || "";
  return noPort.startsWith("www.") ? noPort.slice(4) : noPort;
}

export async function getCurrentHost(): Promise<string> {
  const headersList = await headers();
  const headerHost =
    headersList.get("x-tenant-host") ||
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "localhost";
  return normalizeHost(headerHost);
}

export async function resolveTenantByHost(host: string): Promise<Tenant | null> {
  const supabase = createSupabaseAdminClient();
  const effectiveHost = localhostAliases.has(host)
    ? process.env.DEFAULT_TENANT_DOMAIN || ""
    : host;

  if (!effectiveHost) return null;

  const { data: mapping, error: mappingError } = await supabase
    .from("tenant_domains")
    .select("tenant_id, verification_status")
    .eq("domain", effectiveHost)
    .eq("verification_status", "verified")
    .maybeSingle();

  if (mappingError || !mapping) return null;

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id, name, slug, default_locale, default_currency")
    .eq("id", mapping.tenant_id)
    .maybeSingle();

  if (tenantError || !tenant) return null;
  return tenant as Tenant;
}
