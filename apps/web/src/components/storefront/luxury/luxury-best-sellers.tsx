import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type LuxuryProduct = {
  id?: string;
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  imageUrl?: string;
  badge?: string;
  favorited?: boolean;
};

export type LuxuryBestSellersProps = {
  title: string;
  viewAllLabel: string;
  products: LuxuryProduct[];
};

export function LuxuryBestSellers({ title, viewAllLabel, products }: LuxuryBestSellersProps) {
  return (
    <section className="w-full px-8 pb-16 sm:px-12 lg:px-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-light tracking-[0.5em] text-[#C41E3A] uppercase">Sélection</p>
          <h2 className="mt-3 text-3xl font-light tracking-[-0.02em] text-[#17120d] lg:text-4xl">{title}</h2>
        </div>
        <Link href="/products" className="text-[10px] font-light tracking-[0.3em] uppercase text-[#5f4a3a] transition hover:text-[#C41E3A]">
          {viewAllLabel} →
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product, index) => (
          <article key={`${product.title}-${index}`} className="group relative">
            <Link href={product.href || "/products"} className="block">
              <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#F5F0E8] to-[#EDE5DC]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(184,150,62,0.08),transparent_60%)]" />
                  </div>
                )}
                {product.badge ? (
                  <span className="absolute left-3 top-3 bg-[#C41E3A] px-2.5 py-1 text-[9px] font-light tracking-[0.25em] uppercase text-white">
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </Link>
            {product.id ? (
              <FavoriteToggle
                productId={product.id}
                initialFavorited={product.favorited ?? false}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center bg-white/80 backdrop-blur-sm transition hover:bg-white"
                inactiveClassName="text-[#17120d]"
                activeClassName="text-[#C41E3A]"
              />
            ) : null}

            <div className="mt-4 flex items-start justify-between gap-2">
              <div className="flex-1">
                <Link href={product.href || "/products"}>
                  <p className="text-[15px] font-light tracking-[0.05em] text-[#17120d] transition group-hover:text-[#C41E3A] line-clamp-2">
                    {product.title}
                  </p>
                </Link>
                <p className="mt-1.5 text-[14px] font-light text-[#5f4a3a]">
                  {formatMinorPrice(product.priceMinor, product.currency)}
                </p>
              </div>
              {product.id ? (
                <AddToCartControl
                  productId={product.id}
                  title={product.title}
                  priceMinor={product.priceMinor}
                  currency={product.currency}
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#17120d]/20 text-[#17120d] transition hover:border-[#C41E3A] hover:text-[#C41E3A]"
                  ariaLabel={`Lägg ${product.title} i varukorgen`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
                    <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
                  </svg>
                </AddToCartControl>
              ) : (
                <Link href={product.href || "/products"} className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#17120d]/20 text-[#17120d] transition hover:border-[#C41E3A] hover:text-[#C41E3A]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
                    <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
                  </svg>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
