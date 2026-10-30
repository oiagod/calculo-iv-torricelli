// Reprodução da simulação: a EDO é resolvida uma vez (tabela h(t) com o RK4 em passo fino) e a
// animação só lê h(t_sim) dessa tabela. Assim o resultado não depende da taxa de quadros nem da
// velocidade (×1 ou ×1000): cada quadro apenas avança o relógio.
import { solve, tailTime, levelWithTime } from './solver.js';

// índice i com xs[i] ≤ x < xs[i + 1] (xs crescente)
function bracket(xs, x, n = xs.length) {
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
  return lo;
}

// tabela h(t) de dh/dt = f(h) a partir de h0, com passo dt, até esvaziar ou até tMax
// devolve { h0, tEmpty, hAt(t), timeAt(h) }; tEmpty é null se não esvazia até tMax
export function timeline(f, h0, { dt, tMax = Infinity, hTail } = {}) {
  const sol = solve(f, h0, { dt, tEnd: tMax, hTail, record: true });
  const { ts, hs, tEmpty } = sol;
  // trecho final (perto de h = 0): calculado pela integral exata em vez de interpolado
  const tail = tEmpty != null, n = tail ? ts.length - 1 : ts.length;   // n pontos do RK4
  const tTail = ts[n - 1], hTail0 = hs[n - 1];

  const hAt = t => {
    if (!(t > 0)) return h0;
    if (tail && t >= tTail) return t >= tEmpty ? 0 : levelWithTime(f, hTail0, tEmpty - t);
    if (t >= ts[n - 1]) return hs[n - 1];
    const i = bracket(ts, t, n), u = (t - ts[i]) / (ts[i + 1] - ts[i]);
    return hs[i] + (hs[i + 1] - hs[i]) * u;
  };

  // instante em que o nível desce até h (null se começa abaixo ou não chega lá até tMax)
  const timeAt = h => {
    if (!(h < h0)) return null;
    if (tail && h <= hTail0) return tEmpty - tailTime(f, h);
    if (h < hs[n - 1]) return null;
    let lo = 0, hi = n - 1;                        // hs decrescente
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (hs[mid] >= h) lo = mid; else hi = mid; }
    return ts[lo] + (ts[hi] - ts[lo]) * (hs[lo] - h) / (hs[lo] - hs[hi]);
  };

  return { h0, tEmpty, hAt, timeAt };
}

// avança o relógio de t para t + dt (sem passar de stopAt nem do instante em que o último tanque esvazia)
// e atualiza em cada tanque { tl, h, emptyAt, cross } o nível, o instante em que esvaziou e as marcas cruzadas
export function advanceRun(tanks, t, dt, { marks = [], stopAt = Infinity } = {}) {
  const tLast = Math.max(...tanks.map(tk => tk.tl.tEmpty ?? Infinity));
  const tn = Math.max(t, Math.min(t + dt, stopAt, tLast));
  for (const tk of tanks) {
    tk.h = tk.tl.hAt(tn);
    for (const m of marks) {
      if (tk.cross[m] != null) continue;
      const tc = tk.tl.timeAt(m);
      if (tc != null && tc <= tn) tk.cross[m] = tc;
    }
    if (tk.emptyAt == null && tk.tl.tEmpty != null && tn >= tk.tl.tEmpty) tk.emptyAt = tk.tl.tEmpty;
  }
  return tn;
}
