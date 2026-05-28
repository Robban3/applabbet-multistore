import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartControl } from "@/components/add-to-cart-control";
import { CartCountBadge } from "@/components/cart-count-badge";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { formatMinorPrice } from "@/lib/format";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { Product } from "@/types/commerce";

const trustBar = [
  { title: "Premium kvalitet", text: "Utvalt med omsorg" },
  { title: "Säkra betalningar", text: "Tryggt & säkert" },
  { title: "Snabb leverans", text: "1-2 arbetsdagar" },
  { title: "Kundtjänst", text: "Vi finns här för dig" },
];

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/products?sort=bestsellers" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

const bullets = [
  "Japanskt quartz-urverk för maximal precision",
  "Safirglas som är reptåligt och hållbart",
  "Vattentät upp till 50 meter",
  "Äkta läderarmband med bekväm passform",
];

const footerHighlights = [
  {
    title: "Hållbarhet i fokus",
    text: "Vi väljer produkter och leverantörer med omtanke om miljön.",
  },
  {
    title: "Nöjda kunder",
    text: "Över 10 000+ kunder som älskar våra produkter.",
  },
  {
    title: "Kundservice i världsklass",
    text: "Vi finns här för dig - snabbt, personligt och engagerat.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function SearchPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20 16.5 16.5" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const definition = getCmsPage("product-detail");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("product-detail", { blocks: fallbackBlocks });

  const { slug } = await params;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();

  if (!tenant) notFound();

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", tenant.id)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) notFound();
  const product = data as Product;
  const { data: relatedData } = await supabase
    .from("products")
    .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", tenant.id)
    .eq("status", "published")
    .neq("id", product.id)
    .limit(5);
  const relatedProducts = (relatedData || []) as Product[];
  const favoriteIds = new Set(await getFavoriteProductIdsForCurrentUser(tenant.id));

  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] border border-[#e3d8cc] bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
          <header className="flex items-center justify-between bg-gradient-to-b from-[#11100d] via-[#12100e] to-[#0e0d0b] px-6 py-3 text-white">
            <p className="text-xs tracking-[0.26em] text-[#c8a164]">{brandName.toUpperCase()}</p>
            <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/90 lg:flex">
              {navItems.map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={idx === 0 ? "border-b border-[#c8a164] pb-1 text-white" : "hover:text-[#c8a164]"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-white/85">
              <Link href="/sok" aria-label="Sök" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" /></svg>
              </Link>
              <Link href="/mina-sidor" aria-label="Konto" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="3.5" /><path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" /></svg>
              </Link>
              <Link href="/cart" aria-label="Varukorg" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" /></svg>
                <CartCountBadge initialCount={2} />
              </Link>
            </div>
          </header>

          <div className="px-6 py-5">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700">Hem</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-slate-700">Klockor</Link>
              <span>/</span>
              <Link href={`/products/${product.slug}`} className="font-medium text-slate-700 hover:text-slate-900">{product.title}</Link>
            </div>

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-3 sm:grid-cols-[5rem_1fr]">
                <div className="flex gap-2 sm:flex-col">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={`thumb-${idx + 1}`} className="h-20 w-20 rounded-xl border border-slate-200 bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b]" />
                  ))}
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 bg-[#161310] text-sm font-semibold text-white">
                    +2
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#30261c] via-[#1b1611] to-[#0f0d0b] p-5 shadow-sm">
                  <span className="inline-flex rounded bg-[#c8a164] px-3 py-1 text-xs font-semibold text-slate-900">BÄSTSÄLJARE</span>
                  <div className="mt-6 h-[26rem] rounded-xl border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,202,138,0.30),transparent_42%)]" />
                  <button className="absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white">
                    <SearchPlusIcon />
                  </button>
                </div>
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h1 className="text-[48px] font-semibold leading-tight tracking-tight text-slate-900">{product.title}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="text-[#b88f50]">★★★★★</span> 4.8 (84 recensioner) · SKU: CE-001-BRG
                </p>

                <div className="mt-3 border-b border-slate-200 pb-4">
                  <p className="text-4xl font-semibold text-slate-900">{formatMinorPrice(product.price_minor, product.currency)}</p>
                  <p className="mt-1 text-xs text-slate-500">inkl. moms</p>
                </div>

                <div className="space-y-2 border-b border-slate-200 py-4 text-sm text-slate-700">
                  <p>{getCmsBlockField(cms.blocks, "productInfo", "trustLine1", "Fri frakt vid köp över 499 kr")}</p>
                  <p>{getCmsBlockField(cms.blocks, "productInfo", "trustLine2", "30 dagars öppet köp")}</p>
                  <p>{getCmsBlockField(cms.blocks, "productInfo", "trustLine3", "2 års garanti")}</p>
                </div>

                <div className="border-b border-slate-200 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Färg: Roséguld / Svart</p>
                  <div className="mt-2 flex gap-2">
                    <button className="h-9 w-9 rounded-full border-2 border-slate-900 bg-[#3c3126]" aria-label="Roséguld/Svart" />
                    <button className="h-9 w-9 rounded-full border border-slate-300 bg-[#6e6f72]" aria-label="Silver" />
                    <button className="h-9 w-9 rounded-full border border-slate-300 bg-[#171717]" aria-label="Svart" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Armband</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded-md border border-[#c8a164] bg-[#f6efe3] px-3 py-1.5 text-sm text-slate-900">Läder</button>
                    <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">Stål</button>
                  </div>
                </div>

                <p className="py-4 text-sm text-emerald-700">I lager · Skickas inom 1-2 arbetsdagar</p>
                <div className="flex items-center gap-3 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Antal</span>
                  <div className="inline-flex items-center rounded-md border border-slate-300">
                    <button className="px-3 py-1.5 text-slate-700">-</button>
                    <span className="border-x border-slate-300 px-4 py-1.5 text-sm">1</span>
                    <button className="px-3 py-1.5 text-slate-700">+</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <AddToCartControl
                    productId={product.id}
                    title={product.title}
                    priceMinor={product.price_minor}
                    currency={product.currency}
                    className="w-full rounded-md bg-[#c8a164] px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#b88f50]"
                    ariaLabel={`Lägg ${product.title} i varukorgen`}
                  >
                    LÄGG I VARUKORG
                  </AddToCartControl>
                  <button className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">KÖP NU</button>
                  <div className="flex justify-center">
                    <FavoriteToggle
                      productId={product.id}
                      initialFavorited={favoriteIds.has(product.id)}
                      label="Lägg till i önskelista"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                      activeClassName="text-rose-600"
                      inactiveClassName="text-slate-700"
                    />
                  </div>
                </div>
              </aside>
            </section>

            <section className="mt-5 grid overflow-hidden rounded-2xl border border-slate-200 bg-[#faf6ef] sm:grid-cols-2 lg:grid-cols-4">
              {trustBar.map((item) => (
                <article key={item.title} className="flex min-h-[74px] flex-col justify-center border-t border-slate-200 bg-white px-4 py-3 first:border-t-0 lg:min-h-[84px] lg:border-l lg:border-t-0 lg:first:border-l-0">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.text}</p>
                </article>
              ))}
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-wrap gap-5 border-b border-slate-200 px-5 py-3 text-sm">
                <p className="border-b-2 border-slate-900 pb-1 font-semibold text-slate-900">BESKRIVNING</p>
                <p className="text-slate-500">SPECIFIKATIONER</p>
                <p className="text-slate-500">LEVERANS & RETURER</p>
                <p className="text-slate-500">RECENSIONER (84)</p>
              </div>
              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  <h2 className="text-4xl font-semibold text-slate-900">Tidlös design. Exakt precision.</h2>
                  <p className="mt-3 text-sm text-slate-700">
                    {product.title} är en exklusiv klocka skapad för dig som värdesätter kvalitet, stil
                    och funktion i varje detalj.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-72 rounded-xl border border-slate-200 bg-gradient-to-br from-[#32271d] via-[#1a1510] to-[#0f0d0b]" />
              </div>
            </section>

            <section className="mt-7">
              <h2 className="text-4xl font-semibold text-slate-900">Du kanske också gillar</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="overflow-hidden rounded-xl border border-[#e5dbcf] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-[#31271d] via-[#1b1611] to-[#0f0d0b]">
                      <FavoriteToggle
                        productId={item.id}
                        initialFavorited={favoriteIds.has(item.id)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                      />
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm font-medium text-slate-800">{formatMinorPrice(item.price_minor, item.currency)}</p>
                      <p className="text-xs text-[#b88f50]">★★★★★ <span className="text-slate-500">(120)</span></p>
                    </div>
                  </Link>
                ))}
                {relatedProducts.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Fler produkter kommer snart.
                  </p>
                ) : null}
              </div>
            </section>

            <section className="mt-6 rounded-xl bg-[#11100d] px-5 py-4 text-white">
              <div className="grid gap-4 md:grid-cols-3">
                {footerHighlights.map((item) => (
                  <article key={item.title}>
                    <p className="text-sm font-semibold text-[#c8a164]">{item.title}</p>
                    <p className="text-xs text-white/75">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
