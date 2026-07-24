"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // O editor abre em tela cheia (sem sidebar): mais espaço para form + preview.
  const isEditor = pathname?.startsWith("/editor");

  if (isEditor) {
    return (
      <AuthGuard>
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-5 md:px-7">
          {children}
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col px-5 pb-10 pt-2 md:px-8 md:pt-7">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
