create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  birth_date date,
  newsletter_opt_in boolean not null default true,
  order_updates_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists customer_profiles_tenant_user_idx
  on public.customer_profiles(tenant_id, user_id);

drop trigger if exists customer_profiles_set_updated_at on public.customer_profiles;
create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row execute procedure public.set_updated_at();

alter table public.customer_profiles enable row level security;

create policy "Users can read own customer profile"
on public.customer_profiles
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert own customer profile"
on public.customer_profiles
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can update own customer profile"
on public.customer_profiles
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
