import { createFileRoute, Link } from "@tanstack/react-router";
import bannerAsset from "@/assets/remax-banner.png.asset.json";
import remaxLogoUeAsset from "@/assets/remax-logo-ue-01.png.asset.json";
import heroCorretor from "@/assets/hero-corretor.jpg";
import equipeFoto from "@/assets/equipe.jpg";
import gestorFoto from "@/assets/gestor.jpg";
import chavesFoto from "@/assets/chaves.jpg";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Users,
  MessageSquareText,
  BookOpen,
  Map,
  LineChart,
  Target,
  ShieldCheck,
  Sparkles,
  ArrowRight,
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

const SEMANAS = [
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
];

const GESTOR_ITENS = [
  { icon: Target, t: "Status por cor", d: "Verde, amarelo e vermelho por corretor." },
  { icon: LineChart, t: "Média da equipe", d: "Percentual de execução consolidado." },
  { icon: ShieldCheck, t: "Conteúdo editável", d: "Vídeos, guias, scripts e cartilha." },
];

function SobrePage() {
  return (
    <main className="min-h-screen bg-brand-navy text-brand-ink">
      {/* BARRA DE TOPO */}
      <header className="sticky top-0 z-50 border-b border-brand-line/40 bg-brand-navy-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="p-1">
            <img
              src={remaxLogoUeAsset.url}
              alt="RE/MAX Única Escolha"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>
          <Link to="/auth">
            <Button size="sm" className="font-semibold">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-brand-navy-deep">
        <div className="pointer-events-none absolute inset-0 brand-grid" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-secondary/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-24 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-ink">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              RE/MAX Única Escolha
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              Plano <span className="brand-gradient-text">60 Dias</span>
            </h1>
            <div className="mt-6 brand-rule w-48" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-ink-muted sm:text-lg">
              Os primeiros 35 dias úteis definem a carreira de um corretor. Aqui eles
              deixam de ser um caderno de tarefas e viram uma jornada de execução no
              celular — com acompanhamento do gestor em tempo real.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="group font-semibold">
                  Entrar no app
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#pilares">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-ink/30 bg-transparent font-semibold text-brand-ink hover:bg-brand-ink/10 hover:text-brand-ink"
                >
                  Como funciona
                </Button>
              </a>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-secondary/40 blur-2xl" />
            <div className="brand-panel overflow-hidden rounded-[1.75rem] border border-brand-ink/15 brand-glass-card">
              <img
                src={heroCorretor}
                alt="Corretora RE/MAX usando o app Plano 60 Dias no celular"
                width={1024}
                height={1280}
                className="h-[26rem] w-full object-cover object-top sm:h-[34rem]"
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-brand-ink/15 bg-brand-navy-deep/80 p-4 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.2em] text-brand-ink-muted">
                Dia 12 de 35
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-ink/15">
                <div className="h-full w-[34%] rounded-full bg-primary" />
              </div>
              <div className="mt-2 text-sm font-semibold">Rotina do dia concluída</div>
            </div>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="relative border-y border-brand-line/40 bg-brand-navy-deep">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          {NUMEROS.map((n) => (
            <div key={n.rotulo}>
              <div className="brand-gradient-text text-4xl font-black sm:text-5xl">{n.valor}</div>
              <div className="mt-2 brand-rule w-10" />
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-ink-muted">
                {n.rotulo}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            O que o corretor encontra no app
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-brand-ink-muted sm:text-base">
            Tudo o que antes estava espalhado em documentos, planilhas e conversas
            soltas, reunido em uma rotina única.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILARES.map((p) => (
              <div key={p.titulo} className="brand-glass-card rounded-2xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-base font-semibold">{p.titulo}</div>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-muted">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JORNADA */}
      <section className="border-y border-brand-line/40 bg-brand-navy-deep">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-secondary/40 to-primary/25 blur-2xl" />
            <img
              src={equipeFoto}
              alt="Equipe de corretores RE/MAX Única Escolha no escritório"
              loading="lazy"
              width={1280}
              height={960}
              className="brand-panel h-72 w-full rounded-3xl border border-brand-ink/15 object-cover sm:h-96"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A jornada, semana a semana
            </h2>
            <ol className="mt-8 space-y-6 border-l border-brand-line/50 pl-6">
              {SEMANAS.map((b) => (
                <li key={b.s} className="relative">
                  <span className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {b.s}
                  </div>
                  <div className="mt-1 text-lg font-bold">{b.t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-brand-ink-muted">{b.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* GESTOR */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[130px]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Para o gestor: visibilidade sem cobrança no escuro
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-ink-muted sm:text-base">
              Cada relatório diário enviado pelo corretor alimenta o painel do gestor.
              Dá para ver quem está em dia, quem está em risco e onde entrar para
              ajudar — antes da desistência acontecer.
            </p>
            <div className="mt-8 space-y-3">
              {GESTOR_ITENS.map((i) => (
                <div key={i.t} className="brand-glass-card flex items-start gap-3 rounded-xl p-4">
                  <i.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{i.t}</div>
                    <div className="text-sm text-brand-ink-muted">{i.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-bl from-primary/30 to-secondary/30 blur-2xl" />
            <img
              src={gestorFoto}
              alt="Gestor acompanhando o painel de desempenho dos corretores"
              loading="lazy"
              width={1280}
              height={960}
              className="brand-panel h-72 w-full rounded-3xl border border-brand-ink/15 object-cover sm:h-[26rem]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-primary/50">
        <img
          src={chavesFoto}
          alt="Corretor entregando as chaves para um casal de clientes"
          loading="lazy"
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep via-brand-navy-deep/90 to-brand-navy-deep/60" />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
            Pronto para começar seus 35 dias?
          </h2>
          <p className="mt-4 max-w-lg text-sm text-brand-ink-muted sm:text-base">
            O acesso é criado pelo seu gestor. Já tem login? É só entrar.
          </p>
          <Link to="/auth" className="mt-8 inline-block">
            <Button size="lg" className="group font-semibold">
              Acessar o Plano 60 Dias
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-line/40 bg-brand-navy py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
          <img
            src={bannerAsset.url}
            alt="RE/MAX Única Escolha"
            loading="lazy"
            className="h-14 w-full max-w-md rounded-xl object-cover object-right opacity-80"
          />
          <p className="text-xs text-brand-ink-muted">
            RE/MAX Única Escolha · Plano 60 Dias
          </p>
        </div>
      </footer>
    </main>
  );
}
