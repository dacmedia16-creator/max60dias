import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/gestor")({
  ssr: false,
  component: GestorLayout,
});

function GestorLayout() {
  return (
    <div className="min-h-screen bg-muted">
      <AppHeader title="Painel do gestor" gestor />
      <nav className="border-b bg-card px-4">
        <div className="mx-auto flex max-w-6xl gap-4 py-2 text-sm">
          <Link
            to="/gestor"
            className="text-muted-foreground hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Corretores
          </Link>
          <Link
            to="/gestor/novo"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Cadastrar corretor
          </Link>
          <Link
            to="/gestor/conteudo"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Vídeos do plano
          </Link>
          <Link
            to="/gestor/guias"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Guias das tarefas
          </Link>
          <Link
            to="/gestor/scripts"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Scripts modelo
          </Link>
          <Link
            to="/gestor/cartilha"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: "font-semibold text-secondary" }}
          >
            Cartilha
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl p-4">
        <Outlet />
      </div>
    </div>
  );
}