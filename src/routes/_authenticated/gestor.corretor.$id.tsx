import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { detalheCorretor, getPlanoCompleto } from "@/lib/plano.functions";
import { contatosDoCorretor } from "@/lib/contatos.functions";
import { scriptsDoCorretor } from "@/lib/scripts.functions";
import { metasDoCorretor } from "@/lib/metas.functions";
import { acaoRuaDoCorretor } from "@/lib/acao-rua.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const contatosFn = useServerFn(contatosDoCorretor);
  const scriptsFn = useServerFn(scriptsDoCorretor);
  const metasFn = useServerFn(metasDoCorretor);
  const acaoFn = useServerFn(acaoRuaDoCorretor);
  const detQ = useQuery({ queryKey: ["gestor-det", id], queryFn: () => det({ data: { userId: id } }) });
  const planoQ = useQuery({ queryKey: ["plano"], queryFn: () => plano() });
  const contatosQ = useQuery({
    queryKey: ["gestor-contatos", id],
    queryFn: () => contatosFn({ data: { userId: id } }),
  });
  const scriptsQ = useQuery({
    queryKey: ["gestor-scripts", id],
    queryFn: () => scriptsFn({ data: { userId: id } }),
  });
  const metasQ = useQuery({
    queryKey: ["gestor-metas", id],
    queryFn: () => metasFn({ data: { userId: id } }),
  });
  const acaoQ = useQuery({
    queryKey: ["gestor-acao", id],
    queryFn: () => acaoFn({ data: { userId: id } }),
  });
  const contatos = (contatosQ.data as any)?.contatos ?? [];
  const scripts = (scriptsQ.data as any)?.scripts ?? [];
  const metas = (metasQ.data as any)?.metas ?? [];
  const acao = (acaoQ.data as any)?.registros ?? [];

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

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">Contatos cadastrados</div>
            <div className="text-sm text-muted-foreground">{contatos.length} no total</div>
          </div>
          {contatos.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum contato cadastrado ainda.</div>
          ) : (
            <div className="space-y-2">
              {contatos.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.nome}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.tipo}{c.telefone ? ` · ${c.telefone}` : ""}
                      {c.proximo_retorno ? ` · retornar ${c.proximo_retorno}` : ""}
                    </div>
                    {c.observacoes && (
                      <div className="mt-0.5 text-xs text-muted-foreground">{c.observacoes}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0">{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 font-semibold">Scripts do corretor</div>
          {scripts.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum script próprio.</div>
          ) : (
            <div className="space-y-2">
              {scripts.map((s: any) => (
                <div key={s.id} className="rounded-md border p-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{s.titulo}</div>
                    <Badge variant="outline" className="shrink-0">{s.categoria}</Badge>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">
                    {s.conteudo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 font-semibold">Metas & reflexões</div>
          {metas.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhuma meta registrada.</div>
          ) : (
            <div className="space-y-2">
              {metas.map((m: any) => (
                <div key={m.id} className="rounded-md border p-2 text-sm">
                  <div className="font-medium">Semana {m.semana}</div>
                  {m.objetivo && <div className="mt-1"><span className="text-xs text-muted-foreground">Objetivo: </span>{m.objetivo}</div>}
                  {m.reflexao && <div className="mt-1"><span className="text-xs text-muted-foreground">Reflexão: </span>{m.reflexao}</div>}
                  {m.resultado && <div className="mt-1"><span className="text-xs text-muted-foreground">Resultado: </span>{m.resultado}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 font-semibold">Ação de rua</div>
          {acao.length === 0 ? (
            <div className="text-sm text-muted-foreground">Sem registros.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="py-1 text-left">Dia</th>
                  <th className="py-1 text-right">Cartões</th>
                  <th className="py-1 text-right">Flyers</th>
                  <th className="py-1 text-right">Blocos</th>
                  <th className="py-1 text-right">SMS</th>
                </tr>
              </thead>
              <tbody>
                {acao.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-1">Dia {r.dia}</td>
                    <td className="py-1 text-right tabular-nums">{r.cartoes}</td>
                    <td className="py-1 text-right tabular-nums">{r.flyers}</td>
                    <td className="py-1 text-right tabular-nums">{r.blocos}</td>
                    <td className="py-1 text-right tabular-nums">{r.sms}</td>
                  </tr>
                ))}
                <tr className="border-t font-semibold">
                  <td className="py-1">Total</td>
                  <td className="py-1 text-right tabular-nums">{acao.reduce((s: number, r: any) => s + r.cartoes, 0)}</td>
                  <td className="py-1 text-right tabular-nums">{acao.reduce((s: number, r: any) => s + r.flyers, 0)}</td>
                  <td className="py-1 text-right tabular-nums">{acao.reduce((s: number, r: any) => s + r.blocos, 0)}</td>
                  <td className="py-1 text-right tabular-nums">{acao.reduce((s: number, r: any) => s + r.sms, 0)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

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