import { buildMarketBrief } from "@/lib/cards/brief";
import { buildCards } from "@/lib/cards/build";
import { renderCardPng } from "@/lib/cards/render";
import { resendConfigured, sendEmail } from "@/lib/email/resend";

/**
 * Daily auto-email cron: GET /api/cron/kr  and  /api/cron/us
 * Triggered by Vercel Cron (see vercel.ts) right after each market close.
 * Builds the day's 5 cards, renders them to PNG, and emails them as attachments.
 *
 *  ?preview=N  → return just card N as a PNG (no email) — for visual QA.
 *  ?send=1     → force a send now (manual test), still auth-gated in prod.
 *
 * Auth: if CRON_SECRET is set, the request must carry it (Vercel Cron sends
 * `Authorization: Bearer <CRON_SECRET>` automatically, or pass ?key=...).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const REPORT_TO = process.env.REPORT_TO?.trim() || "diligentlee2007@gmail.com";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true; // no secret configured (e.g. local dev) → open
  const url = new URL(req.url);
  const bearer = req.headers.get("authorization");
  return bearer === `Bearer ${secret}` || url.searchParams.get("key") === secret;
}

export async function GET(req: Request, ctx: { params: Promise<{ market: string }> }) {
  const { market: raw } = await ctx.params;
  const market = raw === "us" ? "us" : "kr";
  const url = new URL(req.url);
  const origin = url.origin;

  // Preview a single card as PNG (handy for QA; no email, but still auth-gated in prod).
  const preview = url.searchParams.get("preview");
  if (preview) {
    if (!authorized(req)) return new Response("unauthorized", { status: 401 });
    const cards = await buildCards(market, origin);
    const idx = Math.max(1, Math.min(cards.length, Number(preview) || 1)) - 1;
    const card = cards[idx];
    if (!card) return new Response("no card", { status: 404 });
    // Debug: force a stand-in cover image to verify text compositing without a key.
    if (url.searchParams.get("bgtest")) card.bgImageUrl = `${origin}/joosik-storm.png`;
    const png = await renderCardPng(card);
    return new Response(new Uint8Array(png), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  }

  if (!authorized(req)) return new Response("unauthorized", { status: 401 });

  const cards = await buildCards(market, origin);
  const pngs = await Promise.all(cards.map((c) => renderCardPng(c)));
  const label = market === "kr" ? "한국 증시" : "미국 증시";
  const today = new Intl.DateTimeFormat("ko-KR", {
    timeZone: market === "kr" ? "Asia/Seoul" : "America/New_York",
    dateStyle: "long",
  }).format(new Date());

  const attachments = pngs.map((png, i) => ({
    filename: `${market}-${i + 1}.png`,
    content: png.toString("base64"),
  }));

  // Rich "content brief": why the market moved + headlines + a paste-ready GPT prompt.
  const brief = await buildMarketBrief(market);
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const analysisHtml = esc(brief.analysis).replace(/\n/g, "<br>");
  const newsHtml =
    brief.headlines
      .map(
        (n) =>
          `<li style="margin:6px 0"><a href="${n.link}" style="color:#0f7a4d;text-decoration:none">${esc(n.title)}</a> <span style="color:#94a3b8">· ${esc(n.publisher)}</span></li>`,
      )
      .join("") || "<li style='color:#94a3b8'>표시할 뉴스가 없어요.</li>";

  const html = `
    <div style="font-family:Pretendard,Apple SD Gothic Neo,sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
      <h2 style="margin:0 0 2px">Alpha Radar · 주식이</h2>
      <p style="color:#6b7280;margin:0 0 18px;font-size:14px">${today} · ${label} 데일리 브리핑</p>

      <div style="background:#0f1729;color:#fff;border-radius:14px;padding:18px 20px;margin-bottom:18px">
        <div style="font-size:22px;font-weight:800">${esc(brief.headline)}</div>
        <div style="color:#9aa7bd;margin-top:4px">${esc(brief.sub)}</div>
      </div>

      <h3 style="margin:0 0 6px;font-size:16px">📊 오늘 왜 이렇게 움직였나</h3>
      <div style="background:#f6f8fa;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.6;color:#374151">${analysisHtml}</div>

      <h3 style="margin:18px 0 6px;font-size:16px">📰 핵심 뉴스</h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.5">${newsHtml}</ul>

      <h3 style="margin:18px 0 6px;font-size:16px">🤖 GPT에 붙여넣기 (이미지 카드 만들기)</h3>
      <p style="color:#6b7280;font-size:13px;margin:0 0 6px">아래를 복사해 ChatGPT에 붙여넣으면 오늘의 카드 이미지를 만들어줘요.</p>
      <pre style="white-space:pre-wrap;background:#0f1729;color:#e8eef7;border-radius:12px;padding:14px 16px;font-size:13px;line-height:1.55;font-family:Pretendard,monospace">${esc(brief.gptPrompt)}</pre>

      <h3 style="margin:18px 0 6px;font-size:16px">🖼️ 바로 쓰는 카드 ${cards.length}장</h3>
      <p style="color:#374151;font-size:14px;margin:0">첨부된 PNG ${cards.length}장(표지→지수→종목→이슈→마무리)을 그대로 인스타 캐러셀로 올려도 돼요.</p>

      <p style="color:#9ca3af;font-size:12px;margin-top:22px">자동 생성 · 교육용 콘텐츠이며 투자 자문이 아닙니다. · alpha-radar-fundamentals.vercel.app</p>
    </div>`;

  if (!resendConfigured()) {
    return Response.json(
      {
        ok: false,
        market,
        cards: cards.length,
        error: "RESEND_API_KEY not set — cards rendered but not emailed.",
      },
      { status: 200 },
    );
  }

  const result = await sendEmail({
    to: REPORT_TO,
    subject: `[Alpha Radar] ${today} ${label} 데일리 ${cards.length}장`,
    html,
    attachments,
  });

  return Response.json({
    ok: result.ok,
    market,
    cards: cards.length,
    id: result.id,
    error: result.error,
  });
}
