# 31. Scenariusze E2E „z życia” (decyzja właściciela 13.10.2026, wariant A rozszerzony)

> Uzupełnienie z 13.10.2026 (wieczór): pełny katalog przepływów (143, wszystkie stany startowe) i scenariusze 24–29, 36–38 oraz eksperymenty 40–42 — `docs/37`, `docs/38`; lista „tylko telefon” dla właściciela — `docs/39`. Tabele poniżej opisują scenariusze 31–35 i zostają.

Dotychczasowe scenariusze Maestro 01–21 sprawdzają po jednej funkcji i zostają. Do nich dochodzą **długie scenariusze 31–35**: jedna osoba, jedna
podróż, pełny zakres tego, co robi w normalnych warunkach — razem pokrywają **całą aplikację** (każdy ekran z `docs/19` „EKRAN” i każdą główną
funkcję). Pliki: `.maestro/31-…` do `35-…`, podprzepływy `.maestro/subflows/generator-plan.yaml` i `plan-kazdego-dnia.yaml`. Wszystkie przechodzą w interpreterze
Jest (`tests/maestro-flows.test.tsx`, dodatkowe testy: `tests/maestro-zycie.test.tsx`) przed wysłaniem na symulator.

## 1. Persony i podróże

| Nr | Persona | Podróż (skrót) | Plik |
|---|---|---|---|
| A | **Ola** — nowa osoba, pierwszy tydzień | pierwsze uruchomienie → „Pierwsze kroki” → „Co nowego” → generator szablonów i planu (podgląd, zapis, aktywacja) → Miejsca i sprzęt (dom, hantle, ławka) → pierwszy trening z szablonu (waga i powtórzenia wpisane, przerwa, pauza, zamiana ćwiczenia, pominięcie i przywrócenie, dopisana seria, zakończenie z niedokończonymi seriami) → dwa treningi wstecz (poprzednie dni) → „Ten tydzień”, Progresja, Postępy (podsumowanie, mapa mięśni, rekordy ćwiczenia), historia i plan | `31-pierwszy-tydzien.yaml` |
| B | **Marek** — regularny, z historią | szablon i plan na każdy dzień → jednostka kg → trening wstecz sprzed 3 dni → edycja sesji → kalendarz: przesunięcie planu o dzień i powrót → tydzień deload → trening w deloadzie (pytanie „Fewer sets”) → restart aplikacji w trakcie przerwy → pauza i restart w pauzie → kontynuacja i zakończenie → masa ciała → rekordy ćwiczenia → ekran kopii zapasowej (eksport/import, odmowa nadpisania) → ekran importu CSV → „Erase all data” (nie, potem tak) | `32-regularny-uzytkownik.yaml` |
| C | **Kasia** — aktualizacja aplikacji | **poprzednia wersja** (artefakt) → dane przez UI (szablon, kg, ciemny wygląd, zakończony trening, masa ciała 80 kg, drugi trening w toku z wpisaną serią) → **instalacja bieżącej wersji na tym samym symulatorze bez odinstalowania** → trening w toku i wpisane wartości na miejscu, „Co nowego”, dokończenie, 2 sesje w historii, masa ciała, szablon | `33-aktualizacja-przygotuj.yaml` + `34-aktualizacja-sprawdz.yaml` |
| D | **Ewa** — ustawienia i dostępność | etykiety VoiceOver zakładek i przycisków → język (polski i z powrotem) → wygląd ciemny/jasny → kg → widok „Lista” → domyślna przerwa 45 s → przełączniki (dźwięk, ekran, progresja, RPE/RIR i skala, kopia automatyczna) → cel serii ręcznie → skutki w treningu (kolumna RIR, przerwa 0:45, etykiety pauzy/zamiany/pominięcia) → Zdrowie (stan bez danych) → subskrypcja w buildzie E2E (karta, ekran zakupu, wygaszenie, ceny, przywracanie, limit, zakup) | `35-ustawienia-dostepnosc.yaml` |

Kolejność w `config.yaml`: 01–21, potem 31, 32, 33, 34, 35. Scenariusze 33–34 mają tag `aktualizacja` i są wyłączone z głównego przebiegu
(`maestro test .maestro --exclude-tags=aktualizacja`); uruchamia je osobny krok workflow (pkt 5).

