import JSZip from "jszip";
import { buildLinktreeHtml } from "@/templates/render";
import type { LinktreeDoc } from "@/lib/linktrees";
import {
  APPLE_ICON_SIZE,
  FAVICON_SIZE,
  photoToIconBlob,
  photoToIconDataUri,
} from "@/lib/favicon";
import { buildVcard, hasVcardData, vcardDataUri } from "@/lib/vcard";
import { qrCodePngBlob } from "@/lib/qrcode";
import { isWithinSchedule } from "@/lib/utils";

/** Campos que precisam estar preenchidos para publicar. */
export function exportBlockers(doc: LinktreeDoc): string[] {
  const blockers: string[] = [];
  if (!doc.clientName.trim() || doc.clientName === "Novo cliente") {
    blockers.push("nome do cliente");
  }
  if (!doc.slug.trim()) blockers.push("slug");
  if (doc.links.filter((link) => link.active && link.url.trim()).length === 0) {
    blockers.push("ao menos 1 link ativo com URL");
  }
  return blockers;
}

/** Avisos não-bloqueantes exibidos antes de publicar (a página sai no ar mesmo assim). */
export function exportWarnings(doc: LinktreeDoc): string[] {
  const warnings: string[] = [];
  if (!doc.photoUrl) warnings.push("sem foto do cliente");
  if (!doc.bio.trim()) warnings.push("sem bio");
  if (!doc.publishedUrl.trim()) {
    warnings.push("sem URL publicada (QR code e tags de SEO ficam de fora)");
  }
  const clickable = doc.links.filter(
    (link) =>
      link.active && link.url.trim() && (link.type ?? "link") !== "header"
  );
  if (
    clickable.length > 0 &&
    clickable.every((link) => !isWithinSchedule(link, new Date()))
  ) {
    warnings.push(
      "todos os links ativos estão fora da janela de agendamento (a página abriria vazia hoje)"
    );
  }
  return warnings;
}

/**
 * Gera e baixa o ZIP de deploy: {slug}/index.html + foto.jpg, favicons,
 * contato.vcf e qrcode.png (conforme os dados preenchidos).
 * Mesmo formato das LPs estáticas da E3: descompactar e subir a pasta.
 */
export async function exportLinktreeZip(doc: LinktreeDoc): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(doc.slug)!;

  const hasPhoto = Boolean(doc.photoUrl);
  const includeVcard = hasVcardData(doc);
  const publishedUrl = doc.publishedUrl.trim();

  const hasBg = Boolean(doc.bgImageUrl);
  const html = buildLinktreeHtml(doc, {
    photoSrc: hasPhoto ? "foto.jpg" : null,
    bgSrc: hasBg ? "fundo.jpg" : null,
    vcardSrc: includeVcard ? "contato.vcf" : null,
    faviconSrc: hasPhoto ? "favicon.png" : null,
    appleIconSrc: hasPhoto ? "apple-touch-icon.png" : null,
  });
  folder.file("index.html", html);

  if (hasBg) {
    const bgBlob = await fetch(doc.bgImageUrl!).then((res) => res.blob());
    folder.file("fundo.jpg", bgBlob);
  }

  if (hasPhoto) {
    // photoUrl é um data URI JPEG; fetch local o converte em blob (sem rede).
    const photoBlob = await fetch(doc.photoUrl!).then((res) => res.blob());
    folder.file("foto.jpg", photoBlob);
    folder.file("favicon.png", await photoToIconBlob(doc.photoUrl!, FAVICON_SIZE));
    folder.file(
      "apple-touch-icon.png",
      await photoToIconBlob(doc.photoUrl!, APPLE_ICON_SIZE)
    );
  }

  if (includeVcard) {
    folder.file("contato.vcf", buildVcard(doc, doc.photoUrl));
  }

  // QR da URL publicada, pronto para cartões e materiais impressos.
  if (publishedUrl) {
    folder.file("qrcode.png", await qrCodePngBlob(publishedUrl));
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${doc.slug}.zip`);
}

/** HTML self-contained (foto, favicons e vCard como data URI) para a área de transferência. */
export async function copyLinktreeHtml(doc: LinktreeDoc): Promise<void> {
  const html = buildLinktreeHtml(doc, {
    photoSrc: doc.photoUrl,
    bgSrc: doc.bgImageUrl,
    vcardSrc: vcardDataUri(doc, doc.photoUrl),
    faviconSrc: doc.photoUrl
      ? await photoToIconDataUri(doc.photoUrl, FAVICON_SIZE)
      : null,
    appleIconSrc: doc.photoUrl
      ? await photoToIconDataUri(doc.photoUrl, APPLE_ICON_SIZE)
      : null,
  });
  await navigator.clipboard.writeText(html);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
