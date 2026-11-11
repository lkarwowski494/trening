# Sesja N: scalenie PR #108 do `main` (poprawki nocnych testów) — Trening
Koordynator: session_01T66VBxZrKCwRyMgDwdWZ2N. Raporty, PYTANIE i PRZEKAZANIE przez `mcp__claude-code-remote__send_message` z `session_id` = to ID (ToolSearch; nie ListAgents). Zmiana koordynatora → pisz do nowego. Gałąź `koordynacja` tylko do odczytu.

1. Rola: 08-programista build. Prompt roli w pierwszej wiadomości po `=== PROMPT ROLI ===`. Pierwszeństwo ma CLAUDE.md (przeczytaj najpierw).
2. Start: `git fetch --unshallow`; gałąź `ci/nocne-poprawki-main` @ fd636db5 (= PR #108; inny HEAD: zgłoś). Usuń lokalne tagi spoza historii main, jeśli fetch je pobrał (`git tag --no-merged origin/main | xargs -r git tag -d` — tylko lokalnie; powód: lekcja K). `npm ci`. Tożsamość commitów według CLAUDE.md.
3. Zgoda właściciela (2026-11-11 ~06:20 UTC): „Zgoda na scalenie PR #108.”; droga wybrana przez właściciela: „Sesja + pełne verify”. Ta zgoda obejmuje TYLKO scalenie tej gałęzi do `main` przez `scal-galaz` po krokach niżej.
4. Zadania:
   1. Wstaw lekcję K: `git show origin/koordynacja:docs/koordynacja/przekazane/K-lekcja-L-NNN.md` — sekcja od `## L-NNN` do końca, w `docs/40-lekcje.md` przed „## L-067” (dosłownie). Nadaj numer: `node scripts/numeruj-lekcje.mjs`. Commit (tylko docs/40).
   2. Pełne `npm run verify` (pod `flock` jak w CLAUDE.md, wynik do pliku, zadanie w tle z limitem ≥ 2 h). Kod 0 → znacznik `pelne` zapisze się sam. Kod ≠ 0: jeśli przyczyna to wyłącznie SIGTERM workera Jest albo artefakt tagów (lekcja K) — jedna ponowna próba; drugi czerwony → PYTANIE do koordynatora (nie zapisuj znacznika ręcznie, nie scalaj). Każdy inny czerwony → diagnoza i PYTANIE.
   3. Push gałęzi; czekaj na zielony `tests.yml` dla głowy (actions_list/actions_get).
   4. `NODE_USE_ENV_PROXY=1 node scripts/scal-galaz.mjs ci/nocne-poprawki-main --do main` (w tym samym kontenerze, gdzie jest znacznik); kod 3 = CI w toku → czekaj i ponów. Po scaleniu `git push origin main` (hak wymaga `pelne` dla drzewa — jeśli drzewo scalenia różni się od zweryfikowanego, PYTANIE). Sprawdź, że PR #108 ma stan merged/closed.
   5. Gotowe: `git ls-remote origin main` = SHA scalenia, PR #108 zamknięty, run tests.yml na main po scaleniu (status).
5. Zakazy: żadnych innych zmian na main; nie scalasz do integracji; nie tworzysz/archiwizujesz sesji; nie piszesz na `koordynacja`; nigdy --no-verify, force-push ani ręczny zapis znacznika; bez AskUserQuestion; bez TestFlight/App Store Connect.
6. Kontekst i koszt: od 30% okna — stan w `docs/przekazanie/notatki/STAN-SCALENIE-PR108.md` (lokalnie, nie przesuwaj głowy bez potrzeby), PRZEKAZANIE. Pułap 15 USD.
7. Raporty (≤ 10 linii): po verify (kod, plik); PYTANIE z opcjami; PRZEKAZANIE: SHA main, run, PR, otwarte.
