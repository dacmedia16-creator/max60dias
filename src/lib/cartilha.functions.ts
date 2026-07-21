import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCartilha = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("cartilha_secoes")
      .select("*")
      .order("ordem", { ascending: true });
    if (error) throw new Error(error.message);
    return { secoes: data ?? [] };
  });

export const atualizarCartilhaSecao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.number().int(),
        titulo: z.string().min(1),
        conteudo: z.string().min(1),
        ordem: z.number().int(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cartilha_secoes")
      .update({ titulo: data.titulo, conteudo: data.conteudo, ordem: data.ordem })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });