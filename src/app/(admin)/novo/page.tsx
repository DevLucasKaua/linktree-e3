"use client";

import { TEMPLATES } from "@/templates/registry";
import type { TemplateDef } from "@/templates/types";
import { TemplateCard } from "@/components/gallery/TemplateCard";

export default function NovoPage() {
  function handleSelect(template: TemplateDef) {
    // Sprint 4: criar o draft no Firestore e redirecionar para /editor/[id].
    alert(
      `Template "${template.name}" selecionado! A criação do linktree chega na Sprint 4.`
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Novo linktree</h1>
        <p className="mt-1 text-muted">
          Escolha um template para começar. Tudo pode ser personalizado depois.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(TEMPLATES).map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </main>
  );
}
