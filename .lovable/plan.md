## Substituir scripts modelo pelos 14 scripts oficiais da Cartilha RE/MAX v2.0

Rodar uma única migration que:

1. `DELETE FROM public.scripts_modelo` — remove os 6 seeds antigos.
2. `INSERT` dos 14 scripts oficiais (categorias `reuniao`, `comprador`, `fechamento`) com `ordem` de 1 a 14, exatamente como enviado.

Nada de código muda — a tela `/scripts` (corretor) e `/gestor/scripts` (gestor) já leem de `scripts_modelo` e continuam funcionando. As categorias novas (`reuniao`, `comprador`, `fechamento`) aparecem automaticamente agrupadas; o `catLabel` cai no fallback (mostra o valor cru) para categorias fora da lista atual.

### Ajuste opcional (incluído)
Adicionar `reuniao`, `comprador` e `fechamento` ao array `CATEGORIAS` em `src/routes/_authenticated/scripts.tsx` para que apareçam com rótulos "Reunião", "Comprador", "Fechamento" nos badges/agrupamentos e no seletor do editor.

### Fora de escopo
Scripts próprios já criados pelos corretores (`scripts_corretor`) não são tocados.
