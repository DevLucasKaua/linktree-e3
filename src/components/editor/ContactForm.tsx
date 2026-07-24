"use client";

import type { ContactInfo } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { isValidHttpUrl } from "@/lib/utils";

/** Seção "Publicação e contato": URL publicada (QR/SEO) e dados do vCard. */
export function ContactForm({ value, onChange }: SectionProps) {
  const urlInvalid =
    value.publishedUrl.trim() !== "" && !isValidHttpUrl(value.publishedUrl);

  function updateContact(changes: Partial<ContactInfo>) {
    onChange({ contact: { ...value.contact, ...changes } });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-lg font-semibold">Publicação e contato</h2>

      <div className="flex flex-col gap-4">
        {/* URL publicada */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">URL publicada</span>
          <input
            type="url"
            value={value.publishedUrl}
            onChange={(event) => onChange({ publishedUrl: event.target.value })}
            placeholder="https://cliente.com.br/links"
            className={`rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent ${
              urlInvalid ? "border-red-400" : "border-border"
            }`}
          />
          {urlInvalid ? (
            <span className="text-xs text-red-400">
              A URL precisa começar com http:// ou https://
            </span>
          ) : (
            <span className="text-xs text-muted">
              Endereço onde o site ficará no ar — alimenta o QR code e as tags
              de SEO (og:url, canonical, og:image) do export.
            </span>
          )}
        </label>

        {/* Contato do vCard */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Telefone</span>
            <input
              type="tel"
              value={value.contact.phone}
              onChange={(event) => updateContact({ phone: event.target.value })}
              placeholder="+55 11 99999-9999"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">E-mail</span>
            <input
              type="email"
              value={value.contact.email}
              onChange={(event) => updateContact({ email: event.target.value })}
              placeholder="contato@cliente.com.br"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Escritório / organização</span>
          <input
            type="text"
            value={value.contact.org}
            onChange={(event) => updateContact({ org: event.target.value })}
            placeholder="Ex: Rocha Advocacia"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        <p className="text-xs text-muted">
          Com telefone ou e-mail preenchido, a página ganha o botão
          &quot;Salvar contato&quot; (vCard com foto, salvo direto na agenda do
          visitante).
        </p>
      </div>
    </section>
  );
}
