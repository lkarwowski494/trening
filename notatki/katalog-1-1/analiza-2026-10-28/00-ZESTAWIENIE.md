# Katalog ćwiczeń i strona techniqueatlas — zestawienie analizy (28.10.2026)

Analiza tylko do odczytu, 5 agentów równolegle. Raporty szczegółowe (z dowodami: plik:linia, polecenia, źródła):
A — katalog i dane · B — karty ćwiczeń · C — strona: technika (z buildem 35 języków i zrzutami) · D — strona: SEO, reklamy, konwersja (zawiera nazwy konkurencji — tylko poza repo, na Dysk) · E — dwa podręczniki z załączników.
Kluczowe tezy sprawdzone przeze mnie w kodzie: błąd ról mięśni (eksport `region`, strona czyta `id`), nazwy EN poza PL (`lib/i18n.ts:140`, DEC-13), RDL — błąd z poprawną wskazówką (`lib/figures/v2/errors.ts:40` na main), start Skull Crusher „nad czołem” (`lib/cues/text/pl.json:308`), licencja bazy nazw (440 nazw z bazy w domenie publicznej — `docs/research/equipment/catalog-notes.md:97`, zamknięte).

## Stan w liczbach (1.1, integracja-1-1 @ 55ba40cb)

| Co | Liczba |
|---|---|
| Ćwiczenia w katalogu | 709 (305 podstawowych, 404 niszowe) |
| Z animacją v2 w aplikacji | 98 (4 z 43 rodzin gotowe) |
| Pozy gotowe, rodzina niewłączona | 438 |
| Tylko stara figura v1 | 53 |
| **Bez żadnej figury** | **558** (licząc figury, które aplikacja dziś pokazuje) |
| Własne wskazówki | 102 (z „częstymi błędami” 43) |
| Ogólny zestaw rodziny | 538 (170 zestawów) |
| Bez żadnego tekstu | 69 |
| **Pełna karta** (własne wskazówki + błędy + animacja + animowany błąd + role mięśni) | **17** |
| Nazwy przetłumaczone w 33 językach | **0 z 709** (wszędzie angielskie; PL: 7 polskich, 75 z polskim nawiasem) |
| Nowe zdania 1.1 bez przekładu (33 języki) | 53 |
| Strona: figury w eksporcie dziś | 0 (brak zapisu recenzji 1.1) |
| Strona: pełny build 35 języków | 26 987 stron, 342 MB, 29 s (mieści się w GitHub Pages) |
| Strona: ćwiczenia do indeksu wg obecnej reguły | 102 na język × 3 języki (pl, en, pt-BR) |
| Podręczniki: nasze ćwiczenia opisane w książkach | 101 z 709 (+ ok. 24 podobne) |

## 0. Naprawy przed czymkolwiek (bez wyboru — to błędy)

Tylko jedna rozsądna opcja: naprawić, bo każdy z tych punktów psuje stronę albo cofa naprawy 1.0.
1. Scalenie main → integracja-1-1 (już zdecydowane: wariant A, po naprawie torów) + przeliczenie danych kart i figur zamiast wybierania strony konfliktu; wraca bramka recenzji kart (1.1 dziś pokazuje treści wycofane w 1.0, np. zdanie z Deadlift (hantle) z TestFlight).
2. Strona: „undefined” przy rolach mięśni na 17 815 stronach (509 ćwiczeń × 35 języków) + test na prawdziwym eksporcie zamiast zmyślonego.
3. Eksport: brak przekładu nie może po cichu podstawiać angielskiego (dziś licznik braków = 0, choć braków są setki).
4. Eksport kart = to, co pokazuje aplikacja (dziś strona wystawiłaby wskazówki 459 ćwiczeń, których aplikacja nie pokazuje, bez bramki recenzji).
5. Workflow publikacji strony (`pages.yml`) bez `npm ci` — pierwsza publikacja by padła.
6. Poprawki merytoryczne do decyzji z hierarchii źródeł (nie Twojej): RDL — pod „Częste błędy” stoi poprawna technika (przekazane sesji 1.0); Skull Crusher — start „nad czołem” vs podręcznik „nad klatką, ramiona pionowo”; 9 ćwiczeń z kettlebellem/hantlem dostaje wskazówki o „sztandze”; ogólny błąd „szarpanie ciężarem” przy 31 ćwiczeniach bez ciężaru.
Koszt: agent ok. 8–12 h (w tym scalenie 5–8 h), czekanie: CI ok. 30–40 min × kilka, E2E pakiet podstawowy. Twój czas: 0.

