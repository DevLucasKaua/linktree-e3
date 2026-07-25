"use client";

import { useEffect, useState } from "react";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

/**
 * Select customizado com painel liquid glass (o popup do <select> nativo
 * não é estilizável). Gatilho em cápsula, opções com check na selecionada.
 */
export function Dropdown<T extends string>({
  value,
  onChange,
  options,
  label,
  className = "",
  dense = false,
}: {
  value: T;
  onChange: (next: T) => void;
  options: DropdownOption<T>[];
  /** Rótulo acessível do gatilho. */
  label: string;
  className?: string;
  /** true = mesma altura dos botões (py-1.5), para toolbars. */
  dense?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`glass pressable flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-hair bg-field px-3.5 text-sm hover:bg-hover ${
          dense ? "py-1.5" : "py-2"
        }`}
      >
        <span className="truncate">{selected?.label ?? label}</span>
        <i
          className={`ti ti-chevron-down shrink-0 text-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          {/* Overlay invisível para fechar ao clicar fora (z: dropdown) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="glass-strong absolute left-0 right-0 top-full z-50 mt-1.5 flex max-h-64 origin-top animate-menu-in flex-col gap-0.5 overflow-y-auto rounded-2xl border border-hair bg-surface p-1.5 shadow-big">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onChange(option.value);
                }}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-hover ${
                  option.value === value ? "bg-hover font-medium" : ""
                }`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <i className="ti ti-check shrink-0 text-accent-deep" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
