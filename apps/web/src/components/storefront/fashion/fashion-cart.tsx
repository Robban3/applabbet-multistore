"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { readCart, writeCart, type CartItem } from "@/lib/cart-storage";

export function FashionCart({ heading = "Shopping Bag" }: { heading?: string }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  const itemKey = (item: CartItem) =>
    `${item.productId}::${item.selectedColor || ""}::${item.selectedMaterial || ""}::${item.selectedSize || ""}`;

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.priceMinor * it.quantity, 0), [items]);
  const cartCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);
  const currency = items[0]?.currency || "SEK";
  const freeShippingMinor = 99900;
  const free = subtotal >= freeShippingMinor;
  const shipping = free ? 0 : 4900;
  const total = subtotal + shipping;
  const leftToFree = Math.max(0, freeShippingMinor - subtotal);

  function update(item: CartItem, delta: number) {
    const next = items
      .map((it) => (itemKey(it) === itemKey(item) ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
      .filter((it) => it.quantity > 0);
    setItems(next);
    writeCart(next);
  }
  function remove(item: CartItem) {
    const next = items.filter((it) => itemKey(it) !== itemKey(item));
    setItems(next);
    writeCart(next);
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-8 py-20 lg:px-14">
        <h1 className="text-[28px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[36px]">{heading}</h1>
        <p className="mt-6 text-[14px] text-[#1A1A1A]/65">Din varukorg är tom.</p>
        <Link href="/products" className="mt-8 inline-flex h-12 items-center bg-[#1A1A1A] px-8 text-[12px] tracking-[0.25em] uppercase text-[#FAF9F6] hover:bg-black">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-8 py-12 lg:px-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div>
          <h1 className="text-[28px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[32px]">{heading}</h1>
          {!free ? (
            <p className="mt-2 text-[13px] text-[#1A1A1A]/65">
              Lägg till {formatMinorPrice(leftToFree, currency)} för fri frakt.
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-[#1A1A1A]">Du har fri frakt. ✓</p>
          )}

          <div className="mt-10 divide-y divide-[#E5E1DC]">
            {items.map((item) => {
              const variant = [item.selectedColor, item.selectedSize].filter(Boolean) as string[];
              return (
                <article key={itemKey(item)} className="grid grid-cols-[120px_1fr] gap-5 py-8 sm:grid-cols-[120px_1fr_auto]">
                  <div className="aspect-square w-[120px] bg-[#F5F1EA]" />
                  <div className="flex flex-col">
                    <p className="text-[14px] tracking-[0.02em] text-[#1A1A1A]">{item.title}</p>
                    {variant.length > 0 ? (
                      <p className="mt-0.5 text-[13px] text-[#1A1A1A]/60">{variant.join(" · ")}</p>
                    ) : null}
                    <div className="mt-4 flex items-center gap-5">
                      <div className="inline-flex items-center border border-[#E5E1DC]">
                        <button type="button" onClick={() => update(item, -1)} className="flex h-9 w-9 items-center justify-center text-[16px] text-[#1A1A1A] hover:bg-[#F5F2ED]">−</button>
                        <span className="min-w-[32px] px-2 text-center text-[13px] text-[#1A1A1A]">{item.quantity}</span>
                        <button type="button" onClick={() => update(item, 1)} className="flex h-9 w-9 items-center justify-center text-[16px] text-[#1A1A1A] hover:bg-[#F5F2ED]">+</button>
                      </div>
                      <button type="button" onClick={() => remove(item)} className="text-[12px] tracking-[0.15em] uppercase text-[#1A1A1A]/65 underline-offset-4 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="hidden text-right text-[14px] text-[#1A1A1A] sm:block">
                    {formatMinorPrice(item.priceMinor * item.quantity, item.currency)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-[17px] tracking-[0.02em] text-[#1A1A1A]">Order summary</h2>
          <div className="mt-5 space-y-3 border-y border-[#E5E1DC] py-5 text-[14px] text-[#1A1A1A]">
            <div className="flex justify-between"><span>Delsumma</span><span>{formatMinorPrice(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span>Frakt</span><span>{shipping === 0 ? "Gratis" : formatMinorPrice(shipping, currency)}</span></div>
          </div>
          <div className="mt-5 flex justify-between text-[15px] text-[#1A1A1A]">
            <span>Totalt</span>
            <span>{formatMinorPrice(total, currency)}</span>
          </div>
          <Link href="/checkout" className="mt-6 flex h-12 w-full items-center justify-center bg-[#1A1A1A] text-[12px] tracking-[0.25em] uppercase text-[#FAF9F6] hover:bg-black">
            Checkout
          </Link>
          <Link href="/products" className="mt-3 block text-center text-[12px] tracking-[0.15em] uppercase text-[#1A1A1A]/65 underline-offset-4 hover:underline">
            Continue shopping
          </Link>
          <p className="mt-6 text-[12px] text-[#1A1A1A]/55">
            {cartCount} {cartCount === 1 ? "produkt" : "produkter"}
          </p>
        </aside>
      </div>
    </section>
  );
}
