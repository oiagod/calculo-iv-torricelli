// Questão 3 — Sistema anti-incêndio
// Mesmo formato de scenes/q2.js: enunciado (HTML), nota (opcional) e passos da apresentação.
// Ações: graphStage, seek, highlight (destaca a faixa de 10,4 m), run (params opcionais, speed opcional).

// altura mínima exata: com 11,28 m arredondados, P(600) ≈ 103,97 kPa (fica por um fio abaixo)
const H_MIN = (Math.sqrt(10.4) + 0.03 * Math.sqrt(20)) ** 2;

export default {
  enunciado: String.raw`
    <p>Em muitas partes do mundo, a água para os sistemas de combate a incêndios em grandes hotéis e hospitais é
    fornecida pela ação da gravidade em tanques cilíndricos colocados nos telhados desses prédios. Suponha que cada
    tanque tenha um raio de <b>3 m</b> e o diâmetro da saída seja de <b>6 cm</b>. Um engenheiro tem de garantir que a
    pressão da água seja, no mínimo, de <b>104 kPa</b> por um período de <b>10 minutos</b>. (Quando um incêndio
    acontece, o sistema elétrico pode falhar e pode levar cerca de 10 minutos para que o gerador de emergência e
    bombas anti-incêndio sejam ativados.) Qual altura o engenheiro deve especificar para o tanque a fim de garantir
    essa exigência? (Use o fato de que a pressão da água a uma profundidade de $d$ metros é $P = 10d$
    quilopascals.)</p>`,
  nota: null,

  passos: [
    {
      titulo: 'Dados',
      tex: [String.raw`R = 3\ \text{m} \qquad \varnothing_{\text{saída}} = 6\ \text{cm} \;\Rightarrow\; r = 0{,}03\ \text{m}`,
            String.raw`P \ge 104\ \text{kPa} \ \text{durante}\ 600\ \text{s}`],
    },
    {
      titulo: 'Pressão → altura',
      tex: [String.raw`P = 10h \ge 104 \;\Rightarrow\; h(600) \ge 10{,}4\ \text{m}`],
      action: { type: 'highlight', target: 'faixa' },
    },
    {
      titulo: 'EDO',
      tex: [String.raw`9\pi\,\dfrac{dh}{dt} = -0{,}0009\,\pi\sqrt{20h}`,
            String.raw`\Longrightarrow\quad \dfrac{dh}{dt} = -0{,}0001\sqrt{20h}`],
      texto: 'A = π·3² = 9π e a = π·0,03² = 0,0009π.',
    },
    {
      titulo: 'Integrar de H até 10,4 em 600 s',
      tex: [String.raw`\int_{H}^{10{,}4} \dfrac{dh}{\sqrt{h}} = -0{,}0001\sqrt{20}\int_{0}^{600} dt`,
            String.raw`2\left(\sqrt{10{,}4} - \sqrt{H}\right) = -0{,}06\sqrt{20}`],
    },
    {
      titulo: 'Isolar H',
      tex: [String.raw`H = \left(\sqrt{10{,}4} + 0{,}03\sqrt{20}\right)^{2}`],
    },
    {
      titulo: 'Altura mínima',
      tex: [String.raw`H \approx 11{,}28\ \text{m}`],
      texto: 'O nível cai só ≈ 0,88 m em 10 min.',
      action: { type: 'run', params: { H: H_MIN }, speed: 50 },
    },
  ],
};
