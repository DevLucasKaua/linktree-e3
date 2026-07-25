"use client";

import type { ContactInfo } from "@/templates/types";
import type { SectionProps } from "@/components/editor/EditorShell";
import { isValidHttpUrl, sanitizePhoneInput } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Field, Input } from "@/components/ui/Field";

/** Seção "Publicação e contato": URL publicada (QR/SEO) e dados do vCard. */
export function ContactForm({ value, onChange }: SectionProps) {
  const urlInvalid =
    value.publishedUrl.trim() !== "" && !isValidHttpUrl(value.publishedUrl);

  function updateContact(changes: Partial<ContactInfo>) {
    onChange({ contact: { ...value.contact, ...changes } });
  }

  return (
    <Section title="Publicação e contato">
      <div className="flex flex-col gap-4">
        <Field
          label="URL publicada"
          error={
            urlInvalid ? "A URL precisa começar com http:// ou https://" : null
          }
          hint="Endereço onde o site ficará no ar — alimenta o QR code e as tags de SEO (og:url, canonical, og:image) do export."
        >
          <Input
            type="url"
            invalid={urlInvalid}
            value={value.publishedUrl}
            onChange={(event) => onChange({ publishedUrl: event.target.value })}
            placeholder="https://cliente.com.br/links"
            maxLength={300}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Telefone">
            <Input
              type="tel"
              inputMode="tel"
              value={value.contact.phone}
              onChange={(event) =>
                updateContact({ phone: sanitizePhoneInput(event.target.value) })
              }
              placeholder="+55 11 99999-9999"
              maxLength={20}
            />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              inputMode="email"
              value={value.contact.email}
              onChange={(event) => updateContact({ email: event.target.value })}
              placeholder="contato@cliente.com.br"
              maxLength={120}
            />
          </Field>
        </div>

        <Field label="Escritório / organização">
          <Input
            value={value.contact.org}
            onChange={(event) => updateContact({ org: event.target.value })}
            placeholder="Ex: Rocha Advocacia"
            maxLength={80}
          />
        </Field>

        <p className="text-xs text-muted">
          Com telefone ou e-mail preenchido, a página ganha o botão
          &quot;Salvar contato&quot; (vCard com foto, salvo direto na agenda do
          visitante).
        </p>
      </div>
    </Section>
  );
}
