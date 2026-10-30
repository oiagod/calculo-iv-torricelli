// Questão 4 — Esfera
// Mesmo formato de scenes/q2.js: enunciado (HTML), nota (opcional) e passos da apresentação.
// No enunciado, fórmulas entre $…$ (no meio do texto) ou $$…$$ (em destaque).
// Ações: { type: 'scene', pythagoras: true|false, animateH: [de, até], duration: ms } e run (speed opcional).

export default {
  enunciado: String.raw`
    <p>Nem todos os tanques têm a forma de cilindros. Suponha que um tanque tenha uma área transversal $A(h)$ na
    altura $h$. Então, o volume de água até a altura $h$ é $V = \int_0^h A(u)\,du$ e, portanto, o Teorema Fundamental
    do Cálculo nos dá $dV/dh = A(h)$. Segue que
    $$\frac{dV}{dt} = \frac{dV}{dh}\,\frac{dh}{dt} = A(h)\,\frac{dh}{dt}$$
    e assim a Lei de Torricelli se torna
    $$A(h)\,\frac{dh}{dt} = -a\sqrt{2gh}$$</p>
    <p><b>(a)</b> Suponha que o tanque tenha o formato de uma esfera de raio igual a <b>2 m</b> e que esteja cheia,
    inicialmente, até a metade de sua capacidade. Se o raio do buraco circular é <b>1 cm</b> e assumimos que
    $g = 10\ \text{m/s}^2$, mostre que $h$ satisfaz a equação diferencial
    $$(4h - h^2)\,\frac{dh}{dt} = -0{,}0001\sqrt{20h}$$</p>
    <p><b>(b)</b> Em quanto tempo o tanque ficará completamente vazio?</p>`,
  nota: null,

  passos: [
    {
      titulo: 'Dados',
      tex: [String.raw`R = 2\ \text{m} \qquad h(0) = 2\ \text{m} \qquad r_{\text{furo}} = 1\ \text{cm}`],
      texto: 'h é medido a partir do fundo da esfera, onde fica o furo.',
    },
    {
      titulo: 'Pitágoras no corte',
      tex: [String.raw`r^2 + (2 - h)^2 = 2^2`, String.raw`\Longrightarrow\quad r^2 = 4h - h^2`],
      texto: 'Hipotenusa = raio da esfera (do centro O até a borda da água); catetos |2 − h| e r.',
      action: { type: 'scene', pythagoras: true, animateH: [0.5, 3.5] },
    },
    {
      titulo: 'Área da superfície',
      tex: [String.raw`A(h) = \pi r^2 = \pi\,(4h - h^2)`],
    },
    {
      titulo: 'Furo e substituição',
      tex: [String.raw`a = \pi\,(0{,}01)^2 = 0{,}0001\,\pi`,
            String.raw`\pi\,(4h - h^2)\,\dfrac{dh}{dt} = -0{,}0001\,\pi\sqrt{20h}`,
            String.raw`\Longrightarrow\quad (4h - h^2)\,\dfrac{dh}{dt} = -0{,}0001\sqrt{20h} \qquad \text{(a)}`],
    },
    {
      titulo: 'Separar e inverter os limites',
      tex: [String.raw`\dfrac{4h - h^2}{\sqrt{h}}\,dh = -0{,}0001\sqrt{20}\;dt`,
            String.raw`\int_0^2 \left(4h^{1/2} - h^{3/2}\right) dh = 0{,}0001\sqrt{20}\int_0^T dt`],
      texto: 'h vai de 2 até 0; trocar os limites de lugar absorve o sinal negativo.',
    },
    {
      titulo: 'Integrar',
      tex: [String.raw`\left[\tfrac{8}{3}\,h^{3/2} - \tfrac{2}{5}\,h^{5/2}\right]_0^2 = \dfrac{16\sqrt{2}}{3} - \dfrac{8\sqrt{2}}{5} = \dfrac{56\sqrt{2}}{15}`],
    },
    {
      titulo: 'Tempo para esvaziar',
      tex: [String.raw`\dfrac{56\sqrt{2}}{15} = 0{,}0001\sqrt{20}\;T`,
            String.raw`T \approx 11\,805{,}84\ \text{s} \approx 3\ \text{h}\ 16\ \text{min}\ 46\ \text{s} \qquad \text{(b)}`],
      action: { type: 'run', speed: 2000 },
    },
  ],
};
