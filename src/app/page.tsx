export default function Home() {
  // Placeholder da Sprint 1 — na Sprint 2 esta página vira o redirect
  // logado → /painel, deslogado → /login.
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">
        Linktree <span className="text-accent">E3</span>
      </h1>
      <p className="text-muted text-center max-w-md">
        Painel de criação de bio-link pages para clientes da E3 Digital.
        Em construção — Sprint 1.
      </p>
    </main>
  );
}
