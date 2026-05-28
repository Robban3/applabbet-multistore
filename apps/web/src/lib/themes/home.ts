import { getStorefrontTheme } from "./catalog";
import type { StorefrontThemeKey } from "./types";

export type HomeThemePreset = ReturnType<typeof getHomeThemePreset>;

export function getHomeThemePreset(themeKey?: StorefrontThemeKey | string) {
  const theme = getStorefrontTheme(themeKey);

  return {
    theme,
    navItems: theme.navigation,
    categoryCards: theme.categories.map((category) => ({
      title: category.title,
      href: category.href,
      accent: category.accentClass,
    })),
    trustCards: theme.trustCards,
    brandLogos: theme.brandLogos,
    tokens: theme.tokens,
  };
}
