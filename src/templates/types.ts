import type { ReactElement } from "react";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface LinkItem {
  id: string;
  label: string;
  description?: string;
  /** Nome do ícone tabler sem o prefixo "ti ti-", ex: "rocket", "brand-instagram". */
  icon: string;
  url: string;
  utm?: UtmParams;
  active: boolean;
}

/** Chaves fixas de cor; cada template define seus valores padrão. */
export interface Palette {
  bg: string;
  surface: string;
  primary: string;
  text: string;
  muted: string;
  border: string;
}

/** Subconjunto renderizável do documento do Firestore. */
export interface LinktreeConfig {
  clientName: string;
  slug: string;
  bio: string;
  templateId: string;
  palette: Palette;
  links: LinkItem[];
}

export interface TemplateProps {
  config: LinktreeConfig;
  /** src da foto no HTML final (URL do Storage no preview, "foto.jpg" no export). */
  photoSrc: string | null;
}

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  defaultPalette: Palette;
  Component: (props: TemplateProps) => ReactElement;
  /** CSS puro do template com a paleta interpolada. */
  css: (palette: Palette) => string;
}
