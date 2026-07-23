import { renderToStaticMarkup } from "react-dom/server";
import type { LinktreeConfig } from "./types";
import { getTemplate } from "./registry";

/** Versão fixada do CDN de ícones para estabilidade visual do export. */
const TABLER_ICONS_CDN =
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css";

export interface RenderOptions {
  /** src da foto no HTML: URL do Storage (preview) ou "foto.jpg" (export). */
  photoSrc?: string | null;
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
    <template.Component config={config} photoSrc={opts.photoSrc ?? null} />
  );

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(config.clientName)}</title>
<meta name="description" content="${escapeHtml(config.bio)}">
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

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
