alter table public.products
  add column if not exists is_new boolean not null default false;

create index if not exists products_tenant_is_new_idx
  on public.products(tenant_id, is_new);
