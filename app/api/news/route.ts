import { NextResponse } from "next/server";
import { getNews } from "@/lib/data/live-quotes";
import { US_TICKERS } from "@/lib/data/us-markets";

export const dynamic = "force-dynamic";

/** GET /api/news?symbols=NVDA,AAPL — overnight US headlines (allowlisted tickers). */
export async function GET(req: Request) {
  const param = new URL(req.url).searchParams.get("symbols")?.trim();
  const allowed = new Set(US_TICKERS);
  const symbols = param
    ? param
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter((s) => allowed.has(s))
    : ["NVDA", "AAPL", "MSFT"];
  const news = await getNews(symbols.length ? symbols : ["NVDA", "AAPL", "MSFT"]);
  return NextResponse.json({ news }, { headers: { "Cache-Control": "no-store" } });
}
