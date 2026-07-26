import type { Palette } from "@/templates/types";

export const id = "executive";
export const name = "Executivo";
export const description =
  "Navy profundo com detalhes dourados e foto quadrada. Ar premium e sóbrio.";

export const defaultPalette: Palette = {
  bg: "#0b1f3a",
  surface: "#122b4d",
  primary: "#c9a227",
  text: "#f4f1e8",
  muted: "rgba(244,241,232,0.5)",
  border: "#c9a227",
};

/** Scrim navy: mantém a identidade executiva sobre a foto. */
export const bgScrim =
  "linear-gradient(rgba(8,20,38,0.72), rgba(8,20,38,0.66))";
