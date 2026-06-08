/** KRW / number / percent formatters. All locale-stable (ko-KR) and SSR-safe. */

const krw = new Intl.NumberFormat("ko-KR");

/** Plain integer with thousands separators: 74800 → "74,800". */
export function num(n: number): string {
  return krw.format(Math.round(n));
}

/** Price in won: 74800 → "74,800". (unit appended by caller, e.g. "원") */
export function price(n: number): string {
  return krw.format(Math.round(n));
}

/** Signed percent: 1.234 → "+1.23%", -0.5 → "-0.50%". */
export function pct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/** Signed price change: 1200 → "+1,200", -500 → "-500". */
export function signed(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}${krw.format(Math.abs(Math.round(n)))}`;
}

/** Compact Korean money units (억/조) for market cap & traded value. */
export function won(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_0000_0000_0000) return `${(n / 1_0000_0000_0000).toFixed(1)}조`;
  if (abs >= 1_0000_0000) return `${Math.round(n / 1_0000_0000).toLocaleString("ko-KR")}억`;
  if (abs >= 1_0000) return `${Math.round(n / 1_0000).toLocaleString("ko-KR")}만`;
  return krw.format(Math.round(n));
}

/** Compact share volume: 1234567 → "123.5만주" style. */
export function volume(n: number): string {
  if (n >= 1_0000_0000) return `${(n / 1_0000_0000).toFixed(2)}억주`;
  if (n >= 1_0000) return `${(n / 1_0000).toFixed(1)}만주`;
  return `${krw.format(Math.round(n))}주`;
}

/** Direction helper: 1 up, -1 down, 0 flat. */
export function dir(n: number): 1 | -1 | 0 {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
