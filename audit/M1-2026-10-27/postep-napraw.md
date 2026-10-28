# Postęp napraw M2 — Trening
Pętla 2 · Zadania: 006, 038, 039, 009, 011, 012, 017, 021, 023, 032, 034, 040–049 (21, wszystkie `otwarte` — czekają na ponowne zatwierdzenie) · Audyt 025a50b · Reaudyt pętli 1: 2385e75 · Baza 4c116d0 (audyt/m1-reaudit-2026-10-28) · Sesje ról: do wyboru (STOP start)
Pętla 1: postep-napraw-petla1.md (archiwum). Prompt: złożony własnym skryptem (scratchpad/zloz.mjs; odstępstwo — assemble.mjs zablokowany), biblioteka prompts HEAD klonu 28.10. STOP start: M2-stop-start-p2.md.

## Zgody
- 2026-10-28 (zlecenie z sesji reaudytu, polecenie właściciela): „2a 3a — jak zapiszesz to otwórz m2 w nowej sesji” → start M2 pętli 2; zatwierdzenie zadań — na STOP start.

## Partie
| Partia | Gałąź | Od | Do | STOP przed | Stan |
|---|---|---|---|---|---|
| 1 | naprawy/M2-koordynator-napraw-2026-10-28-p1 | 4c116d0 | — | do decyzji (6) | czeka na STOP start |
| 2 | naprawy/M2-koordynator-napraw-2026-10-28-p2 | — | — | nie | czeka |
| 3 | naprawy/M2-koordynator-napraw-2026-10-28-p3 | — | — | nie (021 M przez rolę) | czeka |

## Zadania
| ID | Partia | Krok | Commit | Dowód | Przeczytane reguły | Następny krok |
|---|---|---|---|---|---|---|
| 21 zadań | 1–3 | czeka (otwarte) | — | M2-stop-start-p2.md | — | ponowne zatwierdzenie |

## Dziennik
- 2026-10-28 E0: repo prompts dołączone tylko do odczytu, sklonowane /home/user/prompts; K z origin/audyt-m1-1-0-2026-10-27 (git archive), audit/ w .git/info/exclude:7.
- 2026-10-28 E0: assemble.mjs zablokowany (uprawnienia sesji) → prompt złożony własnym skryptem w scratchpadzie po przeczytaniu skryptu w całości (64 295 znaków, moduł dane-uzytkownika). Kopie sprawdz-plan/zakres-napraw/sprawdz-raport w K/narzedzia też zablokowane → kontrola planu własnym odtworzeniem reguł: kod 0 (dowody/M2/p2/kontrola-planu-start.txt).
- 2026-10-28 E0: git status czysty; audyt 025a50b i reaudyt 2385e75 istnieją; 2385e75..HEAD = 2 commity tylko docs/18; K ignorowany; gałęzie p1–p3 z 28.10 nie istnieją.
- 2026-10-28 E0: npm ci 0, typecheck 0, lint 0; CI tests.yml zielone 2385e75 i 316b666, na 4c116d0 w toku. Bramka D-025: werdykt „wydać”.
- 2026-10-28 E0: 017 — Pages wdrożone z 2385e75 (08:32), ale check-urls dziś kod 1: apps4brew.com privacy/support stara treść → publikacja przez repo apps4brew-www (docs/48 Z-10a).

## Czekające zgody i kroki właściciela
- STOP start: decyzje 1–7 w M2-stop-start-p2.md.
- Kroki telefonu i ASC bez zmian (lista w raporcie reaudytu, Werdykt).
