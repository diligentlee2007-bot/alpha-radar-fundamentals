import { SEED_BY_CODE } from "@/lib/data/stocks";
import type { Bar, IndexQuote, Period } from "@/lib/types";

/**
 * Live (delayed) quote fetcher using Yahoo Finance's public chart endpoint.
 * No API key, no extra package — just `fetch`. Every call is wrapped so any
 * failure (network, rate-limit, unknown symbol) falls back silently and the UI
 * keeps showing the labeled deterministic sample price instead. Quotes are
 * ~15-min delayed and provided for an educational portfolio demo only.
 */

export interface LiveQuote {
  code: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  time: number; // epoch ms of the market data
}

export interface LiveResult {
  source: "live" | "sample";
  quotes: Record<string, LiveQuote>;
  fetchedAt: number; // epoch ms when we fetched (server clock)
}

/** Yahoo symbol for a KR ticker: KOSPI → .KS, KOSDAQ → .KQ. */
function yahooSymbol(code: string): string | null {
  const seed = SEED_BY_CODE.get(code);
  if (!seed) return null;
  return `${code}.${seed.market === "KOSPI" ? "KS" : "KQ"}`;
}

const CACHE_TTL_MS = 30_000;
type QuoteFields = Omit<LiveQuote, "code">;
const cache = new Map<string, { q: QuoteFields; at: number }>();

/** Fetch one quote by raw Yahoo symbol (works for KR `.KS`/`.KQ` and US tickers). */
async function fetchSymbol(symbol: string, now: number): Promise<QuoteFields | null> {
  const cached = cache.get(symbol);
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.q;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) return cached?.q ?? null;
    const json = (await res.json()) as {
      chart?: { result?: { meta?: Record<string, number> }[] };
    };
    const meta = json.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
    if (typeof price !== "number" || typeof prevClose !== "number" || prevClose === 0) {
      return cached?.q ?? null;
    }
    const change = price - prevClose;
    const q: QuoteFields = {
      price,
      prevClose,
      change,
      changePct: (change / prevClose) * 100,
      dayHigh: meta?.regularMarketDayHigh ?? price,
      dayLow: meta?.regularMarketDayLow ?? price,
      volume: meta?.regularMarketVolume ?? 0,
      time: (meta?.regularMarketTime ?? 0) * 1000,
    };
    cache.set(symbol, { q, at: now });
    return q;
  } catch {
    return cached?.q ?? null; // fall back to last good value, else null → sample
  } finally {
    clearTimeout(timeout);
  }
}

const PERIOD_MAP: Record<Period, { range: string; interval: string; intraday: boolean }> = {
  "1D": { range: "1d", interval: "5m", intraday: true },
  "1W": { range: "5d", interval: "30m", intraday: true },
  "1M": { range: "1mo", interval: "1d", intraday: false },
  "3M": { range: "3mo", interval: "1d", intraday: false },
  "1Y": { range: "1y", interval: "1d", intraday: false },
};

const seriesCache = new Map<string, { bars: Bar[]; at: number }>();
const SERIES_TTL_MS = 60_000;

function labelFor(tsSeconds: number, intraday: boolean): string {
  const date = new Date(tsSeconds * 1000);
  if (intraday) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    });
  }
  return date.toISOString().slice(0, 10);
}

/**
 * Fetch a real historical price series for a stock + period (Yahoo). Returns
 * null on any failure so callers fall back to the sample series.
 */
