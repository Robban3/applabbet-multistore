import { formatMinorPrice } from "@/lib/format";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types/commerce";
import { revalidatePath } from "next/cache";

const PRODUCT_IMAGE_BUCKET = "product-images";

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
        Ditt konto har inte access till den har adminpanelen.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, tenant_id, category_id, brand, is_new, product_features, product_colors, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", access.tenant.id)
    .order("created_at", { ascending: false });

  const products = (data || []) as Product[];
  const { data: categoriesData } = await supabase
    .from("product_categories")
    .select("id, tenant_id, slug, name")
    .eq("tenant_id", access.tenant.id)
    .order("name", { ascending: true });
  const categories = (categoriesData || []) as ProductCategory[];

  async function createCategoryAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const name = String(formData.get("name") || "").trim();
    const providedSlug = String(formData.get("slug") || "").trim();
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
      },
      { onConflict: "tenant_id,slug", ignoreDuplicates: true },
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

  async function createProductAction(formData: FormData) {
    "use server";

    const accessAction = await requireAdminAccess("/admin/products");
    if (accessAction.status !== "allowed") return;

    const title = String(formData.get("title") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");
    const isNew = formData.get("is_new") === "on";
    const priceMinor = Number(formData.get("price_minor") || 0);
    const currency = String(formData.get("currency") || "SEK").trim().toUpperCase();
    const brand = String(formData.get("brand") || "").trim();
    const featuresInput = String(formData.get("product_features") || "").trim();
    const productFeatures = parseProductFeaturesInput(featuresInput);
    const colorsInput = String(formData.get("product_colors") || "").trim();
    const productColors = parseProductFeaturesInput(colorsInput);
    const imageUrlInput = String(formData.get("image_url") || "").trim();
    const imageFile = formData.get("image_file");
    const categoryId = String(formData.get("category_id") || "").trim();

    if (!title || !slug || Number.isNaN(priceMinor) || priceMinor < 0) return;

    let imageUrl = imageUrlInput || null;
    if (imageFile instanceof File && imageFile.size > 0) {
      const ext = imageFile.name.includes(".") ? imageFile.name.split(".").pop() : "jpg";
      const path = `${accessAction.tenant.id}/${Date.now()}-${slug}.${ext}`;
      const admin = createSupabaseAdminClient();

      await admin.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
      }).catch(() => undefined);

      const { error } = await admin.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, imageFile, {
        contentType: imageFile.type || "image/jpeg",
        upsert: true,
      });
      if (!error) {
        const { data: publicData } = admin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
        imageUrl = publicData.publicUrl;
      }
    }

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction.from("products").insert({
      tenant_id: accessAction.tenant.id,
      title,
      slug,
      description,
      status: status === "published" || status === "archived" ? status : "draft",
      is_new: isNew,
      price_minor: priceMinor,
      currency: currency || "SEK",
      brand: brand || null,
      product_features: productFeatures,
      product_colors: productColors,
      image_url: imageUrl,
      category_id: categoryId || null,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/sok");
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
    const priceMinor = Number(formData.get("price_minor") || 0);
    const currency = String(formData.get("currency") || "SEK").trim().toUpperCase();
    const brand = String(formData.get("brand") || "").trim();
    const featuresInput = String(formData.get("product_features") || "").trim();
    const productFeatures = parseProductFeaturesInput(featuresInput);
    const colorsInput = String(formData.get("product_colors") || "").trim();
    const productColors = parseProductFeaturesInput(colorsInput);
    const imageUrl = String(formData.get("image_url") || "").trim();
    const categoryId = String(formData.get("category_id") || "").trim();

    if (!title || !slug || Number.isNaN(priceMinor) || priceMinor < 0) return;

    const supabaseAction = await createSupabaseServerClient();
    await supabaseAction
      .from("products")
      .update({
        title,
        slug,
        description,
        status: status === "published" || status === "archived" ? status : "draft",
        is_new: isNew,
        price_minor: priceMinor,
        currency: currency || "SEK",
        brand: brand || null,
        product_features: productFeatures,
        product_colors: productColors,
        image_url: imageUrl || null,
        category_id: categoryId || null,
      })
      .eq("tenant_id", accessAction.tenant.id)
      .eq("id", id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
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
    revalidatePath("/sok");
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Kategorier ({categories.length})</h2>
        <p className="mt-1 text-sm text-slate-600">Skapa kategorier och koppla sedan produkter till vald kategori.</p>
        <form action={createCategoryAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Namn</span>
            <input name="name" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Slug (valfri)</span>
            <input name="slug" placeholder="auto-fran-namn" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <div className="self-end">
            <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Skapa kategori
            </button>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <form key={category.id} action={deleteCategoryAction} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5">
              <input type="hidden" name="id" value={category.id} />
              <span className="text-sm text-slate-800">{category.name}</span>
              <button type="submit" className="text-xs text-rose-600 hover:text-rose-700">
                Ta bort
              </button>
            </form>
          ))}
          {categories.length === 0 ? <p className="text-sm text-slate-500">Inga kategorier skapade ännu.</p> : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ny produkt · {access.tenant.name}</h2>
        <p className="mt-1 text-sm text-slate-600">Ladda upp produkter med text, pris, länkbar slug och bild.</p>
        <form action={createProductAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Titel</span>
            <input name="title" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Slug</span>
            <input name="slug" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Beskrivning</span>
            <textarea name="description" rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
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
            <span className="mb-1 block text-sm font-medium text-slate-700">Bild URL (valfri)</span>
            <input name="image_url" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Ladda upp bild (valfri)</span>
            <input name="image_file" type="file" accept="image/*" className="w-full rounded-md border border-slate-300 p-2 text-sm" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Skapa produkt
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Produkter ({products.length})</h2>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg border border-slate-200 p-3">
              <form action={updateProductAction}>
                <input type="hidden" name="id" value={product.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Titel</span>
                    <input name="title" defaultValue={product.title} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Slug</span>
                    <input name="slug" defaultValue={product.slug} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Beskrivning</span>
                    <textarea name="description" rows={2} defaultValue={product.description} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                  </label>
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
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Bild URL</span>
                    <input name="image_url" defaultValue={product.image_url || ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
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
