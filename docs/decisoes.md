# Decisões

## 2026-10-30 — O app lê h(t) de uma tabela em vez de integrar por quadro

**Sintoma.** Na Q1 (cilindro), o aviso "Tanque vazio" mostrava cerca de 1578 s, e não os 500√10 ≈ 1581,14 s da
solução analítica. O valor mudava conforme a taxa de quadros (1578,0 s no navegador; 1579,3 s com quadros fixos).

**Causa.** O app integrava a EDO a cada quadro, em subpassos de até 0,5 s, e dava o tanque por vazio quando
h ≤ 1e-5, estimando o instante final com uma reta no último subpasso. Na Q1, h está em metros: de 1e-5 m ainda
faltam ~3,5 s, e perto do fundo h cai de forma quadrática, então a reta erra. Como o último subpasso dependia de
dt × velocidade, o erro dependia também da taxa de quadros.

**Correção.** A EDO é resolvida uma vez, ao iniciar a cena ou mudar parâmetros (`timeline` em
`src/physics/playback.js`): RK4 em passo fino (0,05 s; 0,005 s na garrafa) e, perto de h = 0, o tempo restante
pela integral exata ∫dh/|f(h)| (`tailTime` em `src/physics/solver.js`). A cada quadro o app só avança o relógio e
lê h(t_sim) da tabela com interpolação (`advanceRun`). O "Esvazia em" e o instante final vêm do solver. As
configurações de cada cena ficam em `src/physics/simulations.js`, usadas pelo app e pelos testes.

**Proteção.** `tests/playback.test.js` percorre o mesmo caminho do app com quadros de 16 ms em ×100 e confere
1581,14 s na Q1 e 11 805,84 s na Q4. Também verifica que ×1, ×10, ×1000 e quadros irregulares dão exatamente o
mesmo instante.
