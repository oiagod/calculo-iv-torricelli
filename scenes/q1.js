// Questão 1 — Cilindro
// Mesmo formato de scenes/q2.js: enunciado (HTML), nota (opcional) e passos da apresentação.
// Ações: graphStage, seek, highlight (destaca o tanque e o furo), run (roda até o fim; speed opcional).

export default {
  enunciado: String.raw`
    <p><b>(a)</b> Suponha que o tanque seja cilíndrico com altura igual a <b>2 m</b> e raio igual a <b>1 m</b> e que
    o buraco seja um círculo com raio igual a <b>2 cm</b>. Se tomarmos $g = 10\ \text{m/s}^2$, mostre que $h$
    satisfaz a equação diferencial
    $$\frac{dh}{dt} = -0{,}0004\sqrt{20h}$$</p>
    <p><b>(b)</b> Resolva esta equação para encontrar a altura da água no instante $t$, supondo que o tanque esteja
    cheio em $t = 0$.</p>
    <p><b>(c)</b> Quanto tempo iria demorar para o tanque ficar completamente vazio?</p>`,
  nota: null,

  passos: [
    {
      titulo: 'Dados',
      tex: [String.raw`R = 1\ \text{m} \qquad h_0 = 2\ \text{m} \qquad g = 10\ \text{m/s}^2`,
            String.raw`r_{\text{furo}} = 2\ \text{cm} = 0{,}02\ \text{m}`],
      action: { type: 'highlight', target: 'furo' },
    },
    {
      titulo: 'Áreas',
      tex: [String.raw`V = \pi R^2 h = \pi h \;\Rightarrow\; A = \pi`,
            String.raw`a = \pi\,(0{,}02)^2 = 0{,}0004\,\pi`],
    },
    {
      titulo: 'Torricelli',
      tex: [String.raw`\pi\,\dfrac{dh}{dt} = -0{,}0004\,\pi\sqrt{20h}`,
            String.raw`\Longrightarrow\quad \dfrac{dh}{dt} = -0{,}0004\sqrt{20h} \qquad \text{(a)}`],
      texto: 'dV/dt = A·dh/dt e √(2gh) = √(20h) com g = 10.',
    },
    {
      titulo: 'Separar',
      tex: [String.raw`\dfrac{dh}{\sqrt{h}} = -0{,}0004\sqrt{20}\;dt`],
    },
    {
      titulo: 'Integrar',
      tex: [String.raw`2\sqrt{h} = -0{,}0004\sqrt{20}\;t + C`,
            String.raw`h(0) = 2 \;\Rightarrow\; C = 2\sqrt{2}`],
    },
    {
      titulo: 'Solução',
      tex: [String.raw`h(t) = \left(\sqrt{2} - 0{,}0002\sqrt{20}\;t\right)^{2} \qquad \text{(b)}`],
    },
    {
      titulo: 'Tempo para esvaziar',
      tex: [String.raw`h(T) = 0 \;\Rightarrow\; T = \dfrac{\sqrt{2}}{0{,}0002\sqrt{20}} = 500\sqrt{10}`,
            String.raw`T \approx 1581{,}14\ \text{s} \approx 26\ \text{min}\ 21\ \text{s} \qquad \text{(c)}`],
      action: { type: 'run', speed: 100 },
    },
  ],
};
