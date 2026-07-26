interface ImageOptions {
  /** Maior lado da imagem após o redimensionamento. */
  maxDimension: number;
  /** Tamanho máximo do data URI (o doc Firestore inteiro tem limite de 1MB). */
  maxBytes: number;
}

/**
 * Redimensiona a imagem no browser e retorna como data URI JPEG, armazenada
 * direto no documento do Firestore — sem Firebase Storage (plano Spark).
 * Reduz a qualidade progressivamente até caber no orçamento pedido.
 */
export async function imageToDataUri(
  file: File,
  { maxDimension, maxBytes }: ImageOptions
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of [0.85, 0.7, 0.55, 0.45, 0.35]) {
    const dataUri = canvas.toDataURL("image/jpeg", quality);
    if (dataUri.length <= maxBytes) return dataUri;
  }
  throw new Error("Imagem grande demais mesmo após compressão");
}

/**
 * Foto do cliente (avatar): 800px / 450KB — orçamento dividido com a imagem
 * de fundo dentro do limite de 1MB do documento.
 */
export function photoToDataUri(file: File): Promise<string> {
  return imageToDataUri(file, { maxDimension: 800, maxBytes: 450_000 });
}

/**
 * Imagem de fundo da página: 1280px / 420KB — os templates aplicam scrim
 * por cima, então a compressão mais agressiva passa despercebida.
 */
export function bgToDataUri(file: File): Promise<string> {
  return imageToDataUri(file, { maxDimension: 1280, maxBytes: 420_000 });
}
