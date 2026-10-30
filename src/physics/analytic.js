// Soluções fechadas das questões (o gabarito dos testes e das curvas dos gráficos). Funções puras.

const sq = x => Math.sqrt(Math.max(x, 0));

// Q1 — cilindro (m, s): √h = √h0 − 0,0002·√20·t
const C1 = 0.0002 * Math.sqrt(20);
export const q1 = {
  C: C1,
  h: (t, h0 = 2) => Math.max(sq(h0) - C1 * t, 0) ** 2,
  tEmpty: (h0 = 2) => sq(h0) / C1,                      // h0 = 2 ⇒ 500√10 ≈ 1581,14 s
};

// Q2 — garrafa (cm, s): √h = √h0 + (k/2)·t
export const q2 = {
  K_BOOK: (Math.sqrt(3) - Math.sqrt(10)) / 34,          // livro: 10 cm → 3 cm em 68 s
  h: (t, k, h0 = 10) => Math.max(sq(h0) + k / 2 * t, 0) ** 2,
  tEmpty: (k, h0 = 10) => 2 * sq(h0) / Math.abs(k),
  kFromPoints: (h0, h1, t) => 2 * (sq(h1) - sq(h0)) / t,
  timeBetween: (h0, h1, k) => 2 * (sq(h1) - sq(h0)) / k,
};

// Q3 — tanque anti-incêndio (m, s, kPa): √h = √H − 0,00005·√20·t; P = 10h
const C3 = 0.00005 * Math.sqrt(20);
export const q3 = {
  C: C3,
  P_MIN: 104, T_PUMPS: 600,
  H_MIN: (Math.sqrt(10.4) + 0.03 * Math.sqrt(20)) ** 2,  // ≈ 11,2833 m
  h: (t, H) => Math.max(sq(H) - C3 * t, 0) ** 2,
  tEmpty: H => sq(H) / C3,
  pressure: h => 10 * h,
};

// Q4 — esfera R = 2 m (m, s): (4h − h²)·dh/dt = −C·√h, com C = 0,0001·√20
const C4 = 0.0001 * Math.sqrt(20);
export const q4 = {
  C: C4,
  R: 2,
  area: h => Math.PI * Math.max(4 * h - h * h, 0),
  // ∫₀ʰ (4u^½ − u^{3/2}) du = C·T
  tEmpty: h => { h = Math.max(h, 0); return ((8 / 3) * h ** 1.5 - 0.4 * h ** 2.5) / C4; },
  INTEGRAL: 56 * Math.SQRT2 / 15,                       // valor da integral de 0 a 2
};
