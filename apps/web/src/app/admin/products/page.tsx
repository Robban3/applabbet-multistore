import { formatMinorPrice } from "@/lib/format";
import Link from "next/link";
import { AdminTextEditor } from "@/components/admin-text-editor";
import { ProductGalleryOrderEditor } from "@/components/product-gallery-order-editor";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventoryLevel, Product, ProductCategory, Warehouse } from "@/types/commerce";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PRODUCT_IMAGE_BUCKET = "product-images";

const DEFAULT_DETAIL_TAB_LABEL_DESCRIPTION = "BESKRIVNING";
const DEFAULT_DETAIL_TAB_LABEL_SPECIFICATIONS = "SPECIFIKATIONER";
const DEFAULT_DETAIL_TAB_LABEL_SHIPPING = "LEVERANS & RETURER";
const DEFAULT_DETAIL_TAB_LABEL_REVIEWS = "RECENSIONER (84)";
const DEFAULT_DETAIL_DESCRIPTION_INTRO =
  "Trail Grip X är en exklusiv klocka skapad för dig som värdesätter kvalitet, stil och funktion i varje detalj.";
const DEFAULT_DETAIL_DESCRIPTION_BULLETS = [
  "Japanskt quartz-urverk för maximal precision",
  "Safirglas som är reptåligt och hållbart",
  "Vattentät upp till 50 meter",
  "Äkta läderarmband med bekväm passform",
];
const DEFAULT_DETAIL_SPECIFICATIONS =
  "Material: Rostfritt stål. Glas: Safirglas. Urverk: Japanskt quartz. Vattentäthet: 50 meter.";
const DEFAULT_DETAIL_SHIPPING_RETURNS =
  "Fri frakt över 499 kr. Leverans 1-3 arbetsdagar. 30 dagars öppet köp och smidig returhantering.";
const DEFAULT_DETAIL_REVIEWS =
  "Kunderna uppskattar framför allt kvalitet, passform och den tidlösa designen. Snittbetyg: 4.8 av 5.";

