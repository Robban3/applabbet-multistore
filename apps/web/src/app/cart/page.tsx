import { CheckoutClient } from "@/components/checkout-client";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";
import { getTenantSettings } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

export default async function CartPage() {
  const definition = getCmsPage("cart");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("cart", { blocks: fallbackBlocks });
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const brandName = await getStoreBrandName();

  return (
    <main className="bg-[#f6f3ee]">
      <CheckoutClient
        heading={getCmsBlockField(cms.blocks, "summary", "title", "Din varukorg")}
        freeShippingText={getCmsBlockField(cms.blocks, "summary", "freeShippingText", "Fri frakt! Du har fri frakt på din beställning.")}
        brandName={brandName}
        trustBadges={settings?.trust_badges}
      />
    </main>
  );
}
