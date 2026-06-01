import Link from "next/link";
import {
  CatalogPagination,
  CatalogResultsGrid,
  CatalogSearchForm,
} from "@/components/catalog-blocks";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { CatalogFilterSidebar } from "@/components/catalog-filter-sidebar";
import { StorefrontHeader } from "@/components/storefront-header";
import { SportCatalogPage } from "@/components/storefront/sport/sport-catalog-page";
import { FashionPageHero } from "@/components/storefront/fashion/fashion-page-hero";
import { MinimalPageHero } from "@/components/storefront/minimal/minimal-page-hero";
import { ElectronicsPageHero } from "@/components/storefront/electronics";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { applyThemePlaceholdersToDefaults } from "@/lib/cms/theme-placeholders";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { applyThemeScopeToCatalogQuery } from "@/lib/storefront/theme-catalog-scope";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type NyheterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NyheterPage({ searchParams }: NyheterPageProps) {
  const definition = getCmsPage("nyheter");
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
  const rawFallback = definition ? createDefaultBlocksContent(definition) : {};
  const fallbackBlocks = applyThemePlaceholdersToDefaults("nyheter", themeKey, rawFallback);
  const cms = await getPublishedPageContent("nyheter", { blocks: fallbackBlocks });
  const isLuxury = themeKey === "luxury";
  const isFashion = themeKey === "fashion";
  const isBeauty = themeKey === "beauty";
  const isElectronics = themeKey === "electronics";
  const isSport = themeKey === "sport";
  const filterShellClass = isLuxury
    ? "border-[#EDE5DC] bg-[#FAF8F5]"
    : isSport
    ? "border-[#afcf90] bg-[#eef7e4]"
    : isFashion
      ? "border-[#d7c5ad] bg-[#f7f1ea]"
      : isBeauty
        ? "border-[#eac4d1] bg-[#fff1f6]"
        : isElectronics
          ? "border-[#bed2f4] bg-[#edf4ff]"
          : "border-[color:var(--store-card-border)] bg-[color:var(--store-soft-surface)]";
  const cardVariant =
    isLuxury
      ? "luxury"
      : themeKey === "fashion"
        ? "fashion"
        : themeKey === "sport"
          ? "sport"
          : themeKey === "beauty"
            ? "beauty"
            : isElectronics
              ? "electronics"
              : "default";
  const scopedQuery = await applyThemeScopeToCatalogQuery(supabase, tenant.id, themeKey, query);
  const catalog = await getCatalogData(supabase, tenant.id, scopedQuery, { onlyNew: true });
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);

  // Tema-relevanta kategorier (samma logik som /products)
  const themeConfigCats = new Set(
    getStorefrontConfig(themeKey).categoryCards.map((c) => c.title.trim().toLowerCase()),
  );
  const filteredCats = themeConfigCats.size > 0
    ? catalog.availableCategories.filter((c) => themeConfigCats.has(c.name.trim().toLowerCase()))
    : catalog.availableCategories;
  const visibleCategories = filteredCats.length > 0 ? filteredCats : catalog.availableCategories;
  const resultLabelTemplate = getCmsBlockField(cms.blocks, "listing", "resultLabel", "{count} produkter");
  const resultLabel = resultLabelTemplate.includes("{count}")
    ? resultLabelTemplate.replace("{count}", String(catalog.total))
    : `${catalog.total} produkter`;

  if (themeKey === "electronics") {
    return (
      <main className="bg-white">
        <StorefrontHeader activeNav="" cartCount={2} />
        <ElectronicsPageHero eyebrow="Nyheter" title={getCmsBlockField(cms.blocks, "hero", "title", "Senaste nyheterna")} description={`${catalog.total} produkter`} />
        <section className="bg-[#F4F7FC] px-6 py-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-5 flex items-center justify-between rounded-[12px] border border-[#DCE6F5] bg-white px-4 py-3">
              <p className="text-[14px] text-[#0A2540]/70">{resultLabel}</p>
              <form method="GET" action="/nyheter" className="flex items-center gap-2">
                {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                <select name="sort" defaultValue={query.sort} className="rounded-[8px] border border-[#DCE6F5] bg-white px-3 py-1.5 text-[13px] text-[#0A2540] focus:outline-none">
                  <option value="newest">Nyast</option>
                  <option value="price_asc">Lägsta pris</option>
                  <option value="price_desc">Högsta pris</option>
                </select>
              </form>
            </div>
            <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="electronics-deal" />
            <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
          </div>
        </section>
      </main>
    );
  }

  if (themeKey === "minimal") {
    return (
      <main className="bg-white">
        <StorefrontHeader activeNav="Nyheter" cartCount={2} />
        <MinimalPageHero
          eyebrow="Nyheter"
          title={getCmsBlockField(cms.blocks, "hero", "title", "Senaste nytt")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "De senaste produkterna i sortimentet.")}
        />
        <section className="bg-[#F5F5F7] px-6 py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[15px] text-[#6E6E73]">{resultLabel}</p>
              <form method="GET" action="/nyheter" className="flex items-center gap-2">
                {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                <select name="sort" defaultValue={query.sort} className="rounded-full border border-[#D2D2D7] bg-white px-4 py-2 text-[13px] text-[#1D1D1F] focus:outline-none">
                  <option value="newest">Nyast</option>
                  <option value="price_asc">Lägsta pris</option>
                  <option value="price_desc">Högsta pris</option>
                </select>
              </form>
            </div>
            <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} badgeLabel="NYHET" cardVariant="minimal" />
            <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
          </div>
        </section>
      </main>
    );
  }

  if (isFashion) {
    return (
      <main className="bg-[#FAF9F6]">
        <StorefrontHeader activeNav="New In" cartCount={2} />
        <FashionPageHero
          eyebrow="New In"
          title={getCmsBlockField(cms.blocks, "hero", "title", "Just arrived")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "Säsongens senaste tillskott till din garderob.")}
        />
        <section className="bg-[#FAF9F6] px-8 py-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <CatalogFilterSidebar
              themeKey="fashion"
              actionPath="/nyheter"
              query={query}
              categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
              brands={catalog.availableBrands}
              maxPriceBound={1000000}
            />
            <section>
              <div className="mb-6 flex items-center justify-between border-b border-[#E5E1DC] pb-4">
                <p className="text-[13px] tracking-[0.02em] text-[#1A1A1A]/70">{resultLabel}</p>
                <form method="GET" action="/nyheter" className="flex items-center gap-3">
                  {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                  {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                  {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/55">Sort</span>
                  <select name="sort" defaultValue={query.sort} className="border-0 bg-transparent text-[13px] text-[#1A1A1A] focus:outline-none">
                    <option value="newest">Newest</option>
                    <option value="price_asc">Lägsta pris</option>
                    <option value="price_desc">Högsta pris</option>
                  </select>
                </form>
              </div>
              <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} badgeLabel="NEW" cardVariant="fashion" />
              <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (isSport) {
    const activeCat =
      query.categories.length === 1
        ? (visibleCategories.find(
            (c) =>
              c.slug.toLowerCase() === query.categories[0].toLowerCase() ||
              c.name.toLowerCase() === query.categories[0].toLowerCase(),
          )?.name ?? null)
        : null;
    return (
      <SportCatalogPage
        actionPath="/nyheter"
        activeNav="Nyheter"
        breadcrumbLabel="Nyheter"
        title="Nyheter"
        activeCategoryName={activeCat}
        totalCount={catalog.total}
        navCategories={visibleCategories.map((c) => ({ name: c.name, slug: c.slug }))}
        filterCategories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
        brandFilterOptions={catalog.availableBrands}
        query={query}
        items={catalog.items}
        favoriteProductIds={favoriteProductIds}
        totalPages={catalog.totalPages}
        badgeLabel="NYHET"
        sortOptions={[
          { value: "newest", label: "Nyast" },
          { value: "price_asc", label: "Pris stigande" },
          { value: "price_desc", label: "Pris fallande" },
        ]}
      />
    );
  }

  if (isLuxury) {
    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Nyheter" cartCount={2} />
          <div className="px-8 py-16 sm:px-12 lg:px-14 lg:py-20 border-b border-white/8">
            <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Nouveautés</p>
            <h1 className="mt-4 font-light text-white" style={{ fontSize: "clamp(36px, 4vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              {getCmsBlockField(cms.blocks, "hero", "title", "Nyheter")}
            </h1>
            <p className="mt-4 max-w-[500px] text-[14px] font-light leading-relaxed text-white/55">
              {getCmsBlockField(cms.blocks, "hero", "description", "Upptäck årets senaste pjäser — noggrant utvalt för dig som värderar det extraordinära.")}
            </p>
            <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          </div>
        </div>
        <section className="w-full px-8 py-10 sm:px-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <CatalogFilterSidebar
              themeKey="luxury"
              actionPath="/nyheter"
              query={query}
              categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
              brands={catalog.availableBrands}
              maxPriceBound={100000}
            />
            <section>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[12px] font-light tracking-[0.05em] text-[#5f4a3a]">{resultLabel}</p>
                <form method="GET" action="/nyheter" className="flex items-center gap-2">
                  {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                  {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                  {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                  <select name="sort" defaultValue={query.sort} className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light tracking-[0.1em] text-[#5f4a3a]">
                    <option value="newest">Nyast</option>
                    <option value="price_asc">Pris stigande</option>
                    <option value="price_desc">Pris fallande</option>
                  </select>
                  <button type="submit" className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light text-[#5f4a3a] hover:bg-[#FAF8F5]">Visa</button>
                </form>
              </div>
              <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} badgeLabel="NOUVEAU" cardVariant="luxury" />
              <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
            </section>
          </div>
        </section>
      </main>
    );
  }

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
              <CatalogFilterSidebar
                themeKey={themeKey}
                actionPath="/nyheter"
                query={query}
                categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
                brands={catalog.availableBrands}
                features={catalog.availableFeatures}
              />

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
