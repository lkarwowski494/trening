# Diagnoza: ruch w sklepie tylko z Polski — 22.11.2026

Zlecenie koordynatora po decyzji właściciela KO-100 (22.11.2026 ~09:30 UTC): przejść każdą możliwą przyczynę techniczną i sklepową z dowodem, zanim zaczniemy
zmieniać metadane 33 lokalizacji. Sesja AL (rola M5). Dowody: publiczne API App Store (`itunes.apple.com/lookup` i `/search`, limit 200), strony karty
`apps.apple.com` (PL, CZ, DE) i strony Apple (adresy niżej), odczyt 22.11.2026 ok. 09:40 UTC. Surowe odpowiedzi (z nazwami innych aplikacji) leżą w katalogu
przebiegu poza repo. API wyszukiwania nie jest wyszukiwarką sklepu 1:1 — pozycje to sygnał, nie pomiar.

## Wynik w skrócie

Niczego nie znalazłem zepsutego. Aplikacja jest dostępna w każdym sprawdzonym kraju poza Chinami (wyłączone świadomie), a w każdym kraju wyświetla się
właściwa lokalizacja karty z lokalnymi cenami. Ruch z Polski bierze się z dwóch rzeczy, których w innych krajach nie ma: (1) aplikację widać tam na frazę,
którą ludzie naprawdę wpisują („dziennik treningowy”, 7. miejsce), i (2) właściciel prowadzi tam ruch spoza wyszukiwania (filmy, znajomi, odesłania).
Poza Polską aplikacja jest wyżej tylko na własnej nazwie i na frazach, których prawie nikt nie wpisuje (1–10 aplikacji w wynikach). Na frazach, które
ludzie wpisują, nie ma jej w pierwszych 200, a obok stoją aplikacje z tysiącami ocen przy naszych 2 (obie z PL).

## Przyczyny w kolejności wagi

| # | Przyczyna | Stan | Dowód |
|---|---|---|---|
| 1 | **Brak sygnałów zachowania** (pobrania, oceny) poza PL. Apple: wyniki zależą od „text relevance (…) as well as user behavior (downloads, ratings and reviews, and more)” | potwierdzona (sygnał) | oceny: PL 2, pozostałe 31 storefrontów 0 (lookup 22.11); mediana ocen pierwszej dziesiątki na frazach głównych: od kilkunastu do kilkunastu tysięcy (tabela niżej, wartości w katalogu przebiegu) |
| 2 | **Frazy w nazwach poza PL są albo puste, albo nie do wygrania.** Gdzie fraza z nazwy daje 1–10 wyników, jesteśmy wysoko, ale tę frazę mało kto wpisuje. Gdzie wyników jest ~200 (fraza popularna), jesteśmy daleko | potwierdzona (sygnał) | tabela niżej: CZ, SK, DK, FI, HR, SE — fraza z nazwy 1–8 wyników, pozycja 1–2; frazy ogólne kraju (posilovna, træningsdagbog, treenipäiväkirja, krafttraining, scheda palestra, ficha de treino, 筋トレ, 헬스, antrenman) — poza 200 |
| 3 | **Ruch PL pochodzi głównie spoza wyszukiwania.** Punkt odniesienia KO-080: konwersja z wyszukiwania 8,03%, z przeglądania 100%, z odesłań 55,56%; PL 65 z 79 odsłon. Filmy właściciela, link i krąg znajomych są polskie | potwierdzona dla całości; podziału źródeł na kraje nie widzimy | docs/18 KO-080 (16.11); `docs/fakty-wlasciciela.md` (TikTok) |
| 4 | **Dane są sprzed zmiany nazwy.** Punkt odniesienia kończy się 14.11 (karta „Trening: …” we wszystkich językach); karta RepsGoat jest od 17.11 (5 dni) | potwierdzona | docs/18 KO-080; lookup: wersja 1.1.0 z 17.11 |
| 5 | Kraje z domyślnym en-GB (CZ, SK, UA, TR, HU, RO, GR, DK, NO, FI, HR, SI…) nie indeksują lokalnego języka | **wykluczona jako blokada** (sygnał) | CZ „deník z posilovny” → pozycja 1, SK „denník z posilňovne” → 1, TR „spor salonu günlüğü” → 6, HR „dnevnik za teretanu” → 1, UA „щоденник тренувань” → 147; lokalne słowa działają także tam, gdzie język lokalny jest tylko dodatkowy |
| 6 | Aplikacja niedostępna w kraju | wykluczona (poza CHN) | lookup dla 32 storefrontów: 31 zwraca 1.1.0; Chiny — brak, zgodnie z decyzją o odłożeniu (rejestracja ICP, `docs/18-archiwum-do-11.10.md:379`) |
| 7 | Zła lub pusta lokalizacja karty na żywo, kopie EN | wykluczona dla nazw i podtytułów | lookup: nazwy w DE, AT, FR, ES, IT, NL, SE, BR, MX, JP, KR, RU, PT zgodne z `store/app-store-names.json`; w krajach z en-GB — nazwa EN zgodnie z tabelą Apple; karta DE na żywo: podtytuł „Krafttraining & Pausentimer” = repo; w repo każda lokalizacja ma własny podtytuł i słowa (`store/app-store-metadata.json`) |
| 8 | Ceny lub plany | wykluczona | pobranie bezpłatne we wszystkich 31; zakupy w walucie kraju (PL 4,99 zł / 19,99 zł; CZ 29 Kč / 199 Kč — karta `apps.apple.com` 22.11) |
| 9 | Słowa kluczowe na żywo różnią się od repo | **nie do sprawdzenia publicznie** | pole nie jest publiczne; zapis W-22 szedł workflowem z repo (podgląd 43756117258). Podgląd `asc-metadane.yml` 22.11 (przebieg 45008777648, success): „Brak edytowalnej wersji” (stany READY_FOR_SALE) — skrypt czyta tylko wersję edytowalną (`scripts/asc/metadane.mjs:24`), więc pola na żywo nie zostały odczytane. Potrzebny odczyt wersji w sprzedaży przez API (zmiana skryptu — automat AM albo programista); komunikat skryptu podaje też nieaktualny krok „utwórz wersję 1.0” |

