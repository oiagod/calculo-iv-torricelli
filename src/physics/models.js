// EDO de cada questão na forma dh/dt = f(h). Funções puras.
// h abaixo de 0 conta como 0 (a raiz não fica indefinida no meio de um passo do RK4).

// Q1 — cilindro R = 1 m, furo r = 2 cm, g = 10 (m, s)
export const q1 = h => -0.0004 * Math.sqrt(20 * Math.max(h, 0));

// Q2 — garrafa, dh/dt = k·√h com k medido (cm, s)
export const q2 = k => h => k * Math.sqrt(Math.max(h, 0));

// Q3 — tanque anti-incêndio R = 3 m, saída de 6 cm, g = 10 (m, s)
export const q3 = h => -0.0001 * Math.sqrt(20 * Math.max(h, 0));

// Q4 — esfera R = 2 m, furo r = 1 cm, g = 10 (m, s): (4h − h²)·dh/dt = −0,0001·√(20h)
// h fica dentro de (0, 4): nos polos a área da superfície é zero e a divisão explodiria
export const q4 = h => {
  const c = Math.min(Math.max(h, 1e-9), 4 - 1e-9);
  return -0.0001 * Math.sqrt(20 * c) / (4 * c - c * c);
};

// Cena 0 — tanque da introdução: raio 0,3 m, furo r = 1 cm, g = 10 (m, s)
// A·dh/dt = −a·√(2gh), com a/A = (0,01/0,3)² = 1/900
export const q0 = h => -Math.sqrt(20 * Math.max(h, 0)) / 900;
