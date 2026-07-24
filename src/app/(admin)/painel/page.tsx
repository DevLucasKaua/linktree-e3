"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import {
  deleteLinktree,
  duplicateLinktree,
  hasUnexportedChanges,
  listLinktrees,
  markExported,
  restoreLinktree,
  softDeleteLinktree,
  type LinktreeDoc,
} from "@/lib/linktrees";
import {
  exportBlockers,
  exportLinktreeZip,
  exportWarnings,
} from "@/lib/export";
import { useAuth } from "@/lib/auth-context";
import { TEMPLATES, getTemplate } from "@/templates/registry";
import { initials } from "@/lib/utils";
import { QrCodeModal } from "@/components/QrCodeModal";

type Tab = "ativos" | "lixeira";
type SortKey = "updated" | "name" | "created";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "updated", label: "Atualização recente" },
  { key: "name", label: "Nome (A–Z)" },
  { key: "created", label: "Criação recente" },
];

export default function PainelPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const [linktrees, setLinktrees] = useState<LinktreeDoc[] | null>(null);
  const [qrTarget, setQrTarget] = useState<LinktreeDoc | null>(null);
  const [tab, setTab] = useState<Tab>("ativos");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [templateFilter, setTemplateFilter] = useState("todos");
  const [sortKey, setSortKey] = useState<SortKey>("updated");

  useEffect(() => {
    if (!user?.email) return;
    listLinktrees(user.email, isAdmin).then(setLinktrees);
  }, [user?.email, isAdmin]);

  /** Atualiza um item na lista local sem refetch. */
  function patchLocal(id: string, changes: Partial<LinktreeDoc>) {
    setLinktrees((current) =>
      (current ?? []).map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  }

  const trashedCount = useMemo(
    () => (linktrees ?? []).filter((item) => item.deletedAt).length,
    [linktrees]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (linktrees ?? [])
      .filter((item) => (tab === "lixeira" ? item.deletedAt : !item.deletedAt))
      .filter(
        (item) =>
          !term ||
          item.clientName.toLowerCase().includes(term) ||
          item.slug.toLowerCase().includes(term)
      )
      .filter(
        (item) => statusFilter === "todos" || item.status === statusFilter
      )
      .filter(
        (item) =>
          templateFilter === "todos" || item.templateId === templateFilter
      )
      .sort((a, b) => {
        if (sortKey === "name") {
          return a.clientName.localeCompare(b.clientName, "pt-BR");
        }
        const field = sortKey === "created" ? "createdAt" : "updatedAt";
        return (b[field]?.toMillis() ?? 0) - (a[field]?.toMillis() ?? 0);
      });
  }, [linktrees, tab, search, statusFilter, templateFilter, sortKey]);

  async function handleExport(linktree: LinktreeDoc) {
    const blockers = exportBlockers(linktree);
    if (blockers.length > 0) {
      alert(`Antes de publicar, edite e preencha: ${blockers.join(", ")}.`);
      return;
    }
    const warnings = exportWarnings(linktree);
    if (
      warnings.length > 0 &&
      !confirm(`Atenção:\n• ${warnings.join("\n• ")}\n\nExportar mesmo assim?`)
    ) {
      return;
    }
    await exportLinktreeZip(linktree);
    await markExported(linktree.id);
    patchLocal(linktree.id, {
      status: "publicado",
      lastExportedAt: Timestamp.now(),
    });
  }

  function handleShowQr(linktree: LinktreeDoc) {
    if (!linktree.publishedUrl.trim()) {
      alert(
        'Edite o linktree e preencha a "URL publicada" para gerar o QR code.'
      );
      return;
    }
    setQrTarget(linktree);
  }

  async function handleDuplicate(linktree: LinktreeDoc) {
    await duplicateLinktree(linktree, user?.email ?? "");
    setLinktrees(await listLinktrees(user?.email ?? "", isAdmin));
  }

  async function handleTrash(linktree: LinktreeDoc) {
    await softDeleteLinktree(linktree.id);
    patchLocal(linktree.id, { deletedAt: Timestamp.now() });
  }

  async function handleRestore(linktree: LinktreeDoc) {
    await restoreLinktree(linktree.id);
    patchLocal(linktree.id, { deletedAt: null });
  }

  async function handleHardDelete(linktree: LinktreeDoc) {
    const confirmed = confirm(
      `Excluir DEFINITIVAMENTE o linktree de "${linktree.clientName}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    await deleteLinktree(linktree.id);
    setLinktrees((current) =>
      (current ?? []).filter((item) => item.id !== linktree.id)
    );
  }

  const actionButtonClass =
    "rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent";

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Linktrees</h1>
          {/* Abas Ativos / Lixeira */}
          <div className="flex items-center rounded-lg border border-border p-0.5 text-sm">
            {(
              [
                { key: "ativos", label: "Ativos" },
                { key: "lixeira", label: `Lixeira (${trashedCount})` },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-md px-3 py-1 transition-colors ${
                  tab === key
                    ? "bg-accent font-medium text-black"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Link
          href="/novo"
          className="rounded-lg bg-accent px-4 py-2 font-medium text-black transition-colors hover:bg-accent-hover"
        >
          + Novo linktree
        </Link>
      </div>

      {/* Busca, filtros e ordenação */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou slug…"
          className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-accent sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border border-border bg-surface px-2 py-2 text-sm"
        >
          <option value="todos">Todos os status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <select
          value={templateFilter}
          onChange={(event) => setTemplateFilter(event.target.value)}
          className="rounded-md border border-border bg-surface px-2 py-2 text-sm"
        >
          <option value="todos">Todos os templates</option>
          {Object.values(TEMPLATES).map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          className="rounded-md border border-border bg-surface px-2 py-2 text-sm"
        >
          {SORT_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {linktrees === null ? (
        <p className="text-muted">Carregando…</p>
      ) : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">
            {tab === "lixeira"
              ? "Lixeira vazia"
              : linktrees.filter((item) => !item.deletedAt).length === 0
                ? "Nenhum linktree ainda"
                : "Nada encontrado com esses filtros"}
          </p>
          {tab === "ativos" &&
            linktrees.filter((item) => !item.deletedAt).length === 0 && (
              <p className="text-sm text-muted">
                Crie o primeiro escolhendo um template.
              </p>
            )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((linktree) => (
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
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{linktree.clientName}</p>
                  {tab === "ativos" && hasUnexportedChanges(linktree) && (
                    <span
                      title="Houve edições depois do último export — exporte de novo para publicar"
                      className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-400"
                    >
                      alterações não exportadas
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-muted">
                  {getTemplate(linktree.templateId).name} ·{" "}
                  {linktree.status === "publicado" ? "Publicado" : "Rascunho"}
                  {linktree.updatedAt &&
                    ` · ${linktree.updatedAt.toDate().toLocaleDateString("pt-BR")}`}
                  {/* Dono: admin vê o gestor de cada linktree; todos veem o legado sem dono */}
                  {isAdmin && linktree.ownerEmail && ` · ${linktree.ownerEmail}`}
                  {!linktree.ownerEmail && " · sem dono"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {tab === "ativos" ? (
                  <>
                    <Link
                      href={`/editor/${linktree.id}`}
                      className={actionButtonClass}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExport(linktree)}
                      className={actionButtonClass}
                    >
                      Exportar
                    </button>
                    <button
                      onClick={() => handleShowQr(linktree)}
                      title="QR code da URL publicada"
                      className={actionButtonClass}
                    >
                      QR Code
                    </button>
                    <button
                      onClick={() => handleDuplicate(linktree)}
                      title="Duplicar como base para outro cliente"
                      className={actionButtonClass}
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => handleTrash(linktree)}
                      title="Mover para a lixeira (dá para restaurar)"
                      className="rounded-md border border-border px-3 py-1.5 text-sm text-red-400 transition-colors hover:border-red-400"
                    >
                      Excluir
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleRestore(linktree)}
                      className={actionButtonClass}
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => handleHardDelete(linktree)}
                      className="rounded-md border border-border px-3 py-1.5 text-sm text-red-400 transition-colors hover:border-red-400"
                    >
                      Excluir definitivo
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {qrTarget && (
        <QrCodeModal
          url={qrTarget.publishedUrl.trim()}
          slug={qrTarget.slug}
          onClose={() => setQrTarget(null)}
        />
      )}
    </main>
  );
}
