import { z } from "zod";

export const MarketEnum = z.enum(["KOSPI", "KOSDAQ"]);
export type Market = z.infer<typeof MarketEnum>;

/** A seed record describing a single listed stock. */
export const StockSeedSchema = z.object({
  code: z.string(), // 6-digit ticker, e.g. "005930"
  name: z.string(), // 삼성전자
  market: MarketEnum,
  sector: z.string(), // 반도체, 2차전지, ...
  basePrice: z.number(), // anchor price (KRW)
  sharesOut: z.number(), // shares outstanding (for market cap)
});
export type StockSeed = z.infer<typeof StockSeedSchema>;

/** One OHLC bar in a price series. */
export const BarSchema = z.object({
  t: z.string(), // ISO timestamp / date label
  o: z.number(),
  h: z.number(),
  l: z.number(),
  c: z.number(),
  v: z.number(), // volume (shares)
});
export type Bar = z.infer<typeof BarSchema>;

/** A live-style quote derived from the latest bars. */
export const QuoteSchema = z.object({
  code: z.string(),
  name: z.string(),
  market: MarketEnum,
  sector: z.string(),
  price: z.number(), // current price (KRW)
  prevClose: z.number(),
  change: z.number(), // price delta
  changePct: z.number(), // percent delta
  open: z.number(),
  high: z.number(),
  low: z.number(),
  volume: z.number(), // today's volume (shares)
  value: z.number(), // today's traded value (KRW) ~ volume * price
  marketCap: z.number(), // KRW
  high52: z.number(),
  low52: z.number(),
  spark: z.array(z.number()), // ~30d closing sparkline
});
export type Quote = z.infer<typeof QuoteSchema>;

export const PeriodEnum = z.enum(["1D", "1W", "1M", "3M", "1Y"]);
export type Period = z.infer<typeof PeriodEnum>;

/** A market index card (지수) or FX rate. */
export const IndexQuoteSchema = z.object({
  id: z.string(), // kospi, kosdaq, kospi200, usdkrw
  label: z.string(),
  value: z.number(),
  change: z.number(),
  changePct: z.number(),
  spark: z.array(z.number()),
  unit: z.string(), // "" for points, "원" for FX
});
export type IndexQuote = z.infer<typeof IndexQuoteSchema>;

export const SectorStatSchema = z.object({
  sector: z.string(),
  changePct: z.number(),
  marketCap: z.number(),
  count: z.number(),
});
export type SectorStat = z.infer<typeof SectorStatSchema>;
