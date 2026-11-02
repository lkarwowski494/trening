# Wskazówki techniki — fala W1, rodzina `delt_raise` (unoszenia ramion)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`; wdrożenie robi programista po scaleniu
(dane `data/zrodla/cues.json`, teksty `lib/cues/text/pl.json` + 35 języków przez tłumacza, wpisy w rejestrze twierdzeń `scripts/claims.mjs --stub`).

Zasady: CLAUDE.md „Merytoryczne podstawy” + „Wyjątek dla wskazówek techniki” (ustawienie, przebieg, częste błędy = 2 zgodne niezależne źródła
szczebla 4; przedziały kątów — 2 zgodne źródła szczebla 4 i żadne przeczytane nie przeczy). Metoda jak w docs/research/27 i 33: wariant tego samego
ćwiczenia (inny sprzęt, jedna/dwie ręce) liczy się z opisem „(wariant: …)”; inne ćwiczenie = analogia, nie liczy się; bez twierdzeń o zdrowiu.
Wszystkie źródła przeczytane przez WebFetch 02.11.2026 (PDF HSS — odczyt stron 1–3 pliku). Gdzie narzędzie zwróciło parafrazę — „(parafraza)”.

Lista ćwiczeń: `familyOf` w `lib/figures/v2/families.ts:119` → 38 ćwiczeń (lista w `docs/51-figury-v2-pokrycie.md:142`). Pominięte, bo mają
własne wskazówki w `data/zrodla/cues.json`: Lateral Raise (hantle), Cable Lateral Raise, Front Raise, Reverse Fly (hantle), Reverse Pec Deck.
Upright Row (hantle) ma w `cues.json:8895` wpis „otwarte” — nie ruszam go, rodzina upright row niżej jako otwarta.

Dostęp: ExRx.net nadal 403 (sprawdzone 02.11.2026, `CBSeatedLateralRaise`); strony aplikacji i sklepów z wyników wyszukiwania pominięte (szczebel < 4).

## 1. Ćwiczenia — stan

| Klucz | Stan | Powód / uwagi |
|---|---|---|
| Alternating Deltoid Raise | gotowe | ustalenia ACG-010 (`docs/research/acg-010-015-technika-2026-10-31.md`, ZB-030) przeniesione 1:1, źródła odczytane ponownie; bez dublowania |
| One-Arm Lateral Raise (hantel) | gotowe | fedb + HSS (ta sama jednorącz) + ACE 26/354 (warianty) |
| Front Plate Raise | gotowe | fedb + Catalyst 803 (wariant: sztanga) |
| Single Dumbbell Front Raise | gotowe | fedb + Catalyst 803 (wariant: sztanga) |
| Cable Front Raise | gotowe | Catalyst 812 + fedb „Front Cable Raise” |
| Dumbbell Lying One-Arm Rear Lateral Raise | gotowe | fedb + HSS „Prone horizontal abduction” + ACE 34 (wariant: dwie ręce) |
| Dumbbell Scaption | gotowe | fedb + HSS „full-can” + ACE „Dumbbell V-Raise” |
| Cable Reverse Fly | gotowe | fedb „Cable Rear Delt Fly” + ACE 353; różnica w wysokości bloczków — pominięta w tekście |
| Upright Row (sztanga), Upright Row (linki), Band Upright Row, Dumbbell One-Arm Upright Row, Smith Machine Upright Row, Smith Machine One-Arm Upright Row | otwarte | czeka na rozstrzygnięcie Upright Row (hantle) (`cues.json:8895`, docs/research/33 pyt. 2–3); dodatkowo sprzeczność: Catalyst 805/814 „dłonie razem, łokcie jak najwyżej” vs dotychczasowe `urow.*` (chwyt, unoszenie do obojczyków) — wymaga części wspólnej po uznaniu źródeł |
| Machine Lateral Raise | otwarte | ACE 295 + Western SRS (szczebel 4 dopiero PROPOZYCJA w docs/33, organizacji brak w `orgs`) — gotowe po uznaniu Western SRS (zestaw w sekcji 5) |
| One-Arm Cable Rear Lateral Raise | otwarte | ustawienie przy wyciągu tylko w fedb „Bent Over Low-Pulley Side Lateral”; ruch z Catalyst 870 to hantle oburącz — brak 2. źródła dla ustawienia |
| Cable Seated Lateral Raise | otwarte | tylko fedb (ExRx 403) |
| Band Lateral Raise | otwarte | ustawienie (stopy na taśmie) tylko fedb „Lateral Raise - With Bands”; drugiego źródła nie szukano do końca (limit kontekstu) |
| One-Arm Incline Lateral Raise | otwarte | tylko fedb (leżenie bokiem na ławce skośnej) |
| Front Incline Dumbbell Raise, Straight Raises on Incline Bench | otwarte | nie badane w tej sesji (limit kontekstu) |
| Barbell Front Raise to Overhead, Dumbbell Front Raise to Overhead | otwarte | nie badane (w fedb są; drugie źródło nieznalezione) |
| Barbell / Dumbbell / Smith Incline Shoulder Raise | otwarte | nie badane |
| Y Raise (hantle), Cable Y Raise | otwarte | przeczytane tylko HSS „Prone scaption (Y’s)” (jedna ręka, leżąc, materiał rehabilitacyjny); brak 2. źródła |
| Sled Reverse Flye | otwarte | tylko fedb |
| Car Drivers, Kettlebell Halo, Kettlebell Halo with Overhead Extension | otwarte | nie badane |

