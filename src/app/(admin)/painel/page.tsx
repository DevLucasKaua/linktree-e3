import Link from "next/link";

export default function PainelPage() {
  // Placeholder — a lista de linktrees chega na Sprint 4.
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Painel</h1>
      <p className="text-muted">A lista de linktrees chega na Sprint 4.</p>
      <Link
        href="/novo"
        className="rounded-lg bg-accent px-4 py-2 font-medium text-black transition-colors hover:bg-accent-hover"
      >
        + Novo linktree
      </Link>
    </main>
  );
}
