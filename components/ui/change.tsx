import { CaretDownIcon, CaretUpIcon, MinusIcon } from "@phosphor-icons/react/dist/ssr";
import { pct, signed } from "@/lib/format";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const textSize: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function colorClass(change: number): string {
  if (change > 0) return "text-[var(--color-up)]";
  if (change < 0) return "text-[var(--color-down)]";
  return "text-[var(--color-flat)]";
}

/** Inline change figure: caret + signed value and/or percent, in KR direction colors. */
export function Change({
  change,
  changePct,
  size = "md",
  showValue = true,
  showPct = true,
  className,
}: {
  change: number;
  changePct: number;
  size?: Size;
  showValue?: boolean;
  showPct?: boolean;
  className?: string;
}) {
  const Icon = change > 0 ? CaretUpIcon : change < 0 ? CaretDownIcon : MinusIcon;
  return (
    <span
      className={cn(
        "tnum inline-flex items-center gap-1 font-medium",
        textSize[size],
        colorClass(change),
        className,
      )}
    >
      <Icon weight="fill" className="size-3 shrink-0" aria-hidden />
      {showValue && <span>{signed(change)}</span>}
      {showPct && <span>{showValue ? `(${pct(changePct)})` : pct(changePct)}</span>}
    </span>
  );
}

/** Pill variant for compact contexts. */
export function ChangePill({ changePct, className }: { changePct: number; className?: string }) {
  const bg =
    changePct > 0
      ? "bg-[var(--color-up-soft)] text-[var(--color-up)]"
      : changePct < 0
        ? "bg-[var(--color-down-soft)] text-[var(--color-down)]"
        : "bg-[var(--color-surface-2)] text-[var(--color-flat)]";
  return (
    <span
      className={cn(
        "tnum inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        bg,
        className,
      )}
    >
      {pct(changePct)}
    </span>
  );
}
