import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { criarCorretor } from "@/lib/plano.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/gestor/novo")({
  ssr: false,
  component: NovoCorretor,
});

function NovoCorretor() {
  const navigate = useNavigate();
  const criar = useServerFn(criarCorretor);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    data_inicio: new Date().toISOString().slice(0, 10),
  });

  const mut = useMutation({
    mutationFn: () => criar({ data: form }),
    onSuccess: () => {
      toast.success("Corretor cadastrado!");
      navigate({ to: "/gestor" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Card className="max-w-lg">
      <CardHeader><CardTitle>Cadastrar novo corretor</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}>
          <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></div>
          <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div>
            <Label>Senha inicial</Label>
            <Input type="text" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required minLength={6} />
            <p className="mt-1 text-xs text-muted-foreground">Compartilhe com o corretor para o primeiro login.</p>
          </div>
          <div><Label>Data de início</Label><Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} required /></div>
          <Button type="submit" disabled={mut.isPending} className="w-full">{mut.isPending ? "Salvando..." : "Cadastrar"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}