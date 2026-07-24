import QRCode from "qrcode";

/** Resolução do PNG: sobra de qualidade para impressão em cartões/materiais. */
const QR_SIZE = 512;

/** QR code da URL publicada como data URL PNG (exibição no modal). */
export function qrCodePngDataUrl(url: string): Promise<string> {
  // Preto sobre branco sempre: máxima leitura por qualquer scanner.
  return QRCode.toDataURL(url, { width: QR_SIZE, margin: 2 });
}

/** QR code como Blob PNG (arquivo qrcode.png do ZIP e download do modal). */
export async function qrCodePngBlob(url: string): Promise<Blob> {
  const dataUrl = await qrCodePngDataUrl(url);
  return fetch(dataUrl).then((res) => res.blob());
}
