import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-700)]">
      <span className="size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
      {children}
    </span>
  );
}

export function SectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8",
        className,
      )}
    >
      <Reveal>
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-[var(--color-fg-strong)] sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-pretty text-[var(--color-muted)]">
              {subtitle}
            </p>
          )}
        </div>
      </Reveal>
      {children && <div className="mt-12">{children}</div>}
    </section>
  );
}
