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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { diaAtualDoCorretor } from "@/lib/dias-uteis";
import { toast } from "sonner";
import { BookOpen, PlayCircle, CheckCircle2, HelpCircle, Minus, Plus } from "lucide-react";
import { findGuideForTask } from "@/lib/task-guides";
import { listarAcaoRua, salvarAcaoRua } from "@/lib/acao-rua.functions";
import { listarMetas, salvarMeta } from "@/lib/metas.functions";
import { BoasVindas } from "@/components/BoasVindas";

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
  const acaoFn = useServerFn(listarAcaoRua);
  const salvarAcao = useServerFn(salvarAcaoRua);
  const acaoQ = useQuery({ queryKey: ["acao-rua"], queryFn: () => acaoFn() });
  const metasFn = useServerFn(listarMetas);
  const salvarMetaFn = useServerFn(salvarMeta);
  const metasQ = useQuery({ queryKey: ["metas"], queryFn: () => metasFn() });

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

  const acaoDoDia = useMemo(
    () => ((acaoQ.data as any)?.registros ?? []).find((r: any) => r.dia === dia),
    [acaoQ.data, dia],
  );
  const [acao, setAcao] = useState({ cartoes: 0, flyers: 0, blocos: 0, sms: 0 });
  useEffect(() => {
    setAcao({
      cartoes: acaoDoDia?.cartoes ?? 0,
      flyers: acaoDoDia?.flyers ?? 0,
      blocos: acaoDoDia?.blocos ?? 0,
      sms: acaoDoDia?.sms ?? 0,
    });
  }, [acaoDoDia?.dia, acaoDoDia?.cartoes, acaoDoDia?.flyers, acaoDoDia?.blocos, acaoDoDia?.sms]);

  const acaoMut = useMutation({
    mutationFn: (d: any) => salvarAcao({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acao-rua"] }),
    onError: (e: any) => toast.error(e.message),
  });
  function ajustarAcao(campo: "cartoes" | "flyers" | "blocos" | "sms", delta: number) {
    const novo = { ...acao, [campo]: Math.max(0, acao[campo] + delta) };
    setAcao(novo);
    acaoMut.mutate({ dia, ...novo });
  }

  const progressoMap = useMemo(() => {
    const m = new Map<number, boolean>();
    (meusQ.data?.progress ?? []).forEach((p: any) => m.set(p.task_id, p.concluida));
    return m;
  }, [meusQ.data]);

  const feitas = tarefasDoDia.filter((t: any) => progressoMap.get(t.id)).length;
  const pct = tarefasDoDia.length ? Math.round((feitas / tarefasDoDia.length) * 100) : 0;
  const pctTotal = Math.round(((dia - 1 + pct / 100) / 35) * 100);

  const semanaAtual = Math.max(1, Math.min(8, Math.ceil(dia / 5)));
  const metaAtual = useMemo(
    () => ((metasQ.data as any)?.metas ?? []).find((m: any) => m.semana === semanaAtual),
    [metasQ.data, semanaAtual],
  );
  const [meta, setMeta] = useState({ objetivo: "", reflexao: "", resultado: "" });
  useEffect(() => {
    setMeta({
      objetivo: metaAtual?.objetivo ?? "",
      reflexao: metaAtual?.reflexao ?? "",
      resultado: metaAtual?.resultado ?? "",
    });
  }, [metaAtual?.semana, metaAtual?.objetivo, metaAtual?.reflexao, metaAtual?.resultado]);
  const metaChanged =
    meta.objetivo !== (metaAtual?.objetivo ?? "") ||
    meta.reflexao !== (metaAtual?.reflexao ?? "") ||
    meta.resultado !== (metaAtual?.resultado ?? "");
  const metaMut = useMutation({
    mutationFn: (d: any) => salvarMetaFn({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["metas"] });
      toast.success("Meta da semana salva!");
    },
    onError: (e: any) => toast.error(e.message),
  });

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
      <BoasVindas open={meusQ.data?.profile?.onboarding_ok === false} />
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
                const guide = findGuideForTask(t.descricao, planoQ.data?.guides);
                return (
                  <li key={t.id} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted">
                    <Checkbox
                      className="mt-0.5 h-5 w-5"
                      checked={done}
                      onCheckedChange={(v) => toggleMut.mutate({ taskId: t.id, concluida: !!v })}
                    />
                    <span className={`flex-1 ${done ? "line-through text-muted-foreground" : ""}`}>{t.descricao}</span>
                    {guide && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <button
                            type="button"
                            aria-label="Como fazer esta tarefa"
                            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
                          >
                            <HelpCircle className="h-5 w-5" />
                          </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle className="text-left">{guide.rotulo}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed">
                            {guide.guia}
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
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

        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="font-semibold">Metas da semana {semanaAtual}</div>
            <div>
              <label className="text-xs text-muted-foreground">Objetivo: o que quero alcançar</label>
              <Textarea
                rows={2}
                value={meta.objetivo}
                onChange={(e) => setMeta((p) => ({ ...p, objetivo: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Reflexão: o que aprendi</label>
              <Textarea
                rows={2}
                value={meta.reflexao}
                onChange={(e) => setMeta((p) => ({ ...p, reflexao: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Resultado: o que de fato aconteceu</label>
              <Textarea
                rows={2}
                value={meta.resultado}
                onChange={(e) => setMeta((p) => ({ ...p, resultado: e.target.value }))}
              />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={!metaChanged || metaMut.isPending}
              onClick={() => metaMut.mutate({ semana: semanaAtual, ...meta })}
            >
              Salvar meta da semana
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 font-semibold">Ação de rua de hoje</div>
            <div className="grid grid-cols-2 gap-3">
              {([
                ["cartoes", "Cartões"],
                ["flyers", "Flyers"],
                ["blocos", "Blocos"],
                ["sms", "SMS"],
              ] as const).map(([campo, label]) => (
                <div key={campo} className="rounded-md border p-2">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => ajustarAcao(campo, -1)}
                      disabled={acao[campo] <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="text-xl font-bold tabular-nums">{acao[campo]}</div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => ajustarAcao(campo, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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