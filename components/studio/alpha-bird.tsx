/**
 * Alpha Bird — the brand mascot, drawn entirely as inline SVG (no image service,
 * no AI image API, no package). A clean geometric bird with a radar antenna and an
 * "up" arrow on its belly: friendly but professional enough for a finance feed.
 *
 * Single source of truth: `alphaBirdSvg()` returns the markup, used both by the
 * React component and rasterized onto the carousel PNG export (<canvas>).
 */

export function alphaBirdSvg(size = 120): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120" fill="none">
  <line x1="60" y1="20" x2="60" y2="36" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <circle cx="60" cy="16" r="5" fill="#34d399"/>
  <ellipse cx="60" cy="72" rx="40" ry="40" fill="#34d399"/>
  <path d="M26 66 q-12 6 -5 23 q13 -1 16 -16 z" fill="#10b981"/>
  <ellipse cx="60" cy="84" rx="25" ry="22" fill="#ecfdf5"/>
  <path d="M50 91 L60 80 L70 91 M60 80 L60 99" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="58" r="7.5" fill="#ffffff"/>
  <circle cx="70" cy="58" r="7.5" fill="#ffffff"/>
  <circle cx="51" cy="59" r="3.3" fill="#16181d"/>
  <circle cx="71" cy="59" r="3.3" fill="#16181d"/>
  <path d="M55 66 L65 66 L60 73 Z" fill="#f59e0b"/>
</svg>`;
}

export function AlphaBird({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <span
      className={className}
      aria-hidden
      // Static, author-controlled SVG — safe.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static markup
      dangerouslySetInnerHTML={{ __html: alphaBirdSvg(size) }}
    />
  );
}
