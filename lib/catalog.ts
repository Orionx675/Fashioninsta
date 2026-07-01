import type { Category, Item, Occasion, Season, StyleTag } from "./types";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

function it(
  id: string,
  name: string,
  category: Category,
  seasons: Season[],
  colors: string[],
  styleTags: StyleTag[],
  ageRange: [number, number],
  occasions: Occasion[],
  image?: string,
  trending?: boolean
): Item {
  return {
    id,
    name,
    category,
    seasons,
    colors,
    styleTags,
    ageMin: ageRange[0],
    ageMax: ageRange[1],
    occasions,
    image,
    trending,
    source: "catalog",
  };
}

/**
 * Starter catalog. Every image URL below has been load-tested and visually
 * verified against its item; items without an image intentionally render as
 * color-block cards (the color IS the point for the 2026 trend shades).
 * Trend flags follow SS/FW 2026 reporting (Who What Wear, Coveteur):
 * cobalt, tomato red, butter yellow, chartreuse, eggplant, marigold,
 * capris, raffia, jelly sandals, eyelet & crochet, sheer layers.
 */
export const CATALOG: Item[] = [
  // ---- Tops ----
  it("c01", "Classic White Tee", "top", ["spring", "summer", "autumn"], ["white"], ["minimal", "classic", "street"], [13, 80], ["casual", "sport"], u("photo-1521572163474-6864f9cf17ab")),
  it("c02", "Sky Blue Oxford Shirt", "top", ["spring", "autumn"], ["sky blue"], ["preppy", "classic"], [15, 80], ["work", "casual"], u("photo-1596755094514-f87e34085b2c")),
  it("c03", "Butter Yellow Blouse", "top", ["spring", "summer"], ["butter yellow"], ["romantic", "classic"], [15, 70], ["casual", "work"], undefined, true),
  it("c04", "Cobalt Satin Shirt", "top", ["spring", "summer", "autumn"], ["cobalt"], ["glam", "bold"], [18, 60], ["party", "work"], undefined, true),
  it("c05", "Black Turtleneck", "top", ["autumn", "winter"], ["black"], ["minimal", "classic"], [15, 80], ["casual", "work"]),
  it("c06", "Crochet Knit Top", "top", ["summer"], ["cream"], ["boho", "artsy"], [15, 55], ["casual", "festive"], undefined, true),
  it("c07", "Breton Striped Top", "top", ["spring", "summer"], ["navy", "white"], ["preppy", "classic"], [13, 80], ["casual"]),
  it("c08", "Graphic Band Tee", "top", ["spring", "summer", "autumn"], ["black"], ["street", "edgy"], [13, 40], ["casual"], u("photo-1503341504253-dff4815485f1")),
  it("c09", "Linen Camp Shirt", "top", ["summer"], ["sky blue"], ["minimal", "boho"], [15, 80], ["casual"], u("photo-1604695573706-53170668f6a6")),
  it("c10", "White Eyelet Blouse", "top", ["spring", "summer"], ["white"], ["romantic", "classic"], [13, 70], ["casual", "festive"], u("photo-1594633312681-425c7b97ccd1"), true),
  it("c11", "Silk Camisole", "top", ["summer", "spring"], ["powder pink"], ["glam", "romantic"], [18, 55], ["party"]),
  it("c12", "Chunky Cream Sweater", "top", ["winter", "autumn"], ["cream"], ["cozy", "minimal"], [13, 80], ["casual"], u("photo-1631541909061-71e349d1f203")),
  it("c13", "Cropped Hoodie", "top", ["autumn", "spring"], ["grey"], ["sporty", "street"], [13, 35], ["casual", "sport"], u("photo-1556821840-3a63f95609a7")),
  it("c14", "Sheer Organza Top", "top", ["summer", "spring"], ["lavender"], ["glam", "edgy"], [18, 45], ["party"], undefined, true),

  // ---- Bottoms ----
  it("c15", "High-Waist Straight Jeans", "bottom", ["spring", "summer", "autumn", "winter"], ["denim"], ["classic", "street", "minimal"], [13, 80], ["casual"], u("photo-1541099649105-f69ad21f3246")),
  it("c16", "Wide-Leg Trousers", "bottom", ["spring", "autumn", "winter"], ["black"], ["minimal", "classic"], [16, 80], ["work", "casual"]),
  it("c17", "Cotton Capri Pants", "bottom", ["summer"], ["white"], ["classic", "preppy"], [13, 80], ["casual"], undefined, true),
  it("c18", "Pleated Midi Skirt", "bottom", ["spring", "autumn"], ["cream"], ["romantic", "classic"], [15, 70], ["work", "casual"], u("photo-1592301933927-35b597393c0a")),
  it("c19", "Classic Denim Shorts", "bottom", ["summer"], ["denim"], ["street", "sporty"], [13, 45], ["casual"], u("photo-1591195853828-11db59a44f6b")),
  it("c20", "Olive Cargo Pants", "bottom", ["autumn", "spring"], ["olive"], ["street", "sporty", "edgy"], [13, 45], ["casual"]),
  it("c21", "Tailored City Shorts", "bottom", ["summer"], ["cream"], ["preppy", "classic"], [16, 60], ["work", "casual"]),
  it("c22", "Ruffled Maxi Skirt", "bottom", ["summer", "spring"], ["powder pink"], ["boho", "romantic"], [15, 65], ["casual", "festive"], u("photo-1577900232427-18219b9166a0"), true),
  it("c23", "Faux Leather Pants", "bottom", ["autumn", "winter"], ["black"], ["edgy", "glam"], [18, 45], ["party", "casual"]),
  it("c24", "Soft Knit Joggers", "bottom", ["winter", "autumn"], ["olive"], ["sporty", "cozy"], [13, 70], ["sport", "casual"], u("photo-1552902865-b72c031ac5ea")),
  it("c25", "Chartreuse Midi Skirt", "bottom", ["summer", "spring"], ["chartreuse"], ["bold", "artsy"], [16, 50], ["casual", "party"], undefined, true),
  it("c26", "Linen Palazzo Pants", "bottom", ["summer"], ["cream"], ["boho", "minimal"], [15, 80], ["casual", "work"], u("photo-1509087859087-a384654eca4d")),

  // ---- Dresses ----
  it("c27", "Little Black Dress", "dress", ["spring", "summer", "autumn", "winter"], ["black"], ["glam", "classic", "minimal"], [18, 70], ["party"]),
  it("c28", "Scarlet Floral Midi Dress", "dress", ["spring", "summer"], ["red", "pink"], ["romantic", "boho"], [13, 70], ["casual", "festive"], u("photo-1572804013309-59a88b7e92f1")),
  it("c29", "Plum Off-Shoulder Dress", "dress", ["autumn", "winter"], ["eggplant"], ["glam", "romantic"], [18, 55], ["party", "festive"], u("photo-1566174053879-31528523f8ae")),
  it("c30", "Tomato Red Wrap Dress", "dress", ["summer", "autumn"], ["tomato red"], ["bold", "glam"], [18, 65], ["party", "festive", "work"], u("photo-1595777457583-95e059d581b8"), true),
  it("c31", "White Eyelet Sundress", "dress", ["summer"], ["white"], ["romantic", "boho"], [13, 65], ["casual", "festive"], u("photo-1515372039744-b8f02a3ae446"), true),
  it("c32", "Knit Sweater Dress", "dress", ["winter", "autumn"], ["tan"], ["cozy", "minimal"], [16, 70], ["casual", "work"]),
  it("c33", "Marigold Structured Dress", "dress", ["autumn", "spring"], ["marigold"], ["classic", "bold"], [18, 65], ["work", "festive"], undefined, true),
  it("c34", "Denim Shirt Dress", "dress", ["spring", "summer"], ["denim"], ["street", "classic"], [13, 60], ["casual"], u("photo-1591369822096-ffd140ec948f")),

  // ---- Outerwear ----
  it("c35", "Classic Trench Coat", "outerwear", ["spring", "autumn"], ["tan"], ["classic", "minimal"], [16, 80], ["work", "casual"], u("photo-1591047139829-d91aecb6caea")),
  it("c36", "Vintage Denim Jacket", "outerwear", ["spring", "autumn"], ["denim"], ["street", "classic", "boho"], [13, 60], ["casual"], u("photo-1576995853123-5a10305d93c0")),
  it("c37", "Leather Biker Jacket", "outerwear", ["autumn", "winter"], ["black"], ["edgy", "street"], [16, 55], ["casual", "party"], u("photo-1551028719-00167b16eac5")),
  it("c38", "Camel Wool Overcoat", "outerwear", ["winter"], ["tan"], ["classic", "minimal"], [18, 80], ["work", "casual"], u("photo-1539533018447-63fcce2678e3")),
  it("c39", "Sherpa Denim Jacket", "outerwear", ["winter", "autumn"], ["denim"], ["street", "cozy"], [13, 45], ["casual"], u("photo-1544923246-77307dd654cb")),
  it("c40", "Eggplant Power Blazer", "outerwear", ["autumn", "winter", "spring"], ["eggplant"], ["bold", "classic"], [18, 70], ["work", "party"], undefined, true),
  it("c41", "Sage Knit Cardigan", "outerwear", ["autumn", "spring"], ["sage"], ["cozy", "romantic"], [13, 80], ["casual"]),
  it("c42", "Navy Tailored Blazer", "outerwear", ["autumn", "winter", "spring"], ["navy"], ["classic", "preppy"], [16, 80], ["work", "party"], u("photo-1592878904946-b3cd8ae243d0")),

  // ---- Shoes ----
  it("c43", "Statement Sneakers", "shoes", ["spring", "summer", "autumn"], ["white", "pink"], ["street", "bold", "sporty"], [13, 45], ["casual", "sport"], u("photo-1560769629-975ec94e6a86")),
  it("c44", "Ballet Flats", "shoes", ["spring", "summer"], ["powder pink"], ["romantic", "classic"], [13, 70], ["casual", "work"]),
  it("c45", "Cork Slide Sandals", "shoes", ["summer"], ["beige"], ["boho", "minimal"], [13, 80], ["casual"], u("photo-1603487742131-4160ec999306")),
  it("c46", "Leather Ankle Boots", "shoes", ["autumn", "winter"], ["brown"], ["classic", "street"], [15, 70], ["casual", "work"], u("photo-1608256246200-53e635b5b65f")),
  it("c47", "Heeled Chelsea Boots", "shoes", ["autumn", "winter"], ["black"], ["edgy", "classic"], [16, 60], ["work", "party", "casual"], u("photo-1582897085656-c636d006a246")),
  it("c48", "Classic Black Pumps", "shoes", ["spring", "autumn", "winter"], ["black"], ["glam", "classic"], [18, 70], ["party", "work", "festive"], u("photo-1596703263926-eb0762ee17e4")),
  it("c49", "Performance Runners", "shoes", ["spring", "summer", "autumn", "winter"], ["tomato red"], ["sporty"], [13, 80], ["sport"], u("photo-1542291026-7eec264c27ff")),
  it("c50", "Rugged Combat Boots", "shoes", ["autumn", "winter"], ["brown"], ["edgy", "street"], [13, 45], ["casual"], u("photo-1605812860427-4024433a70fd")),
  it("c51", "Raffia Flat Sandals", "shoes", ["summer"], ["beige"], ["boho", "minimal"], [15, 80], ["casual"], undefined, true),
  it("c52", "Velvet Mary Janes", "shoes", ["autumn", "winter"], ["eggplant"], ["romantic", "preppy"], [13, 55], ["party", "festive"]),
  it("c63", "Jelly Thong Sandals", "shoes", ["summer"], ["sky blue"], ["bold", "street"], [13, 40], ["casual"], undefined, true),

  // ---- Accessories ----
  it("c53", "Cognac Leather Handbag", "accessory", ["spring", "autumn", "winter"], ["tan"], ["classic", "boho"], [16, 80], ["work", "casual"], u("photo-1590874103328-eac38a683ce7")),
  it("c54", "Silver Hoop Earrings", "accessory", ["spring", "summer", "autumn", "winter"], ["silver"], ["minimal", "glam"], [13, 80], ["casual", "party", "work"]),
  it("c55", "Printed Silk Scarf", "accessory", ["spring", "autumn"], ["marigold"], ["classic", "romantic"], [16, 80], ["work", "casual", "festive"]),
  it("c56", "Retro Black Sunglasses", "accessory", ["summer", "spring"], ["black"], ["street", "bold"], [13, 70], ["casual", "party"], u("photo-1572635196237-14b3f281503f")),
  it("c57", "Navy Canvas Backpack", "accessory", ["spring", "summer", "autumn", "winter"], ["navy"], ["street", "sporty"], [13, 45], ["casual", "sport"], u("photo-1553062407-98eeb64c6a62")),
  it("c58", "Ribbed Knit Beanie", "accessory", ["winter"], ["grey"], ["cozy", "street"], [13, 50], ["casual"]),
  it("c59", "Chunky Gold Necklace", "accessory", ["autumn", "winter", "spring", "summer"], ["gold"], ["glam", "bold"], [18, 70], ["party", "festive"], u("photo-1599643478518-a784e5dc4c8f")),
  it("c60", "Black Crossbody Bag", "accessory", ["spring", "summer", "autumn", "winter"], ["black"], ["street", "minimal"], [13, 80], ["casual", "work"], u("photo-1548036328-c9fa89d128fa")),
  it("c61", "Grey Snapback Cap", "accessory", ["summer", "spring"], ["grey"], ["street", "sporty"], [13, 35], ["casual", "sport"], u("photo-1556306535-0f09a537f0a3")),
  it("c62", "Crystal Drop Earrings", "accessory", ["spring", "summer", "autumn", "winter"], ["silver"], ["glam"], [15, 80], ["festive", "party"], u("photo-1535632787350-4e68ef0ac584")),
  it("c64", "Raffia Tote Bag", "accessory", ["summer"], ["beige"], ["boho", "minimal"], [15, 80], ["casual"], undefined, true),
];

/** Headline trends surfaced on the dashboard. */
export const TRENDS_2026 = [
  { name: "Cobalt Blue", type: "color", note: "The defining bold shade of summer '26" },
  { name: "Tomato Red", type: "color", note: "Everywhere on SS26 and FW26 runways" },
  { name: "Butter Yellow", type: "color", note: "Soft sunshine neutral of the season" },
  { name: "Chartreuse", type: "color", note: "Zesty statement green" },
  { name: "Deep Eggplant", type: "color", note: "FW26's chic alternative to black" },
  { name: "Marigold", type: "color", note: "Structured tailoring's favorite hue" },
  { name: "Capri Pants", type: "piece", note: "The comeback bottom of summer 2026" },
  { name: "Raffia Everything", type: "texture", note: "Shoes, bags, jewelry — all woven" },
  { name: "Jelly Sandals", type: "piece", note: "Back in minimal thong silhouettes" },
  { name: "Eyelet & Crochet", type: "texture", note: "Airy openwork and smocked details" },
  { name: "Sheer Layering", type: "texture", note: "Organza and translucent layers" },
] as const;
