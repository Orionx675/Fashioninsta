export type Season = "spring" | "summer" | "autumn" | "winter";

export type Category =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "accessory";

export type Occasion = "casual" | "work" | "party" | "festive" | "sport";

export type StyleTag =
  | "minimal"
  | "classic"
  | "romantic"
  | "edgy"
  | "boho"
  | "sporty"
  | "preppy"
  | "artsy"
  | "glam"
  | "street"
  | "cozy"
  | "bold";

export interface Item {
  id: string;
  name: string;
  category: Category;
  seasons: Season[];
  colors: string[];
  styleTags: StyleTag[];
  ageMin: number;
  ageMax: number;
  occasions: Occasion[];
  image?: string;
  trending?: boolean;
  pinned?: boolean;
  source: "catalog" | "user";
}

export interface Profile {
  name: string;
  age: number;
  mbti: string;
  favoriteColors: string[];
  avoidColors: string[];
  city: string;
  season: Season | "auto";
}

export interface Outfit {
  id: string;
  title: string;
  itemIds: string[];
  season: Season;
  occasion: Occasion;
  savedAt: number;
}

export interface BackupFile {
  app: "icy";
  version: 1;
  exportedAt: string;
  profile: Profile | null;
  items: Item[];
  outfits: Outfit[];
}

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export const CATEGORIES: Category[] = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "accessory",
];

export const OCCASIONS: Occasion[] = [
  "casual",
  "work",
  "party",
  "festive",
  "sport",
];

export const STYLE_TAGS: StyleTag[] = [
  "minimal",
  "classic",
  "romantic",
  "edgy",
  "boho",
  "sporty",
  "preppy",
  "artsy",
  "glam",
  "street",
  "cozy",
  "bold",
];

/** Named wardrobe colors mapped to display hex values. */
export const COLOR_HEX: Record<string, string> = {
  white: "#f8fafc",
  cream: "#f5f0e1",
  beige: "#d9c7a7",
  tan: "#c8a17a",
  brown: "#7c5a43",
  black: "#1f2430",
  grey: "#9aa3b2",
  silver: "#c9d1dc",
  navy: "#1e3a5f",
  cobalt: "#1547c7",
  "sky blue": "#8ecdf0",
  denim: "#5b7fa6",
  lavender: "#b9a7e6",
  purple: "#7c4dbc",
  eggplant: "#4a2545",
  pink: "#f0a8c4",
  "powder pink": "#f4d3dd",
  red: "#d63b3b",
  "tomato red": "#e6472e",
  orange: "#ef8a3c",
  marigold: "#e8a824",
  "butter yellow": "#f2df9a",
  yellow: "#f0c94a",
  chartreuse: "#b7c94a",
  sage: "#a8bda0",
  olive: "#7a7f4e",
  green: "#3f7d4e",
  gold: "#d4af5a",
};

export const COLOR_NAMES = Object.keys(COLOR_HEX);

export function currentSeason(date = new Date()): Season {
  const m = date.getMonth(); // 0-11
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

export const SEASON_META: Record<
  Season,
  { label: string; emoji: string; blurb: string }
> = {
  spring: { label: "Spring", emoji: "🌸", blurb: "Light layers & fresh pastels" },
  summer: { label: "Summer", emoji: "☀️", blurb: "Breathable, bright & breezy" },
  autumn: { label: "Autumn", emoji: "🍂", blurb: "Warm tones & cozy layering" },
  winter: { label: "Winter", emoji: "❄️", blurb: "Structured warmth & rich depth" },
};
