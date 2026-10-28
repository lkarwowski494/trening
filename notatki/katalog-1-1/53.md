# 53. Grafiki ćwiczeń — model pracy (bramki jakości)

Polecenie właściciela 26.10.2026: „Musisz opracować sobie taki model pracy, żeby to było bezbłędne z każdej perspektywy” oraz „Musisz sam zabezpieczać sens ruchu. Ja nie dam rady przejrzeć tylu ćwiczeń.”
Zasada: żadna poza nie trafia do aplikacji, dopóki nie przejdzie WSZYSTKICH bramek poniżej. Każda bramka jest mechanizmem (test, skrypt, niezależny agent), nie postanowieniem. Właściciel nie jest bramką.

## Perspektywy i bramki

| # | Perspektywa | Ryzyko | Bramka (mechanizm) | Kto / co |
|---|---|---|---|---|
| 1 | Merytoryka | ruch lub liczba niezgodna z wiedzą | Reguły sensu per rodzina wyprowadzone ze wskazówek techniki, które mają źródła (data/zrodla/cues.json); każda reguła z odnośnikiem; liczba bez źródła = „uproszczenie/konwencja”; nowe reguły zatwierdza badacz wg hierarchii z CLAUDE.md | badacz + walidator |
| 2 | Geometria | przenikanie, zasięg, zakresy stawów, skoki | walidator kontraktu v2 (istniejący) | `waliduj` |
| 3 | Sens ruchu | poprawna geometria, zły ruch (bujanie w pozie poprawnej, broda pod drążkiem, dwie ręce w ćwiczeniu jednorącz) | (a) reguły sensu automatycznie; (b) poza poprawna nie łamie żadnej reguły; (c) każdy błąd łamie dokładnie regułę swojej wskazówki | walidator sensu |
| 4 | Ocena wzrokowa | rzecz nieuchwytna regułą („nie wygląda jak to ćwiczenie”) | niezależny agent-recenzent ogląda podglądy PNG + opis + wskazówki, odpowiada na stałą listę pytań; „do poprawy” blokuje nałożenie | recenzent ruchu (osobny agent, bez dostępu do uzasadnień generatora) |
| 5 | Kompletność | ćwiczenie bez grafiki lub z grafiką innej rodziny | raport pokrycia: każde z 709 ćwiczeń ma pozę albo jawny wyjątek z powodem; test pokrycia w verify | test |
| 6 | Spójność | różne rodziny wyglądają różnie (skala, sprzęt, tempo) | wspólne parametry sylwetki i sprzętu z jednego modułu (dane antropometryczne ze źródłem); test rozmiarów sprzętu | test |
| 7 | Teksty | opis/legenda/błąd źle przetłumaczony lub z nazwą źródła | teksty przez `t()`, zestaw przekładu, recenzent lokalizacji, strażnik anonimizacji, `check:release` | istniejące |
| 8 | Dostępność | grafika bez opisu dla VoiceOver, kolory nieczytelne | etykieta dostępności z opisu ruchu; test kontrastu palety; przycisk „Zatrzymaj animację”; reduce motion | testy UI |
| 9 | Wydajność | animacja tnie się na telefonie | budżet klatek/węzłów w teście; punkt listy „tylko telefon” po buildzie | test + telefon |
| 10 | Dane i prywatność | nazwy źródeł w paczce, znaczniki pochodzenia zgubione | runtime generowany bez nazw, `check:bundle`, `provenance-guard` | istniejące |
| 11 | Prawo | kopiowanie cudzych rysunków | pozy wyłącznie z danych liczbowych (Gemini/agent), żadnych cudzych obrazów jako wejścia; generator nie przyjmuje obrazów | zasada w generatorze |
| 12 | Regresja | nowa rodzina psuje gotowe | testy wszystkich rodzin w verify; E2E scenariusz 57 na próbce rodzin; nocny pełny katalog | CI |

### Lista kontrolna bramki 4 (recenzent ruchu) — kroki stałe

