"use client";

import { ExternalLink, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { shopLinks } from "@/lib/shops";
import type { Item } from "@/lib/types";

export function ShopDialog({
  item,
  open,
  onOpenChange,
}: {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { profile } = useStore();
  if (!item) return null;
  const city = profile?.city ?? "";
  const links = shopLinks(item.name, city);
  const local = links.filter((l) => l.kind === "local");
  const online = links.filter((l) => l.kind === "online");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Shop “{item.name}”
          </DialogTitle>
          <DialogDescription>
            Search results open in a new tab — availability varies by store.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="size-4 text-primary" /> Near you
            </p>
            {local.length > 0 ? (
              local.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white"
                >
                  {l.label}
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              ))
            ) : (
              <p className="rounded-xl bg-white/50 px-3 py-2.5 text-sm text-muted-foreground">
                Set your city in{" "}
                <Link href="/profile" className="font-medium text-primary underline">
                  Style DNA
                </Link>{" "}
                to see stores near you.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <ShoppingBag className="size-4 text-primary" /> Online
            </p>
            <div className="grid grid-cols-2 gap-2">
              {online.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white"
                >
                  {l.label}
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
