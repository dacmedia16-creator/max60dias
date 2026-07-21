// Conteúdo curto de ajuda do corretor. Usado na tela de boas-vindas e na aba Ajuda.
export type PassoAjuda = { titulo: string; texto: string; emoji: string };

export const PASSOS_AJUDA: PassoAjuda[] = [
  {
    emoji: "📅",
    titulo: "Comece pela aba Hoje",
    texto:
      "Todo dia, abra a aba Hoje. Ali estão as tarefas do seu dia. Toque numa tarefa para ver o passo a passo de como fazer, e marque conforme for concluindo. No fim do dia, envie o relatório — é só um toque, e seu gestor acompanha seu progresso.",
  },
  {
    emoji: "👥",
    titulo: "Cadastre seus contatos",
    texto:
      "Na aba Contatos você guarda todo mundo que conhece ou aborda: conhecidos, proprietários, compradores. Nada de Excel. Cadastre rápido pelo topo e depois atualize o status de cada um (novo, contatado, visita, fechado).",
  },
  {
    emoji: "💬",
    titulo: "Use os Scripts na hora de falar",
    texto:
      "Antes de ligar ou abordar alguém, abra a aba Scripts. Você tem os roteiros oficiais da RE/MAX prontos — agendar reunião, contornar objeção, fazer proposta. Copie com um toque ou personalize com o seu nome.",
  },
  {
    emoji: "📘",
    titulo: "Consulte a Cartilha e acompanhe sua Jornada",
    texto:
      "A aba Cartilha traz o material oficial da RE/MAX para consultar sempre que precisar. Já a aba Jornada mostra seu progresso ao longo dos 35 dias — dá para revisitar qualquer dia. Se ficar em dúvida, toque no (?) no topo para reabrir esta ajuda.",
  },
];