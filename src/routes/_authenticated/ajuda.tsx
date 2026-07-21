import { createFileRoute, Link } from "@tanstack/react-router";
import { PASSOS_AJUDA } from "@/lib/ajuda-conteudo";
import { AppHeader, BottomNav } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/ajuda")({
  ssr: false,
  component: AjudaPage,
});

function AjudaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <AppHeader title="Ajuda" />
      <div className="bg-primary px-4 pb-4 pt-2 text-white">
        <div className="text-lg font-bold">Como usar o app</div>
        <div className="mt-1 text-sm opacity-90">O essencial para você começar com o pé direito.</div>
      </div>

      <div className="space-y-3 p-4">
        {PASSOS_AJUDA.map((p, idx) => (
          <Card key={idx}>
            <CardContent className="flex gap-3 p-4">
              <div className="text-3xl">{p.emoji}</div>
              <div>
                <div className="font-semibold">{p.titulo}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-primary/30">
          <CardContent className="p-4 text-center text-sm">
            <p className="text-muted-foreground">
              Ficou com dúvida? Fale com seu gestor no briefing diário — ele está aqui para te ajudar.
            </p>
            <Link to="/hoje" className="mt-3 inline-block font-semibold text-primary">
              Voltar para o meu dia →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}