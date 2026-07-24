"use client";

import { useEffect, useState } from "react";
import { qrCodePngBlob, qrCodePngDataUrl } from "@/lib/qrcode";
import { downloadBlob } from "@/lib/export";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
    <Modal
      title="QR code do linktree"
      subtitle={url}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Fechar</Button>
          <Button variant="primary" onClick={handleDownload} disabled={!dataUrl}>
            <i className="ti ti-download" />
            Baixar PNG
          </Button>
        </>
      }
    >
      <div className="flex justify-center">
        {dataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={dataUrl}
            alt={`QR code de ${url}`}
            className="h-56 w-56 rounded-xl border border-hair bg-white p-2"
          />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center text-sm text-muted">
            Gerando…
          </div>
        )}
      </div>
    </Modal>
  );
}
