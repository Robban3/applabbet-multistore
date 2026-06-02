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
  // x-forwarded-host bär pålitligt det externa värdnamnet (t.ex.
  // sport.localhost:3000) även under server-action-renderingar, där
  // x-tenant-host/host kan bli "localhost" (serverns bind-adress) och
  // felaktigt lösa upp till default-tenanten. Därför prioriteras
  // x-forwarded-host före x-tenant-host.
  const headerHost =
    headersList.get("x-forwarded-host") ||
    headersList.get("x-tenant-host") ||
    headersList.get("host") ||
    "localhost";
  return normalizeHost(headerHost);
}

type SupabaseClient = ReturnType<typeof createSupabaseAdminClient>;

async function lookupTenantByDomain(supabase: SupabaseClient, domain: string): Promise<Tenant | null> {
  const { data: mapping, error: mappingError } = await supabase
    .from("tenant_domains")
    .select("tenant_id, verification_status")
    .eq("domain", domain)
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

export async function resolveTenantByHost(host: string): Promise<Tenant | null> {
  const supabase = createSupabaseAdminClient();
  const effectiveHost = localhostAliases.has(host)
    ? process.env.DEFAULT_TENANT_DOMAIN || ""
    : host;

  if (!effectiveHost) return null;

  const tenant = await lookupTenantByDomain(supabase, effectiveHost);
  if (tenant) return tenant;

  // Om hosten inte finns i tenant_domains (t.ex. workers.dev-URL eller okänd
  // preview-domän), fall tillbaka på DEFAULT_TENANT_DOMAIN så att deployments
  // alltid visar en butik.
  const fallbackDomain = process.env.DEFAULT_TENANT_DOMAIN;
  if (fallbackDomain && effectiveHost !== fallbackDomain) {
    return lookupTenantByDomain(supabase, fallbackDomain);
  }

  return null;
}
