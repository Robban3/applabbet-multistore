import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";
import type { Product } from "@/types/commerce";
import type { StorefrontProduct } from "@/lib/storefront/types";

type GenericBestSellersSectionProps = {
  title: string;
  viewAllLabel: string;
  bestSellerBadge: string;
  newBadge: string;
  ratingCount: string;
  products: (Product | StorefrontProduct)[];
  favoriteIds: Set<string>;
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MiniCartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
      <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
    </svg>
  );
}

export function GenericBestSellersSection({
  title, viewAllLabel, bestSellerBadge, newBadge, ratingCount, products, favoriteIds,
}: GenericBestSellersSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-3xl font-semibold leading-none sm:text-4xl lg:text-[42px]">{title}</h2>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
          {viewAllLabel}<ArrowRightIcon />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {products.map((product, idx) => {
          const productTitle = "title" in product ? product.title : "";
          const priceMinor = "price_minor" in product ? product.price_minor : product.priceMinor;
          const currency = "currency" in product ? product.currency : "SEK";
          const productHref = "slug" in product ? `/products/${product.slug}` : "/products";

          return (
            <article
              key={"id" in product ? product.id : `${productTitle}-${idx}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "var(--store-card-border)" }}
            >
              {"id" in product ? (
                <FavoriteToggle
                  productId={product.id}
                  initialFavorited={favoriteIds.has(product.id)}
                  className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                  inactiveClassName="text-white"
                  activeClassName="text-rose-400"
                />
              ) : null}
              <Link href={productHref} className="block">
                <div className="relative h-44 overflow-hidden bg-[image:var(--store-media-gradient)]">
                  {"image_url" in product && product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={productTitle} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : null}
                  {idx === 0 ? (
                    <span className="absolute left-2 top-2 rounded bg-[color:var(--store-accent)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--store-accent-fg)]">
                      {bestSellerBadge}
                    </span>
                  ) : null}
                  {idx === 1 ? (
                    <span className="absolute left-2 top-2 rounded bg-[color:var(--store-footer-surface)] px-2 py-0.5 text-[10px] font-bold text-white">
                      {newBadge}
                    </span>
                  ) : null}
                </div>
              </Link>
              <div className="flex flex-1 flex-col space-y-1 p-2.5">
                <Link href={productHref} className="block">
                  <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">{productTitle}</h3>
                </Link>
                <p className="text-[22px] font-semibold leading-tight text-slate-900">
                  {formatMinorPrice(priceMinor, currency)}
                </p>
                <p className="text-xs text-[color:var(--store-accent)]">★★★★★ <span className="text-slate-500">{ratingCount}</span></p>
                {"id" in product ? (
                  <AddToCartControl
                    productId={product.id}
                    title={product.title}
                    priceMinor={product.price_minor}
                    currency={product.currency}
                    className="mt-auto inline-flex h-9 w-9 self-end items-center justify-center rounded-full bg-black text-white shadow-sm transition hover:bg-slate-800"
                    ariaLabel={`Lägg ${product.title} i varukorgen`}
                  >
                    <MiniCartIcon />
                  </AddToCartControl>
                ) : (
                  <span className="mt-auto inline-flex h-9 w-9 self-end items-center justify-center rounded-full border border-slate-300 text-slate-600">
                    <MiniCartIcon />
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
