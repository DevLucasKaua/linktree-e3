"use client";

import type { LinkItem, UtmParams } from "@/templates/types";
import { IconPicker } from "@/components/editor/IconPicker";

/** Campos UTM exibidos no bloco expansível. */
const UTM_FIELDS: { key: keyof UtmParams; label: string }[] = [
  { key: "source", label: "source" },
  { key: "medium", label: "medium" },
  { key: "campaign", label: "campaign" },
  { key: "content", label: "content" },
  { key: "term", label: "term" },
];

export function LinkItemForm({
  link,
  index,
  total,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
}: {
  link: LinkItem;
  index: number;
  total: number;
  onUpdate: (changes: Partial<LinkItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  function updateUtm(key: keyof UtmParams, rawValue: string) {
    onUpdate({ utm: { ...link.utm, [key]: rawValue || undefined } });
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border border-border p-4 ${
        link.active ? "" : "opacity-60"
      }`}
    >
      {/* Linha do topo: ícone, título e ações */}
      <div className="flex items-center gap-2">
        <IconPicker value={link.icon} onSelect={(icon) => onUpdate({ icon })} />
        <input
          type="text"
          value={link.label}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder="Título"
          aria-label="Título"
          className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
        />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Mover para cima"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
          >
            <i className="ti ti-arrow-up" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Mover para baixo"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
          >
            <i className="ti ti-arrow-down" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            title="Duplicar link"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:border-accent"
          >
            <i className="ti ti-copy" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Excluir link"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-red-400 transition-colors hover:border-red-400"
          >
            <i className="ti ti-trash" />
          </button>
          <label
            className="ml-1 flex cursor-pointer items-center gap-1.5 text-sm text-muted"
            title="Exibir ou ocultar o link na página"
          >
            <input
              type="checkbox"
              checked={link.active}
              onChange={(event) => onUpdate({ active: event.target.checked })}
              className="accent-accent"
            />
            Ativo
          </label>
        </div>
      </div>

      <input
        type="text"
        value={link.description ?? ""}
        onChange={(event) => onUpdate({ description: event.target.value })}
        placeholder="Descrição (opcional)"
        aria-label="Descrição (opcional)"
        className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
      />

      <input
        type="url"
        value={link.url}
        onChange={(event) => onUpdate({ url: event.target.value })}
        placeholder="https://..."
        aria-label="URL"
        className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
      />

      <details className="text-sm">
        <summary className="cursor-pointer select-none text-muted transition-colors hover:text-accent">
          Parâmetros UTM
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {UTM_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-muted">{label}</span>
              <input
                type="text"
                value={link.utm?.[key] ?? ""}
                onChange={(event) => updateUtm(key, event.target.value)}
                placeholder={`utm_${label}`}
                className="rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none transition-colors focus:border-accent"
              />
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
