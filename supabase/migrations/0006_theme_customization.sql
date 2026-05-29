-- Tenant-level theme customization overrides.
-- Theme presets remain the base, while these JSON overrides are editable from admin.

alter table public.tenant_settings
add column if not exists theme_customization jsonb not null default '{}'::jsonb;

comment on column public.tenant_settings.theme_customization is
  'Tenant editable storefront theme overrides, such as colors, typography, radii, spacing, hero layout and section visibility.';

create index if not exists tenant_settings_theme_customization_gin_idx
on public.tenant_settings using gin (theme_customization);
