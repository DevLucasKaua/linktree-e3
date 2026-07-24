import type { LinkItem, UtmParams } from "@/templates/types";

/** Anexa parâmetros UTM preenchidos à URL, preservando query string existente. */
export function buildUrlWithUtms(url: string, utm?: UtmParams): string {
  if (!utm) return url;
  try {
    const parsed = new URL(url);
    for (const [key, value] of Object.entries(utm)) {
      if (value) parsed.searchParams.set(`utm_${key}`, value);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Monta o link wa.me a partir do número (só dígitos) e da mensagem opcional. */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Extrai o ID de vídeo de URLs do YouTube (watch, youtu.be, shorts, embed, live). */
export function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^(www|m|music)\./, "");
    const isValidId = (id: string | null) =>
      id && /^[\w-]{6,}$/.test(id) ? id : null;
    if (host === "youtu.be") {
      return isValidId(parsed.pathname.slice(1).split("/")[0]);
    }
    if (host === "youtube.com") {
      if (parsed.pathname === "/watch") {
        return isValidId(parsed.searchParams.get("v"));
      }
      const match = parsed.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/);
      return isValidId(match?.[1] ?? null);
    }
    return null;
  } catch {
    return null;
  }
}

/** href final de um bloco: wa.me para WhatsApp, URL com UTMs para os demais. */
export function linkItemHref(item: LinkItem): string {
  if (item.type === "whatsapp") return buildWhatsAppUrl(item.url, item.message);
  return buildUrlWithUtms(item.url, item.utm);
}

/** true se a URL é http(s) válida (validação dos campos de URL do editor). */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Iniciais do nome para o placeholder de foto (ex: "Silva & Associados" → "SA"). */
export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter((word) => /^[\p{L}\d]/u.test(word))
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
