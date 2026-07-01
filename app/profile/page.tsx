"use client";

import { useRef, useState } from "react";
import {
  Check,
  Download,
  MapPin,
  RotateCcw,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizDialog } from "@/components/quiz-dialog";
import { archetypeFor, MBTI_TYPES } from "@/lib/mbti";
import { useStore } from "@/lib/store";
import type { Profile, Season } from "@/lib/types";
import { COLOR_HEX, COLOR_NAMES, SEASONS, SEASON_META } from "@/lib/types";
import { cn } from "@/lib/utils";

const DEFAULTS: Profile = {
  name: "",
  age: 20,
  mbti: "",
  favoriteColors: [],
  avoidColors: [],
  city: "",
  season: "auto",
};

function ColorGrid({
  selected,
  excluded,
  onToggle,
}: {
  selected: string[];
  excluded: string[];
  onToggle: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_NAMES.map((c) => {
        const active = selected.includes(c);
        const disabled = excluded.includes(c);
        return (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(c)}
            title={disabled ? `${c} is in your other list` : c}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-white/70 bg-white/55 text-foreground/70 hover:bg-white",
              disabled && "opacity-30"
            )}
          >
            <span
              className="size-3 rounded-full border border-black/10"
              style={{ background: COLOR_HEX[c] }}
            />
            {c}
          </button>
        );
      })}
    </div>
  );
}

function ProfileEditor({ initial }: { initial: Profile }) {
  const { setProfile, exportBackup, importBackup, resetCatalog } = useStore();
  const [form, setForm] = useState<Profile>(initial);
  const [savedFlash, setSavedFlash] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const arch = archetypeFor(form.mbti);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleColor = (list: "favoriteColors" | "avoidColors", c: string) =>
    setForm((f) => ({
      ...f,
      [list]: f[list].includes(c)
        ? f[list].filter((x) => x !== c)
        : [...f[list], c],
    }));

  function save() {
    setProfile({ ...form, age: Math.max(5, Math.min(100, form.age || 20)) });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  async function handleImport(file: File) {
    try {
      const msg = await importBackup(file);
      setImportMsg(`✓ ${msg}`);
    } catch (e) {
      setImportMsg(`✗ ${e instanceof Error ? e.message : "Import failed."}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="pt-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Style DNA
        </h1>
        <p className="text-sm text-muted-foreground">
          Everything the stylist knows about you — stored only in this browser.
        </p>
      </div>

      <section className="glass space-y-5 rounded-3xl p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              placeholder="What should we call you?"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-age">Age</Label>
            <Input
              id="p-age"
              type="number"
              min={5}
              max={100}
              value={form.age}
              onChange={(e) => set("age", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-city">
            <MapPin className="mr-1 inline size-3.5" />
            City <span className="font-normal text-muted-foreground">(for local shopping)</span>
          </Label>
          <Input
            id="p-city"
            placeholder="e.g. Mumbai, Jamshedpur, Delhi…"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Personality (MBTI)</Label>
          <div className="flex gap-2">
            <Select value={form.mbti} onValueChange={(v) => set("mbti", v)}>
              <SelectTrigger className="flex-1 bg-white/70">
                <SelectValue placeholder="Pick your type…" />
              </SelectTrigger>
              <SelectContent>
                {MBTI_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t} — {archetypeFor(t)?.archetype}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" className="bg-white/70" onClick={() => setQuizOpen(true)}>
              <Wand2 data-icon="inline-start" /> Take the quiz
            </Button>
          </div>
          {arch && (
            <div className="mt-2 rounded-2xl bg-gradient-to-br from-sky-100/70 to-indigo-100/70 p-4">
              <p className="flex items-center gap-1.5 text-sm font-bold">
                <Sparkles className="size-4 text-indigo-400" />
                {arch.archetype}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{arch.blurb}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Your palette:</span>
                {arch.palette.map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="size-4 rounded-full border border-black/10"
                    style={{ background: COLOR_HEX[c] }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Colors you love</Label>
          <ColorGrid
            selected={form.favoriteColors}
            excluded={form.avoidColors}
            onToggle={(c) => toggleColor("favoriteColors", c)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Colors you avoid</Label>
          <ColorGrid
            selected={form.avoidColors}
            excluded={form.favoriteColors}
            onToggle={(c) => toggleColor("avoidColors", c)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Season mode</Label>
          <Select
            value={form.season}
            onValueChange={(v) => set("season", v as Season | "auto")}
          >
            <SelectTrigger className="w-56 bg-white/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">🪄 Auto (follow the calendar)</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SEASON_META[s].emoji} Always {SEASON_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={save} size="lg" className="w-full rounded-xl shadow-md shadow-indigo-200">
          {savedFlash ? (
            <>
              <Check data-icon="inline-start" /> Saved!
            </>
          ) : (
            "Save my Style DNA"
          )}
        </Button>
      </section>

      <section className="glass space-y-3 rounded-3xl p-5">
        <h2 className="font-display text-lg font-semibold">Backup & restore</h2>
        <p className="text-sm text-muted-foreground">
          Your wardrobe lives in this browser. Export a backup file to keep it
          safe or move it to another device.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="bg-white/70" onClick={exportBackup}>
            <Download data-icon="inline-start" /> Export backup
          </Button>
          <Button
            variant="secondary"
            className="bg-white/70"
            onClick={() => fileRef.current?.click()}
          >
            <Upload data-icon="inline-start" /> Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          {confirmReset ? (
            <Button
              variant="destructive"
              onBlur={() => setConfirmReset(false)}
              onClick={() => {
                resetCatalog();
                setConfirmReset(false);
                setImportMsg("✓ Starter catalog restored (your own pieces kept).");
              }}
            >
              Really restore catalog?
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw data-icon="inline-start" /> Reset starter catalog
            </Button>
          )}
        </div>
        {importMsg && <p className="text-sm font-medium">{importMsg}</p>}
      </section>

      <QuizDialog
        open={quizOpen}
        onOpenChange={setQuizOpen}
        onResult={(mbti) => set("mbti", mbti)}
      />
    </div>
  );
}

export default function ProfilePage() {
  const { ready, profile } = useStore();

  if (!ready) {
    return (
      <div className="mt-24 text-center text-sm text-muted-foreground">
        Reading your Style DNA…
      </div>
    );
  }

  // Keyed mount: the editor initializes its form state once from the
  // hydrated profile, so no state-syncing effect is needed.
  return (
    <ProfileEditor key={profile ? "profile" : "empty"} initial={profile ?? DEFAULTS} />
  );
}
