## Objetivo

Registrar os 14 scripts oficiais da Cartilha RE/MAX v2.0 como migration versionada no repositório, garantindo que a substituição fique persistida em `supabase/migrations/` e não apenas na sessão temporária.

## Passos

1. Criar nova migration em `supabase/migrations/` (via ferramenta de migration do Supabase, que gera o arquivo versionado) contendo exatamente:
   - `DELETE FROM public.scripts_modelo;`
   - `INSERT INTO public.scripts_modelo (categoria, titulo, conteudo, ordem) VALUES (...)` com os 14 scripts fornecidos (categorias `reuniao`, `comprador`, `fechamento`; ordens 1–14).

2. Após aplicar, verificar via `supabase--read_query`:
   - `SELECT count(*) FROM public.scripts_modelo` → deve retornar 14.
   - `SELECT titulo FROM public.scripts_modelo WHERE titulo IN ('Agendar Uma Reunião','Fazendo Uma Proposta')` → deve retornar as 2 linhas.

## Fora de escopo

- Nenhuma alteração em schema, RLS, GRANTs, outras tabelas ou na tela `/scripts`.
- Nenhuma mudança de código frontend.

## Nota técnica

O SQL enviado contém DML puro (DELETE + INSERT). Normalmente dados vão pela ferramenta de insert, mas como o pedido é explicitamente "migration versionada em `supabase/migrations/`", usarei a ferramenta de migration para que o arquivo fique commitado no repositório.
