# Recenzja kontrolna ruchu nr 5: pilotaż agent-pozy, przebieg n5 (bramka 4), 26.10.2026

Recenzent niezależny. Uzasadnień generatora nie czytałem. Oglądałem PNG w pełnej rozdzielczości, a wątpliwe kadry powiększałem (`scratchpad/rev5crop/`).
Każde podejrzenie z obrazu sprawdziłem liczbami: tabelą kątów (`katy-stawow.md`) i przeliczeniem `poze.json` silnikiem v2 z `origin/jakosc-r2` @ 6079d6e (skrypty `scratchpad/rev4/*.mjs`: `miary`, `przedramie`, `reguly`, `mc5`, `kn5`, `shp5`, `cross5`).
Uwaga do procesu: worktree `scratchpad/wt-jakosc-r2` miał w trakcie recenzji niezatwierdzone zmiany innego agenta (`v2-jakosc.mjs`, `v2-validate.mjs`, nowy `figury-cechy.json`). Walidator uruchomiłem więc w osobnym, czystym worktree na `origin/jakosc-r2` (`scratchpad/wt-rec5`).
Wynik walidatora (`v2-validate.mjs --rodzina …`) na obu plikach n5: **wszystkie 29 póz = OK, kod wyjścia 0**.

## Krok 6: ważność podglądu

Podgląd jest **ważny**. Oba katalogi mają `PODGLAD-WAZNY.txt`, a pliku `PODGLAD-NIEWAZNY.txt` nie ma. `zgodnosc_manifestu` = `[]`. Każde z 17 + 12 ćwiczeń ma obraz i `katy_stawow`.
Ponowne `podgladWazny(manifest)` i `zgodnoscManifestu(...)` z `origin/jakosc-r2` zwracają puste listy. Luka P1 z n4 jest zamknięta: `cobra.mis` i `ro.back` mają teraz jawne `wyjatki_opisu` z powodem.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 16 | Push Up, Push-Up Wide, Close-Grip, Diamond, Plank, Plank Shoulder Taps, Suspended Push-Up, Rollout (sztanga), Standing Rollout, Crunch HO, Dead Bug, Hollow Hold, Lying Leg Raise, Reverse Crunch, Superman, V-Up |
| OK z uwagą | 8 | Decline Push Up, Single-Arm Push-Up, Incline Push Up, Incline CG, Plyo Push-Up, Bird Dog, Cocoons, Leg Pull-In |
| **BŁĄD** | **5** | **Suspended Fallout, Mountain Climbers, Barbell Rollout from Bench, Tuck Crunch, Alternate Heel Touchers** |

**Szczelność reguł automatycznych: 0 z 5 błędów, czyli 0%** (cel ≥ 90%; w n4 też 0 z 5). Wszystkie 5 póz z błędem przechodzi walidator `origin/jakosc-r2`.

Pięć błędów z n4 jest naprawionych w swojej klasie: kolana i biodro w Fallout, kolana w bok w MC, przedramię w Decline, kolana w Tuck i łokcie w Heel Touchers.
Trzy z tych pięciu ćwiczeń (Fallout, MC, Tuck) mają jednak teraz **nowy błąd innej klasy**, a Heel Touchers ma nowy błąd geometrii. Kilka wartości stoi tuż pod progiem nowej reguły: Decline 54,5° przy progu 55°, kolano w MC 11,9 cm przy 11 cm, łokieć w Heel Touchers 29,9° przy 30°.
Wniosek: poprawki dopasowują pozę do liczby z reguły, a nie do ruchu. Reguły „na wartość” przesuwają błąd w miejsce, którego nikt nie mierzy (sekcja „Wniosek”).
Barbell Rollout from Bench miał w n4 ocenę „OK z uwagą”. Jego błąd to przeoczenie recenzji n4 (krok 4 listy).