## 1. Zakres startu strony (największa decyzja)

| Opcja | Co | Zysk | Koszt |
|---|---|---|---|
| S-A | Start dopiero z pełnym katalogiem: 709 ćwiczeń z figurą i kartą w 35 językach | „pełny atlas” od pierwszego dnia | najdłużej: figury dla 39 rodzin (wg docs/51 ok. 126 h agenta + recenzje), karty dla ~530 ćwiczeń; start przesuwa się o tygodnie |
| **S-B (rek.)** | Start z 1.1: publikujemy wszystkie 709, ale do indeksu idą tylko strony z pełną, zrecenzowaną treścią; reszta `noindex,follow` i wchodzi do indeksu, gdy dostanie figurę i kartę | Google od początku widzi tylko najlepsze strony (zasada „indeksujemy tylko własną treść”), strona rośnie co tydzień | zmiana reguły S6 (dziś „709/709”); na start w indeksie ok. 100–450 ćwiczeń na język |
| S-C | Start tylko z ćwiczeniami z animacją (98), reszta niepublikowana | najmniejsze ryzyko | strona mała, mniej linków wewnętrznych, później i tak S-B |

## 2. Nazwy ćwiczeń: angielska + lokalna

Warunek wspólny: najpierw przewodnik stylu i poprawione nazwy angielskie (dziś „Push Up” 7× obok „Push-Up” 11×, styl „From The Hang Position”) i stały identyfikator w eksporcie — **przed zamrożeniem adresów** (decyzja z dziś: adresy na stałe przed indeksowaniem). Agent 3–5 h, 0 zł.

| Opcja | Co | Zysk | Koszt |
|---|---|---|---|
| N0 | Bez zmian: angielskie wszędzie, tylko porządek w PL | 0 pracy | strona nie trafia w lokalne zapytania („bankdrücken kurzhantel”, „supino reto com halteres”) |
| N1 | Angielska główna + lokalne aliasy (wyszukiwarka aplikacji i strony, „także: …” pod nagłówkiem, metadane) | lokalne zapytania trafiają, aplikacja wygląda jak dziś | przekład 709 × 33 przez API ok. 6–12 USD (szacunek do sprawdzenia skryptem), agent 6–8 h, czekanie do 24 h |
| **N2 (rek. na stronie)** | Strona: nazwa lokalna w nagłówku i tytule, angielska pod nią; aplikacja: N1 + Twój wybór wyglądu (niżej) | pełny cel, najlepsze SEO | jak N1 + układ, VoiceOver dwujęzyczny, recenzja nazw każdego języka przed indeksowaniem; agent 10–14 h |
| N4 | Decyzja per język: gdzie na siłowniach mówi się po angielsku — EN + aliasy; gdzie lokalnie — N2 | najbardziej naturalne | research 33 języków (badacz, ew. Gemini z weryfikacją), +4–6 h |
Wygląd w aplikacji (zmienia Twoją decyzję DEC-13 „nazwy biblioteki po angielsku”): (a) angielska główna, lokalna drugą linią; (b) przełącznik w Ustawieniach „Nazwy ćwiczeń: angielskie / w moim języku”; (c) bez zmian w widoku, tylko wyszukiwanie po aliasach. Rekomendacja: (c) w najbliższym wydaniu, (b) później, jeśli użytkownicy poproszą.
Zakres: najpierw 305 podstawowych, niszowe później. Odrzucam składanie nazw z klocków (nienaturalne).

## 3. Które języki do indeksu Google

