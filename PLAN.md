# PLAN — KR Stock Dashboard

## (a) 핵심 기능 목록
- [ ] F1. 시장 개요 바 (KOSPI/KOSDAQ/KOSPI200/USD-KRW)
- [ ] F2. 마켓 무버스 (상승/하락/거래대금 상위)
- [ ] F3. 종목 리스트 테이블 (검색·정렬·스파크라인)
- [ ] F4. 개별 종목 상세 페이지 (가격차트 + 기간토글 + 지표)
- [ ] F5. 섹터 히트맵
- [ ] F6. 관심종목 워치리스트 (localStorage)
- [ ] F7. 반응형 + 접근성 + SEO

## (b) 페이지 / 컴포넌트 구조
```
app/
  layout.tsx              # Noto Sans KR, metadata, theme
  page.tsx                # 대시보드 홈 (F1, F2, F3, F5 요약)
  stocks/page.tsx         # 전체 종목 리스트 (F3 풀)
  stocks/[code]/page.tsx  # 개별 종목 상세 (F4)
  watchlist/page.tsx      # 관심종목 (F6)
  api/market/route.ts     # 지수/환율
  api/stocks/route.ts     # 종목 리스트
  api/stocks/[code]/route.ts # 종목 상세 + 시계열
  sitemap.ts, robots.ts
components/
  layout/   (navbar, footer, theme-provider)
  market/   (market-overview-bar, index-card)
  stocks/   (stock-table, sparkline, movers-panel, sector-heatmap, price-chart, period-toggle, watch-button)
  ui/       (shadcn: card, button, badge, table, tabs, input, skeleton, tooltip ...)
  motion/   (reveal, stagger wrappers)
lib/
  data/     (stocks.ts seed, series.ts deterministic generator, market.ts)
  format.ts (krw, percent, number formatters; tabular)
  store/    (watchlist localStorage hook)
  types.ts  (zod schemas + TS types)
```

## (c) 데이터 · 외부 API
- 외부 실 API 미사용(인증 필요). 결정론적 목 데이터로 대체, 인터페이스 추상화.
- 종목: 실제 코스피/코스닥 대형주 ~40개 (이름/코드/섹터/시총 현실값 근사).
- 시계열: 시드 기반 PRNG로 OHLC + 종가 생성(서버/클라 일관).
- 제공: Next Route Handlers (`/api/*`), zod로 응답 검증.

## (d) 디자인 방향
- 라이트 모드 기본. 단일 액센트(인디고/블루 계열) + 뉴트럴 슬레이트 스케일.
- 한국 관습 등락색: 상승=레드(#e03131 계열), 하락=블루(#1c7ed6 계열), 보합=뉴트럴.
- Noto Sans KR 가변, Phosphor 아이콘, 8px 그리드, tabular-nums 숫자.
- Framer Motion 스크롤 등장 + 호버 스프링, reduced-motion 가드.

## (e) 마일스톤 순서
1. **M0 셋업** — 스캐폴드, 토큰/폰트/아이콘, shadcn, Biome, git init ✅(진행중)
2. **M1 데이터 레이어** — types(zod), seed stocks, series generator, format utils
3. **M2 레이아웃** — navbar, footer, theme, globals 토큰, motion wrappers
4. **M3 API** — route handlers (market, stocks, stock detail)
5. **M4 대시보드 홈** — market overview bar, movers, table, sector heatmap
6. **M5 종목 상세** — price chart + period toggle + 지표 + watch button
7. **M6 워치리스트** — localStorage store + 페이지
8. **M7 SEO/마감** — metadata, JSON-LD, sitemap, robots, llms.txt, OG
9. **M8 검증** — biome, build, 반응형, 콘솔 에러 0, 합격기준 점검

## "완성"의 정의 — 합격 기준 체크리스트
- [ ] 모든 핵심 기능(F1–F7) 작동
- [ ] 모바일 반응형 (375 / 768 / 1280+)
- [ ] 브라우저 콘솔 에러 0
- [ ] `bun run build` 통과
- [ ] Biome lint/format 통과
- [ ] 디자인 일관성 (단일 액센트, 토큰, 이모지 0, Noto Sans KR)
- [ ] 접근성 기본 (시맨틱 마크업, 대비, 키보드, reduced-motion)
- [ ] SEO: metadata/JSON-LD/OG/sitemap/robots/llms.txt
- [ ] 실데이터 없이도 모든 화면이 의미있는 콘텐츠로 채워짐
- [ ] SPEC.md 요구사항 전부 구현
