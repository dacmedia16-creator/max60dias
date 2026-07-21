import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listarScripts,
  salvarScriptCorretor,
  apagarScriptCorretor,
} from "@/lib/scripts.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Copy, Plus, Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/scripts")({
  ssr: false,
  component: ScriptsPage,
});

const CATEGORIAS = [
  { v: "cip", label: "CIP" },
  { v: "prospeccao", label: "Prospecção" },
  { v: "objecoes", label: "Objeções" },
  { v: "visita", label: "Visita" },
  { v: "outro", label: "Outro" },
];
const catLabel = (v: string) => CATEGORIAS.find((c) => c.v === v)?.label ?? v;

function ScriptsPage() {
  const qc = useQueryClient();
  const listar = useServerFn(listarScripts);
  const salvar = useServerFn(salvarScriptCorretor);
  const apagar = useServerFn(apagarScriptCorretor);

  const q = useQuery({ queryKey: ["scripts"], queryFn: () => listar() });
  const modelos = (q.data as any)?.modelos ?? [];
  const meus = (q.data as any)?.meus ?? [];

  const [editando, setEditando] = useState<any | null>(null);

  const abrirNovo = (base?: any) =>
    setEditando({
      id: null,
      categoria: base?.categoria ?? "prospeccao",
      titulo: base?.titulo ? `${base.titulo} (meu)` : "",
      conteudo: base?.conteudo ?? "",
    });

  const salvarMut = useMutation({
    mutationFn: (d: any) => salvar({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts"] });
      setEditando(null);
      toast.success("Script salvo!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const apagarMut = useMutation({
    mutationFn: (d: any) => apagar({ data: d }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts"] });
      setEditando(null);
      toast.success("Script removido.");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const meusPorCat = useMemo(() => {
    const m = new Map<string, any[]>();
    meus.forEach((s: any) => {
      if (!m.has(s.categoria)) m.set(s.categoria, []);
      m.get(s.categoria)!.push(s);
    });
    return m;
  }, [meus]);

  const modelosPorCat = useMemo(() => {
    const m = new Map<string, any[]>();
    modelos.forEach((s: any) => {
      if (!m.has(s.categoria)) m.set(s.categoria, []);
      m.get(s.categoria)!.push(s);
    });
    return m;
  }, [modelos]);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Scripts" />
      <div className="bg-primary px-4 pb-4 pt-2 text-white">
        <div className="text-2xl font-bold">Scripts</div>
        <div className="mt-1 text-sm opacity-90">
          Modelos da equipe + os seus próprios
        </div>
      </div>

      <div className="space-y-4 p-4">
        <Tabs defaultValue="modelos">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modelos">Modelos ({modelos.length})</TabsTrigger>
            <TabsTrigger value="meus">Meus scripts ({meus.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="modelos" className="mt-3 space-y-3">
            {[...modelosPorCat.entries()].map(([cat, lista]) => (
              <div key={cat} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {catLabel(cat)}
                </div>
                {lista.map((s: any) => (
                  <Card key={s.id}>
                    <CardContent className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold">{s.titulo}</div>
                        <Button size="sm" variant="secondary" onClick={() => abrirNovo(s)}>
                          <Copy className="mr-1 h-3 w-3" /> Copiar
                        </Button>
                      </div>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">
                        {s.conteudo}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
            {modelos.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nenhum script modelo cadastrado.
              </div>
            )}
          </TabsContent>

          <TabsContent value="meus" className="mt-3 space-y-3">
            <Button className="w-full" onClick={() => abrirNovo()}>
              <Plus className="mr-1 h-4 w-4" /> Novo script
            </Button>
            {[...meusPorCat.entries()].map(([cat, lista]) => (
              <div key={cat} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {catLabel(cat)}
                </div>
                {lista.map((s: any) => (
                  <Card key={s.id}>
                    <CardContent className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{s.titulo}</div>
                          <Badge variant="outline" className="mt-1">
                            {catLabel(s.categoria)}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setEditando({ ...s })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">
                        {s.conteudo}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
            {meus.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Você ainda não tem scripts próprios. Copie um modelo ou crie um novo.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left">
              {editando?.id ? "Editar script" : "Novo script"}
            </SheetTitle>
          </SheetHeader>
          {editando && (
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Título"
                value={editando.titulo ?? ""}
                onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
              />
              <Select
                value={editando.categoria}
                onValueChange={(v) => setEditando({ ...editando, categoria: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c.v} value={c.v}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                rows={10}
                placeholder="Conteúdo do script..."
                value={editando.conteudo ?? ""}
                onChange={(e) => setEditando({ ...editando, conteudo: e.target.value })}
              />
            </div>
          )}
          <SheetFooter className="mt-4 flex-row gap-2">
            {editando?.id && (
              <Button
                variant="outline"
                className="text-red-600"
                onClick={() => apagarMut.mutate({ id: editando.id })}
                disabled={apagarMut.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Apagar
              </Button>
            )}
            <Button
              className="flex-1"
              disabled={
                !editando?.titulo?.trim() || !editando?.conteudo?.trim() || salvarMut.isPending
              }
              onClick={() =>
                salvarMut.mutate({
                  id: editando.id ?? null,
                  categoria: editando.categoria,
                  titulo: editando.titulo,
                  conteudo: editando.conteudo,
                })
              }
            >
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}