### Pozycje na frazy w języku kraju (API wyszukiwania, 22.11.2026)

| Kraj | Fraza (z nazwy) | Wyników | Pozycja | Fraza ogólna | Pozycja |
|---|---|---|---|---|---|
| PL | dziennik treningowy | 186 | 7 | plan treningowy / siłownia | poza 200 |
| CZ | deník z posilovny | 1 | 1 | posilovna | poza 200 |
| SK | denník z posilňovne | 1 | 1 | gym log | poza 200 |
| DE | gym-tagebuch | 190 | 10 | trainingstagebuch / krafttraining | poza 200 |
| AT | gym-tagebuch | 186 | 17 | — | — |
| US | gym log & rest timer | 193 | 107 | gym log / rest timer gym | poza 200 |
| GB | — | — | — | gym log / gym diary | poza 200 |
| FR | journal de muscu | 93 | 11 | carnet musculation | poza 200 |
| ES | diario de gimnasio | 192 | 100 | rutinas gimnasio | poza 200 |
| IT | diario allenamento | 171 | poza 200 | scheda palestra | poza 200 |
| NL | gym-logboek | 193 | 53 | krachttraining | poza 200 |
| SE | gymdagbok | 8 | 2 | träningsdagbok | poza 200 |
| DK | styrkedagbog | 1 | 1 | træningsdagbog | poza 200 |
| NO | dagbok for gym | 41 | 6 | treningsdagbok | poza 200 |
| FI | salipäiväkirja | 10 | 1 | treenipäiväkirja | poza 200 |
| UA | щоденник тренувань | 194 | 147 | — | — |
| BR | diário de academia | 199 | 70 | ficha de treino | poza 200 |
| MX | diario de gym | 193 | 81 | rutinas gym | poza 200 |
| JP | — | — | — | 筋トレ記録 / 筋トレ | poza 200 |
| KR | — | — | — | 운동 기록 / 헬스 | poza 200 |
| TR | spor salonu günlüğü | 110 | 6 | antrenman | poza 200 |
| HU | edzésnapló | 170 | 35 | — | — |
| RO | jurnal antrenament | 188 | 38 | — | — |
| GR | καταγραφή προπόνησης | 27 | 6 | — | — |
| RU | дневник тренировок | 187 | 99 | — | — |
| PT | diário de ginásio | 188 | 36 | — | — |
| HR | dnevnik za teretanu | 5 | 1 | — | — |

Marka „repsgoat”: pozycja 1 w PL, CZ, SK, DE, US, FR, UA (jedyny wynik). Liczba wyników to [OCENA] popytu: fraza z 1–10 wynikami najpewniej ma mało wyszukań,
ale liczby wyszukań bez płatnych narzędzi nie znamy.

## Oczekiwanie „mniej więcej po równo na kraj” — fakty

