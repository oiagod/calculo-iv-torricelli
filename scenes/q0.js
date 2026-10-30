// Cena 0 — Lei de Torricelli (introdução)
// Mesmo formato de scenes/q2.js: enunciado (HTML), nota (opcional) e passos da apresentação.
// Campo extra por passo: nota (texto pequeno em itálico).
// Ações desta cena: { type: 'scene', mode: 'up'|'side', cylinder: true|false, highlight: true,
//                     animateDt: [de, até], duration: ms }

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
      action: { type: 'scene', mode: 'up', cylinder: false, highlight: true },
    },
    {
      titulo: 'A conclusão: juntando 2 e 3',
      tex: [String.raw`\dfrac{v^2}{2g} = h \;\Rightarrow\; \boxed{\,v = \sqrt{2gh}\,}`, String.raw`v \propto \sqrt{h}`],
      texto: 'Se o jato sobe até a superfície, ele saiu do furo com a velocidade de algo que caiu da superfície até o furo. A velocidade depende só da altura da coluna de água acima do furo, não do formato do tanque nem da quantidade de água.',
      action: { type: 'scene', mode: 'side', cylinder: false },
    },
    {
      titulo: 'Da velocidade para a vazão: o cilindro de água',
      tex: [
        String.raw`\Delta V = a\cdot v\,\Delta t \qquad (\text{base} \times \text{comprimento})`,
        String.raw`a = 1\ \text{cm}^2,\ v = 140\ \text{cm/s},\ \Delta t = 0{,}01\ \text{s} \;\Rightarrow\; \Delta V = 1\cdot 1{,}4 = 1{,}4\ \text{cm}^3`,
      ],
      texto: 'Em um intervalo Δt, a água que sai pelo furo forma um cilindro: base = área do furo a; comprimento = distância percorrida v·Δt.',
      action: { type: 'scene', mode: 'side', cylinder: true, animateDt: [0.01, 0.5], duration: 3000 },
    },
    {
      titulo: 'Por que dt, e não t',
      tex: [
        String.raw`\Delta V \approx a\,v\,\Delta t \;\Rightarrow\; \dfrac{\Delta V}{\Delta t} \approx a\,v`,
        String.raw`\Delta t \to 0:\qquad \dfrac{dV}{dt} = a\,v`,
      ],
      texto: 'A velocidade não é constante: v depende de h, e h vai caindo. Por isso não dá para usar a·v·t com o tempo total. Num intervalo muito pequeno, h quase não muda e v fica praticamente constante; no limite, a conta vira exata.',
      action: { type: 'scene', mode: 'side', cylinder: true, animateDt: [0.5, 0.01], duration: 3000 },
    },
    {
      titulo: 'A Lei de Torricelli',
      tex: [
        String.raw`\dfrac{dV}{dt} = -a\,v = -a\sqrt{2gh}`,
        String.raw`v = \sqrt{2gd}\ (\text{queda livre}) \;\to\; \text{jato sobe até } h \;\to\; v = \sqrt{2gh} \;\to\; \dfrac{dV}{dt} = -a\sqrt{2gh}`,
      ],
      texto: 'O volume sai do tanque, então entra com sinal negativo. Como v depende de h, a lei é uma derivada; para achar o tempo total, integramos, somando todos esses pedacinhos, cada um com a sua velocidade.',
    },
  ],
};
