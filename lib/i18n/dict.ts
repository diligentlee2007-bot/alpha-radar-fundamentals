/**
 * Local KO/EN dictionary — no i18n packages. The English object `en` defines the
 * canonical shape; `ko` must match it (enforced by `typeof en`). Finance terms are
 * written naturally for each language, not literal machine translation.
 */

export type Lang = "ko" | "en";

const en = {
  nav: {
    overview: "Overview",
    terminal: "Terminal",
    global: "Global",
    studio: "Studio",
    caseStudy: "Case study",
    future: "Roadmap",
    cta: "Open the terminal",
  },
  hero: {
    badge: "Portfolio demo · Educational use only, not investment advice",
    title: "Korean equity fundamentals,",
    titleAccent: "decoded in one view",
    subtitle:
      "Alpha Radar Fundamentals turns a Korean listed company into a clean research view — core financial ratios, three-year trends, valuation context, and a plain-language risk summary. Built OpenDART-ready, with a labeled sample mode when no API key is set.",
    ctaPrimary: "Explore the terminal",
    ctaSecondary: "See how it works",
    stats: [
      { v: "12+", l: "financial ratios" },
      { v: "3yr", l: "trend history" },
      { v: "DART", l: "ready data layer" },
    ],
    demoTitle: "Featured company",
    demoHint: "Switch companies to see the analysis update.",
  },
  capabilities: {
    eyebrow: "What it does",
    title: "A research terminal, not a stock ticker",
    subtitle:
      "Everything an analyst checks first — profitability, stability, growth, and valuation — computed and laid out for fast reading.",
    items: [
      {
        title: "Core financial ratios",
        text: "ROE, ROA, operating and net margin, debt and current ratio, EPS and BPS — calculated from the financial statements.",
      },
      {
        title: "Three-year trends",
        text: "Revenue, operating profit, and net income over three years, so direction and momentum are obvious at a glance.",
      },
      {
        title: "Valuation context",
        text: "P/E and P/B compared against the company's sector average, framed as discount, premium, or in line.",
      },
      {
        title: "Plain-language risk summary",
        text: "Automatic flags for elevated debt, thin margins, contraction, stretched valuation, or weak liquidity.",
      },
      {
        title: "OpenDART-ready data layer",
        text: "Shaped to plug into Korea's OpenDART disclosures. Falls back to clearly-labeled sample data without a key.",
      },
      {
        title: "Source labeling, always",
        text: "Every view states whether numbers are live or sample, so the analysis is honest about its inputs.",
      },
    ],
  },
  workflow: {
    eyebrow: "How it works",
    title: "From disclosure to decision-ready view",
    subtitle:
      "The same pipeline runs for every company, so the output is consistent and comparable.",
    steps: [
      { title: "Pick a listed company", text: "Choose a KOSPI or KOSDAQ name from the universe." },
      {
        title: "Pull the financials",
        text: "Read statements from OpenDART, or labeled sample data.",
      },
      {
        title: "Calculate the ratios",
        text: "Profitability, stability, and per-share metrics computed automatically.",
      },
      {
        title: "Summarize value & risk",
        text: "Valuation against sector plus a readable risk summary.",
      },
    ],
  },
  fundamentals: {
    financialSummary: "Financial summary",
    threeYear: "3-year trend",
    ratios: "Key ratios",
    valuation: "Valuation",
    riskSummary: "Risk summary",
    perShare: "Per-share & valuation",
    profitability: "Profitability",
    stability: "Stability",
    growth: "Growth",
    labels: {
      revenue: "Revenue",
      operatingProfit: "Operating profit",
      netIncome: "Net income",
      totalAssets: "Total assets",
      totalEquity: "Total equity",
      totalLiabilities: "Total liabilities",
      roe: "ROE",
      roa: "ROA",
      operatingMargin: "Operating margin",
      netMargin: "Net margin",
      debtRatio: "Debt ratio",
      currentRatio: "Current ratio",
      eps: "EPS",
      bps: "BPS",
      per: "P/E (PER)",
      pbr: "P/B (PBR)",
      dividendYield: "Dividend yield",
      marketCap: "Market cap",
      revenueGrowth: "Revenue growth (YoY)",
      price: "Price",
      sector: "Sector",
    },
    valuationStance: { discount: "below", premium: "above", inline: "in line with" },
    valuationLine:
      "P/E of {per}x is {perStance} the sector average ({sectorPer}x); P/B of {pbr}x is {pbrStance} the sector average ({sectorPbr}x).",
    risk: {
      highDebt: "Debt ratio is elevated versus the sector",
      negativeGrowth: "Revenue contracted in the latest year",
      lowMargin: "Net margin is on the low side",
      highValuation: "Valuation looks stretched on a P/E basis",
      lowLiquidity: "Current ratio is below 100%",
      limited: "Few notable red flags in the headline numbers",
      note: "Risk flags are mechanical signals from the sample figures, not a recommendation.",
    },
  },
  terminal: {
    title: "Equity research terminal",
    subtitle:
      "Browse the KOSPI / KOSDAQ universe with valuation and profitability columns, then open any name for the full fundamentals view.",
    search: "Search by name or code",
    columns: {
      company: "Company",
      price: "Price",
      change: "Change",
      per: "PER",
      pbr: "PBR",
      roe: "ROE",
      marketCap: "Market cap",
    },
    empty: "No matching companies.",
    count: "companies",
    marketContext: "Market context",
    indices: "Indices & FX",
    sectors: "Sector trends",
    movers: "Market movers",
    backToTerminal: "Terminal",
    asOf: "Data as of",
    watchlistOnly: "Watchlist only",
    showAll: "All",
    watchEmpty: "No watchlisted companies yet. Tap the star to add one.",
    watchColumn: "Watch",
  },
  caseStudy: {
    eyebrow: "Case study",
    title: "How I approached this project",
    intro:
      "I am a finance graduate building portfolio projects. The goal is not to look like a senior engineer — it is to show that I can plan, build, verify, and present a useful Korean equity research tool, and reason about its data and limits.",
    phases: [
      {
        tag: "Problem",
        title: "Korean equity research is manual",
        text: "Analysing a Korean listed company usually means manually collecting financial data and recalculating the same ratios by hand for every name.",
      },
      {
        tag: "Solution",
        title: "An OpenDART-ready dashboard",
        text: "A dashboard that calculates and visualizes core financial metrics, valuation, and risk — ready to read disclosures from OpenDART, with a labeled sample mode otherwise.",
      },
      {
        tag: "What I built",
        title: "A typed research front end",
        text: "A Next.js + TypeScript + Tailwind dashboard with an OpenDART-ready data layer, fallback sample mode, ratio calculations, and a valuation and risk summary per company.",
      },
      {
        tag: "What I learned",
        title: "Data honesty matters as much as code",
        text: "Working through data limitations taught me to label sources clearly, state valuation assumptions, and keep disclaimers explicit so the tool stays trustworthy.",
      },
      {
        tag: "Next steps",
        title: "Where it goes from here",
        text: "Live OpenDART key integration, peer comparison, quarterly data, an exportable PDF research report, and automated short-form report generation.",
      },
    ],
  },
  monetization: {
    eyebrow: "Business model",
    title: "How this could become a business",
    subtitle:
      "Potential directions, framed honestly — not current revenue. They show how a research terminal could grow into a finance product and content business.",
    items: [
      {
        title: "Free public demo",
        text: "An open portfolio demo that builds credibility and an audience.",
      },
      {
        title: "Paid PDF equity reports",
        text: "Exportable, branded per-company research reports as a paid product.",
      },
      {
        title: "Research template subscriptions",
        text: "Recurring access to premium research templates and screens.",
      },
      {
        title: "Daily / weekly newsletter",
        text: "A market-briefing newsletter generated from the same research.",
      },
      {
        title: "Finance creator tool",
        text: "Generate Shorts scripts and newsletter drafts for finance creators.",
      },
      {
        title: "Instagram carousel generator",
        text: "Turn a market issue into a ready-to-post 5-slide carousel.",
      },
      {
        title: "YouTube Shorts package",
        text: "Script, storyboard, and titles for a vertical finance Short.",
      },
      {
        title: "B2B custom dashboards",
        text: "Bespoke dashboards for small finance teams and creators.",
      },
    ],
    note: "Future monetization, not current revenue — no payment processing, paid services, or real revenue exist in this demo.",
  },
  global: {
    eyebrow: "Global extension",
    title: "US / Nasdaq market overview",
    subtitle:
      "A second layer on top of the Korea fundamentals core: live (delayed) US index, FX, and a demo watchlist. US fundamentals are a future extension.",
    indices: "US indices & FX",
    watchlist: "US watchlist (demo)",
    priceOnly: "Price-only · fundamentals coming later",
    note: "Prices are real, ~15-min delayed (Yahoo Finance). US financial ratios are not wired yet and are intentionally omitted — this view is price-only. Not investment advice.",
    columns: { company: "Instrument", price: "Price", change: "Change" },
  },
  ecosystem: {
    eyebrow: "Product ecosystem",
    title: "How this fits with the original Alpha Radar",
    subtitle:
      "These are complementary parts of one product ecosystem, not competitors — a monitoring layer and a research layer that feed each other.",
    note: "One ecosystem: the original Alpha Radar watches and notifies; Alpha Radar Fundamentals researches and explains. Together they cover monitoring → research → content.",
    originalTitle: "Alpha Radar (original)",
    originalItems: [
      "Personalized watchlist dashboard",
      "Daily email report",
      "User-specific monitoring & alerts",
    ],
    fundamentalsTitle: "Alpha Radar Fundamentals",
    fundamentalsItems: [
      "Equity research terminal",
      "Financial ratios & 3-year trends",
      "Valuation context & risk summary",
      "Korea core + global (US) expansion",
      "Future report / PDF / newsletter / Shorts pipeline",
    ],
  },
  pipeline: {
    eyebrow: "Content roadmap",
    title: "Future content automation pipeline",
    subtitle:
      "Planned, not built. The same research engine would draft content packages that you review and approve before anything is published.",
    humanInLoop:
      "Human-in-the-loop: AI drafts the package; you review, edit, and approve before publishing.",
    badge: "Future",
    cards: [
      {
        tag: "A",
        title: "Instagram daily market card",
        points: [
          "Daily Korea/US market issue",
          "5-slide carousel storyboard",
          "Caption + hashtags",
          "Source labels + disclaimer",
        ],
      },
      {
        tag: "B",
        title: "45-second finance Shorts package",
        points: [
          "Korean script",
          "Vertical data-card storyboard",
          "Title ideas",
          "Disclaimer + source labels",
        ],
      },
      {
        tag: "C",
        title: "2–3 minute market briefing video",
        points: [
          "Korea + US/Nasdaq topics",
          "Index/FX recap",
          "Key company chart",
          "Narration script + sources",
        ],
      },
      {
        tag: "D",
        title: "10-minute YouTube research episode",
        points: [
          "Weekly (not daily) at first",
          "Deeper company explanation",
          "Valuation context + risk section",
          "Educational disclaimer",
        ],
      },
    ],
    publisherTitle: "Future publishing (not implemented)",
    publisherNote:
      "Publishing could later connect to the services below after your review/approval. No integrations, tokens, or account access are requested or implemented now.",
    publisherItems: [
      "Instagram Graph API (approved post publishing)",
      "YouTube upload workflow",
      "Newsletter email workflow",
    ],
  },
  future: {
    eyebrow: "Roadmap",
    title: "Planned extensions",
    subtitle:
      "Future directions that reuse the same analysis engine. These are not built yet — they show where the project is headed.",
    badge: "Future",
    items: [
      {
        title: "Live OpenDART integration",
        text: "Connect a real OpenDART API key to pull actual filed statements, with peer comparison and quarterly data.",
      },
      {
        title: "Exportable PDF reports",
        text: "One-click export of a clean, branded research report for each company.",
      },
      {
        title: "Korean finance Shorts pipeline",
        text: "Generate a 45-second Korean finance Shorts script and a vertical data-card storyboard from the same analysis.",
      },
    ],
  },
  studio: {
    eyebrow: "Content studio",
    title: "Daily market brief & Instagram carousel",
    subtitle:
      "Auto-drafts today's market brief and a 5-slide carousel from live KR + US data. You review and post it yourself — nothing is auto-published.",
    asOf: "As of",
    humanInLoop: "Drafted from live data — review and post it yourself. No auto-publishing.",
    briefTitle: "Daily market brief",
    carouselTitle: "Instagram carousel · 5 slides",
    captionTitle: "Caption & hashtags",
    copyBrief: "Copy brief",
    copyCaption: "Copy caption",
    savePdf: "Save as PDF",
    downloadPng: "PNG",
    copied: "Copied",
    sec: {
      overview: "Today's market",
      korea: "Korea",
      us: "US / Nasdaq",
      notable: "Notable movers",
      risk: "Risk & notes",
    },
    headlineUp: "Risk-on — indices higher",
    headlineDown: "Risk-off — indices lower",
    headlineFlat: "Wait-and-see — indices little changed",
    riskCalm: "No major dislocations today; keep position sizing disciplined.",
    riskVol: "Volatility is elevated — manage risk and avoid chasing moves.",
    disclaimer: "Educational content · not investment advice · data delayed.",
    brand: "Alpha Radar Fundamentals",
  },
  finalCta: {
    title: "Open the terminal and read a company",
    subtitle:
      "See the full fundamentals view for any Korean listed name, then review how the project was built.",
    ctaPrimary: "Open the terminal",
    ctaSecondary: "Read the case study",
    note: "Educational portfolio demo · not investment advice",
  },
  footer: {
    tagline:
      "A Korean equity research terminal that computes core financial ratios, three-year trends, valuation, and risk for listed companies. Built as a finance portfolio project.",
    productHeading: "Product",
    portfolioHeading: "Portfolio",
    links: {
      terminal: "Terminal",
      howItWorks: "How it works",
      roadmap: "Roadmap",
      whyItMatters: "Why it matters",
      caseStudy: "Case study",
    },
    disclaimerTitle: "Disclaimer.",
    disclaimerBody:
      "Alpha Radar Fundamentals is an educational portfolio demonstration. Financial figures shown are deterministic samples generated for the demo (or live OpenDART data when a key is configured) and may not reflect a company's true financials. Nothing here is financial, investment, or trading advice, or a recommendation to buy or sell any security. Always verify with primary sources and consult a licensed professional.",
    copyright: "© 2026 Alpha Radar. A finance + AI portfolio project.",
  },
  common: {
    sample: "Sample financials",
    live: "OpenDART financials",
    sampleTag: "Sample",
    sampleTooltip: "OPENDART_API_KEY is not set — financial statements are labeled sample data.",
    liveTooltip: "OPENDART_API_KEY detected — live OpenDART financials.",
    notAdvice: "Not investment advice",
    sampleNotice:
      "Financial statements are sample data (no OpenDART key set); stock prices and indices are real, ~15-min delayed. Not investment advice.",
    krwUnit: "KRW",
    watch: "Watch",
    watching: "Watching",
    watchAdd: "Add to watchlist",
    watchRemove: "Remove from watchlist",
    quoteDelayed: "Delayed quote",
    quoteSample: "Sample price",
    quoteUpdated: "Updated",
    quoteNote:
      "Prices are real but ~15-min delayed (Yahoo Finance); financial statements are sample data. Not investment advice.",
  },
  lang: { ko: "한국어", en: "English", toggle: "Language" },
};

