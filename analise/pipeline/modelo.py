"""Modelo dh/dt = k·√h  ⇒  √h(t) = √h0 + (k/2)·t  e o ajuste de k."""
import numpy as np


def h_modelo(t, k, h0=10.0):
    s = np.sqrt(h0) + k / 2 * np.asarray(t, float)
    return np.where(s > 0, s, 0.0) ** 2


def k_por_dois_pontos(h0, h1, T):
    """k a partir do tempo T para ir de h0 a h1 (a conta da questão 2a)."""
    return 2 * (np.sqrt(h1) - np.sqrt(h0)) / T


def instante_cruzamento(t, h, nivel):
    """Primeiro instante em que h cruza `nivel` (interpolação linear)."""
    t, h = np.asarray(t, float), np.asarray(h, float)
    i = np.where(h <= nivel)[0]
    if not len(i) or i[0] == 0:
        return np.nan
    i = i[0]
    return t[i - 1] + (h[i - 1] - nivel) / (h[i - 1] - h[i]) * (t[i] - t[i - 1])


def ajustar(t, h, h0=10.0, h1=3.0):
    """Ajusta k entre h0 e h1. Retorna t0 (cruzamento de h0) e duas estimativas de k.

    - k_dois_pontos: só os tempos em h0 e h1 (como no livro).
    - k_minimos_quadrados: reta √h × t usando todos os pontos entre h0 e h1,
      com o R² da reta (perto de 1 = o modelo √h descreve bem os dados).
    """
    t, h = np.asarray(t, float), np.asarray(h, float)
    t0 = instante_cruzamento(t, h, h0)
    t1 = instante_cruzamento(t, h, h1)
    k2 = k_por_dois_pontos(h0, h1, t1 - t0)
    m = (h <= h0) & (h >= h1) & (t >= t0)
    x, y = t[m] - t0, np.sqrt(h[m])
    incl, inter = np.polyfit(x, y, 1)
    r2 = 1 - np.sum((y - (incl * x + inter)) ** 2) / np.sum((y - y.mean()) ** 2)
    return {"t0_s": float(t0), "T_h0_h1_s": float(t1 - t0), "k_dois_pontos": float(k2),
            "k_minimos_quadrados": float(2 * incl), "r2_sqrt_h": float(r2)}


def tempos_por_marca(t, h, t0, marcas):
    return {int(m): float(instante_cruzamento(t, h, m) - t0) for m in marcas}
