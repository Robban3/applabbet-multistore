export interface Tenant {
  id: string;
  name: string;
  slug: string;
  default_locale: string;
  default_currency: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  category_id?: string | null;
  brand?: string | null;
  is_new?: boolean;
  is_best_seller_manual?: boolean;
  product_features?: string[] | null;
  product_colors?: string[] | null;
  product_materials?: string[] | null;
  product_sizes?: string[] | null;
  product_gallery_images?: string[] | null;
  detail_tab_label_description?: string | null;
  detail_tab_label_specifications?: string | null;
  detail_tab_label_shipping?: string | null;
  detail_tab_label_reviews?: string | null;
  detail_description_intro?: string | null;
  detail_description_bullets?: string[] | null;
  detail_specifications?: string | null;
  detail_shipping_returns?: string | null;
  detail_reviews?: string | null;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  price_minor: number;
  currency: string;
  status: "draft" | "published" | "archived";
}

export interface ProductCategory {
  id: string;
  tenant_id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_email: string;
  customer_name: string | null;
  status: "pending" | "paid" | "failed" | "refunded";
  payment_provider?: "stripe" | "klarna" | "swish";
  total_minor: number;
  currency: string;
  shipping_method_name?: string | null;
  shipping_carrier?: string | null;
  shipping_service?: string | null;
  shipping_price_minor?: number;
  fulfillment_status?: "unfulfilled" | "allocated" | "packed" | "shipped" | "delivered" | "cancelled";
  estimated_dispatch_date?: string | null;
  estimated_delivery_start?: string | null;
  estimated_delivery_end?: string | null;
  tracking_number?: string | null;
  created_at: string;
}

export interface PageContent {
  id: string;
  tenant_id: string;
  page_key: string;
  status: "draft" | "published";
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CustomPage {
  id: string;
  tenant_id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  country: string;
  is_default: boolean;
}

export interface CarrierIntegration {
  id: string;
  tenant_id: string;
  carrier_code: string;
  display_name: string;
  tracking_base_url: string | null;
  is_active: boolean;
}

export interface ShippingMethod {
  id: string;
  tenant_id: string;
  warehouse_id: string | null;
  carrier_integration_id: string | null;
  name: string;
  service_code: string | null;
  handling_days: number;
  transit_days_min: number;
  transit_days_max: number;
  cutoff_time: string;
  delivery_weekdays: string;
  base_price_minor: number;
  free_shipping_over_minor: number;
  sort_order: number;
  is_active: boolean;
}

export interface InventoryLevel {
  id: string;
  tenant_id: string;
  product_id: string;
  warehouse_id: string;
  on_hand_quantity: number;
  reserved_quantity: number;
  reorder_point: number;
}

export interface CustomerAddress {
  id: string;
  tenant_id: string;
  user_id: string;
  label: string;
  full_name: string;
  address_line1: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

export interface CustomerProfile {
  id: string;
  tenant_id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birth_date: string | null;
  newsletter_opt_in: boolean;
  order_updates_opt_in: boolean;
}
