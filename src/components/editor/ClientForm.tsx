"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionProps } from "@/components/editor/EditorShell";
import { isSlugTaken, type LinktreeUpdate } from "@/lib/linktrees";
import { photoToDataUri } from "@/lib/photo";
import { initials, slugify } from "@/lib/utils";

const BIO_MAX = 160;

/** Seção "Dados do cliente": nome, slug, bio e foto. */
export function ClientForm({ value, onChange }: SectionProps) {
  // Rascunho local do slug: só é aplicado (slugificado) no blur,
  // para não travar a digitação a cada tecla.
  const [slugDraft, setSlugDraft] = useState(value.slug);
  const [slugTaken, setSlugTaken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mantém o rascunho em sincronia quando o slug muda por fora
  // (ex: atualização automática ao digitar o nome).
  useEffect(() => {
    setSlugDraft(value.slug);
  }, [value.slug]);

  function handleNameChange(newName: string) {
    const changes: LinktreeUpdate = { clientName: newName };
    // Se o gestor nunca editou o slug manualmente (vazio ou ainda derivado
    // do nome anterior), o slug acompanha o novo nome.
    if (!value.slug || value.slug === slugify(value.clientName)) {
      changes.slug = slugify(newName);
    }
    onChange(changes);
  }

  async function handleSlugBlur() {
    const slug = slugify(slugDraft);
    onChange({ slug });
    // Aviso (não bloqueante) se outro cliente já usa este slug.
    setSlugTaken(await isSlugTaken(slug, value.id));
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setPhotoError(null);
    setUploading(true);
    try {
      onChange({ photoUrl: await photoToDataUri(file) });
    } catch {
      setPhotoError("Não foi possível processar a foto. Tente outra imagem.");
    } finally {
      setUploading(false);
      // Limpa o input para permitir reenviar o mesmo arquivo.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemovePhoto() {
    setPhotoError(null);
    onChange({ photoUrl: null });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-lg font-semibold">Dados do cliente</h2>

      <div className="flex flex-col gap-4">
        {/* Nome */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Nome do cliente</span>
          <input
            type="text"
            value={value.clientName}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Ex: Dra. Ana Beatriz Rocha"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        {/* Slug */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            Slug (nome da pasta no deploy)
          </span>
          <div className="flex items-center overflow-hidden rounded-md border border-border bg-background transition-colors focus-within:border-accent">
            <span className="shrink-0 border-r border-border px-3 py-2 text-sm text-muted">
              pasta:
            </span>
            <input
              type="text"
              value={slugDraft}
              onChange={(event) => setSlugDraft(event.target.value)}
              onBlur={handleSlugBlur}
              placeholder="ex: ana-beatriz-rocha"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm outline-none"
            />
          </div>
          {slugTaken && (
            <span className="text-xs text-amber-400">
              Atenção: outro cliente já usa este slug.
            </span>
          )}
        </label>

        {/* Bio */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Bio</span>
          <textarea
            rows={3}
            maxLength={BIO_MAX}
            value={value.bio}
            onChange={(event) => onChange({ bio: event.target.value })}
            placeholder="Uma frase curta sobre o cliente"
            className="resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
          />
          <span className="self-end text-xs text-muted">
            {value.bio.length}/{BIO_MAX}
          </span>
        </label>

        {/* Foto */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Foto do cliente</span>
          <div className="flex items-center gap-4">
            {value.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value.photoUrl}
                alt={`Foto de ${value.clientName}`}
                className="h-20 w-20 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                <span className="text-xl font-semibold text-accent">
                  {initials(value.clientName)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {/* Input file escondido, acionado pelo label estilizado de botão */}
              <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent">
                {uploading ? "Enviando…" : "Enviar foto"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
              </label>

              {value.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-red-400 transition-colors hover:border-red-400"
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>
          {photoError && <p className="text-sm text-red-400">{photoError}</p>}
        </div>
      </div>
    </section>
  );
}
