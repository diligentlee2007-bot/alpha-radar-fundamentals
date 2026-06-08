# SPEC — Alpha Radar Fundamentals

> Folder name is `kr-stock-dashboard` (legacy). The product is **Alpha Radar Fundamentals**,
> a premium **Korean equity research terminal**. (Earlier Media Studio idea is now a future-only
> roadmap card.)

## Purpose
A premium, portfolio-grade fintech **research terminal** for analysing Korean listed companies:
core financial ratios, three-year trends, sector-relative valuation, and a plain-language risk
summary. **OpenDART-ready** (live key seam) with a clearly-labeled deterministic **sample mode**.
**Education / portfolio only — not investment advice.** Persistent disclaimers throughout.

## Target users (portfolio audience)
Finance / securities / consulting reviewers evaluating whether the author can plan, build,
verify, and present a useful Korean equity research tool — combining finance thinking,
AI-assisted coding, automation, and honest data handling.

## Core value
Per company: 3-year financial statements (revenue / operating profit / net income), 12+ ratios
(ROE, ROA, margins, debt ratio, current ratio, EPS, BPS, PER, PBR, dividend yield, revenue
growth), valuation vs sector average, and mechanical risk flags.

## Surfaces
- `/` — fundamentals-positioned landing; the **dashboard is the hero/demo** (interactive
  featured-company card), then capabilities, how-it-works, case study, monetization, roadmap, CTA.
- `/fundamentals` — research terminal: indices strip + searchable/sortable company table
  (PER / PBR / ROE / market cap) + watchlist filter.
- `/fundamentals/[code]` — deep research page: header + price chart + financial summary +
  ratio grid + valuation + risk summary.
- `/market`, `/market/[code]` — redirect to the fundamentals equivalents.

## Bilingual (KO / EN)
KO default. Local TS dictionary + React context (no i18n packages), persisted to localStorage,
instant toggle in the navbar. Hero, dashboard labels, finance terms, case study, monetization,
roadmap, disclaimers, and section titles all translate.

## Prices (live, delayed)
Stock **prices and price history are real, ~15-min delayed** via Yahoo Finance's public chart
endpoint (no API key, no new package; built-in `fetch`, server-side, in-memory throttle, graceful
fallback to labeled sample on any failure). Shown with a "지연 시세 / Delayed" status chip + last-updated
time, auto-refreshing every 60s. **Financial statements/ratios remain sample** (OpenDART seam) and are
labeled as such; PER/PBR/market-cap are re-derived from the live price on trailing EPS/BPS.

## OpenDART-ready + safety
`lib/data/opendart.ts` reads `OPENDART_API_KEY`; absent → labeled sample fundamentals from
`lib/data/fundamentals.ts`. No network/paid API; key never hardcoded; `.env.example` documents it.
A data-source badge ("샘플 데이터 / Sample" vs "실데이터 · OpenDART") shows everywhere. No new
runtime packages; no payment processing; no real recommendations; no commit/push/deploy without approval.

## Design
Dark premium fintech: deep slate bg, single emerald accent, subtle gradients/glass, Inter +
Noto Sans KR, Phosphor icons (zero emoji), 8px grid, mobile-first, reduced-motion respected.

See PLAN.md for milestones + pass criteria.
