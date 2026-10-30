// Integrador RK4 para dh/dt = f(h), sem estado global.
//
// Perto de h = 0 o lado direito deixa de ser suave (√h, ou 4h − h² no denominador) e o RK4 perde
// precisão. Por isso, quando o próximo passo levaria h abaixo de hTail, o solver para de integrar
// e calcula o tempo que falta pela integral t = ∫₀ʰ du / |f(u)|, com a troca u = h·s², que tira a
// singularidade da raiz, e quadratura de Gauss–Legendre.

export function rk4Step(f, h, d) {
  const k1 = f(h), k2 = f(h + d / 2 * k1), k3 = f(h + d / 2 * k2), k4 = f(h + d * k3);
  return h + d / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
}

// nós e pesos de Gauss–Legendre em [0, 1]
function gaussLegendre(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) [p0, p1] = [p1, ((2 * k - 1) * z * p1 - (k - 1) * p0) / k];
      dp = n * (z * p1 - p0) / (z * z - 1);
      const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    x.push((1 - z) / 2); w.push(1 / ((1 - z * z) * dp * dp));
  }
  return { x, w };
}
const GL = gaussLegendre(24);

// tempo para ir de h até 0: ∫₀ʰ du / (−f(u)) = ∫₀¹ 2hs / (−f(h s²)) ds
export function tailTime(f, h) {
  if (!(h > 0)) return 0;
  let sum = 0;
  for (let i = 0; i < GL.x.length; i++) { const s = GL.x[i]; sum += GL.w[i] * 2 * h * s / -f(h * s * s); }
  return sum;
}

// nível em que ainda faltam `rest` segundos para esvaziar (inverte tailTime por bisseção)
export function levelWithTime(f, hMax, rest) {
  let lo = 0, hi = hMax;
  for (let i = 0; i < 200 && hi - lo > 1e-15 * hMax; i++) {
    const mid = (lo + hi) / 2;
    if (tailTime(f, mid) > rest) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

// integra de t = 0 até tEnd (ou até esvaziar) com passo dt; o último passo é encurtado para cair em tEnd
// retorna { t, h, tEmpty } no instante final e, com record, a trajetória { ts, hs }
export function solve(f, h0, { dt, tEnd = Infinity, hTail = 1e-3 * h0, record = false } = {}) {
  if (!(dt > 0)) throw new Error('dt precisa ser positivo');
  const ts = [0], hs = [h0];
  const out = (t, h, tEmpty) => ({ t, h, tEmpty, ...(record ? { ts, hs } : {}) });
  if (!(h0 > 0)) return out(0, 0, 0);
  let t = 0, h = h0;
  for (let i = 1; t < tEnd; i++) {
    const tn = Math.min(i * dt, tEnd);   // i·dt em vez de somar dt: sem acúmulo de arredondamento
    const hn = rk4Step(f, h, tn - t);
    if (!(hn > hTail)) {                 // perto de zero: o resto é a integral exata
      const tEmpty = t + tailTime(f, h);
      if (tEmpty <= tEnd) { if (record) { ts.push(tEmpty); hs.push(0); } return out(tEmpty, 0, tEmpty); }
      const hEnd = levelWithTime(f, h, tEmpty - tEnd);
      if (record) { ts.push(tEnd); hs.push(hEnd); }
      return out(tEnd, hEnd, tEmpty);
    }
    t = tn; h = hn;
    if (record) { ts.push(t); hs.push(h); }
  }
  return out(t, h, null);
}

// tempo para esvaziar a partir de h0
export const emptyTime = (f, h0, opts) => solve(f, h0, opts).tEmpty;

// nível no instante t (0 se já esvaziou)
export const levelAt = (f, h0, t, opts) => solve(f, h0, { ...opts, tEnd: t }).h;
