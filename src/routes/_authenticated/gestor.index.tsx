import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarCorretores } from "@/lib/plano.functions";
import { Card, CardContent } from "@/components/ui/card";
import { diaAtualDoCorretor, diasUteisEntre, statusPorDiasSemRelatorio } from "@/lib/dias-uteis";

export const Route = createFileRoute("/_authenticated/gestor/")({
  ssr: false,
  component: GestorHome,
});

function GestorHome() {
  const listar = useServerFn(listarCorretores);
  const q = useQuery({ queryKey: ["gestor-lista"], queryFn: () => listar() });

  const rows = useMemo(() => {
    if (!q.data) return [] as any[];
    const reports = (q.data as any).reports ?? [];
    return (q.data as any).corretores.map((c: any) => {
      const meusReports = reports.filter((r: any) => r.user_id === c.id);
      const ultimo = meusReports.sort((a: any, b: any) => (a.data < b.data ? 1 : -1))[0];
      const diaAtual = diaAtualDoCorretor(c.data_inicio);
      const pctMedio = meusReports.length
        ? Math.round(
            meusReports.reduce((s: number, r: any) => s + (r.pct_concluido ?? 0), 0) / meusReports.length,
          )
        : 0;
      const diasSem = ultimo ? diasUteisEntre(new Date(ultimo.data + "T00:00:00"), new Date()) - 1 : 999;
      const status = statusPorDiasSemRelatorio(Math.max(0, diasSem));
      return { ...c, diaAtual, pctMedio, ultimo: ultimo?.data ?? null, status };
    });
  }, [q.data]);

  const emRisco = rows.filter((r: any) => r.status === "vermelho").length;
  const pctTime = rows.length
    ? Math.round(rows.reduce((s: number, r: any) => s + r.pctMedio, 0) / rows.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">Corretores ativos</div><div className="text-3xl font-bold">{rows.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">Em risco de desistência</div><div className="text-3xl font-bold text-primary">{emRisco}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">% médio do time</div><div className="text-3xl font-bold text-secondary">{pctTime}%</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="text-left">
                <th className="p-3">Status</th>
                <th className="p-3">Corretor</th>
                <th className="p-3">Dia</th>
                <th className="p-3">% médio</th>
                <th className="p-3">Último relatório</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} className="border-b hover:bg-muted/30">
                  <td className="p-3">
                    <span className={"inline-block h-3 w-3 rounded-full " + (r.status === "verde" ? "bg-green-500" : r.status === "amarelo" ? "bg-yellow-500" : "bg-primary")} />
                  </td>
                  <td className="p-3 font-medium">
                    <Link to="/gestor/corretor/$id" params={{ id: r.id }} className="text-secondary hover:underline">
                      {r.nome || r.email}
                    </Link>
                  </td>
                  <td className="p-3">{r.diaAtual}/35</td>
                  <td className="p-3">{r.pctMedio}%</td>
                  <td className="p-3 text-muted-foreground">{r.ultimo ?? "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum corretor cadastrado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}