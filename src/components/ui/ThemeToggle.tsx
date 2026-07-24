"use client";

import { useSyncExternalStore } from "react";
import { Segmented } from "@/components/ui/Segmented";

type Theme = "light" | "dark";

// O atributo data-theme do <html> é a fonte da verdade (setado antes do
// paint pelo script no <head>); o observer re-renderiza quando ele muda.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // localStorage indisponível (modo privado): o tema vale só na sessão.
  }
}

/** Toggle claro/escuro com persistência em localStorage. */
export function ThemeToggle({
  grow = false,
  variant = "seg",
}: {
  grow?: boolean;
  /** "circles" = par de botões circulares (card de boas-vindas da sidebar). */
  variant?: "seg" | "circles";
}) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readTheme,
    () => "dark"
  );

  if (variant === "circles") {
    return (
      <div className="flex items-center gap-1">
        {(
          [
            { value: "dark", icon: "moon", title: "Tema escuro" },
            { value: "light", icon: "sun", title: "Tema claro" },
          ] as const
        ).map(({ value, icon, title }) => (
          <button
            key={value}
            type="button"
            title={title}
            onClick={() => applyTheme(value)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[13px] transition-colors ${
              theme === value
                ? "bg-active text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            <i className={`ti ti-${icon}`} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <Segmented
      value={theme}
      onChange={applyTheme}
      grow={grow}
      options={[
        { value: "light", icon: "sun", title: "Tema claro" },
        { value: "dark", icon: "moon", title: "Tema escuro" },
      ]}
    />
  );
}
