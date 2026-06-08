import { NextResponse } from "next/server";
import { getLiveSeries } from "@/lib/data/live-quotes";
import { quoteFor, seriesFor } from "@/lib/data/series";
import { PeriodEnum } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/stocks/:code?period=1M — quote + price series for one stock. */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quote = quoteFor(code);
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const parsed = PeriodEnum.safeParse(new URL(req.url).searchParams.get("period") ?? "3M");
  const period = parsed.success ? parsed.data : "3M";
  const liveSeries = await getLiveSeries(code, period);
  return NextResponse.json({
    quote,
    period,
    series: liveSeries ?? seriesFor(code, period),
    source: liveSeries ? "live" : "sample",
  });
}
