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
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/Field";
import { Dropdown } from "@/components/ui/Dropdown";
import { Segmented } from "@/components/ui/Segmented";
import { SectionBareContext } from "@/components/ui/Section";
import { PreviewFrame } from "@/components/editor/PreviewFrame";
import { ClientForm } from "@/components/editor/ClientForm";
import { ContactForm } from "@/components/editor/ContactForm";
import { SocialsEditor } from "@/components/editor/SocialsEditor";
import { TrackingForm } from "@/components/editor/TrackingForm";
import { PaletteEditor } from "@/components/editor/PaletteEditor";
import { LinksEditor } from "@/components/editor/LinksEditor";
import { QrCodeModal } from "@/components/QrCodeModal";

type SaveState = "salvo" | "salvando" | "erro";
type EditorTab = "conteudo" | "perfil" | "aparencia" | "publicacao";

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
  const toast = useToast();
  const confirmDialog = useConfirm();
  const userEmail = user?.email ?? "";
  const [docState, setDocState] = useState<LinktreeDoc>(initial);
  const [saveState, setSaveState] = useState<SaveState>("salvo");
  const [showQr, setShowQr] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  // "Conteúdo" primeiro: é onde o gestor passa a maior parte do tempo.
  const [activeTab, setActiveTab] = useState<EditorTab>("conteudo");
  const [historyCount, setHistoryCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const pendingChanges = useRef<LinktreeUpdate>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Espelho do docState para snapshots de undo fora do updater do setState.
  const docRef = useRef<LinktreeDoc>(initial);
  const history = useRef<LinktreeDoc[]>([]);
  const redoStack = useRef<LinktreeDoc[]>([]);
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
      // Edição nova invalida o "refazer" (semântica clássica de undo/redo).
      if (redoStack.current.length > 0) {
        redoStack.current = [];
        setRedoCount(0);
      }

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

  /** Aplica um snapshot ao estado e enfileira os campos editáveis no autosave. */
  const applySnapshot = useCallback(
    (snapshot: LinktreeDoc) => {
      lastSnapshotAt.current = Date.now();
      setDocState(snapshot);
      const {
        id,
        createdAt,
        updatedAt,
        updatedBy,
        deletedAt,
        lastExportedAt,
        ...editable
      } = snapshot;
      void id;
      void createdAt;
      void updatedAt;
      void updatedBy;
      void deletedAt;
      void lastExportedAt;
      pendingChanges.current = { ...pendingChanges.current, ...editable };
      setSaveState("salvando");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, AUTOSAVE_DEBOUNCE_MS);
    },
    [flush]
  );

  /** Desfaz o último passo (o estado atual vai para a pilha de refazer). */
  const handleUndo = useCallback(() => {
    const snapshot = history.current.pop();
    if (!snapshot) return;
    setHistoryCount(history.current.length);
    redoStack.current.push(docRef.current);
    setRedoCount(redoStack.current.length);
    applySnapshot(snapshot);
  }, [applySnapshot]);

  /** Refaz o passo desfeito (oposto do desfazer). */
  const handleRedo = useCallback(() => {
    const snapshot = redoStack.current.pop();
    if (!snapshot) return;
    setRedoCount(redoStack.current.length);
    history.current.push(docRef.current);
    if (history.current.length > UNDO_LIMIT) history.current.shift();
    setHistoryCount(history.current.length);
    applySnapshot(snapshot);
  }, [applySnapshot]);

  /** Descarta tudo: volta ao estado de quando o editor foi aberto (undoável). */
  const handleReset = useCallback(async () => {
    const confirmed = await confirmDialog({
      title: "Descartar todas as alterações?",
      message:
        "O linktree volta ao estado de quando você abriu o editor. Dá para desfazer essa ação com Ctrl+Z.",
      confirmLabel: "Descartar tudo",
      danger: true,
    });
    if (!confirmed) return;
    history.current.push(docRef.current);
    if (history.current.length > UNDO_LIMIT) history.current.shift();
    setHistoryCount(history.current.length);
    redoStack.current = [];
    setRedoCount(0);
    applySnapshot(initial);
  }, [applySnapshot, confirmDialog, initial]);

  // Ctrl+Z / Ctrl+Shift+Z (ou Ctrl+Y) globais; dentro de campos de texto
  // vale o undo nativo do navegador.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      const isUndo = key === "z" && !event.shiftKey;
      const isRedo = (key === "z" && event.shiftKey) || key === "y";
      if (!isUndo && !isRedo) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) {
        return;
      }
      event.preventDefault();
      if (isUndo) handleUndo();
      else handleRedo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, handleRedo]);

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

  async function validateForExport(): Promise<boolean> {
    const blockers = exportBlockers(docState);
    if (blockers.length > 0) {
      toast(`Antes de publicar, preencha: ${blockers.join(", ")}.`, "err");
      return false;
    }
    // Avisos não impedem o export — o gestor decide se segue mesmo assim.
    const warnings = exportWarnings(docState);
    if (warnings.length > 0) {
      return confirmDialog({
        title: "Exportar mesmo assim?",
        message: `• ${warnings.join("\n• ")}`,
        confirmLabel: "Exportar",
      });
    }
    return true;
  }

  async function handleExportZip() {
    if (!(await validateForExport())) return;
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
    toast("ZIP exportado — pronto para subir na hospedagem.");
  }

  async function handleCopyHtml() {
    if (!(await validateForExport())) return;
    await copyLinktreeHtml(docState);
    toast("HTML copiado para a área de transferência.");
  }

  function handleShowQr() {
    if (!docState.publishedUrl.trim()) {
      toast(
        'Preencha a "URL publicada" na seção Publicação e contato para gerar o QR code.',
        "err"
      );
      return;
    }
    setShowQr(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/painel"
            className="glass pressable inline-flex items-center gap-1.5 rounded-full border border-hair bg-field px-3.5 py-1.5 text-sm hover:bg-hover"
          >
            <i className="ti ti-arrow-left" />
            Painel
          </Link>
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {docState.clientName}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status de save: mono + ponto colorido (pos/muted/neg) */}
          <span
            className={`mr-1 flex items-center gap-1.5 font-mono text-xs ${
              saveState === "erro"
                ? "text-neg"
                : saveState === "salvando"
                  ? "text-muted"
                  : "text-pos"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                saveState === "erro"
                  ? "bg-neg"
                  : saveState === "salvando"
                    ? "bg-muted"
                    : "bg-pos"
              }`}
            />
            {saveState === "erro"
              ? "erro ao salvar"
              : saveState === "salvando"
                ? "salvando…"
                : "salvo"}
          </span>
          <Dropdown
            dense
            label="Template"
            value={docState.templateId}
            onChange={handleTemplateChange}
            options={Object.values(TEMPLATES).map((template) => ({
              value: template.id,
              label: template.name,
            }))}
            className="w-44"
          />
          <Button
            variant="icon"
            onClick={handleUndo}
            disabled={historyCount === 0}
            title="Desfazer a última alteração (Ctrl+Z)"
          >
            <i className="ti ti-arrow-back-up" />
          </Button>
          <Button
            variant="icon"
            onClick={handleRedo}
            disabled={redoCount === 0}
            title="Refazer (Ctrl+Shift+Z)"
          >
            <i className="ti ti-arrow-forward-up" />
          </Button>
          <Button
            variant="icon"
            onClick={handleReset}
            disabled={historyCount === 0 && redoCount === 0}
            title="Descartar todas as alterações desta sessão"
          >
            <i className="ti ti-restore" />
          </Button>
          <Button onClick={handleShowQr}>
            <i className="ti ti-qrcode" />
            QR code
          </Button>
          <Button onClick={handleCopyHtml}>
            <i className="ti ti-copy" />
            Copiar HTML
          </Button>
          <Button variant="primary" onClick={handleExportZip}>
            <i className="ti ti-download" />
            Baixar site (.zip)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* Card único com abas: menos scroll, seções agrupadas por tarefa */}
        <div className="glass flex min-w-0 flex-col self-start rounded-[20px] border border-hair bg-surface">
          <div className="border-b border-hair p-3">
            <Segmented
              grow
              value={activeTab}
              onChange={setActiveTab}
              options={[
                { value: "conteudo", label: "Conteúdo", icon: "layout-list" },
                { value: "perfil", label: "Perfil", icon: "user" },
                { value: "aparencia", label: "Aparência", icon: "palette" },
                {
                  value: "publicacao",
                  label: "Publicação",
                  icon: "world-upload",
                },
              ]}
            />
          </div>
          <div className="p-5">
            <SectionBareContext.Provider value={true}>
              {activeTab === "conteudo" && (
                <LinksEditor value={docState} onChange={onChange} />
              )}
              {activeTab === "perfil" && (
                <>
                  <ClientForm value={docState} onChange={onChange} />
                  <div className="mt-6 border-t border-hair pt-5">
                    <FieldLabel>Redes sociais</FieldLabel>
                    <div className="mt-3">
                      <SocialsEditor value={docState} onChange={onChange} />
                    </div>
                  </div>
                </>
              )}
              {activeTab === "aparencia" && (
                <PaletteEditor value={docState} onChange={onChange} />
              )}
              {activeTab === "publicacao" && (
                <>
                  <ContactForm value={docState} onChange={onChange} />
                  <div className="mt-6 border-t border-hair pt-5">
                    <FieldLabel>Rastreamento</FieldLabel>
                    <div className="mt-3">
                      <TrackingForm value={docState} onChange={onChange} />
                    </div>
                  </div>
                </>
              )}
            </SectionBareContext.Provider>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <FieldLabel>Preview — igual ao publicado</FieldLabel>
            <Segmented
              value={previewMode}
              onChange={setPreviewMode}
              options={[
                {
                  value: "mobile",
                  icon: "device-mobile",
                  title: "Celular (375px)",
                },
                { value: "desktop", icon: "device-desktop", title: "Desktop" },
              ]}
            />
          </div>
          {previewMode === "mobile" ? (
            /* Moldura de celular: bezel escuro fixo, independente do tema */
            <div className="mx-auto w-full max-w-[375px] overflow-hidden rounded-[38px] border-[10px] border-[#211f1d] bg-[#211f1d] shadow-big">
              <PreviewFrame
                config={docState}
                photoSrc={docState.photoUrl}
                className="block h-[min(680px,calc(100vh-230px))] w-full rounded-[28px] bg-white"
              />
            </div>
          ) : (
            <PreviewFrame
              config={docState}
              photoSrc={docState.photoUrl}
              className="h-[min(700px,calc(100vh-180px))] w-full rounded-xl border border-hair bg-white shadow-card"
            />
          )}
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
