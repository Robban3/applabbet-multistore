alter table public.products
  add column if not exists detail_tab_label_description text not null default 'BESKRIVNING',
  add column if not exists detail_tab_label_specifications text not null default 'SPECIFIKATIONER',
  add column if not exists detail_tab_label_shipping text not null default 'LEVERANS & RETURER',
  add column if not exists detail_tab_label_reviews text not null default 'RECENSIONER (84)',
  add column if not exists detail_description_intro text not null default 'Trail Grip X är en exklusiv klocka skapad för dig som värdesätter kvalitet, stil och funktion i varje detalj.',
  add column if not exists detail_description_bullets text[] not null default '{
    "Japanskt quartz-urverk för maximal precision",
    "Safirglas som är reptåligt och hållbart",
    "Vattentät upp till 50 meter",
    "Äkta läderarmband med bekväm passform"
  }',
  add column if not exists detail_specifications text not null default 'Material: Rostfritt stål. Glas: Safirglas. Urverk: Japanskt quartz. Vattentäthet: 50 meter.',
  add column if not exists detail_shipping_returns text not null default 'Fri frakt över 499 kr. Leverans 1-3 arbetsdagar. 30 dagars öppet köp och smidig returhantering.',
  add column if not exists detail_reviews text not null default 'Kunderna uppskattar framför allt kvalitet, passform och den tidlösa designen. Snittbetyg: 4.8 av 5.';
