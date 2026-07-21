CREATE TABLE IF NOT EXISTS public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  tipo TEXT NOT NULL DEFAULT 'cip'
    CHECK (tipo IN ('cip','proprietario','fsbo','comprador','outro')),
  status TEXT NOT NULL DEFAULT 'novo'
    CHECK (status IN ('novo','contatado','visita','fechado','perdido')),
  observacoes TEXT,
  proximo_retorno DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contatos_user_idx ON public.contatos(user_id);
CREATE INDEX IF NOT EXISTS contatos_retorno_idx ON public.contatos(proximo_retorno);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contatos TO authenticated;
GRANT ALL ON public.contatos TO service_role;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contatos_select ON public.contatos;
CREATE POLICY contatos_select ON public.contatos FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));

DROP POLICY IF EXISTS contatos_insert_own ON public.contatos;
CREATE POLICY contatos_insert_own ON public.contatos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS contatos_update_own ON public.contatos;
CREATE POLICY contatos_update_own ON public.contatos FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS contatos_delete_own ON public.contatos;
CREATE POLICY contatos_delete_own ON public.contatos FOR DELETE TO authenticated
  USING (auth.uid() = user_id);