# Plan startu strony techniqueatlas — zatwierdzony przez właściciela 27.11.2026

Źródło: wiadomość sesji planowania session_01BM51ogFYejLHpWUdnqZdyt do koordynatora session_01BM51odof6Z5fDRqyshbgvd, 27.11.2026 14:29 UTC (ExitPlanMode zatwierdzony przez właściciela w tamtej sesji). Zastępuje szkice AQ/AR z 13:59 i KO-126. Kopia przepisana przez koordynatora; stan zadań prowadzi `docs/55-plan-startu.md` w repo strony (od Z-00), do tego czasu tabela „Stan” niżej.

## Cel właściciela
Strona „top class”, maksymalny zasięg w Google i w odpowiedziach asystentów AI, bez błędu przy indeksowaniu, bez robienia czegokolwiek dwa razy. Plan zadanie po zadaniu, z wymuszonym odhaczaniem każdego.

## Stan zmierzony 27.11 (dowody z sesji planowania)
- Eksport z tagu v1.1.1-b1042 (d9382dbe), pl i en: 708 ćwiczeń; animowany rysunek 528 (40 grup ruchu z niezależną recenzją i śladem toru, autor≠recenzent 40/40; 8 wstrzymanych w V2_WSTRZYMANE poza stroną); pełna karta 447 (cel 1.1: 523 — nieosiągnięty wg scripts/pokrycie-katalogu.mjs --cel 1.1; role mięśni 513 z 586); własne wskazówki kompletne 310; pełna karta + własne 232; 398 ćwiczeń bez własnych wskazówek dzieli 28 wspólnych tekstów; 708 unikalnych nazw (te same w pl i en). Rodziny bez rysunku: cardio 0/16, foam_roll 0/10, neck 0/5, strongman 1/10.
- Strona main @ 21e056c buduje się lokalnie bez błędów: 26 987 stron, 35 języków, 372 MB. PIN.json → ab59dd5 (manifest 1.0.1); indeksowanie=false; appStoreId i wersjaWydania puste; trademark-check.json 0 wpisów; 12 starych gałęzi zdalnych.
- Wygląd: szkielet bez nagłówka, marki, menu; treść ćwiczenia w zwykłym HTML (czytelna bez JS).
- JUŻ ZROBIONE, NIE ZLECAĆ PONOWNIE: strona ćwiczenia (rysunek, pozycje bez JS, częsty błąd, sylwetka, role mięśni, wskazówki, zamienniki), wybór języka, strona główna języka, lista, wyszukiwarka, filtry; adresy zamrożone (slugs.lock.json, 708 + 1 przekierowanie); canonical, hreflang, mapy witryny, okruszki JSON-LD; strażnicy S3/S4/S6/S8, anonimowość, sekrety, brak śledzenia, dostępność w 35 językach; stałe teksty 35 języków; pages.yml ze sprawdzeniem po wdrożeniu; przycisk i baner App Store w kodzie (src/pages.mjs:22,30, czeka na appStoreId); badanie indeksowania z 01.11 i lista kontrolna przed indeksowaniem (docs/54:646-656).
- Dokumentacja czytana 27.11: Google ask-google-to-recrawl „Crawling can take anywhere from a few days to a few weeks.”; get-on-google „It can take a few weeks for Google to notice a new site”; seo-starter-guide „the keywords in the name of the domain (or URL path) alone have hardly any effect.”; url-structure „Use words in your audience's language in the URL”; GitHub managing-a-custom-domain „DNS changes can take up to 24 hours to propagate.”, „It can take up to 24 hours before this option is available.” (Enforce HTTPS); apex A 185.199.108–111.153, www CNAME → <user>.github.io; własna domena przy workflow: Settings > Pages > Custom domain (bez pliku CNAME).
- F-20 nie ma w tagu 1.1.1; FREE_TRAINING_DAYS_PER_MONTH = 5 w lib/access.ts:25 na tagu.

