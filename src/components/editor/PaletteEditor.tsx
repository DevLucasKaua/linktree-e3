"use client";

import type { SectionProps } from "@/components/editor/EditorShell";
import { getTemplate } from "@/templates/registry";
import { FONTS } from "@/templates/fonts";
import type { Palette } from "@/templates/types";
import { Section } from "@/components/ui/Section";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";

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
    <Section
      title="Aparência"
      action={
        <Button onClick={restoreDefaults}>
          <i className="ti ti-restore" />
          Restaurar cores do template
        </Button>
      }
    >
      {/* Fonte do site (Google Fonts, injetada no export).
          Div em vez de <label>: o gatilho do Dropdown é um botão. */}
      <div className="flex min-w-0 flex-col gap-1.5">
        <FieldLabel>Fonte</FieldLabel>
        <Dropdown
          label="Fonte"
          value={value.fontId}
          onChange={(fontId) => onChange({ fontId })}
          options={[
            { value: "", label: "Padrão do template" },
            ...FONTS.map((font) => ({ value: font.id, label: font.name })),
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PALETTE_KEYS.map((key) => {
          const colorValue = value.palette[key];
          return (
            <label key={key} className="flex flex-col gap-1.5">
              <FieldLabel>{PALETTE_LABELS[key]}</FieldLabel>
              {isHex(colorValue) ? (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(event) => setColor(key, event.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-[10px] border border-hair bg-field p-1"
                  />
                  <span className="font-mono text-sm text-muted">
                    {colorValue}
                  </span>
                </div>
              ) : (
                <Input
                  value={colorValue}
                  onChange={(event) => setColor(key, event.target.value)}
                  className="font-mono"
                />
              )}
            </label>
          );
        })}
      </div>
    </Section>
  );
}
