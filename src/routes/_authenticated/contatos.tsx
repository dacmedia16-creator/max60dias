import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listarContatos,
  criarContato,
  atualizarContato,
  apagarContato,
} from "@/lib/contatos.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { UserPlus, Phone, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/contatos")({
  ssr: false,
  component: ContatosPage,
});

const TIPOS = [
  { v: "cip", label: "CIP (conhecido)" },
  { v: "proprietario", label: "Proprietário" },
  { v: "fsbo", label: "FSBO (vende sozinho)" },
  { v: "comprador", label: "Comprador" },
  { v: "outro", label: "Outro" },
];
const STATUS = [
  { v: "novo", label: "Novo", cor: "bg-slate-500" },
  { v: "contatado", label: "Contatado", cor: "bg-blue-500" },
  { v: "visita", label: "Visita", cor: "bg-amber-500" },
  { v: "fechado", label: "Fechado", cor: "bg-green-600" },
  { v: "perdido", label: "Perdido", cor: "bg-red-500" },
];
const tipoLabel = (v: string) => TIPOS.find((t) => t.v === v)?.label ?? v;
const statusInfo = (v: string) => STATUS.find((s) => s.v === v) ?? STATUS[0];

function ContatosPage() {
  const qc = useQueryClient();
  const listar = useServerFn(listarContatos);
  const criar = useServerFn(criarContato);
  const atualizar = useServerFn(atualizarContato);
  const apagar = useServerFn(apagarContato);

  const q = useQuery({ queryKey: ["contatos"], queryFn: () => listar() });
  const contatos = q.data?.contatos ?? [];

  // formulário de cadastro rápido
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("cip");
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  // edição
  const [editando, setEditando] = useState<any | null>(null);

  const invalidar = () => {
    qc.invalidateQueries({ queryKey: ["contatos"] });
  };

  const criarMut = useMutation({
    mutationFn: (d: any) => criar({ data: d }),
    onSuccess: () => {
      invalidar();
      setNome("");
      setTelefone("");
      toast.success("Contato adicionado!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const atualizarMut = useMutation({
    mutationFn: (d: any) => atualizar({ data: d }),
    onSuccess: () => {
      invalidar();
      setEditando(null);
      toast.success("Contato atualizado!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const apagarMut = useMutation({
    mutationFn: (d: any) => apagar({ data: d }),
    onSuccess: () => {
      invalidar();
      setEditando(null);
      toast.success("Contato removido.");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtrados = useMemo(() => {
    return contatos.filter((c: any) => {
      const okBusca =
        !busca ||
        c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        c.telefone?.includes(busca);
      const okTipo = filtroTipo === "todos" || c.tipo === filtroTipo;
      return okBusca && okTipo;
    });
  }, [contatos, busca, filtroTipo]);

  const total = contatos.length;
  const porTipo = (t: string) => contatos.filter((c: any) => c.tipo === t).length;

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Meus contatos" />

      <div className="bg-primary px-4 pb-4 pt-2 text-white">
        <div className="text-2xl font-bold">{total} contatos</div>
        <div className="mt-1 text-sm opacity-90">
          CIPs: {porTipo("cip")} · Proprietários: {porTipo("proprietario")} · FSBO: {porTipo("fsbo")}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Cadastro rápido */}
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-primary">
              <UserPlus className="h-5 w-5" /> Adicionar contato
            </div>
            <div className="space-y-2">
              <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <Input
                placeholder="Telefone (opcional)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                inputMode="tel"
              />
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.v} value={t.v}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={!nome.trim() || criarMut.isPending}
                onClick={() => criarMut.mutate({ nome, telefone, tipo, status: "novo" })}
              >
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Busca + filtro */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {TIPOS.map((t) => (
                <SelectItem key={t.v} value={t.v}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista */}
        {q.isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhum contato ainda. Adicione o primeiro acima.
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map((c: any) => {
              const s = statusInfo(c.status);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setEditando({ ...c })}
                  className="w-full text-left"
                >
                  <Card className="hover:bg-muted">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{c.nome}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{tipoLabel(c.tipo)}</span>
                          {c.telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {c.telefone}
                            </span>
                          )}
                        </div>
                        {c.proximo_retorno && (
                          <div className="mt-0.5 text-xs text-amber-600">
                            Retornar em {c.proximo_retorno}
                          </div>
                        )}
                      </div>
                      <Badge className={`${s.cor} shrink-0 text-white`}>{s.label}</Badge>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Painel de edição */}
      <Sheet open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left">Editar contato</SheetTitle>
          </SheetHeader>
          {editando && (
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Nome"
                value={editando.nome ?? ""}
                onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
              />
              <Input
                placeholder="Telefone"
                value={editando.telefone ?? ""}
                onChange={(e) => setEditando({ ...editando, telefone: e.target.value })}
                inputMode="tel"
              />
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={editando.tipo}
                  onValueChange={(v) => setEditando({ ...editando, tipo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.v} value={t.v}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={editando.status}
                  onValueChange={(v) => setEditando({ ...editando, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS.map((s) => (
                      <SelectItem key={s.v} value={s.v}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Próximo retorno</label>
                <Input
                  type="date"
                  value={editando.proximo_retorno ?? ""}
                  onChange={(e) => setEditando({ ...editando, proximo_retorno: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Observações..."
                rows={3}
                value={editando.observacoes ?? ""}
                onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
              />
            </div>
          )}
          <SheetFooter className="mt-4 flex-row gap-2">
            <Button
              variant="outline"
              className="text-red-600"
              onClick={() => apagarMut.mutate({ id: editando.id })}
              disabled={apagarMut.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Apagar
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                atualizarMut.mutate({
                  id: editando.id,
                  nome: editando.nome,
                  telefone: editando.telefone,
                  tipo: editando.tipo,
                  status: editando.status,
                  observacoes: editando.observacoes,
                  proximo_retorno: editando.proximo_retorno || null,
                })
              }
              disabled={atualizarMut.isPending}
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
