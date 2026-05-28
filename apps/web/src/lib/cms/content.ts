import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { CmsBlocksContent } from "@/lib/cms/registry";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) {
    return (override as T) ?? base;
  }

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    if (isObject(current) && isObject(value)) {
      merged[key] = mergeDeep(current, value);
      continue;
    }
    merged[key] = value;
  }
  return merged as T;
}

export async function getPublishedPageContent<T extends Record<string, unknown>>(
  pageKey: string,
  fallback: T,
): Promise<T> {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) return fallback;

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("page_content")
    .select("content, status")
    .eq("tenant_id", tenant.id)
    .eq("page_key", pageKey)
    .eq("status", "published")
    .maybeSingle();

  if (!data || !isObject(data.content)) return fallback;
  return mergeDeep(fallback, data.content);
}

export function getCmsBlockField(
  blocks: unknown,
  blockKey: string,
  fieldKey: string,
  fallback: string,
): string {
  if (!isObject(blocks)) return fallback;
  const block = blocks[blockKey];
  if (!isObject(block)) return fallback;
  const value = block[fieldKey];
  return typeof value === "string" ? value : fallback;
}

export function getCmsBlocksContent(content: unknown): CmsBlocksContent {
  if (!isObject(content)) return {};
  const blocks = content.blocks;
  if (!isObject(blocks)) return {};

  const normalized: CmsBlocksContent = {};
  for (const [blockKey, value] of Object.entries(blocks)) {
    if (!isObject(value)) continue;
    normalized[blockKey] = {};
    for (const [fieldKey, fieldValue] of Object.entries(value)) {
      normalized[blockKey][fieldKey] = typeof fieldValue === "string" ? fieldValue : JSON.stringify(fieldValue);
    }
  }
  return normalized;
}
