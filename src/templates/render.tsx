import { renderToStaticMarkup } from "react-dom/server";
import type { LinktreeConfig } from "./types";
import { getTemplate } from "./registry";

/** Versão fixada do CDN de ícones para estabilidade visual do export. */
const TABLER_ICONS_CDN =
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css";

export interface RenderOptions {
  /** src da foto no HTML: URL do Storage (preview) ou "foto.jpg" (export). */
  photoSrc?: string | null;
  /** href do vCard: data URI (preview/copiar) ou "contato.vcf" (export). */
  vcardSrc?: string | null;
  /** href do favicon 32px: data URI (copiar) ou "favicon.png" (export). */
  faviconSrc?: string | null;
  /** href do ícone de toque 180px: data URI (copiar) ou "apple-touch-icon.png" (export). */
  appleIconSrc?: string | null;
}

/**
 * Gera o documento HTML completo e self-contained do linktree.
 * Usada tanto no preview do editor (iframe srcDoc) quanto no export (ZIP) —
 * o que o gestor vê é byte a byte o que será publicado.
 */
export function buildLinktreeHtml(
  config: LinktreeConfig,
  opts: RenderOptions = {}
): string {
  const template = getTemplate(config.templateId);
  const body = renderToStaticMarkup(
    <template.Component
      config={config}
      photoSrc={opts.photoSrc ?? null}
      vcardSrc={opts.vcardSrc ?? null}
    />
  );

  // URL pública sem barra final; base do og:url, canonical e og:image.
  const publishedUrl = config.publishedUrl.trim().replace(/\/+$/, "");
  // og:image precisa de URL absoluta — só existe quando há foto e URL publicada.
  const photoAbsUrl =
    publishedUrl && opts.photoSrc ? `${publishedUrl}/foto.jpg` : "";

  const headExtras = [
    publishedUrl &&
      `<meta property="og:url" content="${escapeHtml(publishedUrl)}">`,
    publishedUrl &&
      `<link rel="canonical" href="${escapeHtml(publishedUrl)}">`,
    photoAbsUrl &&
      `<meta property="og:image" content="${escapeHtml(photoAbsUrl)}">`,
    `<meta name="theme-color" content="${escapeHtml(config.palette.bg)}">`,
    opts.faviconSrc &&
      `<link rel="icon" type="image/png" href="${escapeHtml(opts.faviconSrc)}">`,
    opts.appleIconSrc &&
      `<link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(opts.appleIconSrc)}">`,
    `<script type="application/ld+json">${buildJsonLd(config, publishedUrl, photoAbsUrl)}</script>`,
  ]
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(config.clientName)}</title>
<meta name="description" content="${escapeHtml(config.bio)}">
<meta property="og:title" content="${escapeHtml(config.clientName)}">
<meta property="og:description" content="${escapeHtml(config.bio)}">
<meta property="og:type" content="website">
${headExtras}
<link rel="stylesheet" href="${TABLER_ICONS_CDN}">
<style>
${template.css(config.palette)}
</style>
</head>
<body>
${body}
</body>
</html>
`;
}

/** Dados estruturados (schema.org) do cliente para buscadores. */
function buildJsonLd(
  config: LinktreeConfig,
  publishedUrl: string,
  photoAbsUrl: string
): string {
  const { phone, email, org } = config.contact;
  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.clientName,
  };
  if (config.bio.trim()) person.description = config.bio.trim();
  if (publishedUrl) person.url = publishedUrl;
  if (photoAbsUrl) person.image = photoAbsUrl;
  if (phone.trim()) person.telephone = phone.trim();
  if (email.trim()) person.email = email.trim();
  if (org.trim()) {
    person.worksFor = { "@type": "LegalService", name: org.trim() };
  }
  // "<" escapado impede fechamento precoce da tag <script>.
  return JSON.stringify(person).replaceAll("<", "\\u003c");
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
