"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATALOG } from "./catalog";
import type { BackupFile, Item, Outfit, Profile } from "./types";

const KEY = "icy-store-v2";
const LEGACY_KEYS = ["icy-store-v1"];

interface Persisted {
  profile: Profile | null;
  items: Item[];
  outfits: Outfit[];
}

interface StoreValue extends Persisted {
  ready: boolean;
  setProfile: (p: Profile) => void;
  addItem: (i: Item) => void;
  updateItem: (i: Item) => void;
  deleteItem: (id: string) => void;
  togglePin: (id: string) => void;
  resetCatalog: () => void;
  saveOutfit: (o: Outfit) => void;
  deleteOutfit: (id: string) => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<string>;
}

const StoreContext = createContext<StoreValue | null>(null);

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      if (Array.isArray(parsed.items)) return parsed;
    }
    // Migrate from an older store version: keep the user's profile, outfits,
    // and own items, but refresh catalog entries (fixes stale image URLs).
    for (const legacyKey of LEGACY_KEYS) {
      const legacyRaw = localStorage.getItem(legacyKey);
      if (!legacyRaw) continue;
      const legacy = JSON.parse(legacyRaw) as Persisted;
      if (!Array.isArray(legacy.items)) continue;
      const migrated: Persisted = {
        profile: legacy.profile ?? null,
        items: [...legacy.items.filter((i) => i.source === "user"), ...CATALOG],
        outfits: Array.isArray(legacy.outfits) ? legacy.outfits : [],
      };
      localStorage.removeItem(legacyKey);
      return migrated;
    }
  } catch {
    // corrupted storage — fall through to fresh state
  }
  return { profile: null, items: [...CATALOG], outfits: [] };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>({ profile: null, items: [], outfits: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // localStorage is only readable after mount; this one-time hydration
    // from an external store is the intended exception to the rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const setProfile = useCallback((profile: Profile) => {
    setState((s) => ({ ...s, profile }));
  }, []);

  const addItem = useCallback((item: Item) => {
    setState((s) => ({ ...s, items: [item, ...s.items] }));
  }, []);

  const updateItem = useCallback((item: Item) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === item.id ? item : i)),
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      items: s.items.filter((i) => i.id !== id),
      outfits: s.outfits.filter((o) => !o.itemIds.includes(id)),
    }));
  }, []);

  const togglePin = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i)),
    }));
  }, []);

  const resetCatalog = useCallback(() => {
    setState((s) => ({
      ...s,
      items: [...s.items.filter((i) => i.source === "user"), ...CATALOG],
    }));
  }, []);

  const saveOutfit = useCallback((o: Outfit) => {
    setState((s) => ({ ...s, outfits: [o, ...s.outfits] }));
  }, []);

  const deleteOutfit = useCallback((id: string) => {
    setState((s) => ({ ...s, outfits: s.outfits.filter((o) => o.id !== id) }));
  }, []);

  const exportBackup = useCallback(() => {
    const backup: BackupFile = {
      app: "icy",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: state.profile,
      items: state.items,
      outfits: state.outfits,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importBackup = useCallback(async (file: File): Promise<string> => {
    const text = await file.text();
    const data = JSON.parse(text) as BackupFile;
    if (data.app !== "icy" || !Array.isArray(data.items)) {
      throw new Error("That file doesn't look like an Icy backup.");
    }
    setState({
      profile: data.profile ?? null,
      items: data.items,
      outfits: Array.isArray(data.outfits) ? data.outfits : [],
    });
    return `Restored ${data.items.length} items${data.profile ? " and your profile" : ""}.`;
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      ready,
      setProfile,
      addItem,
      updateItem,
      deleteItem,
      togglePin,
      resetCatalog,
      saveOutfit,
      deleteOutfit,
      exportBackup,
      importBackup,
    }),
    [state, ready, setProfile, addItem, updateItem, deleteItem, togglePin, resetCatalog, saveOutfit, deleteOutfit, exportBackup, importBackup]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
