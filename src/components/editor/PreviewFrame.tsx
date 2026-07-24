"use client";

import { useMemo, type CSSProperties } from "react";
import type { LinktreeConfig } from "@/templates/types";
import { buildLinktreeHtml } from "@/templates/render";
import { vcardDataUri } from "@/lib/vcard";

interface PreviewFrameProps {
  config: LinktreeConfig;
  photoSrc?: string | null;
  className?: string;
  style?: CSSProperties;
}

/** Preview ao vivo: renderiza no iframe exatamente o HTML que será exportado. */
export function PreviewFrame({
  config,
  photoSrc,
  className,
  style,
}: PreviewFrameProps) {
  const html = useMemo(
    () =>
      buildLinktreeHtml(config, {
        photoSrc,
        // Data URI para o botão "Salvar contato" aparecer também no preview.
        vcardSrc: vcardDataUri(config, photoSrc ?? null),
      }),
    [config, photoSrc]
  );

  return (
    <iframe
      srcDoc={html}
      title={`Preview — ${config.clientName}`}
      className={className}
      style={style}
      sandbox=""
    />
  );
}
