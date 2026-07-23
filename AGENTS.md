<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Linktree E3

Painel admin onde gestores da E3 Digital montam bio-link pages (linktrees) para clientes advogados e exportam HTML estático para deploy.

## Regras do projeto

- **Somente o usuário faz commits.** Assistentes nunca rodam `git commit`/`git push` — param no checkpoint, informam os comandos e a mensagem, e aguardam.
- Branches por sprint (`sprint-N-nome`), merge na `main` ao final de cada sprint.
- UI e comentários em **pt-BR**.
- Identidade E3: fundo escuro `#000`/`#0a0a0a`, acento laranja `#ff6a00`.

## Stack

- Next.js (App Router) + React 19 + TypeScript + Tailwind v4 (`src/`, alias `@/`)
- Firebase client SDK: Auth (Google + allowlist `managers/{email}`), Firestore (`linktrees/{id}`)
- **Sem Firebase Storage** (plano Spark): a foto do cliente é data URI JPEG (redimensionada a 800px em `src/lib/photo.ts`) gravada no campo `photoUrl` do próprio documento.
- Security rules versionadas em `firestore.rules` — a fronteira real de segurança; coladas manualmente no console Firebase a cada mudança.

## Arquitetura-chave

- Templates são **código** em `src/templates/{id}/` (componente React com classes próprias, SEM Tailwind, + `css(palette)`), registrados em `src/templates/registry.ts`. O Firestore guarda só `templateId` + `palette`.
- `buildLinktreeHtml(config)` (`src/templates/render.ts`) gera o HTML estático completo. **Preview = export**: o iframe do editor usa exatamente a mesma função do ZIP exportado — nunca criar caminhos separados de renderização.
- Export é client-side (`src/lib/export.ts`, jszip): `{slug}/index.html` + `{slug}/foto.jpg`.
