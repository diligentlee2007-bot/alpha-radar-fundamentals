# PLAN — Alpha Radar Fundamentals

## Tech stack (reused, no new runtime deps)
Bun + Next 16.2 (App Router) + TS strict + Tailwind v4 (@theme tokens) + Framer Motion
+ Phosphor icons + Biome. Recharts (already present) for the price chart. KO/EN via a local
dictionary + React context (no i18n package).

## Structure
```
app/
  layout.tsx                  # brand + bilingual metadata, Providers, fonts
  page.tsx                    # fundamentals landing (hero demo + sections)
  fundamentals/page.tsx       # research terminal (table + indices + watchlist filter)
  fundamentals/[code]/page.tsx# deep research (SSG): chart + ratios + valuation + risk
  market/*, market/[code]/*   # redirects → /fundamentals
  api/*, sitemap.ts, robots.ts
components/
  fundamentals/ (demo, table, view, financial-summary, ratio-grid, valuation-card,
                 risk-summary, data-source-badge, sample-notice, company-header, terminal-header)
  sections/     (hero, capabilities, how-it-works, case-study, monetization, roadmap, final-cta, section-shell)
  layout/ (navbar, footer, language-toggle, section)   market/ (index-card, overview-bar)
  stocks/ (price-chart, sparkline, watch-button)        ui/ (button, card, badge, change)   motion/ (reveal)
lib/
  i18n/ (dict.ts, context.tsx)   data/ (fundamentals.ts, opendart.ts, series.ts, stocks.ts)
  store/watchlist.ts   format.ts   utils.ts   types.ts
```

## Pass criteria — "done" checklist
- [x] Korean equity fundamentals is the main product; dashboard is the hero/demo
- [x] Per-company: 3-yr financials, 12+ ratios, valuation vs sector, risk summary
- [x] KO/EN toggle (KO default, persisted), all major surfaces translated, natural finance terms
- [x] OpenDART-ready data layer + `.env.example`; sample mode clearly labeled (badge + notice)
- [x] Case study (Problem→Solution→Built→Learned→Next steps); monetization (5 directions, future)
- [x] Roadmap with future-only cards incl. 45-sec Korean Shorts script + vertical storyboard
- [x] Watchlist: star from terminal/detail + "watchlist only" filter (localStorage)
- [x] Dark premium fintech design, single accent, zero emoji, mobile-first, reduced-motion
- [x] Persistent disclaimer; honest, portfolio-safe tone
- [x] `bunx tsc --noEmit` / `bun run lint` (Biome) / `bun run build` pass
- [x] Runtime smoke: routes 200; `/market*` redirects; KO default + EN toggle
- [ ] Manual visual QA by user
- [ ] Commit / push / deploy — awaiting approval (none performed)
