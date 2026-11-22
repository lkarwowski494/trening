# Pozycjonowanie RepsGoat w App Store — STOP 1 (rozpoznanie), 22.11.2026

Rola M5 (widoczność w sklepie), tryb build, tylko E0 (sesja AL, polecenie koordynatora; cel właściciela KO-091: „dyskusja o pozycjonowaniu w AS”).
Nic nie zmieniono w App Store Connect ani w metadanych w repo. Strony Apple przeczytane 22.11.2026 ok. 09:00 UTC (adresy niżej). Surowe wyniki wyszukiwania
(nazwy innych aplikacji) zostają w katalogu przebiegu poza repo; tutaj tylko własne wnioski i liczby.

## 1. Stan wyjściowy

- **Wersja 1.1.0 jest w sklepie od 17.11.2026** (T0; katalog App Store, odczyt 22.11.2026: wersja 1.1.0, data 2026-11-17, kategoria Health & Fitness,
  2 oceny w PL, średnia 5). Do pomiaru 23.12.2026 (KO-090) zostało 31 dni; okno 17.11–23.12 = 36 dni.
- Po zawieszeniu (KO-089, 16.11) nie wykonano planu dotarcia: wydarzenia, linków kampanii ani 3 filmów (KO-087) — tak wynika z dziennika koordynatora;
  czy właściciel zrobił coś sam, **[DO USTALENIA]** (jedno pytanie przy rozmowie).

| Pole | Wartość (1.1, w sklepie) | Decyzja źródłowa |
|---|---|---|
| Nazwa PL | RepsGoat: dziennik treningowy | właściciel 09.11.2026 (docs/18, wpis RepsGoat); człon „dziennik treningowy” — STOP 2 M5 21.10.2026 (docs/45) |
| Nazwa EN (US, GB, AU, CA) | RepsGoat: Gym Log & Rest Timer | jw.; człon EN z podpowiedzi wyszukiwarki 21.10.2026 (docs/45) |
| Nazwy 27 pozostałych lokalizacji | „RepsGoat: ” + człon z badania fraz 21.10 | `store/app-store-names.json`; przegląd pod RepsGoat ZB-056 (commit 46cdfd8) |
| Podtytuł PL | Plan treningowy na siłownię | właściciel 09.11.2026 (docs/18, wpis RepsGoat; hierarchia fraz z podpowiedzi 21.10) |
| Podtytuł EN | Gym plan & workout tracker | jw. |
| Słowa kluczowe PL | siła,serie,timer,ćwiczenia,domu,stoper,progres,hantle,sztanga,rekordy,1RM,offline,gumy (88 B) | jw.; „domu” — właściciel 21.10.2026 (docs/45, podpowiedzi) |
| Słowa kluczowe EN | …,1RM,RPE,RIR,watch,offline,repgoat (US/CA 100 B, GB/AU 99 B) | docs/18 09.11 („przegląd przy 1.1 z „offline” i drugim zapisem marki”) |
| Pozostałe lokalizacje (podtytuł, słowa) | z badania fraz w 7 grupach języków | STOP 2 M5 21.10.2026 (docs/45); `store/app-store-metadata.json` |
| Kategoria | główna Health & Fitness, dodatkowa brak | właściciel 21.10.2026, STOP końcowy M5 (docs/45) |
| Zrzuty | 10 na lokalizację (PL), ciemne, z podpisami; 32 lokalizacje | podpisy D-6 B 14.10.2026, EN 28.10.2026 (`store/screenshot-captions.json`); zamiana KO-077/KO-082 (16.11) |
| Lokalizacje strony | 33 w repo, 32 w sklepie (słoweński: App Store Connect odrzucił 14.10.2026, L-003; `scripts/asc/metadane.mjs:25-27`) | STOP 1 M5 21.10.2026 |
| Wydanie 1.1 | bez stopniowania, automatycznie | KO-083, KO-084 (16.11) |
| Plan dotarcia | TikTok 3 filmy, 3 linki kampanii, wydarzenie „duża aktualizacja”, bez strony niestandardowej, bez społeczności | KO-086…KO-088 (16.11) — **zawieszony** KO-089 (16.11) |
| Pomiar | 23.12.2026 „z nowymi słowami zmierzymy wartości” | KO-089, KO-090 |
| Hipotezy | H-51 ≥ 50%, H-52 ≥ 30%, H-53 ≥ 40%, ocena 26.12.2026 | docs/45 (21.10), ZB-012 w `docs/zobowiazania.md:25` |
| Punkt odniesienia | do 14.11, karta „Trening”: 274 wyświetlenia, 79 odsłon, 16 pierwszych pobrań; konwersja z wyszukiwania 8,03%; PL 65 odsłon / 10 pobrań | KO-080 (docs/18, 16.11) |
| Wcześniejsze filmy | ok. 8 na TikToku po ok. 1 tys. wyświetleń, bez widocznych pobrań (nazwa „Trening”, bez linku) | `docs/fakty-wlasciciela.md` (16.11) |

