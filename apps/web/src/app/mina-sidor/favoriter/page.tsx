import Link from "next/link";
import { redirect } from "next/navigation";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { AccountSidebar } from "@/components/account-sidebar";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { StorefrontHeader } from "@/components/storefront-header";
import { loadAccountContext } from "@/lib/account-context";
import { MinaSidorTabShellContent, usesMinaSidorTabShell } from "@/lib/mina-sidor-shell";
import { getCmsBlockField, loadThemedCmsPageContent, loadThemedCmsPageContentForCurrentTenant } from "@/lib/cms/content";
import { formatMinorPrice } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { Product } from "@/types/commerce";

export default async function MinaFavoriterPage() {
  const cms = await loadThemedCmsPageContentForCurrentTenant("mina-sidor-favoriter");

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  if (!tenant) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Tenant hittades inte.
        </p>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/konto/login?next=/mina-sidor/favoriter");

  const { data } = await supabase
    .from("customer_favorites")
    .select("product_id, created_at, products!inner(id, tenant_id, slug, title, description, image_url, price_minor, currency, status)")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (data || [])
    .map((row) => row.products as unknown as Product)
    .filter((product) => product.status === "published");
  const favoriteIds = new Set(products.map((product) => product.id));

  const ctx = await loadAccountContext();
  const pageTitle = getCmsBlockField(cms.blocks, "hero", "title", "Favoriter");
  const pageSubtitle = getCmsBlockField(
    cms.blocks,
    "hero",
    "subtitle",
    "Här hittar du alla produkter du har sparat som favoriter.",
  );

  const favoritesBody = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-[#0A2540]/70">
          {products.length} {getCmsBlockField(cms.blocks, "favorites", "countSuffix", "produkter")}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[12px] border border-[#DCE6F5] bg-white shadow-[0_2px_8px_rgba(10,37,64,0.04)] transition hover:border-[#2f7dff]/40"
          >
            <div className="relative h-40 overflow-hidden bg-[#F4F7FC]">
              <Link href={`/products/${product.slug}`} className="absolute inset-0" aria-label={`Visa ${product.title}`} />
              <FavoriteToggle
                productId={product.id}
                initialFavorited={favoriteIds.has(product.id)}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE6F5] bg-white/90"
              />
              <AddToCartControl
                productId={product.id}
                title={product.title}
                priceMinor={product.price_minor}
                currency={product.currency}
                preventDefault
                className="absolute inset-x-2 bottom-2 z-10 rounded-full bg-[#2f7dff] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1a6cf0]"
                ariaLabel={`Lägg ${product.title} i varukorgen`}
              >
                Lägg i varukorgen
              </AddToCartControl>
            </div>
            <div className="p-3">
              <Link href={`/products/${product.slug}`} className="line-clamp-1 text-sm font-semibold text-[#0A2540] hover:text-[#2f7dff]">
                {product.title}
              </Link>
              <p className="mt-1 line-clamp-1 text-xs text-[#0A2540]/55">{product.description || "Produkt"}</p>
              <p className="mt-2 text-xl font-bold text-[#0A2540]">{formatMinorPrice(product.price_minor, product.currency)}</p>
            </div>
          </article>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="rounded-[12px] border border-[#DCE6F5] bg-white px-4 py-8 text-center text-sm text-[#0A2540]/65">
          {getCmsBlockField(
            cms.blocks,
            "favorites",
            "emptyState",
            "Du har inga favoriter ännu. Klicka på hjärtat på en produkt för att spara den här.",
          )}
        </p>
      ) : null}
    </>
  );

  if (usesMinaSidorTabShell(ctx)) {
    return (
      <MinaSidorTabShellContent ctx={ctx} title={pageTitle} subtitle={pageSubtitle}>
        {favoritesBody}
      </MinaSidorTabShellContent>
    );
  }

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <StorefrontHeader cartCount={0} />
          <div className="px-6 py-5">
          <p className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700">Hem</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor" className="hover:text-slate-700">Mina sidor</Link>
            <span className="mx-1">&gt;</span>
            <Link href="/mina-sidor/favoriter" className="hover:text-slate-700">
              {getCmsBlockField(cms.blocks, "hero", "breadcrumbCurrent", "Favoriter")}
            </Link>
          </p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-600">{pageSubtitle}</p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
            <AccountSidebar activeHref="/mina-sidor/favoriter" />
            <section>{favoritesBody}</section>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
