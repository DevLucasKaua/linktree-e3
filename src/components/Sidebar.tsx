"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV = [{ href: "/painel", icon: "layout-list", label: "Linktrees" }];

/** Navegação lateral do painel (228px; empilha no mobile). */
export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 px-5 pb-4 pt-5 md:sticky md:top-0 md:h-screen md:w-[228px] md:pb-6">
      {/* Marca */}
      <Link
        href="/painel"
        className="select-none text-base font-bold uppercase leading-none tracking-tight text-accent"
      >
        Linktree <b className="font-black">E3</b>
      </Link>

      {/* Ação principal do produto, sempre à mão */}
      <Link
        href="/novo"
        className="flex items-center justify-between gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
      >
        Novo linktree
        <i className="ti ti-plus" />
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-sm transition-colors ${
                active ? "bg-active font-medium" : "hover:bg-hover"
              }`}
            >
              <i className={`ti ti-${icon} opacity-85`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé: tema + sessão */}
      <div className="flex flex-col gap-3 border-t border-hair pt-4">
        <ThemeToggle grow />
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted" title={user?.email ?? ""}>
            {user?.email}
          </span>
          <button
            onClick={signOut}
            title="Sair"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-ink"
          >
            <i className="ti ti-logout" />
          </button>
        </div>
      </div>
    </aside>
  );
}
