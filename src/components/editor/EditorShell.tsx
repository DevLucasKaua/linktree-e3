"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import {
  markExported,
  updateLinktree,
  type LinktreeDoc,
  type LinktreeUpdate,
} from "@/lib/linktrees";
import {
  copyLinktreeHtml,
  exportBlockers,
  exportLinktreeZip,
  exportWarnings,
} from "@/lib/export";
import { useAuth } from "@/lib/auth-context";
import { TEMPLATES, getTemplate } from "@/templates/registry";
import { PreviewFrame } from "@/components/editor/PreviewFrame";
import { ClientForm } from "@/components/editor/ClientForm";
import { ContactForm } from "@/components/editor/ContactForm";
import { SocialsEditor } from "@/components/editor/SocialsEditor";
import { TrackingForm } from "@/components/editor/TrackingForm";
import { PaletteEditor } from "@/components/editor/PaletteEditor";
import { LinksEditor } from "@/components/editor/LinksEditor";
import { QrCodeModal } from "@/components/QrCodeModal";

type SaveState = "salvo" | "salvando" | "erro";

const AUTOSAVE_DEBOUNCE_MS = 1500;
const UNDO_LIMIT = 30;
/** Edições em sequência (digitação) viram um único passo de undo. */
const UNDO_COALESCE_MS = 800;

/** Contrato das seções do formulário: valor atual + patch de mudanças. */
export interface SectionProps {
  value: LinktreeDoc;
  onChange: (changes: LinktreeUpdate) => void;
}

