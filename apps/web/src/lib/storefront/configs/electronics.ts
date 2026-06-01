import type { StorefrontThemeConfig } from '../types';

export const electronicsThemeConfig: StorefrontThemeConfig = {
  key: 'electronics',
  categoriesTitle: 'Shoppa kategori',
  bestSellersTitle: 'Veckans deals',
  brandsTitle: 'Våra populära varumärken',
  hero: {
    title: 'Teknik till\nrätt pris.',
    description: 'Tusentals produkter, snabba leveranser och experthjälp när du behöver den.'
  },
  navItems: [
    { label: 'Datorer & Surf', href: '/products?category=elec-datorer' },
    { label: 'Mobil', href: '/products?category=elec-mobil' },
    { label: 'TV & Ljud', href: '/products?category=elec-tv-ljud' },
    { label: 'Gaming', href: '/products?category=elec-gaming' },
    { label: 'Komponenter', href: '/products?category=elec-komponenter' },
    { label: 'Erbjudanden', href: '/bastsaljare' }
  ],
  // Matchar electronics-demo tenantens DB-kategorier
  categoryCards: [
    { title: 'Datorer & Surf', accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-datorer.svg' },
    { title: 'Mobil',          accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-mobil.svg' },
    { title: 'TV & Ljud',      accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-tv-ljud.svg' },
    { title: 'Gaming',         accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-gaming.svg' },
    { title: 'Komponenter',    accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-komponenter.svg' },
    { title: 'Tillbehör',      accent: 'from-[#EAF1FB]', imageUrl: '/images/electronics-categories/elec-tillbehor.svg' }
  ],
  trustCards: [
    { title: 'Fri frakt',           text: 'Vid köp över 499 kr',   icon: 'truck' },
    { title: 'Snabb leverans',      text: '1-2 arbetsdagar',       icon: 'star' },
    { title: '3 års garanti',       text: 'På utvalda produkter',  icon: 'shield' },
    { title: 'Experthjälp',         text: 'Vi guidar dig rätt',    icon: 'headset' }
  ],
  brandLogos: ['SAMSUNG', 'APPLE', 'ASUS', 'SONY', 'LOGITECH', 'NVIDIA', 'LENOVO'],
  valueCards: [
    { title: 'Experthjälp', text: 'Våra specialister hjälper dig välja rätt teknik för dina behov.' },
    { title: 'Äkta produkter', text: 'Originalprodukter från officiella varumärken — alltid.' },
    { title: 'Snabb support', text: 'Personlig hjälp före, under och efter köpet.' }
  ],
  products: [
    { title: 'Vortex Gaming Laptop 16', priceMinor: 2499900, currency: 'SEK' },
    { title: 'Galaxy Phone X',          priceMinor:  999900, currency: 'SEK' },
    { title: 'OLED TV 55"',             priceMinor: 1199900, currency: 'SEK' },
    { title: 'PlayStation Console',     priceMinor:  599900, currency: 'SEK' },
    { title: 'RTX Graphics Card',       priceMinor:  899900, currency: 'SEK' },
    { title: 'Pro Gaming Headset',      priceMinor:  129900, currency: 'SEK' }
  ]
};
