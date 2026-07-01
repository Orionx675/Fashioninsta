"use client";

import { useState } from "react";
import { Pencil, Pin, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemImage } from "@/components/item-image";
import { useStore } from "@/lib/store";
import type { Item } from "@/lib/types";
import { COLOR_HEX, SEASON_META } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ItemCard({
  item,
  onEdit,
  onShop,
}: {
  item: Item;
  onEdit: (item: Item) => void;
  onShop: (item: Item) => void;
}) {
  const { togglePin, deleteItem } = useStore();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="glass group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl transition-shadow hover:shadow-xl">
      <div className="relative overflow-hidden">
        <ItemImage
          item={item}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {item.trending && (
            <Badge className="border-0 bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md">
              <Sparkles /> 2026
            </Badge>
          )}
          {item.source === "user" && (
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
              yours
            </Badge>
          )}
        </div>
        <button
          onClick={() => togglePin(item.id)}
          title={item.pinned ? "Unpin" : "Pin to favorites"}
          className={cn(
            "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full shadow-md transition-all",
            item.pinned
              ? "bg-primary text-primary-foreground"
              : "bg-white/85 text-slate-500 opacity-0 backdrop-blur-sm hover:text-primary group-hover:opacity-100"
          )}
        >
          <Pin className={cn("size-4", item.pinned && "fill-current")} />
        </button>
      </div>

      <div className="space-y-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight">{item.name}</p>
          <span className="shrink-0 text-xs" title={item.seasons.join(", ")}>
            {item.seasons.map((s) => SEASON_META[s].emoji).join(" ")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {item.colors.map((c) => (
            <span
              key={c}
              title={c}
              className="size-3.5 rounded-full border border-black/10"
              style={{ background: COLOR_HEX[c] ?? "#ccc" }}
            />
          ))}
          {item.styleTags.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline" className="bg-white/50 text-[10px]">
              {t}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 pt-0.5">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 bg-white/70"
            onClick={() => onShop(item)}
          >
            <ShoppingBag data-icon="inline-start" /> Shop
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Edit"
            onClick={() => onEdit(item)}
          >
            <Pencil />
          </Button>
          {confirming ? (
            <Button
              size="sm"
              variant="destructive"
              onBlur={() => setConfirming(false)}
              onClick={() => deleteItem(item.id)}
            >
              Sure?
            </Button>
          ) : (
            <Button
              size="icon-sm"
              variant="ghost"
              title="Remove"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setConfirming(true)}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
