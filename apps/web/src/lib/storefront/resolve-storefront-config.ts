import { beautyThemeConfig, classicThemeConfig, electronicsThemeConfig, fashionThemeConfig, luxuryThemeConfig, minimalThemeConfig, sportThemeConfig } from './configs';

export function getStorefrontConfig(themeKey?: string | null) {
  switch (themeKey) {
    case 'sport':
      return sportThemeConfig;
    case 'fashion':
      return fashionThemeConfig;
    case 'beauty':
      return beautyThemeConfig;
    case 'electronics':
      return electronicsThemeConfig;
    case 'minimal':
      return minimalThemeConfig;
    case 'luxury':
      return luxuryThemeConfig;
    default:
      return classicThemeConfig;
  }
}
