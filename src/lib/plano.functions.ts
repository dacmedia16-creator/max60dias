import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Retorna todo o conteúdo do plano (35 dias + tarefas + video_url)
export const getPlanoCompleto = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: dias }, { data: tarefas }] = await Promise.all([
      context.supabase.from("plan_days").select("*").order("dia"),
      context.supabase.from("plan_tasks").select("*").order("dia").order("ordem"),
    ]);
    return { dias: dias ?? [], tarefas: tarefas ?? [] };
  });

// Retorna dados do próprio corretor: profile + progresso + relatórios
export const getMeusDados = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const uid = context.userId;
    const [profile, progress, reports, roleRow] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      context.supabase.from("task_progress").select("*").eq("user_id", uid),
      context.supabase.from("daily_reports").select("*").eq("user_id", uid).order("dia"),
      context.supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    const roles = (roleRow.data ?? []).map((r) => r.role);
    return {
      profile: profile.data,
      progress: progress.data ?? [],
      reports: reports.data ?? [],
      isGestor: roles.includes("gestor"),
      isCorretor: roles.includes("corretor"),
    };
  });

// Alterna status de uma tarefa
export const toggleTarefa = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ taskId: z.number(), concluida: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("task_progress")
      .upsert(
        {
          user_id: context.userId,
          task_id: data.taskId,
          concluida: data.concluida,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,task_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Salva/atualiza o relatório do dia
export const salvarRelatorio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        dia: z.number().min(1).max(35),
        pct_concluido: z.number().min(0).max(100),
        capitulo_lido: z.boolean(),
        notas: z.string().optional().nullable(),
        auto_avaliacao: z.number().min(1).max(10).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("daily_reports").upsert(
      {
        user_id: context.userId,
        dia: data.dia,
        pct_concluido: data.pct_concluido,
        capitulo_lido: data.capitulo_lido,
        notas: data.notas ?? null,
        auto_avaliacao: data.auto_avaliacao ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,dia" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ==== GESTOR ====

async function assertGestor(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "gestor" });
  if (!data) throw new Error("Acesso restrito a gestores.");
}

export const listarCorretores = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertGestor(context.supabase, context.userId);
    // Lista todos os perfis que têm papel 'corretor'
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "corretor");
    const ids = (roles ?? []).map((r) => r.user_id);
    if (ids.length === 0) return { corretores: [] };
    const [{ data: profiles }, { data: reports }] = await Promise.all([
      context.supabase.from("profiles").select("*").in("id", ids),
      context.supabase.from("daily_reports").select("user_id,dia,data,pct_concluido").in("user_id", ids),
    ]);
    return { corretores: profiles ?? [], reports: reports ?? [] };
  });

export const detalheCorretor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertGestor(context.supabase, context.userId);
    const [profile, progress, reports] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", data.userId).maybeSingle(),
      context.supabase.from("task_progress").select("*").eq("user_id", data.userId),
      context.supabase.from("daily_reports").select("*").eq("user_id", data.userId).order("dia"),
    ]);
    return {
      profile: profile.data,
      progress: progress.data ?? [],
      reports: reports.data ?? [],
    };
  });

export const criarCorretor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        nome: z.string().min(1),
        email: z.string().email(),
        senha: z.string().min(6),
        data_inicio: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertGestor(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.senha,
      email_confirm: true,
      user_metadata: { nome: data.nome },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Falha ao criar usuário.");
    const uid = created.user.id;
    // profile já pode ter sido criado pelo trigger; atualiza dados
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: uid, nome: data.nome, email: data.email, data_inicio: data.data_inicio });
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: uid, role: "corretor" }, { onConflict: "user_id,role" });
    return { ok: true, id: uid };
  });

export const atualizarVideoDia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ dia: z.number().min(1).max(35), videoUrl: z.string().url().or(z.literal("")) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertGestor(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("plan_days")
      .update({ video_url: data.videoUrl || null })
      .eq("dia", data.dia);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
