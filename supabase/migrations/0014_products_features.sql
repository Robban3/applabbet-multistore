alter table public.products
  add column if not exists product_features text[] not null default '{}';

create index if not exists products_tenant_features_idx
  on public.products using gin (product_features);