1. Czy każde `przyblizenie` w manifeście zachowuje cechę rozpoznawczą ćwiczenia? **Przybliżenie bez cechy rozpoznawczej → wyjątek** (wpis w `WYJATKI` generatora i `data/zrodla/figury-wyjatki.json` z powodem), nie render pod tą nazwą. Bramka automatyczna tego nie wykryje (przykład: Clock Push-Up, recenzja n3).
2. Czy wskazówki ćwiczenia (np. „lędźwie przy podłodze”) są widoczne na obrazie? Tekst wskazówki to sprawdzalny warunek (reguła ledzwie_przy_podlodze włączana automatycznie). Wskazówka o styku („stopy płasko na platformie / ławce / podłodze”, „grzbiet stopy na ławce”) wymaga **pomiaru** odstępu podeszwy od powierzchni we wszystkich klatkach (współrzędne SVG albo reguła styku, np. `stopa_na_platformie`), nie oceny na oko — recenzja r3 przepuściła stopę 7 cm za płytą w Leg Press i Single Leg Press (recenzja p2 r4, 28.10.2026). Dotyczy też leżenia na boku i siadów (miednica i tułów przy podłodze) oraz stopy grzbietem do podłogi — tam kolizor stopy daje fałszywy odstęp, mierz z SVG; sprawdź, czy żadna część ciała nie znika w którymś widoku (ścieżka zerowego rozmiaru). Wskazówka „lekko” (np. „slightly flex the knee”) wymaga górnego progu kąta, nie tylko dolnego (recenzja mobilności r4, 28.10.2026). **Budowa podglądu do recenzji** bez nakładania póz: `node scripts/figures/agent-pozy/run.mjs --rodzina <rodzina> --wyjscie <katalog> --podglad` (bez `--zastosuj`).
3. Czy rząd błędu różni się od pozy poprawnej wyłącznie tym błędem (wszystkie stawy) i jest widoczny w klatce, w której ma być widoczny?
4. Czy reguły z poprzedniej recenzji nie przeoczyły obrazów niezmienionych (Crunch, Hollow w n2)? Nowa reguła → przebieg na WSZYSTKICH pozach (dane + rigi), nie tylko na zmienionych.
5. **Tabela kątów stawów** (min…max na staw, obie strony; `katy-stawow.md` i `katy_stawow` w manifeście, generowane przez agent-pozy/run.mjs): recenzent porównuje ją z opisem ćwiczenia, nie tylko z obrazem — błędy widoczne w jednym rzucie albo tylko w liczbach (ramię zgięte w płaszczyźnie czołowej, kolano 29° odczytane jako ~95°) umykają samemu obrazowi (recenzja n4). Uwaga: w tym rigu noga „prosta” to ok. 10–18°, bo uda + golenie = 83 cm i każdy 1 cm niedoboru odległości biodro–kostka daje ok. 14° (czułość cosinusa).
6. **Podgląd ważny tylko z kontrolą manifestu** (mechanizm: znacznik `PODGLAD-WAZNY.txt` albo `PODGLAD-NIEWAZNY.txt` w katalogu podglądu; reguła `podgladWazny` w v2-jakosc.mjs): podgląd bez pola `zgodnosc_manifestu`, bez tabeli kątów albo z niezgodnościami nie trafia do recenzji.
7. **Sprawdzian przeciw dopasowaniu progów**: nowe reguły uruchamiaj także na pozach, na których progów nie stroiłeś (inne gałęzie rodzin), i raportuj trafienia osobno jako prawdziwe albo fałszywy alarm (`node scripts/figures/jakosc-raport.mjs --root <katalog>`).
8. **Styk ze sprzętem — zasięg, nie tylko odległość** (recenzje p2 r4/r5, 28.10.2026): stopa/dłoń/plecy mają leżeć na powierzchni sprzętu (odległość) i mieścić się w jej obrysie (pięta i palce w długości płyty, plecy na oparciu); mierz ze współrzędnych dla każdego punktu podparcia (płyta, wałek, poduszka, ławka, podłoga).
9. **Sprzęt zgodny z danymi i ze sobą**: etykieta sprzętu (`capLabel`) zgodna z trybem i punktem dźwigni w danych; sprzęt nie przenika sprzętu (np. pręt wahadła przez oparcie) — dziś bez bramki, oceniaj wzrokowo i zgłaszaj NISKIE.
10. **Pary o identycznej tabeli kątów** (np. Hack Squat = Pendulum Squat): sprawdź, czy przybliżenie nie zgubiło cechy rozpoznawczej; wpisz cechę w raporcie albo skieruj ćwiczenie do wyjątku (krok 1).

