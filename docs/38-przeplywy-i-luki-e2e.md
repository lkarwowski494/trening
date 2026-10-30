# 38. Przepływy użytkownika, luki E2E i czas przebiegu (13.10.2026)

Polecenie właściciela z 13.10.2026 (wieczór): scenariusze Maestro mają w pełni zastąpić ręczne testowanie właściciela w każdym przypadku sensownym z perspektywy użytkownika — wszystkie realne
przepływy nowego i istniejącego użytkownika, automatycznie, przy każdej wersji; warianty kombinatoryczne (35 języków, setki kombinacji danych) zostają w Jest. Wariant „wszystkie realne przepływy
w Maestro”. Ten dokument opisuje wynik: katalog, luki, nowe scenariusze, granice automatyzacji, czas i podział na maszyny. Dane są w `tests/przeplywy.json`; tabele
z przepływami generuje `node scripts/flows-catalog.mjs --write` (`docs/37` — katalog, `docs/39` — lista kontrolna wydania dla właściciela).

## 1. Katalog przepływów (etap 1)

Plik `tests/przeplywy.json` to jedyne źródło prawdy. Wpis ma: `id` (grupa-numer), tytuł, **stan startowy** (`nowy`, `istniejacy`, `aktualizacja`, `kopia`, `jezyk-motyw`), wersję, **realność**
(`realny` / `brzegowy`; teoretyczne tylko w polu `pominiete` z powodem — CLAUDE.md, „Audyty i wydania” pkt 6), kroki, oczekiwany wynik, ekrany (trasy z `app/`) oraz **pokrycie**: scenariusz
Maestro ze `znacznikami` (teksty/identyfikatory, które muszą stać w KODZIE scenariusza), albo `wyjatek` (`jest` — z istniejącymi testami zastępczymi; `telefon` — z konkretną kontrolą dla właściciela),
albo `projekt` (wersja 0.20: plik scenariusza jeszcze nie istnieje). Źródła inwentaryzacji: wszystkie 33 ekrany `app/`, przepływy z `docs/22` (61 pozycji audytu UX) i `docs/31`, ustawienia,
okna i komunikaty, powiadomienia, StoreKit, HealthKit, Live Activity, kopia/eksport/import, kalendarz i plany, generator, „Dostosuj do miejsca”, miejsce jednorazowe 0.19, „Co nowego”, oraz
zachowania „nie po ścieżce” (zabicie aplikacji, anulowanie okien, puste i błędne dane, odmowa uprawnień, tło, zmiana daty, bardzo dużo danych).

Stan na 13.10.2026: **143 przepływy** (126 realnych, 17 brzegowych): nowy 16, istniejący 109, po aktualizacji 6, po przywróceniu kopii 4, po zmianie języka/wyglądu 8. Pokrycie:
116 w Maestro (z tego 39 dopisanych dziś nowymi scenariuszami, 1 przez rozszerzenie pary 33–34, 76 pokrytych już wcześniej), 4 w Maestro jako eksperyment, 7 w Jest (wyjątki), 13 tylko telefon
(11 dla 0.19, 2 dla 0.20), 3 projekt 0.20. Pominięte jako teoretyczne: 5 (ręczna edycja bazy, brak miejsca na dysku, synchronizacja z iCloud, iPad, link głęboki z innej aplikacji).

## 2. Bramka (etap 2) — `tests/przeplywy.test.ts`, część `npm run verify` (`jest`)

- każdy przepływ ma dokładnie jedno pokrycie; scenariusz istnieje, a jego `znaczniki` występują w kodzie YAML (bez komentarzy, razem z podprzepływami `runFlow`) — przepływ nie może
  „udawać”, że scenariusz go sprawdza;
- **każdy** plik `.maestro/NN-*.yaml` jest przypisany do przepływu;
- **każdy ekran z `app/` (`tests/routes.ts`) występuje w przepływie — nowy ekran bez przepływu blokuje verify**, tak jak `check:matrix`; przepływ nie wskazuje nieistniejącego ekranu;
- wyjątek ma powód (>= 40 znaków) i istniejące testy zastępcze (`jest`) albo kontrolę dla właściciela (`telefon`); lista „tylko telefon” musi obejmować powiadomienie przy zablokowanym ekranie,
  Zdrowie, zakup w piaskownicy, TestFlight, wibrację i eksport do Plików;
