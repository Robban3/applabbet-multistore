export type CmsFieldType = "text" | "textarea" | "url" | "image";

export interface CmsFieldDefinition {
  key: string;
  label: string;
  type: CmsFieldType;
  placeholder?: string;
  defaultValue: string;
}

export interface CmsBlockDefinition {
  key: string;
  title: string;
  fields: CmsFieldDefinition[];
}

export interface CmsPageDefinition {
  key: string;
  title: string;
  route: string;
  blocks: CmsBlockDefinition[];
}

export const CMS_PAGES: CmsPageDefinition[] = [
  {
    key: "home",
    title: "Startsida",
    route: "/",
    blocks: [
      {
        key: "navigation",
        title: "Toppmeny i hero",
        fields: [
          { key: "item1Label", label: "Meny 1 - Text", type: "text", defaultValue: "Hem" },
          { key: "item1Href", label: "Meny 1 - Länk", type: "url", defaultValue: "/" },
          { key: "item2Label", label: "Meny 2 - Text", type: "text", defaultValue: "Kategorier" },
          { key: "item2Href", label: "Meny 2 - Länk", type: "url", defaultValue: "/products" },
          { key: "item3Label", label: "Meny 3 - Text", type: "text", defaultValue: "Nyheter" },
          { key: "item3Href", label: "Meny 3 - Länk", type: "url", defaultValue: "/nyheter" },
          { key: "item4Label", label: "Meny 4 - Text", type: "text", defaultValue: "Bästsäljare" },
          { key: "item4Href", label: "Meny 4 - Länk", type: "url", defaultValue: "/bastsaljare" },
          { key: "item5Label", label: "Meny 5 - Text", type: "text", defaultValue: "Om oss" },
          { key: "item5Href", label: "Meny 5 - Länk", type: "url", defaultValue: "/om-oss" },
          { key: "item6Label", label: "Meny 6 - Text", type: "text", defaultValue: "Kundservice" },
          { key: "item6Href", label: "Meny 6 - Länk", type: "url", defaultValue: "/kundservice" },
        ],
      },
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "eyebrow", label: "Överrubrik", type: "text", defaultValue: "Premium kvalitet. Utvalt med omsorg." },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Upplev kvalitet. Varje dag." },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Noggrant utvalda produkter som kombinerar design, prestanda och hållbarhet." },
          { key: "imageUrl", label: "Hero-bild (valfri)", type: "image", defaultValue: "" },
          { key: "contentPosition", label: "Textposition (left/right)", type: "text", defaultValue: "left" },
          { key: "primaryCtaLabel", label: "Primär knapptext", type: "text", defaultValue: "Shoppa nu" },
          { key: "primaryCtaHref", label: "Primär knapp-länk", type: "url", defaultValue: "/products" },
          { key: "secondaryCtaLabel", label: "Sekundär knapptext", type: "text", defaultValue: "Utforska kollektioner" },
          { key: "secondaryCtaHref", label: "Sekundär knapp-länk", type: "url", defaultValue: "/products" },
        ],
      },
      {
        key: "trustCards",
        title: "Trygghetskort under hero",
        fields: [
          { key: "card1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Fri frakt" },
          { key: "card1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Vid köp över 499 kr" },
          { key: "card1Icon", label: "Kort 1 - Ikon (star/shield/truck/headset)", type: "text", defaultValue: "truck" },
          { key: "card2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "card2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Enkelt & smidigt" },
          { key: "card2Icon", label: "Kort 2 - Ikon (star/shield/truck/headset)", type: "text", defaultValue: "headset" },
          { key: "card3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Premium kvalitet" },
          { key: "card3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Utvalt med omsorg" },
          { key: "card3Icon", label: "Kort 3 - Ikon (star/shield/truck/headset)", type: "text", defaultValue: "star" },
          { key: "card4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Säkra betalningar" },
          { key: "card4Text", label: "Kort 4 - Text", type: "text", defaultValue: "Tryggt & säkert" },
          { key: "card4Icon", label: "Kort 4 - Ikon (star/shield/truck/headset)", type: "text", defaultValue: "shield" },
        ],
      },
      {
        key: "categories",
        title: "Kategorisektion",
        fields: [
          { key: "sectionTitle", label: "Rubrik", type: "text", defaultValue: "Upptäck våra kategorier" },
          { key: "item1Title", label: "Kategori 1", type: "text", defaultValue: "Ljud & Hörlurar" },
          { key: "item2Title", label: "Kategori 2", type: "text", defaultValue: "Klockor" },
          { key: "item3Title", label: "Kategori 3", type: "text", defaultValue: "Hem & Inredning" },
          { key: "item4Title", label: "Kategori 4", type: "text", defaultValue: "Väskor" },
          { key: "item5Title", label: "Kategori 5", type: "text", defaultValue: "Parfymer" },
          { key: "item6Title", label: "Kategori 6", type: "text", defaultValue: "Accessoarer" },
        ],
      },
      {
        key: "bestSellers",
        title: "Bästsäljare-sektion",
        fields: [
          { key: "sectionTitle", label: "Rubrik", type: "text", defaultValue: "Bästsäljare" },
          { key: "viewAllLabel", label: "Visa alla-knapp", type: "text", defaultValue: "Visa alla" },
          { key: "badgeBestSeller", label: "Badge: Bästsäljare", type: "text", defaultValue: "BÄSTSÄLJARE" },
          { key: "badgeNew", label: "Badge: Nyhet", type: "text", defaultValue: "NYHET" },
          { key: "ratingCount", label: "Rating antaltext", type: "text", defaultValue: "(120)" },
        ],
      },
      {
        key: "brands",
        title: "Varumärkesrad",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Betrodd av tusentals nöjda kunder" },
          { key: "brand1", label: "Varumärke 1", type: "text", defaultValue: "SONY" },
          { key: "brand2", label: "Varumärke 2", type: "text", defaultValue: "BOSE" },
          { key: "brand3", label: "Varumärke 3", type: "text", defaultValue: "dyson" },
          { key: "brand4", label: "Varumärke 4", type: "text", defaultValue: "GARMIN" },
          { key: "brand5", label: "Varumärke 5", type: "text", defaultValue: "SAMSUNG" },
          { key: "brand6", label: "Varumärke 6", type: "text", defaultValue: "APPLE" },
          { key: "brand7", label: "Varumärke 7", type: "text", defaultValue: "PHILIPS" },
        ],
      },
      {
        key: "valueCards",
        title: "Värdekort",
        fields: [
          { key: "card1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Hållbarhet i fokus" },
          { key: "card1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Vi väljer produkter och leverantörer med omtanke om miljön." },
          { key: "card2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "Kundservice i världsklass" },
          { key: "card2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Vi finns här för dig - snabbt, personligt och engagerat." },
          { key: "card3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Nöjda kunder" },
          { key: "card3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Över 10 000+ kunder älskar våra produkter." },
        ],
      },
    ],
  },
  {
    key: "products",
    title: "Kategorisida",
    route: "/products",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Ljud & Hörlurar" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Upptäck vår kollektion av hörlurar, högtalare och ljudprodukter." },
          { key: "trustLine1", label: "Hero trygghetsrad 1", type: "text", defaultValue: "Premium kvalitet" },
          { key: "trustLine2", label: "Hero trygghetsrad 2", type: "text", defaultValue: "Topprankade av våra kunder" },
          { key: "trustLine3", label: "Hero trygghetsrad 3", type: "text", defaultValue: "2 års garanti" },
        ],
      },
      {
        key: "listing",
        title: "Produktlista",
        fields: [
          { key: "resultLabel", label: "Resultattext", type: "text", defaultValue: "128 produkter" },
          { key: "sortDefault", label: "Default sortering", type: "text", defaultValue: "Mest populära" },
        ],
      },
    ],
  },
  {
    key: "bastsaljare",
    title: "Bästsäljare",
    route: "/bastsaljare",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "eyebrow", label: "Eyebrow-text", type: "text", defaultValue: "Sélection" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Pièces d'exception" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Noggrant kuraterade pjäser — de mest eftertraktade i vår kollektion." },
        ],
      },
      {
        key: "listing",
        title: "Produktlista",
        fields: [
          { key: "resultLabel", label: "Resultattext", type: "text", defaultValue: "{count} produkter" },
          { key: "sortPopular", label: "Sortering: Populärast", type: "text", defaultValue: "Populärast" },
          { key: "sortPriceAsc", label: "Sortering: Pris stigande", type: "text", defaultValue: "Pris stigande" },
          { key: "sortPriceDesc", label: "Sortering: Pris fallande", type: "text", defaultValue: "Pris fallande" },
          { key: "badgeLabel", label: "Produktmärke", type: "text", defaultValue: "EXKLUSIV" },
        ],
      },
    ],
  },
  {
    key: "nyheter",
    title: "Nyheter",
    route: "/nyheter",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Nyheter 2026" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Upptäck årets senaste produkter.\nKvalitet, design och innovation i varje detalj." },
        ],
      },
      {
        key: "listing",
        title: "Produktlista",
        fields: [
          { key: "resultLabel", label: "Resultattext", type: "text", defaultValue: "{count} produkter" },
        ],
      },
    ],
  },
  {
    key: "product-detail",
    title: "Produktdetalj",
    route: "/products/[slug]",
    blocks: [
      {
        key: "productInfo",
        title: "Produktinfo",
        fields: [
          { key: "trustLine1", label: "Trygghetsrad 1", type: "text", defaultValue: "Fri frakt vid köp över 499 kr" },
          { key: "trustLine2", label: "Trygghetsrad 2", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "trustLine3", label: "Trygghetsrad 3", type: "text", defaultValue: "2 års garanti" },
        ],
      },
    ],
  },
  {
    key: "cart",
    title: "Varukorg",
    route: "/cart",
    blocks: [
      {
        key: "summary",
        title: "Sammanfattning",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Din varukorg" },
          { key: "freeShippingText", label: "Frakttext", type: "text", defaultValue: "Fri frakt! Du har fri frakt på din beställning." },
        ],
      },
    ],
  },
  {
    key: "checkout",
    title: "Kassa",
    route: "/checkout",
    blocks: [
      {
        key: "checkoutHeader",
        title: "Kassa-header",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Kassa" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Säkra betalningar och snabb leverans." },
        ],
      },
    ],
  },
  {
    key: "order-confirmation",
    title: "Orderbekräftelse",
    route: "/order-confirmation",
    blocks: [
      {
        key: "hero",
        title: "Bekräftelse",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Din beställning är bekräftad" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Tack för ditt köp!" },
        ],
      },
    ],
  },
  {
    key: "mina-sidor",
    title: "Mina sidor",
    route: "/mina-sidor",
    blocks: [
      {
        key: "overview",
        title: "Översikt",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Översikt" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Här är en sammanfattning av ditt konto." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-ordrar",
    title: "Mina sidor: Ordrar",
    route: "/mina-sidor/ordrar",
    blocks: [
      {
        key: "hero",
        title: "Sidhuvud",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Mina ordrar" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Mina ordrar" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Här kan du se alla dina ordrar och följa deras status." },
        ],
      },
      {
        key: "orders",
        title: "Ordrar",
        fields: [
          { key: "sectionTitle", label: "Sektionstitel", type: "text", defaultValue: "Dina ordrar" },
          { key: "emptyState", label: "Tomt läge", type: "text", defaultValue: "Inga ordrar matchar ditt filter." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-adresser",
    title: "Mina sidor: Adresser",
    route: "/mina-sidor/adresser",
    blocks: [
      {
        key: "hero",
        title: "Sidhuvud",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Mina adresser" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Mina adresser" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Här kan du lägga till, redigera och ta bort dina adresser." },
        ],
      },
      {
        key: "addresses",
        title: "Adresser",
        fields: [
          { key: "sectionTitle", label: "Sektionstitel", type: "text", defaultValue: "Dina sparade adresser" },
          { key: "emptyState", label: "Tomt läge", type: "text", defaultValue: "Du har inga sparade adresser ännu." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-betalningsmetoder",
    title: "Mina sidor: Betalningsmetoder",
    route: "/mina-sidor/betalningsmetoder",
    blocks: [
      {
        key: "hero",
        title: "Sidhuvud",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Betalningsmetoder" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Betalningsmetoder" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Hantera dina sparade betalmetoder och välj hur du vill betala." },
        ],
      },
      {
        key: "payments",
        title: "Betalmetoder",
        fields: [
          { key: "sectionTitle", label: "Sektionstitel", type: "text", defaultValue: "Dina sparade betalmetoder" },
          { key: "emptyState", label: "Tomt läge", type: "text", defaultValue: "Inga sparade kort ännu. Klicka på \"Lägg till betalmetod\" för att koppla ett riktigt kort eller bankmetod via Stripe." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-profil",
    title: "Mina sidor: Profil",
    route: "/mina-sidor/profil",
    blocks: [
      {
        key: "hero",
        title: "Sidhuvud",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Mina uppgifter" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Mina uppgifter" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Här kan du se och uppdatera dina personuppgifter, kontaktuppgifter och lösenord." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-favoriter",
    title: "Mina sidor: Favoriter",
    route: "/mina-sidor/favoriter",
    blocks: [
      {
        key: "hero",
        title: "Sidhuvud",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Favoriter" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Favoriter" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Här hittar du alla produkter du har sparat som favoriter." },
        ],
      },
      {
        key: "favorites",
        title: "Favoriter",
        fields: [
          { key: "countSuffix", label: "Antal-suffix", type: "text", defaultValue: "produkter" },
          { key: "emptyState", label: "Tomt läge", type: "text", defaultValue: "Du har inga favoriter ännu. Klicka på hjärtat på en produkt för att spara den här." },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-notiser",
    title: "Mina sidor: Notiser",
    route: "/mina-sidor/notiser",
    blocks: [
      {
        key: "content",
        title: "Innehåll",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Nyhetsbrev & notiser" },
          {
            key: "subtitle",
            label: "Beskrivning",
            type: "textarea",
            defaultValue: "Välj vilka meddelanden du vill få från oss.",
          },
          {
            key: "newsletterTitle",
            label: "Nyhetsbrev - rubrik",
            type: "text",
            defaultValue: "Nyhetsbrev",
          },
          {
            key: "newsletterText",
            label: "Nyhetsbrev - text",
            type: "textarea",
            defaultValue: "Få erbjudanden, nyheter och inspiration direkt i din inkorg.",
          },
          {
            key: "ordersTitle",
            label: "Orderuppdateringar - rubrik",
            type: "text",
            defaultValue: "Orderuppdateringar",
          },
          {
            key: "ordersText",
            label: "Orderuppdateringar - text",
            type: "textarea",
            defaultValue: "Få meddelanden när din order skickas eller levereras.",
          },
        ],
      },
    ],
  },
  {
    key: "mina-sidor-poang",
    title: "Mina sidor: Loyalty Club",
    route: "/mina-sidor/poang",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Mina poäng" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Loyalty Club" },
          {
            key: "subtitle",
            label: "Underrubrik",
            type: "textarea",
            defaultValue: "Förmåner, erbjudanden och exklusiva upplevelser - bara för våra medlemmar.",
          },
          { key: "memberPointsLabel", label: "Poängetikett", type: "text", defaultValue: "Ditt poängsaldo" },
          { key: "memberPointsValue", label: "Poängvärde", type: "text", defaultValue: "120 poäng" },
          { key: "memberTierLabel", label: "Nivåetikett", type: "text", defaultValue: "Nuvarande nivå" },
          { key: "memberTierValue", label: "Nivåvärde", type: "text", defaultValue: "Bronze" },
        ],
      },
      {
        key: "benefits",
        title: "Förmåner",
        fields: [
          { key: "sectionTitle", label: "Rubrik", type: "text", defaultValue: "Dina förmåner" },
          { key: "card1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Poäng på varje köp" },
          { key: "card1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Tjäna poäng du kan använda som betalning." },
          { key: "card2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "Exklusiva erbjudanden" },
          { key: "card2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Få tillgång till personliga kampanjer." },
          { key: "card3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Tidiga tillgångar" },
          { key: "card3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Först med det senaste i våra nyheter." },
          { key: "card4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Prioriterad support" },
          { key: "card4Text", label: "Kort 4 - Text", type: "text", defaultValue: "Snabbare hjälp från kundservice." },
        ],
      },
      {
        key: "howItWorks",
        title: "Så fungerar det",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Så fungerar det" },
          { key: "step1Title", label: "Steg 1 - Rubrik", type: "text", defaultValue: "Bli medlem" },
          { key: "step1Text", label: "Steg 1 - Text", type: "text", defaultValue: "Skapa ett konto och gå med kostnadsfritt." },
          { key: "step2Title", label: "Steg 2 - Rubrik", type: "text", defaultValue: "Tjäna poäng" },
          { key: "step2Text", label: "Steg 2 - Text", type: "text", defaultValue: "Samla poäng på köp och kampanjer." },
          { key: "step3Title", label: "Steg 3 - Rubrik", type: "text", defaultValue: "Få belöningar" },
          { key: "step3Text", label: "Steg 3 - Text", type: "text", defaultValue: "Använd poäng till rabatter och erbjudanden." },
        ],
      },
      {
        key: "tiers",
        title: "Medlemsnivåer",
        fields: [
          { key: "sectionTitle", label: "Rubrik", type: "text", defaultValue: "Medlemsnivåer" },
          { key: "bronzeTitle", label: "Bronze - Rubrik", type: "text", defaultValue: "Bronze" },
          { key: "bronzeText", label: "Bronze - Beskrivning", type: "text", defaultValue: "För dig som är ny medlem." },
          { key: "bronzeRate", label: "Bronze - Poängregel", type: "text", defaultValue: "Tjäna 1 poäng per 10 kr" },
          { key: "bronzeBenefit1", label: "Bronze - Förmån 1", type: "text", defaultValue: "Födelsedagsrabatt" },
          { key: "bronzeBenefit2", label: "Bronze - Förmån 2", type: "text", defaultValue: "Tillgång till medlemspriser" },
          { key: "bronzeBenefit3", label: "Bronze - Förmån 3", type: "text", defaultValue: "Standard support" },
          { key: "silverTitle", label: "Silver - Rubrik", type: "text", defaultValue: "Silver" },
          { key: "silverText", label: "Silver - Beskrivning", type: "text", defaultValue: "För dig som handlar regelbundet." },
          { key: "silverRate", label: "Silver - Poängregel", type: "text", defaultValue: "Tjäna 1,5 poäng per 10 kr" },
          { key: "silverBenefit1", label: "Silver - Förmån 1", type: "text", defaultValue: "Födelsedagsrabatt" },
          { key: "silverBenefit2", label: "Silver - Förmån 2", type: "text", defaultValue: "Exklusiva erbjudanden" },
          { key: "silverBenefit3", label: "Silver - Förmån 3", type: "text", defaultValue: "Prioriterad support" },
          { key: "goldTitle", label: "Gold - Rubrik", type: "text", defaultValue: "Gold" },
          { key: "goldText", label: "Gold - Beskrivning", type: "text", defaultValue: "För våra mest lojala kunder." },
          { key: "goldRate", label: "Gold - Poängregel", type: "text", defaultValue: "Tjäna 2 poäng per 10 kr" },
          { key: "goldBenefit1", label: "Gold - Förmån 1", type: "text", defaultValue: "Födelsedagsrabatt" },
          { key: "goldBenefit2", label: "Gold - Förmån 2", type: "text", defaultValue: "Exklusiva erbjudanden" },
          { key: "goldBenefit3", label: "Gold - Förmån 3", type: "text", defaultValue: "Tidiga tillgångar och VIP-support" },
        ],
      },
      {
        key: "faq",
        title: "FAQ",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Vanliga frågor" },
          { key: "q1", label: "Fråga 1", type: "text", defaultValue: "Hur blir jag medlem i Loyalty Club?" },
          { key: "a1", label: "Svar 1", type: "textarea", defaultValue: "Skapa ett konto på Mina sidor. Medlemskapet aktiveras automatiskt när lojalitetsprogrammet är aktivt." },
          { key: "q2", label: "Fråga 2", type: "text", defaultValue: "Hur tjänar jag poäng?" },
          { key: "a2", label: "Svar 2", type: "textarea", defaultValue: "Du samlar poäng på köp och kampanjer. Hur mycket du får per köp beror på din medlemsnivå." },
          { key: "q3", label: "Fråga 3", type: "text", defaultValue: "När löper mina poäng ut?" },
          { key: "a3", label: "Svar 3", type: "textarea", defaultValue: "Poäng är giltiga i 12 månader från att de tjänas in om inget annat anges i kampanjvillkoren." },
          { key: "q4", label: "Fråga 4", type: "text", defaultValue: "Kan jag använda poäng på alla produkter?" },
          { key: "a4", label: "Svar 4", type: "textarea", defaultValue: "Poäng kan användas på de flesta ordinarie produkter. Undantag kan finnas för vissa kampanjer och presentkort." },
        ],
      },
      {
        key: "support",
        title: "Supportruta",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Har du frågor om Loyalty Club?" },
          { key: "text", label: "Text", type: "text", defaultValue: "Vårt team hjälper dig gärna." },
          { key: "ctaLabel", label: "Knapptext", type: "text", defaultValue: "Kontakta oss" },
          { key: "ctaHref", label: "Knapp-länk", type: "url", defaultValue: "/kundservice" },
        ],
      },
    ],
  },
  {
    key: "om-oss",
    title: "Om oss",
    route: "/om-oss",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "eyebrow", label: "Överrubrik", type: "text", defaultValue: "Om APPLABBET" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Mer än en sportbutik. En drivkraft för bättre prestation." },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Vår butik föddes ur en passion för träning, rörelse och viljan att hjälpa människor att nå sin fulla potential." },
          { key: "ctaLabel", label: "Primär knapptext", type: "text", defaultValue: "Vår historia" },
          { key: "imageUrl", label: "Hero-bild", type: "image", defaultValue: "" },
        ],
      },
      {
        key: "stats",
        title: "Statistikrad",
        fields: [
          { key: "item1Value", label: "Stat 1 - Värde", type: "text", defaultValue: "100 000+" },
          { key: "item1Label", label: "Stat 1 - Etikett", type: "text", defaultValue: "Nöjda kunder" },
          { key: "item2Value", label: "Stat 2 - Värde", type: "text", defaultValue: "250+" },
          { key: "item2Label", label: "Stat 2 - Etikett", type: "text", defaultValue: "Premium varumärken" },
          { key: "item3Value", label: "Stat 3 - Värde", type: "text", defaultValue: "4,8 / 5" },
          { key: "item3Label", label: "Stat 3 - Etikett", type: "text", defaultValue: "Snitt i betyg" },
          { key: "item4Value", label: "Stat 4 - Värde", type: "text", defaultValue: "10+" },
          { key: "item4Label", label: "Stat 4 - Etikett", type: "text", defaultValue: "År av passion" },
        ],
      },
      {
        key: "values",
        title: "Värderingar",
        fields: [
          { key: "eyebrow", label: "Överrubrik", type: "text", defaultValue: "Våra värderingar" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Det vi står för" },
          { key: "item1Title", label: "Värde 1 - Rubrik", type: "text", defaultValue: "Kvalitet utan kompromisser" },
          { key: "item1Text", label: "Värde 1 - Text", type: "textarea", defaultValue: "Vi väljer produkter vi själva använder och litar på. Hög kvalitet, alltid." },
          { key: "item2Title", label: "Värde 2 - Rubrik", type: "text", defaultValue: "Hållbart i fokus" },
          { key: "item2Text", label: "Värde 2 - Text", type: "textarea", defaultValue: "Vi jobbar aktivt för en mer hållbar framtid - för oss och kommande generationer." },
          { key: "item3Title", label: "Värde 3 - Rubrik", type: "text", defaultValue: "För alla, varje dag" },
          { key: "item3Text", label: "Värde 3 - Text", type: "textarea", defaultValue: "Oavsett nivå eller mål finns vi här för att stötta din resa - varje steg på vägen." },
          { key: "item4Title", label: "Värde 4 - Rubrik", type: "text", defaultValue: "Prestation & utveckling" },
          { key: "item4Text", label: "Värde 4 - Text", type: "textarea", defaultValue: "Vi inspirerar till rörelse, utveckling och att bli den bästa versionen av dig själv." },
          { key: "imageUrl", label: "Sektionsbild", type: "image", defaultValue: "" },
        ],
      },
      {
        key: "story",
        title: "Historik & team",
        fields: [
          { key: "historyEyebrow", label: "Historik - Överrubrik", type: "text", defaultValue: "Vår historia" },
          { key: "historyTitle", label: "Historik - Rubrik", type: "text", defaultValue: "Från idé till rörelse" },
          { key: "historyText", label: "Historik - Text", type: "textarea", defaultValue: "Allt började 2014 med en enkel idé: att samla de bästa produkterna för träning och aktiv livsstil på ett ställe. Idag är APPLABBET en av Nordens snabbast växande sportbutiker." },
          { key: "historyCtaLabel", label: "Historik - Knapptext", type: "text", defaultValue: "Läs hela vår resa" },
          { key: "historyImageUrl", label: "Historik - Huvudbild", type: "image", defaultValue: "" },
          { key: "teamTitle", label: "Team - Rubrik", type: "text", defaultValue: "Team APPLABBET" },
          { key: "teamText", label: "Team - Text", type: "textarea", defaultValue: "Vi är ett team av träningsexperter, coacher och problemlösare som brinner för att ge dig den bästa upplevelsen - varje dag." },
          { key: "teamCtaLabel", label: "Team - Knapptext", type: "text", defaultValue: "Möt teamet" },
          { key: "member1Name", label: "Medlem 1 - Namn", type: "text", defaultValue: "Markus Lind" },
          { key: "member1Role", label: "Medlem 1 - Roll", type: "text", defaultValue: "Grundare & CEO" },
          { key: "member1ImageUrl", label: "Medlem 1 - Bild", type: "image", defaultValue: "" },
          { key: "member2Name", label: "Medlem 2 - Namn", type: "text", defaultValue: "Sara Eriksson" },
          { key: "member2Role", label: "Medlem 2 - Roll", type: "text", defaultValue: "Produkt & Sortiment" },
          { key: "member2ImageUrl", label: "Medlem 2 - Bild", type: "image", defaultValue: "" },
          { key: "member3Name", label: "Medlem 3 - Namn", type: "text", defaultValue: "Daniel Berg" },
          { key: "member3Role", label: "Medlem 3 - Roll", type: "text", defaultValue: "Kundupplevelse" },
          { key: "member3ImageUrl", label: "Medlem 3 - Bild", type: "image", defaultValue: "" },
        ],
      },
    ],
  },
  {
    key: "kundservice",
    title: "Kundservice",
    route: "/kundservice",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "eyebrow", label: "Överrubrik", type: "text", defaultValue: "" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Vi finns här för dig." },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Har du frågor om din beställning, leverans, returer eller våra produkter? Vårt kundserviceteam hjälper dig gärna." },
          { key: "chatButtonLabel", label: "Knapp - Chatta", type: "text", defaultValue: "Chatta med oss" },
          { key: "emailButtonLabel", label: "Knapp - E-post", type: "text", defaultValue: "Skicka e-post" },
          { key: "imageUrl", label: "Hero-bild", type: "image", defaultValue: "" },
        ],
      },
      {
        key: "faq",
        title: "FAQ",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Vanliga frågor" },
          { key: "viewAllLabel", label: "Visa alla-frågor", type: "text", defaultValue: "Se alla frågor" },
          { key: "q1", label: "Fråga 1", type: "text", defaultValue: "Hur lång är leveranstiden?" },
          { key: "a1", label: "Svar 1", type: "textarea", defaultValue: "Normal leveranstid är 1-3 arbetsdagar inom Sverige. Du får alltid spårningslänk när paketet har skickats." },
          { key: "q2", label: "Fråga 2", type: "text", defaultValue: "Hur spårar jag min beställning?" },
          { key: "a2", label: "Svar 2", type: "textarea", defaultValue: "Gå till Mina sidor > Mina ordrar och välj aktuell order. Där hittar du spårningslänk och senaste status." },
          { key: "q3", label: "Fråga 3", type: "text", defaultValue: "Kan jag ändra eller avbryta min beställning?" },
          { key: "a3", label: "Svar 3", type: "textarea", defaultValue: "Om ordern inte har packats ännu kan vi ofta hjälpa dig att ändra eller avbryta den. Kontakta kundservice så fort som möjligt." },
          { key: "q4", label: "Fråga 4", type: "text", defaultValue: "Vilka betalningsmetoder erbjuder ni?" },
          { key: "a4", label: "Svar 4", type: "textarea", defaultValue: "Vi erbjuder bland annat kortbetalning, Klarna, Swish och andra säkra betalningsalternativ i kassan." },
          { key: "q5", label: "Fråga 5", type: "text", defaultValue: "Hur gör jag en retur?" },
          { key: "a5", label: "Svar 5", type: "textarea", defaultValue: "Logga in på Mina sidor och gå till Returer & återbetalningar för att registrera din retur steg för steg." },
          { key: "q6", label: "Fråga 6", type: "text", defaultValue: "Hur lång tid tar en retur?" },
          { key: "a6", label: "Svar 6", type: "textarea", defaultValue: "När vi har mottagit returen behandlas den normalt inom 1-3 arbetsdagar. Återbetalning sker därefter enligt vald betalningsmetod." },
          { key: "q7", label: "Fråga 7", type: "text", defaultValue: "När får jag tillbaka mina pengar?" },
          { key: "a7", label: "Svar 7", type: "textarea", defaultValue: "Återbetalning syns vanligtvis inom 1-5 arbetsdagar beroende på betalningsmetod och bank." },
          { key: "q8", label: "Fråga 8", type: "text", defaultValue: "Har ni fri frakt?" },
          { key: "a8", label: "Svar 8", type: "textarea", defaultValue: "Ja, vi erbjuder fri frakt över ett visst orderbelopp. Exakt nivå visas i kassan och i fraktinformationen." },
        ],
      },
      {
        key: "contact",
        title: "Kontakta oss",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Kontakta oss" },
          { key: "subtitle", label: "Underrubrik", type: "text", defaultValue: "Välj det sätt som passar dig bäst." },
          { key: "card1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Livechat" },
          { key: "card1Text", label: "Kort 1 - Text", type: "textarea", defaultValue: "Chatta med oss direkt så hjälper vi dig så snabbt vi kan." },
          { key: "card1Action", label: "Kort 1 - Knapp", type: "text", defaultValue: "Starta chat" },
          { key: "card1Footer", label: "Kort 1 - Fotrad", type: "text", defaultValue: "Öppet nu 08:00 - 20:00" },
          { key: "card2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "E-post" },
          { key: "card2Text", label: "Kort 2 - Text", type: "textarea", defaultValue: "Skicka oss ett meddelande så återkommer vi inom 24 timmar." },
          { key: "card2Action", label: "Kort 2 - Knapp", type: "text", defaultValue: "Skicka e-post" },
          { key: "card2Footer", label: "Kort 2 - Fotrad", type: "text", defaultValue: "info@applabbet.se" },
          { key: "card3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Telefon" },
          { key: "card3Text", label: "Kort 3 - Text", type: "textarea", defaultValue: "Ring oss så hjälper vi dig vardagar 08:00 - 17:00." },
          { key: "card3Action", label: "Kort 3 - Knapp", type: "text", defaultValue: "010 - 123 45 67" },
          { key: "card3Footer", label: "Kort 3 - Fotrad", type: "text", defaultValue: "Vardagar 08:00 - 17:00" },
          { key: "card4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Adress" },
          { key: "card4Text", label: "Kort 4 - Text", type: "textarea", defaultValue: "APPLABBET AB\nBox 123, 131 54 Nacka\nSverige" },
          { key: "card4Action", label: "Kort 4 - Knapp", type: "text", defaultValue: "" },
          { key: "card4Footer", label: "Kort 4 - Fotrad", type: "text", defaultValue: "" },
        ],
      },
      {
        key: "returnsCta",
        title: "Retur-CTA",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "text", label: "Text", type: "textarea", defaultValue: "Inte nöjd? Inga problem. Du har alltid 30 dagars öppet köp och enkel retur." },
          { key: "buttonLabel", label: "Knapptext", type: "text", defaultValue: "Till returer & återbetalningar" },
          { key: "buttonHref", label: "Knapp-länk", type: "url", defaultValue: "/returer-aterbetalningar" },
        ],
      },
      {
        key: "trustBottom",
        title: "Nedre trygghetskort",
        fields: [
          { key: "item1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Snabb hjälp" },
          { key: "item1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Vi svarar snabbt och löser ditt ärende effektivt." },
          { key: "item2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "Människor, inte robotar" },
          { key: "item2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Riktig support från vårt team som bryr sig." },
          { key: "item3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Tryggt & enkelt" },
          { key: "item3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Starka lösningar och smidiga processer." },
          { key: "item4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Nöjda kunder" },
          { key: "item4Text", label: "Kort 4 - Text", type: "text", defaultValue: "4.8/5 i betyg från över 100 000 kunder." },
        ],
      },
    ],
  },
  {
    key: "kopvillkor",
    title: "Köpvillkor",
    route: "/kopvillkor",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Köpvillkor" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Köpvillkor" },
          {
            key: "subtitle",
            label: "Underrubrik",
            type: "textarea",
            defaultValue: "Här hittar du våra köpvillkor. Genom att handla hos Applabbet accepterar du villkoren som beskrivs nedan.",
          },
        ],
      },
      {
        key: "toc",
        title: "Innehållsmeny",
        fields: [
          { key: "title", label: "Meny-rubrik", type: "text", defaultValue: "Köpvillkor" },
          { key: "item1", label: "Punkt 1", type: "text", defaultValue: "Allmänt" },
          { key: "item2", label: "Punkt 2", type: "text", defaultValue: "Beställning" },
          { key: "item3", label: "Punkt 3", type: "text", defaultValue: "Priser och betalning" },
          { key: "item4", label: "Punkt 4", type: "text", defaultValue: "Leverans" },
          { key: "item5", label: "Punkt 5", type: "text", defaultValue: "Returer och ångerrätt" },
          { key: "item6", label: "Punkt 6", type: "text", defaultValue: "Reklamation" },
          { key: "item7", label: "Punkt 7", type: "text", defaultValue: "Tillämplig lag och tvister" },
        ],
      },
      {
        key: "sections",
        title: "Villkorssektioner",
        fields: [
          { key: "section1Title", label: "Sektion 1 - Rubrik", type: "text", defaultValue: "Allmänt" },
          {
            key: "section1Text",
            label: "Sektion 1 - Text",
            type: "textarea",
            defaultValue: "Dessa köpvillkor gäller för alla köp som görs på Applabbet. Villkoren gäller mellan dig som kund och Applabbet AB.",
          },
          { key: "section2Title", label: "Sektion 2 - Rubrik", type: "text", defaultValue: "Beställning" },
          {
            key: "section2Text",
            label: "Sektion 2 - Text",
            type: "textarea",
            defaultValue:
              "När du lägger en beställning på vår webbplats skickar vi en orderbekräftelse till den e-postadress du angivit. Avtalet blir bindande först när varan har skickats från vårt lager.",
          },
          { key: "section3Title", label: "Sektion 3 - Rubrik", type: "text", defaultValue: "Priser och betalning" },
          {
            key: "section3Text",
            label: "Sektion 3 - Text",
            type: "textarea",
            defaultValue:
              "Alla priser anges i SEK och inkluderar moms om inget annat anges. Betalning sker via de betalningsalternativ som presenteras i kassan.",
          },
          { key: "section4Title", label: "Sektion 4 - Rubrik", type: "text", defaultValue: "Leverans" },
          {
            key: "section4Text",
            label: "Sektion 4 - Text",
            type: "textarea",
            defaultValue:
              "Vi levererar inom Sverige med våra fraktpartners. Normal leveranstid är 1-3 arbetsdagar. Eventuella förseningar som beror på transportör eller yttre omständigheter kan förekomma.",
          },
          { key: "section5Title", label: "Sektion 5 - Rubrik", type: "text", defaultValue: "Returer och ångerrätt" },
          {
            key: "section5Text",
            label: "Sektion 5 - Text",
            type: "textarea",
            defaultValue:
              "Du har 30 dagars ångerrätt från den dag du mottagit din vara. Produkten ska returneras i oförändrat skick och i originalförpackning. Mer information finns på sidan Returer och ångerrätt.",
          },
          { key: "section6Title", label: "Sektion 6 - Rubrik", type: "text", defaultValue: "Reklamation" },
          {
            key: "section6Text",
            label: "Sektion 6 - Text",
            type: "textarea",
            defaultValue:
              "Om du mottagit en felaktig eller defekt vara ber vi dig kontakta vår kundservice så snart som möjligt. Vi följer konsumentköplagen vid hantering av reklamationer.",
          },
          { key: "section7Title", label: "Sektion 7 - Rubrik", type: "text", defaultValue: "Tillämplig lag och tvister" },
          {
            key: "section7Text",
            label: "Sektion 7 - Text",
            type: "textarea",
            defaultValue:
              "Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas i dialog med vår kundservice. Om tvist inte kan lösas kan den prövas av allmän domstol i Sverige.",
          },
        ],
      },
      {
        key: "support",
        title: "Kontaktsektion",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Frågor?" },
          { key: "text", label: "Text", type: "text", defaultValue: "Har du frågor om våra köpvillkor? Kontakta oss så hjälper vi dig." },
          { key: "buttonLabel", label: "Knapptext", type: "text", defaultValue: "Kontakta oss" },
          { key: "buttonHref", label: "Knapp-länk", type: "url", defaultValue: "/kundservice" },
        ],
      },
    ],
  },
  {
    key: "integritetspolicy",
    title: "Integritetspolicy",
    route: "/integritetspolicy",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Integritetspolicy" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Integritetspolicy" },
          {
            key: "subtitle",
            label: "Underrubrik",
            type: "textarea",
            defaultValue: "Så här samlar vi in, använder och skyddar dina personuppgifter.",
          },
        ],
      },
      {
        key: "toc",
        title: "Innehållsmeny",
        fields: [
          { key: "title", label: "Meny-rubrik", type: "text", defaultValue: "Innehåll" },
          { key: "item1", label: "Punkt 1", type: "text", defaultValue: "Inledning" },
          { key: "item2", label: "Punkt 2", type: "text", defaultValue: "Vilka uppgifter vi samlar in" },
          { key: "item3", label: "Punkt 3", type: "text", defaultValue: "Hur vi använder uppgifter" },
          { key: "item4", label: "Punkt 4", type: "text", defaultValue: "Delning av uppgifter" },
          { key: "item5", label: "Punkt 5", type: "text", defaultValue: "Dina rättigheter" },
          { key: "item6", label: "Punkt 6", type: "text", defaultValue: "Cookies" },
          { key: "item7", label: "Punkt 7", type: "text", defaultValue: "Säkerhet" },
          { key: "item8", label: "Punkt 8", type: "text", defaultValue: "Ändringar" },
          { key: "item9", label: "Punkt 9", type: "text", defaultValue: "Kontakt" },
        ],
      },
      {
        key: "sections",
        title: "Policysektioner",
        fields: [
          { key: "section1Title", label: "Sektion 1 - Rubrik", type: "text", defaultValue: "Inledning" },
          {
            key: "section1Text",
            label: "Sektion 1 - Text",
            type: "textarea",
            defaultValue:
              "Vi på Applabbet värnar om din integritet. Denna integritetspolicy förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter när du besöker vår webbplats eller handlar hos oss.",
          },
          { key: "section2Title", label: "Sektion 2 - Rubrik", type: "text", defaultValue: "Vilka uppgifter vi samlar in" },
          {
            key: "section2Text",
            label: "Sektion 2 - Text",
            type: "textarea",
            defaultValue:
              "Vi kan samla in följande typer av uppgifter: kontaktuppgifter (namn, e-postadress, telefonnummer), leveransadress, betalningsinformation, orderhistorik samt information om dina köp och din användning av vår webbplats.",
          },
          { key: "section3Title", label: "Sektion 3 - Rubrik", type: "text", defaultValue: "Hur vi använder uppgifter" },
          {
            key: "section3Text",
            label: "Sektion 3 - Text",
            type: "textarea",
            defaultValue:
              "Vi använder dina uppgifter för att kunna leverera våra produkter och tjänster, hantera dina ordrar, ge kundsupport, förbättra vår webbplats och våra tjänster samt skicka relevant information och erbjudanden (om du samtyckt till det).",
          },
          { key: "section4Title", label: "Sektion 4 - Rubrik", type: "text", defaultValue: "Delning av uppgifter" },
          {
            key: "section4Text",
            label: "Sektion 4 - Text",
            type: "textarea",
            defaultValue:
              "Vi delar endast dina uppgifter med tredje parter när det är nödvändigt för att fullgöra våra tjänster, till exempel leveranspartners och betaltjänstleverantörer. Vi säljer aldrig dina personuppgifter vidare.",
          },
          { key: "section5Title", label: "Sektion 5 - Rubrik", type: "text", defaultValue: "Dina rättigheter" },
          {
            key: "section5Text",
            label: "Sektion 5 - Text",
            type: "textarea",
            defaultValue:
              "Du har rätt att begära tillgång till, rättelse av eller radering av dina personuppgifter samt att invända mot eller begränsa behandlingen. Du kan också begära att få ut dina uppgifter i ett strukturerat format (dataportabilitet).",
          },
          { key: "section6Title", label: "Sektion 6 - Rubrik", type: "text", defaultValue: "Cookies" },
          {
            key: "section6Text",
            label: "Sektion 6 - Text",
            type: "textarea",
            defaultValue:
              "Vi använder cookies för att förbättra din upplevelse på vår webbplats, analysera trafik och anpassa innehåll och annonser. Du kan när som helst ändra dina cookie-inställningar i din webbläsare.",
          },
          { key: "section7Title", label: "Sektion 7 - Rubrik", type: "text", defaultValue: "Säkerhet" },
          {
            key: "section7Text",
            label: "Sektion 7 - Text",
            type: "textarea",
            defaultValue:
              "Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot obehörig åtkomst, ändring, spridning eller förlust.",
          },
          { key: "section8Title", label: "Sektion 8 - Rubrik", type: "text", defaultValue: "Ändringar" },
          {
            key: "section8Text",
            label: "Sektion 8 - Text",
            type: "textarea",
            defaultValue:
              "Vi kan komma att uppdatera denna integritetspolicy. Den senaste versionen publiceras alltid på denna sida med uppdaterat datum.",
          },
          { key: "section9Title", label: "Sektion 9 - Rubrik", type: "text", defaultValue: "Kontakt" },
          {
            key: "section9Text",
            label: "Sektion 9 - Text",
            type: "textarea",
            defaultValue:
              "Har du frågor om vår integritetspolicy eller hur vi hanterar dina personuppgifter? Kontakta oss gärna.",
          },
        ],
      },
    ],
  },
  {
    key: "cookies",
    title: "Cookies",
    route: "/cookies",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Cookies" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Cookies" },
          {
            key: "subtitle",
            label: "Underrubrik",
            type: "textarea",
            defaultValue: "Information om hur vi använder cookies och liknande tekniker på vår webbplats.",
          },
        ],
      },
      {
        key: "intro",
        title: "Vad är cookies",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Vad är cookies?" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            defaultValue:
              "Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper oss att få webbplatsen att fungera korrekt, förbättra din upplevelse och förstå hur webbplatsen används.",
          },
        ],
      },
      {
        key: "types",
        title: "Cookie-typer",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Vilka typer av cookies använder vi?" },
          { key: "necessaryTitle", label: "Nödvändiga - Rubrik", type: "text", defaultValue: "Nödvändiga cookies" },
          {
            key: "necessaryText",
            label: "Nödvändiga - Text",
            type: "textarea",
            defaultValue:
              "Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system. De används till exempel för att komma ihåg dina inställningar, hantera inloggning och säkerhet.",
          },
          { key: "necessaryBadge", label: "Nödvändiga - Badge", type: "text", defaultValue: "Alltid aktiva" },
          { key: "analyticsTitle", label: "Prestanda - Rubrik", type: "text", defaultValue: "Prestanda- och analyscookies" },
          {
            key: "analyticsText",
            label: "Prestanda - Text",
            type: "textarea",
            defaultValue:
              "Dessa cookies hjälper oss att förstå hur besökare använder vår webbplats, genom att samla in och rapportera anonym information.",
          },
          { key: "functionalTitle", label: "Funktionella - Rubrik", type: "text", defaultValue: "Funktionella cookies" },
          {
            key: "functionalText",
            label: "Funktionella - Text",
            type: "textarea",
            defaultValue:
              "Dessa cookies möjliggör utökad funktionalitet och personalisering, till exempel efter videoinställningar och tredjepartstjänster.",
          },
          { key: "marketingTitle", label: "Marknadsföring - Rubrik", type: "text", defaultValue: "Marknadsföringscookies" },
          {
            key: "marketingText",
            label: "Marknadsföring - Text",
            type: "textarea",
            defaultValue:
              "Dessa cookies används för att visa relevanta annonser och mäta effektiviteten i våra kampanjer, både på vår webbplats och på andra webbplatser.",
          },
        ],
      },
      {
        key: "manage",
        title: "Hantera cookies",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Hantera dina cookieinställningar" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            defaultValue:
              "Du kan när som helst ändra eller återkalla ditt samtycke till cookies via vår cookiepanel. Observera att om du väljer att blockera vissa cookies kan det påverka din upplevelse av vår webbplats.",
          },
          { key: "openButtonLabel", label: "Knapptext - Hantera", type: "text", defaultValue: "Hantera cookieinställningar" },
          { key: "privacyButtonLabel", label: "Knapptext - Integritet", type: "text", defaultValue: "Läs mer om integritet" },
        ],
      },
      {
        key: "update",
        title: "Uppdateringar",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Uppdateringar" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            defaultValue: "Denna cookiepolicy kan komma att uppdateras. Den senaste versionen finns alltid tillgänglig på denna sida.",
          },
          { key: "updatedLabel", label: "Datum-etikett", type: "text", defaultValue: "Senast uppdaterad:" },
          { key: "updatedDate", label: "Datum", type: "text", defaultValue: "24 april 2024" },
        ],
      },
    ],
  },
  {
    key: "gdpr",
    title: "GDPR / Dataskydd",
    route: "/gdpr",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "GDPR / Dataskydd" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "GDPR / Dataskydd" },
          {
            key: "subtitle",
            label: "Underrubrik",
            type: "textarea",
            defaultValue: "Så här behandlar vi dina personuppgifter i enlighet med GDPR.",
          },
        ],
      },
      {
        key: "toc",
        title: "Innehållsmeny",
        fields: [
          { key: "title", label: "Meny-rubrik", type: "text", defaultValue: "GDPR / Dataskydd" },
          { key: "item1", label: "Punkt 1", type: "text", defaultValue: "Personuppgiftsansvarig" },
          { key: "item2", label: "Punkt 2", type: "text", defaultValue: "Vilka uppgifter samlar vi in?" },
          { key: "item3", label: "Punkt 3", type: "text", defaultValue: "Varför behandlar vi dina uppgifter?" },
          { key: "item4", label: "Punkt 4", type: "text", defaultValue: "Rättslig grund" },
          { key: "item5", label: "Punkt 5", type: "text", defaultValue: "Hur länge sparar vi dina uppgifter?" },
          { key: "item6", label: "Punkt 6", type: "text", defaultValue: "Delar vi dina uppgifter?" },
          { key: "item7", label: "Punkt 7", type: "text", defaultValue: "Dina rättigheter" },
          { key: "item8", label: "Punkt 8", type: "text", defaultValue: "Kontakt" },
        ],
      },
      {
        key: "sections",
        title: "GDPR-sektioner",
        fields: [
          { key: "section1Title", label: "Sektion 1 - Rubrik", type: "text", defaultValue: "Personuppgiftsansvarig" },
          {
            key: "section1Text",
            label: "Sektion 1 - Text",
            type: "textarea",
            defaultValue:
              "Applabbet AB är personuppgiftsansvarig för behandlingen av personuppgifter på denna webbplats.",
          },
          { key: "section2Title", label: "Sektion 2 - Rubrik", type: "text", defaultValue: "Vilka uppgifter samlar vi in?" },
          {
            key: "section2Text",
            label: "Sektion 2 - Text",
            type: "textarea",
            defaultValue:
              "Vi samlar in personuppgifter som du lämnar till oss när du handlar, skapar konto eller kontaktar oss, till exempel namn, adress, e-postadress, telefonnummer och betalningsinformation.",
          },
          { key: "section3Title", label: "Sektion 3 - Rubrik", type: "text", defaultValue: "Varför behandlar vi dina uppgifter?" },
          {
            key: "section3Text",
            label: "Sektion 3 - Text",
            type: "textarea",
            defaultValue:
              "Vi behandlar personuppgifter för att kunna leverera produkter, hantera kundservice, förbättra våra tjänster och uppfylla rättsliga skyldigheter.",
          },
          { key: "section4Title", label: "Sektion 4 - Rubrik", type: "text", defaultValue: "Rättslig grund" },
          {
            key: "section4Text",
            label: "Sektion 4 - Text",
            type: "textarea",
            defaultValue:
              "Behandlingen sker med stöd av avtal, rättslig förpliktelse, berättigat intresse eller samtycke beroende på typ av behandling.",
          },
          { key: "section5Title", label: "Sektion 5 - Rubrik", type: "text", defaultValue: "Hur länge sparar vi dina uppgifter?" },
          {
            key: "section5Text",
            label: "Sektion 5 - Text",
            type: "textarea",
            defaultValue:
              "Vi sparar dina uppgifter så länge det är nödvändigt för ändamålet och enligt gällande lagkrav.",
          },
          { key: "section6Title", label: "Sektion 6 - Rubrik", type: "text", defaultValue: "Delar vi dina uppgifter?" },
          {
            key: "section6Text",
            label: "Sektion 6 - Text",
            type: "textarea",
            defaultValue:
              "Vi delar endast uppgifter med betrodda partner som behövs för att leverera våra tjänster, till exempel betal- och leveransleverantörer.",
          },
          { key: "section7Title", label: "Sektion 7 - Rubrik", type: "text", defaultValue: "Dina rättigheter" },
          {
            key: "section7Text",
            label: "Sektion 7 - Text",
            type: "textarea",
            defaultValue:
              "Du har rätt till tillgång, rättelse, radering, begränsning och dataportabilitet samt rätt att invända mot viss behandling.",
          },
          { key: "section8Title", label: "Sektion 8 - Rubrik", type: "text", defaultValue: "Kontakt" },
          {
            key: "section8Text",
            label: "Sektion 8 - Text",
            type: "textarea",
            defaultValue:
              "Vid frågor om GDPR och dataskydd, kontakta oss på info@applabbet.se.",
          },
        ],
      },
    ],
  },
  {
    key: "returer-aterbetalningar",
    title: "Returer & återbetalningar",
    route: "/returer-aterbetalningar",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Returer & återbetalningar" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Returer & återbetalningar" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Vi vill att du ska vara 100 % nöjd med ditt köp. Skulle något ändå inte bli rätt har du alltid 30 dagars öppet köp och enkel retur." },
        ],
      },
      {
        key: "sections",
        title: "Sektionrubriker",
        fields: [
          { key: "howItWorksTitle", label: "Så här fungerar en retur", type: "text", defaultValue: "Så här fungerar en retur" },
          { key: "faqTitle", label: "FAQ-rubrik", type: "text", defaultValue: "Vanliga frågor" },
          { key: "faqViewAllLabel", label: "FAQ visa alla", type: "text", defaultValue: "Se alla frågor" },
        ],
      },
      {
        key: "steps",
        title: "Stegkort",
        fields: [
          { key: "item1Title", label: "Steg 1 - Rubrik", type: "text", defaultValue: "Skapa din retur" },
          { key: "item1Text", label: "Steg 1 - Text", type: "textarea", defaultValue: "Logga in på Mina sidor och registrera din retur enkelt." },
          { key: "item2Title", label: "Steg 2 - Rubrik", type: "text", defaultValue: "Packa varan" },
          { key: "item2Text", label: "Steg 2 - Text", type: "textarea", defaultValue: "Packa produkten i originalförpackning med alla lappar kvar." },
          { key: "item3Title", label: "Steg 3 - Rubrik", type: "text", defaultValue: "Skicka tillbaka" },
          { key: "item3Text", label: "Steg 3 - Text", type: "textarea", defaultValue: "Använd förbetald retursedel som du får via e-post." },
          { key: "item4Title", label: "Steg 4 - Rubrik", type: "text", defaultValue: "Vi behandlar din retur" },
          { key: "item4Text", label: "Steg 4 - Text", type: "textarea", defaultValue: "När vi mottagit och godkänt din retur behandlar vi den inom 1-3 arbetsdagar." },
          { key: "item5Title", label: "Steg 5 - Rubrik", type: "text", defaultValue: "Återbetalning" },
          { key: "item5Text", label: "Steg 5 - Text", type: "textarea", defaultValue: "Du får pengarna tillbaka till samma betalningsmetod inom 3-5 arbetsdagar." },
          { key: "createReturnLabel", label: "Skapa retur-knapp", type: "text", defaultValue: "Skapa din retur" },
          { key: "createReturnHref", label: "Skapa retur-länk", type: "url", defaultValue: "/returer-aterbetalningar/skapa-retur?account=1" },
        ],
      },
      {
        key: "cards",
        title: "Info-kort",
        fields: [
          { key: "returnsTitle", label: "Returer - Rubrik", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "returnsText", label: "Returer - Text", type: "textarea", defaultValue: "Du har alltid 30 dagars öppet köp från den dag du mottagit din vara." },
          { key: "returnsItem1", label: "Returer - Punkt 1", type: "text", defaultValue: "Varan är i originalskick" },
          { key: "returnsItem2", label: "Returer - Punkt 2", type: "text", defaultValue: "Alla lappar och originalförpackning finns med" },
          { key: "returnsItem3", label: "Returer - Punkt 3", type: "text", defaultValue: "Returkostnad: 49 kr (dras av från återbetalningen)" },
          { key: "returnsButtonLabel", label: "Returer - Knapp", type: "text", defaultValue: "Skapa en retur" },
          { key: "returnsButtonHref", label: "Returer - Knapp-länk", type: "url", defaultValue: "/returer-aterbetalningar/skapa-retur?account=1" },
          { key: "refundsTitle", label: "Återbetalningar - Rubrik", type: "text", defaultValue: "Återbetalningar" },
          { key: "refundsText", label: "Återbetalningar - Text", type: "textarea", defaultValue: "När vi har mottagit och godkänt din retur återbetalas beloppet till samma betalningsmetod som användes vid köpet." },
          { key: "refundsMethod1", label: "Återbetalning 1", type: "text", defaultValue: "Klarna|1-3 arbetsdagar" },
          { key: "refundsMethod2", label: "Återbetalning 2", type: "text", defaultValue: "Kortbetalning|3-5 arbetsdagar" },
          { key: "refundsMethod3", label: "Återbetalning 3", type: "text", defaultValue: "Swish|1-3 arbetsdagar" },
          { key: "refundsMethod4", label: "Återbetalning 4", type: "text", defaultValue: "Apple Pay / Google Pay|3-5 arbetsdagar" },
        ],
      },
      {
        key: "notice",
        title: "Observera & support",
        fields: [
          { key: "noticeTitle", label: "Observera - Rubrik", type: "text", defaultValue: "Observera" },
          { key: "noticeText", label: "Observera - Text", type: "textarea", defaultValue: "Av hygienskäl kan vi inte acceptera returer av strumpor, underkläder, hörlurar och kosttillskott om förpackningen har brutits." },
          { key: "supportTitle", label: "Support - Rubrik", type: "text", defaultValue: "Har du frågor?" },
          { key: "supportText", label: "Support - Text", type: "textarea", defaultValue: "Kontakta vårt kundserviceteam så hjälper vi dig gärna." },
          { key: "supportButtonLabel", label: "Support - Knapp", type: "text", defaultValue: "Till kundservice" },
          { key: "supportButtonHref", label: "Support - Knapp-länk", type: "url", defaultValue: "/kundservice" },
        ],
      },
      {
        key: "faq",
        title: "FAQ",
        fields: [
          { key: "q1", label: "Fråga 1", type: "text", defaultValue: "Hur gör jag en retur?" },
          { key: "a1", label: "Svar 1", type: "textarea", defaultValue: "Gå till Mina sidor > Returer & återbetalningar och följ stegen för att skapa din retur." },
          { key: "q2", label: "Fråga 2", type: "text", defaultValue: "Vad kostar en retur?" },
          { key: "a2", label: "Svar 2", type: "textarea", defaultValue: "Returkostnad kan tillkomma beroende på returmetod. Exakt kostnad visas i returflödet innan du skickar in." },
          { key: "q3", label: "Fråga 3", type: "text", defaultValue: "Hur lång tid tar det att få tillbaka pengarna?" },
          { key: "a3", label: "Svar 3", type: "textarea", defaultValue: "Efter godkänd retur sker återbetalning normalt inom 1-5 arbetsdagar beroende på betalningsmetod." },
          { key: "q4", label: "Fråga 4", type: "text", defaultValue: "Kan jag byta en vara?" },
          { key: "a4", label: "Svar 4", type: "textarea", defaultValue: "Vi hanterar i första hand returer med återbetalning. Lägg sedan en ny beställning på önskad vara." },
          { key: "q5", label: "Fråga 5", type: "text", defaultValue: "Vilka varor kan inte returneras?" },
          { key: "a5", label: "Svar 5", type: "textarea", defaultValue: "Vissa produkter kan undantas av hygien- eller säkerhetsskäl, till exempel brutna förseglingar på känsliga varor." },
          { key: "q6", label: "Fråga 6", type: "text", defaultValue: "Jag har fått en defekt vara, vad gör jag?" },
          { key: "a6", label: "Svar 6", type: "textarea", defaultValue: "Kontakta kundservice direkt med ordernummer och bilder så hjälper vi dig med reklamation och nästa steg." },
        ],
      },
      {
        key: "flowNavigation",
        title: "Returflöde: navigation och steg",
        fields: [
          { key: "breadcrumbReturerLabel", label: "Breadcrumb: Returer & ångerrätt", type: "text", defaultValue: "Returer & ångerrätt" },
          { key: "breadcrumbCreateReturnLabel", label: "Breadcrumb: Skapa din retur", type: "text", defaultValue: "Skapa din retur" },
          { key: "breadcrumbStep2Label", label: "Breadcrumb: Steg 2", type: "text", defaultValue: "Steg 2" },
          { key: "breadcrumbStep3Label", label: "Breadcrumb: Steg 3", type: "text", defaultValue: "Steg 3" },
          { key: "breadcrumbStep4Label", label: "Breadcrumb: Steg 4", type: "text", defaultValue: "Steg 4" },
          { key: "breadcrumbStep5Label", label: "Breadcrumb: Steg 5", type: "text", defaultValue: "Steg 5" },
          { key: "step1Label", label: "Steg 1 etikett", type: "text", defaultValue: "Välj order" },
          { key: "step2Label", label: "Steg 2 etikett", type: "text", defaultValue: "Välj produkter" },
          { key: "step3Label", label: "Steg 3 etikett", type: "text", defaultValue: "Ange returmetod" },
          { key: "step4Label", label: "Steg 4 etikett", type: "text", defaultValue: "Returdetaljer" },
          { key: "step5Label", label: "Steg 5 etikett", type: "text", defaultValue: "Bekräfta & skicka" },
        ],
      },
      {
        key: "flowHero",
        title: "Returflöde: hero",
        fields: [
          { key: "titlePrefix", label: "Hero rubrik prefix", type: "text", defaultValue: "Skapa din" },
          { key: "titleHighlight", label: "Hero rubrik markerad del", type: "text", defaultValue: "retur" },
          { key: "subtitleLine1", label: "Hero undertext rad 1", type: "text", defaultValue: "Följ stegen nedan för att returnera din vara." },
          { key: "subtitleLine2", label: "Hero undertext rad 2", type: "text", defaultValue: "Det tar bara några minuter." },
        ],
      },
      {
        key: "flowStep1",
        title: "Returflöde: steg 1",
        fields: [
          { key: "title", label: "Steg 1 rubrik", type: "text", defaultValue: "Välj order" },
          { key: "progressLabel", label: "Steg 1: progress text", type: "text", defaultValue: "Steg 1 av 5" },
          { key: "subtitle", label: "Steg 1 undertext", type: "text", defaultValue: "Välj den order du vill returnera från listan nedan." },
          { key: "howItWorksTitle", label: "Steg 1: Så här skapar du din retur", type: "text", defaultValue: "Så här skapar du din retur" },
          { key: "step1Title", label: "Steg 1: Flödeskort 1 rubrik", type: "text", defaultValue: "Hitta din order" },
          { key: "step1Text", label: "Steg 1: Flödeskort 1 text", type: "text", defaultValue: "Ange ditt ordernummer och e-postadress för att hitta din beställning." },
          { key: "step2Title", label: "Steg 1: Flödeskort 2 rubrik", type: "text", defaultValue: "Välj produkter" },
          { key: "step2Text", label: "Steg 1: Flödeskort 2 text", type: "text", defaultValue: "Markera de produkter du vill returnera och ange orsak till retur." },
          { key: "step3Title", label: "Steg 1: Flödeskort 3 rubrik", type: "text", defaultValue: "Välj returmetod" },
          { key: "step3Text", label: "Steg 1: Flödeskort 3 text", type: "text", defaultValue: "Välj hur du vill returnera din vara. Du får en retursedel via e-post." },
          { key: "step4Title", label: "Steg 1: Flödeskort 4 rubrik", type: "text", defaultValue: "Skicka tillbaka" },
          { key: "step4Text", label: "Steg 1: Flödeskort 4 text", type: "text", defaultValue: "Packa varan väl och lämna in ditt paket hos valfritt ombud." },
          { key: "step5Title", label: "Steg 1: Flödeskort 5 rubrik", type: "text", defaultValue: "Återbetalning" },
          { key: "step5Text", label: "Steg 1: Flödeskort 5 text", type: "text", defaultValue: "När vi mottagit och godkänt returen återbetalar vi inom 10 arbetsdagar." },
          { key: "trust1Title", label: "Steg 1: Trust 1 rubrik", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "trust1Text", label: "Steg 1: Trust 1 text", type: "text", defaultValue: "Retur inom 30 dagar från mottagen vara." },
          { key: "trust2Title", label: "Steg 1: Trust 2 rubrik", type: "text", defaultValue: "Enkel retur" },
          { key: "trust2Text", label: "Steg 1: Trust 2 text", type: "text", defaultValue: "Smidig process med retursedel." },
          { key: "trust3Title", label: "Steg 1: Trust 3 rubrik", type: "text", defaultValue: "Återbetalning" },
          { key: "trust3Text", label: "Steg 1: Trust 3 text", type: "text", defaultValue: "Vi återbetalar inom 10 arbetsdagar." },
          { key: "trust4Title", label: "Steg 1: Trust 4 rubrik", type: "text", defaultValue: "Behöver du hjälp?" },
          { key: "trust4Text", label: "Steg 1: Trust 4 text", type: "text", defaultValue: "Vår kundservice finns här för dig." },
          { key: "ctaTitle", label: "Steg 1: CTA rubrik", type: "text", defaultValue: "Redo att skapa din retur?" },
          { key: "ctaText", label: "Steg 1: CTA text", type: "text", defaultValue: "Hitta din order och starta din retur på bara några minuter." },
          { key: "ctaButtonLabel", label: "Steg 1: CTA knapp", type: "text", defaultValue: "Skapa din retur" },
          { key: "infoCard1Title", label: "Steg 1: Infokort 1 rubrik", type: "text", defaultValue: "Ångerrätt" },
          { key: "infoCard1Text", label: "Steg 1: Infokort 1 text", type: "text", defaultValue: "Du har rätt att ångra ditt köp inom 30 dagar via vår policy." },
          { key: "infoCard1Cta", label: "Steg 1: Infokort 1 knapp", type: "text", defaultValue: "Läs mer om ångerrätt" },
          { key: "infoCard1Href", label: "Steg 1: Infokort 1 länk", type: "url", defaultValue: "/returer-aterbetalningar?account=1" },
          { key: "infoCard2Title", label: "Steg 1: Infokort 2 rubrik", type: "text", defaultValue: "Returvillkor" },
          { key: "infoCard2Text", label: "Steg 1: Infokort 2 text", type: "text", defaultValue: "Produkten ska returneras i originalskick med tillbehör och etiketter kvar." },
          { key: "infoCard2Cta", label: "Steg 1: Infokort 2 knapp", type: "text", defaultValue: "Se våra returvillkor" },
          { key: "infoCard2Href", label: "Steg 1: Infokort 2 länk", type: "url", defaultValue: "/returer-aterbetalningar?account=1" },
          { key: "infoCard3Title", label: "Steg 1: Infokort 3 rubrik", type: "text", defaultValue: "Returkostnad" },
          { key: "infoCard3Text", label: "Steg 1: Infokort 3 text", type: "text", defaultValue: "Som kund står du för returfrakten. För returer inom Sverige är returfrakten 59 kr." },
          { key: "infoCard3Cta", label: "Steg 1: Infokort 3 knapp", type: "text", defaultValue: "Läs mer om frakt" },
          { key: "infoCard3Href", label: "Steg 1: Infokort 3 länk", type: "url", defaultValue: "/leverans" },
          { key: "infoCard4Title", label: "Steg 1: Infokort 4 rubrik", type: "text", defaultValue: "Behöver du hjälp?" },
          { key: "infoCard4Text", label: "Steg 1: Infokort 4 text", type: "text", defaultValue: "Vårt team hjälper dig gärna om du har frågor kring din retur." },
          { key: "infoCard4Cta", label: "Steg 1: Infokort 4 knapp", type: "text", defaultValue: "Kontakta kundservice" },
          { key: "infoCard4Href", label: "Steg 1: Infokort 4 länk", type: "url", defaultValue: "/kundservice" },
          { key: "faq1", label: "Steg 1: FAQ 1", type: "text", defaultValue: "Hur lång tid har jag på mig att returnera en vara?" },
          { key: "faq2", label: "Steg 1: FAQ 2", type: "text", defaultValue: "När får jag tillbaka mina pengar?" },
          { key: "faq3", label: "Steg 1: FAQ 3", type: "text", defaultValue: "Vem betalar returfrakten?" },
          { key: "faq4", label: "Steg 1: FAQ 4", type: "text", defaultValue: "Kan jag byta vara istället för att returnera den?" },
          { key: "faqA1", label: "Steg 1: FAQ svar 1", type: "textarea", defaultValue: "Du kan registrera retur inom 30 dagar från att du mottagit varan." },
          { key: "faqA2", label: "Steg 1: FAQ svar 2", type: "textarea", defaultValue: "När returen är godkänd återbetalas beloppet normalt inom 1-5 arbetsdagar." },
          { key: "faqA3", label: "Steg 1: FAQ svar 3", type: "textarea", defaultValue: "Vid postretur kan returfrakt debiteras enligt aktuella villkor. Exakt kostnad visas i flödet." },
          { key: "faqA4", label: "Steg 1: FAQ svar 4", type: "textarea", defaultValue: "Byten hanteras vanligtvis som retur + ny beställning för snabbast hantering." },
          { key: "ordersTitle", label: "Steg 1: Dina senaste ordrar", type: "text", defaultValue: "Dina senaste ordrar" },
          { key: "orderDetailsLabel", label: "Steg 1: Visa detaljer", type: "text", defaultValue: "Visa detaljer" },
          { key: "orderContentsTitle", label: "Steg 1: Orderinnehåll", type: "text", defaultValue: "Orderinnehåll" },
          { key: "nextButtonLabel", label: "Steg 1: Fortsätt-knapp", type: "text", defaultValue: "Fortsätt till steg 2" },
        ],
      },
      {
        key: "flowStep2",
        title: "Returflöde: steg 2",
        fields: [
          { key: "title", label: "Steg 2 rubrik", type: "text", defaultValue: "Välj produkter" },
          { key: "progressLabel", label: "Steg 2: progress text", type: "text", defaultValue: "Steg 2 av 5" },
          { key: "subtitleTemplate", label: "Steg 2 undertext-template ({order})", type: "text", defaultValue: "{order} - välj vilka produkter som ska returneras." },
          { key: "backButtonLabel", label: "Steg 2: Tillbaka-knapp", type: "text", defaultValue: "Tillbaka till steg 1" },
          { key: "nextButtonLabel", label: "Steg 2: Fortsätt-knapp", type: "text", defaultValue: "Fortsätt till steg 3" },
        ],
      },
      {
        key: "flowStep3",
        title: "Returflöde: steg 3",
        fields: [
          { key: "title", label: "Steg 3 rubrik", type: "text", defaultValue: "Ange returmetod" },
          { key: "progressLabel", label: "Steg 3: progress text", type: "text", defaultValue: "Steg 3 av 5" },
          { key: "subtitle", label: "Steg 3 undertext", type: "text", defaultValue: "Välj hur du vill returnera dina produkter." },
          { key: "methodPostTitle", label: "Steg 3: Post-rubrik", type: "text", defaultValue: "Skicka med post (rekommenderas)" },
          { key: "methodPostBadge", label: "Steg 3: Post-badge", type: "text", defaultValue: "Enkelt & smidigt" },
          { key: "methodPostText", label: "Steg 3: Post-text", type: "textarea", defaultValue: "Vi skickar en retursedel till dig via e-post. Skriv ut den, fäst på paketet och lämna in hos valfritt ombud." },
          { key: "methodPostCost", label: "Steg 3: Post-kostnad", type: "text", defaultValue: "Kostnad: 59 kr (dras av från din återbetalning)" },
          { key: "methodStoreTitle", label: "Steg 3: Butik-rubrik", type: "text", defaultValue: "Lämna in i butik" },
          { key: "methodStoreText", label: "Steg 3: Butik-text", type: "textarea", defaultValue: "Lämna in din retur i någon av våra partnerbutiker. Ta med din orderbekräftelse." },
          { key: "methodStoreCost", label: "Steg 3: Butik-kostnad", type: "text", defaultValue: "Kostnadsfritt" },
          { key: "infoTitle", label: "Steg 3: Info-rubrik", type: "text", defaultValue: "Bra att veta" },
          { key: "infoText", label: "Steg 3: Info-text", type: "textarea", defaultValue: "Du har rätt att ångra ditt köp inom 30 dagar från den dag du mottog din vara.\nProdukten ska returneras i oförändrat skick och i originalförpackning." },
          { key: "backButtonLabel", label: "Steg 3: Tillbaka-knapp", type: "text", defaultValue: "Tillbaka till steg 2" },
          { key: "nextButtonLabel", label: "Steg 3: Fortsätt-knapp", type: "text", defaultValue: "Fortsätt till steg 4" },
        ],
      },
      {
        key: "flowStep4",
        title: "Returflöde: steg 4",
        fields: [
          { key: "title", label: "Steg 4 rubrik", type: "text", defaultValue: "Returdetaljer" },
          { key: "progressLabel", label: "Steg 4: progress text", type: "text", defaultValue: "Steg 4 av 5" },
          { key: "subtitle", label: "Steg 4 undertext", type: "text", defaultValue: "Berätta varför du returnerar dina produkter." },
          { key: "productsTitleTemplate", label: "Steg 4: Produktlista-rubrik ({count})", type: "text", defaultValue: "Produkter du returnerar ({count})" },
          { key: "totalLabel", label: "Steg 4: Totaletikett", type: "text", defaultValue: "Totalt värde att returnera" },
          { key: "reasonLabel", label: "Steg 4: Anledning-rubrik", type: "text", defaultValue: "Ange anledning till retur" },
          { key: "reasonPlaceholder", label: "Steg 4: Anledning-placeholder", type: "text", defaultValue: "Välj anledning" },
          { key: "reasonOption1", label: "Steg 4: Anledning 1", type: "text", defaultValue: "Produkten motsvarade inte mina förväntningar" },
          { key: "reasonOption2", label: "Steg 4: Anledning 2", type: "text", defaultValue: "Fel produkt" },
          { key: "reasonOption3", label: "Steg 4: Anledning 3", type: "text", defaultValue: "Skadad / trasig vara" },
          { key: "reasonOption4", label: "Steg 4: Anledning 4", type: "text", defaultValue: "Storleken passade inte" },
          { key: "reasonOption5", label: "Steg 4: Anledning 5", type: "text", defaultValue: "Ångrat köp" },
          { key: "reasonOption6", label: "Steg 4: Anledning 6", type: "text", defaultValue: "Annat (vänligen specificera)" },
          { key: "commentLabel", label: "Steg 4: Kommentar-rubrik", type: "text", defaultValue: "Ytterligare information (valfritt)" },
          { key: "commentPlaceholder", label: "Steg 4: Kommentar-placeholder", type: "text", defaultValue: "Skriv meddelande här..." },
          { key: "infoTitle", label: "Steg 4: Info-rubrik", type: "text", defaultValue: "Tänk på detta" },
          { key: "infoText", label: "Steg 4: Info-text", type: "textarea", defaultValue: "Produkter ska returneras i oförändrat skick, i originalförpackning med tillbehör och etiketter kvar.\nReturen ska skickas inom 10 arbetsdagar från att du anmält din retur." },
          { key: "backButtonLabel", label: "Steg 4: Tillbaka-knapp", type: "text", defaultValue: "Tillbaka till steg 3" },
          { key: "nextButtonLabel", label: "Steg 4: Fortsätt-knapp", type: "text", defaultValue: "Fortsätt till steg 5" },
        ],
      },
      {
        key: "flowStep5",
        title: "Returflöde: steg 5",
        fields: [
          { key: "title", label: "Steg 5 rubrik", type: "text", defaultValue: "Bekräfta & skicka" },
          { key: "progressLabel", label: "Steg 5: progress text", type: "text", defaultValue: "Steg 5 av 5" },
          { key: "subtitle", label: "Steg 5 undertext", type: "text", defaultValue: "Kontrollera dina uppgifter och skicka in din retur. Du får en bekräftelse via e-post." },
          { key: "summaryTitle", label: "Steg 5: Sammanfattning-rubrik", type: "text", defaultValue: "Retursammanfattning" },
          { key: "summaryTotalLabel", label: "Steg 5: Totaletikett", type: "text", defaultValue: "Totalt värde att returnera" },
          { key: "returnInfoTitle", label: "Steg 5: Returinformation-rubrik", type: "text", defaultValue: "Returinformation" },
          { key: "returnMethodLabel", label: "Steg 5: Returmetod etikett", type: "text", defaultValue: "Returmetod:" },
          { key: "returnMethodPost", label: "Steg 5: Returmetod post", type: "text", defaultValue: "Skicka med post (rekommenderas)" },
          { key: "returnMethodStore", label: "Steg 5: Returmetod butik", type: "text", defaultValue: "Lämna in i butik" },
          { key: "returnLabelSentTo", label: "Steg 5: Retursedel etikett", type: "text", defaultValue: "Retursedel skickas till:" },
          { key: "returnSentToText", label: "Steg 5: Retursedel text", type: "text", defaultValue: "din e-post efter att du skapat returen." },
          { key: "returnFreightLabel", label: "Steg 5: Returfrakt etikett", type: "text", defaultValue: "Returfrakt:" },
          { key: "returnFreightPost", label: "Steg 5: Returfrakt post", type: "text", defaultValue: "59 kr (dras av från återbetalningen)" },
          { key: "returnFreightStore", label: "Steg 5: Returfrakt butik", type: "text", defaultValue: "Kostnadsfritt" },
          { key: "additionalInfoLabel", label: "Steg 5: Ytterligare info etikett", type: "text", defaultValue: "Ytterligare information:" },
          { key: "sustainabilityText", label: "Steg 5: Hållbarhetstext", type: "textarea", defaultValue: "Tack för att du handlar hållbart hos oss! Genom att returnera hjälper du oss att minska onödiga transporter och värna om miljön." },
          { key: "nextHowTitle", label: "Steg 5: Så här gör du nu-rubrik", type: "text", defaultValue: "Så här gör du nu" },
          { key: "nextHowItem1", label: "Steg 5: Instruktion 1", type: "textarea", defaultValue: "Packa varorna: Packa produkten i originalförpackning och se till att allt som hör till produkten är med." },
          { key: "nextHowItem2", label: "Steg 5: Instruktion 2", type: "textarea", defaultValue: "Skriv ut retursedeln: Du får retursedel via e-post. Skriv ut och fäst på paketet." },
          { key: "nextHowItem3", label: "Steg 5: Instruktion 3", type: "textarea", defaultValue: "Skicka paketet: Lämna in paket på ditt ombud. Kom ihåg att spara kvitto." },
          { key: "termsLabel", label: "Steg 5: Villkorstext", type: "text", defaultValue: "Jag har läst och godkänner" },
          { key: "backButtonLabel", label: "Steg 5: Tillbaka-knapp", type: "text", defaultValue: "Tillbaka till steg 4" },
          { key: "submitButtonLabel", label: "Steg 5: Skicka-knapp", type: "text", defaultValue: "Skicka in retur" },
          { key: "confirmationTitle", label: "Steg 5: Bekräftelsetitel", type: "text", defaultValue: "Nästa steg: Du får en bekräftelse via e-post" },
          { key: "confirmationText", label: "Steg 5: Bekräftelsetext", type: "text", defaultValue: "När vi har mottagit och kontrollerat din retur återbetalar vi beloppet till dig inom 10 arbetsdagar." },
          { key: "successTemplate", label: "Steg 5: Success-text ({returnId})", type: "text", defaultValue: "Returen är registrerad. Ditt retur-ID är {returnId}." },
          { key: "errorText", label: "Steg 5: Feltext", type: "text", defaultValue: "Du behöver godkänna villkoren innan returen kan skickas." },
        ],
      },
      {
        key: "flowStep6",
        title: "Returflöde: steg 6",
        fields: [
          { key: "progressLabel", label: "Steg 6: progress text", type: "text", defaultValue: "Steg 6 av 6" },
          { key: "title", label: "Steg 6 rubrik", type: "text", defaultValue: "Returen mottagen!" },
          { key: "subtitle", label: "Steg 6 undertext", type: "textarea", defaultValue: "Tack! Vi har mottagit din returbegäran.\nDu får snart ett e-postmeddelande med en sammanfattning av din retur och vidare instruktioner." },
          { key: "returnNumberLabel", label: "Steg 6: Returnummer etikett", type: "text", defaultValue: "Returnummer:" },
          { key: "dateLabel", label: "Steg 6: Datum etikett", type: "text", defaultValue: "Datum:" },
          { key: "orderLabel", label: "Steg 6: Order etikett", type: "text", defaultValue: "Order:" },
          { key: "printButtonLabel", label: "Steg 6: Skriv ut knapp", type: "text", defaultValue: "Skriv ut sammanfattning" },
          { key: "whatHappensTitle", label: "Steg 6: Vad händer nu rubrik", type: "text", defaultValue: "Vad händer nu?" },
          { key: "nextStep1Title", label: "Steg 6: Nästa steg 1 rubrik", type: "text", defaultValue: "Bekräftelse via e-post" },
          { key: "nextStep1Text", label: "Steg 6: Nästa steg 1 text", type: "textarea", defaultValue: "Du får strax ett e-postmeddelande med din returinformation och en retursedel." },
          { key: "nextStep2Title", label: "Steg 6: Nästa steg 2 rubrik", type: "text", defaultValue: "Skicka din retur" },
          { key: "nextStep2Text", label: "Steg 6: Nästa steg 2 text", type: "textarea", defaultValue: "Packa varorna och fäst retursedeln på paketet. Lämna eller boka upphämtning enligt instruktionerna." },
          { key: "nextStep3Title", label: "Steg 6: Nästa steg 3 rubrik", type: "text", defaultValue: "Vi behandlar din retur" },
          { key: "nextStep3Text", label: "Steg 6: Nästa steg 3 text", type: "textarea", defaultValue: "När vi har mottagit och godkänt din retur behandlar vi din återbetalning." },
          { key: "sustainabilityTitle", label: "Steg 6: Miljötips rubrik", type: "text", defaultValue: "Miljötips" },
          { key: "sustainabilityText", label: "Steg 6: Miljötips text", type: "text", defaultValue: "Tack för att du returnerar på ett hållbart sätt. Tillsammans minskar vi onödiga transporter och värnar om miljön." },
          { key: "backToOrdersLabel", label: "Steg 6: Tillbaka till ordrar knapp", type: "text", defaultValue: "Tillbaka till mina ordrar" },
          { key: "backToOrdersHref", label: "Steg 6: Tillbaka till ordrar länk", type: "url", defaultValue: "/mina-sidor/ordrar" },
          { key: "doneLabel", label: "Steg 6: Klar knapp", type: "text", defaultValue: "Klart" },
          { key: "doneHref", label: "Steg 6: Klar länk", type: "url", defaultValue: "/returer-aterbetalningar?account=1" },
        ],
      },
    ],
  },
  {
    key: "leverans",
    title: "Fraktinformation",
    route: "/leverans",
    blocks: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { key: "breadcrumbCurrent", label: "Breadcrumb sista steg", type: "text", defaultValue: "Fraktinformation" },
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Fraktinformation" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Vi vill att din beställning ska komma fram snabbt, smidigt och tryggt. Här hittar du all information om våra fraktalternativ, leveranstider och vad som gäller för din leverans." },
          { key: "imageUrl", label: "Hero-bild", type: "image", defaultValue: "" },
        ],
      },
      {
        key: "sections",
        title: "Sektionrubriker",
        fields: [
          { key: "breadcrumbRoot", label: "Breadcrumb start", type: "text", defaultValue: "Kundservice" },
          { key: "shippingTitle", label: "Fraktalternativ-rubrik", type: "text", defaultValue: "Våra fraktalternativ" },
          { key: "deliveryTimesTitle", label: "Leveranstider-rubrik", type: "text", defaultValue: "Leveranstider" },
          { key: "goodToKnowTitle", label: "Bra att veta-rubrik", type: "text", defaultValue: "Bra att veta" },
          { key: "faqTitle", label: "FAQ-rubrik", type: "text", defaultValue: "Vanliga frågor" },
          { key: "faqViewAllLabel", label: "FAQ visa alla", type: "text", defaultValue: "Se alla frågor" },
        ],
      },
      {
        key: "faq",
        title: "FAQ",
        fields: [
          { key: "q1", label: "Fråga 1", type: "text", defaultValue: "När skickas min order?" },
          { key: "a1", label: "Svar 1", type: "textarea", defaultValue: "Beställningar som läggs före vår bryttid skickas normalt samma vardag." },
          { key: "q2", label: "Fråga 2", type: "text", defaultValue: "Kan jag ändra leveranssätt efter att jag lagt ordern?" },
          { key: "a2", label: "Svar 2", type: "textarea", defaultValue: "Om ordern inte hunnit packas kan vi ibland hjälpa till att ändra leveranssätt. Kontakta kundservice snabbt." },
          { key: "q3", label: "Fråga 3", type: "text", defaultValue: "Levererar ni på helger?" },
          { key: "a3", label: "Svar 3", type: "textarea", defaultValue: "Utdelning beror på transportör och område. Vissa leveranser kan ske på lördagar." },
          { key: "q4", label: "Fråga 4", type: "text", defaultValue: "Vad händer om jag inte hämtar ut mitt paket?" },
          { key: "a4", label: "Svar 4", type: "textarea", defaultValue: "Outhämtade paket returneras till oss. Eventuell avgift kan tillkomma enligt våra köpvillkor." },
          { key: "q5", label: "Fråga 5", type: "text", defaultValue: "Kan jag få min order levererad till en annan adress?" },
          { key: "a5", label: "Svar 5", type: "textarea", defaultValue: "Ja, du kan ange separat leveransadress i kassan." },
          { key: "q6", label: "Fråga 6", type: "text", defaultValue: "Levererar ni utanför Sverige?" },
          { key: "a6", label: "Svar 6", type: "textarea", defaultValue: "Internationell leverans kan erbjudas för utvalda marknader. Se aktuell information i kassan." },
        ],
      },
      {
        key: "shippingOptions",
        title: "Fraktalternativ",
        fields: [
          { key: "option1Carrier", label: "Alternativ 1 - Transportör", type: "text", defaultValue: "postnord" },
          { key: "option1Brand", label: "Alternativ 1 - Rubrik", type: "text", defaultValue: "PostNord - Hemleverans" },
          { key: "option1Description", label: "Alternativ 1 - Beskrivning", type: "textarea", defaultValue: "Leverans direkt till din dörr eller brevlåda.\nSpårbart hela vägen." },
          { key: "option1Eta", label: "Alternativ 1 - Leveranstid", type: "text", defaultValue: "1-3 arbetsdagar" },
          { key: "option1Price", label: "Alternativ 1 - Pris", type: "text", defaultValue: "49 kr" },
          { key: "option1FreeText", label: "Alternativ 1 - Undertext", type: "text", defaultValue: "Fri frakt över 499 kr" },
          { key: "option2Carrier", label: "Alternativ 2 - Transportör", type: "text", defaultValue: "postnord" },
          { key: "option2Brand", label: "Alternativ 2 - Rubrik", type: "text", defaultValue: "PostNord - Till ombud" },
          { key: "option2Description", label: "Alternativ 2 - Beskrivning", type: "textarea", defaultValue: "Levereras till ditt närmaste ombud.\nDu får ett SMS när paketet finns att hämta." },
          { key: "option2Eta", label: "Alternativ 2 - Leveranstid", type: "text", defaultValue: "1-3 arbetsdagar" },
          { key: "option2Price", label: "Alternativ 2 - Pris", type: "text", defaultValue: "39 kr" },
          { key: "option2FreeText", label: "Alternativ 2 - Undertext", type: "text", defaultValue: "Fri frakt över 499 kr" },
          { key: "option3Carrier", label: "Alternativ 3 - Transportör", type: "text", defaultValue: "DHL" },
          { key: "option3Brand", label: "Alternativ 3 - Rubrik", type: "text", defaultValue: "DHL - Expressleverans" },
          { key: "option3Description", label: "Alternativ 3 - Beskrivning", type: "textarea", defaultValue: "För dig som vill ha det ännu snabbare.\nLeverans inom kl. 12 nästa arbetsdag." },
          { key: "option3Eta", label: "Alternativ 3 - Leveranstid", type: "text", defaultValue: "1 arbetsdag" },
          { key: "option3Price", label: "Alternativ 3 - Pris", type: "text", defaultValue: "129 kr" },
          { key: "option3FreeText", label: "Alternativ 3 - Undertext", type: "text", defaultValue: "" },
        ],
      },
      {
        key: "deliveryTimes",
        title: "Leveranstider block",
        fields: [
          { key: "item1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Order före kl. 14.00" },
          { key: "item1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Vi packar och skickar din order samma dag (vardagar)." },
          { key: "item2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "1-3 arbetsdagar" },
          { key: "item2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Normal leveranstid för alla standardleveranser." },
          { key: "item3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Hela Sverige" },
          { key: "item3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Vi levererar till hela Sverige, inkl. öar och glesbygd." },
          { key: "item4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Spåra din order" },
          { key: "item4Text", label: "Kort 4 - Text", type: "text", defaultValue: "Du får ett spårningsnummer via mejl så snart din order skickats." },
        ],
      },
      {
        key: "goodToKnow",
        title: "Bra att veta",
        fields: [
          { key: "item1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Fraktkostnad" },
          { key: "item1Text", label: "Kort 1 - Text", type: "textarea", defaultValue: "Fri frakt gäller för ordrar över 499 kr.\nUnder 499 kr tillkommer frakt enligt valt fraktmetod." },
          { key: "item2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "Utebliven leverans" },
          { key: "item2Text", label: "Kort 2 - Text", type: "textarea", defaultValue: "Om du inte är hemma lämnas paketet hos din närmaste ombud.\nDu får alltid en avisering." },
          { key: "item3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Skadad leverans" },
          { key: "item3Text", label: "Kort 3 - Text", type: "textarea", defaultValue: "Kontrollera paketet vid leverans.\nVid skada, kontakta oss direkt så hjälper vi dig." },
          { key: "item4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Hållbart leveransval" },
          { key: "item4Text", label: "Kort 4 - Text", type: "textarea", defaultValue: "Vi arbetar aktivt för att minska vår miljöpåverkan\noch väljer hållbara leveranslösningar." },
        ],
      },
      {
        key: "trustBottom",
        title: "Nedre trygghetsrad",
        fields: [
          { key: "item1Title", label: "Kort 1 - Rubrik", type: "text", defaultValue: "Fri frakt över 499 kr" },
          { key: "item1Text", label: "Kort 1 - Text", type: "text", defaultValue: "Snabb & spårbar leverans med PostNord." },
          { key: "item2Title", label: "Kort 2 - Rubrik", type: "text", defaultValue: "30 dagars öppet köp" },
          { key: "item2Text", label: "Kort 2 - Text", type: "text", defaultValue: "Enkelt att returnera om du inte är nöjd." },
          { key: "item3Title", label: "Kort 3 - Rubrik", type: "text", defaultValue: "Säker betalning" },
          { key: "item3Text", label: "Kort 3 - Text", type: "text", defaultValue: "Vi använder krypterad betalning." },
          { key: "item4Title", label: "Kort 4 - Rubrik", type: "text", defaultValue: "Kundservice" },
          { key: "item4Text", label: "Kort 4 - Text", type: "text", defaultValue: "Vi finns här för dig - alla dagar 08-20." },
        ],
      },
    ],
  },
  {
    key: "sok",
    title: "Sökresultat",
    route: "/sok",
    blocks: [
      {
        key: "search",
        title: "Sökinställningar",
        fields: [
          { key: "searchTerm", label: "Sökterm", type: "text", defaultValue: "träningsväska" },
          { key: "resultCountLabel", label: "Resultattext", type: "text", defaultValue: "Vi hittade 24 resultat" },
          { key: "headingTemplate", label: "Resultatrubrik-template", type: "text", defaultValue: 'Sökresultat för "{term}"' },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "Global footer",
    route: "/_global/footer",
    blocks: [
      {
        key: "brand",
        title: "Varumärke och text",
        fields: [
          { key: "logoUrl", label: "Logo URL (valfritt)", type: "url", defaultValue: "" },
          { key: "brandName", label: "Varumärkesnamn", type: "text", defaultValue: "APPLABBET" },
          { key: "description", label: "Beskrivning", type: "textarea", defaultValue: "Premiumprodukter för träning, rörelse och vardag." },
          { key: "companyLine", label: "Företagsrad", type: "text", defaultValue: "APPLABBET AB" },
          { key: "emailLine", label: "E-postrad", type: "text", defaultValue: "info@applabbet.se" },
        ],
      },
      {
        key: "group1",
        title: "Länkgrupp 1",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Support" },
          { key: "link1Label", label: "Länk 1 text", type: "text", defaultValue: "Kundservice" },
          { key: "link1Href", label: "Länk 1 URL", type: "url", defaultValue: "/kundservice" },
          { key: "link2Label", label: "Länk 2 text", type: "text", defaultValue: "Returer & återbetalningar" },
          { key: "link2Href", label: "Länk 2 URL", type: "url", defaultValue: "/returer-aterbetalningar" },
          { key: "link3Label", label: "Länk 3 text", type: "text", defaultValue: "Leverans" },
          { key: "link3Href", label: "Länk 3 URL", type: "url", defaultValue: "/leverans" },
          { key: "link4Label", label: "Länk 4 text", type: "text", defaultValue: "" },
          { key: "link4Href", label: "Länk 4 URL", type: "url", defaultValue: "" },
        ],
      },
      {
        key: "group2",
        title: "Länkgrupp 2",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "Juridiskt" },
          { key: "link1Label", label: "Länk 1 text", type: "text", defaultValue: "Köpvillkor" },
          { key: "link1Href", label: "Länk 1 URL", type: "url", defaultValue: "/kopvillkor" },
          { key: "link2Label", label: "Länk 2 text", type: "text", defaultValue: "Integritetspolicy" },
          { key: "link2Href", label: "Länk 2 URL", type: "url", defaultValue: "/integritetspolicy" },
          { key: "link3Label", label: "Länk 3 text", type: "text", defaultValue: "Cookies" },
          { key: "link3Href", label: "Länk 3 URL", type: "url", defaultValue: "/cookies" },
          { key: "link4Label", label: "Länk 4 text", type: "text", defaultValue: "GDPR / Dataskydd" },
          { key: "link4Href", label: "Länk 4 URL", type: "url", defaultValue: "/gdpr" },
        ],
      },
      {
        key: "group3",
        title: "Länkgrupp 3 (valfri)",
        fields: [
          { key: "title", label: "Rubrik", type: "text", defaultValue: "" },
          { key: "link1Label", label: "Länk 1 text", type: "text", defaultValue: "" },
          { key: "link1Href", label: "Länk 1 URL", type: "url", defaultValue: "" },
          { key: "link2Label", label: "Länk 2 text", type: "text", defaultValue: "" },
          { key: "link2Href", label: "Länk 2 URL", type: "url", defaultValue: "" },
          { key: "link3Label", label: "Länk 3 text", type: "text", defaultValue: "" },
          { key: "link3Href", label: "Länk 3 URL", type: "url", defaultValue: "" },
          { key: "link4Label", label: "Länk 4 text", type: "text", defaultValue: "" },
          { key: "link4Href", label: "Länk 4 URL", type: "url", defaultValue: "" },
        ],
      },
      {
        key: "meta",
        title: "Footer meta",
        fields: [
          {
            key: "copyright",
            label: "Copyright-rad",
            type: "text",
            defaultValue: "© 2026 APPLABBET. Alla rättigheter förbehållna.",
          },
        ],
      },
    ],
  },
  {
    key: "live-chat",
    title: "Global livechatt",
    route: "/_global/live-chat",
    blocks: [
      {
        key: "settings",
        title: "Inställningar",
        fields: [
          { key: "enabled", label: "Aktiverad (true/false)", type: "text", defaultValue: "true" },
          { key: "agentName", label: "Agentnamn", type: "text", defaultValue: "Ava" },
          { key: "headerTitle", label: "Rubrik i chattfönster", type: "text", defaultValue: "Livechatt med AI-assistent" },
          { key: "statusText", label: "Statusrad", type: "text", defaultValue: "Online nu" },
          { key: "welcomeMessage", label: "Välkomstmeddelande", type: "textarea", defaultValue: "Hej! Jag är din AI-assistent. Hur kan jag hjälpa dig i dag?" },
          { key: "launcherLabel", label: "Knapptext (flytande knapp)", type: "text", defaultValue: "Livechatt" },
          { key: "closeLabel", label: "Stäng-knapptext", type: "text", defaultValue: "Stäng" },
          { key: "inputPlaceholder", label: "Placeholder i inmatningsfält", type: "text", defaultValue: "Skriv ditt meddelande..." },
          { key: "sendLabel", label: "Skicka-knapptext", type: "text", defaultValue: "Skicka" },
          { key: "typingLabel", label: "Skriver-text", type: "text", defaultValue: "Skriver..." },
          {
            key: "triggerPhrases",
            label: "Trigger-fraser (kommaseparerat)",
            type: "textarea",
            defaultValue: "livechat, live chatt, starta chatt, starta chat, chatta med oss, till chatten, öppna chatten, öppna chatt, till live chatt, öppna livechatt",
          },
        ],
      },
    ],
  },
];

export function getCmsPage(key: string) {
  return CMS_PAGES.find((page) => page.key === key) ?? null;
}

export type CmsBlocksContent = Record<string, Record<string, string>>;

export function createDefaultBlocksContent(page: CmsPageDefinition): CmsBlocksContent {
  const blocks: CmsBlocksContent = {};
  for (const block of page.blocks) {
    blocks[block.key] = {};
    for (const field of block.fields) {
      blocks[block.key][field.key] = field.defaultValue;
    }
  }
  return blocks;
}
