import Link from "next/link";
import {
  CatalogPagination,
  CatalogResultsGrid,
  CatalogSearchForm,
} from "@/components/catalog-blocks";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

type BastsaljarePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BastsaljarePage({ searchParams }: BastsaljarePageProps) {
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

  const query = parseCatalogQuery(await searchParams);
  const supabase = createSupabaseAdminClient();
  const settings = await getTenantSettings(tenant);
  const themeKey = normalizeThemeKey(settings?.theme_key);
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
  const cardVariant = isLuxury ? "luxury" : themeKey === "fashion" ? "fashion" : themeKey === "sport" ? "sport" : themeKey === "beauty" ? "beauty" : isElectronics ? "electronics" : "default";
  const catalog = await getCatalogData(supabase, tenant.id, query, { onlyBestSellers: true });
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);
  const resultLabel = `${catalog.total} produkter`;

  if (isLuxury) {
    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Bästsäljare" cartCount={2} />
          <div className="px-8 py-16 sm:px-12 lg:px-14 lg:py-20 border-b border-white/8">
            <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Sélection</p>
            <h1 className="mt-4 font-light text-white" style={{ fontSize: "clamp(36px, 4vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Pièces d'exception</h1>
            <p className="mt-4 max-w-[500px] text-[14px] font-light leading-relaxed text-white/55">Noggrant kuraterade pjäser — de mest eftertraktade i vår kollektion.</p>
            <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          </div>
        </div>
        <section className="mx-auto w-full max-w-[1380px] px-8 py-10 sm:px-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className={`border p-5 ${filterShellClass}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[11px] font-light tracking-[0.3em] uppercase text-[#17120d]">Filter</h2>
                <Link href="/bastsaljare" className="text-[10px] tracking-[0.1em] text-[#C41E3A] hover:underline">Rensa</Link>
              </div>
              <AutoSubmitFilterForm action="/bastsaljare" className="space-y-5 text-sm text-[#5f4a3a]">
                <div>
                  <p className="mb-3 text-[10px] font-light tracking-[0.3em] uppercase text-[#5f4a3a]">Kategori</p>
                  <div className="space-y-2">
                    {catalog.availableCategories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 text-[12px]">
                        <input type="checkbox" name="category" value={cat.slug} defaultChecked={query.categories.includes(cat.slug)} className="accent-[#C41E3A]" />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-light tracking-[0.3em] uppercase text-[#5f4a3a]">Varumärke</p>
                  <div className="space-y-2">
                    {catalog.availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 text-[12px]">
                        <input type="checkbox" name="brand" value={brand} defaultChecked={query.brands.includes(brand)} className="accent-[#C41E3A]" />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-light tracking-[0.3em] uppercase text-[#5f4a3a]">Pris</p>
                  <PriceRangeFilter minBound={0} maxBound={100000} initialMin={query.minPrice} initialMax={query.maxPrice} />
                </div>
              </AutoSubmitFilterForm>
            </aside>
            <section>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[12px] font-light tracking-[0.05em] text-[#5f4a3a]">{resultLabel}</p>
                <form method="GET" action="/bastsaljare" className="flex items-center gap-2">
                  {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                  {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                  <select name="sort" defaultValue={query.sort} className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light tracking-[0.1em] text-[#5f4a3a]">
                    <option value="bestsellers">Populärast</option>
                    <option value="price_asc">Pris stigande</option>
                    <option value="price_desc">Pris fallande</option>
                  </select>
                  <button type="submit" className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light text-[#5f4a3a] hover:bg-[#FAF8F5]">Visa</button>
                </form>
              </div>
              <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} badgeLabel="EXKLUSIV" cardVariant="luxury" />
              <CatalogPagination actionPath="/bastsaljare" query={query} totalPages={catalog.totalPages} />
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
            <StorefrontHeader activeNav="Bästsäljare" cartCount={2} />
            <div
              className="pointer-events-none absolute right-6 top-10 h-48 w-72 rounded-full border-[16px]"
              style={{ borderColor: isElectronics ? "rgba(88, 140, 255, 0.35)" : isBeauty ? "rgba(245, 188, 209, 0.35)" : isSport ? "rgba(179, 255, 0, 0.24)" : "rgba(215, 178, 132, 0.35)" }}
            />
            <div className="relative z-10 pt-4">
              <p className="text-sm font-medium tracking-wide text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-2 text-white/45">&gt;</span>
                <Link href="/bastsaljare" className="hover:text-white">Bästsäljare</Link>
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-tight">Bästsäljare</h1>
              <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-white/78">
                Upptäck våra mest populära produkter.
                {"\n"}
                Kvalitet, design och prestanda - handlat av tusentals nöjda kunder.
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
                  <Link href="/bastsaljare" className="text-xs text-slate-500 hover:text-slate-700">
                    Rensa alla
                  </Link>
                </div>

                <AutoSubmitFilterForm action="/bastsaljare" className="space-y-5 text-sm text-slate-700">
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
                          <input type="checkbox" name="brand" value={brand} defaultChecked={query.brands.includes(brand)} className="accent-[color:var(--store-accent)]" />
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
                  <CatalogSearchForm actionPath="/bastsaljare" query={query} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-slate-700">{resultLabel}</p>
                    <form method="GET" action="/bastsaljare" className="flex items-center gap-2">
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
                        <option value="relevance">Sortera: Mest populära</option>
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
                  badgeLabel="POPULÄR"
                  cardVariant={cardVariant}
                />
                <CatalogPagination actionPath="/bastsaljare" query={query} totalPages={catalog.totalPages} />
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
