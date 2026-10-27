# Sprzeczności tekst ↔ rysunek: trzy rozstrzygnięcia (badacz, 27.10.2026)

Zlecenie: recenzje `recenzje-1-1/tresc/partia-1.md` (B2, S1) i `recenzje-1-1/ponowne/p2-p3.md` (U4).
Zasady: CLAUDE.md, „Merytoryczne podstawy” (wskazówki techniki: 2 zgodne źródła szczebla 4 albo wyższe).
Wszystkie źródła niżej przeczytane 27.10.2026. Cytaty najwyżej 2 zdania.

---

## 1. Straight Raises on Incline Bench (delt_raise, B2)

### Co to za ćwiczenie
Nazwa w katalogu pochodzi z free-exercise-db (`fedb: "Straight Raises on Incline Bench"`, `docs/research/equipment/catalog.json`).
Opis źródłowy mówi jasno: **leżenie przodem** na ławce skośnej, sztanga zwisa na prostych rękach, unoszenie przodem przed głowę.
To unoszenie ramion przodem w leżeniu przodem na ławce skośnej. Nie jest to ruch nad głowę w leżeniu tyłem.

### Źródła
| Źródło | Szczebel | Miejsce | Cytat |
|---|---|---|---|
| free-exercise-db, `Straight_Raises_on_Incline_Bench.json` — https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json | 4 (identyfikacja ruchu, opis z dawnej biblioteki serwisu kulturystycznego) | `instructions[1]`, `instructions[2]` | „Lay on the bench face down. With a pronated grip, pick the barbell up from the floor, keeping your arms straight.” / „To begin, raise the barbell out in front of your head while keeping your arms extended.” |
| Motra, Barbell Incline Front Raise — https://motra.com/exercises/barbellInclineFrontRaise | 4 (dokumentacja aplikacji) | instrukcja: ustawienie i ruch | „Lie prone with chest supported, feet flat on floor.” / „Lift until arms parallel to floor.” |

Część wspólna (2 niezależne źródła szczebla 4): leżenie przodem, start z rękami zwisającymi pionowo, ręce proste, unoszenie przodem.
Wysokość końca: Motra — ręce równolegle do podłogi; free-exercise-db — „przed głowę”, bez wysokości. W leżeniu przodem na skosie
ręce poziomo wypadają właśnie przed głową, więc te dwa opisy sobie nie przeczą. **Żadne przeczytane źródło nie prowadzi sztangi nad głowę w leżeniu tyłem.**

### Werdykt
- **Rysunek jest błędny co do pozycji, nie tylko zakresu.** Generator (`scripts/figures/agent-pozy/delt_raise.mjs`, `G['Straight Raises on Incline Bench']`)
  używa `naLawce` (plecami do oparcia) i ruchu „sztanga z nad ud nad głowę”. Powinien użyć pozycji leżenia przodem (jak `przodemLezac`) ze sztangą:
  u = 0 ręce pionowo w dół, u = 1 ręce mniej więcej poziomo przed sobą. W układzie ciała to zgięcie w barku z ok. 45° do ok. 135° przy oparciu 45°.
- **Karta zostaje:** `front.elbows` + `lat.height` („Unoś mniej więcej do wysokości barków”) zgadza się z Motrą (ręce równolegle do podłogi = dłonie na wysokości barków).
- Oznaczenie: **ustalone** (pozycja i przebieg ruchu — 2 zgodne źródła szczebla 4, wyjątek dla wskazówek techniki). Wysokość końca:
  **jedno źródło** wprost (Motra), drugie (free-exercise-db) nie przeczy.
- Proponowana poprawka B2: **zmienić rysunek, nie tekst.** Usunięcie `lat.height` (jak w „Front Raise to Overhead”) byłoby błędne, bo utrwaliłoby zły ruch.

