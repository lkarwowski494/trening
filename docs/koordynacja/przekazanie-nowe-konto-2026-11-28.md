# Przekazanie koordynacji na nowe konto — 28.11.2026 ~09:30 UTC

Powód: właścicielowi kończy się limit na obecnym koncie (słowa 28.11 ~09:25 UTC: „Konczy mi sie tu limit wiec chce zebys pozwolil sesjom dokonczyc aktualne zadania. Zapisal prace i one tez. A pozniej dal mi prompt przekazania koordynacji na nowe konto…”).
Poprzedni koordynator: session_01BM51ofp4DMHDkCDaVVg49P (stare konto). Sesji ze starego konta NIE da się wznowić z nowego — praca jest w repo (gałęzie + STAN-AGENTA.md), nowy koordynator otwiera NOWE sesje od plików stanu.

## Stan techniqueatlas (repo lkarwowski494/techniqueatlas)
- `main` @ 319deed8 — strona sprzed startu + mechanizm przekładu API (PR #6, scalony przez właściciela 27.11). pages.yml tylko ręcznie (nic nie opublikowane; domena techniqueatlas.com gotowa, HTTPS włączone).
- `strona/integracja-start` @ 72947750 — WSZYSTKIE przyjęte prace: Z-00…Z-03b, Z-02a, Z-06, Z-09, Z-10…Z-12 (wygląd „Arkusz”, wybór właściciela), Z-20…Z-25 (+poprawki), Z-30, Z-31…Z-34, Z-40 + poprawki. tests.yml zielony na każdym składniku (dziennik w stan.md).
- W toku przy przekazaniu (sprawdź STAN-AGENTA.md na gałęzi i wynik tests.yml na głowie):
  - `strona/przeklad-api` (sesja BM, rola 09): przekład 33 jęz. przez API + przegląd API (226 uwag nałożonych); koszt API łącznie 25,68 z 80 USD (docs/przeklad/wydatki.json na tej gałęzi). tests.yml był czerwony od 14e559f: test z32-nazwy:39 zakładał „de bez nazw” — KO-140: test z fixture/dynamicznym językiem, asercje bez zmian. Brak: nazwy/el (ucięte max_tokens) — do ponowienia po BO. Do scalenia do integracja-start po zielonym CI.
  - `strona/plakietka-apple` (sesja BN, 08): oficjalne czarne plakietki „Download on the App Store” SVG ×35 jęz. ze źródeł Apple (KO-139: właściciel zaakceptował licencję 28.11 i polecił „Musisz to zrobic sam”); sr → angielska; testy plakietki (ŚR z recenzji BL). appStoreId zostaje PUSTE do publikacji.
  - `strona/przeklad-poprawki` (sesja BO, 08, od main): wejście `jezyki`, max_tokens wg pisma (el), spacje wokół „albo”, pomijanie przetłumaczonych, licznik z galaz_tekstow. Zmienia workflowy → na main przez PR, który scala właściciel.
- Marketing (repo trening, gałąź `marketing/rozmowa-2026-11-27` @ 595a5eaf, sesja BH prowadzona przez właściciela): stan w docs/marketing/ (STAN-AGENTA.md). Właściciel otworzy nową, jeśli zechce.

## Plan do startu (plan-strony-2026-11-27.md; kolejność)
1. Odbiór BM/BN/BO z ich STAN-AGENTA.md (nowe sesje od plików stanu, jeśli niedokończone): CI zielone → recenzja kodu niezależna (subagent audytor) → scalenie do `strona/integracja-start`.
2. PR `strona/przeklad-poprawki` → main (scala właściciel; ten sam wzór co PR #6), potem ponowienie samych `nazwy/el` (wejście jezyki=el, < 6 USD, bez zgody) i przegląd el.
3. Z-41 jeden audyt gotowości (07 audit, opus/high) na integracja-start: lista „przed pierwszym indeksowaniem”, próba z indeksowanie=true, figury tylko z recenzją, linki, wydajność, dostępność, prywatność, anonimowość → poprawki.
4. Przed Z-50 do właściciela, prostym językiem: (a) pytania prawne docs/teksty/prawne/do-wlasciciela.md (12 pozycji; brak odpowiedzi = rekomendacja); (b) czy teksty prawne w 33 językach ma przejrzeć człowiek (przegląd API ≠ konsultacja prawna); (c) wstawki administrator/kontakt jako zmienne TA_ADMINISTRATOR/TA_KONTAKT (sekrety/zmienne repo — nie w czacie); (d) otwarte 010: og:image dla list/prawnych/404 i 180 ćwiczeń bez figury.
5. Z-50 zgoda właściciela na publikację ukrytą przed Google → PR integracja-start → main (scala właściciel) → Z-51 ręczny pages.yml (appStoreId 6819977165 w config przy publikacji) → Z-52 niezależne sprawdzenie żywej strony.
6. Z-60 PR z indeksowanie=true + Z-61 zgoda właściciela z cytatem w docs/55 (strażnik S11 wymaga) → Z-62 publikacja → Z-63 właściciel: Search Console + Bing (~20 min, prowadzić krok po kroku) → Z-64 link w ASC (Marketing URL, za zgodą) i apps4brew.com → Z-65 zapis w repo trening.
Szacunek: do publikacji ukrytej ~0,5–1 dzień pracy agentów; Google dzień później.

## Do weta właściciela (decyzje.md KO-130…KO-140)
KO-130 roboty AI; KO-131 14 starych adresów; KO-132 ramka/odpowiedź tylko na stronie ćwiczenia; KO-133 API 80 USD (właściciel); KO-134 398 ćwiczeń na razie bez zmian (właściciel); KO-135 znaleziska Z-30; KO-136 „RepsGoat”; KO-137 bez ukrytego img; KO-138/139 plakietka (właściciel); KO-140 test nazw.

## Backlog strony (NISKIE/ŚR z recenzji)
uruchom-testy.mjs (argument opcji, SIGINT); podwójna ramka „Częsty błąd:” w 1 opisie pl/en i wielka litera po dwukropku; etykieta „Show error” przy wciśniętym przycisku; brak testu gałęzi z plakietką (robi BN); aria-live tylko przy zmianie liczby; 16 nazw pl „lepszych niż w aplikacji” — zgłoszenie dla aplikacji; pytania do trenera dwuboju (zarzut/rwanie siłowe, z zawieszenia, Rack Delivery); hantla/hantel, EZ/łamana; sk Jumping Jacks, cs Atlas Stones; rodzimi użytkownicy dla hu, nb, sv, uk, vi; po starcie: 398 ćwiczeń (KO-134, opcja 1).

## Lekcje procesu (WG)
WG-20: polecenie w treści pierwszej wiadomości create_session (repo trening bywa niedostępne dla sesji strony). Sesje podrzędne nie mogą dołączyć prompts — koordynator składa role (assemble.mjs) i subagent wkleja je do create_session. Fetch w płytkim klonie strony: `git fetch origin refs/heads/<gałąź>` i FETCH_HEAD (nie origin/<gałąź>).
