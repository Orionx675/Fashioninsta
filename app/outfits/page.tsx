"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RefreshCw, Snowflake, Trash2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, ItemImage } from "@/components/item-image";
import { fadeUp, SPRING, staggerParent } from "@/components/motion";
import { SuggestionCard } from "@/components/outfit-card";
import { ShopDialog } from "@/components/shop-dialog";
import { useStore } from "@/lib/store";
import type { Suggestion } from "@/lib/suggest";
import { suggestOutfits } from "@/lib/suggest";
import type { Item, Occasion, Outfit, Season } from "@/lib/types";
import { currentSeason, OCCASIONS, SEASONS, SEASON_META } from "@/lib/types";
import { cn } from "@/lib/utils";

function PillRow<T extends string>({
  options,
  value,
  onPick,
  labelFor,
  group,
}: {
  options: readonly T[];
  value: T;
  onPick: (v: T) => void;
  labelFor: (v: T) => string;
  group: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <motion.button
            key={o}
            whileTap={{ scale: 0.93 }}
            onClick={() => onPick(o)}
            className={cn(
              "relative cursor-pointer rounded-full border border-transparent px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200",
              active
                ? "text-primary-foreground"
                : "border-white/70 bg-white/55 text-foreground/70 hover:bg-white"
            )}
          >
            {active && (
              <motion.span
                layoutId={`pill-${group}`}
                className="absolute inset-0 rounded-full bg-primary shadow-sm"
                transition={SPRING}
              />
            )}
            <span className="relative z-10">{labelFor(o)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function OutfitsPage() {
  const { ready, profile, items, outfits, saveOutfit, deleteOutfit } = useStore();
  const [seasonPick, setSeasonPick] = useState<Season | null>(null);
  const [occasion, setOccasion] = useState<Occasion>("casual");
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [generation, setGeneration] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [shopItem, setShopItem] = useState<Item | null>(null);

  // Explicit user pick wins; otherwise follow the profile override or the calendar.
  const season: Season =
    seasonPick ??
    (profile && profile.season !== "auto" ? profile.season : currentSeason());

  const generate = useCallback(
    (s: Season, o: Occasion) => {
      if (!profile) return;
      setSuggestions(suggestOutfits(items, profile, s, o, 3));
      setGeneration((g) => g + 1);
      setSavedIds([]);
    },
    [items, profile]
  );

  useEffect(() => {
    // One-time auto-generate once the store has hydrated; afterwards
    // suggestions only change on explicit user action.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ready && profile && suggestions === null) generate(season, occasion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profile]);

  if (!ready) {
    return (
      <div className="mt-24 text-center text-sm text-muted-foreground">
        Warming up the stylist…
      </div>
    );
  }

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong mx-auto mt-20 max-w-md rounded-3xl p-8 text-center"
      >
        <Snowflake className="mx-auto size-8 text-primary" />
        <h1 className="font-display mt-3 text-2xl font-bold">
          Your stylist needs to meet you first
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Outfit suggestions are matched to your age, MBTI, colors, and season.
          Set up your Style DNA to unlock them.
        </p>
        <Button asChild className="mt-5">
          <Link href="/profile">Create Style DNA</Link>
        </Button>
      </motion.div>
    );
  }

  function handleSave(s: Suggestion) {
    const outfit: Outfit = {
      id: `o-${Date.now()}`,
      title: `${s.title} · ${SEASON_META[s.season].label}`,
      itemIds: s.items.map((i) => i.id),
      season: s.season,
      occasion: s.occasion,
      savedAt: Date.now(),
    };
    saveOutfit(outfit);
    setSavedIds((ids) => [...ids, s.id]);
  }

  return (
    <div className="relative space-y-8">
      <p
        aria-hidden
        className="ghost-text font-display pointer-events-none absolute -top-2 right-0 hidden text-[clamp(5rem,14vw,10rem)] font-black leading-none sm:block"
      >
        2–3
      </p>

      <motion.div initial="hidden" animate="show" variants={staggerParent} className="relative space-y-8">
        <motion.div variants={fadeUp} className="pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/60">
            Today’s stylist
          </p>
          <h1 className="font-display mt-1 text-5xl font-bold tracking-tight sm:text-6xl">
            Dress me<span className="ice-text"> today.</span>
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Always 2–3 options — never a dictated look. Reshuffle until one
            feels right.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass space-y-3 rounded-3xl p-4">
          <PillRow
            group="season"
            options={SEASONS}
            value={season}
            onPick={(s) => {
              setSeasonPick(s);
              generate(s, occasion);
            }}
            labelFor={(s) => `${SEASON_META[s].emoji} ${SEASON_META[s].label}`}
          />
          <PillRow
            group="occasion"
            options={OCCASIONS}
            value={occasion}
            onPick={(o) => {
              setOccasion(o);
              generate(season, o);
            }}
            labelFor={(o) => o}
          />
          <motion.div whileTap={{ scale: 0.96 }} className="w-fit">
            <Button
              onClick={() => generate(season, occasion)}
              className="rounded-xl shadow-md shadow-indigo-200"
            >
              <RefreshCw data-icon="inline-start" /> Reshuffle options
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {suggestions === null ? null : suggestions.length > 0 ? (
          <motion.div
            key={`gen-${generation}`}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {suggestions.map((s) => (
              <motion.div
                key={s.id}
                variants={{
                  hidden: { opacity: 0, y: 26, scale: 0.97 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <SuggestionCard
                  suggestion={s}
                  onSave={handleSave}
                  onShop={setShopItem}
                  saved={savedIds.includes(s.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${generation}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="glass rounded-3xl py-14 text-center"
          >
            <Wand2 className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-3 font-semibold">
              Not enough {SEASON_META[season].label.toLowerCase()} pieces to style
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a few more items to your wardrobe for this season.
            </p>
            <Button asChild variant="secondary" className="mt-4 bg-white/70">
              <Link href="/wardrobe">Go to wardrobe</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {outfits.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground/60">
            Saved outfits
          </h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerParent}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {outfits.map((o) => {
                const resolved = o.itemIds
                  .map((id) => items.find((i) => i.id === id))
                  .filter((i): i is Item => !!i);
                return (
                  <motion.div
                    key={o.id}
                    variants={fadeUp}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="glass rounded-3xl p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-semibold">{o.title}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="bg-white/70 capitalize">
                          {o.occasion}
                        </Badge>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          title="Delete outfit"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteOutfit(o.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {resolved.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl bg-white/55 p-2"
                        >
                          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                            <ItemImage item={item} compact className="h-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {CATEGORY_LABEL[item.category]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      <ShopDialog
        item={shopItem}
        open={!!shopItem}
        onOpenChange={(o) => !o && setShopItem(null)}
      />
    </div>
  );
}
