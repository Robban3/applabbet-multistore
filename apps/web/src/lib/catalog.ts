import type { Product, ProductCategory } from "@/types/commerce";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CatalogSort = "relevance" | "price_asc" | "price_desc" | "newest";

export type CatalogQueryState = {
  q: string;
  categories: string[];
  brands: string[];
  features: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: CatalogSort;
  page: number;
  pageSize: number;
};

type SearchParamsInput = Record<string, string | string[] | undefined>;
type SupabaseAdminClient = ReturnType<typeof createSupabaseAdminClient>;

async function getBestSellerRanking(supabase: SupabaseAdminClient, tenantId: string) {
  const ranking = new Map<string, { soldQuantity: number; manual: boolean }>();

  const { data: manualRows } = await supabase
    .from("products")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("status", "published")
    .eq("is_best_seller_manual", true);

  for (const row of manualRows || []) {
    const productId = String(row.id || "");
    if (!productId) continue;
    ranking.set(productId, { soldQuantity: 0, manual: true });
  }

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1000);

  const paidOrderIds = (paidOrders || [])
    .map((row) => String(row.id || ""))
    .filter(Boolean);

  if (paidOrderIds.length > 0) {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("tenant_id", tenantId)
      .in("order_id", paidOrderIds);

    for (const row of orderItems || []) {
      const productId = String(row.product_id || "");
      if (!productId) continue;
      const quantity = Number(row.quantity || 0);
      if (!Number.isFinite(quantity) || quantity <= 0) continue;

      const current = ranking.get(productId) || { soldQuantity: 0, manual: false };
      ranking.set(productId, {
        soldQuantity: current.soldQuantity + quantity,
        manual: current.manual,
      });
    }
  }

  return ranking;
}

export function parseCatalogQuery(searchParams: SearchParamsInput): CatalogQueryState {
  const qRaw = getParam(searchParams.q);
  const categories = getParams(searchParams.category);
  const brands = getParams(searchParams.brand);
  const features = getParams(searchParams.feature);
  const colors = getParams(searchParams.color);
  const minPrice = parseMinor(getParam(searchParams.minPrice));
  const maxPrice = parseMinor(getParam(searchParams.maxPrice));
  const page = parsePositiveInt(getParam(searchParams.page), 1);
  const pageSize = parsePositiveInt(getParam(searchParams.pageSize), 12);
  const sort = parseSort(getParam(searchParams.sort));

  return {
    q: qRaw.trim(),
    categories,
    brands,
    features,
    colors,
    minPrice,
    maxPrice,
    sort,
    page,
    pageSize,
  };
}

export function queryToSearchParams(query: CatalogQueryState): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  for (const category of query.categories) params.append("category", category);
  for (const brand of query.brands) params.append("brand", brand);
  for (const feature of query.features) params.append("feature", feature);
  for (const color of query.colors) params.append("color", color);
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice));
  if (typeof query.maxPrice === "number") params.set("maxPrice", String(query.maxPrice));
  if (query.sort !== "relevance") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.pageSize !== 12) params.set("pageSize", String(query.pageSize));
  return params;
}

