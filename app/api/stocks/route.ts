import { NextResponse } from "next/server";
import { allQuotes } from "@/lib/data/series";

/** GET /api/stocks — full quote list (optionally filtered by ?market= & ?q=). */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const market = searchParams.get("market");
  const q = searchParams.get("q")?.trim().toLowerCase();

  let quotes = allQuotes();
  if (market === "KOSPI" || market === "KOSDAQ") {
    quotes = quotes.filter((x) => x.market === market);
  }
  if (q) {
    quotes = quotes.filter((x) => x.name.toLowerCase().includes(q) || x.code.includes(q));
  }
  return NextResponse.json({ quotes });
}
