import type { Palette } from "@/templates/types";

export const id = "juridico-serif";
export const name = "Jurídico Serif";
export const description =
  "Claro e formal, com serifa e tons de verde-escuro e dourado. Elegância tradicional.";

export const defaultPalette: Palette = {
  bg: "#faf7f2",
  surface: "#ffffff",
  primary: "#1e3a2f",
  text: "#2b2b2b",
  muted: "#7a746a",
  border: "#b08d3e",
};

/** Scrim claro: preserva a leitura do texto escuro sobre a foto. */
export const bgScrim =
  "linear-gradient(rgba(250,248,244,0.9), rgba(250,248,244,0.85))";
