import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { CatalogPagination, CatalogResultsGrid } from "@/components/catalog-blocks";
import { CatalogFilterSidebar } from "@/components/catalog-filter-sidebar";
import type { CatalogQueryState } from "@/lib/catalog";
import type { Product } from "@/types/commerce";

type NavCategory = { name: string; slug: string; count?: number };

export type BeautyCatalogPageProps = {
  brandName?: string;
  actionPath: string;
  breadcrumbLabel: string;
  title: string;
  activeCategoryName: string | null;
  totalCount: number;
  navCategories: NavCategory[];
  filterCategories: { id: string; slug: string; name: string }[];
  brandFilterOptions: string[];
  query: CatalogQueryState;
  items: Product[];
  favoriteProductIds: string[];
  totalPages: number;
  badgeLabel?: string;
  sortOptions: { value: string; label: string }[];
  categoryBasePath?: string;
  activeNav?: string;
};

/**
 * KICKS.se-stil kataloglayout: vit, rosa breadcrumb-rubrik, vänster
 * kategori-lista + filter, beauty-produktgrid. Delas av /products,
 * /nyheter och /bastsaljare.
 */
export function BeautyCatalogPage({
  brandName,
  actionPath,
  breadcrumbLabel,
  title,
  activeCategoryName,
  totalCount,
  navCategories,
  filterCategories,
  brandFilterOptions,
  query,
  items,
  favoriteProductIds,
  totalPages,
  badgeLabel,
  sortOptions,
  categoryBasePath = "/products",
  activeNav = "",
}: BeautyCatalogPageProps) {
  const activeCat = activeCategoryName;
  const heading = activeCat ?? title;

  return (
    <main className="bg-white">
      <StorefrontHeader activeNav={activeNav} cartCount={2} brandName={brandName} />

      {/* Rubrik-band */}
      <section className="bg-[#FBE9F2] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1320px]">
          <nav className="text-[12px] text-[#1A1A1A]/55">
            <Link href="/" className="hover:text-[#EC008C]">Hem</Link>
            <span className="mx-2">/</span>
            <Link href={actionPath} className="hover:text-[#EC008C]">{breadcrumbLabel}</Link>
            {activeCat ? (<><span className="mx-2">/</span><span className="text-[#1A1A1A]">{activeCat}</span></>) : null}
          </nav>
          <h1 className="mt-2 text-[30px] font-extrabold uppercase tracking-[-0.02em] text-[#1A1A1A] lg:text-[40px]">
            {heading} <span className="text-[#EC008C]">({totalCount})</span>
          </h1>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[230px_1fr]">
          <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="mb-3 text-[14px] font-bold uppercase tracking-[0.04em] text-[#1A1A1A]">Kategorier</p>
              <ul className="space-y-2">
                <li>
                  <Link href={categoryBasePath} className={`block text-[14px] transition hover:text-[#EC008C] ${!activeCat ? "font-bold text-[#EC008C]" : "text-[#1A1A1A]"}`}>
                    Alla
                  </Link>
                </li>
                {navCategories.map((cat) => {
                  const isActive = activeCat?.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <li key={cat.slug}>
                      <Link href={`${categoryBasePath}?category=${encodeURIComponent(cat.slug)}`}
                        className={`block text-[14px] transition hover:text-[#EC008C] ${isActive ? "font-bold text-[#EC008C]" : "text-[#1A1A1A]"}`}>
                        {cat.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <CatalogFilterSidebar themeKey="beauty" actionPath={actionPath} query={query} categories={filterCategories} brands={brandFilterOptions} />
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-end">
              <form method="GET" action={actionPath} className="flex items-center gap-2">
                {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
                {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
                <span className="text-[14px] text-[#1A1A1A]">Sortera</span>
                <select name="sort" defaultValue={query.sort} className="rounded-full border border-[#1A1A1A] bg-white px-4 py-2 text-[14px] text-[#1A1A1A] focus:border-[#EC008C] focus:outline-none">
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </form>
            </div>
            {items.length > 0 ? (
              <>
                <CatalogResultsGrid products={items} favoriteProductIds={favoriteProductIds} badgeLabel={badgeLabel} cardVariant="beauty" />
                <CatalogPagination actionPath={actionPath} query={query} totalPages={totalPages} />
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-[18px] font-bold text-[#1A1A1A]">Inga produkter hittades</p>
                <Link href={categoryBasePath} className="mt-6 inline-flex h-11 items-center rounded-full bg-[#1A1A1A] px-6 text-[14px] font-bold uppercase text-white hover:bg-[#EC008C]">
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
