// Regressão: o caminho do app (configuração da cena → tabela h(t) → avanço por quadros).
// Antes, o app integrava a EDO a cada quadro e marcava o fim quando h ≤ 1e-5 com uma reta no último
// passo: a Q1 mostrava ≈ 1578 s em vez de 1581,14 s, e o valor mudava com a taxa de quadros.
import { describe, it, expect } from 'vitest';
import * as sim from '../src/physics/simulations.js';
import * as analytic from '../src/physics/analytic.js';
import { timeline, advanceRun } from '../src/physics/playback.js';

const near = (got, want, tol, what) =>
  expect(Math.abs(got - want), `${what}: obtido ${got}, esperado ${want} (tolerância ${tol})`).toBeLessThanOrEqual(tol);

// reproduz o laço do app: cada quadro avança frameMs × speed de tempo simulado
function play(cfg, { frameMs = 16, speed = 100, marks = [], stopAt, onFrame } = {}) {
  const tanks = [{ tl: timeline(cfg.f, cfg.h0, cfg), h: cfg.h0, emptyAt: null, cross: {} }];
  let t = 0, frames = 0;
  const frameDt = typeof frameMs === 'function' ? () => frameMs(frames) : () => frameMs;
  while (tanks[0].emptyAt == null && t < (stopAt ?? Infinity) && frames < 1e7) {
    t = advanceRun(tanks, t, frameDt() / 1000 * speed, { marks, stopAt });
    frames++; onFrame?.(t, tanks[0]);
  }
  return { t, tank: tanks[0] };
}

describe('reprodução no app (quadros de 16 ms em ×100)', () => {
  it('Q1: esvazia em 1581,14 s e o relógio para exatamente aí', () => {
    const { t, tank } = play(sim.q1);
    near(tank.emptyAt, 1581.14, 0.5, 'Q1 emptyAt');
    near(tank.tl.tEmpty, 500 * Math.sqrt(10), 0.5, 'Q1 "Esvazia em"');
    expect(t).toBe(tank.emptyAt);
    expect(tank.h).toBe(0);
  });

  it('Q1: o nível lido a cada quadro segue a solução analítica', () => {
    let worst = 0;
    play(sim.q1, { onFrame: (t, tk) => { const want = analytic.q1.h(t); if (want > 1e-3) worst = Math.max(worst, Math.abs(tk.h - want) / want); } });
    expect(worst, `maior erro relativo ${worst}`).toBeLessThan(1e-4);
  });

  it('Q4: esvazia em 11 805,84 s', () => {
    const { tank } = play(sim.q4);
    near(tank.emptyAt, 11805.84, 5, 'Q4 emptyAt');
    near(tank.tl.tEmpty, 11805.84, 5, 'Q4 "Esvazia em"');
  });

  it('o resultado não depende da velocidade nem da taxa de quadros', () => {
    const ref = play(sim.q1).tank.emptyAt;
    for (const speed of [1, 10, 1000]) expect(play(sim.q1, { speed }).tank.emptyAt).toBe(ref);
    const irregular = play(sim.q1, { frameMs: i => [16, 33, 7, 50, 16.7][i % 5] }).tank.emptyAt;
    expect(irregular).toBe(ref);
  });

  it('Q2: a marca de 3 cm é cruzada no mesmo instante da fórmula fechada', () => {
    for (const k of [sim.Q2_K_WATER, sim.Q2_K_OIL]) {
      const { tank } = play(sim.q2(k), { marks: [3] });
      near(tank.cross[3], analytic.q2.timeBetween(10, 3, k), 0.01, `k = ${k}`);
    }
  });

  it('Q3: pausa em 600 s com h = 10,4 m quando H é o mínimo', () => {
    const { t, tank } = play(sim.q3(analytic.q3.H_MIN), { marks: [10.4], stopAt: 600 });
    expect(t).toBe(600);
    near(tank.h, 10.4, 0.001, 'h(600)');
    expect(tank.emptyAt).toBe(null);
  });
});
