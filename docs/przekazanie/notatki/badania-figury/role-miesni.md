# Rola mięśnia w ruchu — jedno zdanie na parę (mięsień, funkcja)

Data: 26.10.2026. Autor: badacz merytoryczny. Status: projekt do wdrożenia przez programistę, nic nie jest commitowane.
Dane gotowe dla maszyny (funkcje, reguły, teksty PL/EN, źródła z cytatami): `role-miesni.json` w tym samym katalogu.

Zlecenie wynika z decyzji właściciela z 26.10.2026: przy każdym mięśniu ćwiczenia ma być jedno zdanie o jego roli. Zdanie powstaje
raz na parę (region, funkcja w stawie), a ćwiczenia je współdzielą.

## 1. Wnioski

- Każdy z 18 regionów `muscleLoad` (bez szyi) ma co najmniej jedną funkcję w stawie, potwierdzoną dwoma niezależnymi podręcznikami
  anatomii: OpenStax (szczebel 3) i TeachMeAnatomy lub Kenhub (szczebel 4). Tam, gdzie dało się, doszły źródła szczebla 2–3 opisujące
  ćwiczenia: przeglądy systematyczne EMG pośladków i martwego ciągu, przegląd biomechaniki przysiadu oraz badania wyciskania leżąc
  i nad głowę.
- Z samej rodziny ruchu (`pattern`) i roli (główny/pomocniczy) da się jednoznacznie przypisać opis **1083 z 1668 par**, które są
  podświetlane (udział ≥ 0,5). Pozostałe **585 par** dostaje „bez opisu roli”, a do tego 925 par z małym udziałem (0,25), które nie są
  podświetlane.
- Z 1083 opisanych par: 1035 ma funkcję potwierdzoną dwoma lub więcej źródłami, 39 to **uproszczenie** (przywodziciele jako prostowniki
  biodra; łopatki w podciąganiu), a 9 ma **jedno źródło** (brzuch w desce).
- Nie da się rozstrzygnąć: rodzin mieszanych (`other`, `cardio`, `mobility`, `core_other`), szyi, przedramion i górnej części pleców
  w ćwiczeniach izolowanych, dwugłowych w przysiadzie i wykroku (dowody sprzeczne) ani mięśni stabilizujących w martwym ciągu i noszeniu.
  Te pary nie dostają opisu, a powody są zapisane w sekcji 6.
- Aplikacja niczego nie zaleca. Zdania opisują wyłącznie funkcję anatomiczną, bez nazw źródeł i bez treści medycznych.

## 2. Funkcje regionów (ruch w stawie)

Skróty źródeł (pełne dane z cytatami w JSON, pole `sources`):
- S1–S4: OpenStax A&P 2e, rozdz. 11.5, 11.6, 11.4 i 11.3.
- S5–S16: TeachMeAnatomy.
- S17–S18: Kenhub.
- S19: Neto 2020, przegląd systematyczny.
- S20: Straub i Powers 2024.
- S21: Escamilla 2025.
- S22: Rodríguez-Ridao 2020.
- S23: Padovan 2025.
- S24: Di Fonza 2026.
- S25: Martín-Fuentes 2020, przegląd systematyczny.
- S26: Oliva-Lozano 2020, przegląd systematyczny.
- S27: Graber 2021.

