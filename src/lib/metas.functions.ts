import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listarMetas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("metas_semana")
      .select("*")
      .eq("user_id", context.userId)
      .order("semana", { ascending: true });
    if (error) throw new Error(error.message);
    return { metas: data ?? [] };
  });

export const salvarMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        semana: z.number().int().min(1).max(8),
        objetivo: z.string().optional().nullable(),
        reflexao: z.string().optional().nullable(),
        resultado: z.string().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("metas_semana").upsert(
      {
        user_id: context.userId,
        semana: data.semana,
        objetivo: data.objetivo || null,
        reflexao: data.reflexao || null,
        resultado: data.resultado || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,semana" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const metasDoCorretor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isGestor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "gestor",
    });
    if (!isGestor) throw new Error("Acesso restrito a gestores.");
    const { data: metas, error } = await context.supabase
      .from("metas_semana")
      .select("*")
      .eq("user_id", data.userId)
      .order("semana", { ascending: true });
    if (error) throw new Error(error.message);
    return { metas: metas ?? [] };
  });