import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import {
  CatalogPagination,
  CatalogResultsGrid,
} from "@/components/catalog-blocks";
import { CatalogFilterSidebar } from "@/components/catalog-filter-sidebar";
import type { CatalogQueryState } from "@/lib/catalog";
import type { Product } from "@/types/commerce";

type NavCategory = { name: string; slug: string; count?: number };

export type SportCatalogPageProps = {
  brandName?: string;
  /** Sökväg formuläret/paginering postar till, t.ex. "/nyheter" */
  actionPath: string;
  /** Visas i breadcrumb (t.ex. "Nyheter", "Utvalda") */
  breadcrumbLabel: string;
  /** Rubrik utan antal — antal läggs till automatiskt */
  title: string;
  /** Aktiv kategori (namn) eller null */
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
  /** Kategori-länkarnas bas (oftast "/products" så filter funkar) */
  categoryBasePath?: string;
  /** Markerad nav-länk i headern (t.ex. "Nyheter", "Utvalda") */
  activeNav?: string;
};

/**
 * Enhetlig Nike.com-stil kataloglayout (vit, breadcrumb, titel + sort,
 * vänster kategori-lista + filter, produktgrid). Delas av /nyheter och
 * /bastsaljare så att ALLA sport-katalogsidor ser likadana ut som /products.
 */
export function SportCatalogPage({
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
}: SportCatalogPageProps) {
  const activeCat = activeCategoryName;
  const headingWithCount = `${activeCat ?? title} (${totalCount})`;

  return (
    <main className="bg-white">
      <StorefrontHeader activeNav={activeNav} cartCount={2} brandName={brandName} />

      {/* Header: breadcrumb + titel + sort (Nike-stil) */}
      <section className="border-b border-[#e5e5e5] bg-white px-6 pt-8 pb-4 lg:px-10">
        <nav className="text-[12px] text-[#757575]">
          <Link href="/" className="hover:underline">Hem</Link>
          <span className="mx-2">/</span>
          <Link href={actionPath} className="hover:underline">{breadcrumbLabel}</Link>
          {activeCat ? (
            <>
              <span className="mx-2">/</span>
              <span className="text-[#111]">{activeCat}</span>
            </>
          ) : null}
        </nav>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-[24px] font-medium text-[#111] lg:text-[28px]">{headingWithCount}</h1>
          <form method="GET" action={actionPath} className="flex items-center gap-2">
            {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
            {query.categories.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
            {query.brands.map((b) => <input key={b} type="hidden" name="brand" value={b} />)}
            <span className="text-[14px] text-[#111]">Sortera efter</span>
            <select name="sort" defaultValue={query.sort} className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] text-[#111] focus:outline-none">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </form>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="bg-white px-6 pt-8 pb-16 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="mb-3 text-[15px] font-medium text-[#111]">Kategorier</p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={categoryBasePath}
                    className={`block text-[14px] transition hover:text-[#757575] ${!activeCat ? "font-medium text-[#111]" : "text-[#111]"}`}
                  >
                    Alla
                  </Link>
                </li>
                {navCategories.map((cat) => {
                  const isActive = activeCat?.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <li key={cat.slug}>
                      <Link
                        href={`${categoryBasePath}?category=${encodeURIComponent(cat.slug)}`}
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
              actionPath={actionPath}
              query={query}
              categories={filterCategories}
              brands={brandFilterOptions}
            />
          </aside>

          <section>
            {items.length > 0 ? (
              <>
                <CatalogResultsGrid products={items} favoriteProductIds={favoriteProductIds} badgeLabel={badgeLabel} cardVariant="sport" />
                <CatalogPagination actionPath={actionPath} query={query} totalPages={totalPages} />
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-[18px] font-medium text-[#111]">Inga produkter hittades</p>
                <p className="mt-2 text-[14px] text-[#757575]">Prova att rensa filtren eller välj en annan kategori.</p>
                <Link href={categoryBasePath} className="mt-6 inline-flex h-11 items-center rounded-full bg-[#111] px-6 text-[14px] font-medium text-white hover:bg-black">
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
