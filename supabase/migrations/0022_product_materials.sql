alter table public.products
  add column if not exists product_materials text[] not null default '{}';

create index if not exists products_tenant_materials_idx
  on public.products using gin (product_materials);
