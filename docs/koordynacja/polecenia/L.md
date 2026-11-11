# Sesja L: zadania figur przed wydaniem 1.1 (docs/49 W-02) — Trening
Koordynator: session_01T66VBxZrKCwRyMgDwdWZ2N. Raporty, PYTANIE i PRZEKAZANIE przez `mcp__claude-code-remote__send_message` z `session_id` = to ID (ToolSearch; nie ListAgents). Zmiana koordynatora → pisz do nowego. Gałąź `koordynacja` tylko do odczytu.

1. Rola: 08-programista build. Prompt roli w pierwszej wiadomości po `=== PROMPT ROLI ===`. Pierwszeństwo ma CLAUDE.md (bramka 4 figur, L-047 autor ≠ recenzent, L-050 ślad toru, hierarchia źródeł).
2. Start: gałąź `figury/w02-przed-1-1` od `origin/integracja-1-1` @ 5721a16e (inny HEAD: zgłoś). `git fetch --unshallow`, `npm ci`. Tożsamość commitów według CLAUDE.md.
3. Zadania — wiersz W-02 w `docs/49-wydanie-1-1.md` i sekcja „Zadania przed wydaniem 1.1” w `git show origin/koordynacja:docs/koordynacja/stan.md`:
   1. Straight Raises on Incline Bench (delt): kolana do tyłu, siedzisko przenika 6 cm — poprawka pozy + recenzja niezależna (subagent audytor, arkusz ze śladem toru).
   2. `fidr.move` (Front Incline DB Raise) → cel +1.
   3. Dług `ROZJAZDY_POZA_ZAKRESEM` (tests/figury-generator-odtwarza.test.ts) — spłata albo wpis z powodem.
   4. Silnik: punkty dźwigni barki/uda (calf), `gear.ts` obrót dzwonu (kettlebell).
   5. P3-MARSZ, PP-W1 (Plyo) — opis w docs/21/docs/18 (grep).
   6. Badacz (subagent badacz-merytoryczny): `lokcie_pod_dlonmi` w środku toru ohp, glute_floor, pewność reguł mobility_floor/kneeling_hinge — wynik w docs/research z przeczytanymi źródłami; zmiana reguły tylko gdy źródła tego wymagają.
   Kryterium „gotowe” każdego: test (czerwony przed, zielony po) albo wpis z powodem w docs/18/docs/21; zmienione rysunki z recenzją niezależną; kolumna „Stan” W-02 w docs/49 z datą i dowodem.
   7. `npm run verify:szybkie` kod 0 (wynik do pliku), push, zielony `tests.yml` na głowie.
4. Zakazy: nie scalasz do integracji ani main; nie tworzysz/archiwizujesz sesji; nie piszesz na `koordynacja`; nie zmieniasz workflowów; nigdy --no-verify ani force-push; bez AskUserQuestion; bez przekładu API, TestFlight, ASC. Pliki verify/jest (`scripts/jest-ponow*`, `package.json` jest) należą do sesji M — nie ruszaj.
5. Decyzje: tryb „analogia” — rekomendacja, wpis z datą w docs/18 (odrzucone warianty), „do weta” w raporcie; merytoryka wg hierarchii źródeł.
6. Kontekst i koszt: od 30% okna — `docs/przekazanie/notatki/linia-1-1/STAN-W02.md`, push, PRZEKAZANIE. Pułap 30 USD; po 39 USD PRZEKAZANIE.
7. Push zbiorczo (po verify:szybkie).
8. Raporty (≤ 10 linii): po zadaniu 1 — czas i szacunek reszty; PYTANIE z opcjami; PRZEKAZANIE: SHA, run, dowody, decyzje do weta, otwarte.
