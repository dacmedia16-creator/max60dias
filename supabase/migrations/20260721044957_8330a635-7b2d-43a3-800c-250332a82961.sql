CREATE TABLE IF NOT EXISTS public.scripts_modelo (
  id SERIAL PRIMARY KEY,
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 100
);
GRANT SELECT ON public.scripts_modelo TO authenticated;
GRANT UPDATE ON public.scripts_modelo TO authenticated;
GRANT ALL ON public.scripts_modelo TO service_role;
ALTER TABLE public.scripts_modelo ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS scripts_modelo_select ON public.scripts_modelo;
CREATE POLICY scripts_modelo_select ON public.scripts_modelo FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS scripts_modelo_update_gestor ON public.scripts_modelo;
CREATE POLICY scripts_modelo_update_gestor ON public.scripts_modelo FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'gestor')) WITH CHECK (public.has_role(auth.uid(), 'gestor'));

CREATE TABLE IF NOT EXISTS public.scripts_corretor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL DEFAULT 'prospeccao',
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS scripts_corretor_user_idx ON public.scripts_corretor(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scripts_corretor TO authenticated;
GRANT ALL ON public.scripts_corretor TO service_role;
ALTER TABLE public.scripts_corretor ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS scripts_corretor_select ON public.scripts_corretor;
CREATE POLICY scripts_corretor_select ON public.scripts_corretor FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS scripts_corretor_ins ON public.scripts_corretor;
CREATE POLICY scripts_corretor_ins ON public.scripts_corretor FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS scripts_corretor_upd ON public.scripts_corretor;
CREATE POLICY scripts_corretor_upd ON public.scripts_corretor FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS scripts_corretor_del ON public.scripts_corretor;
CREATE POLICY scripts_corretor_del ON public.scripts_corretor FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.metas_semana (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  semana INT NOT NULL CHECK (semana BETWEEN 1 AND 8),
  objetivo TEXT,
  reflexao TEXT,
  resultado TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, semana)
);
CREATE INDEX IF NOT EXISTS metas_semana_user_idx ON public.metas_semana(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.metas_semana TO authenticated;
GRANT ALL ON public.metas_semana TO service_role;
ALTER TABLE public.metas_semana ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS metas_semana_select ON public.metas_semana;
CREATE POLICY metas_semana_select ON public.metas_semana FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS metas_semana_ins ON public.metas_semana;
CREATE POLICY metas_semana_ins ON public.metas_semana FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS metas_semana_upd ON public.metas_semana;
CREATE POLICY metas_semana_upd ON public.metas_semana FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.acao_rua (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dia INT NOT NULL CHECK (dia BETWEEN 1 AND 35),
  cartoes INT NOT NULL DEFAULT 0,
  flyers INT NOT NULL DEFAULT 0,
  blocos INT NOT NULL DEFAULT 0,
  sms INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, dia)
);
CREATE INDEX IF NOT EXISTS acao_rua_user_idx ON public.acao_rua(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.acao_rua TO authenticated;
GRANT ALL ON public.acao_rua TO service_role;
ALTER TABLE public.acao_rua ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS acao_rua_select ON public.acao_rua;
CREATE POLICY acao_rua_select ON public.acao_rua FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS acao_rua_ins ON public.acao_rua;
CREATE POLICY acao_rua_ins ON public.acao_rua FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS acao_rua_upd ON public.acao_rua;
CREATE POLICY acao_rua_upd ON public.acao_rua FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DELETE FROM public.scripts_modelo;
INSERT INTO public.scripts_modelo (categoria, titulo, conteudo, ordem) VALUES
('cip', 'Aviso à rede quente (CIPs)',
'Oi [nome]! Tudo bem? Passando pra te contar uma novidade: agora sou corretor(a) de imóveis aqui na RE/MAX Única Escolha, atuando na região [área]. Se você (ou alguém que você conheça) estiver pensando em comprar, vender ou alugar, conta comigo — vou cuidar de tudo com atenção. Posso te mandar mais detalhes?', 1),
('prospeccao', 'Ligação para proprietário (FSBO)',
'Bom dia, falo com [nome]? Aqui é [seu nome], da RE/MAX Única Escolha. Vi que o senhor(a) está anunciando o imóvel na [rua/portal] e queria entender melhor pra ajudar. O senhor(a) está vendendo por conta própria? Posso fazer algumas perguntas rápidas sobre o imóvel? (objetivo: agendar uma visita/avaliação, não vender no telefone)', 2),
('prospeccao', 'Abordagem porta a porta (posicionamento)',
'Oi, bom dia! Sou [seu nome], corretor(a) da RE/MAX aqui na região do [bairro]. Estou me apresentando aos moradores — se um dia precisar de uma avaliação do seu imóvel ou de ajuda pra comprar, é só me chamar. Deixo meu cartão. Posso anotar seu contato pra avisar de novidades da região?', 3),
('objecoes', 'Objeção: "quero tentar vender sozinho"',
'Entendo perfeitamente. Muita gente começa assim. Posso te fazer uma pergunta? Quanto vale o seu tempo respondendo curioso, marcando visita que não aparece e negociando sozinho? Meu trabalho é filtrar comprador real, cuidar da papelada e defender o seu preço. Que tal eu te mostrar como funciona, sem compromisso?', 4),
('objecoes', 'Objeção: "a comissão é alta"',
'Comissão só existe se eu vender — e vender pelo melhor valor. Um imóvel mal anunciado ou mal negociado costuma custar mais caro que a comissão, seja em tempo parado ou em desconto na pressa. Posso te mostrar meu plano de marketing e como chego no preço certo?', 5),
('objecoes', 'Objeção: "já tenho outra imobiliária"',
'Ótimo que já está buscando ajuda. Posso te perguntar: está satisfeito com o retorno que tem recebido? Muitos proprietários trabalham com mais de um corretor ou trocam quando não veem resultado. Se quiser, faço uma avaliação da situação atual sem custo — você decide depois.', 6);