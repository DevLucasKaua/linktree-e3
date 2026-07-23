"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteLinktree,
  listLinktrees,
  type LinktreeDoc,
} from "@/lib/linktrees";
import { getTemplate } from "@/templates/registry";
import { initials } from "@/lib/utils";

export default function PainelPage() {
  const [linktrees, setLinktrees] = useState<LinktreeDoc[] | null>(null);

  useEffect(() => {
    listLinktrees().then(setLinktrees);
  }, []);

  async function handleDelete(linktree: LinktreeDoc) {
    const confirmed = confirm(
      `Excluir o linktree de "${linktree.clientName}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    await deleteLinktree(linktree.id);
    setLinktrees((current) =>
      (current ?? []).filter((item) => item.id !== linktree.id)
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Linktrees</h1>
        <Link
          href="/novo"
          className="rounded-lg bg-accent px-4 py-2 font-medium text-black transition-colors hover:bg-accent-hover"
        >
          + Novo linktree
        </Link>
      </div>

      {linktrees === null ? (
        <p className="text-muted">Carregando…</p>
      ) : linktrees.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">Nenhum linktree ainda</p>
          <p className="text-sm text-muted">
            Crie o primeiro escolhendo um template.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {linktrees.map((linktree) => (
            <li
              key={linktree.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                {linktree.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={linktree.photoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-accent">
                    {initials(linktree.clientName)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{linktree.clientName}</p>
                <p className="truncate text-sm text-muted">
                  {getTemplate(linktree.templateId).name} ·{" "}
                  {linktree.status === "publicado" ? "Publicado" : "Rascunho"}
                  {linktree.updatedAt &&
                    ` · ${linktree.updatedAt.toDate().toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/editor/${linktree.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(linktree)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-red-400 transition-colors hover:border-red-400"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