## 2. Pokrycie i pozycje (22.11.2026)

- `storefronty.mjs` na stronie „App Store localizations”: **174 ze 175 storefrontów ma stronę w języku domyślnym**, brak tylko Chin (Simplified Chinese —
  odrzucone 21.10). Bez zmian od 21.10. Języki aplikacji bez lokalizacji App Store: bg, et, lt, lv, sr (widzą en-GB).
- Strona Apple wymienia dziś „Slovenia” na liście języków i Slovenian jako dodatkowy w Słowenii, a App Store Connect odrzucił słoweński 14.10 (L-003):
  sprzeczność **[DO USTALENIA]**; wartość mała (w Słowenii domyślny jest en-GB).
- Pozycja RepsGoat w wynikach publicznego API wyszukiwania App Store (limit 200; to sygnał, nie wyszukiwarka sklepu 1:1):

| Storefront | Fraza | Pozycja | Mediana liczby ocen pierwszej dziesiątki |
|---|---|---|---|
| PL | repsgoat / reps goat | 1 / 1 | — |
| PL | dziennik treningowy | 7 | 565 |
| PL | plan treningowy na siłownię | 14 | 144 |
| PL | plan treningowy, trening, siłownia, dziennik siłowni, timer przerw | poza 200 | 63–2065 |
| US | repsgoat | 1 | — |
| US | gym log, rest timer, workout tracker, gym plan, workout log | poza 200 | 81–105 009 |
| GB | gym log, rest timer, workout tracker | poza 200 | 35–15 975 |
| DE | gym tagebuch / trainingstagebuch | 175 / poza 200 | ok. 5–6 tys. |

Wnioski (własne): marka się wyszukuje (cel zmiany nazwy z 09.11 spełniony). W PL aplikacja jest widoczna tylko na frazach z nazwy. Po angielsku i niemiecku
na frazach głównej pracy jej nie widać, a konkurencja ma tysiące ocen przy naszych 2 — zgodnie z Apple: popularne frazy są „highly competitive – especially
if you are a newer or smaller app” (App Store search). W PL polska fraza „dziennik treningowy” daje pozycję 7 także przy zapytaniu z językiem en-GB —
**sygnał** (nie dowód), że polskie metadane są indeksowane w storefroncie PL, gdzie polski jest tylko językiem dodatkowym (pytanie H-53).
Osobno: podtytuł EN powtarza „Gym” z nazwy, a podtytuł PL — „treningowy”; to słowa zajmujące miejsce bez nowej frazy (do E1, nie decyzja teraz).

## 3. Pytania do rozmowy z właścicielem

### P-a. Czy i co zmieniać w pozycjonowaniu przed pomiarem 23.12 (KO-090) i oceną 26.12 (ZB-012)?

