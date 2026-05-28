import Link from "next/link";
import {
  CatalogPagination,
  CatalogResultsGrid,
  CatalogSearchForm,
} from "@/components/catalog-blocks";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type NyheterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NyheterPage({ searchParams }: NyheterPageProps) {
  const definition = getCmsPage("nyheter");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("nyheter", { blocks: fallbackBlocks });

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Ingen tenant hittades for domanen. Lagg till host i tenant_domains och satt den som verified.
        </p>
      </main>
    );
  }

  const parsed = parseCatalogQuery(await searchParams);
  const query = {
    ...parsed,
    sort: parsed.sort === "relevance" ? "newest" : parsed.sort,
  };
  const supabase = createSupabaseAdminClient();
  const settings = await getTenantSettings(tenant);
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const isFashion = themeKey === "fashion";
  const isBeauty = themeKey === "beauty";
  const isElectronics = themeKey === "electronics";
  const isSport = themeKey === "sport";
  const filterShellClass = isSport
    ? "border-[#afcf90] bg-[#eef7e4]"
    : isFashion
      ? "border-[#d7c5ad] bg-[#f7f1ea]"
      : isBeauty
        ? "border-[#eac4d1] bg-[#fff1f6]"
        : isElectronics
          ? "border-[#bed2f4] bg-[#edf4ff]"
          : "border-[color:var(--store-card-border)] bg-[color:var(--store-soft-surface)]";
  const cardVariant =
    themeKey === "fashion"
      ? "fashion"
      : themeKey === "sport"
        ? "sport"
        : themeKey === "beauty"
          ? "beauty"
          : isElectronics
            ? "electronics"
            : "default";
  const catalog = await getCatalogData(supabase, tenant.id, query, { onlyNew: true });
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);
  const resultLabelTemplate = getCmsBlockField(cms.blocks, "listing", "resultLabel", "{count} produkter");
  const resultLabel = resultLabelTemplate.includes("{count}")
    ? resultLabelTemplate.replace("{count}", String(catalog.total))
    : `${catalog.total} produkter`;

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-[color:var(--store-shell-surface)] shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <div className="relative min-h-[320px] overflow-hidden px-6 pb-12 pt-2 text-white" style={{ background: "var(--store-header-gradient)" }}>
            <StorefrontHeader activeNav="Nyheter" cartCount={2} />
            <div
              className="pointer-events-none absolute right-6 top-10 h-48 w-72 rounded-full border-[16px]"
              style={{ borderColor: isElectronics ? "rgba(88, 140, 255, 0.35)" : isBeauty ? "rgba(245, 188, 209, 0.35)" : isSport ? "rgba(179, 255, 0, 0.24)" : "rgba(215, 178, 132, 0.35)" }}
            />
            <div className="relative z-10 pt-4">
              <p className="text-sm font-medium tracking-wide text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-2 text-white/45">&gt;</span>
                <Link href="/nyheter" className="hover:text-white">Nyheter</Link>
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-tight">
                {getCmsBlockField(cms.blocks, "hero", "title", "Nyheter 2026")}
              </h1>
              <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-white/78">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  "Upptäck årets senaste produkter.\nKvalitet, design och innovation i varje detalj.",
                )}
              </p>
            </div>
          </div>

          <section className="px-5 py-5">
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <aside
                className={`rounded-xl border p-4 ${filterShellClass}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
                  <Link href="/nyheter" className="text-xs text-slate-500 hover:text-slate-700">
                    Rensa alla
                  </Link>
                </div>

                <AutoSubmitFilterForm action="/nyheter" className="space-y-5 text-sm text-slate-700">
                  <div>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Kategori</p>
                    <div className="space-y-2">
                      {catalog.availableCategories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="category"
                            value={category.slug}
                            defaultChecked={query.categories.includes(category.slug)}
                            className="accent-[color:var(--store-accent)]"
                          />
                          {category.name}
                        </label>
                      ))}
                      {catalog.availableCategories.length === 0 ? (
                        <p className="text-xs text-slate-500">Inga kategorier tillgängliga ännu.</p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Varumärke</p>
                    <div className="space-y-2">
                      {catalog.availableBrands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="brand"
                            value={brand}
                            defaultChecked={query.brands.includes(brand)}
                            className="accent-[color:var(--store-accent)]"
                          />
                          {brand}
                        </label>
                      ))}
                      {catalog.availableBrands.length === 0 ? (
                        <p className="text-xs text-slate-500">Inga varumärken tillgängliga ännu.</p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Pris</p>
                    <PriceRangeFilter
                      minBound={0}
                      maxBound={10000}
                      initialMin={query.minPrice}
                      initialMax={query.maxPrice}
                    />
                  </div>

                  <div>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Egenskaper</p>
                    <div className="space-y-2">
                      {catalog.availableFeatures.map((feature) => (
                        <label key={feature} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="feature"
                            value={feature}
                            defaultChecked={query.features.includes(feature)}
                            className="accent-[color:var(--store-accent)]"
                          />
                          {feature}
                        </label>
                      ))}
                      {catalog.availableFeatures.length === 0 ? (
                        <p className="text-xs text-slate-500">Inga egenskaper tillgängliga ännu.</p>
                      ) : null}
                    </div>
                  </div>

                  {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                  {query.sort !== "relevance" ? <input type="hidden" name="sort" value={query.sort} /> : null}
                </AutoSubmitFilterForm>
              </aside>

              <section>
                <div className="mb-3 space-y-3">
                  <CatalogSearchForm actionPath="/nyheter" query={query} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-slate-700">{resultLabel}</p>
                    <form method="GET" action="/nyheter" className="flex items-center gap-2">
                      {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                      {query.categories.map((category) => (
                        <input key={`sort-category-${category}`} type="hidden" name="category" value={category} />
                      ))}
                      {query.brands.map((brand) => (
                        <input key={`sort-brand-${brand}`} type="hidden" name="brand" value={brand} />
                      ))}
                      {query.features.map((feature) => (
                        <input key={`sort-feature-${feature}`} type="hidden" name="feature" value={feature} />
                      ))}
                      {query.colors.map((color) => (
                        <input key={`sort-color-${color}`} type="hidden" name="color" value={color} />
                      ))}
                      {typeof query.minPrice === "number" ? <input type="hidden" name="minPrice" value={query.minPrice} /> : null}
                      {typeof query.maxPrice === "number" ? <input type="hidden" name="maxPrice" value={query.maxPrice} /> : null}
                      <select
                        name="sort"
                        defaultValue={query.sort}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600"
                      >
                        <option value="newest">Sortera: Nyast</option>
                        <option value="price_asc">Sortera: Pris stigande</option>
                        <option value="price_desc">Sortera: Pris fallande</option>
                      </select>
                      <button type="submit" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                        Visa
                      </button>
                    </form>
                  </div>
                </div>

                <CatalogResultsGrid
                  products={catalog.items}
                  favoriteProductIds={favoriteProductIds}
                  badgeLabel="NYHET"
                  cardVariant={cardVariant}
                />
                <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
