UPDATE public.plan_tasks
   SET descricao = 'Contactar 10 potenciais e cadastrar na aba Contatos'
 WHERE descricao = 'Contactar 10 potenciais e inserir no Excel';

UPDATE public.plan_tasks
   SET descricao = 'Contactar 10 CIPs (conhecidos) e cadastrar na aba Contatos'
 WHERE descricao = 'Contactar 10 CIPs (conhecidos) e inserir no Excel';

UPDATE public.plan_tasks
   SET descricao = 'Contactar 10 CIPs e cadastrar na aba Contatos'
 WHERE descricao = 'Contactar 10 CIPs e inserir no Excel';

UPDATE public.plan_tasks
   SET descricao = 'Contactar 10 CIPs e cadastrar na aba Contatos'
 WHERE descricao = 'Contactar 10 CIPs no maxwork';

UPDATE public.task_guides
   SET guia = 'Primeiros contatos da rede quente, cadastrados na aba Contatos do app.

1. Liste 10 conhecidos.
2. Ligue/mensagem apresentando seu novo trabalho.
3. Cadastre na aba Contatos: nome, telefone, tipo e observação.
4. Marque quem demonstrou interesse.'
 WHERE guia LIKE '%Cadastre no Excel: nome, telefone, relação%';

UPDATE public.task_guides
   SET guia = 'Primeiro exercício de prospecção: 10 contatos com potencial.

1. Use seu script de contato.
2. Foque em quem pode comprar, vender ou indicar.
3. Cadastre na aba Contatos com o resultado da conversa.
4. Agende retorno para os promissores.'
 WHERE guia LIKE '%Cadastre no Excel com o resultado%';

UPDATE public.task_guides SET padrao = 'cips (conhecidos) e cadastrar na aba contatos'
 WHERE padrao = 'cips (conhecidos) e inserir no excel';

UPDATE public.task_guides SET padrao = '10 potenciais e cadastrar na aba contatos'
 WHERE padrao = '10 potenciais e inserir no excel';

UPDATE public.task_guides SET rotulo = 'Contactar 10 CIPs e cadastrar na aba Contatos'
 WHERE rotulo = 'Contactar 10 CIPs e inserir no Excel';

UPDATE public.task_guides SET rotulo = 'Contactar 10 potenciais e cadastrar na aba Contatos'
 WHERE rotulo = 'Contactar 10 potenciais';