import type { Palette } from "@/templates/types";

export const id = "minimal-card";
export const name = "Minimal";
export const description =
  "Card branco central sobre fundo neutro, botões sólidos. Limpo e direto.";

export const defaultPalette: Palette = {
  bg: "#eef0f2",
  surface: "#ffffff",
  primary: "#16181d",
  text: "#16181d",
  muted: "#6b7280",
  border: "#e5e7eb",
};

/** Scrim claro suave: o card branco central continua protagonista. */
export const bgScrim =
  "linear-gradient(rgba(244,244,246,0.82), rgba(244,244,246,0.78))";
