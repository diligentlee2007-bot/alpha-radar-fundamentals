import type { Metadata } from "next";
import { FundamentalsTable, type TerminalRow } from "@/components/fundamentals/fundamentals-table";
import { SampleNotice } from "@/components/fundamentals/sample-notice";
import { TerminalHeader } from "@/components/fundamentals/terminal-header";
import { LiveIndexBar } from "@/components/market/live-index-bar";
import { Reveal } from "@/components/motion/reveal";
import { allFundamentals } from "@/lib/data/fundamentals";
import { allQuotes, MARKET_DATE_LABEL, marketIndices } from "@/lib/data/series";
import type { IndexQuote } from "@/lib/types";

export const metadata: Metadata = {
  title: "Equity research terminal — 주식 리서치 터미널",
  description:
    "Browse the KOSPI / KOSDAQ universe with valuation and profitability metrics. OpenDART-ready; sample data when no key is set. Educational portfolio demo, not investment advice.",
};

export default function FundamentalsTerminalPage() {
  // The terminal lists sample fundamentals (ratios) re-priced with live quotes;
  // it does not fetch OpenDART per row, so fundamentals are labeled "sample".
  // Open a company to see real OpenDART financials (for mapped tickers).
  const mode = "sample" as const;
  // Sample cards shown only until the live index poll resolves on the client.
  const indexFallback: IndexQuote[] = marketIndices().map((i) => ({ ...i, source: "sample" }));
  const quotes = allQuotes();
  const funds = allFundamentals();
  const fundByCode = new Map(funds.map((f) => [f.code, f]));

  const rows: TerminalRow[] = quotes
    .map((q) => {
      const f = fundByCode.get(q.code);
      if (!f) return null;
      return {
        code: q.code,
        name: q.name,
        market: q.market,
        sector: q.sector,
        price: q.price,
        change: q.change,
        changePct: q.changePct,
        per: f.ratios.per,
        pbr: f.ratios.pbr,
        roe: f.ratios.roe,
        marketCap: f.marketCap,
        eps: f.ratios.eps,
        bps: f.ratios.bps,
        shares: f.price ? f.marketCap / f.price : 0,
      };
    })
    .filter((r): r is TerminalRow => r !== null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <TerminalHeader mode={mode} asOf={MARKET_DATE_LABEL} />

      <div className="mt-5">
        <SampleNotice mode={mode} />
      </div>

      <div className="mt-6">
        <LiveIndexBar fallback={indexFallback} />
      </div>

      <Reveal>
        <div className="mt-8">
          <FundamentalsTable rows={rows} />
        </div>
      </Reveal>
    </div>
  );
}
