// Utilidades para calcular dias úteis (segunda a sexta) sem contar fins de semana.

export function diasUteisEntre(inicio: Date, fim: Date): number {
  // Retorna quantos dias úteis se passaram desde `inicio` até `fim`, contando o próprio dia de início como 1.
  const start = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const end = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate());
  if (end < start) return 0;
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

export function diaAtualDoCorretor(dataInicio: string | null | undefined): number {
  if (!dataInicio) return 1;
  const inicio = new Date(dataInicio + "T00:00:00");
  const hoje = new Date();
  const d = diasUteisEntre(inicio, hoje);
  return Math.max(1, Math.min(35, d));
}

export function statusPorDiasSemRelatorio(dias: number): "verde" | "amarelo" | "vermelho" {
  if (dias <= 1) return "verde";
  if (dias === 2) return "amarelo";
  return "vermelho";
}
