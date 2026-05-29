export type StorefrontNavItem = { label: string; href: string };

export type StorefrontCategoryCard = { title: string; description?: string };

export type StorefrontTrustCard = { title: string; text: string; icon?: string };

export type StorefrontValueCard = { title: string; text: string };

export type StorefrontProduct = {
  title: string;
  priceMinor: number;
  currency: string;
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
  navItems?: StorefrontNavItem[];
  categoryCards?: StorefrontCategoryCard[];
  trustCards?: StorefrontTrustCard[];
  brandLogos?: string[];
  valueCards?: StorefrontValueCard[];
  products?: StorefrontProduct[];
};