Razem: **8 gotowych, 30 otwartych** (w tym 6 wariantów upright row zależnych od jednej decyzji).

## 2. Blok JSON do `data/zrodla/cues.json` (tylko gotowe)

Wstawić do sekcji ćwiczeń; nowe źródła i organizacje — sekcja 4. `Alternating Deltoid Raise` bez `setup` celowo (ACG-010: start „przy udach”
w fedb vs „przed udami, dłonie do tyłu” w Catalyst; `lat.setup` mówi „łokcie lekko ugięte”, Catalyst — proste ręce).

```json
{
  "Alternating Deltoid Raise": {
    "setup": [],
    "move": [
      {"c": "adr.move", "s": [["fedb-Alternating_Deltoid_Raise", "instructions[1]; instructions[3]"], ["catalyst-822", "opis (next rep out to the sides; alternating)"]]}
    ],
    "tips": [
      {"c": "front.elbows", "s": [["fedb-Alternating_Deltoid_Raise", "instructions[1] (elbows slightly bent)"], ["catalyst-822", "opis (straight arms)"]]},
      {"c": "lat.height", "s": [["fedb-Alternating_Deltoid_Raise", "instructions[1]; instructions[3] (shoulder height)"], ["catalyst-822", "opis (above shoulder height)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["fedb-Alternating_Deltoid_Raise", "instructions[1] (avoid swinging or cheating)"], ["catalyst-822", "opis (trunk braced tightly; lower under control)"]]}
    ]
  },
  "One-Arm Lateral Raise (hantel)": {
    "setup": [
      {"c": "lat1.setup", "s": [["fedb-One-Arm_Side_Laterals", "instructions[1]; instructions[2] (parafraza: dumbbell at side, slight elbow bend)"], ["hss-sutton-shoulder", "s. 1, Lateral Raises (arm at your side with the elbow straight)"], ["ace-26", "Step 1 (wariant: dwie ręce; elbows extended or holding a slight bend)"]]}
    ],
    "move": [
      {"c": "lat1.move", "s": [["fedb-One-Arm_Side_Laterals", "instructions[2]; instructions[3] (parafraza: level with the floor; lower slowly)"], ["hss-sutton-shoulder", "s. 1, Lateral Raises (until the hands reach shoulder level; slowly lower)"], ["ace-354", "opis (wariant: wyciąg; parallel to the floor, slowly lower)"]]}
    ],
    "tips": [
      {"c": "rear.elbows", "s": [["fedb-One-Arm_Side_Laterals", "instructions[2] (slight bend)"], ["hss-sutton-shoulder", "s. 1, Lateral Raises (raise the arm straight)"], ["ace-26", "Step 1; Step 4 (wariant: dwie ręce; keeping your elbows slightly extended)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["fedb-One-Arm_Side_Laterals", "instructions[2]; instructions[3] (torso still; lower slowly)"], ["hss-sutton-shoulder", "s. 1, Lateral Raises (pause and slowly lower)"]]}
    ]
  },
  "Front Plate Raise": {
    "setup": [
      {"c": "front2.setup", "s": [["fedb-Front_Plate_Raise", "instructions[0] (parafraza)"], ["catalyst-803", "opis (wariant: sztanga; hanging at arms' length)"]]}
    ],
    "move": [
      {"c": "front.move", "s": [["fedb-Front_Plate_Raise", "instructions[1]; instructions[2]"], ["catalyst-803", "opis"]]}
    ],
    "tips": [
      {"c": "front.elbows", "s": [["fedb-Front_Plate_Raise", "instructions[0]; instructions[1] (slight bend; no bending of elbows)"], ["catalyst-803", "opis (straight arms)"]]},
      {"c": "lat.height", "s": [["fedb-Front_Plate_Raise", "instructions[1] (just above shoulder height)"], ["catalyst-803", "opis (just above shoulder height)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["fedb-Front_Plate_Raise", "instructions[1] (no swinging, torso still)"], ["catalyst-803", "opis (trunk braced tightly; lower under control)"]]}
    ]
  },
  "Single Dumbbell Front Raise": {
    "setup": [
      {"c": "front2.setup", "s": [["fedb-Single_Dumbbell_Raise", "instructions[0] (parafraza: one dumbbell, both hands, arms straight)"], ["catalyst-803", "opis (wariant: sztanga)"]]}
    ],
    "move": [
      {"c": "front.move", "s": [["fedb-Single_Dumbbell_Raise", "instructions[1]; instructions[2]"], ["catalyst-803", "opis"]]}
    ],
    "tips": [
      {"c": "front.elbows", "s": [["fedb-Single_Dumbbell_Raise", "instructions[1] (arms straight)"], ["catalyst-803", "opis (straight arms)"]]},
      {"c": "lat.height", "s": [["fedb-Single_Dumbbell_Raise", "instructions[1] (above shoulder level)"], ["catalyst-803", "opis (just above shoulder height)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["fedb-Single_Dumbbell_Raise", "instructions[1] (torso and hips stationary)"], ["catalyst-803", "opis (trunk braced tightly; lower under control)"]]}
    ]
  },
  "Cable Front Raise": {
    "setup": [
      {"c": "cfr.setup", "s": [["catalyst-812", "opis (straight handle, low cable)"], ["fedb-Front_Cable_Raise", "instructions[0]; instructions[1] (wariant: jednorącz; handle in front of thigh)"]]}
    ],
    "move": [
      {"c": "front.move", "s": [["catalyst-812", "opis"], ["fedb-Front_Cable_Raise", "instructions[2]; instructions[3]"]]}
    ],
    "tips": [
      {"c": "front.elbows", "s": [["catalyst-812", "opis (straight arms)"], ["fedb-Front_Cable_Raise", "instructions[2] (slight bend)"]]},
      {"c": "lat.height", "s": [["catalyst-812", "opis (above shoulder height)"], ["fedb-Front_Cable_Raise", "instructions[2] (just above parallel)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["catalyst-812", "opis (trunk braced tightly; lower under control)"], ["fedb-Front_Cable_Raise", "instructions[2]; instructions[3] (torso still; lower slowly)"]]}
    ]
  },
  "Dumbbell Lying One-Arm Rear Lateral Raise": {
    "setup": [
      {"c": "rear1.setup", "s": [["fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise", "instructions[0]; instructions[1] (parafraza)"], ["hss-sutton-shoulder", "s. 3, Prone horizontal abduction (lie face down… arm hanging freely; elbows straight)"]]}
    ],
    "move": [
      {"c": "rear1.move", "s": [["fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise", "instructions[2]; instructions[3] (perpendicular to torso; lower slowly)"], ["hss-sutton-shoulder", "s. 3, Prone horizontal abduction (to shoulder height; limit to horizontal; slowly lower)"], ["ace-34", "Step 2; Step 3 (wariant: dwie ręce)"]]}
    ],
    "tips": [
      {"c": "rear.elbows", "s": [["fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise", "instructions[1]; instructions[2] (slight bend, arm kept extended)"], ["hss-sutton-shoulder", "s. 3 (keeping the elbows straight)"], ["ace-34", "Step 1 (wariant: dwie ręce; elbows slightly flexed)"]]}
    ],
    "mistakes": []
  },
  "Dumbbell Scaption": {
    "setup": [
      {"c": "scap.setup", "s": [["fedb-Dumbbell_Scaption", "instructions[0] (at your sides, thumbs up)"], ["hss-sutton-shoulder", "s. 1, Standing forward flexion (‘full-can’) (thumbs face forward)"], ["ace-cert-8951", "Dumbbell V-Raise (arms straight, weights on thighs)"]]}
    ],
    "move": [
      {"c": "scap.move", "s": [["fedb-Dumbbell_Scaption", "instructions[1]; instructions[2] (~30°, until level with the floor)"], ["hss-sutton-shoulder", "s. 1, full-can (forward and upward to shoulder level, outward angle 30°)"], ["ace-cert-8951", "Dumbbell V-Raise (shoulder height, 30° to the front; wariant: na zmianę rękami)"]]}
    ],
    "tips": [
      {"c": "sapd.arms", "s": [["fedb-Dumbbell_Scaption", "instructions[1] (arms straight)"], ["hss-sutton-shoulder", "s. 1, full-can (keeping the elbows straight)"], ["ace-cert-8951", "Dumbbell V-Raise (arms straight)"]]}
    ],
    "mistakes": []
  },
  "Cable Reverse Fly": {
    "setup": [
      {"c": "crf.setup", "s": [["ace-353", "opis (pulleys on either side; left hand grabs the right handle)"], ["fedb-Cable_Rear_Delt_Fly", "instructions[1] (cross the handles)"]]}
    ],
    "move": [
      {"c": "crf.move", "s": [["ace-353", "opis (spread both arms apart until in a straight line; return)"], ["fedb-Cable_Rear_Delt_Fly", "instructions[2]; instructions[3] (rearward and outward, elbows extended; return)"]]}
    ],
    "tips": [
      {"c": "crf.pause", "s": [["ace-353", "opis (pause before slowly returning)"], ["fedb-Cable_Rear_Delt_Fly", "instructions[3] (hold briefly)"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do `sapd.arms` („Ręce proste przez cały ruch — nie zginaj łokci.”): zdanie istnieje (prostowanie rąk na wyciągu), brzmienie pasuje do scaption bez zmian.
Uwaga do `rear.elbows` przy jednorącz: „Kąt w łokciach” (liczba mnoga) — dopuszczalne, ale programista/recenzent lokalizacji może woleć osobne zdanie;
wtedy nowe `rear1.elbow`: „Kąt w łokciu stały przez cały ruch.” (te same źródła).

## 3. Nowe zdania (PL + proponowane EN)

Istniejące użyte: `front.move`, `front.elbows`, `lat.height`, `rear.elbows`, `sapd.arms`, `mis.jerk`. Nowe tylko tam, gdzie istniejące
mają złą liczbę (jedna ręka), zły sprzęt albo inny ruch.

| Id | PL | EN (propozycja dla tłumacza) | Źródła |
|---|---|---|---|
| `adr.move` | Na zmianę: jedno powtórzenie unieś oba hantle przed sobą, następne — bokiem. | Alternate: raise both dumbbells to the front on one rep, out to the sides on the next. | fedb-Alternating_Deltoid_Raise; catalyst-822 (zdanie z ACG-010, nie dubluję) |
| `lat1.setup` | Stań prosto z hantlem w jednej ręce przy udzie, łokieć prosty lub lekko ugięty. | Stand tall with a dumbbell in one hand at your thigh, elbow straight or slightly bent. | fedb-One-Arm_Side_Laterals; hss-sutton-shoulder; ace-26 (wariant) |
| `lat1.move` | Unieś rękę bokiem mniej więcej do wysokości barku, potem opuść ją powoli. | Raise your arm out to the side to about shoulder height, then lower it slowly. | fedb-One-Arm_Side_Laterals; hss-sutton-shoulder; ace-354 (wariant) |
| `front2.setup` | Stań prosto i trzymaj ciężar oburącz przed sobą na opuszczonych rękach, łokcie proste lub lekko ugięte. | Stand tall holding the weight with both hands in front of you, arms hanging down, elbows straight or slightly bent. | fedb-Front_Plate_Raise; fedb-Single_Dumbbell_Raise; catalyst-803 (wariant) |
| `cfr.setup` | Chwyć uchwyt dolnego wyciągu i stań prosto — uchwyt przed udami, ręce opuszczone. | Grab the low-cable handle and stand tall — handle in front of your thighs, arms hanging down. | catalyst-812; fedb-Front_Cable_Raise |
| `rear1.setup` | Połóż się przodem na ławce; hantel w jednej ręce zwisa swobodnie, łokieć prosty lub lekko ugięty. | Lie face down on a bench; the dumbbell hangs freely in one hand, elbow straight or slightly bent. | fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise; hss-sutton-shoulder |
| `rear1.move` | Unieś rękę bokiem do wysokości barku, prostopadle do tułowia; opuść ją powoli. | Raise your arm out to the side to shoulder height, square to your body; lower it slowly. | fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise; hss-sutton-shoulder; ace-34 (wariant) |
| `scap.setup` | Stań prosto z hantlami przy udach, ręce proste, kciuki skierowane w przód. | Stand tall with the dumbbells at your thighs, arms straight, thumbs pointing forward. | fedb-Dumbbell_Scaption; hss-sutton-shoulder; ace-cert-8951 |
| `scap.move` | Unieś ręce w przód i lekko na zewnątrz — mniej więcej 30° od linii przodu — do wysokości barków, potem je opuść. | Raise your arms forward and slightly out — about 30° from straight ahead — to shoulder height, then lower them. | fedb-Dumbbell_Scaption; hss-sutton-shoulder; ace-cert-8951 (kąt 30° we wszystkich trzech; przedział kątów techniki — 2+ zgodne, żadne przeczytane nie przeczy) |
| `crf.setup` | Stań między dwoma wyciągami i chwyć uchwyty na krzyż: lewą ręką ten z prawej, prawą — ten z lewej. | Stand between two cable stacks and cross your arms to grab the handles: left hand takes the right one, right hand the left. | ace-353; fedb-Cable_Rear_Delt_Fly |
| `crf.move` | Rozciągnij ręce szeroko na boki, aż utworzą prostą linię, potem wróć do skrzyżowania. | Spread your arms wide until they form a straight line, then bring them back to the crossed position. | ace-353; fedb-Cable_Rear_Delt_Fly |
| `crf.pause` | Na końcu ruchu zatrzymaj się na chwilę. | Pause briefly at the end of the movement. | ace-353; fedb-Cable_Rear_Delt_Fly |

Każde nowe zdanie: 35 języków (tłumacz) + wpis w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`, potem `--rehash`).
Teksty bez nazw źródeł (zasada „źródła publicznie anonimowo”); ton — jak trener na siłowni.