## Znaleziska — BŁĄD (od najpoważniejszego)

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Mountain Climbers** | u = 0,125–0,875, kolano (biodro, płaszczyzna czołowa) | **Kolana zamieniają się stronami.** Prawe biodro z = +8,5, prawa kostka z = +10, a prawe kolano z = −17,5 (u = 0,5), czyli najdalej 18,6 cm za osią ciała po stronie lewej nogi (u = 0,4). Lewe symetrycznie. Uda krzyżują się w „X”: z przodu w klatkach 1–3 i 7–9 widać udo przechodzące ukośnie przez drugie. Do tego w 7 z 9 klatek obie stopy są w powietrzu (palce 2,6–6,3 cm nad podłogą), a w u = 0,5 oba kolana są zgięte 113° i ciało wygląda jak w przysiadzie podpartym. | Kolano idzie prosto pod klatkę po swojej stronie (z kolana tego samego znaku co z biodra, \|z\| ≈ biodro ± kilka cm). Noga z tyłu jest prosta i stoi na palcach, a zmiana nóg jest szybka. | 90% | realny (każde wyświetlenie) | nie: `kolano_pod_tulowiem` (R4) porównuje \|z\| (wartości bezwzględne), więc kolano po przeciwnej stronie przechodzi (\|−17,5\| − 8,5 = 9 ≤ 13). `podpor_bez_kleku` 11,9 ≥ 11 |
| 2 | **Suspended Fallout** | u = 0 → 1, taśmy; u = 1 całe ciało | **Taśmy wydłużają się o 57%:** odległość zaczep–uchwyt rośnie z 131,7 cm (u = 0) do 207,2 cm (u = 1). Zaczep (125,2; 220; 0) jest stały, a uchwyt jedzie z (125,2; 89,8) do (193,5; 25,4). Przy stałej taśmie dłonie musiałyby się poruszać po łuku wokół zaczepu. Pozycja końcowa wynika z tego wydłużenia: tułów ok. 6° od poziomu, barki 34 cm i uchwyty 25 cm nad podłogą, czyli pełne wyłożenie jak w rolloucie ze stóp, a nie fallout w taśmach. Kolana i biodra są już naprawione (kolano 17–19°, biodro 2–10°). | Długość taśmy stała w całym ruchu (± ok. 2 cm). Dłonie przesuwają się nad głowę po łuku wokół zaczepu, a ciało opada tylko tyle, ile pozwala taśma. Zaczep ustawić tak, żeby koniec ruchu był osiągalny przy stałej długości. | 90% | realny | nie: walidator rysuje taśmę jako odcinek zaczep–dłoń w każdej klatce i nie sprawdza jej długości. `fallout_start_rece_przod` sprawdza tylko u = 0 |
| 3 | **Barbell Rollout from Bench** | wszystkie klatki, kolana i golenie | **Kolana i golenie nie leżą na ławce.** Ławka: blat y = 42, x od −75 do +5. Kolano (oś) y = 55 przez cały ruch, czyli 13 cm nad blatem, ok. 7 cm luzu. Kostka y = 61, czyli 19 cm nad blatem. Ławki dotykają tylko palce (y = 42,3, stopa prawie pionowo, pięta 25 cm wyżej). Na kadrze końcowym (`rev5crop/bro-end.png`) golenie wyraźnie wiszą nad blatem. Opis źródłowy ćwiczenia mówi „klęknij obiema nogami na ławce”, a obraz pokazuje podpór na palcach z nogami w powietrzu. Ruch kończy się w u ≈ 0,4: w 5 z 9 klatek chwyt przesuwa się łącznie tylko o 10 cm. | Klęk na ławce: kolana i golenie leżą na blacie (oś kolana ok. promień nad blatem), a kolano jest osią obrotu. Rozwinięcie ruchu rozłożone na całą animację. | 85% | realny | nie: brak reguły styku podparcia zadeklarowanego w opisie (klęk na ławce). `proste_rece_rollout` i widoczność błędu przechodzą |
| 4 | **Tuck Crunch** | u = 0,5–1, tułów i lędźwie | **Tułów unosi się sztywno jak deska**, a lędźwie odrywają się od podłogi. `zgiecieKregoslupa` = 0 w każdej klatce, tułów pochylony do −62° (28° nad podłogą). Dolna krawędź odcinka lędźwiowego jest 5,9 cm nad podłogą (próg reguły 3 cm). Miednica stoi (y = 9,5, bez zwijania). Kadr u = 1 (`rev5crop/tuck3.png`) pokazuje prosty tułów opierający się tylko na pośladkach, czyli półsiad. Aplikacja wyświetla przy tym ćwiczeniu wskazówkę `crunch.lowBack` „Dolna część pleców zostaje na podłodze” (cue-sets: ok = crunch.neck, crunch.lowBack), a opis źródłowy mówi „lower back pressed against the floor”. Kolana (95–114°) są już naprawione. | Spięcie: zwija się odcinek piersiowy (zgięcie kręgosłupa ok. 30–40° jak w Crunch HO, gdzie lędźwie są 2 cm nad podłogą), a lędźwie leżą na podłodze. | 90% | realny | nie: `ledzwie_przy_podlodze` złapałaby błąd (5,9 > 3 cm), ale Tuck Crunch jest w `LEDZWIE_WYJATKI` z powodem „zwijanie obu końców, styk na kości krzyżowej”. Ten mechanizm nie występuje w pozie (miednica nieruchoma) i przeczy wskazówce wyświetlanej przy ćwiczeniu |
| 5 | **Alternate Heel Touchers** | u = 0,5 i 1, rzut z przodu, tułów | **Tułów wchodzi 6,4 cm pod podłogę** w rzucie z przodu. Sztywny skłon boczny obraca prostokąt tułowia wokół środka miednicy, a jego dolny róg schodzi pod linię podłogi (`rev5crop/aht-front.png`: ciemny klin pod podłogą w 2 z 3 klatek z przodu). Pozostałe pozy leżące mają w kształtach najwyżej −2,0 cm (konwencja), Superman −2,9 cm. Łokcie są już proste (19–30°). | Tułów nad podłogą w obu rzutach. Skłon boczny z biodrem przy podłodze (obrót wokół punktu styku, nie wokół środka miednicy) albo mniejszy przechył. | 85% | realny | nie: `pod_podloga` sprawdza tylko punkty osi (miednica, środek barków) minus promień, a nie obrócony kształt tułowia (`dataShapes`) |

