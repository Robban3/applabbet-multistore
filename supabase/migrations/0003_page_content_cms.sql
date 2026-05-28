-- CMS content per tenant/page.

create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  page_key text not null,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, page_key),
  constraint page_content_status_check check (status in ('draft', 'published'))
);

create index if not exists idx_page_content_tenant_page_key on public.page_content (tenant_id, page_key);

drop trigger if exists page_content_set_updated_at on public.page_content;
create trigger page_content_set_updated_at
before update on public.page_content
for each row execute procedure public.set_updated_at();

alter table public.page_content enable row level security;

create policy "Tenant members can read page content"
on public.page_content
for select
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = page_content.tenant_id
      and tu.user_id = (select auth.uid())
  )
);

create policy "Tenant members can insert page content"
on public.page_content
for insert
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = page_content.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can update page content"
on public.page_content
for update
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = page_content.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = page_content.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);

create policy "Tenant members can delete page content"
on public.page_content
for delete
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = page_content.tenant_id
      and tu.user_id = (select auth.uid())
      and tu.role in ('admin', 'editor')
  )
);
