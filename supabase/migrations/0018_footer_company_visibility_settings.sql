alter table public.tenant_settings
add column if not exists footer_show_company_name boolean not null default true,
add column if not exists footer_show_org_number boolean not null default false,
add column if not exists footer_show_support_phone boolean not null default false,
add column if not exists footer_show_support_email boolean not null default true;
