# Reguły sensu ruchu — runda 5 (badacz, 26.10.2026)

Dane: `reguly-sensu-r5-patch.json` (JSON Merge Patch). Nakładać **po r4**, bo odwołuje się do reguł r4 (`pallof_wysokosc`, `rozstaw_*`, `tulow_pion` itd.).
Nie miałem powłoki, więc niczego nie uruchamiałem. Liczby pokrycia są policzone ręcznie.

## A. Poza@2 — reguły dla ćwiczeń, które w r4 blokował silnik

Decyzja właściciela (przekazana przez koordynatora): rozszerzamy model figury. Każda reguła, która czyta nowy stopień swobody, ma pole `wymaga: "poza@2"`.

Proponowane nowe stopnie swobody są w `_typy._poza2`. Nazwy i znaczenie to propozycja badacza: kąty liczone względem ciała, 0 = pozycja anatomiczna.
- tułów: `skretTulowia`, `przechylTulowia`;
- miednica i głowa: `przechylMiednicy`, `przechylGlowy`;
- barki, na stronę (cm): `uniesienieBarkow`, `wysuniecieBarkow`;
- ręka, na stronę: `zgiecieNadgarstka`, `obrotPrzedramienia`.

**Zakresów stawów do walidatora geometrii nie podaję. To zadanie z osobnym źródłem — [OTWARTE].**

