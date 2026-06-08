/** Pure-SVG sparkline (server-renderable, no JS). Colored by net direction. */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (data.length < 2)
    return (
      <svg width={width} height={height} className={className} role="img" aria-label="No data">
        <title>No data</title>
      </svg>
    );

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pad = 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const last = data[data.length - 1] ?? 0;
  const first = data[0] ?? 0;
  const up = last >= first;
  const stroke = up ? "var(--color-up)" : "var(--color-down)";
  const fill = up ? "var(--color-up)" : "var(--color-down)";
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = `sl-${up ? "u" : "d"}-${width}-${data.length}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label={up ? "Upward price trend" : "Downward price trend"}
    >
      <title>{up ? "Upward price trend" : "Downward price trend"}</title>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.18" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
