"use client";

import { useEffect, useState } from "react";

export interface MenuItem {
  label: string;
  /** Nome do ícone Tabler sem o prefixo. */
  icon?: string;
  danger?: boolean;
  onSelect: () => void;
}

/** Dropdown "⋯" para ações secundárias; fecha por clique fora ou Escape. */
export function Menu({
  items,
  label = "Mais ações",
}: {
  items: MenuItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        title={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`pressable flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-hover hover:text-ink ${
          open ? "bg-hover text-ink" : "text-muted"
        }`}
      >
        <i className="ti ti-dots" />
      </button>

      {open && (
        <>
          {/* Overlay invisível para fechar ao clicar fora (z: dropdown) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="glass-strong absolute right-0 top-full z-50 mt-1 flex min-w-[190px] origin-top-right animate-menu-in flex-col rounded-xl border border-hair bg-surface p-1 shadow-big">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-hover ${
                  item.danger ? "text-neg" : ""
                }`}
              >
                {item.icon && <i className={`ti ti-${item.icon} opacity-80`} />}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
