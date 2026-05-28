alter table public.products
  add column if not exists brand text;

create index if not exists products_tenant_brand_idx
  on public.products(tenant_id, brand);
