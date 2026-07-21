import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCartilha } from "@/lib/cartilha.functions";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cartilha")({
  ssr: false,
  component: CartilhaPage,
});

function CartilhaPage() {
  const get = useServerFn(getCartilha);
  const q = useQuery({ queryKey: ["cartilha"], queryFn: () => get() });
  const secoes = (q.data as any)?.secoes ?? [];
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Cartilha" />
      <div className="bg-primary px-4 pb-4 pt-2 text-white">
        <div className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="h-5 w-5" /> Cartilha do Corretor RE/MAX
        </div>
        <div className="mt-1 text-sm opacity-90">
          Guia oficial de consulta rápida. Toque num tema para abrir.
        </div>
      </div>

      <div className="space-y-2 p-4">
        {q.isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando...</div>
        ) : (
          secoes.map((s: any) => {
            const open = aberta === s.id;
            return (
              <Card key={s.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => setAberta(open ? null : s.id)}
                >
                  <span className="font-semibold">{s.titulo}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {s.conteudo}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}