import type { StorefrontTheme } from "./types";

export const storefrontThemes: Record<string, StorefrontTheme> = {
  luxury: {
    key: "luxury",
    name: "Luxury",
    description: "Premium theme for high-end lifestyle and luxury commerce.",
    audience: "Luxury brands",
    tokens: {
      backgroundClass: "bg-[#0f0f10]",
      surfaceClass: "bg-[#171719]",
      textClass: "text-white",
      mutedTextClass: "text-zinc-400",
      borderClass: "border-white/10",
      primaryButtonClass: "bg-white text-black hover:bg-zinc-200",
      secondaryButtonClass: "border border-white/20 text-white hover:bg-white/10",
      heroGradientClass: "from-[#1c1c1f] via-[#121214] to-black",
      productCardClass: "bg-[#161618] border border-white/10",
      badgeClass: "bg-white text-black",
    },
    navigation: [
      { label: "Nyheter", href: "/nyheter" },
      { label: "Bästsäljare", href: "/bastsaljare" },
      { label: "Varumärken", href: "/products" },
      { label: "Kundservice", href: "/kundservice" },
    ],
    categories: [
      {
        title: "Designer",
        href: "/products?category=designer",
        accentClass: "from-[#2d221b]",
      },
      {
        title: "Accessoarer",
        href: "/products?category=accessoarer",
        accentClass: "from-[#37281f]",
      },
    ],
    trustCards: [
      {
        title: "Premium kvalitet",
        text: "Noggrant utvalt sortiment",
        icon: "star",
      },
      {
        title: "Säkra betalningar",
        text: "Krypterad checkout",
        icon: "shield",
      },
    ],
    brandLogos: ["PRADA", "BOSS", "ARMANI", "TOM FORD"],
  },
  sport: {
    key: "sport",
    name: "Sport",
    description: "Energetic commerce theme for sports and outdoor brands.",
    audience: "Sports stores",
    tokens: {
      backgroundClass: "bg-[#0d1110]",
      surfaceClass: "bg-[#131918]",
      textClass: "text-white",
      mutedTextClass: "text-zinc-400",
      borderClass: "border-white/10",
      primaryButtonClass: "bg-lime-300 text-black hover:bg-lime-200",
      secondaryButtonClass: "border border-white/20 text-white hover:bg-white/10",
      heroGradientClass: "from-[#1f2d28] via-[#121715] to-black",
      productCardClass: "bg-[#141918] border border-white/10",
      badgeClass: "bg-lime-300 text-black",
    },
    navigation: [
      { label: "Herr", href: "/products?category=herr" },
      { label: "Dam", href: "/products?category=dam" },
      { label: "Outdoor", href: "/products?category=outdoor" },
      { label: "Löpning", href: "/products?category=lopning" },
    ],
    categories: [
      {
        title: "Running",
        href: "/products?category=running",
        accentClass: "from-[#1f2f29]",
      },
      {
        title: "Outdoor",
        href: "/products?category=outdoor",
        accentClass: "from-[#27352f]",
      },
    ],
    trustCards: [
      {
        title: "Snabb leverans",
        text: "1-2 arbetsdagar",
        icon: "truck",
      },
      {
        title: "Originalprodukter",
        text: "Verifierade varumärken",
        icon: "shield",
      },
    ],
    brandLogos: ["NIKE", "adidas", "PUMA", "SALOMON"],
  },
};

export function getStorefrontTheme(themeKey?: string): StorefrontTheme {
  if (!themeKey) {
    return storefrontThemes.luxury;
  }

  return storefrontThemes[themeKey] || storefrontThemes.luxury;
}
