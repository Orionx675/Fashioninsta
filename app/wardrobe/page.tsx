"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/components/item-image";
import { ItemCard } from "@/components/item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { ShopDialog } from "@/components/shop-dialog";
import { useStore } from "@/lib/store";
import type { Category, Item, Season } from "@/lib/types";
import { CATEGORIES, SEASONS, SEASON_META } from "@/lib/types";
import { cn } from "@/lib/utils";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-white/70 bg-white/55 text-foreground/70 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

export default function WardrobePage() {
  const { ready, items } = useStore();
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState<Season | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [shopItem, setShopItem] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (season && !i.seasons.includes(season)) return false;
      if (category && i.category !== category) return false;
      if (trendingOnly && !i.trending) return false;
      if (pinnedOnly && !i.pinned) return false;
      if (
        q &&
        !i.name.toLowerCase().includes(q) &&
        !i.colors.some((c) => c.includes(q)) &&
        !i.styleTags.some((t) => t.includes(q))
      )
        return false;
      return true;
    });
  }, [items, query, season, category, trendingOnly, pinnedOnly]);

  if (!ready) {
    return (
      <div className="mt-24 text-center text-sm text-muted-foreground">
        Opening the closet…
      </div>
    );
  }

  const hasFilters = query || season || category || trendingOnly || pinnedOnly;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 pt-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Wardrobe
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} pieces
          </p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            setFormOpen(true);
          }}
          className="rounded-xl shadow-md shadow-indigo-200"
        >
          <Plus data-icon="inline-start" /> Add piece
        </Button>
      </div>

      <div className="glass space-y-3 rounded-3xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, color, or style…"
            className="border-white/70 bg-white/60 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SEASONS.map((s) => (
            <Chip
              key={s}
              active={season === s}
              onClick={() => setSeason(season === s ? null : s)}
            >
              {SEASON_META[s].emoji} {SEASON_META[s].label}
            </Chip>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" />
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {CATEGORY_EMOJI[c]} {CATEGORY_LABEL[c]}
            </Chip>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" />
          <Chip active={trendingOnly} onClick={() => setTrendingOnly(!trendingOnly)}>
            <Sparkles className="mr-1 inline size-3" />
            2026 trends
          </Chip>
          <Chip active={pinnedOnly} onClick={() => setPinnedOnly(!pinnedOnly)}>
            📌 Pinned
          </Chip>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={(i) => {
                setEditItem(i);
                setFormOpen(true);
              }}
              onShop={setShopItem}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl py-16 text-center">
          <p className="text-4xl">🧊</p>
          <p className="mt-2 font-semibold">Nothing matches that filter</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters ? "Try clearing a filter or two." : "Add your first piece!"}
          </p>
          {hasFilters && (
            <Button
              variant="secondary"
              className="mt-4 bg-white/70"
              onClick={() => {
                setQuery("");
                setSeason(null);
                setCategory(null);
                setTrendingOnly(false);
                setPinnedOnly(false);
              }}
            >
              <RotateCcw data-icon="inline-start" /> Clear filters
            </Button>
          )}
        </div>
      )}

      <ItemFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editItem} />
      <ShopDialog
        item={shopItem}
        open={!!shopItem}
        onOpenChange={(o) => !o && setShopItem(null)}
      />
    </div>
  );
}
