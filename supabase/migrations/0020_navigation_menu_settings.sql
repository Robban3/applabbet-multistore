alter table public.tenant_settings
add column if not exists navigation_menu jsonb not null default '[
  {"label":"Hem","href":"/","slug":"","order":10,"enabled":true},
  {"label":"Kategorier","href":"/products","slug":"","order":20,"enabled":true},
  {"label":"Nyheter","href":"/nyheter","slug":"","order":30,"enabled":true},
  {"label":"Bästsäljare","href":"/products?sort=bestsellers","slug":"","order":40,"enabled":true},
  {"label":"Om oss","href":"/om-oss","slug":"","order":50,"enabled":true},
  {"label":"Kundservice","href":"/kundservice","slug":"","order":60,"enabled":true}
]'::jsonb;
