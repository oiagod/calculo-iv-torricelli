// Vazão em um intervalo Δt: o volume que passa pelo furo e o volume que some do tanque.
//
// Em Δt passa pelo furo a·v·Δt, qualquer que seja a trajetória do jato depois. O que exige dt é outra
// coisa: v = √(2gh) muda à medida que h cai. Com v fixo no valor do começo, a·v₀·Δt superestima o
// volume (v só diminui); o volume que realmente saiu é A·Δh, com h(Δt) dado pelo solver.
import { outflowSpeed } from './torricelli.js';
import { solve } from './solver.js';

// o que acontece em [0, Δt] partindo do nível h0, no tanque { f, A, a, g } (f = dh/dt)
export function interval({ f, A, a, g }, h0, dt, steps = 400) {
  const h1 = dt > 0 ? solve(f, h0, { dt: dt / steps, tEnd: dt }).h : h0;
  const v0 = outflowSpeed(h0, g), v1 = outflowSpeed(h1, g);
  const naive = a * v0 * dt;            // conta com v constante, igual ao do começo
  const real = A * (h0 - h1);           // volume que o tanque perdeu = integral de a·v(t) em [0, Δt]
  return { h1, dh: h0 - h1, v0, v1, naive, real, diff: real > 0 ? (naive - real) / real : 0 };
}

// nível depois de τ segundos (0 ≤ τ ≤ Δt), para animar o intervalo
export const levelAfter = ({ f }, h0, tau, steps = 400) =>
  tau > 0 ? solve(f, h0, { dt: tau / steps, tEnd: tau }).h : h0;