Fakty: nazwę zmienia się z nową wersją albo gdy stan wersji pozwala na edycję — „Later, you can change the name when you create a new version or the status
of the app version permits editing this property” (App information, odczyt 22.11); skrypt zapisu przyjmuje tylko edytowalne stany wersji
(`scripts/asc/metadane.mjs:24`). Tekst promocyjny zmienia się bez wersji, ale „promotional text doesn’t affect your app’s search ranking” (App Store search).
Każda zmiana pól przed 23.12 miesza okres „nowe słowa 1.1” z okresem po zmianie — pomiar KO-089 traci punkt odniesienia.

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | Do 23.12 nic w polach indeksowanych ani w zrzutach. Teraz na gałęzi E1–E3 (frazy, krytyka, propozycje) — gotowe do wersji 1.2 po pomiarze | czysty pomiar; ok. miesiąc bez poprawy EN, gdzie i tak nas nie widać | E1–E3 tylko w repo (`store/*.json`); wysyłka z 1.2 jak przy 1.1 (`scripts/asc/metadane.mjs`) |
| B | Wersja 1.1.1 teraz tylko z polami EN (US/GB/AU/CA), PL bez zmian | PL (82% odsłon w punkcie odniesienia: 65/79) mierzy się czysto; H-51 globalnie zaburzone; build i recenzja Apple dla samych metadanych | nowa wersja: strona „App information” (cytat wyżej); kroki wydania jak docs/49 |
| C | Zmiana PL i EN od razu, pomiar przesunięty na 8 tygodni po zmianie | szybciej do lepszej karty, ale pomiar 23.12 bez sensu i decyzja KO-090 do zmiany | jak B |

Wydarzenie w sklepie (KO-087 P4 „tak”, zawieszone KO-089) — osobna decyzja: **(A, rekomendacja) po 23.12** — wydarzenie dokłada własne wyświetlenia
i miesza źródła w pomiarze; Apple wyklucza „General promotions that raise awareness about your app” (In-App Events), więc potrzebuje prawdziwej nowości,
np. 1.2. **(B) teraz** — dodatkowe miejsce w sklepie w okresie świątecznym, kosztem czystości pomiaru. Wykonalność: strona In-App Events (odczyt 22.11);
zgłoszenie — szkic `wydarzenie-1-1-szkic.md` na gałęzi koordynacji (nieczytany w tej sesji).

### P-b. Rynki i języki priorytetowe

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | E1 tylko dla PL i angielskiego (pl, en-GB, en-US; en-AU/en-CA jako kopie) — PL to główny rynek z danymi, en-GB jest domyślny w większości storefrontów | koszt ok. 1/4 pełnego przebiegu; pozostałe 27 języków zostają z badaniem z 21.10 | `storefronty.mjs` (wyżej); pola w `store/app-store-metadata.json`, `store/app-store-names.json` |
| B | Wszystkie 33 lokalizacje od nowa (7 grup jak 21.10) | pełne odświeżenie; ok. 1,2–2,5 mln tokenów, a bez ruchu w tych krajach nie da się ocenić efektu | jw.; plan grup w docs/45 |
| C | Tylko PL | najtaniej; EN zostaje z frazami, na których nas nie ma w pierwszych 200 | jw. |

Dodatkowo do rozstrzygnięcia przy B: czy wracać do słoweńskiego (sprzeczność wyżej) — rekomendacja: nie teraz.

### P-c. Czego nie zmierzymy bez App Store Connect i co właściciel odczyta

Fakty (strony App Store Connect Analytics, odczyt 22.11.2026):
- **„Conversion Rate: Total downloads and pre-orders divided by unique device impressions”** („Metric definitions”). Hipoteza H-52 liczy pobrania ÷ **odsłony
  karty** z wyszukiwania — to inna miara. Otwarte pytanie z KO-080 jest więc rozstrzygnięte: 8,03% nie wolno porównywać z progiem 30%.
- Dane sklepu są dostępne od 5 pierwszych pobrań („Available once you have at least five first-time downloads”), a kampanie od 5 pobrań w wybranym okresie
  („minimum threshold of 5 in the date range selected”, Campaign links).
- Na przeczytanych stronach App Analytics nie ma miary fraz wyszukiwania — nie zobaczymy, po jakich słowach ktoś znalazł aplikację (sprawdzone na stronach
  Acquisition i Metric definitions, brak). Pozycje fraz zostają sygnałem z API wyszukiwania (wyżej) i zrzutów podpowiedzi z telefonu.

