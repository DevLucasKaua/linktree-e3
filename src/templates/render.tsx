import { renderToStaticMarkup } from "react-dom/server";
import type { LinktreeConfig, TrackingInfo } from "./types";
import { getTemplate } from "./registry";
import { getFont } from "./fonts";
import { TRACKING_PATTERNS } from "@/lib/utils";

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

  const tracking = buildTrackingSnippets(config.tracking);

  // Script só entra quando algum bloco ativo tem janela de agendamento:
  // a página estática pode ficar dias no ar, então o estado é recalculado a cada abertura.
  const hasSchedule = config.links.some(
    (link) => link.active && (link.startAt || link.endAt)
  );
  const scheduleScript = hasSchedule
    ? `<script>(function(){var now=new Date();document.querySelectorAll("[data-start],[data-end]").forEach(function(el){var s=el.getAttribute("data-start");var e=el.getAttribute("data-end");el.hidden=Boolean((s&&now<new Date(s+"T00:00:00"))||(e&&now>new Date(e+"T23:59:59")));});})();</script>\n`
    : "";

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
    tracking.head,
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
${fontAssets(config.fontId).links}<style>
${template.css(config.palette)}
${fontAssets(config.fontId).css}</style>
</head>
<body>
${tracking.bodyStart}${body}
${scheduleScript}</body>
</html>
`;
}

/**
 * Fonte Google escolhida: links de carregamento (head) + override do body.
 * O override entra no FINAL do <style> do template — os templates só definem
 * font-family no body, então a regra posterior vence sem !important.
 */
function fontAssets(fontId: string): { links: string; css: string } {
  const font = getFont(fontId);
  if (!font) return { links: "", css: "" };
  return {
    links: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${font.googleParam}&display=swap">
`,
    css: `body{font-family:${font.family}}
`,
  };
}

/**
 * Snippets oficiais de rastreamento. IDs só entram se casarem com o formato
 * esperado (TRACKING_PATTERNS) — o que também os torna seguros para interpolar.
 */
function buildTrackingSnippets(tracking: TrackingInfo): {
  head: string;
  bodyStart: string;
} {
  const head: string[] = [];
  const bodyStart: string[] = [];

  const gtm = tracking.gtmId.trim().toUpperCase();
  if (TRACKING_PATTERNS.gtmId.test(gtm)) {
    head.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');</script>`
    );
    bodyStart.push(
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n`
    );
  }

  const ga4 = tracking.ga4Id.trim().toUpperCase();
  if (TRACKING_PATTERNS.ga4Id.test(ga4)) {
    head.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}');</script>`
    );
  }

  const pixel = tracking.metaPixelId.trim();
  if (TRACKING_PATTERNS.metaPixelId.test(pixel)) {
    head.push(
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');</script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1"/></noscript>`
    );
  }

  return { head: head.join("\n"), bodyStart: bodyStart.join("") };
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
