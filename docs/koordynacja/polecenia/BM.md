# Sesja BM: obsługa przekładów przez API (odbiór wyników, księgowanie kosztu, przegląd) — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

Decyzja właściciela (27.11): „Tlumaczenie i sprawdzanie i wszystko wokol tego ma byc przez API claude”; budżet łączny 80 USD (licznik docs/przeklad/wydatki.json, limit 6 USD/przebieg bez zgody). Ty NIE tłumaczysz sam — tylko obsługujesz mechanizm (docs/przeklad/README.md) i oceniasz wyniki przeglądu API.

1. Rola: 09-lokalizacja w trybie build (prompt roli niżej po linii `=== PROMPT ROLI ===`).
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/przeklad-api` od `strona/integracja-start` (najnowsza głowa). Przebiegi workflowów uruchamia koordynator (Ty nie masz do tego narzędzi) — prosisz go o konkretne wejścia przez send_message.
3. Zadania:
   1. Przebieg dowodowy przekładu (2 języki, opus) zakończył się sukcesem: run 46122711651 (przeklad-tlumaczen.yml na main, galaz_tekstow=strona/integracja-start). Pobierz artefakt `raport-przekladu` (API GitHub przez publiczny endpoint albo poproś koordynatora o plik), zaksięguj koszt rzeczywisty skryptem (`--zapisz-wydatek`, README), nałóż wyniki `--zastosuj` na swojej gałęzi, testy, push. Gotowe: wydatki.json z wpisem rzeczywistym, pliki 2 języków, tests.yml zielony.
   2. Poproś koordynatora o przebieg przegląd-tlumaczen.yml (limit 2) na Twojej gałęzi; po wyniku oceń listę poprawek: wprowadzasz poprawki z przeglądu (to jest wynik API, nie Twoje tłumaczenie), odrzucone uzasadniasz. Gotowe: raport docs/przeklad/dowodowy-2026-11-28.md (jakość, koszt rzeczywisty vs szacunek, wnioski dla pełnego przebiegu: model opus czy sonnet, kolejność źródeł).
   3. Rekomendacja pełnego przebiegu 33 języków (wejścia, szacunek i górna granica kosztu, czy potrzebna zgoda_koszt=tak — każdy przebieg > 6 USD wymaga zgody, a ta jest w budżecie właściciela 80 USD).
4. Zakazy: nie tłumaczysz ani nie poprawiasz tekstów od siebie; nie zmieniasz workflowów ani limitów; nie scalasz, nie otwierasz PR, nie tworzysz sesji, nigdy --no-verify ani force-push, bez AskUserQuestion. Klucza API nie masz i nie potrzebujesz.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 8 USD (sesja, bez kosztu API).
7. Raporty do koordynatora przez send_message (≤ 10 linii).
