/**
 * Daily market BRIEF for the email body — turns the day's numbers + news into a
 * short Korean "why did it move" write-up (via free Gemini text) plus a ready-to-
 * paste ChatGPT prompt the user can use to generate the Instagram card image.
 * Free: text-only Gemini + Yahoo news. Falls back to a template if Gemini is off.
 */

import { geminiText } from "@/lib/ai/gemini";
import { getLiveIndices, getLiveQuotes, getNews, getSymbolQuotes, getUsIndices } from "@/lib/data/live-quotes";
import { FEATURED_CODES } from "@/lib/data/fundamentals";
import { marketIndices } from "@/lib/data/series";
import { US_INSTRUMENTS, US_TICKERS } from "@/lib/data/us-markets";
import type { NewsItem } from "@/lib/data/live-quotes";
import type { IndexQuote } from "@/lib/types";
import type { Market } from "@/lib/cards/build";

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
function find(idx: IndexQuote[], id: string) {
  return idx.find((i) => i.id === id);
}

export interface MarketBrief {
  marketLabel: string;
  headline: string;
  sub: string;
  /** Gemini-written "why" block (Korean) or a template fallback. */
  analysis: string;
  headlines: NewsItem[];
  /** Ready-to-paste ChatGPT prompt to generate the card image. */
  gptPrompt: string;
}

export async function buildMarketBrief(market: Market): Promise<MarketBrief> {
  const isKr = market === "kr";
  const marketLabel = isKr ? "한국 증시" : "미국 증시";

  let headline = "";
  let sub = "";
  let moversStr = "";
  let idxStr = "";
  let news: NewsItem[] = [];

  if (isKr) {
    const [idx, quotes, n] = await Promise.all([
      getLiveIndices(marketIndices()),
      getLiveQuotes(FEATURED_CODES),
      getNews(["^KS11", "005930.KS", "000660.KS", "035420.KS", "005380.KS"]),
    ]);
    news = n;
    const kospi = find(idx.indices, "kospi");
    const kosdaq = find(idx.indices, "kosdaq");
    const fx = find(idx.indices, "usdkrw");
    const kp = kospi?.changePct ?? 0;
    const word = kp <= -1.5 ? "급락" : kp >= 1.5 ? "급등" : kp >= 0.1 ? "상승" : kp <= -0.1 ? "약세" : "보합";
    headline = `코스피 ${kospi ? pct(kospi.changePct) : "—"} ${word}`;
    sub = `코스닥 ${kosdaq ? pct(kosdaq.changePct) : "—"} · 환율 ${fx ? num(fx.value) : "—"}원`;
    idxStr = `코스피 ${kospi ? `${num(kospi.value)} (${pct(kospi.changePct)})` : "n/a"}, 코스닥 ${kosdaq ? `${num(kosdaq.value)} (${pct(kosdaq.changePct)})` : "n/a"}, 환율 ${fx ? `${num(fx.value)}원 (${pct(fx.changePct)})` : "n/a"}`;
    moversStr = FEATURED_CODES.map((c) => {
      const q = quotes.quotes[c];
      return q ? `${KR_NAMES[c] ?? c} ${pct(q.changePct)}` : null;
    })
      .filter(Boolean)
      .join(", ");
  } else {
    const [us, quotes, n] = await Promise.all([
      getUsIndices(),
      getSymbolQuotes(US_TICKERS),
      getNews(["^IXIC", "NVDA", "AAPL", "TSLA", "MSFT"]),
    ]);
    news = n;
    const nasdaq = find(us.indices, "nasdaq");
    const sp = find(us.indices, "sp500");
    const dow = find(us.indices, "dow");
    const np = nasdaq?.changePct ?? 0;
    const word = np <= -1.5 ? "급락" : np >= 1.5 ? "급등" : np >= 0.1 ? "상승" : np <= -0.1 ? "약세" : "보합";
    headline = `나스닥 ${nasdaq ? pct(nasdaq.changePct) : "—"} ${word}`;
    sub = `S&P ${sp ? pct(sp.changePct) : "—"} · 다우 ${dow ? pct(dow.changePct) : "—"}`;
    idxStr = `나스닥 ${nasdaq ? `${num(nasdaq.value)} (${pct(nasdaq.changePct)})` : "n/a"}, S&P500 ${sp ? `${num(sp.value)} (${pct(sp.changePct)})` : "n/a"}, 다우 ${dow ? `${num(dow.value)} (${pct(dow.changePct)})` : "n/a"}`;
    moversStr = US_INSTRUMENTS.filter((i) => i.kind === "stock")
      .map((i) => {
        const q = quotes.quotes[i.ticker];
        return q ? `${i.name} ${pct(q.changePct)}` : null;
      })
      .filter(Boolean)
      .slice(0, 8)
      .join(", ");
  }

  const newsStr = news
    .slice(0, 8)
    .map((x, i) => `${i + 1}. ${x.title} (${x.publisher})`)
    .join("\n");

  const prompt = `당신은 한국 투자자를 위한 증시 브리핑 에디터입니다. 아래는 오늘 ${marketLabel} 마감 데이터와 뉴스 헤드라인입니다.

지수: ${idxStr}
주요 종목: ${moversStr || "n/a"}
뉴스 헤드라인:
${newsStr || "(헤드라인 없음)"}

위 정보만 근거로 한국어로 작성하세요. 헤드라인에 근거가 없으면 지어내지 말고 "뉴스상 뚜렷한 단일 이유는 없었습니다"라고 쓰세요. "매수/매도" 같은 투자 권유 표현은 쓰지 마세요. 정확히 아래 형식으로만 출력:

요약: (오늘 시장을 한 문장으로)
오늘 이렇게 움직인 이유:
- (이유 1, 한 문장, 쉬운 말)
- (이유 2, 한 문장)
- (이유 3, 한 문장)
내일 관전포인트: (한 문장)`;

  const ai = await geminiText(prompt);
  const analysis =
    ai ??
    `요약: ${headline}, ${sub}.\n오늘 이렇게 움직인 이유:\n- 아래 핵심 뉴스를 참고하세요.\n내일 관전포인트: 지수·환율·수급 흐름을 함께 확인하세요.`;

  const gptPrompt = `주식이(네이비 정장에 초록 넥타이를 한 귀여운 카툰 황소 캐릭터, 큰 둥근 안경)로 오늘 ${marketLabel} 카드뉴스 1장 만들어줘.
- 큰 헤드라인: ${headline}
- 서브: ${sub}
- 오늘 이슈(아래 분석 참고해서 3줄 체크포인트로):
${analysis}
- 스타일: 경제 유튜브 썸네일 느낌, 플랫 벡터 일러스트, 세로 4:5(1080x1350), 큰 한글 텍스트 깔끔하게, 시장 분위기에 맞는 배경(급락=비·하락, 급등=로켓·해변 등), 하단에 작게 "Alpha Radar · 교육용 · 투자 자문 아님".`;

  return { marketLabel, headline, sub, analysis, headlines: news.slice(0, 7), gptPrompt };
}
