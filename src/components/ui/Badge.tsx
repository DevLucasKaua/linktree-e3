import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "warn" | "accent" | "pos";

const STYLES: Record<BadgeVariant, string> = {
  neutral: "border-hair bg-bg text-muted",
  warn: "border-warn/30 bg-warn-soft text-warn",
  accent: "border-accent/30 bg-accent-soft text-accent-deep",
  pos: "border-pos/30 bg-pos/10 text-pos",
};

export function Badge({
  variant = "neutral",
  title,
  children,
}: {
  variant?: BadgeVariant;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
