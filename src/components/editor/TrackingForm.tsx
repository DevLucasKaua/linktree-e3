"use client";

import type { TrackingInfo } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { TRACKING_PATTERNS } from "@/lib/utils";

/** Campos de rastreamento com placeholder e dica de formato. */
const FIELDS: {
  key: keyof TrackingInfo;
  label: string;
  placeholder: string;
  formatHint: string;
}[] = [
  {
    key: "ga4Id",
    label: "Google Analytics 4",
    placeholder: "G-XXXXXXXXXX",
    formatHint: "começa com G-",
  },
  {
    key: "metaPixelId",
    label: "Meta Pixel",
    placeholder: "1234567890123456",
    formatHint: "só números",
  },
  {
    key: "gtmId",
    label: "Google Tag Manager",
    placeholder: "GTM-XXXXXXX",
    formatHint: "começa com GTM-",
  },
];

/** Seção "Rastreamento": IDs de pixels injetados no HTML exportado. */
export function TrackingForm({ value, onChange }: SectionProps) {
  function update(key: keyof TrackingInfo, fieldValue: string) {
    onChange({ tracking: { ...value.tracking, [key]: fieldValue } });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-semibold">Rastreamento</h2>
      <p className="mb-4 mt-1 text-sm text-muted">
        Os pixels são injetados no site exportado; o cliente acompanha as
        visitas na própria ferramenta. Campos vazios ficam de fora.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {FIELDS.map(({ key, label, placeholder, formatHint }) => {
          const fieldValue = value.tracking[key];
          const invalid =
            fieldValue.trim() !== "" &&
            !TRACKING_PATTERNS[key].test(fieldValue.trim());
          return (
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{label}</span>
              <input
                type="text"
                value={fieldValue}
                onChange={(event) => update(key, event.target.value)}
                placeholder={placeholder}
                className={`rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none transition-colors ${
                  invalid
                    ? "border-red-400 focus:border-red-400"
                    : "border-border focus:border-accent"
                }`}
              />
              {invalid && (
                <span className="text-xs text-red-400">
                  Formato inválido ({formatHint}) — será ignorado no export.
                </span>
              )}
            </label>
          );
        })}
      </div>
    </section>
  );
}
