import type { StorefrontTheme, StorefrontThemeKey } from "./types";

export const defaultStorefrontThemeKey: StorefrontThemeKey = "luxury";

export const storefrontThemes: Record<StorefrontThemeKey, StorefrontTheme> = {
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
      { title: "Designer", href: "/products?category=designer", accentClass: "from-[#2d221b]" },
      { title: "Accessoarer", href: "/products?category=accessoarer", accentClass: "from-[#37281f]" },
      { title: "Parfym", href: "/products?category=parfym", accentClass: "from-[#2a211c]" },
      { title: "Hem", href: "/products?category=hem", accentClass: "from-[#3b3026]" },
    ],
    trustCards: [
      { title: "Premium kvalitet", text: "Noggrant utvalt sortiment", icon: "star" },
      { title: "Säkra betalningar", text: "Krypterad checkout", icon: "shield" },
      { title: "Snabb leverans", text: "1-2 arbetsdagar", icon: "truck" },
      { title: "Personlig service", text: "Support nära kunden", icon: "headset" },
    ],
    brandLogos: ["PRADA", "BOSS", "ARMANI", "TOM FORD", "CHANEL"],
  },
  minimal: {
    key: "minimal",
    name: "Minimal",
    description: "Clean Scandinavian storefront for calm, content-led commerce.",
    audience: "Lifestyle and home stores",
    tokens: {
      backgroundClass: "bg-[#f7f4ef]",
      surfaceClass: "bg-white",
      textClass: "text-[#171412]",
      mutedTextClass: "text-[#6f6760]",
      borderClass: "border-black/10",
      primaryButtonClass: "bg-[#171412] text-white hover:bg-black",
      secondaryButtonClass: "border border-black/15 text-[#171412] hover:bg-black/5",
      heroGradientClass: "from-[#f6efe5] via-[#f8f5ef] to-white",
      productCardClass: "bg-white border border-black/10",
      badgeClass: "bg-[#171412] text-white",
    },
    navigation: [
      { label: "Produkter", href: "/products" },
      { label: "Nyheter", href: "/nyheter" },
      { label: "Populärt", href: "/bastsaljare" },
      { label: "Om oss", href: "/om-oss" },
    ],
    categories: [
      { title: "Hem", href: "/products?category=hem", accentClass: "from-[#e8dfd2]" },
      { title: "Kontor", href: "/products?category=kontor", accentClass: "from-[#ddd5ca]" },
      { title: "Teknik", href: "/products?category=teknik", accentClass: "from-[#d8d0c4]" },
      { title: "Accessoarer", href: "/products?category=accessoarer", accentClass: "from-[#ece5dc]" },
    ],
    trustCards: [
      { title: "Fri frakt", text: "Över 499 kr", icon: "truck" },
      { title: "30 dagars öppet köp", text: "Enkelt och tryggt", icon: "shield" },
      { title: "Utvalt sortiment", text: "Färre men bättre produkter", icon: "star" },
      { title: "Snabb support", text: "Hjälp när du behöver", icon: "headset" },
    ],
    brandLogos: ["MUJI", "Aarke", "SONOS", "IKEA", "NORDIC"],
  },
  fashion: {
    key: "fashion",
    name: "Fashion",
    description: "Editorial fashion theme for apparel, shoes and accessories.",
    audience: "Fashion retailers",
    tokens: {
      backgroundClass: "bg-[#120f0d]",
      surfaceClass: "bg-[#1b1714]",
      textClass: "text-white",
      mutedTextClass: "text-stone-400",
      borderClass: "border-white/10",
      primaryButtonClass: "bg-[#f3d8b6] text-black hover:bg-[#ffe4c4]",
      secondaryButtonClass: "border border-white/20 text-white hover:bg-white/10",
      heroGradientClass: "from-[#2b211b] via-[#16110f] to-black",
      productCardClass: "bg-[#1b1714] border border-white/10",
      badgeClass: "bg-[#f3d8b6] text-black",
    },
    navigation: [
      { label: "Herr", href: "/products?category=herr" },
      { label: "Dam", href: "/products?category=dam" },
      { label: "Ytterkläder", href: "/products?category=ytterklader" },
      { label: "Nyheter", href: "/nyheter" },
    ],
    categories: [
      { title: "Herr", href: "/products?category=herr", accentClass: "from-[#2f2922]" },
      { title: "Dam", href: "/products?category=dam", accentClass: "from-[#3a332b]" },
      { title: "Ytterkläder", href: "/products?category=ytterklader", accentClass: "from-[#2a241f]" },
      { title: "Accessoarer", href: "/products?category=accessoarer", accentClass: "from-[#2b2520]" },
    ],
    trustCards: [
      { title: "Fri frakt", text: "Vid köp över 499 kr", icon: "truck" },
      { title: "30 dagars öppet köp", text: "Prova hemma", icon: "shield" },
      { title: "Premium kvalitet", text: "Noggrant utvalt", icon: "star" },
      { title: "Style support", text: "Hjälp med storlek", icon: "headset" },
    ],
    brandLogos: ["BOSS", "LEVI'S", "ARKET", "CALVIN KLEIN", "J.LINDEBERG"],
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
      { title: "Running", href: "/products?category=running", accentClass: "from-[#1f2f29]" },
      { title: "Outdoor", href: "/products?category=outdoor", accentClass: "from-[#27352f]" },
      { title: "Träning", href: "/products?category=traning", accentClass: "from-[#212826]" },
      { title: "Lagsport", href: "/products?category=lagsport", accentClass: "from-[#27302c]" },
    ],
    trustCards: [
      { title: "Snabb leverans", text: "1-2 arbetsdagar", icon: "truck" },
      { title: "Originalprodukter", text: "Verifierade varumärken", icon: "shield" },
      { title: "Prestationsfokus", text: "Produkter som håller", icon: "star" },
      { title: "Produkthjälp", text: "Rätt utrustning direkt", icon: "headset" },
    ],
    brandLogos: ["NIKE", "adidas", "PUMA", "SALOMON", "GARMIN"],
  },
  beauty: {
    key: "beauty",
    name: "Beauty",
    description: "Soft premium theme for skincare, makeup, fragrance and wellness.",
    audience: "Beauty stores",
    tokens: {
      backgroundClass: "bg-[#160f13]",
      surfaceClass: "bg-[#211820]",
      textClass: "text-white",
      mutedTextClass: "text-rose-100/60",
      borderClass: "border-white/10",
      primaryButtonClass: "bg-[#f6c7d6] text-black hover:bg-[#ffd9e5]",
      secondaryButtonClass: "border border-white/20 text-white hover:bg-white/10",
      heroGradientClass: "from-[#3b2430] via-[#1d1318] to-black",
      productCardClass: "bg-[#211820] border border-white/10",
      badgeClass: "bg-[#f6c7d6] text-black",
    },
    navigation: [
      { label: "Hudvård", href: "/products?category=hudvard" },
      { label: "Smink", href: "/products?category=smink" },
      { label: "Parfym", href: "/products?category=parfym" },
      { label: "Nyheter", href: "/nyheter" },
    ],
    categories: [
      { title: "Hudvård", href: "/products?category=hudvard", accentClass: "from-[#3b2e33]" },
      { title: "Smink", href: "/products?category=smink", accentClass: "from-[#44353a]" },
      { title: "Hårvård", href: "/products?category=harvard", accentClass: "from-[#3c3137]" },
      { title: "Parfym", href: "/products?category=parfym", accentClass: "from-[#4a3c42]" },
    ],
    trustCards: [
      { title: "Clean beauty", text: "Utvalda hållbara produkter", icon: "star" },
      { title: "Säkra betalningar", text: "Klarna, Swish och kort", icon: "shield" },
      { title: "Snabb leverans", text: "1-2 arbetsdagar", icon: "truck" },
      { title: "Beauty support", text: "Hitta rätt rutin", icon: "headset" },
    ],
    brandLogos: ["CHANEL", "CLINIQUE", "OLAPLEX", "L'ORÉAL", "KÉRASTASE"],
  },
  electronics: {
    key: "electronics",
    name: "Electronics",
    description: "Sharp high-conversion theme for electronics, gaming and smart home.",
    audience: "Electronics retailers",
    tokens: {
      backgroundClass: "bg-[#07111f]",
      surfaceClass: "bg-[#0d1b2f]",
      textClass: "text-white",
      mutedTextClass: "text-blue-100/60",
      borderClass: "border-white/10",
      primaryButtonClass: "bg-[#5eead4] text-black hover:bg-[#99f6e4]",
      secondaryButtonClass: "border border-white/20 text-white hover:bg-white/10",
      heroGradientClass: "from-[#0b2b58] via-[#09192e] to-black",
      productCardClass: "bg-[#0d1b2f] border border-white/10",
      badgeClass: "bg-[#5eead4] text-black",
    },
    navigation: [
      { label: "Datorer", href: "/products?category=datorer" },
      { label: "Mobil", href: "/products?category=mobil" },
      { label: "Gaming", href: "/products?category=gaming" },
      { label: "Erbjudanden", href: "/products?sort=price_desc" },
    ],
    categories: [
      { title: "Datorer", href: "/products?category=datorer", accentClass: "from-[#0b1f45]" },
      { title: "Mobil", href: "/products?category=mobil", accentClass: "from-[#122a57]" },
      { title: "Ljud & bild", href: "/products?category=ljud-bild", accentClass: "from-[#0e244e]" },
      { title: "Gaming", href: "/products?category=gaming", accentClass: "from-[#112b5a]" },
    ],
    trustCards: [
      { title: "Snabb leverans", text: "1-2 arbetsdagar", icon: "truck" },
      { title: "Säkra betalningar", text: "Klarna, Swish och kort", icon: "shield" },
      { title: "Originalgaranti", text: "Verifierade produkter", icon: "star" },
      { title: "Teknisk support", text: "Hjälp före och efter köp", icon: "headset" },
    ],
    brandLogos: ["APPLE", "SAMSUNG", "SONY", "BOSE", "GARMIN"],
  },
};

export function isStorefrontThemeKey(value: string): value is StorefrontThemeKey {
  return value in storefrontThemes;
}

export function getStorefrontTheme(themeKey?: string): StorefrontTheme {
  if (!themeKey || !isStorefrontThemeKey(themeKey)) {
    return storefrontThemes[defaultStorefrontThemeKey];
  }

  return storefrontThemes[themeKey];
}

export function getAvailableStorefrontThemes(): StorefrontTheme[] {
  return Object.values(storefrontThemes);
}
