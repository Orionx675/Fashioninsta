"use client";

import { TrendingUp } from "lucide-react";
import { TRENDS_2026 } from "@/lib/catalog";
import { COLOR_HEX } from "@/lib/types";

const TREND_SWATCH: Record<string, string> = {
  "Cobalt Blue": COLOR_HEX["cobalt"],
  "Tomato Red": COLOR_HEX["tomato red"],
  "Butter Yellow": COLOR_HEX["butter yellow"],
  Chartreuse: COLOR_HEX["chartreuse"],
  "Deep Eggplant": COLOR_HEX["eggplant"],
  Marigold: COLOR_HEX["marigold"],
};

export function TrendRail() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
          Trending for 2026
        </h2>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {TRENDS_2026.map((t) => (
          <div
            key={t.name}
            className="glass min-w-44 shrink-0 rounded-2xl p-3.5 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              {TREND_SWATCH[t.name] ? (
                <span
                  className="size-4 shrink-0 rounded-full border border-black/10 shadow-inner"
                  style={{ background: TREND_SWATCH[t.name] }}
                />
              ) : (
                <span className="text-sm">✦</span>
              )}
              <p className="text-sm font-bold leading-tight">{t.name}</p>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
              {t.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
