import type { StorefrontThemeConfig } from '../types';

export const beautyThemeConfig: StorefrontThemeConfig = {
  key: 'beauty',
  categoriesTitle: 'SHOPPA KATEGORI',
  bestSellersTitle: 'VÅRA BÄSTSÄLJARE',
  brandsTitle: 'Våra populära varumärken',
  hero: {
    title: 'Lyft din naturliga skönhet',
    description: 'Hudvård, smink och dofter noggrant utvalda för dig.'
  },
  navItems: [
    { label: 'Hudvård', href: '/products?category=hudvard' },
    { label: 'Smink', href: '/products?category=smink' },
    { label: 'Hårvård', href: '/products?category=harvard' },
    { label: 'Parfym', href: '/products?category=parfym' },
    { label: 'Kropp & Bad', href: '/products?category=kropp-bad' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Varumärken', href: '/products?sort=relevance' }
  ],
  categoryCards: [
    { title: 'Hudvård', accent: 'from-[#3b2e33]' },
    { title: 'Smink', accent: 'from-[#44353a]' },
    { title: 'Hårvård', accent: 'from-[#3c3137]' },
    { title: 'Parfym', accent: 'from-[#4a3c42]' },
    { title: 'Kropp & Bad', accent: 'from-[#3f3339]' },
    { title: 'Beauty Tools', accent: 'from-[#3a2f35]' }
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'På beställningar över 499 kr', icon: 'truck' },
    { title: '30 dagars öppet köp', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Clean beauty', text: 'Utvalda hållbara produkter', icon: 'star' },
    { title: 'Säkra betalningar', text: 'Klarna, Swish & kort', icon: 'headset' }
  ],
  brandLogos: ['CHANEL', 'ESTÉE LAUDER', 'The Ordinary.', "L'ORÉAL", 'KÉRASTASE', 'CLINIQUE', 'OLAPLEX'],
  valueCards: [
    {
      title: 'Expertkunskap',
      text: 'Noggrant utvalda produkter av skönhetsexperter.'
    },
    {
      title: '100% äkta produkter',
      text: 'Garanterad äkthet - alltid original.'
    },
    {
      title: 'Personliga rekommendationer',
      text: 'Hitta produkterna som passar just dig.'
    }
  ],
  products: [
    { title: 'The Ordinary Hyaluronic Acid 2% + B5', priceMinor: 13900, currency: 'SEK' },
    { title: 'Estée Lauder Advanced Night Repair Serum', priceMinor: 71900, currency: 'SEK' },
    { title: "Paula's Choice 2% BHA Liquid Exfoliant", priceMinor: 34900, currency: 'SEK' },
    { title: 'Chanel Coco Mademoiselle EdP', priceMinor: 124900, currency: 'SEK' },
    { title: 'Kérastase Elixir Ultime Hair Oil', priceMinor: 42400, currency: 'SEK' },
    { title: 'Clinique Moisture Surge 100H', priceMinor: 39900, currency: 'SEK' }
  ]
};