## OK z uwagą (backlog, nie blokuje)

- **Decline Push Up:** w dole przedramię 54,5° od pionu (R6: ≤ 55°), łokieć 0,6 cm poniżej barku (R6: ≥ −2). Obraz czyta się jako dół pompki, ale wartość leży na krawędzi progu, więc to raczej dopasowanie do reguły niż poprawa ruchu (pompka standardowa: 45°).
- **Single-Arm Push-Up:** ręka pracująca w u = 0 ma łokieć zgięty 27,4° (w tym rigu ręka prosta to ok. 11°, jak w Push Up), a opis mówi „fully extended”. Reszta poprawna: dłoń pod barkiem, wolna ręka na lędźwiach, stopy rozstawione na 28,6 cm.
- **Bird Dog:** łokcie zgięte 32–39° w każdej klatce, w ręce podporowej i w uniesionej. W u = 1 łokieć uniesionej ręki jest 8,5 cm poniżej linii bark–dłoń, więc ręka „opada” w łokciu. Kierunek ruchu i strony są poprawne (prawa ręka + lewa noga), tułów pochylony 15° (realne przy prostych rękach).
- **Cocoons:** tułów sztywny (zgięcie kręgosłupa 0), a miednica się nie zwija (y = 9,5 stałe). Opis źródłowy mówi o zgięciu kręgosłupa i uniesieniu pośladków. Cecha rozpoznawcza (kolana do klatki, ręce znad głowy) jest zachowana.
- **Leg Pull-In:** koniec ruchu to nadal „stolik” (biodro 90°, kolana nad biodrami, nie na wysokości klatki), bez zmian od n4.
- **Plyo Push-Up:** z przodu lot nadal wygląda jak stanie (bez zmian).
- **Incline Push Up / Incline CG:** z przodu w dole łokcie są nad barkami (spójne z bokiem, bez zmian).

