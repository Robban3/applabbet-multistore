import Link from "next/link";
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

const navItems = [
  { label: "Hem", href: "/" },
  { label: "Kategorier", href: "/products" },
  { label: "Nyheter", href: "/nyheter" },
  { label: "Bästsäljare", href: "/products?sort=bestsellers" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
];

const categoryCards = [
  { title: "Ljud & Hörlurar", accent: "from-[#2f251b]" },
  { title: "Klockor", accent: "from-[#332820]" },
  { title: "Hem & Inredning", accent: "from-[#3b2f24]" },
  { title: "Väskor", accent: "from-[#2b2118]" },
  { title: "Parfymer", accent: "from-[#241d18]" },
  { title: "Accessoarer", accent: "from-[#3a2e22]" },
];

type HomeTrustCard = {
  title: string;
  text: string;
  icon: "star" | "shield" | "truck" | "headset";
};

const trustCards: HomeTrustCard[] = [
  { title: "Premium kvalitet", text: "Utvalt med omsorg", icon: "star" },
  { title: "Säkra betalningar", text: "Tryggt & säkert", icon: "shield" },
  { title: "Snabb leverans", text: "1-2 arbetsdagar", icon: "truck" },
  { title: "Kundtjänst", text: "Vi finns här för dig", icon: "headset" },
];

const brandLogos = ["SONY", "BOSE", "dyson", "GARMIN", "SAMSUNG", "APPLE", "PHILIPS"];

const valueCards = [
  {
    title: "Hållbarhet i fokus",
    text: "Vi väljer produkter och leverantörer med omtanke om miljön.",
  },
  {
    title: "Kundservice i världsklass",
    text: "Vi finns här för dig - snabbt, personligt och engagerat.",
  },
  {
    title: "Nöjda kunder",
    text: "Över 10 000+ kunder älskar våra produkter.",
  },
];

const fallbackProducts = [
  { title: "Premium Hörlurar Pro", priceMinor: 199900, currency: "SEK" },
  { title: "Chrono Elite Klocka", priceMinor: 249900, currency: "SEK" },
  { title: "Nordic Bordslampa", priceMinor: 89900, currency: "SEK" },
  { title: "Noir Intense Eau de Parfum", priceMinor: 74900, currency: "SEK" },
  { title: "Aviator Solglasögon", priceMinor: 59900, currency: "SEK" },
  { title: "Urban Läderväska", priceMinor: 159900, currency: "SEK" },
];

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TrustCardIcon({ icon }: { icon: HomeTrustCard["icon"] }) {
  if (icon === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3.8 14.8 9l5.7.9-4 4.2.9 5.7L12 17.1l-5.4 2.7.9-5.7-4-4.2L9.2 9 12 3.8Z" />
      </svg>
    );
  }
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
        <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
      </svg>
    );
  }
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.7" />
        <circle cx="17" cy="18" r="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#b88f50]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

function ValueCardIcon({ title }: { title: string }) {
  if (title === "Hållbarhet i fokus") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3v18" />
        <path d="M5 10c3 0 4-2 7-2s4 2 7 2" />
      </svg>
    );
  }
  if (title === "Kundservice i världsklass") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-5h4" />
        <path d="M4 13h4v5H6a2 2 0 0 1-2-2v-3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  );
}

function MiniCartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
    </svg>
  );
}

