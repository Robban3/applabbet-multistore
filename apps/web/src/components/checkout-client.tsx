"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CartCountBadge } from "@/components/cart-count-badge";
import { TopTrustStrip } from "@/components/top-trust-strip";
import { readCart, writeCart } from "@/lib/cart-storage";
import { formatMinorPrice } from "@/lib/format";
import { defaultTrustBadges, type TrustBadge } from "@/lib/tenant-settings-shared";

type CartItem = {
  productId: string;
  title: string;
  priceMinor: number;
  quantity: number;
  currency: string;
  selectedColor?: string;
  selectedMaterial?: string;
  selectedSize?: string;
};

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/bastsaljare" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

const productDetails: Record<string, { subtitle: string; variant: string; stock: string }> = {
  "Nike Pegasus 41": { subtitle: "Löparsko för herr", variant: "Färg: Svart/Vit · Storlek: 42", stock: "I lager" },
  "Sony WH-1000XM5": { subtitle: "Trådlösa hörlurar med brusreducering", variant: "Färg: Svart", stock: "I lager" },
  "Adidas 4Athlts Duffel M": { subtitle: "Träningsväska", variant: "Färg: Svart", stock: "I lager" },
};

const recommendationItems = [
  { title: "Garmin Forerunner 965", subtitle: "Löparklocka", priceMinor: 649900, currency: "SEK" },
  { title: "Nike Everyday Plus", subtitle: "Träningsstrumpor (3-pack)", priceMinor: 19900, currency: "SEK" },
  { title: "SmartShake Reforce", subtitle: "Shaker 900 ml", priceMinor: 14900, currency: "SEK" },
  { title: "Under Armour Blitzing", subtitle: "Träningskeps", priceMinor: 24900, currency: "SEK" },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TrustIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.7" />
        <circle cx="17" cy="18" r="1.7" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M20 5v5h-5" />
        <path d="M4 19v-5h5" />
        <path d="M19 10a7 7 0 0 0-12-3" />
        <path d="M5 14a7 7 0 0 0 12 3" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
        <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

type CheckoutClientProps = {
  heading?: string;
  freeShippingText?: string;
  brandName?: string;
  trustBadges?: TrustBadge[];
};

export function CheckoutClient({
  heading = "Din varukorg",
  freeShippingText = "Fri frakt! Du har fri frakt på din beställning.",
  brandName = "APPLABBET",
  trustBadges = defaultTrustBadges,
}: CheckoutClientProps) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const itemKey = (item: CartItem) =>
    `${item.productId}::${item.selectedColor || ""}::${item.selectedMaterial || ""}::${item.selectedSize || ""}`;

  const totalMinor = useMemo(
    () => items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0),
    [items],
  );

  const currency = items[0]?.currency || "SEK";
  const shippingMinor = 0;
  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotalMinor = totalMinor;

  function updateQuantity(target: CartItem, delta: number) {
    const next = items
      .map((item) =>
        itemKey(item) === itemKey(target)
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(next);
    writeCart(next);
  }

  function removeItem(target: CartItem) {
    const next = items.filter((item) => itemKey(item) !== itemKey(target));
    setItems(next);
    writeCart(next);
  }

  function clearCart() {
    setItems([]);
    writeCart([]);
  }

  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
      <div
        className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
        style={{ borderColor: "var(--store-footer-border)" }}
      >
        <header className="relative flex items-center justify-between px-4 py-3 text-white sm:px-6" style={{ background: "var(--store-header-gradient)" }}>
          <p className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</p>
          <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/90 xl:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-[color:var(--store-accent)]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-white/85">
            <details className="relative xl:hidden">
              <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <div className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 bg-[#12100e] p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]">
                {navItems.map((item) => (
                  <Link
                    key={`mobile-${item.label}`}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <Link href="/sok" aria-label="Sök" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" /></svg>
            </Link>
            <Link href="/mina-sidor" aria-label="Konto" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="3.5" /><path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" /></svg>
            </Link>
            <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" /></svg>
              <CartCountBadge initialCount={cartCount} />
            </Link>
          </div>
        </header>

        <TopTrustStrip items={trustBadges} />

        <div className="px-6 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900">{heading} ({cartCount})</h1>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
              Fortsätt handla
              <ArrowRightIcon />
            </Link>
          </div>
          <p className="mb-4 text-sm text-slate-700">{freeShippingText}</p>

          <div className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
            <section className="rounded-xl border bg-white p-3" style={{ borderColor: "var(--store-footer-border)" }}>
              {items.length === 0 ? (
                <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Varukorgen är tom.</p>
              ) : (
                <div className="divide-y divide-[#ece4d8]">
                  {items.map((item) => {
                    const variantParts = [
                      item.selectedColor ? `Färg: ${item.selectedColor}` : null,
                      item.selectedMaterial ? `Material: ${item.selectedMaterial}` : null,
                      item.selectedSize ? `Storlek: ${item.selectedSize}` : null,
                    ].filter(Boolean);
                    const details = productDetails[item.title] || { subtitle: "Premiumprodukt", variant: "Färg: Svart", stock: "I lager" };
                    return (
                      <article key={itemKey(item)} className="grid grid-cols-[150px_1fr_auto_auto_auto] items-center gap-4 py-3">
                        <div className="h-20 rounded-lg border border-slate-200 bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]" />
                        <div>
                          <p className="text-2xl font-semibold text-slate-900">{item.title}</p>
                          <p className="text-sm text-slate-600">{details.subtitle}</p>
                          <p className="text-sm text-slate-600">{variantParts.length > 0 ? variantParts.join(" · ") : details.variant}</p>
                          <p className="text-sm text-emerald-700">• {details.stock}</p>
                        </div>
                        <div className="inline-flex items-center rounded-md border border-slate-300">
                          <button onClick={() => updateQuantity(item, -1)} className="px-3 py-1.5 text-slate-700">−</button>
                          <span className="border-x border-slate-300 px-4 py-1.5 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item, 1)} className="px-3 py-1.5 text-slate-700">+</button>
                        </div>
                        <p className="text-3xl font-semibold text-slate-900">{formatMinorPrice(item.priceMinor * item.quantity, item.currency)}</p>
                        <button onClick={() => removeItem(item)} className="text-lg text-slate-400 hover:text-slate-600">×</button>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-[#ece4d8] pt-3">
                <button onClick={clearCart} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">Töm varukorgen</button>
                <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">Uppdatera varukorg</button>
              </div>
            </section>

            <aside className="space-y-3 rounded-xl border bg-white p-5" style={{ borderColor: "var(--store-footer-border)" }}>
              <h2 className="text-2xl font-semibold text-slate-900">Sammanfattning</h2>
              <div className="space-y-2 border-b border-slate-200 pb-3 text-sm">
                <div className="flex justify-between"><span>Delsumma ({cartCount} produkter)</span><span className="font-medium">{formatMinorPrice(subtotalMinor, currency)}</span></div>
                <div className="flex justify-between"><span>Frakt</span><span className="font-medium">{formatMinorPrice(shippingMinor, currency)}</span></div>
                <p className="text-emerald-700">Fri frakt över 499 kr</p>
              </div>

              <div className="space-y-2 border-b border-slate-200 pb-3 text-sm text-slate-600">
                <p>Rabattkod</p>
                <p>Presentkort</p>
              </div>

              <div className="flex items-end justify-between">
                <div><p className="text-sm text-slate-500">Totalt</p><p className="text-xs text-slate-500">inkl. moms</p></div>
                <p className="text-4xl font-semibold text-slate-900">{formatMinorPrice(subtotalMinor + shippingMinor, currency)}</p>
              </div>

              <Link href="/checkout" className="block w-full rounded-md bg-[color:var(--store-accent)] px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:opacity-90">
                TILL KASSAN
              </Link>
              <button className="w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white">KÖP MED G Pay</button>
              <button className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900">KÖP MED Pay</button>
              <p className="text-sm text-emerald-700">Säker betalning · Vi använder krypterad betalning.</p>
            </aside>
          </div>

          <section className="mt-7">
            <h2 className="text-4xl font-semibold text-slate-900">Du kanske också gillar</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recommendationItems.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-xl border border-[#e5dbcf] bg-white shadow-sm">
                  <div className="h-28 bg-gradient-to-br from-[#31271d] via-[#1b1611] to-[#0f0d0b]" />
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">{item.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-semibold text-slate-900">{formatMinorPrice(item.priceMinor, item.currency)}</p>
                      <button className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="mt-6 grid overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "var(--store-footer-border)", background: "var(--store-trust-gradient)" }}
          >
            <article className="flex min-h-[74px] items-center gap-2 border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0 lg:first:border-l-0"><TrustIcon index={0} /><div><p className="text-sm font-semibold">Fri frakt</p><p className="text-xs text-slate-600">Vid köp över 499 kr</p></div></article>
            <article className="flex min-h-[74px] items-center gap-2 border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0"><TrustIcon index={1} /><div><p className="text-sm font-semibold">30 dagars öppet köp</p><p className="text-xs text-slate-600">Enkelt & smidigt</p></div></article>
            <article className="flex min-h-[74px] items-center gap-2 border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0"><TrustIcon index={2} /><div><p className="text-sm font-semibold">Premium kvalitet</p><p className="text-xs text-slate-600">Utvalt med omsorg</p></div></article>
            <article className="flex min-h-[74px] items-center gap-2 border-t border-[#e7ddcf] px-5 py-3 lg:border-l lg:border-t-0"><TrustIcon index={3} /><div><p className="text-sm font-semibold">Säkra betalningar</p><p className="text-xs text-slate-600">Tryggt & säkert</p></div></article>
          </section>
        </div>
      </div>
    </section>
  );
}
