create table if not exists public.customer_payment_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  stripe_customer_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id),
  unique (tenant_id, email),
  unique (tenant_id, stripe_customer_id)
);

create index if not exists customer_payment_profiles_tenant_email_idx
  on public.customer_payment_profiles(tenant_id, email);

drop trigger if exists customer_payment_profiles_set_updated_at on public.customer_payment_profiles;
create trigger customer_payment_profiles_set_updated_at
before update on public.customer_payment_profiles
for each row execute procedure public.set_updated_at();

alter table public.customer_payment_profiles enable row level security;

create policy "Users can read own payment profile"
on public.customer_payment_profiles
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert own payment profile"
on public.customer_payment_profiles
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can update own payment profile"
on public.customer_payment_profiles
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
