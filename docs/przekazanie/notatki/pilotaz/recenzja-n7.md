# Recenzja kontrolna ruchu nr 7: pilotaż agent-pozy, przebieg n7 (bramka 4), 27.10.2026

Recenzent niezależny. Uzasadnień generatora nie czytałem: komentarzy w `scripts/figures/agent-pozy/*.mjs` ani opisów commitów rundy n7 na `jakosc-r2`.
Przeczytałem materiał wejściowy (`podglady-n7/README.md`, oba `manifest.json` z polem `zmiany_sprzetu`, `katy-stawow.md`) i diff walidatora `scripts/figures/v2-jakosc.mjs` (f1e9e314 → e1b31d68), żeby sprawdzić, czy żaden próg nie został poluzowany.
PNG oglądałem w pełnej rozdzielczości: kadry podzielone na trzy części i miejsca wątpliwe powiększone 3× (`scratchpad/rec7/crop/`, `scratchpad/rec7/zoom/`).
Każde podejrzenie z obrazu sprawdziłem liczbami silnika v2 we własnym, czystym worktree na `origin/jakosc-r2` @ e1b31d68. Pozy n6 do porównania wziąłem z f1e9e314. Skrypty są w `scratchpad/rec7/`:

- `miary`, `por`, `coc2` — stawy, położenia i nachylenia;
- `wisi` — najniższy punkt ciała dwiema miarami;
- `ksztalty`, `zapas` — dolne krawędzie kształtów i zapasy od progów;
- `skan5` — każdy próg zaostrzony o 5%;
- `szczel` — czy obecny walidator łapie pozy błędne.

Wynik walidatora (`v2-validate.mjs`, pliki obu rodzin): **pushup_plank 17/17 OK, core_floor 21/21 OK, kod wyjścia 0**.

Między f1e9e314 a e1b31d68 zmieniły się tylko dwie pozy: Cocoons i Decline Push Up. Silnik (`lib/figures/v2/*.ts`) się nie zmienił. W walidatorze doszła wyłącznie reguła R17 `styk_z_podlozem`, a żaden próg w `PROGI` nie został zmieniony.

## Krok 6: ważność podglądu

Podgląd jest **ważny**:

- oba katalogi mają `PODGLAD-WAZNY.txt`, a `PODGLAD-NIEWAZNY.txt` nie ma;
- `zgodnosc_manifestu` = `[]`, a `klatki_na_obrazie` = `klatki_u` (Cocoons 9, Decline 5 klatek);
- obraz ma po jednej komórce na klatkę w każdym rzucie i rzędzie;
- tabela kątów zgadza się z moim przeliczeniem (np. Cocoons biodro 11,3…125,5°, Decline łokieć 11,6…146,0°);
- zmiana sprzętu Decline jest opisana w `zmiany_sprzetu` (krok P3).

## Wynik

| Werdykt | Ćwiczenie | Błąd z n6 |
|---|---|---|
| **OK z uwagą** | Cocoons | lewitacja **naprawiona** |
| **OK z uwagą** | Decline Push Up | klocek 10 cm **naprawiony**, cecha „feet on a bench or box” przywrócona |

**BŁĘDÓW: 0.** Żadna poprawka nie wprowadziła widocznego błędu innej klasy.

Zostają dwa sygnały wzorca z n5/n6:

- w Cocoons jest mały i niewidoczny na obrazie (uwaga 1);
- w walidatorze to luka w ochronie przed regresją (uwaga 3).

**Szczelność reguł automatycznych wobec błędów z n6: 1 z 2 (50%; w n4–n6 było 0%).**

- Pozę Cocoons z n6 obecny walidator odrzuca: R17, 1,3 cm nad podłogą w u = 0,375.
- Pozę Decline z n6 (skrzynia 10 cm) walidator **nadal przepuszcza**.

## Cocoons — OK z uwagą

**Co naprawiono (liczby):** n7 to poza z n6 przesunięta w pionie. Wszystkie kąty i położenia w poziomie są identyczne (biodro 11,3 → 125,5°, kolano 9,4 → 99,7°, kręgosłup 0 → 40°, tułów 0 → 28° nad poziomem). Zmieniła się tylko wysokość:

