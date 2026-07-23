"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getLinktree, type LinktreeDoc } from "@/lib/linktrees";
import { EditorShell } from "@/components/editor/EditorShell";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [linktree, setLinktree] = useState<LinktreeDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLinktree(id)
      .then(setLinktree)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center text-muted">
        Carregando…
      </main>
    );
  }

  if (!linktree) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted">Linktree não encontrado.</p>
        <Link href="/painel" className="text-accent hover:underline">
          ← Voltar ao painel
        </Link>
      </main>
    );
  }

  return <EditorShell initial={linktree} />;
}
