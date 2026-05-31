export type StorefrontNavItem = { label: string; href: string };

export type StorefrontCategoryCard = {
  title: string;
  accent?: string;
  description?: string;
  imageUrl?: string;
};

export type StorefrontTrustIcon = 'star' | 'shield' | 'truck' | 'headset';

export type StorefrontTrustCard = {
  title: string;
  text: string;
  icon: StorefrontTrustIcon;
};

export type StorefrontValueCard = { title: string; text: string };

export type StorefrontProduct = {
  title: string;
  priceMinor: number;
  currency: string;
  imageUrl?: string;
};

export type StorefrontThemeConfig = {
  key: string;
  categoriesTitle: string;
  bestSellersTitle: string;
  brandsTitle: string;
  hero: {
    title: string;
    description: string;
  };
  navItems: StorefrontNavItem[];
  categoryCards: StorefrontCategoryCard[];
  trustCards: StorefrontTrustCard[];
  brandLogos: string[];
  valueCards: StorefrontValueCard[];
  products: StorefrontProduct[];
};