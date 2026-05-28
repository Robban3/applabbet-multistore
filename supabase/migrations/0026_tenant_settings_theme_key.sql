alter table public.tenant_settings
  add column if not exists theme_key text not null default 'classic';

update public.tenant_settings
set theme_key = 'classic'
where theme_key is null or btrim(theme_key) = '';
