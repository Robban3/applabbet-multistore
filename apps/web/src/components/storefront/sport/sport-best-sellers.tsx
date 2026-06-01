import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type SportProduct = {
  id?: string;
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  imageUrl?: string;
  badge?: string;
  favorited?: boolean;
  subtitle?: string;
};

export type SportBestSellersProps = {
  title: string;
  viewAllLabel: string;
  products: SportProduct[];
};

export function SportBestSellers({ title, viewAllLabel, products }: SportBestSellersProps) {
  return (
    <section className="w-full bg-white px-6 py-14 lg:px-10">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-[22px] font-medium text-[#111] lg:text-[26px]">{title}</h2>
        {viewAllLabel && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-[#111] transition hover:text-[#757575]"
          >
            {viewAllLabel}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, 8).map((product, idx) => {
          const productHref = product.href ?? "/products";
          return (
            <div key={product.id ?? `${product.title}-${idx}`} className="group flex flex-col">
              <Link href={productHref} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f7f7f7] to-[#ececec]">
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bdbdbd]">Bild</span>
                    </div>
                  )}
                  {product.id && (
                    <FavoriteToggle
                      productId={product.id}
                      initialFavorited={product.favorited ?? false}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-sm transition hover:bg-[#f5f5f5]"
                    />
                  )}
                  {product.badge && (
                    <span className="absolute left-3 top-3 text-[13px] font-medium text-[#f5402c]">
                      {product.badge}
                    </span>
                  )}
                </div>
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={productHref} className="block">
                    <p className="truncate text-[15px] font-medium text-[#111]">{product.title}</p>
                  </Link>
                  {product.subtitle ? (
                    <p className="mt-0.5 text-[15px] text-[#757575]">{product.subtitle}</p>
                  ) : null}
                  <p className="mt-1.5 text-[15px] font-medium text-[#111]">
                    {formatMinorPrice(product.priceMinor, product.currency)}
                  </p>
                </div>
                {product.id ? (
                  <AddToCartControl
                    productId={product.id}
                    title={product.title}
                    priceMinor={product.priceMinor}
                    currency={product.currency}
                    className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111] text-white opacity-0 transition group-hover:opacity-100 hover:bg-black"
                    ariaLabel={`Lägg ${product.title} i varukorgen`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </AddToCartControl>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
