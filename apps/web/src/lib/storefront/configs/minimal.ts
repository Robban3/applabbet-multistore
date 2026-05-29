import type { StorefrontThemeConfig } from '../types';

export const minimalThemeConfig: StorefrontThemeConfig = {
  key: 'minimal',
  categoriesTitle: 'Kategorier',
  bestSellersTitle: 'Bästsäljare',
  brandsTitle: 'Utvalda varumärken',
  hero: {
    title: 'Det viktigaste utan brus',
    description: 'Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Produkter', href: '/products' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Populart', href: '/bastsaljare' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Support', href: '/kundservice' }
  ],
  categoryCards: [
    { title: 'Basprodukter', accent: 'from-[#293545]' },
    { title: 'Hem', accent: 'from-[#243243]' },
    { title: 'Kontor', accent: 'from-[#233041]' },
    { title: 'Teknik', accent: 'from-[#202b39]' },
    { title: 'Accessoarer', accent: 'from-[#1f2935]' },
    { title: 'Nyheter', accent: 'from-[#2b3748]' }
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'Over 499 kr', icon: 'truck' },
    { title: '30 dagars oppet kop', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Snabb leverans', text: '1-2 arbetsdagar', icon: 'star' },
    { title: 'Trygg support', text: 'Vi hjalper dig snabbt', icon: 'headset' }
  ],
  brandLogos: ['MUJI', 'UNIQLO', 'NORDIC', 'Aarke', 'BOSE', 'SONOS', 'IKEA'],
  valueCards: [
    {
      title: 'Mindre brus',
      text: 'Vi fokuserar pa produkter som gor vardagen enklare.'
    },
    {
      title: 'Kvalitet forst',
      text: 'Noggrant utvalda produkter med hog kvalitet.'
    },
    {
      title: 'Snabb support',
      text: 'Personlig hjalp nar du behover den.'
    }
  ],
  products: [
    { title: 'Minimal Desk Lamp', priceMinor: 69900, currency: 'SEK' },
    { title: 'Essential Wireless Speaker', priceMinor: 129900, currency: 'SEK' },
    { title: 'Nordic Coffee Brewer', priceMinor: 89900, currency: 'SEK' },
    { title: 'Slate Storage Box', priceMinor: 29900, currency: 'SEK' },
    { title: 'Core Backpack', priceMinor: 79900, currency: 'SEK' },
    { title: 'Everyday Notebook Set', priceMinor: 14900, currency: 'SEK' }
  ]
};