| Opcja | Co | Zysk | Koszt |
|---|---|---|---|
| J-A | Tylko po przeglądzie native speakera (obecna reguła D3) | najbezpieczniej | w praktyce pl, en, pt-BR na stałe |
| J-B | Wszystkie 35 od startu | maksymalny zasięg | ryzyko, że Google oceni całą domenę jako masowe tłumaczenia niskiej jakości |
| **J-C (rek.)** | Fale: po 5 języków; każda fala po automatycznej bramce (recenzent lokalizacji + słownik terminów + tłumaczenie zwrotne próbki); następna, gdy Search Console nie pokazuje problemów | kontrola ryzyka, uczymy się na danych | tygodnie na falę; Twój czas: wybór kolejności rynków (5 min na falę) |

## 4. Treść kart: 529 ćwiczeń bez wskazówek techniki

| Opcja | Co | Zysk | Koszt |
|---|---|---|---|
| **T-A (rek.)** | Pokazywać zrecenzowane ogólne wskazówki rodziny także przy ćwiczeniach bez animacji (dziś ukryte) | ok. +460 kart szybko, w aplikacji i na stronie | niezależna recenzja ok. 460 przypisań: agent 8–12 h + poprawki 3–5 h; zmienia Twoją zasadę z 25.10 |
| **T-B (rek., razem z A)** | Zdanie „czym się różni od …” generowane z danych wariantu (ławka, chwyt, przyrząd, guma, jednorącz) — bez twierdzeń o efektach | każda strona wariantu ma unikalną treść | agent 4–6 h, mało tekstu do przekładu |
| T-C | Własne karty (ustawienie, ruch, wskazówki, błędy; 2 źródła na zdanie) partiami wg popularności — najpierw 30, potem 305 podstawowych | najwyższa jakość, strony do indeksu | 30 ćwiczeń ok. 20–30 h agenta; 305 — kilkaset godzin, partiami równolegle |
| T-D | Czekać, aż rodziny dostaną animacje | spójność | strona i aplikacja długo puste |
Rekomendacja: A + B teraz, C partiami równolegle (podręczniki jako jedno ze źródeł).

## 5. Jakość i budowa karty

- Błędy: 59 z 102 własnych kart nie ma „częstych błędów” → research partiami po 10 (25–35 h) albo zostawić (sekcja się chowa). Rek.: research.
- Ogólny błąd „szarpanie ciężarem” (182 zestawy): (A) dwa warianty — z ciężarem / bez ciężaru, (B) błędy właściwe dla rodziny, (C) usunąć tam, gdzie jedyny. Rek.: A teraz, B później.
- **Jeden model karty dla aplikacji i strony** (dziś inna kolejność sekcji, mięśnie w 4 postaciach, strona nie pokazuje „Asekuracji”, aplikacja nie pokazuje sprzętu i zamienników): (A) wspólny model — Ustawienie → Ruch → Wskazówki → Częste błędy → Mięśnie → Sprzęt → Zamienniki, agent 6–10 h + E2E; (B) tylko strona dopasowana do aplikacji, 1–2 h. Rek.: A (Twój cel „karty in line z aplikacją”); Twój czas: akceptacja wyglądu (10 min).
- Nowe sekcje: sprzęt i zamienniki na karcie w aplikacji (rek. tak, bez nowych twierdzeń); oddech tylko tam, gdzie 2 źródła się zgadzają (rozciąganie, mobilność, plank); „łatwiej / trudniej” jako linki do ćwiczeń z udokumentowaną progresją (research 8–12 h; Twoja decyzja o zakresie); poziom trudności — nie teraz (brak źródeł) albo jako nazwana konwencja; przeciwwskazania — zostaje odesłanie do specjalisty (bez porad medycznych).
- Styl: jedna redakcja PL/EN 360 zdań z przewodnikiem stylu + strażnik w testach (rek.) albo tylko ok. 12 wskazanych zdań.
- Oznaczenie „ogólne wskazówki dla tego ruchu” z ⓘ przy zestawach ogólnych + liczby z karty (15–20°, sekundy faz) do rejestru twierdzeń (rek.).
- Dostępność: etykieta VoiceOver figury z pierwszym zdaniem ruchu; utracony styk oznaczony nie tylko kolorem (rek., 1–2 h).

