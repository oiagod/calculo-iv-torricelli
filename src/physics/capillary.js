// Por que a garrafa para de pingar com água ainda acima do furo: empurrão da coluna × película na boca do furo.
// Funções puras em unidades SI; a altura entra em milímetros, como no ensaio.

export const RHO_WATER = 1000;     // kg/m³
export const GAMMA_WATER = 0.072;  // tensão superficial da água, N/m
export const G = 9.8;              // m/s²

// pressão da coluna de água acima do furo: ρ·g·h (Pa), com h em mm
export const pushPressure = (hMm, rho = RHO_WATER, g = G) => rho * g * hMm / 1000;

// teto da pressão que a película curva segura (Young-Laplace para meia-esfera): 2γ/r (Pa), com r em m
export const holdPressure = (r, gamma = GAMMA_WATER) => 2 * gamma / r;

// altura (mm) abaixo da qual o empurrão não vence a película
export const stopHeight = (r, gamma = GAMMA_WATER, rho = RHO_WATER, g = G) => 1000 * holdPressure(r, gamma) / (rho * g);
