"use client";

import type { TrackingInfo } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { TRACKING_PATTERNS } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Field, Input } from "@/components/ui/Field";

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
    <Section
      title="Rastreamento"
      description="Os pixels são injetados no site exportado; o cliente acompanha as visitas na própria ferramenta. Campos vazios ficam de fora."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {FIELDS.map(({ key, label, placeholder, formatHint }) => {
          const fieldValue = value.tracking[key];
          const invalid =
            fieldValue.trim() !== "" &&
            !TRACKING_PATTERNS[key].test(fieldValue.trim());
          return (
            <Field
              key={key}
              label={label}
              error={
                invalid
                  ? `Formato inválido (${formatHint}) — será ignorado no export.`
                  : null
              }
            >
              <Input
                invalid={invalid}
                value={fieldValue}
                onChange={(event) => update(key, event.target.value)}
                placeholder={placeholder}
                className="font-mono"
              />
            </Field>
          );
        })}
      </div>
    </Section>
  );
}
