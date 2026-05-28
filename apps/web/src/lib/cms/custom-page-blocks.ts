export const CUSTOM_BLOCK_TYPES = [
  "hero",
  "text",
  "image",
  "cta",
  "faq",
  "split",
  "trust",
] as const;

export type CustomBlockType = (typeof CUSTOM_BLOCK_TYPES)[number];

export interface CustomPageBlock {
  id: string;
  type: CustomBlockType;
  data: Record<string, string>;
}

export function createBlockId() {
  return `block_${Math.random().toString(36).slice(2, 10)}`;
}

export function getCustomBlockLabel(type: CustomBlockType) {
  if (type === "hero") return "Hero";
  if (type === "text") return "Textblock";
  if (type === "image") return "Bild";
  if (type === "cta") return "Call to Action";
  if (type === "faq") return "FAQ";
  if (type === "split") return "Tvakolumn";
  return "Trygghetsrad";
}

export function getCustomBlockTemplate(type: CustomBlockType): CustomPageBlock {
  if (type === "hero") {
    return {
      id: createBlockId(),
      type,
      data: {
        eyebrow: "CMS-SIDA",
        title: "Rubrik",
        subtitle: "Skriv en kort underrubrik.",
      },
    };
  }
  if (type === "text") {
    return {
      id: createBlockId(),
      type,
      data: {
        title: "Rubrik",
        body: "Skriv texten har.",
      },
    };
  }
  if (type === "image") {
    return {
      id: createBlockId(),
      type,
      data: {
        src: "",
        alt: "Bildbeskrivning",
        caption: "",
      },
    };
  }
  if (type === "cta") {
    return {
      id: createBlockId(),
      type,
      data: {
        title: "Redo att ga vidare?",
        text: "Beskrivning till CTA.",
        label: "Las mer",
        href: "/kundservice",
      },
    };
  }
  if (type === "faq") {
    return {
      id: createBlockId(),
      type,
      data: {
        title: "Vanliga fragor",
        q1: "Fraga 1",
        a1: "Svar 1",
        q2: "Fraga 2",
        a2: "Svar 2",
      },
    };
  }
  if (type === "split") {
    return {
      id: createBlockId(),
      type,
      data: {
        leftTitle: "Vanster rubrik",
        leftBody: "Vanster textinnehall.",
        rightTitle: "Hoger rubrik",
        rightBody: "Hoger textinnehall.",
      },
    };
  }
  return {
    id: createBlockId(),
    type,
    data: {
      item1Title: "Fri frakt",
      item1Text: "Vid kop over 499 kr",
      item2Title: "30 dagars oppet kop",
      item2Text: "Enkelt och smidigt",
      item3Title: "Premium kvalitet",
      item3Text: "Utvalt med omsorg",
    },
  };
}

export function normalizeCustomBlocks(input: unknown): CustomPageBlock[] {
  if (!Array.isArray(input)) return [];

  const normalized: CustomPageBlock[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const maybe = item as Record<string, unknown>;
    const type = typeof maybe.type === "string" ? maybe.type : "";
    if (!CUSTOM_BLOCK_TYPES.includes(type as CustomBlockType)) continue;

    const dataSource =
      maybe.data && typeof maybe.data === "object" && !Array.isArray(maybe.data)
        ? (maybe.data as Record<string, unknown>)
        : {};
    const data: Record<string, string> = {};
    for (const [key, value] of Object.entries(dataSource)) {
      data[key] = typeof value === "string" ? value : String(value ?? "");
    }

    normalized.push({
      id: typeof maybe.id === "string" && maybe.id.trim() ? maybe.id : createBlockId(),
      type: type as CustomBlockType,
      data,
    });
  }

  return normalized;
}