| Funkcja (id) | Region → partia | Ruch w stawie | Źródła | Pewność |
|---|---|---|---|---|
| glutes.hip_ext | pośladki | wyprost biodra | S2, S11, S19 (szczebel 2: „one of the primary hip extensors”) | ustalone |
| hamstrings.hip_ext | dwugłowe | wyprost biodra | S2, S13 (+ S25: martwy ciąg) | dwa źródła |
| hamstrings.knee_flex | dwugłowe | zgięcie kolana | S2, S13 | dwa źródła |
| quads.knee_ext | czworogłowe | wyprost kolana | S2, S12, S20 | ustalone (3) |
| adductors.hip_add | przywodziciele | przywiedzenie biodra | S2, S14 | dwa źródła |
| adductors.hip_ext | przywodziciele | wyprost biodra | S2, S14: wyprost wykonuje przywodziciel wielki; S20: aktywność przy wstawaniu | **uproszczenie** (grupa zamiast mięśnia wielkiego) |
| abductors.hip_abd | pośladki (odwodziciele) | odwiedzenie biodra | S2 (napinacz powięzi, pośladkowy średni), S11 | dwa źródła |
| abductors.pelvis_level | pośladki (odwodziciele) | poziom miednicy na jednej nodze | S11, S27 | dwa źródła (dziś 0 par) |
| calves.plantar_flex | łydki | zgięcie podeszwowe | S2, S15 | dwa źródła |
| lower_back.spine_ext | plecy (prostowniki) | wyprost kręgosłupa i kontrola zgięcia | S4 („controls flexion … maintains the lumbar curve”), S10, S20 | dwa źródła |
| abs.trunk_flex | core | zgięcie tułowia | S3, S17, S18 | dwa źródła |
| abs.antilordosis | core | kontrola wygięcia lędźwi | S17 („stabilizes and controls tilt of the pelvis (antilordosis)”); S26 tylko aktywność | **jedno źródło** |
| obliques.rotate_bend | core | rotacja i zgięcie boczne | S3, S16, S18 | dwa źródła |
| chest.shoulder_flex_add | klatka | zgięcie i przywiedzenie ramienia | S1, S7, S22 | ustalone (3) |
| front_delt.shoulder_flex | barki (przód) | zgięcie ramienia | S1, S6, S22, S23 | ustalone (4) |
| side_delt.shoulder_abd | barki (bok) | odwiedzenie ramienia | S1, S6, S23 | ustalone (3) |
| rear_delt.shoulder_ext | barki (tył) | wyprost i rotacja zewnętrzna | S1, S6 (+ S24: wiosłowania) | dwa źródła |
| triceps.elbow_ext | triceps | wyprost łokcia | S1, S8, S22, S23 | ustalone (4) |
| biceps.elbow_flex | biceps | zgięcie łokcia | S1, S8 | dwa źródła |
| forearms.grip | przedramiona | zgięcie palców (chwyt) | S1 („bends the fingers to make a fist”), S9 | dwa źródła |
| lats.shoulder_ext_add | plecy (najszersze) | wyprost i przywiedzenie ramienia | S1, S5, S24 | ustalone (3) |
| upper_back.scap_retract | plecy (górna część) | przywiedzenie łopatek | S1 (tab. 11.8), S5 (+ S24: wiosłowania) | dwa źródła |
| upper_back.scap_down_retract | plecy (górna część) | obniżenie i przywiedzenie łopatek | S1, S5; brak źródła, że tak pracują w podciąganiu | **uproszczenie** |
| neck | — | — | — | bez opisu: zgięcie, wyprost i skłon wynikają tylko z nazwy |

Uwagi:
- „Ustalone (n)” oznacza n niezależnych źródeł, które zawierają tę funkcję wprost. Przy S19 wystarcza jedno źródło szczebla 2
  (wyjątek z 18.10.2026).
- OpenStax i TeachMeAnatomy to różni autorzy i różne organizacje. Wersja OpenStax w LibreTexts (OERI) jest pochodną OpenStax,
  więc nie liczyłem jej jako osobnego źródła.
- Funkcja jest przypisana do regionu, nie do partii. Partie z jednym regionem dziedziczą opis 1:1: klatka, biceps, triceps,
  przedramiona, czworogłowe, dwugłowe, przywodziciele i łydki.
- Partie z kilkoma regionami (barki, plecy, core, pośladki) dostają opis tylko przy regionie, bo ich regiony mają różne funkcje.
  Mapowanie bierze się z `REGION_MUSCLE` w `lib/seed.ts`.

## 3. Reguła przypisania

1. **Rola:** udział 1 to rola główna (main), 0,5 to pomocnicza (aux). Udział 0,25 oznacza „bez opisu”, bo mięsień nie jest
   podświetlany (`MUSCLE_MIN_LOAD`).
