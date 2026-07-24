import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "warn" | "accent" | "pos";

const STYLES: Record<BadgeVariant, string> = {
  neutral: "border-hair bg-field text-muted",
  warn: "border-warn/25 bg-warn-soft text-warn",
  accent: "border-accent/25 bg-accent-soft text-accent-deep",
  pos: "border-pos/25 bg-pos/12 text-pos",
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
      className={`inline-flex shrink-0 items-center gap-1 rounded-[7px] border px-2 py-0.5 text-xs ${STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