### Dodatkowe znalezisko: Front Incline Dumbbell Raise (to samo ćwiczenie odwrotnie)
free-exercise-db, `Front_Incline_Dumbbell_Raise.json` (https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Incline_Dumbbell_Raise.json), `instructions[0]` i porady:
„Sit down on an incline bench with the incline set anywhere between 30 to 60 degrees while holding a dumbbell on each hand.” / „Keep your head resting down against the bench and your legs on the floor at all times.”
Koniec ruchu: „…raise the dumbbells straight up until they are slightly above your shoulders, while keeping your elbows locked.”
To jest pozycja **tyłem do oparcia**: hantle od ud do nieco ponad barki. Rysunek (`przodemLezac`) pokazuje leżenie przodem.
Wygląda na to, że pozycje tych dwóch ćwiczeń zamieniono. To jedno źródło szczebla 4 (identyfikacja). Drugiego niezależnego opisu tej odmiany
nie znalazłem: exercise.com powtarza ten sam tekst, a muscleandstrength.com zwraca 403. **[OTWARTE]**: przed zmianą rysunku potrzebne drugie źródło
albo decyzja, że nazwa katalogu idzie za opisem free-exercise-db (tak katalog robi przy identyfikacji). Recenzja partia-1 dała tu OK, więc zgłaszam do recenzji ruchu.

### Reguła sprawdzalna
- `lat.height` w `CUE_REQUIRES` liczona **w układzie świata, nie stawu**. Propozycja z B2 („szczyt zgięcia ≤ ok. 110°”) nie działa dla leżenia przodem na skosie,
  gdzie poprawny koniec to ok. 135° w barku. Warunek: w u = 1 |y_dłoni − y_barku| ≤ 15 cm i przez cały ruch y_dłoni − y_barku ≤ +15 cm
  (tolerancja 15 cm to **konwencja**).
- Dla Straight Raises dodatkowo: tułów leży przodem (`obrotTulowia` 180), a w u = 0 przedramię pionowo w dół (odchyłka ≤ 15°, **konwencja**).
  Ten warunek złapie obecny rysunek (plecy na oparciu, dłonie w u = 1 wysoko nad barkiem).

---

## 2. Upright Row (7 ćwiczeń; S1, `ur.elbows` + `lat.height`)

### Źródła
| Źródło | Szczebel | Miejsce | Cytat |
|---|---|---|---|
| NSCA Exercise Technique Manual, Upright Row (przedruk: Coaches Association of Ontario) — https://www.coachesontario.ca/articles/breaking-down-the-upright-row/ | 4 (przedruk podręcznika organizacji; tak w docs/research/33) | Upward movement | „Continue pulling the bar up until it reaches the area between the bottom of the sternum and the chin” / „At the highest bar position, the elbows should be level with or slightly higher than the shoulders and wrists.” |
| Schoenfeld B, Kolber MJ, Haimes JE. The Upright Row: Implications for Preventing Subacromial Impingement. Strength Cond J 2011;33(5):25–28 — kopia: https://www.lookgreatnaked.com/articles/upright_row_implications_for_preventing_subacromial_impingement.pdf | 3 | s. 27, Modifications to Technique; s. 26 | „…the authors recommend that asymptomatic individuals elevate their arms during the upright row to just below 90° (shoulder height) (Figure 2).” / s. 26: „…it is important to pull through the elbows, not the wrist, so as to maximize muscle activity at the shoulder.” |
| The Prehab Guys, Upright Row (Band) — https://theprehabguys.com/vimeo-video/upright-row-band/ | 4 (biblioteka ćwiczeń fizjoterapeutów) | opis | „…begin the exercise by driving your elbows up and out to bring your hands to shoulder height.” / „Drive your elbows up and out so that they're even with your hands at the top.” |
| WebMD Ignite (UMass Memorial Health), Upright Row — https://www.ummhealth.org/health-library/upper-body-exercises-upright-row | 4 | kroki | „…raise the weights along the midline of your body up to your collarbone.” / „Your elbows should move out to the sides.” |

### Część wspólna i różnica
- Wszystkie źródła: **ruch prowadzą łokcie**, które idą na boki i w górę. Łokcie nie są niżej niż dłonie (NSCA: równo lub wyżej; Prehab Guys: równo; Schoenfeld: ciągnąć łokciami).
- **Wysokość odnosi się do łokci:** mniej więcej do wysokości barków. NSCA: równo z barkami albo nieco wyżej; Schoenfeld: tuż poniżej 90°, czyli wysokości barków. Część wspólna: „mniej więcej do wysokości barków”.
  Różnica (nieco wyżej albo nieco niżej) dotyczy uzasadnienia zdrowotnego (Schoenfeld). Aplikacja go nie podaje, bo to twierdzenie o zdrowiu z jednego źródła szczebla 3.
