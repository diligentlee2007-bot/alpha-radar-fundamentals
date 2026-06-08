# PROGRESS — Alpha Radar Fundamentals

Autonomous build log. (Project folder is still named `kr-stock-dashboard`.)

## ✅ OpenDART LIVE — verified (2026-06-08)
Key added to `.env.local` (gitignored) and dev server restarted. **Real financials confirmed live:**
- 005930 삼성전자, 000660 SK하이닉스, 005380 현대차, 000270 기아 → detail page shows **"OpenDART 재무"**
  with real 3-year statements (e.g. Samsung revenue ₩258.9T→300.9T→333.6T, FY2023–2025).
- Unmapped tickers (e.g. 035420 NAVER) correctly stay **"샘플 재무"** — per-company labeling accurate.
- Dev log clean (0 errors). Account parsing (IFRS id + KR name fallback, CFS→OFS) works on real data.

Note: the key was shared in chat; it can be re-issued at opendart.fss.or.kr if desired (read-only,
rate-limited data — low risk).

## Content Studio — daily brief + IG carousel (2026-06-08)
- New route **`/studio`** (+ nav "스튜디오/Studio"): auto-generates today's KR/US market brief and a
  **5-slide Instagram carousel** from live data (KR+US indices/FX + top movers). Outputs: brief text,
  caption + hashtags (copy buttons), **per-slide PNG download (Canvas, 1080×1350, no package)**, and
  **Save-as-PDF** (print CSS). Human-in-the-loop — no auto-publishing. Bilingual KO/EN.
- Deployed live + GitHub pushed. Verified: `/studio` 200 on the public URL, nav shows Studio.
- Note: custom alias `alpha-radar-fundamentals.vercel.app` is re-pointed manually after each `vercel --prod`
  (the auto production domain `kr-stock-dashboard-pi.vercel.app` always tracks latest).

## Global fix + domain + GitHub (2026-06-08)
- **Global US bug fixed:** US index/FX strip had no fallback (KR did), so it rendered blank until the
  client poll resolved. Added `US_INDEX_FALLBACK` (labeled sample) + passed to `LiveIndexBar`. Now US
  cards (NASDAQ/S&P/Dow/Russell/USD-KRW) render instantly then update to live. API was already live.
- **GitHub (public):** https://github.com/diligentlee2007-bot/alpha-radar-fundamentals (committed + pushed;
  `.env.local`/`.vercel` gitignored — no secrets).
- **Pretty public URL:** renamed Vercel project → **https://alpha-radar-fundamentals.vercel.app**.
  Disabled Vercel Deployment Protection (ssoProtection=null via API) so the portfolio URL is public.
  Verified: all routes 200, Samsung "OpenDART 재무" live, US cards render.

## Steps 1–3 (2026-06-08, autonomous)
- **#1 Expanded live coverage:** downloaded OpenDART's official corpCode master (zip → CORPCODE.xml),
  matched **all 42 seed tickers** to authoritative corp_codes, wrote them into `dart-corp-codes.ts`
  (no guesses). Verified: NAVER, 에코프로비엠, 고려아연, LG전자, 엔씨소프트 등 → real "OpenDART 재무".
  Financial holding companies (KB금융 등) **safely fall back to sample** (banks report 영업수익/이자수익,
  not standard 매출액/영업이익 IFRS tags) — labeled honestly. ~37/42 live, rest sample.
- **#2 Deploy — DONE (user logged in, approved):** linked `sangyoon-s-projects/kr-stock-dashboard`,
  set `OPENDART_API_KEY` as Vercel env (production + development; piped from .env.local, never printed),
  deployed to production. **Live: https://kr-stock-dashboard-pi.vercel.app** (READY).
  Verified live: all routes 200, `/fundamentals/005930` shows real "OpenDART 재무" in production.
  Note: add the env var to the "preview" environment too if PR previews are wanted.
- **#3 Portfolio docs:** `PORTFOLIO.md` (KO/EN) — summary, features, stack, résumé bullets, interview
  story, honesty notes. Live-URL placeholder to fill after deploy.
- Verify: tsc/lint/build pass; dev log clean.

### What was implemented
- `lib/data/opendart.ts`: real `fnlttSinglAcntAll` client — `fetchDartFinancials(code)` fetches up to
  3 annual reports (11011), **CFS→OFS fallback**, parses accounts by IFRS `account_id` with Korean
  account-name fallback (매출액/영업이익/당기순이익/자산·자본·부채총계/유동자산·유동부채), tolerant of
  missing years (needs ≥2). 10s timeout, graceful null on any failure.
