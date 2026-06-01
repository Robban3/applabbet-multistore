"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { readCart, writeCart, type CartItem } from "@/lib/cart-storage";

/**
 * Nike-stil varukorg.
 * Layout: stor "Bag" rubrik, vänster items-lista (ren, ramlös, stor produktbild
 * vänster, metadata mitten, pris höger), höger "Summary" sticky-aside med
 * subtotal, frakt, total, svart pill-CTA "Checkout".
 */
export type SportCartProps = {
  heading?: string;
  freeShippingThresholdMinor?: number;
};

export function SportCart({
  heading = "Bag",
  freeShippingThresholdMinor = 49900,
}: SportCartProps) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  const itemKey = (item: CartItem) =>
    `${item.productId}::${item.selectedColor || ""}::${item.selectedMaterial || ""}::${item.selectedSize || ""}`;

  const subtotalMinor = useMemo(
    () => items.reduce((sum, it) => sum + it.priceMinor * it.quantity, 0),
    [items],
  );
  const cartCount = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);
  const currency = items[0]?.currency || "SEK";
  const qualifiesFreeShipping = subtotalMinor >= freeShippingThresholdMinor;
  const shippingMinor = qualifiesFreeShipping ? 0 : 4900;
  const totalMinor = subtotalMinor + shippingMinor;
  const amountLeftForFreeShipping = Math.max(0, freeShippingThresholdMinor - subtotalMinor);

  function updateQuantity(target: CartItem, delta: number) {
    const next = items
      .map((it) =>
        itemKey(it) === itemKey(target) ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it,
      )
      .filter((it) => it.quantity > 0);
    setItems(next);
    writeCart(next);
  }

  function removeItem(target: CartItem) {
    const next = items.filter((it) => itemKey(it) !== itemKey(target));
    setItems(next);
    writeCart(next);
  }

  function moveToFavorites(target: CartItem) {
    // Placeholder — riktig favorit-API kan kopplas in senare.
    removeItem(target);
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-10">
        <h1 className="text-[36px] font-medium text-[#111] lg:text-[44px]">{heading}</h1>
        <div className="mt-8 max-w-xl">
          <p className="text-[15px] text-[#111]">There are no items in your bag.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-[#111] px-8 text-[14px] font-medium text-white transition hover:bg-black"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        {/* Vänster: items */}
        <div>
          <h1 className="text-[28px] font-medium text-[#111] lg:text-[36px]">{heading}</h1>

          {/* Free shipping progress */}
          {!qualifiesFreeShipping ? (
            <p className="mt-2 text-[13px] text-[#757575]">
              Lägg till varor för {formatMinorPrice(amountLeftForFreeShipping, currency)} för att kvalificera dig för fri frakt.
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-[#111]">Du har fri frakt. ✓</p>
          )}

          <div className="mt-8 divide-y divide-[#e5e5e5]">
            {items.map((item) => {
              const variantParts = [item.selectedColor, item.selectedSize].filter(Boolean) as string[];
              return (
                <article
                  key={itemKey(item)}
                  className="grid grid-cols-[150px_1fr] gap-5 py-8 sm:grid-cols-[150px_1fr_auto]"
                >
                  {/* Produktbild — placeholder tills cart sparar imageUrl */}
                  <div className="aspect-square w-[150px] bg-[#f5f5f5]" />

                  {/* Mitten: namn + metadata + qty + actions */}
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[15px] font-medium text-[#111]">{item.title}</p>
                      {/* Mobile pris */}
                      <p className="text-[15px] font-medium text-[#111] sm:hidden">
                        {formatMinorPrice(item.priceMinor * item.quantity, item.currency)}
                      </p>
                    </div>
                    {variantParts.length > 0 ? (
                      <p className="mt-0.5 text-[15px] text-[#757575]">{variantParts.join("   ·   ")}</p>
                    ) : null}

                    {/* Quantity stepper */}
                    <div className="mt-4 flex items-center gap-6">
                      <div className="inline-flex items-center rounded-full border border-[#757575]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, -1)}
                          aria-label="Minska antal"
                          className="flex h-9 w-9 items-center justify-center text-[18px] text-[#111] transition hover:bg-[#f5f5f5] rounded-l-full"
                        >
                          −
                        </button>
                        <span className="min-w-[36px] px-2 text-center text-[14px] font-medium text-[#111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, 1)}
                          aria-label="Öka antal"
                          className="flex h-9 w-9 items-center justify-center text-[18px] text-[#111] transition hover:bg-[#f5f5f5] rounded-r-full"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => moveToFavorites(item)}
                        aria-label="Flytta till favoriter"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#757575] text-[#111] transition hover:bg-[#f5f5f5]"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        aria-label="Ta bort"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#757575] text-[#111] transition hover:bg-[#f5f5f5]"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                        </svg>
                      </button>
                    </div>

                    {/* Status */}
                    <p className="mt-4 text-[13px] text-[#111]">I lager</p>
                  </div>

                  {/* Desktop pris */}
                  <p className="hidden text-right text-[15px] font-medium text-[#111] sm:block">
                    {formatMinorPrice(item.priceMinor * item.quantity, item.currency)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Höger: summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-[20px] font-medium text-[#111]">Summary</h2>

          <div className="mt-5 space-y-3 text-[15px] text-[#111]">
            <div className="flex justify-between">
              <span>Delsumma</span>
              <span>{formatMinorPrice(subtotalMinor, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Beräknad frakt & hantering</span>
              <span>{shippingMinor === 0 ? "Gratis" : formatMinorPrice(shippingMinor, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Beräknad skatt</span>
              <span>—</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-y border-[#e5e5e5] py-4 text-[15px] font-medium text-[#111]">
            <span>Totalt</span>
            <span>{formatMinorPrice(totalMinor, currency)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#111] text-[15px] font-medium text-white transition hover:bg-black"
          >
            Gå till kassan
          </Link>

          <button
            type="button"
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#111] bg-white text-[15px] font-medium text-[#111] transition hover:bg-[#f5f5f5]"
          >
            <span className="text-[16px]">G Pay</span>
          </button>

          <Link
            href="/products"
            className="mt-6 block text-center text-[14px] font-medium text-[#111] underline-offset-4 hover:underline"
          >
            Fortsätt shoppa
          </Link>

          {/* Antal */}
          <p className="mt-6 text-[12px] text-[#757575]">
            {cartCount} {cartCount === 1 ? "produkt" : "produkter"} i din varukorg
          </p>
        </aside>
      </div>

      {/* Recommended */}
      <section className="mt-16 border-t border-[#e5e5e5] pt-10">
        <h2 className="text-[20px] font-medium text-[#111]">Favoriter</h2>
        <p className="mt-1 text-[14px] text-[#757575]">Produkter du sparat dyker upp här.</p>
      </section>
    </section>
  );
}