export function EditorShell({ initial }: { initial: LinktreeDoc }) {
  const { user } = useAuth();
  const userEmail = user?.email ?? "";
  const [docState, setDocState] = useState<LinktreeDoc>(initial);
  const [saveState, setSaveState] = useState<SaveState>("salvo");
  const [showQr, setShowQr] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [historyCount, setHistoryCount] = useState(0);
  const pendingChanges = useRef<LinktreeUpdate>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Espelho do docState para snapshots de undo fora do updater do setState.
  const docRef = useRef<LinktreeDoc>(initial);
  const history = useRef<LinktreeDoc[]>([]);
  const lastSnapshotAt = useRef(0);

  useEffect(() => {
    docRef.current = docState;
  }, [docState]);

  const flush = useCallback(async () => {
    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return;
    pendingChanges.current = {};
    setSaveState("salvando");
    try {
      await updateLinktree(initial.id, changes, userEmail);
      // Se novas mudanças chegaram durante o save, o próximo flush cuida delas.
      if (Object.keys(pendingChanges.current).length === 0) {
        setSaveState("salvo");
      }
    } catch {
      // Devolve as mudanças não salvas para a próxima tentativa.
      pendingChanges.current = { ...changes, ...pendingChanges.current };
      setSaveState("erro");
    }
  }, [initial.id, userEmail]);

  const onChange = useCallback(
    (changes: LinktreeUpdate) => {
      const now = Date.now();
      if (now - lastSnapshotAt.current > UNDO_COALESCE_MS) {
        history.current.push(docRef.current);
        if (history.current.length > UNDO_LIMIT) history.current.shift();
        setHistoryCount(history.current.length);
      }
      lastSnapshotAt.current = now;

      setDocState((current) => ({ ...current, ...changes }));
      pendingChanges.current = { ...pendingChanges.current, ...changes };
      setSaveState("salvando");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, AUTOSAVE_DEBOUNCE_MS);
    },
    [flush]
  );

  // Linktree legado sem dono: reivindica para o gestor ao abrir no editor
  // (as rules permitem exatamente essa transição "" -> próprio e-mail).
  const claimed = useRef(false);
  useEffect(() => {
    if (claimed.current || initial.ownerEmail !== "" || !userEmail) return;
    claimed.current = true;
    onChange({ ownerEmail: userEmail.toLowerCase() });
  }, [initial.ownerEmail, userEmail, onChange]);

  const handleUndo = useCallback(() => {
    const snapshot = history.current.pop();
    if (!snapshot) return;
    setHistoryCount(history.current.length);
    lastSnapshotAt.current = Date.now();
    setDocState(snapshot);
    // O snapshot inteiro (menos id/timestamps) entra na fila do autosave.
    const { id, createdAt, updatedAt, updatedBy, ...editable } = snapshot;
    void id;
    void createdAt;
    void updatedAt;
    void updatedBy;
    pendingChanges.current = { ...pendingChanges.current, ...editable };
    setSaveState("salvando");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, AUTOSAVE_DEBOUNCE_MS);
  }, [flush]);

  // Ctrl+Z global; dentro de campos de texto vale o undo nativo do navegador.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isUndo =
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z";
      if (!isUndo) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) {
        return;
      }
      event.preventDefault();
      handleUndo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo]);

  // Salva pendências ao sair da página.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      void flush();
    };
  }, [flush]);

  function handleTemplateChange(templateId: string) {
    const template = getTemplate(templateId);
    // Trocar de template também restaura a paleta padrão dele.
    onChange({ templateId: template.id, palette: template.defaultPalette });
  }

  function validateForExport(): boolean {
    const blockers = exportBlockers(docState);
    if (blockers.length > 0) {
      alert(`Antes de publicar, preencha: ${blockers.join(", ")}.`);
      return false;
    }
    // Avisos não impedem o export — o gestor decide se segue mesmo assim.
    const warnings = exportWarnings(docState);
    if (warnings.length > 0) {
      return confirm(
        `Atenção:\n• ${warnings.join("\n• ")}\n\nExportar mesmo assim?`
      );
    }
    return true;
  }

  async function handleExportZip() {
    if (!validateForExport()) return;
    await exportLinktreeZip(docState);
    // Salva pendências ANTES do carimbo: o updatedAt fica atrás do
    // lastExportedAt e o aviso "alterações não exportadas" não dispara à toa.
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await flush();
    await markExported(initial.id);
    setDocState((current) => ({
      ...current,
      status: "publicado",
      lastExportedAt: Timestamp.now(),
    }));
  }

  async function handleCopyHtml() {
    if (!validateForExport()) return;
    await copyLinktreeHtml(docState);
    alert("HTML copiado para a área de transferência!");
  }

  function handleShowQr() {
    if (!docState.publishedUrl.trim()) {
      alert(
        'Preencha a "URL publicada" na seção Publicação e contato para gerar o QR code.'
      );
      return;
    }
    setShowQr(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/painel"
            className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent"
          >
            ← Painel
          </Link>
          <h1 className="text-xl font-bold">{docState.clientName}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span
            className={
              saveState === "erro"
                ? "text-red-400"
                : saveState === "salvando"
                  ? "text-muted"
                  : "text-green-500"
            }
          >
            {saveState === "erro"
              ? "Erro ao salvar — tentando de novo na próxima edição"
              : saveState === "salvando"
                ? "Salvando…"
                : "Salvo"}
          </span>
          <select
            value={docState.templateId}
            onChange={(event) => handleTemplateChange(event.target.value)}
            className="rounded-md border border-border bg-surface px-2 py-1.5"
          >
            {Object.values(TEMPLATES).map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleUndo}
            disabled={historyCount === 0}
            title="Desfazer (Ctrl+Z)"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
          >
            <i className="ti ti-arrow-back-up" />
            Desfazer
          </button>
          <button
            onClick={handleShowQr}
            className="rounded-md border border-border px-3 py-1.5 transition-colors hover:border-accent"
          >
            QR Code
          </button>
          <button
            onClick={handleCopyHtml}
            className="rounded-md border border-border px-3 py-1.5 transition-colors hover:border-accent"
          >
            Copiar HTML
          </button>
          <button
            onClick={handleExportZip}
            className="rounded-md bg-accent px-3 py-1.5 font-medium text-black transition-colors hover:bg-accent-hover"
          >
            Baixar site (.zip)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <div className="flex min-w-0 flex-col gap-8">
          <ClientForm value={docState} onChange={onChange} />
          <ContactForm value={docState} onChange={onChange} />
          <SocialsEditor value={docState} onChange={onChange} />
          <TrackingForm value={docState} onChange={onChange} />
          <PaletteEditor value={docState} onChange={onChange} />
          <LinksEditor value={docState} onChange={onChange} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-muted">
              Preview — exatamente o que será publicado
            </p>
            <div className="flex items-center gap-1">
              {(
                [
                  { mode: "mobile", icon: "device-mobile", title: "Celular (375px)" },
                  { mode: "desktop", icon: "device-desktop", title: "Desktop" },
                ] as const
              ).map(({ mode, icon, title }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewMode(mode)}
                  title={title}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                    previewMode === mode
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-accent"
                  }`}
                >
                  <i className={`ti ti-${icon}`} />
                </button>
              ))}
            </div>
          </div>
          <div
            className={
              previewMode === "mobile" ? "mx-auto w-[375px] max-w-full" : ""
            }
          >
            <PreviewFrame
              config={docState}
              photoSrc={docState.photoUrl}
              className="h-[700px] w-full rounded-xl border border-border bg-white"
            />
          </div>
        </div>
      </div>

      {showQr && (
        <QrCodeModal
          url={docState.publishedUrl.trim()}
          slug={docState.slug}
          onClose={() => setShowQr(false)}
        />
      )}
    </div>
  );
}
