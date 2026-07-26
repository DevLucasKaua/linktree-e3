import type { Palette } from "@/templates/types";

export const id = "editorial-papel";
export const name = "Editorial";
export const description =
  "Papel claro, serifa clássica e botões com borda irregular de recorte. Elegância de revista.";

export const defaultPalette: Palette = {
  bg: "#eceadf",
  surface: "#ffffff",
  primary: "#191713",
  text: "#191713",
  muted: "#6f6a5c",
  border: "#d9d3c2",
};

/** Scrim claro de papel: a foto vira textura sutil por trás do conteúdo. */
export const bgScrim =
  "linear-gradient(rgba(240,237,228,0.92), rgba(240,237,228,0.88))";