2. **Wyjątki z nazwy (lista `exceptions.noRole`):**
   - Wall Sit (czworogłowe): ćwiczenie izometryczne, ma `metric: time`.
   - L-Sit i Scissor Kick (brzuch): tułów się nie zgina.
   - Strażnik w teście: każde ćwiczenie z `metric: time` w rodzinie z fazą wypada z opisu.
3. **Reguła:** pierwsza pasująca reguła (pattern, region, rola[, `requireMain`]) z listy w JSON. Gdy żadna nie pasuje, para zostaje
   bez opisu (`null`). Program nie zgaduje.
4. **Skrót reguł** (liczby par w nawiasach):
   - `h_push`: klatka, triceps, przedni akton, w roli głównej i pomocniczej (56, 56, 49).
   - `v_push`: przedni akton (41), boczny akton (25), triceps (41), a klatka tylko w roli głównej (1, pompki na poręczach).
     S22 podaje, że w wyciskaniu pionowym przywiedzenie poziome jest minimalne.
   - `h_pull`: najszersze (22), górna część pleców (25), tylny akton (23), biceps (22), prostowniki (7).
   - `v_pull`: najszersze (17), biceps (17), górna część pleców (17, uproszczenie), przedramiona (10).
   - `squat`: czworogłowe (35), pośladki (34), przywodziciele (17, uproszczenie), prostowniki (8).
     Dwugłowe zostają bez opisu, bo S20 podaje: „evidence related to hamstring activity also is conflicting”.
   - `lunge_single_leg`: czworogłowe (24), pośladki (24). Reguła dla odwodzicieli (stabilizacja miednicy) czeka w zapasie,
     bo dziś żadne ćwiczenie jednonóż nie ma ich z udziałem ≥ 0,5.
   - `hinge`: pośladki (79), dwugłowe jako wyprost biodra (73), prostowniki (52), czworogłowe (43), przedramiona (24),
     przywodziciele (5, uproszczenie).
     Czworogłowe sprawdziłem po nazwach: to martwe ciągi z podłogi, podrzuty i rwania, czyli ćwiczenia z wyprostem kolana.
     W hip thruście czworogłowe nie mają udziału ≥ 0,5.
   - `isolation`, tylko rola główna (opis to główna funkcja regionu):
     - klatka (17), najszersze (5), boczny akton (18), przedni akton (13), tylny akton (9), triceps (33);
     - czworogłowe (4), dwugłowe jako zgięcie kolana (10), łydki (13), przywodziciele (3), odwodziciele (6), pośladki (5).
     - Wyjątki: biceps opisany też w roli pomocniczej (37 + 1, wiosłowanie w pionie), a dwugłowe pomocnicze przy pośladkach
       głównych opisane jako wyprost biodra (4).
     - Wszystkie listy sprawdziłem po nazwach ćwiczeń. Np. wszystkie 5 ćwiczeń z pośladkami głównymi to kickbacki i wyprosty biodra.
   - `core_flexion`: brzuch w roli głównej (39), skośne w roli głównej (5). Ćwiczenia ze skośnymi głównymi to brzuszki ze skrętem
     lub skłonem.
   - `core_anti_ext`: brzuch w roli głównej (9, jedno źródło).
   - `carry`: przedramiona (5).
5. **Faza z rodziny** (opcjonalna, tylko dla reguł z `phase: true`):
   - przysiad i wykrok: „gdy wstajesz”;
   - zawias biodrowy: „gdy się prostujesz”;
   - wyciskanie: „gdy pchasz”;
   - przyciąganie: „gdy przyciągasz”.
   Bez fazy zostają: ćwiczenia izolowane, core, chwyt, prostowniki i najszersze (zdanie byłoby za długie).

## 4. Teksty (PL / EN)

Składanie zdania: tekst dla roli (główna albo pomocnicza), potem opcjonalnie „, ” i faza, na końcu kropka.
Przykład: „Prostuje biodro, gdy wstajesz.” / „Straightens your hip as you stand up.”

