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
import { getStorefrontConfig, getThemeHeroImage } from "@/lib/storefront/resolve-storefront-config";
import { ClassicBrands } from "@/components/storefront/classic/classic-brands";
import { ClassicValueCards } from "@/components/storefront/classic/classic-value-cards";
import { ClassicBestSellers } from "@/components/storefront/classic/classic-best-sellers";
import { ClassicCategoryGrid } from "@/components/storefront/classic/classic-category-grid";
import { ClassicHeader } from "@/components/storefront/classic/classic-header";
import type { Product } from "@/types/commerce";
import { ClassicHero } from "@/components/storefront/classic/classic-hero";
import { GenericHeroSection } from "@/components/storefront/generic-hero-section";
import { GenericCategorySection } from "@/components/storefront/generic-category-section";
import { GenericBrandsSection } from "@/components/storefront/generic-brands-section";
import { GenericValueCardsSection } from "@/components/storefront/generic-value-cards-section";
import { ClassicTrustStrip } from "@/components/storefront/classic/classic-trust-strip";
import { LuxuryHeader } from "@/components/storefront/luxury/luxury-header";
import { LuxuryHero } from "@/components/storefront/luxury/luxury-hero";
import { LuxuryTrustStrip } from "@/components/storefront/luxury/luxury-trust-strip";
import { LuxuryCategoryGrid } from "@/components/storefront/luxury/luxury-category-grid";
import { LuxuryBestSellers } from "@/components/storefront/luxury/luxury-best-sellers";
import { LuxuryBrands } from "@/components/storefront/luxury/luxury-brands";
import { LuxuryValueCards } from "@/components/storefront/luxury/luxury-value-cards";
import { SportHeader } from "@/components/storefront/sport/sport-header";
import { SportHero } from "@/components/storefront/sport/sport-hero";
import { SportTrustStrip } from "@/components/storefront/sport/sport-trust-strip";
import { SportCategoryGrid } from "@/components/storefront/sport/sport-category-grid";
import { SportBestSellers } from "@/components/storefront/sport/sport-best-sellers";
import {
  FashionHeader,
  FashionHero,
  FashionCategoryGrid,
  FashionBestSellers,
  FashionBrands,
  FashionValueCards,
} from "@/components/storefront/fashion";
import {
  MinimalHeader,
  MinimalHero,
  MinimalCategoryGrid,
  MinimalBestSellers,
} from "@/components/storefront/minimal";
import {
  ElectronicsHeader,
  ElectronicsHero,
  ElectronicsCategoryGrid,
  ElectronicsBestSellers,
  ElectronicsBrands,
  ElectronicsValueCards,
} from "@/components/storefront/electronics";
import { SportBrands } from "@/components/storefront/sport/sport-brands";
import { SportValueCards } from "@/components/storefront/sport/sport-value-cards";

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
  const isClassic = themeKey === "classic";
  const isLuxury = themeKey === "luxury";
  const isSport = themeKey === "sport";
  const isFashion = themeKey === "fashion";
  const isMinimalTheme = themeKey === "minimal";
  const isBeauty = themeKey === "beauty";
  const isElectronics = themeKey === "electronics";
  const isMinimal = themeKey === "minimal";
  const enforceThemePreset = !isClassic && !isLuxury;
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
  const heroImageUrl = heroImageUrlCms || (isBeauty ? "/images/hero-skonhet.png" : isClassic ? "/images/hero-classic.png" : getThemeHeroImage(themeKey));
  const heroContentPositionRaw = readHomeField("hero", "contentPosition", "left").trim().toLowerCase();
  const heroContentPosition = heroContentPositionRaw === "right" ? "right" : "left";
  const isHeroContentRight = heroContentPosition === "right";
  const useHeroImageBackground = heroImageUrl.length > 0 && themeKey !== "classic";
  const primaryCtaHref = readHomeField("hero", "primaryCtaHref", "/products").trim() || "/products";
  const primaryCtaLabel = readHomeField("hero", "primaryCtaLabel", "Shoppa nu").trim() || "Shoppa nu";
  const showPrimaryCta = true;
  const secondaryCtaFallback = isSport ? "Utforska nyheter" : isFashion ? "Utforska kollektioner" : isBeauty ? "Se nyheter" : isElectronics ? "Se alla erbjudanden" : isMinimal ? "Se nyheter" : "Utforska kollektioner";
  const secondaryCtaHref = readHomeField("hero", "secondaryCtaHref", "/products").trim() || "/products";
  const secondaryCtaLabel = readHomeField("hero", "secondaryCtaLabel", secondaryCtaFallback).trim() || secondaryCtaFallback;
  const showSecondaryCta = true;
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
  const categoryNameById = new Map<string, string>();
  const megaCategories: { name: string; slug: string }[] = [];
  if (tenant) {
    const supabase = createSupabaseAdminClient();
    // Tema-scope: hämta bara produkter vars kategori matchar temats categoryCards.
    const themeTitles = new Set(
      storefrontConfig.categoryCards.map((c) => c.title.trim().toLowerCase()),
    );
    // Hämta alla tenant-kategorier en gång — används till
    // (a) tema-scope-filtrering, (b) subtitle-lookup, (c) electronics megameny.
    const { data: dbCats } = await supabase
      .from("product_categories")
      .select("id, name, slug")
      .eq("tenant_id", tenant.id);
    for (const c of dbCats || []) {
      categoryNameById.set(String(c.id), String(c.name));
      megaCategories.push({ name: String(c.name), slug: String(c.slug) });
    }
    let scopedCategoryIds: string[] | null = null;
    if (themeTitles.size > 0) {
      scopedCategoryIds = (dbCats || [])
        .filter((c) => themeTitles.has(String(c.name).trim().toLowerCase()))
        .map((c) => c.id as string);
    }

    let q = supabase
      .from("products")
      .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status, category_id")
      .eq("tenant_id", tenant.id)
      .eq("status", "published");
    if (scopedCategoryIds && scopedCategoryIds.length > 0) {
      q = q.in("category_id", scopedCategoryIds);
    }
    const { data } = await q.limit(8);
    featuredProducts = (data || []) as Product[];
    favoriteIds = new Set(await getFavoriteProductIdsForCurrentUser(tenant.id));
  }

  const bestSellers = (featuredProducts.length > 0 ? featuredProducts : productsFallback).slice(0, 6);
  const classicBestSellerProducts = bestSellers.map((product, idx) => ({
    id: "id" in product ? product.id : undefined,
    title: "title" in product ? product.title : "",
    priceMinor: "price_minor" in product ? product.price_minor : product.priceMinor,
    currency: "currency" in product ? product.currency : "SEK",
    href: "slug" in product ? `/products/${product.slug}` : "/products",
    imageUrl: "image_url" in product ? (product.image_url ?? undefined) : undefined,
    favorited: "id" in product ? favoriteIds.has(product.id) : false,
    subtitle:
      "category_id" in product && product.category_id
        ? categoryNameById.get(String(product.category_id))
        : undefined,
    badge: idx === 0 ? "BÄSTSÄLJARE" : idx === 1 ? "NYHET" : undefined,
    rating: 4.5,
    reviewCount: 80 + idx * 13,
  }));
  const sportTopUtilityItems = [
    "FRI FRAKT OVER 499 KR",
    "30 DAGARS OPPET KOP",
    "SNABBA LEVERANSER",
  ];
  const displayedCategoryCards = isBeauty || isSport ? categoryCards.slice(0, 5) : categoryCards;

  if (isElectronics) {
    const elecCategories = categoryCards.map((c) => ({
      title: c.title,
      href: `/products?category=${encodeURIComponent(c.title.toLowerCase())}`,
      imageUrl: c.imageUrl,
    }));
    const elecProducts = classicBestSellerProducts.map((p) => ({
      id: p.id,
      slug: p.href?.split("/products/")[1],
      title: p.title,
      priceMinor: p.priceMinor,
      currency: p.currency,
      href: p.href,
      imageUrl: p.imageUrl,
      subtitle: p.subtitle,
    }));
    return (
      <main className="bg-white">
        <ElectronicsHeader brandName={brandName} links={navItems} megaCategories={megaCategories} />
        <ElectronicsHero
          eyebrow="Veckans deals"
          title={getCmsBlockField(cms.blocks, "hero", "title", "Teknik till\nrätt pris.")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "Tusentals produkter, snabba leveranser och experthjälp.")}
          primaryCtaHref={primaryCtaHref}
          primaryCtaLabel={primaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          heroImageUrl={heroImageUrl || undefined}
        />
        <ElectronicsCategoryGrid title={categoriesSectionTitle} categories={elecCategories} />
        <ElectronicsBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={elecProducts} />
        <ElectronicsBrands title={brandsTitle} brands={brandLogos} />
        <ElectronicsValueCards cards={valueCards} />
      </main>
    );
  }

  if (isMinimalTheme) {
    const minimalCategories = categoryCards.map((c) => ({
      title: c.title,
      href: `/products?category=${encodeURIComponent(c.title.toLowerCase())}`,
      imageUrl: c.imageUrl,
    }));
    const minimalProducts = classicBestSellerProducts.map((p) => ({
      id: p.id,
      title: p.title,
      priceMinor: p.priceMinor,
      currency: p.currency,
      href: p.href,
      imageUrl: p.imageUrl,
      badge: p.badge,
      favorited: p.favorited,
      subtitle: p.subtitle,
    }));
    return (
      <main className="bg-white">
        <MinimalHeader brandName={brandName} links={navItems} />
        <MinimalHero
          eyebrow={heroEyebrow}
          title={getCmsBlockField(cms.blocks, "hero", "title", "Phone Pro.")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "Kraftfull. Elegant. Gjord för att hålla.")}
          primaryCtaHref={primaryCtaHref}
          primaryCtaLabel={primaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          heroImageUrl={heroImageUrl || undefined}
        />
        <MinimalCategoryGrid title={categoriesSectionTitle} categories={minimalCategories} />
        <MinimalBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={minimalProducts} />
      </main>
    );
  }

  if (isFashion) {
    const fashionCategories = categoryCards.map((c) => ({
      title: c.title,
      href: `/products?category=${encodeURIComponent(c.title.toLowerCase())}`,
      imageUrl: c.imageUrl,
    }));
    const fashionProducts = classicBestSellerProducts.map((p) => ({
      id: p.id,
      title: p.title,
      priceMinor: p.priceMinor,
      currency: p.currency,
      href: p.href,
      imageUrl: p.imageUrl,
      badge: p.badge,
      favorited: p.favorited,
      subtitle: p.subtitle,
    }));
    return (
      <main className="bg-[#FAF9F6]">
        <FashionHeader brandName={brandName} links={navItems} />
        <FashionHero
          eyebrow={heroEyebrow}
          title={getCmsBlockField(cms.blocks, "hero", "title", "The new\nessentials.")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "A modern wardrobe — designed to last, made to be worn.")}
          primaryCtaHref={primaryCtaHref}
          primaryCtaLabel={primaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          heroImageUrl={heroImageUrl || undefined}
        />
        <FashionCategoryGrid title={categoriesSectionTitle} categories={fashionCategories} />
        <FashionBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={fashionProducts} />
        <FashionBrands title={brandsTitle} brands={brandLogos} />
        <FashionValueCards cards={valueCards} />
      </main>
    );
  }

  if (isSport) {
    const sportCategories = displayedCategoryCards.map((c) => ({
      title: c.title,
      href: `/products?category=${encodeURIComponent(c.title.toLowerCase())}`,
      imageUrl: c.imageUrl,
    }));
    const sportProducts = classicBestSellerProducts.map((p) => ({
      id: p.id,
      title: p.title,
      priceMinor: p.priceMinor,
      currency: p.currency,
      href: p.href,
      imageUrl: p.imageUrl,
      badge: p.badge,
      favorited: p.favorited,
      subtitle: p.subtitle,
    }));
    return (
      <main className="flex-1 bg-white">
        <SportHeader brandName={brandName} links={navItems} />
        <SportHero
          eyebrow={heroEyebrow}
          title={getCmsBlockField(cms.blocks, "hero", "title", "Din träning.\nDin styrka.")}
          description={getCmsBlockField(cms.blocks, "hero", "description", "Utrustning, kläder och skor som hjälper dig att nå dina mål — oavsett nivå.")}
          primaryCtaHref={primaryCtaHref}
          primaryCtaLabel={primaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          heroImageUrl={heroImageUrl || undefined}
        />
        <SportTrustStrip items={homeTrustCards} />
        <SportCategoryGrid title={categoriesSectionTitle} categories={sportCategories} />
        <SportBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={sportProducts} />
        <SportBrands title={brandsTitle} brands={brandLogos} />
        <SportValueCards cards={valueCards} />
      </main>
    );
  }

  if (isLuxury) {
    const luxuryCategories = displayedCategoryCards.map((c) => ({
      title: c.title,
      href: `/products?category=${encodeURIComponent(c.title.toLowerCase())}`,
      accent: (c as { title: string; accent?: string }).accent,
      imageUrl: (c as { imageUrl?: string }).imageUrl,
    }));
    return (
      <main className="flex-1 text-slate-900" style={{ background: "var(--store-footer-bg)" }}>
        <div style={{ background: "var(--store-header-gradient)" }}>
          <LuxuryHeader brandName={brandName} links={navItems} />
          <LuxuryHero
            eyebrow={heroEyebrow}
            title={getCmsBlockField(cms.blocks, "hero", "title", "Konsten att\nleva väl.")}
            description={getCmsBlockField(cms.blocks, "hero", "description", "Noggrant utvalt för dig som värderar det extraordinära.")}
            primaryCtaHref={primaryCtaHref}
            primaryCtaLabel={primaryCtaLabel}
            secondaryCtaHref={secondaryCtaHref}
            secondaryCtaLabel={secondaryCtaLabel}
            heroImageUrl={heroImageUrl || undefined}
          />
          <LuxuryTrustStrip items={homeTrustCards} />
        </div>
        <LuxuryCategoryGrid title={categoriesSectionTitle} categories={luxuryCategories} />
        <LuxuryBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={classicBestSellerProducts} />
        <LuxuryBrands title={brandsTitle} brands={brandLogos} />
        <LuxuryValueCards cards={valueCards} />
      </main>
    );
  }

  return (
    <main
      className="flex-1 py-3 text-slate-900"
      style={{ background: isBeauty ? "#fff8fb" : "var(--store-footer-bg)" }}
    >
      <div
        className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[20px] border shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
        style={{ borderColor: "var(--store-footer-border)", background: "var(--store-footer-bg)" }}
      >
      {/* ── CLASSIC: helt separat rendering-path ─────────────────── */}
      {isClassic ? (
        <>
          <section className="px-4 pt-2 sm:px-5">
            <div
              className="overflow-hidden rounded-[18px] text-white shadow-2xl"
              style={{ background: "var(--store-header-gradient)" }}
            >
              <ClassicHeader
                brandName={brandName}
                storeName={tenant?.name || "PREMIUM STORE"}
                links={navItems}
              />
              <ClassicHero
                eyebrow={heroEyebrow}
                title={readHomeField("hero", "title", "Upplev kvalitet. Varje dag.")}
                description={readHomeField("hero", "description", "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.")}
                primaryCtaHref={primaryCtaHref}
                primaryCtaLabel={primaryCtaLabel}
                secondaryCtaHref={secondaryCtaHref}
                secondaryCtaLabel={secondaryCtaLabel}
                heroImageUrl={heroImageUrl || undefined}
              />
            </div>
          </section>
          <div className="relative z-10 -mt-16 px-4 sm:px-5">
            <ClassicTrustStrip items={homeTrustCards} />
          </div>
        </>
      ) : (
      /* ── ÖVRIGA TEMAN ─────────────────────────────────────────── */
      <GenericHeroSection
        brandName={brandName}
        storeName={tenant?.name || "PREMIUM STORE"}
        navItems={navItems}
        heroImageUrl={heroImageUrl}
        heroEyebrow={heroEyebrow}
        heroTitle={readHomeField("hero", "title", isSport ? "Din träning.\nDin styrka." : isFashion ? "Klä dig med\nsjälvförtroende." : isBeauty ? "Lyft din naturliga\nskönhet" : isMinimal ? "Det viktigaste\nutan brus" : "Upplev kvalitet. Varje dag.")}
        heroDescription={readHomeField("hero", "description", isSport ? "Utrustning, kläder och skor som hjälper dig att nå dina mål - oavsett nivå." : isFashion ? "Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil - för alla tillfällen." : isBeauty ? "Upptäck vårt handplockade sortiment av hudvård, smink och dofter - noggrant utvalt för att framhäva det bästa i dig." : isMinimal ? "Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet." : "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.")}
        primaryCtaHref={primaryCtaHref}
        primaryCtaLabel={primaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
        secondaryCtaLabel={secondaryCtaLabel}
        isHeroContentRight={isHeroContentRight}
        isSport={isSport}
        isBeauty={isBeauty}
        isElectronics={false}
        trustCards={homeTrustCards}
        electronicsTrustStrip={[]}
        sportTopUtilityItems={sportTopUtilityItems}
        electronicsTopUtilityItems={[]}
      />
      )}

      {isClassic ? (
        <ClassicCategoryGrid
          title={categoriesSectionTitle}
          categories={displayedCategoryCards}
        />
      ) : (
      <GenericCategorySection
        title={categoriesSectionTitle}
        categories={displayedCategoryCards}
        isElectronics={false}
        isBeauty={isBeauty}
        isSport={isSport}
      />
      )}

      {isClassic ? (
        <ClassicBestSellers
          title={bestSellersTitle}
          viewAllLabel={bestSellersViewAllLabel}
          products={classicBestSellerProducts}
        />
      ) : (
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
                        inactiveClassName="text-white"
                        activeClassName="text-rose-400"
                      />
                    ) : null}
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded bg-[color:var(--store-accent)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--store-accent-fg)]">
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


      )}

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

      {isClassic ? (
        <ClassicBrands title={brandsTitle} brands={brandLogos} />
      ) : (
        <GenericBrandsSection title={brandsTitle} brands={brandLogos} isBeauty={isBeauty} isSport={isSport} />
      )}

      {isClassic ? (
        <ClassicValueCards cards={valueCards} />
      ) : (
        <GenericValueCardsSection cards={valueCards} isSport={isSport} />
      )}
      </div>
    </main>
  );
}
