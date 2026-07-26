import type { LinktreeConfig, TemplateDef } from "./types";
import * as e3ClassicMeta from "./e3-classic/meta";
import { Template as E3ClassicTemplate } from "./e3-classic/Template";
import { css as e3ClassicCss } from "./e3-classic/styles";
import * as juridicoSerifMeta from "./juridico-serif/meta";
import { Template as JuridicoSerifTemplate } from "./juridico-serif/Template";
import { css as juridicoSerifCss } from "./juridico-serif/styles";
import * as minimalCardMeta from "./minimal-card/meta";
import { Template as MinimalCardTemplate } from "./minimal-card/Template";
import { css as minimalCardCss } from "./minimal-card/styles";
import * as gradientGlassMeta from "./gradient-glass/meta";
import { Template as GradientGlassTemplate } from "./gradient-glass/Template";
import { css as gradientGlassCss } from "./gradient-glass/styles";
import * as executiveMeta from "./executive/meta";
import { Template as ExecutiveTemplate } from "./executive/Template";
import { css as executiveCss } from "./executive/styles";
import * as photoBgMeta from "./photo-bg/meta";
import { Template as PhotoBgTemplate } from "./photo-bg/Template";
import { css as photoBgCss } from "./photo-bg/styles";
import * as neonSolidMeta from "./neon-solid/meta";
import { Template as NeonSolidTemplate } from "./neon-solid/Template";
import { css as neonSolidCss } from "./neon-solid/styles";
import * as editorialPapelMeta from "./editorial-papel/meta";
import { Template as EditorialPapelTemplate } from "./editorial-papel/Template";
import { css as editorialPapelCss } from "./editorial-papel/styles";
import * as monoAgenciaMeta from "./mono-agencia/meta";
import { Template as MonoAgenciaTemplate } from "./mono-agencia/Template";
import { css as monoAgenciaCss } from "./mono-agencia/styles";
import * as bentoPerfilMeta from "./bento-perfil/meta";
import { Template as BentoPerfilTemplate } from "./bento-perfil/Template";
import { css as bentoPerfilCss } from "./bento-perfil/styles";
import * as heroFotoMeta from "./hero-foto/meta";
import { Template as HeroFotoTemplate } from "./hero-foto/Template";
import { css as heroFotoCss } from "./hero-foto/styles";

export const TEMPLATES: Record<string, TemplateDef> = {
  [e3ClassicMeta.id]: {
    ...e3ClassicMeta,
    Component: E3ClassicTemplate,
    css: e3ClassicCss,
  },
  [juridicoSerifMeta.id]: {
    ...juridicoSerifMeta,
    Component: JuridicoSerifTemplate,
    css: juridicoSerifCss,
  },
  [minimalCardMeta.id]: {
    ...minimalCardMeta,
    Component: MinimalCardTemplate,
    css: minimalCardCss,
  },
  [gradientGlassMeta.id]: {
    ...gradientGlassMeta,
    Component: GradientGlassTemplate,
    css: gradientGlassCss,
  },
  [executiveMeta.id]: {
    ...executiveMeta,
    Component: ExecutiveTemplate,
    css: executiveCss,
  },
  [photoBgMeta.id]: {
    ...photoBgMeta,
    Component: PhotoBgTemplate,
    css: photoBgCss,
  },
  [neonSolidMeta.id]: {
    ...neonSolidMeta,
    Component: NeonSolidTemplate,
    css: neonSolidCss,
  },
  [editorialPapelMeta.id]: {
    ...editorialPapelMeta,
    Component: EditorialPapelTemplate,
    css: editorialPapelCss,
  },
  [monoAgenciaMeta.id]: {
    ...monoAgenciaMeta,
    Component: MonoAgenciaTemplate,
    css: monoAgenciaCss,
  },
  [bentoPerfilMeta.id]: {
    ...bentoPerfilMeta,
    Component: BentoPerfilTemplate,
    css: bentoPerfilCss,
  },
  [heroFotoMeta.id]: {
    ...heroFotoMeta,
    Component: HeroFotoTemplate,
    css: heroFotoCss,
  },
};

export const DEFAULT_TEMPLATE_ID = e3ClassicMeta.id;

export function getTemplate(templateId: string): TemplateDef {
  return TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE_ID];
}

/** Config de exemplo usada nas miniaturas da galeria e em previews. */
export const SAMPLE_CONFIG: Omit<LinktreeConfig, "templateId" | "palette"> = {
  clientName: "Dra. Ana Beatriz Rocha",
  slug: "ana-beatriz-rocha",
  bio: "Advocacia previdenciária e trabalhista. Atendimento em todo o Brasil.",
  publishedUrl: "https://exemplo.adv.br/links",
  contact: {
    phone: "+55 11 99999-9999",
    email: "contato@exemplo.adv.br",
    org: "Rocha Advocacia",
  },
  tracking: { ga4Id: "", metaPixelId: "", gtmId: "" },
  fontId: "",
  bgImageUrl: null,
  socials: [
    {
      id: "sample-social-1",
      icon: "brand-instagram",
      url: "https://instagram.com/exemplo",
    },
    {
      id: "sample-social-2",
      icon: "brand-linkedin",
      url: "https://linkedin.com/in/exemplo",
    },
    {
      id: "sample-social-3",
      icon: "brand-youtube",
      url: "https://youtube.com/@exemplo",
    },
  ],
  links: [
    {
      id: "sample-1",
      type: "whatsapp",
      label: "Agende uma consulta",
      description: "Atendimento por WhatsApp",
      icon: "brand-whatsapp",
      url: "+55 11 99999-9999",
      message: "Olá! Vim pelo seu linktree e gostaria de agendar uma consulta.",
      active: true,
      highlight: true,
    },
    {
      id: "sample-2",
      label: "Conheça o escritório",
      description: "Áreas de atuação e equipe",
      icon: "scale",
      url: "https://exemplo.adv.br",
      active: true,
    },
    {
      id: "sample-3",
      label: "Instagram",
      description: "Conteúdo diário sobre seus direitos",
      icon: "brand-instagram",
      url: "https://instagram.com/exemplo",
      active: true,
    },
  ],
};

export function sampleConfigFor(template: TemplateDef): LinktreeConfig {
  return {
    ...SAMPLE_CONFIG,
    templateId: template.id,
    palette: template.defaultPalette,
  };
}
