import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listarAcaoRua = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("acao_rua")
      .select("*")
      .eq("user_id", context.userId)
      .order("dia", { ascending: true });
    if (error) throw new Error(error.message);
    return { registros: data ?? [] };
  });

export const salvarAcaoRua = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        dia: z.number().int().min(1).max(35),
        cartoes: z.number().int().min(0).default(0),
        flyers: z.number().int().min(0).default(0),
        blocos: z.number().int().min(0).default(0),
        sms: z.number().int().min(0).default(0),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("acao_rua").upsert(
      {
        user_id: context.userId,
        dia: data.dia,
        cartoes: data.cartoes,
        flyers: data.flyers,
        blocos: data.blocos,
        sms: data.sms,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,dia" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const acaoRuaDoCorretor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isGestor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "gestor",
    });
    if (!isGestor) throw new Error("Acesso restrito a gestores.");
    const { data: registros, error } = await context.supabase
      .from("acao_rua")
      .select("*")
      .eq("user_id", data.userId)
      .order("dia", { ascending: true });
    if (error) throw new Error(error.message);
    return { registros: registros ?? [] };
  });