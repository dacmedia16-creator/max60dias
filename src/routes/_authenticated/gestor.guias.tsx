import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { atualizarGuia, getPlanoCompleto } from "@/lib/plano.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TaskGuide } from "@/lib/task-guides";

export const Route = createFileRoute("/_authenticated/gestor/guias")({
  ssr: false,
  component: GuiasPage,
});

function GuiasPage() {
  const qc = useQueryClient();
  const getPlano = useServerFn(getPlanoCompleto);
  const salvar = useServerFn(atualizarGuia);
  const q = useQuery({ queryKey: ["plano"], queryFn: () => getPlano() });
  const [drafts, setDrafts] = useState<Record<number, { rotulo: string; guia: string }>>({});

  useEffect(() => {
    const guides: TaskGuide[] = (q.data as any)?.guides ?? [];
    const m: Record<number, { rotulo: string; guia: string }> = {};
    guides.forEach((g) => (m[g.id] = { rotulo: g.rotulo, guia: g.guia }));
    setDrafts(m);
  }, [q.data]);

  const mut = useMutation({
    mutationFn: (v: { id: number; rotulo: string; guia: string }) => salvar({ data: v }),
    onSuccess: () => {
      toast.success("Guia atualizado");
      qc.invalidateQueries({ queryKey: ["plano"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const guides: TaskGuide[] = (q.data as any)?.guides ?? [];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Edite o passo a passo mostrado ao corretor quando ele toca no ícone de ajuda em uma tarefa.
        O sistema procura o padrão dentro da descrição da tarefa (padrões com menor ordem são testados primeiro).
      </p>
      {guides.map((g) => {
        const d = drafts[g.id] ?? { rotulo: g.rotulo, guia: g.guia };
        const changed = d.rotulo !== g.rotulo || d.guia !== g.guia;
        return (
          <Card key={g.id}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  Padrão: <code className="rounded bg-muted px-1">{g.padrao}</code> · ordem {g.ordem}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!changed || mut.isPending}
                  onClick={() => mut.mutate({ id: g.id, rotulo: d.rotulo, guia: d.guia })}
                >
                  Salvar
                </Button>
              </div>
              <Input
                value={d.rotulo}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [g.id]: { ...d, rotulo: e.target.value } }))
                }
              />
              <Textarea
                rows={8}
                value={d.guia}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [g.id]: { ...d, guia: e.target.value } }))
                }
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}