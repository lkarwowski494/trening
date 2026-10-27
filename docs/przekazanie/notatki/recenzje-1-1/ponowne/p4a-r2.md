# Ponowna recenzja ruchu i treści kart: poprawki-p4a, runda 2 (kb_ballistic: 2 ćwiczenia), 27.10.2026

Recenzent niezależny (recenzent p4a-r2). Nie czytałem README podglądów, linii stanu agentów ani komentarzy w generatorach. Komunikat ostatniego commitu gałęzi wyświetlił mi się w wyniku `git log -1`. Ocena opiera się na liczbach z silnika, nie na tym opisie.

**Zakres:** Bottoms-Up Clean From The Hang Position i Kettlebell Sumo High Pull, `origin/poprawki-p4a` @ c7015fbc (tests.yml zielony, 40489910766). Podgląd: `podglady-1-1/poprawki-p4a-r2/kb_ballistic/`. Znacznik `PODGLAD-WAZNY.txt`, `manifest.json` i `katy-stawow.md` są na miejscu.

**Metoda:**
- Własny odłączony worktree na c7015fbc.
- Liczby z silnika v2 (`keyframeFrame`, `jointAngles`) na siatce u co 0,05 plus wszystkie klatki kluczowe, dla pozy poprawnej i rzędu błędu.
- Własny render wszystkich 12 klatek kluczowych funkcją repo `htmlPodgladu` (playwright). Obejrzany w pełnej rozdzielczości, kadry 2×.
- Reguły `dzwonGoraTylkoPrzyPionowymPrzedramieniu` i `highPullLokcie` uruchomione na obu pozach.
- Treść karty: `cue-sets.json`, `lib/cues/text/pl.json`, `lib/cues/data.json`, `muscles.generated.ts`, grep w `docs/research/rejestr-twierdzen.json`.
- Treść kart nie zmieniła się od aa4253fc: diff gałęzi dotyczy tylko póz, silnika i reguł.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 0 | — |
| OK z uwagą | 2 | Bottoms-Up Clean From The Hang Position, Kettlebell Sumo High Pull |
| BŁĄD | 0 | — |

**Oba błędy WYSOKIE z rundy 1 zniknęły.** Rodzina kb_ballistic nie ma już blokerów w tych dwóch ćwiczeniach. Jest jedno znalezisko procesowe o wadze ŚREDNIE (podgląd PNG pokazuje 3 klatki zamiast 12, nr P1 niżej). Nie blokuje ono samych póz, ale osłabia bramkę 4 dla wszystkich rodzin.

### Stan błędów z rundy 1 (`ponowne/p4a.md`)

| Rundy 1 | Stan | Dowód (liczby, c7015fbc) |
|---|---|---|
| nr 1 Bottoms-Up: dzwon dnem do góry w zwisie | **usunięte** | Tryb `wzdluz_gora`. u = 0: przedramię 175° od pionu (w dół), `dir` dzwonu (−0,03; −1,0; −0,08), czyli dzwon pod rączką. W u 0,05–0,7 dzwon w przedłużeniu przedramienia. Dnem do góry od przedramienia ≤ 45° od pionu (u ≥ 0,7). u ≥ 0,8: `dir` (0; 1; 0) przy przedramieniu 14,5° od pionu. Reguła `dzwon_gora_tylko_przy_pionowym_przedramieniu`: brak naruszeń |
| nr 1 (dodatkowe) Bottoms-Up: rączka 49 cm przed barkiem, wolna ręka w przód | **usunięte** | Rączka najdalej ok. 22 cm przed barkiem (u 0,548: x 24,3 vs bark 2,5), 20–28 cm przed miednicą. Wolna ręka L prosta (łokieć 0°) wzdłuż uda: u = 1 chwyt (1,9; 75,8), miednica x −4,4 |
| nr 2 Sumo HP: łokcie pod dłońmi, odwiedzenie 12,6° | **usunięte** | u = 1: łokieć 144,9 cm, dłoń 148,5 (łokieć 3,6 cm niżej, w progu 5 cm), bark 150,5. Odwiedzenie 40,9° (było 12,6°), łokieć 20 cm w bok od barku (z 39,3 vs 19). W u 0,63–0,85 łokcie wyraźnie **nad** dłońmi (o 19 → 1 cm), a odwiedzenie rośnie 20 → 39°. Reguła `high_pull_lokcie`: brak naruszeń |
| kb C Sumo HP: palce 3,3 cm nad podłogą w klatce końcowej | **poprawione** | u = 1: palce 1,3 cm, pięty 17,4 cm. Wcześniejsze klatki 0 ± 0,3 cm |

## Tabela

| Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|
| Bottoms-Up Clean From The Hang Position | dobry; cecha rozpoznawcza widoczna (zwis dzwonem w dół → dnem do góry przy pionowym przedramieniu) | brak wskazówek (zestaw `oly.*` bez tekstu); mięśnie zgodne | OK z uwagą | B1, B2 |
| Kettlebell Sumo High Pull | dobry; wygląda jak high pull (z przodu łokcie w górę i na boki nad dłońmi, na końcu dłonie przy obojczykach) | wskazówki zgodne poza „Ruszając z podłogi”; mięśnie zgodne | OK z uwagą | S1–S4 |

