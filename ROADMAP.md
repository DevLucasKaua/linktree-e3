# Roadmap — Linktree E3

Roadmap de evolução do produto, baseado em análise de apps consolidados do mesmo nicho (Linktree, Beacons, Bento, Taplink, Lnk.bio) e nas restrições do projeto.

**Decisões de escopo:**

- Deploy continua **manual** (export ZIP → hospedagem estática). Sem publicação 1-clique.
- Analytics via **pixels de terceiros** (GA4 / Meta Pixel / GTM) injetados no export. Sem tracking próprio.
- Sprints **curtas e focadas**: 2–4 features coesas, 1 branch `feat/*` e 1 deploy por sprint.

**Restrições que moldam tudo:** 100% client-side, Firebase Spark (sem Storage, sem Functions), doc Firestore ≤ 1MB (a foto já ocupa até 900KB — evitar mais imagens em data URI), preview = export (`buildLinktreeHtml` é o único caminho de renderização), só o usuário commita, fluxo `feat/*` → `developer` → `main`, rules coladas manualmente no console.

---

## Catálogo de features

### Incluídas no roadmap

| # | Feature | Referência de mercado | Esforço | Sprint |
|---|---|---|---|---|
| 1 | Favicon gerado da foto no export | Linktree | P | 6 |
| 2 | Meta tags completas: `og:image`, `og:url`, `theme-color` + campo "URL publicada" | todos | P | 6 |
| 3 | JSON-LD (`Person`/`LegalService`) para advogados | Taplink SEO | P | 6 |
| 4 | QR Code (download no painel + PNG no ZIP) | Linktree/Beacons | P | 6 |
| 5 | vCard "Salvar contato" (.vcf no ZIP + botão na página) | Linktree "share contact" | M | 6 |
| 6 | Linha de ícones de redes sociais (separada dos botões) | todos | M | 7 |
| 7 | Novos tipos de bloco: cabeçalho de seção, botão WhatsApp com mensagem, embed YouTube lite | Beacons/Bento | M | 7 |
| 8 | Destaque de link (badge "novo" + animação sutil) | Linktree "prioritize" | P | 7 |
| 9 | Pixels: GA4, Meta Pixel, GTM injetados no export | Linktree Pro | M | 8 |
| 10 | Agendamento de link (exibir de/até — JS inline no HTML estático) | Linktree scheduler | M | 8 |
| 11 | Checklist de publicação expandido (avisos não-bloqueantes) | — | P | 8 |
| 12 | Drag-and-drop para reordenar links | todos | M | 9 |
| 13 | Toggle preview mobile/desktop no editor | Linktree | P | 9 |
| 14 | Seletor de fonte Google por linktree | Beacons | M | 9 |
| 15 | Undo local no editor (Ctrl+Z) | — | M | 9 |
| 16 | Painel: busca, filtro por status/template, ordenação | — | P | 10 |
| 17 | Lixeira (soft delete com restauração) | — | M | 10 |
| 18 | Indicador "alterado desde o último export" | — | P | 10 |
| 19 | Ownership por gestor + papel admin nas rules | — | M | 11 |
| 20 | Validação de schema nas firestore.rules | — | M | 11 |

### Avaliadas e deixadas de fora (com motivo)

- **Métricas próprias de cliques/visitas** — exige backend de tracking; inviável no Spark client-side. Pixels de terceiros cobrem.
- **Publicação 1-clique / URL gerenciada** — decisão: export manual continua.
- **Thumbnail/imagem por link** — estouraria o limite de 1MB do doc (foto já usa até 900KB).
- **Formulário de captura de leads** — precisa de backend; alternativa já coberta: link para WhatsApp/formulário externo.
- **Domínio customizado, e-mail marketing, loja/pagamentos** (Beacons/Bento) — fora do escopo de bio-link para advogados.

---

## Sprints

Cada sprint: 1 branch `feat/*`, merge em `developer` → `main`, deploy do painel ao final.

