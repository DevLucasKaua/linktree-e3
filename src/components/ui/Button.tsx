import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "icon" | "iconDanger";

/**
 * Vocabulário único de botões do painel (linguagem clash):
 * primário no gradiente da marca com glow, secundário chip glass hairline.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "glass-tint pressable rounded-full px-4 py-2 font-semibold text-white hover:brightness-110",
  secondary:
    "glass pressable rounded-full border border-hair bg-field px-3.5 py-1.5 hover:bg-hover",
  danger:
    "glass pressable rounded-full border border-hair bg-field px-3.5 py-1.5 text-neg hover:border-neg",
  icon: "glass pressable h-8 w-8 rounded-full border border-hair bg-field hover:bg-hover",
  iconDanger:
    "glass pressable h-8 w-8 rounded-full border border-hair bg-field text-neg hover:border-neg",
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