## Przebieg dla jednej rodziny

1. Badacz: reguły sensu rodziny (z wskazówek ze źródłami) → `data/zrodla/figury-sens.json`.
2. Generator: polecenie z punktami odniesienia (liczby, marginesy 1–2 cm / 2–3°, wzór z tej rodziny, sens per ćwiczenie z katalogu, reguły sensu).
3. Właściciel: wkleja polecenie w aplikacji Gemini (Argon) i odsyła odpowiedź — jedyny krok człowieka.
4. Import: geometria + sens (bramki 2–3). Niezaliczone → polecenie poprawkowe (maks. 2 rundy), potem nasz agent.
5. Podglądy + recenzent ruchu (bramka 4). „Do poprawy” → poprawka z powodem.
6. Nałożenie, testy pokrycia/spójności (5–6), teksty (7), verify, E2E próbki (12).
7. Rejestr rodziny: liczba ćwiczeń, rund, zaliczonych, wyjątków; wpis w docs/50.

## Polecenie uniwersalne, które uczy się na błędach (polecenie właściciela 26.10.2026)

Jedno polecenie bazowe dla wszystkich rodzin, składane automatycznie z czterech części:
1. **Rdzeń stały** (kontrakt, układ współrzędnych, szkielet, format odpowiedzi) — wersjonowany (`polecenie@N`), zmiana tylko przez generator.
2. **Punkty odniesienia rodziny** — liczby wyliczone z modelu: wysokości/położenia sprzętu, gotowe położenia miednicy dla pozycji skrajnych z zapasem, zakresy stawów z marginesem 1–2 cm / 2–3°.
3. **Rejestr błędów modelu** (`data/figury-bledy-modelu.json`, uzupełniany automatycznie przez import po KAŻDEJ odpowiedzi): kategoria błędu walidatora/sensu/recenzenta, liczba wystąpień, przykład liczbowy, reguła zapobiegawcza. Do polecenia trafia sekcja „Najczęstsze błędy z poprzednich rodzin i jak ich uniknąć” — 10 najczęstszych kategorii z konkretnymi liczbami (np. „kostka przekraczała 37° przy podbiciu 20 — w zwisie podbicie ≤ 10”).
4. **Wzorce** — 1–2 zaliczone pozy z tej samej rodziny (jeśli są) i 1 z rodziny najbardziej podobnej (ten sam sprzęt/kierunek ruchu), automatycznie wybierane.

Precyzja: zero opisów bez liczb tam, gdzie liczba istnieje; każda relacja jako warunek sprawdzalny (np. „y_brody ≥ y_drążka + 2 cm w u = 1”). Każda reguła w poleceniu ma swój odpowiednik w walidatorze — polecenie nie żąda niczego, czego nie sprawdzamy, i nie sprawdzamy niczego, czego polecenie nie mówi (test zgodności polecenie ↔ walidator).
Pomiar: odsetek zaliczonych za 1. razem per wersja polecenia; nowa wersja wchodzi tylko, jeśli na rodzinie kontrolnej (pull_up) nie pogarsza wyniku.

## Pomiar szczelności (czy bramki działają)

- Próbka kontrolna: co 5. rodzina — drugi, niezależny recenzent ocenia losowe 3 ćwiczenia bez wiedzy o wyniku pierwszego. Rozbieżność = luka → nowa reguła sensu albo pytanie w liście recenzenta (mechanizm, nie „uważać”).
- Każdy błąd znaleziony po nałożeniu (przez kogokolwiek, także na telefonie) = lekcja w docs/40 + nowa reguła/test, który by go złapał.
- Wskaźniki w rejestrze: odsetek zaliczonych za 1. razem, liczba rund, błędy znalezione po nałożeniu (cel: 0).

## Czego ten model nie gwarantuje (uczciwie)

„Bezbłędnie” = każdy znany rodzaj błędu ma bramkę, a nowo odkryty rodzaj dostaje bramkę od razu. Liczby bez źródła (np. dokładny kąt) pozostają uproszczeniem rysunku i aplikacja ich nie podaje jako faktu.
