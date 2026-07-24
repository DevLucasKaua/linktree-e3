import type { LinktreeConfig } from "@/templates/types";

/** true se há dados suficientes para um vCard útil (botão "Salvar contato"). */
export function hasVcardData(config: LinktreeConfig): boolean {
  const contact = config.contact;
  return Boolean(contact && (contact.phone.trim() || contact.email.trim()));
}

/**
 * Gera o conteúdo do arquivo .vcf (vCard 3.0) do cliente.
 * A foto (data URI JPEG do documento) é embutida em base64 quando presente.
 */
export function buildVcard(
  config: LinktreeConfig,
  photoDataUri: string | null
): string {
  const { phone, email, org } = config.contact;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    // Sem sobrenome estruturado confiável; FN é o nome de exibição.
    `N:;${escapeVcf(config.clientName)};;;`,
    `FN:${escapeVcf(config.clientName)}`,
  ];
  if (org.trim()) lines.push(`ORG:${escapeVcf(org.trim())}`);
  if (phone.trim()) lines.push(`TEL;TYPE=CELL:${escapeVcf(phone.trim())}`);
  if (email.trim()) lines.push(`EMAIL:${escapeVcf(email.trim())}`);
  if (config.publishedUrl.trim()) {
    lines.push(`URL:${escapeVcf(config.publishedUrl.trim())}`);
  }
  if (config.bio.trim()) lines.push(`NOTE:${escapeVcf(config.bio.trim())}`);

  const photoBase64 = photoDataUri?.split(",")[1];
  if (photoBase64) {
    lines.push(foldLine(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`));
  }

  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

/** vCard como data URI (href do botão no preview e no "Copiar HTML"); null se faltam dados. */
export function vcardDataUri(
  config: LinktreeConfig,
  photoDataUri: string | null
): string | null {
  if (!hasVcardData(config)) return null;
  const vcf = buildVcard(config, photoDataUri);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`;
}

/** Escapa os caracteres reservados de valores vCard. */
function escapeVcf(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

/** Dobra linhas longas em 75 colunas com continuação por espaço (RFC 2426). */
function foldLine(line: string): string {
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 74) {
    chunks.push(line.slice(i, i + 74));
  }
  return chunks.join("\r\n ");
}
