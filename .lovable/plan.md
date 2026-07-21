## Reseed do conteúdo do Plano 60 Dias

Rodar o SQL enviado como uma migration única para atualizar `plan_days` e recriar `plan_tasks` com o conteúdo definitivo (35 dias úteis + ~280 tarefas).

### Passos

1. **Migration única** com o SQL exato enviado:
   - `INSERT ... ON CONFLICT (dia) DO UPDATE` em `public.plan_days` (35 linhas) — atualiza mês, semana, título, frase e capítulo de cada dia sem apagar `video_url` já configurado pelo gestor.
   - `DELETE FROM public.plan_tasks;` seguido de `INSERT` de todas as tarefas na ordem correta — garante ordem consistente por dia.

### Observações

- Uso migration (e não insert) porque o `DELETE` em massa de `plan_tasks` é uma operação destrutiva de reset de conteúdo e precisa passar por revisão.
- `task_progress` referencia `plan_tasks.id`. Como o `DELETE` remove todas as tarefas antigas, `ON DELETE` em cascade removerá o progresso associado. Isto é aceitável em fase de setup inicial, mas **se já houver corretores ativos com progresso registrado, ele será perdido**. Confirme antes de aplicar.
- `plan_days.video_url` é preservado (só faço UPDATE nos campos de conteúdo).
- Nada muda no frontend nem nas server functions.

### Pergunta antes de aplicar

Já existe progresso real de corretores em `task_progress` que não pode ser perdido? Se sim, ajusto o plano para fazer um remapeamento por `(dia, ordem)` em vez de `DELETE`.
