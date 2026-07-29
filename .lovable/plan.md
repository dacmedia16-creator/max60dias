## Objetivo

A fanpage já existe em `/` (arquivo `src/routes/index.tsx`), mas hoje ela só usa a arte RE/MAX como fundo do hero com um véu escuro por cima — o resto da página é claro e genérico. O pedido é fazer a página **inspirada no layout do banner**: fundo azul-marinho profundo, curvas vermelha/azul, logo RE/MAX Única Escolha e tipografia forte em branco.

## O que muda

**1. Hero fiel ao banner**
- Arte usada em resolução plena, sem o véu escuro que apaga o visual — apenas um degradê lateral à esquerda para o texto ficar legível.
- Título "Plano 60 Dias" grande, em branco com destaque vermelho, alinhado à esquerda (a área livre do banner), deixando as curvas e o logo visíveis à direita.
- Botões "Entrar no app" (vermelho RE/MAX) e "Como funciona" (contorno branco).
- No celular: a arte vira faixa superior + bloco de texto abaixo, para nada ficar cortado.

**2. Página inteira em tema escuro RE/MAX**
- Fundo azul-marinho (mesma família do banner) em toda a página, em vez do fundo claro atual.
- Cards em azul levemente mais claro, com borda sutil e detalhe vermelho.
- Números (35 / 280+ / 14 / 100%) em destaque branco/vermelho sobre faixa escura.
- Linha vermelha fina como divisor entre seções, ecoando a linha horizontal do banner.

**3. Seções mantidas, com o novo visual**
Barra de topo fixa com "Entrar", Hero, Números, Pilares (6 cards), Jornada por semanas, Seção do gestor, CTA final e rodapé — mesma estrutura de conteúdo, repaginada.

**4. Detalhes de marca**
- Logo/arte do topo reaproveitada na barra fixa e no rodapé.
- Curva vermelho-azul reproduzida em CSS como elemento decorativo em uma ou duas seções, para a identidade não viver só no hero.

## Detalhes técnicos

- Nova imagem enviada será publicada via `lovable-assets` e substituirá/complementará `src/assets/remax-hero.png.asset.json`.
- Alterações concentradas em `src/routes/index.tsx`; tokens escuros adicionais (superfícies e curva) entram em `src/styles.css` como variáveis semânticas — sem cores hardcoded nos componentes.
- Nenhuma mudança em rotas autenticadas, banco de dados ou lógica de negócio.