export async function getLiveSeries(code: string, period: Period): Promise<Bar[] | null> {
  const symbol = yahooSymbol(code);
  if (!symbol) return null;
  const cacheKey = `${code}:${period}`;
  const cached = seriesCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.at < SERIES_TTL_MS) return cached.bars;

  const { range, interval, intraday } = PERIOD_MAP[period];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) return cached?.bars ?? null;
    const json = (await res.json()) as {
      chart?: {
        result?: {
          timestamp?: number[];
          indicators?: {
            quote?: {
              open?: (number | null)[];
              high?: (number | null)[];
              low?: (number | null)[];
              close?: (number | null)[];
              volume?: (number | null)[];
            }[];
          };
        }[];
      };
    };
    const r = json.chart?.result?.[0];
    const ts = r?.timestamp;
    const quote = r?.indicators?.quote?.[0];
    if (!ts || !quote?.close) return cached?.bars ?? null;
    const bars: Bar[] = [];
    for (let i = 0; i < ts.length; i++) {
      const c = quote.close[i];
      if (typeof c !== "number") continue; // skip gaps
      bars.push({
        t: labelFor(ts[i] as number, intraday),
        o: quote.open?.[i] ?? c,
        h: quote.high?.[i] ?? c,
        l: quote.low?.[i] ?? c,
        c,
        v: quote.volume?.[i] ?? 0,
      });
    }
    if (bars.length < 2) return cached?.bars ?? null;
    seriesCache.set(cacheKey, { bars, at: now });
    return bars;
  } catch {
    return cached?.bars ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

// ---- Indices & FX (KOSPI / KOSDAQ / KOSPI 200 / USD-KRW) -------------------

interface IndexConfig {
  id: string;
  label: string;
  symbol: string;
  unit: string;
}

const KR_INDEX_SYMBOLS: IndexConfig[] = [
  { id: "kospi", label: "KOSPI", symbol: "^KS11", unit: "" },
  { id: "kosdaq", label: "KOSDAQ", symbol: "^KQ11", unit: "" },
  { id: "kospi200", label: "KOSPI 200", symbol: "^KS200", unit: "" },
  { id: "usdkrw", label: "USD/KRW", symbol: "KRW=X", unit: "원" },
];

const US_INDEX_SYMBOLS: IndexConfig[] = [
  { id: "nasdaq", label: "NASDAQ", symbol: "^IXIC", unit: "" },
  { id: "sp500", label: "S&P 500", symbol: "^GSPC", unit: "" },
  { id: "dow", label: "Dow Jones", symbol: "^DJI", unit: "" },
  { id: "russell2000", label: "Russell 2000", symbol: "^RUT", unit: "" },
  { id: "usdkrw", label: "USD/KRW", symbol: "KRW=X", unit: "원" },
];

const indexCache = new Map<string, { q: IndexQuote; at: number }>();

async function fetchIndex(cfg: IndexConfig, now: number): Promise<IndexQuote | null> {
  const cached = indexCache.get(cfg.id);
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.q;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // range=1d gives the correct *daily* previous close (chartPreviousClose);
    // a multi-day range would make chartPreviousClose the start-of-range close
    // and the day change wrong. interval=5m also yields an intraday sparkline.
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.symbol)}?interval=5m&range=1d`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) return cached?.q ?? null;
    const json = (await res.json()) as {
      chart?: {
        result?: {
          meta?: Record<string, number>;
          indicators?: { quote?: { close?: (number | null)[] }[] };
        }[];
      };
    };
    const r = json.chart?.result?.[0];
    const meta = r?.meta;
    const value = meta?.regularMarketPrice;
    const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
    if (typeof value !== "number" || typeof prevClose !== "number" || prevClose === 0) {
      return cached?.q ?? null;
    }
    const closes = (r?.indicators?.quote?.[0]?.close ?? []).filter(
      (c): c is number => typeof c === "number",
    );
    // Build a ~30-point sparkline from today's intraday closes (evenly sampled).
    const step = Math.max(1, Math.ceil(closes.length / 30));
    const spark = closes.filter((_, i) => i % step === 0);
    if (spark.length) spark[spark.length - 1] = value;
    else spark.push(prevClose, value);
    const change = value - prevClose;
    const q: IndexQuote = {
      id: cfg.id,
      label: cfg.label,
      value,
      change,
      changePct: (change / prevClose) * 100,
      spark: spark.length >= 2 ? spark : [prevClose, value],
      unit: cfg.unit,
      source: "live",
    };
    indexCache.set(cfg.id, { q, at: now });
    return q;
  } catch {
    return cached?.q ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

export interface LiveIndexResult {
  source: "live" | "sample";
  indices: IndexQuote[];
  fetchedAt: number;
}

/**
 * Live (delayed) index + FX cards. Each card resolves independently; any that
 * fail fall back to the provided sample card (tagged source:"sample") so the UI
 * never silently shows a stale value as if it were real.
 */
async function fetchIndices(
  configs: IndexConfig[],
  fallback: IndexQuote[],
): Promise<LiveIndexResult> {
  const now = Date.now();
  const fbById = new Map(fallback.map((f) => [f.id, f]));
  const results = await Promise.all(configs.map((cfg) => fetchIndex(cfg, now)));

  let anyLive = false;
  const indices: IndexQuote[] = [];
  configs.forEach((cfg, i) => {
    const live = results[i];
    if (live) {
      anyLive = true;
      indices.push(live);
    } else {
      const fb = fbById.get(cfg.id);
      if (fb) indices.push({ ...fb, source: "sample" });
    }
  });

  return { source: anyLive ? "live" : "sample", indices, fetchedAt: now };
}

/** Korea indices + FX (sample fallback per card). */
export function getLiveIndices(fallback: IndexQuote[]): Promise<LiveIndexResult> {
  return fetchIndices(KR_INDEX_SYMBOLS, fallback);
}

/** US indices + FX (live only; failed cards are omitted — no stale fallback). */
export function getUsIndices(): Promise<LiveIndexResult> {
  return fetchIndices(US_INDEX_SYMBOLS, []);
}

/** Fetch live quotes for KR codes (mapped to .KS/.KQ symbols). */
export async function getLiveQuotes(codes: string[]): Promise<LiveResult> {
  const now = Date.now();
  const results = await Promise.all(
    codes.map(async (code) => {
      const symbol = yahooSymbol(code);
      if (!symbol) return null;
      const q = await fetchSymbol(symbol, now);
      return q ? { ...q, code } : null;
    }),
  );
  return packQuotes(results, now);
}

/** Fetch live quotes by raw Yahoo symbol (e.g. US tickers AAPL, SPY). */
export async function getSymbolQuotes(symbols: string[]): Promise<LiveResult> {
  const now = Date.now();
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const q = await fetchSymbol(symbol, now);
      return q ? { ...q, code: symbol } : null;
    }),
  );
  return packQuotes(results, now);
}

// ---- Overnight news headlines (free Yahoo search) -------------------------

export interface NewsItem {
  symbol: string;
  title: string;
  publisher: string;
  link: string;
  time: number; // epoch ms
}

const newsCache = new Map<string, { items: NewsItem[]; at: number }>();
const NEWS_TTL_MS = 300_000;

async function fetchNews(symbol: string, now: number): Promise<NewsItem[]> {
  const cached = newsCache.get(symbol);
  if (cached && now - cached.at < NEWS_TTL_MS) return cached.items;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&newsCount=4&quotesCount=0&enableFuzzyQuery=false`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) return cached?.items ?? [];
    const json = (await res.json()) as {
      news?: { title?: string; publisher?: string; link?: string; providerPublishTime?: number }[];
    };
    const items: NewsItem[] = (json.news ?? [])
      .filter((n) => n.title && n.link)
      .slice(0, 2)
      .map((n) => ({
        symbol,
        title: n.title as string,
        publisher: n.publisher ?? "",
        link: n.link as string,
        time: (n.providerPublishTime ?? 0) * 1000,
      }));
    newsCache.set(symbol, { items, at: now });
    return items;
  } catch {
    return cached?.items ?? [];
  } finally {
    clearTimeout(timeout);
  }
}

/** Aggregate recent headlines for the given symbols (deduped, newest first). */
export async function getNews(symbols: string[]): Promise<NewsItem[]> {
  const now = Date.now();
  const lists = await Promise.all(symbols.slice(0, 6).map((s) => fetchNews(s, now)));
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const item of lists.flat().sort((a, b) => b.time - a.time)) {
    if (seen.has(item.title)) continue;
    seen.add(item.title);
    out.push(item);
    if (out.length >= 5) break;
  }
  return out;
}

function packQuotes(results: (LiveQuote | null)[], now: number): LiveResult {
  const quotes: Record<string, LiveQuote> = {};
  for (const q of results) {
    if (q) quotes[q.code] = q;
  }
  return {
    source: Object.keys(quotes).length > 0 ? "live" : "sample",
    quotes,
    fetchedAt: now,
  };
}
