## Objetivo

Na foto da equipe (seção "A jornada, semana a semana"), a parede azul ao fundo tem um logotipo vermelho fictício ("REAL Imóveis"). Trocar esse logo da parede pelo logotipo **RE/MAX Imóveis Única Escolha**.

## O que muda

1. **Edição da própria foto**
   - A imagem `src/assets/equipe.jpg` é editada por IA: o logo vermelho na parede azul do fundo é substituído pelo logotipo RE/MAX Única Escolha (balão vermelho/azul + "RE/MAX" + "Única Escolha"), respeitando perspectiva, iluminação e desfoque do fundo.
   - O restante da foto (pessoas, ambiente, enquadramento) permanece igual.

2. **Remoção da plaquinha sobreposta**
   - A "plaquinha" branca com o logo que foi colocada por cima da foto no passo anterior é removida, já que a marca passa a estar na própria parede.
   - O degradê escuro na base da foto também sai, pois não é mais necessário.

3. **Asset do logo**
   - O pointer `src/assets/remax-logo.png.asset.json` continua no projeto (usado como referência da marca) e pode ser reaproveitado depois no rodapé/cabeçalho, se você quiser.

## Detalhes técnicos

- Edição da imagem com a ferramenta de edição por IA, gravando sobre `src/assets/equipe.jpg` (mesmas dimensões).
- Alteração de marcação restrita à seção JORNADA em `src/routes/index.tsx`: volta a ser uma `<img>` simples dentro do painel arredondado.
- Nenhuma mudança em rotas autenticadas, banco ou lógica de negócio.

Observação: a geração por IA pode não reproduzir o logotipo com fidelidade tipográfica perfeita. Se o resultado não ficar bom, a alternativa é sobrepor o PNG oficial exatamente sobre a área da parede, com perspectiva simulada em CSS.