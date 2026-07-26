import type { Palette } from "@/templates/types";

export const id = "photo-bg";
export const name = "Foto de Fundo";
export const description =
  "Pills brancas flutuando sobre a foto de fundo com filtro de contraste. O clássico das bio pages.";

export const defaultPalette: Palette = {
  bg: "#16161c",
  surface: "#ffffff",
  primary: "#15161c",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.78)",
  border: "rgba(255,255,255,0.35)",
};

/** Scrim leve: a foto é a estrela; pills brancas garantem a leitura. */
export const bgScrim =
  "linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.45))";