- scenariusze `eksperyment` mają tag w pliku i NIE są na liście `flows` w `config.yaml`; zwykłe są na liście i bez tagu;
- przepływy 0.20 (`projekt`): plik scenariusza jeszcze nie istnieje — po jego dopisaniu bramka każe zamienić wpis na zwykły (ze znacznikami);
- `docs/37` i `docs/39` zgodne z JSON (`flows-catalog.mjs --check`).
Propozycja wpisu do `CLAUDE.md` (zmiana należy do właściciela, agent jej nie wprowadza): „Katalog przepływów (13.10.2026): `tests/przeplywy.json` — nowy ekran albo funkcja = nowy przepływ i scenariusz
Maestro (albo wyjątek z powodem); bramka `tests/przeplywy.test.ts` w verify; lista dla właściciela: `docs/39`.”

## 3. Raport luk (etap 2) — co było, czego brakowało

Porównanie katalogu ze scenariuszami `.maestro/` (28 zwykłych + 4 podprzepływy) i testami Jest. Luki (przepływy realne bez scenariusza) przed pracą — **39 przepływów w 9 grupach**:

| Luka (przepływy) | Wcześniej | Teraz |
|---|---|---|
| Zarządzanie szablonami: duplikat, archiwum i przywrócenie, usunięcie gestem, „Zapisz zmiany w szablonie”, „Zapisz jako szablon” (SZ-03, 04, 05, 07, TR-31) | tylko Jest | `24-szablony-zarzadzanie.yaml` |
| Narzędzia w treningu: cofnięcie ✓, przerwa ±15 s, przerwa ćwiczenia, notatka serii i treningu, superset, technika z treningu, usunięcie ćwiczenia, odrzucenie, blokada drugiego treningu (TR-07, 08, 16, 18, 19, 23, 24, 26, 27, 28) | tylko Jest | `25-trening-narzedzia.yaml` |
| Zarządzanie planem: nazwa, drugi plan i powrót, usunięcie planu, wyłączenie planu, panel dnia (zmiana szablonu, „Wolne w tym dniu”, dopisanie do minionego dnia, start) (PL-02, 03, 04, 05, 07, 08, 09, TR-05) | 13 pokrywał część | `26-plan-zarzadzanie.yaml` |
| Biblioteka ćwiczeń: nowe własne ćwiczenie, „Utwórz” z wyboru, usunięcie i przywrócenie (SZ-10, SZ-12, NU-13) | tylko Jest | `27-biblioteka-cwiczen.yaml` |
| Długa historia: cztery sesje z różnych dni, rekord w sesji, wykres/rekordy z kilku sesji, usunięcie sesji (HI-03, HI-08) | brak | `28-dluga-historia.yaml` |
| Błędne i skrajne dane: pusty trening, liczby poza zakresem, masa ciała, pusty szablon, podwójne stuknięcie (NU-12, PR-07, 08, 09, 10) | tylko Jest | `29-bledne-dane.yaml` |
| Przerwanie: zabicie aplikacji przy wpisywaniu serii i w edycji szablonu („Niezapisane zmiany”) (PR-03, PR-05) | tylko szkic ćwiczenia (16) | `36-przerwanie-szkice.yaml` |
| Praca w innym języku i restart; ustawienia trwałe (JM-01, JM-02) | 09/35 tylko przełączanie | `37-jezyk-motyw-trwale.yaml` |
| Przewodnik, licznik przeczytanych, przypomnienie o treningu (NU-09, PL-14) | brak | `38-pomoc-powiadomienia.yaml` |
| Stan po aktualizacji: plan, miejsce „Home”, trening wstecz (AK-03) | 33–34 bez planu i miejsc | rozszerzenie `33` i `34` |
| Odmowa zgody na powiadomienia, tło i powrót, przywrócenie z pliku kopii (US-11, PR-11, DA-04, DA-05) | brak, tylko telefon | `40`, `41`, `42` (eksperymenty, pkt 5) |

Nowe selektory/`testID` (z testem — scenariusz w interpreterze je wykorzystuje i pada bez nich): `tpl-list-N` / `tpl-arch-N` (lista szablonów), `session-N` (lista sesji w Planie), `plan-saved-N` (inne plany),
`plan-name` (nazwa planu), `lib-row-N` (lista ćwiczeń), `ex-N` (nagłówek bloku w treningu), `w-N-M` (ciężar w edytorze sesji).

## 4. Wyjątki (przepływy bez scenariusza Maestro) i powody

