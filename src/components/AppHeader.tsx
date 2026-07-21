import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, CalendarCheck, Users, MessageSquareText, BookOpen, Map } from "lucide-react";

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
      <div className="flex items-center gap-1">
        {!gestor && (
          <Link to="/ajuda">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" title="Ajuda">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={sair}>
          <LogOut className="mr-1 h-4 w-4" /> Sair
        </Button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const base = "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground";
  const active = { className: "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-primary" };
  return (
    <nav className="sticky bottom-0 z-40 grid grid-cols-5 border-t bg-card">
      <Link to="/hoje" className={base} activeProps={active}>
        <CalendarCheck className="h-5 w-5" /> Hoje
      </Link>
      <Link to="/contatos" className={base} activeProps={active}>
        <Users className="h-5 w-5" /> Contatos
      </Link>
      <Link to="/scripts" className={base} activeProps={active}>
        <MessageSquareText className="h-5 w-5" /> Scripts
      </Link>
      <Link to="/cartilha" className={base} activeProps={active}>
        <BookOpen className="h-5 w-5" /> Cartilha
      </Link>
      <Link to="/jornada" className={base} activeProps={active}>
        <Map className="h-5 w-5" /> Jornada
      </Link>
    </nav>
  );
}