- Dłonie zostają przy ciele, na wysokości od dołu mostka do brody (NSCA) albo do obojczyków (WebMD). Wyjątek: Prehab Guys przy gumie — dłonie do barków.
- Oznaczenie: **ustalone** (przebieg ruchu, 2+ zgodne źródła szczebla 4 i źródło szczebla 3). Przedział wysokości łokci: część wspólna źródeł, opisana słowami, bez liczby.

### Werdykt
- Samo „Unoś mniej więcej do wysokości barków” (`lat.height`) przy wiosłowaniu pionowym jest dwuznaczne. Czytelnik zrozumie „dłonie do barków”,
  a to przeczy NSCA i WebMD (dłonie niżej, do brody lub obojczyków).
- Karta: **zamiast** `lat.height` własne zdanie dla rodziny `uprightRow`, np. `ur.height`: „Prowadź łokciami — unoś je mniej więcej do wysokości barków, dłonie blisko ciała.”
  Można też zostawić `ur.elbows` z `lat.height`, ale wtedy `ur.elbows` musi być widoczne (S1) i stać **przed** `lat.height`. Wariant `ur.height` jest jednoznaczny bez kolejności.
  Brzmienie ustala tłumacz i recenzent lokalizacji.
- Rysunek: w u = 1 łokcie mniej więcej na wysokości barków i nie niżej niż dłonie; dłonie między dołem mostka a brodą, blisko tułowia.

### Reguła sprawdzalna
- `ur.height` (albo `lat.height` w rodzinie `uprightRow`) liczona dla **łokcia**: w u = 1 y_łokcia − y_barku ∈ [−10; +8] cm (**konwencja**: „tuż poniżej” / „nieco wyżej”).
- Istniejąca `lokcie_nad_dlonmi_u1` (y_łokcia ≥ y_dłoni w u = 1) jest potwierdzona (NSCA + Prehab Guys + Schoenfeld). Oznaczenie w figury-sens.json
  „jedno źródło bezpośrednie + analogia” można podnieść do „ustalone”.
- Nowa: w u = 1 y_dłoni między y(dołu mostka) a y(brody), a odległość dłoni od tułowia (oś przód–tył) ≤ 12 cm (**konwencja**; „blisko ciała” wg NSCA, WebMD, Schoenfelda).

---

## 3. Bulgarian Split Squat (3 ćwiczenia; U4)

### Źródła
| Źródło | Szczebel | Miejsce | Cytat |
|---|---|---|---|
| NASM Exercise Library, Bulgarian Split Squat — https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat | 4 | Step 1: Setup | „Place one foot elevated on the bench with toes pointing downward” |
| Alexander R., *Complete Conditioning for Soccer* (Human Kinetics), fragment — https://us.humankinetics.com/blogs/excerpt/building-strength-for-soccer-with-the-rear-foot-elevated-split-squat | 4 (fragment książki wydawcy; autor spoza listy uznanych) | opis ustawienia | „Balance on one leg and place the other foot, sole up, on the elevated surface behind you.” / „The top of the foot will be in contact with the platform” |
| E3 Rehab, How to Perform Split Squats — https://e3rehab.com/how-to-perform-split-squats/ | 4 (fizjoterapeuci) | część o odmianie z podwyższeniem | „While you can extend the big toe of the back foot on the bench or box behind you, the movement is significantly easier with the top of the foot flat on whatever object you're using.” / „Think 'laces down.'” |
| Helme M i in. Is the Rear Foot Elevated Split Squat Unilateral? J Strength Cond Res 2020 (PubMed 32796420); rękopis: https://eprints.leedsbeckett.ac.uk/id/eprint/6750/3/IsTheRearFootElevatedSplitSquatUnilateralAM-HELME.pdf | 3 (protokół badania, nie zalecenie) | s. 7, Procedures; ryc. 1 (s. 24) | „Only the toe of the shoes of the rear foot were in contact with the force plate” |
| ACE #366, NASM, ExRx DBSingleLegSplitSquat | 4 | wg `docs/research/27-wskazowki-zrodla.md` (bss.setup) | ACE i ExRx dziś zwracają 403, nie czytałem ich ponownie |

