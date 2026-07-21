## Base de Contatos (substitui o Excel)

Aplicar o patch enviado para adicionar uma tela "Contatos" no app, com CRUD para o corretor e visão de leitura para o gestor.

### 1. Banco de dados
Rodar a migration `contatos.sql`: cria `public.contatos` (nome, telefone, tipo, status do funil, observações, próximo retorno), índices em `user_id` e `proximo_retorno`, GRANTs para `authenticated`/`service_role`, RLS habilitado e políticas:
- SELECT: dono OU gestor
- INSERT/UPDATE/DELETE: apenas o dono

### 2. Server functions
Criar `src/lib/contatos.functions.ts` com as funções do patch (listar/criar/editar/apagar do próprio corretor + `contatosDoCorretor` para o gestor).

### 3. Rota do corretor
Criar `src/routes/_authenticated/contatos.tsx` (rota `/contatos`) — cadastro rápido no topo (nome, telefone, tipo) e lista com edição de status, observações e próximo retorno.

### 4. Navegação
Substituir `src/components/AppHeader.tsx` pela versão do patch — `BottomNav` passa a ter 3 abas: **Hoje · Contatos · Jornada**.

### 5. Painel do gestor
Em `src/routes/_authenticated/gestor.corretor.$id.tsx`, aplicar o snippet: adicionar imports (`contatosDoCorretor`, `Badge`), query `gestor-contatos`, e novo `<Card>` "Contatos cadastrados" logo abaixo do card de nome/dia atual (somente leitura para o gestor).

### Fora do escopo (deixar para depois, conforme o próprio README)
Ligar tarefa "Contactar 10 CIPs" ao contador, botões de ligar/WhatsApp, painel "retornar hoje", importação de Excel.
