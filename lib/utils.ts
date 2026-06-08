import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Map a change direction to a token color class set. */
export function dirClasses(change: number): { text: string; bg: string } {
  if (change > 0) return { text: "text-[var(--color-up)]", bg: "bg-[var(--color-up-soft)]" };
  if (change < 0) return { text: "text-[var(--color-down)]", bg: "bg-[var(--color-down-soft)]" };
  return { text: "text-[var(--color-flat)]", bg: "bg-[var(--color-surface-2)]" };
}
