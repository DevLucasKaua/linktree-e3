"use client";

import type { TemplateDef } from "@/templates/types";
import { sampleConfigFor } from "@/templates/registry";
import { PreviewFrame } from "@/components/editor/PreviewFrame";

interface TemplateCardProps {
  template: TemplateDef;
  onSelect: (template: TemplateDef) => void;
  disabled?: boolean;
}

/* Miniatura live: o template real renderizado num iframe reduzido via scale. */
const FRAME_WIDTH = 420;
const FRAME_HEIGHT = 720;
const SCALE = 0.55;

export function TemplateCard({ template, onSelect, disabled }: TemplateCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: FRAME_HEIGHT * SCALE }}
      >
        <PreviewFrame
          config={sampleConfigFor(template)}
          className="pointer-events-none absolute left-1/2 top-0 origin-top border-0"
          // largura/altura reais + scale para caber no card
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `translateX(-50%) scale(${SCALE})`,
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
        <h2 className="font-semibold">{template.name}</h2>
        <p className="flex-1 text-sm text-muted">{template.description}</p>
        <button
          onClick={() => onSelect(template)}
          disabled={disabled}
          className="mt-2 rounded-lg bg-accent px-4 py-2 font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          Usar este template
        </button>
      </div>
    </div>
  );
}
