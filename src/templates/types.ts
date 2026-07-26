import type { ReactElement } from "react";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

/** Tipo do bloco na página; ausente equivale a "link" (retrocompatível). */
export type LinkItemType = "link" | "header" | "whatsapp" | "youtube";

export interface LinkItem {
  id: string;
  type?: LinkItemType;
  label: string;
  description?: string;
  /** Nome do ícone tabler sem o prefixo "ti ti-", ex: "rocket", "brand-instagram". */
  icon: string;
  /** link/youtube: URL; whatsapp: número de telefone; header: não usado. */
  url: string;
  /** Mensagem pré-preenchida do WhatsApp (só type "whatsapp"). */
  message?: string;
  utm?: UtmParams;
  active: boolean;
  /** Destaque visual: borda no acento + selo de estrela + pulso sutil. */
  highlight?: boolean;
  /** Agendamento: exibir a partir desta data (ISO "AAAA-MM-DD", inclusive). */
  startAt?: string;
  /** Agendamento: exibir até esta data (ISO "AAAA-MM-DD", inclusive). */
  endAt?: string;
}

/** Ícone de rede social exibido na linha abaixo da bio. */
export interface SocialLink {
  id: string;
  icon: string;
  url: string;
}

/** IDs de rastreamento de terceiros injetados no HTML exportado. */
export interface TrackingInfo {
  /** Google Analytics 4, formato "G-XXXXXXXXXX". */
  ga4Id: string;
  /** Meta Pixel, só dígitos. */
  metaPixelId: string;
  /** Google Tag Manager, formato "GTM-XXXXXXX". */
  gtmId: string;
}

/** Dados de contato do cliente, usados no vCard "Salvar contato" e no JSON-LD. */
export interface ContactInfo {
  phone: string;
  email: string;
  /** Nome do escritório/organização. */
  org: string;
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
  socials: SocialLink[];
  /** URL pública onde o cliente hospeda a página (alimenta og:url, canonical e QR code). */
  publishedUrl: string;
  contact: ContactInfo;
  tracking: TrackingInfo;
  /** ID de fonte Google (src/templates/fonts.ts); "" mantém a fonte do template. */
  fontId: string;
  /** Imagem de fundo da página como data URI JPEG (null = fundo padrão do template). */
  bgImageUrl: string | null;
}

export interface TemplateProps {
  config: LinktreeConfig;
  /** src da foto no HTML final (URL do Storage no preview, "foto.jpg" no export). */
  photoSrc: string | null;
  /** href do vCard ("contato.vcf" no export, data URI no preview); null oculta o botão "Salvar contato". */
  vcardSrc: string | null;
}

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  defaultPalette: Palette;
  /**
   * Gradiente sobreposto à imagem de fundo do usuário para preservar o
   * contraste do template (escuro nos templates dark, claro nos claros).
   */
  bgScrim?: string;
  Component: (props: TemplateProps) => ReactElement;
  /** CSS puro do template com a paleta interpolada. */
  css: (palette: Palette) => string;
}
