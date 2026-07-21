import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
    // Redireciona conforme papel
    const uid = data.session.user.id;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const isGestor = (roles ?? []).some((r) => r.role === "gestor");
    throw redirect({ to: isGestor ? "/gestor" : "/hoje" });
  },
  component: () => null,
});
