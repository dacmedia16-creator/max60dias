import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listarScripts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [modelos, meus] = await Promise.all([
      context.supabase.from("scripts_modelo").select("*").order("ordem", { ascending: true }),
      context.supabase
        .from("scripts_corretor")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
    ]);
    if (modelos.error) throw new Error(modelos.error.message);
    if (meus.error) throw new Error(meus.error.message);
    return { modelos: modelos.data ?? [], meus: meus.data ?? [] };
  });

export const salvarScriptCorretor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid().optional().nullable(),
        categoria: z.string().min(1).default("prospeccao"),
        titulo: z.string().min(1),
        conteudo: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    if (data.id) {
      const { error } = await context.supabase
        .from("scripts_corretor")
        .update({
          categoria: data.categoria,
          titulo: data.titulo,
          conteudo: data.conteudo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("user_id", context.userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("scripts_corretor").insert({
        user_id: context.userId,
        categoria: data.categoria,
        titulo: data.titulo,
        conteudo: data.conteudo,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const apagarScriptCorretor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("scripts_corretor")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const atualizarScriptModelo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.number().int(),
        categoria: z.string().min(1),
        titulo: z.string().min(1),
        conteudo: z.string().min(1),
        ordem: z.number().int(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("scripts_modelo")
      .update({
        categoria: data.categoria,
        titulo: data.titulo,
        conteudo: data.conteudo,
        ordem: data.ordem,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const scriptsDoCorretor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isGestor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "gestor",
    });
    if (!isGestor) throw new Error("Acesso restrito a gestores.");
    const { data: scripts, error } = await context.supabase
      .from("scripts_corretor")
      .select("*")
      .eq("user_id", data.userId)
      .order("categoria", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { scripts: scripts ?? [] };
  });