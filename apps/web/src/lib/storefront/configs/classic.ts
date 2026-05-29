import type { StorefrontThemeConfig } from '../types';

export const classicThemeConfig: StorefrontThemeConfig = {
  key: 'classic',
  categoriesTitle: 'Upptäck våra kategorier',
  bestSellersTitle: 'Bästsäljare',
  brandsTitle: 'Betrodd av tusentals nöjda kunder',
  hero: {
    title: 'Upplev kvalitet. Varje dag.',
    description: 'Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Kategorier', href: '/products' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Bästsäljare', href: '/bastsaljare' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Kundservice', href: '/kundservice' }
  ],
  categoryCards: [
    { title: 'Ljud & Hörlurar', accent: 'from-[#2f251b]' },
    { title: 'Klockor', accent: 'from-[#332820]' },
    { title: 'Hem & Inredning', accent: 'from-[#3b2f24]' },
    { title: 'Väskor', accent: 'from-[#2b2118]' },
    { title: 'Parfymer', accent: 'from-[#241d18]' },
    { title: 'Accessoarer', accent: 'from-[#3a2e22]' }
  ],
  trustCards: [
    { title: 'Premium kvalitet', text: 'Utvalt med omsorg', icon: 'star' },
    { title: 'Säkra betalningar', text: 'Tryggt & säkert', icon: 'shield' },
    { title: 'Snabb leverans', text: '1-2 arbetsdagar', icon: 'truck' },
    { title: 'Kundtjänst', text: 'Vi finns här för dig', icon: 'headset' }
  ],
  brandLogos: ['SONY', 'BOSE', 'dyson', 'GARMIN', 'SAMSUNG', 'APPLE', 'PHILIPS'],
  valueCards: [
    {
      title: 'Hållbarhet i fokus',
      text: 'Vi väljer produkter och leverantörer med omtanke om miljön.'
    },
    {
      title: 'Kundservice i världsklass',
      text: 'Vi finns här för dig - snabbt, personligt och engagerat.'
    },
    {
      title: 'Nöjda kunder',
      text: 'Över 10 000+ kunder älskar våra produkter.'
    }
  ],
  products: [
    { title: 'Premium Hörlurar Pro', priceMinor: 199900, currency: 'SEK' },
    { title: 'Chrono Elite Klocka', priceMinor: 249900, currency: 'SEK' },
    { title: 'Nordic Bordslampa', priceMinor: 89900, currency: 'SEK' },
    { title: 'Noir Intense Eau de Parfum', priceMinor: 74900, currency: 'SEK' },
    { title: 'Aviator Solglasögon', priceMinor: 59900, currency: 'SEK' },
    { title: 'Urban Läderväska', priceMinor: 159900, currency: 'SEK' }
  ]
};