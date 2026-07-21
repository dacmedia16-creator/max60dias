import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMeusDados, getPlanoCompleto } from "@/lib/plano.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dia/$dia")({
  ssr: false,
  component: DiaPage,
});

function DiaPage() {
  const { dia: diaParam } = Route.useParams();
  const dia = Number(diaParam);
  const getPlano = useServerFn(getPlanoCompleto);
  const getMeus = useServerFn(getMeusDados);
  const planoQ = useQuery({ queryKey: ["plano"], queryFn: () => getPlano() });
  const meusQ = useQuery({ queryKey: ["meus"], queryFn: () => getMeus() });

  const diaInfo = planoQ.data?.dias.find((d: any) => d.dia === dia);
  const tarefas = (planoQ.data?.tarefas ?? []).filter((t: any) => t.dia === dia);
  const progresso = useMemo(() => {
    const m = new Map<number, boolean>();
    (meusQ.data?.progress ?? []).forEach((p: any) => m.set(p.task_id, p.concluida));
    return m;
  }, [meusQ.data]);
  const relatorio = (meusQ.data?.reports ?? []).find((r: any) => r.dia === dia);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title={`Dia ${dia}`} />
      <div className="space-y-4 p-4">
        <Link to="/jornada" className="text-sm text-primary hover:underline">← Voltar à jornada</Link>
        {diaInfo && (
          <Card>
            <CardContent className="p-4">
              <div className="text-xs font-semibold uppercase text-secondary">
                Semana {diaInfo.semana} · {diaInfo.semana_titulo}
              </div>
              <div className="mt-2 font-semibold">Capacitação: {diaInfo.capitulo}</div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 font-semibold">Tarefas</div>
            <ul className="space-y-2 text-sm">
              {tarefas.map((t: any) => {
                const done = progresso.get(t.id);
                return (
                  <li key={t.id} className="flex items-start gap-2">
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={done ? "line-through text-muted-foreground" : ""}>{t.descricao}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        {relatorio && (
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 font-semibold">Relatório enviado</div>
              <div className="text-sm text-muted-foreground">
                {relatorio.pct_concluido}% · Capítulo {relatorio.capitulo_lido ? "lido" : "não lido"}
              </div>
              {relatorio.notas && <p className="mt-2 whitespace-pre-wrap text-sm">{relatorio.notas}</p>}
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}