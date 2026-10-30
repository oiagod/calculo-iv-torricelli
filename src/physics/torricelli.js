// Lei de Torricelli: o líquido sai pelo furo com a velocidade de queda livre desde a superfície.
// Funções puras; unidades coerentes com g (m e m/s², ou cm e cm/s²).

// velocidade de saída v = √(2gh)
export const outflowSpeed = (h, g) => Math.sqrt(2 * g * Math.max(h, 0));

// taxa de variação do volume dV/dt = −a·√(2gh) (negativa: o volume diminui)
export const volumeRate = (a, h, g) => -a * outflowSpeed(h, g);