## Szczegóły dla wybranych OK

- **Push Up i warianty:** kolana 17–20° (w n4 było 25°). Uwaga systemowa z n4 jest zamknięta. Kolano leży ≤ 5,6 cm od linii kostka–bark.
- **Plank Shoulder Taps:** dłoń dotyka przeciwnego barku (łokieć 108–113°), druga ręka podpiera, tułów stabilny.
- **Dead Bug:** ręka i noga są przeciwne (prawa ręka + lewa noga), co sprawdziłem w liczbach i w cieniowaniu głębi (`rev5crop/db5.png`).
- **Suspended Push-Up:** długość taśmy jest stała (257,1 cm w całym ruchu), co stanowi kontrast z błędem nr 2.
- **Przybliżenia z manifestu (krok 1):** Superman (stopy), Tuck (kostki), Cocoons (ramiona), Heel Touchers (sztywny skłon) i Suspended Push-Up zachowują cechę rozpoznawczą.
Przybliżenie w Fallout („taśmy ustawiają się ukośnie”) nie wspomina o zmianie długości taśmy, a to ona zmienia ruch (błąd nr 2).

## Proponowane reguły (z geometrii; progi = konwencja rysunku, do potwierdzenia przez badacza)

Wartości podaję jako rozdzielenie: błąd n5 / najgorsza z pozostałych 24 póz.

| # | Reguła | Warunek | Zakres | Błąd n5 | Pozostałe |
|---|---|---|---|---|---|
| R11 | `kolano_po_swojej_stronie` | w każdej klatce z kolana · znak(z biodra) ≥ −2 cm (kolano nie przechodzi za oś ciała). Poprawka R4: porównanie ze znakiem, nie \|z\| | wszystkie rodziny; wyjątki jawne (warianty „cross-body”) | MC +18,6 cm za osią | ≤ −8,8 cm (zawsze po swojej stronie) |
| R12 | `tasma_stala_dlugosc` | dla `zawieszenie`: \|uchwyt − zaczep\| stała w całym ruchu ± 2 cm (taśma nierozciągliwa) | wszystkie pozy z zawieszeniem (dłonie i kostki) | Fallout 131,7…207,2 cm | Suspended Push-Up 257,1…257,1 |
| R13 | `styk_podparcia_z_opisu` | podparcie zadeklarowane per ćwiczenie (`klęk_na_lawce`, `klęk_na_podlodze`): oś kolana ≤ 11 cm nad powierzchnią i x kolana w obrębie powierzchni w każdej klatce | ćwiczenia z klękiem (rollouty z kolan, bird dog) | Bench 13,1 cm nad blatem (kostka 19,3) | Rollout z kolan 9,8; Bird Dog 9,0. **Słaba separacja** (13,1 / 9,8): lepszy byłby jawny styk w kontrakcie (punkt podparcia „kolano” jak „dlonie”) |
| R14 | `wyjatek_nie_przeczy_wskazowce` | ćwiczenie z `LEDZWIE_WYJATKI` (i każdej listy wyjątków od reguły ze wskazówki) nie może mieć tej wskazówki w swoim zestawie (`maWskazowkeLedzwie` = true → błąd „wyjątek sprzeczny ze wskazówką wyświetlaną użytkownikowi”) | wszystkie listy wyjątków | Tuck Crunch: wyjątek + `crunch.lowBack` | V-Up, Cocoons: wskazówki nie mają, więc reguła ich nie flaguje |
| R14b | `wyjatek_wymaga_mechanizmu` | wyjątek „zwijanie obu końców / styk na kości krzyżowej” ważny tylko, gdy w pozie miednica się zwija (uniesienie miednicy ≥ 3 cm albo zmiana jej pochylenia ≥ 10°) | LEDZWIE_WYJATKI | Tuck: miednica 0 cm | Cocoons też 0 cm (flaga zgodna z uwagą o Cocoons); V-Up 0 cm, więc V-Up wymaga osobnego powodu („tułów sztywny, V”) |
| R15 | `ksztalty_nad_podloga` | dolna krawędź narysowanych kształtów (`dataShapes`, rzut z boku i z przodu, wszystkie rzędy) tułowia, miednicy, głowy i kończyn ≥ −3,5 cm | wszystkie rodziny | Heel Touchers −6,4 cm (przód, u = 0,5) | −2,0 (pozy leżące), Superman −2,9 |
| R16 | `kregoslup_zwija_sie` | spięcia z wskazówką `crunch.lowBack`: gdy tułów unosi się o > 15°, zgięcie kręgosłupa ≥ 20° (zwija się odcinek piersiowy, a nie sztywna deska) | rodzina core_floor, zestaw „crunch” | Tuck 0° przy 28° uniesienia | Crunch HO 40° |
| P2 | krok procesu: **margines od progu** | poza przechodząca regułę z zapasem < 5% progu (albo < 1 cm / 1°) trafia do recenzenta jako „na krawędzi” z listą reguł, a generator dostaje polecenie wartości docelowej (środek przedziału), nie progu | wszystkie reguły z progiem | Decline 54,5/55; MC kolano 11,9/11; Heel łokieć 29,9/30 | — |

