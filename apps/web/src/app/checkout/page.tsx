import { KassaClient } from "@/components/kassa-client";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { getStoreBrandName } from "@/lib/store-brand";
import { getTenantSettings } from "@/lib/tenant-settings";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";

export default async function CheckoutPage() {
  const definition = getCmsPage("checkout");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const cms = await getPublishedPageContent("checkout", { blocks: fallbackBlocks });
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();
  const settings = tenant ? await getTenantSettings(tenant) : null;
  const shippingOptions = tenant
    ? await (async () => {
        const supabase = createSupabaseAdminClient();
        const { data: methods } = await supabase
          .from("shipping_methods")
          .select("id, name, carrier_integration_id, transit_days_min, transit_days_max, base_price_minor, free_shipping_over_minor, is_active, sort_order")
          .eq("tenant_id", tenant.id)
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        const { data: carriers } = await supabase
          .from("carrier_integrations")
          .select("id, display_name")
          .eq("tenant_id", tenant.id)
          .eq("is_active", true);
        const carrierById = new Map((carriers || []).map((row) => [row.id as string, row.display_name as string]));
        return (methods || []).map((method) => ({
          id: method.id as string,
          name: method.name as string,
          carrierName: method.carrier_integration_id
            ? carrierById.get(method.carrier_integration_id as string) || null
            : null,
          transitDaysMin: Number(method.transit_days_min || 1),
          transitDaysMax: Number(method.transit_days_max || 3),
          basePriceMinor: Number(method.base_price_minor || 0),
          freeShippingOverMinor: Number(method.free_shipping_over_minor || 0),
        }));
      })()
    : [];

  return (
    <main className="bg-[#f6f3ee]">
      <KassaClient
        heading={getCmsBlockField(cms.blocks, "checkoutHeader", "title", "Kassa")}
        subtitle={getCmsBlockField(cms.blocks, "checkoutHeader", "subtitle", "Snabb, säkert och smidigt.")}
        brandName={brandName}
        paymentMethods={settings?.payment_methods}
        shippingOptions={shippingOptions}
      />
    </main>
  );
}
