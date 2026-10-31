// Vazão na cena 0: A·Δh (o que some do tanque) contra a·v·Δt (o que passa pelo furo).
import { describe, it, expect } from 'vitest';
import * as sim from '../src/physics/simulations.js';
import { interval } from '../src/physics/flow.js';
import { outflowSpeed } from '../src/physics/torricelli.js';

const cfg = sim.q0;

describe('vazão em um intervalo Δt (cena 0)', () => {
  it('o modelo é A·dh/dt = −a·√(2gh) com as áreas da cena', () => {
    for (const h of [0.2, 0.5, 0.8, 1]) {
      const want = -cfg.a / cfg.A * outflowSpeed(h, cfg.g);
      expect(Math.abs(cfg.f(h) - want), `h = ${h}: obtido ${cfg.f(h)}, esperado ${want}`).toBeLessThan(1e-12);
    }
  });

  it('com Δt = 0,05 s, A·Δh e a·v·Δt batem em menos de 0,5 %', () => {
    for (const h of [0.2, 0.5, 0.8, 1]) {
      const r = interval(cfg, h, 0.05), rel = Math.abs(r.real - r.naive) / r.naive;
      expect(rel, `h = ${h}: A·Δh = ${r.real}, a·v·Δt = ${r.naive}`).toBeLessThan(0.005);
    }
  });

  it('A·Δh é o volume exato: confere com a solução fechada √h = √h0 − (a/A)·√(2g)/2·t', () => {
    const h0 = 0.8, dt = 20, r = interval(cfg, h0, dt);
    const h1 = (Math.sqrt(h0) - cfg.a / cfg.A * Math.sqrt(2 * cfg.g) / 2 * dt) ** 2;
    expect(Math.abs(r.h1 - h1) / h1, `h(20) obtido ${r.h1}, esperado ${h1}`).toBeLessThan(1e-9);
  });

  it('com v do começo a conta superestima, e a diferença cai monotonicamente com Δt', () => {
    const dts = [20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];
    for (const h of [0.2, 0.8]) {
      const diffs = dts.map(dt => interval(cfg, h, dt).diff);
      expect(diffs[0], `h = ${h}, Δt = 20 s: diferença ${diffs[0]}`).toBeGreaterThan(0);
      diffs.slice(1).forEach((d, i) =>
        expect(d, `h = ${h}: Δt = ${dts[i + 1]} deu ${d}, Δt = ${dts[i]} deu ${diffs[i]}`).toBeLessThan(diffs[i]));
    }
  });
});