Różnice pominięte w tekstach (część wspólna): wysokość unoszenia — fedb/ACE/HSS „do barków”, Catalyst „nieco powyżej” → „mniej więcej do wysokości
barków”; łokcie — Catalyst „proste”, fedb „lekko ugięte”, ACE „proste albo lekko ugięte” → „proste lub lekko ugięte”; Cable Reverse Fly —
wysokość bloczków ACE 353 „na wysokości barków lub nieco niżej”, fedb „powyżej głowy” → w tekście bez wysokości.

## 4. Źródła i organizacje (propozycja wpisów)

Nowe organizacje do `orgs`:

| Skrót (org) | Nazwa | Szczebel | kind | Uwagi |
|---|---|---|---|---|
| free-exercise-db | Otwarty katalog ćwiczeń (repozytorium yuhonas/free-exercise-db, GitHub) | 4 | site | użyty już w ACG-010 jako szczebel 4; to źródło nazw i opisów naszego katalogu (pole `fedb`) — zawsze liczony jako JEDNO źródło, drugie musi być niezależne. Uznanie szczebla — patrz „otwarte” 1 |
| Catalyst Athletics | Catalyst Athletics — Exercise Library (catalystathletics.com) | 4 | site | serwis szkoleniowy podnoszenia ciężarów; użyty w ACG-010 |
| HSS | (istnieje) — tu: K. M. Sutton, MD, „Shoulder Rotator Cuff and Scapular Strengthening Program” (PDF, hss.edu) | 4 | site | materiał rehabilitacyjny — użyty tylko opis wykonania, bez twierdzeń o zdrowiu (jak Hasani i in. w docs/33) |

