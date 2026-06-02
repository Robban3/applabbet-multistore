import type { StorefrontThemeConfig } from '../types';

export const minimalThemeConfig: StorefrontThemeConfig = {
  key: 'minimal',
  categoriesTitle: 'Utforska sortimentet',
  bestSellersTitle: 'Populärt just nu',
  brandsTitle: 'Designad för det viktigaste',
  hero: {
    title: 'Phone Pro.',
    description: 'Kraftfull. Elegant. Gjord för att hålla.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Produkter', href: '/products' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Populärt', href: '/bastsaljare' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Kundservice', href: '/kundservice' }
  ],
  // Matchar minimal-demo tenantens DB-kategorier
  categoryCards: [
    { title: 'Telefoner', accent: 'from-[#F5F5F7]', imageUrl: '/images/minimal-categories/minimal-telefoner.svg' },
    { title: 'Datorer',   accent: 'from-[#F5F5F7]', imageUrl: '/images/minimal-categories/minimal-datorer.svg' },
    { title: 'Ljud',      accent: 'from-[#F5F5F7]', imageUrl: '/images/minimal-categories/minimal-ljud.svg' },
    { title: 'Tillbehör', accent: 'from-[#F5F5F7]', imageUrl: '/images/minimal-categories/minimal-tillbehor.svg' }
  ],
  trustCards: [
    { title: 'Fri frakt',           text: 'På alla beställningar', icon: 'truck' },
    { title: '14 dagars ångerrätt', text: 'Enkelt & smidigt',      icon: 'shield' },
    { title: 'Premium support',     text: 'Vi hjälper dig',        icon: 'headset' },
    { title: 'Säker betalning',     text: 'Tryggt & krypterat',    icon: 'star' }
  ],
  brandLogos: ['DESIGN', 'PRECISION', 'CRAFTED', 'PURE', 'ESSENTIAL'],
  valueCards: [
    { title: 'Enkelhet', text: 'Vi tar bort det överflödiga så att bara det väsentliga återstår.' },
    { title: 'Kvalitet', text: 'Material och detaljer valda med omsorg — byggt för att hålla.' },
    { title: 'Omtanke',  text: 'Hållbara val genom hela kedjan, från design till leverans.' }
  ],
  products: [
    { title: 'Phone Pro',      priceMinor: 1499000, currency: 'SEK' },
    { title: 'Book Pro 14',    priceMinor: 2499000, currency: 'SEK' },
    { title: 'Pods Pro',       priceMinor:  299000, currency: 'SEK' },
    { title: 'Tab Pro 11',     priceMinor:  999000, currency: 'SEK' },
    { title: 'Watch Series',   priceMinor:  499000, currency: 'SEK' },
    { title: 'Magic Keyboard', priceMinor:  149000, currency: 'SEK' }
  ]
};
