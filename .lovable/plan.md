## Objetivo

Adicionar orientação inicial para o corretor: tela de **boas-vindas no 1º acesso** (4 passos) + aba **Ajuda** sempre acessível pelo ícone (?) no cabeçalho. Conteúdo compartilhado em um arquivo único. Só para corretor — gestor não vê.

## Passos

1. **Migration** — adicionar coluna `onboarding_ok BOOLEAN NOT NULL DEFAULT false` em `public.profiles`. Corretores existentes verão as boas-vindas na próxima entrada (comportamento desejado).

2. **Backend** — criar `src/lib/onboarding.functions.ts` com `marcarOnboardingVisto` (atualiza `profiles.onboarding_ok = true` para o usuário logado).

3. **Conteúdo compartilhado** — criar `src/lib/ajuda-conteudo.ts` exportando `PASSOS_AJUDA` (4 passos: Hoje, Contatos, Scripts, Cartilha/Jornada).

4. **Componente boas-vindas** — criar `src/components/BoasVindas.tsx`: modal (Dialog) com carrossel dos 4 passos, botões "Pular" e "Próximo/Começar!", que ao concluir chama `marcarOnboardingVisto` e invalida o cache `["meus"]`.

5. **Rota Ajuda** — criar `src/routes/_authenticated/ajuda.tsx` (`/ajuda`) exibindo os mesmos 4 passos em cards, com link para voltar à Hoje.

6. **Cabeçalho** — atualizar `src/components/AppHeader.tsx` para incluir o ícone `HelpCircle` linkando para `/ajuda` (apenas quando `gestor=false`). Manter `BottomNav` com as 5 abas atuais (Hoje, Contatos, Scripts, Cartilha, Jornada).

7. **Integração na Hoje** — em `src/routes/_authenticated/hoje.tsx`, importar `BoasVindas` e renderizar `<BoasVindas open={meusQ.data?.profile?.onboarding_ok === false} />` logo dentro da div raiz. `getMeusDados` já faz `select("*")` em profiles, então `onboarding_ok` já virá no payload sem alterar server function.

## Fora de escopo

- Nenhuma alteração em RLS/GRANTs de `profiles` (a policy de UPDATE do próprio registro já existe).
- Nenhuma mudança no menu do gestor ou em outras telas.
