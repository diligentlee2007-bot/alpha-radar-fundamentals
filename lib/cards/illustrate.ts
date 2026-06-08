/**
 * Server-side scene illustration via an image-generation API (OpenAI gpt-image-1
 * by default). Used by the daily cron to draw the cover card's bespoke scene
 * (e.g. the bull crying under an umbrella on a crash day) which next/og then
 * overlays clean Korean text onto. No extra package — just fetch. Returns null
 * on any failure or when no key is set, so the cover gracefully falls back to
 * the flat designed card. The image must contain NO text (text is composited).
 */

import { JOOSIK_DESC, type Scene, STYLE_DESC, THEMES } from "@/lib/studio/scene";

export function illustrationConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY?.trim();
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

/**
 * Generate a scene illustration. Returns a base64 PNG string (no data: prefix)
 * or null on failure. quality "medium" balances cost/speed; "high" for hero.
 */
export async function generateScene(
  scene: Scene,
  opts: { quality?: "low" | "medium" | "high"; size?: "1024x1536" | "1024x1024" } = {},
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
        prompt: scenePrompt(scene),
        size: opts.size ?? "1024x1536",
        quality: opts.quality ?? "high",
        n: 1,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as { data?: { b64_json?: string; url?: string }[] };
    const item = json.data?.[0];
    if (item?.b64_json) return item.b64_json;
    // Some models/configs return a URL instead of inline b64 — fetch and encode.
    if (item?.url) {
      const img = await fetch(item.url);
      if (!img.ok) return null;
      return Buffer.from(await img.arrayBuffer()).toString("base64");
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
