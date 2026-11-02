// Cena 2, aba "Por que parou?": as contas de ordem de grandeza do texto.
import { describe, it, expect } from 'vitest';
import { pushPressure, holdPressure, stopHeight } from '../src/physics/capillary.js';

describe('película na boca do furo (furo de 4 mm, água)', () => {
  it('a coluna de água empurra ≈ 10 Pa por milímetro', () => {
    expect(pushPressure(1)).toBeCloseTo(9.8, 6);
  });
  it('a película segura até 2γ/r = 72 Pa com r = 2 mm', () => {
    expect(holdPressure(0.002)).toBeCloseTo(72, 6);
  });
  it('isso equivale a ~7 mm de água', () => {
    const h = stopHeight(0.002);
    expect(h, `obtido ${h} mm`).toBeGreaterThan(7);
    expect(h).toBeLessThan(7.5);
  });
});
