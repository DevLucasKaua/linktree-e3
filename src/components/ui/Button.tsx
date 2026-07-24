import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "icon" | "iconDanger";

/**
 * Vocabulário único de botões do painel (linguagem KAPTA):
 * primário "ink" (preto/branco), secundário hairline, destrutivo em `neg`.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "rounded-lg bg-ink px-4 py-2 font-medium text-bg transition-opacity hover:opacity-85",
  secondary:
    "rounded-lg border border-hair bg-surface px-3 py-1.5 transition-colors hover:border-muted",
  danger:
    "rounded-lg border border-hair bg-surface px-3 py-1.5 text-neg transition-colors hover:border-neg",
  icon: "h-8 w-8 rounded-lg border border-hair bg-surface transition-colors hover:border-muted",
  iconDanger:
    "h-8 w-8 rounded-lg border border-hair bg-surface text-neg transition-colors hover:border-neg",
};

export function Button({
  variant = "secondary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
