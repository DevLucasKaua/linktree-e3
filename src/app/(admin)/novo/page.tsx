"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/templates/registry";
import type { TemplateDef } from "@/templates/types";
import { TemplateCard } from "@/components/gallery/TemplateCard";
import { createLinktree } from "@/lib/linktrees";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";

export default function NovoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [creating, setCreating] = useState(false);

  async function handleSelect(template: TemplateDef) {
    if (creating) return;
    setCreating(true);
    try {
      const id = await createLinktree(template.id, user?.email ?? "");
      router.push(`/editor/${id}`);
    } catch {
      toast("Não foi possível criar o linktree. Tente novamente.", "err");
      setCreating(false);
    }
  }

  return (
    <main className="flex flex-col gap-6">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight tracking-tight">
          Novo linktree
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">
          Escolha um template para começar. Tudo pode ser personalizado depois.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(TEMPLATES).map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={handleSelect}
            disabled={creating}
          />
        ))}
      </div>
    </main>
  );
}