## 6. Animacje dla 558 ćwiczeń

| Opcja | Co | Koszt |
|---|---|---|
| F-A | Wszystkie rodziny przed startem strony | najdłużej (rząd ~126 h agenta wg docs/51 + recenzje ruchu każdej rodziny) |
| **F-B (rek.)** | Rodziny w kolejności popytu (najpierw te z największą liczbą podstawowych ćwiczeń i 438 gotowymi pozami), każda po niezależnej recenzji i audycie; strona i aplikacja rosną falami | równolegle 3–5 agentów, każda rodzina z recenzją |
| F-C | Dla rzadkich wariantów statyczna figura (jedna poza) zamiast animacji | taniej, ale słabszy wyróżnik; i tak recenzja |
Duplikaty rysunków (72 ćwiczenia dzielą pozę z innym; np. Curtsy Lunge = Crossover Reverse Lunge, Chin Up = Neutral Grip Pull Up) — do naprawy w ramach rodzin.

## 7. Katalog: zakres i porządek

- Zakres: (A) zamrożony w 1.1 + link „Brakuje ćwiczenia?” do prośby (rek.), (B) ok. 25 najczęściej szukanych nowych ćwiczeń w 1.2 (rozgrzewka/mobilność, wspomagane podciąganie i dipy, olimpijskie, kalistenika; 25–50 h), (C) dodawać od razu. Ćwiczenia rehabilitacyjne poza zakresem.
- Duplikaty (Standing Gastrocnemius ≈ Wall Calf, Seated Cable Row ≈ „home”, Curtsy ≈ Crossover): scalanie tylko par z dowodem, po audycie, z migracją danych użytkownika — Twoja decyzja przy każdej parze.
- Partie: szyja jest w „barkach”, przywodzenie w „pośladkach”; 34 ćwiczenia z kettlebellem w klasie „hantle” — poprawka danych (mięśnie rozstrzyga badacz, partie Ty).

## 8. Podręczniki z załączników

Ocena badacza: „Essentials…” wyd. 4 (2016) = szczebel 3 (książka uznanych autorów), „Strength Training” (2007, poradnik) = szczebel 4; obie z jednej organizacji = razem jedno źródło. Większość naszych wskazówek się zgadza; różnice: Skull Crusher (start), drobne w martwym ciągu, przysiadzie, prostowaniu ramion. Wyjaśniają też otwarte pytanie o asekurację ćwiczeń dynamicznych.
| Opcja | Co | Koszt |
|---|---|---|
| **P-E (rek. teraz)** | Zamknąć różnice i otwarte pytania + strażnik długości cytatów także w `data/zrodla` | badacz ok. 2 h + programista 1 h, 0 zł |
| **P-B (rek. po wydaniu)** | ok. 50 ogólnych zestawów zamienić na własne wskazówki, uzupełnić niepełne karty (książka + drugie źródło szczebla 4) | ok. 5–6 h agenta (2 równolegle) |
| **P-C (stała zasada)** | Każda nowa karta: sprawdzenie w książce | ok. 10 min na kartę |
| P-A | Pełne przejście wszystkich 125 ćwiczeń | 10–14 h; niepotrzebne osobno — mapę dostanie audyt |
| P-D | Kupić wyd. 5 (©2027) | ok. 90–100 USD [do sprawdzenia]; niepotrzebne do E i B |
Książki: na Dysk do nowego, prywatnego folderu „Trening App / 06 Źródła merytoryczne (prywatne)”, nie do repo (publiczne, prawa autorskie). Na stronie i w aplikacji źródeł nie wymieniamy (zasada anonimowości).

## 9. SEO i treść strony

