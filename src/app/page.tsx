"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/painel" : "/login");
  }, [loading, user, router]);

  return (
    <main className="flex flex-1 items-center justify-center text-muted">
      Carregando…
    </main>
  );
}
