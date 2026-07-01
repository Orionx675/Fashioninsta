/**
 * Shopping links are built as search URLs — no API keys required.
 * Local results use Google Maps scoped to the profile city.
 */

export interface ShopLink {
  label: string;
  url: string;
  kind: "local" | "online";
}

const q = encodeURIComponent;

export function shopLinks(itemName: string, city: string): ShopLink[] {
  const links: ShopLink[] = [];
  if (city.trim()) {
    links.push({
      label: `Stores in ${city.trim()}`,
      url: `https://www.google.com/maps/search/${q(`${itemName} clothing stores in ${city.trim()}`)}`,
      kind: "local",
    });
  }
  links.push(
    { label: "Myntra", url: `https://www.myntra.com/${q(itemName)}`, kind: "online" },
    { label: "Ajio", url: `https://www.ajio.com/search/?text=${q(itemName)}`, kind: "online" },
    { label: "Amazon", url: `https://www.amazon.in/s?k=${q(itemName)}`, kind: "online" },
    { label: "H&M", url: `https://www2.hm.com/en_in/search-results.html?q=${q(itemName)}`, kind: "online" },
    { label: "Zara", url: `https://www.zara.com/in/en/search?searchTerm=${q(itemName)}`, kind: "online" }
  );
  return links;
}
