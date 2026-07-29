## Plano: Logo grande no cabeçalho da fanpage

### Contexto
O usuário selecionou o elemento de texto do cabeçalho da landing page (`/`) que atualmente exibe "RE/MAX Plano 60 Dias" e pediu para colocar o logo grande. A imagem do logo RE/MAX Única Escolha já foi enviada e já existe um asset pointer em `src/assets/remax-logo.png.asset.json`.

### O que será feito
1. Substituir o texto estático do cabeçalho (`src/routes/index.tsx`, linhas 118-123) por uma imagem que carrega o logo RE/MAX Única Escolha a partir do asset pointer existente.
2. Aplicar altura apropriada para que o logo fique "grande" e visível no cabeçalho (ex: `h-10` ou `h-12` em mobile, maior em desktop se necessário).
3. Manter o link/estrutura do cabeçalho e o botão "Entrar" ao lado.
4. Garantir que a imagem tenha `alt` descritivo e seja responsiva.

### Arquivos alterados
- `src/routes/index.tsx` — substituir o `<span>` do logo por `<img src={remaxLogoAsset.url} alt="RE/MAX Única Escolha" className="..." />` e importar o asset pointer.

### Não alterar
- Nenhuma outra página ou componente fora do cabeçalho da fanpage.
- Nenhuma lógica de autenticação, roteamento ou banco de dados.