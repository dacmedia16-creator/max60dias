## Objetivo

Colocar o logo **RE/MAX Imóveis Única Escolha** (arquivo enviado) sobre a foto selecionada — a foto da equipe, na seção "A jornada, semana a semana" em `src/routes/index.tsx` (linha 241).

## O que muda

1. **Logo publicado como asset**
   - O PNG enviado vira um asset de CDN (`src/assets/remax-logo.png.asset.json`) via `lovable-assets`, sem deixar o binário no repositório.

2. **Logo aplicado sobre a foto da equipe**
   - A foto ganha um contêiner com o logo sobreposto, no canto inferior esquerdo da imagem.
   - Como o logo é azul-marinho sobre fundo transparente/branco, ele fica dentro de uma "plaquinha" clara com cantos arredondados e leve desfoque de fundo (mesma linguagem de vidro já usada na página), garantindo contraste e legibilidade sobre a foto escura.
   - Um degradê sutil escurecendo a base da foto reforça a leitura do logo.

3. **Responsivo**
   - No celular o logo aparece menor e proporcional, mantendo margem segura em relação às bordas da imagem.

## Detalhes técnicos

- Alteração isolada em `src/routes/index.tsx`: a `<img>` da equipe passa a ficar dentro de um wrapper `relative`, com o logo em `absolute` e `alt` descritivo.
- Nenhuma cor hardcoded — usa os tokens/utilitários de marca já existentes em `src/styles.css`.
- Nenhuma mudança em rotas autenticadas, banco ou lógica de negócio.

Se preferir o logo em outro ponto (centralizado, canto superior direito, ou como marca-d'água grande e translúcida ao fundo da foto), é só dizer que eu ajusto antes de implementar.