import type { Palette } from "@/templates/types";

export const id = "neon-solid";
export const name = "Neon";
export const description =
  "Botões sólidos vibrantes sobre foto noturna. Energia urbana para perfis com personalidade.";

export const defaultPalette: Palette = {
  bg: "#1c1024",
  surface: "#e05e2b",
  primary: "#e05e2b",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.8)",
  border: "rgba(255,255,255,0.25)",
};

/** Scrim médio: deixa o neon da foto respirar sem perder leitura. */
export const bgScrim =
  "linear-gradient(rgba(12,6,18,0.5), rgba(12,6,18,0.35) 45%, rgba(12,6,18,0.55))";
