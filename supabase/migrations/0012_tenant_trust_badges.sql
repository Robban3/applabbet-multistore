alter table public.tenant_settings
add column if not exists trust_badges jsonb not null default '[
  {"title":"Fri frakt över 499 kr","text":"Snabb & spårbar leverans"},
  {"title":"30 dagars öppet köp","text":"Enkelt att returnera"},
  {"title":"Säker betalning","text":"Tryggt & säkert"}
]'::jsonb;
