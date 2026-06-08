import { NextResponse } from "next/server";
import { getLiveQuotes, getSymbolQuotes } from "@/lib/data/live-quotes";
import { STOCK_SEEDS } from "@/lib/data/stocks";
import { US_TICKERS } from "@/lib/data/us-markets";

// Always fetch fresh (the fetcher itself throttles upstream calls with a cache).
export const dynamic = "force-dynamic";

/**
 * GET /api/quotes?codes=005930,000660  — KR codes (mapped to .KS/.KQ)
 * GET /api/quotes?symbols=AAPL,MSFT     — raw symbols (US tickers, allowlisted)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbolsParam = url.searchParams.get("symbols")?.trim();

  if (symbolsParam) {
    const allowed = new Set(US_TICKERS);
    const symbols = symbolsParam
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => allowed.has(s));
    const result = await getSymbolQuotes(symbols);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  }

  const codesParam = url.searchParams.get("codes")?.trim();
  const all = new Set(STOCK_SEEDS.map((s) => s.code));
  const codes = codesParam
    ? codesParam
        .split(",")
        .map((c) => c.trim())
        .filter((c) => all.has(c))
    : STOCK_SEEDS.map((s) => s.code);

  const result = await getLiveQuotes(codes);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
