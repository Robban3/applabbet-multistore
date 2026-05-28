"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CartCountBadge } from "@/components/cart-count-badge";
import { formatMinorPrice } from "@/lib/format";
import type { PaymentMethods } from "@/lib/tenant-settings";

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

const CART_KEY = "applabbet_multistore_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/bastsaljare" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

type KassaClientProps = {
  heading?: string;
  subtitle?: string;
  brandName?: string;
  paymentMethods?: PaymentMethods;
  shippingOptions?: Array<{
    id: string;
    name: string;
    carrierName: string | null;
    transitDaysMin: number;
    transitDaysMax: number;
    basePriceMinor: number;
    freeShippingOverMinor: number;
  }>;
};

export function KassaClient({
  heading = "Kassa",
  subtitle = "Snabb, säkert och smidigt.",
  brandName = "APPLABBET",
  paymentMethods = { stripe: true, klarna: false, swish: false },
  shippingOptions = [],
}: KassaClientProps) {
  const [items] = useState<CartItem[]>(() => readCart());
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "klarna" | "swish">(
    paymentMethods.stripe ? "stripe" : paymentMethods.klarna ? "klarna" : "swish",
  );
  const fallbackShipping = [
    {
      id: "fallback-home",
      name: "Hemleverans",
      carrierName: "PostNord",
      transitDaysMin: 1,
      transitDaysMax: 3,
      basePriceMinor: 0,
      freeShippingOverMinor: 0,
    },
  ];
  const availableShippingOptions = shippingOptions.length > 0 ? shippingOptions : fallbackShipping;
  const [shippingMethodId, setShippingMethodId] = useState<string>(availableShippingOptions[0]?.id || "");

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalMinor = useMemo(() => items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0), [items]);
  const selectedShipping = useMemo(
    () => availableShippingOptions.find((option) => option.id === shippingMethodId) || availableShippingOptions[0],
    [availableShippingOptions, shippingMethodId],
  );
  const shippingMinor =
    selectedShipping && totalMinor < selectedShipping.freeShippingOverMinor
      ? selectedShipping.basePriceMinor
      : 0;
  const orderTotalMinor = totalMinor + shippingMinor;
  const currency = items[0]?.currency || "SEK";
  const hasEnabledPaymentMethod = paymentMethods.stripe || paymentMethods.klarna || paymentMethods.swish;

  async function handleCheckout() {
    setError("");
    if (items.length === 0) return setError("Varukorgen är tom.");
    if (!email) return setError("Fyll i e-postadress.");
    if (!firstName || !lastName) return setError("Fyll i namn.");
    if (!hasEnabledPaymentMethod) return setError("Inga betalsätt är aktiverade för butiken.");

    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: `${firstName} ${lastName}`.trim(),
          items,
          delivery: { address, zip, city, phone },
          paymentMethod,
          shippingMethodId: selectedShipping?.id || null,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Kunde inte skapa checkout-session.");
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout misslyckades.");
    } finally {
      setLoading(false);
    }
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

        <div className="grid px-6 py-2 text-white/90 md:grid-cols-4" style={{ background: "var(--store-header-gradient)" }}>
          {["Varukorg", "Leverans", "Betalning", "Bekräftelse"].map((step, idx) => (
            <div key={step} className="flex items-center gap-2 text-sm">
              <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${idx === 1 ? "border-[color:var(--store-accent)] bg-[color:var(--store-accent)] text-black" : "border-white/35 text-white/90"}`}>
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-5">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">{heading}</h1>
          <p className="mt-1 text-slate-600">{subtitle}</p>

          <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_1fr_0.9fr]">
            <section className="space-y-3 rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
              <h2 className="text-lg font-semibold">1 Leveransinformation</h2>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadress" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Förnamn" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Efternamn" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adress" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Postnummer" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stad" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefonnummer" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <div className="space-y-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--store-footer-border)" }}>
                <p className="font-medium">2 Leveranssätt</p>
                {availableShippingOptions.map((option) => {
                  const optionShippingMinor =
                    totalMinor < option.freeShippingOverMinor ? option.basePriceMinor : 0;
                  return (
                    <label key={option.id} className="flex items-start gap-2 rounded-md border border-slate-200 px-2 py-2">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.id}
                        checked={shippingMethodId === option.id}
                        onChange={() => setShippingMethodId(option.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">
                          {option.name}
                          {option.carrierName ? ` · ${option.carrierName}` : ""}
                        </p>
                        <p className="text-slate-600">
                          Leverans inom {option.transitDaysMin}-{option.transitDaysMax} arbetsdagar
                        </p>
                        <p className="text-emerald-700">
                          {optionShippingMinor === 0
                            ? "Fri frakt"
                            : formatMinorPrice(optionShippingMinor, currency)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="space-y-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--store-footer-border)" }}>
                <p className="font-medium">3 Betalningssätt</p>
                <div className="space-y-1">
                  {paymentMethods.stripe ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                      />
                      Stripe (kort / Apple Pay / Google Pay)
                    </label>
                  ) : null}
                  {paymentMethods.klarna ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="klarna"
                        checked={paymentMethod === "klarna"}
                        onChange={() => setPaymentMethod("klarna")}
                      />
                      Klarna
                    </label>
                  ) : null}
                  {paymentMethods.swish ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="swish"
                        checked={paymentMethod === "swish"}
                        onChange={() => setPaymentMethod("swish")}
                      />
                      Swish
                    </label>
                  ) : null}
                </div>
              </div>
              <div className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--store-footer-border)" }}>4 Bekräfta och betala</div>
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
              <h2 className="text-lg font-semibold">Välj leveranssätt</h2>
              {selectedShipping ? (
                <article
                  className="rounded-md border px-3 py-3 text-sm"
                  style={{ borderColor: "var(--store-accent)", background: "color-mix(in srgb, var(--store-accent) 10%, white)" }}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-semibold">
                      {selectedShipping.name}
                      {selectedShipping.carrierName ? ` · ${selectedShipping.carrierName}` : ""}
                    </p>
                    <p className="font-semibold">{formatMinorPrice(shippingMinor, currency)}</p>
                  </div>
                  <p className="text-slate-600">
                    Levereras inom {selectedShipping.transitDaysMin}-{selectedShipping.transitDaysMax} arbetsdagar
                  </p>
                  <p className="text-emerald-700">
                    {shippingMinor === 0 ? "Fri frakt" : "Frakt tillagd i totalen"}
                  </p>
                </article>
              ) : null}
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm" style={{ background: "var(--store-trust-gradient)" }}>
                Trygg leverans · Vi levererar säkert och spårbart med vald fraktkedja
              </div>
              <button onClick={handleCheckout} disabled={loading || items.length === 0} className="w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Skapar checkout..." : "Fortsätt till betalning"}
              </button>
              {error ? <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
            </section>

            <aside className="space-y-3 rounded-xl border bg-white p-4" style={{ borderColor: "var(--store-footer-border)" }}>
              <h2 className="text-xl font-semibold">Din beställning ({cartCount})</h2>
              <div className="space-y-2 border-b border-slate-200 pb-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}::${item.selectedColor || ""}::${item.selectedMaterial || ""}::${item.selectedSize || ""}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.selectedColor || item.selectedMaterial || item.selectedSize ? (
                        <p className="text-xs text-slate-500">
                          {[item.selectedColor ? `Färg: ${item.selectedColor}` : null, item.selectedMaterial ? `Material: ${item.selectedMaterial}` : null, item.selectedSize ? `Storlek: ${item.selectedSize}` : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      <p className="text-slate-500">Antal: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatMinorPrice(item.priceMinor * item.quantity, item.currency)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1 border-b border-slate-200 pb-3 text-sm">
                <div className="flex justify-between"><span>Delsumma</span><span className="font-medium">{formatMinorPrice(totalMinor, currency)}</span></div>
                <div className="flex justify-between"><span>Frakt</span><span className="font-medium">{formatMinorPrice(shippingMinor, currency)}</span></div>
              </div>
              <div className="flex items-end justify-between"><div><p className="text-sm text-slate-500">Totalt</p><p className="text-xs text-slate-500">inkl. moms</p></div><p className="text-4xl font-semibold">{formatMinorPrice(orderTotalMinor, currency)}</p></div>
              <div className="rounded-md px-3 py-2 text-sm" style={{ background: "var(--store-trust-gradient)" }}>Säker betalning · Vi använder krypterad betalning.</div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs">
                <span className="rounded border border-slate-300 py-1">Klarna</span>
                <span className="rounded border border-slate-300 py-1">VISA</span>
                <span className="rounded border border-slate-300 py-1">MC</span>
                <span className="rounded border border-slate-300 py-1">Apple Pay</span>
                <span className="rounded border border-slate-300 py-1">GPay</span>
              </div>
            </aside>
          </div>

          <section className="mt-6 grid overflow-hidden rounded-xl border text-white sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--store-footer-border)", background: "var(--store-header-gradient)" }}>
            <article className="flex min-h-[74px] flex-col justify-center border-t border-white/10 px-5 py-3 lg:border-l lg:border-t-0 lg:first:border-l-0"><p className="text-sm font-semibold text-[color:var(--store-accent)]">Fri frakt över 499 kr</p><p className="text-xs text-white/75">Snabb och spårbar leverans med PostNord.</p></article>
            <article className="flex min-h-[74px] flex-col justify-center border-t border-white/10 px-5 py-3 lg:border-l lg:border-t-0"><p className="text-sm font-semibold text-[color:var(--store-accent)]">30 dagars öppet köp</p><p className="text-xs text-white/75">Enkelt att returnera om du inte är nöjd.</p></article>
            <article className="flex min-h-[74px] flex-col justify-center border-t border-white/10 px-5 py-3 lg:border-l lg:border-t-0"><p className="text-sm font-semibold text-[color:var(--store-accent)]">Premium kvalitet</p><p className="text-xs text-white/75">Noggrant utvalda produkter.</p></article>
            <article className="flex min-h-[74px] flex-col justify-center border-t border-white/10 px-5 py-3 lg:border-l lg:border-t-0"><p className="text-sm font-semibold text-[color:var(--store-accent)]">Säker betalning</p><p className="text-xs text-white/75">Betala tryggt med kort eller Apple Pay.</p></article>
          </section>
        </div>
      </div>
    </section>
  );
}
