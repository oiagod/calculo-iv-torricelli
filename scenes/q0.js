// Cena 0 — Lei de Torricelli (introdução)
// Mesmo formato de scenes/q2.js: enunciado (HTML), nota (opcional) e passos da apresentação.
// Campo extra por passo: nota (texto pequeno em itálico).
// Ações desta cena: { type: 'scene', mode: 'up'|'side', flow: true|false (parcela do jato + fatia Δh),
//                     dt: s, highlight: true }

export default {
  enunciado: String.raw`
    <p>Se água (ou outro líquido) está vazando de um tanque, esperamos que o escoamento seja maior no começo
    (quando o tanque estiver mais cheio) e que vá gradualmente diminuindo à medida que o nível de água do tanque
    diminui. Mas queremos uma descrição matemática mais precisa de como o escoamento decresce a fim de responder às
    perguntas que os engenheiros fazem: quanto tempo demora para que o tanque seja esvaziado completamente? Quão
    cheio o tanque deve estar para garantir uma pressão mínima a um sistema de irrigação?</p>
    <p>Sejam $V(t)$ e $h(t)$ o volume de água no tanque e a altura da água no tanque num dado momento $t$. Se a água
    escorre por um furo de área $a$ no fundo do tanque, então a Lei de Torricelli diz que
    $$\frac{dV}{dt} = -a\sqrt{2gh} \tag{1}$$
    onde $g$ é a aceleração devido à gravidade. Logo, a taxa na qual a água escoa do tanque é proporcional à raiz
    quadrada da altura da água.</p>`,
  nota: null,

  passos: [
    {
      titulo: 'O que Torricelli sabia de Galileu: a queda livre',
      tex: [
        String.raw`v = g\,t \qquad d = \tfrac{1}{2}\,g\,t^2`,
        String.raw`t = \dfrac{v}{g} \;\Rightarrow\; d = \tfrac{1}{2}\,g\left(\dfrac{v}{g}\right)^{2} = \dfrac{v^2}{2g} \;\Rightarrow\; v = \sqrt{2g\,d}`,
      ],
      texto: 'Um corpo que cai ganha velocidade, e a velocidade depende da altura da queda: cresce com a raiz quadrada da altura. Cair de uma altura 4 vezes maior dá só o dobro da velocidade.',
      nota: 'Notação moderna; Galileu trabalhava com proporções.',
    },
    {
      titulo: 'O caminho inverso: lançar para cima',
      tex: [String.raw`d_{\text{subida}} = \dfrac{v^2}{2g}`],
      texto: 'Um corpo lançado para cima com velocidade v sobe exatamente até a altura de onde precisaria cair para ganhar essa mesma v. Subir e cair são simétricos.',
    },
    {
      titulo: 'A observação: o jato para cima',
      tex: [String.raw`d_{\text{subida}} \approx h`],
      texto: 'Com um tubo curvado para cima na saída do tanque, como numa fonte, o jato sobe quase até o nível da água dentro do tanque. Fica um pouco abaixo por causa do atrito com o ar e com a própria água.',
      action: { type: 'scene', mode: 'up', flow: false, highlight: true },
    },
    {
      titulo: 'A conclusão: juntando 2 e 3',
      tex: [String.raw`\dfrac{v^2}{2g} = h \;\Rightarrow\; \boxed{\,v = \sqrt{2gh}\,}`, String.raw`v \propto \sqrt{h}`],
      texto: 'Se o jato sobe até a superfície, ele saiu do furo com a velocidade de algo que caiu da superfície até o furo. A velocidade depende só da altura da coluna de água acima do furo, não do formato do tanque nem da quantidade de água.',
      action: { type: 'scene', mode: 'side', flow: false },
    },
    {
      titulo: 'Da velocidade para a vazão: o que sai = o que some',
      tex: [
        String.raw`\Delta V_{\text{furo}} = a\cdot v\,\Delta t \qquad \Delta V_{\text{tanque}} = A\cdot\Delta h`,
        String.raw`A\,\Delta h = a\,v\,\Delta t \;\Rightarrow\; A\,\dfrac{dh}{dt} = -a\sqrt{2gh}`,
      ],
      texto: 'Em Δt, passa pelo furo de área a uma parcela de água com volume a·v·Δt (em terracota no jato). Depois ela cai em parábola, mas o volume é o mesmo, qualquer que seja o caminho. Essa água sai do topo do tanque: uma fatia de área A e espessura Δh. Conservação de volume: as duas contas são iguais.',
      nota: 'A fatia está desenhada mais grossa que o Δh real; o valor na etiqueta é o real.',
      action: { type: 'scene', mode: 'side', flow: true, dt: 0.1 },
    },
    {
      titulo: 'Por que dt, e não t',
      tex: [
        String.raw`\Delta V \approx a\,v_0\,\Delta t \;\Rightarrow\; \dfrac{\Delta V}{\Delta t} \approx a\,v_0`,
        String.raw`\lim_{\Delta t \to 0} \dfrac{\Delta V}{\Delta t} = \dfrac{dV}{dt} = a\,v`,
      ],
      texto: 'A conta a·v·Δt funciona como “velocidade × tempo” e só é exata se a velocidade não mudar. Mas a água vai freando: o nível desce e v = √(2gh) diminui. Por isso, usar o v do começo do intervalo superestima o volume, e o erro é maior quanto maior o Δt. Dividindo por Δt, temos a vazão média no intervalo. Com Δt → 0, ela vira a vazão naquele instante, assim como a velocidade média vira a velocidade instantânea do velocímetro.',
    },
    {
      titulo: 'A Lei de Torricelli',
      tex: [
        String.raw`\dfrac{dV}{dt} = -a\,v = -a\sqrt{2gh}`,
        String.raw`v = \sqrt{2gd}\ (\text{queda livre}) \;\to\; \text{jato sobe até } h\ (\text{experimento}) \;\to\; v = \sqrt{2gh} \;\to\; \dfrac{dV}{dt} = -a\sqrt{2gh}`,
      ],
    },
  ],
};
