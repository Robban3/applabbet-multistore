import Link from "next/link";
import {
  CatalogPagination,
  CatalogResultsGrid,
} from "@/components/catalog-blocks";
import { StorefrontHeader } from "@/components/storefront-header";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getCatalogData, parseCatalogQuery } from "@/lib/catalog";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  const catalog = await getCatalogData(supabase, tenant.id, query, { onlyNew: true });
  const favoriteProductIds = await getFavoriteProductIdsForCurrentUser(tenant.id);
  const resultLabelTemplate = getCmsBlockField(cms.blocks, "listing", "resultLabel", "{count} produkter");
  const resultLabel = resultLabelTemplate.includes("{count}")
    ? resultLabelTemplate.replace("{count}", String(catalog.total))
    : `${catalog.total} produkter`;

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-b from-[#11100d] via-[#12100e] to-[#0e0d0b] px-6 pb-12 pt-2 text-white">
            <StorefrontHeader activeNav="Nyheter" cartCount={2} />
            <div className="pointer-events-none absolute right-6 top-10 h-48 w-72 rounded-full border-[16px] border-[#d7b284]/35" />
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-700">{resultLabel}</p>
              <form method="GET" action="/nyheter" className="flex items-center gap-2">
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

            <CatalogResultsGrid products={catalog.items} favoriteProductIds={favoriteProductIds} />
            <CatalogPagination actionPath="/nyheter" query={query} totalPages={catalog.totalPages} />
          </section>
        </div>
      </section>
    </main>
  );
}
