"use client";

import { useRef, useState } from "react";
import type { SectionProps } from "@/components/editor/EditorShell";
import { getTemplate } from "@/templates/registry";
import { FONTS } from "@/templates/fonts";
import type { Palette } from "@/templates/types";
import { bgToDataUri } from "@/lib/photo";
import { Section } from "@/components/ui/Section";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/** Margem de segurança sob o limite de 1MB do documento Firestore. */
const DOC_BUDGET_BYTES = 950_000;

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

/** Seção "Aparência": paleta de cores, fonte e imagem de fundo. */
export function PaletteEditor({ value, onChange }: SectionProps) {
  const toast = useToast();
  const [bgUploading, setBgUploading] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);

  function setColor(key: keyof Palette, newValue: string) {
    onChange({ palette: { ...value.palette, [key]: newValue } });
  }

  async function handleBgChange(file: File | null) {
    if (!file) return;
    setBgUploading(true);
    try {
      const dataUri = await bgToDataUri(file);
      // Foto do cliente + fundo dividem o limite de 1MB do documento.
      if (dataUri.length + (value.photoUrl?.length ?? 0) > DOC_BUDGET_BYTES) {
        toast(
          "Foto do cliente + fundo excedem o limite do documento. Reenvie a foto do cliente (aba Perfil) para compactá-la e tente de novo.",
          "err"
        );
        return;
      }
      onChange({ bgImageUrl: dataUri });
    } catch {
      toast("Não foi possível processar a imagem. Tente outra.", "err");
    } finally {
      setBgUploading(false);
      // Limpa o input para permitir reenviar o mesmo arquivo.
      if (bgInputRef.current) bgInputRef.current.value = "";
    }
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

      {/* Imagem de fundo da página (com scrim próprio de cada template) */}
      <div className="mt-4 flex flex-col gap-2">
        <FieldLabel>Imagem de fundo</FieldLabel>
        {value.bgImageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={value.bgImageUrl}
            alt="Imagem de fundo do linktree"
            className="aspect-video w-full max-w-sm rounded-xl border border-hair object-cover"
          />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className="glass pressable inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-hair bg-field px-3.5 py-1.5 text-sm hover:bg-hover">
            <i className="ti ti-photo-up" />
            {bgUploading
              ? "Enviando…"
              : value.bgImageUrl
                ? "Trocar imagem"
                : "Enviar imagem"}
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              disabled={bgUploading}
              onChange={(event) =>
                handleBgChange(event.target.files?.[0] ?? null)
              }
              className="hidden"
            />
          </label>
          {value.bgImageUrl && (
            <Button
              variant="danger"
              onClick={() => onChange({ bgImageUrl: null })}
              disabled={bgUploading}
            >
              Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-muted">
          Aplicada atrás de todo o conteúdo, com um filtro de contraste próprio
          de cada template. Sem imagem, vale o fundo padrão do template.
        </p>
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
