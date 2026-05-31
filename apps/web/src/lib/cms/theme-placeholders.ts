import type { TenantSettings } from "@/lib/tenant-settings";
import type { CmsBlocksContent } from "@/lib/cms/registry";

type ThemeKey = TenantSettings["theme_key"];

type ThemeBlocks = Record<string, Record<string, string>>;

function mergeBlocks(
  base: CmsBlocksContent,
  override?: ThemeBlocks,
): CmsBlocksContent {
  if (!override) {
    return base;
  }

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
    navigation: {
      item1Label: "Hem",
      item1Href: "/",
      item2Label: "Kategorier",
      item2Href: "/products",
      item3Label: "Nyheter",
      item3Href: "/nyheter",
      item4Label: "Bästsäljare",
      item4Href: "/bastsaljare",
      item5Label: "Om oss",
      item5Href: "/om-oss",
      item6Label: "Kundservice",
      item6Href: "/kundservice",
    },
    hero: {
      eyebrow: "Premium kvalitet. Utvalt med omsorg.",
      title: "Upplev kvalitet. Varje dag.",
      description: "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet.",
      primaryCtaLabel: "Shoppa nu",
      primaryCtaHref: "/products",
      secondaryCtaLabel: "Utforska kollektioner",
      secondaryCtaHref: "/products",
      imageUrl: "/images/hero-classic.png",
    },
    trustCards: {
      card1Title: "Fri frakt",
      card1Text: "Vid köp över 499 kr",
      card1Icon: "truck",
      card2Title: "30 dagars öppet köp",
      card2Text: "Enkelt & smidigt",
      card2Icon: "headset",
      card3Title: "Premium kvalitet",
      card3Text: "Utvalt med omsorg",
      card3Icon: "star",
      card4Title: "Säkra betalningar",
      card4Text: "Tryggt & säkert",
      card4Icon: "shield",
    },
    categories: {
      sectionTitle: "Upptäck våra kategorier",
      item1Title: "Ljud & Hörlurar",
      item2Title: "Klockor",
      item3Title: "Hem & Inredning",
      item4Title: "Väskor",
      item5Title: "Parfymer",
      item6Title: "Accessoarer",
    },
    bestSellers: {
      sectionTitle: "Bästsäljare",
      viewAllLabel: "Visa alla",
      badgeBestSeller: "BÄSTSÄLJARE",
      badgeNew: "NYHET",
      ratingCount: "(120)",
    },
    brands: {
      title: "Betrodd av tusentals nöjda kunder",
      brand1: "SONY",
      brand2: "BOSE",
      brand3: "dyson",
      brand4: "GARMIN",
      brand5: "SAMSUNG",
      brand6: "APPLE",
      brand7: "PHILIPS",
    },
    valueCards: {
      card1Title: "Hållbarhet i fokus",
      card1Text: "Vi väljer produkter och leverantörer med omtanke om miljön.",
      card2Title: "Kundservice i världsklass",
      card2Text: "Vi finns här för dig - snabbt, personligt och engagerat.",
      card3Title: "Nöjda kunder",
      card3Text: "Över 10 000+ kunder älskar våra produkter.",
    },
  },
  luxury: {
    navigation: {
      item1Label: "Hem",
      item1Href: "/",
      item2Label: "Kollektioner",
      item2Href: "/products",
      item3Label: "Nyheter",
      item3Href: "/nyheter",
      item4Label: "Bästsäljare",
      item4Href: "/bastsaljare",
      item5Label: "Om oss",
      item5Href: "/om-oss",
      item6Label: "Kontakt",
      item6Href: "/kontakt",
    },
    hero: {
      eyebrow: "Exklusivt urval av tidlösa pjäser",
      title: "Konsten att\nleva väl.",
      description: "Noggrant utvalt för dig som värderar det extraordinära — tidlösa pjäser med oöverträffad kvalitet.",
      primaryCtaLabel: "Utforska kollektionen",
      primaryCtaHref: "/products",
      secondaryCtaLabel: "Boka rådgivning",
      secondaryCtaHref: "/kontakt",
      imageUrl: "/images/hero-luxury.jpg",
    },
    trustCards: {
      card1Title: "Fri frakt",
      card1Text: "Vid köp över 999 kr",
      card1Icon: "truck",
      card2Title: "Äkthetsintyg",
      card2Text: "Garanterat original",
      card2Icon: "shield",
      card3Title: "Premium kvalitet",
      card3Text: "Utvalt med precision",
      card3Icon: "star",
      card4Title: "Diskret service",
      card4Text: "Personlig rådgivning",
      card4Icon: "headset",
    },
    categories: {
      sectionTitle: "Nos Collections",
      item1Title: "Smycken",
      item2Title: "Ur & Klockor",
      item3Title: "Lädervaror",
      item4Title: "Parfym",
      item5Title: "Accessoarer",
      item6Title: "Limited Edition",
    },
    bestSellers: {
      sectionTitle: "Pièces d'exception",
      viewAllLabel: "Visa hela kollektionen",
      badgeBestSeller: "EXKLUSIV",
      badgeNew: "NOUVEAU",
      ratingCount: "(48)",
    },
    brands: {
      title: "Maisons partenaires",
      brand1: "CARTIER",
      brand2: "HERMÈS",
      brand3: "CHANEL",
      brand4: "BULGARI",
      brand5: "TIFFANY",
      brand6: "VAN CLEEF",
    },
    valueCards: {
      card1Title: "Tidlös elegans",
      card1Text: "Vi kurerar enbart pjäser som håller i generationer.",
      card2Title: "Personlig service",
      card2Text: "Din dedikerade rådgivare finns tillgänglig för dig.",
      card3Title: "Garanterad äkthet",
      card3Text: "Varje produkt levereras med äkthetsintyg.",
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
  luxury: {
    hero: {
      title: "Luxury Collection",
      description: "Exklusiva produkter for dig som vill ha premiumkansla, kvalitet och hantverk.",
      trustLine1: "Premium kvalitet",
      trustLine2: "Noggrant utvalt sortiment",
      trustLine3: "Exklusiv service",
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
  luxury: {
    hero: {
      title: "Luxury News",
      description: "Senaste premiumprodukterna och exklusiva nyheter i sortimentet.",
    },
  },
  minimal: { hero: { title: "Nya favoriter", description: "Nyheter med fokus pa enkel design och kvalitet." } },
  sport: { hero: { title: "Nya sportslapp", description: "Senaste inom lopning, traning och outdoor." } },
  fashion: { hero: { title: "Nya kollektioner", description: "Sasongens senaste mode och accessoarer." } },
  beauty: { hero: { title: "Beauty-nyheter", description: "Nya slapp inom hudvard, smink och harvard." } },
  electronics: { hero: { title: "Tech-nyheter", description: "Det senaste inom datorer, mobil och smarta hem." } },
};

const detailThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: {},
  luxury: {
    productInfo: {
      trustLine1: "Premium kvalitet",
      trustLine2: "Exklusiv service",
      trustLine3: "Noggrant utvalt sortiment",
    },
  },
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