export async function getCatalogData(
  supabase: SupabaseAdminClient,
  tenantId: string,
  query: CatalogQueryState,
  options?: { onlyNew?: boolean; onlyBestSellers?: boolean },
): Promise<{
  items: Product[];
  total: number;
  totalPages: number;
  availableCategories: ProductCategory[];
  availableBrands: string[];
  availableFeatures: string[];
  availableColors: string[];
}> {
  const { data: categoriesData } = await supabase
    .from("product_categories")
    .select("id, tenant_id, slug, name, description")
    .eq("tenant_id", tenantId)
    .order("name", { ascending: true });
  const availableCategories = (categoriesData || []) as ProductCategory[];
  const { data: brandsData } = await supabase
    .from("products")
    .select("brand")
    .eq("tenant_id", tenantId)
    .eq("status", "published")
    .not("brand", "is", null);
  const availableBrands = Array.from(
    new Set((brandsData || []).map((row) => (row.brand || "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "sv"));
  const { data: featuresData } = await supabase
    .from("products")
    .select("product_features")
    .eq("tenant_id", tenantId)
    .eq("status", "published");
  const availableFeatures = Array.from(
    new Set(
      (featuresData || []).flatMap((row) => {
        const values = row.product_features;
        if (!Array.isArray(values)) return [];
        return values
          .map((value) => String(value).trim())
          .filter(Boolean);
      }),
    ),
  ).sort((a, b) => a.localeCompare(b, "sv"));
  const { data: colorsData } = await supabase
    .from("products")
    .select("product_colors")
    .eq("tenant_id", tenantId)
    .eq("status", "published");
  const availableColors = Array.from(
    new Set(
      (colorsData || []).flatMap((row) => {
        const values = row.product_colors;
        if (!Array.isArray(values)) return [];
        return values
          .map((value) => String(value).trim())
          .filter(Boolean);
      }),
    ),
  ).sort((a, b) => a.localeCompare(b, "sv"));

  let selectedCategoryIds: string[] = [];
  if (query.categories.length > 0) {
    const categoryLookup = new Set(query.categories.map((item) => item.trim().toLowerCase()).filter(Boolean));
    selectedCategoryIds = availableCategories
      .filter((category) => categoryLookup.has(category.name.toLowerCase()) || categoryLookup.has(category.slug.toLowerCase()))
      .map((category) => category.id);

    if (selectedCategoryIds.length === 0) {
      return {
        items: [],
        total: 0,
        totalPages: 1,
        availableCategories,
        availableBrands,
        availableFeatures,
        availableColors,
      };
    }
  }

  if (options?.onlyBestSellers) {
    const ranking = await getBestSellerRanking(supabase, tenantId);
    const bestSellerIds = Array.from(ranking.entries())
      .filter(([, value]) => value.manual || value.soldQuantity > 0)
      .map(([id]) => id);

    if (bestSellerIds.length === 0) {
      return {
        items: [],
        total: 0,
        totalPages: 1,
        availableCategories,
        availableBrands,
        availableFeatures,
        availableColors,
      };
    }

    let dataQuery = supabase
      .from("products")
      .select("id, tenant_id, category_id, brand, is_new, is_best_seller_manual, product_features, product_colors, slug, title, description, image_url, price_minor, currency, status, created_at")
      .eq("tenant_id", tenantId)
      .eq("status", "published")
      .in("id", bestSellerIds);

    if (query.q) {
      const cleaned = query.q.replace(/,/g, " ").trim();
      dataQuery = dataQuery.or(`title.ilike.%${cleaned}%,description.ilike.%${cleaned}%`);
    }
    if (selectedCategoryIds.length > 0) {
      dataQuery = dataQuery.in("category_id", selectedCategoryIds);
    }
    if (query.brands.length > 0) {
      dataQuery = dataQuery.in("brand", query.brands);
    }
    if (query.features.length > 0) {
      dataQuery = dataQuery.overlaps("product_features", query.features);
    }
    if (query.colors.length > 0) {
      dataQuery = dataQuery.overlaps("product_colors", query.colors);
    }
    if (typeof query.minPrice === "number") {
      dataQuery = dataQuery.gte("price_minor", query.minPrice * 100);
    }
    if (typeof query.maxPrice === "number") {
      dataQuery = dataQuery.lte("price_minor", query.maxPrice * 100);
    }

    const { data } = await dataQuery;
    const rows = (data || []) as Array<Product & { created_at?: string }>;
    const sorted = [...rows].sort((a, b) => {
      if (query.sort === "price_asc") {
        return a.price_minor - b.price_minor;
      }
      if (query.sort === "price_desc") {
        return b.price_minor - a.price_minor;
      }
      if (query.sort === "newest") {
        return String(b.created_at || "").localeCompare(String(a.created_at || ""));
      }

      const rankA = ranking.get(a.id) || { soldQuantity: 0, manual: false };
      const rankB = ranking.get(b.id) || { soldQuantity: 0, manual: false };
      if (rankA.manual !== rankB.manual) return rankA.manual ? -1 : 1;
      if (rankA.soldQuantity !== rankB.soldQuantity) return rankB.soldQuantity - rankA.soldQuantity;
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const from = (query.page - 1) * query.pageSize;
    const to = from + query.pageSize;

    return {
      items: sorted.slice(from, to) as Product[],
      total,
      totalPages,
      availableCategories,
      availableBrands,
      availableFeatures,
      availableColors,
    };
  }

  let countQuery = supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("status", "published");
  if (options?.onlyNew) {
    countQuery = countQuery.eq("is_new", true);
  }

  if (query.q) {
    const cleaned = query.q.replace(/,/g, " ").trim();
    countQuery = countQuery.or(`title.ilike.%${cleaned}%,description.ilike.%${cleaned}%`);
  }
  if (selectedCategoryIds.length > 0) {
    countQuery = countQuery.in("category_id", selectedCategoryIds);
  }
  if (query.brands.length > 0) {
    countQuery = countQuery.in("brand", query.brands);
  }
  if (query.features.length > 0) {
    countQuery = countQuery.overlaps("product_features", query.features);
  }
  if (query.colors.length > 0) {
    countQuery = countQuery.overlaps("product_colors", query.colors);
  }
  if (typeof query.minPrice === "number") {
    countQuery = countQuery.gte("price_minor", query.minPrice * 100);
  }
  if (typeof query.maxPrice === "number") {
    countQuery = countQuery.lte("price_minor", query.maxPrice * 100);
  }
  const { count } = await countQuery;

  let dataQuery = supabase
    .from("products")
    .select("id, tenant_id, category_id, brand, is_new, product_features, product_colors, slug, title, description, image_url, price_minor, currency, status")
    .eq("tenant_id", tenantId)
    .eq("status", "published");
  if (options?.onlyNew) {
    dataQuery = dataQuery.eq("is_new", true);
  }

  if (query.q) {
    const cleaned = query.q.replace(/,/g, " ").trim();
    dataQuery = dataQuery.or(`title.ilike.%${cleaned}%,description.ilike.%${cleaned}%`);
  }
  if (selectedCategoryIds.length > 0) {
    dataQuery = dataQuery.in("category_id", selectedCategoryIds);
  }
  if (query.brands.length > 0) {
    dataQuery = dataQuery.in("brand", query.brands);
  }
  if (query.features.length > 0) {
    dataQuery = dataQuery.overlaps("product_features", query.features);
  }
  if (query.colors.length > 0) {
    dataQuery = dataQuery.overlaps("product_colors", query.colors);
  }
  if (typeof query.minPrice === "number") {
    dataQuery = dataQuery.gte("price_minor", query.minPrice * 100);
  }
  if (typeof query.maxPrice === "number") {
    dataQuery = dataQuery.lte("price_minor", query.maxPrice * 100);
  }

  if (query.sort === "price_asc") dataQuery = dataQuery.order("price_minor", { ascending: true });
  else if (query.sort === "price_desc") dataQuery = dataQuery.order("price_minor", { ascending: false });
  else dataQuery = dataQuery.order("created_at", { ascending: false });

  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;
  const { data } = await dataQuery.range(from, to);

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  return {
    items: (data || []) as Product[],
    total,
    totalPages,
    availableCategories,
    availableBrands,
    availableFeatures,
    availableColors,
  };
}

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function getParams(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return [value];
}

function parseMinor(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return undefined;
  return Math.round(parsed);
}

function parsePositiveInt(value: string, fallback: number): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.round(parsed);
}

function parseSort(value: string): CatalogSort {
  if (value === "new") return "newest";
  if (value === "bestsellers") return "relevance";
  if (value === "price_asc" || value === "price_desc" || value === "newest") return value;
  return "relevance";
}

