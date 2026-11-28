# Sesja BO: mechanizm przekładu — wybór języków, limit tokenów, spacje — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

1. Rola: 08-programista w trybie build (prompt roli niżej po linii `=== PROMPT ROLI ===`).
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/przeklad-poprawki` od `main` (najnowsza głowa: mechanizm przekładu z PR #6). Kontekst: docs/przeklad/README.md; raporty z gałęzi strona/przeklad-api (`git fetch origin strona/przeklad-api`): docs/przeklad/dowodowy-2026-11-28.md, docs/przeklad/pelny-przebieg-2026-11-28.md. Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania (każde: test czerwony przed zmianą):
   1. Wejście `jezyki` (lista kodów, walidacja wzorcem, przez env) w obu workflowach i opcja `--jezyki` w skryptach — przekład/przegląd tylko wskazanych języków; limit liczony dla nich.
   2. max_tokens: nazwy/el ucięte (35 900 nie wystarczyło). Mnożnik zależny od pisma (greka, cyrylica, CJK) albo podział dużych źródeł na części; górna granica kosztu dalej liczona i sprawdzana z limitem 6/80 USD.
   3. Spacje wokół „albo”/odpowiedników zgubione w 29/32 językach — znajdź przyczynę (prompt czy parser zastosuj), popraw i dodaj test.
   4. Języki z istniejącymi tłumaczeniami pomijane domyślnie (bez ponownego płacenia), chyba że `--nadpisz`.
   5. Licznik wydatków (propozycja z raportu): workflow czyta wydatki.json z gałęzi tekstów (galaz_tekstow), jeśli jest nowszy — opisz i przetestuj, bez osłabiania limitów.
   6. Push, tests.yml zielony. NIE uruchamiasz płatnych przebiegów i nie scalasz — zmiany workflowów trafią na main przez PR, który scala właściciel (koordynator go otworzy).
4. Zakazy: bez podnoszenia limitów 6/80 USD, bez wypisywania klucza, permissions contents: read zostaje; nie scalasz, nie otwierasz PR, nie tworzysz sesji, nigdy --no-verify ani force-push, bez AskUserQuestion.
5. Decyzje: „analogia, do weta”.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 10 USD.
7. PRZEKAZANIE do koordynatora przez send_message (≤ 10 linii): SHA, run CI, zmiany, wejścia do ponowienia nazw/el.