## Decyzje właściciela 27.11.2026 (dosłownie)
- P-1 Co idzie do Google: „310: wszystkie z własnym tekstem” → reguła: własne kompletne wskazówki w języku, bez wymogu pełnej karty (odwraca ZM-06 z 02.11). Wcześniej: „Wrzucmy wszystko na strone, po prostu czesc nie bedzie kompletna. Co myslisz?” — po przykładzie 18 uginań wybrał 310.
- P-2 Droga do aplikacji: „Ramka od razu, zdania na stronie”; „Ale jak to nie ma? Aplikacja ma wszystko. Pozwala zrobic trening, wyrbac cwiczenie itd.” → ramka „w aplikacji” ze zdaniami w słowniku strony (odwraca docs/54 pkt 9).
- P-3 Kolejność publikacji: „Dwa kroki (Recommended)” → najpierw pod domeną z blokadą Google, potem osobna zgoda.
- P-4 Zatwierdzanie tekstów (prawne, ramka, akapit): „Tylko agenci” → autor + niezależny recenzent.
- P-5 Języki tekstów prawnych i ramki: „Od razu 35 języków”.
- P-6 Akapit o wsparciu: „Tak, razem z ramką (Recommended)” → liczba dni z kodu wydanej wersji.
- P-7 Nazwy: „Na kazdej stronie - angielska nazwa i nazwa lokalna zaleznie od jezyka. Nie robimy researchu nazw - po prostu tlumaczymy je na ine jezyki sami.”
- P-8 Adresy: „Krótkie angielskie, jak dziś (Recommended)”.
- P-9 Wygląd: „Projekt przed Google, Ty wybierasz kierunek (Recommended)”; „strona ma byc top class - czysta, czytelna i swietnie wykonana. Nie ma miejsca na blad.”
- P-10 Języki w Google: „PL i EN, reszta falami po recenzji (Recommended)”.
- P-11 Priorytet: „pozycjonowanie w przeglądarce jest ważne ale jeszcze ważniejsze w AI”; „chce zeby ta strona jak najlepiej lapala zasiegi”; „nie mozemy poelnic bledu z indeksowaniem”; „strona ma zbierac jak najwiecej wyswietlen”; „krytyczne - trzeba zrobic przeglad tego co mamy zeby nie robic dwa razy tego samego”.
- P-12 Forma planu: „Chce zbey plan byl super dokladny. Po kolei co trzeba zrobic, zadanie po zadaniu, z wymuszeniem na koordynatorze odznaczenia kazdego jktore jest zrobione, [...] lista zadan ma miec przypsiana role z prompts oraz model w jakim ma byc robiona, high level estymacje czasu.”
- Bez zmian: bez analityki (26.10), adres z www, GitHub Pages, dane tylko z tagu wydania (S4), źródła anonimowo, bez nazw innych firm.

## Mechanizm odhaczania
- Z-00 tworzy w repo strony `docs/55-plan-startu.md`: tabela zadań z kolumnami Stan (otwarte / w toku / zrobione), Data, Dowód (SHA, numer przebiegu tests.yml, ścieżka pliku).
- Test `tests/plan-startu.test.mjs`: (a) format; (b) „zrobione” wymaga daty i dowodu; (c) nie „zrobione”, gdy zadanie z kolumny „Po” nie jest; (d) przy indeksowanie=true wszystkie zadania etapów 0–6 „zrobione” — inaczej build stop.
- Koordynator zmienia Stan w tym samym commicie co scalenie pracy zadania i po każdym etapie wysyła właścicielowi skrót.

## Zadania
Repo: lkarwowski494/techniqueatlas, gałęzie funkcji od main. Każde zadanie kodu: `npm run dane && npm test && npm run build` kod 0 + zielony tests.yml na SHA; testy przed kodem; scalenie do main strony przez koordynatora po przeglądzie.
Format: ID | zadanie | rola (tryb) | model | czas | po | gotowe, gdy.

