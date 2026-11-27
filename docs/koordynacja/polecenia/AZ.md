# Sesja AZ: Z-22 szablony tytułu, opisu, nagłówków-pytań i krótkiej odpowiedzi — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID). Gałąź stanu: `koordynacja` w lkarwowski494/trening (tylko odczyt; plan: docs/koordynacja/plan-strony-2026-11-27.md, wiersz Z-22; P-1…P-12; decyzje KO-130, KO-131 w decyzje.md).

1. Rola: 04-studio-projektowe w trybie build z modułem strona-www. Prompt roli w pierwszej wiadomości po linii `=== PROMPT ROLI ===`. Biblioteki prompts nie dołączasz.
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z22-szablony` od `strona/z00-z03-plan-dane-regula` @ cca7ab5b (dane 1.1.1). Wejście: badanie zasięgu `git show origin/strona/z06-badanie-zasiegu:docs/badanie-zasiegu-2026-11-27.md` (72d53ce2; sekcje A1–A15, B1–B9, C KO-130). Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania:
   1. Szablony (pl i en): tytuł strony, opis (meta description), nagłówki w formie pytań i krótka odpowiedź na stronie ćwiczenia, strona główna języka, lista — WYŁĄCZNIE z danych, które już są w eksporcie (nazwa, sprzęt, mięśnie, wskazówki itd.); bez tekstów pod frazy, bez słów kluczowych dopisanych sztucznie, bez nazw innych firm i źródeł (plan „Czego nie robimy”). Uwzględnij wnioski Z-06 (długości, unikalność, dane strukturalne tylko jako wskazanie dla Z-34). Gotowe: docs/teksty/szablony-stron.md.
   2. Wzorce zastosowane do 5 ćwiczeń o różnym profilu danych (z wskazówkami pełnymi, bez rysunku, z jednym sprzętem, z kilkoma, rzadka odmiana) w pl i en; sprawdzenie: brak powtórzeń tych samych słów między tytułem a opisem, długości w granicach z Z-06. Gotowe: tabela w tym samym pliku + skrypt albo test, który liczy długości i powtórzenia (jeśli test — w tests/, czerwony przed szablonem).
   3. Push, tests.yml zielony na końcowym SHA.
4. Zakazy: nie zmieniasz src/pages.mjs ani assets/ (wdrożenie to Z-34), nie scalasz, nie otwierasz PR, nie tworzysz sesji, nie piszesz na `koordynacja`, nie zmieniasz workflowów, nigdy --no-verify ani force-push, bez AskUserQuestion.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Kontekst i koszt: od 30% okna kończysz krok, STAN-AGENTA.md na gałęzi, push, PRZEKAZANIE. Pułap 10 USD; próg STOP 13 USD.
7. Raporty (≤ 10 linii, send_message): PYTANIE — pełna treść, opcje, rekomendacja; PRZEKAZANIE — SHA, run CI, ścieżki, decyzje do weta, koszt, otwarte.
