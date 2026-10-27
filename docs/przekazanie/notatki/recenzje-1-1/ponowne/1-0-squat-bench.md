# Ponowna recenzja 1.0: squat (25) i bench_press (30), 27.10.2026, recenzent 1.0 squat-bench

Oceniany stan: `origin/naprawa-figury-1-0` @ 6a9dd655 (baza main, PR #73). Podglądy pochodzą z `podglady-1-1/naprawa-1-0/` na `origin/przekazanie-konta`.
Podgląd jest ważny: ma `PODGLAD-WAZNY.txt`, tabelę kątów i manifest (87 ćwiczeń). Pola `zgodnosc_manifestu` nie ma, bo rodziny są rysowane z rigów; to akceptowalne.

Nie czytałem opisu PR #73, komunikatów commitów, lekcji w docs/40, README podglądów ani komentarzy generatorów.

Metoda:
- Arkusze PNG obejrzałem w pełnej rozdzielczości, wątpliwe kadry powiększone 2–4×.
- Liczby policzyłem silnikiem gałęzi (`frameAt`, `jointAngles`) własnymi skryptami. Mierzyłem stawy, położenie łokcia względem barku, przedramię od pionu (czołowo i strzałkowo), odwiedzenie ramienia od osi tułowia i rekwizyty.
- Wiersze błędów dorenderowałem: `podglad-v2.mjs --error` dla kneesIn, heels, roundBack i arch.
- Treść karty pochodzi z `lib/cues/data.json`, `lib/cues/text/pl.json`, `cue-sets.json`, `muscles.generated.ts` i `components/ExerciseCues.tsx`.
- Współrzędne: x w przód, y w górę, z w prawo, cm.

## Podsumowanie

| Rodzina | OK | OK z uwagą | BŁĄD | Czy można wyświetlać w 1.0 |
|---|---|---|---|---|
| squat (25) | 19 | 3 | **3** | **tak, po poprawce** Front Squat i 2 × Reverse Band, albo z tymi 3 animacjami wyłączonymi (wyjątek) |
| bench_press (30) | 18 | 11 | **1** | **tak, po poprawce** Reverse Band Bench Press, albo z tą jedną animacją wyłączoną |

Wcześniejsze BŁĘDY:

| Recenzja 1.1 | Znalezisko | Stan |
|---|---|---|
| squat nr 1 | Front Squat: łokcie nad głową | **częściowo**. Łokieć zszedł z +28,6 do +14…+17 cm nad barkiem i jest poniżej czubka głowy. Ramię nadal idzie w górę i w bok („skrzydła”). Patrz B1 |
| squat nr 2 | guma przez środek ciała (4 ćwiczenia) | **naprawione** w „with Bands”: dwie gumy przy końcach gryfu. **Nie naprawione** w obu „Reverse Band”: guma nadal idzie od gryfu do podłogi, a powinna od góry stojaka. Patrz B2 |
| squat nr 3 | Dip Belt Squat: linka do podłogi | **naprawione**: jest tylko łańcuch i zwisający odważnik, bez rekwizytu `cable` |
| bench nr 1 | 16 wariantów z rozłożonymi łokciami | **naprawione**. Na dole przedramię 4–10° od pionu czołowo (z podłogi 12°), odwiedzenie 27–42° (było 20–42° i 49–74°) |
| bench nr 2 | guma przez ciało (Band, Reverse Band) | **naprawione** w Band Bench Press. **Nie naprawione** w Reverse Band Bench Press: guma od dołu. Patrz B2 |

Regresje: nie znalazłem żadnych. Ćwiczenia, które wcześniej były OK, mają te same kąty i ten sam obraz. Wiersze błędów (kolana do środka, pięty, zaokrąglone plecy, wygięcie na ławce) różnią się od pozy poprawnej tylko błędem i są widoczne w klatce dołu.

## BŁĘDY KRYTYCZNE / WYSOKIE (blokują 1.0)

| # | Ćwiczenie | Waga | Co jest źle (liczby) | Jak powinno być | Kroki w aplikacji | Pewność / realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| B1 | **Front Squat** | WYSOKIE | **Rack przedni nadal z ramionami w górę i w bok.** Bark R (1,4; 138,8; 19), łokieć (14,9; 152,8; 43,2) w u = 0. Łokieć jest 14,0 cm nad barkiem (u = 0,5: 16,8; u = 1: 15,3), ale tylko 13,5 cm przed nim i aż 24,2 cm na zewnątrz. Ramię jest uniesione 27–33° nad poziom i odchylone w bok 61° od kierunku „w przód” (u = 0) i 39° (u = 1). Tabela kątów: bark-sag 131–144°, abd 33–51°, łokieć 165°. Na obrazie łokcie są na wysokości twarzy (głowa y 160,8). Z przodu ramiona rozchodzą się ukośnie w górę jak skrzydła. Karta mówi: „łokcie wysoko, ramiona mniej więcej poziomo” (`fsq.rack`) i „nie opuszczaj łokci”. Obraz przeczy „poziomo” i nie pokazuje łokci skierowanych w przód. | Ramię mniej więcej poziomo w przód: łokieć ±12 cm od wysokości barku, wyraźnie przed barkiem (≈ 20–28 cm, prawie cała długość ramienia), odchylenie w bok ≤ ~30°. Z przodu łokcie celują w widza, ramiona są skrócone. | Biblioteka ćwiczeń → Front Squat → „Technika” → animacja (bok i przód, każda klatka) | 75%; realny (popularne ćwiczenie, każde wyświetlenie) | **nie**. Nowy test `figury-1-0-recenzja` dopuszcza łokieć ≤ 18 cm nad barkiem i ≥ 10 cm przed nim (luźniej niż ±12 cm z recenzji 1.1) i nie sprawdza odchylenia w bok. Poza przechodzi test, choć błąd zostaje. Potrzebna reguła: wysokość ±12 cm, łokieć przed barkiem ≥ 0,6 × długość ramienia, odchylenie w bok ≤ 30° |
| B2 | **Reverse Band Box Squat, Reverse Band Power Squat, Reverse Band Bench Press** | WYSOKIE (wg bramki 4, krok 1: utracona cecha rozpoznawcza) | **Guma od gryfu w dół do podłogi, czyli identycznie jak w „Squat with Bands” i „Band Bench Press”.** Rekwizyt `band` (z flagą `bar`) biegnie od (6,5; 137,7) do (6,5; 0) w przysiadzie i od (−33; 66,7) do (−33; 0) w wyciskaniu. „Reverse Band Power Squat” ma te same stawy i rekwizyty co „Squat with Bands” (sprawdzone liczbami z `frameAt`, tabela kątów identyczna). W odmianie „reverse” guma zwisa z góry stojaka i odciąża sztangę na dole. Rysunek pokazuje odwrotny układ, który dociąża ruch w górze. | Gumy od górnej belki lub haków stojaka (słupek `post` z `hook` już jest w scenie) w dół do końców gryfu. Albo, na 1.0, wyjątek: te 3 ćwiczenia bez animacji, tylko tekst. | Biblioteka → „Reverse Band Power Squat” (albo Box Squat / Bench Press) → „Technika” → animacja, widok z boku i z przodu | 85%; realny przy każdym wyświetleniu, ćwiczenia niszowe (trójbój) | **nie**. Test sprawdza tylko flagę `bar` i dwie linie w widoku z przodu. Brakuje reguły „reverse ⇒ kotwica gumy nad gryfem”. Dla wyciskania test liczy widok `front`, którego ta rodzina nie wyświetla (bok i góra) |

Szkoda dla użytkownika: oba błędy pokazują złe ustawienie, ale nie ma przy nich ryzyka zdrowotnego ani utraty danych. Dlatego WYSOKIE, a nie KRYTYCZNE (próg „błędne twierdzenie merytoryczne / funkcja pokazuje co innego niż nazwa”).

Tania alternatywa na 1.0 to wyłączenie 4 animacji (wyjątek z powodem). Rodziny zostają wtedy wyświetlane, a poprawka idzie do 1.0.1. Decyzja należy do koordynatora lub właściciela.

## Wynik: squat (25)

| Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|
| Back Squat | OK | OK | OK | biodro 119°, kolano 118° (udo ≈ poziomo, zgodnie z `sq.depth`), gryf na górze pleców; błędy kolana/pięty widoczne |
| **Front Squat** | BŁĄD | niezgodna z obrazem (`fsq.rack`) | **BŁĄD** | B1 |
| Goblet Squat | OK | OK | OK | hantel pionowo przy klatce, łokcie między kolanami na dole (`gob.hold`) |
| Przysiad z pasem (linki) | OK | OK | OK | jedna linka od bloczka przy podłodze do pasa |
| Box Squat | OK | OK | OK | siad na skrzynię, kolano 105° |
| Wall Sit | OK | OK | OK | plecy przy ścianie, kolano 89°, statycznie; `wall.breath` bez liczb |
| Cable Squat | OK | OK | OK | linka z niskiego bloczka do dłoni |
| Bodyweight Squat | OK | OK | OK | ręce w przód |
| Smith Machine Squat | OK | OK | OK | prowadnica, gryf pionowo |
| Zercher Squat | OK | OK | OK | gryf w zgięciach łokci |
| Double Kettlebell Front Squat | OK | OK | OK | odważniki w racku, łokieć poniżej barku (bark-sag 39–61°); dla porównania z B1 |
| Landmine Squat | OK | OK | OK | gryf od osi na podłodze do klatki |
| Sumo Squat (hantel) | OK | OK | OK | szeroko, hantel zwisa |
| Box Squat with Bands | OK | OK | OK | **naprawione**: dwie gumy przy końcach gryfu do podłogi |
| Box Squat with Chains | OK | OK | OK | łańcuchy przy końcach gryfu |
| **Reverse Band Box Squat** | BŁĄD | OK | **BŁĄD** | B2 |
| **Reverse Band Power Squat** | BŁĄD | OK | **BŁĄD** | B2 |
| Squat with Bands | OK | OK | OK | **naprawione** |
| Squat with Chains | OK | OK | OK | bez zmian |
| Barbell Hack Squat | OK | OK | OK | gryf za nogami; zestaw wskazówek `hingeFloor` (plecy proste, kolana w linii palców, błąd: zaokrąglone plecy) pasuje |
| Overhead Squat | OK z uwagą | OK | OK z uwagą | uwaga A z 1.1 bez zmian: bark-sag 190–197° |
| Dumbbell Squat | OK | OK | OK | hantle po bokach |
| One-Arm Overhead Kettlebell Squat | OK z uwagą | OK | OK z uwagą | uwaga A bez zmian: bark 183–198° |
| Dip Belt Squat | OK | OK | OK | **naprawione**: pas, łańcuch, odważnik zwisa (u = 1 środek y 24) |
| Band Squat | OK z uwagą | OK | OK z uwagą | uwaga B z 1.1 bez zmian: guma do wyciągniętych rąk; z przodu linia gumy biegnie przed osią ciała |

## Wynik: bench_press (30)

Liczby w klatce dołu (u = 1) w kolejności: przedramię od pionu czołowo / strzałkowo, odwiedzenie ramienia od osi tułowia, łokieć.

| Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|
| Bench Press (sztanga) | OK | OK | OK | 6° / 6°, 42°, 135° (bez zmian) |
| Bench Press (hantle) | OK | OK | OK | 5° / 8°, 33° |
| Incline Bench Press (sztanga) | OK | OK | OK | 2° / 2°, 27° |
| Incline Bench Press (hantle) | OK | OK | OK | 0° / 0°, 23° |
| Decline Bench Press | OK z uwagą | OK | OK z uwagą | **naprawione**: 8°, 41° (było 23°, 74°); strzałkowo 12° (D) |
| Decline Bench Press (hantle) | OK z uwagą | OK | OK z uwagą | **naprawione**: 9°, 38°; strzałkowo 13° (D) |
| Floor Press (hantle) | OK | OK | OK | **naprawione**: 12° (łokieć na podłodze y 6,6), 34° |
| Floor Press (sztanga) | OK | OK | OK | **naprawione**: 12°, 36° |
| Squeeze Press (hantle) | OK | OK | OK | bez zmian |
| Smith Machine Bench Press | OK | OK | OK | **naprawione**: 6°, 36° |
| Smith Machine Incline Press | OK | OK | OK | 3°, 22° |
| JM Press | OK z uwagą | OK | OK z uwagą | uwaga C bez zmian: łokieć 152° |
| One-Arm Kettlebell Floor Press | OK | OK | OK | **naprawione**: 12°, 29°; druga ręka na brzuchu |
| One Arm Dumbbell Bench Press | OK | OK | OK | **naprawione**: 6°, 34° |
| Barbell Guillotine Bench Press | OK | OK | OK | łokcie 90° w bok (cecha ćwiczenia) |
| Wide-Grip Barbell Bench Press | OK | OK | OK | 5°, 55° |
| Smith Machine Decline Press | OK z uwagą | OK | OK z uwagą | **naprawione**: 8°, 41°; strzałkowo 12° (D) |
| Band Bench Press | OK | OK | OK | **naprawione**: gumy przy końcach gryfu, 6°, 36° |
| Chain Press | OK | OK | OK | **naprawione**: 6°, 36° |
| Bench Press with Chains | OK | OK | OK | **naprawione** |
| Floor Press with Chains | OK | OK | OK | **naprawione**: 12°, 36° |
| **Reverse Band Bench Press** | BŁĄD | OK | **BŁĄD** | kąty naprawione (6°, 36°), guma nadal od dołu: B2 |
| Board Press | OK z uwagą | OK | OK z uwagą | **naprawione**: 9°, 36°; uwaga A z 1.1 bez zmian: brak deski |
| Pin Press | OK z uwagą | OK | OK z uwagą | **naprawione**: 10°, 36°; uwaga A: brak bolców |
| Close-Grip Dumbbell Press | OK z uwagą | OK | OK z uwagą | uwaga B bez zmian: przedramię 50° czołowo |
| Close-Grip EZ-Bar Press | OK z uwagą | OK | OK z uwagą | B |
| Smith Machine Close-Grip Bench Press | OK z uwagą | OK | OK z uwagą | B |
| Close Grip Bench Press | OK z uwagą | uwaga | OK z uwagą | B: chwyt ±12 cm przy `cgbp.grip` „na szerokość barków lub trochę węziej — nie bardzo wąsko” (barki ±19) |
| Reverse Grip Bench Press | OK | OK | OK | **naprawione**: 4°, 27° |
| Decline Close-Grip Bench To Skull Crusher | OK z uwagą | OK | OK z uwagą | uwaga C bez zmian: łokieć 154° |

## Uwagi (backlog, nie blokują 1.0)

- **A (1.1, bez zmian):**
  - Overhead Squat i One-Arm OH KB: bark 183–198° względem tułowia.
  - Board Press i Pin Press bez deski i bez bolców.
- **B (1.1, bez zmian):**
  - Band Squat: guma do wyciągniętych rąk.
  - Wąski chwyt (4 ćwiczenia + Close Grip BP): przedramię 50° czołowo, chwyt węższy od barków, choć wskazówka mówi „nie bardzo wąsko”.
- **C (1.1, bez zmian):** JM Press 152°, Skull Crusher 154° przy limicie kontraktu 149°.
- **D (nowa, niska):** trzy warianty na ławce ujemnej mają przedramię 12–13° od pionu w płaszczyźnie strzałkowej (Decline sztanga i hantle, Smith Decline). Decyzja z 26.10 mówi ±10°. Obraz czyta się poprawnie.
- **Treść kart.**
  - Teksty brzmią naturalnie i nie wymieniają źródeł ani marek.
  - `bp.elbowsMid` (zestaw ogólny dla Decline, Smith, Chains, Reverse Band) nie ma polskiego tekstu. `ExerciseCues` odfiltrowuje taki wpis, więc w karcie nie pokazuje się surowe id. W tych kartach brakuje za to wskazówki o łokciach.
  - Wskazówki techniki nie podlegają `check:claims`: nie pasują do `DOMAIN_RE`, a źródła mają w `lib/cues`. Braku wpisu w rejestrze twierdzeń nie zgłaszam jako znaleziska.
  - Mięśnie zgodne z ruchem; przy analogiach jest dopisek „uproszczenie”.

## Szczelność reguł

- 0 z 2 BŁĘDÓW łapią reguły automatyczne.
- Nowy test gałęzi zatwierdza B1 przy progu luźniejszym niż opis błędu (≤ 18 cm zamiast ±12 cm) i bez warunku kierunku łokcia.
- Dla B2 test sprawdza tylko obecność i rozmieszczenie gum, a nie kierunek kotwicy w odmianach „Reverse”.

Proponowane reguły:
1. `rack_przedni`: łokieć ±12 cm od wysokości barku, przed barkiem ≥ 0,6 × ramię, odchylenie w bok ≤ 30°.
2. `reverse_band_z_gory`: klucz z „Reverse Band” ⇒ kotwica gumy powyżej gryfu w każdej klatce.
3. Test band dla wyciskania liczony w widokach, które rodzina naprawdę wyświetla (`side` i `top`).
