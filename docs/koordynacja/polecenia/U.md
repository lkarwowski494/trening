# Sesja U: KO-047 + W-08 (zamrożenie, wersja 1.1.0, „Co nowego”) — Trening 1.1
Koordynator: session_01T66VBxrbdTdwZ2VFRyGwE3 (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID; przy wiadomości o zmianie koordynatora pisz do nowego). Gałąź stanu: `koordynacja` (tylko do odczytu).

1. Rola: 08-programista w trybie build (prompt po linii `=== PROMPT ROLI ===` w pierwszej wiadomości; przeczytaj w całości). Biblioteki prompts nie dołączasz. CLAUDE.md ma pierwszeństwo.
2. Start: gałąź `wyd/w08-1-1` od `integracja-1-1` @ 79117f33 (inny HEAD: zgłoś). `npm ci`, `git fetch --unshallow`. Tożsamość commitów wg CLAUDE.md.
3. Kontekst: właściciel 11.11.2026 ~18:45 UTC wybrał wariant A — pełny audyt W-10 (sesja V, osobna gałąź, tylko dokumenty) biegnie równolegle z tą sesją; od startu audytu zamrożenie zakresu (CLAUDE.md „Audyty i wydania” pkt 3): tylko to, co niżej, bez nowych funkcji.
4. Zadania (kryterium „gotowe” przy każdym):
   1. KO-047 (docs/18 11.11.2026, wariant A): „Przyciąganie” dla cable_row i przywodzenia, „Ściąganie” dla reszty, EN „Pulling” bez zmian — wdrożenie w tekstach PL z testem (data decyzji w teście); `check:claims`/`check:decyzje` zielone; pole `[wdrożenie: kod]` w docs/18. Gotowe: commit + test czerwony→zielony.
   2. `docs/przekazanie/notatki/linia-1-1/STAN-W03.md`: dopisek o 30e495b9 i e2ee07fc (sesja T2) i zamknięcie W-03 w docs/49 (stan, dowód: tests.yml na głowie lok/w03-przeklad). Lekcja T2 „CI czerwony po verify:lekkie” — sprawdź, czy jest w docs/40 (`## L-NNN`); brak → dopisz.
   3. W-08 (docs/49-wydanie-1-1.md): wersja 1.1.0 w app.json, package.json, lockfile; wpis „Co nowego” 1.1 w `lib/whatsnew.ts` (zakres z docs/49 i docs/18; teksty naturalne, bez źródeł i marek) z przekładem 33 języków przez `przeklad-tlumaczen.yml` (ZB-057: zostało ok. 21 USD z 30, dzielone z sesją W — twoja część do 10 USD, więcej → PYTANIE do koordynatora; najpierw jeden język i wpis, potem całość) i recenzją agentem `recenzent-lokalizacji` (≠ tłumacz; zapis w docs/research/recenzje/). Stan W-08 w docs/49 z datą i dowodem.
   4. `verify:szybkie` kod 0, push zbiorczo (raz na koniec kroku — kolejne pushe anulują przebieg), tests.yml zielony na głowie.
5. Zakazy: nie scalasz do integracji ani `main`, nie tworzysz i nie archiwizujesz sesji, nie piszesz na `koordynacja`, nie zmieniasz workflowów, nigdy --no-verify ani force-push, bez AskUserQuestion. STOP-y roli → raport do koordynatora.
6. Decyzje: tryb analogia (do weta), wpis w docs/18 z datą i odrzuconymi wariantami; merytoryczne rozstrzyga hierarchia źródeł z CLAUDE.md. Bez nowych numerów KO.
7. Kontekst i koszt: od 30% okna kończysz krok, stan w `docs/przekazanie/notatki/linia-1-1/STAN-W08.md`, push, PRZEKAZANIE. Pułap sesji 30 USD, próg STOP 39 USD.
8. Sieć: artefakty przeklad-tlumaczen.yml leżą na losowych hostach productionresultssa*.blob.core.windows.net; dopuszczone sa31, sa12, sa3, sa8. Nowy host → PYTANIE do koordynatora (host, run ID, artefakt ID).
9. Raporty (≤ 10 linii, send_message): po zadaniu 1; PYTANIE z opcjami i rekomendacją; PRZEKAZANIE: SHA, run CI, dowody, decyzje do weta, koszt API, otwarte, następny krok.
