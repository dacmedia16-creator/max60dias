import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const tipoEnum = z.enum(["cip", "proprietario", "fsbo", "comprador", "outro"]);
const statusEnum = z.enum(["novo", "contatado", "visita", "fechado", "perdido"]);

// Lista os contatos do próprio corretor
export const listarContatos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("contatos")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { contatos: data ?? [] };
  });

// Cria um contato
export const criarContato = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        nome: z.string().min(1, "Nome é obrigatório"),
        telefone: z.string().optional().nullable(),
        tipo: tipoEnum.default("cip"),
        status: statusEnum.default("novo"),
        observacoes: z.string().optional().nullable(),
        proximo_retorno: z.string().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("contatos").insert({
      user_id: context.userId,
      nome: data.nome,
      telefone: data.telefone || null,
      tipo: data.tipo,
      status: data.status,
      observacoes: data.observacoes || null,
      proximo_retorno: data.proximo_retorno || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Atualiza um contato (dono apenas — garantido pela RLS)
export const atualizarContato = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        nome: z.string().min(1),
        telefone: z.string().optional().nullable(),
        tipo: tipoEnum,
        status: statusEnum,
        observacoes: z.string().optional().nullable(),
        proximo_retorno: z.string().optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("contatos")
      .update({
        nome: data.nome,
        telefone: data.telefone || null,
        tipo: data.tipo,
        status: data.status,
        observacoes: data.observacoes || null,
        proximo_retorno: data.proximo_retorno || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Apaga um contato
export const apagarContato = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("contatos")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// GESTOR: contatos de um corretor específico
export const contatosDoCorretor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isGestor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "gestor",
    });
    if (!isGestor) throw new Error("Acesso restrito a gestores.");
    const { data: contatos, error } = await context.supabase
      .from("contatos")
      .select("*")
      .eq("user_id", data.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { contatos: contatos ?? [] };
  });
