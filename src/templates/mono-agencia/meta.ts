import type { Palette } from "@/templates/types";

export const id = "mono-agencia";
export const name = "Mono";
export const description =
  "Minimalismo preto e branco: card de perfil com redes no topo e botões flat com seta.";

export const defaultPalette: Palette = {
  bg: "#f1f1f1",
  surface: "#ffffff",
  primary: "#141414",
  text: "#141414",
  muted: "#7a7a7a",
  border: "#e3e3e3",
};

/** Scrim claro neutro: mantém o contraste mono sobre a foto. */
export const bgScrim =
  "linear-gradient(rgba(243,243,243,0.9), rgba(243,243,243,0.86))";