Nowe źródła do `sources`:

| Id | Org | Tytuł / miejsce | URL |
|---|---|---|---|
| fedb-Alternating_Deltoid_Raise | free-exercise-db | Alternating Deltoid Raise, `instructions` | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Deltoid_Raise.json |
| fedb-One-Arm_Side_Laterals | free-exercise-db | One-Arm Side Laterals | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Side_Laterals.json |
| fedb-Front_Plate_Raise | free-exercise-db | Front Plate Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plate_Raise.json |
| fedb-Single_Dumbbell_Raise | free-exercise-db | Single Dumbbell Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Dumbbell_Raise.json |
| fedb-Front_Cable_Raise | free-exercise-db | Front Cable Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Cable_Raise.json |
| fedb-Dumbbell_Lying_One-Arm_Rear_Lateral_Raise | free-exercise-db | Dumbbell Lying One-Arm Rear Lateral Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_One-Arm_Rear_Lateral_Raise.json |
| fedb-Dumbbell_Scaption | free-exercise-db | Dumbbell Scaption | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Scaption.json |
| fedb-Cable_Rear_Delt_Fly | free-exercise-db | Cable Rear Delt Fly | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly.json |
| catalyst-822 | Catalyst Athletics | Dumbbell Front Side Raise (#822) | https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/ |
| catalyst-803 | Catalyst Athletics | Barbell Front Raise (#803) | https://catalystathletics.com/exercise/803/Barbell-Front-Raise/ |
| catalyst-812 | Catalyst Athletics | Cable Front Raise (#812) | https://catalystathletics.com/exercise/812/Cable-Front-Raise/ |
| ace-354 | ACE | Single-Arm Lateral Raise (#354, wyciąg) | https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/ |
| ace-cert-8951 | ACE | „A Pro’s Guide to Muscle Mechanics: The Shoulders”, ACE Certified, wrzesień 2025 — tabela ćwiczeń, „Dumbbell V-Raise” | https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/ |
| hss-sutton-shoulder | HSS | K. M. Sutton, MD, Shoulder Rotator Cuff and Scapular Strengthening Program — s. 1 Lateral Raises, Standing forward flexion (‘full-can’); s. 3 Prone horizontal abduction (‘T’s’), Prone scaption (‘Y’s’) | https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf |

Istniejące (bez zmian, przeczytane ponownie 02.11.2026): `ace-26` (Lateral Raise, Steps 1–4), `ace-34` (Incline Reverse Fly, Steps 1–3), `ace-353` (Reverse Fly, wyciąg).

Cytaty do weryfikacji (≤ 1 zdanie na źródło):
- catalyst-812: „Keeping the trunk braced tightly, lift the handle up with straight arms to above shoulder height” (opis).
- catalyst-803: „Stand with a barbell hanging at arms’ length with an approximately shoulder-width grip.” (opis).
- ace-353: „Place two cable pulleys at about shoulder-height (or slightly below).” (krok 1).
- hss-sutton-shoulder, s. 1 Lateral Raises: „Do not raise the hands higher than the shoulder.”
- hss-sutton-shoulder, s. 1 full-can: „…raise the arms forward and upward to shoulder level with a slight outward angle (30°).”
- ace-cert-8951, Dumbbell V-Raise: „…raise the right arm up to shoulder height in a 30-degree angle to the front of the body.” (z odczytu przez narzędzie; parafraza możliwa — sprawdzić przy rehash).
- fedb-*: narzędzie zwróciło parafrazy `instructions[i]` (limit cytatu) — miejsca podane indeksem.

## 5. Otwarte

1. **[OTWARTE] Szczebel free-exercise-db i Catalyst Athletics.** Oba przyjęte jako szczebel 4 w ACG-010 (31.10.2026), ale nie ma ich jeszcze w `orgs`
   `cues.json`. Bez uznania przez audytora 7 z 8 „gotowych” spada do jednego źródła (wyjątek: Dumbbell Scaption ma też HSS + ACE; Lying One-Arm Rear — HSS + ACE 34 wariant).
   Zależność: free-exercise-db to pochodzenie naszego katalogu — nie wolno go liczyć dwa razy.
2. **[OTWARTE] HSS PDF (program rehabilitacyjny chirurga)** — czy materiał rehabilitacyjny wystarcza jako źródło przebiegu ruchu dla treningu (wzór: Hasani i in. w docs/33).
3. **[OTWARTE] Upright row (6 wariantów + hantle)** — decyzja z docs/33 pyt. 2–3 (WebMD Ignite, przedruk NSCA ETM) i sprzeczność z Catalyst 805/814 (dłonie razem,
   łokcie „jak najwyżej”, unoszenie barków razem z ruchem) wobec `urow.*` (do obojczyków). Na tym samym szczeblu — trzeba ustalić część wspólną;
   do tego ACE (artykuły) zaleca zastąpić to ćwiczenie unoszeniem bokiem — nie przenosić do aplikacji jako twierdzenia o zdrowiu.
4. **[OTWARTE] Machine Lateral Raise** — proponowany zestaw po uznaniu Western SRS: ustawienie „Ustaw siedzisko tak, by wałki/poduszki opierały się tuż nad łokciami;
   łokcie zgięte mniej więcej pod kątem prostym” (ACE 295: pads „just above the elbows”, elbows „bent at 90 degrees”; Western SRS Shoulders: „Adjust seat height to align the pads with your bent arms”, łokcie ok. 90°), ruch „Unoś ramiona bokiem, prowadząc ruch łokciami” (oba). Bez uznania Western — jedno źródło.
5. **[OTWARTE] One-Arm Cable Rear Lateral Raise, Cable Seated Lateral Raise, Band Lateral Raise, One-Arm Incline Lateral Raise, Sled Reverse Flye** — po jednym źródle (fedb).
6. **[OTWARTE] Nie badane** (limit kontekstu): Front Incline Dumbbell Raise, Straight Raises on Incline Bench, Barbell/Dumbbell Front Raise to Overhead,
   Barbell/Dumbbell/Smith Incline Shoulder Raise, Car Drivers, Kettlebell Halo (oba), Y Raise (hantle), Cable Y Raise (HSS „Y’s” jako pierwsze źródło dla Y Raise (hantle)).
7. **[OTWARTE] Liczba mnoga w `rear.elbows`** przy ćwiczeniach jednorącz — decyzja recenzenta lokalizacji (sekcja 2, uwaga).

## Stan (przekazanie)

- Zrobione: lista 38 ćwiczeń; 8 gotowych z blokiem JSON, 12 nowych zdań (1 z ACG-010), 14 nowych źródeł, 2 nowe organizacje; reszta oznaczona z powodem.
- Zostało (następny agent): pkt 6 „nie badane” — zacząć od Front Raise to Overhead (fedb + szukać Catalyst/ACE), Incline Shoulder Raise (fedb ×3 + 2. źródło), Kettlebell Halo; potem pkt 5 (drugie źródła dla wyciągu/taśmy).
- Pułapki: ExRx 403 (bez Wayback); free-exercise-db zwraca tylko parafrazy przez WebFetch (cytować indeks `instructions[i]`); PDF HSS czytać przez Read z `pages` (WebFetch nie wyciąga tekstu); Catalyst często „nieco powyżej barków” i „proste ręce” — brać część wspólną; lista Catalyst: https://catalystathletics.com/exercises/section/17/Accessory-Upper-Body/ (brak Y raise, scaption, plate raise, halo).
