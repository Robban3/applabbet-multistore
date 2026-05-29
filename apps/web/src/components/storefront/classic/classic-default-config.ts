import type { ClassicStorefrontConfig } from './classic-config';

export const classicDefaultConfig: ClassicStorefrontConfig = {
  hero: {
    eyebrow: 'Premium Collection',
    title: 'Tidlös design för moderna hem',
    description: 'Noggrant utvalda produkter med fokus på kvalitet, design och hållbarhet.',
    primaryCtaHref: '/products',
    primaryCtaLabel: 'Shoppa nu',
    secondaryCtaHref: '/om-oss',
    secondaryCtaLabel: 'Läs mer',
    trustItems: ['Fri frakt', '30 dagars öppet köp', 'Säkra betalningar'],
  },
  categories: {
    title: 'Populära kategorier',
    categories: [],
  },
  products: {
    title: 'Bästsäljare',
    products: [],
  },
  brands: {
    brands: ['SONY', 'BOSE', 'APPLE', 'GARMIN'],
  },
  values: {
    title: 'Därför väljer kunder oss',
    items: [],
  },
  newsletter: {
    title: 'Få våra senaste nyheter',
    description: 'Prenumerera för inspiration, kampanjer och produktnyheter.',
  },
};