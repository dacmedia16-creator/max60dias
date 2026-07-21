import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const uid = data.user!.id;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const isGestor = (roles ?? []).some((r) => r.role === "gestor");
    navigate({ to: isGestor ? "/gestor" : "/hoje" });
  }

  async function esqueci() {
    if (!email) {
      toast.error("Digite seu e-mail primeiro.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Enviamos um e-mail com as instruções.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 text-3xl font-black tracking-tight">
            <span className="text-secondary">RE/</span>
            <span className="text-primary">MAX</span>
          </div>
          <CardTitle>Plano 60 Dias — Única Escolha</CardTitle>
          <p className="text-sm text-muted-foreground">Entre com seu e-mail e senha.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={entrar} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={esqueci}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Esqueci minha senha
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
