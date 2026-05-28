export type StorefrontThemeKey =
  | "luxury"
  | "minimal"
  | "fashion"
  | "sport"
  | "beauty"
  | "electronics";

export type ThemeNavigationItem = {
  label: string;
  href: string;
};

export type ThemeCategoryCard = {
  title: string;
  href: string;
  accentClass: string;
};

export type ThemeTrustCard = {
  title: string;
  text: string;
  icon: "star" | "shield" | "truck" | "headset";
};

export type StorefrontTheme = {
  key: StorefrontThemeKey;
  name: string;
  description: string;
  audience: string;
  tokens: {
    backgroundClass: string;
    surfaceClass: string;
    textClass: string;
    mutedTextClass: string;
    borderClass: string;
    primaryButtonClass: string;
    secondaryButtonClass: string;
    heroGradientClass: string;
    productCardClass: string;
    badgeClass: string;
  };
  navigation: ThemeNavigationItem[];
  categories: ThemeCategoryCard[];
  trustCards: ThemeTrustCard[];
  brandLogos: string[];
};
