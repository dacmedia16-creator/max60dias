
-- Roles
CREATE TYPE public.app_role AS ENUM ('corretor', 'gestor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_select_self_or_gestor" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  data_inicio DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'gestor'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Plan days
CREATE TABLE public.plan_days (
  dia INT PRIMARY KEY CHECK (dia BETWEEN 1 AND 35),
  mes INT NOT NULL,
  semana INT NOT NULL,
  semana_titulo TEXT NOT NULL,
  semana_frase TEXT,
  capitulo TEXT,
  video_url TEXT
);
GRANT SELECT ON public.plan_days TO authenticated;
GRANT UPDATE ON public.plan_days TO authenticated;
GRANT ALL ON public.plan_days TO service_role;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plan_days_select_all" ON public.plan_days FOR SELECT TO authenticated USING (true);
CREATE POLICY "plan_days_update_gestor" ON public.plan_days FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'gestor'))
  WITH CHECK (public.has_role(auth.uid(), 'gestor'));

-- Plan tasks
CREATE TABLE public.plan_tasks (
  id SERIAL PRIMARY KEY,
  dia INT NOT NULL REFERENCES public.plan_days(dia) ON DELETE CASCADE,
  ordem INT NOT NULL,
  descricao TEXT NOT NULL
);
CREATE INDEX plan_tasks_dia_idx ON public.plan_tasks(dia);
GRANT SELECT ON public.plan_tasks TO authenticated;
GRANT ALL ON public.plan_tasks TO service_role;
ALTER TABLE public.plan_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plan_tasks_select_all" ON public.plan_tasks FOR SELECT TO authenticated USING (true);

-- Task progress
CREATE TABLE public.task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id INT NOT NULL REFERENCES public.plan_tasks(id) ON DELETE CASCADE,
  concluida BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id)
);
CREATE INDEX task_progress_user_idx ON public.task_progress(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_progress TO authenticated;
GRANT ALL ON public.task_progress TO service_role;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_progress_select" ON public.task_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "task_progress_insert_own" ON public.task_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "task_progress_update_own" ON public.task_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "task_progress_delete_own" ON public.task_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Daily reports
CREATE TABLE public.daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dia INT NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  pct_concluido INT DEFAULT 0,
  capitulo_lido BOOLEAN NOT NULL DEFAULT false,
  notas TEXT,
  auto_avaliacao INT CHECK (auto_avaliacao BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, dia)
);
CREATE INDEX daily_reports_user_idx ON public.daily_reports(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_reports TO authenticated;
GRANT ALL ON public.daily_reports TO service_role;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_reports_select" ON public.daily_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "daily_reports_insert_own" ON public.daily_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_reports_update_own" ON public.daily_reports FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
