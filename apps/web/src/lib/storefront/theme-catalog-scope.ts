import type { SupabaseClient } from "@supabase/supabase-js";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import type { CatalogQueryState } from "@/lib/catalog";

/**
 * Begränsar produktlistan till temats kategorier när användaren inte
 * uttryckligen filtrerat på en kategori. Demo-tenant kan innehålla
 * blandade kategorier (sport + luxury) — men varje storefront ska bara
 * visa sin tema-relevanta del.
 *
 * Strategi: hämta DB-kategori-slugs som matchar temats `categoryCards`
 * (case-insensitive). Saknar query en kategori → injicera listan. Om
 * användaren redan valt en kategori → ändra inget. Om DB inte har några
 * matchande kategorier → returnera query oförändrad (= visa allt,
 * defensivt fallback för fel-konfigurerade butiker).
 */
export async function applyThemeScopeToCatalogQuery(
  supabase: SupabaseClient,
  tenantId: string,
  themeKey: string,
  query: CatalogQueryState,
): Promise<CatalogQueryState> {
  // Användarens egna val har företräde — rör inte.
  if (query.categories.length > 0) return query;

  const themeTitles = new Set(
    getStorefrontConfig(themeKey).categoryCards.map((c) => c.title.trim().toLowerCase()),
  );
  if (themeTitles.size === 0) return query;

  const { data: dbCats } = await supabase
    .from("product_categories")
    .select("slug, name")
    .eq("tenant_id", tenantId);

  const matchingSlugs = (dbCats || [])
    .filter((c) => themeTitles.has(String(c.name).trim().toLowerCase()))
    .map((c) => c.slug as string);

  if (matchingSlugs.length === 0) return query;
  return { ...query, categories: matchingSlugs };
}
