import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";

export type ClassicBestSellerProduct = {
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  badge?: string;
};

export type ClassicBestSellersProps = {
  title: string;
  viewAllLabel: string;
  products: ClassicBestSellerProduct[];
};

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClassicBestSellers({ title, viewAllLabel, products }: ClassicBestSellersProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">
            Populära produkter
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[44px]">
            {title}
          </h2>
        </div>

        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#17120d] hover:text-black">
          {viewAllLabel}
          <ArrowRightIcon />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products.slice(0, 6).map((product, index) => (
          <article
            key={`${product.title}-${index}`}
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(31,24,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,24,18,0.14)]"
          >
            <Link href={product.href || "/products"} className="block">
              <div className="relative h-44 bg-[image:var(--store-media-gradient)]">
                {product.badge || index === 0 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[#17120d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {product.badge || "Bästsäljare"}
                  </span>
                ) : null}
              </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <Link href={product.href || "/products"} className="line-clamp-2 min-h-[42px] text-sm font-semibold text-[#17120d] hover:underline">
                {product.title}
              </Link>

              <p className="mt-3 text-lg font-semibold text-[#17120d]">
                {formatMinorPrice(product.priceMinor, product.currency)}
              </p>

              <Link
                href={product.href || "/products"}
                className="mt-auto inline-flex items-center justify-center rounded-full border border-[#17120d]/15 px-4 py-2 text-xs font-semibold text-[#17120d] transition hover:bg-[#17120d] hover:text-white"
              >
                Visa produkt
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
