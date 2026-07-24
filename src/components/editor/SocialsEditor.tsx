"use client";

import type { SocialLink } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { IconPicker } from "@/components/editor/IconPicker";
import { isValidHttpUrl } from "@/lib/utils";

/** Seção "Redes sociais": linha de ícones exibida abaixo da bio na página. */
export function SocialsEditor({ value, onChange }: SectionProps) {
  const socials = value.socials;

  function commit(next: SocialLink[]) {
    onChange({ socials: next });
  }

  function handleAdd() {
    commit([
      ...socials,
      { id: crypto.randomUUID(), icon: "brand-instagram", url: "" },
    ]);
  }

  function handleUpdate(index: number, changes: Partial<SocialLink>) {
    commit(
      socials.map((social, i) =>
        i === index ? { ...social, ...changes } : social
      )
    );
  }

  function handleRemove(index: number) {
    commit(socials.filter((_, i) => i !== index));
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div>
        <h2 className="font-semibold">Redes sociais</h2>
        <p className="mt-1 text-sm text-muted">
          Linha de ícones exibida abaixo da bio. Redes sem URL não aparecem.
        </p>
      </div>

      {socials.length > 0 && (
        <div className="flex flex-col gap-2">
          {socials.map((social, index) => {
            const urlInvalid =
              social.url.trim() !== "" && !isValidHttpUrl(social.url);
            return (
              <div key={social.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <IconPicker
                    value={social.icon}
                    onSelect={(icon) => handleUpdate(index, { icon })}
                  />
                  <input
                    type="url"
                    value={social.url}
                    onChange={(event) =>
                      handleUpdate(index, { url: event.target.value })
                    }
                    placeholder="https://instagram.com/cliente"
                    aria-label="URL da rede social"
                    className={`min-w-0 flex-1 rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none transition-colors ${
                      urlInvalid
                        ? "border-red-400 focus:border-red-400"
                        : "border-border focus:border-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    title="Remover rede social"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-red-400 transition-colors hover:border-red-400"
                  >
                    <i className="ti ti-trash" />
                  </button>
                </div>
                {urlInvalid && (
                  <span className="text-xs text-red-400">
                    URL inválida — precisa começar com https:// (ou http://).
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="self-start rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent"
      >
        + Adicionar rede
      </button>
    </section>
  );
}
