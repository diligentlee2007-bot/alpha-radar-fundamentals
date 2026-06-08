import type { DartReport } from "@/lib/data/opendart";
import { fetchDartFinancials } from "@/lib/data/opendart";
import { quoteFor } from "@/lib/data/series";
import { SEED_BY_CODE, STOCK_SEEDS } from "@/lib/data/stocks";
import type { Market, StockSeed } from "@/lib/types";

/**
 * Deterministic fundamentals engine. Derives 3-year financial statements and
 * core ratios for each seeded company, plus sector-relative valuation and a set
 * of mechanical risk flags. All values are generated from the ticker via a
 * seeded PRNG (stable across requests). This is the sample fallback used when no
 * OpenDART key is configured — see `opendart.ts` for the live seam.
 */

export interface YearFinancials {
  year: number;
  revenue: number;
  operatingProfit: number;
  netIncome: number;
  totalAssets: number;
  totalEquity: number;
  totalLiabilities: number;
}

export interface Ratios {
  roe: number;
  roa: number;
  operatingMargin: number;
  netMargin: number;
  debtRatio: number;
  currentRatio: number;
  eps: number;
  bps: number;
  per: number;
  pbr: number;
  dividendYield: number;
  revenueGrowth: number;
}

export type RiskFlag =
  | "highDebt"
  | "negativeGrowth"
  | "lowMargin"
  | "highValuation"
  | "lowLiquidity"
  | "limited";

export type Stance = "discount" | "premium" | "inline";

export interface Valuation {
  per: number;
  pbr: number;
  sectorPer: number;
  sectorPbr: number;
  perStance: Stance;
  pbrStance: Stance;
}

export interface CompanyFundamentals {
  code: string;
  name: string;
  market: Market;
  sector: string;
  price: number;
  marketCap: number;
  financials: YearFinancials[]; // ascending by year (oldest first)
  ratios: Ratios;
  valuation: Valuation;
  risks: RiskFlag[];
}

interface SectorProfile {
  per: number;
  pbr: number;
  netMargin: number; // %
  opMargin: number; // %
  debtRatio: number; // %
  currentRatio: number; // %
  divYield: number; // %
  growth: number; // % YoY
}

const DEFAULT_PROFILE: SectorProfile = {
  per: 14,
  pbr: 1.2,
  netMargin: 7,
  opMargin: 10,
  debtRatio: 90,
  currentRatio: 150,
  divYield: 1.5,
  growth: 6,
};