## Ocena szczegółowa

### Bottoms-Up Clean From The Hang Position

**Klatki przejściowe, dzwon w poziomie:**
- u 0,548: przedramię 90,6° od pionu, czyli poziomo. Rączka na 110 cm, ok. 22 cm przed barkiem. `dir` (0,98; −0,01; −0,22): dzwon leży poziomo w przód, w przedłużeniu przedramienia.
- **To jest realne.** W bottoms-up kettlebell trzyma się mocnym chwytem i obraca się razem z przedramieniem, bez przewrotu wokół rączki jak w zwykłym zarzucie. Kula leży więc w linii przedramienia: w zwisie w dół, w połowie ruchu w przód, na końcu w górę.
- Przejście do „dnem do góry” jest płynne. Przy u 0,7 przedramię jest 46° od pionu, a dzwon wciąż wzdłuż przedramienia. Przy u 0,745 przedramię jest 31° od pionu, a dzwon ok. 10° od pionu. Dzwon wyprzedza przedramię o ok. 20° przez jedną klatkę, co wygląda jak domykanie nadgarstka. Do przyjęcia.

**Pozostałe elementy:**
- Start: zwis, biodro 72°, kolano 37°, rączka na 53 cm przed kolanami.
- Wyprost: kolano 0° w u 0,45.
- Przyjęcie: krótkie ugięcie kolan do 25° (u 0,82), potem wyprost.
- Koniec: dłoń przy brodzie (145 cm, bark 139, środek głowy 161), 17 cm przed barkiem. Łokieć 32 cm pod dłonią, przed żebrami. Przedramię 14,5° od pionu.
- Strona: prawa ręka, wolna wzdłuż ciała.
- Stopy płasko (0 cm) w całym ruchu.

**Uwagi:**
- **B1 (NISKIE, realny, kosmetyka):** w u 0,33–0,6 łokieć idzie za tułów, do 14 cm za bark (u 0,47: łokieć x −10,1, bark 3,6). Wygląda jak wiosłowanie łokciem w tył. Jest to dopuszczalny wariant prowadzenia, a z boku czyta się poprawnie. Bez zmian.
- **B2 (NISKIE, stan sprzed p4a):** karta nie ma wskazówek. `oly.back`, `oly.close` i `oly.mis` nie mają tekstu w `pl.json`, a manifest ma wyjątek opisu dla `oly.mis`. Rysunek jest jedyną treścią karty. Nie ma rozjazdu, ale nie ma też treści do oceny. Sprawa tłumacza i tekstów, poza zakresem gałęzi.
- Mięśnie: pośladkowe i kulszowo-goleniowe 1, przedramiona 0,5, górna część pleców 0,5, przedni akton naramiennego 0,25. Zgodne z rysunkiem (hinge i mocny chwyt). Status „brak źródła — uproszczenie” jak w całym katalogu, poza zakresem.

### Kettlebell Sumo High Pull

**Dłonie przy brodzie:**
- u = 1: rączka na 148,5 cm, bark 150,5, środek głowy 172,5. Dłonie są więc na wysokości obojczyków, ok. 10 cm pod brodą, ok. 22 cm przed stawem barkowym (ok. 10 cm przed klatką). Dzwon wisi pod rączką przed mostkiem.
- Z przodu wygląda to jak „dłonie pod brodą”. To typowy punkt końcowy high pulla (klatka–broda). **OK.**

**Wygląd high pulla:**
- Z przodu, klatki 6–10 (u 0,63–0,88): łokcie powyżej dłoni, przedramiona skośnie w dół do środka. Klasyczny obraz.
- W klatce końcowej ramiona są prawie poziomo, łokcie tylko 3,6 cm pod dłońmi i 5,6 cm pod barkami.
- Z boku ramię widać skrócone, w przód (łokieć 23 cm przed barkiem). Wynika to z geometrii: przy dłoniach na jednej rączce odwiedzenie ok. 41° jest bliskie maksimum rigu.
- **Obraz wygląda jak high pull, nie jak uginanie ani unoszenie w przód.** Próg 35° to konwencja i go nie oceniam.

**Pozostałe elementy:**
- Start: przysiad sumo, kolano 84,5°, biodro 92°, kolana na zewnątrz (z przodu widoczne).
- Wyprost bioder i kolan przed pracą rąk: kolano 0° w u 0,76, łokieć 39° → 134° w u 0,56–1.
- Kettlebell przy ciele: rączka ≤ 28 cm przed miednicą, 15–22 cm przed barkiem.
- Wiersz błędu `mis.roundBack`: kręgosłup 26° w u 0,12–0,18, potem 19° → 11°. Na kadrze 2× widać garb w górnej części pleców w klatkach 3–6. Poza tym obraz jak poprawny (+5 cm rączki w przód).

