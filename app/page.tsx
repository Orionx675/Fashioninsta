"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarRange,
  Fingerprint,
  Flower2,
  Leaf,
  MapPin,
  ShieldCheck,
  Shuffle,
  Snowflake,
  Sun,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { ItemImage } from "@/components/item-image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { ShopDialog } from "@/components/shop-dialog";
import { CATALOG, TRENDS_2026 } from "@/lib/catalog";
import { ARCHETYPES, archetypeFor } from "@/lib/mbti";
import { useStore } from "@/lib/store";
import type { Item, Season } from "@/lib/types";
import { COLOR_HEX, currentSeason, SEASON_META } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEASON_ICON: Record<Season, typeof Sun> = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const TREND_SWATCH: Record<string, string> = {
  "Cobalt Blue": COLOR_HEX["cobalt"],
  "Tomato Red": COLOR_HEX["tomato red"],
  "Butter Yellow": COLOR_HEX["butter yellow"],
  Chartreuse: COLOR_HEX["chartreuse"],
  "Deep Eggplant": COLOR_HEX["eggplant"],
  Marigold: COLOR_HEX["marigold"],
};

/** Hero collage uses catalog pieces with verified photography. */
const COLLAGE_IDS = ["c30", "c38", "c43"] as const;

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Styled to your personality",
    copy: "All 16 MBTI types map to a style archetype — take the two-minute quiz or pick your type, and every suggestion bends toward who you are.",
    big: true,
  },
  {
    icon: Shuffle,
    title: "Always 2–3 options",
    copy: "Never a single dictated look. Reshuffle until one feels right.",
  },
  {
    icon: CalendarRange,
    title: "Season-aware",
    copy: "Follows the calendar automatically, or locks to the season you choose.",
  },
  {
    icon: MapPin,
    title: "Shop it in your city",
    copy: "Every piece links to stores near you — plus Myntra, Ajio, Amazon, H&M, and Zara.",
  },
  {
    icon: TrendingUp,
    title: "2026 trends baked in",
    copy: "Cobalt, tomato red, butter yellow, raffia, capris — flagged right on the board.",
  },
  {
    icon: ShieldCheck,
    title: "Yours, forever",
    copy: "Edit anything, pin favorites, and back up your whole wardrobe to a single file.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Build your Style DNA",
    copy: "Age, personality, palette, city — two minutes, once.",
  },
  {
    n: "02",
    title: "Curate your board",
    copy: "Start from 60+ tagged pieces or pin your own finds.",
  },
  {
    n: "03",
    title: "Get dressed",
    copy: "Three looks for today. Pick one, shop the gaps, walk out.",
  },
];

const SHOWCASE_TYPES = ["INFP", "ENTJ", "ENFP", "INTJ", "ISFP", "ESFP"];

function delay(ms: number): React.CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as React.CSSProperties;
}

