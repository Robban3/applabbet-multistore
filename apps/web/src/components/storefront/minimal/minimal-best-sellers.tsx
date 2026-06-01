import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type MinimalProduct = {
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

/**
 * Apple.com-stil feature-tiles: stora rutor (2-kolumn), rubrik + undertext +
 * pris överst, "Läs mer"/"Köp"-knappar, stor produktbild under. Alternerande
 * vit/ljusgrå bakgrund som apple.com.
 */
export function MinimalBestSellers({
  title,
  viewAllLabel,
  products,
}: {
  title: string;
  viewAllLabel: string;
  products: MinimalProduct[];
}) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[40px]">{title}</h2>
          <Link href="/products" className="text-[15px] text-[#0066CC] hover:underline">{viewAllLabel} ›</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {products.slice(0, 4).map((p, idx) => {
            const href = p.href ?? "/products";
            const surface = idx % 2 === 0 ? "bg-[#F5F5F7]" : "bg-[#FAFAFA] border border-[#ECECEE]";
            return (
              <article
                key={p.id ?? `${p.title}-${idx}`}
                className={`group relative flex flex-col items-center overflow-hidden rounded-[18px] px-6 pt-12 pb-2 text-center ${surface}`}
              >
                {p.id ? (
                  <FavoriteToggle
                    productId={p.id}
                    initialFavorited={p.favorited ?? false}
                    className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#ececef]"
                    inactiveClassName="text-[#1D1D1F]"
                    activeClassName="text-[#0071E3]"
                  />
                ) : null}

                {p.badge ? (
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066CC]">{p.badge}</p>
                ) : null}
                <Link href={href}>
                  <h3 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[32px]">{p.title}</h3>
                </Link>
                {p.subtitle ? <p className="mt-1 text-[15px] text-[#6E6E73]">{p.subtitle}</p> : null}
                <p className="mt-1 text-[15px] text-[#1D1D1F]">Från {formatMinorPrice(p.priceMinor, p.currency)}</p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    href={href}
                    className="inline-flex h-9 items-center rounded-full border border-[#0071E3] px-5 text-[14px] font-medium text-[#0071E3] transition hover:bg-[#0071E3] hover:text-white"
                  >
                    Läs mer
                  </Link>
                  {p.id ? (
                    <AddToCartControl
                      productId={p.id}
                      title={p.title}
                      priceMinor={p.priceMinor}
                      currency={p.currency}
                      className="inline-flex h-9 items-center rounded-full bg-[#0071E3] px-5 text-[14px] font-medium text-white transition hover:bg-[#0077ED]"
                      ariaLabel={`Köp ${p.title}`}
                    >
                      Köp
                    </AddToCartControl>
                  ) : null}
                </div>

                <Link href={href} className="relative mt-6 block aspect-[16/10] w-full">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                    />
                  ) : null}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
