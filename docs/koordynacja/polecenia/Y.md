# Sesja Y: przekład DIF-01, zamknięcie R-015, recenzja W-22 — Trening 1.1
Koordynator: session_01T66VBxrbdTdwZ2VFRyGwE3 (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID; przy wiadomości o zmianie koordynatora pisz do nowego). Gałąź stanu: `koordynacja` (tylko do odczytu).

1. Rola: 08-programista w trybie fix (prompt po linii `=== PROMPT ROLI ===` w pierwszej wiadomości; przeczytaj w całości). Biblioteki prompts nie dołączasz. CLAUDE.md ma pierwszeństwo.
2. Start: gałąź `naprawy/w11b-1-1` od `integracja-1-1` @ bb0442c6 (inny HEAD: zgłoś). `npm ci`, `git fetch --unshallow`. Tożsamość commitów wg CLAUDE.md.
3. Kontekst: sesja X zrobiła W-11 (MER-01, DIF-01 PL/EN, W-22); kroki dokończenia w `docs/przekazanie/notatki/linia-1-1/STAN-W11.md` — przeczytaj w całości. Host productionresultssa14 (i cała seria sa1…sa40) jest od 12.11 ~05:10 w środowisku (KO-054). Zamrożenie zakresu trwa.
4. Zadania (kryterium „gotowe” przy każdym):
   1. Przekład DIF-01: pobierz artefakt 13899680861 z run 43117339440 (przeklad-tlumaczen.yml), nałóż `--zastosuj`, opróżnij zestaw, zamknij R-015 w docs/40 i odwróć oba testy stanu w tym samym commicie, `store-whatsnew --write`; recenzja agentem `recenzent-lokalizacji` (≠ tłumacz; zapis w docs/research/recenzje/), poprawki z recenzji. Artefakt wygasł albo pobranie pada → PYTANIE. Gotowe: `check:release` 0, testy stanu zielone, commit.
   2. Recenzja niezależna W-22 (wyjątek przy przyjęciu X): agent `audytor` (≠ autor) przegląda bccd857b i 9259012d (generator whatsNew do store/app-store-metadata.json, tryb --check w verify); zapis w docs/research/recenzje/ z polami autor ≠ recenzent; znaleziska KRYTYCZNE/WYSOKIE naprawiasz, ŚREDNIE/NISKIE → docs/21. Gotowe: plik recenzji, commit.
   3. Wpisy stanu (KO-055): W-11 i W-22 w docs/49 zaktualizuj bezpośrednio (jesteś jedyną sesją z kodem).
   4. `verify:szybkie` kod 0, push zbiorczo raz, tests.yml zielony na głowie.
5. Zakazy: nie scalasz do integracji ani `main`, nie tworzysz i nie archiwizujesz sesji, nie piszesz na `koordynacja`, nie zmieniasz workflowów, nigdy --no-verify ani force-push, bez AskUserQuestion, bez zapisu do App Store Connect. STOP-y roli → raport do koordynatora.
6. Decyzje: tryb analogia (do weta), wpis w docs/18 z datą i odrzuconymi wariantami. Bez nowych numerów KO.
7. Kontekst i koszt: od 30% okna kończysz krok, stan w `docs/przekazanie/notatki/linia-1-1/STAN-W11b.md`, push, PRZEKAZANIE. Pułap sesji 15 USD, próg STOP 19,5 USD. API: 0 USD (przekład już opłacony); ponowny przekład → PYTANIE.
8. Raporty (≤ 10 linii, send_message): po zadaniu 1; PYTANIE z opcjami i rekomendacją; PRZEKAZANIE: SHA, run CI, dowody, decyzje do weta, otwarte, następny krok.
