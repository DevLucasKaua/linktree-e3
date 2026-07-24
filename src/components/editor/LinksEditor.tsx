"use client";

import { useRef } from "react";
import type { LinkItem, LinkItemType } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { LinkItemForm } from "@/components/editor/LinkItemForm";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

/** Padrões de cada tipo de bloco no menu de adicionar. */
const ADD_OPTIONS: {
  type: LinkItemType;
  buttonLabel: string;
  defaults: Pick<LinkItem, "label" | "icon">;
}[] = [
  {
    type: "link",
    buttonLabel: "+ Link",
    defaults: { label: "Novo link", icon: "link" },
  },
  {
    type: "header",
    buttonLabel: "+ Cabeçalho",
    defaults: { label: "Nova seção", icon: "heading" },
  },
  {
    type: "whatsapp",
    buttonLabel: "+ WhatsApp",
    defaults: { label: "Fale no WhatsApp", icon: "brand-whatsapp" },
  },
  {
    type: "youtube",
    buttonLabel: "+ Vídeo",
    defaults: { label: "Assista no YouTube", icon: "brand-youtube" },
  },
];

export function LinksEditor({ value, onChange }: SectionProps) {
  const links = value.links;
  // Índice do bloco sendo arrastado; a lista é reordenada ao vivo no dragEnter.
  const dragFrom = useRef<number | null>(null);

  /**
   * Toda operação envia o array completo de links no patch.
   * O round-trip por JSON descarta propriedades `undefined` (ex.: data de
   * agendamento limpa), que o Firestore rejeita no updateDoc.
   */
  function commit(nextLinks: LinkItem[]) {
    onChange({ links: JSON.parse(JSON.stringify(nextLinks)) });
  }

  function handleAdd(type: LinkItemType, defaults: Pick<LinkItem, "label" | "icon">) {
    commit([
      ...links,
      {
        id: crypto.randomUUID(),
        type,
        ...defaults,
        description: "",
        url: "",
        active: true,
      },
    ]);
  }

  function handleUpdate(index: number, changes: Partial<LinkItem>) {
    commit(
      links.map((link, i) => (i === index ? { ...link, ...changes } : link))
    );
  }

  function handleRemove(index: number) {
    commit(links.filter((_, i) => i !== index));
  }

  function handleDuplicate(index: number) {
    const copy: LinkItem = { ...links[index], id: crypto.randomUUID() };
    const next = [...links];
    next.splice(index + 1, 0, copy);
    commit(next);
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  function handleDragStart(index: number) {
    dragFrom.current = index;
  }

  function handleDragEnter(index: number) {
    const from = dragFrom.current;
    if (from === null || from === index) return;
    const next = [...links];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragFrom.current = index;
    commit(next);
  }

  function handleDragEnd() {
    dragFrom.current = null;
  }

  return (
    <Section title="Links e blocos">
      <div className="flex flex-col gap-4">
        {links.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhum bloco ainda — adicione o primeiro.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link, index) => (
              <LinkItemForm
                key={link.id}
                link={link}
                index={index}
                total={links.length}
                onUpdate={(changes) => handleUpdate(index, changes)}
                onRemove={() => handleRemove(index)}
                onDuplicate={() => handleDuplicate(index)}
                onMove={(direction) => handleMove(index, direction)}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {ADD_OPTIONS.map(({ type, buttonLabel, defaults }) => (
            <Button key={type} onClick={() => handleAdd(type, defaults)}>
              {buttonLabel}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
