import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { detalheCorretor, getPlanoCompleto } from "@/lib/plano.functions";
import { Card, CardContent } from "@/components/ui/card";
import { diaAtualDoCorretor } from "@/lib/dias-uteis";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gestor/corretor/$id")({
  ssr: false,
  component: Detalhe,
});

function Detalhe() {
  const { id } = Route.useParams();
  const det = useServerFn(detalheCorretor);
  const plano = useServerFn(getPlanoCompleto);
  const detQ = useQuery({ queryKey: ["gestor-det", id], queryFn: () => det({ data: { userId: id } }) });
  const planoQ = useQuery({ queryKey: ["plano"], queryFn: () => plano() });

  const dias = (planoQ.data as any)?.dias ?? [];
  const tarefas = (planoQ.data as any)?.tarefas ?? [];
  const progresso = useMemo(() => {
    const m = new Map<number, boolean>();
    ((detQ.data as any)?.progress ?? []).forEach((p: any) => m.set(p.task_id, p.concluida));
    return m;
  }, [detQ.data]);
  const reports = (detQ.data as any)?.reports ?? [];

  if (!detQ.data) return <div className="p-6 text-muted-foreground">Carregando...</div>;
  const p = (detQ.data as any).profile;
  const diaAtual = diaAtualDoCorretor(p?.data_inicio ?? null);

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4">
        <div className="text-lg font-bold">{p?.nome || p?.email}</div>
        <div className="text-sm text-muted-foreground">{p?.email}</div>
        <div className="mt-1 text-sm">Dia atual: <span className="font-semibold">{diaAtual}/35</span> · início {p?.data_inicio ?? "—"}</div>
      </CardContent></Card>

      <div className="space-y-3">
        {dias.map((d: any) => {
          const tds = tarefas.filter((t: any) => t.dia === d.dia);
          const feitas = tds.filter((t: any) => progresso.get(t.id)).length;
          const rep = reports.find((r: any) => r.dia === d.dia);
          return (
            <Card key={d.dia}>
              <CardContent className="p-4">
                <div className="flex items-baseline justify-between">
                  <div className="font-semibold">Dia {d.dia} · Semana {d.semana}</div>
                  <div className="text-sm text-muted-foreground">{feitas}/{tds.length} tarefas</div>
                </div>
                <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                  {tds.map((t: any) => {
                    const done = progresso.get(t.id);
                    return (
                      <div key={t.id} className="flex items-start gap-2">
                        {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> : <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />}
                        <span className={done ? "line-through text-muted-foreground" : ""}>{t.descricao}</span>
                      </div>
                    );
                  })}
                </div>
                {rep && (
                  <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                    <div className="font-medium">Relatório · {rep.pct_concluido}% · capítulo {rep.capitulo_lido ? "lido" : "não lido"}{rep.auto_avaliacao ? ` · auto-avaliação ${rep.auto_avaliacao}/10` : ""}</div>
                    {rep.notas && <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{rep.notas}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}