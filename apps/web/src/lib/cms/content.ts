import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { applyThemePlaceholdersToDefaults } from "@/lib/cms/theme-placeholders";
import { createDefaultBlocksContent, getCmsPage, type CmsBlocksContent } from "@/lib/cms/registry";
import type { StorefrontThemeKey } from "@/lib/themes/types";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { cookies } from "next/headers";

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
    .maybeSingle();

  if (!data || !isObject(data.content)) return fallback;

  const { published, draft } = getCmsBlocksVariants(data.content);
  const cookieStore = await cookies();
  const previewPageKey = cookieStore.get("cms_preview_page_key")?.value;
  let useDraftPreview = false;

  if (previewPageKey === pageKey) {
    const supabaseServer = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (user) {
      const { data: membership } = await supabaseServer
        .from("tenant_users")
        .select("id")
        .eq("tenant_id", tenant.id)
        .eq("user_id", user.id)
        .maybeSingle();
      useDraftPreview = Boolean(membership);
    }
  }

  if (useDraftPreview) {
    return mergeDeep(fallback, { blocks: draft });
  }

  if (data.status === "published") {
    return mergeDeep(fallback, { blocks: published });
  }

  return fallback;
}

/** Laddar publicerat CMS-innehåll med tema-specifika standardvärden (samma som i admin-redigeraren). */
export async function loadThemedCmsPageContent(
  pageKey: string,
  themeKey: StorefrontThemeKey = "classic",
): Promise<{ blocks: CmsBlocksContent }> {
  const definition = getCmsPage(pageKey);
  const rawFallback = definition ? createDefaultBlocksContent(definition) : {};
  const fallbackBlocks = applyThemePlaceholdersToDefaults(pageKey, themeKey, rawFallback);
  return getPublishedPageContent(pageKey, { blocks: fallbackBlocks });
}

/** Laddar CMS för aktuell tenant utan att sidan behöver hämta themeKey själv. */
export async function loadThemedCmsPageContentForCurrentTenant(
  pageKey: string,
): Promise<{ blocks: CmsBlocksContent }> {
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  return loadThemedCmsPageContent(pageKey, themeKey);
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
  const variants = getCmsBlocksVariants(content);
  return Object.keys(variants.draft).length > 0 ? variants.draft : variants.published;
}

export function getCmsBlocksVariants(content: unknown): {
  published: CmsBlocksContent;
  draft: CmsBlocksContent;
} {
  if (!isObject(content)) return { published: {}, draft: {} };
  const contentRecord = content as Record<string, unknown>;

  const publishedSource = isObject(contentRecord.publishedBlocks)
    ? contentRecord.publishedBlocks
    : isObject(contentRecord.blocks)
      ? contentRecord.blocks
      : {};

  const draftSource = isObject(contentRecord.draftBlocks) ? contentRecord.draftBlocks : publishedSource;

  const normalize = (source: unknown): CmsBlocksContent => {
    if (!isObject(source)) return {};
    const normalized: CmsBlocksContent = {};
    for (const [blockKey, value] of Object.entries(source)) {
      if (!isObject(value)) continue;
      normalized[blockKey] = {};
      for (const [fieldKey, fieldValue] of Object.entries(value)) {
        normalized[blockKey][fieldKey] =
          typeof fieldValue === "string" ? fieldValue : JSON.stringify(fieldValue);
      }
    }
    return normalized;
  };

  return {
    published: normalize(publishedSource),
    draft: normalize(draftSource),
  };
}
