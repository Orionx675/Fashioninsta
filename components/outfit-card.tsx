"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, ItemImage } from "@/components/item-image";
import type { Suggestion } from "@/lib/suggest";
import type { Item } from "@/lib/types";

function ItemRow({ item, onShop }: { item: Item; onShop: (item: Item) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/55 p-2 pr-3">
      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl">
        <ItemImage item={item} compact className="h-full" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABEL[item.category]}
          {item.trending && " · 2026 trend"}
        </p>
      </div>
      <Button
        size="icon-sm"
        variant="ghost"
        title="Shop this piece"
        onClick={() => onShop(item)}
      >
        <ShoppingBag />
      </Button>
    </div>
  );
}

export function SuggestionCard({
  suggestion,
  onSave,
  onShop,
  saved,
}: {
  suggestion: Suggestion;
  onSave: (s: Suggestion) => void;
  onShop: (item: Item) => void;
  saved: boolean;
}) {
  return (
    <div className="glass flex flex-col gap-3 rounded-3xl p-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{suggestion.title}</h3>
          <Badge variant="secondary" className="bg-white/70 capitalize">
            {suggestion.occasion}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{suggestion.reason}</p>
      </div>

      <div className="flex flex-col gap-2">
        {suggestion.items.map((item) => (
          <ItemRow key={item.id} item={item} onShop={onShop} />
        ))}
      </div>

      <Button
        variant={saved ? "secondary" : "default"}
        disabled={saved}
        onClick={() => onSave(suggestion)}
        className="mt-auto"
      >
        <Heart data-icon="inline-start" className={saved ? "fill-current" : ""} />
        {saved ? "Saved to outfits" : "Save this outfit"}
      </Button>
    </div>
  );
}