| | n6 | n7 |
|---|---|---|
| środek miednicy u = 0 → 1 | 9,5 → 17,5 cm (uniesienie 8,0) | 8,2 → 11,6 cm (uniesienie 3,4) |
| najniższy punkt narysowanego ciała (rzut z boku), u = 1 | +6,7 cm | **+0,76 cm** |
| ten punkt leży przy | — | x = 1…3 cm, tył kształtu tułowia przy miednicy (kość krzyżowa / pośladki) |

Najniższy punkt rośnie płynnie od −3,30 cm w u = 0 do +0,76 cm w u = 1. Na powiększeniu klatek u = 0,5–1 (`rec7/zoom/coc-b.png`) pośladki stykają się z linią podłogi, bez przerwy.

Ciało balansuje na kości krzyżowej, a górna część pleców i nogi się unoszą. Taki obraz wymagała recenzja n6. Cecha z katalogu („arms and knees meet over the torso”) jest bez zmian względem n6: w u = 1 kolana stoją nad miednicą (x = −7,3), dłonie 24 cm dalej, nad goleniami.

**Uwagi (backlog, nie blokują):**

1. **Start zanurzony 1,3 cm w podłodze (mały wzorzec „przesuń bazę, żeby liczba się zmieściła”).**
   - W u = 0 środek miednicy leży na 8,2 cm przy promieniu kolizji tułowia 9,5 cm. Pozostałe 10 póz leżących z zestawu pilotażu (core_floor n6) ma miednicę na 9,5 cm, np. Reverse Crunch i Leg Pull-In.
   - Uwaga porównawcza: 7 starszych póz spoza pilotażu w `core_floor.json` leży na 8,0 cm (Crunch, Sit Up, Frog Sit-Ups, Janda, Oblique Crunches, Toe Touchers, Scissor Kick). Wysokość 8,2 cm nie jest więc w repo wyjątkowa, ale w pilotażu odstaje i wynika z poprawki, a nie z układu wyjściowego.
   - Kształt tułowia schodzi do **−3,30 cm** przy progu R15 −3,5 cm. Zapas wynosi 0,20 cm (5,7%, czyli tuż poza pasmem 5%). Inne pozy leżące mają −2,0 cm, a Superman −2,9 cm.
   - Budżet wygląda tak: R14b wymaga uniesienia ≥ 3 cm, a R17 dopuszcza ≤ 1 cm nad podłogą. Obniżenie startu o 1,3 cm pozwoliło zmieścić uniesienie 3,4 cm. Na podglądzie to ok. 1 px, więc niewidoczne.
   - Pewność, że to wymuszenie liczbowe, a nie zamiar: 80%. Realność: teoretyczna dla obrazu (bez widocznego skutku).
2. **Dwie miary „styku” w silniku się nie zgadzają.**
   - R17 mierzy narysowany kształt: +0,76 cm (zapas 24%).
   - Starsza reguła `nic_nie_wisi` mierzy oś tułowia/miednicy minus promień kolizji: **+2,1 cm w u = 1** i 1,1 cm już w u = 0,65 (próg 1 cm). Gdyby była włączona dla Cocoons, poza by nie przeszła.
   - Obraz rozstrzyga na korzyść R17, bo widać kształt, a nie oś. Rozbieżność pokazuje jednak, że model miednicy nie umie się „przetoczyć” (tyłopochylenie). Uniesienie ≥ 3 cm z R14b da się więc spełnić tylko na granicy styku.
   - Propozycja dla badacza i koordynatora: albo próg R14b dla zwijania obniżyć do mierzalnego zgięcia kręgosłupa, albo w silniku dodać przetaczanie miednicy. Do decyzji, nie do tej pozy.

## Decline Push Up — OK z uwagą

**Co naprawiono (liczby):**

| | n6 | n7 | Push Up |
|---|---|---|---|
| wierzch skrzyni pod stopami | 10 cm | **43 cm** | — |
| kostka y | 30,3 | 63,5 | 20,3 |
| nachylenie linii kostka–bark, u = 0 (góra) | +15,5° (ku głowie w górę) | **+0,3° (poziomo)** | +20,1° |
| nachylenie, u = 1 (dół) | −4,5° | **−19,4° (głowa niżej)** | −0,1° |
| barki w dole względem kostek | 10,3 cm niżej | **43,8 cm niżej** | na równi |
| przedramię od pionu, u = 1 (R6 ≤ 55°) | 50,5° | 46,9° | 40,8° |

