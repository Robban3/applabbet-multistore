import Link from "next/link";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { CatalogPagination, CatalogResultsGrid } from "@/components/catalog-blocks";
import { ElectronicsPageHero } from "@/components/storefront/electronics";
import { MinimalHeader } from "@/components/storefront/minimal";
import { BeautyHeader } from "@/components/storefront/beauty";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { getStoreBrandName } from "@/lib/store-brand";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, loadThemedCmsPageContent } from "@/lib/cms/content";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMinorPrice } from "@/lib/format";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";

const colorSwatchMap: Record<string, string> = {
  svart: "#111111",
  vit: "#f0ede6",
  beige: "#d3c5ab",
  brun: "#7a5c3d",
  gra: "#6f7266",
  grå: "#6f7266",
  blå: "#1d3d72",
  rod: "#a42a2a",
  röd: "#a42a2a",
  gron: "#2f5f49",
  grön: "#2f5f49",
  silver: "#9aa0a6",
  guld: "#c8a164",
};

type SokPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.65 16.65" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function withQuery(
  basePath: string,
  query: Awaited<ReturnType<typeof parseCatalogQuery>>,
  overrides?: Partial<Awaited<ReturnType<typeof parseCatalogQuery>>>,
) {
  const next = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  for (const category of next.categories) params.append("category", category);
  for (const brand of next.brands) params.append("brand", brand);
  for (const feature of next.features) params.append("feature", feature);
  for (const color of next.colors) params.append("color", color);
  if (typeof next.minPrice === "number") params.set("minPrice", String(next.minPrice));
  if (typeof next.maxPrice === "number") params.set("maxPrice", String(next.maxPrice));
  if (next.sort !== "relevance") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));
  return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
}

