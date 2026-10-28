# Plan reaudytu M1 — Trening — 2026-10-29 (pętla 2)
Commit badany: 0a566a1848bc44139f27ec2f3fcdc3e49922f901 (naprawy/duzy-tekst-trening = main 5d79c3a + naprawa dużego tekstu PR #83; HEAD odłączony) · Baza: 4c116d0 · Tryb: reaudit · Pętla: 2 (w planie 1 wpis `reaudyty`).
Zakres: zatwierdzony z góry decyzją właściciela 28.10.2026 (tryb nocny, docs/18-przekazanie.md:641; wariant A jak w pętli 1) — 20 zadań `naprawione-do-weryfikacji` + 039 (`zatwierdzone`, E2E czeka) + cała różnica 4c116d0..0a566a1 (175 plików, 60 commitów) + próbka regresji. 033 i 036 — poza pętlą, tylko wypisane. STOP 1 bez czekania (decyzja nocna).

## E0
- `git status --porcelain` na starcie pusty (wspolne/git-status-start.txt); npm ci, typecheck, lint — kod 0 (wspolne/).
- Pełny Jest `--maxWorkers=1` (jedyny pełny przebieg; część roli 07) — w tle, wynik w 07-jakosc/dowody/jest-pelny.txt.

## Grupy ról (odstępstwo: biblioteka promptów niedostępna — 4 grupy zamiast 12 ról, briefy własne, wspolne/ustalenia.md)
| Grupa (raport) | Role pętli 1 | Zadania planu | Różnica (pliki) | Tokeny (od–do) |
|---|---|---|---|---|
| 06-tresci | 06, 03 | 038, 021 | lib/figures (hinge, benchPress, figure.ts V2_WSTRZYMANE, ui, cue-sets), data/zrodla, lib/cues, rejestr twierdzeń, figury-recenzja, tor-wyjatki, #84 | 0,4–0,8 mln |
| 04-studio-projektowe | 04, 11 | 039, 011, 043, 044 | components/* (AppText, PR #83), app/*, eslint.config.js, .maestro 21 | 0,4–0,8 |
| 02-monetyzacja | 02, 05, 08, 12 | 046, 032, 042, 049, 040 | lib/entitlement (9cf1c90), fairrules, boot/bootphase, units, live, board, paywall | 0,3–0,6 |
| 10-wydanie | 10, 07, 09, 01 | 006, 009, 012, 017, 023, 034, 041, 045, 047, 048 | workflows, scripts (hak, znacznik, decyzje, slowniki), store, docs/brd, docs/16/18/21/39/40/48, docs/lokalizacja | 0,4–0,8 |
| weryfikacja przeciwna (kandydaci P0/P1) | | | | 0–0,6 |
| M1 (E0, scalanie, raport, plan, pełny Jest) | | | | 0,3–0,5 |
| **Razem** | | | | **1,8–4,1 mln** |
Subagenci: 4 naraz (limit maszyny współdzielonej), testy celowane `--maxWorkers=1`.
Kandydaci P0/P1: weryfikacja przeciwna (świeży agent) → od razu send_message do M2 pętla 2 + kopia do koordynatora.
