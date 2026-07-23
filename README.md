# Linktree E3

Painel onde os gestores da E3 Digital montam bio-link pages (linktrees) para clientes advogados e exportam o site estático pronto para deploy.

## Como funciona

O gestor faz login com Google (acesso restrito a uma allowlist no Firestore), escolhe um template na galeria, edita dados do cliente, cores e links com preview ao vivo e baixa um ZIP contendo uma pasta `{slug}/` com `index.html` + `foto.jpg`. Essa pasta é publicada como qualquer LP estática da E3: descompactar e subir. O preview do editor usa exatamente a mesma função de renderização do export (`buildLinktreeHtml`) — o que se vê é o que sai no ZIP.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind v4** (código em `src/`, alias `@/`)
- **Firebase** (client SDK): Auth com Google + Firestore, no plano **Spark** — sem Storage; a foto do cliente é redimensionada a 800px e gravada como data URI JPEG no campo `photoUrl` do próprio documento
- **jszip** para gerar o ZIP de export no navegador (tudo client-side, sem backend próprio)

## Rodando localmente

```bash
git clone <url-do-repo>
cd linktree-e3
npm install
cp .env.example .env.local
```

Preencha o `.env.local` com a config do app web do console Firebase (Configurações do projeto → Seus apps) e rode:

```bash
npm run dev
```

## Setup do Firebase (recriar o ambiente do zero)

1. Crie um projeto no [console Firebase](https://console.firebase.google.com) e adicione um **app web** (as credenciais dele vão para o `.env.local`).
2. Em **Authentication → Sign-in method**, habilite o provedor **Google**.
3. Crie o banco **Firestore** na região `southamerica-east1`.
4. Em **Firestore → Regras**, cole o conteúdo do arquivo `firestore.rules` e publique. As regras são a fronteira real de segurança: só quem tem doc em `managers/` lê e escreve em `linktrees/`. Sempre que o arquivo mudar, cole de novo no console.
5. Crie a coleção `managers` e adicione os gestores (ver abaixo).

## Como adicionar um gestor

No console do Firestore, crie um documento na coleção `managers`:

- **ID do documento**: o e-mail Google do gestor, **em minúsculas** (ex.: `fulano@gmail.com`)
- **Campo**: `name` (string) com o nome do gestor

Pronto — o login passa a funcionar para esse e-mail. Para revogar o acesso, basta excluir o documento. A escrita em `managers` é bloqueada pelo app; só o console Firebase altera a allowlist.

## Como criar um novo template

Templates são código, não dados: cada um vive em `src/templates/{id}/` e o Firestore guarda apenas `templateId` + `palette`. Use o `src/templates/e3-classic/` como referência.

1. Crie a pasta `src/templates/{id}/` com três arquivos:
   - `Template.tsx` — componente React que recebe `{ config, photoSrc }` (`TemplateProps` de `src/templates/types.ts`). Use classes CSS próprias, **sem Tailwind** — o HTML exportado precisa ser autossuficiente.
   - `styles.ts` — exporta `css(palette: Palette): string` com o CSS puro do template, interpolando as cores da paleta.
   - `meta.ts` — exporta `id`, `name`, `description` e `defaultPalette` (chaves fixas: `bg`, `surface`, `primary`, `text`, `muted`, `border`).
2. Registre em `src/templates/registry.ts`: adicione os três imports e uma nova entrada no objeto `TEMPLATES`, no mesmo padrão dos existentes.

Feito isso, a miniatura na galeria de templates aparece automaticamente (renderizada com o `SAMPLE_CONFIG`), e o template já fica disponível no editor e no export.

## Deploy do painel

O painel roda na **Vercel**:

1. Importe o repositório na Vercel.
2. Cole as variáveis de ambiente do `.env.example` (mesmos valores do `.env.local`).
3. No Firebase, em **Authentication → Settings → Authorized domains**, adicione o domínio gerado pela Vercel — sem isso o login Google falha em produção.

## Fluxo de branches

- Trabalho em feature branches (`feat/*`)
- Merge em `developer` para integração
- Merge de `developer` em `main` = produção

Apenas commits manuais do time — assistentes de código não commitam nem fazem push.
