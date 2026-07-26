import type { Palette } from "@/templates/types";

export const id = "gradient-glass";
export const name = "Gradiente";
export const description =
  "Fundo em gradiente escuro com botões translúcidos estilo vidro. Moderno e vibrante.";

export const defaultPalette: Palette = {
  bg: "#0f1035",
  surface: "#ffffff",
  primary: "#6d28d9",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.18)",
};

/** Scrim escuro: os cartões de vidro seguem legíveis sobre a foto. */
export const bgScrim =
  "linear-gradient(rgba(10,10,16,0.6), rgba(10,10,16,0.55))";
