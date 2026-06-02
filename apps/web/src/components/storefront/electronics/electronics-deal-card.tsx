import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { FavoriteToggle } from "@/components/favorite-toggle";

export type ElectronicsDealProduct = {
  id?: string;
  slug?: string;
  title: string;
  priceMinor: number;
  currency: string;
  href?: string;
  imageUrl?: string;
  subtitle?: string;
  favorited?: boolean;
};

/**
 * Webhallen-stil deal card: rabattbadge, överstruket ordpris, "SPARA X%",
 * blå pris, lägg-i-varukorg. Ordpriset beräknas deterministiskt per produkt
 * (demo) så varje kort får en realistisk rea-känsla.
 */
function dealFor(seed: string, priceMinor: number) {
  // Deterministisk rabatt 0–28% baserat på slug-hash
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const pct = h % 30; // 0..29
  if (pct < 6) return null; // ~20% av produkterna utan rea
  const discount = pct; // procent
  const wasMinor = Math.round(priceMinor / (1 - discount / 100));
  return { discount, wasMinor };
}

export function ElectronicsDealCard({ product }: { product: ElectronicsDealProduct }) {
  const href = product.href ?? (product.slug ? `/products/${product.slug}` : "/products");
  const deal = dealFor(product.slug ?? product.title, product.priceMinor);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[12px] border border-[#DCE6F5] bg-white transition hover:shadow-[0_8px_24px_rgba(10,37,64,0.10)]">
      {product.id ? (
        <FavoriteToggle
          productId={product.id}
          initialFavorited={product.favorited ?? false}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#eef3fb]"
          inactiveClassName="text-[#0A2540]"
          activeClassName="text-[#2f7dff]"
        />
      ) : null}
      <Link href={href} className="relative block">
        {deal ? (
          <span className="absolute left-3 top-3 z-10 rounded-[6px] bg-[#E8362D] px-2 py-1 text-[12px] font-bold text-white">
            −{deal.discount}%
          </span>
        ) : null}
        <div className="relative aspect-square bg-[#F4F7FC]">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.title} className="absolute inset-0 h-full w-full object-contain p-4 transition group-hover:scale-[1.03]" />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href}>
          <p className="line-clamp-2 min-h-[40px] text-[14px] font-semibold text-[#0A2540] hover:text-[#2f7dff]">{product.title}</p>
        </Link>
        {product.subtitle ? <p className="mt-0.5 text-[12px] text-[#0A2540]/55">{product.subtitle}</p> : null}

        {/* Betyg-stjärnor (statisk demo) */}
        <p className="mt-2 text-[12px] text-[#FFB400]">★★★★<span className="text-[#DCE6F5]">★</span> <span className="text-[#0A2540]/45">(86)</span></p>

        <div className="mt-auto pt-3">
          {deal ? (
            <p className="text-[12px] text-[#0A2540]/45">
              Ord. <span className="line-through">{formatMinorPrice(deal.wasMinor, product.currency)}</span>
            </p>
          ) : null}
          <div className="mt-1 flex items-end justify-between">
            <p className={`text-[20px] font-bold ${deal ? "text-[#E8362D]" : "text-[#0A2540]"}`}>
              {formatMinorPrice(product.priceMinor, product.currency)}
            </p>
            {product.id ? (
              <AddToCartControl
                productId={product.id}
                title={product.title}
                priceMinor={product.priceMinor}
                currency={product.currency}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f7dff] text-white transition hover:bg-[#1a6cf0]"
                ariaLabel={`Lägg ${product.title} i varukorgen`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 7h13l-1.5 11H7.5L6 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </AddToCartControl>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
