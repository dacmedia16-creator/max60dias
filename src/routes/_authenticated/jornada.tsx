import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMeusDados, getPlanoCompleto } from "@/lib/plano.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { diaAtualDoCorretor } from "@/lib/dias-uteis";

export const Route = createFileRoute("/_authenticated/jornada")({
  ssr: false,
  component: JornadaPage,
});

function JornadaPage() {
  const getPlano = useServerFn(getPlanoCompleto);
  const getMeus = useServerFn(getMeusDados);
  const planoQ = useQuery({ queryKey: ["plano"], queryFn: () => getPlano() });
  const meusQ = useQuery({ queryKey: ["meus"], queryFn: () => getMeus() });

  const diaAtual = diaAtualDoCorretor(meusQ.data?.profile?.data_inicio ?? null);

  const semanas = useMemo(() => {
    const dias = planoQ.data?.dias ?? [];
    const tarefas = planoQ.data?.tarefas ?? [];
    const progress = new Map<number, boolean>(
      (meusQ.data?.progress ?? []).map((p: any) => [p.task_id, p.concluida]),
    );
    const bySem = new Map<number, { titulo: string; frase: string | null; dias: number[] }>();
    dias.forEach((d: any) => {
      const s = bySem.get(d.semana) ?? { titulo: d.semana_titulo, frase: d.semana_frase, dias: [] };
      s.dias.push(d.dia);
      bySem.set(d.semana, s);
    });
    return Array.from(bySem.entries())
      .sort(([a], [b]) => a - b)
      .map(([sem, info]) => {
        const totalTasks = tarefas.filter((t: any) => info.dias.includes(t.dia));
        const feitas = totalTasks.filter((t: any) => progress.get(t.id)).length;
        const pct = totalTasks.length ? Math.round((feitas / totalTasks.length) * 100) : 0;
        return { sem, ...info, pct };
      });
  }, [planoQ.data, meusQ.data]);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Minha jornada" />
      <div className="space-y-3 p-4">
        <div className="text-sm text-muted-foreground">Você está no dia {diaAtual} de 35.</div>
        {semanas.map((s) => (
          <Card key={s.sem}>
            <CardContent className="p-4">
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">
                  Semana {s.sem} · {s.titulo}
                </div>
                <div className="text-sm font-semibold text-primary">{s.pct}%</div>
              </div>
              {s.frase && <div className="mt-1 text-xs italic text-muted-foreground">"{s.frase}"</div>}
              <Progress value={s.pct} className="mt-3" />
              <div className="mt-2 flex flex-wrap gap-1">
                {(planoQ.data?.dias ?? [])
                  .filter((d: any) => d.semana === s.sem)
                  .map((d: any) => (
                    <Link
                      key={d.dia}
                      to="/dia/$dia"
                      params={{ dia: String(d.dia) }}
                      className={
                        "rounded-md border px-2 py-1 text-xs " +
                        (d.dia === diaAtual
                          ? "border-primary bg-primary text-primary-foreground"
                          : d.dia < diaAtual
                            ? "border-secondary/40 bg-secondary/10 text-secondary"
                            : "border-muted-foreground/20 text-muted-foreground")
                      }
                    >
                      Dia {d.dia}
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}