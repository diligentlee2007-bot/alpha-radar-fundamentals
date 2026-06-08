/**
 * 주식이 (Joosik) — the brand mascot: a personified stock chart. Drawn entirely as
 * inline SVG with gradients + soft shadow for a glossy, 3D-ish feel (no image API,
 * no package). One source of truth `joosikSvg()` is used by the React component and
 * rasterized into the carousel PNG export. Mood (up/down/flat) flips the colors,
 * the belly chart line, and the expression so the card reflects the market.
 */

export type Mood = "up" | "down" | "flat";

const PAL: Record<Mood, { c1: string; c2: string; line: string; chart: string; mouth: string }> = {
  up: {
    c1: "#6ee7b7",
    c2: "#059669",
    line: "#065f46",
    chart: "M38 96 L52 84 L64 90 L82 66",
    mouth: "M50 80 Q60 90 70 80",
  },
  down: {
    c1: "#fda4af",
    c2: "#e11d48",
    line: "#881337",
    chart: "M38 70 L52 84 L64 78 L82 98",
    mouth: "M50 86 Q60 78 70 86",
  },
  flat: {
    c1: "#cbd5e1",
    c2: "#64748b",
    line: "#334155",
    chart: "M38 82 L52 80 L64 83 L82 81",
    mouth: "M50 84 L70 84",
  },
};

export function joosikSvg(size = 120, mood: Mood = "up"): string {
  const p = PAL[mood];
  const arrow =
    mood === "up"
      ? `<path d="M82 66 l-9 1 m9 -1 l-1 9" stroke="${p.line}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
      : mood === "down"
        ? `<path d="M82 98 l-9 -1 m9 1 l-1 -9" stroke="${p.line}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
        : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 130" fill="none">
  <defs>
    <linearGradient id="jb-${mood}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.c1}"/><stop offset="100%" stop-color="${p.c2}"/>
    </linearGradient>
    <linearGradient id="jp-${mood}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e8fbf3"/>
    </linearGradient>
    <radialGradient id="jg-${mood}" cx="0.32" cy="0.26" r="0.7">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="60" cy="123" rx="34" ry="6" fill="#000000" opacity="0.18"/>
  <rect x="16" y="40" width="14" height="26" rx="7" fill="url(#jb-${mood})"/>
  <rect x="90" y="40" width="14" height="26" rx="7" fill="url(#jb-${mood})"/>
  <rect x="20" y="18" width="80" height="96" rx="28" fill="url(#jb-${mood})"/>
  <rect x="20" y="18" width="80" height="96" rx="28" fill="url(#jg-${mood})"/>
  <circle cx="47" cy="46" r="6.5" fill="#ffffff"/><circle cx="73" cy="46" r="6.5" fill="#ffffff"/>
  <circle cx="48" cy="47" r="3" fill="#16181d"/><circle cx="74" cy="47" r="3" fill="#16181d"/>
  <circle cx="46" cy="45" r="1.1" fill="#ffffff"/><circle cx="72" cy="45" r="1.1" fill="#ffffff"/>
  <path d="${p.mouth}" stroke="#16181d" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <ellipse cx="38" cy="60" rx="4" ry="2.6" fill="#fb7185" opacity="0.5"/>
  <ellipse cx="82" cy="60" rx="4" ry="2.6" fill="#fb7185" opacity="0.5"/>
  <rect x="34" y="70" width="52" height="34" rx="10" fill="url(#jp-${mood})"/>
  <path d="${p.chart}" stroke="${p.line}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  ${arrow}
</svg>`;
}

export function Joosik({
  size = 48,
  mood = "up",
  className,
}: {
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  return (
    <span
      className={className}
      aria-hidden
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static markup
      dangerouslySetInnerHTML={{ __html: joosikSvg(size, mood) }}
    />
  );
}
