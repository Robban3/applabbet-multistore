import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type FashionProduct = {
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

export function FashionBestSellers({
  title,
  viewAllLabel,
  products,
}: {
  title: string;
  viewAllLabel: string;
  products: FashionProduct[];
}) {
  return (
    <section className="bg-[#FAF9F6] px-8 py-20 lg:px-14">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-[28px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[36px]">{title}</h2>
        <Link
          href="/products"
          className="text-[12px] tracking-[0.2em] uppercase text-[#1A1A1A] underline-offset-4 hover:underline"
        >
          {viewAllLabel}
        </Link>
      </div>

      <div className="grid gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p, idx) => {
          const href = p.href ?? "/products";
          return (
            <article key={p.id ?? `${p.title}-${idx}`} className="group relative flex flex-col">
              <Link href={href} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#F5F1EA]">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  {p.badge ? (
                    <span className="absolute left-3 top-3 bg-[#1A1A1A] px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-[#FAF9F6]">
                      {p.badge}
                    </span>
                  ) : null}
                </div>
              </Link>
              {p.id ? (
                <FavoriteToggle
                  productId={p.id}
                  initialFavorited={p.favorited ?? false}
                  className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center bg-white/85 backdrop-blur-sm transition hover:bg-white"
                  inactiveClassName="text-[#1A1A1A]"
                  activeClassName="text-[#1A1A1A]"
                />
              ) : null}

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={href}>
                    <p className="text-[14px] tracking-[0.02em] text-[#1A1A1A]">{p.title}</p>
                  </Link>
                  {p.subtitle ? (
                    <p className="mt-0.5 text-[12px] text-[#1A1A1A]/55">{p.subtitle}</p>
                  ) : null}
                  <p className="mt-1.5 text-[14px] text-[#1A1A1A]">
                    {formatMinorPrice(p.priceMinor, p.currency)}
                  </p>
                </div>
                {p.id ? (
                  <AddToCartControl
                    productId={p.id}
                    title={p.title}
                    priceMinor={p.priceMinor}
                    currency={p.currency}
                    className="opacity-0 transition group-hover:opacity-100 inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                    ariaLabel={`Lägg ${p.title} i varukorgen`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </AddToCartControl>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