| Id | Przepływ | Typ | Powód |
|---|---|---|---|
| PR-12 | zablokowany ekran, powiadomienie o końcu przerwy, Live Activity | telefon | baner, ekran blokady i Dynamic Island poza aplikacją |
| PR-13 | porzucony trening >2 h / >6 h | Jest | zegara symulatora nie przestawi Maestro; `MAESTRO_NOW` tylko w interpreterze |
| PR-14 | zmiana daty i strefy, północ, granica miesiąca | Jest | j.w.; nocny `tests-tz.yml` (7 stref) i `MAESTRO_NOW` (dodatkowo sprawdzone dziś dla 24–28 w niedzielę, poniedziałek i na granicy miesiąca) |
| PR-15 | setki sesji | Jest | ≈40 s na sesję przez UI; skala w testach wydajności; 4 sesje robi 28 |
| PR-16 | dane z nowszej wersji, błąd startu bazy | Jest | brak drogi z UI |
| PL-15 | pusty szablon w planie | Jest | rzadkie; logika i ekran w testach |
| DA-07 | import uszkodzonego pliku | Jest | okno wyboru pliku (eksperyment 42 sprawdza tylko dobry plik) |
| JM-04 | 35 języków × trasy | Jest | decyzja właściciela: kombinatoryka zostaje w Jest |
| US-08, US-10 | zapis/odczyt Zdrowia | telefon | okno zgody HealthKit, brak danych na symulatorze CI |
| US-13 | prawdziwy zakup | telefon | okna Apple, konto piaskownicy |
| US-15 | „Napisz do nas”, prośba o ocenę | telefon | okna systemowe |
| DA-02, DA-06 | eksport JSON/CSV przez arkusz, import CSV z pliku | telefon | arkusz udostępniania i plik CSV z innej aplikacji |
| AK-05, ZD-01, ZD-02, ZD-03 | TestFlight, wibracja, instalacja, dostępność systemowa | telefon | sprzęt/okna systemowe |
| W2-04, W2-05 | mowa w słuchawkach, zegarki na prawdziwych zegarkach (0.20) | telefon | brak toru dźwięku i zegarka w symulatorze CI |

Symulator umie dziś (zgodnie z istniejącymi scenariuszami): zabicie i start aplikacji z danymi, restart w przerwie, ustawienia, wszystkie ekrany, sztuczny sklep (21, 35), gest przesunięcia.
Nie umie albo jest niesprawdzone: okna systemowe (zgoda na powiadomienia, HealthKit, wybór pliku, arkusz udostępniania), ekran blokady i powiadomienia, haptyka, Live Activity, zmiana zegara.

## 5. Eksperymenty — rzeczy, których nikt jeszcze nie uruchomił na symulatorze

Cztery scenariusze z tagiem `eksperyment` (40–42 oraz 60 od 29.10.2026), poza listą `flows` (główny przebieg ich nie uruchamia; interpreter w Jest przechodzi je w całości, więc logika aplikacji jest sprawdzona):

| Plik | Co zakłada o Maestro/iOS | Co daje, gdy zadziała | Jeśli padnie |
|---|---|---|---|
| `40-odmowa-powiadomien.yaml` (US-11) | `launchApp: permissions: { all: allow, notifications: deny }` ustawia odmowę z góry | odmowa zgody bez udziału właściciela | wynik eksperymentu: składnia nie działa; wariant z oknem systemowym „Don’t Allow” (z apostrofem typograficznym) |
| `41-tlo-powrot.yaml` (PR-11) | `pressKey: Home` na iOS i `launchApp: { stopApp: false }` wracają bez restartu; czekanie przez `extendedWaitUntil … optional` | tło i powrót w przerwie bez telefonu | zostaje restart (02, 32) i punkt PR-12 na telefonie |
| `42-kopia-przywrocenie.yaml` + `subflows/wybierz-plik-kopii.yaml` (DA-04, DA-05) | Maestro widzi okno wyboru plików (Browse → On My iPhone → Trening → Backup) | przywrócenie z pliku — dotąd tylko właściciel na telefonie | punkt DA-02 na telefonie |
| `60-baza-uszkodzona.yaml` + `scripts/ci/e2e-60-baza-uszkodzona.sh` (PR-18, ryzyko R-RES, 29.10.2026) | powłoka na symulatorze podmienia `Library/SQLite/trening.db*` na pliki nie-SQLite (`simctl get_app_container … data`); Maestro wchodzi na ekran błędu startu i „Send data”; powłoka sprawdza `Documents/Backup/Rescue-…` (`ls`, `cmp`) | dowód, że `expo-file-system` na iOS czyta i kopiuje pliki bazy z `Library/SQLite` (kopia ratunkowa, `lib/rescue.ts`) | błąd aplikacji: opis z logiem i zrzutem, bez poprawki na ślepo |

