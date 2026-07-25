"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { initials } from "@/lib/utils";

const NAV = [{ href: "/painel", icon: "layout-grid", label: "Linktrees" }];

/** Navegação lateral (linguagem clash): pilha de cards glass sobre o backdrop. */
export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const firstName = user?.displayName?.split(" ")[0] ?? "gestor";
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 px-4 pb-4 pt-4 md:sticky md:top-0 md:h-screen md:w-[232px]">
      {/* Marca: tile escuro com o monograma E3 */}
      <Link href="/painel" className="flex items-center gap-2.5 px-1 py-1">
        {/* Tile sempre escuro (como o favicon): o "E" cinza-claro da logo
            contrasta nos dois temas */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-[#15161c] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.svg" alt="" className="h-full w-full" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          E3 Digital
        </span>
      </Link>

      {/* Card de boas-vindas */}
      <div className="glass relative rounded-2xl border border-hair bg-surface-2 p-4">
        <div className="absolute right-3 top-3">
          <ThemeToggle variant="circles" />
        </div>
        {user?.photoURL ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-11 w-11 rounded-xl border border-hair object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-hair bg-active">
            <span className="text-sm font-semibold text-accent-deep">
              {initials(user?.displayName ?? user?.email ?? "?")}
            </span>
          </div>
        )}
        <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          {dateLabel}
        </p>
        <p className="mt-1 text-xl font-bold leading-tight tracking-tight">
          Bem-vindo, {firstName}!
        </p>
      </div>

      {/* Navegação */}
      <nav className="glass flex flex-col gap-0.5 rounded-2xl border border-hair bg-surface-2 p-1.5">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm transition-colors ${
                active
                  ? "border border-hair bg-active font-medium"
                  : "border border-transparent hover:bg-hover"
              }`}
            >
              <i className={`ti ti-${icon} opacity-85`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="min-h-4 flex-1" />

      {/* Sessão */}
      <div className="flex items-center justify-between gap-2 px-1">
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

      {/* CTA no gradiente da marca, com botão cravado no canto (liquid glass) */}
      <Link
        href="/novo"
        className="glass-tint pressable group relative overflow-hidden rounded-[14px] p-4 pr-12 text-white hover:brightness-110"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <i className="ti ti-sparkles" />
          Novo linktree
        </span>
        <span className="mt-0.5 block text-xs text-white/85">
          Comece por um template
        </span>
        <span
          aria-hidden
          className="carve absolute -bottom-1.5 -right-1.5 flex h-10 w-10 items-center justify-center rounded-full border border-hair bg-surface-2 text-ink transition-transform group-hover:scale-105"
        >
          <i className="ti ti-arrow-up-right" />
        </span>
      </Link>
    </aside>
  );
}
