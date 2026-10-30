"""Leitura de quadros de vídeo via ffmpeg (sem dependência de OpenCV)."""
import subprocess
import json
import numpy as np


def dimensoes(caminho):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "json", caminho],
        capture_output=True, text=True, check=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]


def quadro(caminho, t_s):
    """Um quadro RGB (H x W x 3, uint8) no instante t_s."""
    w, h = dimensoes(caminho)
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(t_s), "-i", caminho,
         "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3)


def quadros(caminho, fps):
    """Gera (t_s, quadro RGB) amostrando o vídeo a `fps` quadros por segundo."""
    w, h = dimensoes(caminho)
    n = w * h * 3
    p = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", caminho, "-vf", f"fps={fps}",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    i = 0
    try:
        while True:
            b = p.stdout.read(n)
            if len(b) < n:
                break
            yield i / fps, np.frombuffer(b, np.uint8).reshape(h, w, 3)
            i += 1
    finally:
        p.stdout.close()
        p.wait()
