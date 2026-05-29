import type { StorefrontThemeConfig } from '../types';

export const fashionThemeConfig: StorefrontThemeConfig = {
  key: 'fashion',
  categoriesTitle: 'Upptäck våra kollektioner',
  bestSellersTitle: 'Bästsäljare',
  brandsTitle: 'Betrodd av tusentals nöjda kunder',
  hero: {
    title: 'Klä dig med självförtroende.',
    description: 'Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Herr', href: '/products?category=herr' },
    { label: 'Dam', href: '/products?category=dam' },
    { label: 'Ytterkläder', href: '/products?category=ytterklader' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Varumärken', href: '/products?sort=relevance' }
  ],
  categoryCards: [
    { title: 'Herr', accent: 'from-[#2f2922]' },
    { title: 'Dam', accent: 'from-[#3a332b]' },
    { title: 'Ytterkläder', accent: 'from-[#2a241f]' },
    { title: 'Tröjor', accent: 'from-[#383027]' },
    { title: 'Byxor & Jeans', accent: 'from-[#2f2922]' },
    { title: 'Accessoarer', accent: 'from-[#2b2520]' }
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'Vid köp över 499 kr', icon: 'truck' },
    { title: '30 dagars öppet köp', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Premium kvalitet', text: 'Noggrant utvalt sortiment', icon: 'star' },
    { title: 'Säkra betalningar', text: 'Tryggt & säkert', icon: 'headset' }
  ],
  brandLogos: ['BOSS', 'ZARA', "LEVI'S", 'J.LINDEBERG', 'CALVIN KLEIN', 'NIKE', 'ARKET'],
  valueCards: [
    {
      title: 'Hållbart i fokus',
      text: 'Vi väljer material och samarbeten med omtanke om miljön.'
    },
    {
      title: 'Kundservice i världsklass',
      text: 'Vi finns här för dig - snabbt, personligt och engagerat.'
    },
    {
      title: 'Enkla returer',
      text: '30 dagars öppet köp och smidiga returer.'
    }
  ],
  products: [
    { title: 'Iconic Bomber Jacket', priceMinor: 149700, currency: 'SEK' },
    { title: 'Luxe Merino Sweater', priceMinor: 69900, currency: 'SEK' },
    { title: 'Slim Fit Jeans', priceMinor: 79900, currency: 'SEK' },
    { title: 'Essential Hoodie', priceMinor: 59900, currency: 'SEK' },
    { title: 'Wool Blend Coat', priceMinor: 229900, currency: 'SEK' },
    { title: 'Classic Sunglasses', priceMinor: 39900, currency: 'SEK' }
  ]
};