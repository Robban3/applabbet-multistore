"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { readCart, writeCart, type CartItem } from "@/lib/cart-storage";

export function MinimalCart({ heading = "Din väska" }: { heading?: string }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const itemKey = (i: CartItem) => `${i.productId}::${i.selectedColor || ""}::${i.selectedMaterial || ""}::${i.selectedSize || ""}`;

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.priceMinor * it.quantity, 0), [items]);
  const cartCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);
  const currency = items[0]?.currency || "SEK";

  function update(item: CartItem, delta: number) {
    const next = items.map((it) => (itemKey(it) === itemKey(item) ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)).filter((it) => it.quantity > 0);
    setItems(next); writeCart(next);
  }
  function remove(item: CartItem) {
    const next = items.filter((it) => itemKey(it) !== itemKey(item));
    setItems(next); writeCart(next);
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[820px] px-6 py-24 text-center">
        <h1 className="text-[40px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{heading}</h1>
        <p className="mt-4 text-[19px] text-[#6E6E73]">Din väska är tom.</p>
        <Link href="/products" className="mt-8 inline-flex h-11 items-center rounded-full bg-[#0071E3] px-6 text-[15px] text-white hover:bg-[#0077ED]">
          Fortsätt handla
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[820px] px-6 py-16">
      <h1 className="text-center text-[40px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{heading}</h1>
      <p className="mt-2 text-center text-[19px] text-[#6E6E73]">
        Delsumma: <span className="text-[#1D1D1F]">{formatMinorPrice(subtotal, currency)}</span>
      </p>

      <div className="mt-12 divide-y divide-[#D2D2D7] border-t border-[#D2D2D7]">
        {items.map((item) => {
          const variant = [item.selectedColor, item.selectedSize].filter(Boolean) as string[];
          return (
            <article key={itemKey(item)} className="grid grid-cols-[100px_1fr_auto] items-center gap-6 py-8">
              <div className="aspect-square w-[100px] rounded-[14px] bg-[#F5F5F7]" />
              <div>
                <p className="text-[17px] font-semibold text-[#1D1D1F]">{item.title}</p>
                {variant.length > 0 ? <p className="mt-0.5 text-[13px] text-[#6E6E73]">{variant.join(" · ")}</p> : null}
                <div className="mt-3 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-full border border-[#D2D2D7]">
                    <button type="button" onClick={() => update(item, -1)} className="flex h-8 w-8 items-center justify-center text-[#1D1D1F]">−</button>
                    <span className="min-w-[28px] text-center text-[14px] text-[#1D1D1F]">{item.quantity}</span>
                    <button type="button" onClick={() => update(item, 1)} className="flex h-8 w-8 items-center justify-center text-[#1D1D1F]">+</button>
                  </div>
                  <button type="button" onClick={() => remove(item)} className="text-[14px] text-[#0066CC] hover:underline">Ta bort</button>
                </div>
              </div>
              <p className="text-right text-[17px] text-[#1D1D1F]">{formatMinorPrice(item.priceMinor * item.quantity, item.currency)}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className="flex w-full max-w-[400px] justify-between border-t border-[#D2D2D7] pt-6 text-[21px] font-semibold text-[#1D1D1F]">
          <span>Totalt</span>
          <span>{formatMinorPrice(subtotal, currency)}</span>
        </div>
        <Link href="/checkout" className="mt-8 flex h-12 w-full max-w-[400px] items-center justify-center rounded-full bg-[#0071E3] text-[17px] text-white hover:bg-[#0077ED]">
          Betala i kassan
        </Link>
        <Link href="/products" className="mt-4 text-[15px] text-[#0066CC] hover:underline">Fortsätt handla ›</Link>
        <p className="mt-6 text-[13px] text-[#6E6E73]">{cartCount} {cartCount === 1 ? "produkt" : "produkter"}</p>
      </div>
    </section>
  );
}
