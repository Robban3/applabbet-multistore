import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type BeautyProduct = {
  id?: string;
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  imageUrl?: string;
  badge?: string;
  favorited?: boolean;
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
};

function Stars({ rating = 4.5, count }: { rating?: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <span className="text-[13px] text-[#EC008C]">
        {"★".repeat(full)}
        <span className="text-[#E3D3DB]">{"★".repeat(5 - full)}</span>
      </span>
      {count ? <span className="text-[11px] text-[#1A1A1A]/45">({count})</span> : null}
    </div>
  );
}

/**
 * KICKS.se-stil produktkort: varumärke (fet versal) → produktnamn → betyg
 * → pris i rosa, hjärta uppe till höger, "Köp i varukorg"-knapp.
 */
export function BeautyBestSellers({
  title,
  viewAllLabel,
  products,
}: {
  title: string;
  viewAllLabel: string;
  products: BeautyProduct[];
}) {
  return (
    <section className="bg-[#FAFAFA] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-[26px] font-extrabold uppercase tracking-[-0.01em] text-[#1A1A1A] lg:text-[32px]">{title}</h2>
          <Link href="/products" className="text-[14px] font-semibold uppercase text-[#EC008C] hover:underline">{viewAllLabel}</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 8).map((p, idx) => {
            const href = p.href ?? "/products";
            return (
              <article key={p.id ?? `${p.title}-${idx}`} className="group relative flex flex-col rounded-[14px] border border-[#ECECEC] bg-white p-3">
                {p.badge ? (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#EC008C] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-white">
                    {p.badge}
                  </span>
                ) : null}
                {p.id ? (
                  <FavoriteToggle
                    productId={p.id}
                    initialFavorited={p.favorited ?? false}
                    className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#FBE9F2]"
                    inactiveClassName="text-[#1A1A1A]"
                    activeClassName="text-[#EC008C]"
                  />
                ) : null}

                <Link href={href} className="block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-[#FBE9F2]">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                    ) : null}
                  </div>
                </Link>

                <div className="mt-3 flex flex-1 flex-col">
                  {p.subtitle ? (
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1A1A1A]">{p.subtitle}</p>
                  ) : null}
                  <Link href={href}>
                    <p className="mt-0.5 line-clamp-2 min-h-[36px] text-[14px] text-[#1A1A1A]/80 hover:text-[#EC008C]">{p.title}</p>
                  </Link>
                  <div className="mt-1.5"><Stars rating={p.rating} count={p.reviewCount} /></div>
                  <p className="mt-2 text-[18px] font-extrabold text-[#EC008C]">{formatMinorPrice(p.priceMinor, p.currency)}</p>
                  {p.id ? (
                    <AddToCartControl
                      productId={p.id}
                      title={p.title}
                      priceMinor={p.priceMinor}
                      currency={p.currency}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#1A1A1A] px-4 text-[13px] font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[#EC008C]"
                      ariaLabel={`Lägg ${p.title} i varukorgen`}
                    >
                      Köp
                    </AddToCartControl>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
