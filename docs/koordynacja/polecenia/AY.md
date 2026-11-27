# Sesja AY: Z-25 niezależna recenzja polskich nazw ćwiczeń — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID). Gałąź stanu: `koordynacja` w lkarwowski494/trening (tylko odczyt; plan: docs/koordynacja/plan-strony-2026-11-27.md, wiersze Z-24, Z-25; P-7).

1. Rola: 09-lokalizacja w trybie audit. Prompt roli w pierwszej wiadomości po linii `=== PROMPT ROLI ===`. Biblioteki prompts nie dołączasz. Jesteś recenzentem niezależnym: autor nazw to sesja AU — nie czytasz jej uzasadnień zanim nie ocenisz nazw sam (STAN.md czytasz dopiero na końcu, do porównania).
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z25-recenzja-nazw-pl` od `strona/z24-nazwy-pl` @ 9f4e0607. Źródło prawdy: eksport tagu v1.1.1-b1042 aplikacji (repo lkarwowski494/trening, d9382dbe) i słownik terminów `docs/lokalizacja/slownik-terminow.json` w tym tagu. Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania:
   1. Przeczytaj docs/nazwy/pl.json (708 nazw) jak trener albo kolega na siłowni w Polsce: zrozumiałość, spójność wzorca „czynność + sprzęt”, zgodność ze słownikiem terminów i z polskimi nazwami w aplikacji (lib/locales pl w tagu), brak kalek, literówki, duplikaty znaczeń. Gotowe: docs/nazwy/recenzja-pl-2026-11-27.md — werdykt (PRZYJĘTE / PRZYJĘTE Z POPRAWKAMI / ODRZUCONE), lista poprawek (klucz, obecna, proponowana, powód) z oceną wagi.
   2. Oceń 14 trafień wzorców zakazanych (wykroki → nożyce, rack pull/delivery) i propozycję wyjątków z docs/nazwy/STAN.md (sekcja WYJATKI) oraz listę nazw wątpliwych. Gotowe: osobna sekcja z decyzją dla każdej pozycji.
   3. Nie poprawiasz pl.json — poprawki wykona autor. Push dokumentu recenzji, tests.yml zielony na końcowym SHA.
4. Zakazy: nie zmieniasz docs/nazwy/pl.json ani src/, nie scalasz, nie otwierasz PR, nie tworzysz sesji, nie piszesz na `koordynacja`, nigdy --no-verify ani force-push, bez AskUserQuestion. Nazwy innych firm i źródeł nie trafiają do nazw.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Kontekst i koszt: od 30% okna kończysz krok, STAN-AGENTA.md na gałęzi, push, PRZEKAZANIE. Pułap 8 USD; próg STOP 10,4 USD.
7. Raporty (≤ 10 linii, send_message): PYTANIE — pełna treść, opcje, rekomendacja; PRZEKAZANIE — SHA, run CI, werdykt, liczba poprawek wg wagi, koszt, otwarte.
