import { archetypeFor } from "./mbti";
import type { Item, Occasion, Profile, Season } from "./types";

export interface Suggestion {
  id: string;
  title: string;
  items: Item[];
  season: Season;
  occasion: Occasion;
  reason: string;
}

const COLD: Season[] = ["autumn", "winter"];

function scoreItem(item: Item, profile: Profile, occasion: Occasion): number {
  let score = 1;
  const arch = archetypeFor(profile.mbti);
  if (arch) {
    for (const tag of item.styleTags) {
      if (arch.styleTags.includes(tag)) score += 2;
    }
    for (const c of item.colors) {
      if (arch.palette.includes(c)) score += 0.75;
    }
  }
  for (const c of item.colors) {
    if (profile.favoriteColors.includes(c)) score += 1.5;
    if (profile.avoidColors.includes(c)) score -= 3;
  }
  if (item.occasions.includes(occasion)) score += 1;
  if (item.trending) score += 0.75;
  if (item.pinned) score += 1.25;
  return score;
}

function fits(item: Item, profile: Profile, season: Season): boolean {
  if (!item.seasons.includes(season)) return false;
  if (profile.age < item.ageMin || profile.age > item.ageMax) return false;
  return true;
}

/** Weighted random pick — keeps suggestions varied but preference-led. */
function weightedPick(pool: { item: Item; score: number }[], exclude: Set<string>): Item | null {
  const candidates = pool.filter((p) => !exclude.has(p.item.id) && p.score > 0);
  if (candidates.length === 0) return null;
  const total = candidates.reduce((s, c) => s + c.score, 0);
  let roll = Math.random() * total;
  for (const c of candidates) {
    roll -= c.score;
    if (roll <= 0) return c.item;
  }
  return candidates[candidates.length - 1].item;
}

function buildOne(
  scored: Map<string, { item: Item; score: number }[]>,
  season: Season,
  occasion: Occasion,
  usedKeys: Set<string>
): Item[] | null {
  const pool = (cat: string) => scored.get(cat) ?? [];
  const picked: Item[] = [];
  const excluded = new Set<string>();

  const useDress = pool("dress").length > 0 && (Math.random() < 0.4 || pool("top").length === 0 || pool("bottom").length === 0);

  if (useDress) {
    const dress = weightedPick(pool("dress"), excluded);
    if (!dress) return null;
    picked.push(dress);
  } else {
    const top = weightedPick(pool("top"), excluded);
    const bottom = weightedPick(pool("bottom"), excluded);
    if (!top || !bottom) return null;
    picked.push(top, bottom);
  }

  const shoes = weightedPick(pool("shoes"), excluded);
  if (shoes) picked.push(shoes);

  if (COLD.includes(season) || (occasion === "work" && pool("outerwear").length > 0 && Math.random() < 0.5)) {
    const outer = weightedPick(pool("outerwear"), excluded);
    if (outer) picked.push(outer);
  }

  if (Math.random() < 0.8) {
    const acc = weightedPick(pool("accessory"), excluded);
    if (acc) picked.push(acc);
  }

  // Dedupe whole outfits by their core (non-accessory) pieces.
  const key = picked
    .filter((i) => i.category !== "accessory")
    .map((i) => i.id)
    .sort()
    .join("|");
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);
  return picked;
}

const TITLES = [
  "The Frontrunner",
  "The Wildcard",
  "The Slow Burn",
  "The Encore",
  "The Plot Twist",
];

export function suggestOutfits(
  allItems: Item[],
  profile: Profile,
  season: Season,
  occasion: Occasion,
  count = 3
): Suggestion[] {
  // Filter by season + age; relax age if the pool gets too thin.
  let wearable = allItems.filter((i) => fits(i, profile, season));
  if (wearable.length < 8) {
    wearable = allItems.filter((i) => i.seasons.includes(season));
  }

  const scored = new Map<string, { item: Item; score: number }[]>();
  for (const item of wearable) {
    const entry = { item, score: Math.max(0.1, scoreItem(item, profile, occasion)) };
    const list = scored.get(item.category) ?? [];
    list.push(entry);
    scored.set(item.category, list);
  }

  const out: Suggestion[] = [];
  const usedKeys = new Set<string>();
  let attempts = 0;
  while (out.length < count && attempts < 40) {
    attempts++;
    const items = buildOne(scored, season, occasion, usedKeys);
    if (!items) continue;
    const arch = archetypeFor(profile.mbti);
    const trendy = items.some((i) => i.trending);
    const reasons: string[] = [];
    if (arch) reasons.push(`matched to ${arch.archetype}`);
    if (items.some((i) => i.colors.some((c) => profile.favoriteColors.includes(c))))
      reasons.push("features your favorite colors");
    if (trendy) reasons.push("includes a 2026 trend piece");
    out.push({
      id: `sug-${Date.now()}-${out.length}-${Math.floor(Math.random() * 1e6)}`,
      title: TITLES[out.length % TITLES.length],
      items,
      season,
      occasion,
      reason: reasons.length ? reasons.join(" · ") : "a clean seasonal match",
    });
  }
  return out;
}
