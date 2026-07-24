/** Fontes Google curadas para o público jurídico; "" mantém a fonte do template. */
export interface FontDef {
  id: string;
  name: string;
  /** Valor de font-family aplicado no body (com fallbacks). */
  family: string;
  /** Parâmetro `family=` da URL css2 do Google Fonts. */
  googleParam: string;
}

export const FONTS: FontDef[] = [
  {
    id: "inter",
    name: "Inter (sem serifa, neutra)",
    family: "'Inter',system-ui,sans-serif",
    googleParam: "Inter:wght@400;600;700",
  },
  {
    id: "montserrat",
    name: "Montserrat (sem serifa, geométrica)",
    family: "'Montserrat',system-ui,sans-serif",
    googleParam: "Montserrat:wght@400;600;700",
  },
  {
    id: "lora",
    name: "Lora (serifa, contemporânea)",
    family: "'Lora',Georgia,serif",
    googleParam: "Lora:wght@400;600;700",
  },
  {
    id: "playfair",
    name: "Playfair Display (serifa, elegante)",
    family: "'Playfair Display',Georgia,serif",
    googleParam: "Playfair+Display:wght@400;600;700",
  },
  {
    id: "source-serif",
    name: "Source Serif 4 (serifa, editorial)",
    family: "'Source Serif 4',Georgia,serif",
    googleParam: "Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700",
  },
  {
    id: "crimson",
    name: "Crimson Text (serifa, clássica)",
    family: "'Crimson Text',Georgia,serif",
    googleParam: "Crimson+Text:wght@400;600;700",
  },
];

export function getFont(fontId: string): FontDef | null {
  return FONTS.find((font) => font.id === fontId) ?? null;
}
