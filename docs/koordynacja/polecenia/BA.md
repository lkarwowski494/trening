# Sesja BA: Z-02a odtwarzacz figur — pętla jednokierunkowa i ruch bez tempa (loop/untimed) — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID). Gałąź stanu: `koordynacja` w lkarwowski494/trening (tylko odczyt; KO-129 w decyzje.md, plan-strony-2026-11-27.md).

1. Rola: 08-programista w trybie build. Prompt roli w pierwszej wiadomości po linii `=== PROMPT ROLI ===`. Biblioteki prompts nie dołączasz.
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z02a-petla` od `strona/z00-z03-plan-dane-regula` @ 10155604 (dane 1.1.1, praca sesji AQ). Plan i pułapki od poprzednika: `pomiary/STAN-AGENTA.md` na tej gałęzi — przeczytaj najpierw. Źródło zmian: gałąź `figury/petla-jednokierunkowa` (commit e29555f; oneWayRepMs, cykl_lustro). Instalacja `npm ci`, `npm run dane`. Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania:
   1. Odtwarzacz figur strony obsługuje z eksportu 1.1.1 ruchy w pętli jednokierunkowej i bez tempa (loop/untimed), tak jak aplikacja — bez tego skoki i rzuty idą wahadłem (BR-BIB-007). Przenieś logikę z figury/petla-jednokierunkowa wobec obecnego kodu, nie scalaj gałęzi w całości. Gotowe: test czerwony przed zmianą (np. ćwiczenie z pętlą jednokierunkową odtwarza się wahadłem), zielony po.
   2. Zgodność z aplikacją: dla 3 ćwiczeń (jedno loop, jedno untimed, jedno zwykłe) porównanie przebiegu pozy w czasie ze sposobem z aplikacji (kod w tagu v1.1.1-b1042 repo lkarwowski494/trening) — tabela w pomiary/z02a.md.
   3. Testy: ciężkie pliki (build.test, jezyki-podglad) uruchamiaj po kolei (`--test-concurrency=1`) — równolegle kontener ubija je SIGKILL. Push, tests.yml zielony na końcowym SHA.
4. Zakazy: nie zmieniasz danych eksportu ani slug-overrides.json, nie ruszasz src/szablony* (sesja AZ) ani docs/design (AX), nie scalasz, nie otwierasz PR, nie tworzysz sesji, nie piszesz na `koordynacja`, nie zmieniasz workflowów, nigdy --no-verify ani force-push, bez AskUserQuestion. Pełne SHA (40 hex) tylko w PIN.json — strażnik sekretów.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Kontekst i koszt: od 30% okna kończysz krok, STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 10 USD; próg STOP 13 USD.
7. Raporty (≤ 10 linii, send_message): po zadaniu 1 — czas i szacunek; PYTANIE — pełna treść, opcje, rekomendacja; PRZEKAZANIE — SHA, run CI, dowody, decyzje do weta, koszt, otwarte.