## 2. Zasady (wnioski z docs/18 i docs/09)

- **Selektory po etykiecie VoiceOver i testID**, nie po współrzędnych. Wyjątek: gest (zamykanie okna modalnego — scenariusz 21).
- **Przewijanie przed stuknięciem** (`scrollUntilVisible` + `centerElement`) dla przycisków nad paskiem zakładek; `extendedWaitUntil` nie przewija —
  element poza ekranem czeka się po przewinięciu (poprawka 13.10.2026 w 32: komunikat deloadu na górze listy Planu).
- **Pasek stanu** symulatora nie bywa asercją (godzina, bateria).
- **Zegar i północ UTC.** Maestro nie przestawia zegara symulatora, a przebieg trwa >1 h i bywa przez północ UTC; asercje nie zależą od dnia tygodnia
  ani od „dziś” (np. 34 sprawdza „2 sessions”, nie „today, 2 sessions”). Interpreter ma zmienną `MAESTRO_NOW` (ISO, ustawia zegar po `launchApp`) —
  `tests/maestro-zycie.test.tsx` uruchamia scenariusze w niedzielę, poniedziałek i tuż przed północą. Znane ograniczenie (jak w 21): przebieg przez północ
  OSTATNIEGO dnia miesiąca w trakcie 35 nie wyczerpie limitu darmowych treningów.
- **Dni tygodnia.** „Kolejne dni” pierwszego tygodnia to **trening wstecz** (przycisk „Previous day” przy dacie, domyślnie wczoraj) — jedyna droga w UI, żeby mieć
  treningi z różnych dni bez zmiany zegara. Trening „jutro” nie istnieje; paski „Ten tydzień” z odcinkami **zaplanowanymi** (szare) i **wykonanymi** pokazują się
  dzięki planowi z generatora (dni po dzisiejszym).
- **Wolny symulator:** limity czasu 30–60 s, jedno powtórzenie tylko przy awarii sterownika (bez zmian).
- Brak pętli w Maestro — powtarzane kroki rozpisane (jak w 13); wspólne bloki w `subflows/`.

## 3. Tabela pokrycia: ekran × scenariusz

Każdy `EKRAN` z `docs/19` ma wiersz (pilnuje tego `tests/maestro-zycie.test.tsx`). „31–35” to nowe; numery <31 — dotychczasowe.

| Ekran (trasa) | Scenariusze | Uwaga |
|---|---|---|
| `/` (Trening: start, pierwsze kroki, tydzień, kafelki) | 01, 02, 04, 05, 12, 13, **31, 32, 34, 35** | |
| `/history` (zakładka Plan: kalendarz, panel dnia) | 01, 05, 13, 20, **31, 32, 34** | |
| `/progress` (Postępy, masa ciała, rekordy) | 05, 15, 19, **31, 32, 34** | |
| `/more` | 06, 09, 15, 19, **32, 34, 35** | |
| `/adapt` (Dostosuj do miejsca) | 22 | okno modalne po zmianie miejsca na takie z brakami sprzętu; w 31–35 bez wejścia w to okno (scenariusze zmieniające miejsce zamykają je „Cancel”) |
| `/place-once` (Inne miejsce) | 23, 13 | okno z „Inne miejsce (tylko dziś)…” w arkuszu 📍 (23); w 13 miejsce na dni planu ustawia się z listy miejsc (panel dnia → „📍 Miejsce na te dni”), „Inne miejsce…” z panelu — tests/places-ui; w 31–35 bez wejścia w to okno |
| `/exercise` (karta/edycja ćwiczenia) | 16, 17 | |
| `/exercises` | 17, 19 | wejście z Więcej; w 31 ćwiczenie wybierane z listy w Postępach |
| `/generator` | 14, **31** | |
| `/guide` | 14 | |
| `/history/[id]` (sesja) | 01, 05, 07, **31, 32, 33, 34, 35** | |
| `/history/add` (trening wstecz) | 05, **31, 32** | |
| `/history/edit` (edytor sesji) | 05, 07, **31, 32** | |
| `/more/about` | 15 | |
| `/more/backup` | **32** (ekran, odmowa nadpisania) | plik: poza CI (pkt 4) |
| `/more/bands` | 10 | |
| `/more/bodymass` | 15, **32, 33** | |
| `/more/import` | **32** (ekran startowy) | wybór pliku CSV: poza CI (pkt 4) |
| `/more/language` | 09, **35** | |
| `/more/licenses` | 15 | |
| `/more/location` | 06, 07, **31** | |
| `/more/locations` | 06, 07, **31** | |
| `/more/settings` | 09, 15, 20, 21, **32, 33, 35** | |
| `/more/sources` | 55 | Źródła wiedzy (23.10.2026) |
| `/paywall` | 21, **35** | build ze sztucznym sklepem |
| `/pick-template` | 01–03, 05, 07, **31, 32, 33** | przez „Other workout” → „From a template” |
| `/picker` | 01, 04, 06, 07, 09, **31, 35** | |
| `/plan` | 13, 14, 18, **31, 32** | |
| `/progression` | 19, **31** | |
| `/reorder` | 03 | |
| `/swap` | 07, **31** | |
| `/templates` | 01–03, 19, **32, 33, 34** | lista szablonów pod Więcej |
| `/template` | 01–03, 08, 16, 18, **32, 33** | edytor szablonu przez podprzepływ `szablon-testowy` |