Uruchamianie: `maestro test .maestro/4X-….yaml` (60 tylko przez skrypt `scripts/ci/e2e-60-baza-uszkodzona.sh`; w `e2e-ios.yml` wejście `tylko_scenariusze: 60` uruchamia samo zadanie eksperymentów) albo zadanie `eksperymenty` z `latki-e2e/przeplywy-e2e-eksperymenty-zadanie.yml` (niewiążące, `continue-on-error`). Awansowanie na zwykły scenariusz
po trzech zielonych przebiegach: usuń tag, dopisz do `config.yaml`, dopisz wagę w `scripts/ci/e2e-shards.json`. Bramka pilnuje spójności (pkt 2).

## 6. Wersja 0.20 (zegarek, głos) — projekt, kod po scaleniu

Funkcje na gałęziach `f020-protokol` (protokół zegarka, „do uzupełnienia”, głos) i `f020-garmin`; gałęzi `f020-applewatch` jeszcze nie ma. W katalogu: W2-01..W2-03 (`projekt`), W2-04, W2-05 (telefon).

- `50-zegarek-do-uzupelnienia.yaml` (W2-01, W2-02) — **JEST (14.10.2026)**, tryb testowy zegarka wdrożony: `EXPO_PUBLIC_WATCH_FAKE=1` razem ze sztucznym sklepem (zamek podwójny; `lib/watch/test-mode.ts`, straż `tests/watch-test-mode.test.tsx`), zmienną ustawia tylko `e2e-ios.yml` (łatka właściciela `atrapa-zegarka-e2e.patch`; do czasu łatki scenariusz 50 w buildzie E2E nie zobaczy panelu „Test watch”). Pierwotny opis: wymaga trybu testowego zegarka w buildzie E2E — wzorzec jak sztuczny sklep: `EXPO_PUBLIC_WATCH_FAKE=1` (tylko `e2e-ios.yml`, straż w teście jak
  `tests/store-adapter.test.ts`) i panel „Test watch” z przyciskami zdarzeń (`done`, `differ`, `skip`, `undo`) na ekranie treningu — atrapa `lib/watch/fake.ts` już istnieje w protokole.
  Kroki: start treningu → „zrobione inaczej” z zegarka → w wierszu „to fill in” i „Done” → rekord nie liczy serii → „Finish” → okno „Sets to fill in” → Anuluj (wraca) → „Finish anyway” → sesja
  bez znaczników. ≈ 3 min.
- `51-glos-ustawienia.yaml` (W2-03): Ustawienia → Trening → przełącznik „Voice also through the phone speaker” (domyślnie wyłączony), „Listen to an example”, wskazówka o braku głosu; stan po restarcie.
  Dźwięku nie da się sprawdzić. ≈ 1,5 min.
- `53-objasnienia-info.yaml` (US-18, JM-05): Ustawienia → ⓘ przy „Workout view” (Field), „Weekly set goal per muscle group” (SectionTitle) i „Voice also through the phone speaker” (SwitchRow): zwinięte → rozwinięte → zwinięte, ⓘ nie przełącza przełącznika; potem ciemny wygląd. Kroki ⓘ dopisane też w 14 (opis celu, „What this is based on”), 35 (opis widoku) i 51 (opis przełącznika).
- Drugi zegarek (`f020-garmin`) i Apple Watch na prawdziwych zegarkach: tylko telefon (W2-05), lista w `docs/35` gałęzi `f020-protokol`.
Gdy gałąź zostanie scalona: dopisać pliki, zamienić wpisy `projekt` na `scenariusz` ze znacznikami (bramka tego wymaga), wagi do `e2e-shards.json`.

## 7. Zmiany w interpreterze (`tests/maestro-runner.ts`) — przez nie scenariusze są sprawdzalne w Jest

