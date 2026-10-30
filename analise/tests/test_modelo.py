"""Testes do ajuste com dados sintéticos de k conhecido."""
import numpy as np
from pipeline import modelo, limpeza, nivel


def test_k_livro_questao_2a():
    # 10 cm → 3 cm em 68 s: k = (√3 − √10)/34
    k = modelo.k_por_dois_pontos(10, 3, 68)
    assert abs(k - (np.sqrt(3) - np.sqrt(10)) / 34) < 1e-12
    # tabela da questão 2(a)
    esperado = [8.71, 7.52, 6.41, 5.39, 4.45, 3.61]
    obtido = modelo.h_modelo([10, 20, 30, 40, 50, 60], k)
    assert np.allclose(obtido, esperado, atol=0.01)


def test_ajuste_recupera_k_com_ruido():
    rng = np.random.default_rng(0)
    k_real = -0.0444
    t = np.arange(0, 200, 0.25)
    h = modelo.h_modelo(t - 14.0, k_real)          # começa em 10 cm em t = 14 s
    h[t < 14] = 10 + (14 - t[t < 14]) * 0.1       # trecho antes de soltar
    h_ruido = h + rng.normal(0, 0.05, len(h))
    r = modelo.ajustar(t, limpeza.limpar(h_ruido))
    assert abs(r["k_minimos_quadrados"] - k_real) / abs(k_real) < 0.02
    assert abs(r["t0_s"] - 14.0) < 0.5
    assert r["r2_sqrt_h"] > 0.999


def test_limpeza_e_monotona_e_remove_pico():
    h = np.linspace(10, 0, 100)
    h[50] = -5                                       # falha de detecção
    hl = limpeza.limpar(h)
    assert np.all(np.diff(hl) <= 1e-9)
    assert abs(hl[50] - h[49]) < 0.3


def test_parabola_extrapola_para_o_centro():
    xc, y0, c = 222, 400.0, 0.002
    cols = [262, 270, 278, 286, 294, 302, 310]
    ys = [y0 + c * (x - xc) ** 2 for x in cols]
    ys[2] += 30                                      # um outlier
    assert abs(nivel.extrapolar_parabola(cols, ys, xc, 219) - (y0 + c * 9)) < 0.5
