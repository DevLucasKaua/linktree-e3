"use client";

import { useEffect, useState } from "react";
import { qrCodePngBlob, qrCodePngDataUrl } from "@/lib/qrcode";
import { downloadBlob } from "@/lib/export";

/** Modal com o QR code da URL publicada e download do PNG. */
export function QrCodeModal({
  url,
  slug,
  onClose,
}: {
  url: string;
  slug: string;
  onClose: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    qrCodePngDataUrl(url).then(setDataUrl);
  }, [url]);

  async function handleDownload() {
    downloadBlob(await qrCodePngBlob(url), `qrcode-${slug || "linktree"}.png`);
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold">QR code do linktree</h2>

        {dataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={dataUrl}
            alt={`QR code de ${url}`}
            className="h-56 w-56 rounded-lg bg-white p-2"
          />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center text-sm text-muted">
            Gerando…
          </div>
        )}

        <p className="max-w-full truncate text-sm text-muted" title={url}>
          {url}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!dataUrl}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            Baixar PNG
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-accent"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
