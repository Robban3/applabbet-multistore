alter table public.products
  add column if not exists product_sizes text[] not null default '{}';

create index if not exists products_tenant_sizes_idx
  on public.products using gin (product_sizes);
