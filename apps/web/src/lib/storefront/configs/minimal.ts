import type { StorefrontThemeConfig } from '../types';

export const minimalThemeConfig: StorefrontThemeConfig = {
  key: 'minimal',
  categoriesTitle: 'Kategorier',
  bestSellersTitle: 'Bästsäljare',
  brandsTitle: 'Utvalda varumärken',
  hero: {
    title: 'Det viktigaste\nutan brus',
    description: 'Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet.'
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Produkter', href: '/products' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Populärt', href: '/bastsaljare' },
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
    { title: 'Fri frakt', text: 'Över 499 kr', icon: 'truck' },
    { title: '30 dagars öppet köp', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Snabb leverans', text: '1-2 arbetsdagar', icon: 'star' },
    { title: 'Trygg support', text: 'Vi hjälper dig snabbt', icon: 'headset' }
  ],
  brandLogos: ['MUJI', 'UNIQLO', 'Aarke', 'BOSE', 'SONOS', 'HAY', 'IKEA'],
  valueCards: [
    {
      title: 'Mindre brus',
      text: 'Vi fokuserar på produkter som gör vardagen enklare.'
    },
    {
      title: 'Kvalitet först',
      text: 'Noggrant utvalda produkter med hög kvalitet och lång livslängd.'
    },
    {
      title: 'Snabb support',
      text: 'Personlig hjälp när du behöver den.'
    }
  ],
  products: [
    { title: 'Aesop Rind Concentrate Body Balm', priceMinor: 49900, currency: 'SEK' },
    { title: 'Aarke Carbonator Pro', priceMinor: 129900, currency: 'SEK' },
    { title: 'Moleskine Classic Anteckningsbok', priceMinor: 24900, currency: 'SEK' },
    { title: 'HAY Soft Brick Kuddset', priceMinor: 59900, currency: 'SEK' },
    { title: 'Moment Ryggsäck 21L', priceMinor: 149900, currency: 'SEK' },
    { title: 'Lexon Mino Bluetooth-högtalare', priceMinor: 39900, currency: 'SEK' }
  ]
};
