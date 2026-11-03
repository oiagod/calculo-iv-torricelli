// O que cada cena simula: EDO, nível inicial, passo da tabela h(t) e horizonte.
// O app (index.html) e os testes usam exatamente estas configurações.
import * as models from './models.js';

export const Q3_T_END = 900;   // a cena 3 mostra só os primeiros 15 min

// cena 0: tanque de raio 0,3 m (área A) e furo de raio 1 cm (área a); h é a altura da água acima do furo
export const q0 = { f: models.q0, h0: 0.8, A: Math.PI * 0.3 ** 2, a: Math.PI * 0.01 ** 2, g: 10 };   // m, s
export const q1 = { f: models.q1, h0: 2, dt: 0.05 };                          // m, s
// cena 2: k medidos no ensaio (10 → 3 cm em 64,4 s e 77,3 s; analise/dados/resultados.json)
export const Q2_K_WATER = -0.0444, Q2_K_OIL = -0.0370;   // cm½/s
export const q2 = (k, h0 = 10) => ({ f: models.q2(k), h0, dt: 0.005 });       // cm, s
export const q3 = H => ({ f: models.q3, h0: H, dt: 0.05, tMax: Q3_T_END });   // m, s
export const q4 = { f: models.q4, h0: 2, dt: 0.05 };                          // m, s
