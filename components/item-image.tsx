"use client";

import { useState } from "react";
import type { Category, Item } from "@/lib/types";
import { COLOR_HEX } from "@/lib/types";
import { cn } from "@/lib/utils";

export const CATEGORY_EMOJI: Record<Category, string> = {
  top: "👕",
  bottom: "👖",
  dress: "👗",
  outerwear: "🧥",
  shoes: "👟",
  accessory: "👜",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  top: "Top",
  bottom: "Bottom",
  dress: "Dress",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessory: "Accessory",
};

/**
 * Renders the item photo, or an intentional color-block card built from the
 * item's own palette when there is no image / the image fails to load.
 */
export function ItemImage({
  item,
  className,
  compact = false,
}: {
  item: Item;
  className?: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!item.image || failed) {
    const c1 = COLOR_HEX[item.colors[0]] ?? "#dbe7f5";
    const c2 = COLOR_HEX[item.colors[1] ?? ""] ?? "#cdc2ec";
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2",
          compact ? "" : "aspect-[3/4]",
          className
        )}
        style={{ background: `linear-gradient(150deg, ${c1} 0%, ${c2} 100%)` }}
      >
        <span className={compact ? "text-2xl" : "text-5xl drop-shadow-sm"}>
          {CATEGORY_EMOJI[item.category]}
        </span>
        {!compact && (
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
            {item.name}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("w-full object-cover", compact ? "h-full" : "", className)}
    />
  );
}
