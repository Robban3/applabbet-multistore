create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  unique (tenant_id, name)
);

alter table public.products
  add column if not exists category_id uuid references public.product_categories(id) on delete set null;

create index if not exists products_tenant_category_idx
  on public.products(tenant_id, category_id);

drop trigger if exists product_categories_set_updated_at on public.product_categories;
create trigger product_categories_set_updated_at
before update on public.product_categories
for each row execute procedure public.set_updated_at();

alter table public.product_categories enable row level security;

create policy "Tenant members can read categories"
on public.product_categories
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = product_categories.tenant_id
      and tu.user_id = auth.uid()
  )
);

create policy "Tenant members can manage categories"
on public.product_categories
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = product_categories.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = product_categories.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor')
  )
);
