import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { StorefrontHeader } from "@/components/storefront-header";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { SportProductGallery } from "@/components/storefront/sport/sport-product-gallery";
import { FashionProductGallery } from "@/components/storefront/fashion/fashion-product-gallery";
import { MinimalProductGallery } from "@/components/storefront/minimal/minimal-product-gallery";
import { ElectronicsProductGallery } from "@/components/storefront/electronics";
import { ProductDetailTabs } from "@/components/product-detail-tabs";
import { ProductPurchaseControls } from "@/components/product-purchase-controls";
import { formatMinorPrice } from "@/lib/format";
import { getCmsBlockField, loadThemedCmsPageContent } from "@/lib/cms/content";
import { getFavoriteProductIdsForCurrentUser } from "@/lib/favorites";
import { getStoreBrandName } from "@/lib/store-brand";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import type { Product } from "@/types/commerce";

const PRODUCT_IMAGE_BUCKET = "product-images";

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
  { label: "Bästsäljare", href: "/bastsaljare" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kundservice", href: "/kundservice" },
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

function resolveProductImageUrl(input: string | null | undefined) {
  const value = String(input || "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  // Lokala public-bilder (t.ex. mock-bilder) serveras direkt.
  if (value.startsWith("/images/")) return value;
  const admin = createSupabaseAdminClient();
  const { data } = admin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(value.replace(/^\/+/, ""));
  return data.publicUrl || null;
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const brandName = await getStoreBrandName();

  if (!tenant) notFound();
  const settings = await getTenantSettings(tenant);
  const themeKey = normalizeThemeKey(settings?.theme_key);
  const cms = await loadThemedCmsPageContent("product-detail", themeKey);
  const isElectronics = themeKey === "electronics";
  const isLuxury = themeKey === "luxury";
  const isSport = themeKey === "sport";
  const isFashion = themeKey === "fashion";
  const isMinimalTheme = themeKey === "minimal";
  const isElectronicsTheme = themeKey === "electronics";
  const isFullPage = isLuxury || isSport || isFashion || isMinimalTheme || isElectronicsTheme;

  const supabase = createSupabaseAdminClient();
  const { data: productWithTabs, error: productWithTabsError } = await supabase
    .from("products")
    .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status, product_colors, product_materials, product_sizes, product_gallery_images, detail_tab_label_description, detail_tab_label_specifications, detail_tab_label_shipping, detail_tab_label_reviews, detail_description_intro, detail_description_bullets, detail_specifications, detail_shipping_returns, detail_reviews")
    .eq("tenant_id", tenant.id)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  const { data: productBase } =
    productWithTabsError
      ? await supabase
          .from("products")
          .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status, product_colors, product_materials")
          .eq("tenant_id", tenant.id)
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle()
      : { data: null };

  if (!productWithTabs && !productBase) notFound();
  const product = (productWithTabs || productBase) as Product;
  const { data: relatedData } = await supabase
    .from("products")
    .select("id, tenant_id, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", tenant.id)
    .eq("status", "published")
    .neq("id", product.id)
    .limit(5);
  const relatedProducts = (relatedData || []) as Product[];
  const favoriteIds = new Set(await getFavoriteProductIdsForCurrentUser(tenant.id));
  const { data: defaultWarehouse } = await supabase
    .from("warehouses")
    .select("id")
    .eq("tenant_id", tenant.id)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true })
    .limit(1)
    .maybeSingle();
  const { data: inventoryRow } = defaultWarehouse?.id
    ? await supabase
        .from("inventory_levels")
        .select("on_hand_quantity, reserved_quantity")
        .eq("tenant_id", tenant.id)
        .eq("warehouse_id", defaultWarehouse.id)
        .eq("product_id", product.id)
        .maybeSingle()
    : { data: null };
  const availableStock = inventoryRow
    ? Math.max(
        0,
        Number(inventoryRow.on_hand_quantity || 0) -
          Number(inventoryRow.reserved_quantity || 0),
      )
    : null;
  const detailTabLabels = {
    description: product.detail_tab_label_description || "BESKRIVNING",
    specifications: product.detail_tab_label_specifications || "SPECIFIKATIONER",
    shipping: product.detail_tab_label_shipping || "LEVERANS & RETURER",
    reviews: product.detail_tab_label_reviews || "RECENSIONER (84)",
  };
  const detailDescriptionIntro =
    product.detail_description_intro ||
    (isElectronics
      ? "En kraftfull produkt byggd för hög prestanda i vardagen - perfekt för både arbete och underhållning."
      : "Trail Grip X är en exklusiv klocka skapad för dig som värdesätter kvalitet, stil och funktion i varje detalj.");
  const detailDescriptionBullets =
    product.detail_description_bullets && product.detail_description_bullets.length > 0
      ? product.detail_description_bullets
      : isElectronics
        ? [
            "Snabb processor för multitasking och spel",
            "Högupplöst skärm med skarp färgåtergivning",
            "Lång batteritid för heldagsanvändning",
            "Modern anslutning med USB-C och trådlöst stöd",
          ]
        : [
            "Japanskt quartz-urverk för maximal precision",
            "Safirglas som är reptåligt och hållbart",
            "Vattentät upp till 50 meter",
            "Äkta läderarmband med bekväm passform",
          ];
  const detailSpecifications =
    product.detail_specifications ||
    (isElectronics
      ? "Processor: Senaste generationen. Minne: 16 GB. Lagring: 512 GB. Anslutning: Wi-Fi 6, Bluetooth 5."
      : "Material: Rostfritt stål. Glas: Safirglas. Urverk: Japanskt quartz. Vattentäthet: 50 meter.");
  const detailShippingReturns =
    product.detail_shipping_returns ||
    "Fri frakt över 499 kr. Leverans 1-3 arbetsdagar. 30 dagars öppet köp och smidig returhantering.";
  const detailReviews =
    product.detail_reviews ||
    (isElectronics
      ? "Kunderna uppskattar framför allt prestanda, byggkvalitet och batteritid. Snittbetyg: 4.8 av 5."
      : "Kunderna uppskattar framför allt kvalitet, passform och den tidlösa designen. Snittbetyg: 4.8 av 5.");
  const galleryImages = (product.product_gallery_images || [])
    .map((url) => resolveProductImageUrl(String(url || "").trim()))
    .filter((url): url is string => Boolean(url));
  const mainProductImage = resolveProductImageUrl(product.image_url);
  const orderedImages = galleryImages.length > 0
    ? galleryImages
    : mainProductImage
      ? [mainProductImage]
      : [];

  const shellBackground = "var(--store-footer-bg)";
  const shellBorder = "var(--store-footer-border)";
  const shellCardBorder = "var(--store-card-border)";
  const shellSoftSurface = "var(--store-soft-surface)";

  const productContent = (

          <div className="px-6 py-5">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700">Hem</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-slate-700">{isElectronics ? "Datorer & tillbehör" : "Klockor"}</Link>
              <span>/</span>
              <Link href={`/products/${product.slug}`} className="font-medium text-slate-700 hover:text-slate-900">{product.title}</Link>
            </div>

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <ProductImageGallery title={product.title} images={orderedImages} />

              <aside className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: shellCardBorder }}>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[48px]">{product.title}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="text-[color:var(--store-accent)]">★★★★★</span> 4.8 (84 recensioner) · SKU: CE-001-BRG
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

                <ProductPurchaseControls
                  productId={product.id}
                  title={product.title}
                  priceMinor={product.price_minor}
                  currency={product.currency}
                  productColors={product.product_colors}
                  productMaterials={product.product_materials}
                  productSizes={product.product_sizes}
                  availableStock={availableStock}
                />
                <div className="mt-2 flex justify-center">
                  <FavoriteToggle
                    productId={product.id}
                    initialFavorited={favoriteIds.has(product.id)}
                    label="Lägg till i önskelista"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    activeClassName="text-rose-600"
                    inactiveClassName="text-slate-700"
                  />
                </div>
              </aside>
            </section>

            <section
              className="mt-5 grid overflow-hidden rounded-2xl border border-slate-200 sm:grid-cols-2 lg:grid-cols-4"
              style={{ background: shellSoftSurface }}
            >
              {trustBar.map((item) => (
                <article key={item.title} className="flex min-h-[74px] flex-col justify-center border-t bg-white px-4 py-3 first:border-t-0 lg:min-h-[84px] lg:border-l lg:border-t-0 lg:first:border-l-0" style={{ borderColor: "var(--store-footer-border)" }}>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.text}</p>
                </article>
              ))}
            </section>

            <ProductDetailTabs
              labels={detailTabLabels}
              descriptionIntro={detailDescriptionIntro}
              descriptionBullets={detailDescriptionBullets}
              specifications={detailSpecifications}
              shippingReturns={detailShippingReturns}
              reviews={detailReviews}
            />

            <section className="mt-7">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Du kanske också gillar</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    style={{ borderColor: shellCardBorder }}
                  >
                    <div
                      className="relative h-32"
                      style={{ background: "var(--store-media-gradient)" }}
                    >
                      <FavoriteToggle
                        productId={item.id}
                        initialFavorited={favoriteIds.has(item.id)}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30"
                        inactiveClassName="text-white"
                        activeClassName="text-rose-400"
                      />
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm font-medium text-slate-800">{formatMinorPrice(item.price_minor, item.currency)}</p>
                      <p className="text-xs text-[color:var(--store-accent)]">★★★★★ <span className="text-slate-500">(120)</span></p>
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

            <section className="mt-6 rounded-xl px-5 py-4 text-white" style={{ background: "var(--store-footer-surface)" }}>
              <div className="grid gap-4 md:grid-cols-3">
                {footerHighlights.map((item) => (
                  <article key={item.title}>
                    <p className="text-sm font-semibold text-[color:var(--store-accent)]">{item.title}</p>
                    <p className="text-xs text-white/75">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
  );

  if (isElectronicsTheme) {
    // Komplett/Webhallen-stil produktdetalj
    return (
      <main className="bg-white">
        <StorefrontHeader brandName={brandName} cartCount={2} />
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-6">
          <nav className="text-[12px] text-[#0A2540]/55">
            <Link href="/" className="hover:underline">Hem</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:underline">Produkter</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0A2540]">{product.title}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
            <ElectronicsProductGallery title={product.title} images={orderedImages} />

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <h1 className="text-[26px] font-bold leading-tight text-[#0A2540] lg:text-[30px]">{product.title}</h1>
              <p className="mt-2 text-[13px] text-[#FFB400]">★★★★<span className="text-[#DCE6F5]">★</span> <span className="text-[#0A2540]/45">(86 omdömen)</span></p>

              <div className="mt-5 rounded-[12px] border border-[#DCE6F5] bg-[#F4F7FC] p-5">
                <p className="text-[32px] font-bold text-[#0A2540]">{formatMinorPrice(product.price_minor, product.currency)}</p>
                <p className="mt-1 text-[13px] text-[#0A2540]/60">Inkl. moms · Fri frakt</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a8754]">
                  <span className="h-2 w-2 rounded-full bg-[#1a8754]" /> I lager — skickas inom 1-2 arbetsdagar
                </p>
                <div className="mt-4">
                  <ProductPurchaseControls
                    productId={product.id}
                    title={product.title}
                    priceMinor={product.price_minor}
                    currency={product.currency}
                    productColors={product.product_colors}
                    productMaterials={product.product_materials}
                    productSizes={product.product_sizes}
                    availableStock={availableStock}
                  />
                </div>
              </div>

              {/* Trust */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-[13px] text-[#0A2540]">
                <div className="flex items-center gap-2 rounded-[10px] border border-[#DCE6F5] px-3 py-2.5">🚚 Fri frakt</div>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#DCE6F5] px-3 py-2.5">↩ 30 dagars öppet köp</div>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#DCE6F5] px-3 py-2.5">🛡 3 års garanti</div>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#DCE6F5] px-3 py-2.5">💬 Experthjälp</div>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#DCE6F5] pt-6">
                <div>
                  <h2 className="text-[16px] font-bold text-[#0A2540]">Produktbeskrivning</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#0A2540]/70">{detailDescriptionIntro}</p>
                  {detailDescriptionBullets.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-[14px] text-[#0A2540]/70">
                      {detailDescriptionBullets.map((b, i) => (
                        <li key={i} className="flex gap-2"><span className="text-[#2f7dff]">✓</span>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <details className="border-t border-[#DCE6F5] pt-4">
                  <summary className="cursor-pointer list-none text-[16px] font-bold text-[#0A2540]">Specifikationer</summary>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#0A2540]/70">{detailSpecifications}</p>
                </details>
              </div>
            </aside>
          </div>
        </section>

        {/* Relaterat */}
        <section className="mx-auto w-full max-w-[1280px] px-6 py-14">
          <h2 className="mb-6 text-[24px] font-bold text-[#0A2540]">Andra köpte också</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="group flex flex-col overflow-hidden rounded-[12px] border border-[#DCE6F5] bg-white transition hover:shadow-md">
                <div className="relative aspect-square bg-[#F4F7FC]">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveProductImageUrl(item.image_url) ?? ""} alt={item.title} className="absolute inset-0 h-full w-full object-contain p-4" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-[14px] font-semibold text-[#0A2540]">{item.title}</p>
                  <p className="mt-2 text-[18px] font-bold text-[#0A2540]">{formatMinorPrice(item.price_minor, item.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isMinimalTheme) {
    // Apple-stil produktdetalj: centrerad layout, stor produktbild, blå köp-knapp
    return (
      <main className="bg-white">
        <StorefrontHeader brandName={brandName} cartCount={2} />

        {/* Centrerad rubrik */}
        <section className="bg-white px-6 pt-14 text-center">
          <p className="text-[19px] font-semibold text-[#0066CC]">Nyhet</p>
          <h1 className="mx-auto mt-1 max-w-[800px] text-[40px] font-semibold tracking-[-0.03em] text-[#1D1D1F] lg:text-[56px]" style={{ lineHeight: 1.05 }}>
            {product.title}
          </h1>
          {product.description ? (
            <p className="mx-auto mt-3 max-w-[600px] text-[21px] tracking-[-0.01em] text-[#6E6E73]">{product.description}</p>
          ) : null}
          <p className="mt-4 text-[17px] text-[#1D1D1F]">Från {formatMinorPrice(product.price_minor, product.currency)}</p>
        </section>

        {/* Galleri + köp */}
        <section className="mx-auto w-full max-w-[1100px] px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <MinimalProductGallery title={product.title} images={orderedImages} />

            <aside className="lg:sticky lg:top-20 lg:self-start">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">Köp {product.title}</h2>
              <p className="mt-2 text-[17px] text-[#1D1D1F]">{formatMinorPrice(product.price_minor, product.currency)}</p>

              <div className="mt-8">
                <ProductPurchaseControls
                  productId={product.id}
                  title={product.title}
                  priceMinor={product.price_minor}
                  currency={product.currency}
                  productColors={product.product_colors}
                  productMaterials={product.product_materials}
                  productSizes={product.product_sizes}
                  availableStock={availableStock}
                />
              </div>

              <div className="mt-10 space-y-5 border-t border-[#D2D2D7] pt-8">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1D1D1F]">Översikt</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6E6E73]">{detailDescriptionIntro}</p>
                  {detailDescriptionBullets.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-[15px] text-[#6E6E73]">
                      {detailDescriptionBullets.map((b, i) => (
                        <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#86868B]" />{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <details className="border-t border-[#D2D2D7] pt-5">
                  <summary className="cursor-pointer list-none text-[17px] font-semibold text-[#1D1D1F]">Leverans & retur</summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6E6E73]">{detailShippingReturns}</p>
                </details>
              </div>
            </aside>
          </div>
        </section>

        {/* Relaterat */}
        <section className="bg-[#F5F5F7] px-6 py-16">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="mb-8 text-center text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">Du kanske också gillar</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="flex flex-col items-center rounded-[18px] bg-white p-6 text-center">
                  <div className="relative aspect-square w-full">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveProductImageUrl(item.image_url) ?? ""} alt={item.title} className="absolute inset-0 h-full w-full object-contain" />
                    ) : null}
                  </div>
                  <p className="mt-3 text-[17px] font-semibold text-[#1D1D1F]">{item.title}</p>
                  <p className="mt-1 text-[15px] text-[#1D1D1F]">{formatMinorPrice(item.price_minor, item.currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isFashion) {
    // Filippa K-stil produktdetalj
    return (
      <main className="bg-[#FAF9F6]">
        <StorefrontHeader brandName={brandName} cartCount={2} />
        <section className="mx-auto w-full max-w-[1480px] px-8 pt-8 lg:px-14">
          <nav className="text-[11px] tracking-[0.15em] uppercase text-[#1A1A1A]/55">
            <Link href="/" className="hover:underline">Hem</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:underline">Kollektioner</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1A1A1A]">{product.title}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
            <FashionProductGallery title={product.title} images={orderedImages} />

            <aside className="lg:sticky lg:top-6 lg:self-start lg:pt-2">
              <h1 className="text-[24px] font-light tracking-[0.01em] leading-tight text-[#1A1A1A] lg:text-[28px]">
                {product.title}
              </h1>
              {product.description ? (
                <p className="mt-2 text-[14px] text-[#1A1A1A]/65">{product.description}</p>
              ) : null}

              <p className="mt-5 text-[18px] tracking-[0.02em] text-[#1A1A1A]">
                {formatMinorPrice(product.price_minor, product.currency)}
              </p>

              <div className="mt-7">
                <ProductPurchaseControls
                  productId={product.id}
                  title={product.title}
                  priceMinor={product.price_minor}
                  currency={product.currency}
                  productColors={product.product_colors}
                  productMaterials={product.product_materials}
                  productSizes={product.product_sizes}
                  availableStock={availableStock}
                />
              </div>

              <div className="mt-5 flex justify-center">
                <FavoriteToggle
                  productId={product.id}
                  initialFavorited={favoriteIds.has(product.id)}
                  label="Add to wishlist"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#1A1A1A] text-[12px] tracking-[0.2em] uppercase text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                  activeClassName="bg-[#1A1A1A] text-[#FAF9F6]"
                  inactiveClassName="text-[#1A1A1A]"
                />
              </div>

              <div className="mt-10 space-y-0 border-t border-[#E5E1DC]">
                <details open className="group border-b border-[#E5E1DC] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] tracking-[0.15em] uppercase text-[#1A1A1A]">
                    {detailTabLabels.description}
                    <span className="text-[16px] text-[#1A1A1A]/55 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4 text-[14px] leading-relaxed text-[#1A1A1A]/75">
                    <p>{detailDescriptionIntro}</p>
                    {detailDescriptionBullets.length > 0 ? (
                      <ul className="mt-3 list-inside list-disc space-y-1">
                        {detailDescriptionBullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    ) : null}
                  </div>
                </details>
                <details className="group border-b border-[#E5E1DC] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] tracking-[0.15em] uppercase text-[#1A1A1A]">
                    Material & specifikationer
                    <span className="text-[16px] text-[#1A1A1A]/55 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#1A1A1A]/75">{detailSpecifications}</p>
                </details>
                <details className="group border-b border-[#E5E1DC] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] tracking-[0.15em] uppercase text-[#1A1A1A]">
                    Leverans & retur
                    <span className="text-[16px] text-[#1A1A1A]/55 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#1A1A1A]/75">{detailShippingReturns}</p>
                </details>
              </div>
            </aside>
          </div>
        </section>

        {/* Du kanske gillar */}
        <section className="mx-auto w-full max-w-[1480px] border-t border-[#E5E1DC] px-8 py-16 lg:px-14">
          <h2 className="text-[22px] font-light tracking-[-0.01em] text-[#1A1A1A] lg:text-[28px]">You may also like</h2>
          <div className="mt-8 grid gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1EA]">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveProductImageUrl(item.image_url) ?? ""} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
                  ) : null}
                </div>
                <div className="mt-4">
                  <p className="text-[14px] tracking-[0.02em] text-[#1A1A1A]">{item.title}</p>
                  <p className="mt-1 text-[14px] text-[#1A1A1A]">{formatMinorPrice(item.price_minor, item.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isSport) {
    // Nike.com-stil produktdetalj: stor bild vänster, ren info höger,
    // rundade pill-knappar, ramlöst, vit bakgrund, ljusgrå bildyta.
    const categoryLabel = relatedProducts[0]?.description?.split("—")[0]?.trim() ?? "";
    return (
      <main className="bg-white">
        <StorefrontHeader brandName={brandName} cartCount={2} />

        <section className="mx-auto w-full max-w-[1480px] px-6 pt-6 lg:px-10">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#757575]">
            <Link href="/" className="hover:underline">Hem</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:underline">Produkter</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111]">{product.title}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[60%_40%] lg:gap-10">
            {/* Vänster: stort 2-cols bildgalleri (Nike-stil) */}
            <SportProductGallery title={product.title} images={orderedImages} />

            {/* Höger: STICKY produktinfo (Nike-pattern) */}
            <aside className="lg:sticky lg:top-6 lg:self-start lg:pt-2">
              {categoryLabel ? (
                <p className="text-[15px] text-[#f5402c]">{categoryLabel}</p>
              ) : null}
              <h1 className="mt-1 text-[24px] font-medium leading-tight text-[#111] lg:text-[28px]">
                {product.title}
              </h1>
              {product.description ? (
                <p className="mt-1 text-[15px] text-[#757575]">{product.description}</p>
              ) : null}

              <p className="mt-5 text-[18px] font-medium text-[#111]">
                {formatMinorPrice(product.price_minor, product.currency)}
              </p>

              <div className="mt-6">
                <ProductPurchaseControls
                  productId={product.id}
                  title={product.title}
                  priceMinor={product.price_minor}
                  currency={product.currency}
                  productColors={product.product_colors}
                  productMaterials={product.product_materials}
                  productSizes={product.product_sizes}
                  availableStock={availableStock}
                />
              </div>

              <div className="mt-4 flex justify-center">
                <FavoriteToggle
                  productId={product.id}
                  initialFavorited={favoriteIds.has(product.id)}
                  label="Lägg till i favoriter"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#111] text-[15px] font-medium text-[#111] transition hover:bg-[#f5f5f5]"
                  activeClassName="text-[#f5402c]"
                  inactiveClassName="text-[#111]"
                />
              </div>

              {/* Beskrivning */}
              <div className="mt-10 space-y-6 border-t border-[#e5e5e5] pt-8">
                <div>
                  <h2 className="text-[18px] font-medium text-[#111]">{detailTabLabels.description}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#111]">{detailDescriptionIntro}</p>
                  <ul className="mt-4 space-y-2 text-[15px] text-[#111]">
                    {detailDescriptionBullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#111]" />{bullet}</li>
                    ))}
                  </ul>
                </div>

                <details className="border-t border-[#e5e5e5] pt-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[18px] font-medium text-[#111]">
                    {detailTabLabels.shipping}
                    <span className="text-[24px] text-[#757575]">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#111]">{detailShippingReturns}</p>
                </details>

                <details className="border-t border-[#e5e5e5] pt-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[18px] font-medium text-[#111]">
                    {detailTabLabels.reviews}
                    <span className="text-[24px] text-[#757575]">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#111]">{detailReviews}</p>
                </details>
              </div>
            </aside>
          </div>
        </section>

        {/* Du kanske också gillar */}
        <section className="mx-auto w-full max-w-[1480px] border-t border-[#e5e5e5] px-6 py-14 lg:px-10">
          <h2 className="text-[22px] font-medium text-[#111] lg:text-[26px]">Du kanske också gillar</h2>
          <div className="mt-6 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="group flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveProductImageUrl(item.image_url) ?? ""} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  ) : null}
                  <FavoriteToggle
                    productId={item.id}
                    initialFavorited={favoriteIds.has(item.id)}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-sm transition hover:bg-[#f5f5f5]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-[15px] font-medium text-[#111]">{item.title}</p>
                  <p className="mt-1 text-[15px] font-medium text-[#111]">
                    {formatMinorPrice(item.price_minor, item.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isFullPage) {
    return (
      <main style={{ background: shellBackground }}>
        <StorefrontHeader brandName={brandName} cartCount={2} />
        <div className="mx-auto w-full max-w-[1380px] px-4 py-6 sm:px-6">
          {productContent}
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: shellBackground }}>
      <section className="mx-auto w-full max-w-[1380px] px-4 pt-2 sm:px-5">
        <div
          className="overflow-hidden rounded-[18px] border bg-white shadow-[0_6px_24px_rgba(21,17,12,0.06)]"
          style={{ borderColor: shellBorder }}
        >
          <StorefrontHeader brandName={brandName} cartCount={2} />
          {productContent}
        </div>
      </section>
    </main>
  );
}
