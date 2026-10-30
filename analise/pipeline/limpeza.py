"""Limpeza da série h(t): remove picos de detecção e impõe que o nível só desce."""
import numpy as np
from scipy.signal import medfilt
from sklearn.isotonic import IsotonicRegression


def limpar(h, janela=9):
    h = np.asarray(h, float)
    t = np.arange(len(h))
    ok = ~np.isnan(h)
    h = np.interp(t, t[ok], h[ok])                 # preenche falhas pontuais
    m = medfilt(h, janela)                           # remove picos isolados
    m[: janela // 2] = h[: janela // 2]
    m[-(janela // 2):] = h[-(janela // 2):]
    return IsotonicRegression(increasing=False).fit_transform(t, m)  # nível nunca sobe
