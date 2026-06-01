import type { StorefrontThemeConfig } from '../types';

export const sportThemeConfig: StorefrontThemeConfig = {
  key: 'sport',
  categoriesTitle: 'KATEGORIER',
  bestSellersTitle: 'BÄSTSÄLJARE',
  brandsTitle: 'Vi jobbar med världens ledande varumärken',
  hero: {
    title: 'Din träning. Din styrka.',
    description: 'Utrustning, kläder och skor som hjälper dig att nå dina mål.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Herr', href: '/products?category=herr' },
    { label: 'Dam', href: '/products?category=dam' },
    { label: 'Barn', href: '/products?category=barn' },
    { label: 'Skor', href: '/products?category=skor' },
    { label: 'Utvalda', href: '/bastsaljare' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Varumärken', href: '/products?sort=relevance' }
  ],
  categoryCards: [
    { title: 'Löparskor', accent: 'from-[#1f2a28]' },
    { title: 'Träningskläder', accent: 'from-[#24312f]' },
    { title: 'Utrustning', accent: 'from-[#212826]' },
    { title: 'Sportaccessoarer', accent: 'from-[#27302c]' }
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'På beställningar över 499 kr', icon: 'truck' },
    { title: '30 dagars öppet köp', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Äkta produkter', text: '100% original', icon: 'star' },
    { title: 'Säkra betalningar', text: 'Klarna, Swish & kort', icon: 'headset' }
  ],
  brandLogos: ['NIKE', 'adidas', 'UNDER ARMOUR', 'PUMA', 'THE NORTH FACE', 'GARMIN', 'SALOMON'],
  valueCards: [
    {
      title: 'Hållbarhet i fokus',
      text: 'Vi väljer produkter och leverantörer med omtanke.'
    },
    {
      title: 'Kundservice i världsklass',
      text: 'Vi finns här för dig - snabbt, personligt och engagerat.'
    },
    {
      title: 'Enkla returer',
      text: '30 dagars öppet köp och smidig retur.'
    }
  ],
  products: [
    { title: 'Nike Pegasus 41', priceMinor: 159900, currency: 'SEK' },
    { title: 'Adidas Ultraboost 5', priceMinor: 179900, currency: 'SEK' },
    { title: 'Nike Dri-FIT Hoodie', priceMinor: 69900, currency: 'SEK' },
    { title: 'FAST Shaker 700ml', priceMinor: 12900, currency: 'SEK' },
    { title: 'Nike Swoosh Medium Support', priceMinor: 39900, currency: 'SEK' },
    { title: 'Garmin Forerunner 265', priceMinor: 429900, currency: 'SEK' }
  ]
};