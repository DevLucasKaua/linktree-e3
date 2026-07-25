"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/painel");
  }, [loading, user, router]);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="glass flex w-full max-w-sm animate-pop flex-col items-center gap-7 rounded-[20px] border border-hair bg-surface p-8 shadow-big">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Wordmark por tema: texto escuro no claro, texto claro no escuro */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-wordmark.svg"
            alt="E3 Digital"
            className="h-9 w-auto [[data-theme=dark]_&]:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-wordmark-dark.svg"
            alt="E3 Digital"
            className="hidden h-9 w-auto [[data-theme=dark]_&]:block"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Painel de bio-links
          </h1>
          <p className="text-sm text-muted">
            Monte e publique as páginas de link dos clientes E3 Digital.
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="glass pressable flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-hair bg-field px-6 py-2.5 text-sm font-medium hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z"
            />
            <path
              fill="#EA4335"
              d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c.9-3 3.7-5 6.9-5z"
            />
          </svg>
          Entrar com Google
        </button>

        {error && (
          <p className="w-full rounded-lg border border-neg/30 bg-neg/10 px-4 py-3 text-center text-sm text-neg">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