- Marka: „Technique Atlas” w tytułach i nazwie witryny zamiast „Exercise library”, strona „O nas” (wydawca, kontakt, bez źródeł), widoczna wersja danych (rek.; Twój czas: zatwierdzenie nazwy 5 min).
- Strony list (partie, sprzęt): (A) `noindex`, dopóki nie mają własnej treści (rek. od razu), (B) krótki własny wstęp + miniatury, (C) strony wg 19 mięśni zamiast 11 partii („ćwiczenia na dwugłowe uda”). Rek.: A od razu, potem C + B.
- Kombinacje (np. „plecy z hantlami w domu”): (A) brak, (B) partia → sprzęt tylko przy ≥ N ćwiczeń, (C) tylko hub „w domu”. Rek.: C na start, B po danych.
- Obrazy i podgląd linku: obraz pozycji jako PNG + znaczniki udostępniania (rek. przed indeksowaniem; 0,5–1 dnia) albo tylko znaczniki bez obrazu (1 h).
- Wyszukiwarka strony: szuka po nazwie angielskiej, lokalnej i aliasach (rek., 3–4 h); dziś „bankdrücken” i „スクワット” = 0 wyników.
- Adresy: angielskie slugi w każdym języku (rek.; nazwa lokalna w tytule i nagłówku waży więcej niż adres) albo lokalne slugi (1–2 dni, problem cyrylicy i CJK).
- Dane strukturalne: dobrze dobrane (bez wycofanych HowTo); poprawki drobne.

## 10. Przyciąganie do aplikacji

| Opcja | Co | Koszt |
|---|---|---|
| **K-B (rek. przy 1.1)** | Baner Safari + blok „Pobierz” z oficjalną plakietką w treści + link kampanii per język i typ strony + własna strona produktu w sklepie | agent 3–5 h; Twój czas: App Store ID i link kampanii w ASC ok. 20 min |
| **K-C (rek. w następnym wydaniu aplikacji)** | + linki uniwersalne: z karty na stronie od razu do karty w aplikacji | ok. 1 dzień agenta + TestFlight + przegląd Apple |
| K-D | + App Clip | odradzam (bez Zdrowia, osobny target) |

## 11. Reklamy

| Opcja | Co | Zysk | Koszt / ryzyko |
|---|---|---|---|
| **R-A (rek. teraz)** | Bez sieci reklamowych; jedyna „reklama” to aplikacja | zgodność z prywatnością („dane tylko na telefonie”), szybka strona, bez banera zgody | brak przychodu ze strony |
| R-B | Przygotować miejsce teraz (zarezerwowana wysokość, wyjątek CSP pod flagą), włączyć po progu ruchu | szybkie włączenie | 4–6 h teraz; przy włączeniu: platforma zgody (CMP — wymagana w UE/UK), polityka prywatności strony, prawnik |
| R-C | Reklamy od startu | przychód od dnia 1 | przy obecnej skali przychód niewielki [stawki do ustalenia], pewny koszt prywatności, szybkości i konwersji; pytanie o regulamin GitHub Pages wobec komercji |
Rekomendacja: A; ponowna ocena po ok. 12 tygodniach danych z Search Console (próg ruchu ustalasz Ty). Prawne wymogi (RODO, ePrivacy, zgoda) rozstrzyga prawo, nie wybór.

## 12. Pomiar

Search Console — zrobione dziś (obie domeny). Dodatkowo: Bing + IndexNow (rek., 1–2 h, 0 zł). Analityka na stronie: nadal brak (decyzja D4); ewentualnie później statystyki serwera bez skryptu.

## Kolejność (rekomendacja)

1. Naprawy z pkt 0 + scalenie main (zdecydowane) → sygnał „można puścić audyt ćwiczeń i grafik”.
2. Twoje decyzje: 1 (zakres startu), 2 (nazwy), 3 (języki), 4 (pokrycie) — wyznaczają resztę.
3. Przewodnik stylu nazw EN + identyfikatory → zamrożenie adresów.
4. Równolegle (różne pliki, różni agenci): nazwy lokalne + wyszukiwarka; wspólny model karty; T-A/T-B; rodziny figur falami; P-E; strona: marka, huby noindex, konwersja K-B.
5. Start strony z 1.1 (fala 1 języków), potem fale języków, huby mięśni, obrazy, P-B, K-C.
6. Reklamy: decyzja po danych.
