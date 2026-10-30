"""Executa o pipeline completo.

Uso:
  python run.py                 # processa os vídeos (precisa de videos/agua.mp4 e videos/oleo.mp4)
  python run.py --sem-video     # refaz só o ajuste a partir de dados/*_nivel.csv
"""
import argparse
import csv
import json
from pathlib import Path

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw

from pipeline import video, calibracao, nivel, limpeza, modelo

RAIZ = Path(__file__).parent
DADOS, FIG = RAIZ / "dados", RAIZ / "figuras"
CORES = {"agua": "#3E8E84", "oleo": "#C98A1A"}


def extrair(chave, cfg, fps):
    caminho = str(RAIZ / cfg["video"])
    img = video.quadro(caminho, cfg["quadro_calibracao_s"])
    ys = calibracao.detectar_marcas(img, cfg["coluna_marcas"], cfg["faixa_marcas_y"], cfg["n_marcas"])
    a, b, res = calibracao.ajustar_escala(ys, cfg["marca_superior_cm"])
    print(f"[{chave}] calibração: {1/abs(a):.2f} px/cm, resíduo máx {res:.2f} cm")
    linhas = []
    for t, q in video.quadros(caminho, fps):
        ypx = nivel.nivel_px(q, cfg)
        linhas.append((t, ypx, a * ypx + b))
    with open(DADOS / f"{chave}_nivel.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["t_s", "nivel_px", "h_cm_bruto"])
        w.writerows(linhas)
    json.dump({"a": a, "b": b, "marcas_px": [int(y) for y in ys], "residuo_max_cm": res},
              open(DADOS / f"{chave}_calibracao.json", "w"), indent=2)


def ler_nivel(chave):
    with open(DADOS / f"{chave}_nivel.csv") as f:
        r = list(csv.DictReader(f))
    t = np.array([float(x["t_s"]) for x in r])
    h = np.array([float(x["h_cm_bruto"]) if x["h_cm_bruto"] not in ("", "nan") else np.nan for x in r])
    return t, h


def validar(chave, cfg, t, ypx_limpo, tempos):
    """Desenha o nível detectado sobre quadros do vídeo, para conferência visual."""
    caminho = str(RAIZ / cfg["video"])
    tiles = []
    for ts in tempos:
        im = Image.fromarray(video.quadro(caminho, ts)).copy()
        y = float(np.interp(ts, t, ypx_limpo))
        ImageDraw.Draw(im).line([(0, y), (im.width, y)], fill=(220, 30, 60), width=2)
        tiles.append(im.crop((90, 170, 400, 600)))
    w, h = tiles[0].size
    mont = Image.new("RGB", (w * len(tiles), h), "white")
    for i, tile in enumerate(tiles):
        mont.paste(tile, (i * w, 0))
    mont.save(FIG / f"validacao_{chave}.png")


def grafico(resultados, series, marcas_cm):
    fig, ax = plt.subplots(figsize=(10, 5))
    for chave, (t, h) in series.items():
        r = resultados[chave]
        tr = t - r["t0_s"]
        m = (tr >= 0) & (h > 0.5)
        ax.plot(tr[m], h[m], color=CORES[chave], lw=2, label=f"{r['nome']} medido")
        tm = np.linspace(0, 180, 400)
        ax.plot(tm, modelo.h_modelo(tm, r["k_dois_pontos"]), "--", color=CORES[chave], alpha=.6,
                label=f"{r['nome']} modelo, k = {r['k_dois_pontos']:.4f}")
    ax.set(xlim=(0, 180), ylim=(0, 10.5), xlabel="tempo desde 10 cm (s)", ylabel="h (cm)")
    ax.grid(alpha=.3)
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(FIG / "h_x_t.png", dpi=150)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sem-video", action="store_true", help="usa dados/*_nivel.csv já extraídos")
    args = ap.parse_args()
    cfg = json.load(open(RAIZ / "config.json"))
    DADOS.mkdir(exist_ok=True)
    FIG.mkdir(exist_ok=True)
    mod = cfg["modelo"]
    resultados, series = {}, {}

    for chave, fc in cfg["fluidos"].items():
        if not args.sem_video:
            extrair(chave, fc, cfg["fps_amostragem"])
        t, h_bruto = ler_nivel(chave)
        h = limpeza.limpar(h_bruto)
        r = modelo.ajustar(t, h, mod["h_inicial_cm"], mod["h_final_ajuste_cm"])
        r["nome"] = fc["nome"]
        r["tempos_por_marca_s"] = modelo.tempos_por_marca(t, h, r["t0_s"], mod["marcas_relatorio_cm"])
        resultados[chave], series[chave] = r, (t, h)
        print(f"[{chave}] 10→3 cm em {r['T_h0_h1_s']:.1f} s | k = {r['k_dois_pontos']:.4f} "
              f"(mín. quadrados {r['k_minimos_quadrados']:.4f}, R² √h = {r['r2_sqrt_h']:.4f})")
        if not args.sem_video:
            cal = json.load(open(DADOS / f"{chave}_calibracao.json"))
            ypx = (h - cal["b"]) / cal["a"]
            t0 = r["t0_s"]
            validar(chave, fc, t, ypx, [t0 + 5, t0 + 30, t0 + 60, t0 + 85])

    json.dump(resultados, open(DADOS / "resultados.json", "w"), indent=2, ensure_ascii=False)
    with open(DADOS / "tempos_por_marca.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["marca_cm"] + [f"{c}_s" for c in resultados])
        for m in mod["marcas_relatorio_cm"]:
            w.writerow([m] + [round(resultados[c]["tempos_por_marca_s"][m], 1) for c in resultados])
    grafico(resultados, series, mod["marcas_relatorio_cm"])
    print("Pronto: dados/resultados.json, dados/tempos_por_marca.csv, figuras/")


if __name__ == "__main__":
    main()