- **odstęp stuknięć 1100 ms** (`TAP_GAP_MS`): polecenie Maestro trwa na symulatorze ≥ 1 s; wcześniej interpreter potrafił stuknąć dwa przyciski szybciej niż blokada podwójnego stuknięcia (`useOnce`, 1000 ms)
  i „gubił” drugie stuknięcie, którego prawdziwy Maestro by nie zgubił (znalezione przy 24). wszystkie scenariusze 01–38 i 40–42 przechodzą po zmianie (pełny przebieg `tests/maestro-*`, 6,5 min);
- nowe polecenia i klucze: `doubleTapOn`, `pressKey: Home` + `launchApp: { stopApp: false }` (AppState), `extendedWaitUntil … optional` (czas mija do końca timeoutu), selektory `checked` i `selected`,
  `launchApp permissions: { notifications: deny | allow }`;
- scenariusze `eksperyment`: okno zgody iOS udawane jako okno z „Allow” / „Don’t Allow”, wirtualny dysk (`expo-file-system`) i atrapa wyboru pliku; kroki okna systemowego (`wybierz-plik-kopii`) pomijane;
- **po pierwszym przebiegu na symulatorze (run 38471218362, 13.10.2026)** interpreter dopasowany do tego, co przepuścił, a Maestro nie: `hideKeyboard` na polu z klawiaturą numeryczną (number-pad, decimal-pad,
  numbers-and-punctuation — bez „Gotowe”) jest błędem; pole okna `Alert.prompt` ma wartość domyślną, niezaznaczoną (wpis dopisuje się, `eraseText` kasuje); przy otwartym oknie `tapOn` wybiera pierwszy
  pasujący element od góry, także ekranu ZA oknem (stuknięcie nic nie robi), `index` liczy się wśród okna i ekranu pod nim;
- `blur()` odporny na pole zdemontowane razem z ekranem (wyszukiwanie + „Back”).
Dowód, że nowy przepływ może paść: zdjęcie blokady `once` z przycisku „+” (`components/AddButton.tsx`) wywala 29 (sprawdzone ręcznie, zmiana cofnięta).

## 8. Czas przebiegu i podział na części (łatka dzieląca E2E na 3 maszyny)

**Pomiar** (przebieg 38411267312, log `latki-e2e/job.log`): 25 scenariuszy = 4929 s (82 min 9 s), aktualizacja 33→34 ≈ 5,6 min. **Model**: czas ≈ 50 s + 1,86 s × liczba kroków (z rozwinięciem podprzepływów), dopasowany do 25 zmierzonych
scenariuszy; zastosowany do nowych (szacunek, odświeżyć po pierwszym zielonym przebiegu):

| Scenariusz | Kroki | Szacunek | | Scenariusz | Kroki | Szacunek |
|---|---|---|---|---|---|---|
| 23 miejsce jednorazowe | 47 | 2:17 | | 29 błędne dane | 89 | 3:36 |
| 24 szablony | 111 | 4:17 | | 36 przerwanie | 99 | 3:54 |
| 25 trening — narzędzia | 134 | 5:00 | | 37 język/motyw | 72 | 3:04 |
| 26 plan | 156 | 5:40 | | 38 pomoc | 39 | 2:03 |
| 27 biblioteka | 75 | 3:10 | | 13 (było 4:53, doszło miejsce na dni) | 121 | ≈ 5:50 |
| 28 długa historia | 122 | 4:37 | | 33+34 (było 4:58) | 140 + 37 | ≈ 6:50 + narzut |
| 40 / 41 / 42 (eksperymenty, osobno) | 65 / 60 / 91 | 2:51 / 2:55 / 3:39 | | | | |
| 57 grafika ćwiczeń (figura v2: fazy, mięśnie, błąd; 25.10.2026) | ok. 30 | ok. 1:45 | | | | |

Razem zwykłe scenariusze ≈ **128 min** na jednej maszynie (było 82 min). Na jednej maszynie przekroczyłoby to strażnika czasu (`MAESTRO_ALARM` = 6000 s = 100 min) — **podział na części jest
konieczny**, nie tylko wygodny.

**Podział na 3 części** (algorytm `scripts/ci/e2e-shards.mjs`, wagi z `przeplywy-shards-wagi-i-eksperymenty.patch`):

| Część | Waga | Scenariusze |
|---|---|---|
| 1 | 42,6 min | 01 04 05 09 10 19 23 27 31 35 38 + aktualizacja 33→34 |
| 2 | 43,5 min | 02 03 11 17 20 22 24 26 28 32 36 37 |
| 3 | 43,4 min | 06 07 08 12 13 14 15 16 18 21 25 29 |

