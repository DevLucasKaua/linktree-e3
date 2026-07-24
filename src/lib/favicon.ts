/** Tamanhos usados no export: favicon clássico e ícone de toque do iOS. */
export const FAVICON_SIZE = 32;
export const APPLE_ICON_SIZE = 180;

/**
 * Recorta a foto do cliente (data URI JPEG) em um quadrado central e a
 * redesenha no tamanho pedido — mesma técnica de canvas de photo.ts.
 */
async function photoToIconCanvas(
  photoDataUri: string,
  size: number
): Promise<HTMLCanvasElement> {
  // fetch de data URI é local (sem rede), só converte para blob.
  const blob = await fetch(photoDataUri).then((res) => res.blob());
  const bitmap = await createImageBitmap(blob);
  const side = Math.min(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d")!.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size
  );
  bitmap.close();
  return canvas;
}

/** PNG do ícone como Blob (arquivos favicon.png / apple-touch-icon.png do ZIP). */
export async function photoToIconBlob(
  photoDataUri: string,
  size: number
): Promise<Blob> {
  const canvas = await photoToIconCanvas(photoDataUri, size);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Falha ao gerar o ícone")),
      "image/png"
    );
  });
}

/** PNG do ícone como data URI (HTML self-contained do "Copiar HTML"). */
export async function photoToIconDataUri(
  photoDataUri: string,
  size: number
): Promise<string> {
  const canvas = await photoToIconCanvas(photoDataUri, size);
  return canvas.toDataURL("image/png");
}