export default async function SokPage({ searchParams }: SokPageProps) {
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

  const settings = await getTenantSettings(tenant);
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const cms = await loadThemedCmsPageContent("sok", themeKey);
  const cmsSearchTerm = getCmsBlockField(cms.blocks, "search", "searchTerm", "träningsväska");
  const resultCountTemplate = getCmsBlockField(cms.blocks, "search", "resultCountLabel", "Vi hittade {count} resultat");
  const headingTemplate = getCmsBlockField(cms.blocks, "search", "headingTemplate", 'Sökresultat för "{term}"');
  const isSport = themeKey === "sport";
  const isFashion = themeKey === "fashion";
  const isBeauty = themeKey === "beauty";
  const isElectronics = themeKey === "electronics";
  const filterShellClass = isSport
    ? "border-[#afcf90] bg-[#eef7e4]"
    : isFashion
      ? "border-[#d7c5ad] bg-[#f7f1ea]"
      : isBeauty
        ? "border-[#eac4d1] bg-[#fff1f6]"
        : isElectronics
          ? "border-[#bed2f4] bg-[#edf4ff]"
          : "border-[color:var(--store-card-border)] bg-white";
  const cardVariant =
    themeKey === "fashion"
      ? "fashion"
      : themeKey === "sport"
        ? "sport"
        : themeKey === "beauty"
          ? "beauty"
          : themeKey === "electronics"
            ? "electronics"
            : "default";

  const parsed = parseCatalogQuery(await searchParams);
  const query = {
    ...parsed,
    q: parsed.q || cmsSearchTerm,
  };
  const supabase = createSupabaseAdminClient();
  const catalog = await getCatalogData(supabase, tenant.id, query);
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);
  const favoriteIds = new Set(favoriteProductIds);
  const heading = headingTemplate.replace("{term}", query.q || cmsSearchTerm);
  const resultCountLabel = resultCountTemplate.replace("{count}", String(catalog.total));
  const categoryOptions = catalog.availableCategories.map((category) => category.name);
  const brandOptions = catalog.availableBrands;
  const quickSuggestions = Array.from(
    new Set(
      [
        ...catalog.items.map((item) => item.title),
        ...categoryOptions,
        ...brandOptions,
      ]
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).slice(0, 6);

  const featuredProducts = catalog.items.slice(0, 4);
  const totalPages = Math.max(1, catalog.totalPages);
  const currentPage = Math.min(query.page, totalPages);

  if (themeKey === "beauty") {
    const navLinks = getStorefrontConfig(themeKey).navItems;
    const beautyBrandName = await getStoreBrandName();
    return (
      <main className="bg-white">
        <BeautyHeader brandName={beautyBrandName} links={navLinks} activeNav="" />
        <section className="bg-[#FBE9F2] px-6 pt-12 pb-8 text-center">
          <h1 className="mx-auto max-w-[800px] font-extrabold uppercase tracking-[-0.02em] text-[#1A1A1A]" style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.08 }}>
            {heading}
          </h1>
          <p className="mt-2 text-[16px] text-[#1A1A1A]/70">{resultCountLabel}</p>
          <form method="GET" action="/sok" className="mx-auto mt-6 flex max-w-[560px] items-center gap-2">
            <input name="q" defaultValue={query.q} placeholder="Sök produkter…"
              className="h-12 flex-1 rounded-full border border-[#1A1A1A] bg-white px-6 text-[15px] text-[#1A1A1A] focus:border-[#EC008C] focus:outline-none" />
            <button type="submit" className="inline-flex h-12 items-center rounded-full bg-[#EC008C] px-6 text-[14px] font-bold uppercase text-white hover:bg-[#d1007d]">Sök</button>
          </form>
          {quickSuggestions.length > 0 ? (
            <div className="mx-auto mt-5 flex max-w-[640px] flex-wrap items-center justify-center gap-2">
              {quickSuggestions.map((s) => (
                <Link key={s} href={`/sok?q=${encodeURIComponent(s)}`} className="rounded-full border border-[#ECECEC] bg-white px-4 py-1.5 text-[14px] text-[#1A1A1A] transition hover:border-[#EC008C] hover:text-[#EC008C]">{s}</Link>
              ))}
            </div>
          ) : null}
        </section>
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-[1320px]">
            {catalog.items.length > 0 ? (
              <>
                <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="beauty" />
                <CatalogPagination actionPath="/sok" query={query} totalPages={totalPages} />
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[19px] font-bold text-[#1A1A1A]">Inga resultat för “{query.q}”</p>
                <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#1A1A1A] px-6 text-[14px] font-bold uppercase text-white hover:bg-[#EC008C]">Visa alla produkter</Link>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (themeKey === "minimal") {
    const navLinks = getStorefrontConfig(themeKey).navItems;
    const minimalBrandName = await getStoreBrandName();
    return (
      <main className="bg-white">
        <MinimalHeader brandName={minimalBrandName} links={navLinks} activeNav="" />

        {/* Sök-hero */}
        <section className="px-6 pt-16 pb-8 text-center">
          <h1 className="mx-auto max-w-[800px] font-semibold tracking-[-0.03em] text-[#1D1D1F]" style={{ fontSize: "clamp(32px, 4.5vw, 48px)", lineHeight: 1.08 }}>
            {heading}
          </h1>
          <p className="mt-3 text-[17px] text-[#6E6E73]">{resultCountLabel}</p>
          <form method="GET" action="/sok" className="mx-auto mt-6 flex max-w-[560px] items-center gap-2">
            <input
              name="q"
              defaultValue={query.q}
              placeholder="Sök produkter…"
              className="h-12 flex-1 rounded-full border border-[#D2D2D7] bg-[#F5F5F7] px-6 text-[16px] text-[#1D1D1F] focus:border-[#0071E3] focus:bg-white focus:outline-none"
            />
            <button type="submit" className="inline-flex h-12 items-center rounded-full bg-[#0071E3] px-6 text-[15px] font-medium text-white hover:bg-[#0077ED]">
              Sök
            </button>
          </form>
          {quickSuggestions.length > 0 ? (
            <div className="mx-auto mt-5 flex max-w-[640px] flex-wrap items-center justify-center gap-2">
              {quickSuggestions.map((s) => (
                <Link key={s} href={`/sok?q=${encodeURIComponent(s)}`} className="rounded-full bg-[#F5F5F7] px-4 py-1.5 text-[14px] text-[#1D1D1F] transition hover:bg-[#ECECEE]">
                  {s}
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        {/* Resultat */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            {catalog.items.length > 0 ? (
              <>
                <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="minimal" />
                <CatalogPagination actionPath="/sok" query={query} totalPages={totalPages} />
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[19px] font-medium text-[#1D1D1F]">Inga resultat för “{query.q}”</p>
                <p className="mt-2 text-[15px] text-[#6E6E73]">Prova ett annat sökord.</p>
                <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#0071E3] px-6 text-[15px] font-medium text-white hover:bg-[#0077ED]">
                  Visa alla produkter
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (themeKey === "electronics") {
    return (
      <main className="bg-white">
        <StorefrontHeader activeNav="" cartCount={2} />
        <ElectronicsPageHero
          eyebrow="Sök"
          title={heading}
          description={resultCountLabel}
        />
        <section className="bg-[#F4F7FC] px-6 py-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-5 flex items-center justify-between rounded-[12px] border border-[#DCE6F5] bg-white px-4 py-3">
              <form method="GET" action="/sok" className="flex flex-1 items-center gap-3">
                <input
                  name="q"
                  defaultValue={query.q}
                  placeholder="Sök bland tusentals produkter…"
                  className="h-10 flex-1 rounded-[8px] border border-[#DCE6F5] bg-[#F4F7FC] px-4 text-[14px] text-[#0A2540] focus:border-[#2f7dff] focus:bg-white focus:outline-none"
                />
                {query.categories.map((category) => (
                  <input key={`elec-category-${category}`} type="hidden" name="category" value={category} />
                ))}
                {query.brands.map((brand) => (
                  <input key={`elec-brand-${brand}`} type="hidden" name="brand" value={brand} />
                ))}
                <button
                  type="submit"
                  className="inline-flex h-10 shrink-0 items-center rounded-full bg-[#2f7dff] px-5 text-[14px] font-semibold text-white hover:bg-[#1a6cf0]"
                >
                  Sök
                </button>
              </form>
              <form method="GET" action="/sok" className="ml-4 flex items-center gap-2">
                {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                {query.categories.map((category) => (
                  <input key={`elec-sort-category-${category}`} type="hidden" name="category" value={category} />
                ))}
                {query.brands.map((brand) => (
                  <input key={`elec-sort-brand-${brand}`} type="hidden" name="brand" value={brand} />
                ))}
                <select
                  name="sort"
                  defaultValue={query.sort}
                  className="rounded-[8px] border border-[#DCE6F5] bg-white px-3 py-1.5 text-[13px] text-[#0A2540] focus:outline-none"
                >
                  <option value="relevance">Mest relevanta</option>
                  <option value="newest">Nyast</option>
                  <option value="price_asc">Lägsta pris</option>
                  <option value="price_desc">Högsta pris</option>
                </select>
              </form>
            </div>
            {catalog.items.length > 0 ? (
              <>
                <CatalogResultsGrid
                  products={catalog.items}
                  favoriteProductIds={favoriteProductIds}
                  cardVariant="electronics-deal"
                />
                <CatalogPagination actionPath="/sok" query={query} totalPages={catalog.totalPages} />
              </>
            ) : (
              <div className="rounded-[12px] border border-[#DCE6F5] bg-white py-16 text-center">
                <p className="text-[16px] text-[#0A2540]">Inga produkter hittades</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center rounded-full bg-[#2f7dff] px-6 text-[15px] font-semibold text-white hover:bg-[#1a6cf0]"
                >
                  Visa alla produkter
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[8px] border bg-[color:var(--store-shell-surface)] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          style={{ borderColor: "var(--store-footer-border)" }}
        >
          <StorefrontHeader activeNav="Kategorier" cartCount={2} showAccountLabel searchActive />

          <section className="p-4" style={{ background: "var(--store-soft-surface)" }}>
            <div className="overflow-hidden rounded-lg border bg-[color:var(--store-shell-surface)]" style={{ borderColor: "var(--store-footer-border)" }}>
              <form method="GET" action="/sok" className="flex items-center border-b px-4 py-2" style={{ borderColor: "var(--store-footer-border)" }}>
                <input
                  name="q"
                  defaultValue={query.q}
                  className="w-full text-[30px] font-medium outline-none"
                />
                {query.categories.map((category) => (
                  <input key={`top-category-${category}`} type="hidden" name="category" value={category} />
                ))}
                {query.brands.map((brand) => (
                  <input key={`top-brand-${brand}`} type="hidden" name="brand" value={brand} />
                ))}
                {query.features.map((feature) => (
                  <input key={`top-feature-${feature}`} type="hidden" name="feature" value={feature} />
                ))}
                {query.colors.map((color) => (
                  <input key={`top-color-${color}`} type="hidden" name="color" value={color} />
                ))}
                {typeof query.minPrice === "number" ? <input type="hidden" name="minPrice" value={query.minPrice} /> : null}
                {typeof query.maxPrice === "number" ? <input type="hidden" name="maxPrice" value={query.maxPrice} /> : null}
                {query.sort !== "relevance" ? <input type="hidden" name="sort" value={query.sort} /> : null}
                <button type="button" className="px-2 text-slate-400">×</button>
                <button type="submit" className="rounded border p-2 text-[color:var(--store-accent)]" style={{ borderColor: "var(--store-footer-border)" }}><SearchIcon /></button>
                <button type="button" className="ml-3 text-[12px] font-semibold text-slate-700">Stäng <span className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">ESC</span></button>
              </form>

              <div className="grid md:grid-cols-[0.8fr_2fr]">
                <div className="border-r px-4 py-3" style={{ borderColor: "var(--store-footer-border)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Populära sökningar</p>
                  <div className="mt-2 space-y-1">
                    {quickSuggestions.map((item) => (
                      <Link key={item} href={`/sok?q=${encodeURIComponent(item)}`} className="flex items-center gap-2 text-[13px] text-slate-700">
                        <SearchIcon />
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Populära produkter</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-4">
                    {featuredProducts.map((item) => (
                      <Link key={item.id} href={`/products/${item.slug}`} className="group">
                        <div className="relative h-24 rounded-md border border-slate-200 bg-[image:var(--store-media-gradient)]">
                          <FavoriteToggle
                            productId={item.id}
                            initialFavorited={favoriteIds.has(item.id)}
                            className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/30"
                            inactiveClassName="text-white"
                            activeClassName="text-rose-400"
                          />
                        </div>
                        <p className="mt-1 text-[13px] font-semibold">{item.title}</p>
                        <p className="text-[12px] text-slate-500">{item.description?.slice(0, 18) || "Svart"}</p>
                        <p className="text-[25px] font-semibold">{formatMinorPrice(item.price_minor, item.currency)}</p>
                      </Link>
                    ))}
                  </div>
                  <Link href={withQuery("/sok", query, { page: 1 })} className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                    <SearchIcon />
                    {`Visa alla resultat för "${query.q}"`}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[color:var(--store-shell-surface)] px-4 pb-5 pt-4">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <aside className={`rounded-md border p-3 ${filterShellClass}`}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-semibold">FILTRERA</p>
                  <Link href="/sok" className="text-[12px] text-slate-500">Rensa alla</Link>
                </div>
                <AutoSubmitFilterForm action="/sok" className="space-y-3 text-[13px]">
                  {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                  <div>
                    <p className="mb-1 flex items-center justify-between font-semibold">KATEGORI <ChevronDownIcon /></p>
                    {categoryOptions.map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input type="checkbox" name="category" value={category} defaultChecked={query.categories.includes(category)} className="accent-[color:var(--store-accent)]" />
                        {category}
                      </label>
                    ))}
                    {categoryOptions.length === 0 ? <p className="text-xs text-slate-500">Inga kategorier ännu.</p> : null}
                  </div>
                  <div>
                    <p className="mb-1 flex items-center justify-between font-semibold">VARUMÄRKE <ChevronDownIcon /></p>
                    {brandOptions.map((brand) => (
                      <label key={brand} className="flex items-center gap-2">
                        <input type="checkbox" name="brand" value={brand} defaultChecked={query.brands.includes(brand)} className="accent-[color:var(--store-accent)]" />
                        {brand}
                      </label>
                    ))}
                    {brandOptions.length === 0 ? <p className="text-xs text-slate-500">Inga varumärken ännu.</p> : null}
                  </div>
                  {catalog.availableColors.length > 1 ? (
                    <div>
                      <p className="mb-1 flex items-center justify-between font-semibold">FÄRG <ChevronDownIcon /></p>
                      {catalog.availableColors.map((color) => {
                        const normalized = color.trim().toLowerCase();
                        const swatch = colorSwatchMap[normalized] || "#b7b7b7";
                        return (
                          <label key={color} className="flex items-center gap-2">
                            <input type="checkbox" name="color" value={color} defaultChecked={query.colors.includes(color)} className="accent-[color:var(--store-accent)]" />
                            <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: swatch }} />
                            {color}
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                  <div>
                    <p className="mb-1 flex items-center justify-between font-semibold">PRIS <ChevronDownIcon /></p>
                    <PriceRangeFilter
                      minBound={0}
                      maxBound={10000}
                      initialMin={query.minPrice}
                      initialMax={query.maxPrice}
                    />
                  </div>
                  <div>
                    <p className="mb-1 flex items-center justify-between font-semibold">EGENSKAPER <ChevronDownIcon /></p>
                    {catalog.availableFeatures.map((feature) => (
                      <label key={feature} className="flex items-center gap-2">
                        <input type="checkbox" name="feature" value={feature} defaultChecked={query.features.includes(feature)} className="accent-[color:var(--store-accent)]" />
                        {feature}
                      </label>
                    ))}
                    {catalog.availableFeatures.length === 0 ? <p className="text-xs text-slate-500">Inga egenskaper ännu.</p> : null}
                  </div>
                </AutoSubmitFilterForm>
              </aside>

              <section>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h1 className="text-[42px] font-semibold leading-none">{heading}</h1>
                    <p className="text-[14px] text-slate-600">{resultCountLabel}</p>
                  </div>
                  <form method="GET" action="/sok" className="flex items-center gap-2">
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
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px]"
                    >
                      <option value="relevance">Mest relevanta</option>
                      <option value="newest">Nyast</option>
                      <option value="price_asc">Pris stigande</option>
                      <option value="price_desc">Pris fallande</option>
                    </select>
                    <button type="submit" className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium">
                      Visa
                    </button>
                  </form>
                </div>

                <CatalogResultsGrid
                  products={catalog.items}
                  favoriteProductIds={favoriteProductIds}
                  cardVariant={cardVariant}
                />

                {totalPages > 1 ? (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-700">
                    <Link href={withQuery("/sok", query, { page: Math.max(1, currentPage - 1) })} className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 px-2 hover:bg-slate-50">‹</Link>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                      const page = idx + 1;
                      return (
                        <Link
                          key={page}
                          href={withQuery("/sok", query, { page })}
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded px-2 ${page === currentPage ? "bg-black text-white" : "border border-slate-300 hover:bg-slate-50"}`}
                        >
                          {page}
                        </Link>
                      );
                    })}
                    <Link href={withQuery("/sok", query, { page: Math.min(totalPages, currentPage + 1) })} className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 px-2 hover:bg-slate-50">›</Link>
                  </div>
                ) : null}
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