- `lib/data/dart-corp-codes.ts`: verified corp_code map — 005930(00126380) 삼성전자, 000660(00164779)
  SK하이닉스, 005380(00164742) 현대차, 000270(00106641) 기아. **Unmapped tickers fall back to sample**
  (never wrong data). Full map needs OpenDART corpCode.xml master (zip) — deferred (would need a dep).
- `lib/data/fundamentals.ts`: `getCompanyFundamentals(code)` → tries OpenDART, builds real ROE/ROA/
  margins/debt/current/EPS/BPS/growth + sector-relative valuation + risk flags; falls back to sample.
  Returns per-company `source`. PER/PBR/마켓캡 stay live via `withLivePrice` (live price ÷ trailing EPS/BPS).
- Detail page is now async and uses `getCompanyFundamentals`; **per-company labeling** — real → "OpenDART
  재무", sample → "샘플 재무". Terminal lists sample fundamentals (re-priced live), labeled sample;
  open a company for real OpenDART data (mapped tickers, key required).
- Endpoint reachability verified (no key): returns `{"status":"010"}` for our exact corp_code/params —
  confirms URL/params are correct; `"000"` = success once a valid key is added.

### Verification (key-free)
- `bunx tsc --noEmit` pass · `bun run lint` pass · `bun run build` pass (no warnings).
- Routes 200 (`/`, `/fundamentals`, `/fundamentals/005930`, `/global`); detail shows "샘플 재무" with no key.
- Live OpenDART fetch (real numbers + ratio calc) cannot be runtime-verified here — **no key**. After you
  add the key + restart, open `/fundamentals/005930` to confirm "OpenDART 재무" and real ROE/PER/PBR.

## Identity
**Alpha Radar Fundamentals** — a premium dark-mode Korean equity research terminal:
core financial ratios, 3-year trends, sector-relative valuation, and a plain-language risk
summary per listed company. OpenDART-ready with a labeled sample fallback. Bilingual KO/EN.
Education/portfolio only — not investment advice.

## Pivots
1. Empty spec → started a KR stock (price) dashboard.
2. → **Alpha Radar Media Studio** (AI finance content product).
3. → **Alpha Radar Fundamentals** (current). Fundamentals dashboard is now the main hero/demo;
   Media Studio + Shorts pipeline demoted to **future roadmap** cards only.

## Key decisions (current)
- KO/EN toggle via local dictionary + React context (no i18n packages). KO default, localStorage.
- OpenDART-ready data layer reads `OPENDART_API_KEY`; absent → deterministic SAMPLE fundamentals,
  clearly labeled with a data-source badge. No network calls, no paid API, key never hardcoded.
- Routes: `/` (landing), `/fundamentals` (terminal), `/fundamentals/[code]` (deep research).
  Old `/market` routes redirect to the fundamentals equivalents.
- Removed superseded scaffolding (Media Studio components, sample content, price-only movers/
  sector/stock-table) to keep the codebase clean. No new runtime packages.

## Live (delayed) prices — added (user-approved external service)
- Prices are now **real, ~15-min-delayed** from Yahoo Finance's public chart endpoint
  (no API key, no new package — built-in `fetch`). Fundamentals (statements/EPS/BPS) remain
  labeled sample (OpenDART seam).
- `lib/data/live-quotes.ts`: `getLiveQuotes(codes)` (spot) + `getLiveSeries(code, period)` (history),
  in-memory TTL cache, per-symbol try/catch → graceful fallback to deterministic sample.
- `app/api/quotes/route.ts` (spot, all/filtered codes) + `app/api/stocks/[code]` now serves live history.
- `lib/hooks/use-live-quotes.ts`: client polls every 60s; `components/fundamentals/quote-status.tsx`
  shows "지연 시세 · 갱신 HH:MM" (delayed) or "샘플 시세" (fallback).
- Live prices flow into: home demo, terminal table (PER/PBR/market-cap re-derived from live price via
  `withLivePrice`), and the company detail header + chart. KR convention preserved.

