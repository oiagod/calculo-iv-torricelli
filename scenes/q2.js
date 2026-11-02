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

  // aba "Por que parou?": o fim do ensaio com água. Cartões revelados um a um (↓ ↑); fórmulas entre $…$ ou $$…$$.
  // pelicula: true põe no cartão a ilustração da película na boca do furo (empurra × segura).
  parou: {
    video: {
      src: './media/agua_furo_para.mp4',
      caption: 'Final do ensaio com água. Velocidade indicada no canto do vídeo; a ruptura do filete está em câmera lenta.',
    },
    cartoes: [
      {
        titulo: 'O que vimos',
        html: String.raw`<p class="sub">t contado desde os 10 cm</p>
          <ul class="tl">
            <li><b>até ~115 s</b>: escoando pela parede;</li>
            <li><b>~115 a 212 s</b>: um filete fino ainda escorre, com o nível quase parado na altura do furo;</li>
            <li><b>~212 a 214 s</b>: o filete se rompe e sai a última gota;</li>
            <li><b>a partir de ~214 s</b>: não sai mais nada.</li>
          </ul>`,
      },
      {
        titulo: 'Por que vira um filete',
        html: String.raw`<p>Com pouca pressão, a água sai devagar demais para formar um jato livre: ela gruda no plástico e
          escorre pela parede. É o mesmo “efeito bule” do chá que escorre pelo bico.</p>`,
      },
      {
        titulo: 'Por que o filete se rompe',
        html: String.raw`<p>Quando a vazão fica pequena demais, a tensão superficial puxa o filete fino até ele se partir
          numa gota, como o fio fino de uma torneira que vira gotas.</p>`,
      },
      {
        titulo: 'Por que não sai mais nada',
        html: String.raw`<p>O que empurra é a coluna de água acima do furo:</p>
          $$P_{\text{empurra}} = \rho\,g\,h \approx 10\ \text{Pa por milímetro de água}$$
          <p>O que segura é a película curva na boca do furo (equação de Young-Laplace):</p>
          $$P_{\text{segura}} \approx \frac{2\gamma}{r}$$
          <p>Água: $\gamma \approx 0{,}072$ N/m; furo de ~4 mm ($r \approx 2$ mm):</p>
          $$\frac{2\cdot 0{,}072}{0{,}002} \approx 72\ \text{Pa} \;\approx\; 7\ \text{mm de água}$$
          <p>Com o nível a poucos milímetros do furo, o empurrão não vence a película.</p>`,
        pelicula: true,
      },
      {
        titulo: 'Ressalva',
        html: String.raw`<p>$2\gamma/r$ é um teto: a película não forma uma meia-esfera perfeita, e o plástico influencia.
          A conta acerta a ordem de grandeza (milímetros), não o número exato.</p>`,
      },
      {
        titulo: 'Limite do modelo',
        html: String.raw`<p>A Lei de Torricelli não inclui tensão superficial nem a aderência da água ao plástico, por isso
          prevê que a água sai até $h = 0$. Na prática, sobram alguns milímetros: como a viscosidade no óleo, é um efeito
          que o modelo ignora.</p>`,
      },
    ],
  },

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
