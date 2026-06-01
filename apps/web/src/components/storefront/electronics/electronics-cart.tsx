"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMinorPrice } from "@/lib/format";
import { readCart, writeCart, type CartItem } from "@/lib/cart-storage";

export function ElectronicsCart({ heading = "Varukorg" }: { heading?: string }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const itemKey = (i: CartItem) => `${i.productId}::${i.selectedColor || ""}::${i.selectedMaterial || ""}::${i.selectedSize || ""}`;

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.priceMinor * it.quantity, 0), [items]);
  const cartCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);
  const currency = items[0]?.currency || "SEK";
  const free = subtotal >= 49900;
  const shipping = free ? 0 : 4900;
  const total = subtotal + shipping;

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
      <section className="mx-auto w-full max-w-[1100px] px-6 py-20">
        <h1 className="text-[28px] font-bold text-[#0A2540]">{heading}</h1>
        <p className="mt-4 text-[15px] text-[#0A2540]/65">Din varukorg är tom.</p>
        <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#2f7dff] px-6 text-[15px] font-semibold text-white hover:bg-[#1a6cf0]">Fortsätt handla</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1100px] px-6 py-12">
      <h1 className="text-[28px] font-bold text-[#0A2540]">{heading} ({cartCount})</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-[#DCE6F5] rounded-[12px] border border-[#DCE6F5] bg-white">
          {items.map((item) => (
            <article key={itemKey(item)} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-4">
              <div className="aspect-square w-20 rounded-[10px] bg-[#F4F7FC]" />
              <div>
                <p className="text-[15px] font-semibold text-[#0A2540]">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-[#0A2540]/55">I lager · 1-2 arbetsdagar</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-[8px] border border-[#DCE6F5]">
                    <button type="button" onClick={() => update(item, -1)} className="flex h-8 w-8 items-center justify-center text-[#0A2540]">−</button>
                    <span className="min-w-[28px] text-center text-[14px] text-[#0A2540]">{item.quantity}</span>
                    <button type="button" onClick={() => update(item, 1)} className="flex h-8 w-8 items-center justify-center text-[#0A2540]">+</button>
                  </div>
                  <button type="button" onClick={() => remove(item)} className="text-[13px] text-[#2f7dff] hover:underline">Ta bort</button>
                </div>
              </div>
              <p className="text-right text-[16px] font-bold text-[#0A2540]">{formatMinorPrice(item.priceMinor * item.quantity, item.currency)}</p>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[12px] border border-[#DCE6F5] bg-white p-5 lg:sticky lg:top-32">
          <h2 className="text-[17px] font-bold text-[#0A2540]">Sammanfattning</h2>
          <div className="mt-4 space-y-2 text-[14px] text-[#0A2540]">
            <div className="flex justify-between"><span>Delsumma</span><span>{formatMinorPrice(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span>Frakt</span><span>{shipping === 0 ? "Gratis" : formatMinorPrice(shipping, currency)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#DCE6F5] pt-4 text-[18px] font-bold text-[#0A2540]">
            <span>Totalt</span><span>{formatMinorPrice(total, currency)}</span>
          </div>
          <Link href="/checkout" className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#2f7dff] text-[15px] font-semibold text-white hover:bg-[#1a6cf0]">Till kassan</Link>
          <p className="mt-3 text-center text-[12px] text-[#0A2540]/55">Trygg betalning med Klarna, Swish & kort</p>
        </aside>
      </div>
    </section>
  );
}
