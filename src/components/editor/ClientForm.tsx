"use client";

import { useRef, useState } from "react";
import type { SectionProps } from "@/components/editor/EditorShell";
import { isSlugTaken, type LinktreeUpdate } from "@/lib/linktrees";
import { useAuth } from "@/lib/auth-context";
import { photoToDataUri } from "@/lib/photo";
import { initials, slugify } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Field, FieldLabel, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const BIO_MAX = 160;

/** Seção "Dados do cliente": nome, slug, bio e foto. */
export function ClientForm({ value, onChange }: SectionProps) {
  const { user, role } = useAuth();
  // Rascunho local do slug: só é aplicado (slugificado) no blur,
  // para não travar a digitação a cada tecla.
  const [slugDraft, setSlugDraft] = useState(value.slug);
  const [slugTaken, setSlugTaken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mantém o rascunho em sincronia quando o slug muda por fora
  // (ex: atualização automática ao digitar o nome) — ajuste durante o
  // render, sem efeito, conforme react.dev/learn/you-might-not-need-an-effect.
  const [prevSlug, setPrevSlug] = useState(value.slug);
  if (prevSlug !== value.slug) {
    setPrevSlug(value.slug);
    setSlugDraft(value.slug);
  }

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
    setSlugTaken(
      await isSlugTaken(slug, value.id, user?.email ?? "", role === "admin")
    );
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
    <Section title="Dados do cliente">
      <div className="flex flex-col gap-4">
        <Field label="Nome do cliente">
          <Input
            value={value.clientName}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Ex: Dra. Ana Beatriz Rocha"
            maxLength={120}
          />
        </Field>

        {/* Slug com prefixo fixo "pasta:" */}
        <label className="flex min-w-0 flex-col gap-1.5">
          <FieldLabel>Slug (nome da pasta no deploy)</FieldLabel>
          <div className="flex items-center overflow-hidden rounded-[10px] border border-hair bg-field transition-colors focus-within:border-accent">
            <span className="shrink-0 border-r border-hair px-3 py-2 text-sm text-muted">
              pasta:
            </span>
            <input
              type="text"
              value={slugDraft}
              onChange={(event) => setSlugDraft(event.target.value)}
              onBlur={handleSlugBlur}
              placeholder="ex: ana-beatriz-rocha"
              maxLength={80}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm outline-none placeholder:text-muted"
            />
          </div>
          {slugTaken && (
            <span className="text-xs text-warn">
              Atenção: outro cliente já usa este slug.
            </span>
          )}
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <FieldLabel>Bio</FieldLabel>
          <Textarea
            rows={3}
            maxLength={BIO_MAX}
            value={value.bio}
            onChange={(event) => onChange({ bio: event.target.value })}
            placeholder="Uma frase curta sobre o cliente"
          />
          <span className="self-end font-mono text-xs text-muted">
            {value.bio.length}/{BIO_MAX}
          </span>
        </label>

        {/* Foto */}
        <div className="flex flex-col gap-2">
          <FieldLabel>Foto do cliente</FieldLabel>
          <div className="flex items-center gap-4">
            {value.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value.photoUrl}
                alt={`Foto de ${value.clientName}`}
                className="h-20 w-20 rounded-full border border-hair object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-hair bg-active">
                <span className="text-xl font-semibold text-accent-deep">
                  {initials(value.clientName)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {/* Input file escondido, acionado pelo label estilizado de botão */}
              <label className="glass pressable inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-hair bg-field px-3.5 py-1.5 text-sm hover:bg-hover">
                <i className="ti ti-upload" />
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
                <Button
                  variant="danger"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                >
                  Remover foto
                </Button>
              )}
            </div>
          </div>
          {photoError && <p className="text-sm text-neg">{photoError}</p>}
        </div>
      </div>
    </Section>
  );
}