type Dict = typeof en;

const ko: Dict = {
  nav: {
    overview: "개요",
    terminal: "터미널",
    global: "글로벌",
    studio: "스튜디오",
    caseStudy: "케이스 스터디",
    future: "로드맵",
    cta: "터미널 열기",
  },
  hero: {
    badge: "포트폴리오 데모 · 교육용이며 투자 자문이 아닙니다",
    title: "한국 상장기업 펀더멘털을",
    titleAccent: "한 화면에서",
    subtitle:
      "Alpha Radar Fundamentals는 한국 상장기업을 깔끔한 리서치 화면으로 정리합니다. 핵심 재무비율, 3개년 추이, 밸류에이션 맥락, 그리고 쉬운 말로 풀어낸 리스크 요약까지. OpenDART 연동을 전제로 설계했으며, API 키가 없으면 라벨이 표시된 샘플 모드로 동작합니다.",
    ctaPrimary: "터미널 살펴보기",
    ctaSecondary: "작동 방식 보기",
    stats: [
      { v: "12+", l: "재무비율" },
      { v: "3개년", l: "추이 데이터" },
      { v: "DART", l: "연동형 데이터" },
    ],
    demoTitle: "대표 종목",
    demoHint: "종목을 바꾸면 분석이 함께 갱신됩니다.",
  },
  capabilities: {
    eyebrow: "주요 기능",
    title: "단순 시세가 아닌 리서치 터미널",
    subtitle:
      "애널리스트가 가장 먼저 확인하는 수익성·안정성·성장성·밸류에이션을 자동으로 계산해 빠르게 읽도록 배치했습니다.",
    items: [
      {
        title: "핵심 재무비율",
        text: "ROE, ROA, 영업이익률·순이익률, 부채비율·유동비율, EPS·BPS를 재무제표 기준으로 계산합니다.",
      },
      {
        title: "3개년 추이",
        text: "매출액·영업이익·당기순이익의 3개년 흐름을 보여줘 방향성과 모멘텀을 한눈에 파악합니다.",
      },
      {
        title: "밸류에이션 맥락",
        text: "PER·PBR을 해당 업종 평균과 비교해 할인·프리미엄·유사 수준으로 정리합니다.",
      },
      {
        title: "쉬운 리스크 요약",
        text: "높은 부채, 낮은 마진, 역성장, 과도한 밸류에이션, 약한 유동성을 자동으로 표시합니다.",
      },
      {
        title: "OpenDART 연동형 데이터",
        text: "OpenDART 공시에 연결되도록 설계했으며, 키가 없으면 라벨이 표시된 샘플 데이터로 대체합니다.",
      },
      {
        title: "항상 출처 표기",
        text: "모든 화면이 실데이터인지 샘플인지 표시해, 입력값에 대해 정직한 분석을 유지합니다.",
      },
    ],
  },
  workflow: {
    eyebrow: "작동 방식",
    title: "공시에서 의사결정용 화면까지",
    subtitle: "모든 종목에 동일한 파이프라인이 적용돼 결과가 일관되고 비교 가능합니다.",
    steps: [
      { title: "상장기업 선택", text: "코스피·코스닥 유니버스에서 종목을 고릅니다." },
      {
        title: "재무 데이터 수집",
        text: "OpenDART 공시 또는 라벨이 표시된 샘플 데이터를 불러옵니다.",
      },
      { title: "재무비율 계산", text: "수익성·안정성·주당 지표를 자동으로 계산합니다." },
      {
        title: "밸류·리스크 요약",
        text: "업종 대비 밸류에이션과 읽기 쉬운 리스크 요약을 제공합니다.",
      },
    ],
  },
  fundamentals: {
    financialSummary: "재무 요약",
    threeYear: "3개년 추이",
    ratios: "핵심 비율",
    valuation: "밸류에이션",
    riskSummary: "리스크 요약",
    perShare: "주당 지표 · 밸류에이션",
    profitability: "수익성",
    stability: "안정성",
    growth: "성장성",
    labels: {
      revenue: "매출액",
      operatingProfit: "영업이익",
      netIncome: "당기순이익",
      totalAssets: "자산총계",
      totalEquity: "자본총계",
      totalLiabilities: "부채총계",
      roe: "ROE",
      roa: "ROA",
      operatingMargin: "영업이익률",
      netMargin: "순이익률",
      debtRatio: "부채비율",
      currentRatio: "유동비율",
      eps: "EPS",
      bps: "BPS",
      per: "PER",
      pbr: "PBR",
      dividendYield: "배당수익률",
      marketCap: "시가총액",
      revenueGrowth: "매출 성장률 (YoY)",
      price: "현재가",
      sector: "업종",
    },
    valuationStance: { discount: "낮은", premium: "높은", inline: "유사한" },
    valuationLine:
      "PER {per}배는 업종 평균({sectorPer}배) 대비 {perStance} 수준이고, PBR {pbr}배는 업종 평균({sectorPbr}배) 대비 {pbrStance} 수준입니다.",
    risk: {
      highDebt: "부채비율이 업종 대비 높은 편",
      negativeGrowth: "최근 연도 매출이 역성장",
      lowMargin: "순이익률이 낮은 편",
      highValuation: "PER 기준 밸류에이션 부담",
      lowLiquidity: "유동비율이 100% 미만",
      limited: "표면 지표상 특이 위험요인은 제한적",
      note: "리스크 표시는 샘플 수치에 기반한 기계적 신호이며 투자 권유가 아닙니다.",
    },
  },
  terminal: {
    title: "주식 리서치 터미널",
    subtitle:
      "코스피·코스닥 유니버스를 밸류에이션·수익성 지표와 함께 살펴보고, 종목을 열어 전체 펀더멘털을 확인하세요.",
    search: "종목명 또는 코드 검색",
    columns: {
      company: "종목",
      price: "현재가",
      change: "등락",
      per: "PER",
      pbr: "PBR",
      roe: "ROE",
      marketCap: "시가총액",
    },
    empty: "검색 결과가 없습니다.",
    count: "개 종목",
    marketContext: "시장 맥락",
    indices: "지수 · 환율",
    sectors: "섹터 동향",
    movers: "등락 상위",
    backToTerminal: "터미널",
    asOf: "데이터 기준일",
    watchlistOnly: "관심종목만",
    showAll: "전체",
    watchEmpty: "관심종목이 없습니다. 별 아이콘을 눌러 추가하세요.",
    watchColumn: "관심",
  },
  caseStudy: {
    eyebrow: "케이스 스터디",
    title: "이 프로젝트를 진행한 방식",
    intro:
      "저는 포트폴리오 프로젝트를 만드는 금융 전공 졸업생입니다. 시니어 엔지니어처럼 보이는 것이 목표가 아니라, 유용한 한국 주식 리서치 도구를 기획·구현·검증·전달하고 그 데이터와 한계를 설명할 수 있음을 보여주는 것이 목표입니다.",
    phases: [
      {
        tag: "문제",
        title: "한국 주식 리서치는 수작업이 많다",
        text: "한국 상장기업을 분석하려면 보통 재무 데이터를 일일이 모으고 종목마다 같은 비율을 손으로 다시 계산해야 합니다.",
      },
      {
        tag: "해결",
        title: "OpenDART 연동형 대시보드",
        text: "핵심 재무지표·밸류에이션·리스크를 계산하고 시각화하는 대시보드. OpenDART 공시를 읽도록 준비했고, 그 외에는 라벨이 표시된 샘플 모드로 동작합니다.",
      },
      {
        tag: "구현 내용",
        title: "타입 안전한 리서치 프런트엔드",
        text: "Next.js + TypeScript + Tailwind 대시보드, OpenDART 연동형 데이터 레이어, 샘플 폴백 모드, 비율 계산, 종목별 밸류에이션·리스크 요약을 구현했습니다.",
      },
      {
        tag: "배운 점",
        title: "데이터 정직성은 코드만큼 중요하다",
        text: "데이터 한계를 다루며 출처를 명확히 표기하고, 밸류에이션 가정을 밝히며, 면책 고지를 분명히 해 도구의 신뢰성을 유지하는 법을 배웠습니다.",
      },
      {
        tag: "다음 단계",
        title: "앞으로의 방향",
        text: "실 OpenDART 키 연동, 동종업계 비교, 분기 데이터, PDF 리서치 리포트 내보내기, 숏폼 리포트 자동 생성.",
      },
    ],
  },
  monetization: {
    eyebrow: "비즈니스 모델",
    title: "비즈니스로 발전시키는 방법",
    subtitle:
      "현재 매출이 아니라 가능성 있는 방향을 솔직하게 정리했습니다. 리서치 터미널이 금융 제품·콘텐츠 사업으로 성장할 수 있는 경로입니다.",
    items: [
      { title: "무료 공개 데모", text: "신뢰와 독자층을 쌓는 공개 포트폴리오 데모." },
      {
        title: "유료 PDF 리포트",
        text: "브랜드가 적용된 종목별 리서치 리포트를 유료 상품으로 제공.",
      },
      { title: "리서치 템플릿 구독", text: "프리미엄 리서치 템플릿·스크리너 정기 구독." },
      { title: "일간·주간 뉴스레터", text: "같은 리서치로 만든 시장 브리핑 뉴스레터." },
      { title: "금융 크리에이터 도구", text: "크리에이터용 숏폼 스크립트·뉴스레터 초안 생성." },
      { title: "인스타 카드뉴스 생성", text: "시장 이슈를 바로 올릴 수 있는 5장 카드뉴스로 변환." },
      { title: "유튜브 숏폼 패키지", text: "세로형 금융 숏폼용 스크립트·스토리보드·제목." },
      { title: "B2B 맞춤 대시보드", text: "소규모 금융 팀·크리에이터를 위한 맞춤 대시보드 제작." },
    ],
    note: "현재 매출이 아닌 향후 방향입니다 — 결제 처리·유료 서비스·실제 매출은 본 데모에 없습니다.",
  },
  global: {
    eyebrow: "글로벌 확장",
    title: "미국 / 나스닥 시장 개요",
    subtitle:
      "한국 펀더멘털 코어 위에 얹는 두 번째 레이어: 미국 지수·환율·데모 관심종목의 실시간(지연) 시세. 미국 펀더멘털은 향후 확장 예정입니다.",
    indices: "미국 지수 · 환율",
    watchlist: "미국 관심 종목 (데모)",
    priceOnly: "가격만 · 펀더멘털 추후 제공",
    note: "가격은 실제 시세이며 약 15분 지연됩니다(Yahoo Finance). 미국 재무비율은 아직 연동하지 않아 의도적으로 제외했고, 이 화면은 가격 전용입니다. 투자 자문이 아닙니다.",
    columns: { company: "종목", price: "현재가", change: "등락" },
  },
  ecosystem: {
    eyebrow: "제품 생태계",
    title: "오리지널 Alpha Radar와의 관계",
    subtitle:
      "둘은 경쟁이 아니라 하나의 제품 생태계를 이루는 상호 보완 요소입니다 — 모니터링 레이어와 리서치 레이어가 서로를 보강합니다.",
    note: "하나의 생태계: 오리지널 Alpha Radar는 감시·알림을, Alpha Radar Fundamentals는 리서치·해설을 담당합니다. 합치면 모니터링 → 리서치 → 콘텐츠를 모두 커버합니다.",
    originalTitle: "Alpha Radar (오리지널)",
    originalItems: ["개인화된 관심종목 대시보드", "일간 이메일 리포트", "사용자별 모니터링·알림"],
    fundamentalsTitle: "Alpha Radar Fundamentals",
    fundamentalsItems: [
      "주식 리서치 터미널",
      "재무비율 · 3개년 추이",
      "밸류에이션 맥락 · 리스크 요약",
      "한국 코어 + 글로벌(미국) 확장",
      "향후 리포트 / PDF / 뉴스레터 / 숏폼 파이프라인",
    ],
  },
  pipeline: {
    eyebrow: "콘텐츠 로드맵",
    title: "향후 콘텐츠 자동화 파이프라인",
    subtitle:
      "구현 예정(미구현)입니다. 동일한 리서치 엔진이 콘텐츠 패키지 초안을 만들고, 게시 전 사용자가 검토·승인합니다.",
    humanInLoop: "사람 검수 방식: AI가 초안을 만들고, 게시 전 사용자가 검토·수정·승인합니다.",
    badge: "예정",
    cards: [
      {
        tag: "A",
        title: "인스타그램 일간 마켓 카드",
        points: [
          "한국/미국 일간 시장 이슈",
          "5장 카드뉴스 스토리보드",
          "캡션 + 해시태그",
          "출처 표기 + 면책",
        ],
      },
      {
        tag: "B",
        title: "45초 금융 숏폼 패키지",
        points: [
          "한국어 스크립트",
          "세로형 데이터 카드 스토리보드",
          "제목 아이디어",
          "면책 + 출처 표기",
        ],
      },
      {
        tag: "C",
        title: "2~3분 마켓 브리핑 영상",
        points: [
          "한국 + 미국/나스닥 토픽",
          "지수/환율 요약",
          "핵심 종목 차트",
          "내레이션 스크립트 + 출처",
        ],
      },
      {
        tag: "D",
        title: "10분 유튜브 리서치 에피소드",
        points: [
          "처음엔 주간(매일 아님)",
          "심층 기업 설명",
          "밸류에이션 맥락 + 리스크",
          "교육용 면책",
        ],
      },
    ],
    publisherTitle: "향후 게시 연동 (미구현)",
    publisherNote:
      "사용자 검토·승인 이후 아래 서비스와 연동할 수 있습니다. 지금은 어떤 연동·토큰·계정 접근도 요청하거나 구현하지 않습니다.",
    publisherItems: [
      "Instagram Graph API (승인된 게시 발행)",
      "YouTube 업로드 워크플로",
      "뉴스레터 이메일 워크플로",
    ],
  },
  future: {
    eyebrow: "로드맵",
    title: "예정된 확장",
    subtitle:
      "동일한 분석 엔진을 재사용하는 향후 방향입니다. 아직 구현되지 않았으며 프로젝트의 지향점을 보여줍니다.",
    badge: "예정",
    items: [
      {
        title: "실 OpenDART 연동",
        text: "실제 OpenDART API 키를 연결해 제출된 재무제표를 불러오고, 동종업계 비교와 분기 데이터를 추가합니다.",
      },
      {
        title: "PDF 리포트 내보내기",
        text: "종목별 깔끔한 브랜드 리서치 리포트를 한 번에 내보냅니다.",
      },
      {
        title: "한국 금융 숏폼 파이프라인",
        text: "같은 분석으로 45초 한국 금융 숏폼 스크립트와 세로형 데이터 카드 스토리보드를 생성합니다.",
      },
    ],
  },
  studio: {
    eyebrow: "콘텐츠 스튜디오",
    title: "데일리 마켓 브리핑 & 인스타 카드뉴스",
    subtitle:
      "실시간 한국·미국 데이터로 오늘의 브리핑과 5장짜리 카드뉴스를 자동 생성합니다. 검토 후 직접 게시하세요 — 자동 게시는 하지 않습니다.",
    asOf: "기준",
    humanInLoop: "실시간 데이터로 초안을 만듭니다 — 검토 후 직접 올리세요. 자동 게시 없음.",
    briefTitle: "데일리 마켓 브리핑",
    carouselTitle: "인스타 카드뉴스 · 5장",
    captionTitle: "캡션 & 해시태그",
    copyBrief: "브리핑 복사",
    copyCaption: "캡션 복사",
    savePdf: "PDF 저장",
    downloadPng: "PNG",
    copied: "복사됨",
    sec: {
      overview: "오늘의 시장",
      korea: "한국",
      us: "미국 / 나스닥",
      notable: "주목 종목",
      risk: "리스크 · 주의",
    },
    headlineUp: "위험선호 — 지수 상승",
    headlineDown: "위험회피 — 지수 하락",
    headlineFlat: "관망세 — 지수 보합권",
    riskCalm: "특이 변동성은 제한적 — 분할·비중 관리는 유지하세요.",
    riskVol: "변동성 확대 — 리스크 관리, 추격 매매 주의.",
    disclaimer: "교육용 콘텐츠 · 투자 자문 아님 · 시세 지연.",
    brand: "Alpha Radar Fundamentals",
  },
  finalCta: {
    title: "터미널을 열고 기업을 읽어보세요",
    subtitle:
      "한국 상장기업의 전체 펀더멘털 화면을 확인하고, 이 프로젝트가 어떻게 만들어졌는지 살펴보세요.",
    ctaPrimary: "터미널 열기",
    ctaSecondary: "케이스 스터디 보기",
    note: "교육용 포트폴리오 데모 · 투자 자문 아님",
  },
  footer: {
    tagline:
      "상장기업의 핵심 재무비율, 3개년 추이, 밸류에이션, 리스크를 계산하는 한국 주식 리서치 터미널. 금융 포트폴리오 프로젝트로 제작했습니다.",
    productHeading: "제품",
    portfolioHeading: "포트폴리오",
    links: {
      terminal: "터미널",
      howItWorks: "작동 방식",
      roadmap: "로드맵",
      whyItMatters: "의미",
      caseStudy: "케이스 스터디",
    },
    disclaimerTitle: "면책 고지.",
    disclaimerBody:
      "Alpha Radar Fundamentals는 교육용 포트폴리오 데모입니다. 표시된 재무 수치는 데모용으로 결정론적으로 생성된 샘플(또는 키가 설정된 경우 실 OpenDART 데이터)이며 기업의 실제 재무와 다를 수 있습니다. 본 사이트의 어떤 내용도 금융·투자·매매 자문이나 특정 증권의 매매 권유가 아닙니다. 반드시 원본 출처로 확인하고 전문가와 상담하세요.",
    copyright: "© 2026 Alpha Radar. 금융 + AI 포트폴리오 프로젝트.",
  },
  common: {
    sample: "샘플 재무",
    live: "OpenDART 재무",
    sampleTag: "샘플",
    sampleTooltip: "OPENDART_API_KEY가 설정되지 않아 재무제표는 라벨이 표시된 샘플 데이터입니다.",
    liveTooltip: "OPENDART_API_KEY가 감지되어 실 OpenDART 재무 모드입니다.",
    notAdvice: "투자 자문 아님",
    sampleNotice:
      "재무제표는 샘플 데이터입니다(OpenDART 키 미설정). 주가·지수는 실제 시세이며 약 15분 지연됩니다. 투자 자문이 아닙니다.",
    krwUnit: "원",
    watch: "관심등록",
    watching: "관심종목",
    watchAdd: "관심종목에 추가",
    watchRemove: "관심종목에서 제거",
    quoteDelayed: "지연 시세",
    quoteSample: "샘플 시세",
    quoteUpdated: "갱신",
    quoteNote:
      "가격은 실제 시세이나 약 15분 지연됩니다(Yahoo Finance). 재무제표는 샘플 데이터입니다. 투자 자문이 아닙니다.",
  },
  lang: { ko: "한국어", en: "English", toggle: "언어" },
};

export const DICT: Record<Lang, Dict> = { en, ko };
export type Dictionary = Dict;
