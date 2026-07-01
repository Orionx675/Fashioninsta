import type { StyleTag } from "./types";

export interface StyleArchetype {
  code: string;
  archetype: string;
  blurb: string;
  styleTags: StyleTag[];
  palette: string[]; // named colors that flatter the archetype
}

export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export const ARCHETYPES: Record<string, StyleArchetype> = {
  INTJ: {
    code: "INTJ",
    archetype: "The Architect Minimalist",
    blurb: "Clean lines, monochrome palettes, and quietly powerful tailoring. Every piece earns its place.",
    styleTags: ["minimal", "classic", "edgy"],
    palette: ["black", "grey", "navy", "white", "eggplant"],
  },
  INTP: {
    code: "INTP",
    archetype: "The Absent-Minded Original",
    blurb: "Comfort-first with unexpected combinations — vintage tees, soft layers, and one odd detail that works.",
    styleTags: ["artsy", "street", "minimal"],
    palette: ["grey", "olive", "denim", "cream", "navy"],
  },
  ENTJ: {
    code: "ENTJ",
    archetype: "The Power Tailor",
    blurb: "Sharp structure, bold shoulders, and commanding color. Dressed to run the room.",
    styleTags: ["classic", "glam", "bold"],
    palette: ["black", "cobalt", "white", "tomato red", "navy"],
  },
  ENTP: {
    code: "ENTP",
    archetype: "The Rule-Bender",
    blurb: "Statement pieces, clashing prints done right, and a wardrobe that starts conversations.",
    styleTags: ["bold", "street", "artsy"],
    palette: ["chartreuse", "orange", "cobalt", "black", "white"],
  },
  INFJ: {
    code: "INFJ",
    archetype: "The Quiet Poet",
    blurb: "Soft silhouettes, muted elegance, and thoughtful details nobody else notices — at first.",
    styleTags: ["romantic", "minimal", "cozy"],
    palette: ["sage", "cream", "lavender", "grey", "powder pink"],
  },
  INFP: {
    code: "INFP",
    archetype: "The Dreamy Romantic",
    blurb: "Flowing fabrics, gentle florals, and layers that feel like a favorite daydream.",
    styleTags: ["romantic", "boho", "artsy"],
    palette: ["powder pink", "lavender", "cream", "sage", "butter yellow"],
  },
  ENFJ: {
    code: "ENFJ",
    archetype: "The Warm Classic",
    blurb: "Polished, approachable, and effortlessly put together — the friend whose outfits everyone copies.",
    styleTags: ["classic", "romantic", "glam"],
    palette: ["marigold", "cream", "navy", "tan", "tomato red"],
  },
  ENFP: {
    code: "ENFP",
    archetype: "The Sunbeam Bohemian",
    blurb: "Color, texture, and joy in every layer. Rules are more of a mood board anyway.",
    styleTags: ["boho", "bold", "artsy"],
    palette: ["marigold", "chartreuse", "pink", "orange", "sky blue"],
  },
  ISTJ: {
    code: "ISTJ",
    archetype: "The Timeless Curator",
    blurb: "Investment pieces, perfect fits, and a capsule wardrobe that will still work in ten years.",
    styleTags: ["classic", "minimal", "preppy"],
    palette: ["navy", "white", "grey", "beige", "brown"],
  },
  ISFJ: {
    code: "ISFJ",
    archetype: "The Gentle Nostalgic",
    blurb: "Soft knits, delicate details, and comfort dressed up beautifully.",
    styleTags: ["cozy", "romantic", "classic"],
    palette: ["cream", "powder pink", "sage", "beige", "sky blue"],
  },
  ESTJ: {
    code: "ESTJ",
    archetype: "The Boardroom Standard",
    blurb: "Crisp, structured, and dependable — quality you can see from across the room.",
    styleTags: ["classic", "preppy", "glam"],
    palette: ["navy", "white", "black", "cobalt", "silver"],
  },
  ESFJ: {
    code: "ESFJ",
    archetype: "The Social Polish",
    blurb: "Coordinated, current, and camera-ready. Always dressed for the occasion, whatever it is.",
    styleTags: ["preppy", "romantic", "glam"],
    palette: ["pink", "cream", "marigold", "sky blue", "white"],
  },
  ISTP: {
    code: "ISTP",
    archetype: "The Utility Cool",
    blurb: "Functional, understated, and quietly rugged — workwear that actually works.",
    styleTags: ["street", "sporty", "edgy"],
    palette: ["olive", "black", "grey", "denim", "brown"],
  },
  ISFP: {
    code: "ISFP",
    archetype: "The Soft Artist",
    blurb: "Earthy tones, tactile fabrics, and outfits composed like small paintings.",
    styleTags: ["artsy", "boho", "romantic"],
    palette: ["sage", "tan", "cream", "lavender", "olive"],
  },
  ESTP: {
    code: "ESTP",
    archetype: "The Adrenaline Sharp",
    blurb: "Athletic edge, confident fits, and pieces that move as fast as you do.",
    styleTags: ["sporty", "bold", "street"],
    palette: ["black", "tomato red", "white", "cobalt", "silver"],
  },
  ESFP: {
    code: "ESFP",
    archetype: "The Spotlight Dresser",
    blurb: "Shine, color, and drama — every sidewalk is a runway if you dress for it.",
    styleTags: ["glam", "bold", "street"],
    palette: ["gold", "tomato red", "pink", "cobalt", "black"],
  },
};

export function archetypeFor(mbti: string): StyleArchetype | null {
  return ARCHETYPES[mbti?.toUpperCase()] ?? null;
}
