import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarScripts, atualizarScriptModelo } from "@/lib/scripts.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/gestor/scripts")({
  ssr: false,
  component: GestorScriptsPage,
});

type Draft = { categoria: string; titulo: string; conteudo: string; ordem: number };

function GestorScriptsPage() {
  const qc = useQueryClient();
  const listar = useServerFn(listarScripts);
  const salvar = useServerFn(atualizarScriptModelo);
  const q = useQuery({ queryKey: ["scripts"], queryFn: () => listar() });
  const modelos = (q.data as any)?.modelos ?? [];

  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  useEffect(() => {
    const m: Record<number, Draft> = {};
    modelos.forEach((s: any) => {
      m[s.id] = { categoria: s.categoria, titulo: s.titulo, conteudo: s.conteudo, ordem: s.ordem };
    });
    setDrafts(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data]);

  const mut = useMutation({
    mutationFn: (d: any) => salvar({ data: d }),
    onSuccess: () => {
      toast.success("Script modelo atualizado");
      qc.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Edite os scripts modelo disponíveis para todos os corretores. Eles podem copiar e
        personalizar cada um dentro da tela "Scripts".
      </p>
      {modelos.map((s: any) => {
        const d = drafts[s.id] ?? {
          categoria: s.categoria,
          titulo: s.titulo,
          conteudo: s.conteudo,
          ordem: s.ordem,
        };
        const changed =
          d.categoria !== s.categoria ||
          d.titulo !== s.titulo ||
          d.conteudo !== s.conteudo ||
          d.ordem !== s.ordem;
        return (
          <Card key={s.id}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">
                  ID {s.id} · ordem
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!changed || mut.isPending}
                  onClick={() =>
                    mut.mutate({
                      id: s.id,
                      categoria: d.categoria,
                      titulo: d.titulo,
                      conteudo: d.conteudo,
                      ordem: d.ordem,
                    })
                  }
                >
                  Salvar
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="categoria"
                  value={d.categoria}
                  onChange={(e) =>
                    setDrafts((p) => ({ ...p, [s.id]: { ...d, categoria: e.target.value } }))
                  }
                />
                <Input
                  className="col-span-2"
                  placeholder="título"
                  value={d.titulo}
                  onChange={(e) =>
                    setDrafts((p) => ({ ...p, [s.id]: { ...d, titulo: e.target.value } }))
                  }
                />
              </div>
              <Textarea
                rows={6}
                value={d.conteudo}
                onChange={(e) =>
                  setDrafts((p) => ({ ...p, [s.id]: { ...d, conteudo: e.target.value } }))
                }
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Ordem:</label>
                <Input
                  type="number"
                  className="w-24"
                  value={d.ordem}
                  onChange={(e) =>
                    setDrafts((p) => ({
                      ...p,
                      [s.id]: { ...d, ordem: parseInt(e.target.value || "0", 10) },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}