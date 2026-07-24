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
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Menu } from "@/components/ui/Menu";
import { Segmented } from "@/components/ui/Segmented";
import { Select } from "@/components/ui/Field";

type Tab = "ativos" | "lixeira";
type SortKey = "updated" | "name" | "created";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "updated", label: "Atualização recente" },
  { key: "name", label: "Nome (A–Z)" },
  { key: "created", label: "Criação recente" },
];

/** Link estilizado como botão secundário (mesmo vocabulário do Button). */
const LINK_BUTTON_CLASS =
  "inline-flex items-center gap-1.5 rounded-lg border border-hair bg-surface px-3 py-1.5 text-sm transition-colors hover:border-muted";

export default function PainelPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const toast = useToast();
  const confirmDialog = useConfirm();
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
      toast(
        `Antes de publicar, edite e preencha: ${blockers.join(", ")}.`,
        "err"
      );
      return;
    }
    const warnings = exportWarnings(linktree);
    if (
      warnings.length > 0 &&
      !(await confirmDialog({
        title: "Exportar mesmo assim?",
        message: `• ${warnings.join("\n• ")}`,
        confirmLabel: "Exportar",
      }))
    ) {
      return;
    }
    await exportLinktreeZip(linktree);
    await markExported(linktree.id);
    patchLocal(linktree.id, {
      status: "publicado",
      lastExportedAt: Timestamp.now(),
    });
    toast("ZIP exportado — pronto para subir na hospedagem.");
  }

  function handleShowQr(linktree: LinktreeDoc) {
    if (!linktree.publishedUrl.trim()) {
      toast(
        'Edite o linktree e preencha a "URL publicada" para gerar o QR code.',
        "err"
      );
      return;
    }
    setQrTarget(linktree);
  }

  async function handleDuplicate(linktree: LinktreeDoc) {
    await duplicateLinktree(linktree, user?.email ?? "");
    setLinktrees(await listLinktrees(user?.email ?? "", isAdmin));
    toast("Linktree duplicado como rascunho.");
  }

  async function handleTrash(linktree: LinktreeDoc) {
    await softDeleteLinktree(linktree.id);
    patchLocal(linktree.id, { deletedAt: Timestamp.now() });
    toast("Movido para a lixeira.");
  }

  async function handleRestore(linktree: LinktreeDoc) {
    await restoreLinktree(linktree.id);
    patchLocal(linktree.id, { deletedAt: null });
    toast("Linktree restaurado.");
  }

  async function handleHardDelete(linktree: LinktreeDoc) {
    const confirmed = await confirmDialog({
      title: "Excluir definitivamente?",
      message: `O linktree de "${linktree.clientName}" será apagado para sempre. Essa ação não pode ser desfeita.`,
      confirmLabel: "Excluir para sempre",
      danger: true,
    });
    if (!confirmed) return;
    await deleteLinktree(linktree.id);
    setLinktrees((current) =>
      (current ?? []).filter((item) => item.id !== linktree.id)
    );
    toast("Linktree excluído definitivamente.");
  }

  const activesEmpty =
    (linktrees ?? []).filter((item) => !item.deletedAt).length === 0;

  return (
    <main className="flex flex-1 flex-col gap-5">
      {/* Cabeçalho da view */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight">
            Linktrees
          </h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Páginas de bio-link dos clientes E3
          </p>
        </div>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "ativos", label: "Ativos" },
            { value: "lixeira", label: `Lixeira (${trashedCount})` },
          ]}
        />
      </div>

      {/* Busca, filtros e ordenação */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <i className="ti ti-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou slug…"
            className="w-full rounded-lg border border-hair bg-surface py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-auto"
        >
          <option value="todos">Todos os status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </Select>
        <Select
          value={templateFilter}
          onChange={(event) => setTemplateFilter(event.target.value)}
          className="w-auto"
        >
          <option value="todos">Todos os templates</option>
          {Object.values(TEMPLATES).map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
        <Select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          className="w-auto"
        >
          {SORT_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {linktrees === null ? (
        /* Skeleton de carregamento */
        <ul className="flex flex-col gap-3" aria-hidden>
          {[0, 1, 2].map((row) => (
            <li
              key={row}
              className="flex animate-pulse items-center gap-4 rounded-xl border border-hair bg-surface p-4"
            >
              <div className="h-12 w-12 shrink-0 rounded-full bg-hover" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="h-3.5 w-44 rounded bg-hover" />
                <div className="h-3 w-64 rounded bg-hover" />
              </div>
            </li>
          ))}
        </ul>
      ) : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-hair p-12 text-center">
          <i
            className={`ti ${tab === "lixeira" ? "ti-trash-off" : "ti-layout-list"} text-2xl text-muted`}
          />
          <p className="font-medium">
            {tab === "lixeira"
              ? "Lixeira vazia"
              : activesEmpty
                ? "Nenhum linktree ainda"
                : "Nada encontrado com esses filtros"}
          </p>
          {tab === "ativos" && activesEmpty && (
            <p className="text-sm text-muted">
              Crie o primeiro pelo botão &quot;Novo linktree&quot; na barra
              lateral.
            </p>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((linktree, index) => (
            <li
              key={linktree.id}
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
              className="flex animate-rise items-center gap-4 rounded-xl border border-hair bg-surface p-4 transition-shadow hover:shadow-card"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-hair bg-bg">
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
                    <Badge
                      variant="warn"
                      title="Houve edições depois do último export — exporte de novo para publicar"
                    >
                      alterações não exportadas
                    </Badge>
                  )}
                </div>
                <p className="truncate text-sm text-muted">
                  {getTemplate(linktree.templateId).name} ·{" "}
                  {linktree.status === "publicado" ? "Publicado" : "Rascunho"}
                  {linktree.updatedAt &&
                    ` · ${linktree.updatedAt.toDate().toLocaleDateString("pt-BR")}`}
                  {/* Dono: admin vê o gestor; todos veem o legado sem dono */}
                  {isAdmin && linktree.ownerEmail && ` · ${linktree.ownerEmail}`}
                  {!linktree.ownerEmail && " · sem dono"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {tab === "ativos" ? (
                  <>
                    <Link
                      href={`/editor/${linktree.id}`}
                      className={LINK_BUTTON_CLASS}
                    >
                      <i className="ti ti-pencil" />
                      Editar
                    </Link>
                    <Button onClick={() => handleExport(linktree)}>
                      <i className="ti ti-download" />
                      Exportar
                    </Button>
                    <Menu
                      items={[
                        {
                          label: "QR code",
                          icon: "qrcode",
                          onSelect: () => handleShowQr(linktree),
                        },
                        {
                          label: "Duplicar",
                          icon: "copy",
                          onSelect: () => handleDuplicate(linktree),
                        },
                        {
                          label: "Mover para a lixeira",
                          icon: "trash",
                          danger: true,
                          onSelect: () => handleTrash(linktree),
                        },
                      ]}
                    />
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleRestore(linktree)}>
                      <i className="ti ti-arrow-back-up" />
                      Restaurar
                    </Button>
                    <Menu
                      items={[
                        {
                          label: "Excluir definitivamente",
                          icon: "trash-x",
                          danger: true,
                          onSelect: () => handleHardDelete(linktree),
                        },
                      ]}
                    />
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
