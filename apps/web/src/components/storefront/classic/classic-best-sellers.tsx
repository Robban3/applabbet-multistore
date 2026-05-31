import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type ClassicBestSellerProduct = {
  id?: string;
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  badge?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  favorited?: boolean;
};

export type ClassicBestSellersProps = {
  title: string;
  viewAllLabel: string;
  products: ClassicBestSellerProduct[];
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
      <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
    </svg>
  );
}

function StarRating({ rating = 4.5, count = 120 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[11px] text-[#c9973d]">
        {"★".repeat(Math.floor(rating))}{rating % 1 >= 0.5 ? "½" : ""}
      </span>
      <span className="text-[11px] text-[#5f554a]">({count})</span>
    </div>
  );
}

export function ClassicBestSellers({ title, viewAllLabel, products }: ClassicBestSellersProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-5">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold leading-none tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[44px]">
          {title}
        </h2>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#17120d] hover:text-black">
          {viewAllLabel}
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products.slice(0, 6).map((product, index) => (
          <article
            key={`${product.title}-${index}`}
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_8px_24px_rgba(31,24,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,24,18,0.14)]"
          >
            <Link href={product.href || "/products"} className="block">
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#f5f0e8] to-[#ede5d4]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}

                {product.id ? (
                  <FavoriteToggle
                    productId={product.id}
                    initialFavorited={product.favorited ?? false}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                  />
                ) : null}

                {product.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[#17120d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </Link>

            <div className="flex flex-1 flex-col p-3.5">
              <Link href={product.href || "/products"} className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-snug text-[#17120d] hover:underline">
                {product.title}
              </Link>

              <StarRating rating={product.rating} count={product.reviewCount} />

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[18px] font-semibold text-[#17120d]">
                  {formatMinorPrice(product.priceMinor, product.currency)}
                </p>
                {product.id ? (
                  <AddToCartControl
                    productId={product.id}
                    title={product.title}
                    priceMinor={product.priceMinor}
                    currency={product.currency}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#17120d] text-white shadow-sm transition hover:bg-[#2a1f14]"
                    ariaLabel={`Lägg ${product.title} i varukorgen`}
                  >
                    <CartIcon />
                  </AddToCartControl>
                ) : (
                  <Link
                    href={product.href || "/products"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#17120d] text-white shadow-sm transition hover:bg-[#2a1f14]"
                  >
                    <CartIcon />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
