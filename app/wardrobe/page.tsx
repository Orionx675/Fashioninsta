"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plus, RotateCcw, Search, Sparkles, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/components/item-image";
import { ItemCard } from "@/components/item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { fadeUp, staggerParent } from "@/components/motion";
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
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-white/70 bg-white/55 text-foreground/70 hover:bg-white"
      )}
    >
      {children}
    </motion.button>
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

  const hasFilters = !!(query || season || category || trendingOnly || pinnedOnly);
  // Re-deal the grid whenever the visible set changes shape.
  const gridKey = `${query}|${season}|${category}|${trendingOnly}|${pinnedOnly}`;

  return (
    <div className="relative space-y-6">
      <p
        aria-hidden
        className="ghost-text font-display pointer-events-none absolute -top-2 right-0 hidden text-[clamp(5rem,14vw,10rem)] font-black leading-none sm:block"
      >
        ({items.length})
      </p>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerParent}
        className="relative space-y-6"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-end justify-between gap-3 pt-6"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/60">
              Your board
            </p>
            <h1 className="font-display mt-1 text-5xl font-bold tracking-tight sm:text-6xl">
              Wardrobe<span className="ice-text">.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {filtered.length} of {items.length} pieces
              {hasFilters ? " match your filters" : " on the board"}
            </p>
          </div>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormOpen(true);
              }}
              className="rounded-xl shadow-md shadow-indigo-200"
            >
              <Plus data-icon="inline-start" /> Add piece
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="glass space-y-3 rounded-3xl p-4">
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
              <Pin className="mr-1 inline size-3" />
              Pinned
            </Chip>
          </div>
        </motion.div>
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div
          key={gridKey}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          className="columns-2 gap-4 sm:columns-3 lg:columns-4"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="break-inside-avoid"
            >
              <ItemCard
                item={item}
                onEdit={(i) => {
                  setEditItem(i);
                  setFormOpen(true);
                }}
                onShop={setShopItem}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key={`empty-${gridKey}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-3xl py-16 text-center"
        >
          <Search className="mx-auto size-8 text-muted-foreground/50" />
          <p className="mt-3 font-semibold">Nothing matches that filter</p>
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
        </motion.div>
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
