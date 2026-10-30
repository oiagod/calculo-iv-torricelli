"""Calibração pixel → cm a partir das marcas da fita colada na garrafa."""
import numpy as np
from scipy.signal import find_peaks


def detectar_marcas(img, coluna, faixa_y, n_marcas, min_dist_px=15):
    """Linhas (y, em px) dos traços da fita, de cima para baixo.

    Os traços são pixels escuros numa coluna estreita; cada traço vira um pico
    no perfil de 'escuridão'. Retorna os `n_marcas` primeiros picos.
    """
    cinza = img.astype(float).mean(axis=2)
    y0, y1 = faixa_y
    x0, x1 = coluna
    escuridao = 255 - cinza[y0:y1, x0:x1].min(axis=1)
    picos, _ = find_peaks(escuridao, height=escuridao.mean() + 25, distance=min_dist_px)
    picos = picos + y0
    if len(picos) < n_marcas:
        raise ValueError(f"Encontrei {len(picos)} marcas, esperava {n_marcas}.")
    return picos[:n_marcas]


def ajustar_escala(y_marcas, marca_superior_cm):
    """Reta h_cm = a·y + b ajustada às marcas (12, 11, ..., 1).

    Retorna (a, b) e o resíduo máximo em cm, que serve de checagem.
    """
    y = np.asarray(y_marcas, float)
    h = marca_superior_cm - np.arange(len(y))
    a, b = np.polyfit(y, h, 1)
    residuo = np.abs(a * y + b - h).max()
    return float(a), float(b), float(residuo)