Kroki właściciela (cytat Apple, Acquisition): „In Apps, select the app you want to view. Click the Analytics tab. In the sidebar under Acquisition, click
Sources. The dashboard defaults to "Product Page Views (Unique Devices)." To view other metrics … use the dropdown menu at the top of the dashboard”;
wyniki można zawęzić „by territory and device”. Lista do odczytu (ok. 15 min, okresy 05.11–16.11 i 17.11–23.12):
Impressions (Unique Devices), Product Page Views (Unique Devices), Total Downloads z podziałem pierwsze/ponowne, Conversion Rate — każda według źródła
(App Store search, App Store browse, App referrer, Web referrer), raz dla wszystkich krajów i raz dla Polski.

| Opcja | Co | Kompromis | Wykonalność |
|---|---|---|---|
| **A (rekomendacja)** | Jeden odczyt 23.12 (zrzuty z listy wyżej); agent liczy H-51…H-53, w tym H-52 jako pobrania ÷ unikalne odsłony z wyszukiwania; ZB-012 (26.12) łączymy z KO-090 w jeden odczyt | 15 min właściciela raz; H-52 policzone tak, jak zapisano próg | strona Acquisition (cytat wyżej); ZB-012 `docs/zobowiazania.md:25` |
| B | H-52 przedefiniować na miarę Apple „Conversion Rate” z wyszukiwania (próg do ustalenia na nowo, bez benchmarku) | jedna liczba z ekranu; próg 30% traci podstawę | „Metric definitions” (cytat wyżej) |
| C | Automat: raporty Analytics przez API App Store Connect (workflow) | bez zrzutów; nowy workflow i dostęp do raportów — przebieg dowodowy, zgoda koordynatora na `asc-*` | **wykonalność niesprawdzona** (strona App Analytics linkuje `documentation/appstoreconnectapi/analytics`, nieczytana) |

## 4. Plan i koszt E1–E4 (do zgody)

| Etap | Wariant P-b A (rekomendacja) | Wariant P-b B |
|---|---|---|
| E1 frazy | 1 subagent (pl, en-GB, en-US), ok. 150–250 tys. tokenów | 7 subagentów, ok. 1,0–1,8 mln |
| E2 scalenie + krytyk | ok. 100–150 tys. | ok. 150–250 tys. |
| E3 metadane na gałęzi + kontrola | ok. 50–100 tys. | ok. 100–200 tys. |
| E4 hipotezy, raport | ok. 50 tys. | ok. 50–100 tys. |
| Razem | ok. 0,35–0,55 mln tokenów, ok. 8–15 USD [OCENA] | ok. 1,3–2,4 mln, ok. 30–55 USD [OCENA] — ponad pułap sesji 25 USD |

Czas agenta: A ok. 2–3 h, B ok. 4–6 h (grupy równolegle). Czekanie: nic do 23.12 (wysyłka dopiero z 1.2). Czas właściciela: STOP 2 ok. 20 min,
zrzuty podpowiedzi wyszukiwarki z telefonu ok. 10 min (8–10 fraz PL/EN), odczyt 23.12 ok. 15 min, STOP końcowy ok. 10 min. Koszt zewnętrzny 0 zł.

## Źródła (odczyt 22.11.2026)

developer.apple.com: `/app-store/search/`, `/app-store/categories/`, `/app-store/custom-product-pages/`, `/app-store/product-page-optimization/`,
`/app-store/in-app-events/`, `/app-store/app-analytics/`; App Store Connect Help: `reference/app-information/app-store-localizations`,
`reference/app-information/app-information`, `reference/app-information/platform-version-information`,
`view-app-analytics/view-acquisition-sources/`, `view-app-analytics/manage-campaigns/`, `reference/performance-metrics/` („Metric definitions”),
`measure-app-performance/overview-of-reporting-tools`. Moduł roli 10 zgodny ze stronami w cytowanych miejscach (limity, reguły słów, 70 stron, 3 wersje testu,
90 dni, wykluczenia wydarzeń).
