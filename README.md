# Alpha Radar Fundamentals

**Live demo → https://alpha-radar-fundamentals.vercel.app**

A premium **Korean + US equity research terminal** with a daily content studio. Built as a
finance portfolio project to show end-to-end product thinking: real data, honest labeling,
clean design, and a path to monetization. **Educational only — not investment advice.**

> Bilingual (한국어 / English) · dark fintech UI · real OpenDART financials · live (delayed) prices.

---

## What it does

- **Equity research terminal** (`/fundamentals`) — browse the KOSPI/KOSDAQ universe with
  valuation & profitability columns (PER, PBR, ROE, market cap), search/sort, and a watchlist.
- **Per-company deep dive** (`/fundamentals/[code]`) — **real OpenDART financial statements**
  (3-year revenue / operating profit / net income), 12+ ratios (ROE, ROA, margins, debt &
  current ratio, EPS, BPS), sector-relative valuation, a plain-language risk summary, and a
  live price chart.
- **Global markets** (`/global`) — US / Nasdaq overview (NASDAQ, S&P 500, Dow, Russell 2000,
  USD/KRW) + a US watchlist (price-only; US fundamentals are a roadmap item).
- **Content studio** (`/studio`) — auto-generates a daily KR/US **market brief** + a 5–6 slide
  **Instagram carousel** (1080×1350 PNG export) + caption/hashtags, with **overnight US
  headlines** and the mascot **주식이**. Human-in-the-loop: review, then post yourself.

## Honesty / data sources

Every value is labeled by source:

- **Prices & indices** — real, **~15-min delayed** (Yahoo Finance public endpoints). Shown as
  "지연 시세 / Delayed".
- **Korean financials** — **real OpenDART** (전자공시) for mapped tickers → "OpenDART 재무".
  Financial holding companies and unmapped names fall back to clearly-labeled **sample** data.
- **Overnight news** — real US headlines with publisher + link (no fabricated per-stock reasons).
- A "not investment advice" disclaimer is shown throughout.

If `OPENDART_API_KEY` is not set, the app serves clearly-labeled deterministic **sample**
fundamentals so it always works.

## Tech stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Recharts ·
Biome · Bun · custom no-dependency i18n · OpenDART API · Yahoo Finance (delayed). No paid APIs.

## Run locally

```bash
bun install
cp .env.example .env.local      # optional: add OPENDART_API_KEY for real KR financials
bun --bun run dev               # http://localhost:3000
```

Checks: `bunx tsc --noEmit` · `bun run lint` (Biome) · `bun run build`.

## What this demonstrates

Finance reasoning (the ratios an analyst checks first) · AI-assisted product building · data
honesty (live vs sample, graceful fallback, disclaimers) · and a realistic content/monetization
plan. See [`PORTFOLIO.md`](./PORTFOLIO.md) for the résumé/interview write-up (KO/EN).

---

© 2026 Alpha Radar — educational portfolio demo. Not affiliated with any exchange or broker.
