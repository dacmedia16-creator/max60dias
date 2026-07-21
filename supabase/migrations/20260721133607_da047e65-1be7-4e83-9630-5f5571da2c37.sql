
CREATE TABLE IF NOT EXISTS public.cartilha_secoes (
  id SERIAL PRIMARY KEY,
  ordem INT NOT NULL DEFAULT 100,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL
);
GRANT SELECT, UPDATE ON public.cartilha_secoes TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.cartilha_secoes_id_seq TO authenticated;
GRANT ALL ON public.cartilha_secoes TO service_role;
GRANT ALL ON SEQUENCE public.cartilha_secoes_id_seq TO service_role;
ALTER TABLE public.cartilha_secoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cartilha_select ON public.cartilha_secoes;
CREATE POLICY cartilha_select ON public.cartilha_secoes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS cartilha_update_gestor ON public.cartilha_secoes;
CREATE POLICY cartilha_update_gestor ON public.cartilha_secoes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'gestor')) WITH CHECK (public.has_role(auth.uid(), 'gestor'));

DELETE FROM public.cartilha_secoes;
INSERT INTO public.cartilha_secoes (ordem, titulo, conteudo) VALUES
  (1, 'Missão, Visão e Valores', 'Ser líder mundial no mercado imobiliário, atingindo nossos objetivos ao ajudar outras pessoas a atingirem os delas. Na RE/MAX todos ganham.

NOSSA VISÃO
Ser líder absoluta no segmento de transações imobiliárias no Brasil, sendo considerada a empresa mais ética do mercado imobiliário nacional e o sistema de franquias mais rentável do país.

VALORES E PRINCÍPIOS
- Ética — é inegociável
- Comprometimento — sem medir esforços
- Resiliência — desistir não é uma opção
- Parceria — todos ganham mais
- Foco — só no que importa
- Aprendizado — quanto mais você aprende e aplica, mais você ganha
- Excelência — o que merece ser feito, merece ser bem feito

O QUE VOCÊ PODE ESPERAR DA RE/MAX?
Treinamentos constantes; a força e o respeito de uma marca de quase 50 anos; relacionamento com mais de 7.000 profissionais no Brasil; parcerias de negócios; ética; melhores práticas do mercado imobiliário mundial; a melhor franquia do Brasil; direcionamento.

O QUE ESPERAMOS DE VOCÊ?
Ética • Comprometimento • Buscar aprender e aplicar o modelo RE/MAX • Comparecer aos treinamentos • Sempre buscar aprimoramento • Humanidade • Parceria • Leveza • Cooperação • Transparência • Honestidade • Compromisso com o cliente • Disciplina • Entender quais comportamentos você precisa ter para obter resultado.'),
  (2, 'Um mercado de relações, não só de transações', 'Corretores enfrentam uma falta de credibilidade grande junto à população que quer vender ou comprar imóveis, por causa do comportamento de certos profissionais que apenas transacionaram no passado.

A RE/MAX te convida a pensar: em vez de transacionar, se relacione. Se o cliente acreditar que você tem real interesse em ajudá-lo (e você tiver de fato), esse é o verdadeiro papel do(a) corretor(a): entender o cliente e ajudá-lo com alto nível profissional a resolver um problema ou realizar um sonho.

A maioria dos clientes vem por indicação: um cliente bem atendido indica outro, e assim você monta uma carteira de relacionamentos — e nunca fica sem vender. A carreira do corretor de sucesso é feita de relações, não de transações.

Vender um imóvel gera uma comissão alta; o esforço para fazer isso bem deve estar à altura.'),
  (3, 'Marketing pessoal', 'Marketing pessoal é a estratégia para fortalecer seu nome e sua imagem, tornando-o referência e autoridade no segmento onde atua. Ações constantes influenciam outras pessoas na hora de contratar você.

Explore suas habilidades e experiências, faça networking e promova sua atuação em vários canais off-line e online, para ser o primeiro nome que vem à cabeça do cliente quando ele pensa em comprar ou vender um imóvel.

Objetivos: ser conhecido, ser referência das melhores práticas, ser especialista, ser lembrado por um trabalho de excelência, transmitir segurança e credibilidade.'),
  (4, 'Sua imagem e apresentação pessoal', 'Como você imagina que um médico deve estar vestido numa consulta? Roupas brancas, jaleco, aparência de cuidado. E o(a) corretor(a) num atendimento?

- Escolha roupas e sapatos formais e confortáveis.
- Cuide da higiene pessoal — leve uma nécessaire (escova de dentes, creme dental, desodorante, escova de cabelo, lenço umedecido).
- Evite roupas muito apertadas ou chamativas, decotes, saias muito curtas e acessórios que distraiam. O foco do cliente deve ser sua fala e seu conteúdo.
- Não seja um agente secreto: use sempre o pin da RE/MAX e o crachá de identificação. O pin é um ótimo gatilho para iniciar conversas sobre o mercado.

Sua imagem aparece em: dossiê do corretor, folder, cartão de visita, crachá, placa, outdoor, folder/panfleto de posicionamento, jogo americano, plotagem do carro etc.'),
  (5, 'O Dossiê do Corretor', 'O Dossiê é sua apresentação comercial: torna palpável o serviço prestado e gera credibilidade e autoridade, fechando mais negócios.

Nele você conta seu currículo, mostra sua forma de trabalho, compartilha resultados atingidos, certificações, treinamentos realizados e todo o seu diferencial no mercado.

Folder do corretor (versão mais compacta):
- Capa
- §1 Mini currículo
- §2 Reconhecimentos nacionais e internacionais
- §3 Porque RE/MAX
- §4 RE/MAX no mundo
- §5 RE/MAX no Brasil
- §6 Sua unidade
- Contracapa: seus contatos (não esqueça!)

Outros materiais: cartão de visita, crachá, placa, outdoor, folder/panfleto de posicionamento, jogo americano, plotagem em carro.'),
  (6, 'Posicionamento e parcerias na região', 'Quem não é visto não é lembrado. Distribua constantemente materiais impressos na sua região de posicionamento, com a sua imagem, e agregue valor ao seu trabalho.

Faça parcerias com estabelecimentos da região: restaurantes, salões de beleza, academias, oficinas de carro, padarias, pet shops e outros comércios. Isso amplia seu alcance e reforça sua presença local.'),
  (7, 'Presença digital e redes sociais', 'Plataformas para estar presente: site RE/MAX, Instagram, WhatsApp, TikTok, Facebook. Use nome, telefone e perfil profissional consistentes em todos os canais.

Construa relacionamentos constantemente:
- Participe de eventos presenciais e online, dentro e fora do mercado imobiliário.
- Conecte-se com corretores da rede RE/MAX e de fora.
- Faça parcerias com lojas de móveis, escritórios de arquitetura, designers de interiores etc.

Lembre dos clientes que já atendeu: faça uma lista, use o CRM, mantenha comunicação. Invista em brindes (álcool em gel, kit de colorir para crianças, chaveiros, aromatizadores, presentes personalizados). Clientes importantes precisam de atenção contínua — eles ou conhecidos deles vão precisar dos seus serviços de novo.'),
  (8, 'O Funil de Vendas RE/MAX', 'ETAPAS DO FUNIL
Contatos → Ligações → 1ª visita (rapport) → 2ª visita (apresentação + assinatura do contrato de representação) → Execução do Máximo Serviço → Venda.

CONTATOS
A etapa mais importante do funil. Para quantas pessoas você está apresentando o seu serviço por semana? Contatos podem ser ligações ou uma conversa em qualquer lugar — o importante é que seja uma possibilidade comercial (marcar visita a um imóvel que precise ser bem atendido por um corretor RE/MAX).
Taxa mínima de conversão: 20%.

1ª VISITA (CRIANDO RELACIONAMENTO)
Conheça o proprietário + o imóvel, e deixe o proprietário te conhecer. Mais importante que os detalhes do imóvel é entender as expectativas e os porquês da venda. Criar conexão facilita a apresentação da sua proposta. Não saia sem a próxima reunião marcada e sem "conhecer" seu cliente.
Taxa mínima de conversão: 50%.

2ª VISITA
Apresentação da proposta de trabalho e assinatura do contrato de representação (autorização de venda RE/MAX). A partir daí, começa a execução do Máximo Serviço até a venda.');