### Etap 0 — porządek i fundament (dzień 1). Równolegle: {Z-00→Z-02→Z-03}, Z-01, {Z-04→Z-05}, Z-06, Z-07.
- Z-00 | Plik planu docs/55-plan-startu.md + test odhaczania; wpis decyzji P-1…P-12 w docs/54 (ZM-08…) | 08-programista (build) | sonnet/medium | 1 h | — | test czerwony przy brakującym dowodzie, zielony na stanie startowym
- Z-01 | Przegląd 12 starych gałęzi strony: git diff main...gałąź, lista zmian unikalnych i co z każdą | 07-jakosc (audit) | opus/high | 1 h | — | raport w docs/; nic nieusunięte bez zgody właściciela
- Z-02 | PIN.json → v1.1.1-b1042 (d9382dbe5dde91e8b746d14193ed332ab889df62), wersjaWydania "1.1.1"; parytet adresów; liczby do pomiary/start-1-1-1.md | 08-programista (build) | sonnet/medium | 1 h | Z-00 | manifest 1.1.1; 708 adresów zgodnych; liczby = 708/528/310
- Z-03 | Reguła Google wg P-1: src/pages.mjs:196, strażnik S6 src/straznicy.mjs:41-56, testy (tests/straznicy-startu.test.mjs, tests/build.test.mjs) w tym samym commicie | 08-programista (build) | sonnet/medium | 1 h | Z-02 | 310 stron ćwiczeń na język bez blokady przy próbie z indeksowanie=true
- Z-04 | Instrukcja docs/strona-kroki-wlasciciela.md: Porkbun, GitHub (weryfikacja domeny, Pages „GitHub Actions”, własna domena, „Enforce HTTPS”), narzędzia webmastera (Google + druga wyszukiwarka; TXT, mapa) — ścieżki z przeczytanych tego dnia stron | M8-formalnosci (build, zawężona) | opus/high | 1,5 h | — | „przejście na sucho”; luki oznaczone
- Z-05 | WŁAŚCICIEL: DNS w Porkbun + włączenie Pages wg Z-04 | właściciel | — | 25 min + do 24 h | Z-04 | curl -sI domeny nie wskazuje parkingu; certyfikat
- Z-06 | Badanie zasięgu u źródeł: asystenci AI (roboty, robots.txt, plik-przewodnik dla AI, wyszukiwarki), druga wyszukiwarka i szybkie zgłaszanie, dane strukturalne dla stron instruktażowych, obrazki i miniatura, strony z powtarzalnym tekstem (398), słowa w adresie (P-8). Lista zmian z cytatem + „nie robić” | 11-wzrost (audit) + badacz | opus/medium | 2,5 h | — | raport w docs/; każda rekomendacja z adresem i cytatem
- Z-07 | Metoda sprawdzenia znaków towarowych (708 EN + nazwy lokalne języków indeksowanych; S3 bierze nazwy wszystkich budowanych języków — startGuards): ≥ 2 metody → PYTANIE | M8-formalnosci (build, zawężona) | opus/high | 1,5 h | — | pytanie z opcjami i rekomendacją u koordynatora
- Z-08 | WŁAŚCICIEL: wybór metody znaków towarowych | właściciel | 5 min | Z-07 | decyzja dosłownie

### Etap 1 — projekt wyglądu (dni 1–2)
- Z-10 | Inwentarz strony i 2–3 kierunki wyglądu jako makiety (ćwiczenie, główna języka, lista/filtr; telefon/komputer; jasny/ciemny; nagłówek z marką i menu, stopka, nazwa lokalna + angielska, ramka „w aplikacji”, krótka odpowiedź) | M6-strona-www prowadzi 04-studio-projektowe (build, moduł strona-www) | opus/high | 4 h | Z-02 | zrzuty w pełnej rozdzielczości + ścieżki; WCAG 2.2 AA
- Z-11 | WŁAŚCICIEL: wybór kierunku okiem | 15 min | Z-10
- Z-12 | System wyglądu: tokeny, komponenty, szablony, stany (brak rysunku, brak wskazówek, 404), ikona, obrazek podglądu | 04-studio-projektowe (build) | opus/high | 3 h | Z-11, Z-06 | docs/design/ kompletne

