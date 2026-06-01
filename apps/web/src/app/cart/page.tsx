import { CheckoutClient } from "@/components/checkout-client";
import { StorefrontHeader } from "@/components/storefront-header";
import { SportCart } from "@/components/storefront/sport/sport-cart";
import { FashionCart } from "@/components/storefront/fashion";
import { MinimalCart } from "@/components/storefront/minimal";
import { ElectronicsCart } from "@/components/storefront/electronics";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

export default async function CartPage() {
  const definition = getCmsPage("cart");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("cart", { blocks: fallbackBlocks });
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const brandName = await getStoreBrandName();
  const themeKey = normalizeThemeKey(settings?.theme_key);

  // ── Sport: Nike-stil cart ────────────────────────────────────
  if (themeKey === "sport") {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} brandName={brandName} />
        <SportCart heading={getCmsBlockField(cms.blocks, "summary", "title", "Bag")} />
      </main>
    );
  }

  // ── Fashion: Filippa K-stil cart ─────────────────────────────
  if (themeKey === "fashion") {
    return (
      <main className="bg-[#FAF9F6]">
        <StorefrontHeader cartCount={0} brandName={brandName} />
        <FashionCart heading={getCmsBlockField(cms.blocks, "summary", "title", "Shopping Bag")} />
      </main>
    );
  }

  // ── Minimal: Apple-stil cart ─────────────────────────────────
  if (themeKey === "minimal") {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} brandName={brandName} />
        <MinimalCart heading={getCmsBlockField(cms.blocks, "summary", "title", "Din väska")} />
      </main>
    );
  }

  // ── Electronics: Komplett/Webhallen-stil cart ────────────────
  if (themeKey === "electronics") {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} brandName={brandName} />
        <ElectronicsCart heading={getCmsBlockField(cms.blocks, "summary", "title", "Varukorg")} />
      </main>
    );
  }

  // ── Beauty: KICKS-stil cart ──────────────────────────────────
  if (themeKey === "beauty") {
    return (
      <main className="bg-white">
        <StorefrontHeader cartCount={0} brandName={brandName} />
        <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6">
          <h1 className="mb-6 text-[30px] font-extrabold uppercase tracking-[-0.02em] text-[#1A1A1A] lg:text-[40px]">
            {getCmsBlockField(cms.blocks, "summary", "title", "Varukorg")}
          </h1>
          <CheckoutClient
            heading=""
            freeShippingText={getCmsBlockField(cms.blocks, "summary", "freeShippingText", "Fri frakt! Du har fri frakt på din beställning.")}
            brandName={brandName}
            trustBadges={settings?.trust_badges}
          />
        </div>
      </main>
    );
  }

  // ── Default (övriga teman): befintlig cart ───────────────────
  return (
    <main style={{ background: "var(--store-footer-bg)" }}>
      <CheckoutClient
        heading={getCmsBlockField(cms.blocks, "summary", "title", "Din varukorg")}
        freeShippingText={getCmsBlockField(cms.blocks, "summary", "freeShippingText", "Fri frakt! Du har fri frakt på din beställning.")}
        brandName={brandName}
        trustBadges={settings?.trust_badges}
      />
    </main>
  );
}