R11–R16 łapią wszystkie 5 błędów n5 bez fałszywego alarmu na pozostałych 24 pozach (R11 łapie błąd nr 1, R12 nr 2, R13 nr 3, R14 i R16 nr 4, R15 nr 5). Wyjątki: R14b flaguje też Cocoons (zgodnie z uwagą), a R13 ma słabą separację.
Progi dobrałem na tych samych danych, więc jak w n4 to wynik w próbie, a nie dowód szczelności.
Krok 7 (sprawdzian na innych gałęziach) wymaga przebiegu `jakosc-raport.mjs` na pozach spoza pilotażu.

## Wniosek dla modelu pracy

1. **Szczelność 0% drugi raz z rzędu, a błędy n4 zniknęły tylko z miejsca, które mierzy reguła.** Każda reguła z n4 sprawdza jedną wielkość (\|z\| kolana, kąt łokcia, kolano pod linią) i generator spełnia ją przy minimalnej zmianie.
Wady przenoszą się na sąsiednią, niemierzoną wielkość: znak z kolana, długość taśmy, sztywny tułów zamiast zgiętych kolan, kształt pod podłogą.
Propozycja: reguły **niezmiennicze**, czyli prawdziwe dla każdego ćwiczenia, a nie dla jednego przypadku. Do tej grupy należą R11, R12 i R15: kolano po swojej stronie, nierozciągliwy sprzęt, nic pod podłogą w narysowanych kształtach. Do tego krok P2, czyli celowanie w środek przedziału, nie w próg.
2. **Wyjątek od reguły to dziura bez kontroli** (Tuck Crunch). Każdy wpis wyjątku powinien mieć sprawdzenie, że (a) nie przeczy wskazówce wyświetlanej przy ćwiczeniu i (b) mechanizm z powodu wyjątku faktycznie występuje w pozie (R14, R14b).
3. **Styk z opisu źródłowego** („klęknij na ławce”) nie ma dziś odpowiednika w kontrakcie. Walidator sprawdza tylko, czy coś nie przenika i czy coś dotyka, a nie czy dotyka to, co mówi opis. Kontrakt potrzebuje deklaracji punktów podparcia per ćwiczenie (R13).
