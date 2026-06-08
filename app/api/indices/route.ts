import { NextResponse } from "next/server";
import { getLiveIndices, getUsIndices } from "@/lib/data/live-quotes";
import { marketIndices } from "@/lib/data/series";

export const dynamic = "force-dynamic";

/** GET /api/indices?region=kr|us — live (delayed) index + FX cards. */
export async function GET(req: Request) {
  const region = new URL(req.url).searchParams.get("region");
  const result = region === "us" ? await getUsIndices() : await getLiveIndices(marketIndices());
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
