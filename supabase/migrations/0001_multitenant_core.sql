-- Core multi-tenant schema for applabbet-multistore
create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  default_locale text not null default 'sv-SE',
  default_currency text not null default 'SEK',
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_domains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  domain text not null unique,
  verification_status text not null default 'pending_verification',
  ssl_status text not null default 'pending',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint tenant_domains_status_check check (
    verification_status in ('pending_verification', 'verified', 'failed')
  ),
  constraint tenant_domains_ssl_status_check check (
    ssl_status in ('pending', 'ready', 'failed')
  )
);

create table if not exists public.tenant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id),
  constraint tenant_users_role_check check (role in ('admin', 'editor', 'viewer'))
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null default '',
  image_url text,
  price_minor int not null check (price_minor >= 0),
  currency text not null default 'SEK',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  constraint products_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_email text not null,
  customer_name text,
  payment_provider text not null default 'stripe',
  payment_intent_id text,
  checkout_session_id text,
  status text not null default 'pending',
  currency text not null default 'SEK',
  total_minor int not null check (total_minor >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_status_check check (
    status in ('pending', 'paid', 'failed', 'refunded')
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  quantity int not null check (quantity > 0),
  unit_price_minor int not null check (unit_price_minor >= 0),
  line_total_minor int not null check (line_total_minor >= 0)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

alter table public.tenants enable row level security;
alter table public.tenant_domains enable row level security;
alter table public.tenant_users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public can read published products"
on public.products
for select
using (status = 'published');

create policy "Tenant members can manage products"
on public.products
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = products.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can read tenant domains"
on public.tenant_domains
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_domains.tenant_id
      and tu.user_id = auth.uid()
  )
);

create policy "Tenant members can read tenant users"
on public.tenant_users
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_users.tenant_id
      and tu.user_id = auth.uid()
  )
);

create policy "Tenant members can read orders"
on public.orders
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = orders.tenant_id
      and tu.user_id = auth.uid()
  )
);

create policy "Tenant members can manage orders"
on public.orders
for update
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = orders.tenant_id
      and tu.user_id = auth.uid()
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can read order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = order_items.tenant_id
      and tu.user_id = auth.uid()
  )
);
