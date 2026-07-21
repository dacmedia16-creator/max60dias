export type TaskGuide = {
  id: number;
  padrao: string;
  ordem: number;
  rotulo: string;
  guia: string;
};

// Encontra o guia que melhor descreve a tarefa: menor `ordem` cujo
// `padrao` esteja contido (case-insensitive) na descrição. Para tarefas
// de estudo/leitura de capítulo, usa o padrão especial `_estudo`.
export function findGuideForTask(
  descricao: string,
  guides: TaskGuide[] | undefined | null,
): TaskGuide | null {
  if (!guides || guides.length === 0) return null;
  const desc = (descricao ?? "").toLowerCase();
  const sorted = [...guides].sort((a, b) => a.ordem - b.ordem);
  for (const g of sorted) {
    if (g.padrao === "_estudo") continue;
    if (desc.includes(g.padrao.toLowerCase())) return g;
  }
  if (/(capítulo|capitulo|estud|ler\s)/i.test(desc)) {
    return sorted.find((g) => g.padrao === "_estudo") ?? null;
  }
  return null;
}