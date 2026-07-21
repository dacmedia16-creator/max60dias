Adicionar aba **Cartilha** ao menu do corretor, remover a aba **Metas** e mover as Metas da semana para dentro da tela **Hoje**, como um card compacto que edita apenas a semana atual (as 8 semanas continuam salvas na mesma tabela).

## Backend (uma migration)

Criar tabela `public.cartilha_secoes` (id, ordem, titulo, conteudo) com:
- `GRANT SELECT, UPDATE` para `authenticated`, `ALL` para `service_role`.
- RLS: `SELECT` para qualquer autenticado; `UPDATE` só para gestor (`has_role(auth.uid(),'gestor')`).
- Seed com as 8 seções enviadas.

Nenhuma outra tabela é tocada.

## Server functions

`src/lib/cartilha.functions.ts` (novo):
- `getCartilha` — retorna todas as seções ordenadas.
- `atualizarCartilhaSecao` — upsert de `titulo`, `conteudo`, `ordem` de uma seção (RLS restringe a gestor).

## Frontend

`src/components/AppHeader.tsx` — `BottomNav` com 5 abas, cada uma com ícone + rótulo curto:
Hoje · Contatos · Scripts · **Cartilha** · Jornada (troca `Metas` por `Cartilha`, mesmo estilo do patch).

`src/routes/_authenticated/cartilha.tsx` (novo) — lista as seções em accordion (uma aberta por vez), fonte pequena e `whitespace-pre-wrap`.

`src/routes/_authenticated/hoje.tsx` — adicionar novo card **"Metas da semana N"** logo depois do card de notas:
- calcula `semana = ceil(dia/5)` clampado 1–8;
- carrega/upserta via `listarMetas` / `salvarMeta` já existentes;
- três textareas (Objetivo, Reflexão, Resultado) + botão "Salvar meta da semana".

Remover `src/routes/_authenticated/metas.tsx` (a rota `/metas` some do routeTree gerado; o painel do gestor não linkava para ela).

`src/routes/_authenticated/gestor.tsx` — adicionar link **"Cartilha"** na nav do gestor apontando para `/gestor/cartilha`.

`src/routes/_authenticated/gestor.cartilha.tsx` (novo) — lista as seções com Input (título), Input numérico (ordem) e Textarea grande (conteúdo), botão Salvar por item, chamando `atualizarCartilhaSecao`.

## Fora de escopo

- Não substituir os scripts modelo pelos 16 oficiais (fica para outra rodada, se solicitado).
- Sem mexer em outras tabelas, políticas ou nas telas de `contatos`, `scripts`, `jornada`, `dia/$dia`.
