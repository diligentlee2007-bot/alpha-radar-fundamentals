import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyLiveSection } from "@/components/fundamentals/company-live-section";
import {
  allFundamentals,
  companyFundamentals,
  getCompanyFundamentals,
} from "@/lib/data/fundamentals";
import { quoteFor, seriesFor } from "@/lib/data/series";

export function generateStaticParams() {
  return allFundamentals().map((f) => ({ code: f.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const f = companyFundamentals(code);
  if (!f) return { title: "Not found" };
  return {
    title: `${f.name} (${f.code}) — Fundamentals`,
    description: `${f.name} financial ratios, 3-year trend, valuation, and risk summary on Alpha Radar Fundamentals. Delayed live price, sample fundamentals. Not investment advice.`,
  };
}

const DEFAULT_PERIOD = "3M" as const;

export default async function CompanyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await getCompanyFundamentals(code);
  const quote = quoteFor(code);
  if (!result || !quote) notFound();
  const series = seriesFor(code, DEFAULT_PERIOD);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <CompanyLiveSection
        data={result.data}
        fundamentalsSource={result.source}
        sampleChange={quote.change}
        sampleChangePct={quote.changePct}
        series={series}
        period={DEFAULT_PERIOD}
      />
    </div>
  );
}