function parseProductFeaturesInput(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function parseLinesInput(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function dedupeOrderedStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function getMissingColumnName(errorMessage: string): string | null {
  const match = errorMessage.match(/column "([^"]+)"/i);
  return match?.[1] || null;
}

async function insertProductWithSchemaFallback(
  supabaseAction: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  payload: Record<string, unknown>,
): Promise<string | null> {
  const workingPayload: Record<string, unknown> = { ...payload };
  for (let attempts = 0; attempts < 12; attempts += 1) {
    const { data, error } = await supabaseAction
      .from("products")
      .insert(workingPayload)
      .select("id")
      .single();
    if (!error) {
      return String(data?.id || "");
    }
    const missingColumn = getMissingColumnName(error.message || "");
    if (missingColumn && Object.prototype.hasOwnProperty.call(workingPayload, missingColumn)) {
      delete workingPayload[missingColumn];
      continue;
    }
    return null;
  }
  return null;
}

async function updateProductWithSchemaFallback(
  supabaseAction: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  tenantId: string,
  productId: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const workingPayload: Record<string, unknown> = { ...payload };
  for (let attempts = 0; attempts < 12; attempts += 1) {
    const { error } = await supabaseAction
      .from("products")
      .update(workingPayload)
      .eq("tenant_id", tenantId)
      .eq("id", productId);
    if (!error) {
      return true;
    }
    const missingColumn = getMissingColumnName(error.message || "");
    if (missingColumn && Object.prototype.hasOwnProperty.call(workingPayload, missingColumn)) {
      delete workingPayload[missingColumn];
      continue;
    }
    return false;
  }
  return false;
}

async function uploadProductImages(params: {
  tenantId: string;
  slug: string;
  files: File[];
}): Promise<string[]> {
  if (params.files.length === 0) return [];
  const admin = createSupabaseAdminClient();
  await admin.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  }).catch(() => undefined);
  await admin.storage.updateBucket(PRODUCT_IMAGE_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  }).catch(() => undefined);

  const uploadedUrls: string[] = [];
  for (const file of params.files) {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${params.tenantId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${params.slug}.${ext}`;
    const { error } = await admin.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });
    if (!error) {
      const { data: publicData } = admin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
      uploadedUrls.push(publicData.publicUrl);
    }
  }
  return uploadedUrls;
}

export default async function AdminProductsPage() {
  const access = await requireAdminAccess("/admin/products");

  if (access.status === "tenant_missing") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Ingen tenant hittades for host. Kontrollera tenant_domains.
      </p>
    );
  }

  if (access.status === "forbidden") {
    return (
      <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Ditt konto har inte åtkomst till den här adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: productsWithTabs, error: productsWithTabsError } = await supabase
    .from("products")
    .select("id, tenant_id, category_id, brand, is_new, is_best_seller_manual, product_features, product_colors, product_materials, product_sizes, product_gallery_images, detail_tab_label_description, detail_tab_label_specifications, detail_tab_label_shipping, detail_tab_label_reviews, detail_description_intro, detail_description_bullets, detail_specifications, detail_shipping_returns, detail_reviews, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", access.tenant.id)
    .order("created_at", { ascending: false });
  const { data: productsBase } =
    productsWithTabsError
      ? await supabase
          .from("products")
          .select("id, tenant_id, category_id, brand, is_new, product_features, product_colors, product_materials, slug, title, description, image_url, price_minor, currency, status")
          .eq("tenant_id", access.tenant.id)
          .order("created_at", { ascending: false })
      : { data: null };

  const products = ((productsWithTabs || productsBase) || []) as Product[];
  const { data: categoriesData } = await supabase
    .from("product_categories")
    .select("id, tenant_id, slug, name, description")
    .eq("tenant_id", access.tenant.id)
    .order("name", { ascending: true });
  const categories = (categoriesData || []) as ProductCategory[];
  const { data: warehousesData } = await supabase
    .from("warehouses")
    .select("id, tenant_id, name, code, address_line1, postal_code, city, country, is_default")
    .eq("tenant_id", access.tenant.id)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });
  const warehouses = (warehousesData || []) as Warehouse[];
  const defaultWarehouse = warehouses.find((warehouse) => warehouse.is_default) || warehouses[0] || null;

  let inventoryByProduct = new Map<string, InventoryLevel>();
  if (defaultWarehouse) {
    const { data: inventoryData } = await supabase
      .from("inventory_levels")
      .select("id, tenant_id, product_id, warehouse_id, on_hand_quantity, reserved_quantity, reorder_point")
      .eq("tenant_id", access.tenant.id)
      .eq("warehouse_id", defaultWarehouse.id);
    inventoryByProduct = new Map(
      ((inventoryData || []) as InventoryLevel[]).map((row) => [row.product_id, row]),
    );
  }

  async function createCategoryAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const name = String(formData.get("name") || "").trim();
    const providedSlug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const slug = (providedSlug || name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!name || !slug) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("product_categories").upsert(
      {
        tenant_id: accessAction.tenant.id,
        name,
        slug,
        description: description || null,
      },
      { onConflict: "tenant_id,slug" },
    );

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/sok");
  }

  async function deleteCategoryAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction
      .from("product_categories")
      .delete()
      .eq("tenant_id", accessAction.tenant.id)
      .eq("id", id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/sok");
  }

  async function updateCategoryAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const id = String(formData.get("id") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const providedSlug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const slug = (providedSlug || name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!id || !name || !slug) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction
      .from("product_categories")
      .update({
        name,
        slug,
        description: description || null,
      })
      .eq("tenant_id", accessAction.tenant.id)
      .eq("id", id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/sok");
  }

  async function createProductAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const title = String(formData.get("title") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");
    const isNew = formData.get("is_new") === "on";
    const isBestSellerManual = formData.get("is_best_seller_manual") === "on";
    const priceMinor = Number(formData.get("price_minor") || 0);
    const currency = String(formData.get("currency") || "SEK").trim().toUpperCase();
    const brand = String(formData.get("brand") || "").trim();
    const featuresInput = String(formData.get("product_features") || "").trim();
    const productFeatures = parseProductFeaturesInput(featuresInput);
    const colorsInput = String(formData.get("product_colors") || "").trim();
    const productColors = parseProductFeaturesInput(colorsInput);
    const materialsInput = String(formData.get("product_materials") || "").trim();
    const productMaterials = parseProductFeaturesInput(materialsInput);
    const sizesInput = String(formData.get("product_sizes") || "").trim();
    const productSizes = parseProductFeaturesInput(sizesInput);
    const detailTabLabelDescription =
      String(formData.get("detail_tab_label_description") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_DESCRIPTION;
    const detailTabLabelSpecifications =
      String(formData.get("detail_tab_label_specifications") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_SPECIFICATIONS;
    const detailTabLabelShipping =
      String(formData.get("detail_tab_label_shipping") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_SHIPPING;
    const detailTabLabelReviews =
      String(formData.get("detail_tab_label_reviews") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_REVIEWS;
    const detailDescriptionIntro =
      String(formData.get("detail_description_intro") || "").trim() || DEFAULT_DETAIL_DESCRIPTION_INTRO;
    const detailDescriptionBulletsInput = String(formData.get("detail_description_bullets") || "");
    const detailDescriptionBullets = parseLinesInput(detailDescriptionBulletsInput);
    const detailSpecifications =
      String(formData.get("detail_specifications") || "").trim() || DEFAULT_DETAIL_SPECIFICATIONS;
    const detailShippingReturns =
      String(formData.get("detail_shipping_returns") || "").trim() || DEFAULT_DETAIL_SHIPPING_RETURNS;
    const detailReviews =
      String(formData.get("detail_reviews") || "").trim() || DEFAULT_DETAIL_REVIEWS;
    const imageUrlInput = String(formData.get("image_url") || "").trim();
    const existingImageUrl = String(formData.get("existing_image_url") || "").trim();
    const galleryInput = String(formData.get("product_gallery_images") || "");
    const galleryFromInput = parseLinesInput(galleryInput);
    const imageFile = formData.get("image_file");
    const imageFiles = [
      ...formData
        .getAll("image_files")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0),
      ...(imageFile instanceof File && imageFile.size > 0 ? [imageFile] : []),
    ];
    const categoryId = String(formData.get("category_id") || "").trim();
    const initialStock = Math.max(0, Number(formData.get("initial_stock") || 0));

    if (!title || !slug || Number.isNaN(priceMinor) || priceMinor < 0) return;

    const uploadedImageUrls = await uploadProductImages({
      tenantId: accessAction.tenant.id,
      slug,
      files: imageFiles,
    });
    const galleryImages = dedupeOrderedStrings([...galleryFromInput, ...uploadedImageUrls]);
    const imageUrl = galleryImages[0] || imageUrlInput || existingImageUrl || null;
    const productGalleryImages = galleryImages.length > 0
      ? galleryImages
      : imageUrl
        ? [imageUrl]
        : [];

    const supabaseAction = await createSupabaseServerClient();
    const createdProductId = await insertProductWithSchemaFallback(supabaseAction, {
      tenant_id: accessAction.tenant.id,
      title,
      slug,
      description,
      status: status === "published" || status === "archived" ? status : "draft",
      is_new: isNew,
      is_best_seller_manual: isBestSellerManual,
      price_minor: priceMinor,
      currency: currency || "SEK",
      brand: brand || null,
      product_features: productFeatures,
      product_colors: productColors,
      product_materials: productMaterials,
      product_sizes: productSizes,
      product_gallery_images: productGalleryImages,
      detail_tab_label_description: detailTabLabelDescription,
      detail_tab_label_specifications: detailTabLabelSpecifications,
      detail_tab_label_shipping: detailTabLabelShipping,
      detail_tab_label_reviews: detailTabLabelReviews,
      detail_description_intro: detailDescriptionIntro,
      detail_description_bullets:
        detailDescriptionBullets.length > 0 ? detailDescriptionBullets : DEFAULT_DETAIL_DESCRIPTION_BULLETS,
      detail_specifications: detailSpecifications,
      detail_shipping_returns: detailShippingReturns,
      detail_reviews: detailReviews,
      image_url: imageUrl,
      category_id: categoryId || null,
      });

    const { data: defaultWarehouseData } = await supabaseAction
      .from("warehouses")
      .select("id")
      .eq("tenant_id", accessAction.tenant.id)
      .order("is_default", { ascending: false })
      .order("name", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (createdProductId && defaultWarehouseData?.id) {
      await supabaseAction.from("inventory_levels").upsert(
        {
          tenant_id: accessAction.tenant.id,
          product_id: createdProductId,
          warehouse_id: defaultWarehouseData.id as string,
          on_hand_quantity: initialStock,
        },
        { onConflict: "tenant_id,product_id,warehouse_id" },
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/bastsaljare");
    revalidatePath("/sok");
    redirect("/admin/products");
  }

  async function updateProductAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    const title = String(formData.get("title") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");
    const isNew = formData.get("is_new") === "on";
    const isBestSellerManual = formData.get("is_best_seller_manual") === "on";
    const priceMinor = Number(formData.get("price_minor") || 0);
    const currency = String(formData.get("currency") || "SEK").trim().toUpperCase();
    const brand = String(formData.get("brand") || "").trim();
    const featuresInput = String(formData.get("product_features") || "").trim();
    const productFeatures = parseProductFeaturesInput(featuresInput);
    const colorsInput = String(formData.get("product_colors") || "").trim();
    const productColors = parseProductFeaturesInput(colorsInput);
    const materialsInput = String(formData.get("product_materials") || "").trim();
    const productMaterials = parseProductFeaturesInput(materialsInput);
    const sizesInput = String(formData.get("product_sizes") || "").trim();
    const productSizes = parseProductFeaturesInput(sizesInput);
    const detailTabLabelDescription =
      String(formData.get("detail_tab_label_description") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_DESCRIPTION;
    const detailTabLabelSpecifications =
      String(formData.get("detail_tab_label_specifications") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_SPECIFICATIONS;
    const detailTabLabelShipping =
      String(formData.get("detail_tab_label_shipping") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_SHIPPING;
    const detailTabLabelReviews =
      String(formData.get("detail_tab_label_reviews") || "").trim() || DEFAULT_DETAIL_TAB_LABEL_REVIEWS;
    const detailDescriptionIntro =
      String(formData.get("detail_description_intro") || "").trim() || DEFAULT_DETAIL_DESCRIPTION_INTRO;
    const detailDescriptionBulletsInput = String(formData.get("detail_description_bullets") || "");
    const detailDescriptionBullets = parseLinesInput(detailDescriptionBulletsInput);
    const detailSpecifications =
      String(formData.get("detail_specifications") || "").trim() || DEFAULT_DETAIL_SPECIFICATIONS;
    const detailShippingReturns =
      String(formData.get("detail_shipping_returns") || "").trim() || DEFAULT_DETAIL_SHIPPING_RETURNS;
    const detailReviews =
      String(formData.get("detail_reviews") || "").trim() || DEFAULT_DETAIL_REVIEWS;
    const imageUrlInput = String(formData.get("image_url") || "").trim();
    const galleryInput = String(formData.get("product_gallery_images") || "");
    const galleryFromInput = parseLinesInput(galleryInput);
    const imageFile = formData.get("image_file");
    const imageFiles = [
      ...formData
        .getAll("image_files")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0),
      ...(imageFile instanceof File && imageFile.size > 0 ? [imageFile] : []),
    ];
    const categoryId = String(formData.get("category_id") || "").trim();
    const stockQuantity = Math.max(0, Number(formData.get("stock_quantity") || 0));

    if (!title || !slug || Number.isNaN(priceMinor) || priceMinor < 0) return;

    const uploadedImageUrls = await uploadProductImages({
      tenantId: accessAction.tenant.id,
      slug,
      files: imageFiles,
    });
    const galleryImages = dedupeOrderedStrings([...galleryFromInput, ...uploadedImageUrls]);
    const imageUrl = galleryImages[0] || imageUrlInput || null;
    const productGalleryImages = galleryImages.length > 0
      ? galleryImages
      : imageUrl
        ? [imageUrl]
        : [];

    const supabaseAction = await createSupabaseServerClient();
    await updateProductWithSchemaFallback(
      supabaseAction,
      accessAction.tenant.id,
      id,
      {
        title,
        slug,
        description,
        status: status === "published" || status === "archived" ? status : "draft",
        is_new: isNew,
        is_best_seller_manual: isBestSellerManual,
        price_minor: priceMinor,
        currency: currency || "SEK",
        brand: brand || null,
        product_features: productFeatures,
        product_colors: productColors,
        product_materials: productMaterials,
        product_sizes: productSizes,
        product_gallery_images: productGalleryImages,
        detail_tab_label_description: detailTabLabelDescription,
        detail_tab_label_specifications: detailTabLabelSpecifications,
        detail_tab_label_shipping: detailTabLabelShipping,
        detail_tab_label_reviews: detailTabLabelReviews,
        detail_description_intro: detailDescriptionIntro,
        detail_description_bullets:
          detailDescriptionBullets.length > 0 ? detailDescriptionBullets : DEFAULT_DETAIL_DESCRIPTION_BULLETS,
        detail_specifications: detailSpecifications,
        detail_shipping_returns: detailShippingReturns,
        detail_reviews: detailReviews,
        image_url: imageUrl,
        category_id: categoryId || null,
      },
    );

    const { data: defaultWarehouseData } = await supabaseAction
      .from("warehouses")
      .select("id")
      .eq("tenant_id", accessAction.tenant.id)
      .order("is_default", { ascending: false })
      .order("name", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (defaultWarehouseData?.id) {
      await supabaseAction.from("inventory_levels").upsert(
        {
          tenant_id: accessAction.tenant.id,
          product_id: id,
          warehouse_id: defaultWarehouseData.id as string,
          on_hand_quantity: stockQuantity,
        },
        { onConflict: "tenant_id,product_id,warehouse_id" },
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/bastsaljare");
    revalidatePath("/sok");
  }

  async function deleteProductAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const id = String(formData.get("id") || "").trim();
    if (!id) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction
      .from("products")
      .delete()
      .eq("tenant_id", accessAction.tenant.id)
      .eq("id", id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/bastsaljare");
    revalidatePath("/sok");
  }

  return (
    <div className="space-y-4">
      <details className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 hover:bg-slate-50">
          <span className="text-sm font-semibold text-slate-900">Kategorier ({categories.length})</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-700">
            <span className="text-base leading-none group-open:hidden">{">"}</span>
            <span className="hidden text-base leading-none group-open:inline">^</span>
          </span>
        </summary>
        <div className="border-t border-slate-200 p-5">
          <p className="text-sm text-slate-600">Skapa kategorier och koppla sedan produkter till vald kategori.</p>
          <form action={createCategoryAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Namn</span>
              <input name="name" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Slug (valfri)</span>
              <input name="slug" placeholder="auto-fran-namn" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <AdminTextEditor
              name="description"
              label="Beskrivning"
              rows={4}
              placeholder="Kort text om kategorin..."
              className="md:col-span-2"
            />
            <div className="self-end md:col-span-2">
              <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Skapa kategori
              </button>
            </div>
          </form>
          <div className="mt-4 space-y-2">
            {categories.map((category) => (
              <details key={category.id} className="rounded-md border border-slate-200 bg-white">
                <summary className="cursor-pointer list-none px-3 py-2 hover:bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.slug}</p>
                </summary>
                <div className="border-t border-slate-200 p-3">
                  <form action={updateCategoryAction} className="grid gap-2 md:grid-cols-2">
                    <input type="hidden" name="id" value={category.id} />
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Namn</span>
                      <input name="name" defaultValue={category.name} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Slug</span>
                      <input name="slug" defaultValue={category.slug} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <AdminTextEditor
                      name="description"
                      label="Beskrivning"
                      defaultValue={category.description || ""}
                      rows={4}
                      className="md:col-span-2"
                    />
                    <div className="md:col-span-2 flex items-center gap-2">
                      <button type="submit" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                        Spara kategori
                      </button>
                    </div>
                  </form>
                  <form action={deleteCategoryAction} className="mt-2">
                    <input type="hidden" name="id" value={category.id} />
                    <button type="submit" className="text-xs text-rose-600 hover:text-rose-700">
                      Ta bort
                    </button>
                  </form>
                </div>
              </details>
            ))}
            {categories.length === 0 ? <p className="text-sm text-slate-500">Inga kategorier skapade ännu.</p> : null}
          </div>
        </div>
      </details>

      <details className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 hover:bg-slate-50">
          <span className="text-sm font-semibold text-slate-900">+ Produkt</span>
          <span className="text-xs text-slate-500 group-open:hidden">Öppna</span>
          <span className="hidden text-xs text-slate-500 group-open:inline">Stäng</span>
        </summary>
        <div className="border-t border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Ny produkt · {access.tenant.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ladda upp produkter med text, pris, länkbar slug, bild och startsaldo i lager.
          </p>
          {!defaultWarehouse ? (
            <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Skapa ett lagerställe först under{" "}
              <Link href="/admin/logistics" className="underline">
                Logistik & lager
              </Link>{" "}
              för att kunna sätta lagersaldo.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Standardsaldo sparas i lager: <span className="font-semibold">{defaultWarehouse.name}</span>
            </p>
          )}
          <form action={createProductAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">1. Grundinformation</p>
            <p className="text-xs text-slate-600">Namn, slug, pris och basdata för produkten.</p>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Titel</span>
            <input name="title" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Slug</span>
            <input name="slug" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <AdminTextEditor
            name="description"
            label="Beskrivning"
            rows={6}
            className="md:col-span-2"
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Pris (minor)</span>
            <input name="price_minor" type="number" min={0} defaultValue={0} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Valuta</span>
            <input name="currency" defaultValue="SEK" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Varumärke (valfri)</span>
            <input name="brand" placeholder="t.ex. Nike" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">2. Varianter</p>
            <p className="text-xs text-slate-600">Egenskaper som kunden ska kunna välja (färg, material, storlek).</p>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Egenskaper (komma-separerat)</span>
            <input
              name="product_features"
              placeholder="t.ex. Trådlös, Brusreducering, Mikrofon"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Färger (komma-separerat)</span>
            <input
              name="product_colors"
              placeholder="t.ex. Svart, Vit, Blå"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Armband/material (komma-separerat)</span>
            <input
              name="product_materials"
              placeholder="t.ex. Läder, Stål"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Storlekar (komma-separerat)</span>
            <input
              name="product_sizes"
              placeholder="t.ex. XS, S, M, L, XL eller 38, 39, 40"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-sm font-semibold text-slate-800">Produktflikar (produktdetalj)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Tabb 1 label</span>
                <input
                  name="detail_tab_label_description"
                  defaultValue={DEFAULT_DETAIL_TAB_LABEL_DESCRIPTION}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Tabb 2 label</span>
                <input
                  name="detail_tab_label_specifications"
                  defaultValue={DEFAULT_DETAIL_TAB_LABEL_SPECIFICATIONS}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Tabb 3 label</span>
                <input
                  name="detail_tab_label_shipping"
                  defaultValue={DEFAULT_DETAIL_TAB_LABEL_SHIPPING}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Tabb 4 label</span>
                <input
                  name="detail_tab_label_reviews"
                  defaultValue={DEFAULT_DETAIL_TAB_LABEL_REVIEWS}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Beskrivning intro</span>
                <textarea
                  name="detail_description_intro"
                  rows={2}
                  defaultValue={DEFAULT_DETAIL_DESCRIPTION_INTRO}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Beskrivning bullets (en rad per punkt)</span>
                <textarea
                  name="detail_description_bullets"
                  rows={4}
                  defaultValue={DEFAULT_DETAIL_DESCRIPTION_BULLETS.join("\n")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Specifikationer</span>
                <textarea
                  name="detail_specifications"
                  rows={3}
                  defaultValue={DEFAULT_DETAIL_SPECIFICATIONS}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Leverans & returer</span>
                <textarea
                  name="detail_shipping_returns"
                  rows={3}
                  defaultValue={DEFAULT_DETAIL_SHIPPING_RETURNS}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Recensioner</span>
                <textarea
                  name="detail_reviews"
                  rows={3}
                  defaultValue={DEFAULT_DETAIL_REVIEWS}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
          <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">3. Publicering, kategori och lager</p>
            <p className="text-xs text-slate-600">Styr om produkten är publicerad och hur mycket som finns i lager.</p>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
            <select name="status" defaultValue="draft" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
            <input type="checkbox" name="is_new" />
            Markera som nyhet
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
            <input type="checkbox" name="is_best_seller_manual" />
            Markera manuellt som bästsäljare
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Kategori</span>
            <select name="category_id" defaultValue="" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Ingen kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Startsaldo i lager</span>
            <input
              name="initial_stock"
              type="number"
              min={0}
              defaultValue={0}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">4. Bilder</p>
            <p className="text-xs text-slate-600">Sortera bilder med drag-and-drop och ladda upp flera samtidigt.</p>
          </div>
          <div className="md:col-span-2">
            <ProductGalleryOrderEditor
              name="product_gallery_images"
              initialUrls={[]}
            />
          </div>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Ladda upp flera bilder (valfri)</span>
            <input name="image_files" type="file" accept="image/*" multiple className="w-full rounded-md border border-slate-300 p-2 text-sm" />
          </label>
            <div className="md:col-span-2">
              <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Skapa produkt
              </button>
            </div>
          </form>
        </div>
      </details>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Produkter ({products.length})</h2>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <details key={product.id} className="group overflow-hidden rounded-lg border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{product.title}</p>
                  <p className="text-xs text-slate-500">{product.slug}</p>
                </div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-700">
                  <span className="text-base leading-none group-open:hidden">{">"}</span>
                  <span className="hidden text-base leading-none group-open:inline">^</span>
                </span>
              </summary>
              <div className="border-t border-slate-200 p-3">
                <form action={updateProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="existing_image_url" value={product.image_url || ""} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">Grundinformation</p>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Titel</span>
                      <input name="title" defaultValue={product.title} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Slug</span>
                      <input name="slug" defaultValue={product.slug} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <AdminTextEditor
                      name="description"
                      label="Beskrivning"
                      defaultValue={product.description}
                      rows={5}
                      className="md:col-span-2"
                    />
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Pris (minor)</span>
                      <input name="price_minor" type="number" min={0} defaultValue={product.price_minor} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Valuta</span>
                      <input name="currency" defaultValue={product.currency} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Varumärke</span>
                      <input name="brand" defaultValue={product.brand || ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                    </label>
                    <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">Varianter</p>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Egenskaper (komma-separerat)</span>
                      <input
                        name="product_features"
                        defaultValue={(product.product_features || []).join(", ")}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Färger (komma-separerat)</span>
                      <input
                        name="product_colors"
                        defaultValue={(product.product_colors || []).join(", ")}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Armband/material (komma-separerat)</span>
                      <input
                        name="product_materials"
                        defaultValue={(product.product_materials || []).join(", ")}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Storlekar (komma-separerat)</span>
                      <input
                        name="product_sizes"
                        defaultValue={(product.product_sizes || []).join(", ")}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-sm font-semibold text-slate-800">Produktflikar (produktdetalj)</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Tabb 1 label</span>
                          <input
                            name="detail_tab_label_description"
                            defaultValue={product.detail_tab_label_description || DEFAULT_DETAIL_TAB_LABEL_DESCRIPTION}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Tabb 2 label</span>
                          <input
                            name="detail_tab_label_specifications"
                            defaultValue={product.detail_tab_label_specifications || DEFAULT_DETAIL_TAB_LABEL_SPECIFICATIONS}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Tabb 3 label</span>
                          <input
                            name="detail_tab_label_shipping"
                            defaultValue={product.detail_tab_label_shipping || DEFAULT_DETAIL_TAB_LABEL_SHIPPING}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Tabb 4 label</span>
                          <input
                            name="detail_tab_label_reviews"
                            defaultValue={product.detail_tab_label_reviews || DEFAULT_DETAIL_TAB_LABEL_REVIEWS}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Beskrivning intro</span>
                          <textarea
                            name="detail_description_intro"
                            rows={2}
                            defaultValue={product.detail_description_intro || DEFAULT_DETAIL_DESCRIPTION_INTRO}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Beskrivning bullets (en rad per punkt)</span>
                          <textarea
                            name="detail_description_bullets"
                            rows={4}
                            defaultValue={(product.detail_description_bullets || DEFAULT_DETAIL_DESCRIPTION_BULLETS).join("\n")}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Specifikationer</span>
                          <textarea
                            name="detail_specifications"
                            rows={3}
                            defaultValue={product.detail_specifications || DEFAULT_DETAIL_SPECIFICATIONS}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Leverans & returer</span>
                          <textarea
                            name="detail_shipping_returns"
                            rows={3}
                            defaultValue={product.detail_shipping_returns || DEFAULT_DETAIL_SHIPPING_RETURNS}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-slate-600">Recensioner</span>
                          <textarea
                            name="detail_reviews"
                            rows={3}
                            defaultValue={product.detail_reviews || DEFAULT_DETAIL_REVIEWS}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">Publicering och lager</p>
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Status</span>
                      <select name="status" defaultValue={product.status} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                      <input type="checkbox" name="is_new" defaultChecked={Boolean(product.is_new)} />
                      Markera som nyhet
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        name="is_best_seller_manual"
                        defaultChecked={Boolean(product.is_best_seller_manual)}
                      />
                      Markera manuellt som bästsäljare
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Kategori</span>
                      <select name="category_id" defaultValue={product.category_id || ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                        <option value="">Ingen kategori</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">Bilder</p>
                    </div>
                    <div className="md:col-span-2">
                      <ProductGalleryOrderEditor
                        name="product_gallery_images"
                        initialUrls={
                          product.product_gallery_images && product.product_gallery_images.length > 0
                            ? product.product_gallery_images
                            : product.image_url
                              ? [product.image_url]
                              : []
                        }
                        labelClassName="mb-1 block text-xs font-medium text-slate-600"
                      />
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Ladda upp flera bilder (valfri)</span>
                      <input name="image_files" type="file" accept="image/*" multiple className="w-full rounded-md border border-slate-300 p-2 text-sm" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">
                        Lagersaldo (standardlager)
                      </span>
                      <input
                        name="stock_quantity"
                        type="number"
                        min={0}
                        defaultValue={inventoryByProduct.get(product.id)?.on_hand_quantity ?? 0}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="submit" className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                      Spara
                    </button>
                    <p className="text-xs text-slate-500">
                      Nuvarande pris: {formatMinorPrice(product.price_minor, product.currency)}
                    </p>
                  </div>
                </form>
                <form action={deleteProductAction} className="mt-2">
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="inline-flex rounded-md border border-rose-300 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50">
                    Ta bort
                  </button>
                </form>
              </div>
            </details>
          ))}
          {products.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Inga produkter hittades.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