Równowaga w granicach 1 minuty (nowe scenariusze wchodzą do planu automatycznie; wagi to szacunek). **Czas zegarowy**: build ≈ 42 min + część ≈ 43 min + narzut części 8–9 min ≈ **94 min** (było ≈ 144 min przy 25
scenariuszach, run 38411267312; na jednej maszynie z nowymi ≈ 180 min). Przy ponownym użyciu aplikacji (`aplikacja_z_przebiegu`, zmiana samych scenariuszy): **≈ 52 min** (było ≈ 100 min). Eksperymenty (≈ 9 min + narzut) idą czwartą,
niewiążącą maszyną równolegle — nie wydłużają przebiegu. Z 4 części: ≈ 33 min na część, ale 4 maszyny macOS naraz (GitHub bywa bez maszyn — CLAUDE.md); rekomendacja: 3.
Zakładam niezależność scenariuszy od kolejności (każdy zaczyna od `clearState`; 33→34 to para).

## 9. Wymagane od koordynatora (workflow i skrypt — nie commitowałem)

1. Łatka podziału (`e2e-shard*.patch`) — jak opisuje `latki-e2e/README.md`.
2. `przeplywy-shards-wagi-i-eksperymenty.patch` na `scripts/ci/e2e-shards.mjs` / `.json` (gałąź `f018-e2e-shard`): pomija tag `eksperyment` w podziale (inaczej 40–42 wpadłyby do części i mogłyby ją zaczernić) i dodaje wagi 23–29, 36–38, 13, 33, 34.
   Test `tests/e2e-shards.test.ts` (tamta gałąź) liczy pliki w katalogu — po scaleniu z tą gałęzią trzeba go dostosować (pliki z tagiem `eksperyment` poza podziałem).
3. Opcjonalnie zadanie `eksperymenty` (`przeplywy-e2e-eksperymenty-zadanie.yml`).
4. Wejście `tylko_scenariusze` działa na numerach (`24`, `26 28`).

## 10. Otwarte pytania do właściciela (opcje, kompromisy, rekomendacja)

1. **Eksperymenty 40–42: gdzie je uruchamiać?** (A) osobne, niewiążące zadanie przy każdym przebiegu — czerwone eksperymenty nie czernią przebiegu, kosztują czwartą maszynę i ≈ 12 min; (B) tylko ręcznie
   (`tylko_scenariusze` / jednorazowo) — zero kosztu, ale trzeba pamiętać; (C) od razu do głównego przebiegu — ryzyko, że pierwszy przebieg będzie czerwony z powodu niewiadomych. **Rekomendacja A**, a po trzech
   zielonych przebiegach awans na zwykłe scenariusze.
2. **Strażnik czasu części.** (A) obniżyć `MAESTRO_ALARM` z 6000 s do 3600 s (część trwa ≈ 43 min; zawieszenie wykryte po godzinie zamiast po 100 min); (B) zostawić 6000 s. **Rekomendacja A** po pierwszym
   zielonym przebiegu na 3 częściach (poluzować, gdyby kolejka maszyn wydłużała części).
3. **Tryb testowy zegarka w buildzie E2E (0.20).** (A) `EXPO_PUBLIC_WATCH_FAKE` + panel „Test watch” jak „Test store” (pełny scenariusz „do uzupełnienia” w Maestro; koszt: kilkadziesiąt linii kodu + straż
   w testach, żeby nie trafił do TestFlight); (B) tylko Jest i lista telefonu (zero zmian w buildzie, ale „Gotowe”/„Zakończ mimo to” sprawdza wyłącznie interpreter-ekran). **Rekomendacja A** — wzorzec już działa (sklep).
4. **Test aktualizacji a artefakty żyjące 1 dzień.** (A) zostaje: poprzednia wersja z ostatniego zielonego przebiegu na `main` (pomijana z ostrzeżeniem, gdy artefakt wygasł); (B) trzymać aplikację poprzedniego wydania jako
   plik wydania w repozytorium (publiczny build symulatora bez sekretów) — test aktualizacji zawsze możliwy, ale plik w publicznym repo (ADR-031). **Rekomendacja A** do czasu pierwszego wydania w App Store.
5. **Wpis w CLAUDE.md o katalogu przepływów** (pkt 2). (A) dopisać (bramka dostaje „uzasadnienie” w zasadach, agenci znają regułę); (B) zostawić w `docs/20` i `docs/38`. **Rekomendacja A.**