### Główne funkcje × scenariusz

| Funkcja | Scenariusze |
|---|---|
| Pierwsze uruchomienie, „Pierwsze kroki”, „Co nowego” | **31**, 13, **34** |
| Generator szablonów i planu (podgląd → zapis → aktywacja) | 14, **31** |
| Miejsca i sprzęt, filtr ćwiczeń | 06, 07, **31** |
| Trening: waga/powtórzenia, przerwa, pauza, zamiana, pominięcie, dopisana seria, zakończenie | 01, 07, 12, **31, 32, 35** |
| Restart w trakcie przerwy i pauzy, kontynuacja | 02, **32** |
| Aplikacja w tle i zablokowany ekran, powiadomienie o końcu przerwy | **poza CI** |
| Trening wstecz, edycja historii | 05, **31, 32** |
| Kalendarz, plan, przesunięcie dnia, deload | 05, 13, **32** |
| Masa ciała, rekordy, Postępy, Progresja, „Ten tydzień” | 05, 15, 19, **31, 32** |
| Kopia zapasowa: ekran i odmowa nadpisania; „Erase all data” | **32** |
| Eksport/import pliku (JSON, CSV) | **poza CI** |
| Aktualizacja aplikacji z zachowaniem danych i treningu w toku | **33 + 34** (krok workflow) |
| Język, wygląd, jednostki, cel serii, przełączniki, widok treningu | 09, 11, **35** |
| Etykiety VoiceOver najważniejszych przycisków | 04, 07, 19, **35** (asercje po etykiecie) |
| Zdrowie (stan bez danych) | 20, **35** |
| Subskrypcja: karta, zakup, limit, przywracanie | 21, **35** |

## 4. Czego nie da się w CI — z powodem i odesłaniem

Lista ręczna na telefon (TestFlight) — każda pozycja ma pokrycie zastępcze w Jest:

