import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "accent" | "kospi" | "kosdaq";

const variants: Record<Variant, string> = {
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border-[var(--color-accent-100)]",
  kospi:
    "bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border-[var(--color-accent-100)]",
  kosdaq: "bg-[var(--color-up-soft)] text-[var(--color-up)] border-transparent",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
