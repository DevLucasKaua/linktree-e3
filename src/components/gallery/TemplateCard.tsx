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
    <div className="glass flex animate-rise flex-col overflow-hidden rounded-[20px] border border-hair bg-surface transition-shadow hover:shadow-card">
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
      <div className="flex flex-1 flex-col gap-2 border-t border-hair p-4">
        <h2 className="font-semibold tracking-tight">{template.name}</h2>
        <p className="flex-1 text-sm text-muted">{template.description}</p>
        <button
          onClick={() => onSelect(template)}
          disabled={disabled}
          className="glass-tint pressable mt-2 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Usar este template
        </button>
      </div>
    </div>
  );
}
