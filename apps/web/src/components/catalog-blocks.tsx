import Link from "next/link";
import { AutoSubmitFilterForm } from "@/components/auto-submit-filter-form";
import { formatMinorPrice } from "@/lib/format";
import type { CatalogQueryState, CatalogSort } from "@/lib/catalog";
import type { Product } from "@/types/commerce";
import { FavoriteToggle } from "@/components/favorite-toggle";

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
    <aside className="rounded-xl border border-[#e5dbcf] bg-[#fdfbf7] p-4">
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
}: {
  products: Product[];
  favoriteProductIds?: string[];
}) {
  const favoriteIds = new Set(favoriteProductIds);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product, idx) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group overflow-hidden rounded-xl border border-[#e5dbcf] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative h-40 bg-gradient-to-br from-[#30261c] via-[#1a150f] to-[#0f0d0b]">
            <FavoriteToggle
              productId={product.id}
              initialFavorited={favoriteIds.has(product.id)}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
            />
            {idx === 0 ? (
              <span className="absolute left-2 top-2 rounded bg-[#c8a164] px-2 py-0.5 text-[10px] font-bold text-slate-900">
                POPULÄR
              </span>
            ) : null}
          </div>
          <div className="p-3">
            <p className="line-clamp-1 text-sm font-semibold text-slate-900">{product.title}</p>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.description || "Premiumprodukt"}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatMinorPrice(product.price_minor, product.currency)}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-[#b88f50]">
                ★★★★★ <span className="text-slate-500">(120)</span>
              </p>
            </div>
          </div>
        </Link>
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
