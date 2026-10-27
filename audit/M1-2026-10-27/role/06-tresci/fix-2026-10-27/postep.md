# 06-tresci fix p2 — postęp (M1-audytor-generalny-005; 06-tresci-001)

Stan: **ZAKOŃCZONE 27.10.2026** — wynik: `wynik.md`; commit 562798d na gałęzi `worktree-agent-a61045dbe650f8b51` (kopia robocza /home/user/trening/.claude/worktrees/agent-a61045dbe650f8b51, baza naprawy/M2-koordynator-napraw-2026-10-27-p1 = 862f119). Nie wypchnięte.

## Etapy
1. Recenzja 56 figur v1 — zrobione (dowody/podglady-przed, dowody/karty, dowody/tory-przed.txt, dowody/poslizg-przed.txt).
2. Testy przed kodem (czerwone) — zrobione (dowody/jest-przed.txt).
3. Mechanizm: zapis docs/research/figury-recenzja.json, przepuszczanie w scripts/zrodla-runtime.mjs, strażnik tests/figury-recenzja.test.tsx — zrobione.
4. Poprawki 21 figur (solver narzedzia/solver.mjs → out/*.json → narzedzia/naloz.py), 2 ukryte — zrobione (dowody/podglady-po, dowody/metryki-po.json).
5. Testy po — zielone (dowody/jest-po-pelny.txt); dokumenty: 28-figury (generowany), BRD, L-042.

## Jak wznowić / powtórzyć
- Podgląd: `node --experimental-strip-types narzedzia/render-v1.mjs <repo> <wyj> dowody/lista-v1.txt` + `python3 -I narzedzia/rysuj.py <wyj>` (CAND=plik.json nakłada kandydata).
- Skróty do zapisu: `node scripts/zrodla-runtime.mjs --skroty`; zapis budował `narzedzia/zapis.py` (notatki recenzenta).

## Otwarte (decyzje i kroki — wynik.md)
Push Press i Pendlay Row ukryte (1.0 czy 1.0.1); warunek recenzji w eksporcie strony techniqueatlas; README do regeneracji po scaleniu; E2E 17 + zrzut z symulatora (rola 07).