### Sprint 6 — `feat/export-pro` (SEO, QR e vCard)

*O HTML exportado fica no nível dos concorrentes em compartilhamento e descoberta.* Features #1–#5.

**Modelo de dados** (campos novos, opcionais):

- `publishedUrl?: string` — URL final onde o cliente hospeda (alimenta `og:url`, canonical e QR).
- `contact?: { phone?, email?, org? }` — dados do vCard.

**Implementação:**

- `src/lib/favicon.ts` (novo): gera PNG 32/180px da foto via canvas (mesma técnica de `src/lib/photo.ts`); `favicon.png` + `apple-touch-icon.png` no ZIP; `<link rel="icon">` no `buildLinktreeHtml`.
- `src/templates/render.tsx`: `og:image` (→ `foto.jpg`/data URI), `og:url` + canonical (se `publishedUrl`), `theme-color` (= `palette.bg`), JSON-LD `Person` + `worksFor`.
- QR: dependência `qrcode` (client-side). Botão "QR Code" no painel/editor (modal com download PNG) + `qrcode.png` no ZIP quando houver `publishedUrl`.
- vCard: `src/lib/vcard.ts` (novo) gera `.vcf` (nome, telefone, email, foto, URL); `contato.vcf` no ZIP + bloco opcional "Salvar contato" nos templates.
- `ClientForm.tsx`: campos URL publicada + contato. `src/lib/export.ts`: novos arquivos no ZIP.

**Aceite:** ZIP contém `index.html`, `foto.jpg`, `favicon.png`, `qrcode.png`, `contato.vcf`; validador OG mostra imagem/título; QR escaneado abre `publishedUrl`.

### Sprint 7 — `feat/blocos` (novos tipos de bloco)

*Sai de "lista de links" para página de bio completa.* Features #6–#8.

**Modelo de dados:**

- `LinkItem.type?: 'link' | 'header' | 'whatsapp' | 'youtube'` (default `'link'` — retrocompatível).
- `LinkItem.highlight?: boolean`; `whatsapp`: número + campo `message`; `youtube`: URL do vídeo.
- `socials?: { icon: string; url: string }[]` no doc (linha de ícones abaixo da bio).

**Implementação:**

- `LinksEditor.tsx`/`LinkItemForm.tsx`: seletor de tipo; form muda por tipo (WhatsApp monta `wa.me/{n}?text=`; reusar `buildUrlWithUtms`).
- Novo `SocialsEditor.tsx` reutilizando `IconPicker`.
- Os 5 templates (`src/templates/{id}/`): header de seção, linha de socials, YouTube "lite" (thumbnail `i.ytimg.com` + link, sem iframe) e estilo `highlight` (borda no acento + badge).

**Aceite:** cada tipo renderiza nos 5 templates; docs antigos continuam funcionando; export idêntico ao preview.

### Sprint 8 — `feat/analytics-agendamento` (pixels e agendamento)

*Cliente mede tráfego nas ferramentas dele; links entram/saem do ar sozinhos.* Features #9–#11.

**Modelo de dados:**

- `tracking?: { ga4Id?, metaPixelId?, gtmId? }`.
- `LinkItem.startAt?: string; endAt?: string` (ISO date).

**Implementação:**

- `render.tsx`: injetar snippets oficiais GA4/Pixel/GTM quando IDs presentes (validar formato `G-…`, numérico, `GTM-…`).
- Agendamento: links agendados saem com `data-start`/`data-end` + `hidden`; script inline de ~10 linhas exibe/oculta por `Date` no load (funciona em página estática sem re-export).
- Novo `TrackingForm.tsx` (seção "Rastreamento") + campos de data em `LinkItemForm.tsx`.
- Novo `exportWarnings` em `src/lib/export.ts`: avisos não-bloqueantes (sem foto, sem bio, sem `publishedUrl`, todos os links fora da janela) antes do export.

**Aceite:** IDs presentes geram os scripts (ausentes não geram nada); link com `endAt` no passado não aparece; avisos aparecem no modal de export.

