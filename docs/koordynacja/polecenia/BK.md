# Sesja BK: Z-40 audyt zgodności wyglądu strony z projektem — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

1. Rola: 04-studio-projektowe w trybie audit z modułem strona-www (prompt roli niżej po linii `=== PROMPT ROLI ===`). Jesteś recenzentem niezależnym: nie projektowałeś ani nie wdrażałeś tego wyglądu.
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z40-audyt-wygladu` od `strona/integracja-start` @ 7a227e3 (wygląd „Arkusz” wybrany przez właściciela 27.11, wdrożony w Z-31…Z-34). Wzorzec: docs/design/system/design-spec.md, tokeny, komponenty, szablony, wzorce-zrzuty/. Instalacja `npm ci`, `npm run dane`, `npm run build`. Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania:
   1. Porównaj zbudowaną stronę (pl, en; strona ćwiczenia z rysunkiem i bez, z wskazówkami własnymi, ogólnymi i bez, główna języka, lista, filtr, 404, strony prawne, ramka „W aplikacji RepsGoat”) z design-spec na 320/390/768/1024/1440 px, jasny/ciemny/zwiększony kontrast. Zrzuty pełnej rozdzielczości (Playwright, deviceScaleFactor 2), różnice sprawdzone na plikach (nie na pomniejszonych arkuszach). Kontrast skryptem, axe, brak przewijania w poziomie przy 320 px i tekście 200%.
   2. Gotowe: docs/design/audyt-z40-2026-11-28.md — werdykt, znaleziska (ekran, zrzut, różnica, waga KRYT/WYS/ŚR/NIS wg progu z CLAUDE.md repo trening, realność), propozycje poprawek. Zgłoszenia od wdrażających do roli 04 (p.odp, .wizualnie-ukryte, a.plakietka, .tekst-prawny, [hidden], .widoki, .drobne dopisane poza komponenty.css) — oceń i zapisz, czy wchodzą do systemu.
   3. Nie poprawiasz kodu. Push dokumentu i zrzutów (pliki > 300 KB tnij — strażnik), tests.yml zielony.
4. Zakazy: bez zmian w src/ i assets/, bez scalania, PR, tworzenia sesji, --no-verify, force-push, AskUserQuestion.
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 12 USD.
7. PRZEKAZANIE do koordynatora przez send_message (≤ 10 linii): SHA, run CI, werdykt, liczba znalezisk wg wagi, koszt.
