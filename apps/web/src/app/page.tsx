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
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import { ClassicBrands } from "@/components/storefront/classic/classic-brands";
import type { Product } from "@/types/commerce";













type HomeTrustCard = {
  title: string;
  text: string;
  icon: "star" | "shield" | "truck" | "headset";
};













const beautyPromoCards = [
  {
    title: "Nya dofter",
    text: "Upptäck säsongens senaste tillskott",
    cta: "Shoppa nu",
  },
  {
    title: "Medlem & spara",
    text: "Bli medlem i vår kundklubb",
    cta: "Bli medlem",
  },
  {
    title: "Beauty guides",
    text: "Tips, guider och inspiration",
    cta: "Läs mer",
  },
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
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3.8 14.8 9l5.7.9-4 4.2.9 5.7L12 17.1l-5.4 2.7.9-5.7-4-4.2L9.2 9 12 3.8Z" />
      </svg>
    );
  }
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l7 3v6c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6l7-3Z" />
        <path d="m9.5 12.5 1.7 1.7 3.5-3.8" />
      </svg>
    );
  }
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.7" />
        <circle cx="17" cy="18" r="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--store-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="4" y="12" width="4" height="7" rx="1.5" />
      <rect x="16" y="12" width="4" height="7" rx="1.5" />
    </svg>
  );
}

function ValueCardIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3v18" />
        <path d="M5 10c3 0 4-2 7-2s4 2 7 2" />
      </svg>
    );
  }
  if (index === 1) {
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
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const storefrontConfig = getStorefrontConfig(themeKey);
  const isSport = themeKey === "sport";
  const isFashion = themeKey === "fashion";
  const isBeauty = themeKey === "beauty";
  const isElectronics = themeKey === "electronics";
  const isMinimal = themeKey === "minimal";
  const enforceThemePreset = themeKey !== "classic";
  const readHomeField = (blockKey: string, fieldKey: string, fallback: string) =>
    enforceThemePreset ? fallback : getCmsBlockField(cms.blocks, blockKey, fieldKey, fallback);
  const navFallback = storefrontConfig.navItems;
  const categoryFallback = storefrontConfig.categoryCards;
  const trustFallback = storefrontConfig.trustCards;
  const brandLogosFallback = storefrontConfig.brandLogos;
  const valueCardsFallback = storefrontConfig.valueCards;
  const productsFallback = storefrontConfig.products;

  const navItems = navFallback.map((item, index) => {
    const itemNumber = index + 1;
    const label = readHomeField("navigation", `item${itemNumber}Label`, item.label).trim() || item.label;
    const href = readHomeField("navigation", `item${itemNumber}Href`, item.href).trim() || item.href;
    return { label, href };
  });
  const categoryCards = categoryFallback.map((item, index) => {
    const itemNumber = index + 1;
    return {
      ...item,
      title: readHomeField("categories", `item${itemNumber}Title`, item.title),
    };
  });
  const homeTrustCards: HomeTrustCard[] = trustFallback.map((fallback, index) => {
    const cardNumber = index + 1;
    const iconValue = readHomeField("trustCards", `card${cardNumber}Icon`, fallback.icon);
    const safeIcon: HomeTrustCard["icon"] =
      iconValue === "star" || iconValue === "shield" || iconValue === "truck" || iconValue === "headset"
        ? iconValue
        : fallback.icon;
    return {
      title: readHomeField("trustCards", `card${cardNumber}Title`, fallback.title),
      text: readHomeField("trustCards", `card${cardNumber}Text`, fallback.text),
      icon: safeIcon,
    };
  });
  const brandLogos = brandLogosFallback
    .map((brand, index) => readHomeField("brands", `brand${index + 1}`, brand).trim())
    .filter((brand) => brand.length > 0);
  const valueCards = valueCardsFallback.map((card, index) => {
    const cardNumber = index + 1;
    return {
      title: readHomeField("valueCards", `card${cardNumber}Title`, card.title),
      text: readHomeField("valueCards", `card${cardNumber}Text`, card.text),
    };
  });
  const heroEyebrow = readHomeField(
    "hero",
    "eyebrow",
    isSport
      ? "Prestera. Varje dag."
      : isFashion
        ? "Premium mode. Tidlös stil."
        : isBeauty
          ? "Skönhet. Självkänsla. Du."
        : isElectronics
          ? "Teknik. Kvalitet. Innovation."
        : isMinimal
          ? "Enkelt. Rent. Funktionellt."
        : "Premium kvalitet. Utvalt med omsorg.",
  );
  const heroImageUrlCms = getCmsBlockField(cms.blocks, "hero", "imageUrl", "").trim();
  const heroImageUrl = heroImageUrlCms || (isBeauty ? "/images/hero-skonhet.png" : "");
  const heroContentPositionRaw = readHomeField("hero", "contentPosition", "left").trim().toLowerCase();
  const heroContentPosition = heroContentPositionRaw === "right" ? "right" : "left";
  const isHeroContentRight = heroContentPosition === "right";
  const useHeroImageBackground = heroImageUrl.length > 0;
  const primaryCtaHref = readHomeField("hero", "primaryCtaHref", "/products").trim();
  const primaryCtaLabel = readHomeField(
    "hero",
    "primaryCtaLabel",
    "Shoppa nu",
  ).trim();
  const showPrimaryCta = primaryCtaHref.length > 0 && primaryCtaLabel.length > 0;
  const secondaryCtaHref = readHomeField("hero", "secondaryCtaHref", "/products").trim();
  const secondaryCtaLabel = readHomeField(
    "hero",
    "secondaryCtaLabel",
    isSport
      ? "Utforska nyheter"
      : isFashion
        ? "Utforska kollektioner"
        : isBeauty
          ? "Se nyheter"
          : isElectronics
            ? "Se alla erbjudanden"
            : isMinimal
              ? "Se nyheter"
            : "Utforska kollektioner",
  ).trim();
  const showSecondaryCta = secondaryCtaHref.length > 0 && secondaryCtaLabel.length > 0;
  const categoriesSectionTitle = readHomeField(
    "categories",
    "sectionTitle",
    isSport
      ? "KATEGORIER"
      : isFashion
        ? "Upptäck våra kollektioner"
        : isBeauty
          ? "SHOPPA KATEGORI"
          : isElectronics
            ? "Shoppa kategori"
          : isMinimal
            ? "Kategorier"
          : "Upptäck våra kategorier",
  );
  const bestSellersTitle = readHomeField(
    "bestSellers",
    "sectionTitle",
    isBeauty ? "VÅRA BÄSTSÄLJARE" : isSport ? "BÄSTSÄLJARE" : "Bästsäljare",
  );
  const bestSellersViewAllLabel = readHomeField(
    "bestSellers",
    "viewAllLabel",
    isBeauty ? "VISA ALLA" : "Visa alla",
  );
  const bestSellerBadge = readHomeField("bestSellers", "badgeBestSeller", "BÄSTSÄLJARE");
  const newBadge = readHomeField("bestSellers", "badgeNew", "NYHET");
  const ratingCount = readHomeField("bestSellers", "ratingCount", "(120)");
  const brandsTitle = readHomeField(
    "brands",
    "title",
    isSport
      ? "Vi jobbar med världens ledande varumärken"
      : isFashion
        ? "Betrodd av tusentals nöjda kunder"
        : isBeauty
          ? "Våra populära varumärken"
        : isElectronics
          ? "Våra populära varumärken"
        : isMinimal
          ? "Utvalda varumärken"
        : "Betrodd av tusentals nöjda kunder",
  );

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

  const bestSellers = (featuredProducts.length > 0 ? featuredProducts : productsFallback).slice(0, 6);
  const electronicsTopUtilityItems = [
    "Fri frakt över 499 kr",
    "30 dagars öppet köp",
    "Snabba leveranser 1-2 arbetsdagar",
  ];
  const sportTopUtilityItems = [
    "FRI FRAKT OVER 499 KR",
    "30 DAGARS OPPET KOP",
    "SNABBA LEVERANSER",
  ];
  const electronicsTrustStrip = [
    { title: "Fri frakt", text: "Över 499 kr" },
    { title: "30 dagars öppet köp", text: "Enkelt & smidigt" },
    { title: "Snabba leveranser", text: "1-2 arbetsdagar" },
    { title: "Säkra betalningar", text: "Klarna, Swish & kort" },
    { title: "Expertkunskap", text: "Vi hjälper dig rätt" },
  ];

  const displayedCategoryCards = isBeauty || isSport ? categoryCards.slice(0, 5) : categoryCards;

  return (
    <main
      className="flex-1 py-3 text-slate-900"
      style={{ background: isBeauty ? "#fff8fb" : "var(--store-footer-bg)" }}
    >
      <div
        className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[20px] border shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
        style={{ borderColor: "var(--store-footer-border)", background: "var(--store-footer-bg)" }}
      >
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] text-white shadow-2xl"
          style={{
            background: useHeroImageBackground
              ? `url('${heroImageUrl}') center/cover no-repeat`
              : "var(--store-header-gradient)",
          }}
        >
          {isSport ? (
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0b0b0d] px-5 py-2 text-[10px] font-semibold text-white/80">
              {sportTopUtilityItems.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-3">
                  {item}
                  {index < sportTopUtilityItems.length - 1 ? <span className="text-white/35">|</span> : null}
                </span>
              ))}
            </div>
          ) : isBeauty ? (
            <div className="flex flex-wrap items-center gap-3 border-b border-[#efd6e0] bg-[#f7dbe5] px-5 py-2 text-[10px] font-semibold text-slate-700">
              <span>FRI FRAKT OVER 499 KR</span>
              <span className="text-slate-400">|</span>
              <span>30 DAGARS OPPET KOP</span>
              <span className="text-slate-400">|</span>
              <span>CLEAN BEAUTY</span>
              <span className="text-slate-400">|</span>
              <span>SAKRA BETALNINGAR</span>
            </div>
          ) : isElectronics ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-2 text-[11px] text-white/75">
              <div className="flex flex-wrap items-center gap-4">
                {electronicsTopUtilityItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <span>Kundservice</span>
                <span>Butiker</span>
              </div>
            </div>
          ) : null}
          <header className="relative flex items-center justify-between border-b border-white/10 bg-[#0b0b0d] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-[0.26em] text-[color:var(--store-accent)]">{brandName.toUpperCase()}</span>
              <span className="text-[10px] text-white/60">{tenant?.name || "PREMIUM STORE"}</span>
            </div>
            {isElectronics ? (
              <form method="GET" action="/sok" className="hidden flex-1 px-6 xl:block">
                <div
                  className="flex items-center rounded-md border border-white/20 px-3 py-2"
                  style={{ background: "var(--store-header-overlay-surface)" }}
                >
                  <input
                    name="q"
                    placeholder="Sök produkt, kategori eller varumärke..."
                    className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/45 focus:outline-none"
                  />
                  <button type="submit" aria-label="Sök">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20L16.65 16.65" />
                    </svg>
                  </button>
                </div>
              </form>
            ) : null}
            <nav className={`hidden items-center gap-7 text-[13px] font-medium text-white/90 ${isElectronics ? "xl:hidden" : "xl:flex"}`}>
              {navItems.map((item, idx) => (
                <Link
                  key={`${item.href}-${item.label}-${idx}`}
                  href={item.href}
                  className={`transition hover:text-[color:var(--store-accent)] ${idx === 0 ? "border-b border-[color:var(--store-accent)] pb-1 text-white" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-white/85">
              <details className="relative xl:hidden">
                <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </summary>
                <div
                  className="fixed inset-x-3 top-16 z-[120] max-h-[70vh] overflow-auto rounded-lg border border-white/15 p-2 shadow-xl sm:inset-x-auto sm:right-4 sm:min-w-[260px]"
                  style={{ background: "var(--store-header-overlay-surface)" }}
                >
                  {navItems.map((item, idx) => (
                    <Link
                      key={`mobile-${item.href}-${item.label}-${idx}`}
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm ${
                        idx === 0 ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
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
          {isElectronics ? (
            <nav className="hidden items-center gap-6 border-b border-white/10 bg-[#0b0b0d] px-5 py-2.5 text-[13px] font-medium text-white/85 xl:flex">
              {navItems.map((item, idx) => (
                <Link
                  key={`electronics-nav-${item.href}-${item.label}-${idx}`}
                  href={item.href}
                  className={`transition hover:text-[color:var(--store-accent)] ${
                    idx === navItems.length - 1 ? "text-[color:var(--store-accent)]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <div
            className={`relative z-10 px-6 ${isElectronics ? "py-7 min-h-[460px]" : isBeauty ? "py-10 min-h-[520px]" : "py-8 min-h-[480px]"} lg:px-10`}
          >
            <div className={`flex ${isHeroContentRight ? "justify-end" : "justify-start"}`}>
              <div className="flex max-w-[560px] flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--store-accent)]">
                {heroEyebrow}
              </p>
              <h1 className={`mt-3 text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-[62px] lg:leading-[0.98] ${isBeauty ? "text-slate-900" : ""}`}>
                {readHomeField(
                  "hero",
                  "title",
                  isSport
                    ? "Din träning.\nDin styrka."
                    : isFashion
                      ? "Klä dig med\nsjälvförtroende."
                      : isBeauty
                        ? "Lyft din naturliga\nskönhet"
                      : isElectronics
                        ? "Teknik för\nvarje dag"
                      : isMinimal
                        ? "Det viktigaste\nutan brus"
                      : "Upplev kvalitet. Varje dag.",
                )}
              </h1>
              <p className={`mt-4 max-w-[430px] text-lg sm:text-xl lg:text-[22px] ${isBeauty ? "text-slate-900" : "text-white/80"}`}>
                {readHomeField(
                  "hero",
                  "description",
                  isSport
                    ? "Utrustning, kläder och skor som hjälper dig att nå dina mål - oavsett nivå."
                    : isFashion
                      ? "Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil - för alla tillfällen."
                      : isBeauty
                        ? "Upptäck vårt handplockade sortiment av hudvård, smink och dofter - noggrant utvalt för att framhäva det bästa i dig."
                      : isElectronics
                        ? "Upptäck de senaste produkterna inom elektronik. Kvalitet, prestanda och design i perfekt kombination."
                      : isMinimal
                        ? "Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet."
                      : "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {showPrimaryCta ? (
                  <Link
                    href={primaryCtaHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a1a1f]"
                  >
                    {primaryCtaLabel}
                    <ArrowRightIcon />
                  </Link>
                ) : null}
                {showSecondaryCta ? (
                  <Link
                    href={secondaryCtaHref}
                    className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                      isBeauty
                        ? "border border-white/60 bg-white text-slate-900 hover:bg-[#fff4f8]"
                        : "border border-white/35 text-white hover:border-white hover:bg-white/10"
                    }`}
                  >
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className={`relative z-20 px-4 pb-1 sm:px-6 ${isElectronics ? "-mt-4" : isBeauty ? "-mt-5" : "-mt-7"}`}>
          <div
            className={`grid overflow-hidden rounded-xl border shadow-[0_8px_20px_rgba(21,17,12,0.14)] sm:grid-cols-2 ${
              isElectronics ? "lg:grid-cols-5" : "lg:grid-cols-4"
            }`}
            style={{
              borderColor: isBeauty ? "#efd9e2" : isSport ? "#d7decd" : "var(--store-card-border)",
              background: isBeauty ? "#ffffff" : isSport ? "#ffffff" : "var(--store-soft-surface)",
            }}
          >
            {(isElectronics ? electronicsTrustStrip : homeTrustCards).map((card) => (
              <article
                key={card.title}
                className="flex min-h-[88px] items-center gap-3 border-t px-5 py-3 lg:min-h-[96px] lg:border-l lg:border-t-0 lg:first:border-l-0"
                style={{ borderColor: isBeauty ? "#f1e3ea" : isSport ? "#e3e8dc" : "var(--store-footer-border)" }}
              >
                {"icon" in card ? <TrustCardIcon icon={card.icon} /> : <span className="h-3 w-3 rounded-full bg-[color:var(--store-accent)]" />}
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
        <h2 className={`${isElectronics ? "text-left text-2xl lg:text-3xl" : isBeauty ? "text-center text-[46px] sm:text-[52px]" : "text-center text-3xl sm:text-4xl lg:text-[44px]"} font-semibold leading-none`}>
          {categoriesSectionTitle}
        </h2>
        <div className={`${isElectronics ? "mt-3 mb-4" : "mx-auto mt-4 mb-6"} h-[2px] w-24 rounded-full bg-[color:var(--store-accent)]`} />
        <div className={`grid gap-3 sm:grid-cols-2 ${isElectronics ? "lg:grid-cols-8" : isBeauty ? "lg:grid-cols-5" : isSport ? "lg:grid-cols-5" : "lg:grid-cols-6"}`}>
          {displayedCategoryCards.map((category) => (
            <Link
              key={category.title}
              href="/products"
                className={`group relative block overflow-hidden rounded-[14px] border p-4 shadow-sm ${
                isElectronics
                  ? "border-[#d6e4fb] bg-white text-slate-900"
                  : isBeauty
                    ? "border-[#ecd4dd] bg-[#fff5f8] text-slate-900"
                  : isSport
                    ? "border-[#cad7be] bg-gradient-to-br from-[#28382d] via-[#1a251e] to-[#0e1511] text-white"
                  : `border-[#d8cec2] bg-gradient-to-br ${category.accent} via-[#211912] to-[#130f0b] text-white`
              }`}
            >
              {isElectronics || isBeauty ? (
                <>
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md ${isBeauty ? "bg-[#f8e6ee]" : "bg-[color:var(--store-soft-surface)]"}`}>
                    <span className="h-4 w-4 rounded-full bg-[color:var(--store-accent)]" />
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold">{category.title.toUpperCase()}</p>
                  {isBeauty ? <p className="mt-1 text-xs text-slate-600">Se alla produkter</p> : null}
                </>
              ) : isSport ? (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(190,255,41,0.16),transparent_45%)] opacity-85" />
                  <p className="relative mt-24 text-lg font-semibold">{category.title.toUpperCase()}</p>
                  <p className="relative mt-1 text-xs text-white/80">Se hela sortimentet</p>
                  <span className="relative mt-2 inline-flex text-sm text-[#d0ff43]">
                    <ArrowRightIcon />
                  </span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,194,123,0.35),transparent_45%)] opacity-70" />
                  <p className="relative mt-24 text-lg font-semibold">{category.title}</p>
                  <span className="relative mt-2 inline-flex text-sm text-white/90">
                    <ArrowRightIcon />
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl font-semibold leading-none sm:text-4xl lg:text-[42px]">{bestSellersTitle}</h2>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            {bestSellersViewAllLabel}
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
                className="group flex h-full flex-col overflow-hidden rounded-[14px] border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: "var(--store-card-border)" }}
              >
                <Link href={productHref} className="block">
                  <div className="relative h-44 bg-[image:var(--store-media-gradient)]">
                    {"id" in product ? (
                      <FavoriteToggle
                        productId={product.id}
                        initialFavorited={favoriteIds.has(product.id)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                      />
                    ) : null}
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded bg-[color:var(--store-accent)] px-2 py-0.5 text-[10px] font-bold text-slate-900">
                        {bestSellerBadge}
                      </span>
                    ) : null}
                    {idx === 1 ? (
                      <span className="absolute left-2 top-2 rounded bg-[color:var(--store-footer-surface)] px-2 py-0.5 text-[10px] font-bold text-white">
                        {newBadge}
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
                  <p className="text-xs text-[color:var(--store-accent)]">★★★★★ <span className="text-slate-500">{ratingCount}</span></p>
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

      {isBeauty ? (
        <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
          <div className="grid gap-3 md:grid-cols-3">
            {beautyPromoCards.map((card, index) => (
              <article
                key={`${card.title}-${index}`}
                className="rounded-[14px] border border-[#ecd4dd] bg-gradient-to-br from-[#fff5f8] to-[#f8e8ef] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a16f84]">{card.title}</p>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {card.cta}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {themeKey === "classic" ? (
        <ClassicBrands title={brandsTitle} brands={brandLogos} />
      ) : (
        <section className="mx-auto w-full max-w-[1380px] px-4 pb-8 sm:px-5">
          <div
            className="rounded-[14px] border px-6 py-6 shadow-lg"
            style={{
              background: isBeauty ? "#fff5f8" : isSport ? "#0b0d0b" : "var(--store-footer-surface)",
              borderColor: isBeauty ? "#ecd4dd" : isSport ? "#1c251d" : "transparent",
              color: isBeauty ? "#0f172a" : "white",
            }}
          >
            <p className={`mb-4 text-center text-sm ${isBeauty ? "text-slate-700" : "text-white/70"}`}>{brandsTitle}</p>
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 lg:grid-cols-7">
              {brandLogos.map((brand) => (
                <p key={brand} className={`text-2xl tracking-[0.12em] ${isBeauty ? "text-slate-800" : "text-white/85"}`}>
                  {brand}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1380px] px-4 pb-10 sm:px-5">
        <div
          className="grid gap-4 rounded-[14px] p-5 sm:grid-cols-3"
          style={{ background: isSport ? "#d8ef77" : "var(--store-soft-surface)" }}
        >
          {valueCards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-sm ${isSport ? "bg-[#e5f59a]" : "bg-white"}`}
            >
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  isSport ? "border-[#9db92d] text-slate-900" : "border-slate-300 text-slate-600"
                }`}
              >
                <ValueCardIcon index={index} />
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
