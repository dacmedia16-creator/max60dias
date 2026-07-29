## Objetivo

Tornar a fanpage (hoje em `/sobre`) a **página inicial** do site, em `/`. Hoje `/` é apenas um redirecionador: manda para `/auth`, `/hoje` ou `/gestor`.

## Passos

1. **Mover a fanpage para `/`** — o conteúdo de `src/routes/sobre.tsx` passa para `src/routes/index.tsx`, com SSR ativo (bom para SEO e compartilhamento) e o `head()` de metadados que já existe.

2. **Remover o redirecionamento automático de `/`** — visitantes e usuários logados passam a ver a fanpage ao abrir o site. O botão "Entrar no app" leva ao login, que continua encaminhando cada pessoa para a tela certa (corretor ou gestor).

3. **Manter `/sobre` funcionando** — a rota antiga passa a redirecionar para `/`, para que links já compartilhados não quebrem.

4. **Link de acesso rápido no topo da fanpage** — botão "Entrar" fixo no cabeçalho da página, além do CTA que já existe no final.

## Detalhes técnicos

- `src/routes/index.tsx`: substituir o `beforeLoad` de redirecionamento pelo componente da fanpage; remover `ssr: false`.
- `src/routes/sobre.tsx`: reduzir a `beforeLoad: () => { throw redirect({ to: "/" }) }`.
- Nenhuma alteração no banco de dados, RLS ou server functions.

## Ponto de atenção

Quem já está logado e abrir o site vai cair na fanpage, não direto no `/hoje`. Se preferir que usuários logados continuem indo direto para o app, dá para manter esse redirecionamento só para sessão ativa — é só avisar.