| Pozycja | Powód | Zastępnik / odesłanie |
|---|---|---|
| Aplikacja w tle i zablokowany ekran w trakcie przerwy; powiadomienie o końcu przerwy; Live Activity | Maestro nie blokuje ekranu; baner powiadomień iOS i Wyspa to okna systemu poza aplikacją (07: baner nad aplikacją) | restart w trakcie przerwy (02, 32); `tests/timer*.test.*`, `tests/e2e-102-reminder.test.tsx`. **Telefon:** przerwa 2:00 → zablokować ekran → baner i dźwięk w 2:00 → odblokować: licznik zgodny |
| Zapis i odczyt pliku kopii (JSON), eksport CSV, import CSV z pliku | arkusz udostępniania i `UIDocumentPicker` to okna systemu | `tests/audit-io-*.test.tsx`, `tests/csv-import-*.test.*` (atrapa wyboru pliku). **Telefon:** eksport → Pliki → Wyczyść dane → import: dane identyczne |
| Dane Zdrowia (kroki, tętno, kcal, trening z zegarka); zapis do Zdrowia | HealthKit na symulatorze CI bez danych i bez zegarka (docs/29 pkt 7) | 20, 35 (stan bez danych), `tests/health*.test.*`. **Telefon:** docs/28 §6, docs/29 |
| Prawdziwy StoreKit: zakup, próba, karencja, zwrot, kod, Chmura rodzinna | okna Apple poza Maestro; w buildzie E2E jest sztuczny sklep | 21, 35, `tests/store-adapter.test.ts`, `tests/subscription-ui.test.tsx`. **Telefon:** docs/27 7.2 (piaskownica) |
| Prośba o ocenę (okno systemowe) | okno poza kontrolą Maestro, nieobecne w TestFlight | `tests/review-run.test.tsx` |
| Zmiana zegara (kolejne dni tygodnia „na żywo”), granica miesiąca/roku | symulator CI nie pozwala przestawić zegara z Maestro (bez uprawnień administratora) | `MAESTRO_NOW` w interpreterze, `tests/scenario-*.test.tsx`; w E2E — trening wstecz zamiast kolejnych dni |
| Powiększony tekst systemowy, VoiceOver na żywo, „Ogranicz ruch” | Maestro nie przestawia ustawień dostępności | `tests/a11y-*.test.*`, `tests/matrix-langs-*`, etykiety w 35 |
| Widżet, ikona, animacja startowa (`Intro`) | pasek stanu / animacja natywna, nie do asercji | `tests/intro*.test.*` |

## 5. Test aktualizacji (persona C) w `e2e-ios.yml`

Po głównym przebiegu Maestro (ten sam symulator, ten sam job — bez drugiego rozruchu), krok „Aktualizacja”:

1. **Wybór poprzedniej wersji (od 20.10.2026, audyt M1-062, DEC-27 — zmienia decyzję 06.10.2026 o artefaktach 1 dzień dla tego jednego pliku):** pusty
   wejście `poprzednia_wersja_z_przebiegu` = **plik `Trening-sim.zip` przy najnowszym wydaniu (GitHub Release) z innego commitu niż bieżący**
   (`scripts/ci/poprzednia-wersja.sh`); plik dołącza zadanie „tag” w `testflight.yml` przy każdym wydaniu TestFlight — to build symulatora z zielonego
   przebiegu E2E tego commitu, bez podpisu i bez sekretów (repozytorium publiczne; strażnik `tests/public-repo.test.ts`). Numer przebiegu w wejściu = ręcznie
   artefakt `trening-sim-app` tego przebiegu; „brak” = świadome pominięcie (np. pierwsze wydanie), tylko ręcznie.
2. **Brak poprzedniej wersji to porażka z komunikatem** (nie zielone pominięcie): skrypt kończy się błędem z instrukcją, a artefakt bez `Trening.app` też. Log
   wypisuje wersję i build poprzedniej oraz bieżącej aplikacji. Artefakty przebiegów nadal żyją 1 dzień (ADR-031); dłużej żyje tylko plik wydania.
   Pierwsze wydanie z plikiem: ręcznie dołączyć `Trening-sim.zip` z artefaktu świeżego zielonego przebiegu do istniejącego wydania (krok właściciela w raporcie M2)
   albo uruchomić E2E z wejściem „brak”.
3. `simctl uninstall` → instalacja **poprzedniej** → `maestro test .maestro/33-aktualizacja-przygotuj.yaml` (dane przez UI).
4. `simctl install` **bieżącej** na tej samej instalacji (dane, ustawienia i trening w toku zostają) → `maestro test .maestro/34-aktualizacja-sprawdz.yaml`.

Uprawnienia bez zmian (`contents: read`, `actions: read`), bez sekretów (tylko `GITHUB_TOKEN`), bez `pull_request`; `tests/public-repo.test.ts` przechodzi.
Scenariusz 33 używa tylko UI, który istnieje od wydania 0.13 (cztery zakładki); przy dużej zmianie UI poprzedniej wersji 33 może paść na jej selektorach —
wtedy to „scenariusz nieaktualny wobec starej wersji”, nie błąd nowej aplikacji.

