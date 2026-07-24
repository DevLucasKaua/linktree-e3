"use client";

import type { SectionProps } from "@/components/editor/EditorShell";
import { getTemplate } from "@/templates/registry";
import { FONTS } from "@/templates/fonts";
import type { Palette } from "@/templates/types";

/** Rótulos pt-BR para cada chave fixa da paleta. */
const PALETTE_LABELS: Record<keyof Palette, string> = {
  bg: "Fundo",
  surface: "Superfície",
  primary: "Cor principal",
  text: "Texto",
  muted: "Texto suave",
  border: "Borda",
};

const PALETTE_KEYS = Object.keys(PALETTE_LABELS) as (keyof Palette)[];

/** type=color só aceita hex #rrggbb; valores como rgba() caem no input de texto. */
function isHex(colorValue: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(colorValue);
}

/** Seção "Aparência": paleta de cores e fonte do linktree. */
export function PaletteEditor({ value, onChange }: SectionProps) {
  function setColor(key: keyof Palette, newValue: string) {
    onChange({ palette: { ...value.palette, [key]: newValue } });
  }

  function restoreDefaults() {
    onChange({ palette: getTemplate(value.templateId).defaultPalette });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Aparência</h2>
        <button
          type="button"
          onClick={restoreDefaults}
          className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent"
        >
          Restaurar cores do template
        </button>
      </div>

      {/* Fonte do site (Google Fonts, injetada no export) */}
      <label className="mb-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium">Fonte</span>
        <select
          value={value.fontId}
          onChange={(event) => onChange({ fontId: event.target.value })}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        >
          <option value="">Padrão do template</option>
          {FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PALETTE_KEYS.map((key) => {
          const colorValue = value.palette[key];
          return (
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{PALETTE_LABELS[key]}</span>
              {isHex(colorValue) ? (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(event) => setColor(key, event.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-md border border-border bg-background p-1"
                  />
                  <span className="font-mono text-sm text-muted">
                    {colorValue}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  value={colorValue}
                  onChange={(event) => setColor(key, event.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent"
                />
              )}
            </label>
          );
        })}
      </div>
    </section>
  );
}
