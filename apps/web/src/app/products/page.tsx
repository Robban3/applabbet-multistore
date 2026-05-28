import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";
import {
  CatalogPagination,
  CatalogResultsGrid,
  CatalogSearchForm,
} from "@/components/catalog-blocks";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/bastsaljare" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

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
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("products", { blocks: fallbackBlocks });

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
  const catalog = await getCatalogData(supabase, tenant.id, query);
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);
  const categoryFilterOptions = catalog.availableCategories.map((category) => category.name);
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
    ...catalog.availableCategories.map((category) => ({
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
            <header className="relative z-20 -mx-6 mb-4 flex items-center justify-between border-b border-white/10 px-6 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</span>
              </div>
              <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/90 xl:flex">
                {navItems.map((item, idx) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={idx === 1 ? "border-b border-[color:var(--store-accent)] pb-1 text-white" : "hover:text-[color:var(--store-accent)]"}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-2 text-white/85">
                <details className="relative xl:hidden">
                  <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </summary>
                  <div
                    className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]"
                    style={{ background: "var(--store-header-overlay-surface)" }}
                  >
                    {navItems.map((item, idx) => (
                      <Link
                        key={`mobile-${item.label}`}
                        href={item.href}
                        className={`block rounded-md px-3 py-2 text-sm ${
                          idx === 1 ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
                <Link
                  href="/sok"
                  aria-label="Sök"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.65 16.65" />
                  </svg>
                </Link>
                <Link
                  href="/mina-sidor"
                  aria-label="Konto"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
                  </svg>
                </Link>
                <Link
                  href="/cart"
                  aria-label="Varukorg"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="17" cy="20" r="1.5" />
                    <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
                  </svg>
                  <CartCountBadge initialCount={2} />
                </Link>
              </div>
            </header>

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
            <aside
              className={`rounded-xl border p-4 ${filterShellClass}`}
              style={filterShellClass ? undefined : { borderColor: shellCardBorder, background: shellSurface }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
                <Link href="/products" className="text-xs text-slate-500 hover:text-slate-700">
                  Rensa alla
                </Link>
              </div>

              <AutoSubmitFilterForm action="/products" className="space-y-5 text-sm text-slate-700">
                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Kategori</p>
                  <div className="space-y-2">
                    {categoryFilterOptions.map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="category"
                          value={category}
                          defaultChecked={query.categories.includes(category)}
                          className="accent-[color:var(--store-accent)]"
                        />
                        {category}
                      </label>
                    ))}
                    {categoryFilterOptions.length === 0 ? (
                      <p className="text-xs text-slate-500">Inga kategorier skapade ännu.</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isBeauty ? "text-[#8b5c6f]" : "text-slate-500"}`}>Varumärke</p>
                  <div className="space-y-2">
                    {brandFilterOptions.map((brand) => (
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
                    {brandFilterOptions.length === 0 ? (
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
