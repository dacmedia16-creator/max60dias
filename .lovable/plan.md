## Scripts, Metas da Semana e Contadores de Ação de Rua

Aplicar o SQL enviado e construir as três frentes no app do corretor + visão de leitura no gestor.

### 1) Banco de dados (uma migration)
Rodar o SQL na íntegra: cria `public.scripts_modelo`, `public.scripts_corretor`, `public.metas_semana` e `public.acao_rua` com índices, GRANTs, RLS e políticas (dono edita; gestor lê tudo; só gestor edita `scripts_modelo`). Inclui o seed dos 6 scripts modelo (CIP, prospecção, objeções).

### 2) Server functions — `src/lib/`
Criar três novos módulos com `createServerFn` + `requireSupabaseAuth`:
- `scripts.functions.ts` — `listarScripts` (modelos + próprios), `salvarScriptCorretor` (upsert), `apagarScriptCorretor`, `atualizarScriptModelo` (gestor), `scriptsDoCorretor` (gestor lê os do corretor).
- `metas.functions.ts` — `listarMetas` (todas as 8 semanas do corretor), `salvarMeta` (upsert por `semana`), `metasDoCorretor` (gestor).
- `acao-rua.functions.ts` — `getAcaoRua(dia)`, `salvarAcaoRua(dia, cartoes, flyers, blocos, sms)` (upsert), `acaoRuaDoCorretor` (gestor, todos os dias).

### 3) Telas do corretor
- **`/scripts`** (`src/routes/_authenticated/scripts.tsx`): abas "Modelos" (só leitura, com botão "Copiar para meus scripts" que pré-preenche o formulário) e "Meus scripts" (CRUD, agrupado por categoria).
- **`/metas`** (`src/routes/_authenticated/metas.tsx`): lista as 8 semanas; cada card com campos objetivo / reflexão / resultado, salvando por semana. Semana atual destacada (derivada de `profiles.start_date` via `dias-uteis.ts`).
- **Ação de rua na tela `/hoje`**: novo card compacto (contadores +/- de cartões, flyers, blocos, SMS) atrelado ao `dia` atual, salvando via `salvarAcaoRua`. Sem rota nova.

### 4) Navegação
`BottomNav` do corretor tem hoje 3 abas (Hoje · Contatos · Jornada). Adicionar **Scripts** e **Metas** → 5 abas, mesma estética (grid-cols-5, ícones/tamanhos reduzidos para caber no mobile).

### 5) Painel do gestor
Em `gestor.corretor.$id.tsx` acrescentar, após o card de Contatos, três blocos somente-leitura:
- **Scripts do corretor** (lista dos próprios, agrupados por categoria).
- **Metas & reflexões** (as 8 semanas com objetivo/reflexão/resultado).
- **Ação de rua** (tabela: dia · cartões · flyers · blocos · SMS, com totais no rodapé).

Em `gestor.tsx` adicionar link **Scripts modelo** na sub-nav, e criar `gestor.scripts.tsx` para o gestor editar título/conteúdo/ordem dos scripts modelo (mesmo padrão da tela de guias).

### Fora de escopo
Envio automático de scripts por WhatsApp, notificação de meta não preenchida, gráficos históricos de ação de rua — ficam para depois.

### Detalhes técnicos
- Reaproveitar `AppHeader` / `BottomNav` / `Sheet` / `Card` / `sonner`.
- Toda escrita passa por server function autenticada; RLS já garante isolamento por `user_id`.
- Semana atual = `Math.ceil(diaAtual / 5)` clampado em 1..8, usando o helper existente em `src/lib/dias-uteis.ts`.
- O SQL enviado usa `SERIAL` em `scripts_modelo` (sem `updated_at`) e não tem trigger — manter como veio; não adicionar colunas.