## 11. Pakiet podstawowy E2E, ponowienie i tryb ścisły (decyzja właściciela 19.10.2026)

**Dlaczego.** Pełny katalog (>40 scenariuszy) trwa 1,5 h, a przebiegi na `macos-26` pokazały niestabilność czasową symulatora: w kolejnych przebiegach (18–19.10.2026, ta sama aplikacja)
czerwone były za każdym razem inne scenariusze (zrzuty: stuknięcie zakładki tuż po starcie albo po „Back” zignorowane, klawiatura numeryczna zostająca na ekranie, bezwładność listy po przewinięciu, zgubiony
pierwszy znak wpisu). Poprawianie ich pojedynczo się nie zbiegało. Zasada: **bramka wydania to krótki pakiet kluczowych przepływów, reszta mierzy niestabilność**.

**Pakiet podstawowy** (`scripts/ci/e2e-podstawowy.json`, wejście `pakiet`, domyślnie `podstawowy`; 14 scenariuszy, 2 maszyny, ok. 25 min wagi na część): 01 start treningu z szablonu i zapis serii; 02 przerwa
i dane po zabiciu aplikacji; 05 zakończenie, historia, edycja sesji; 09 język, wygląd, jednostka; 13 plan tygodnia; 20 Zdrowie; 21 zakup i limit; 31 pierwsze uruchomienie → pierwszy tydzień; 33 + 34 aktualizacja
z poprzedniej wersji (migracje); 35 ustawienia; 36 przerwanie i szkic po restarcie; 52 strażnik progresji; 53 objaśnienia ⓘ. Kryteria: ścieżka głównego użycia, ryzyko utraty danych, ryzyko odrzucenia przez Apple
(zakup), nowe w wydaniu (ⓘ, strażnik). Zmiana listy = zmiana zakresu bramki (test `tests/e2e-pakiet.test.ts`). Kopia i przywrócenie (42) wejdzie, gdy przestanie być eksperymentem.

**Bramki.** TestFlight blokuje zielony **pakiet podstawowy**. App Store blokuje **jeden pełny katalog E2E na standardowym iPhonie** (jedno ponowienie scenariusza dozwolone; CLAUDE.md, decyzja właściciela 21.10.2026 — zastąpiona reguła z 19.10.2026: pełny katalog w trybie ścisłym). Wejście `tryb_scisly` zostaje w workflowie jako opcja, nie bramka.

**Ponowienie.** W trybie zwykłym nieudany scenariusz jest uruchamiany RAZ, osobno (tylko ten plik); drugi czerwony = porażka. Test aktualizacji (33–34) powtarza się jako para od czystej instalacji poprzedniej wersji.
Niestabilność jest widoczna: podsumowanie każdej części i zadanie „wyniki przebiegu” wypisują scenariusze zielone dopiero w ponowieniu, a artefakt `e2e-wyniki` (JSON, 1 dzień jak wszystkie — ADR-031; trwały ślad to podsumowanie przebiegu) ma per scenariusz wynik
(przeszedł / przeszedł w ponowieniu / padł dwa razy / padł bez ponowienia) i czasy (`scripts/ci/e2e-wyniki.mjs`).

**Noc.** `nightly.yml` uruchamia pełny katalog (`pakiet: pelny`, mały ekran, ciemny wygląd) niewiążąco, razem z eksperymentami. **Noc to sygnał, nie bramka** (21.10.2026; zastąpiony warunek z 19.10.2026 o kolejnych czystych nocach): porażka — błąd aplikacji → naprawa, błąd skryptu → backlog;
pomiar z `e2e-wyniki` posłuży do naprawy niestabilności w fazie audytu (stałe identyfikatory zamiast tekstów — osobne zadanie).

**Zmiana w CLAUDE.md (do zatwierdzenia przez właściciela — agent nie zmienia tego pliku na polecenie innego agenta).** Proponowany tekst punktu o E2E: „`e2e-ios.yml`: domyślnie pakiet podstawowy (blokuje TestFlight);
pełny katalog nocą niewiążąco; przed App Store pełny w trybie ścisłym (`tryb_scisly`, bez ponowień); nieudany scenariusz ponawiany raz, zielone w ponowieniu są wypisywane” (propozycja z 19.10.2026, zastąpiona 21.10.2026 brzmieniem w CLAUDE.md).