export default async function Home() {
  const definition = getCmsPage("home");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("home", { blocks: fallbackBlocks });
  const homeTrustCards: HomeTrustCard[] = trustCards.map((fallback, index) => {
    const cardNumber = index + 1;
    const iconValue = getCmsBlockField(cms.blocks, "trustCards", `card${cardNumber}Icon`, fallback.icon);
    const safeIcon: HomeTrustCard["icon"] =
      iconValue === "star" || iconValue === "shield" || iconValue === "truck" || iconValue === "headset"
        ? iconValue
        : fallback.icon;
    return {
      title: getCmsBlockField(cms.blocks, "trustCards", `card${cardNumber}Title`, fallback.title),
      text: getCmsBlockField(cms.blocks, "trustCards", `card${cardNumber}Text`, fallback.text),
      icon: safeIcon,
    };
  });

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();

  let featuredProducts: Product[] = [];
  let favoriteIds = new Set<string>();
  if (tenant) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("products")
      .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status")
      .eq("tenant_id", tenant.id)
      .eq("status", "published")
      .limit(8);
    featuredProducts = (data || []) as Product[];
    favoriteIds = new Set(await getFavoriteProductIdsForCurrentUser(tenant.id));
  }

  const bestSellers = (featuredProducts.length > 0 ? featuredProducts : fallbackProducts).slice(0, 6);

  return (
    <main className="flex-1 bg-[#f6f3ee] py-3 text-slate-900">
      <div className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[20px] border border-[#e6ddcf] bg-[#f6f3ee] shadow-[0_6px_24px_rgba(21,17,12,0.06)]">
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div className="overflow-hidden rounded-[18px] bg-gradient-to-b from-[#11100d] via-[#12100e] to-[#0e0d0b] text-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-[0.26em] text-[#c8a164]">{brandName.toUpperCase()}</span>
              <span className="text-[10px] text-white/60">{tenant?.name || "PREMIUM STORE"}</span>
            </div>
            <nav className="hidden items-center gap-7 text-[13px] font-medium text-white/90 lg:flex">
              {navItems.map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition hover:text-[#c8a164] ${idx === 0 ? "border-b border-[#c8a164] pb-1 text-white" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-white/85">
              <Link
                href="/sok"
                aria-label="Sök"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20L16.65 16.65" />
                </svg>
              </Link>
              <Link
                href="/mina-sidor"
                aria-label="Konto"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4 20C5.8 16.8 8.6 15.2 12 15.2C15.4 15.2 18.2 16.8 20 20" />
                </svg>
              </Link>
              <Link
                href="/cart"
                aria-label="Varukorg"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="17" cy="20" r="1.5" />
                  <path d="M3 4H5L7.2 15H18.2L20.5 7.5H6.3" />
                </svg>
                <CartCountBadge initialCount={2} />
              </Link>
            </div>
          </header>

          <div className="grid gap-6 px-6 py-9 lg:grid-cols-[1fr_1.12fr] lg:px-10">
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c8a164]">
                Premium kvalitet. Utvalt med omsorg.
              </p>
              <h1 className="mt-3 text-[62px] font-semibold leading-[0.98]">
                {getCmsBlockField(cms.blocks, "hero", "title", "Upplev kvalitet. Varje dag.")}
              </h1>
              <p className="mt-4 max-w-[430px] text-[22px] text-white/80">
                {getCmsBlockField(
                  cms.blocks,
                  "hero",
                  "description",
                  "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={getCmsBlockField(cms.blocks, "hero", "primaryCtaHref", "/products")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a164] px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-[#b88f50]"
                >
                  {getCmsBlockField(cms.blocks, "hero", "primaryCtaLabel", "Shoppa nu")}
                  <ArrowRightIcon />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Utforska kollektioner
                </Link>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[16px] border border-white/20 bg-[radial-gradient(circle_at_28%_34%,#7b5a37_0%,#362819_35%,#17120e_100%)]">
              <div className="absolute -right-8 top-6 h-56 w-56 rounded-full border-[24px] border-[#cfaa7a]/90" />
              <div className="absolute right-24 top-24 h-40 w-40 rounded-full border-[16px] border-[#e3c39a]/85" />
              <div className="absolute left-12 top-24 h-36 w-36 rounded-full border-[14px] border-[#d4b084]/65 opacity-70" />
              <div className="absolute -bottom-7 left-12 h-16 w-[420px] rounded-full bg-black/55 blur-md" />
            </div>
          </div>
        </div>
        <div className="relative z-20 -mt-7 px-4 pb-1 sm:px-6">
          <div className="grid overflow-hidden rounded-xl border border-[#e6ddcf] bg-[#f6f0e9] shadow-[0_8px_20px_rgba(21,17,12,0.14)] sm:grid-cols-2 lg:grid-cols-4">
            {homeTrustCards.map((card) => (
              <article
                key={card.title}
                className="flex min-h-[88px] items-center gap-3 border-t border-[#e7ddcf] px-5 py-3 lg:min-h-[96px] lg:border-l lg:border-t-0 lg:first:border-l-0"
              >
                <TrustCardIcon icon={card.icon} />
                <div>
                  <p className="text-[15px] font-semibold">{card.title}</p>
                  <p className="text-[13px] text-slate-600">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-5">
        <h2 className="text-center text-[44px] font-semibold leading-none">Upptäck våra kategorier</h2>
        <div className="mx-auto mt-4 mb-6 h-[2px] w-24 rounded-full bg-[#c8a164]" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {categoryCards.map((category) => (
            <Link
              key={category.title}
              href="/products"
              className={`group relative block overflow-hidden rounded-[14px] border border-[#d8cec2] bg-gradient-to-br ${category.accent} via-[#211912] to-[#130f0b] p-4 text-white shadow-sm`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,194,123,0.35),transparent_45%)] opacity-70" />
              <p className="relative mt-24 text-lg font-semibold">{category.title}</p>
              <span className="relative mt-2 inline-flex text-sm text-white/90">
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[42px] font-semibold leading-none">Bästsäljare</h2>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            Visa alla
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {bestSellers.map((product, idx) => {
            const title = "title" in product ? product.title : "";
            const priceMinor = "price_minor" in product ? product.price_minor : product.priceMinor;
            const currency = "currency" in product ? product.currency : "SEK";
            const productHref = "slug" in product ? `/products/${product.slug}` : "/products";

            return (
              <article
                key={"id" in product ? product.id : `${title}-${idx}`}
                className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[#ddd4c8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={productHref} className="block">
                  <div className="relative h-44 bg-gradient-to-br from-[#31271d] via-[#1b1611] to-[#0f0d0b]">
                    {"id" in product ? (
                      <FavoriteToggle
                        productId={product.id}
                        initialFavorited={favoriteIds.has(product.id)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                      />
                    ) : null}
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded bg-[#c8a164] px-2 py-0.5 text-[10px] font-bold text-slate-900">
                        BÄSTSÄLJARE
                      </span>
                    ) : null}
                    {idx === 1 ? (
                      <span className="absolute left-2 top-2 rounded bg-[#0f1114] px-2 py-0.5 text-[10px] font-bold text-white">
                        NYHET
                      </span>
                    ) : null}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col space-y-1 p-2.5">
                  <Link href={productHref} className="block">
                    <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">{title}</h3>
                  </Link>
                  <p className="text-[22px] font-semibold leading-tight text-slate-900">
                    {formatMinorPrice(priceMinor, currency)}
                  </p>
                  <p className="text-xs text-[#b88f50]">★★★★★ <span className="text-slate-500">(120)</span></p>
                  {"id" in product ? (
                    <AddToCartControl
                      productId={product.id}
                      title={product.title}
                      priceMinor={product.price_minor}
                      currency={product.currency}
                      className="mt-auto inline-flex h-9 w-9 self-end items-center justify-center rounded-full bg-black text-white shadow-sm transition hover:bg-slate-800"
                      ariaLabel={`Lägg ${product.title} i varukorgen`}
                    >
                      <MiniCartIcon />
                    </AddToCartControl>
                  ) : (
                    <span className="mt-auto inline-flex h-9 w-9 self-end items-center justify-center rounded-full border border-slate-300 text-slate-600">
                      <MiniCartIcon />
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
        <div className="rounded-[14px] bg-[#0f0f0f] px-6 py-6 text-white shadow-lg">
          <p className="mb-4 text-center text-sm text-white/70">Betrodd av tusentals nöjda kunder</p>
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 lg:grid-cols-7">
            {brandLogos.map((brand) => (
              <p key={brand} className="text-2xl tracking-[0.12em] text-white/85">
                {brand}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-5">
        <div className="grid gap-4 rounded-[14px] bg-[#f5eee4] p-5 sm:grid-cols-3">
          {valueCards.map((card) => (
            <article key={card.title} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm text-slate-600">
                <ValueCardIcon title={card.title} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}
