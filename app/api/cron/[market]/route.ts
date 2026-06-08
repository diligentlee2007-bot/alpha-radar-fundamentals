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
export const maxDuration = 120;

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

  const html = `
    <div style="font-family:Pretendard,Apple SD Gothic Neo,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="margin:0 0 4px">Alpha Radar · 주식이</h2>
      <p style="color:#475569;margin:0 0 16px">${today} ${label} 카드뉴스 ${cards.length}장이 준비됐어요.</p>
      <p style="color:#334155">첨부된 PNG ${cards.length}장을 인스타그램 캐러셀로 올리면 됩니다. 순서: 표지 → 지수 → 종목 → 이슈 → 마무리.</p>
      <p style="color:#94a3b8;font-size:13px;margin-top:24px">자동 생성 · 교육용 콘텐츠이며 투자 자문이 아닙니다. · alpha-radar-fundamentals.vercel.app</p>
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
