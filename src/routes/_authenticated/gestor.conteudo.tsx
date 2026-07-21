import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { atualizarVideoDia, getPlanoCompleto } from "@/lib/plano.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/gestor/conteudo")({
  ssr: false,
  component: Conteudo,
});

function Conteudo() {
  const qc = useQueryClient();
  const getPlano = useServerFn(getPlanoCompleto);
  const salvar = useServerFn(atualizarVideoDia);
  const q = useQuery({ queryKey: ["plano"], queryFn: () => getPlano() });
  const [urls, setUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    if (q.data) {
      const m: Record<number, string> = {};
      ((q.data as any).dias ?? []).forEach((d: any) => (m[d.dia] = d.video_url ?? ""));
      setUrls(m);
    }
  }, [q.data]);

  const mut = useMutation({
    mutationFn: (v: { dia: number; videoUrl: string }) => salvar({ data: v }),
    onSuccess: () => { toast.success("Vídeo salvo"); qc.invalidateQueries({ queryKey: ["plano"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Cole a URL de um vídeo próprio da agência para aparecer como botão "assistir vídeo" no card de capacitação do corretor.</p>
      {(((q.data as any)?.dias) ?? []).map((d: any) => (
        <Card key={d.dia}>
          <CardContent className="flex flex-wrap items-center gap-3 p-3">
            <div className="w-40 shrink-0">
              <div className="text-xs text-muted-foreground">Dia {d.dia} · Sem {d.semana}</div>
              <div className="text-sm font-medium">{d.capitulo}</div>
            </div>
            <Input className="min-w-[240px] flex-1" placeholder="https://..." value={urls[d.dia] ?? ""} onChange={(e) => setUrls((u) => ({ ...u, [d.dia]: e.target.value }))} />
            <Button size="sm" variant="secondary" onClick={() => mut.mutate({ dia: d.dia, videoUrl: urls[d.dia] ?? "" })}>Salvar</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}