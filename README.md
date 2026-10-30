# Simulador da Lei de Torricelli — Cálculo IV

[![tests](https://github.com/OWNER/REPO/actions/workflows/tests.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/tests.yml)

Simulador 3D de esvaziamento de tanques para a apresentação de Cálculo IV: Lei de Torricelli,
cilindro (Q1), garrafa com água e óleo (Q2), sistema anti-incêndio (Q3) e esfera (Q4).

## Como abrir

O app não tem build: é um `index.html` com as bibliotecas em `vendor/`, e funciona offline.

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `index.html` | palco 3D, painel e cenas |
| `src/physics/` | física em funções puras: Torricelli, EDO de cada questão, RK4, soluções analíticas e a tabela h(t) que a animação lê |
| `docs/decisoes.md` | registro das decisões técnicas |
| `scenes/` | enunciados e passos da apresentação de cada questão |
| `slides/`, `media/` | slides exportados do Keynote e o vídeo do ensaio |
| `analise/` | pipeline em Python que mede o nível nos vídeos e ajusta o `k` ([README](analise/README.md)) |
| `tests/` | testes da física: o RK4 contra as respostas calculadas à mão |

## Testes

```bash
npm ci && npm test                                         # física do simulador (Vitest)
pip install -r analise/requirements.txt && pytest analise/tests   # análise dos vídeos
```

Os dois rodam no GitHub Actions a cada push (`.github/workflows/tests.yml`).
