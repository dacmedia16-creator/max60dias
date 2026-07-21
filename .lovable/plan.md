## Objetivo

Atualizar os textos de tarefas e guias "como fazer" que ainda citam "Excel", "maxwork" ou "inserir no Excel" para que apontem corretamente à **aba Contatos** do app. A mudança é idempotente e pode ser reaplicada sem efeito colateral.

## Escopo de mudança

### 1. Tarefas (`public.plan_tasks`)
Atualizar descrições de quatro variações de texto para o padrão único: "Contactar 10 ... e cadastrar na aba Contatos".

Textos afetados:
- "Contactar 10 potenciais e inserir no Excel" → "Contactar 10 potenciais e cadastrar na aba Contatos"
- "Contactar 10 CIPs (conhecidos) e inserir no Excel" → "Contactar 10 CIPs (conhecidos) e cadastrar na aba Contatos"
- "Contactar 10 CIPs e inserir no Excel" → "Contactar 10 CIPs e cadastrar na aba Contatos"
- "Contactar 10 CIPs no maxwork" → "Contactar 10 CIPs e cadastrar na aba Contatos"

### 2. Guias (`public.task_guides`)
- Atualizar o conteúdo dos guias que ensinam a cadastrar no Excel, substituindo por passos para usar a aba Contatos.
- Atualizar os padrões de correspondência (`padrao`) que ainda citam "excel" para casar com os novos textos das tarefas.
- Atualizar os rótulos visíveis (`rotulo`) que ainda citam "Excel".

## Passos técnicos

1. Criar uma nova migration versionada em `supabase/migrations/` contendo exatamente o SQL fornecido (comandos `UPDATE` em `public.plan_tasks` e `public.task_guides`).
2. Aplicar a migration no backend.
3. Verificar via `supabase--read_query` que:
   - `public.plan_tasks` não contém mais descrições com "Excel" ou "maxwork".
   - `public.task_guides` não contém mais guias, padrões ou rótulos com "Excel".

## Fora de escopo

- Nenhuma alteração de schema, RLS, GRANTs ou outras tabelas.
- Nenhuma mudança de código frontend (os textos já estão centralizados no banco).