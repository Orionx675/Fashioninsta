# ❄ Icy — Your Personal Outfit Curator

A Pinterest-style wardrobe organizer that knows your personality, palette, season, and city — then styles you.

## What it does

- **Personality-matched styling** — all 16 MBTI types map to a style archetype (tags + palette). Pick your type, or take the built-in 8-question style quiz.
- **Always 2–3 options** — "Dress me today" generates three named looks and explains *why* each was picked; reshuffle until one feels right. Never a single dictated outfit.
- **Age-appropriate + color-aware** — every piece carries an age range; your loved/avoided colors boost or exclude items in the suggestion engine.
- **Seasonal** — items are season-tagged; the app follows the calendar automatically or locks to a season you choose.
- **2026 trends built in** — cobalt, tomato red, butter yellow, chartreuse, eggplant, marigold, capris, raffia, jelly sandals, eyelet/crochet, and sheer layering.
- **Location-based shopping** — set your city once; every item links to Google Maps stores near you plus Myntra, Ajio, Amazon, H&M, and Zara.
- **Edit + backup** — edit/delete/pin any piece; export & import your whole wardrobe as JSON; reset the starter catalog without losing your own items.

## Tech

Next.js 16 (App Router, Turbopack) · Tailwind CSS v4 · shadcn/ui · TypeScript. All data is stored client-side in `localStorage` — no backend, no account.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Start on **Style DNA** to set up your profile, then head to **Outfits**.

## Structure

- `app/` — pages: home, `wardrobe`, `outfits`, `profile`
- `lib/` — `catalog` (starter items + trends), `mbti` (archetypes), `quiz`, `suggest` (styling engine), `shops` (shopping links), `store` (localStorage state), `types`
- `components/` — item cards, dialogs, navbar, trend rail