### Etap 2 — treść i nazwy (dni 1–3, równolegle z etapem 1)
- Z-20 | Teksty pl + en: polityka prywatności (zgodna z kodem), regulamin, licencja treści | M8-formalnosci (build, zawężona) | opus/high | 2 h | — | każde twierdzenie z dowodem plik:linia
- Z-21 | Ramka „w aplikacji” (5–8 zdań) i akapit o wsparciu, pl + en; każde zdanie z dowodem w kodzie aplikacji na tagu 1.1.1; akapit wg brzmienia z decyzji 02.11 (bez „darmowa” przy części płatnej), liczba dni z lib/access.ts:25 | 04-studio-projektowe (build) | opus/high | 1,5 h | — | tabela zdanie → dowód
- Z-22 | Szablony tytułu, opisu, nagłówków-pytań i krótkiej odpowiedzi — wyłącznie z istniejących danych; pl + en | 04-studio-projektowe (build) + wnioski Z-06 | opus/high | 2 h | Z-06 | wzorce dla 5 ćwiczeń; bez powtórzeń słów
- Z-23 | Niezależna recenzja Z-20, Z-21, Z-22 | 06-tresci (audit) | opus/high | 1,5 h | Z-20…Z-22 | werdykt; poprawki przez autorów
- Z-24 | Polskie nazwy 708 ćwiczeń (tłumaczenie własne, P-7), wg słownika terminów aplikacji | 09-lokalizacja (build) | sonnet/medium | 2 h | — | plik nazw pl; 0 braków; 0 trafień wzorców zakazanych
- Z-25 | Niezależna recenzja nazw pl | 09-lokalizacja (audit) | opus/medium | 1,5 h | Z-24 | werdykt; poprawki
- Z-26 | Tłumaczenie Z-20…Z-22 na 33 języki | 09-lokalizacja (build) | sonnet/medium | 3 h | Z-23 | 35 języków, 0 braków
- Z-27 | Niezależna recenzja 33 języków | 09-lokalizacja (audit) | opus/medium | 2,5 h | Z-26 | werdykt per język
- Z-28 | Znaki towarowe wg Z-08: trademark-check.json dla EN i pl | M8-formalnosci (build, zawężona) | opus/high | [DO USTALENIA po Z-08] | Z-08, Z-25 | S3 przechodzi z indeksowanie=true

### Etap 3 — wdrożenie (dni 2–4; jedna linia pracy: src/pages.mjs, assets/site.css)
- Z-30 | Strategia testów nowego zakresu przed kodem (testy czerwone) | 07-jakosc (build) | opus/medium | 2 h | Z-12, Z-22
- Z-31 | Wygląd wg docs/design/; budżety wagi | 08-programista (build) | sonnet/medium | 5 h | Z-30
- Z-32 | Nazwa lokalna + angielska na każdej stronie; język bez zrecenzowanych nazw — sama angielska | 08 (build) | sonnet/medium | 2 h | Z-31, Z-25
- Z-33 | Strony prawne + stopka + ramka + akapit (35 języków); appStoreId "6819977165" (sprawdzić u źródła); strażnik „zdania ramki sprawdzone dla wersji = wersjaWydania”; liczba dni z .cache/app | 08 (build) | sonnet/medium | 4 h | Z-31, Z-27
- Z-34 | Zasięg wg Z-06 i Z-22: tytuły, opisy, nagłówki-pytania, krótka odpowiedź; dane strukturalne; obrazek z opisem i miniatura; robots.txt i pliki dla robotów AI; nazwa witryny | 08 (build) | sonnet/medium | 4 h | Z-32, Z-33
- Z-35 | Przegląd lokalizacji zbudowanych stron (pl, en + próbka 33) | 09-lokalizacja (audit) | opus/medium | 1,5 h | Z-34

