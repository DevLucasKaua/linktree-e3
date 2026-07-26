import type { Palette } from "@/templates/types";

export const id = "bento-perfil";
export const name = "Bento";
export const description =
  "Cards escuros em grade bento com foto quadrada e ícones em tiles. Visual de portfólio moderno.";

export const defaultPalette: Palette = {
  bg: "#1b1926",
  surface: "#272433",
  primary: "#8f7ff7",
  text: "#f2f1f7",
  muted: "#928fa3",
  border: "rgba(255,255,255,0.07)",
};

/** Scrim escuro arroxeado: os cards bento seguem legíveis sobre a foto. */
export const bgScrim =
  "linear-gradient(rgba(20,18,30,0.72), rgba(20,18,30,0.66))";
