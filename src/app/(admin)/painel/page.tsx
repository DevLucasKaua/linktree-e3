"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import {
  batchDelete,
  batchRestore,
  batchSoftDelete,
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
import { Dropdown } from "@/components/ui/Dropdown";

type Tab = "ativos" | "lixeira";
type SortKey = "updated" | "name" | "created";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "updated", label: "Atualização recente" },
  { key: "name", label: "Nome (A–Z)" },
  { key: "created", label: "Criação recente" },
];

/** Link estilizado como chip glass (mesmo vocabulário do Button secondary). */
const LINK_BUTTON_CLASS =
  "glass pressable inline-flex items-center justify-center gap-1.5 rounded-full border border-hair bg-field px-3.5 py-1.5 text-sm hover:bg-hover";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.email) return;
    listLinktrees(user.email, isAdmin).then(setLinktrees);
  }, [user?.email, isAdmin]);

  // Seleção em massa não sobrevive a mudança de contexto (aba/filtros) —
  // ajuste durante o render, sem efeito (react.dev/you-might-not-need-an-effect).
  const filterSignature = `${tab}|${search}|${statusFilter}|${templateFilter}`;
  const [prevSignature, setPrevSignature] = useState(filterSignature);
  if (prevSignature !== filterSignature) {
    setPrevSignature(filterSignature);
    if (selected.size > 0) setSelected(new Set());
  }

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

  /** Tiles bento do topo, calculados da lista já carregada. */
  const stats = useMemo(() => {
    const actives = (linktrees ?? []).filter((item) => !item.deletedAt);
    return [
      { label: "Linktrees ativos", value: actives.length, icon: "layout-grid" },
      {
        label: "Publicados",
        value: actives.filter((item) => item.status === "publicado").length,
        icon: "world-check",
      },
      {
        label: "Rascunhos",
        value: actives.filter((item) => item.status === "rascunho").length,
        icon: "pencil",
      },
      {
        label: "Export pendente",
        value: actives.filter(hasUnexportedChanges).length,
        icon: "clock-up",
      },
    ];
  }, [linktrees]);

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

  async function handleBulkTrash() {
    const ids = [...selected];
    await batchSoftDelete(ids);
    const now = Timestamp.now();
    setLinktrees((current) =>
      (current ?? []).map((item) =>
        ids.includes(item.id) ? { ...item, deletedAt: now } : item
      )
    );
    setSelected(new Set());
    toast(`${ids.length} movido(s) para a lixeira.`);
  }

  async function handleBulkRestore() {
    const ids = [...selected];
    await batchRestore(ids);
    setLinktrees((current) =>
      (current ?? []).map((item) =>
        ids.includes(item.id) ? { ...item, deletedAt: null } : item
      )
    );
    setSelected(new Set());
    toast(`${ids.length} restaurado(s).`);
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    const confirmed = await confirmDialog({
      title: "Excluir definitivamente?",
      message: `${ids.length} linktree(s) serão apagados para sempre. Essa ação não pode ser desfeita.`,
      confirmLabel: "Excluir para sempre",
      danger: true,
    });
    if (!confirmed) return;
    await batchDelete(ids);
    const emptiedTrash = ids.length === trashedCount;
    setLinktrees((current) =>
      (current ?? []).filter((item) => !ids.includes(item.id))
    );
    setSelected(new Set());
    toast(
      emptiedTrash
        ? "Lixeira esvaziada."
        : `${ids.length} excluído(s) definitivamente.`
    );
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

      {/* Bento de estatísticas */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, icon }, index) => (
          <div
            key={label}
            style={{ animationDelay: `${index * 40}ms` }}
            className="glass flex animate-rise items-center gap-3 rounded-[20px] border border-hair bg-surface p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-hair bg-field text-accent-deep">
              <i className={`ti ti-${icon}`} />
            </span>
            <div className="min-w-0">
              <p className="text-[22px] font-bold leading-none tracking-tight">
                {linktrees === null ? "–" : value}
              </p>
              <p className="mt-1 truncate font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Busca maior + filtros distribuídos lado a lado (tudo em vidro) */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 lg:flex-[2]">
          <i className="ti ti-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou slug…"
            className="glass w-full rounded-full border border-hair bg-field py-2 pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
          />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 lg:flex-[3]">
          <Dropdown
            label="Filtrar por status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "todos", label: "Todos os status" },
              { value: "publicado", label: "Publicado" },
              { value: "rascunho", label: "Rascunho" },
            ]}
          />
          <Dropdown
            label="Filtrar por template"
            value={templateFilter}
            onChange={setTemplateFilter}
            options={[
              { value: "todos", label: "Todos os templates" },
              ...Object.values(TEMPLATES).map((template) => ({
                value: template.id,
                label: template.name,
              })),
            ]}
          />
          <Dropdown
            label="Ordenar por"
            value={sortKey}
            onChange={setSortKey}
            options={SORT_OPTIONS.map(({ key, label }) => ({
              value: key,
              label,
            }))}
          />
        </div>
      </div>

      {linktrees === null ? (
        /* Skeleton em grid */
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
          {[0, 1, 2].map((row) => (
            <li
              key={row}
              className="glass flex animate-pulse flex-col gap-3 rounded-[20px] border border-hair bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-hover" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="h-3.5 w-36 rounded bg-hover" />
                  <div className="h-3 w-24 rounded bg-hover" />
                </div>
              </div>
              <div className="h-6 w-3/4 rounded bg-hover" />
            </li>
          ))}
        </ul>
      ) : visible.length === 0 ? (
        tab === "ativos" && activesEmpty ? (
          /* Hero liquid-glass (estilo "AI Insights") para o primeiro linktree */
          <div
            className="relative overflow-hidden rounded-[20px] border border-hair p-8 md:p-10"
            style={{
              backgroundColor: "var(--surface-2)",
              backgroundImage:
                "radial-gradient(620px 320px at 18% -10%, rgba(255,47,1,0.32), transparent 62%), radial-gradient(520px 300px at 95% 110%, rgba(252,137,0,0.22), transparent 60%)",
            }}
          >
            <span className="glass inline-flex items-center gap-1.5 rounded-full border border-hair bg-field px-3 py-1 text-xs">
              <i className="ti ti-sparkles text-accent-deep" />
              Comece aqui
            </span>
            <h2 className="mt-14 max-w-sm text-xl font-semibold tracking-tight">
              Nenhum linktree ainda — crie o primeiro em minutos.
            </h2>
            <p className="mb-2 mt-1.5 max-w-md pr-14 text-sm text-soft">
              Escolha um template, personalize cores, links e blocos, e exporte
              o ZIP pronto para publicar.
            </p>
            <Link
              href="/novo"
              aria-label="Criar o primeiro linktree"
              className="carve pressable absolute -bottom-1.5 -right-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-hair bg-surface-2 text-ink hover:scale-105"
            >
              <i className="ti ti-arrow-up-right text-lg" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-hair p-12 text-center">
            <i
              className={`ti ${tab === "lixeira" ? "ti-trash-off" : "ti-filter-off"} text-2xl text-muted`}
            />
            <p className="font-medium">
              {tab === "lixeira"
                ? "Lixeira vazia"
                : "Nada encontrado com esses filtros"}
            </p>
          </div>
        )
      ) : (
        /* Grid de cards estilo "Documents" */
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((linktree, index) => {
            const isSelected = selected.has(linktree.id);
            return (
            <li
              key={linktree.id}
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
              className={`glass relative flex animate-rise flex-col gap-3 rounded-[20px] border bg-surface p-5 transition-shadow hover:shadow-card ${
                isSelected ? "border-accent/60" : "border-hair"
              }`}
            >
              {/* Seleção em massa: círculo discreto cravado no canto do card */}
              <button
                type="button"
                aria-label={isSelected ? "Desmarcar" : "Selecionar"}
                aria-pressed={isSelected}
                onClick={() => toggleSelected(linktree.id)}
                className={`pressable absolute -left-2 -top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-transparent bg-accent text-white"
                    : "glass border-hair bg-surface-2 text-transparent hover:text-muted"
                }`}
              >
                <i className="ti ti-check text-xs" />
              </button>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-hair bg-active">
                  {linktree.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={linktree.photoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-accent-deep">
                      {initials(linktree.clientName)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold tracking-tight">
                    {linktree.clientName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {linktree.updatedAt
                      ? linktree.updatedAt.toDate().toLocaleDateString("pt-BR")
                      : "—"}
                    {isAdmin &&
                      linktree.ownerEmail &&
                      ` · ${linktree.ownerEmail}`}
                  </p>
                </div>
                <Menu
                  items={
                    tab === "ativos"
                      ? [
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
                        ]
                      : [
                          {
                            label: "Excluir definitivamente",
                            icon: "trash-x",
                            danger: true,
                            onSelect: () => handleHardDelete(linktree),
                          },
                        ]
                  }
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant={
                    linktree.status === "publicado" ? "pos" : "neutral"
                  }
                >
                  {linktree.status === "publicado" ? "Publicado" : "Rascunho"}
                </Badge>
                <Badge>{getTemplate(linktree.templateId).name}</Badge>
                {tab === "ativos" && hasUnexportedChanges(linktree) && (
                  <Badge
                    variant="warn"
                    title="Houve edições depois do último export — exporte de novo para publicar"
                  >
                    export pendente
                  </Badge>
                )}
                {!linktree.ownerEmail && <Badge>sem dono</Badge>}
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-hair pt-3">
                {tab === "ativos" ? (
                  <>
                    <Link
                      href={`/editor/${linktree.id}`}
                      className={`${LINK_BUTTON_CLASS} flex-1`}
                    >
                      <i className="ti ti-pencil" />
                      Editar
                    </Link>
                    <Button
                      className="flex-1"
                      onClick={() => handleExport(linktree)}
                    >
                      <i className="ti ti-download" />
                      Exportar
                    </Button>
                  </>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={() => handleRestore(linktree)}
                  >
                    <i className="ti ti-arrow-back-up" />
                    Restaurar
                  </Button>
                )}
              </div>
            </li>
            );
          })}
        </ul>
      )}

      {/* Barra flutuante de ações em massa */}
      {selected.size > 0 && (
        <div className="glass-strong fixed inset-x-4 bottom-6 z-50 mx-auto flex w-fit max-w-[calc(100vw-2rem)] animate-toast-in flex-wrap items-center justify-center gap-2 rounded-full border border-hair bg-surface py-2 pl-5 pr-2 shadow-big">
          <span className="font-mono text-xs text-soft">
            {selected.size} selecionado{selected.size > 1 ? "s" : ""}
          </span>
          {selected.size < visible.length ? (
            <button
              type="button"
              onClick={() => setSelected(new Set(visible.map((i) => i.id)))}
              className="cursor-pointer rounded-full px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
            >
              Selecionar todos ({visible.length})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="cursor-pointer rounded-full px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
            >
              Limpar
            </button>
          )}
          {tab === "ativos" ? (
            <Button variant="danger" onClick={handleBulkTrash}>
              <i className="ti ti-trash" />
              Mover para a lixeira
            </Button>
          ) : (
            <>
              <Button onClick={handleBulkRestore}>
                <i className="ti ti-arrow-back-up" />
                Restaurar
              </Button>
              <Button variant="danger" onClick={handleBulkDelete}>
                <i className="ti ti-trash-x" />
                Excluir definitivamente
              </Button>
            </>
          )}
        </div>
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
