import type { StorefrontThemeConfig } from '../types';

export const luxuryThemeConfig: StorefrontThemeConfig = {
  key: 'luxury',
  categoriesTitle: 'Nos Collections',
  bestSellersTitle: 'Pièces d\'exception',
  brandsTitle: 'Maisons partenaires',
  hero: {
    title: 'Konsten att\nleva väl.',
    description: 'Noggrant utvalt för dig som värderar det extraordinära — tidlösa pjäser med oöverträffad kvalitet.',
  },
  navItems: [
    { label: 'Hem', href: '/' },
    { label: 'Kollektioner', href: '/products' },
    { label: 'Nyheter', href: '/nyheter' },
    { label: 'Bästsäljare', href: '/bastsaljare' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  categoryCards: [
    { title: 'Smycken', accent: 'from-[#1a0f0f]' },
    { title: 'Ur & Klockor', accent: 'from-[#0f1218]' },
    { title: 'Lädervaror', accent: 'from-[#1a130a]' },
    { title: 'Parfym', accent: 'from-[#14101a]' },
    { title: 'Accessoarer', accent: 'from-[#0f1a14]' },
    { title: 'Limited Edition', accent: 'from-[#1a0f12]' },
  ],
  trustCards: [
    { title: 'Fri frakt', text: 'Vid köp över 999 kr', icon: 'truck' },
    { title: 'Äkthetsintyg', text: 'Garanterat original', icon: 'shield' },
    { title: 'Premium kvalitet', text: 'Utvalt med precision', icon: 'star' },
    { title: 'Diskret service', text: 'Personlig rådgivning', icon: 'headset' },
  ],
  brandLogos: ['CARTIER', 'HERMÈS', 'CHANEL', 'BULGARI', 'TIFFANY', 'VAN CLEEF'],
  valueCards: [
    {
      title: 'Tidlös elegans',
      text: 'Vi kurerar enbart pjäser som håller i generationer — design utan kompromiss.',
    },
    {
      title: 'Personlig service',
      text: 'Din dedikerade rådgivare finns tillgänglig för en unik shoppingupplevelse.',
    },
    {
      title: 'Garanterad äkthet',
      text: 'Varje produkt levereras med äkthetsintyg och exklusiv förpackning.',
    },
  ],
  products: [
    { title: 'Panthère de Cartier Ring', priceMinor: 4999900, currency: 'SEK' },
    { title: 'Santos de Cartier Klocka', priceMinor: 8999900, currency: 'SEK' },
    { title: 'Love Armband', priceMinor: 6499900, currency: 'SEK' },
    { title: 'Juste un Clou Halsband', priceMinor: 3299900, currency: 'SEK' },
    { title: 'Ballon Bleu Klocka', priceMinor: 7499900, currency: 'SEK' },
    { title: 'Trinity Ring', priceMinor: 2199900, currency: 'SEK' },
  ],
};
