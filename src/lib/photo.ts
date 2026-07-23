const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.85;
/** Margem de segurança sob o limite de 1MB do documento Firestore. */
const MAX_DATA_URI_BYTES = 900_000;

/**
 * Redimensiona a imagem no browser (máx. 800px) e retorna como data URI JPEG,
 * armazenada direto no documento do Firestore — sem Firebase Storage (plano Spark).
 */
export async function photoToDataUri(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Reduz a qualidade progressivamente se necessário para caber no documento.
  for (const quality of [JPEG_QUALITY, 0.7, 0.55]) {
    const dataUri = canvas.toDataURL("image/jpeg", quality);
    if (dataUri.length <= MAX_DATA_URI_BYTES) return dataUri;
  }
  throw new Error("Imagem grande demais mesmo após compressão");
}
