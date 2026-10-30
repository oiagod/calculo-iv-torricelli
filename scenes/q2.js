// Questão 2 — Garrafa: água × óleo
// Texto do enunciado (HTML) e passos da apresentação. Fórmulas em LaTeX (KaTeX).
// No enunciado (e na nota), fórmulas entre $…$ (no meio do texto) ou $$…$$ (em destaque).
// Cada passo: { titulo, tex: [até 3 linhas], texto (opcional, 1 frase), action (opcional) }
// Ações disponíveis:
//   { type: 'graphStage', stage: 1|2|3 }   abre o gráfico ampliado na etapa indicada
//   { type: 'seek', t: 68 }                pula a simulação para o tempo t (s)
//   { type: 'highlight', target: 'furo' }  destaca algo na cena 3D (se a cena suportar)
// O último passo é sempre exibido como o resultado (cartão em destaque).

export default {
  enunciado: String.raw`
    <p>O modelo teórico dado pela Equação 1 não é muito preciso, se levarmos em conta a rotação e viscosidade do
    líquido. Em vez disso, o modelo
    $$\frac{dh}{dt} = k\sqrt{h} \tag{2}$$
    é em geral usado e a constante $k$ (que depende das propriedades físicas do líquido) é determinada a partir dos
    dados relacionados com o vazamento do tanque.</p>
    <p><b>(a)</b> Suponha que o buraco esteja posicionado na lateral de uma garrafa e que a altura $h$ da água (acima
    do buraco) decresça de <b>10 cm</b> para <b>3 cm</b> em <b>68 segundos</b>. Use a Equação 2 para encontrar uma
    expressão para $h(t)$. Avalie $h(t)$ para $t = 10,\ 20,\ 30,\ 40,\ 50,\ 60$.</p>
    <p><b>(b)</b> Perfure um buraco de <b>4 mm</b> perto do fundo de uma garrafa plástica de um refrigerante de
    <b>2 litros</b>. Faça marcas de <b>0 a 10</b>, com “0” correspondendo ao topo do buraco. Com um dedo tampando o
    buraco, encha a garrafa com água até a marca de <b>10 cm</b>. Tire seu dedo do buraco e registre os valores de
    $h(t)$ para $t = 10,\ 20,\ 30,\ 40,\ 50,\ 60$ segundos. (Provavelmente, você vai descobrir que demorará cerca de
    68 segundos para o nível chegar a $h = 3$ cm.) Compare seus dados com os valores de $h(t)$ da parte (a). Quão bem
    o modelo previu os valores reais?</p>`,
  nota: 'Nosso grupo repetiu o ensaio (b) com água e com óleo de cozinha.',

  passos: [
    {
      titulo: 'Modelo',
      tex: [String.raw`\dfrac{dh}{dt} = k\sqrt{h}`],
      texto: 'A velocidade de descida depende só da altura h acima do furo; k vem dos dados.',
    },
    {
      titulo: 'Separar e integrar',
      tex: [String.raw`\int h^{-1/2}\,dh = k\int dt`, String.raw`\Longrightarrow\quad 2\sqrt{h} = kt + C`],
      texto: 'A equação é separável: h de um lado, t do outro.',
    },
    {
      titulo: 'Condição inicial h(0) = 10',
      tex: [String.raw`C = 2\sqrt{10}`, String.raw`\Longrightarrow\quad \sqrt{h} = \sqrt{10} + \tfrac{k}{2}\,t`],
    },
    {
      titulo: 'Dado h(68) = 3',
      tex: [String.raw`\sqrt{3} = \sqrt{10} + 34k`, String.raw`k = \dfrac{\sqrt{3}-\sqrt{10}}{34} \approx -0{,}0421`],
    },
    {
      titulo: 'Resultado do livro',
      tex: [
        String.raw`h(t) = \left(\sqrt{10} - \dfrac{\sqrt{10}-\sqrt{3}}{68}\,t\right)^{2}`,
        String.raw`\begin{array}{c|cccccc} t\ (\text{s}) & 10 & 20 & 30 & 40 & 50 & 60 \\ \hline h\ (\text{cm}) & 8{,}71 & 7{,}52 & 6{,}41 & 5{,}39 & 4{,}45 & 3{,}61 \end{array}`,
      ],
    },
    {
      titulo: 'Nosso ensaio',
      tex: [
        String.raw`k = \dfrac{2\,(\sqrt{3}-\sqrt{10})}{t_{10\to 3}}`,
        String.raw`\text{água: } t = 64{,}4\ \text{s} \;\Rightarrow\; k \approx -0{,}0444`,
        String.raw`\text{óleo: } t = 77{,}4\ \text{s} \;\Rightarrow\; k \approx -0{,}0370`,
      ],
      texto: 'Mesma conta, trocando 68 s pelos tempos medidos no vídeo de 10 cm até 3 cm.',
    },
    {
      titulo: 'Experimento validado',
      tex: [String.raw`k_{\text{água}} \approx k_{\text{livro}} \qquad |k_{\text{óleo}}| \approx 0{,}83\,|k_{\text{água}}|`],
      texto: 'Água ≈ livro → experimento validado. Óleo: |k| ~17% menor → esvazia mais devagar.',
      action: { type: 'graphStage', stage: 2 },
    },
  ],
};
