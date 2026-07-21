import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarMetas, salvarMeta } from "@/lib/metas.functions";
import { getMeusDados } from "@/lib/plano.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { diaAtualDoCorretor } from "@/lib/dias-uteis";

export const Route = createFileRoute("/_authenticated/metas")({
  ssr: false,
  component: MetasPage,
});

type Draft = { objetivo: string; reflexao: string; resultado: string };

function MetasPage() {
  const qc = useQueryClient();
  const listar = useServerFn(listarMetas);
  const salvar = useServerFn(salvarMeta);
  const getMeus = useServerFn(getMeusDados);

  const q = useQuery({ queryKey: ["metas"], queryFn: () => listar() });
  const meusQ = useQuery({ queryKey: ["meus"], queryFn: () => getMeus() });

  const dia = diaAtualDoCorretor((meusQ.data as any)?.profile?.data_inicio ?? null);
  const semanaAtual = Math.max(1, Math.min(8, Math.ceil(dia / 5)));

  const porSemana = useMemo(() => {
    const m = new Map<number, any>();
    ((q.data as any)?.metas ?? []).forEach((x: any) => m.set(x.semana, x));
    return m;
  }, [q.data]);

  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  useEffect(() => {
    const d: Record<number, Draft> = {};
    for (let s = 1; s <= 8; s++) {
      const m = porSemana.get(s);
      d[s] = {
        objetivo: m?.objetivo ?? "",
        reflexao: m?.reflexao ?? "",
        resultado: m?.resultado ?? "",
      };
    }
    setDrafts(d);
  }, [porSemana]);

  const mut = useMutation({
    mutationFn: (d: any) => salvar({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      toast.success("Meta salva!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Metas da semana" />
      <div className="bg-primary px-4 pb-4 pt-2 text-white">
        <div className="text-2xl font-bold">Metas & reflexões</div>
        <div className="mt-1 text-sm opacity-90">Semana atual: {semanaAtual} de 8</div>
      </div>

      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => {
          const d = drafts[s] ?? { objetivo: "", reflexao: "", resultado: "" };
          const saved = porSemana.get(s);
          const changed =
            d.objetivo !== (saved?.objetivo ?? "") ||
            d.reflexao !== (saved?.reflexao ?? "") ||
            d.resultado !== (saved?.resultado ?? "");
          const atual = s === semanaAtual;
          return (
            <Card key={s} className={atual ? "border-primary" : ""}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Semana {s}</div>
                  {atual && <Badge className="bg-primary text-white">Atual</Badge>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Objetivo: o que quero alcançar
                  </label>
                  <Textarea
                    rows={2}
                    value={d.objetivo}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s]: { ...d, objetivo: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Reflexão: o que aprendi
                  </label>
                  <Textarea
                    rows={2}
                    value={d.reflexao}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s]: { ...d, reflexao: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Resultado: o que de fato aconteceu
                  </label>
                  <Textarea
                    rows={2}
                    value={d.resultado}
                    onChange={(e) =>
                      setDrafts((p) => ({ ...p, [s]: { ...d, resultado: e.target.value } }))
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={!changed || mut.isPending}
                  onClick={() =>
                    mut.mutate({
                      semana: s,
                      objetivo: d.objetivo,
                      reflexao: d.reflexao,
                      resultado: d.resultado,
                    })
                  }
                >
                  Salvar semana {s}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}