const SECTOR_PROFILES: Record<string, Partial<SectorProfile>> = {
  반도체: { per: 16, pbr: 1.6, netMargin: 17, opMargin: 22, growth: 12, currentRatio: 200 },
  "2차전지": { per: 30, pbr: 2.8, netMargin: 6, opMargin: 8, debtRatio: 120, growth: 18 },
  "2차전지소재": { per: 34, pbr: 3.2, netMargin: 5, opMargin: 7, debtRatio: 130, growth: 20 },
  바이오: { per: 40, pbr: 4, netMargin: 12, opMargin: 16, growth: 16, currentRatio: 220 },
  자동차: { per: 5, pbr: 0.7, netMargin: 7, opMargin: 9, divYield: 3, growth: 5 },
  자동차부품: { per: 7, pbr: 0.8, netMargin: 6, opMargin: 8, divYield: 2.5, growth: 4 },
  인터넷: { per: 25, pbr: 2.5, netMargin: 12, opMargin: 15, growth: 10 },
  철강: { per: 8, pbr: 0.5, netMargin: 5, opMargin: 7, divYield: 3, growth: -2 },
  화학: { per: 12, pbr: 0.9, netMargin: 5, opMargin: 7, growth: 2 },
  금융: { per: 6, pbr: 0.5, netMargin: 24, opMargin: 30, debtRatio: 120, divYield: 4, growth: 4 },
  정유: { per: 7, pbr: 0.8, netMargin: 4, opMargin: 6, divYield: 3, growth: 0 },
  전력: { per: 10, pbr: 0.4, netMargin: 3, opMargin: 6, debtRatio: 210, growth: 1 },
  통신: { per: 9, pbr: 0.9, netMargin: 7, opMargin: 11, divYield: 4, growth: 2 },
  비철금속: { per: 12, pbr: 1, netMargin: 6, opMargin: 8, growth: 3 },
  해운: { per: 5, pbr: 0.6, netMargin: 10, opMargin: 12, growth: -10 },
  전자부품: { per: 13, pbr: 1.5, netMargin: 8, opMargin: 11, growth: 7 },
  가전: { per: 9, pbr: 0.9, netMargin: 4, opMargin: 6, growth: 3 },
  지주: { per: 8, pbr: 0.6, netMargin: 9, opMargin: 12, divYield: 3, growth: 3 },
  IT서비스: { per: 15, pbr: 1.8, netMargin: 9, opMargin: 12, growth: 7 },
  화장품: { per: 20, pbr: 2, netMargin: 8, opMargin: 11, growth: 8 },
  게임: { per: 18, pbr: 2, netMargin: 15, opMargin: 18, growth: 6 },
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

function jitter(rng: () => number, base: number, spread = 0.15): number {
  return base * (1 + (rng() - 0.5) * 2 * spread);
}

const YEARS = [2023, 2024, 2025];

function buildCore(code: string): Omit<CompanyFundamentals, "valuation" | "risks"> | null {
  const seed = SEED_BY_CODE.get(code);
  const quote = quoteFor(code);
  if (!seed || !quote) return null;

  const rng = mulberry32(hashString(`${code}:fund`));
  const profile: SectorProfile = { ...DEFAULT_PROFILE, ...SECTOR_PROFILES[seed.sector] };

  const per = Math.max(3, jitter(rng, profile.per));
  const pbr = Math.max(0.2, jitter(rng, profile.pbr));
  const netMargin = Math.max(1, jitter(rng, profile.netMargin)) / 100;
  const opMargin = Math.max(netMargin * 100 + 1, jitter(rng, profile.opMargin)) / 100;
  const debtRatio = Math.max(15, jitter(rng, profile.debtRatio));
  const currentRatio = Math.max(50, jitter(rng, profile.currentRatio));
  const divYield = Math.max(0, jitter(rng, profile.divYield, 0.5));
  const growth = jitter(rng, profile.growth, 0.4) / 100;

  const marketCap = quote.marketCap;
  const netIncomeLatest = marketCap / per;
  const equityLatest = marketCap / pbr;
  const revenueLatest = netIncomeLatest / netMargin;

  // Build 3 years (oldest → latest) by scaling backwards with growth + drift.
  const financials: YearFinancials[] = YEARS.map((year, i) => {
    const stepsBack = YEARS.length - 1 - i;
    const g = (1 + growth) ** stepsBack;
    const marginDrift = 1 + (stepsBack === 0 ? 0 : (rng() - 0.5) * 0.1);
    const revenue = revenueLatest / g;
    const netIncome = revenue * netMargin * marginDrift;
    const operatingProfit = revenue * opMargin * marginDrift;
    const totalEquity = equityLatest / (1 + growth * 0.6 * stepsBack);
    const totalAssets = totalEquity * (1 + debtRatio / 100);
    return {
      year,
      revenue: Math.round(revenue),
      operatingProfit: Math.round(operatingProfit),
      netIncome: Math.round(netIncome),
      totalAssets: Math.round(totalAssets),
      totalEquity: Math.round(totalEquity),
      totalLiabilities: Math.round(totalAssets - totalEquity),
    };
  });

  const latest = financials[financials.length - 1];
  const prev = financials[financials.length - 2];
  if (!latest || !prev) return null;

  const eps = latest.netIncome / seed.sharesOut;
  const bps = latest.totalEquity / seed.sharesOut;
  const ratios: Ratios = {
    roe: (latest.netIncome / latest.totalEquity) * 100,
    roa: (latest.netIncome / latest.totalAssets) * 100,
    operatingMargin: (latest.operatingProfit / latest.revenue) * 100,
    netMargin: (latest.netIncome / latest.revenue) * 100,
    debtRatio: (latest.totalLiabilities / latest.totalEquity) * 100,
    currentRatio,
    eps,
    bps,
    per: quote.price / eps,
    pbr: quote.price / bps,
    dividendYield: divYield,
    revenueGrowth: (latest.revenue / prev.revenue - 1) * 100,
  };

  return {
    code: seed.code,
    name: seed.name,
    market: seed.market,
    sector: seed.sector,
    price: quote.price,
    marketCap,
    financials,
    ratios,
  };
}

function stance(value: number, ref: number): Stance {
  if (value < ref * 0.9) return "discount";
  if (value > ref * 1.1) return "premium";
  return "inline";
}

function deriveRisks(r: Ratios): RiskFlag[] {
  const flags: RiskFlag[] = [];
  if (r.debtRatio > 150) flags.push("highDebt");
  if (r.revenueGrowth < 0) flags.push("negativeGrowth");
  if (r.netMargin < 3) flags.push("lowMargin");
  if (r.per > 30) flags.push("highValuation");
  if (r.currentRatio < 100) flags.push("lowLiquidity");
  return flags.length ? flags : ["limited"];
}

let cache: CompanyFundamentals[] | null = null;

/** All companies' fundamentals (computed once, with sector-relative valuation). */
export function allFundamentals(): CompanyFundamentals[] {
  if (cache) return cache;

  const cores = STOCK_SEEDS.map((s) => buildCore(s.code)).filter(
    (c): c is NonNullable<ReturnType<typeof buildCore>> => c !== null,
  );

  // Sector average PER/PBR for valuation context.
  const sectorAgg = new Map<string, { per: number; pbr: number; n: number }>();
  for (const c of cores) {
    const cur = sectorAgg.get(c.sector) ?? { per: 0, pbr: 0, n: 0 };
    cur.per += c.ratios.per;
    cur.pbr += c.ratios.pbr;
    cur.n += 1;
    sectorAgg.set(c.sector, cur);
  }

  cache = cores.map((c) => {
    const agg = sectorAgg.get(c.sector);
    const sectorPer = agg ? agg.per / agg.n : c.ratios.per;
    const sectorPbr = agg ? agg.pbr / agg.n : c.ratios.pbr;
    return {
      ...c,
      valuation: {
        per: c.ratios.per,
        pbr: c.ratios.pbr,
        sectorPer,
        sectorPbr,
        perStance: stance(c.ratios.per, sectorPer),
        pbrStance: stance(c.ratios.pbr, sectorPbr),
      },
      risks: deriveRisks(c.ratios),
    };
  });

  return cache;
}

export function companyFundamentals(code: string): CompanyFundamentals | null {
  return allFundamentals().find((c) => c.code === code) ?? null;
}

/**
 * Re-derive the price-dependent figures (market cap, PER, PBR, valuation stance)
 * from a live price, keeping trailing EPS/BPS from the sample/filed fundamentals.
 * This is the standard "live price ÷ trailing earnings" methodology, so the
 * displayed price, PER, PBR, and market cap stay internally consistent.
 */
export function withLivePrice(f: CompanyFundamentals, price: number): CompanyFundamentals {
  if (!price || price <= 0 || !f.price) return f;
  const shares = f.marketCap / f.price;
  const per = f.ratios.eps ? price / f.ratios.eps : f.ratios.per;
  const pbr = f.ratios.bps ? price / f.ratios.bps : f.ratios.pbr;
  return {
    ...f,
    price,
    marketCap: Math.round(price * shares),
    ratios: { ...f.ratios, per, pbr },
    valuation: {
      ...f.valuation,
      per,
      pbr,
      perStance: stance(per, f.valuation.sectorPer),
      pbrStance: stance(pbr, f.valuation.sectorPbr),
    },
  };
}

/** Codes for a few notable large caps used in the home demo. */
/** Build CompanyFundamentals from real OpenDART financials (price-dependent
 *  fields use a sample reference price and are re-derived live via withLivePrice). */
function buildFromReport(seed: StockSeed, report: DartReport): CompanyFundamentals | null {
  const financials = report.financials;
  const latest = financials.at(-1);
  const prev = financials.at(-2);
  if (
    !latest ||
    !prev ||
    latest.totalEquity === 0 ||
    latest.totalAssets === 0 ||
    latest.revenue === 0
  ) {
    return null;
  }

  const sample = companyFundamentals(seed.code); // refs: price, sector avg, dividend
  const refPrice = sample?.price ?? 0;
  const shares = seed.sharesOut;
  const eps = latest.netIncome / shares;
  const bps = latest.totalEquity / shares;
  const currentRatio =
    report.currentAssets && report.currentLiabilities
      ? (report.currentAssets / report.currentLiabilities) * 100
      : (sample?.ratios.currentRatio ?? 100);

  const ratios: Ratios = {
    roe: (latest.netIncome / latest.totalEquity) * 100,
    roa: (latest.netIncome / latest.totalAssets) * 100,
    operatingMargin: (latest.operatingProfit / latest.revenue) * 100,
    netMargin: (latest.netIncome / latest.revenue) * 100,
    debtRatio: (latest.totalLiabilities / latest.totalEquity) * 100,
    currentRatio,
    eps,
    bps,
    per: refPrice && eps ? refPrice / eps : (sample?.ratios.per ?? 0),
    pbr: refPrice && bps ? refPrice / bps : (sample?.ratios.pbr ?? 0),
    dividendYield: sample?.ratios.dividendYield ?? 0, // not in this statement endpoint
    revenueGrowth: prev.revenue ? (latest.revenue / prev.revenue - 1) * 100 : 0,
  };

  const sectorPer = sample?.valuation.sectorPer ?? ratios.per;
  const sectorPbr = sample?.valuation.sectorPbr ?? ratios.pbr;

  return {
    code: seed.code,
    name: seed.name,
    market: seed.market,
    sector: seed.sector,
    price: refPrice,
    marketCap: Math.round(refPrice * shares),
    financials,
    ratios,
    valuation: {
      per: ratios.per,
      pbr: ratios.pbr,
      sectorPer,
      sectorPbr,
      perStance: stance(ratios.per, sectorPer),
      pbrStance: stance(ratios.pbr, sectorPbr),
    },
    risks: deriveRisks(ratios),
  };
}

export interface FundamentalsResult {
  data: CompanyFundamentals;
  source: "live" | "sample";
}

/**
 * Resolve a company's fundamentals, preferring real OpenDART data and falling
 * back to the labeled deterministic sample on any miss (no key, no corp_code
 * mapping, fetch failure, or insufficient data). Returns the source per company.
 */
export async function getCompanyFundamentals(code: string): Promise<FundamentalsResult | null> {
  const seed = SEED_BY_CODE.get(code);
  if (!seed) return null;
  try {
    const report = await fetchDartFinancials(code);
    if (report) {
      const built = buildFromReport(seed, report);
      if (built) return { data: built, source: "live" };
    }
  } catch {
    // fall through to sample
  }
  const sample = companyFundamentals(code);
  return sample ? { data: sample, source: "sample" } : null;
}

export const FEATURED_CODES = ["005930", "000660", "035420", "005380", "247540"];
