import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCartilha, atualizarCartilhaSecao } from "@/lib/cartilha.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/gestor/cartilha")({
  ssr: false,
  component: GestorCartilhaPage,
});

type Draft = { titulo: string; conteudo: string; ordem: number };

function GestorCartilhaPage() {
  const qc = useQueryClient();
  const get = useServerFn(getCartilha);
  const salvar = useServerFn(atualizarCartilhaSecao);
  const q = useQuery({ queryKey: ["cartilha"], queryFn: () => get() });
  const secoes = (q.data as any)?.secoes ?? [];

  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  useEffect(() => {
    const m: Record<number, Draft> = {};
    secoes.forEach((s: any) => (m[s.id] = { titulo: s.titulo, conteudo: s.conteudo, ordem: s.ordem }));
    setDrafts(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data]);

  const mut = useMutation({
    mutationFn: (v: any) => salvar({ data: v }),
    onSuccess: () => {
      toast.success("Seção atualizada");
      qc.invalidateQueries({ queryKey: ["cartilha"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Edite as seções da Cartilha exibidas aos corretores em <code>/cartilha</code>.
      </p>
      {secoes.map((s: any) => {
        const d = drafts[s.id] ?? { titulo: s.titulo, conteudo: s.conteudo, ordem: s.ordem };
        const changed = d.titulo !== s.titulo || d.conteudo !== s.conteudo || d.ordem !== s.ordem;
        return (
          <Card key={s.id}>
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">ID {s.id}</div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!changed || mut.isPending}
                  onClick={() =>
                    mut.mutate({ id: s.id, titulo: d.titulo, conteudo: d.conteudo, ordem: d.ordem })
                  }
                >
                  Salvar
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  placeholder="ordem"
                  value={d.ordem}
                  onChange={(e) =>
                    setDrafts((p) => ({ ...p, [s.id]: { ...d, ordem: parseInt(e.target.value || "0", 10) } }))
                  }
                />
                <Input
                  className="col-span-3"
                  placeholder="título"
                  value={d.titulo}
                  onChange={(e) =>
                    setDrafts((p) => ({ ...p, [s.id]: { ...d, titulo: e.target.value } }))
                  }
                />
              </div>
              <Textarea
                rows={10}
                value={d.conteudo}
                onChange={(e) =>
                  setDrafts((p) => ({ ...p, [s.id]: { ...d, conteudo: e.target.value } }))
                }
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}