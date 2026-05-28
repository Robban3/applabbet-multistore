"use client";

import { useMemo, useState } from "react";
import { addProductToCart } from "@/lib/cart-storage";
import type { Product } from "@/types/commerce";
import { formatMinorPrice } from "@/lib/format";

export function ProductListClient({ products }: { products: Product[] }) {
  const [notice, setNotice] = useState<string>("");

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.title.localeCompare(b.title)),
    [products],
  );

  function addToCart(product: Product) {
    addProductToCart({
      productId: product.id,
      title: product.title,
      priceMinor: product.price_minor,
      currency: product.currency,
    });
    setNotice(`${product.title} lades till i varukorgen.`);
    window.setTimeout(() => setNotice(""), 2000);
  }

  return (
    <div className="space-y-4">
      {notice ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{product.description}</p>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {formatMinorPrice(product.price_minor, product.currency)}
            </p>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Lägg i varukorg
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
