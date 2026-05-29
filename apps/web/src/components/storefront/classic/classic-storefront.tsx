import { ClassicBrandStrip } from './classic-brand-strip';
import { ClassicCategoryGrid } from './classic-category-grid';
import { ClassicHero } from './classic-hero';
import { ClassicNewsletter } from './classic-newsletter';
import { ClassicProductGrid } from './classic-product-grid';
import { ClassicValueProps } from './classic-value-props';

export type ClassicStorefrontProps = {
  hero: React.ComponentProps<typeof ClassicHero>;
  categories: React.ComponentProps<typeof ClassicCategoryGrid>;
  products: React.ComponentProps<typeof ClassicProductGrid>;
  brands: React.ComponentProps<typeof ClassicBrandStrip>;
  values: React.ComponentProps<typeof ClassicValueProps>;
  newsletter: React.ComponentProps<typeof ClassicNewsletter>;
};

export function ClassicStorefront(props: ClassicStorefrontProps) {
  return (
    <>
      <ClassicHero {...props.hero} />
      <ClassicCategoryGrid {...props.categories} />
      <ClassicProductGrid {...props.products} />
      <ClassicBrandStrip {...props.brands} />
      <ClassicValueProps {...props.values} />
      <ClassicNewsletter {...props.newsletter} />
    </>
  );
}
