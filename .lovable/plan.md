# Plano 60 Dias — RE/MAX Única Escolha

Web app mobile-first em TanStack Start + Lovable Cloud (Supabase) para acompanhar corretores nos 35 dias úteis iniciais, com painel do gestor para intervir antes da desistência.

## 1. Backend (Lovable Cloud / Supabase)

Ativar Lovable Cloud e criar migration única com:

- **Enum `app_role`** (`corretor`, `gestor`) + tabela `user_roles` (padrão seguro de roles, separada de `profiles`) + função `has_role(uuid, app_role)` SECURITY DEFINER.
- **`profiles`**: `id` (FK `auth.users`), `nome`, `email`, `data_inicio`, `created_at`.
- **`plan_days`**: 35 linhas (dia, mes, semana, semana_titulo, semana_frase, capitulo, video_url).
- **`plan_tasks`**: tarefas fixas por dia (dia, ordem, descricao).
- **`task_progress`**: progresso do corretor por tarefa (user_id, task_id, concluida, updated_at) — único por (user_id, task_id).
- **`daily_reports`**: relatório do dia (user_id, dia, data, pct_concluido, capitulo_lido, notas, auto_avaliacao) — único por (user_id, dia).
- **Trigger** `handle_new_user` → cria `profiles` automaticamente ao registrar.
- **GRANTs** explícitos para `authenticated` e `service_role` em todas as tabelas do schema public (obrigatório para PostgREST).
- **RLS**:
  - `profiles`: corretor lê o próprio; gestor lê/edita todos via `has_role`.
  - `task_progress` e `daily_reports`: dono lê/escreve; gestor lê tudo.
  - `plan_days` e `plan_tasks`: leitura para `authenticated`; update em `plan_days` (campo `video_url`) só para gestor.
- **Seed** dos 35 dias e todas as tarefas conforme conteúdo do briefing (semanas 1–7, capítulos, frases motivacionais).

Adaptação: a spec usa política com subquery em `profiles.role`; vou usar a tabela `user_roles` + `has_role()` (obrigatório pelas regras de segurança do stack).

## 2. Autenticação

- Rota pública `/auth` com login por e-mail/senha (Supabase Auth) e "esqueci a senha".
- Rota `/reset-password` pública para completar o fluxo de recuperação.
- Layout gerenciado `_authenticated/route.tsx` protege o app; após login redireciona conforme role:
  - `corretor` → `/hoje`
  - `gestor` → `/gestor`

## 3. Visão Corretor (mobile-first)

Sob `_authenticated/`:

- **`/hoje`** — dia atual (calculado a partir de `data_inicio` em dias úteis, 1–35):
  - Cabeçalho vermelho com progresso "Dia X de 35 · NN%" e barra.
  - Título + frase da semana.
  - Checkboxes grandes de tarefas (persistem em `task_progress` no toque).
  - Card destacado de Capacitação: capítulo do dia + checkbox "li o capítulo" + botão "assistir vídeo" se `video_url` existir.
  - Textarea "notas / maiores dificuldades" com autosave (debounced) em `daily_reports`.
  - Botão "Enviar relatório do dia" → grava/atualiza `daily_reports` (pct, capítulo lido, notas).
  - Se for o último dia da semana: bloco Check List da Semana + slider auto-avaliação 1–10.
- **`/dia/$dia`** — visualização somente leitura de dias anteriores.
- **`/jornada`** — timeline das 8 semanas com progresso de cada.

Componentes: bottom nav mobile (Hoje / Jornada / Sair).

## 4. Visão Gestor (desktop + mobile)

Sob `_authenticated/gestor` (gate extra por role via `has_role`):

- **`/gestor`** — dashboard:
  - Resumo: corretores ativos, em risco 🔴, % médio do time.
  - Tabela/cards com todos: nome, dia X/35, % médio, último relatório, status colorido (🟢 até 1 dia útil, 🟡 2, 🔴 3+ dias úteis).
- **`/gestor/corretor/$id`** — detalhe do corretor: timeline dia a dia com tarefas feitas/pendentes, capítulos lidos e todas as notas.
- **`/gestor/novo`** — formulário para cadastrar corretor (nome, e-mail, senha inicial, data de início) via server function com `supabaseAdmin` (Auth Admin API + insert em `profiles` + `user_roles`).
- **`/gestor/conteudo`** — editor simples para colar `video_url` em qualquer dia.

## 5. Regras de negócio

- Dia atual = dias úteis (seg–sex) desde `data_inicio`, capado em 35. Dias anteriores não sumidos: aparecem como pendentes.
- `pct_concluido` = tarefas concluídas ÷ total do dia.
- Status do gestor calculado em dias úteis desde o último `daily_report`.
- Idioma pt-BR em todo o app.
- Zero uso de localStorage para dados de negócio — tudo via Supabase.

## 6. Identidade visual

- Tokens semânticos em `src/styles.css`:
  - `--primary`: vermelho RE/MAX `#DC1C2E` (em oklch)
  - `--secondary`: azul RE/MAX `#003DA5` (em oklch)
  - Fundo cinza claro, cartões brancos com sombra suave e cantos arredondados.
- Tipografia limpa (Inter/DM Sans via `<link>` no `__root.tsx`).
- Vermelho para ações e progresso; azul para cabeçalho/áreas do gestor.
- `head()` do `__root` com título "Plano 60 Dias — RE/MAX Única Escolha" e descrição própria.

## 7. Detalhes técnicos

- Fetching padrão: TanStack Query (`ensureQueryData` no loader + `useSuspenseQuery`).
- Server functions `.functions.ts` em `src/lib/` para: `getToday`, `toggleTask`, `saveNotes`, `submitDailyReport`, `listCorretores` (gestor), `getCorretorDetalhe`, `createCorretor` (admin), `updateVideoUrl`.
- `requireSupabaseAuth` em todas as fns; funções de gestor validam role via `context.supabase` antes de qualquer uso de `supabaseAdmin`.
- `attachSupabaseAuth` em `src/start.ts`.
- Após login, redirecionamento por role vive no callback do formulário.

## 8. Passos manuais pós-geração (documentar no chat)

1. Cloud já ativado automaticamente.
2. Criar o primeiro gestor: painel Cloud → Users → Add user; depois SQL: `insert into user_roles (user_id, role) values ('<uuid>', 'gestor');` e `insert into profiles (id, nome, email) values ('<uuid>', 'Nome', 'email');` (ou aguardar o trigger e apenas inserir o role).
3. Logar como gestor e cadastrar corretores pela tela.

## O que NÃO faço nesta iteração

- Notificações por e-mail/push para gestor quando alguém fica 🔴 (pode ser fase 2).
- Upload de vídeos (só URL colada).
- Export de relatórios em PDF.
