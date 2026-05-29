import type { StorefrontThemeConfig } from '../types';

export const electronicsThemeConfig: StorefrontThemeConfig = {
  key: 'electronics',
  categoriesTitle: 'Shoppa kategori',
  bestSellersTitle: 'Bästsäljare',
  brandsTitle: 'Våra populära varumärken',
  hero: {
    title: 'Teknik för varje dag',
    description: 'Upptäck de senaste produkterna inom elektronik.'
  },
  navItems: [
    { label: 'Alla kategorier', href: '/products' },
    { label: 'Datorer & tillbehör', href: '/products?category=datorer-tillbehor' },
    { label: 'Mobil & surfplattor', href: '/products?category=mobil-surfplattor' },
    { label: 'Ljud & bild', href: '/products?category=ljud-bild' },
    { label: 'Spel & gaming', href: '/products?category=spel-gaming' },
    { label: 'Smarta hem', href: '/products?category=smarta-hem' },
    { label: 'Erbjudanden', href: '/products?sort=price_desc' },
    { label: 'Nyheter', href: '/nyheter' }
  ],
  categoryCards: [
    { title: 'Datorer & tillbehör', accent: 'from-[#0b1f45]' },
    { title: 'Mobil & surfplattor', accent: 'from-[#122a57]' },
    { title: 'Ljud & bild', accent: 'from-[#0e244e]' },
    { title: 'Spel & gaming', accent: 'from-[#112b5a]' },
    { title: 'Smarta hem', accent: 'from-[#102750]' },
    { title: 'Hemelektronik', accent: 'from-[#0f2248]' }
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'Över 499 kr', icon: 'truck' },
    { title: '30 dagars öppet köp', text: 'Enkelt & smidigt', icon: 'shield' },
    { title: 'Snabba leveranser', text: '1-2 arbetsdagar', icon: 'star' },
    { title: 'Säkra betalningar', text: 'Klarna, Swish & kort', icon: 'headset' }
  ],
  brandLogos: ['SAMSUNG', 'APPLE', 'ASUS', 'SONY', 'logitech', 'PHILIPS', 'Lenovo'],
  valueCards: [
    {
      title: 'Expertkunskap',
      text: 'Våra specialister hjälper dig välja rätt teknik.'
    },
    {
      title: '100% äkta produkter',
      text: 'Originalprodukter från officiella varumärken.'
    },
    {
      title: 'Personliga rekommendationer',
      text: 'Hitta rätt produkt för dina behov.'
    }
  ],
  products: [
    { title: 'Samsung Galaxy S24', priceMinor: 109900, currency: 'SEK' },
    { title: 'MacBook Air M3', priceMinor: 149900, currency: 'SEK' },
    { title: 'PlayStation 5', priceMinor: 649900, currency: 'SEK' },
    { title: 'Sony WH-1000XM5', priceMinor: 399900, currency: 'SEK' },
    { title: 'Logitech MX Master 3S', priceMinor: 129900, currency: 'SEK' },
    { title: 'Philips Hue Starter Kit', priceMinor: 169900, currency: 'SEK' }
  ]
};