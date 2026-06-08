import { SEED_BY_CODE, STOCK_SEEDS } from "@/lib/data/stocks";
import type { Bar, IndexQuote, Period, Quote, SectorStat, StockSeed } from "@/lib/types";

/**
 * Deterministic mock market engine. Everything derives from a stock's code via a
 * seeded PRNG, so server and client always agree (no hydration drift) and the
 * data is stable across requests. Replace these functions with a real data
 * source (한국투자증권/네이버/KRX) behind the same return types when keys exist.
 */

/** Latest trading day the dataset is anchored to (fixed for determinism). */
const MARKET_DATE = new Date("2026-06-05T15:30:00+09:00");
const TRADING_DAYS_1Y = 248;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small fast deterministic PRNG. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approx Gaussian via sum of uniforms. */
function gauss(rng: () => number): number {
  return (rng() + rng() + rng() + rng() - 2) / 1.5;
}

/** Round to a sensible KRW tick. */
function tick(price: number): number {
  if (price >= 500000) return Math.round(price / 1000) * 1000;
  if (price >= 100000) return Math.round(price / 500) * 500;
  if (price >= 50000) return Math.round(price / 100) * 100;
  if (price >= 10000) return Math.round(price / 50) * 50;
  if (price >= 5000) return Math.round(price / 10) * 10;
  if (price >= 1000) return Math.round(price / 5) * 5;
  return Math.round(price);
}

function dateMinusDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Generate `count` daily OHLC bars ending on MARKET_DATE for a stock.
 * Mean-reverting random walk anchored around basePrice with per-stock volatility.
 */
export function dailyBars(seed: StockSeed, count = TRADING_DAYS_1Y): Bar[] {
  const rng = mulberry32(hashString(seed.code));
  const vol = 0.012 + (hashString(`${seed.code}v`) % 100) / 4000; // 1.2%–3.7%
  const drift = (gauss(rng) * 0.0004) | 0; // tiny per-stock drift
  const bars: Bar[] = [];
  let price = seed.basePrice * (0.82 + rng() * 0.12); // start somewhat below anchor

  for (let i = 0; i < count; i++) {
    const ret = gauss(rng) * vol + drift + (seed.basePrice - price) / seed.basePrice / 60;
    const close = Math.max(price * (1 + ret), seed.basePrice * 0.4);
    const o = price;
    const c = close;
    const wiggle = Math.abs(gauss(rng)) * vol * 0.6;
    const h = Math.max(o, c) * (1 + wiggle);
    const l = Math.min(o, c) * (1 - wiggle);
    const baseVol = seed.sharesOut * (0.0008 + rng() * 0.0025);
    bars.push({
      t: dateMinusDays(MARKET_DATE, count - 1 - i),
      o: tick(o),
      h: tick(h),
      l: tick(l),
      c: tick(c),
      v: Math.round(baseVol),
    });
    price = close;
  }
  return bars;
}

/** Intraday 1D series (KRX 09:00–15:30, ~5-min bars) bridging prevClose→close. */
function intradayBars(seed: StockSeed): Bar[] {
  const all = dailyBars(seed);
  const last = all[all.length - 1];
  const prev = all[all.length - 2] ?? last;
  if (!last || !prev) return [];
  const rng = mulberry32(hashString(`${seed.code}intra`));
  const steps = 78; // 6.5h / 5min
  const bars: Bar[] = [];
  const start = prev.c;
  const end = last.c;
  let price = start;
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    const target = start + (end - start) * progress;
    const noise = gauss(rng) * start * 0.0025;
    const c = i === steps - 1 ? end : Math.max(target + noise, start * 0.7);
    const o = price;
    const hh = Math.max(o, c) * (1 + Math.abs(gauss(rng)) * 0.0015);
    const ll = Math.min(o, c) * (1 - Math.abs(gauss(rng)) * 0.0015);
    const hour = 9 + Math.floor((i * 5) / 60);
    const minute = (i * 5) % 60;
    bars.push({
      t: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      o: tick(o),
      h: tick(hh),
      l: tick(ll),
      c: tick(c),
      v: Math.round(seed.sharesOut * 0.00003 * (0.5 + rng())),
    });
    price = c;
  }
  return bars;
}

const PERIOD_DAYS: Record<Exclude<Period, "1D">, number> = {
  "1W": 5,
  "1M": 22,
  "3M": 66,
  "1Y": TRADING_DAYS_1Y,
};

/** Public: get a price series for a stock + period. */
export function seriesFor(code: string, period: Period): Bar[] {
  const seed = SEED_BY_CODE.get(code);
  if (!seed) return [];
  if (period === "1D") return intradayBars(seed);
  const all = dailyBars(seed);
  return all.slice(-PERIOD_DAYS[period]);
}

