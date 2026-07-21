import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getMeusDados,
  getPlanoCompleto,
  salvarRelatorio,
  toggleTarefa,
} from "@/lib/plano.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { diaAtualDoCorretor } from "@/lib/dias-uteis";
import { toast } from "sonner";
import { BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hoje")({
  ssr: false,
  component: HojePage,
});

function HojePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getPlano = useServerFn(getPlanoCompleto);
  const getMeus = useServerFn(getMeusDados);
  const toggle = useServerFn(toggleTarefa);
  const salvar = useServerFn(salvarRelatorio);

  const planoQ = useQuery({ queryKey: ["plano"], queryFn: () => getPlano() });
  const meusQ = useQuery({ queryKey: ["meus"], queryFn: () => getMeus() });

  useEffect(() => {
    if (meusQ.data?.isGestor && !meusQ.data.isCorretor) navigate({ to: "/gestor" });
  }, [meusQ.data, navigate]);

  const dia = useMemo(
    () => diaAtualDoCorretor(meusQ.data?.profile?.data_inicio ?? null),
    [meusQ.data?.profile?.data_inicio],
  );

  const tarefasDoDia = useMemo(
    () => (planoQ.data?.tarefas ?? []).filter((t: any) => t.dia === dia),
    [planoQ.data, dia],
  );
  const diaInfo = useMemo(
    () => planoQ.data?.dias.find((d: any) => d.dia === dia),
    [planoQ.data, dia],
  );
  const relatorio = useMemo(
    () => (meusQ.data?.reports ?? []).find((r: any) => r.dia === dia),
    [meusQ.data, dia],
  );

  const progressoMap = useMemo(() => {
    const m = new Map<number, boolean>();
    (meusQ.data?.progress ?? []).forEach((p: any) => m.set(p.task_id, p.concluida));
    return m;
  }, [meusQ.data]);

  const feitas = tarefasDoDia.filter((t: any) => progressoMap.get(t.id)).length;
  const pct = tarefasDoDia.length ? Math.round((feitas / tarefasDoDia.length) * 100) : 0;
  const pctTotal = Math.round(((dia - 1 + pct / 100) / 35) * 100);

  const [notas, setNotas] = useState("");
  const [capituloLido, setCapituloLido] = useState(false);
  const [autoAval, setAutoAval] = useState<number>(7);

  useEffect(() => {
    setNotas(relatorio?.notas ?? "");
    setCapituloLido(!!relatorio?.capitulo_lido);
    setAutoAval(relatorio?.auto_avaliacao ?? 7);
  }, [relatorio?.dia]);

  const toggleMut = useMutation({
    mutationFn: (v: { taskId: number; concluida: boolean }) => toggle({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meus"] }),
  });

  const salvarMut = useMutation({
    mutationFn: (data: any) => salvar({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus"] });
      toast.success("Relatório enviado!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (planoQ.isLoading || meusQ.isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  }

  const ehFimDeSemana = tarefasDoDia.length > 0 && (dia % 5 === 0 || dia === 35);

  return (
    <div className="flex min-h-screen flex-col bg-muted pb-2">
      <AppHeader title="Plano 60 Dias" />

      <div className="bg-primary px-4 pb-5 pt-2 text-white">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">Dia {dia} de 35</div>
          <div className="text-lg font-semibold">{pctTotal}%</div>
        </div>
        <Progress value={pctTotal} className="mt-2 bg-white/20" />
        {diaInfo && (
          <div className="mt-3">
            <div className="text-sm font-semibold uppercase tracking-wide opacity-90">
              Semana {diaInfo.semana} · {diaInfo.semana_titulo}
            </div>
            {diaInfo.semana_frase && (
              <div className="mt-1 text-sm italic opacity-90">"{diaInfo.semana_frase}"</div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        {diaInfo?.capitulo && (
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <BookOpen className="h-4 w-4" /> Capacitação de hoje
              </div>
              <div className="font-semibold">{diaInfo.capitulo}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Livro "Caminho para o Sucesso" — Mônica Silva
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <Checkbox checked={capituloLido} onCheckedChange={(v) => setCapituloLido(!!v)} />
                Li o capítulo
              </label>
              {diaInfo.video_url && (
                <a href={diaInfo.video_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex">
                  <Button variant="secondary" size="sm">
                    <PlayCircle className="mr-1 h-4 w-4" /> Assistir vídeo
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Tarefas do dia</div>
              <div className="text-sm text-muted-foreground">
                {feitas}/{tarefasDoDia.length} · {pct}%
              </div>
            </div>
            <ul className="space-y-3">
              {tarefasDoDia.map((t: any) => {
                const done = progressoMap.get(t.id) ?? false;
                return (
                  <li key={t.id} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted">
                    <Checkbox
                      className="mt-0.5 h-5 w-5"
                      checked={done}
                      onCheckedChange={(v) => toggleMut.mutate({ taskId: t.id, concluida: !!v })}
                    />
                    <span className={done ? "line-through text-muted-foreground" : ""}>{t.descricao}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 font-semibold">Suas notas / maiores dificuldades</div>
            <Textarea
              placeholder="Conte aqui o que travou ou o que precisa de apoio..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {ehFimDeSemana && (
          <Card className="border-secondary/40">
            <CardContent className="p-4">
              <div className="mb-2 font-semibold">Auto-avaliação da semana</div>
              <div className="mb-4 text-sm text-muted-foreground">De 1 (péssima) a 10 (excelente)</div>
              <Slider min={1} max={10} step={1} value={[autoAval]} onValueChange={(v) => setAutoAval(v[0])} />
              <div className="mt-2 text-right text-lg font-semibold text-secondary">{autoAval}/10</div>
            </CardContent>
          </Card>
        )}

        <Button
          className="h-12 w-full text-base"
          onClick={() =>
            salvarMut.mutate({
              dia,
              pct_concluido: pct,
              capitulo_lido: capituloLido,
              notas,
              auto_avaliacao: ehFimDeSemana ? autoAval : null,
            })
          }
          disabled={salvarMut.isPending}
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {relatorio ? "Atualizar relatório do dia" : "Enviar relatório do dia"}
        </Button>
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}