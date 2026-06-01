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
import { LuxuryBestSellers } from "@/components/storefront/luxury/luxury-best-sellers";
import { SportBestSellers } from "@/components/storefront/sport/sport-best-sellers";
import { SportPageHero } from "@/components/storefront/sport/sport-page-hero";
import { FashionPageHero } from "@/components/storefront/fashion/fashion-page-hero";
import { MinimalPageHero } from "@/components/storefront/minimal/minimal-page-hero";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { applyThemePlaceholdersToDefaults } from "@/lib/cms/theme-placeholders";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { applyThemeScopeToCatalogQuery } from "@/lib/storefront/theme-catalog-scope";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const trustCards = [
  { title: "Fri frakt", text: "Vid köp över 499 kr", icon: "truck" },
  { title: "30 dagars öppet köp", text: "Enkelt & smidigt", icon: "rotate" },
  { title: "Premium kvalitet", text: "Utvalt med omsorg", icon: "badge" },
  { title: "Säkra betalningar", text: "Tryggt & säkert", icon: "lock" },
] as const;

function TrustIcon({ type }: { type: (typeof trustCards)[number]["icon"] }) {
  if (type === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.7" />
        <circle cx="17" cy="18" r="1.7" />
      </svg>
    );
  }

  if (type === "rotate") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 5v5h-5" />
        <path d="M4 19v-5h5" />
        <path d="M19 10a7 7 0 0 0-12-3" />
        <path d="M5 14a7 7 0 0 0 12 3" />
      </svg>
    );
  }

  if (type === "badge") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v6c0 4.4-2.7 7.6-7 9-4.3-1.4-7-4.6-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function CategoryIcon({ type }: { type: "all" | "headphones" | "speaker" | "soundbar" | "wireless" }) {
  if (type === "all") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M8 14V11" />
        <path d="M12 16V9" />
        <path d="M16 13V10" />
      </svg>
    );
  }

  if (type === "headphones") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="4" y="12" width="4" height="7" rx="1.5" />
        <rect x="16" y="12" width="4" height="7" rx="1.5" />
      </svg>
    );
  }

  if (type === "speaker") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <circle cx="12" cy="10" r="1.8" />
        <circle cx="12" cy="16" r="2.4" />
      </svg>
    );
  }

  if (type === "soundbar") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="10" width="18" height="4" rx="2" />
        <circle cx="8" cy="12" r="0.8" />
        <circle cx="12" cy="12" r="0.8" />
        <circle cx="16" cy="12" r="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M6 9a6 6 0 0 1 12 0" />
    </svg>
  );
}

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getCategoryGridClass(count: number): string {
  if (count <= 1) return "sm:grid-cols-1 lg:grid-cols-1";
  if (count === 2) return "sm:grid-cols-2 lg:grid-cols-2";
  if (count === 3) return "sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-5";
}

