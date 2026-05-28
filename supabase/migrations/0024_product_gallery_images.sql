alter table public.products
  add column if not exists product_gallery_images text[] not null default '{}';