### Część wspólna i różnica
- Ustawienie domyślne: **grzbiet tylnej stopy na ławce** („laces down”). Zgodne źródła: NASM, fragment książki HK, E3 Rehab, wcześniej ACE.
  Oznaczenie: **ustalone**, więc tekst karty `bss.setup` jest poprawny.
- Ustawienie na palcach: **dopuszczalne**. E3 Rehab mówi to wprost („you can”, ale wersja na grzbiecie jest łatwiejsza). W protokole Helme i in.
  tylna stopa opiera się czubkiem buta (ryc. 1: podeszwa widoczna od tyłu). Żadne przeczytane źródło nie nazywa ustawienia na palcach błędem.
  Oznaczenie: dopuszczalność — **ustalone** (źródło szczebla 4 wprost i badanie szczebla 3, które go używa); „łatwiej na grzbiecie” — **jedno źródło**.

### Werdykt
- Technika na rysunku (palce) jest poprawna, ale **przeczy zdaniu na karcie**, które użytkownik widzi obok. Rozwiązania merytorycznie poprawne:
  - **A (rekomendowane):** rysunek pokazuje grzbiet stopy, zgodnie z kartą i większością źródeł. Wymaga rozszerzenia modelu stopy o zgięcie podeszwowe
    tylnej stopy (wyjątek w figury-sens.json zniknie). Najlepsza zgodność, wymaga pracy przy modelu.
  - **B:** karta dopuszcza oba ustawienia, np. `bss.setup`: „Stań tyłem do ławki i oprzyj na niej tylną stopę — grzbietem albo na palcach; przednia stopa wysunięta.”
    Tania zmiana i merytorycznie poprawna. Rysunek zostaje wtedy wariantem (palce), a uproszczenie modelu i tak trzeba opisać w figury-sens.json.
  - Wybór A albo B to decyzja produktowa koordynatora lub właściciela: koszt modelu kontra spójność z większością źródeł.
- Nie dopisywać „łatwiej na grzbiecie” (jedno źródło).

### Reguła sprawdzalna
- Wariant A: `bss.setup` wymaga, by tylna stopa leżała na ławce grzbietem: odcinek kostka→palce tylnej stopy skierowany od ćwiczącego (w tył),
  nachylony do płaszczyzny siedziska ≤ 30°, a palce na `top` ławki ± 3 cm (**konwencja** 30° i 3 cm). Obecny rysunek (stopa prawie pionowo na czubku palców) nie przejdzie.
- Wariant B: tylna stopa na ławce (palce albo grzbiet dotykają `top` ławki ± 3 cm), bez warunku kąta.

---

## Podsumowanie dla koordynatora
| # | Co zmienić | Rysunek | Karta | Oznaczenie |
|---|---|---|---|---|
| 1 | Straight Raises on Incline Bench | **zmienić**: leżenie przodem, sztanga od zwisu do poziomu | bez zmian (`front.elbows`, `lat.height`) | ustalone (pozycja); wysokość końca: jedno źródło wprost |
| 1a | Front Incline Dumbbell Raise | prawdopodobnie odwrotnie (tyłem do oparcia wg free-exercise-db) | — | [OTWARTE] — potrzebne 2. źródło |
| 2 | Upright Row ×7 | łokcie ≈ wysokość barków, dłonie dół mostka–broda | `ur.height` zamiast `lat.height` (wysokość łokci) | ustalone; tolerancje — konwencja |
| 3 | Bulgarian Split Squat ×3 | A: grzbiet stopy | B: „grzbietem albo na palcach” | ustalone (oba dopuszczalne) |

## Otwarte pytania
- [OTWARTE] Front Incline Dumbbell Raise: pozycja (tyłem czy przodem do oparcia) — potrzebne drugie niezależne źródło dla nazwy z katalogu.
- [OTWARTE] Tolerancje w regułach (15 cm, −10/+8 cm, 12 cm, 30°, 3 cm) to konwencje do ustawienia przy wdrożeniu, nie liczby ze źródeł.
- [OTWARTE] ACE #366 i ExRx: tym razem 403; cytaty z `docs/research/27` nie były czytane ponownie.
