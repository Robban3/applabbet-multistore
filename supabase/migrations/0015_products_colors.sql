alter table public.products
  add column if not exists product_colors text[] not null default '{}';

create index if not exists products_tenant_colors_idx
  on public.products using gin (product_colors);
