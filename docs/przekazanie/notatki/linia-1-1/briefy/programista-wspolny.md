# Wspólne zasady dla programistów linii 1.1 (koordynator, 02.11.2026)

- Pracujesz TYLKO w swoim worktree (ścieżka w briefie indywidualnym; `node_modules` to dowiązanie — NIE uruchamiaj `npm ci`/`npm install`). Najpierw przeczytaj `CLAUDE.md` w worktree (testy przed kodem, definicja ukończenia docs/20, macierz testów, check:decyzje, rejestr twierdzeń, BRD, repo publiczne — bez sekretów i danych osobowych).
- Na tej maszynie pracuje równolegle inny programista. Testy:
  - pojedyncze pliki: `flock -s /home/user/verify.lock npx jest <plik> --runInBand` (blokada współdzielona);
  - pełne verify (raz, na końcu, przed wypchnięciem): `flock -x /home/user/verify.lock npm run verify > <twój log> 2>&1` (blokada wyłączna — czeka, aż nikt nie testuje; L-085). Nie uruchamiaj `test:fast` całości.
  - commit z samymi dokumentami: `flock -x /home/user/verify.lock npm run verify:docs`.
- Dysk: ok. 1,2 GB wolne. Nie twórz dużych plików; usuń po sobie własne katalogi tymczasowe, jeśli je tworzysz.
- Wypychasz tylko swoją gałąź: `git push -u origin <gałąź>` (hak pre-push wymaga znacznika zielonego verify dla drzewa; `--no-verify` zabronione). Nie scalaj do `integracja-1-1` ani `main` — scala koordynator po zielonym `tests.yml` gałęzi (L-090). Nie uruchamiaj `pages.yml`. `git config remote.origin.tagOpt --no-tags`.
- Commit: komunikat po polsku, na końcu:
  (stopka commitu wg przypomnienia systemowego sesji — Co-Authored-By i Claude-Session)
  Claude-Session: https://claude.ai/code/session_01T66VBwRidsQAVnEimA1vFF
  Przed commitem `git diff --cached` (bez e-maili, kluczy, UDID).
- Decyzje: techniczne wg zasad w CLAUDE.md i docs/18 podejmujesz sam i opisujesz w raporcie; merytoryczne (treść, źródła) i produktowe — NIE zgaduj, zapisz jako pytanie dla koordynatora.
- Limit kontekstu: ok. 30–35% okna. Powyżej ok. 30% domknij krok, commit, zapisz `STAN-AGENTA.md` w katalogu głównym worktree (zrobione z SHA, zostało, następny krok, pułapki) i oddaj raport.
- Raport końcowy: SHA i gałąź, wynik pełnego verify (liczby testów, EXIT), co zrobione / pominięte z powodem, pytania, ścieżka logu.