/** Public: derive a full quote for one stock. */
export function quoteFor(code: string): Quote | null {
  const seed = SEED_BY_CODE.get(code);
  if (!seed) return null;
  const bars = dailyBars(seed);
  const last = bars[bars.length - 1];
  const prev = bars[bars.length - 2] ?? last;
  if (!last || !prev) return null;
  const closes = bars.map((b) => b.c);
  const price = last.c;
  const prevClose = prev.c;
  const change = price - prevClose;
  const changePct = (change / prevClose) * 100;
  return {
    code: seed.code,
    name: seed.name,
    market: seed.market,
    sector: seed.sector,
    price,
    prevClose,
    change,
    changePct,
    open: last.o,
    high: last.h,
    low: last.l,
    volume: last.v,
    value: Math.round(last.v * price),
    marketCap: Math.round(price * seed.sharesOut),
    high52: Math.max(...closes),
    low52: Math.min(...closes),
    spark: closes.slice(-30),
  };
}

/** Public: quotes for all seeded stocks. */
export function allQuotes(): Quote[] {
  return STOCK_SEEDS.map((s) => quoteFor(s.code)).filter((q): q is Quote => q !== null);
}

/** Derive an index from a basket (cap-weighted average % move) + synthetic level. */
function deriveIndex(
  id: string,
  label: string,
  level: number,
  members: Quote[],
  sparkSeedKey: string,
): IndexQuote {
  const totalCap = members.reduce((s, q) => s + q.marketCap, 0) || 1;
  const weightedPct = members.reduce((s, q) => s + q.changePct * (q.marketCap / totalCap), 0);
  const change = (level * weightedPct) / 100;
  const rng = mulberry32(hashString(sparkSeedKey));
  const spark: number[] = [];
  let v = level - change;
  for (let i = 0; i < 30; i++) {
    v += gauss(rng) * level * 0.003 + change / 30;
    spark.push(Number(v.toFixed(2)));
  }
  spark[spark.length - 1] = level;
  return { id, label, value: level, change, changePct: weightedPct, spark, unit: "" };
}

/** Public: market index + FX cards. */
export function marketIndices(): IndexQuote[] {
  const quotes = allQuotes();
  const kospi = quotes.filter((q) => q.market === "KOSPI");
  const kosdaq = quotes.filter((q) => q.market === "KOSDAQ");
  const kospi200 = [...kospi].sort((a, b) => b.marketCap - a.marketCap).slice(0, 30);

  const indices: IndexQuote[] = [
    deriveIndex("kospi", "KOSPI", 2734.36, kospi, "kospi"),
    deriveIndex("kosdaq", "KOSDAQ", 845.12, kosdaq, "kosdaq"),
    deriveIndex("kospi200", "KOSPI 200", 367.84, kospi200, "kospi200"),
  ];

  // USD/KRW FX
  const fxRng = mulberry32(hashString("usdkrw"));
  const fxLevel = 1368.5;
  const fxPct = gauss(fxRng) * 0.4;
  const fxChange = (fxLevel * fxPct) / 100;
  const fxSpark: number[] = [];
  let fv = fxLevel - fxChange;
  for (let i = 0; i < 30; i++) {
    fv += gauss(fxRng) * fxLevel * 0.002 + fxChange / 30;
    fxSpark.push(Number(fv.toFixed(2)));
  }
  fxSpark[fxSpark.length - 1] = fxLevel;
  indices.push({
    id: "usdkrw",
    label: "USD/KRW",
    value: fxLevel,
    change: fxChange,
    changePct: fxPct,
    spark: fxSpark,
    unit: "원",
  });

  return indices;
}

/** Public: per-sector aggregate stats. */
export function sectorStats(): SectorStat[] {
  const quotes = allQuotes();
  const map = new Map<string, { pctCap: number; cap: number; count: number }>();
  for (const q of quotes) {
    const cur = map.get(q.sector) ?? { pctCap: 0, cap: 0, count: 0 };
    cur.pctCap += q.changePct * q.marketCap;
    cur.cap += q.marketCap;
    cur.count += 1;
    map.set(q.sector, cur);
  }
  return [...map.entries()]
    .map(([sector, v]) => ({
      sector,
      changePct: v.cap ? v.pctCap / v.cap : 0,
      marketCap: v.cap,
      count: v.count,
    }))
    .sort((a, b) => b.marketCap - a.marketCap);
}

export const MARKET_DATE_LABEL = "2026-06-05";
