// O RK4 (src/physics/solver.js) contra as respostas calculadas à mão (src/physics/analytic.js).
import { describe, it, expect } from 'vitest';
import * as models from '../src/physics/models.js';
import * as analytic from '../src/physics/analytic.js';
import { solve, emptyTime, levelAt, tailTime } from '../src/physics/solver.js';
import { outflowSpeed, volumeRate } from '../src/physics/torricelli.js';

// |obtido − esperado| ≤ tol, com os dois valores na mensagem de erro
const near = (got, want, tol, what) =>
  expect(Math.abs(got - want), `${what}: obtido ${got}, esperado ${want} (tolerância ${tol})`).toBeLessThanOrEqual(tol);

describe('Lei de Torricelli', () => {
  it('v = √(2gh) e dV/dt = −a·√(2gh)', () => {
    near(outflowSpeed(0.8, 10), 4, 1e-12, 'v(0,8 m)');
    near(volumeRate(Math.PI * 0.01 ** 2, 0.8, 10), -Math.PI * 1e-4 * 4, 1e-15, 'dV/dt');
    expect(outflowSpeed(-1, 10)).toBe(0);
  });
});

describe('Q1 — cilindro', () => {
  const dt = 0.5;

  it('esvazia em 500√10 ≈ 1581,14 s', () => {
    near(analytic.q1.tEmpty(2), 500 * Math.sqrt(10), 1e-9, 'gabarito');
    near(emptyTime(models.q1, 2, { dt }), 1581.14, 0.5, 'T do RK4');
  });

  it('h(t) do RK4 segue (√2 − 0,0002√20·t)²', () => {
    const { ts, hs } = solve(models.q1, 2, { dt, record: true });
    for (const t of [100, 300, 600, 900, 1200, 1500]) {
      const got = hs[ts.indexOf(t)], want = analytic.q1.h(t);
      expect(Math.abs(got - want) / want, `h(${t}): obtido ${got}, esperado ${want}`).toBeLessThan(1e-4);
    }
  });

  it('convergência de ordem 4: passo pela metade, erro ~16 vezes menor', () => {
    const T = analytic.q1.tEmpty(2), err = dt => Math.abs(emptyTime(models.q1, 2, { dt }) - T);
    for (const dt of [2, 1]) {
      const ratio = err(dt) / err(dt / 2);
      expect(ratio, `dt = ${dt} → ${dt / 2}: erro caiu ${ratio.toFixed(2)} vezes`).toBeGreaterThan(14);
      expect(ratio).toBeLessThan(18);
    }
  });
});

describe('Q2 — garrafa (cm, s)', () => {
  const dt = 0.05;

  it('(a) k = (√3 − √10)/34 reproduz a tabela do livro', () => {
    const k = analytic.q2.K_BOOK;
    near(k, analytic.q2.kFromPoints(10, 3, 68), 1e-15, 'k');
    const tabela = { 10: 8.71, 20: 7.52, 30: 6.41, 40: 5.39, 50: 4.45, 60: 3.61 };
    for (const [t, h] of Object.entries(tabela)) near(levelAt(models.q2(k), 10, +t, { dt }), h, 0.01, `h(${t})`);
  });

  // instante em que o RK4 cruza 3 cm (interpolação linear dentro do passo)
  const time10to3 = k => {
    const { ts, hs } = solve(models.q2(k), 10, { dt, record: true });
    const i = hs.findIndex(h => h <= 3);
    return ts[i - 1] + (ts[i] - ts[i - 1]) * (hs[i - 1] - 3) / (hs[i - 1] - hs[i]);
  };

  it('ensaio: água k = −0,0444 leva de 10 a 3 cm em ≈ 64,4 s', () => {
    near(time10to3(-0.0444), 64.4, 0.5, 'água');
  });

  it('ensaio: óleo k = −0,0370 leva de 10 a 3 cm em ≈ 77,3 s', () => {
    near(time10to3(-0.0370), 77.3, 0.5, 'óleo');
  });
});

describe('Q3 — sistema anti-incêndio', () => {
  const dt = 0.5;

  it('com H = (√10,4 + 0,03√20)² ≈ 11,2833 m, h(600) = 10,4 m', () => {
    near(analytic.q3.H_MIN, 11.2833, 1e-4, 'H mínimo');
    near(levelAt(models.q3, analytic.q3.H_MIN, 600, { dt }), 10.4, 0.001, 'h(600)');
  });

  it('com H = 11,2 m a pressão em 600 s fica abaixo de 104 kPa', () => {
    const P = analytic.q3.pressure(levelAt(models.q3, 11.2, 600, { dt }));
    expect(P, `P(600) = ${P} kPa`).toBeLessThan(104);
  });
});

describe('Q4 — esfera', () => {
  const C = 0.0001 * Math.sqrt(20);

  it('a integral exata vale 56√2/15 = 0,0001√20·T', () => {
    near(analytic.q4.INTEGRAL, 16 * Math.SQRT2 / 3 - 8 * Math.SQRT2 / 5, 1e-12, '∫₀² (4h^½ − h^{3/2}) dh');
    near(analytic.q4.INTEGRAL / C, analytic.q4.tEmpty(2), 1e-9, 'T do gabarito');
    near(analytic.q4.tEmpty(2), 11805.84, 0.005, 'T do gabarito');
  });

  it('esvazia em ≈ 11 805,84 s', () => {
    near(emptyTime(models.q4, 2, { dt: 0.5 }), 11805.84, 5, 'T do RK4');
  });

  it('o tempo final perto de h = 0 vem da integral ∫ dh/|f|', () => {
    near(tailTime(models.q4, 2), analytic.q4.tEmpty(2), 1e-6, 'quadratura de 2 m até 0');
    near(tailTime(models.q1, 0.01), analytic.q1.tEmpty(0.01), 1e-9, 'quadratura no cilindro');
  });
});
