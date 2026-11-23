# Sesja AP: lekcja --no-verify + pełne verify + scalenie integracja-1-1 → main — Trening
Koordynator: session_01BM51ocsLq9vDz8rFpm6zbp (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID; jeśli dostaniesz wiadomość o zmianie koordynatora, pisz do nowego). Gałąź stanu koordynatora: koordynacja (tylko do odczytu).

1. Rola: 08-programista w trybie build. Prompt roli jest w twojej pierwszej wiadomości po linii `=== PROMPT ROLI ===`; przeczytaj go w całości, jesteś tą rolą. Biblioteki prompts nie dołączasz.
2. Start: gałąź `integracja-1-1` @ 283933e471f93886a14039c03648e71f29a51a4e (inny HEAD: zgłoś). Instalacja: `npm ci`. Tożsamość commitów według CLAUDE.md, sprawdź przed pierwszym commitem. Uwaga: `origin/main` (2d975814) NIE jest przodkiem integracja-1-1 — scalenie do main nie będzie fast-forward.
3. Zadania:
   1. Lekcja w `docs/40-lekcje.md` (nagłówek `## L-NNN`, numer nada `node scripts/numeruj-lekcje.mjs` przy scaleniu do main): 22.11.2026 22:48 UTC koordynator wypchnął a55cc373 na nową gałąź `ci/wyd-1-1-1-a55cc37` z `git push --no-verify` (naruszenie mandatu „nigdy --no-verify”; treść bez zmian względem SHA już na origin po verify i E2E). Przyczyna źródłowa do dociśnięcia „dlaczego”: commit bota w testflight.yml (L-117) pushowany GITHUB_TOKEN nie wyzwala tests.yml, tests.yml nie ma `workflow_dispatch`, więc `scal-galaz` odmawia; brak legalnej drogi wyzwolenia CI → obejście. Ocena: systemowa. Propozycja dla właściciela (≥ 2 opcje, rekomendacja): (A) `workflow_dispatch` w tests.yml + scal-galaz/koordynator wyzwala przebieg; (B) commit bota przez token, który wyzwala CI; (C) scal-galaz akceptuje SHA różniący się od zielonego tylko dokumentami (reguła `scripts/dokumenty.mjs`). Sprawdź wykonalność każdej opcji w plikach (plik:linia) — inaczej „wykonalność niesprawdzona”. Akcje zapobiegawcze: stan „otwarte → decyzja właściciela”. Gotowe: commit tylko z docs/40, `npm run verify:docs` kod 0.
   2. Pełne `npm run verify` na czystej kopii roboczej (po commicie z zad. 1), w tle z limitem ≥ 2 h, wynik do pliku. Gotowe: kod 0, znacznik `pelne` zapisany. Czerwone: diagnoza (przyczyna, plik:linia), raport PYTANIE do koordynatora — nie poprawiaj testów, żeby przeszły.
   3. Push `integracja-1-1` (hak przyjmie znacznik); czekaj na `tests.yml` success na tym SHA (MCP GitHub actions_list; nie scal przed zielonym).
   4. `NODE_USE_ENV_PROXY=1 node scripts/scal-galaz.mjs integracja-1-1 --do main` (zgoda właściciela KO-085/KO-091 z 22.11: „Tak, scal po verify”). Konflikt inny niż pliki generowane → skrypt przerywa: STOP, raport do koordynatora z listą plików. Gotowe: main = wynik scalenia, `tests.yml` na main success, numer lekcji nadany.
4. Zakazy: nie tworzysz i nie archiwizujesz sesji, nie piszesz na gałąź `koordynacja`, nie zmieniasz workflowów (opcje z lekcji to tylko propozycja), nie usuwasz gałęzi (także ci/wyd-1-1-1-a55cc37), nigdy --no-verify ani force-push, nie pytasz właściciela bezpośrednio (bez AskUserQuestion). Nic w App Store Connect. STOP-y roli i punkt czyszczenia zamieniasz na raport do koordynatora i czekasz.
5. Decyzje: tryb analogia, do weta — wpis w docs/18 z datą tylko, jeśli podejmiesz decyzję produktową (nie przewiduję). KO następny przydziela koordynator.
6. Kontekst i koszt: od 30% okna kończysz krok, zapisujesz stan w `STAN-AGENTA.md` (worktree), push gałęzi, PRZEKAZANIE. Pułap 15 USD; próg STOP 19,5 USD.
7. Push: zbiorczo.
8. Raporty (≤ 10 linii, send_message): po zad. 1 (SHA, czas, szacunek reszty); po verify (kod, czas); PYTANIE z opcjami i rekomendacją; PRZEKAZANIE: SHA, runy CI, dowody, koszt, otwarte.

## Dopisek koordynatora 2026-11-23 06:00 UTC — zadanie 5 (po zad. 4)
5. Commit tylko z dokumentami na integracja-1-1, potem `npm run verify:docs`, push, `scal-galaz integracja-1-1 --do main` (H1: same dokumenty po `pelne`). Treść — kolumna „Stan” w docs/49b (i docs/48, jeśli ma te kroki), dowody słowami właściciela z czatu koordynatora 23.11:
   - X-10 telefon: zrobione 22.11 (~19:40 UTC, właściciel „OK”).
   - X-11 nowa wersja 1.1.1 w ASC: zrobione 23.11 ~05:22 (właściciel „1.1.1 utworzona”); strony Apple przeczytane 23.11 — zmiana zdania: „Existing metadata carries over from the current version.”; wymóg statusu bieżącej wersji „Ready for Distribution”.
   - X-12 metadane: zrobione 23.11 — podgląd 45117729248, zapis 45118431784 (appInfo 29, wersja 32; sl pominięte — brak w ASC), kontrola 45118701989 (0 różnic); L-001 pkt 1 nie dotyczy: scripts/asc/metadane.mjs i asc-metadane.yml bez zmian od zapisu 43759074365. Decyzja właściciela 23.11 ~05:40: polski tytuł bez zmian („ok teraz bez zmian w polskim”); badanie frazy „progresja ciężaru/obciążenia” i standardu tytułów — po 1.1.1 (dopisz do backlogu docs/21 albo zobowiązań z datą).
   - X-13 zrzuty: bez zmian.
   - X-14 notatki EN: zrobione 23.11 ~05:50 (właściciel „gotowe”; store/review-notes.en.txt 3988 B).
   - X-15 asc-kontrola 45118997956: OK 42, RÓŻNICA 0, BŁĄD 0; App Privacy tylko ręcznie (bez zmian kodu od 1.1).
   - X-16 zakupy: bez zmian (nie zgłaszano problemu).
   - X-17…X-19: zrobione 23.11 ~05:58 (właściciel „gotowe”): build 1042, „Automatically release this version”, bez wydania stopniowego.
   - X-20 Submit for Review: zrobione 23.11 ~06:00 (właściciel „gotowe”); stan „Waiting for Review” — wynik recenzji otwarte.
   Gotowe: commit na integracja-1-1 i na main, verify:docs kod 0, tests.yml/CI wg scal-galaz.
