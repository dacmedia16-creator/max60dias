## Criar usuário gestor (super admin)

Criar a conta `dacmedia16@gmail.com` com senha `12345678` e atribuir o papel `gestor` (equivalente a super admin neste app).

### Passos
1. Criar o usuário via Supabase Auth Admin (email já confirmado, para permitir login imediato).
2. Inserir o registro em `public.profiles` (nome inicial: "Super Admin", email correspondente) — o trigger `handle_new_user` já cuida disso, mas confirmaremos.
3. Inserir em `public.user_roles` a linha `(user_id, 'gestor')`.
4. Definir `data_inicio` no `profiles` como hoje (não usado para gestor, mas mantém consistência).

### Observação de segurança
A senha `12345678` é fraca e será rejeitada se a proteção HIBP estiver ligada. Recomendo trocar após o primeiro login. Deseja que eu ative a exigência de troca de senha? (opcional — posso apenas criar como pedido).

Após aprovado, executo tudo em uma única operação no backend.