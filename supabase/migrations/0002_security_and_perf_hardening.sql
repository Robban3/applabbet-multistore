-- Hardening pass after initial schema bootstrap.
-- Improves RLS coverage, indexing and policy performance.

create index if not exists idx_tenant_domains_tenant_id on public.tenant_domains (tenant_id);
create index if not exists idx_tenant_users_tenant_id on public.tenant_users (tenant_id);
create index if not exists idx_tenant_users_user_id on public.tenant_users (user_id);
create index if not exists idx_orders_tenant_id on public.orders (tenant_id);
create index if not exists idx_order_items_tenant_id on public.order_items (tenant_id);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_products_tenant_id_status on public.products (tenant_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "Tenant members can manage products" on public.products;
create policy "Tenant members can insert products"
on public.products
for insert
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can update products"
on public.products
for update
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can delete products"
on public.products
for delete
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read tenant domains" on public.tenant_domains;
create policy "Tenant members can read tenant domains"
on public.tenant_domains
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_domains.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant members can read tenant users" on public.tenant_users;
create policy "Tenant members can read tenant users"
on public.tenant_users
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_users.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant members can read orders" on public.orders;
create policy "Tenant members can read orders"
on public.orders
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = orders.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant members can manage orders" on public.orders;
create policy "Tenant members can manage orders"
on public.orders
for update
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = orders.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = orders.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read order items" on public.order_items;
create policy "Tenant members can read order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = order_items.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

create policy "Tenant members can read tenant"
on public.tenants
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenants.id
      and tu.user_id = (select auth.uid())
  )
);
