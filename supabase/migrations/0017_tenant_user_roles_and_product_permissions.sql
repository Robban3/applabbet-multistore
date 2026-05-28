-- Extend tenant roles and grant product permissions for product managers.

alter table public.tenant_users
drop constraint if exists tenant_users_role_check;

alter table public.tenant_users
add constraint tenant_users_role_check
check (role in ('admin', 'editor', 'viewer', 'product_manager'));

drop policy if exists "Tenant members can manage products" on public.products;
create policy "Tenant members can manage products"
on public.products
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor', 'product_manager')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor', 'product_manager')
  )
);

drop policy if exists "Tenant members can manage product categories" on public.product_categories;
create policy "Tenant members can manage product categories"
on public.product_categories
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = product_categories.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor', 'product_manager')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = product_categories.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor', 'product_manager')
  )
);