### Etap 4 — bramka jakości (dzień 4)
- Z-40 | Audyt zgodności wyglądu z projektem | 04-studio-projektowe (audit) | opus/high | 1,5 h | Z-35
- Z-41 | Jeden audyt gotowości na jednym commicie (lista „przed pierwszym indeksowaniem”, próba z indeksowanie=true, figury tylko z recenzją, linki, wydajność, dostępność, prywatność, anonimowość) | 07-jakosc (audit) | opus/high | 2,5 h | Z-40, Z-28

### Etap 5 — publikacja ukryta przed Google (dzień 4–5)
- Z-50 | WŁAŚCICIEL: zgoda na pierwszą publikację (z blokadą Google) | 2 min | Z-41, Z-05
- Z-51 | Ręczne pages.yml; przebieg dowodowy na żywej stronie | 10-wydanie (build) | sonnet/medium | 1 h + pages.yml | Z-50
- Z-52 | Niezależne sprawdzenie żywej strony (20 stron × pl/en) | 07-jakosc (reaudit) | opus/high | 1 h | Z-51

### Etap 6 — włączenie Google i AI (dzień 5)
- Z-60 | Jeden PR: indeksowanie true, indeksowanieOd, push w pages.yml; test planu wymaga etapów 0–5 | 08 (build) | sonnet/medium | 0,5 h | Z-52
- Z-61 | WŁAŚCICIEL: zgoda na włączenie Google | 2 min | Z-60
- Z-62 | Publikacja + sprawdzenie na żywo | 10-wydanie (build) | sonnet/medium | 1 h | Z-61
- Z-63 | WŁAŚCICIEL: weryfikacja domeny i mapy w Google i drugiej wyszukiwarce | 20 min | Z-62
- Z-64 | Linki do strony: adres marketingowy w ASC i link na apps4brew.com (zmiana w sklepie za zgodą) | 10-wydanie (build) | sonnet/medium | 1 h | Z-62
- Z-65 | Zapis w repo trening: P-1…P-12 w docs/18, docs/49 §5, fakt Porkbun w docs/fakty-wlasciciela.md, ZB-017 spełnione, zobowiązania etapu 7 | M9-koordynator-sesji | opus/medium | 1 h | Z-62 | verify:docs zielone

### Etap 7 — po starcie (do docs/zobowiazania.md)
- Z-70 fale języków (09 build → 09 audit → M8 → Google), 5–8 języków, 4–6 h na falę, od dnia 6
- Z-71 odczyt po 2 i 4 tygodniach (11-wzrost audit, opus/medium)
- Z-72 decyzja: rozszerzenie Google poza 310 · Z-73 decyzja: pomiar wejść z AI · Z-74 następne wydanie aplikacji (zdania o funkcjach, link z aplikacji, wskazówki dla 398) · Z-75 narzędzia strony (fale 1 i 2 docs/54)

## Czas
Agenci ok. 60–65 h, w większości równolegle → ok. 5 dni kalendarzowych. Właściciel ≈ 1 h 10 min. Czekanie: DNS/certyfikat do 24 h; Google „a few days to a few weeks”; znaki towarowe [DO USTALENIA po Z-08].

## Czego nie robimy
Słów kluczowych w adresach; tekstów pod frazy; wymieniania źródeł i nazw innych firm; badania nazw lokalnych; nowego wydania aplikacji przed startem; scalenia integracja-1-1 → main aplikacji; otwierania 33 języków i 398 stron przed recenzją; analityki; narzędzi strony przed startem; rysunków wstrzymanych.

## Uwagi sesji planowania
Role, modele, etapy i nazwy plików to rekomendacje sesji planowania, nie decyzje właściciela. Właściciel nie odpowiedział wprost „1.1.1 czy następna wersja” — zatwierdzony plan zakłada start na 1.1.1.

