"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Shirt, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { ShopDialog } from "@/components/shop-dialog";
import { TrendRail } from "@/components/trend-rail";
import { archetypeFor } from "@/lib/mbti";
import { useStore } from "@/lib/store";
import type { Item, Season } from "@/lib/types";
import { currentSeason, SEASON_META } from "@/lib/types";

export default function HomePage() {
  const { ready, profile, items, outfits } = useStore();
  const [shopItem, setShopItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);

  if (!ready) {
    return (
      <div className="mt-24 text-center text-sm text-muted-foreground">
        Chilling the racks…
      </div>
    );
  }

  const season: Season =
    profile && profile.season !== "auto" ? profile.season : currentSeason();
  const arch = profile ? archetypeFor(profile.mbti) : null;
  const meta = SEASON_META[season];
  const highlights = items
    .filter((i) => (i.pinned || i.trending) && i.seasons.includes(season))
    .slice(0, 8);

  return (
    <div className="space-y-10">
      <section className="pt-10 text-center sm:pt-16">
        <Badge variant="secondary" className="mb-4 bg-white/70 px-3">
          {meta.emoji} {meta.label} · {meta.blurb}
        </Badge>
        <h1 className="font-display mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Dress like the <em className="ice-text not-italic">best version</em> of
          you.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {profile
            ? `Hi ${profile.name || "there"} — your board is tuned to ${
                arch ? arch.archetype.toLowerCase() : "your style"
              }${profile.city ? ` in ${profile.city}` : ""}.`
            : "A wardrobe that knows your personality, your palette, your season, and your city."}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild className="rounded-xl px-5 shadow-lg shadow-indigo-200">
            <Link href="/outfits">
              <Wand2 data-icon="inline-start" /> Dress me today
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-xl bg-white/60 px-5">
            <Link href="/wardrobe">
              <Shirt data-icon="inline-start" /> Browse wardrobe
            </Link>
          </Button>
        </div>
      </section>

      {!profile && (
        <section className="glass-strong flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:flex-row sm:text-left">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-400 text-white shadow-md">
            <Sparkles className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Create your Style DNA first</p>
            <p className="text-sm text-muted-foreground">
              Age, MBTI, colors, and city — two minutes, and every suggestion
              becomes yours.
            </p>
          </div>
          <Button asChild variant="secondary" className="bg-white/80">
            <Link href="/profile">
              Set it up <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </section>
      )}

      <section className="grid grid-cols-3 gap-3">
        {[
          { n: items.length, label: "pieces on your board" },
          { n: outfits.length, label: "outfits saved" },
          { n: items.filter((i) => i.trending).length, label: "2026 trend pieces" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-3xl font-bold ice-text">{s.n}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <TrendRail />

      {highlights.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
              {meta.emoji} On your radar this {meta.label.toLowerCase()}
            </h2>
            <Link
              href="/wardrobe"
              className="text-sm font-medium text-primary hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {highlights.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={setEditItem}
                onShop={setShopItem}
              />
            ))}
          </div>
        </section>
      )}

      <ShopDialog
        item={shopItem}
        open={!!shopItem}
        onOpenChange={(o) => !o && setShopItem(null)}
      />
      <ItemFormDialog
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        editing={editItem}
      />
    </div>
  );
}
