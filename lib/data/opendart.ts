import { corpCodeFor } from "@/lib/data/dart-corp-codes";
import type { YearFinancials } from "@/lib/data/fundamentals";

/**
 * OpenDART (전자공시) integration. When `OPENDART_API_KEY` is set, this fetches
 * real filed financial statements; otherwise callers fall back to clearly-labeled
 * sample data. We never hardcode or print the key, and never call paid services.
 *
 * API: fnlttSinglAcntAll (단일회사 전체 재무제표). Keyed by corp_code (see
 * dart-corp-codes.ts), per business year + report code, with a CFS→OFS fallback.
 */

export type DataMode = "sample" | "live";

export interface DataSourceInfo {
  mode: DataMode;
  configured: boolean; // whether an OpenDART key is present (never the value)
}

/** Server-side: is an OpenDART key configured? (mode is a hint, not per-company truth) */
export function getDataSource(): DataSourceInfo {
  const key = process.env.OPENDART_API_KEY;
  const configured = typeof key === "string" && key.trim().length > 0;
  return { mode: configured ? "live" : "sample", configured };
}

export interface DartReport {
  financials: YearFinancials[]; // ascending by year, ≥2 years
  currentAssets: number | null; // latest year, for current ratio
  currentLiabilities: number | null;
}

const ANNUAL_REPORT = "11011"; // 사업보고서
const REPORT_YEARS = [2025, 2024, 2023]; // newest first; we keep what's filed

interface DartItem {
  account_id?: string;
  account_nm?: string;
  sj_div?: string; // BS / IS / CIS / ...
  thstrm_amount?: string;
}

function toNumber(raw?: string): number | null {
  if (!raw) return null;
  const n = Number(raw.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

/** Find an account amount by IFRS account_id list, falling back to account names. */
function pick(items: DartItem[], ids: string[], names: string[]): number | null {
  for (const it of items) {
    if (it.account_id && ids.includes(it.account_id)) {
      const v = toNumber(it.thstrm_amount);
      if (v !== null) return v;
    }
  }
  for (const it of items) {
    const nm = it.account_nm?.replace(/\s/g, "");
    if (nm && names.some((n) => nm.includes(n))) {
      const v = toNumber(it.thstrm_amount);
      if (v !== null) return v;
    }
  }
  return null;
}

async function fetchYear(
  key: string,
  corpCode: string,
  year: number,
): Promise<{ items: DartItem[] } | null> {
  for (const fsDiv of ["CFS", "OFS"] as const) {
    const url = `https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?crtfc_key=${key}&corp_code=${corpCode}&bsns_year=${year}&reprt_code=${ANNUAL_REPORT}&fs_div=${fsDiv}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      if (!res.ok) continue;
      const json = (await res.json()) as { status?: string; list?: DartItem[] };
      if (json.status === "000" && Array.isArray(json.list) && json.list.length) {
        return { items: json.list };
      }
      // status 013 = no data for this fs_div/year → try OFS, else next year
    } catch {
      // network/timeout → try next fs_div
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

function yearFromItems(
  year: number,
  items: DartItem[],
): {
  yf: YearFinancials | null;
  currentAssets: number | null;
  currentLiabilities: number | null;
} {
  const revenue = pick(
    items,
    ["ifrs-full_Revenue", "ifrs_Revenue"],
    ["매출액", "수익(매출액)", "영업수익"],
  );
  const operatingProfit = pick(
    items,
    ["dart_OperatingIncomeLoss", "ifrs-full_ProfitLossFromOperatingActivities"],
    ["영업이익"],
  );
  const netIncome = pick(items, ["ifrs-full_ProfitLoss"], ["당기순이익", "당기순이익(손실)"]);
  const totalAssets = pick(items, ["ifrs-full_Assets"], ["자산총계"]);
  const totalEquity = pick(items, ["ifrs-full_Equity"], ["자본총계"]);
  const totalLiabilities = pick(items, ["ifrs-full_Liabilities"], ["부채총계"]);
  const currentAssets = pick(items, ["ifrs-full_CurrentAssets"], ["유동자산"]);
  const currentLiabilities = pick(items, ["ifrs-full_CurrentLiabilities"], ["유동부채"]);

  if (
    revenue === null ||
    netIncome === null ||
    totalAssets === null ||
    totalEquity === null ||
    totalLiabilities === null
  ) {
    return { yf: null, currentAssets, currentLiabilities };
  }

  return {
    yf: {
      year,
      revenue,
      operatingProfit: operatingProfit ?? 0,
      netIncome,
      totalAssets,
      totalEquity,
      totalLiabilities,
    },
    currentAssets,
    currentLiabilities,
  };
}

/**
 * Fetch up to 3 years of real financials for a stock from OpenDART. Returns null
 * if no key, no corp_code mapping, or insufficient data — callers fall back to
 * the labeled sample.
 */
export async function fetchDartFinancials(stockCode: string): Promise<DartReport | null> {
  const key = process.env.OPENDART_API_KEY?.trim();
  if (!key) return null;
  const corpCode = corpCodeFor(stockCode);
  if (!corpCode) return null;

  const results = await Promise.all(REPORT_YEARS.map((y) => fetchYear(key, corpCode, y)));

  const financials: YearFinancials[] = [];
  let currentAssets: number | null = null;
  let currentLiabilities: number | null = null;

  REPORT_YEARS.forEach((year, i) => {
    const r = results[i];
    if (!r) return;
    const parsed = yearFromItems(year, r.items);
    if (parsed.yf) {
      financials.push(parsed.yf);
      // latest available year (REPORT_YEARS is newest-first) seeds current ratio
      if (currentAssets === null) currentAssets = parsed.currentAssets;
      if (currentLiabilities === null) currentLiabilities = parsed.currentLiabilities;
    }
  });

  if (financials.length < 2) return null; // need ≥2 years for trend/growth
  financials.sort((a, b) => a.year - b.year); // ascending
  return { financials, currentAssets, currentLiabilities };
}