## Stan (do czasu docs/55 w repo strony)
| ID | Stan | Sesja | Data | Dowód |
|---|---|---|---|---|
| Z-00, Z-02, Z-03 | w toku | AQ | 27.11 | — |
| Z-01 | zrobione | AR | 27.11 14:55 | techniqueatlas strona/z01-przeglad-galezi @ efc69dd6 (Claude noreply, 1 plik docs/przeglad-galezi-2026-11-27.md); tests.yml 46017953936 success na tym SHA. Wynik: 12 gałęzi; 7 przodkami main, tender-thompson w main pod innym SHA, stan-wskazowka i filtr-audytu-s6 nieaktualne → do usunięcia przez właściciela; zachować figury/petla-jednokierunkowa (→ Z-02a) i claude/amazing-cori-vqo0qi (→ Z-09) |
| Z-02a | otwarte (KO-129) | AQ po Z-03b | 27.11 | — |
| Z-09 | w toku | AW | 27.11 15:45 | — |
| Z-10 | w toku | AX | 27.11 16:05 | — |
| Z-04 | zrobione | AS | 27.11 14:40 | techniqueatlas strona/z04-z07-z20-formalnosci @ ad5264c4 (autor Claude noreply; docs/strona-kroki-wlasciciela.md, 10 kroków, 12 stron pomocy czytanych 27.11, luki K1–K8); tests.yml na końcowym SHA AS — do potwierdzenia |
| Z-05 | zrobione — kroki 1–8 (Enforce HTTPS: właściciel 27.11 ~16:00 „gotowe”) | — | 27.11 16:03 | curl: http://www.techniqueatlas.com → 301, https → 404 GitHub (brak wdrożenia, oczekiwane) |
| Z-07 | zrobione | AS | 27.11 14:47 | docs/znaki-towarowe-metoda.md @ c76182b8 (z decyzją Z-08) |
| Z-08 | zrobione — decyzja właściciela | — | 27.11 ~14:50 | AskUserQuestion: „Nie robimy tego.” (sprawdzanie znaków towarowych nazw) → Z-28 odpada; strażnik S3 (src/straznicy.mjs checkTrademarks, R-016) do zmiany zgodnie z decyzją w tym samym commicie co test (CLAUDE.md repo trening) — nowe zadanie Z-03b dla AQ |
| Z-20 | zrobione (czeka recenzja Z-23) | AS | 27.11 15:05 | strona/z04-z07-z20-formalnosci @ c76182b8 (4 commity Claude noreply, tylko docs: docs/teksty/prawne/ pl+en ×3 + dowody.md D-1…D-15); tests.yml 46019852421 success na tym SHA. Do weta (AS): własna polityka strony; licencja: wyszukiwarki i asystenci AI mogą indeksować/cytować z linkiem, zakaz zbiorów do uczenia modeli; hosting jako kategoria; rysunek tylko w wydruku. Otwarte: wstawki {{administrator}}/{{kontakt}} (Z-33; e-mail nie w repo), [DO KONSULTACJI] PP-1–3, R-1–3, L-1–2; Z-52: brak Set-Cookie |
| Z-28 | odpada (Z-08) | — | 27.11 | — |
| Z-06 | w toku | AT | 27.11 | — |
| Z-24 | w toku | AU | 27.11 | — |
| Z-21 | zrobione (czeka recenzja Z-23) | AV | 27.11 15:25 | techniqueatlas strona/z21-ramka-akapit @ 34d87bd3 (Claude noreply, 1 plik docs/teksty/ramka-w-aplikacji.md; warianty A 8 zdań / B 5 zdań pl+en; do weta: A, „Ta strona jest bezpłatna”, średnik → zdanie); tests.yml 46022874080 success na tym SHA; otwarte dla Z-23: en „at no charge” |
