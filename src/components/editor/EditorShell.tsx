"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  updateLinktree,
  type LinktreeDoc,
  type LinktreeUpdate,
} from "@/lib/linktrees";
import {
  copyLinktreeHtml,
  exportBlockers,
  exportLinktreeZip,
} from "@/lib/export";
import { useAuth } from "@/lib/auth-context";
import { TEMPLATES, getTemplate } from "@/templates/registry";
import { PreviewFrame } from "@/components/editor/PreviewFrame";
import { ClientForm } from "@/components/editor/ClientForm";
import { PaletteEditor } from "@/components/editor/PaletteEditor";
import { LinksEditor } from "@/components/editor/LinksEditor";

type SaveState = "salvo" | "salvando" | "erro";

const AUTOSAVE_DEBOUNCE_MS = 1500;

/** Contrato das seções do formulário: valor atual + patch de mudanças. */
export interface SectionProps {
  value: LinktreeDoc;
  onChange: (changes: LinktreeUpdate) => void;
}

export function EditorShell({ initial }: { initial: LinktreeDoc }) {
  const { user } = useAuth();
  const [docState, setDocState] = useState<LinktreeDoc>(initial);
  const [saveState, setSaveState] = useState<SaveState>("salvo");
  const pendingChanges = useRef<LinktreeUpdate>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return;
    pendingChanges.current = {};
    setSaveState("salvando");
    try {
      await updateLinktree(initial.id, changes, user?.email ?? "");
      // Se novas mudanças chegaram durante o save, o próximo flush cuida delas.
      if (Object.keys(pendingChanges.current).length === 0) {
        setSaveState("salvo");
      }
    } catch {
      // Devolve as mudanças não salvas para a próxima tentativa.
      pendingChanges.current = { ...changes, ...pendingChanges.current };
      setSaveState("erro");
    }
  }, [initial.id, user?.email]);

  const onChange = useCallback(
    (changes: LinktreeUpdate) => {
      setDocState((current) => ({ ...current, ...changes }));
      pendingChanges.current = { ...pendingChanges.current, ...changes };
      setSaveState("salvando");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, AUTOSAVE_DEBOUNCE_MS);
    },
    [flush]
  );

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
    return true;
  }

  async function handleExportZip() {
    if (!validateForExport()) return;
    await exportLinktreeZip(docState);
    // Exportou ao menos uma vez: marca como publicado.
    if (docState.status !== "publicado") onChange({ status: "publicado" });
  }

  async function handleCopyHtml() {
    if (!validateForExport()) return;
    await copyLinktreeHtml(docState);
    alert("HTML copiado para a área de transferência!");
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
          <PaletteEditor value={docState} onChange={onChange} />
          <LinksEditor value={docState} onChange={onChange} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-sm text-muted">
            Preview — exatamente o que será publicado
          </p>
          <PreviewFrame
            config={docState}
            photoSrc={docState.photoUrl}
            className="h-[700px] w-full rounded-xl border border-border bg-white"
          />
        </div>
      </div>
    </div>
  );
}