export default function HomePage() {
  const { ready, profile, items } = useStore();
  const [shopItem, setShopItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const season: Season =
    ready && profile && profile.season !== "auto"
      ? profile.season
      : currentSeason();
  const SeasonGlyph = SEASON_ICON[season];
  const meta = SEASON_META[season];
  const arch = ready && profile ? archetypeFor(profile.mbti) : null;
  const hasProfile = ready && !!profile;

  const collage = COLLAGE_IDS.map((id) => CATALOG.find((i) => i.id === id)).filter(
    (i): i is Item => !!i
  );
  const highlights = ready
    ? items
        .filter((i) => (i.pinned || i.trending) && i.seasons.includes(season))
        .slice(0, 8)
    : [];

  return (
    <div className="overflow-x-clip">
      {/* ---------- HERO ---------- */}
      <section className="relative pt-14 sm:pt-20 lg:pt-24">
        <p
          aria-hidden
          className="ghost-text font-display pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[clamp(8rem,28vw,22rem)] font-black leading-none tracking-tight"
        >
          ICY
        </p>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span
              className="reveal inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 backdrop-blur-sm"
              style={delay(0)}
            >
              <SeasonGlyph className="size-3.5 text-primary" />
              {meta.label} · {meta.blurb}
            </span>

            <h1
              className="reveal font-display mt-6 text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-tight text-foreground"
              style={delay(60)}
            >
              Wear the
              <br />
              <em className="ice-text">best version</em>
              <br />
              of you.
            </h1>

            <p
              className="reveal mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={delay(120)}
            >
              {hasProfile
                ? `Welcome back${profile!.name ? `, ${profile!.name}` : ""} — your board is tuned to ${
                    arch ? arch.archetype.toLowerCase() : "your style"
                  }${profile!.city ? ` in ${profile!.city}` : ""}.`
                : "One board that knows your personality, your palette, your season, and your city — and always gives you a choice."}
            </p>

            <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={delay(180)}>
              <Button
                size="lg"
                asChild
                className="h-11 rounded-xl px-6 text-base shadow-lg shadow-indigo-200"
              >
                <Link href={hasProfile ? "/outfits" : "/profile"}>
                  {hasProfile ? (
                    <>
                      <Wand2 data-icon="inline-start" /> Dress me today
                    </>
                  ) : (
                    <>
                      <Fingerprint data-icon="inline-start" /> Find your Style DNA
                    </>
                  )}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-11 rounded-xl bg-white/60 px-6 text-base"
              >
                <Link href="/wardrobe">
                  Explore the board <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Collage of real catalog pieces */}
          <div className="relative mx-auto h-[400px] w-full max-w-sm sm:h-[440px]" aria-hidden>
            {collage.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  "reveal glass-strong absolute w-40 overflow-hidden rounded-3xl shadow-xl sm:w-44",
                  i === 0 && "left-1/2 top-0 z-20 -translate-x-1/2 rotate-2",
                  i === 1 && "left-0 top-24 z-10 -rotate-6",
                  i === 2 && "right-0 top-40 z-30 rotate-6"
                )}
                style={delay(200 + i * 90)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <ItemImage item={item} compact className="h-full w-full object-cover" />
                </div>
                <p className="truncate px-3 py-2 text-xs font-semibold">{item.name}</p>
              </div>
            ))}
            <div
              className="reveal glass absolute bottom-2 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl px-4 py-2.5 shadow-lg"
              style={delay(500)}
            >
              <Shuffle className="size-4 text-primary" />
              <span className="text-xs font-bold">3 looks · your call</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TREND STRIP ---------- */}
      <section className="mt-20 sm:mt-28" aria-label="2026 trends">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/60">
            Trending · 2026
          </h2>
          <span className="text-xs text-muted-foreground">
            sourced from SS/FW ’26 runways
          </span>
        </div>
        <div className="mt-4 flex gap-x-8 gap-y-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {TRENDS_2026.map((t) => (
            <span
              key={t.name}
              title={t.note}
              className="font-display flex shrink-0 cursor-default items-center gap-2.5 whitespace-nowrap text-2xl font-semibold tracking-tight text-foreground/80 transition-colors duration-200 hover:text-foreground sm:text-3xl"
            >
              {TREND_SWATCH[t.name] && (
                <span
                  className="size-3.5 rounded-full border border-black/10"
                  style={{ background: TREND_SWATCH[t.name] }}
                />
              )}
              {t.name}
              <span className="text-muted-foreground/40">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ---------- BENTO FEATURES ---------- */}
      <section className="mt-20 sm:mt-28">
        <Reveal>
          <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            A stylist that actually
            <em className="ice-text not-italic"> knows you</em>.
          </h2>
        </Reveal>
        <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.1}>
          {FEATURES.map((f) => (
            <StaggerItem
              key={f.title}
              className={cn(
                "glass group rounded-3xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl",
                f.big && "sm:col-span-2 lg:row-span-1"
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-400 text-white shadow-md">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.copy}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="mt-20 sm:mt-28">
        <StaggerGroup className="grid gap-10 sm:grid-cols-3" amount={0.2}>
          {STEPS.map((s) => (
            <StaggerItem key={s.n} className="relative">
              <span
                aria-hidden
                className="ghost-text font-display block text-[clamp(4rem,9vw,7rem)] font-black leading-none"
              >
                {s.n}
              </span>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {s.copy}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ---------- ARCHETYPES ---------- */}
      <section className="mt-20 sm:mt-28">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            16 style personalities.
            <br />
            <span className="text-muted-foreground/70">One is unmistakably yours.</span>
          </h2>
          <Button variant="outline" asChild className="rounded-xl bg-white/60">
            <Link href="/profile">
              <Wand2 data-icon="inline-start" /> Find yours
            </Link>
          </Button>
        </div>
        <StaggerGroup
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
          amount={0.2}
        >
          {SHOWCASE_TYPES.map((code) => {
            const a = ARCHETYPES[code];
            return (
              <StaggerItem
                key={code}
                className="glass w-64 shrink-0 snap-start rounded-3xl p-5"
              >
                <p className="font-display text-2xl font-bold ice-text">{a.code}</p>
                <p className="mt-1 text-sm font-bold">{a.archetype}</p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {a.blurb}
                </p>
                <div className="mt-3 flex gap-1.5">
                  {a.palette.slice(0, 5).map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="size-4 rounded-full border border-black/10"
                      style={{ background: COLOR_HEX[c] ?? "#ccc" }}
                    />
                  ))}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      {/* ---------- PERSONALIZED RADAR ---------- */}
      {highlights.length > 0 && (
        <section className="mt-20 sm:mt-28">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-foreground/60">
              <SeasonGlyph className="size-4 text-primary" />
              On your radar this {meta.label.toLowerCase()}
            </h2>
            <Link
              href="/wardrobe"
              className="text-sm font-medium text-primary hover:underline"
            >
              See all <ArrowRight className="inline size-3.5" />
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

      {/* ---------- FINAL CTA ---------- */}
      <section className="mt-20 sm:mt-28">
        <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-200/50 via-transparent to-indigo-200/50"
          />
          <div className="relative">
            <SeasonGlyph className="mx-auto size-8 text-primary" />
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
              {meta.label} is here.
              <br />
              <em className="ice-text not-italic">Dress for it.</em>
            </h2>
            <Button
              size="lg"
              asChild
              className="mt-8 h-12 rounded-xl px-8 text-base shadow-lg shadow-indigo-200"
            >
              <Link href={hasProfile ? "/outfits" : "/profile"}>
                {hasProfile ? "Show me today’s looks" : "Start with your Style DNA"}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Free · no account · your data stays in your browser
            </p>
          </div>
        </div>
      </section>

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