### Sprint 9 — `feat/editor-ux` (produtividade do editor)

Features #12–#15.

**Implementação:**

- Drag-and-drop em `LinksEditor.tsx` com HTML5 nativo (`draggable` + `onDrop`) — sem dependência nova; manter botões cima/baixo como fallback de acessibilidade.
- `PreviewFrame.tsx`/`EditorShell.tsx`: toggle mobile (375px) / desktop no preview.
- Fonte: `fontId?: string` no doc; lista curada de ~6 fontes Google adequadas a advogados (Inter, Lora, Playfair, Source Serif…); `render.tsx` injeta `<link>` do Google Fonts e `--font-family` consumida pelos `styles.ts`.
- Undo: pilha de snapshots do config em `EditorShell.tsx` (limite ~30), Ctrl+Z + botão "Desfazer", integrado ao buffer do autosave.

**Aceite:** arrastar reordena e persiste; preview alterna larguras; fonte muda no preview e no ZIP; Ctrl+Z reverte remoção de link.

### Sprint 10 — `feat/painel-pro` (organização do painel)

Features #16–#18.

**Modelo de dados:** `deletedAt?: Timestamp | null`; `lastExportedAt?: Timestamp | null`.

**Implementação:**

- `painel/page.tsx`: busca por nome/slug (client-side), filtros por status e template, ordenação (atualização/nome/criação).
- Lixeira: "Excluir" vira soft delete (`deletedAt`); aba "Lixeira" com restaurar/excluir definitivo; `listLinktrees` filtra `deletedAt == null`.
- `EditorShell.tsx` grava `lastExportedAt` no export; painel mostra badge "alterado desde o export" quando `updatedAt > lastExportedAt`.

**Aceite:** busca/filtros funcionam com 20+ docs; excluído restaura da lixeira; badge aparece após editar linktree já exportado.

### Sprint 11 — `feat/seguranca` (ownership e rules)

Features #19–#20.

**Modelo de dados:** `ownerEmail: string` (backfill nos docs existentes); `managers/{email}.role?: 'admin' | 'gestor'`.

**Implementação:**

- `firestore.rules`: gestor lê/escreve só docs com `request.auth.token.email == resource.data.ownerEmail`; `role == 'admin'` lê/escreve tudo; validação de schema (tipos de `clientName`, `slug`, `status`, tamanho de `photoUrl`) no `write`.
- `linktrees.ts`: gravar `ownerEmail` no create/duplicate; visão de admin lista tudo com coluna "gestor".
- **Atenção:** colar as rules novas no console Firebase **antes** do deploy do painel. Testar no Rules Playground.

**Aceite:** gestor B não vê linktree do gestor A; admin vê tudo; write com tipo errado é rejeitado pelas rules.

---

## Checklist de deploy (ao final de CADA sprint)

1. `npm run lint` e `npm run build` passando.
2. Teste manual do fluxo completo: criar → editar → preview → exportar ZIP → abrir `index.html` localmente (preview = export).
3. Testar um doc **antigo** (criado antes da sprint) para garantir retrocompatibilidade dos campos novos opcionais.
4. Se `firestore.rules` mudou: colar no console Firebase **antes** do deploy do painel.
5. Checkpoint de commit: assistente informa comandos + mensagem (`feat: …` em pt-BR) e **aguarda** — só o usuário commita.
6. Merge `feat/*` → `developer`, validar, depois → `main`.
7. Smoke test pós-deploy: login, abrir um linktree, exportar.

## Garantias do roadmap

- Nenhuma feature exige backend, Storage ou plano pago — tudo compatível com Spark.
- Única dependência nova: `qrcode` (Sprint 6). Drag-and-drop usa HTML5 nativo.
- Todos os campos novos são opcionais → docs existentes seguem válidos sem migração (exceto backfill de `ownerEmail` na Sprint 11, tratado explicitamente).
- Preview = export preservado: toda mudança de renderização passa por `buildLinktreeHtml`.
