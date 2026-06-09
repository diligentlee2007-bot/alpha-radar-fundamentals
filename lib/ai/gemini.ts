/**
 * Free Gemini TEXT generation (gemini-2.5-flash). The free tier includes text
 * (unlike image models, which require billing). Used to synthesize the daily
 * "why did the market move" brief. Returns null on any failure so callers fall
 * back to a plain template. Never logs the key.
 */

export function geminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY?.trim();
}

async function tryModel(model: string, key: string, prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
        }),
        signal: controller.signal,
      },
    );
    if (!res.ok) return null; // 503 overloaded / 429 / etc. → caller tries next model
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = (json.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function geminiText(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  // Try a few text models in order — handles transient 503 overloads.
  const models = [
    process.env.GEMINI_TEXT_MODEL?.trim(),
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ].filter((m): m is string => !!m);
  for (const model of models) {
    const out = await tryModel(model, key, prompt);
    if (out) return out;
  }
  return null;
}
