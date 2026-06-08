# Alpha Radar Fundamentals — Portfolio Write-up (KO / EN)

> Live demo: **https://kr-stock-dashboard-pi.vercel.app**
> Educational portfolio project. Not investment advice.

---

## 🇰🇷 한국어

### 한 줄 소개
한국 상장기업의 재무를 한 화면에서 분석하는 **한국 주식 리서치 터미널** — 실제 OpenDART 재무제표 +
실시간(지연) 시세로 핵심 재무비율·3개년 추이·밸류에이션·리스크를 자동 계산. 미국 시장까지 확장. (한/영 지원)

### 프로젝트 요약
금융 전공자로서 "금융 지식 + AI 활용 개발 + 제품화 + 비즈니스 감각"을 한 번에 보여주기 위해 만든
풀스택 웹 제품입니다. 빈 폴더에서 시작해 기획·구현·검증·문서화까지 직접 진행했습니다.

### 핵심 기능
- **실제 재무 데이터(OpenDART)**: 매출·영업이익·순이익·자산/자본/부채 3개년 + ROE·ROA·영업이익률·
  순이익률·부채비율·유동비율·EPS·BPS 자동 계산. 연결(CFS)→별도(OFS) 폴백, 계정과목 자동 매칭.
- **실시간(지연) 시세·지수**: 코스피/코스닥/코스피200/환율 + 종목 가격·차트 (Yahoo, ~15분 지연).
  PER·PBR·시총은 실시간 가격 ÷ 실제 재무로 계산.
- **밸류에이션·리스크 요약**: 업종 평균 대비 PER/PBR, 부채·마진·역성장 등 자동 리스크 플래그.
- **글로벌 확장**: 미국/나스닥(NASDAQ·S&P500·다우·러셀) + 미국 관심종목(가격 전용, 펀더멘털 추후).
- **정직한 데이터 라벨**: 종목·항목별로 "OpenDART 재무 / 샘플 재무 / 지연 시세"를 정확히 표시.
- **한/영 토글**, 관심종목, 다크 모드, 반응형.

### 기술 스택
Next.js 16 (App Router) · TypeScript(strict) · Tailwind v4 · Framer Motion · Recharts ·
Biome · Bun · 자체 i18n(무패키지) · OpenDART API · Yahoo Finance(지연 시세).

### 이 프로젝트가 보여주는 역량
- **금융 사고력**: 애널리스트가 보는 핵심 지표를 직접 정의·계산.
- **AI 활용 개발**: AI 페어와 함께 실제로 동작하는 제품을 설계·구현.
- **데이터 정직성**: 실데이터/샘플을 명확히 구분, 면책 고지 유지, 실패 시 안전 폴백.
- **제품·비즈니스 감각**: 생태계·수익화·콘텐츠 자동화 로드맵까지 제시.

### 이력서 한 줄 (붙여넣기용)
- 한국 상장사 재무비율·밸류에이션·리스크를 자동 계산하는 한/영 리서치 터미널을 기획·구현·검증
  (Next.js·TypeScript, OpenDART 실데이터 연동, 실시간 지연 시세, 미국 시장 확장).

### 면접 스토리 (Problem → Solution → Built → Learned → Next)
- **문제**: 한국 주식 분석은 재무 데이터를 일일이 모아 종목마다 같은 비율을 손으로 계산해야 함.
- **해결**: OpenDART 공시를 읽어 핵심 지표를 자동 계산·시각화하는 대시보드.
- **구현**: 타입 안전한 Next.js 프런트엔드 + OpenDART/시세 데이터 레이어 + 샘플 폴백 + 한/영.
- **배운 점**: 출처 라벨링·밸류에이션 가정·면책 등 "데이터 정직성"이 코드만큼 중요.
- **다음**: 분기 데이터, PDF 리포트, 동종업계 비교, 콘텐츠 자동화(뉴스레터/숏폼).

---

## 🇺🇸 English

### One-liner
A **Korean equity research terminal** that analyzes listed-company financials in one view —
real OpenDART statements + live (delayed) prices to auto-compute core ratios, 3-year trends,
valuation, and risk. Extends to US markets. Bilingual (KO/EN).

### Summary
A full-stack web product built (from an empty folder: planned, built, verified, documented) to
show, as a finance graduate, that I can combine **finance knowledge + AI-assisted coding +
product thinking + business sense**.

### Key features
- **Real financials (OpenDART)**: 3-year revenue/operating/net income, assets/equity/liabilities,
  plus ROE, ROA, operating & net margin, debt & current ratio, EPS, BPS — with CFS→OFS fallback
  and IFRS account-id/name matching.
- **Live (delayed) quotes & indices**: KOSPI/KOSDAQ/KOSPI200/FX + per-stock price & chart
  (Yahoo, ~15-min delayed). PER/PBR/market-cap = live price ÷ real trailing earnings.
- **Valuation & risk**: PER/PBR vs sector average; automatic flags (debt, margins, contraction).
- **Global layer**: US/Nasdaq (NASDAQ, S&P 500, Dow, Russell) + US watchlist (price-only).
- **Honest data labeling**: per company/metric — "OpenDART (live) / Sample / Delayed price".
- **KO/EN toggle**, watchlist, dark mode, responsive.

### Stack
Next.js 16 (App Router) · TypeScript (strict) · Tailwind v4 · Framer Motion · Recharts ·
Biome · Bun · custom no-dependency i18n · OpenDART API · Yahoo Finance (delayed).

### What it demonstrates
Financial reasoning · AI-assisted product building · data honesty (live vs sample, safe fallback,
disclaimers) · product & business thinking (ecosystem, monetization, content roadmap).

### Résumé bullet (paste-ready)
- Designed, built, and verified a bilingual Korean equity research terminal that auto-computes
  financial ratios, valuation, and risk (Next.js/TypeScript; OpenDART live data; delayed live
  quotes; US-market extension).

### Interview story
Problem: Korean equity research means manually gathering financials and recomputing the same
ratios per name. Solution: a dashboard that reads OpenDART filings and auto-computes/visualizes
key metrics. Built: a typed Next.js front end + OpenDART/quote data layer + sample fallback +
KO/EN. Learned: source labeling, valuation assumptions, and disclaimers matter as much as code.
Next: quarterly data, PDF reports, peer comparison, content automation.

---

### Honesty notes (keep these)
- Financials: real OpenDART for mapped non-financial tickers; financial holding companies and
  unmapped names fall back to clearly-labeled sample data.
- Prices/indices: real but ~15-min delayed (Yahoo). Not real-time tick data.
- This is an educational portfolio demo and **not investment advice**.
