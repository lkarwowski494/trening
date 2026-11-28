# Sesja BL: poprawki po audycie wyglądu Z-40 — techniqueatlas
Koordynator: session_01BM51ofp4DMHDkCDaVVg49P (ta sesja jest utworzona przez koordynatora na polecenie właściciela; raporty, pytania i PRZEKAZANIE tylko przez send_message do tego ID).

1. Rola: 08-programista w trybie build (prompt roli niżej po linii `=== PROMPT ROLI ===`).
2. Start: repo lkarwowski494/techniqueatlas, gałąź `strona/z40-poprawki` od `strona/z40-audyt-wygladu` @ 6b78851 (= integracja-start @ 7a227e3 + raport audytu). Raport: docs/design/audyt-z40-2026-11-28.md (0 KRYT, 3 WYS, 6 ŚR, 2 NIS; każde znalezisko ma test akceptacyjny). Instalacja `npm ci`, `npm run dane`; ciężkie testy po kolei (`--test-concurrency=1`). Tożsamość commitów według CLAUDE.md (Claude <noreply@anthropic.com>).
3. Zadania (każde: najpierw test akceptacyjny z raportu jako test czerwony, potem poprawka):
   1. WYS 001 (przewijanie w poziomie przy 320 px i 200% tekstu, nagłówek bez zawijania), WYS 002 (licznik wyników listy/filtra + ogłoszenie zmiany dla czytnika — aria-live), WYS 009 (plakietka App Store: wariant (a) — oficjalna grafika Apple jako <img alt> w linku, plik lokalnie zgodnie z CSP; zasady użycia plakietki przeczytaj u Apple w dniu pracy i podaj adres + datę odczytu w commicie; jeśli warunki Apple wymagają czegoś, czego nie spełnimy — PYTANIE do koordynatora z opcją (b) link tekstowy bez styli).
   2. Wszystkie ŚR (003…008 według raportu) i NIS, o ile mają test akceptacyjny i nie zmieniają systemu wyglądu ponad to, co raport proponuje.
   3. Push, tests.yml zielony; axe 0 naruszeń i brak przewijania przy 320 px/200% na zrzutach (pomiary/z40/).
4. Zakazy: bez zmian w docs/design/system poza tym, co raport wprost wskazuje; nie scalasz, nie otwierasz PR, nie tworzysz sesji, bez płatnych przebiegów API, nigdy --no-verify ani force-push, bez AskUserQuestion. Nowe teksty UI tylko pl i en (inne języki — przekład API).
5. Decyzje: „analogia, do weta”; opisz w PRZEKAZANIU.
6. Od 30% kontekstu: STAN-AGENTA.md, push, PRZEKAZANIE. Pułap 12 USD.
7. PRZEKAZANIE do koordynatora przez send_message (≤ 10 linii): SHA, run CI, poprawki wg ID, decyzje do weta, koszt.
