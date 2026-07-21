## Objetivo

Adicionar guias "como fazer" por tarefa: o corretor toca em uma tarefa e vê um passo a passo; o gestor pode editar cada guia.

## 1. Migração de banco

Aplicar o SQL enviado como migração única:
- Cria `public.task_guides` (id, `padrao` UNIQUE, `ordem`, `rotulo`, `guia`).
- GRANTs: SELECT+UPDATE a `authenticated`, ALL a `service_role`.
- RLS ligado. Política SELECT para qualquer autenticado. Política UPDATE só para gestor via `has_role(auth.uid(), 'gestor')`.
- `DELETE` + `INSERT` dos ~70 padrões enviados. `ordem` menor = padrão mais específico testado antes (`briefing 9:30` antes de `briefing`; `_estudo` como fallback dos capítulos).

## 2. Casamento tarefa → guia

Util no cliente `src/lib/task-guides.ts`: dada a descrição da tarefa, itera os guias por `ordem` crescente e retorna o primeiro cujo `padrao` esteja contido em `lower(descricao)`. Para tarefas do tipo "Ler capítulo…" ou "Estudar…", tenta o padrão especial `_estudo`. Se nada casar, retorna `null`.

## 3. Server functions (`src/lib/plano.functions.ts`)

- Adicionar guias ao retorno de `getPlanoCompleto` (`context.supabase.from("task_guides").select("*").order("ordem")`) — evita round-trip extra na tela do dia.
- `atualizarGuia({ id, rotulo, guia })` com Zod, usando `context.supabase` (RLS já restringe a gestor).

## 4. UI do corretor (`_authenticated/hoje.tsx` e `dia.$dia.tsx`)

Ao lado de cada tarefa da checklist, botão discreto "Como fazer" (ícone `HelpCircle`) que abre um `Sheet` mobile-first mostrando `rotulo` + `guia` com `whitespace-pre-line`. Se não houver guia casado, o botão não aparece.

## 5. UI do gestor — nova aba "Guias"

- Adicionar link "Guias" na nav de `_authenticated/gestor.tsx`.
- Nova rota `src/routes/_authenticated/gestor.guias.tsx`: lista ordenada por `ordem` com editor inline (input para `rotulo`, textarea grande para `guia`) e botão salvar por linha chamando `atualizarGuia`. Toast de sucesso/erro.

## 6. Observações

- Nada muda em `plan_tasks` / `task_progress`; casamento é só de exibição.
- Nenhum ajuste de auth/roles necessário.
- O ZIP anexado não é usado — o conteúdo dos guias vem do próprio SQL.

## Entregáveis

1 migração + 1 util novo + 1 server function nova + ajuste em `getPlanoCompleto` + botão de guia em 2 telas do corretor + 1 nova tela do gestor + 1 link de navegação.