| Rodzina | Ćwiczenia | Reguły poza@2 (+ zwykłe) | Pewność kierunku |
|---|---|---|---|
| core_standing | 16 (Figure 8, Spell Caster zostają otwarte) | skręt ≥ 40° w obie strony / ≥ 25° w jedną; skłon boczny ≥ 20° bez skrętu; wiatrak: skłon ≥ 15°, ręka prosta i ciężar nad barkiem; Russian Twist: odchylenie 45° (ACE #305), plecy proste | ustalone (rt.move, sb.plane); wiatrak — jedno źródło (ACE #386) |
| shrug | 8 | uniesienie barków ≥ 4 cm, bez rolowania (wysunięcie ≤ 2 cm), tułów prosto; Middle Back Shrug: ściąganie łopatek ≥ 3 cm | ustalone (ACE #72 + ExRx); rolowanie — jedno źródło; Middle Back — konwencja |
| forearm | 10 | zakres nadgarstka ≥ 50°, przedramię podparte (stały łokieć, łokieć nieruchomy); pronacja/supinacja ≥ 45° w obie strony | ustalone (ACE #30, ISSA); obrót — jedno źródło (ACE #31) |
| carry, strongman (Yoke) | 8 | tułów bez przechyłu bocznego ≤ 5° | ustalone (NASM, NSCA Coach 7-3, ACE #358) |
| glute_floor, hip_abd_add | 7 | miednica bez przechyłu ≤ 5° (clamshell: też bez skrętu); błąd `hab.mis.high` przechodzi z „bez animacji” do grupy „miednica” | ustalone (ACE #38, NHS) |
| mobility | 9 | skłon boczny głowy, skłon boczny tułowia, skręty, nadgarstek, krążenie barków | ustalone / konwencja |

Nadal otwarte, bo brak źródła ruchu, a nie przez silnik:
- Kettlebell Figure 8, Spell Caster;
- Isometric Neck Exercise - Sides;
- Carioca Quick Step;
- Wrist Roller;
- Plate Pinch.

## B. Partia 2 — mobility_stand (36), mobility_floor (22), foam_roll (11)

| | Ćwiczeń | Reguły pozycji ze źródłem | Tylko „poza nieruchoma” (uproszczenie) | Reguła „z nazwy” (konwencja) | Otwarte |
|---|---|---|---|---|---|
| mobility_stand | 36 | 12 (11 statycznych + Inchworm) | 6 | 13 | 5 |
| mobility_floor | 22 | 12 (w tym Cat-Cow) | 8 | 1 | 1 |
| foam_roll | 11 | — | — | 10 (rolowanie, definicja) | 1 |

Do „konwencji” zaliczam w mobility_stand 13 ćwiczeń dynamicznych (np. wymachy, krążenia), a w mobility_floor Seated Rotation Stretch.

**Odstępstwo od polecenia (z powodem).** Polecenie mówiło „dla reszty — poza nieruchoma”. Zastosowałem to tylko do **rozciągań statycznych bez źródła pozycji (14)**. Dla 21 ćwiczeń dynamicznych z mobility (wymachy, krążenia, Cat-Cow, Inchworm) i dla rolowania reguła „bezruch” byłaby sprzeczna z ruchem, a każda poprawna poza by ją łamała. Zamiast niej:
- źródło ruchu tam, gdzie je mam: Cat-Cow (ACE #15), Inchworm (ACE #254);
- regułę definicyjną „z nazwy” oznaczoną jako konwencja: wymach, krążenie, skręt, rolowanie;
- OTWARTE dla 5 ćwiczeń bez opisu: Dynamic Back Stretch, Groiners, Hip Circles (Prone), Standing Pelvic Tilt, World's Greatest Stretch.

Rozciągania statyczne (37) trafiają do `izometryczne`, więc nie podlegają bramce ruchu. Klucz `izometryczne_kandydaci` z r3 usuwam (null).

Rozciągania z regułą pozycji ze źródłem (22) i ich źródło:
- Calf Stretch — ACE #152 + NHS, ustalone:
  - Standing Gastrocnemius Calf Stretch,
  - Wall Calf Stretch.
- ACE #152 i #214 (jedno źródło — ACE):
  - Standing Soleus And Achilles Stretch.
- Szyja i tułów, ACE (jedno źródło):
  - Chin To Chest Stretch — ACE #204;
  - Overhead Triceps Stretch — ACE #174;
  - Standing Chest Stretch — ACE #209.
- Side Neck Stretch — ACE #202 + NHS, ustalone, poza@2.
- Standing Lateral Stretch — NHS + ACE #212, poza@2.
- Analogie do innego ćwiczenia ACE:
  - Standing Biceps Stretch — ACE #208;
  - Standing Elevated Quad Stretch — ACE #149;
  - Wall Lat Stretch — ACE #198 i #141.
- Rozciągania na podłodze, ACE (jedno źródło):
  - Butterfly Stretch — ACE #216;
  - Child's Pose — ACE #227;
  - IT Band and Glute Stretch — ACE #232, poza@2;
  - Kneeling Hip Flexor Stretch — ACE #142;
  - Seated Calf Stretch — ACE #214;
  - Seated Floor Hamstring Stretch — ACE #273;
  - The Straddle — ACE #210;
  - Side-Lying Quad Stretch — ACE #149;
  - Supine Hamstring Stretch — ACE #235.
- Analogie, leżąc:
  - Supine Figure-Four Stretch — ACE #148;
  - Supine Spinal Twist — ACE #229 i #232, poza@2.

**Wyszło 22 rozciągania ze źródłem pozycji, a nie ok. 30.** Większość stoi na jednym źródle (ACE, szczebel 4). Drugie, niezależne źródło dla każdego to [OTWARTE] — kandydaci: NASM static stretches, NHS, badania z opisem protokołu.

## Nowe typy reguł (definicje w `_typy`)

1. **`stopien_swobody`** `{pole, strona?, min?, max?, min_zakres?, max_zakres?, osiaga_co_najmniej?, osiaga_co_najwyzej?, min_abs?}`
   - Jeden typ obsługuje wszystkie pola klatki. Dla poza@1: `pochylenieTulowia`, `zgiecieKregoslupa`, `pochylenieGlowy` i pochodne `zgiecieSzyi`. Dla poza@2: pola z `_poza2`.
   - Na poza@1 działa od razu w dwóch regułach: Cat-Cow (`zgiecieKregoslupa`) i Chin To Chest (`zgiecieSzyi`).
2. **`punkt_zakres`** `{punkt: miednica | kolana | kostki | palce | dlonie | barki, strona?, osie, tryb: wszystkie | dowolna, min_cm}`
   - Mierzy zakres ruchu punktu w osiach. Służy do krążeń (tryb „wszystkie”) i rolowania (tryb „dowolna”).
3. **Pole `wymaga: "poza@2"`** — propozycja dla programisty: ćwiczenie z taką regułą liczy się jako „czeka na poza@2” i nie dostaje polecenia, dopóki kontrakt nie ma tych pól.

**L-036.** Żadnego z tych typów nie sprawdziłem na prawdziwej pozie: w tych rodzinach nie ma póz, a pól poza@2 jeszcze nie ma w kontrakcie. Warunek wdrożenia pozostaje ten sam: test „poza poprawna przechodzi / błąd łamie tylko swoją grupę” na pierwszej pozie każdej rodziny i na pierwszej pozie poza@2.

Ryzyka, które widzę:
- (a) `skretTulowia` w leżeniu bokiem lub na plecach (clamshell, IT Band, Spinal Twist) musi być liczony względem ciała, nie świata — inaczej fałszywe alarmy.
- (b) `zgiecieSzyi` zależy od domyślnego `pochylenieGlowy`, które wynosi 40% pochylenia tułowia. Przy tułowiu w pionie jest to 0, ale w innych pozycjach trzeba sprawdzić.

## Źródła przeczytane w tej rundzie (26.10.2026)

| # | Źródło | Szczebel | Miejsce i cytat (≤ 2 zdania) |
|---|---|---|---|
| Z39 | NHS, Flexibility exercises. https://www.nhs.uk/live-well/exercise/flexibility-exercises/ | 4 | Calf stretch: „Bend the right leg and step the left leg back at least a foot's distance, keeping it straight.”; Neck stretch: „Slowly tilt your head to the right while holding your shoulder down.” |
| Z40 | ACE #152 Standing Dorsi-Flexion Calf Stretch | 4 | Krok 2: „Increase the flexion (bend) in your LEFT (front) knee while keeping the opposite leg straightened.” |
| Z41 | ACE #142 Kneeling Hip Flexor Stretch | 4 | „place the left knee on the floor (or stretch mat) directly under the left hip” |
| Z42 | ACE #149 Side-Lying Quadriceps Stretch | 4 | „Bend your left knee and pull your left heel up towards your left glute muscle (buttock)” |
| Z43 | ACE #174 Overhead Triceps Stretch | 4 | „Bending at the elbow, let your right hand drop to the middle of your back, palm facing your back.” |
| Z44 | ACE #209 Standing Chest Stretch | 4 | Wariant: „extend your arms behind your back, clasping your hands together (or grab a towel)” |
| Z45 | ACE #214 Seated Calf Stretch | 4 | Krok 1: nogi wyprostowane „without bending your knees”, „Sit upright (i.e., trunk vertical)” |
| Z46 | ACE #216 Seated Butterfly Stretch | 4 | „Assume a seated position with your legs folded in front of you.” |
| Z47 | ACE #210 Seated Straddle Stretch | 4 | „slowly bend forward from your hips, reaching forward with your hands”; „Attempt to maintain a flat back position…” |
| Z48 | ACE #227 Child's Pose | 4 | „Keeping your hands planted, exhale and hinge at the hips, bringing your glutes to your heels.” |
| Z49 | ACE #235 Supine Hamstrings Stretch | 4 | „extend your leg slowly by contracting your quads” |
| Z50 | ACE #232 Supine IT Band Stretch | 4 | „Attempt to rotate the hips until they align vertically, or near vertically with the floor with little rotation occurring through your trunk.” |
| Z51 | ACE #273 Modified Hurdler's Stretch | 4 | Jedna noga zgięta stopą do uda; „slowly bend forward from your hips” |
| Z52 | ACE #204 Neck Flexion and Extension; ACE #202 Lateral Neck Flexion | 4 | „Slowly drop your chin toward your chest (neck flexion)”; „Slowly draw your right ear toward your right shoulder stopping when you feel the stretch.” |
| Z53 | ACE #15 Cat-Cow; ACE #254 Inchworms | 4 | „Let your stomach fall towards the floor (increasing the arch in your low back)”; „a full-push-up position where your spine, hips and head are level with the floor” |
| Z54 | ACE #198 90 Lat Stretch; ACE #141 Kneeling Lat Stretch; ACE #208 Seated Bent-Knee Biceps Stretch; ACE #148 Supine 90-90 Hip Rotator Stretch; ACE #229 Supine Spinal Twist | 4 | ręce proste, płaskie plecy (#198, #141); ręce za sobą (#208); stopa na kolanie, kolano 90° (#148); obrót przy stabilnych biodrach (#229) — używane jako analogie |
| Z55 | ACE #386 High Windmill | 4 | „Keeping the left arm straight during the movement.”; „keep the back straight while sinking back into the left hip” |
| Z56 | ACE #72 Shrug | 4 | „raise the shoulders directly upwards to the ears as high as possible…”; „DO NOT roll the shoulders.” |
| Z57 | ACE #30 Wrist Curl – Flexion; ACE #31 Wrist Supination and Pronation | 4 | „slowly allow the wrists to move into extension”; obrót z ułożenia neutralnego w stronę podłogi i sufitu, łokcie na ławce ok. 90° |
| Z58 | ACE #305 V-Twist | 4 | „Lean back at about a 45 degree angle”; „rotate the shoulders from side to side…” |
| Z59 | ACE #38 Side-Lying Hip Abduction | 4 | „The hips should remain vertical to the floor”; „the thigh can only abduct (move out sideways) to 45 degrees.” |

Adresy ACE: `https://www.acefitness.org/resources/everyone/exercise-library/<numer>/<nazwa>/`. Pełne adresy pochodzą z mapy strony ACE (sitemap-dynamic.xml, przeczytana).

Nieudane (nie są źródłem):
- NASM static gastrocnemius (404);
- Mayo Clinic slideshow (403);
- Johns Hopkins PDF (403);
- strona University of Glasgow (404).

## Otwarte pytania

1. **[OTWARTE — programista/badacz]** Zakresy stawów dla nowych stopni swobody (walidator geometrii poza@2) — osobne źródło (np. normy ROM: AAOS, przegląd systematyczny).
2. **[OTWARTE]** Drugie, niezależne źródło dla ok. 18 rozciągań, które dziś stoją na samym ACE (jedna organizacja).
3. **[OTWARTE]** Rozciągania bez źródła pozycji (14): sprawdzane jest tylko to, że poza się nie rusza (uproszczenie). Pozycję ocenia recenzent ruchu (bramka 4).
4. **[OTWARTE]** 5 ćwiczeń dynamicznych bez opisu oraz Kettlebell Figure 8, Spell Caster, Downward Facing Balance, Isometric Neck Sides, Carioca, Wrist Roller, Plate Pinch.
5. **[OTWARTE]** Zakres uniesienia barku (shrug) i zakresy pozostałych nowych stopni swobody to dziś konwencje.
6. **[OTWARTE]** Odwodzenie uda maks. 45° (ACE #38) można zamienić w regułę dopiero wtedy, gdy będzie kąt odwiedzenia biodra (`jointAngles` go nie ma).
