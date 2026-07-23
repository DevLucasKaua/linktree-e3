"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth-context";

function Topbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/painel" className="font-bold">
          Linktree <span className="text-accent">E3</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted hidden sm:inline">{user?.email}</span>
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-1.5 transition-colors hover:border-accent"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <Topbar />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        {children}
      </div>
    </AuthGuard>
  );
}
