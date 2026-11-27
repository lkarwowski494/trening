# Sesja BG: poprawki z recenzji tekstów Z-23 (teksty prawne, ramka, szablony) — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

1. Rola: 06-tresci w trybie fix (prompt roli niżej po linii `=== PROMPT ROLI ===`). Biblioteki prompts nie dołączasz. Kod aplikacji (prawda o funkcjach i cenach): publiczny klon tylko do odczytu `git clone --depth 1 --branch v1.1.1-b1042 https://github.com/lkarwowski494/trening /tmp/trening-tag`.
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z23-poprawki` od `strona/integracja-start` @ 781d7cd. Raport: docs/teksty/recenzja-z23-2026-11-27.md (znaleziska 06-tresci-001…010). Autorzy tekstów zakończyli pracę — poprawki robisz Ty, według propozycji recenzji. Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>). Pełne SHA (40 hex) nie trafiają do dokumentów.
3. Zadania:
   1. Wprowadź poprawki ze wszystkich znalezisk OPRÓCZ 06-tresci-002 (zdanie z liczbą 708 w src/pages.mjs — robi je sesja Z-31): m.in. 001 (szablon opisu: „częsty błąd” zawsze z ramką słowną, src/szablony.mjs + src/szablony/{pl,en}.json, z testem czerwonym przed zmianą), 003 (licencja: zdanie o wyjątku dla robotów przez odesłanie do robots.txt, bez nazw firm; KO-130), 004 (polityka: „Strona nie ma własnych statystyk odwiedzin”), 005, 006, 007 (próg krótkich opisów wg rekomendacji recenzji), 008 i P2 dla Z-21/Z-22 (w tym wiersz SZ-7 w tabeli decyzji). Gotowe: każda poprawka z odnośnikiem do ID w treści commitu; test szablonów zielony.
   2. Pozycje wymagające właściciela (oznaczone [DO KONSULTACJI] PP-1–3, R-1–3, L-1–2, nieprzeczytane ustawy): NIE rozstrzygasz; zbierz w docs/teksty/prawne/do-wlasciciela.md jako pytania prostym językiem, każde z ≥ 2 opcjami, kompromisem i rekomendacją.
   3. Push, tests.yml zielony.
4. Zakazy: nie zmieniasz src/pages.mjs ani assets/ (Z-31), nie scalasz, nie otwierasz PR, nie tworzysz sesji, nigdy --no-verify ani force-push, bez AskUserQuestion. Bez nazw źródeł i firm w tekstach, bez porad medycznych.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 10 USD.
7. PRZEKAZANIE do koordynatora przez send_message (≤ 10 linii): SHA, run CI, poprawki wg ID, pytania do właściciela (ścieżka), koszt.
