import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-fg-strong)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-sm font-medium text-[var(--color-accent-700)] hover:text-[var(--color-accent)]"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <section className="mt-10 first:mt-0">{children}</section>
    </Reveal>
  );
}
