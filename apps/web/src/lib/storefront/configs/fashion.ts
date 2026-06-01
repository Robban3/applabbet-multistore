import type { StorefrontThemeConfig } from '../types';

export const fashionThemeConfig: StorefrontThemeConfig = {
  key: 'fashion',
  categoriesTitle: 'New In',
  bestSellersTitle: 'Bestsellers',
  brandsTitle: 'A timeless approach to dressing',
  hero: {
    title: 'The new\nessentials.',
    description: 'A modern wardrobe — designed to last, made to be worn.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'New In', href: '/nyheter' },
    { label: 'Kollektioner', href: '/products' },
    { label: 'Bästsäljare', href: '/bastsaljare' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Kundservice', href: '/kundservice' }
  ],
  // Matchar fashion-demo tenantens DB-kategorier exakt (case-insensitive)
  categoryCards: [
    { title: 'Klänningar',  accent: 'from-[#FAF9F6]', imageUrl: '/images/fashion-categories/fashion-klanningar.svg' },
    { title: 'Tröjor',      accent: 'from-[#F5F1EA]', imageUrl: '/images/fashion-categories/fashion-trojor.svg' },
    { title: 'Byxor',       accent: 'from-[#F0EAE0]', imageUrl: '/images/fashion-categories/fashion-byxor.svg' },
    { title: 'Ytterkläder', accent: 'from-[#EDE7DC]', imageUrl: '/images/fashion-categories/fashion-ytterklader.svg' },
    { title: 'Skjortor',    accent: 'from-[#F5F0E8]', imageUrl: '/images/fashion-categories/fashion-skjortor.svg' },
    { title: 'Accessoarer', accent: 'from-[#F5F1EA]', imageUrl: '/images/fashion-categories/fashion-accessoarer.svg' }
  ],
  trustCards: [
    { title: 'Fri frakt',         text: 'Vid köp över 999 kr',  icon: 'truck' },
    { title: '30 dagars retur',   text: 'Smidigt & kostnadsfritt', icon: 'shield' },
    { title: 'Premium material',  text: 'Noggrant utvalt',       icon: 'star' },
    { title: 'Personlig service', text: 'Vi finns här för dig',  icon: 'headset' }
  ],
  brandLogos: ['FILIPPA K', 'TOTEME', 'ACNE', 'COS', 'GANNI', 'AMI'],
  valueCards: [
    {
      title: 'Made to last',
      text: 'Plagg utformade med tidlös design för att bli en del av din garderob i många år.'
    },
    {
      title: 'Considered materials',
      text: 'Vi väljer material och tillverkningsmetoder med omtanke om miljön.'
    },
    {
      title: 'Quiet luxury',
      text: 'Subtila detaljer och premium-finish — utan att skrika om det.'
    }
  ],
  products: [
    { title: 'Silk Slip Dress',        priceMinor: 339000, currency: 'SEK' },
    { title: 'Cashmere Crew Neck',     priceMinor: 199000, currency: 'SEK' },
    { title: 'Tailored Wide Trousers', priceMinor: 219000, currency: 'SEK' },
    { title: 'Wool Coat Classic',      priceMinor: 549000, currency: 'SEK' },
    { title: 'Poplin Shirt White',     priceMinor:  99000, currency: 'SEK' },
    { title: 'Leather Tote Mini',      priceMinor: 389000, currency: 'SEK' }
  ]
};
