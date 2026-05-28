-- Logistics, shipping carriers and inventory management.

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text not null,
  address_line1 text,
  postal_code text,
  city text,
  country text not null default 'Sverige',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table if not exists public.carrier_integrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  carrier_code text not null,
  display_name text not null,
  tracking_base_url text,
  api_key text,
  api_secret text,
  webhook_secret text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  warehouse_id uuid references public.warehouses(id) on delete set null,
  carrier_integration_id uuid references public.carrier_integrations(id) on delete set null,
  name text not null,
  service_code text,
  handling_days int not null default 1 check (handling_days >= 0),
  transit_days_min int not null default 1 check (transit_days_min >= 0),
  transit_days_max int not null default 3 check (transit_days_max >= transit_days_min),
  cutoff_time text not null default '14:00',
  delivery_weekdays text not null default '1,2,3,4,5',
  base_price_minor int not null default 0 check (base_price_minor >= 0),
  free_shipping_over_minor int not null default 0 check (free_shipping_over_minor >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_levels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  on_hand_quantity int not null default 0 check (on_hand_quantity >= 0),
  reserved_quantity int not null default 0 check (reserved_quantity >= 0),
  reorder_point int not null default 0 check (reorder_point >= 0),
  updated_at timestamptz not null default now(),
  unique (tenant_id, product_id, warehouse_id)
);

alter table public.orders
  add column if not exists shipping_method_id uuid references public.shipping_methods(id) on delete set null,
  add column if not exists shipping_method_name text,
  add column if not exists shipping_carrier text,
  add column if not exists shipping_service text,
  add column if not exists shipping_price_minor int not null default 0 check (shipping_price_minor >= 0),
  add column if not exists fulfillment_status text not null default 'unfulfilled',
  add column if not exists estimated_dispatch_date date,
  add column if not exists estimated_delivery_start date,
  add column if not exists estimated_delivery_end date,
  add column if not exists tracking_number text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_fulfillment_status_check'
  ) then
    alter table public.orders
      add constraint orders_fulfillment_status_check
      check (fulfillment_status in ('unfulfilled', 'allocated', 'packed', 'shipped', 'delivered', 'cancelled'));
  end if;
end
$$;

create index if not exists idx_warehouses_tenant_id on public.warehouses(tenant_id);
create index if not exists idx_carrier_integrations_tenant_id on public.carrier_integrations(tenant_id);
create index if not exists idx_shipping_methods_tenant_id on public.shipping_methods(tenant_id);
create index if not exists idx_shipping_methods_active on public.shipping_methods(tenant_id, is_active, sort_order);
create index if not exists idx_inventory_levels_tenant_product on public.inventory_levels(tenant_id, product_id);
create index if not exists idx_inventory_levels_tenant_warehouse on public.inventory_levels(tenant_id, warehouse_id);

drop trigger if exists warehouses_set_updated_at on public.warehouses;
create trigger warehouses_set_updated_at
before update on public.warehouses
for each row execute procedure public.set_updated_at();

drop trigger if exists carrier_integrations_set_updated_at on public.carrier_integrations;
create trigger carrier_integrations_set_updated_at
before update on public.carrier_integrations
for each row execute procedure public.set_updated_at();

drop trigger if exists shipping_methods_set_updated_at on public.shipping_methods;
create trigger shipping_methods_set_updated_at
before update on public.shipping_methods
for each row execute procedure public.set_updated_at();

drop trigger if exists inventory_levels_set_updated_at on public.inventory_levels;
create trigger inventory_levels_set_updated_at
before update on public.inventory_levels
for each row execute procedure public.set_updated_at();

alter table public.warehouses enable row level security;
alter table public.carrier_integrations enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.inventory_levels enable row level security;

drop policy if exists "Tenant members can read warehouses" on public.warehouses;
create policy "Tenant members can read warehouses"
on public.warehouses
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = warehouses.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can manage warehouses" on public.warehouses;
create policy "Tenant admins can manage warehouses"
on public.warehouses
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = warehouses.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = warehouses.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read carrier integrations" on public.carrier_integrations;
create policy "Tenant members can read carrier integrations"
on public.carrier_integrations
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = carrier_integrations.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can manage carrier integrations" on public.carrier_integrations;
create policy "Tenant admins can manage carrier integrations"
on public.carrier_integrations
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = carrier_integrations.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = carrier_integrations.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read shipping methods" on public.shipping_methods;
create policy "Tenant members can read shipping methods"
on public.shipping_methods
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = shipping_methods.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can manage shipping methods" on public.shipping_methods;
create policy "Tenant admins can manage shipping methods"
on public.shipping_methods
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = shipping_methods.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = shipping_methods.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read inventory levels" on public.inventory_levels;
create policy "Tenant members can read inventory levels"
on public.inventory_levels
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = inventory_levels.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can manage inventory levels" on public.inventory_levels;
create policy "Tenant admins can manage inventory levels"
on public.inventory_levels
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = inventory_levels.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = inventory_levels.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);
