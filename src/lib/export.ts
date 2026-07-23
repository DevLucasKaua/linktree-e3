import JSZip from "jszip";
import { buildLinktreeHtml } from "@/templates/render";
import type { LinktreeDoc } from "@/lib/linktrees";

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

/**
 * Gera e baixa o ZIP de deploy: {slug}/index.html (+ {slug}/foto.jpg).
 * Mesmo formato das LPs estáticas da E3: descompactar e subir a pasta.
 */
export async function exportLinktreeZip(doc: LinktreeDoc): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(doc.slug)!;

  const hasPhoto = Boolean(doc.photoUrl);
  const html = buildLinktreeHtml(doc, {
    photoSrc: hasPhoto ? "foto.jpg" : null,
  });
  folder.file("index.html", html);

  if (hasPhoto) {
    // photoUrl é um data URI JPEG; fetch local o converte em blob (sem rede).
    const photoBlob = await fetch(doc.photoUrl!).then((res) => res.blob());
    folder.file("foto.jpg", photoBlob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${doc.slug}.zip`);
}

/** HTML self-contained (foto embutida como data URI) para a área de transferência. */
export async function copyLinktreeHtml(doc: LinktreeDoc): Promise<void> {
  const html = buildLinktreeHtml(doc, { photoSrc: doc.photoUrl });
  await navigator.clipboard.writeText(html);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
