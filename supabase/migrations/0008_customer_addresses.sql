create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'ovrig',
  full_name text not null,
  address_line1 text not null,
  postal_code text not null,
  city text not null,
  country text not null default 'Sverige',
  phone text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_addresses_tenant_user_idx
  on public.customer_addresses(tenant_id, user_id);

create unique index if not exists customer_addresses_one_default_shipping_idx
  on public.customer_addresses(tenant_id, user_id)
  where is_default_shipping = true;

create unique index if not exists customer_addresses_one_default_billing_idx
  on public.customer_addresses(tenant_id, user_id)
  where is_default_billing = true;

drop trigger if exists customer_addresses_set_updated_at on public.customer_addresses;
create trigger customer_addresses_set_updated_at
before update on public.customer_addresses
for each row execute procedure public.set_updated_at();

alter table public.customer_addresses enable row level security;

create policy "Users can read own customer addresses"
on public.customer_addresses
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert own customer addresses"
on public.customer_addresses
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can update own customer addresses"
on public.customer_addresses
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own customer addresses"
on public.customer_addresses
for delete
using ((select auth.uid()) = user_id);