## Index/FX accuracy fix (2026-06-08)
- **Diagnosis:** index + FX cards came from `marketIndices()` in `lib/data/series.ts`, which returned
  **hardcoded sample levels** (KOSPI 2734.36, KOSDAQ 845.12, KOSPI200 367.84, USD/KRW 1368.5). The
  live integration only covered individual stocks, so indices/FX never updated → showed stale wrong values.
- **Fix:** added live indices via Yahoo (`^KS11`, `^KQ11`, `^KS200`, `KRW=X`) →
  `getLiveIndices(fallback)` in `live-quotes.ts`, `app/api/indices/route.ts`,
  `lib/hooks/use-live-indices.ts`, `components/market/live-index-bar.tsx`. Per-card fallback to sample
  (tagged) if a symbol fails; whole-strip status chip ("지연 시세"/sample).
  - Verified live: KOSPI 7,484 (−8.29%), KOSDAQ 911 (−9.08%), KOSPI200 1,187 (−8.52%), USD/KRW 1,531.
  - **Daily-change bug caught & fixed:** initially used range=1mo, whose `chartPreviousClose` is the
    month-start close → wrong % (e.g. KOSDAQ −24%). Switched indices to `range=1d&interval=5m` (correct
    yesterday close + intraday sparkline), matching how stock quotes compute daily change.
- **Honest labeling fixed:** fundamentals badge relabeled "샘플 재무 / Sample financials" (it's only about
  statements); prices show "지연 시세"; indices have their own live/sample status + per-card "샘플" tag.
  No more blanket "샘플 데이터" while live data is present. Removed dead `MarketOverviewBar`.
- **Ratios (part 3):** PER = live price ÷ trailing EPS, PBR = live price ÷ trailing BPS, market cap =
  live price × shares (consistent on terminal + detail + demo via `withLivePrice`); ROE stays from
  financials (price-independent). Verified spot price == chart last close (Samsung 295,500).

## Global / US layer + platform repositioning (2026-06-08)
- **New route `/global`** (US/Nasdaq overview): live index cards NASDAQ(^IXIC)/S&P500(^GSPC)/
  Dow(^DJI)/Russell2000(^RUT)/USD-KRW + US watchlist demo table (AAPL, MSFT, NVDA, AMZN, GOOGL,
  META, TSLA, SPY, QQQ). **Price-only** — US fundamentals intentionally omitted and labeled
  "가격만 · 펀더멘털 추후 / Price-only · fundamentals coming later". No fake US fundamentals.
- Live layer generalized: `fetchSymbol(symbol)` (raw Yahoo symbol) → `getLiveQuotes` (KR codes) +
  `getSymbolQuotes` (US tickers, allowlisted); `getUsIndices()` + `getLiveIndices()`. New routes:
  `/api/indices?region=us`, `/api/quotes?symbols=`. Hooks: `useLiveIndices(region)`, `useUsQuotes`.
  Components: `LiveIndexBar` (region-aware), `UsMarketTable`, `GlobalContent`. Nav adds 글로벌/Global.
- **New home sections (bilingual):**
  - `Ecosystem` — "how this fits with the original Alpha Radar" as ONE ecosystem (monitoring layer
    vs research layer), not a criticism.
  - `Monetization` — expanded to 8 realistic future paths (free demo, paid PDF, template subs,
    newsletter, creator tool, IG carousel, YT Shorts package, B2B dashboards). Future, not current revenue.
  - `ContentPipeline` (#pipeline) — roadmap cards A–D (IG daily card / 45s Shorts / 2–3min briefing /
    10min YouTube), human-in-the-loop banner, and a "future publisher" note (IG Graph API / YouTube
    upload / newsletter email) — **structure & roadmap only; no integrations, tokens, or auto-posting.**
- Verified live: US NASDAQ 25,709 (−4.18%), AAPL $307, NVDA $205; KR core unchanged (KOSPI 7,484).

## Verification (latest)
- `bunx tsc --noEmit` — pass · `bun run lint` (Biome) — pass · `bun run build` — pass (no warnings)
- Routes 200: `/`, `/fundamentals`, `/fundamentals/005930`, `/global`; `/market*` 307 redirects.
- Live APIs: `/api/indices` (kr+us), `/api/quotes` (codes+symbols), `/api/stocks/[code]`. Dev log clean.

## Awaiting approval
- git commit / push / deploy (NOT performed). One local commit exists from the first stack.
- Optional: official real-time feed (KIS) or live OpenDART fundamentals — both need a key (documented seams).
