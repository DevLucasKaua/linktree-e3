"use client";

import type { LinkItem, UtmParams } from "@/templates/types";
import { IconPicker } from "@/components/editor/IconPicker";
import { isValidHttpUrl, youtubeVideoId } from "@/lib/utils";

/** Campos UTM exibidos no bloco expansível. */
const UTM_FIELDS: { key: keyof UtmParams; label: string }[] = [
  { key: "source", label: "source" },
  { key: "medium", label: "medium" },
  { key: "campaign", label: "campaign" },
  { key: "content", label: "content" },
  { key: "term", label: "term" },
];

/** Nome exibido no selo do tipo (o tipo "link" não mostra selo). */
const TYPE_NAMES = {
  header: "Cabeçalho",
  whatsapp: "WhatsApp",
  youtube: "Vídeo",
} as const;

export function LinkItemForm({
  link,
  index,
  total,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  link: LinkItem;
  index: number;
  total: number;
  onUpdate: (changes: Partial<LinkItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (direction: -1 | 1) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}) {
  const type = link.type ?? "link";

  function updateUtm(key: keyof UtmParams, rawValue: string) {
    onUpdate({ utm: { ...link.utm, [key]: rawValue || undefined } });
  }

  const urlInvalid =
    type === "link" && link.url.trim() !== "" && !isValidHttpUrl(link.url);
  const phoneInvalid =
    type === "whatsapp" &&
    link.url.trim() !== "" &&
    link.url.replace(/\D/g, "").length < 10;
  const videoInvalid =
    type === "youtube" &&
    link.url.trim() !== "" &&
    youtubeVideoId(link.url) === null;

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => event.preventDefault()}
      className={`flex flex-col gap-3 rounded-lg border border-border p-4 ${
        link.active ? "" : "opacity-60"
      }`}
    >
      {/* Linha do topo: alça de arrastar, ícone, título, selo do tipo e ações */}
      <div className="flex items-center gap-2">
        <span
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          title="Arrastar para reordenar"
          className="flex h-9 w-5 shrink-0 cursor-grab items-center justify-center text-muted active:cursor-grabbing"
        >
          <i className="ti ti-grip-vertical" />
        </span>
        {type === "link" ? (
          <IconPicker
            value={link.icon}
            onSelect={(icon) => onUpdate({ icon })}
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-lg text-muted">
            <i className={`ti ti-${link.icon}`} />
          </div>
        )}
        <input
          type="text"
          value={link.label}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder="Título"
          aria-label="Título"
          className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
        />
        {type !== "link" && (
          <span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-muted">
            {TYPE_NAMES[type]}
          </span>
        )}
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
            title="Duplicar bloco"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:border-accent"
          >
            <i className="ti ti-copy" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Excluir bloco"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-red-400 transition-colors hover:border-red-400"
          >
            <i className="ti ti-trash" />
          </button>
          <label
            className="ml-1 flex cursor-pointer items-center gap-1.5 text-sm text-muted"
            title="Exibir ou ocultar o bloco na página"
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

      {/* Cabeçalho só tem título; os demais tipos têm campos próprios */}
      {type === "link" && (
        <input
          type="text"
          value={link.description ?? ""}
          onChange={(event) => onUpdate({ description: event.target.value })}
          placeholder="Descrição (opcional)"
          aria-label="Descrição (opcional)"
          className="rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
        />
      )}

      {type === "link" && (
        <>
          <input
            type="url"
            value={link.url}
            onChange={(event) => onUpdate({ url: event.target.value })}
            placeholder="https://..."
            aria-label="URL"
            className={`rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors ${
              urlInvalid
                ? "border-red-400 focus:border-red-400"
                : "border-border focus:border-accent"
            }`}
          />
          {urlInvalid && (
            <span className="text-xs text-red-400">
              URL inválida — precisa começar com https:// (ou http://).
            </span>
          )}
        </>
      )}

      {type === "whatsapp" && (
        <>
          <input
            type="tel"
            value={link.url}
            onChange={(event) => onUpdate({ url: event.target.value })}
            placeholder="Número com DDI — ex: +55 11 99999-9999"
            aria-label="Número do WhatsApp"
            className={`rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors ${
              phoneInvalid
                ? "border-red-400 focus:border-red-400"
                : "border-border focus:border-accent"
            }`}
          />
          {phoneInvalid && (
            <span className="text-xs text-red-400">
              Número incompleto — use DDI + DDD + número (ex: +55 11
              99999-9999).
            </span>
          )}
          <textarea
            rows={2}
            value={link.message ?? ""}
            onChange={(event) => onUpdate({ message: event.target.value })}
            placeholder="Mensagem pré-preenchida (opcional) — ex: Olá! Gostaria de agendar uma consulta."
            aria-label="Mensagem pré-preenchida"
            className="resize-none rounded-md border border-border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </>
      )}

      {type === "youtube" && (
        <>
          <input
            type="url"
            value={link.url}
            onChange={(event) => onUpdate({ url: event.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            aria-label="URL do vídeo"
            className={`rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors ${
              videoInvalid
                ? "border-red-400 focus:border-red-400"
                : "border-border focus:border-accent"
            }`}
          />
          {videoInvalid && (
            <span className="text-xs text-red-400">
              URL de vídeo não reconhecida — na página, será exibido como botão
              comum em vez de cartão com thumbnail.
            </span>
          )}
        </>
      )}

      {/* Agendamento: janela de exibição do bloco na página */}
      <details className="text-sm" open={Boolean(link.startAt || link.endAt)}>
        <summary className="cursor-pointer select-none text-muted transition-colors hover:text-accent">
          Agendamento
          {(link.startAt || link.endAt) && (
            <span className="ml-2 text-xs text-accent">ativo</span>
          )}
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">Exibir a partir de</span>
            <input
              type="date"
              value={link.startAt ?? ""}
              onChange={(event) =>
                onUpdate({ startAt: event.target.value || undefined })
              }
              className="rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">Exibir até (inclusive)</span>
            <input
              type="date"
              value={link.endAt ?? ""}
              onChange={(event) =>
                onUpdate({ endAt: event.target.value || undefined })
              }
              className="rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none transition-colors focus:border-accent"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">
          Fora da janela, o bloco fica oculto na página publicada — a troca
          acontece sozinha, sem novo export.
        </p>
      </details>

      {/* Destaque: borda no acento + selo de estrela + pulso sutil */}
      {type !== "header" && (
        <label
          className="flex cursor-pointer items-center gap-1.5 self-start text-sm text-muted"
          title="Borda na cor de destaque, selo de estrela e animação sutil"
        >
          <input
            type="checkbox"
            checked={link.highlight ?? false}
            onChange={(event) => onUpdate({ highlight: event.target.checked })}
            className="accent-accent"
          />
          Destacar este bloco
        </label>
      )}

      {type === "link" && (
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
      )}
    </div>
  );
}
