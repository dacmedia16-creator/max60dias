import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppHeader({ title, gestor = false }: { title: string; gestor?: boolean }) {
  const navigate = useNavigate();
  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <header
      className={
        "sticky top-0 z-40 flex items-center justify-between px-4 py-3 text-white shadow-md " +
        (gestor ? "bg-secondary" : "bg-primary")
      }
    >
      <Link to={gestor ? "/gestor" : "/hoje"} className="flex items-center gap-2 font-bold">
        <span className="text-xl font-black tracking-tight">
          <span className="opacity-90">RE/</span>
          <span>MAX</span>
        </span>
        <span className="hidden text-sm font-medium opacity-90 sm:inline">· {title}</span>
      </Link>
      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={sair}>
        <LogOut className="mr-1 h-4 w-4" /> Sair
      </Button>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 grid grid-cols-5 border-t bg-card">
      {[
        { to: "/hoje", label: "Hoje" },
        { to: "/contatos", label: "Contatos" },
        { to: "/scripts", label: "Scripts" },
        { to: "/metas", label: "Metas" },
        { to: "/jornada", label: "Jornada" },
      ].map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className="py-3 text-center text-xs font-medium text-muted-foreground"
          activeProps={{ className: "py-3 text-center text-xs font-semibold text-primary" }}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
