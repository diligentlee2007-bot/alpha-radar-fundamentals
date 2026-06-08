/**
 * Builds the day's 5-card sets (Korea + US) from the live data layer, ready to
 * be rendered to PNG by lib/cards/render.tsx and emailed by the daily cron.
 * Pure data → CardSpec[]; no rendering or network of its own beyond the shared
 * live-data fetchers. Falls back gracefully and labels everything educational.
 */

import type { CardSpec, Tone } from "@/lib/cards/render";
import { FEATURED_CODES } from "@/lib/data/fundamentals";
import {
  getLiveIndices,
  getLiveQuotes,
  getNews,
  getSymbolQuotes,
  getUsIndices,
} from "@/lib/data/live-quotes";
import { marketIndices } from "@/lib/data/series";
import { US_INDEX_FALLBACK, US_INSTRUMENTS, US_TICKERS } from "@/lib/data/us-markets";
import { sceneOf } from "@/lib/studio/scene";
import type { IndexQuote } from "@/lib/types";

export type Market = "kr" | "us";

const KR_NAMES: Record<string, string> = {
  "005930": "삼성전자",
  "000660": "SK하이닉스",
  "035420": "NAVER",
  "005380": "현대차",
  "247540": "에코프로비엠",
};

function pct(p: number): string {
  return `${p >= 0 ? "+" : ""}${p.toFixed(2)}%`;
}
function num(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
function tone(p: number): Tone {
  return p > 0.1 ? "up" : p < -0.1 ? "down" : "flat";
}
function dateLabel(market: Market): string {
  const tz = market === "kr" ? "Asia/Seoul" : "America/New_York";
  const d = new Intl.DateTimeFormat("ko-KR", {
    timeZone: tz,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
  return d;
}
function find(indices: IndexQuote[], id: string): IndexQuote | undefined {
  return indices.find((i) => i.id === id);
}

/** Is `market`'s calendar today a weekend (best-effort holiday guard)? */
export function isMarketHoliday(market: Market): boolean {
  const tz = market === "kr" ? "Asia/Seoul" : "America/New_York";
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(
    new Date(),
  );
  return wd === "Sat" || wd === "Sun";
}

/** A single "market is closed, the bull is resting" card. */
export function buildRestCard(market: Market, origin: string): CardSpec[] {
  const label = market === "kr" ? "한국 증시" : "미국 증시";
  return [
    {
      scene: "sunny",
      kicker: `${label} · ${dateLabel(market)}`,
      title: "오늘은 장이 쉬어가요",
      body: "휴장일이라 거래가 없어요. 주식이도 잠깐 쉬며 다음 장을 준비합니다. 내일 다시 만나요!",
      footer: "교육용 · 투자 자문 아님",
      page: 1,
      pageCount: 1,
      origin,
    },
  ];
}

export async function buildKrCards(origin: string): Promise<CardSpec[]> {
  const [idx, quotes, news] = await Promise.all([
    getLiveIndices(marketIndices()),
    getLiveQuotes(FEATURED_CODES),
    getNews(["^KS11", "005930.KS"]),
  ]);
  const kospi = find(idx.indices, "kospi");
  const kosdaq = find(idx.indices, "kosdaq");
  const kospi200 = find(idx.indices, "kospi200");
  const fx = find(idx.indices, "usdkrw");
  const kp = kospi?.changePct ?? 0;
  const scene = sceneOf(kp);
  const date = dateLabel("kr");

  const movers = FEATURED_CODES.map((code) => {
    const q = quotes.quotes[code];
    return q ? { name: KR_NAMES[code] ?? code, p: q.changePct, price: q.price } : null;
  })
    .filter((m): m is { name: string; p: number; price: number } => !!m)
    .sort((a, b) => b.p - a.p);
  const top = movers.slice(0, 3);
  const bottom = movers.slice(-2).reverse();

  const headline = news[0]?.title;
  const pageCount = 5;
  const base = { origin, pageCount };

  return [
    {
      ...base,
      scene,
      page: 1,
      kicker: `오늘의 한국 증시 · ${date}`,
      title:
        kp <= -1.5
          ? "코스피 급락 마감"
          : kp >= 1.5
            ? "코스피 강세 마감"
            : kp >= 0.1
              ? "코스피 상승 마감"
              : kp <= -0.1
                ? "코스피 약세 마감"
                : "코스피 보합 마감",
      bigStat: kospi
        ? { text: `코스피 ${pct(kospi.changePct)}`, tone: tone(kospi.changePct) }
        : undefined,
      body: kospi ? `${num(kospi.value)}p 로 마감했어요.` : undefined,
    },
    {
      ...base,
      scene,
      page: 2,
      kicker: "지수 · 환율",
      title: "오늘의 지표",
      rows: [
        kospi && {
          label: "코스피",
          value: pct(kospi.changePct),
          sub: `${num(kospi.value)}p`,
          tone: tone(kospi.changePct),
        },
        kosdaq && {
          label: "코스닥",
          value: pct(kosdaq.changePct),
          sub: `${num(kosdaq.value)}p`,
          tone: tone(kosdaq.changePct),
        },
        kospi200 && {
          label: "코스피200",
          value: pct(kospi200.changePct),
          sub: `${num(kospi200.value)}p`,
          tone: tone(kospi200.changePct),
        },
        fx && {
          label: "원/달러",
          value: `${num(fx.value)}원`,
          sub: pct(fx.changePct),
          tone: tone(-fx.changePct),
        },
      ].filter(Boolean) as CardSpec["rows"],
    },
    {
      ...base,
      scene,
      page: 3,
      kicker: "주목 종목",
      title: "오늘의 움직임",
      rows: [
        ...top.map((m) => ({
          label: m.name,
          value: pct(m.p),
          sub: `${num(m.price)}원`,
          tone: tone(m.p),
        })),
        ...bottom
          .filter((b) => !top.includes(b))
          .map((m) => ({
            label: m.name,
            value: pct(m.p),
            sub: `${num(m.price)}원`,
            tone: tone(m.p),
          })),
      ].slice(0, 4),
    },
    {
      ...base,
      scene,
      page: 4,
      kicker: "오늘의 이슈",
      title: headline ? "장중 헤드라인" : "이슈 모니터링",
      body:
        headline ??
        "오늘은 시장을 크게 흔든 단일 헤드라인은 없었어요. 지수·환율 흐름을 확인하세요.",
      footer: headline
        ? `출처: ${news[0]?.publisher ?? "Yahoo Finance"}`
        : "교육용 · 투자 자문 아님",
    },
    {
      ...base,
      scene,
      page: 5,
      kicker: "마무리",
      title:
        kp <= -1.5 ? "급락장, 침착하게" : kp >= 1.5 ? "강세장, 과열 주의" : "오늘의 체크포인트",
      body:
        kp <= -1.5
          ? "큰 하락일수록 분할·분산과 현금 비중을 점검하세요. 공포에 휘둘리지 않기."
          : kp >= 1.5
            ? "급등 뒤엔 변동성이 커져요. 추격매수보다 분할 접근이 안전합니다."
            : "지수·환율·수급을 함께 보고 한쪽 신호만으로 판단하지 마세요.",
      footer: "저장 ♡ 팔로우 · 교육용, 투자 자문 아님",
    },
  ];
}

export async function buildUsCards(origin: string): Promise<CardSpec[]> {
  const [us, quotes, news] = await Promise.all([
    getUsIndices(),
    getSymbolQuotes(US_TICKERS),
    getNews(["^IXIC", "NVDA"]),
  ]);
  const indices = us.indices.length ? us.indices : US_INDEX_FALLBACK;
  const nasdaq = find(indices, "nasdaq");
  const sp = find(indices, "sp500");
  const dow = find(indices, "dow");
  const np = nasdaq?.changePct ?? 0;
  const scene = sceneOf(np);
  const date = dateLabel("us");

  const movers = US_INSTRUMENTS.filter((i) => i.kind === "stock")
    .map((i) => {
      const q = quotes.quotes[i.ticker];
      return q ? { name: i.name, ticker: i.ticker, p: q.changePct, price: q.price } : null;
    })
    .filter((m): m is { name: string; ticker: string; p: number; price: number } => !!m)
    .sort((a, b) => b.p - a.p);
  const top = movers.slice(0, 3);
  const bottom = movers.slice(-2).reverse();
  const headline = news[0]?.title;
  const pageCount = 5;
  const base = { origin, pageCount };

  return [
    {
      ...base,
      scene,
      page: 1,
      kicker: `미국 증시 마감 · ${date}`,
      title:
        np <= -1.5
          ? "나스닥 급락 마감"
          : np >= 1.5
            ? "나스닥 강세 마감"
            : np >= 0.1
              ? "나스닥 상승 마감"
              : np <= -0.1
                ? "나스닥 약세 마감"
                : "나스닥 보합 마감",
      bigStat: nasdaq
        ? { text: `나스닥 ${pct(nasdaq.changePct)}`, tone: tone(nasdaq.changePct) }
        : undefined,
      body: nasdaq ? `${num(nasdaq.value)} 로 마감했어요.` : undefined,
    },
    {
      ...base,
      scene,
      page: 2,
      kicker: "주요 지수",
      title: "3대 지수",
      rows: [
        nasdaq && {
          label: "나스닥",
          value: pct(nasdaq.changePct),
          sub: num(nasdaq.value),
          tone: tone(nasdaq.changePct),
        },
        sp && {
          label: "S&P 500",
          value: pct(sp.changePct),
          sub: num(sp.value),
          tone: tone(sp.changePct),
        },
        dow && {
          label: "다우",
          value: pct(dow.changePct),
          sub: num(dow.value),
          tone: tone(dow.changePct),
        },
      ].filter(Boolean) as CardSpec["rows"],
    },
    {
      ...base,
      scene,
      page: 3,
      kicker: "빅테크",
      title: "오늘의 움직임",
      rows: [
        ...top.map((m) => ({
          label: m.name,
          value: pct(m.p),
          sub: `$${num(m.price)}`,
          tone: tone(m.p),
        })),
        ...bottom
          .filter((b) => !top.includes(b))
          .map((m) => ({
            label: m.name,
            value: pct(m.p),
            sub: `$${num(m.price)}`,
            tone: tone(m.p),
          })),
      ].slice(0, 4),
    },
    {
      ...base,
      scene,
      page: 4,
      kicker: "밤사이 이슈",
      title: headline ? "오버나잇 헤드라인" : "이슈 모니터링",
      body: headline ?? "밤사이 시장을 크게 흔든 단일 헤드라인은 없었어요. 지수 흐름을 확인하세요.",
      footer: headline
        ? `출처: ${news[0]?.publisher ?? "Yahoo Finance"}`
        : "교육용 · 투자 자문 아님",
    },
    {
      ...base,
      scene,
      page: 5,
      kicker: "한국 장 전망",
      title: "오늘 한국장 체크",
      body:
        np <= -1.5
          ? "미국 급락은 한국 개장에 부담이에요. 반도체·환율 민감 업종을 주시하세요."
          : np >= 1.5
            ? "미국 강세 흐름이 한국 개장에 우호적일 수 있어요. 다만 추격은 신중히."
            : "미국 혼조 마감. 환율·선물 흐름으로 한국 개장 방향을 가늠하세요.",
      footer: "저장 ♡ 팔로우 · 교육용, 투자 자문 아님",
    },
  ];
}

export async function buildCards(market: Market, origin: string): Promise<CardSpec[]> {
  if (isMarketHoliday(market)) return buildRestCard(market, origin);
  return market === "kr" ? buildKrCards(origin) : buildUsCards(origin);
}
