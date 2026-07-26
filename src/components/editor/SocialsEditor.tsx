"use client";

import type { SocialLink } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { IconPicker } from "@/components/editor/IconPicker";
import { isValidHttpUrl } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

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
    <Section
      title="Redes sociais"
      description="Linha de ícones exibida abaixo da bio. Redes sem URL não aparecem."
      action={
        <Button onClick={handleAdd}>
          <i className="ti ti-plus" />
          Adicionar rede
        </Button>
      }
    >
      {socials.length > 0 ? (
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
                  <Input
                    type="url"
                    invalid={urlInvalid}
                    value={social.url}
                    onChange={(event) =>
                      handleUpdate(index, { url: event.target.value })
                    }
                    placeholder="https://instagram.com/cliente"
                    aria-label="URL da rede social"
                    className="min-w-0 flex-1 py-1.5"
                  />
                  <Button
                    variant="iconDanger"
                    onClick={() => handleRemove(index)}
                    title="Remover rede social"
                  >
                    <i className="ti ti-trash" />
                  </Button>
                </div>
                {urlInvalid && (
                  <span className="text-xs text-neg">
                    URL inválida — precisa começar com https:// (ou http://).
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Nenhuma rede ainda — adicione a primeira.
        </p>
      )}
    </Section>
  );
}
