Substituir o logo atual do cabeçalho da fanpage (`/`) pelo novo logo enviado (`RMX_Logo_2026_UE-01.png`), mantendo o mesmo estilo e tamanho.

### Passos
1. Criar um asset da Lovable CDN a partir do upload `/mnt/user-uploads/RMX_Logo_2026_UE-01.png` e salvá-lo como `src/assets/remax-logo-ue-01.png.asset.json`.
2. Atualizar `src/routes/index.tsx` para importar o novo asset e usá-lo na tag `<img>` do logo no cabeçalho (linha ~119), mantendo o fundo claro (`bg-brand-ink`) e o tamanho responsivo (`h-10 sm:h-12`).
3. Executar `tsgo --noEmit` (ou `bun run build`) para garantir que a alteração compila corretamente.

### Detalhes técnicos
- O logo atual é renderizado dentro de uma `div` com `bg-brand-ink` para contrastar com o fundo azul-marinho do header.
- A imagem enviada tem fundo preto, então a placa clara de contraste continuará sendo usada.
- O asset anterior (`remax-logo.png.asset.json`) permanece intacto, caso seja usado em outro lugar.