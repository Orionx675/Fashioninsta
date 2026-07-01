"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, ItemImage } from "@/components/item-image";
import { SuggestionCard } from "@/components/outfit-card";
import { ShopDialog } from "@/components/shop-dialog";
import { useStore } from "@/lib/store";
import type { Suggestion } from "@/lib/suggest";
import { suggestOutfits } from "@/lib/suggest";
import type { Item, Occasion, Outfit, Season } from "@/lib/types";
import { currentSeason, OCCASIONS, SEASONS, SEASON_META } from "@/lib/types";
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
        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-white/70 bg-white/55 text-foreground/70 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

export default function OutfitsPage() {
  const { ready, profile, items, outfits, saveOutfit, deleteOutfit } = useStore();
  const [seasonPick, setSeasonPick] = useState<Season | null>(null);
  const [occasion, setOccasion] = useState<Occasion>("casual");
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
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
      <div className="glass-strong mx-auto mt-20 max-w-md rounded-3xl p-8 text-center">
        <p className="text-4xl">❄️</p>
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
      </div>
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
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Dress me today
        </h1>
        <p className="text-sm text-muted-foreground">
          Always 2–3 options — never a dictated look. Reshuffle until one feels
          right.
        </p>
      </div>

      <div className="glass space-y-3 rounded-3xl p-4">
        <div className="flex flex-wrap gap-1.5">
          {SEASONS.map((s) => (
            <Chip
              key={s}
              active={season === s}
              onClick={() => {
                setSeasonPick(s);
                generate(s, occasion);
              }}
            >
              {SEASON_META[s].emoji} {SEASON_META[s].label}
            </Chip>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" />
          {OCCASIONS.map((o) => (
            <Chip
              key={o}
              active={occasion === o}
              onClick={() => {
                setOccasion(o);
                generate(season, o);
              }}
            >
              {o}
            </Chip>
          ))}
        </div>
        <Button
          onClick={() => generate(season, occasion)}
          className="rounded-xl shadow-md shadow-indigo-200"
        >
          <RefreshCw data-icon="inline-start" /> Reshuffle options
        </Button>
      </div>

      {suggestions === null ? null : suggestions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              onSave={handleSave}
              onShop={setShopItem}
              saved={savedIds.includes(s.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl py-14 text-center">
          <p className="text-4xl">🤍</p>
          <p className="mt-2 font-semibold">
            Not enough {SEASON_META[season].label.toLowerCase()} pieces to style
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a few more items to your wardrobe for this season.
          </p>
          <Button asChild variant="secondary" className="mt-4 bg-white/70">
            <Link href="/wardrobe">
              <Wand2 data-icon="inline-start" /> Go to wardrobe
            </Link>
          </Button>
        </div>
      )}

      {outfits.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-foreground/70">
            💾 Saved outfits
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {outfits.map((o) => {
              const resolved = o.itemIds
                .map((id) => items.find((i) => i.id === id))
                .filter((i): i is Item => !!i);
              return (
                <div key={o.id} className="glass rounded-3xl p-4">
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
                </div>
              );
            })}
          </div>
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
