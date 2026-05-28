-- Tenant-wide storefront settings and custom CMS pages.

create table if not exists public.tenant_settings (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  logo_url text,
  brand_name text,
  company_name text,
  org_number text,
  vat_number text,
  support_email text,
  support_phone text,
  address_line1 text,
  postal_code text,
  city text,
  country text not null default 'Sverige',
  payment_methods jsonb not null default '{"stripe": true, "klarna": false, "swish": false}'::jsonb,
  payment_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_pages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  title text not null,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  constraint custom_pages_status_check check (status in ('draft', 'published'))
);

create index if not exists idx_custom_pages_tenant_id on public.custom_pages (tenant_id);
create index if not exists idx_custom_pages_tenant_slug on public.custom_pages (tenant_id, slug);

drop trigger if exists tenant_settings_set_updated_at on public.tenant_settings;
create trigger tenant_settings_set_updated_at
before update on public.tenant_settings
for each row execute procedure public.set_updated_at();

drop trigger if exists custom_pages_set_updated_at on public.custom_pages;
create trigger custom_pages_set_updated_at
before update on public.custom_pages
for each row execute procedure public.set_updated_at();

alter table public.tenant_settings enable row level security;
alter table public.custom_pages enable row level security;

drop policy if exists "Tenant members can read tenant settings" on public.tenant_settings;
create policy "Tenant members can read tenant settings"
on public.tenant_settings
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_settings.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can write tenant settings" on public.tenant_settings;
create policy "Tenant admins can write tenant settings"
on public.tenant_settings
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_settings.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = tenant_settings.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

drop policy if exists "Tenant members can read custom pages" on public.custom_pages;
create policy "Tenant members can read custom pages"
on public.custom_pages
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = custom_pages.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

drop policy if exists "Tenant admins can manage custom pages" on public.custom_pages;
create policy "Tenant admins can manage custom pages"
on public.custom_pages
for all
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = custom_pages.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = custom_pages.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);
