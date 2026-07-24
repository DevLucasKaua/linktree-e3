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
        aria-expanded={open}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-hair bg-surface transition-colors hover:border-muted"
      >
        <i className={`ti ti-${value}`} />
      </button>

      {open && (
        <>
          {/* Overlay invisível para fechar ao clicar fora (z: dropdown) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-50 mt-1 grid w-64 origin-top-left animate-menu-in grid-cols-6 gap-1 rounded-xl border border-hair bg-surface p-2 shadow-big">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleSelect(icon)}
                title={icon}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-lg transition-colors hover:bg-hover ${
                  icon === value ? "bg-accent-soft text-accent-deep" : ""
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
