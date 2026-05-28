import type { TenantSettings } from "@/lib/tenant-settings";
import type { CmsBlocksContent } from "@/lib/cms/registry";

type ThemeKey = TenantSettings["theme_key"];

type ThemeBlocks = Record<string, Record<string, string>>;

function mergeBlocks(base: CmsBlocksContent, override: ThemeBlocks): CmsBlocksContent {
  const merged: CmsBlocksContent = { ...base };
  for (const [blockKey, fields] of Object.entries(override)) {
    merged[blockKey] = {
      ...(merged[blockKey] || {}),
      ...fields,
    };
  }
  return merged;
}

const homeThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: {
    hero: {
      eyebrow: "Premium kvalitet. Utvalt med omsorg.",
      title: "Upplev kvalitet. Varje dag.",
      description: "Noggrant utvalda produkter som kombinerar design, prestanda och hallbarhet.",
    },
    categories: {
      sectionTitle: "Upptack vara kategorier",
      item1Title: "Ljud & Horlurar",
      item2Title: "Klockor",
      item3Title: "Hem & Inredning",
      item4Title: "Vaskor",
      item5Title: "Parfymer",
      item6Title: "Accessoarer",
    },
    bestSellers: {
      sectionTitle: "Bastsaljare",
      viewAllLabel: "Visa alla",
      badgeBestSeller: "BASTSALJARE",
      badgeNew: "NYHET",
      ratingCount: "(120)",
    },
  },
  minimal: {
    hero: {
      eyebrow: "Enkelt. Rent. Funktionellt.",
      title: "Det viktigaste\nutan brus",
      description: "Noggrant utvalda produkter i ett minimalistiskt uttryck med fokus pa kvalitet.",
      primaryCtaLabel: "Utforska",
      secondaryCtaLabel: "Se nyheter",
    },
    categories: {
      sectionTitle: "Kategorier",
      item1Title: "Basprodukter",
      item2Title: "Hem",
      item3Title: "Kontor",
      item4Title: "Teknik",
      item5Title: "Accessoarer",
      item6Title: "Nyheter",
    },
    bestSellers: {
      sectionTitle: "Populart just nu",
    },
  },
  sport: {
    hero: {
      eyebrow: "Prestera. Varje dag.",
      title: "Din traning.\nDin styrka.",
      description: "Utrustning, klader och skor som hjalper dig att na dina mal - oavsett niva.",
      secondaryCtaLabel: "Utforska nyheter",
    },
    categories: {
      sectionTitle: "Kategorier",
      item1Title: "Loparskor",
      item2Title: "Traningsklader",
      item3Title: "Traning",
      item4Title: "Lagsport",
      item5Title: "Outdoor",
      item6Title: "Accessoarer",
    },
  },
  fashion: {
    hero: {
      eyebrow: "Premium mode. Tidlos stil.",
      title: "Kla dig med\nsjalvfortroende.",
      description: "Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil.",
      secondaryCtaLabel: "Utforska kollektioner",
    },
    categories: {
      sectionTitle: "Upptack vara kollektioner",
      item1Title: "Herr",
      item2Title: "Dam",
      item3Title: "Ytterklader",
      item4Title: "Trojor",
      item5Title: "Byxor & Jeans",
      item6Title: "Accessoarer",
    },
  },
  beauty: {
    hero: {
      eyebrow: "Skonhet. Sjalvkansla. Du.",
      title: "Lyft din naturliga\nskonhet",
      description: "Upptack hudvard, smink och dofter - noggrant utvalt for att framhava det basta i dig.",
      secondaryCtaLabel: "Se nyheter",
    },
    categories: {
      sectionTitle: "Shoppa kategori",
      item1Title: "Hudvard",
      item2Title: "Smink",
      item3Title: "Harvard",
      item4Title: "Parfym",
      item5Title: "Kropp & Bad",
      item6Title: "Beauty Tools",
    },
  },
  electronics: {
    hero: {
      eyebrow: "Teknik. Kvalitet. Innovation.",
      title: "Teknik for\nvarje dag",
      description: "Upptack de senaste produkterna inom elektronik. Kvalitet, prestanda och design.",
      secondaryCtaLabel: "Se alla erbjudanden",
    },
    categories: {
      sectionTitle: "Shoppa kategori",
      item1Title: "Datorer & tillbehor",
      item2Title: "Mobil & surfplattor",
      item3Title: "Ljud & bild",
      item4Title: "Spel & gaming",
      item5Title: "Smarta hem",
      item6Title: "Hemelektronik",
    },
  },
};

const productsThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: {
    hero: {
      title: "Ljud & Horlurar",
      description: "Upptack var kollektion av horlurar, hogtalare och ljudprodukter.",
      trustLine1: "Premium kvalitet",
      trustLine2: "Topprankade av vara kunder",
      trustLine3: "2 ars garanti",
    },
  },
  minimal: {
    hero: {
      title: "Noggrant utvalt",
      description: "Ett kuraterat sortiment med fokus pa funktion, kvalitet och enkelhet.",
      trustLine1: "Fri frakt over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
  sport: {
    hero: {
      title: "Traning & prestanda",
      description: "Allt du behover for lopning, styrka och vardagsaktivitet.",
      trustLine1: "Fri frakt over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
  fashion: {
    hero: {
      title: "Mode & accessoarer",
      description: "Stilsakra plagg med premiumkansla for varje tillfalle.",
    },
  },
  beauty: {
    hero: {
      title: "Hudvard & skonhet",
      description: "Vardagsrutiner och professionella favoriter i ett handplockat sortiment.",
    },
  },
  electronics: {
    hero: {
      title: "Datorer & tillbehor",
      description: "Upptack datorer, skarmar, tangentbord, moss och mycket mer.",
      trustLine1: "Fri frakt over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
};

const nyheterThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: { hero: { title: "Nyheter 2026" } },
  minimal: { hero: { title: "Nya favoriter", description: "Nyheter med fokus pa enkel design och kvalitet." } },
  sport: { hero: { title: "Nya sportslapp", description: "Senaste inom lopning, traning och outdoor." } },
  fashion: { hero: { title: "Nya kollektioner", description: "Sasongens senaste mode och accessoarer." } },
  beauty: { hero: { title: "Beauty-nyheter", description: "Nya slapp inom hudvard, smink och harvard." } },
  electronics: { hero: { title: "Tech-nyheter", description: "Det senaste inom datorer, mobil och smarta hem." } },
};

const detailThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: {},
  minimal: {
    productInfo: {
      trustLine1: "Fri frakt vid kop over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "Trygg support nar du behover den",
    },
  },
  sport: {
    productInfo: {
      trustLine1: "Fri frakt vid kop over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "Byggd for aktiv anvandning",
    },
  },
  fashion: {
    productInfo: {
      trustLine3: "Premium material och finish",
    },
  },
  beauty: {
    productInfo: {
      trustLine3: "Noggrant utvalda ingredienser",
    },
  },
  electronics: {
    productInfo: {
      trustLine1: "Fri frakt vid kop over 499 kr",
      trustLine2: "30 dagars oppet kop",
      trustLine3: "2 ars garanti",
    },
  },
};

export function applyThemePlaceholdersToDefaults(
  pageKey: string,
  themeKey: ThemeKey,
  defaults: CmsBlocksContent,
): CmsBlocksContent {
  if (pageKey === "home") {
    return mergeBlocks(defaults, homeThemeBlocks[themeKey]);
  }
  if (pageKey === "products") {
    return mergeBlocks(defaults, productsThemeBlocks[themeKey]);
  }
  if (pageKey === "nyheter") {
    return mergeBlocks(defaults, nyheterThemeBlocks[themeKey]);
  }
  if (pageKey === "product-detail") {
    return mergeBlocks(defaults, detailThemeBlocks[themeKey]);
  }
  return defaults;
}