| id | PL główny / pomocniczy | EN main / aux |
|---|---|---|
| glutes/hamstrings/adductors.hip_ext | Prostuje biodro / Pomaga prostować biodro | Straightens your hip / Helps straighten your hip |
| hamstrings.knee_flex | Zgina kolano / Pomaga zginać kolano | Bends your knee / Helps bend your knee |
| quads.knee_ext | Prostuje kolano / Pomaga prostować kolano | Straightens your knee / Helps straighten your knee |
| adductors.hip_add | Przyciąga nogę do środka / Pomaga przyciągać nogę do środka | Draws your leg inward / Helps draw your leg inward |
| abductors.hip_abd | Odsuwa nogę w bok / Pomaga odsuwać nogę w bok | Moves your leg out to the side / Helps move your leg out to the side |
| abductors.pelvis_level | Trzyma miednicę poziomo, gdy stoisz na jednej nodze / Pomaga trzymać … | Keeps your pelvis level when you stand on one leg / Helps keep … |
| calves.plantar_flex | Unosi piętę / Pomaga unosić piętę | Lifts your heel / Helps lift your heel |
| lower_back.spine_ext | Prostuje plecy i trzyma je prosto / Pomaga prostować plecy i trzymać je prosto | Straightens your back and holds it straight / Helps straighten your back and hold it straight |
| abs.trunk_flex | Zgina tułów, przybliżając żebra do miednicy / Pomaga zginać tułów | Curls your trunk, bringing your ribs toward your pelvis / Helps curl your trunk |
| abs.antilordosis | Nie pozwala wygiąć się lędźwiom / Pomaga utrzymać lędźwie bez wygięcia | Keeps your lower back from arching / Helps keep your lower back from arching |
| obliques.rotate_bend | Skręca tułów i pochyla go na bok / Pomaga skręcać i pochylać tułów | Twists your trunk and bends it to the side / Helps twist and side-bend your trunk |
| chest.shoulder_flex_add | Przyciąga ramię do przodu i do środka / Pomaga przyciągać … | Brings your upper arm forward and inward / Helps bring … |
| front_delt.shoulder_flex | Unosi ramię do przodu / Pomaga unosić ramię do przodu | Raises your arm forward / Helps raise your arm forward |
| side_delt.shoulder_abd | Unosi ramię w bok / Pomaga unosić ramię w bok | Raises your arm out to the side / Helps raise … |
| rear_delt.shoulder_ext | Odciąga ramię do tyłu / Pomaga odciągać ramię do tyłu | Draws your arm back / Helps draw your arm back |
| triceps.elbow_ext | Prostuje łokieć / Pomaga prostować łokieć | Straightens your elbow / Helps straighten your elbow |
| biceps.elbow_flex | Zgina łokieć / Pomaga zginać łokieć | Bends your elbow / Helps bend your elbow |
| forearms.grip | Zaciska dłoń na uchwycie / Pomaga zaciskać dłoń na uchwycie | Keeps your hand closed around the grip / Helps keep … |
| lats.shoulder_ext_add | Ściąga ramię w dół i do tyłu, do tułowia / Pomaga ściągać ramię w dół i do tyłu | Pulls your upper arm down and back toward your body / Helps pull … |
| upper_back.scap_retract | Ściąga łopatki do siebie / Pomaga ściągać łopatki do siebie | Squeezes your shoulder blades together / Helps squeeze … |
| upper_back.scap_down_retract | Ściąga łopatki w dół i do siebie / Pomaga ściągać … | Draws your shoulder blades down and together / Helps draw … |

Fazy (PL / EN):
- gdy wstajesz / as you stand up;
- gdy się prostujesz / as you straighten up;
- gdy pchasz / as you push;
- gdy przyciągasz / as you pull.

Teksty EN do przeglądu przez tłumacza.

## 5. Liczby (katalog: 709 ćwiczeń)

| | Pary |
|---|---|
| Wszystkie pary (ćwiczenie, region) | 2593 |
| Podświetlane (≥ 0,5): główne 758, pomocnicze 910 | 1668 |
| **z opisem roli** | **1083**: 1035 z dwoma lub więcej źródłami, 39 uproszczeń, 9 z jednym źródłem |
| **bez opisu roli** (≥ 0,5) | **585** |
| Mały udział 0,25 (niepodświetlane, bez opisu) | 925 |

