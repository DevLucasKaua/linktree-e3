"use client";

import type { LinkItem } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { LinkItemForm } from "@/components/editor/LinkItemForm";

export function LinksEditor({ value, onChange }: SectionProps) {
  const links = value.links;

  /** Toda operação envia o array completo de links no patch. */
  function commit(nextLinks: LinkItem[]) {
    onChange({ links: nextLinks });
  }

  function handleAdd() {
    commit([
      ...links,
      {
        id: crypto.randomUUID(),
        label: "Novo link",
        description: "",
        icon: "link",
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

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-semibold">Links</h2>

      {links.length === 0 ? (
        <p className="text-sm text-muted">
          Nenhum link ainda — adicione o primeiro.
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
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="self-start rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent"
      >
        + Adicionar link
      </button>
    </section>
  );
}
