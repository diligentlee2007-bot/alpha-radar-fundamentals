"use client";

import { CompanyHeader } from "@/components/fundamentals/company-header";
import { FundamentalsView } from "@/components/fundamentals/fundamentals-view";
import { SampleNotice } from "@/components/fundamentals/sample-notice";
import { Reveal } from "@/components/motion/reveal";
import { PriceChart } from "@/components/stocks/price-chart";
import { Card } from "@/components/ui/card";
import { type CompanyFundamentals, withLivePrice } from "@/lib/data/fundamentals";
import type { DataMode } from "@/lib/data/opendart";
import { useLiveQuotes } from "@/lib/hooks/use-live-quotes";
import type { Bar, Period } from "@/lib/types";

export function CompanyLiveSection({
  data,
  fundamentalsSource,
  sampleChange,
  sampleChangePct,
  series,
  period,
}: {
  data: CompanyFundamentals;
  fundamentalsSource: DataMode;
  sampleChange: number;
  sampleChangePct: number;
  series: Bar[];
  period: Period;
}) {
  const live = useLiveQuotes([data.code]);
  const lq = live.quotes[data.code];

  const price = lq?.price ?? data.price;
  const change = lq?.change ?? sampleChange;
  const changePct = lq?.changePct ?? sampleChangePct;
  const view = lq ? withLivePrice(data, lq.price) : data;

  return (
    <>
      <Reveal>
        <CompanyHeader
          name={data.name}
          code={data.code}
          market={data.market}
          sector={data.sector}
          price={price}
          change={change}
          changePct={changePct}
          mode={fundamentalsSource}
          quoteSource={live.source}
          quoteFetchedAt={live.fetchedAt}
        />
      </Reveal>

      <div className="mt-5">
        <SampleNotice mode={fundamentalsSource} />
      </div>

      <Reveal>
        <Card className="mt-6 p-5">
          <PriceChart code={data.code} initialPeriod={period} initialSeries={series} />
        </Card>
      </Reveal>

      <div className="mt-6">
        <FundamentalsView data={view} />
      </div>
    </>
  );
}
