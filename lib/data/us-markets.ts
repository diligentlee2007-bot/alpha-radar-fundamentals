/**
 * US / Nasdaq demo universe (price-only). No fundamentals are provided here — US
 * fundamentals are a future extension and must never be faked as real. Names are
 * static metadata; prices come from the live (delayed) Yahoo layer by ticker.
 */

import type { IndexQuote } from "@/lib/types";

export type UsKind = "stock" | "etf";

export interface UsInstrument {
  ticker: string;
  name: string;
  sector: string;
  kind: UsKind;
}

export const US_INSTRUMENTS: UsInstrument[] = [
  // 빅테크
  { ticker: "AAPL", name: "Apple", sector: "빅테크", kind: "stock" },
  { ticker: "MSFT", name: "Microsoft", sector: "빅테크", kind: "stock" },
  { ticker: "AMZN", name: "Amazon", sector: "빅테크", kind: "stock" },
  { ticker: "GOOGL", name: "Alphabet (Google)", sector: "빅테크", kind: "stock" },
  { ticker: "META", name: "Meta Platforms", sector: "빅테크", kind: "stock" },
  // 반도체
  { ticker: "NVDA", name: "NVIDIA", sector: "반도체", kind: "stock" },
  { ticker: "AMD", name: "AMD", sector: "반도체", kind: "stock" },
  { ticker: "AVGO", name: "Broadcom", sector: "반도체", kind: "stock" },
  { ticker: "TSM", name: "TSMC (ADR)", sector: "반도체", kind: "stock" },
  { ticker: "MU", name: "Micron", sector: "반도체", kind: "stock" },
  { ticker: "INTC", name: "Intel", sector: "반도체", kind: "stock" },
  { ticker: "QCOM", name: "Qualcomm", sector: "반도체", kind: "stock" },
  { ticker: "ASML", name: "ASML (ADR)", sector: "반도체", kind: "stock" },
  // 소프트웨어
  { ticker: "ORCL", name: "Oracle", sector: "소프트웨어", kind: "stock" },
  { ticker: "CRM", name: "Salesforce", sector: "소프트웨어", kind: "stock" },
  { ticker: "ADBE", name: "Adobe", sector: "소프트웨어", kind: "stock" },
  { ticker: "PLTR", name: "Palantir", sector: "소프트웨어", kind: "stock" },
  // 커뮤니케이션
  { ticker: "NFLX", name: "Netflix", sector: "커뮤니케이션", kind: "stock" },
  { ticker: "DIS", name: "Disney", sector: "커뮤니케이션", kind: "stock" },
  // 소비재
  { ticker: "TSLA", name: "Tesla", sector: "소비재", kind: "stock" },
  { ticker: "COST", name: "Costco", sector: "소비재", kind: "stock" },
  { ticker: "NKE", name: "Nike", sector: "소비재", kind: "stock" },
  { ticker: "MCD", name: "McDonald's", sector: "소비재", kind: "stock" },
  { ticker: "SBUX", name: "Starbucks", sector: "소비재", kind: "stock" },
  // 금융
  { ticker: "JPM", name: "JPMorgan Chase", sector: "금융", kind: "stock" },
  { ticker: "BAC", name: "Bank of America", sector: "금융", kind: "stock" },
  { ticker: "V", name: "Visa", sector: "금융", kind: "stock" },
  { ticker: "MA", name: "Mastercard", sector: "금융", kind: "stock" },
  { ticker: "BRK-B", name: "Berkshire Hathaway", sector: "금융", kind: "stock" },
  // 헬스케어
  { ticker: "LLY", name: "Eli Lilly", sector: "헬스케어", kind: "stock" },
  { ticker: "UNH", name: "UnitedHealth", sector: "헬스케어", kind: "stock" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "헬스케어", kind: "stock" },
  // 에너지·산업
  { ticker: "XOM", name: "ExxonMobil", sector: "에너지·산업", kind: "stock" },
  { ticker: "CVX", name: "Chevron", sector: "에너지·산업", kind: "stock" },
  { ticker: "BA", name: "Boeing", sector: "에너지·산업", kind: "stock" },
  { ticker: "CAT", name: "Caterpillar", sector: "에너지·산업", kind: "stock" },
  // ETF
  { ticker: "SPY", name: "SPDR S&P 500", sector: "ETF", kind: "etf" },
  { ticker: "QQQ", name: "Invesco QQQ (Nasdaq-100)", sector: "ETF", kind: "etf" },
  { ticker: "DIA", name: "SPDR Dow Jones", sector: "ETF", kind: "etf" },
  { ticker: "IWM", name: "iShares Russell 2000", sector: "ETF", kind: "etf" },
];

export const US_TICKERS = US_INSTRUMENTS.map((i) => i.ticker);

/** Ordered unique sector list for filter tabs. */
export const US_SECTORS = [...new Set(US_INSTRUMENTS.map((i) => i.sector))];

/**
 * Placeholder US index/FX cards shown immediately (labeled "sample") until the
 * live poll resolves, so the strip never renders blank. Values are approximate
 * and get replaced by live data within ~1s.
 */
const flat = (v: number): number[] => [v * 0.99, v * 0.995, v];

export const US_INDEX_FALLBACK: IndexQuote[] = [
  {
    id: "nasdaq",
    label: "NASDAQ",
    value: 17500,
    change: 0,
    changePct: 0,
    spark: flat(17500),
    unit: "",
    source: "sample",
  },
  {
    id: "sp500",
    label: "S&P 500",
    value: 5600,
    change: 0,
    changePct: 0,
    spark: flat(5600),
    unit: "",
    source: "sample",
  },
  {
    id: "dow",
    label: "Dow Jones",
    value: 41000,
    change: 0,
    changePct: 0,
    spark: flat(41000),
    unit: "",
    source: "sample",
  },
  {
    id: "russell2000",
    label: "Russell 2000",
    value: 2200,
    change: 0,
    changePct: 0,
    spark: flat(2200),
    unit: "",
    source: "sample",
  },
  {
    id: "usdkrw",
    label: "USD/KRW",
    value: 1380,
    change: 0,
    changePct: 0,
    spark: flat(1380),
    unit: "원",
    source: "sample",
  },
];
