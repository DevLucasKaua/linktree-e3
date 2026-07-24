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

/** Toggle claro/escuro com persistência em localStorage. */
export function ThemeToggle({ grow = false }: { grow?: boolean }) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readTheme,
    () => "light"
  );

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage indisponível (modo privado): o tema vale só na sessão.
    }
  }

  return (
    <Segmented
      value={theme}
      onChange={apply}
      grow={grow}
      options={[
        { value: "light", icon: "sun", title: "Tema claro" },
        { value: "dark", icon: "moon", title: "Tema escuro" },
      ]}
    />
  );
}
