import { beautyThemeConfig, classicThemeConfig, electronicsThemeConfig, fashionThemeConfig, luxuryThemeConfig, minimalThemeConfig, sportThemeConfig } from './configs';
import type { StorefrontThemeConfig } from './types';

const CONFIGS: Record<string, StorefrontThemeConfig> = {
  classic: classicThemeConfig,
  sport: sportThemeConfig,
  fashion: fashionThemeConfig,
  beauty: beautyThemeConfig,
  electronics: electronicsThemeConfig,
  minimal: minimalThemeConfig,
  luxury: luxuryThemeConfig,
};

// Injicerar genererade mock-bilder (kategori-tiles) per tema utan att
// behöva hårdkoda imageUrl i varje config. Befintliga imageUrl respekteras.
function withMockImages(themeKey: string, config: StorefrontThemeConfig): StorefrontThemeConfig {
  return {
    ...config,
    categoryCards: config.categoryCards.map((card, i) => ({
      ...card,
      imageUrl: card.imageUrl || `/images/categories/${themeKey}-${(i % 6) + 1}.svg`,
    })),
  };
}

export function getStorefrontConfig(themeKey?: string | null) {
  const key = themeKey && CONFIGS[themeKey] ? themeKey : 'classic';
  return withMockImages(key, CONFIGS[key]);
}

// Hero-bild per tema (mock) — används som fallback när CMS saknar bild.
export function getThemeHeroImage(themeKey?: string | null): string {
  const key = themeKey && CONFIGS[themeKey] ? themeKey : 'classic';
  return `/images/heroes/${key}.svg`;
}
