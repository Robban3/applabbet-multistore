import Link from "next/link";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { formatMinorPrice } from "@/lib/format";
import type { CatalogQueryState, CatalogSort } from "@/lib/catalog";
import type { Product } from "@/types/commerce";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { ElectronicsDealCard } from "@/components/storefront/electronics/electronics-deal-card";

type CatalogFilterSidebarProps = {
  actionPath: string;
  query: CatalogQueryState;
};

type CatalogSortSelectProps = {
  actionPath: string;
  query: CatalogQueryState;
};

type CatalogPaginationProps = {
  actionPath: string;
  query: CatalogQueryState;
  totalPages: number;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.65 16.65" />
    </svg>
  );
}

function MiniCartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
    </svg>
  );
}

function withQuery(actionPath: string, query: CatalogQueryState, overrides?: Partial<CatalogQueryState>) {
  const next: CatalogQueryState = {
    ...query,
    ...overrides,
  };
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
  return `${actionPath}${params.toString() ? `?${params.toString()}` : ""}`;
}

export function CatalogSearchForm({ actionPath, query }: CatalogFilterSidebarProps) {
  return (
    <form method="GET" action={actionPath} className="flex items-center gap-2">
      <input
        type="text"
        name="q"
        defaultValue={query.q}
        placeholder="Sök produkter..."
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      {typeof query.minPrice === "number" ? <input type="hidden" name="minPrice" value={query.minPrice} /> : null}
      {typeof query.maxPrice === "number" ? <input type="hidden" name="maxPrice" value={query.maxPrice} /> : null}
      {query.categories.map((category) => (
        <input key={`search-category-${category}`} type="hidden" name="category" value={category} />
      ))}
      {query.brands.map((brand) => (
        <input key={`search-brand-${brand}`} type="hidden" name="brand" value={brand} />
      ))}
      {query.features.map((feature) => (
        <input key={`search-feature-${feature}`} type="hidden" name="feature" value={feature} />
      ))}
      {query.colors.map((color) => (
        <input key={`search-color-${color}`} type="hidden" name="color" value={color} />
      ))}
      {query.sort !== "relevance" ? <input type="hidden" name="sort" value={query.sort} /> : null}
      <button
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export function CatalogFilterSidebar({ actionPath, query }: CatalogFilterSidebarProps) {
  return (
    <aside
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--store-card-border)", background: "var(--store-soft-surface)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
        <Link className="text-xs text-slate-500 hover:text-slate-700" href={actionPath}>
          Rensa alla
        </Link>
      </div>
      <AutoSubmitFilterForm action={actionPath} className="space-y-3 text-sm">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sökterm</span>
          <input
            type="text"
            name="q"
            defaultValue={query.q}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Min pris</span>
            <input
              type="number"
              min={0}
              name="minPrice"
              defaultValue={query.minPrice ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Max pris</span>
            <input
              type="number"
              min={0}
              name="maxPrice"
              defaultValue={query.maxPrice ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        {query.categories.map((category) => (
          <input key={`filter-category-${category}`} type="hidden" name="category" value={category} />
        ))}
        {query.brands.map((brand) => (
          <input key={`filter-brand-${brand}`} type="hidden" name="brand" value={brand} />
        ))}
        {query.colors.map((color) => (
          <input key={`filter-color-${color}`} type="hidden" name="color" value={color} />
        ))}
        {query.sort !== "relevance" ? <input type="hidden" name="sort" value={query.sort} /> : null}
      </AutoSubmitFilterForm>
    </aside>
  );
}

export function CatalogSortSelect({ actionPath, query }: CatalogSortSelectProps) {
  const options: Array<{ id: CatalogSort; label: string }> = [
    { id: "relevance", label: "Mest relevanta" },
    { id: "newest", label: "Nyast" },
    { id: "price_asc", label: "Pris: låg till hög" },
    { id: "price_desc", label: "Pris: hög till låg" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <Link
          key={option.id}
          href={withQuery(actionPath, query, { sort: option.id, page: 1 })}
          className={`rounded-md border px-3 py-1.5 text-xs ${
            query.sort === option.id
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export function CatalogResultsGrid({
  products,
  favoriteProductIds = [],
  badgeLabel,
  cardVariant = "default",
}: {
  products: Product[];
  favoriteProductIds?: string[];
  badgeLabel?: string;
  cardVariant?: "default" | "fashion" | "beauty" | "electronics" | "sport" | "luxury" | "minimal" | "electronics-deal";
}) {
  const favoriteIds = new Set(favoriteProductIds);
  const isFashion = cardVariant === "fashion";
  const isBeauty = cardVariant === "beauty";
  const isElectronics = cardVariant === "electronics";
  const isSport = cardVariant === "sport";
  const isLuxury = cardVariant === "luxury";
  const isMinimal = cardVariant === "minimal";
  const isElectronicsDeal = cardVariant === "electronics-deal";
  const beautyCardBorder = "border-[#ecd8df]";
  const beautyImageSurface = "bg-gradient-to-br from-[#fdf3f6] via-[#f8e8ee] to-[#f3dde6]";

  function resolveColorSwatch(colorName: string): string {
    const normalized = colorName.trim().toLowerCase();
    const map: Record<string, string> = {
      svart: "#171717",
      vit: "#f8fafc",
      silver: "#9ca3af",
      gra: "#6b7280",
      grå: "#6b7280",
      bla: "#2563eb",
      blå: "#2563eb",
      rod: "#dc2626",
      röd: "#dc2626",
      gron: "#16a34a",
      grön: "#16a34a",
      beige: "#d6c2a1",
      brun: "#7c4a2d",
    };
    return map[normalized] || "#111827";
  }

  if (isElectronicsDeal) {
    // Webhallen-stil deal-grid
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ElectronicsDealCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              priceMinor: product.price_minor,
              currency: product.currency,
              imageUrl: product.image_url ?? undefined,
              favorited: favoriteIds.has(product.id),
            }}
          />
        ))}
      </div>
    );
  }

  if (isMinimal) {
    // Apple-stil: vita kort, centrerad produktbild på ljusgrå, blå Köp-pill
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="relative flex flex-col items-center rounded-[18px] bg-[#F5F5F7] p-6 text-center">
            <Link href={`/products/${product.slug}`} className="block w-full">
              <div className="relative aspect-square w-full">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.title} className="absolute inset-0 h-full w-full object-contain" />
                ) : null}
              </div>
            </Link>
            <FavoriteToggle
              productId={product.id}
              initialFavorited={favoriteIds.has(product.id)}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#ececef]"
              inactiveClassName="text-[#1D1D1F]"
              activeClassName="text-[#0071E3]"
            />
            {badgeLabel ? (
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-[#0066CC]">{badgeLabel}</p>
            ) : null}
            <Link href={`/products/${product.slug}`} className="mt-3 block">
              <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">{product.title}</p>
            </Link>
            {product.description ? (
              <p className="mt-1 text-[13px] text-[#6E6E73] line-clamp-1">{product.description}</p>
            ) : null}
            <p className="mt-2 text-[15px] text-[#1D1D1F]">{formatMinorPrice(product.price_minor, product.currency)}</p>
            <AddToCartControl
              productId={product.id}
              title={product.title}
              priceMinor={product.price_minor}
              currency={product.currency}
              className="mt-4 inline-flex h-9 items-center rounded-full bg-[#0071E3] px-5 text-[14px] font-normal text-white transition hover:bg-[#0077ED]"
              ariaLabel={`Köp ${product.title}`}
            >
              Köp
            </AddToCartControl>
          </article>
        ))}
      </div>
    );
  }

  if (isFashion) {
    // Filippa K-stil: cream bakgrund, 4:5 portrait-bilder, light typografi
    return (
      <div className="grid gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="group flex flex-col">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1EA]">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />
                ) : null}
                <FavoriteToggle
                  productId={product.id}
                  initialFavorited={favoriteIds.has(product.id)}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-white/85 text-[#1A1A1A] backdrop-blur-sm transition hover:bg-white"
                />
                {badgeLabel ? (
                  <span className="absolute left-3 top-3 bg-[#1A1A1A] px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-[#FAF9F6]">
                    {badgeLabel}
                  </span>
                ) : null}
              </div>
            </Link>
            <div className="mt-4">
              <Link href={`/products/${product.slug}`}>
                <p className="text-[14px] tracking-[0.02em] text-[#1A1A1A]">{product.title}</p>
              </Link>
              {product.brand?.trim() ? (
                <p className="mt-0.5 text-[12px] text-[#1A1A1A]/55">{product.brand}</p>
              ) : null}
              <p className="mt-1.5 text-[14px] text-[#1A1A1A]">
                {formatMinorPrice(product.price_minor, product.currency)}
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (isSport) {
    // Nike-stil: vit bakgrund, ramlöst kort, fyrkantig ljusgrå bildyta,
    // fet svart namn, grå kategori, svart pris. Hover-zoom på bild.
    return (
      <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="group flex flex-col">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                <FavoriteToggle
                  productId={product.id}
                  initialFavorited={favoriteIds.has(product.id)}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-sm transition hover:bg-[#f5f5f5]"
                />
                {badgeLabel ? (
                  <span className="absolute left-3 top-3 text-[13px] font-medium text-[#f5402c]">
                    {badgeLabel}
                  </span>
                ) : null}
              </div>
            </Link>
            <div className="mt-3">
              <Link href={`/products/${product.slug}`}>
                <p className="text-[15px] font-medium text-[#111]">{product.title}</p>
              </Link>
              <p className="mt-0.5 text-[15px] text-[#757575]">
                {product.brand?.trim() || (product.description ? product.description.split("—")[0]?.trim() : "")}
              </p>
              <p className="mt-1.5 text-[15px] font-medium text-[#111]">
                {formatMinorPrice(product.price_minor, product.currency)}
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (isLuxury) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, idx) => (
          <article key={product.id} className="group">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative overflow-hidden bg-[#F5F0E8]" style={{ aspectRatio: "3/4" }}>
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : null}
                <FavoriteToggle productId={product.id} initialFavorited={favoriteIds.has(product.id)} className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center bg-white/80 backdrop-blur-sm transition hover:bg-white" />
                {badgeLabel ? (
                  <span className="absolute left-3 top-3 bg-[#C41E3A] px-2.5 py-1 text-[9px] font-light tracking-[0.25em] uppercase text-white">{badgeLabel}</span>
                ) : idx === 0 ? (
                  <span className="absolute left-3 top-3 bg-[#C41E3A] px-2.5 py-1 text-[9px] font-light tracking-[0.25em] uppercase text-white">POPULÄR</span>
                ) : null}
              </div>
            </Link>
            <div className="mt-4">
              <Link href={`/products/${product.slug}`}>
                <p className="text-[12px] font-light tracking-[0.05em] text-[#17120d] transition group-hover:text-[#C41E3A] line-clamp-2">{product.title}</p>
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] font-light text-[#5f4a3a]">{formatMinorPrice(product.price_minor, product.currency)}</p>
                <AddToCartControl productId={product.id} title={product.title} priceMinor={product.price_minor} currency={product.currency} className="inline-flex h-7 w-7 items-center justify-center border border-[#17120d]/20 text-[#17120d] transition hover:border-[#C41E3A] hover:text-[#C41E3A]" ariaLabel={`Lägg ${product.title} i varukorgen`}>
                  <MiniCartIcon />
                </AddToCartControl>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product, idx) => (
        <article
          key={product.id}
          className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
            isFashion
              ? "border-[#e8e2d8]"
              : isBeauty
                ? beautyCardBorder
                : isElectronics
                  ? "border-[#d6e4fb]"
                  : isSport
                    ? "border-[#d7e7c8]"
                    : "border-[color:var(--store-card-border)]"
          }`}
        >
          <Link href={`/products/${product.slug}`} className="block">
            <div
              className={`relative ${isFashion || isBeauty || isElectronics || isSport ? "h-52" : "h-40"} ${
                isBeauty
                  ? beautyImageSurface
                  : isElectronics
                    ? "bg-gradient-to-br from-[#0d1b39] via-[#102650] to-[#0a1731]"
                    : isSport
                      ? "bg-gradient-to-br from-[#1c2916] via-[#152011] to-[#0f180c]"
                      : "bg-[image:var(--store-media-gradient)]"
              }`}
            >
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : null}
              <FavoriteToggle
                productId={product.id}
                initialFavorited={favoriteIds.has(product.id)}
                className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full ${
                  isBeauty
                    ? "border-[#f3dbe4] bg-white text-[#8b5c6f]"
                    : isElectronics
                      ? "border-white/25 bg-black/25 text-white"
                      : isSport
                        ? "border-white/20 bg-black/25 text-white"
                      : "border-white/20 bg-black/30"
                }`}
              />
              {badgeLabel ? (
                <span
                  className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${
                    isBeauty ? "bg-[#f4c8d7] text-[#5f3245]" : "bg-[color:var(--store-accent)] text-slate-900"
                  }`}
                >
                  {badgeLabel}
                </span>
              ) : idx === 0 ? (
                <span
                  className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${
                    isBeauty ? "bg-[#f4c8d7] text-[#5f3245]" : "bg-[color:var(--store-accent)] text-slate-900"
                  }`}
                >
                  POPULÄR
                </span>
              ) : null}
            </div>
          </Link>
          <div className={`flex flex-1 flex-col ${isFashion || isBeauty || isElectronics || isSport ? "space-y-1 p-2.5" : "p-3"}`}>
            {isFashion || isBeauty || isElectronics || isSport ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {product.brand?.trim() || (isBeauty ? "BEAUTY STUDIO" : isElectronics ? "TECH LAB" : isSport ? "SPORT LAB" : "STOCKHOLM ATELIER")}
              </p>
            ) : null}
            <Link href={`/products/${product.slug}`} className="block">
              <p className={`text-sm font-semibold text-slate-900 ${isBeauty ? "line-clamp-2 min-h-[2.6rem]" : "line-clamp-1"}`}>
                {product.title}
              </p>
            </Link>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.description || "Premiumprodukt"}</p>
            <p className={`${isFashion || isBeauty || isElectronics || isSport ? "mt-1 text-xl" : "mt-2 text-2xl"} font-semibold text-slate-900`}>
              {formatMinorPrice(product.price_minor, product.currency)}
            </p>
            {isBeauty ? (
              <p className="text-[11px] text-slate-400 line-through">
                {formatMinorPrice(Math.round(product.price_minor * 1.15), product.currency)}
              </p>
            ) : null}
            {isFashion || isBeauty || isElectronics || isSport ? (
              <div className="mt-0.5 flex items-center gap-1">
                {(product.product_colors || []).slice(0, 3).map((color) => (
                  <span
                    key={`${product.id}-${color}`}
                    className="inline-flex h-2.5 w-2.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: resolveColorSwatch(String(color)) }}
                  />
                ))}
              </div>
            ) : null}
            <div className="mt-1 flex items-center justify-between">
              <p className={`text-xs ${isBeauty ? "text-[#f59f0b]" : "text-[color:var(--store-accent)]"}`}>
                ★★★★★ <span className="text-slate-500">(120)</span>
              </p>
              <AddToCartControl
                productId={product.id}
                title={product.title}
                priceMinor={product.price_minor}
                currency={product.currency}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
                  isBeauty
                    ? "bg-[#f4c8d7] text-[#5f3245] hover:bg-[#efb6ca]"
                    : isElectronics
                      ? "bg-[color:var(--store-accent)] text-white hover:brightness-95"
                    : "bg-black text-white hover:bg-slate-800"
                }`}
                ariaLabel={`Lägg ${product.title} i varukorgen`}
              >
                <MiniCartIcon />
              </AddToCartControl>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CatalogPagination({ actionPath, query, totalPages }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const current = Math.min(query.page, totalPages);
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let page = start; page <= end; page += 1) pages.push(page);

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-700">
      <Link
        href={withQuery(actionPath, query, { page: Math.max(1, current - 1) })}
        className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 px-2 hover:bg-slate-50"
      >
        ‹
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={withQuery(actionPath, query, { page })}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded px-2 ${
            page === current ? "bg-black text-white" : "border border-slate-300 hover:bg-slate-50"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={withQuery(actionPath, query, { page: Math.min(totalPages, current + 1) })}
        className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 px-2 hover:bg-slate-50"
      >
        ›
      </Link>
    </div>
  );
}
