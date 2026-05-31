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
import { ClassicValueCards } from "@/components/storefront/classic/classic-value-cards";
import { ClassicBestSellers } from "@/components/storefront/classic/classic-best-sellers";
import { ClassicCategoryGrid } from "@/components/storefront/classic/classic-category-grid";
import { ClassicHeader } from "@/components/storefront/classic/classic-header";
import type { Product } from "@/types/commerce";
import { ClassicHero } from "@/components/storefront/classic/classic-hero";
import { GenericHeroSection } from "@/components/storefront/generic-hero-section";
import { GenericCategorySection } from "@/components/storefront/generic-category-section";
import { GenericBestSellersSection } from "@/components/storefront/generic-best-sellers-section";
import { GenericBrandsSection } from "@/components/storefront/generic-brands-section";
import { GenericValueCardsSection } from "@/components/storefront/generic-value-cards-section";
import { BeautyPromoSection } from "@/components/storefront/beauty-promo-section";
import { ClassicTrustStrip } from "@/components/storefront/classic/classic-trust-strip";
import { LuxuryHeader, LuxuryHero, LuxuryTrustStrip, LuxuryCategoryGrid, LuxuryBestSellers, LuxuryBrands, LuxuryValueCards } from "@/components/storefront/luxury";













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
  const heroImageUrl = heroImageUrlCms || (isBeauty ? "/images/hero-skonhet.png" : isClassic ? "/images/hero-classic.png" : isLuxury ? "/images/hero-luxury.jpg" : "");
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
  const luxuryBestSellerProducts = bestSellers.map((product, idx) => ({
    id: "id" in product ? product.id : undefined,
    title: "title" in product ? product.title : "",
    priceMinor: "price_minor" in product ? product.price_minor : product.priceMinor,
    currency: "currency" in product ? product.currency : "SEK",
    href: "slug" in product ? `/products/${product.slug}` : "/products",
    imageUrl: "image_url" in product ? (product.image_url ?? undefined) : undefined,
    favorited: "id" in product ? favoriteIds.has(product.id) : false,
    badge: idx === 0 ? readHomeField("bestSellers", "badgeBestSeller", "EXKLUSIV") : idx === 1 ? readHomeField("bestSellers", "badgeNew", "NOUVEAU") : undefined,
  }));
  const classicBestSellerProducts = bestSellers.map((product, idx) => ({
    id: "id" in product ? product.id : undefined,
    title: "title" in product ? product.title : "",
    priceMinor: "price_minor" in product ? product.price_minor : product.priceMinor,
    currency: "currency" in product ? product.currency : "SEK",
    href: "slug" in product ? `/products/${product.slug}` : "/products",
    imageUrl: "image_url" in product ? (product.image_url ?? undefined) : undefined,
    favorited: "id" in product ? favoriteIds.has(product.id) : false,
    badge: idx === 0 ? "BÄSTSÄLJARE" : idx === 1 ? "NYHET" : undefined,
    rating: 4.5,
    reviewCount: 80 + idx * 13,
  }));
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
      {/* ── CLASSIC ─────────────────────────────────────────────── */}
      {isClassic ? (
        <>
          <section className="px-4 pt-2 sm:px-5">
            <div className="overflow-hidden rounded-[18px] text-white shadow-2xl" style={{ background: "var(--store-header-gradient)" }}>
              <ClassicHeader brandName={brandName} storeName={tenant?.name || "PREMIUM STORE"} links={navItems} />
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
      ) : isLuxury ? (
      /* ── LUXURY ──────────────────────────────────────────────── */
        <>
          <div className="overflow-hidden rounded-[18px] text-white shadow-2xl" style={{ background: "var(--store-header-gradient)" }}>
            <LuxuryHeader brandName={brandName} links={navItems} />
            <LuxuryHero
              eyebrow={heroEyebrow}
              title={readHomeField("hero", "title", "Konsten att\nleva väl.")}
              description={readHomeField("hero", "description", "Noggrant utvalt för dig som värderar det extraordinära.")}
              primaryCtaHref={primaryCtaHref}
              primaryCtaLabel={primaryCtaLabel}
              secondaryCtaHref={secondaryCtaHref}
              secondaryCtaLabel={secondaryCtaLabel}
              heroImageUrl={heroImageUrl || undefined}
            />
            <LuxuryTrustStrip items={homeTrustCards} />
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
        heroTitle={readHomeField("hero", "title", isSport ? "Din träning.\nDin styrka." : isFashion ? "Klä dig med\nsjälvförtroende." : isBeauty ? "Lyft din naturliga\nskönhet" : isElectronics ? "Teknik för\nvarje dag" : isMinimal ? "Det viktigaste\nutan brus" : "Upplev kvalitet. Varje dag.")}
        heroDescription={readHomeField("hero", "description", isSport ? "Utrustning, kläder och skor som hjälper dig att nå dina mål - oavsett nivå." : isFashion ? "Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil - för alla tillfällen." : isBeauty ? "Upptäck vårt handplockade sortiment av hudvård, smink och dofter - noggrant utvalt för att framhäva det bästa i dig." : isElectronics ? "Upptäck de senaste produkterna inom elektronik. Kvalitet, prestanda och design i perfekt kombination." : isMinimal ? "Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet." : "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.")}
        primaryCtaHref={primaryCtaHref}
        primaryCtaLabel={primaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
        secondaryCtaLabel={secondaryCtaLabel}
        isHeroContentRight={isHeroContentRight}
        isSport={isSport}
        isBeauty={isBeauty}
        isElectronics={isElectronics}
        trustCards={homeTrustCards}
        electronicsTrustStrip={electronicsTrustStrip}
        sportTopUtilityItems={sportTopUtilityItems}
        electronicsTopUtilityItems={electronicsTopUtilityItems}
      />
      )}

      {isClassic ? (
        <ClassicCategoryGrid title={categoriesSectionTitle} categories={displayedCategoryCards} />
      ) : isLuxury ? (
        <LuxuryCategoryGrid title={categoriesSectionTitle} categories={displayedCategoryCards} />
      ) : (
        <GenericCategorySection title={categoriesSectionTitle} categories={displayedCategoryCards} isElectronics={isElectronics} isBeauty={isBeauty} isSport={isSport} />
      )}

      {isClassic ? (
        <ClassicBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={classicBestSellerProducts} />
      ) : isLuxury ? (
        <LuxuryBestSellers title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} products={luxuryBestSellerProducts} />
      ) : (
        <GenericBestSellersSection title={bestSellersTitle} viewAllLabel={bestSellersViewAllLabel} bestSellerBadge={bestSellerBadge} newBadge={newBadge} ratingCount={ratingCount} products={bestSellers} favoriteIds={favoriteIds} />
      )}

      {isBeauty ? <BeautyPromoSection cards={beautyPromoCards} /> : null}

      {isClassic ? (
        <ClassicBrands title={brandsTitle} brands={brandLogos} />
      ) : isLuxury ? (
        <LuxuryBrands title={brandsTitle} brands={brandLogos} />
      ) : (
        <GenericBrandsSection title={brandsTitle} brands={brandLogos} isBeauty={isBeauty} isSport={isSport} />
      )}

      {isClassic ? (
        <ClassicValueCards cards={valueCards} />
      ) : isLuxury ? (
        <LuxuryValueCards cards={valueCards} />
      ) : (
        <GenericValueCardsSection cards={valueCards} isSport={isSport} />
      )}
      </div>
    </main>
  );
}
