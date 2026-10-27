# Recenzja ruchu 1.1: rodzina bench_press (30 ćwiczeń, rig), 27.10.2026

Rodzina rysowana rigiem (`lib/figures/v2/rigs/benchPress.ts`, warianty w `variants.ts`). Oceniam `origin/integracja-1-1` @ 4e5a7f95, czyli stan po scaleniu main z kalibracją ANSUR czterech wariantów i bez linii łokci 45°. Uzasadnień generatorów ani opisów commitów nie czytałem. Przeczytałem decyzje właściciela w docs/18 (26.10.2026: „rzeczywistość nadrzędna”, przedramiona pionowo ± 10° na dole, odwiedzenie 35–65°).

Metoda:

- `podglad-v2.mjs --family bench_press --us 0,0.25,0.5,0.75,1`: bok i widok z góry, 5 klatek.
- Liczby z `frameAt`:
  - odchylenie przedramienia od pionu w płaszczyźnie czołowej i strzałkowej;
  - odwiedzenie ramienia od osi tułowia w płaszczyźnie tułowia (dla ławki płaskiej to ta sama miara co „widok z góry” w docs/18; dla flat sztanga daje 42°, hantle 33°, zgodnie z docs/18);
  - położenie gumy, łańcucha i gryfu.
- Współrzędne: x w stronę stóp jest ujemne (głowa x ≈ −70), y w górę, z w prawo, cm.

Automaty:

- `sens-gotowe.mjs`: **0 naruszeń**.
- `waliduj` na pozach z `exampleFor`: **28/30 OK**. JM Press i Decline Close-Grip To Skull Crusher mają łokieć 150–151° przy limicie 149° (uwaga C).
- Szczelność wobec znalezisk: **0 z 2**.

Zgodność z decyzją właściciela:

