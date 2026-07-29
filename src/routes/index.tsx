import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/remax-hero.png.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  Users,
  MessageSquareText,
  BookOpen,
  Map,
  LineChart,
  Target,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plano 60 Dias | RE/MAX Única Escolha" },
      {
        name: "description",
        content:
          "Conheça o Plano 60 Dias da RE/MAX Única Escolha: 35 dias úteis de execução guiada que transformam novos corretores em profissionais produtivos.",
      },
      { property: "og:title", content: "Plano 60 Dias | RE/MAX Única Escolha" },
      {
        property: "og:description",
        content:
          "35 dias úteis de rotina guiada, scripts oficiais, base de contatos e acompanhamento do gestor em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SobrePage,
});

const PILARES = [
  {
    icon: CalendarCheck,
    titulo: "Rotina diária",
    texto: "Cada dia útil tem tarefas claras, com passo a passo de como executar.",
  },
  {
    icon: MessageSquareText,
    titulo: "Scripts oficiais",
    texto: "Os 14 roteiros da Cartilha RE/MAX v2.0 prontos para usar na abordagem.",
  },
  {
    icon: Users,
    titulo: "Base de contatos",
    texto: "Chega de planilha: contatos, status e retornos organizados no celular.",
  },
  {
    icon: BookOpen,
    titulo: "Cartilha completa",
    texto: "Material oficial de consulta sempre à mão, direto no bolso do corretor.",
  },
  {
    icon: Map,
    titulo: "Jornada visível",
    texto: "Progresso dos 35 dias em um mapa simples, dia a dia, semana a semana.",
  },
  {
    icon: LineChart,
    titulo: "Gestor em tempo real",
    texto: "Relatórios diários alimentam o painel do gestor automaticamente.",
  },
];

const NUMEROS = [
  { valor: "35", rotulo: "dias úteis de plano" },
  { valor: "280+", rotulo: "tarefas guiadas" },
  { valor: "14", rotulo: "scripts oficiais" },
  { valor: "100%", rotulo: "no celular" },
];

function SobrePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroAsset.url}
          alt="Identidade visual RE/MAX Única Escolha"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/80" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            RE/MAX Única Escolha
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Plano <span className="text-primary">60 Dias</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Os primeiros 35 dias úteis definem a carreira de um corretor. Aqui eles
            deixam de ser um caderno de tarefas e viram uma jornada de execução no
            celular — com acompanhamento do gestor em tempo real.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth">
              <Button size="lg" className="font-semibold">
                Entrar no app
              </Button>
            </Link>
            <a href="#pilares">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                Como funciona
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {NUMEROS.map((n) => (
            <div key={n.rotulo}>
              <div className="text-3xl font-black text-primary sm:text-4xl">{n.valor}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {n.rotulo}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          O que o corretor encontra no app
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Tudo o que antes estava espalhado em documentos, planilhas e conversas
          soltas, reunido em uma rotina única.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILARES.map((p) => (
            <Card key={p.titulo} className="border-border/70">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold">{p.titulo}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* JORNADA */}
      <section className="bg-muted">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">A jornada, semana a semana</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                s: "Semanas 1–2",
                t: "Fundamentos",
                d: "Posicionamento, mercado de relações, cadastro dos primeiros contatos e primeiras abordagens com script.",
              },
              {
                s: "Semanas 3–4",
                t: "Ação de rua",
                d: "Cartões, flyers, blocos e captações. Os contadores diários mostram o volume real de esforço.",
              },
              {
                s: "Semanas 5–6",
                t: "Captação e visitas",
                d: "Reuniões agendadas, apresentações de proposta e acompanhamento de proprietários e compradores.",
              },
              {
                s: "Semana 7",
                t: "Consistência",
                d: "Rotina estabilizada, metas próprias da semana e autoavaliação para consolidar o hábito.",
              },
            ].map((b) => (
              <Card key={b.s}>
                <CardContent className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">{b.s}</div>
                  <div className="mt-1 text-lg font-bold">{b.t}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GESTOR */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Para o gestor: visibilidade sem cobrança no escuro
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cada relatório diário enviado pelo corretor alimenta o painel do gestor.
              Dá para ver quem está em dia, quem está em risco e onde entrar para
              ajudar — antes da desistência acontecer.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Target, t: "Status por cor", d: "Verde, amarelo e vermelho por corretor." },
              { icon: LineChart, t: "Média da equipe", d: "Percentual de execução consolidado." },
              { icon: ShieldCheck, t: "Conteúdo editável", d: "Vídeos, guias, scripts e cartilha." },
            ].map((i) => (
              <div key={i.t} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <i.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{i.t}</div>
                  <div className="text-sm text-muted-foreground">{i.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pronto para começar seus 35 dias?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            O acesso é criado pelo seu gestor. Já tem login? É só entrar.
          </p>
          <Link to="/auth" className="mt-7 inline-block">
            <Button size="lg" className="font-semibold">
              Acessar o Plano 60 Dias
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t bg-card py-8 text-center text-xs text-muted-foreground">
        RE/MAX Única Escolha · Plano 60 Dias
      </footer>
    </main>
  );
}