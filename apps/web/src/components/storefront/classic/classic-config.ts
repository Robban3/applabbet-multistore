import type {
  ClassicBrandStripProps,
  ClassicCategoryGridProps,
  ClassicHeroProps,
  ClassicNewsletterProps,
  ClassicProductGridProps,
  ClassicValuePropsProps,
} from './index';

export type ClassicStorefrontConfig = {
  hero: ClassicHeroProps;
  categories: ClassicCategoryGridProps;
  products: ClassicProductGridProps;
  brands: ClassicBrandStripProps;
  values: ClassicValuePropsProps;
  newsletter: ClassicNewsletterProps;
};
