# Sesja K: PR na `main` z samymi poprawkami nocnych testów (KO-032) — Trening
Koordynator: session_01T66VBvYE2fFbozZur4zSyE. Raporty, PYTANIE i PRZEKAZANIE przez `mcp__claude-code-remote__send_message` z `session_id` = to ID (ToolSearch; nie ListAgents). Zmiana koordynatora → pisz do nowego. Gałąź `koordynacja` tylko do odczytu.

1. Rola: 08-programista build. Prompt roli w pierwszej wiadomości po `=== PROMPT ROLI ===`. Pierwszeństwo ma CLAUDE.md (przeczytaj najpierw; zwłaszcza „Model pracy po L-001 — przebieg dowodowy CI” i L-087 „cały workflow zielony”).
2. Start: `git fetch --unshallow`; gałąź `ci/nocne-poprawki-main` od `origin/main` (@ 2e4b0f82 — inny HEAD: zgłoś). Tożsamość commitów według CLAUDE.md.
3. Zadanie (właściciel 10.11.2026 20:45 UTC: „PR z poprawkami CI (Rekomendowane)”):
   1. Przeczytaj `git show origin/koordynacja:docs/koordynacja/archiwum/nocne-diagnoza.md` (tabela przyczyn, kolumna „Poprawka istnieje?” — SHA na integracja-1-1, m.in. 58d36cc3, fbfe6211, 2fe8bc89, 983d44e8, 944d4e00; skróty mogą być niepełne — znajdź pełne przez `git log origin/integracja-1-1`). Sprawdź, czy od 09.11 nie doszły kolejne przyczyny (ostatnie przebiegi nightly.yml na main: actions_list).
   2. Przenieś na gałąź tylko poprawki CI/skryptów/testów/scenariuszy z diagnozy (cherry-pick; konflikt → rozwiązanie minimalne dla stanu main, każde opisane). Zero zmian kodu aplikacji (`app/`, `lib/`, `components/`) — jeśli poprawka ich wymaga, PYTANIE. Testów nie osłabiasz.
   3. `npm run verify:lekkie` 0; push gałęzi; przebieg dowodowy: `nightly.yml` przez `workflow_dispatch` na tej gałęzi (jeśli workflow tego nie pozwala — PYTANIE z opcjami). Zaliczony tylko, gdy CAŁY przebieg zielony (L-087); czerwony z innej przyczyny → diagnoza (końcówka logu), poprawka albo PYTANIE.
   4. Po zielonym: PR do `main` (szablon PR repo, opis zmian i run ID; stopka z CLAUDE.md/systemu). NIE scalasz — scalenie do main wymaga osobnej zgody właściciela przez koordynatora.
   5. Kryterium „gotowe”: PR otwarty, run ID zielonego nightly na głowie gałęzi, lista przeniesionych commitów z przyczyną z diagnozy.
4. Zakazy: nie scalasz do `main` ani integracji; nie tworzysz/archiwizujesz sesji; nie piszesz na `koordynacja`; workflowy zmieniasz tylko w zakresie poprawek z diagnozy; nigdy --no-verify ani force-push; bez AskUserQuestion; bez TestFlight/App Store Connect.
5. Decyzje: tryb „analogia” — rekomendacja, wpis w docs/18 na gałęzi do weta.
6. Kontekst i koszt: od 30% okna — stan w `docs/przekazanie/notatki/STAN-CI-NOCNE-MAIN.md`, push, PRZEKAZANIE. Pułap 25 USD; po 32,5 USD PRZEKAZANIE.
7. Raporty (≤ 10 linii): po cherry-picku (lista, konflikty); PYTANIE z opcjami; PRZEKAZANIE: SHA, run, PR, otwarte.
