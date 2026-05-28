alter table public.tenant_settings
add column if not exists loyalty_program_enabled boolean not null default false;
