import type { TenantSettings } from "@/lib/tenant-settings";
import type { CmsBlocksContent } from "@/lib/cms/registry";
import { getStorefrontConfig } from "@/lib/storefront/resolve-storefront-config";
import type { StorefrontThemeKey } from "@/lib/themes/types";

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
      item6Label: "Kundservice",
      item6Href: "/kundservice",
    },
    hero: {
      eyebrow: "Exklusivt urval av tidlösa pjäser",
      title: "Konsten att\nleva väl.",
      description: "Noggrant utvalt för dig som värderar det extraordinära — tidlösa pjäser med oöverträffad kvalitet.",
      primaryCtaLabel: "Utforska kollektionen",
      primaryCtaHref: "/products",
      secondaryCtaLabel: "Boka rådgivning",
      secondaryCtaHref: "/kundservice",
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
      description: "Noggrant utvalda produkter i ett minimalistiskt uttryck med fokus på kvalitet.",
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
      sectionTitle: "Populärt just nu",
    },
  },
  sport: {
    hero: {
      eyebrow: "Prestera. Varje dag.",
      title: "Din träning.\nDin styrka.",
      description: "Utrustning, kläder och skor som hjälper dig att nå dina mål - oavsett nivå.",
      secondaryCtaLabel: "Utforska nyheter",
    },
    categories: {
      sectionTitle: "Kategorier",
      item1Title: "Löparskor",
      item2Title: "Träningskläder",
      item3Title: "Träning",
      item4Title: "Lagsport",
      item5Title: "Outdoor",
      item6Title: "Accessoarer",
    },
  },
  fashion: {
    hero: {
      eyebrow: "Premium mode. Tidlös stil.",
      title: "Klä dig med\nsjälvförtroende.",
      description: "Noggrant utvalda plagg som kombinerar kvalitet, komfort och stil.",
      secondaryCtaLabel: "Utforska kollektioner",
    },
    categories: {
      sectionTitle: "Upptäck våra kollektioner",
      item1Title: "Herr",
      item2Title: "Dam",
      item3Title: "Ytterkläder",
      item4Title: "Tröjor",
      item5Title: "Byxor & Jeans",
      item6Title: "Accessoarer",
    },
  },
  beauty: {
    hero: {
      eyebrow: "Skönhet. Självkänsla. Du.",
      title: "Lyft din naturliga\nskönhet",
      description: "Upptäck hudvård, smink och dofter - noggrant utvalt för att framhäva det bästa i dig.",
      secondaryCtaLabel: "Se nyheter",
    },
    categories: {
      sectionTitle: "Shoppa kategori",
      item1Title: "Hudvård",
      item2Title: "Smink",
      item3Title: "Hårvård",
      item4Title: "Parfym",
      item5Title: "Kropp & Bad",
      item6Title: "Beauty Tools",
    },
  },
  electronics: {
    hero: {
      eyebrow: "Teknik. Kvalitet. Innovation.",
      title: "Teknik för\nvarje dag",
      description: "Upptäck de senaste produkterna inom elektronik. Kvalitet, prestanda och design.",
      secondaryCtaLabel: "Se alla erbjudanden",
    },
    categories: {
      sectionTitle: "Shoppa kategori",
      item1Title: "Datorer & tillbehör",
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
      title: "Ljud & Hörlurar",
      description: "Upptäck vår kollektion av hörlurar, högtalare och ljudprodukter.",
      trustLine1: "Premium kvalitet",
      trustLine2: "Topprankade av våra kunder",
      trustLine3: "2 års garanti",
    },
  },
  luxury: {
    hero: {
      title: "Nos Collections",
      description: "Noggrant kuraterade pjäser — exklusivt urval av det extraordinära.",
      trustLine1: "Garanterad äkthet",
      trustLine2: "Personlig service",
      trustLine3: "Diskret leverans",
    },
  },
  minimal: {
    hero: {
      title: "Noggrant utvalt",
      description: "Ett kuraterat sortiment med fokus på funktion, kvalitet och enkelhet.",
      trustLine1: "Fri frakt över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
  sport: {
    hero: {
      title: "Alla produkter",
      description: "Utforska hela sortimentet — kläder, skor och utrustning.",
      trustLine1: "Fri frakt över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
  fashion: {
    hero: {
      title: "Mode & accessoarer",
      description: "Stilsäkra plagg med premiumkänsla för varje tillfälle.",
    },
  },
  beauty: {
    hero: {
      title: "Hudvård & skönhet",
      description: "Vardagsrutiner och professionella favoriter i ett handplockat sortiment.",
    },
  },
  electronics: {
    hero: {
      title: "Datorer & tillbehör",
      description: "Upptäck datorer, skärmar, tangentbord, möss och mycket mer.",
      trustLine1: "Fri frakt över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "Snabb leverans 1-2 arbetsdagar",
    },
  },
};

const nyheterThemeBlocks: Record<ThemeKey, ThemeBlocks> = {
  classic: { hero: { title: "Nyheter 2026" } },
  luxury: {
    hero: {
      title: "Nouveautés",
      description: "De senaste tillskotten i vår kollektion — noggrant utvalda för det extraordinära.",
    },
  },
  minimal: { hero: { title: "Nya favoriter", description: "Nyheter med fokus på enkel design och kvalitet." } },
  sport: { hero: { title: "Nya sportssläpp", description: "Senaste inom löpning, träning och outdoor." } },
  fashion: { hero: { title: "Nya kollektioner", description: "Säsongens senaste mode och accessoarer." } },
  beauty: { hero: { title: "Beauty-nyheter", description: "Nya släpp inom hudvård, smink och hårvård." } },
  electronics: { hero: { title: "Tech-nyheter", description: "Det senaste inom datorer, mobil och smarta hem." } },
};

const bastsaljareThemeBlocks: Record<string, ThemeBlocks> = {
  luxury: {
    hero: {
      eyebrow: "Sélection",
      title: "Pièces d'exception",
      description: "Noggrant kuraterade pjäser — de mest eftertraktade i vår kollektion.",
    },
  },
  sport: {
    hero: {
      eyebrow: "Toppval",
      title: "Mest populärt just nu",
      description: "De produkter våra kunder älskar mest — utvalda för prestation och hållbarhet.",
    },
  },
  fashion: {
    hero: {
      eyebrow: "Editor's Pick",
      title: "Säsongens bästsäljare",
      description: "De plagg och accessoarer som våra kunder återkommer till, gång på gång.",
    },
  },
  beauty: {
    hero: {
      eyebrow: "Mest älskade",
      title: "Kundernas favoriter",
      description: "De skönhetsprodukter som säljer mest — beprövade och rekommenderade av tusentals kunder.",
    },
  },
  electronics: {
    hero: {
      eyebrow: "Topplistade",
      title: "Mest sålda just nu",
      description: "Teknikprodukterna som flest kunder väljer — för en bättre vardag.",
    },
  },
  minimal: {
    hero: {
      eyebrow: "Kuraterat urval",
      title: "Det mest populära",
      description: "Enkla, välgjorda produkter som våra kunder återvänder till.",
    },
  },
};

const omOssThemeBlocks: Record<string, ThemeBlocks> = {
  luxury: {
    hero: {
      eyebrow: "Maison",
      title: "L'histoire de la maison",
      description: "En passion för det extraordinära — noggrant kuraterade pjäser sedan grundandet.",
    },
    values: {
      title: "Ce en quoi nous croyons",
    },
    story: {
      teamTitle: "L'équipe",
      historyTitle: "Notre histoire",
      historyText: "Allt började med en vision: att göra det allra bästa tillgängligt. Idag är vi en av Nordens ledande aktörer inom premium och lyx.",
    },
  },
  sport: {
    hero: {
      eyebrow: "Om oss",
      title: "Mer än en sportbutik.\nEn drivkraft för bättre prestation.",
      description: "Vi föddes ur en passion för träning och rörelsen och viljan att hjälpa dig nå din fulla potential.",
    },
    values: {
      title: "Det vi står för",
    },
    story: {
      teamTitle: "Teamet bakom",
      historyTitle: "Från idé till rörelse",
      historyText: "Allt började med en enkel idé: att samla de bästa produkterna för träning och aktiv livsstil på ett ställe.",
    },
  },
  fashion: {
    hero: {
      eyebrow: "Vår berättelse",
      title: "Mode med\nmening och känsla.",
      description: "Vi tror på kläder som uttrycker vem du är — noggrant utvalda plagg med fokus på kvalitet och hållbarhet.",
    },
    values: {
      title: "Vår filosofi",
    },
    story: {
      teamTitle: "Bakom kollektionen",
      historyTitle: "Hur det började",
      historyText: "Vi startade med en passion för stil och en övertygelse om att bra kläder ska vara tillgängliga för alla.",
    },
  },
  beauty: {
    hero: {
      eyebrow: "Vår passion",
      title: "Skönhet som\nstärker självkänslan.",
      description: "Vi kurerar skönhetsprodukter som verkligen fungerar — handplockade av experter för att lyfta din naturliga skönhet.",
    },
    values: {
      title: "Vad vi tror på",
    },
    story: {
      teamTitle: "Våra experteer",
      historyTitle: "Berättelsen bakom",
      historyText: "Vi grundades av skönhetsexperter med en gemensam vision: att göra kvalitetsprodukter enkla att hitta och förstå.",
    },
  },
  electronics: {
    hero: {
      eyebrow: "Om oss",
      title: "Teknik som\nförenklar vardagen.",
      description: "Vi hjälper dig navigera teknikdjungeln och hitta produkterna som verkligen gör skillnad i din vardag.",
    },
    values: {
      title: "Vad vi värdesätter",
    },
    story: {
      teamTitle: "Teknikexperterna",
      historyTitle: "Vår resa",
      historyText: "Grundat av teknikentusiaster med ett enkelt mål: att göra de bästa elektronikprodukterna tillgängliga för alla.",
    },
  },
  minimal: {
    hero: {
      eyebrow: "Om oss",
      title: "Enkelt gjort.\nBra från grunden.",
      description: "Vi väljer ut produkter som verkligen håller — utan onödiga kompromisser eller brus.",
    },
    values: {
      title: "Vår filosofi",
    },
    story: {
      teamTitle: "Teamet",
      historyTitle: "Varför vi finns",
      historyText: "Vi startade ur en frustration över för många val och för lite kvalitet. Lösningen: ett noggrant kurerat sortiment.",
    },
  },
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
      trustLine1: "Fri frakt vid köp över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "Trygg support när du behöver den",
    },
  },
  sport: {
    productInfo: {
      trustLine1: "Fri frakt vid köp över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "Byggd för aktiv användning",
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
      trustLine1: "Fri frakt vid köp över 499 kr",
      trustLine2: "30 dagars öppet köp",
      trustLine3: "2 års garanti",
    },
  },
};

function storefrontToHomeBlocks(themeKey: StorefrontThemeKey): ThemeBlocks {
  const config = getStorefrontConfig(themeKey);
  const navigation: Record<string, string> = {};
  config.navItems.slice(0, 6).forEach((item, index) => {
    const n = index + 1;
    navigation[`item${n}Label`] = item.label;
    navigation[`item${n}Href`] = item.href;
  });

  const categories: Record<string, string> = { sectionTitle: config.categoriesTitle };
  config.categoryCards.slice(0, 6).forEach((card, index) => {
    categories[`item${index + 1}Title`] = card.title;
  });

  const brands: Record<string, string> = { title: config.brandsTitle };
  config.brandLogos.slice(0, 7).forEach((brand, index) => {
    brands[`brand${index + 1}`] = brand;
  });

  const trustCards: Record<string, string> = {};
  config.trustCards.slice(0, 4).forEach((card, index) => {
    const n = index + 1;
    trustCards[`card${n}Title`] = card.title;
    trustCards[`card${n}Text`] = card.text;
    trustCards[`card${n}Icon`] = card.icon;
  });

  const valueCards: Record<string, string> = {};
  config.valueCards.slice(0, 3).forEach((card, index) => {
    const n = index + 1;
    valueCards[`card${n}Title`] = card.title;
    valueCards[`card${n}Text`] = card.text;
  });

  return {
    navigation,
    hero: {
      title: config.hero.title,
      description: config.hero.description,
    },
    categories,
    bestSellers: {
      sectionTitle: config.bestSellersTitle,
      viewAllLabel: "Visa alla",
    },
    brands,
    trustCards,
    valueCards,
  };
}

const kundserviceThemeBlocks: Partial<Record<ThemeKey, ThemeBlocks>> = {
  sport: {
    hero: {
      eyebrow: "Support",
      title: "Vi har\ndin rygg.",
      description:
        "Frågor om order, leverans eller retur? Vårt team löser det snabbt — så du kan fokusera på träningen.",
    },
  },
  fashion: {
    hero: {
      title: "Vi finns här för dig.",
      description: "Frågor om order, storlek eller retur? Vi hjälper dig gärna.",
    },
  },
  minimal: {
    hero: {
      title: "Vi finns här för dig.",
      description: "Frågor om order, leverans eller retur? Vi hjälper dig gärna.",
    },
  },
  electronics: {
    hero: {
      title: "Vi finns här för dig.",
      description: "Frågor om order, leverans eller retur? Vi hjälper dig gärna.",
    },
  },
  beauty: {
    hero: {
      title: "Hur kan vi hjälpa dig?",
      description: "Hitta svar snabbt eller kontakta vårt team.",
    },
  },
};

export function applyThemePlaceholdersToDefaults(
  pageKey: string,
  themeKey: ThemeKey,
  defaults: CmsBlocksContent,
): CmsBlocksContent {
  if (pageKey === "home") {
    return mergeBlocks(
      defaults,
      mergeBlocks(storefrontToHomeBlocks(themeKey), homeThemeBlocks[themeKey] ?? {}),
    );
  }
  if (pageKey === "kundservice") {
    return mergeBlocks(defaults, kundserviceThemeBlocks[themeKey] ?? {});
  }
  if (pageKey === "products") {
    return mergeBlocks(defaults, productsThemeBlocks[themeKey]);
  }
  if (pageKey === "nyheter") {
    return mergeBlocks(defaults, nyheterThemeBlocks[themeKey]);
  }
  if (pageKey === "bastsaljare") {
    return mergeBlocks(defaults, bastsaljareThemeBlocks[themeKey] ?? {});
  }
  if (pageKey === "om-oss") {
    return mergeBlocks(defaults, omOssThemeBlocks[themeKey] ?? {});
  }
  if (pageKey === "product-detail") {
    return mergeBlocks(defaults, detailThemeBlocks[themeKey]);
  }
  return defaults;
}