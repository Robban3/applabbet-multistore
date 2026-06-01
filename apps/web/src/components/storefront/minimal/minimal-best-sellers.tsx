import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";

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
 * Apple-stil produktrad: vita kort med stor centrerad produktbild,
 * fet titel, undertext, pris, blå "Köp"-pill.
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
    <section className="bg-[#F5F5F7] px-6 py-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F] lg:text-[40px]">{title}</h2>
          <Link href="/products" className="text-[15px] text-[#0066CC] hover:underline">{viewAllLabel} ›</Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, idx) => {
            const href = p.href ?? "/products";
            return (
              <article key={p.id ?? `${p.title}-${idx}`} className="flex flex-col items-center rounded-[18px] bg-white p-6 text-center">
                <Link href={href} className="block w-full">
                  <div className="relative aspect-square w-full">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.title} className="absolute inset-0 h-full w-full object-contain" />
                    ) : null}
                  </div>
                </Link>
                {p.badge ? (
                  <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-[#0066CC]">{p.badge}</p>
                ) : null}
                <Link href={href} className="mt-3 block">
                  <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">{p.title}</p>
                </Link>
                {p.subtitle ? <p className="mt-1 text-[13px] text-[#6E6E73]">{p.subtitle}</p> : null}
                <p className="mt-2 text-[15px] text-[#1D1D1F]">{formatMinorPrice(p.priceMinor, p.currency)}</p>
                {p.id ? (
                  <AddToCartControl
                    productId={p.id}
                    title={p.title}
                    priceMinor={p.priceMinor}
                    currency={p.currency}
                    className="mt-4 inline-flex h-9 items-center rounded-full bg-[#0071E3] px-5 text-[14px] font-normal text-white transition hover:bg-[#0077ED]"
                    ariaLabel={`Köp ${p.title}`}
                  >
                    Köp
                  </AddToCartControl>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
