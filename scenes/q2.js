// Questão 2 — Garrafa: água × óleo
// Texto do enunciado (HTML) e passos da apresentação. Fórmulas em LaTeX (KaTeX).
// No enunciado (e na nota), fórmulas entre $…$ (no meio do texto) ou $$…$$ (em destaque).
// Cada passo: { titulo, intro, tex: [até 3 linhas], texto, html, nota, botao: { label, action }, action } (todos opcionais menos o título)
// Ações disponíveis:
//   { type: 'graphStage', stage: 1|2 }     abre o gráfico ampliado na etapa indicada
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
  // pelicula: true põe no cartão a ilustração da película na boca do furo (empurra × segura); depois: HTML abaixo dela.
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
            <li><b>até ~1 min 55 s</b>: escoando pela parede;</li>
            <li><b>~1 min 55 s a 3 min 32 s</b>: um filete fino ainda escorre, com o nível quase parado na altura do furo;</li>
            <li><b>~3 min 32 s a 3 min 34 s</b>: o filete se rompe e sai a última gota;</li>
            <li><b>a partir de ~3 min 34 s</b>: não sai mais nada.</li>
          </ul>`,
      },
      {
        titulo: 'O que empurra: o peso da água',
        html: String.raw`<p>Pressão é força dividida por área. A coluna de água acima do furo tem peso, e esse peso empurra a
          água para fora.</p>
          $$P_{\text{empurra}} = \rho\,g\,h$$
          <p>Com $\rho = 1000$ kg/m³ e $g = 10$ m/s², cada milímetro de água acima do furo empurra com 10 Pa.</p>`,
      },
      {
        titulo: 'O que segura: a “pele” da água',
        html: String.raw`<p>A superfície da água se comporta como uma película elástica esticada: é por isso que um inseto
          anda sobre a água e uma gota fica redonda. A força dessa película é a tensão superficial, representada pela letra
          grega $\gamma$ (gama). Para a água, $\gamma \approx 0{,}072$ N/m: cada metro de borda da película puxa com
          0,072 N. Para sair pelo furo, a água precisa empurrar essa película para fora, formando uma bolhinha, como encher
          um balão.</p>`,
      },
      {
        titulo: 'De onde vem 2γ/r',
        html: String.raw`<p>Imagine a bolhinha como uma meia-esfera presa na borda do furo, de raio $r$. A película puxa para
          dentro ao longo da borda (comprimento $2\pi r$). A água empurra para fora sobre a área do furo ($\pi r^2$).
          Igualando:</p>
          $$P\cdot\pi r^2 = \gamma\cdot 2\pi r \;\Rightarrow\; P_{\text{segura}} = \frac{2\gamma}{r}$$
          <p>Furo menor resiste mais, como um balão pequeno, que é mais difícil de encher. Com um furo de ~4 mm
          ($r \approx 2$ mm):</p>
          $$P_{\text{segura}} = \frac{2\cdot 0{,}072}{0{,}002} \approx 72\ \text{Pa} \;\approx\; 7\ \text{mm de água}$$`,
      },
      {
        titulo: 'Por que “segura até”',
        html: String.raw`<p>A película se ajusta ao empurrão: com pouca pressão, ela se curva só um pouco e segura; com mais
          pressão, ela se curva mais. O máximo é a meia-esfera: se o empurrão passar de ~72 Pa, ela não tem como se curvar
          mais, estoura, e a água sai. Abaixo disso, ela segura.</p>`,
      },
      {
        titulo: 'O filete e o momento em que parou',
        html: String.raw`<p>Pela conta, abaixo de ~7 mm de nível a água já deveria parar, mas no vídeo ela continuou saindo.
          Enquanto o filete escorre pela parede, não existe película na boca do furo: a água fica ligada de dentro da
          garrafa até o filete, e o peso dele puxa mais água, como um pequeno sifão. Quando o filete fica fino demais e se
          rompe, a película se forma; com o nível a ~2 mm, o empurrão de ~20 Pa não consegue estourá-la, e a água para.</p>`,
        pelicula: true,
        depois: String.raw`<ul class="ex">
            <li>gota pendurada na torneira: só cai quando fica pesada o bastante;</li>
            <li>conta-gotas: a água não sai pela ponta fina sem apertar.</li>
          </ul>`,
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

  // Passos: intro (texto antes das fórmulas), tex, texto, html (listas e tabelas), nota e botao { label, action }.
  // Nenhum passo roda ação sozinho; o último tem o botão "Ver no gráfico".
  passos: [
    {
      titulo: 'O modelo',
      intro: 'O enunciado troca a Lei de Torricelli por dh/dt = k√h, em que o k depende do líquido e é determinado pelos dados do vazamento.',
      tex: [String.raw`\dfrac{dh}{dt} = k\sqrt{h}`],
    },
    {
      titulo: 'A solução',
      intro: 'Separando as variáveis e integrando, com h(0) = 10 cm:',
      tex: [
        String.raw`\int h^{-1/2}\,dh = k\int dt \;\Rightarrow\; 2\sqrt{h} = kt + C`,
        String.raw`h(0) = 10 \;\Rightarrow\; C = 2\sqrt{10}`,
        String.raw`\boxed{\,h(t) = \left(\sqrt{10} + \tfrac{k}{2}\,t\right)^{2}\,}`,
      ],
    },
    {
      titulo: 'Como achar o k',
      intro: 'Basta saber em quanto tempo T o nível chegou a 3 cm. Substituímos h(T) = 3 na solução e isolamos o k:',
      tex: [
        String.raw`3 = \left(\sqrt{10} + \tfrac{k}{2}\,T\right)^{2} \;\Rightarrow\; \sqrt{3} = \sqrt{10} + \tfrac{k}{2}\,T`,
        String.raw`\Rightarrow\; k = \dfrac{2\,(\sqrt{3} - \sqrt{10})}{T}`,
      ],
      nota: 'Tirar a raiz vale porque o parêntese é positivo enquanto o tanque não esvaziou.',
    },
    {
      titulo: 'Livro (questão 2a)',
      intro: 'O enunciado informa: de 10 cm a 3 cm em 68 s.',
      tex: [
        String.raw`T = 68\ \text{s} \;\Rightarrow\; k = \dfrac{\sqrt{3} - \sqrt{10}}{34} \approx -0{,}042`,
        String.raw`h(t) = \left(\sqrt{10} - 0{,}0210\,t\right)^{2}`,
      ],
      html: String.raw`<table>
          <tr><th>t (s)</th><td>10</td><td>20</td><td>30</td><td>40</td><td>50</td><td>60</td></tr>
          <tr><th>h (cm)</th><td>8,71</td><td>7,52</td><td>6,41</td><td>5,39</td><td>4,45</td><td>3,61</td></tr>
        </table>`,
    },
    {
      titulo: 'Como medimos (nosso ensaio, questão 2b)',
      html: String.raw`<ul>
          <li>garrafa PET com um furo perto do fundo;</li>
          <li>fita com marcas a cada centímetro, com o zero no topo do furo;</li>
          <li>celular parado filmando, com água e depois com óleo de cozinha;</li>
          <li>um script em Python lê o nível em cada quadro do vídeo, usando as marcas da fita como régua;</li>
          <li>registramos o instante em que o nível cruza cada marca: são os círculos do gráfico.</li>
        </ul>`,
    },
    {
      titulo: 'Resultados',
      html: String.raw`<table>
          <tr><th></th><th>T (10 → 3 cm)</th><th>k</th></tr>
          <tr><td>Livro</td><td>68 s</td><td>−0,042</td></tr>
          <tr><td>Água</td><td>64,4 s</td><td>−0,044</td></tr>
          <tr><td>Óleo</td><td>77,3 s</td><td>−0,037</td></tr>
        </table>
        <p>Cada k sai da mesma conta do passo 3, trocando só o T.</p>`,
    },
    {
      titulo: 'Comparação',
      html: String.raw`<ul>
          <li>Livro × água: garrafa e furo diferentes, e o k ficou a 5% do valor do livro. O nosso ensaio reproduz o do livro.</li>
          <li>Água × óleo: com o mesmo procedimento, o |k| do óleo ficou ~17% menor, e ele leva ~20% mais tempo. A Lei de Torricelli pura não tem nenhum termo do líquido; a diferença aponta para a viscosidade, e por isso o k é medido para cada líquido.</li>
          <li>Cada k usou só dois pontos (10 cm e 3 cm). Os demais pontos medidos caem sobre a curva: o modelo descreve bem os dados.</li>
        </ul>`,
      botao: { label: 'Ver no gráfico', action: { type: 'graphStage', stage: 2 } },
    },
  ],
};