## 6. Czas

Przebieg z 21 scenariuszami: ~66 min (run 38330631978, z buildem). Z 31, 32, 35 w głównym przebiegu i 33+34 w kroku aktualizacji: patrz „Wyniki przebiegów” (uzupełniane
po przebiegach). Strażnik czasu głównego podejścia podniesiony z 70 do 100 min, limit zadania 180 → 300 min. Opcja skrócenia czasu zegarowego (nie wykonana): wydzielić build do
osobnego zadania i uruchamiać 01–21 oraz 31–35 równolegle na dwóch maszynach.

## 7. Wyniki przebiegów (gałąź `f-scenariusze`, aplikacja z przebiegu 38324474808 — kod aplikacji bez zmian, build ze sztucznym sklepem)

| Przebieg | Wynik | Przyczyna / działanie |
|---|---|---|
| 38355192038 (pierwszy) | czerwony na starcie | artefakt `trening-sim-app` wskazanego przebiegu nie istniał (przebieg 130 sam używał cudzej aplikacji) — wskazano przebieg z buildem |
| 38355440075 (pełny, aplikacja z 38324474808) | 23/24 + aktualizacja zielona | **31**: po „Restore exercise” asercja widoczności — scenariusz (element poza ekranem) |
| 38363820424 (tylko 31) | 31 czerwony | scenariusz: wiersz „pominięte dziś” nad ekranem — Maestro nie przewija przed stuknięciem (zrzut) → dodane przewinięcie |
| 38364646107 | 31 czerwony | scenariusz: „Set 4 done — Back Squat” — stuknięty „+ set” to inne ćwiczenie niż w interpreterze → nazwa dowolna |
| 38368489051 | 31 czerwony | scenariusz/maszyna: „Co nowego” nie otworzyło się przy pierwszym stuknięciu tuż po starcie → `retry` po testID |
| 38369572843 | 31 czerwony | scenariusz: „Save templates and plan” z `centerElement` nie da się wyśrodkować (przycisk na końcu listy; zrzut) → bez centerElement |
| 38370760163 | 31 czerwony | scenariusz: jak 38364646107 (tym razem asercja z przewijaniem po nazwie) |
| 38372549029 | 31 czerwony bez komunikatu | **maszyna**: proces Maestro zakończony w trakcie przewijania (log urywa się, brak błędu kroku) — powtórzenie |
| 38373904606 | **31 zielony** (solo) | |
| 38375488119 (pełny) | 22/24; 31 i 34 czerwone | scenariusz: stuknięcie „Finish” gubione (zrzuty: 31 — przycisk ucięty u góry, 34 — odliczanie przerwy), okno „Finish workout?” się nie pokazało → `retry` + przewinięcie na początek |
| 38387152966 (pełny) | czerwony | **maszyna**: po 1. scenariuszu wszystkie kolejne padały w kilka sekund (symulator) — powtórzenie od razu |
| **38390313147 (pełny)** | **zielony: 24 scenariusze + test aktualizacji (33 → instalacja bieżącej bez odinstalowania → 34)** | poprzednia wersja wybrana automatycznie: ostatni zielony przebieg na main (38352160100) |

**Czas (maszyna macos-26, aplikacja z artefaktu, bez buildu):** przed — przebieg 38330631978: zadanie 66 min, Maestro 60 min (21 scenariuszy). Po — przebieg 38390313147: zadanie 87 min,
Maestro 75 min (24 scenariusze: +31 ≈ 5 min, +32 ≈ 9 min, +35 ≈ 3,5 min) i krok „Aktualizacja” 5,6 min. Z buildem doliczyć ~30 min. Czas zegarowy +21 min (+32%).

**Błędy aplikacji znalezione przez scenariusze:** brak (plik `bledy-z-scenariuszy.md` w katalogu roboczym nie zawiera pozycji). Znaleziska dotyczyły scenariuszy i interpretera
(zob. docs/09): przewijanie przed stuknięciem, ucięty „Finish”, `centerElement` na końcu listy, zależność od dnia tygodnia (niedziela/poniedziałek) i północy.
