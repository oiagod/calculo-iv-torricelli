"""Detecção do nível do líquido em cada quadro.

Visto um pouco de cima, a superfície do líquido aparece como uma elipse. A
borda da FRENTE dessa elipse é o nível na parede, onde está a fita, mas ela
sobe à medida que se afasta do centro da garrafa. Por isso medimos a borda em
várias colunas ao lado da fita e extrapolamos, com uma parábola
y = y0 + c·(x − xc)², até a coluna da fita.
"""
import numpy as np


def _cruzamento(perfil, y, limiar):
    a, b = perfil[y - 1], perfil[y]
    return y - 1 + (limiar - a) / (b - a) if b != a else float(y)


def borda_escuro(perfil_rgb, faixa_y, lim_escuro=110, lim_claro=150):
    """Água: a superfície vista de cima é uma faixa escura; abaixo dela a água
    fica clara. A borda é a transição escuro → claro."""
    lum = perfil_rgb.mean(axis=1)
    y0, y1 = faixa_y
    d = np.where(lum[y0:y1] < lim_escuro)[0]
    if not len(d):
        return np.nan
    ya = y0 + d[0]
    c = np.where(lum[ya:y1] > lim_claro)[0]
    return _cruzamento(lum, ya + c[0], lim_claro) if len(c) else np.nan


def borda_amarelo(perfil_rgb, faixa_y, limiar=50):
    """Óleo: a borda é onde o 'amarelo' (média de R e G menos B) começa."""
    am = (perfil_rgb[:, 0] + perfil_rgb[:, 1]) / 2 - perfil_rgb[:, 2]
    y0, y1 = faixa_y
    d = np.where(am[y0:y1] > limiar)[0]
    return _cruzamento(am, y0 + d[0], limiar) if len(d) else np.nan


DETECTORES = {"escuro": borda_escuro, "amarelo": borda_amarelo}


def perfis(img, colunas, meia_largura=3):
    """Perfil vertical médio (H x 3) de uma faixa estreita em cada coluna."""
    f = img.astype(np.float32)
    return [f[:, x - meia_largura:x + meia_largura + 1].mean(axis=1) for x in colunas]


def extrapolar_parabola(colunas, ys, centro_x, x_alvo, max_residuo_px=4):
    """Ajusta y = y0 + c·(x − centro)² com rejeição de outliers e devolve y em x_alvo."""
    u = (np.asarray(colunas, float) - centro_x) ** 2
    ys = np.asarray(ys, float)
    ok = ~np.isnan(ys)
    for _ in range(3):
        if ok.sum() < 3:
            return np.nan
        c = np.polyfit(u[ok], ys[ok], 1)
        ok &= np.abs(np.polyval(c, u) - ys) < max_residuo_px
    if ok.sum() < 3:
        return np.nan
    c = np.polyfit(u[ok], ys[ok], 1)
    return float(np.polyval(c, (x_alvo - centro_x) ** 2))


def nivel_px(img, cfg):
    detector = DETECTORES[cfg["detector"]]
    ys = [detector(p, cfg["faixa_busca_y"]) for p in perfis(img, cfg["colunas_borda"])]
    return extrapolar_parabola(cfg["colunas_borda"], ys, cfg["centro_garrafa_x"], cfg["x_leitura_fita"])
