import { NextResponse } from "next/server";
import { marketIndices, sectorStats } from "@/lib/data/series";

/** GET /api/market — index/FX cards + sector aggregates. */
export function GET() {
  return NextResponse.json({
    indices: marketIndices(),
    sectors: sectorStats(),
  });
}