Skąd liczby: policzyłem je wyszukiwaniem w `docs/research/equipment/catalog.json` z bieżącego drzewa roboczego (gałąź
`naprawa-e2e-26b`). Nie miałem narzędzia git, więc nie sprawdziłem, czy plik jest identyczny z `origin/integracja-2026-10-26b`.
Programista powinien liczyć je generatorem z `--check` (zasada „liczby w jednym miejscu”).

## 6. Bez opisu — dlaczego

- **Rodziny mieszane** (`other`, `cardio`, `mobility`, `core_other`): skoki, ćwiczenia strongmana, rzuty, rozciąganie, deska boczna
  i skręty. Z samej rodziny nie wynika ruch w stawie.
- **Szyja:** kierunek ruchu wynika tylko z nazwy.
- **Isolation:**
  - przedramiona: zginanie i prostowanie nadgarstka, nawracanie, odwracanie, chwyt;
  - górna część pleców: szrugsy unoszą barki, inne ćwiczenia ściągają łopatki;
  - pomocnicze triceps, przedni i boczny akton oraz klatka: np. przedni akton w wznosach bokiem.
- **Dwugłowe w przysiadzie i wykroku:** S20 opisuje dowody jako sprzeczne, a S21 podaje niską aktywność.
- **Mięśnie stabilizujące** (najszersze i górna część pleców w martwym ciągu, brzuch i skośne w noszeniu, łydki w przysiadzie):
  nie przeczytałem źródła, które opisuje ich rolę w tym typie ruchu.
- **Klatka pomocnicza i górna część pleców w `v_push`:** pompki na poręczach i wyciskanie nad głowę wymagają innej pracy łopatki.

## 7. Otwarte pytania

1. [OTWARTE] Skośne brzucha w ćwiczeniach przeciw rotacji (Pallof, bird dog; 3 pary). Nie znalazłem przeczytanego źródła, że
   opierają się skrętowi. Same funkcje rotacji i skłonu są potwierdzone, ale tu chodzi o inną rolę.
2. [OTWARTE] Dwugłowe uda w przysiadzie i wykroku: potrzebny przegląd szczebla 2.
3. [OTWARTE] Mięśnie utrzymujące pozycję w martwym ciągu i noszeniu.
4. [OTWARTE] Opisy górnej części pleców w podciąganiu (17 par) i przywodzicieli jako prostowników biodra (22 pary) mają dziś status
   uproszczenia. Potrzebne źródło opisujące wprost te ruchy.
5. [OTWARTE] Brzuch w desce i rolce (9 par) ma jedno źródło szczebla 4.
6. [OTWARTE] Zgodność liczb z `origin/integracja-2026-10-26b`.

## 8. Decyzje dla właściciela (produktowe)

**A. Czy pokazywać opisy oznaczone jako uproszczenie albo jedno źródło (48 par)?**
- **A1 (rekomendacja):** pokazywać tylko opisy z dwoma lub więcej źródłami, czyli 1035 par. Pozostałe 48 par na razie bez opisu.
  Plus: w aplikacji nie ma żadnych dopisków. Minus: brzuch w desce i łopatki w podciąganiu zostają bez zdania.
- **A2:** pokazywać wszystkie 1083 pary, a przy 48 dopisać „uproszczenie” lub „jedno źródło”, tak jak dziś przy partiach.
  Plus: większe pokrycie. Minus: więcej dopisków na ekranie.

**B. Czy dopuścić reguły po słowach w nazwie w ćwiczeniach izolowanych** (szrugsy, zginanie nadgarstka, szyja)?
- **B1 (rekomendacja na 1.0):** nie dopuszczać, czyli tylko rodzina i rola. Plus: reguła jest prosta i nie psuje się po zmianie nazw.
- **B2:** dopuścić jawną listę słów kluczowych z testem. Daje kilkadziesiąt par więcej, ale wymaga utrzymania listy przy każdej
  zmianie katalogu.
