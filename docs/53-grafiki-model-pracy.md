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

## Stan wdrożenia bramek (26.10.2026, agent programista, gałąź `gemini-polecenia`)

| # | Bramka | Stan | Gdzie |
|---|---|---|---|
| 1 | Merytoryka | **jest** (pull_up): reguły z odnośnikiem do wskazówki (cues.json) i oznaczeniem „liczba = uproszczenie/konwencja”; zatwierdzenie nowych reguł przez badacza — krok procesu, nie kod | `data/zrodla/figury-sens.json`, test danych w `tests/gemini-polecenia.test.ts` |
| 2 | Geometria | **jest** | `waliduj` (v2-validate.mjs), testy `figures-v2-*` |
| 3 | Sens ruchu | **jest** (pull_up; inne rodziny dostają reguły przy swoim przebiegu — brak wpisu = brak sprawdzenia, jawnie): poza poprawna bez naruszeń, błąd łamie DOKŁADNIE grupę swojej wskazówki | `scripts/figures/v2-sens.mjs`, kody `sens` i `blad-sens` w `waliduj` |
| 4 | Ocena wzrokowa | **wejście i blokada gotowe**, recenzent (osobny agent) do zlecenia: paczka PNG + `manifest.json` + `PRZEGLAD.md` (stała lista pytań); wynik JSON blokuje nałożenie „do_poprawy” i generuje poprawkę z powodem | `gemini-pozy.mjs --z-pliku … --przeglad-wejscie <katalog>` → recenzent → `--przeglad <wynik.json>` |
| 5 | Kompletność | **brak** (raport pokrycia 709 ćwiczeń z pozą albo wyjątkiem + test w verify) — do zrobienia, razem z podłączeniem póz do `figureSpec` | docs/51 (tylko liczba ćwiczeń gotowych rodzin) |
| 6 | Spójność | **częściowo**: wymiary sylwetki z jednego modułu (`BODY`) i jeden walidator; test rozmiarów sprzętu — brak | `lib/figures/v2/skeleton.ts`, `contract.ts` |
| 7 | Teksty | **istnieje** (t(), przekład, strażnik anonimizacji); dla figur v2 — legendy i etykiety po podłączeniu | istniejące testy |
| 8 | Dostępność | **brak** dla pozy z danych (etykieta VoiceOver z opisu ruchu) — po podłączeniu | — |
| 9 | Wydajność | **brak** budżetu klatek/węzłów dla pozy z danych; punkt „tylko telefon” po buildzie | — |
| 10 | Dane i prywatność | **istnieje**: `data/zrodla/*` poza paczką, runtime bez nazw; pozy to liczby własne | `check:bundle`, `provenance-guard` |
| 11 | Prawo | **jest**: generator i import przyjmują wyłącznie dane liczbowe (JSON), żadnych obrazów; polecenie nie zawiera cudzych treści ani nazw marek | testy: brak nazw w poleceniu, import bez sieci i klucza |
| 12 | Regresja | **częściowo**: test „każda poza w danych przechodzi walidator” (geometria + sens) w verify; E2E próbki rodzin — po podłączeniu | `tests/gemini-polecenia.test.ts` |

### Polecenie uniwersalne (wdrożone)

- **Rdzeń wersjonowany** `polecenie@N` (`WERSJA_POLECENIA` w `gemini-polecenia.mjs`, obecnie 2): nagłówek polecenia i pole `"polecenie"` w odpowiedzi.
- **Punkty odniesienia z modelu**: stałe wymiary ciała, sprzęt domyślny, wzory i tabela (drążek y, chwyt z) → miednica.y dla u = 0 (zasięg ramienia z zapasem 0,5 cm) i u = 1 (broda ≥ drążek + 3 cm), układ osoby względem drążka (miednica 18 cm za drążkiem), marginesy 1–2 cm / 2–3°, reguła gęstości klatek z liczby `maxJump · step`. Liczby z `CONTRACT`, `BODY`, `TOL`, danych zakresów i reguł sensu — nie są przepisane.
- **Rejestr błędów modelu** `data/figury-bledy-modelu.json`: zasilany automatycznie przez każdy import (`--runda N`, `--wersja polecenie@N`; idempotentny po hashu odpowiedzi) — kategoria (kod walidatora/sensu + staw/reguła/para kolizji), liczba wystąpień, przykład, rodziny; do polecenia trafia 10 najczęstszych kategorii z regułą zapobiegawczą (szablon z liczbami silnika; nowa kategoria bez reguły dostaje komunikat walidatora). Zasilony odpowiedziami pull_up 1–3.
- **Wzorce**: poza wyliczona z modelu (pull_up; przechodzi walidator razem z błędem) albo zaliczone pozy z tej samej rodziny, z rodziny podobnej (`PODOBNE`) lub przysiad jako ostatnia deska ratunku; maks. 2.
- **Sens z katalogu**: sprzęt (drążek/kółka/lina…), ciężar ciała, jednorącz (z nazwy), chwyt; sprzęt, którego kontrakt nie obsługuje (lina), → „pomiń — zrobi nasz agent”.
- **Test zgodności polecenie ↔ walidator** (`tests/gemini-polecenia.test.ts`): każda `[reguła: id]` w poleceniu istnieje w danych i ma ewaluator; każda reguła ćwiczeń części jest w poleceniu z liczbami z danych; błędy łamią tylko swoją grupę.
- **Pomiar**: `statystykaWersji` (rejestr) — zaliczone w 1. rundzie per wersja polecenia. Uwaga: statystyka liczy według walidatora z chwili importu; po dodaniu reguł sensu wcześniejsze odpowiedzi ocenia się surowiej. Nowa wersja polecenia wchodzi tylko, jeśli na pull_up nie pogarsza wyniku.

