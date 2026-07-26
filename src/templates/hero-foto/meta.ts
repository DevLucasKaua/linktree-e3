import type { Palette } from "@/templates/types";

export const id = "hero-foto";
export const name = "Hero";
export const description =
  "Foto do cliente em destaque no topo, fundindo para o fundo escuro com o nome sobreposto.";

export const defaultPalette: Palette = {
  bg: "#101014",
  surface: "#1d1d25",
  primary: "#ff8a3d",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.09)",
};

/** Scrim escuro: a foto de FUNDO fica atrás; a foto-hero do cliente domina o topo. */
export const bgScrim =
  "linear-gradient(rgba(10,10,14,0.78), rgba(10,10,14,0.72))";
