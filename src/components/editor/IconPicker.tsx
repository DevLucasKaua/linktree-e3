"use client";

import { useState } from "react";

/** Ícones tabler (v3) curados para advogados e redes sociais. */
const ICONS = [
  "link",
  "world",
  "rocket",
  "briefcase",
  "scale",
  "gavel",
  "building-bank",
  "file-text",
  "file-certificate",
  "calendar",
  "clock",
  "phone",
  "mail",
  "map-pin",
  "message-circle",
  "brand-whatsapp",
  "brand-instagram",
  "brand-facebook",
  "brand-linkedin",
  "brand-youtube",
  "brand-tiktok",
  "brand-x",
  "brand-telegram",
  "video",
  "microphone",
  "news",
  "book",
  "bookmark",
  "star",
  "heart",
  "shield-check",
  "certificate",
  "coin",
  "credit-card",
  "chart-bar",
  "users",
  "user",
  "home",
  "download",
  "external-link",
];

export function IconPicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleSelect(icon: string) {
    onSelect(icon);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        title="Trocar ícone"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-lg transition-colors hover:border-accent"
      >
        <i className={`ti ti-${value}`} />
      </button>

      {open && (
        <>
          {/* Overlay invisível para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-20 mt-2 grid w-64 grid-cols-6 gap-1 rounded-lg border border-border bg-surface p-2 shadow-lg">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleSelect(icon)}
                title={icon}
                className={`flex h-9 w-9 items-center justify-center rounded-md border text-lg transition-colors hover:border-accent ${
                  icon === value
                    ? "border-accent text-accent"
                    : "border-transparent"
                }`}
              >
                <i className={`ti ti-${icon}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