Ćwiczenie jest **rozpoznawalne i zgodne ze wskazówką „feet on a bench or box”**. Stopy stoją na wyraźnym podwyższeniu: palce na wierzchu skrzyni (+0,26 cm w każdej klatce, także w rzędzie `push.mis.partial`), 13 cm od jej przedniej krawędzi. W górze ciało jest poziome, a w dole opada ku głowie.

Na powiększeniu (`rec7/zoom/dec-u1.png`) skrzynia ma ok. 1/3 wysokości postaci w podporze, więc nie da się jej pomylić z klockiem. Wysokość 43 cm oceniam tylko jako konwencję rysunku: manifest oznacza ją jako uproszczenie do potwierdzenia przez badacza, bez źródła.

**Ruch jest spójny geometrycznie:**

- Ciało obraca się wokół nieruchomej kostki: odległość kostka–bark wynosi 132,0 cm w u = 0 i 132,1 cm w u = 1. Bark w dole cofa się przez to o 7,4 cm ku stopom.
- Miednica leży na linii kostka–bark (u = 1: 36,3 wobec 36,3 z linii). Kolana 17,3–18,9° jak w Push Up (ten sam rig).
- Głębokość jest taka sama jak w Push Up: bark w dole 19,7 cm nad podłogą (Push Up 20,1).
- Łokieć w dole leży 4,4 cm nad barkiem i 29 cm za nim (Push Up 5,1 i 28).
- Skrzynia nie koliduje z goleniami: nad krawędzią skrzyni goleń jest ok. 12 cm nad wierzchem.
- W rzucie z przodu skrzynia jest poprawnie za ciałem, a w dole nogi widać nad tułowiem.

Kąt przedramienia ustawiono położeniem dłoni (chwyt x = 119, w Push Up 124), nie wysokością podparcia. Krok P2 z n6 jest więc spełniony we właściwy sposób.

**Uwagi (backlog, nie blokują):**

1. **Ręka w górze odchylona o 11,8° od pionu.** Dłoń stoi 13 cm za barkiem (ku stopom). W Push Up ręka w górze jest pionowa (0°).
   - Wynika to z poprawnej geometrii obrotu: dzięki temu w dole bark jest 5,6 cm przed dłonią, czyli prawie jak w Push Up (8,0).
   - Na obrazie góra czyta się jednak jak lekkie „przeniesienie barków przed dłonie”. Typowa wskazówka „dłonie pod barkami” dotyczy pozycji wyjściowej, ale dane aplikacji nie określają położenia dłoni w osi przód–tył.
   - Pewność, że to odstępstwo od typowej techniki: 50%. Realność: realna (każde wyświetlenie), skala mała.
2. **Opis w manifeście jest nieścisły.** `przyblizenie` mówi „przedramię w dole blisko pionu”, a jest 46,9° od pionu, bliżej połowy drogi do poziomu niż pionu. W normie R6 (zapas 15%) i bliżej Push Up (40,8°). Do poprawy w opisie, nie w pozie.
3. **Luka w regule: R17 sprawdza tylko jeden, najniższy punkt ciała.** W Decline najniższe są dłonie na podłodze, więc stopy nie są sprawdzane wcale. Test: poza n7 z wierzchem skrzyni zmienionym na 10 cm albo na 0 przechodzi walidator, choć stopy wiszą wtedy 33–43 cm w powietrzu. Poza Decline z n6 też przechodzi.
   - Wysokość podparcia chroni dziś tylko krok procesu P3 (`zmiany_sprzetu`), a nie reguła.
   - To ten sam typ luki co w n6: niezmiennik z warunkiem, który go wyłącza; tu warunkiem jest „tylko najniższy punkt”.
   - Pewność: 100% (sprawdzone liczbami). Realność: brzegowa, bo dotyczy przyszłych poprawek, a nie obecnej pozy.

## Wartości tuż przy progach (≤ 5% od progu)

Skan `skan5` (każdy próg walidatora i parametry reguł sensu osobno zaostrzone o 5%): **ani Cocoons, ani Decline nie przestaje przechodzić.** Lista `na_krawedzi` w obu manifestach jest pusta, co zgadza się z moim skanem.

Pozostałe 7 trafień skanu dotyczy póz niezmienionych od n6 i powtarza tabelę z recenzji n6 (Bench 14,9°/15°, rollouty 4,1/4 cm, Mountain Climbers 11,5/11 cm i 4,8/5 cm, Standing 21,1°/22°).

