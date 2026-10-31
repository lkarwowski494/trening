# Stan audytu ćwiczeń i grafik (31.10.2026)

Gałąź: `audyt/cwiczenia-grafiki-2026-10-31` od `origin/integracja-1-1` @ 46a8f1cc. Tylko pliki `docs/audyt-cwiczen/`. Zlecenie: prompt audytu (prywatny) + aktualizacja koordynatora linii 1.1 z 31.10.2026.

## Zrobione
- Partia 1 — inwentarz: `inwentarz.md` (709 ćwiczeń, 43 rodziny). Commit: patrz `git log` tej gałęzi.

## Następna partia
- Partia 2 — 4 rodziny `ready` (squat, bench_press, hinge, pull_up; 98 ćwiczeń z figurą): pomiary vs stan zrecenzowany e796c7ed, karta a rysunek, zestawy ogólne.

## Jak podjąć
- Worktree: `git worktree add ../audyt-acg origin/audyt/cwiczenia-grafiki-2026-10-31`, `ln -s /home/user/trening/node_modules`.
- Pomiary: skrypty audytora ładują moduły TS jak `scripts/strona/ts-loader.mjs` (transpileModule); porównanie z drugim worktree na e796c7ed (stan zrecenzowany 1.0.1).