Odrzucone: (1) przegląd wizualny przez właściciela (decyzja właściciela 26.10.2026: „Ja nie dam rady przejrzeć tylu ćwiczeń”) — zastąpiony regułami sensu i niezależnym recenzentem; (2) opisy ruchu bez liczb w poleceniu (model myli się o 1–2 cm i 1°, więc podajemy liczby, relacje i margines).

### Bramka reguł sensu przed wysłaniem polecenia (26.10.2026)

- **Generator nie tworzy polecenia dla rodziny bez reguł sensu** (`--wszystkie` pomija ją z komunikatem „POMINIĘTA — brak reguł sensu”; `--bez-regul` wymusza świadomie). Reguły ma dziś `pull_up` i `core_floor`; pozostałe 38 rodzin dostaje reguły przy swoim przebiegu (badacz/analityk wyprowadza je ze wskazówek z cues.json: mapowanie `wskazowki_na_reguly` w `data/zrodla/figury-sens.json` + typy reguł w `v2-sens.mjs`; dla rodzin podobnych do już zrobionych typy reguł da się użyć ponownie).
- **core_floor**: reguły wyprowadzone ze wskazówek ćwiczeń (mapowanie wskazówka → reguła, więc działa dla każdego ćwiczenia rodziny z wskazówką): `crunch.lowBack`/`db.back` → miednica na podłodze (y ≤ 12 cm przy y ≈ 8 w leżeniu), `crunch.neck` → kąt głowa–tułów ≤ 30°, `crunch.move` → barki ≥ 8 cm w górę przy nieruchomej miednicy, `rcrunch.move` → miednica ≥ 8 cm w górę przy nieruchomych barkach, `bd.move` → dłoń na wysokości barku i przeciwna kostka na wysokości miednicy. Liczby: uproszczenie/konwencja (zapisane przy regule). Ćwiczenia bez wskazówki dopasowanej do reguły (np. V-Up, Superman, Cocoons, Butt-Ups, Dragon Flag) mają tylko geometrię — za sens odpowiada recenzent ruchu (bramka 4).
- **Błędy tempa/oddechu** (`mis.jerk`, `plank.mis.breath`) nie są cechą pozy → nie są animowane (`bledy: []`; poza z takim błędem jest odrzucana kodem `blad-sens`), lista błędów w poleceniu ich nie podaje i ma adnotację.
- **Sprzęt spoza kontraktu** (kontrakt rysuje: drążek/sztangę, słupek, podłogę, skrzynię lub ławkę płaską): wyciągi, taśmy, piłki, maszyny, ławki skośne, GHD, zawieszenia, hantle/talerze i linę — ćwiczenie jest pomijane w poleceniu z adnotacją „zrobi nasz agent”. W core_floor 18 z 44 ćwiczeń.
- **Bramka per ćwiczenie** (decyzja koordynatora 26.10.2026: do właściciela idą tylko ćwiczenia z regułami sensu): ćwiczenie bez reguły sensu jest WSTRZYMANE (nie trafia do polecenia, jest wymienione jako „wstrzymane — brak reguły sensu”; `--bez-regul` wpuszcza je); części polecenia liczone po odfiltrowaniu. core_floor: 17 ćwiczeń w poleceniu (core_floor-1, -2), 18 pominiętych (sprzęt), 9 wstrzymanych do czasu reguł od badacza (Butt-Ups, Cocoons, Dragon Flag, Leg Pull-In, Seated Flat Bench Leg Pull-In, Side Jackknife, Stomach Vacuum, Superman, V-Up).