- 4 warianty skalibrowane (Bench Press sztanga i hantle, Incline sztanga i hantle, `vert`) spełniają ją: przedramię na dole 0–6° od pionu w płaszczyźnie czołowej i 2–8° w strzałkowej; odwiedzenie 42° (sztanga płasko) i 33° (hantle płasko).
- Linia i opis 45° są usunięte: w `lib/` nie ma `elbows45`, `ELBOW45_KEYS` ani `elbowAngleApplies`.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Bench Press (sztanga) | OK | przedramię 6° (czołowo) / −6° (strzałkowo) na dole, odwiedzenie 42°, dotyk gryfu y 66,7 nad mostkiem, łokieć 4° → 135° |
| Bench Press (hantle) | OK | przedramię 5°, odwiedzenie 33° |
| Incline Bench Press (sztanga) | OK | ławka 30°, przedramię 2° |
| Incline Bench Press (hantle) | OK | przedramię 0° |
| **Decline Bench Press** | **BŁĄD** | nr 1 (przedramię 23°, odwiedzenie 74°) |
| Close Grip Bench Press | OK z uwagą | uwaga B |
| **Decline Bench Press (hantle)** | **BŁĄD** | nr 1 (34°, 64°) |
| **Floor Press (hantle)** | **BŁĄD** | nr 1 (36°, 59°); łokieć na podłodze na dole (y 6,6), poprawnie |
| **Floor Press (sztanga)** | **BŁĄD** | nr 1 (25°, 67°) |
| Squeeze Press (hantle) | OK | hantle dociśnięte do siebie (chwyt ±7), łokcie przy tułowiu (23°); skos przedramienia wynika z ćwiczenia |
| **Smith Machine Bench Press** | **BŁĄD** | nr 1 (20°, 72°) |
| Smith Machine Incline Press | OK | przedramię 5° |
| JM Press | OK z uwagą | hybryda: gryf ku twarzy, łokieć w przód; uwaga C |
| **One-Arm Kettlebell Floor Press** | **BŁĄD** | nr 1 (42°, 49°) |
| **One Arm Dumbbell Bench Press** | **BŁĄD** | nr 1 (38°, 55°) |
| Barbell Guillotine Bench Press | OK | gryf do szyi, łokcie 90° w bok (cecha ćwiczenia), przedramię 6° |
| Wide-Grip Barbell Bench Press | OK | chwyt ±45, przedramię 7°, odwiedzenie 62° |
| **Smith Machine Decline Press** | **BŁĄD** | nr 1 (23°, 74°) |
| **Band Bench Press** | **BŁĄD** | nr 1 (20°, 72°) i nr 2 (guma przez ciało) |
| **Chain Press** | **BŁĄD** | nr 1 (20°, 72°); łańcuchy przy końcach gryfu, poprawnie |
| **Bench Press with Chains** | **BŁĄD** | nr 1 |
| **Floor Press with Chains** | **BŁĄD** | nr 1 (25°, 67°) |
| **Reverse Band Bench Press** | **BŁĄD** | nr 1 i nr 2 (guma przez ciało, od dołu) |
| **Board Press** | **BŁĄD** | nr 1 (23°, 69°); uwaga A |
| **Pin Press** | **BŁĄD** | nr 1 (24°, 68°); A |
| Close-Grip Dumbbell Press | OK z uwagą | B |
| Close-Grip EZ-Bar Press | OK z uwagą | B |
| Smith Machine Close-Grip Bench Press | OK z uwagą | B |
| **Reverse Grip Bench Press** | **BŁĄD** | nr 1 (25°, 66°); przy podchwycie łokcie zwykle bliżej tułowia niż w zwykłym wyciskaniu |
| Decline Close-Grip Bench To Skull Crusher | OK z uwagą | C |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **16 wariantów wyciskania ze zwykłym chwytem poza czterema skalibrowanymi:** sztanga: Decline, Smith Bench, Smith Decline, Band, Chain Press, with Chains, Floor (sztanga), Floor with Chains, Reverse Band, Board, Pin, Reverse Grip; hantle i kettlebell: Decline (hantle), Floor (hantle), One Arm DB, One-Arm KB Floor | u = 1 (dół ruchu), ramiona (bok i widok z góry) | **Kalibracja „przedramiona pionowo” objęła tylko 4 warianty. Pozostałe warianty tego samego wzorca mają na dole przedramię odchylone 20–25° (sztanga) i 34–42° (hantle, kettlebell) od pionu w płaszczyźnie czołowej, a łokcie rozłożone 66–74° od tułowia (sztanga) i 49–64° (hantle).** Przykład Smith Machine Bench Press, u = 1: chwyt z ±33, łokieć z ±44 (11 cm na zewnątrz dłoni), przedramię 20° czołowo i 16° strzałkowo, odwiedzenie 72°. Bench Press (sztanga) obok: łokieć 3 cm na zewnątrz dłoni (38,3 przy chwycie 35), przedramię 6°, odwiedzenie 42°. W widoku z góry różnica jest wyraźna: w Decline i Smith łokcie stoją prawie prostopadle do tułowia. Decyzja właściciela z 26.10.2026 (docs/18) rozstrzyga według hierarchii źródeł, że reguła „przedramiona pionowo ± 10° na dole” ma źródło. To reguła wzorca wyciskania, a nie tylko czterech kluczy. Odwiedzenie > 65° wypada poza przyjęty przedział 35–65°. | Te same parametry co w 4 wariantach skalibrowanych (`vert`, chwyt i punkt dotyku z geometrii) dla każdego wariantu ze zwykłym chwytem, także na ławce ujemnej, w Smith, z gumą lub łańcuchem, z podłogi i jednorącz: przedramię ≤ 10° od pionu na dole, odwiedzenie 35–65°. Nie dotyczy wariantów z założenia innych: wąski chwyt, Squeeze, Guillotine (łokcie 90° to cecha), JM, Skull Crusher, szeroki chwyt (spełnia: 7°, 62°). | 75% | realny (rodzina gotowa, wyświetlana dziś) | nie: sens-gotowe 0 naruszeń; test reguł wyciskania (`figures-v2-bench-rules`) obejmuje 4 klucze |
| 2 | **Band Bench Press, Reverse Band Bench Press** | wszystkie klatki, guma (bok) | **Guma biegnie pionowo od środka gryfu do podłogi przez klatkę, tułów i ławkę.** Rekwizyt `band` od (−48; 115,6; 0) do (−48; 0; 0) w u = 0 i od (−33; 66,7; 0) do (−33; 0; 0) w u = 1, czyli w z = 0, przez oś ciała. Łańcuchy w tych samych rigach mają `bar: true` i wiszą przy końcach gryfu. W „Reverse Band” guma jest od dołu, choć w tej odmianie zwisa z góry stojaka. Ta sama klasa co w `squat.md`, znalezisko nr 2. | Dwie gumy przy końcach gryfu. W Band od gryfu w dół do nóg ławki albo podłogi, w Reverse Band od góry stojaka do gryfu. | 85% | realny | nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Board Press i Pin Press bez deski i bez bolców.** Gryf zatrzymuje się 4 cm (Board: y 70,7) i 5,5 cm (Pin: y 72,2) nad punktem dotyku zwykłego wyciskania (66,7), ale na rysunku nie ma przyczyny zatrzymania. Wygląda to jak niepełne powtórzenie. Deska na klatce albo bolce stojaka po bokach przywróciłyby cechę rozpoznawczą. Pewność 65%.
- **B. Wąski chwyt (4 ćwiczenia): łokcie w płaszczyźnie czołowej daleko na zewnątrz dłoni.** Chwyt z ±12, łokieć z ±37, przedramię 50° od pionu. Odwiedzenie od osi tułowia 37° spełnia jeszcze „łokcie blisko tułowia” (`cgbp.elbows`), ale chwyt ±12 (24 cm) jest węższy od barków (±19), a `cgbp.grip` mówi „na szerokość barków lub trochę węziej, nie bardzo wąsko”. Chwyt ok. ±17–19 dałby przedramiona bliżej pionu przy tych samych łokciach. Pewność 55%.
- **C. Łokieć 152–154° przy limicie kontraktu 149°** (JM Press, Decline Close-Grip To Skull Crusher; u = 0,83–1). Skrajne zgięcie łokcia w tych ćwiczeniach jest typowe. Przekroczenie o 3–5° to sprawa progu albo rigu. Pewność 50%.

## Proponowane reguły

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `wyciskanie_przedramie_pion` (cały wzorzec, nie 4 klucze) | warianty rodziny bench_press bez znacznika „chwyt wąski / squeeze / guillotine / JM / skull”: w u = 1 przedramię ≤ 10° od pionu w płaszczyźnie czołowej i odwiedzenie 35–65° | 16 wariantów (20–42°, 49–74°) | 4 skalibrowane, Wide-Grip, Smith Incline: bez alarmu |
| `rekwizyt_nie_przenika_ciala` | jak w `squat.md` | Band, Reverse Band | Chain Press, with Chains: bez alarmu |
