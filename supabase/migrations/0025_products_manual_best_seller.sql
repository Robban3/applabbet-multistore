alter table public.products
  add column if not exists is_best_seller_manual boolean not null default false;

create index if not exists products_tenant_best_seller_manual_idx
  on public.products (tenant_id, is_best_seller_manual)
  where status = 'published';
