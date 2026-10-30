// O que cada cena simula: EDO, nível inicial, passo da tabela h(t) e horizonte.
// O app (index.html) e os testes usam exatamente estas configurações.
import * as models from './models.js';

export const Q3_T_END = 900;   // a cena 3 mostra só os primeiros 15 min

export const q1 = { f: models.q1, h0: 2, dt: 0.05 };                          // m, s
export const q2 = (k, h0 = 10) => ({ f: models.q2(k), h0, dt: 0.005 });       // cm, s
export const q3 = H => ({ f: models.q3, h0: H, dt: 0.05, tMax: Q3_T_END });   // m, s
export const q4 = { f: models.q4, h0: 2, dt: 0.05 };                          // m, s
