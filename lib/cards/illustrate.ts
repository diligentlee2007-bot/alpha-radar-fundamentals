/**
 * Server-side scene illustration for the daily cover card. Draws the bespoke
 * scene (e.g. the bull crying under an umbrella on a crash day) which next/og
 * then overlays clean Korean text onto. No extra package — just fetch.
 *
 * Provider (auto, first available wins):
 *   - GEMINI_API_KEY  → Google AI Studio / Gemini image (FREE tier, no card) ← recommended
 *   - OPENAI_API_KEY  → OpenAI gpt-image-1 (paid, highest quality)
 *   - POLLINATIONS_TOKEN → Pollinations.ai (free tier, needs a free signup token)
 *   - else            → anonymous Pollinations attempt (now heavily rate-limited)
 *
 * Returns a base64 PNG/JPEG (no data: prefix) or null on any failure, so the
 * cover gracefully falls back to the flat designed card. The image must contain
 * NO text — the headline is composited separately for crisp Korean.
 */

import { JOOSIK_DESC, type Scene, STYLE_DESC, THEMES } from "@/lib/studio/scene";

/** Illustration is on unless explicitly disabled (the free provider needs no key). */
export function illustrationConfigured(): boolean {
  return process.env.DISABLE_ILLUSTRATION !== "1";
}

/** Build the English image prompt for a scene (deliberately text-free). */
export function scenePrompt(scene: Scene): string {
  return [
    `Illustrate ${JOOSIK_DESC}, ${THEMES[scene].prompt}.`,
    STYLE_DESC,
    "IMPORTANT: absolutely NO text, NO letters, NO numbers, NO words, NO logos anywhere in the image.",
    "Cinematic, high detail, cohesive single illustrated scene, portrait composition,",
    "keep the upper third calmer/less busy so a headline can be overlaid later.",
  ].join(" ");
}

async function fetchAsBase64(url: string, init: RequestInit, ms: number): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer()).toString("base64");
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** FREE provider: Google AI Studio / Gemini image generation (free tier, no card). */
async function generateGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const model = process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
        signal: controller.signal,
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { inlineData?: { data?: string } }[] } }[];
    };
    const parts = json.candidates?.[0]?.content?.parts ?? [];
    for (const p of parts) {
      if (p.inlineData?.data) return p.inlineData.data;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Pollinations.ai — free tier (needs a free token now; anonymous is rate-limited). */
async function generatePollinations(prompt: string, seed: number): Promise<string | null> {
  const token = process.env.POLLINATIONS_TOKEN?.trim();
  const auth = token ? `&token=${token}` : "";
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1536&nologo=true&model=flux&seed=${seed}${auth}`;
  return fetchAsBase64(url, { headers: { Accept: "image/*" } }, 90_000);
}

/** PAID provider: OpenAI gpt-image-1 (used only when OPENAI_API_KEY is set). */
async function generateOpenAI(
  prompt: string,
  quality: "low" | "medium" | "high",
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1",
        prompt,
        size: "1024x1536",
        quality,
        n: 1,
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { b64_json?: string; url?: string }[] };
    const item = json.data?.[0];
    if (item?.b64_json) return item.b64_json;
    if (item?.url) return fetchAsBase64(item.url, {}, 30_000);
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Generate a scene illustration (base64) or null. Picks provider automatically. */
export async function generateScene(
  scene: Scene,
  opts: { quality?: "low" | "medium" | "high"; seed?: number } = {},
): Promise<string | null> {
  if (!illustrationConfigured()) return null;
  const prompt = scenePrompt(scene);
  // First available provider wins.
  if (process.env.GEMINI_API_KEY?.trim()) {
    const g = await generateGemini(prompt);
    if (g) return g;
  }
  if (process.env.OPENAI_API_KEY?.trim()) {
    const o = await generateOpenAI(prompt, opts.quality ?? "high");
    if (o) return o;
  }
  // Pollinations (token if provided, else a best-effort anonymous attempt).
  const seed = opts.seed ?? Math.floor(Math.random() * 1_000_000);
  return generatePollinations(prompt, seed);
}