Zapasy obu póz n7:

| Ćwiczenie | Reguła | Wartość / próg | Zapas |
|---|---|---|---|
| Cocoons | R15 `ksztalty_nad_podloga` (≥ −3,5 cm) | −3,30 cm | **5,7%** (tuż poza pasmem; uwaga 1) |
| Cocoons | R14b uniesienie miednicy (≥ 3 cm) | 3,4 cm | 13% |
| Cocoons | R17 `styk_z_podlozem` (≤ 1 cm) | 0,76 cm | 24% |
| Cocoons | `nic_nie_wisi` (≤ 1 cm; nie dotyczy Cocoons) | 2,1 cm | **przekroczony** (uwaga 2) |
| Decline | R6 przedramię (≤ 55°) | 46,9° | 15% |
| Decline | `lokiec_nad_nadgarstkiem` (≤ 8 cm) | 5,1 cm | 36% |
| Decline | `kolana_proste_podpor` (≤ 22°) | 18,9° | 14% |

## Proponowane reguły (z geometrii; progi = konwencja rysunku, do potwierdzenia przez badacza)

| # | Reguła | Warunek | Błąd, który łapie | Pozostałe pozy |
|---|---|---|---|---|
| R17b | `styk_kazdego_podparcia` | każda część ciała przypisana do podparcia (dłonie, stopy, kolana; z kontaktów ćwiczenia albo z zadeklarowanego sprzętu: stopy na skrzyni/ławce) leży ≤ 1 cm nad swoją powierzchnią w każdej klatce, nie tylko najniższy punkt | n7 ze skrzynią 10 / 0 cm: stopy 33 / 43 cm nad wierzchem | Decline n7 +0,26 cm; do sprawdzenia na 49 pozach przed włączeniem |
| R19 | `podparcie_wyzej_niz_dlonie` (z n6, wersja z nachyleniem) | ćwiczenia „Decline …”: w u = 0 linia kostka–bark nachylona ≤ 5° nad poziom | Decline n6 +15,5° | Decline n7 +0,3°; Push Up nie dotyczy |
| R21 | `baza_lezenia` | pozy leżące: w u = 0 środek miednicy na wysokości promienia kolizji ± 0,5 cm (ciało leży, nie jest wciśnięte w podłogę ani uniesione) | Cocoons n7 −1,3 cm | 10 póz leżących pilotażu: 9,5 cm; **7 starszych póz spoza pilotażu (8,0 cm) też by nie przeszło**, więc przed włączeniem trzeba ustalić jedną bazę leżenia (decyzja koordynatora; próg = konwencja) |

R17b i R19 razem zamknęłyby obie klasy błędów Decline z n6 (wysokość i styk). R21 nie łapie błędu widocznego, ale zamyka „pokrętło” obniżania bazy (uwaga 1). Progi dobrałem na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.

## Wniosek

- **Oba błędy z n6 są naprawione w swojej klasie.** Cocoons dotyka podłogi w każdej klatce. Decline ma stopy na wyraźnym podwyższeniu, ciało poziome w górze i opadające ku głowie w dole.
- **Wzorzec z n5/n6 osłabł.** Poprawki nie wprowadziły widocznego błędu innej klasy. W Decline kąt przedramienia ustawiono właściwym środkiem (położenie dłoni), a P3 zadziałał: zmiana sprzętu ma opis i porównanie cechy przed i po.
- W Cocoons wzorzec wrócił w skali niewidocznej: start obniżony o 1,3 cm, żeby uniesienie z R14b zmieściło się pod limitem R17. R15 ma przez to zapas tylko 0,2 cm.
- **Szczelność wzrosła z 0% do 50%.** R17 łapie lewitację Cocoons. Wysokości podparcia Decline nie chroni żadna reguła, a R17 nie sprawdza stóp na skrzyni.
- Propozycja dla modelu pracy:
  - (a) niezmienniki styku liczone dla każdego podparcia, nie dla najniższego punktu (R17b);
  - (b) regułę-parę R19 dla Decline zapisać w walidatorze, a nie tylko w kroku P3;
  - (c) rozbieżność dwóch miar styku (uwaga 2) przekazać badaczowi razem z pytaniem o próg R14b.
