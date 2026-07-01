"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/components/item-image";
import { useStore } from "@/lib/store";
import type { Category, Item, Occasion, Season, StyleTag } from "@/lib/types";
import {
  CATEGORIES,
  COLOR_HEX,
  COLOR_NAMES,
  OCCASIONS,
  SEASONS,
  SEASON_META,
  STYLE_TAGS,
} from "@/lib/types";
import { cn } from "@/lib/utils";

function Pill({
  active,
  onClick,
  children,
  swatch,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-white/60 text-foreground/70 hover:bg-white"
      )}
    >
      {swatch && (
        <span
          className="size-3 rounded-full border border-black/10"
          style={{ background: swatch }}
        />
      )}
      {children}
    </button>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ItemForm({
  editing,
  onDone,
}: {
  editing: Item | null;
  onDone: () => void;
}) {
  const { addItem, updateItem } = useStore();
  const [form, setForm] = useState(() =>
    editing
      ? {
          name: editing.name,
          category: editing.category,
          image: editing.image ?? "",
          seasons: editing.seasons,
          colors: editing.colors,
          styleTags: editing.styleTags,
          occasions: editing.occasions,
          ageMin: editing.ageMin,
          ageMax: editing.ageMax,
        }
      : {
          name: "",
          category: "top" as Category,
          image: "",
          seasons: [] as Season[],
          colors: [] as string[],
          styleTags: [] as StyleTag[],
          occasions: [] as Occasion[],
          ageMin: 13,
          ageMax: 80,
        }
  );
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function save() {
    if (!form.name.trim()) return setError("Give the piece a name.");
    if (form.seasons.length === 0) return setError("Pick at least one season.");
    if (form.colors.length === 0) return setError("Pick at least one color.");
    const item: Item = {
      id: editing?.id ?? `u-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      seasons: form.seasons,
      colors: form.colors,
      styleTags: form.styleTags,
      occasions: form.occasions.length ? form.occasions : ["casual"],
      ageMin: Math.min(form.ageMin, form.ageMax),
      ageMax: Math.max(form.ageMin, form.ageMax),
      image: form.image.trim() || undefined,
      trending: editing?.trending,
      pinned: editing?.pinned,
      source: editing?.source ?? "user",
    };
    if (editing) updateItem(item);
    else addItem(item);
    onDone();
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              placeholder="e.g. Powder blue cardigan"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v as Category)}
            >
              <SelectTrigger className="w-36 bg-white/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_EMOJI[c]} {CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-image">Image URL (optional)</Label>
          <Input
            id="item-image"
            placeholder="https://…"
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Seasons</Label>
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map((s) => (
              <Pill
                key={s}
                active={form.seasons.includes(s)}
                onClick={() => set("seasons", toggle(form.seasons, s))}
              >
                {SEASON_META[s].emoji} {SEASON_META[s].label}
              </Pill>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Colors</Label>
          <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
            {COLOR_NAMES.map((c) => (
              <Pill
                key={c}
                swatch={COLOR_HEX[c]}
                active={form.colors.includes(c)}
                onClick={() => set("colors", toggle(form.colors, c))}
              >
                {c}
              </Pill>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Style</Label>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_TAGS.map((t) => (
              <Pill
                key={t}
                active={form.styleTags.includes(t)}
                onClick={() => set("styleTags", toggle(form.styleTags, t))}
              >
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Occasions</Label>
          <div className="flex flex-wrap gap-1.5">
            {OCCASIONS.map((o) => (
              <Pill
                key={o}
                active={form.occasions.includes(o)}
                onClick={() => set("occasions", toggle(form.occasions, o))}
              >
                {o}
              </Pill>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="age-min">Age from</Label>
            <Input
              id="age-min"
              type="number"
              min={5}
              max={100}
              value={form.ageMin}
              onChange={(e) => set("ageMin", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age-max">Age to</Label>
            <Input
              id="age-max"
              type="number"
              min={5}
              max={100}
              value={form.ageMax}
              onChange={(e) => set("ageMax", Number(e.target.value))}
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={save}>{editing ? "Save changes" : "Add to wardrobe"}</Button>
      </DialogFooter>
    </>
  );
}

export function ItemFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Item | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editing ? "Edit piece" : "Add a piece"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Tune the details — suggestions update instantly."
              : "Paste an image link from anywhere (Pinterest, a store page) or leave it blank for a color card."}
          </DialogDescription>
        </DialogHeader>
        {open && (
          <ItemForm
            key={editing?.id ?? "new"}
            editing={editing}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
