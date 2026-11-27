# Sesja BB: Z-23 niezależna recenzja tekstów strony (Z-20, Z-21, Z-22) — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID). Gałąź stanu: `koordynacja` w lkarwowski494/trening (tylko odczyt; plan Z-23; decyzje KO-130…KO-132).

1. Rola: 06-tresci w trybie audit. Prompt roli w pierwszej wiadomości po linii `=== PROMPT ROLI ===`. Biblioteki prompts nie dołączasz. Recenzent niezależny: najpierw oceniasz teksty sam, uzasadnienia autorów (dowody.md, decyzje do weta) czytasz dopiero do porównania.
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z23-recenzja-tekstow` od `strona/z22-szablony` @ 3288ff36. Teksty do recenzji (git show):
   - Z-20 teksty prawne pl+en: `origin/strona/z04-z07-z20-formalnosci` @ c76182b8, docs/teksty/prawne/ (+ dowody.md D-1…D-15);
   - Z-21 ramka „w aplikacji” i akapit o wsparciu: `origin/strona/z21-ramka-akapit` @ 34d87bd3, docs/teksty/ramka-w-aplikacji.md (właściciel wybrał wygląd A; ramka wariant A, 8 zdań — KO-132);
   - Z-22 szablony tytułów, opisów, pytań, krótkiej odpowiedzi: na gałęzi startu, docs/teksty/szablony-stron.md, src/szablony/{pl,en}.json.
   Prawda o aplikacji: tag v1.1.1-b1042 repo lkarwowski494/trening (d9382dbe) — każde zdanie o funkcjach i cenach sprawdzasz w kodzie (plik:linia). Tożsamość commitów według CLAUDE.md.
3. Zadania:
   1. Recenzja: prawdziwość każdego twierdzenia o aplikacji i o stronie (kod tagu), zgodność z zasadami repo trening (bez nazw źródeł i organizacji, bez porad medycznych, teksty naturalne „jak trener albo kolega na siłowni”), spójność pl i en, długości. Otwarte od autorów: en „at no charge” przy dniach próbnych; licencja Z-20 a decyzja KO-130 (wyjątek dla Google-Extended — dodaj wymagane zdanie jako poprawkę); wstawki {{administrator}}/{{kontakt}}; [DO KONSULTACJI] PP-1–3, R-1–3, L-1–2; znalezisko AZ: zdanie „708 z opisem techniki… i zamiennikami” a dane (wskazówki 567, zamienniki 609).
   2. Gotowe: docs/teksty/recenzja-z23-2026-11-27.md — werdykt dla każdego z trzech (PRZYJĘTE / Z POPRAWKAMI / ODRZUCONE), lista poprawek (plik:linia, obecne, proponowane, powód, waga), pozycje wymagające właściciela (z ≥ 2 opcjami i rekomendacją).
   3. Nie poprawiasz tekstów autorów — poprawki wykonają autorzy. Push, tests.yml zielony.
4. Zakazy: nie scalasz, nie otwierasz PR, nie tworzysz sesji, nie piszesz na `koordynacja`, nigdy --no-verify ani force-push, bez AskUserQuestion. Pełne SHA (40 hex) nie trafiają do dokumentów (strażnik sekretów).
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Kontekst i koszt: od 30% okna kończysz krok, STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 10 USD; próg STOP 13 USD.
7. Raporty (≤ 10 linii, send_message): PYTANIE — pełna treść, opcje, rekomendacja; PRZEKAZANIE — SHA, run CI, werdykty, liczba poprawek wg wagi, sprawy do właściciela, koszt.
