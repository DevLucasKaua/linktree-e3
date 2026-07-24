import type { UtmParams } from "@/templates/types";

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
