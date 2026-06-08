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
  { ticker: "AAPL", name: "Apple", sector: "Technology", kind: "stock" },
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", kind: "stock" },
  { ticker: "NVDA", name: "NVIDIA", sector: "Semiconductors", kind: "stock" },
  { ticker: "AMZN", name: "Amazon", sector: "Consumer / Cloud", kind: "stock" },
  { ticker: "GOOGL", name: "Alphabet", sector: "Communication", kind: "stock" },
  { ticker: "META", name: "Meta Platforms", sector: "Communication", kind: "stock" },
  { ticker: "TSLA", name: "Tesla", sector: "Autos / EV", kind: "stock" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", sector: "Index ETF", kind: "etf" },
  { ticker: "QQQ", name: "Invesco QQQ (Nasdaq-100)", sector: "Index ETF", kind: "etf" },
];

export const US_TICKERS = US_INSTRUMENTS.map((i) => i.ticker);

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