**Uwagi:**
- **S1 (NISKIE, realny):** klatka końcowa (pauza) w mocnym wspięciu. Kostka −49,9°, czyli na granicy zakresu zgięcia podeszwowego. Pięty 17,4 cm nad podłogą, stopa prawie pionowo, „na czubkach palców”. W high pullu z kettlebellem wyprost kończy się na całych stopach albo krótkim wspięciu na przodostopie. Proponuję wspięcie ok. 5–8 cm (kostka ok. −20…−30°). Nie zmienia to rozpoznania ćwiczenia.
- **S2 (NISKIE, realny):** tekst „Ruszając z podłogi, wypychaj kolana na zewnątrz…” (`sumo.kneesOut`) nie zgadza się z rysunkiem. Przez cały ruch kettlebell jest w dłoniach. W u = 0 spód dzwonu jest ok. 18 cm nad podłogą (rączka 39,4 − 11,5 − 9,5). Do wyboru:
  - start z kettlebellem na podłodze między stopami (rączka ok. 30 cm, głębszy przysiad), albo
  - zestaw bez „z podłogi”.
- **S3 (NISKIE, stan jak w rundzie 1):** `oly.close` („blisko ciała”) nie ma tekstu, więc karta go nie pokazuje. Rysunek spełnia tę wskazówkę.
- **S4 (NISKIE):** w u = 0 rząd błędu jest identyczny z poprawnym (zaokrąglenie zaczyna się od u 0,06). Zaokrąglenie przy odrywaniu z najniższej pozycji to typowy moment tego błędu. W runda 1 uznane za w porządku, utrzymuję.
- Wskazówki `sumo.kneesOut`, `hinge.back` i `mis.roundBack` mają źródła w `data/zrodla/cues.json` (wyjątek dla wskazówek techniki). W `rejestr-twierdzen.json` brak wpisu, ale to nie tekst liczbowy ani zdrowotny. Bez znaleziska.
- Mięśnie: górna część pleców 1, boczny akton naramiennego 0,5, pośladkowe, kulszowo-goleniowe i czworogłowe 0,5, biceps i przywodziciele 0,25. Zgodne z rysunkiem: łokcie na boki i przysiad sumo.

## Znalezisko procesowe

**P1. Podgląd PNG pokazuje 3 klatki, a manifest twierdzi, że 12 (ŚREDNIE, systemowe; dotyczy bramki 4, nie aplikacji).**
- `scripts/figures/agent-pozy/run.mjs` → `podgladPartia` rysuje PNG tylko dla `us = [0, 0.5, 1]`.
- `manifest.json` → `klatki_na_obrazie` wylicza się z `htmlPodgladu(...)` (12 klatek), a nie z tego, co trafia do PNG. Kontrola `zgodnosc_manifestu` (`manifest_klatki`) jest więc tautologiczna i przechodzi, a `PODGLAD-WAZNY.txt` potwierdza ważność obrazu, którego nie sprawdzono.
- Skutek: opublikowane PNG obu ćwiczeń nie pokazują klatek przejściowych. Bottoms-Up: brak u 0,13–0,47 i 0,61–0,86. Sumo: brak wszystkich klatek z łokciami nad dłońmi. Właśnie tu były błędy rundy 1, a recenzent oglądający tylko PNG ich nie zobaczy. Tę recenzję oparłem na własnym renderze `htmlPodgladu`.
- Akcja (mechanizm): `podgladPartia` powinien używać `htmlPodgladu`, a `klatki_na_obrazie` powinno się czytać z wyrenderowanego HTML (atrybuty `data-u` komórek). Możliwy też test: liczba komórek `.k` w HTML zrzutu = `klatki_u.length`.
- Dotyczy wszystkich podglądów z `run.mjs` (np. `olympic/` w tym samym katalogu: PNG też 1400×700).

## Szczelność reguł

W tej rundzie nie ma BŁĘDÓW. Nowe reguły działają:
- `high_pull_lokcie` na starej pozie Sumo zgłasza błąd (test w `figury-jakosc.test.ts`), a na nowej przechodzi.
- `dzwon_gora_tylko_przy_pionowym_przedramieniu` analogicznie.

Luka w regułach: progi `high_pull_lokcie` (łokieć ≥ dłoń − 5 cm, odwiedzenie ≥ 35°) sprawdzają tylko klatkę końcową. Faza „łokcie nad dłońmi” w u 0,6–0,9 nie jest chroniona. Regresja do „łokcie z przodu przez większość ruchu, tylko koniec poprawny” by przeszła. Stąd uwaga NISKIE: rozważyć warunek „łokieć nad dłonią w ≥ 1 klatce pośredniej”.

## Gotowość

Kettlebell Sumo High Pull i Bottoms-Up Clean From The Hang Position: **gotowe do statusu „zatwierdzona”** pod względem ruchu. Uwagi B1, B2 i S1–S4 idą do backlogu 1.1.

Rodzina kb_ballistic jako całość zależy od uwag z rundy 1 dla pozostałych 4 ćwiczeń. Tam były tylko „OK z uwagą”, bez BŁĘDÓW, więc rodzina jest bez blokerów.