function inferCategoryIconType(name: string): "headphones" | "speaker" | "soundbar" | "wireless" {
  const normalized = name.toLowerCase();
  if (normalized.includes("hörlur")) return "headphones";
  if (normalized.includes("högtal") || normalized.includes("speaker")) return "speaker";
  if (normalized.includes("soundbar")) return "soundbar";
  return "wireless";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const definition = getCmsPage("products");
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();

  if (!tenant) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Ingen tenant hittades for domanen. Lagg till host i tenant_domains och satt den som verified.
        </p>
      </main>
    );
  }

  const resolvedSearchParams = await searchParams;
  const query = parseCatalogQuery(resolvedSearchParams);
  const isBestSellersPage = (Array.isArray(resolvedSearchParams.sort) ? resolvedSearchParams.sort[0] : resolvedSearchParams.sort) === "bestsellers";
  const supabase = createSupabaseAdminClient();
  const settings = await getTenantSettings(tenant);
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const rawFallback = definition ? createDefaultBlocksContent(definition) : {};
  const fallbackBlocks = applyThemePlaceholdersToDefaults("products", themeKey, rawFallback);
  const cms = await getPublishedPageContent("products", { blocks: fallbackBlocks });
  const storefrontConfig = getStorefrontConfig(themeKey);
  const isLuxury = themeKey === "luxury";
  const isFashion = themeKey === "fashion";
  const isMinimalTheme = themeKey === "minimal";
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
          : "";
  const cardVariant =
    themeKey === "fashion"
      ? "fashion"
      : themeKey === "sport"
        ? "sport"
        : isBeauty
          ? "beauty"
          : isElectronics
            ? "electronics"
            : "default";
  // Begränsa till temats kategorier när användaren inte uttryckligen filtrerat.
  const scopedQuery = await applyThemeScopeToCatalogQuery(supabase, tenant.id, themeKey, query);
  const catalog = await getCatalogData(supabase, tenant.id, scopedQuery);
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);

  // ── Tema-relevanta kategorier ─────────────────────────────────
  // En tenant kan innehålla blandade kategorier (i demo/dev), men varje
  // tema visar bara sina egna. Matchningen görs mot config.categoryCards
  // (lower-case title). Om temat inte definierar nån titel-lista
  // → visa alla DB-kategorier (= riktiga butiker med ren data).
  const themeCategoryTitles = new Set(
    storefrontConfig.categoryCards.map((c) => c.title.trim().toLowerCase()),
  );
  const themeRelevantCategories =
    themeCategoryTitles.size > 0
      ? catalog.availableCategories.filter((c) =>
          themeCategoryTitles.has(c.name.trim().toLowerCase()),
        )
      : catalog.availableCategories;
  // Fallback: om filtrering ger 0 träffar (config matchar inte DB)
  // → visa allt, så användaren inte ser en tom katalog.
  const visibleCategories =
    themeRelevantCategories.length > 0 ? themeRelevantCategories : catalog.availableCategories;

  const categoryFilterOptions = visibleCategories.map((category) => category.name);
  const brandFilterOptions = catalog.availableBrands;
  const { data: allPublishedCategoryRows } = await supabase
    .from("products")
    .select("category_id")
    .eq("tenant_id", tenant.id)
    .eq("status", "published");
  const categoryCountById = new Map<string, number>();
  for (const row of allPublishedCategoryRows || []) {
    const categoryId = row.category_id as string | null;
    if (!categoryId) continue;
    categoryCountById.set(categoryId, (categoryCountById.get(categoryId) ?? 0) + 1);
  }
  const categoryCards = [
    {
      title: "Alla produkter",
      count: catalog.total,
      icon: "all" as const,
      href: "/products",
    },
    ...visibleCategories.map((category) => ({
      title: category.name,
      count: categoryCountById.get(category.id) ?? 0,
      icon: inferCategoryIconType(category.name),
      href: `/products?category=${encodeURIComponent(category.slug)}`,
    })),
  ];
  const primaryCategoryCards = categoryCards.slice(0, 5);
  const overflowCategoryCards = categoryCards.slice(5);
  const categoryGridClass = getCategoryGridClass(primaryCategoryCards.length);
  const primaryIconSizeClass = primaryCategoryCards.length <= 2 ? "h-14 w-14" : "h-12 w-12";
  const primaryTitleClass = primaryCategoryCards.length <= 2 ? "text-base" : "text-sm";
  const primaryCountClass = primaryCategoryCards.length <= 2 ? "text-sm" : "text-xs";
  const overflowGridClass = getCategoryGridClass(Math.min(overflowCategoryCards.length, 5));
  const firstProducts = catalog.items.slice(0, 8);
  const remainingProducts = catalog.items.slice(8);
  const resultLabelTemplate = getCmsBlockField(cms.blocks, "listing", "resultLabel", "{count} produkter");
  const resultLabel = resultLabelTemplate.includes("{count}")
    ? resultLabelTemplate.replace("{count}", String(catalog.total))
    : `${catalog.total} produkter`;

  const shellBackground = "var(--store-footer-bg)";
  const shellBorder = "var(--store-footer-border)";
  const shellSurface = "var(--store-soft-surface)";
  const shellCardBorder = "var(--store-card-border)";

  // ── Kategori-navigering drivs av RIKTIGA DB-kategorier ──
  // (matchande slugs + korrekta antal) så filter, rubrik och count uppdateras.
  const grandTotal = (allPublishedCategoryRows || []).length || catalog.total;
  const navCategories = visibleCategories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: categoryCountById.get(c.id) ?? 0,
  }));
  // Aktiv kategori härledd från query-param (slug ELLER namn) mot DB.
  const activeCategoryName =
    query.categories.length === 1
      ? (catalog.availableCategories.find(
          (c) =>
            c.slug.toLowerCase() === query.categories[0].toLowerCase() ||
            c.name.toLowerCase() === query.categories[0].toLowerCase(),
        )?.name ?? null)
      : null;

  if (isMinimalTheme) {
    const activeCat = activeCategoryName;
    const pageTitle = activeCat ?? getCmsBlockField(cms.blocks, "hero", "title", "Alla produkter");
    return (
      <main className="bg-white">
        <StorefrontHeader activeNav="Produkter" cartCount={2} brandName={brandName} />
        <MinimalPageHero
          title={pageTitle}
          description={activeCat ? `${catalog.total} produkter` : getCmsBlockField(cms.blocks, "hero", "description", "Utforska hela sortimentet.")}
        />

        {/* Kategori-pills (centrerade, Apple-stil) */}
        <nav className="bg-white pb-4">
          <div className="mx-auto flex max-w-[980px] flex-wrap items-center justify-center gap-2 px-6">
            <Link
              href="/products"
              className={`inline-flex h-9 items-center rounded-full px-5 text-[13px] transition ${!activeCat ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEE]"}`}
            >
              Alla
            </Link>
            {navCategories.map((cat) => {
              const isActive = activeCat?.toLowerCase() === cat.name.toLowerCase();
              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className={`inline-flex h-9 items-center rounded-full px-5 text-[13px] transition ${isActive ? "bg-[#1D1D1F] text-white" : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEE]"}`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <section className="bg-[#F5F5F7] px-6 py-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[15px] text-[#6E6E73]">{resultLabel}</p>
              <form method="GET" action="/products" className="flex items-center gap-2">
                {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                <select name="sort" defaultValue={query.sort} className="rounded-full border border-[#D2D2D7] bg-white px-4 py-2 text-[13px] text-[#1D1D1F] focus:outline-none">
                  <option value="relevance">Rekommenderat</option>
                  <option value="newest">Nyast</option>
                  <option value="price_asc">Lägsta pris</option>
                  <option value="price_desc">Högsta pris</option>
                </select>
              </form>
            </div>
            {catalog.items.length > 0 ? (
              <>
                <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="minimal" />
                <CatalogPagination actionPath="/products" query={query} totalPages={catalog.totalPages} />
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-[19px] text-[#1D1D1F]">Inga produkter hittades</p>
                <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#0071E3] px-6 text-[15px] text-white hover:bg-[#0077ED]">
                  Visa alla
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (isFashion) {
    const activeCat = activeCategoryName;
    const pageTitle = activeCat ?? getCmsBlockField(cms.blocks, "hero", "title", "All products");
    return (
      <main className="bg-[#FAF9F6]">
        <StorefrontHeader activeNav="Kollektioner" cartCount={2} brandName={brandName} />
        <FashionPageHero
          eyebrow={activeCat ? "Collection" : undefined}
          title={`${pageTitle} (${catalog.total})`}
          description={activeCat ? undefined : getCmsBlockField(cms.blocks, "hero", "description", "Modern essentials, made to last.")}
        />

        <section className="bg-[#FAF9F6] px-8 py-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
              <div>
                <p className="mb-4 text-[11px] tracking-[0.25em] uppercase text-[#1A1A1A]/55">Kategorier</p>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/products"
                      className={`block text-[14px] tracking-[0.02em] transition hover:opacity-60 ${!activeCat ? "text-[#1A1A1A] underline underline-offset-4" : "text-[#1A1A1A]"}`}
                    >
                      All products
                    </Link>
                  </li>
                  {navCategories.map((cat) => {
                    const isActive = activeCat?.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          className={`block text-[14px] tracking-[0.02em] transition hover:opacity-60 ${isActive ? "text-[#1A1A1A] underline underline-offset-4" : "text-[#1A1A1A]"}`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <CatalogFilterSidebar
                themeKey={themeKey}
                actionPath="/products"
                query={query}
                categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
                brands={brandFilterOptions}
              />
            </aside>

            <section>
              <div className="mb-6 flex items-center justify-between border-b border-[#E5E1DC] pb-4">
                <p className="text-[13px] tracking-[0.02em] text-[#1A1A1A]/70">{resultLabel}</p>
                <form method="GET" action="/products" className="flex items-center gap-3">
                  {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                  {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/55">Sort</span>
                  <select name="sort" defaultValue={query.sort} className="border-0 bg-transparent text-[13px] text-[#1A1A1A] focus:outline-none">
                    <option value="relevance">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Lägsta pris</option>
                    <option value="price_desc">Högsta pris</option>
                  </select>
                </form>
              </div>
              {catalog.items.length > 0 ? (
                <>
                  <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="fashion" />
                  <CatalogPagination actionPath="/products" query={query} totalPages={catalog.totalPages} />
                </>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-[16px] text-[#1A1A1A]">Inga produkter hittades</p>
                  <Link href="/products" className="mt-6 inline-flex h-12 items-center bg-[#1A1A1A] px-8 text-[12px] tracking-[0.25em] uppercase text-[#FAF9F6] hover:bg-black">
                    View all
                  </Link>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (isSport) {
    const activeSportCat = activeCategoryName;
    // Nike.com-stil: stor rubrik = kategorinamn ELLER "Alla produkter"
    const pageTitle = activeSportCat ?? "Alla produkter";
    // "Nike Skor (2)" / "Nike Alla produkter (8)" — Nike skriver brand + kategori
    const headingWithCount = `${pageTitle} (${catalog.total})`;

    return (
      <main className="bg-white">
        <StorefrontHeader activeNav="Kategorier" cartCount={2} brandName={brandName} />

        {/* Header: breadcrumb + stor titel + sort row (Nike-stil) */}
        <section className="border-b border-[#e5e5e5] bg-white px-6 pt-8 pb-4 lg:px-10">
          <nav className="text-[12px] text-[#757575]">
            <Link href="/" className="hover:underline">Hem</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:underline">Produkter</Link>
            {activeSportCat ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#111]">{activeSportCat}</span>
              </>
            ) : null}
          </nav>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[24px] font-medium text-[#111] lg:text-[28px]">{headingWithCount}</h1>
            <form method="GET" action="/products" className="flex items-center gap-2">
              {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
              {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
              <span className="text-[14px] text-[#111]">Sortera efter</span>
              <select name="sort" defaultValue={query.sort} className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] text-[#111] focus:outline-none">
                <option value="relevance">Populärast</option>
                <option value="newest">Nyast</option>
                <option value="price_asc">Pris stigande</option>
                <option value="price_desc">Pris fallande</option>
              </select>
            </form>
          </div>
        </section>

        {/* Filter + grid */}
        <section className="bg-white px-6 pt-8 pb-16 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            {/* Vänster: kategori-lista + filter (Nike-stil sidebar) */}
            <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
              <div>
                <p className="mb-3 text-[15px] font-medium text-[#111]">Kategorier</p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products"
                      className={`block text-[14px] transition hover:text-[#757575] ${!activeSportCat ? "font-medium text-[#111]" : "text-[#111]"}`}
                    >
                      Alla
                    </Link>
                  </li>
                  {navCategories.map((cat) => {
                    const isActive = activeSportCat?.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          className={`block text-[14px] transition hover:text-[#757575] ${isActive ? "font-medium text-[#111]" : "text-[#111]"}`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <CatalogFilterSidebar
                themeKey="sport"
                actionPath="/products"
                query={query}
                categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
                brands={brandFilterOptions}
              />
            </aside>

            {/* Grid */}
            <section>
              {catalog.items.length > 0 ? (
                <>
                  <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="sport" />
                  <CatalogPagination actionPath="/products" query={query} totalPages={catalog.totalPages} />
                </>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-[18px] font-medium text-[#111]">Inga produkter hittades</p>
                  <p className="mt-2 text-[14px] text-[#757575]">Prova att rensa filtren eller välj en annan kategori.</p>
                  <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#111] px-6 text-[14px] font-medium text-white hover:bg-black">
                    Visa alla produkter
                  </Link>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (isLuxury) {
    const activeCategory = activeCategoryName;

    const heroTitle = activeCategory ?? getCmsBlockField(cms.blocks, "hero", "title", "Nos collections");
    const heroEyebrow = activeCategory ? "Collection" : "Collection";
    const heroDescription = activeCategory
      ? `${catalog.total} pjäser i ${activeCategory}`
      : getCmsBlockField(cms.blocks, "hero", "description", "Utforska vår kuraterade kollektion av exklusiva produkter.");

    return (
      <main style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <StorefrontHeader activeNav="Kategorier" cartCount={2} brandName={brandName} />
          <div className="border-b border-white/8 px-8 py-16 sm:px-12 lg:px-14 lg:py-20">
            <p className="text-[10px] font-light tracking-[0.5em] uppercase text-[#C41E3A]">{heroEyebrow}</p>
            <h1 className="mt-4 text-white" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(40px, 4.5vw, 72px)", fontWeight: 300, fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.05 }}>
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-[500px] text-[14px] font-light leading-relaxed text-white/55">
              {heroDescription}
            </p>
            <div className="mt-6 h-px w-12 bg-[#C41E3A]" />
          </div>
        </div>

        {/* Kategorinaviering */}
        <nav className="border-b border-[#EDE5DC]">
          <div className="flex flex-wrap px-8 sm:px-12 lg:px-14">
            <Link
              href="/products"
              className={`border-r border-[#EDE5DC] px-6 py-4 text-[10px] font-light tracking-[0.25em] uppercase transition pl-0 ${
                !activeCategory ? "text-[#17120d] border-b-2 border-b-[#C41E3A]" : "text-[#5f4a3a] hover:text-[#17120d]"
              }`}
            >
              Tout <span className="ml-1 text-[#C41E3A]">({catalog.total})</span>
            </Link>
            {storefrontConfig.categoryCards.map((cat) => {
              const dbCat = catalog.availableCategories.find(
                (c) => c.name.toLowerCase() === cat.title.toLowerCase()
              );
              const href = dbCat
                ? `/products?category=${encodeURIComponent(dbCat.slug)}`
                : `/products?category=${encodeURIComponent(cat.title.toLowerCase())}`;
              const count = dbCat ? (categoryCountById.get(dbCat.id) ?? 0) : 0;
              const isActiveCat = activeCategory?.toLowerCase() === cat.title.toLowerCase();
              return (
                <Link
                  key={cat.title}
                  href={href}
                  className={`border-r border-[#EDE5DC] px-6 py-4 text-[10px] font-light tracking-[0.25em] uppercase transition last:border-r-0 ${
                    isActiveCat ? "text-[#17120d] border-b-2 border-b-[#C41E3A]" : "text-[#5f4a3a] hover:text-[#17120d]"
                  }`}
                >
                  {cat.title}
                  {count > 0 && <span className="ml-1 text-[#C41E3A]">({count})</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <section className="w-full px-8 py-10 sm:px-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <CatalogFilterSidebar
              themeKey="luxury"
              actionPath="/products"
              query={query}
              categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
              brands={brandFilterOptions}
            />
            <section>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[12px] font-light tracking-[0.05em] text-[#5f4a3a]">{resultLabel}</p>
                <form method="GET" action="/products" className="flex items-center gap-2">
                  {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                  {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                  <select name="sort" defaultValue={query.sort} className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light tracking-[0.1em] text-[#5f4a3a]">
                    <option value="relevance">Mest populära</option>
                    <option value="newest">Nyast</option>
                    <option value="price_asc">Pris stigande</option>
                    <option value="price_desc">Pris fallande</option>
                  </select>
                  <button type="submit" className="border border-[#EDE5DC] bg-white px-3 py-1.5 text-[11px] font-light text-[#5f4a3a] hover:bg-[#FAF8F5]">Visa</button>
                </form>
              </div>
              {catalog.items.length > 0 ? (
                <>
                  <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} cardVariant="luxury" />
                  <CatalogPagination actionPath="/products" query={query} totalPages={catalog.totalPages} />
                </>
              ) : (
                <LuxuryBestSellers
                  title={getCmsBlockField(cms.blocks, "hero", "title", "Nos collections")}
                  viewAllLabel=""
                  products={storefrontConfig.products.map((p) => ({
                    title: p.title,
                    priceMinor: p.priceMinor,
                    currency: p.currency,
                    badge: "EXKLUSIV",
                  }))}
                />
              )}
            </section>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: shellBackground }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: shellBorder }}
        >
          <div
            className="relative min-h-[390px] overflow-hidden px-6 pb-18 pt-6 text-white"
            style={{ background: "var(--store-header-gradient)" }}
          >
            <StorefrontHeader activeNav="Kategorier" cartCount={2} brandName={brandName} />

            <div
              className="pointer-events-none absolute right-6 top-2 h-52 w-80 rounded-full border-[20px]"
              style={{ borderColor: isElectronics ? "rgba(88, 140, 255, 0.35)" : "rgba(215, 178, 132, 0.4)" }}
            />
            <div
              className="pointer-events-none absolute right-24 top-16 h-36 w-56 rounded-full border-[12px]"
              style={{ borderColor: isElectronics ? "rgba(124, 166, 255, 0.28)" : "rgba(226, 194, 151, 0.3)" }}
            />
            <div className="relative z-10 pt-2">
              <p className="text-sm font-medium tracking-wide text-white/70">
                <Link href="/" className="hover:text-white">Hem</Link>
                <span className="mx-2 text-white/45">&gt;</span>
                <Link href="/products" className="hover:text-white">Kategorier</Link>
                <span className="mx-2 text-white/45">&gt;</span>
                <Link href="/products" className="hover:text-white">{isElectronics ? "Datorer & tillbehör" : "Ljud & Hörlurar"}</Link>
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {getCmsBlockField(cms.blocks, "hero", "title", isElectronics ? "Datorer & tillbehör" : "Ljud & Hörlurar")}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/78">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  isElectronics
                    ? "Upptäck datorer, skärmar, tangentbord, möss och mycket mer."
                    : "Upptäck vår kollektion av hörlurar, högtalare och ljudprodukter.",
                )}
              </p>
              <div className="mt-7 grid max-w-3xl gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--store-accent)]/60 bg-[color:var(--store-header-overlay-surface)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3l7 3v6c0 4.4-2.7 7.6-7 9-4.3-1.4-7-4.6-7-9V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <span>{getCmsBlockField(cms.blocks, "hero", "trustLine1", isElectronics ? "Fri frakt över 499 kr" : "Premium kvalitet")}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--store-accent)]/60 bg-[color:var(--store-header-overlay-surface)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v4l3 2" />
                    </svg>
                  </span>
                  <span>{getCmsBlockField(cms.blocks, "hero", "trustLine2", isElectronics ? "30 dagars öppet köp" : "Topprankade av våra kunder")}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--store-accent)]/60 bg-[color:var(--store-header-overlay-surface)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3l7 3v6c0 4.4-2.7 7.6-7 9-4.3-1.4-7-4.6-7-9V6z" />
                      <path d="M12 9v4" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <span>{getCmsBlockField(cms.blocks, "hero", "trustLine3", isElectronics ? "Snabb leverans 1-2 arbetsdagar" : "2 års garanti")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 -mt-9 px-5 pb-4">
            <div
              className={`grid gap-3 rounded-2xl border p-4 shadow-[0_8px_24px_rgba(21,17,12,0.14)] ${categoryGridClass}`}
              style={{ borderColor: shellCardBorder, background: shellSurface }}
            >
              {primaryCategoryCards.map((item, idx) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-xl border bg-white px-4 py-3 text-center"
                  style={{ borderColor: shellCardBorder }}
                >
                  <div
                    className={`mx-auto mb-2 inline-flex items-center justify-center rounded-full border ${primaryIconSizeClass} ${
                      idx === 0
                        ? "border-[color:var(--store-accent)] bg-white"
                        : "border-[color:var(--store-footer-border)] bg-[color:var(--store-soft-surface)]"
                    }`}
                  >
                    <CategoryIcon type={item.icon} />
                  </div>
                  <p className={`${primaryTitleClass} font-semibold text-slate-900`}>{item.title}</p>
                  <p className={`${primaryCountClass} text-slate-500`}>{item.count} produkter</p>
                  {idx === 0 ? <div className="mx-auto mt-2 h-0.5 w-12 rounded bg-[color:var(--store-accent)]" /> : null}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 px-5 py-5 lg:grid-cols-[260px_1fr]">
            <CatalogFilterSidebar
              themeKey={themeKey}
              actionPath="/products"
              query={query}
              categories={visibleCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
              brands={brandFilterOptions}
              features={catalog.availableFeatures}
            />

            <section>
              <div className="mb-3 space-y-3">
                <CatalogSearchForm actionPath="/products" query={query} />
                <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-700">{resultLabel}</p>
                  <form method="GET" action="/products" className="flex items-center gap-2">
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
                products={firstProducts}
                favoriteProductIds={favoriteProductIds}
                badgeLabel={isBestSellersPage ? "POPULÄR" : undefined}
                cardVariant={cardVariant}
              />
              {overflowCategoryCards.length > 0 ? (
                <section className="mt-6 rounded-2xl border p-4" style={{ borderColor: shellCardBorder, background: shellSurface }}>
                  <h3 className="text-[28px] font-semibold leading-none text-slate-900">Fler kategorier</h3>
                  <div className={`mt-4 grid gap-3 ${overflowGridClass}`}>
                    {overflowCategoryCards.map((item) => (
                      <Link
                        key={`more-${item.title}`}
                        href={item.href}
                        className="rounded-xl border bg-white px-4 py-3 text-center"
                        style={{ borderColor: shellCardBorder }}
                      >
                        <div
                          className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border"
                          style={{ borderColor: "var(--store-footer-border)", background: "var(--store-soft-surface)" }}
                        >
                          <CategoryIcon type={item.icon} />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.count} produkter</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
              {remainingProducts.length > 0 ? (
                <div className="mt-6">
                  <CatalogResultsGrid
                    products={remainingProducts}
                    favoriteProductIds={favoriteProductIds}
                    badgeLabel={isBestSellersPage ? "POPULÄR" : undefined}
                    cardVariant={cardVariant}
                  />
                </div>
              ) : null}
              <CatalogPagination actionPath="/products" query={query} totalPages={catalog.totalPages} />
            </section>
          </div>

          <section
            className="mt-7 grid overflow-hidden rounded-[10px] border sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "var(--store-card-border)", background: "var(--store-soft-surface)" }}
          >
            {trustCards.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[78px] items-center gap-3 border-t px-5 py-3 sm:border-t-0 lg:border-l lg:first:border-l-0"
                style={{ borderColor: "var(--store-footer-border)" }}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center text-slate-700">
                  <TrustIcon type={item.icon} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.text}</p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
