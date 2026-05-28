create table if not exists public.customer_favorites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id, product_id)
);

create index if not exists customer_favorites_tenant_user_idx
  on public.customer_favorites(tenant_id, user_id, created_at desc);

alter table public.customer_favorites enable row level security;

create policy "Users can read own favorites"
on public.customer_favorites
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert own favorites"
on public.customer_favorites
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can delete own favorites"
on public.customer_favorites
for delete
using ((select auth.uid()) = user_id);
