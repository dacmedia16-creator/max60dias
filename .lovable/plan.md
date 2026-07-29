## Objetivo

Repaginar a página inicial (`src/routes/index.tsx`) com um visual mais futurista e atraente, com fotos de pessoas (corretores/equipe) geradas por IA, mantendo a identidade RE/MAX Única Escolha (azul-marinho, vermelho, arte do banner).

## Imagens (geradas por IA)

Quatro imagens novas em `src/assets/`, em estilo fotográfico realista, iluminação azul/vermelha sutil combinando com a marca:

1. **Hero** — corretor(a) jovem sorrindo, celular na mão, ambiente urbano moderno com fachadas de vidro (usada como imagem principal ao lado do texto).
2. **Equipe** — grupo de 3–4 corretores em pé, ambiente de escritório contemporâneo (seção "A jornada").
3. **Gestor** — pessoa analisando um painel/dashboard em tela grande (seção do gestor).
4. **CTA** — corretor entregando chaves / apertando a mão de um cliente (faixa final antes do CTA).

## Visual futurista (nível 3 — moderno, sem exagero de neon)

- Fundo azul-marinho profundo com **grid sutil** e **halos de luz** vermelho/azul (radial gradients em CSS).
- Hero em duas colunas: à esquerda o título "Plano 60 Dias" com um leve efeito de brilho no vermelho; à direita a foto do corretor dentro de uma moldura de vidro (glass card com borda luminosa e cantos marcados).
- Cards dos pilares com **glassmorphism leve**: fundo translúcido, borda fina que acende em hover, ícone dentro de um badge com brilho.
- Números (35 / 280+ / 14 / 100%) em tipografia grande com gradiente vermelho→claro e linha luminosa embaixo.
- Timeline vertical/horizontal das semanas com nós que brilham, em vez de 4 cards soltos.
- Transições suaves de entrada por seção (fade + subida leve) e hover discreto nos cards.
- Divisores em linha vermelha fina com esmaecimento nas pontas.

## Estrutura da página (mantida, repaginada)

Barra fixa com "Entrar" → Hero com foto → Números → Pilares (6 cards glass) → Jornada em timeline com foto da equipe → Seção do gestor com foto do painel → Faixa CTA com foto → Rodapé.

## Detalhes técnicos

- Novos tokens em `src/styles.css`: superfície de vidro, borda luminosa, sombras/halos e gradiente de destaque — sem cores hardcoded nos componentes.
- Animações via CSS/Tailwind (`tw-animate-css` já instalado); sem novas dependências.
- Imagens geradas em `src/assets/` e importadas diretamente; a arte original do banner continua sendo usada na barra de topo/rodapé.
- Alterações restritas a `src/routes/index.tsx`, `src/styles.css` e novos assets. Nada de banco de dados, rotas autenticadas ou lógica de negócio.
