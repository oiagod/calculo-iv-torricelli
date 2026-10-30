// Slides da apresentação (exportados do Keynote como imagens 16:9 em ./slides: 01.jpg, 02.jpg, …)
// Edite à vontade: o simulador lê tudo daqui.

export default {
  dir: './slides',
  ext: 'jpg',

  // título curto de cada slide (aparece nas miniaturas e na legenda do palco)
  titles: {
    1: 'Capa',
    2: 'O problema proposto',
    3: 'Cilindro: da geometria à equação',
    4: 'Cilindro: integração e condição inicial',
    5: 'Garrafa: ajuste a partir dos dados',
    6: 'Ensaio com óleo de cozinha (vídeo)',
    7: 'Pressão em sistemas anti-incêndio',
    8: 'Esfera: a área muda com a altura',
    9: 'Por que o volume é uma integral?',
    10: 'Esfera: integração até esvaziar',
    11: 'Resultados e limites do modelo',
  },

  // slides de cada cena (chave = número da cena)
  scenes: {
    0: [2],
    1: [3, 4],
    2: [5],
    3: [7],
    4: [8, 9, 10],
  },

  // abrem só pela "Apresentação completa"
  cover: 1,
  results: 11,

  // o slide 6 (vídeo) fica fora do mapeamento; o vídeo tem aba própria na cena 2
  video: {
    scene: 2,
    src: './media/agua_vs_oleo.mp4',
    caption: 'Vídeo em 2×. O relógio indica o tempo real do experimento.',
  },
};
