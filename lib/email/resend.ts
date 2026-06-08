/**
 * Minimal Resend email sender via the REST API (no extra package — built-in fetch).
 * Requires RESEND_API_KEY in the environment. Used by the daily cron to email the
 * generated market cards as PNG attachments. Never logs or returns the key.
 */

export interface EmailAttachment {
  filename: string;
  /** base64-encoded file content */
  content: string;
}

export interface SendResult {
  ok: boolean;
  status: number;
  id?: string;
  error?: string;
}

export function resendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY?.trim();
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: EmailAttachment[];
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, status: 0, error: "RESEND_API_KEY not set" };

  // Resend's onboarding domain can email the account owner without domain setup.
  const from =
    opts.from ?? process.env.RESEND_FROM?.trim() ?? "Alpha Radar <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        attachments: opts.attachments,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    return {
      ok: res.ok,
      status: res.status,
      id: json.id,
      error: res.ok ? undefined : json.message || `HTTP ${res.status}`,
    };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : "fetch failed" };
  }
}