- Wyświetlenie liczy się tylko wtedy, gdy ktoś zobaczy aplikację w sklepie: „Impressions (Unique Devices): The number of unique devices that have viewed your app
  on the Today, Games, Apps, and Search tabs of the App Store” (Metric definitions, odczyt 22.11). Bez miejsca w wynikach wyszukiwania i bez wyróżnienia
  w przeglądaniu w danym kraju wyświetleń tam po prostu nie ma — niezależnie od liczby konkurentów.
- Miejsce w wynikach zależy od dopasowania tekstu i zachowania użytkowników (cytat w przyczynie 1). Zachowanie (pobrania, oceny) aplikacja zbiera dziś tylko w PL,
  więc tylko tam ma przewagę nad zerem. Nowa aplikacja przegrywa na frazach popularnych: „highly competitive – especially if you are a newer or smaller app”
  (App Store search).
- Rynki różnią się liczbą użytkowników i wyszukań; liczb dla krajów Apple na przeczytanych stronach nie podaje — **[DO USTALENIA]**, bez zgadywania.
- Wniosek: przy obecnych danych równy rozkład nie jest oczekiwanym stanem. Ruch pójdzie za frazami, na których aplikacja może być w pierwszych wynikach,
  i za kanałami, które prowadzą ludzi z danego kraju.

## Co da się naprawić od razu, a co z wersją

| Działanie | Kiedy | Wykonalność |
|---|---|---|
| Nazwa i podtytuł każdej lokalizacji: fraza z realnym ruchem i do wygrania (średnia liczba ocen pierwszej dziesiątki niska), zamiast fraz pustych (CZ, SK, DK, FI, HR, SE) i nie do wygrania (IT, US, GB) — E1–E3 dla 33 lokalizacji | z nową wersją (zmiana nazwy tylko z wersją: App information, cytat w `pozycjonowanie-stop1.md`) | `store/app-store-names.json`, `store/app-store-metadata.json`; zapis `scripts/asc/metadane.mjs` |
| Słowa kluczowe: frazy długiego ogona w języku kraju (np. CZ „deník” + „posilovna” osobno) | z wersją | jw. |
| Oceny: prośba o ocenę działa (`lib/review-run.ts`, próg 3 treningi, docs/26) — sprawdzić, czy padła u użytkowników spoza PL | odczyt ocen per kraj przez API (automat AM) | `lib/review-run.ts` |
| Kanał spoza PL (link kampanii, społeczność, twórcy w innym języku) — poza zakresem M5 | decyzja właściciela | plan dotarcia (KO-086…088, zawieszony) |
| Sprawdzenie słów kluczowych na żywo (przyczyna 9) | podgląd 22.11 nie wystarczył (wyżej) — odczyt wersji w sprzedaży przez API | `.github/workflows/asc-metadane.yml` (podgląd 43756117258) |

Dane potrzebne z API App Store Connect (automat sesji AM, KO-100; właściciel 22.11.2026: „Chce zeby wszystko co sie da bylo wyciagane z ASC przez API zebym nie musial sam dawac danych do analiz.”) — krok ręczny właściciela tylko, gdy dane są pilne, a API ich nie daje:

| Do przyczyny | Miara (nazwy Apple, Metric definitions) | Podział | Okres |
|---|---|---|---|
| 1, 3 | Impressions (Unique Devices), Product Page Views (Unique Devices), First-Time Downloads | źródło (App Store search, App Store browse, App referrer, Web referrer) × terytorium (każde z 31) | dziennie 05.11–dziś; granica 17.11 (nazwa RepsGoat) |
| 1 | oceny i recenzje | terytorium | od 05.11 |
| 4 | jak wyżej | przed / po 17.11 | 05.11–16.11 i 17.11–dziś |
| 9 | słowa kluczowe na żywo (pole wersji) | 32 lokalizacje | stan bieżący — podgląd `asc-metadane.yml` (tryb podglądu, zgoda koordynatora 22.11) |

## Źródła (odczyt 22.11.2026)

developer.apple.com: `/app-store/search/`; App Store Connect Help: `reference/performance-metrics/` (Metric definitions), `view-app-analytics/view-acquisition-sources/`,
`reference/app-information/app-store-localizations` („the language shown to each customer could be impacted by factors like the App Store language for their location,
their device’s language settings, languages you’ve added, and your primary language”). API: `itunes.apple.com/lookup?id=<aplikacja>&country=<kraj>` (32 kraje),
`itunes.apple.com/search` (50 zapytań), `apps.apple.com/{pl,cz,de}/app/id<aplikacja>`.
