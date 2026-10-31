# Lista per ćwiczenie — partia 4: rodziny `planned` (4A: core_floor, delt_raise, curl @ fbd00673; 4B: mobility_stand, triceps, pushup_plank @ 433289f7 — kod jak w 4A, `integracja-1-1` 1c683be3)

Metoda (audytor niezależny, 31.10.2026): walidacja v2 (`waliduj` z `scripts/figures/v2-validate.mjs`: schemat, geometria, sens, jakość) na każdym wpisie `lib/figures/v2/poses/<rodzina>.json`; `jakosc-raport.mjs --json --styk-wszystkie` (0 naruszeń w 3 rodzinach); pomiary `keyframeFrame` (`contract.ts`) co u = 0,05: kąty stawów (`jointAngles`), stopy (pięta/palce y), najniższe kształty ciała (`dataShapes`, rzut z boku), położenie kolan, chwytów i ciężaru, oś lędźwi, skręt/skłon tułowia; arkusze PNG (rzut z boku, u = 0 / 0,5 / 1; PIL, poza repo) dla wszystkich figur core_floor. Karta: własna (`lib/cues/data.json`) albo zestaw ogólny (`lib/figures/v2/cue-sets.json`, tekst PL). Rodziny są dziś niewidoczne (status `planned`, `poseData.ts` ładuje tylko pull_up), zestawy ogólne pokazują się tylko przy pokazywanej figurze v2 — wszystko poniżej dotyczy 1.1 po włączeniu rodziny.

Kolumny: Ruch „ok” = walidacja bez błędów i pomiary bez wady; „bez figury” = ćwiczenie rodziny bez wpisu w pliku póz (zestaw ogólny nigdy niewidoczny, ocena dopasowania tylko po nazwie). Zestaw pasuje: tak / tak* (zdanie nie dotyczy rysunku, ale mu nie przeczy) / nie.

## core_floor — 44 ćwiczenia, 21 z danymi (karty własne 4, zestawy 32, brak 8)

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternate Heel Touchers | tak | ok (skłon boczny ±16°, lędźwie ≤ 0 cm nad podłogą) | general crunch | tak* | `crunch.neck` — dłonie przy piętach, nie przy głowie |
| Bicycle Crunch | tak | ok w walidacji; pokazana jedna strona, prawa stopa stale na podłodze, skręt tułowia 0° | general crunch | tak* | OP-4; `crunch.neck` — dłonie nie przy głowie (łokcie na podłodze, przedramiona pionowo) |
| Bird Dog | tak | ok (dłoń pod barkiem x 60/59,9; ręka i noga do poziomu: ramię 0°, noga 178,5°) | own (v1 aktualna) | — | jedna strona (jak v1 zrecenzowana) |
| Butt-Ups | nie | bez figury | none (open) | — | — |
| Cable Crunch | nie | bez figury | general cableCrunch | tak | — |
| Cable Reverse Crunch | nie | bez figury | general legRaiseFloor | tak | — |
| Cable Seated Crunch | nie | bez figury | general cableCrunch | tak | — |
| Cocoons | tak | ok | none (open) | — | figura bez wskazówek |
| Cross-Body Crunch | tak | ok w walidacji; skręt tułowia 0° (dłoń przesuwa się do środka o 22 cm) | general crunch | tak | OP-4 |
| Crunch | tak | **wada**: kolana opadłe na boki (kolano y 14 cm, z 48 cm), dłonie przy biodrach | own | **nie** (rysunek przeczy karcie) | **ACG-008, ACG-009** |
| Crunch - Hands Overhead | tak | ok (kolano y 45) | general crunch | tak | — |
| Crunch - Legs On Exercise Ball | nie | bez figury | general crunch | tak | — |
| Dead Bug | tak | ok (biodro 88,9°, kolano 89,8°, ramię 90° → 159°; stopa min 3,6 cm, dłoń min 31 cm nad podłogą) | own (v1 aktualna) | — | jedna strona |
| Decline Crunch | nie | bez figury | general crunch | tak* | `crunch.lowBack` „na podłodze” przy ławce skośnej (teoretyczny — zestaw bez figury niewidoczny) |
| Decline Oblique Crunch | nie | bez figury | general crunch | tak* | jw. |
| Decline Reverse Crunch | nie | bez figury | general legRaiseFloor | tak | — |
| Dragon Flag | nie | bez figury | none | — | — |
| Frog Sit-Ups | tak | ok (kolana na boki celowo: `odchylenieKolana` 50) | general crunch | tak* | stopy pionowo, palce 26 cm nad podłogą — bez źródła, nie zgłaszam; `crunch.neck` — dłonie nie przy głowie |
| GHD Sit Up | nie | bez figury | none | — | — |
| Hollow Hold | tak | ok, poza statyczna (2 identyczne klatki) | general plank | tak | nie ma na liście `ISOMETRIC` (`poseData.ts`), katalog: pomiar czasu — strażnik `tests/figures-v2-data.test.tsx:53` złapie przy włączeniu |
| Janda Sit-Up | tak | **wada**: kolana opadłe na boki (y 14 → 25, z 48) | general crunch | tak* | **ACG-009** |
| Kneeling Cable Crunch With Alternating Oblique Twists | nie | bez figury | general cableCrunch | tak | — |
| Leg Pull-In | tak | ok (miednica unosi się 9,5 → 21,5) | general legRaiseFloor | tak | — |
| Lying Leg Raise | tak | ok (biodro 17 → 87°, miednica stała) | general legRaiseFloor | tak | — |
| Machine Crunch | nie | bez figury | general cableCrunch | tak | — |
| Oblique Crunches - On The Floor | tak | **wada**: kolana opadłe na boki; skręt i skłon tułowia 0° | general crunch | tak* | **ACG-009**, OP-4 |
| Otis-Up | nie | bez figury | general crunch | tak* | — |
| Press Sit-Up | nie | bez figury | none | — | — |
| Reverse Crunch | tak | ok (miednica 9,5 → 20,5, lędźwie od podłoża) | own | — | — |
| Scissor Kick | tak | ok w walidacji; kolana zgięte 47–54° przez cały ruch, nogi naprzemiennie | general legRaiseFloor | tak | OP-5 |
| Seated Flat Bench Leg Pull-In | nie | bez figury | general legRaiseFloor | tak | — |
| Side Jackknife | nie | bez figury | none | — | — |
| Sit Up | tak | **wada**: kolana opadłe na boki (y 14 → 25, z 48) | general crunch | tak* | **ACG-009** |
| Smith Machine Hip Raise | nie | bez figury | none | — | — |
| Stability Ball Crunch | nie | bez figury | general crunch | tak | — |
| Stability Ball Knee Tuck | nie | bez figury | general plank | tak | — |
| Standing Rope Crunch | nie | bez figury | general cableCrunch | tak | — |
| Stomach Vacuum | nie | bez figury | none | — | — |
| Superman | tak | ok (miednica stała y 9,5, biodro −16,7°, ręce 170°) | general cobra | tak | — |
| Suspended Reverse Crunch | nie | bez figury | general plank | tak | — |
| Toe Touchers | tak | ok (nogi w górze, stopy 70–74 cm) | general crunch | tak | — |
| Tuck Crunch | tak | ok | general crunch | tak* | ręce skrzyżowane, `crunch.neck` nie dotyczy |
| V-Up | tak | ok | general vup | tak | — |
| Weighted Sit-Ups - With Bands | nie | bez figury | general crunch | tak | — |

## delt_raise — 38 ćwiczeń, 30 z danymi (karty własne 5, zestawy 29, brak 4)

Pomiary w pozycji górnej (strona pracująca): dłoń − bark (y), łokieć − dłoń (y), kąt łokcia w ruchu; tułów, miednica i stopy stałe we wszystkich stojących (stopy y = 0, tułów 0° albo stały skłon), siedzące — styk siedziska i oparcia. Arkusze: przód (7) i bok (7).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternating Deltoid Raise | tak | rysunek = unoszenie przodem jedną ręką (dane jak Front Raise, lewa ręka w dół), łokieć 8,1 cm pod dłonią | general raiseSide | **nie** | **ACG-010** |
| Band Lateral Raise | tak | ok (dłoń 9,6 cm pod barkiem, łokieć 8,6 cm nad dłonią, łokieć 6,5–15,7°) | general raiseSide | tak | — |
| Band Upright Row | tak | ok (łokieć 9,4 cm nad dłonią, 4,1 cm pod barkiem) | general uprightRow | tak | — |
| Barbell Front Raise to Overhead | tak | ok (ramię do 167°, łokieć 24,9–28,6°, tułów 0°) | general raiseFront | tak | — |
| Barbell Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Cable Front Raise | tak | ok (jedna ręka, dłoń 8 cm nad barkiem) | general raiseFront | tak | — |
| Cable Lateral Raise | tak | ok | own | — | — |
| Cable Reverse Fly | tak | ok (ramiona na wysokości barków 89,5–92°, koniec: dłoń 11 cm za linią barków) | general raiseRear | tak | — |
| Cable Seated Lateral Raise | tak | ok (siedzisko i oparcie) | general raiseSide | tak | — |
| Cable Y Raise | tak | ok (ramię do 152°, łokieć stały 13,7–18,5°) | general raise | tak | — |
| Car Drivers | tak | ok w walidacji; obrót talerza tylko w jedną stronę | general raiseFront | tak* | **ACG-011**; `lat.height` — talerz cały czas na wysokości barków, nic nie jest unoszone |
| Dumbbell Front Raise to Overhead | tak | ok | general raiseFront | tak | — |
| Dumbbell Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Dumbbell Lying One-Arm Rear Lateral Raise | nie | bez figury | general raiseRear | tak | — |
| Dumbbell One-Arm Upright Row | tak | ok | general uprightRow | tak | — |
| Dumbbell Scaption | tak | ok (dłoń 39 cm przed barkiem — płaszczyzna łopatki, łokieć 4,6 cm nad dłonią) | general raiseSide | tak | — |
| Front Incline Dumbbell Raise | tak | ok (oparcie 30°, styk pleców i głowy) | general raiseFront | tak | — |
| Front Plate Raise | tak | ok (łokieć 28,4–31,1°) | general raiseFront | tak | — |
| Front Raise | tak | ok (obie ręce, dłoń 8 cm nad barkiem) | own | — | — |
| Kettlebell Halo | nie | bez figury | general halo | tak | — |
| Kettlebell Halo with Overhead Extension | nie | bez figury | general halo | tak | — |
| Lateral Raise (hantle) | tak | ok | own | — | — |
| Machine Lateral Raise | tak | ok | general raiseSide | tak | — |
| One-Arm Cable Rear Lateral Raise | tak | ok (tułów 68° od pionu, dłoń na linii barków, odwiedzenie 88°) | general raiseRear | tak | — |
| One-Arm Incline Lateral Raise | nie | bez figury | general raiseSide | tak | — |
| One-Arm Lateral Raise (hantel) | tak | ok | general raiseSide | tak | — |
| Reverse Fly (hantle) | tak | ok (tułów 68° od pionu — „prawie poziomo”, dłoń 2,2 cm pod barkiem, ramię prostopadle) | own | — | — |
| Reverse Pec Deck | tak | ok (łokcie na wysokości barków, koniec: łokieć 13 cm za stawem barkowym) | own | — | — |
| Single Dumbbell Front Raise | tak | ok | general raiseFront | tak | — |
| Sled Reverse Flye | nie | bez figury | none (open) | — | — |
| Smith Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Smith Machine One-Arm Upright Row | tak | ok (gryf pionowo w prowadnicy) | general uprightRow | tak | — |
| Smith Machine Upright Row | tak | ok | general uprightRow | tak | — |
| Straight Raises on Incline Bench | tak | ok (przodem do oparcia, sztanga od zwisu do wysokości barków: dłoń −0,1 cm) | general raiseFront | tak | — |
| Upright Row (hantle) | tak | ok | general uprightRow | tak | — |
| Upright Row (linki) | tak | ok | general uprightRow | tak | — |
| Upright Row (sztanga) | tak | ok | general uprightRow | tak | — |
| Y Raise (hantle) | tak | ok (tułów 45°, ramię do 145°, odwiedzenie 37° — litera Y) | general raise | tak | — |

## curl — 36 ćwiczeń, 36 z danymi (karty własne 6, zestawy 30)

Pomiary (ręka pracująca): kąt łokcia, kąt ramienia od osi tułowia i jego zmiana (Δ — „łokcie przy bokach”), łokieć x − bark, przedramię od pionu w pozycji górnej, obrót przedramienia, tułów i stopy; modlitewnik — odległość ramienia od linii podpórki. Tułów stały (0° albo stały skłon/oparcie) i stopy y = 0 we wszystkich. Arkusze: bok (7).

| Ćwiczenie | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|
| Barbell Curl | ok poza górą: łokieć 21–135°, ramię Δ2,1°, przedramię na górze **40,4° od pionu** | own | — | **ACG-012** |
| Barbell Preacher Curl | ok (środek ramienia 2,5–3,1 cm od linii podpórki, łokieć 13,7–126°) | general curl | tak | OP-6 |
| Bayesian Curl | ok (ramię 35–40° za tułowiem, stałe) | general curl | tak | — |
| Biceps Curl (hantle) | ok (supinacja 0 → 70° — „obracając dłoń”, łokieć 18–134°) | own | — | — |
| Cable Curl | ok (Δ2,1°) | own | — | — |
| Cable Curl (dwie linki) | ok | general curl | tak | — |
| Cable Preacher Curl | ok | general curl | tak | OP-6 |
| Concentration Curl (hantle) | ok (tułów 50°, siad, łokieć przy udzie) | general curl | tak | — |
| Cross Body Hammer Curl | ok (dłoń z 25 → 3 cm — przez tułów, chwyt neutralny) | general curl | tak | — |
| Drag Curl | ok (łokcie w tył do −11,7 cm, Δ17° — zestaw bez `curl.elbows`, zgodnie z ruchem) | general curl | tak | — |
| EZ Bar Curl | ok poza górą: przedramię na górze **41,5° od pionu** | own | — | **ACG-012** |
| Hammer Curl | ok poza górą: przedramię na górze **40,2° od pionu**; chwyt neutralny (obrót 0°) | own | — | **ACG-012** |
| Hammer Curl (linki) | ok | general curl | tak | — |
| High Cable Curl | ok (ramiona odwiedzione 96–100°, łokieć 7,6–118°) | general curl | tak | — |
| Incline Curl (hantle) | ok (oparcie 35°, ramię pionowo, Δ7,5°) | general curl | tak | — |
| Incline Hammer Curl | ok | general curl | tak | — |
| Lying Cable Curl | ok (leżenie na podłodze, ramię wzdłuż tułowia) | general curl | tak | OP-6 |
| Lying Close-Grip Bar Curl On High Pulley | ok (ławka, ramię pionowo do wyciągu, łokieć 18–107,6°) | general curl | tak* | OP-6 (najmniejsze zgięcie końcowe w rodzinie) |
| Lying Supine Dumbbell Curl | ok | general curl | tak | OP-6 |
| Machine Biceps Curl | ok | general curl | tak | OP-6 |
| One Arm Dumbbell Preacher Curl | ok | general curl | tak | OP-6 |
| Preacher Curl | ok | own | — | OP-6 |
| Preacher Curl (EZ) | ok | general curl | tak | OP-6 |
| Preacher Hammer Dumbbell Curl | ok | general curl | tak | OP-6 |
| Reverse Cable Curl | ok (nachwyt −70°) | general curl | tak | — |
| Reverse Curl | ok (nachwyt −70°) | general curl | tak | — |
| Reverse EZ-Bar Preacher Curl | ok | general curl | tak | OP-6 |
| Seated Close-Grip Concentration Barbell Curl | ok | general curl | tak | — |
| Spider Curl | ok (klatka na ławce 45°, ramię pionowo, łokieć 1,5–124,6°) | general curl | tak | OP-6 |
| Spider Curl (sztanga) | ok | general curl | tak | OP-6 |
| Standing Concentration Curl | ok (skłon 45°, ramię zwisa) | general curl | tak | OP-6 |
| Standing Dumbbell Reverse Curl | ok | general curl | tak | — |
| Standing Inner-Biceps Curl | ok (ramię odwiedzione 20–23,5°, supinacja) | general curl | tak | — |
| Standing One-Arm Cable Curl | ok | general curl | tak | — |
| Zottman Curl | ok (obrót −60 ↔ 60°) | general curl | tak | — |
| Zottman Preacher Curl | ok | general curl | tak | OP-6 |

## mobility_stand — 36 ćwiczeń, 8 z danymi (karty własne 0, zestawy 36, brak 0)

Wszystkie 8 figur to pozy statyczne (2 identyczne klatki; `poseData.ts:97` — rozciąganie statyczne bez pętli). Pomiary: kąty stawów, stopy, najniższe kształty (−0,2 cm — grubość kreski), głowa/tułów. Walidacja 8/8 bez błędów, `jakosc-raport --styk-wszystkie` 0 naruszeń.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Ankle Circles | nie | bez figury | general mobility | tak | — |
| Arm Circles | nie | bez figury | general mobility | tak | — |
| Chest And Front Of Shoulder Stretch | nie | bez figury | general stretch | tak | — |
| Chest Stretch on Stability Ball | nie | bez figury | general stretch | tak | — |
| Chin To Chest Stretch | tak | ok (poza statyczna, `pochylenieGlowy` 45°, stopy y = 0, tułów 0°) | general stretch | tak | — |
| Cross-Body Shoulder Stretch | nie | bez figury | general stretch | tak | — |
| Dynamic Back Stretch | nie | bez figury | general mobility | tak | — |
| Dynamic Chest Stretch | nie | bez figury | general mobility | tak | — |
| Groiners | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Hip Circles (Prone) | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Inchworm | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Iron Crosses (Stretch) | nie | bez figury | general mobility | tak | — |
| Knee Circles | nie | bez figury | general mobility | tak | — |
| Leg Swings (Front-to-Back) | nie | bez figury | general mobility | tak | — |
| Leg Swings (Side-to-Side) | nie | bez figury | general mobility | tak | — |
| Lying Leg Crossover Swings | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| One Knee To Chest | nie | bez figury | general stretch | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Overhead Stretch | nie | bez figury | general stretch | tak | — |
| Overhead Triceps Stretch | tak | ok (prawa ręka nad głową: ramię 167°, łokieć 145,7°, dłoń za głową x −12, y 144) | general stretch | tak | druga ręka wzdłuż ciała (nie dociąga łokcia) — zestaw tego nie opisuje, nie przeczy |
| Round The World Shoulder Stretch | nie | bez figury | general mobility | tak | — |
| Shoulder Circles | nie | bez figury | general mobility | tak | — |
| Side Neck Stretch | tak | ok (`przechylGlowy` 25° — widok z przodu) | general stretch | tak | — |
| Standing Biceps Stretch | nie | bez figury | general stretch | tak | — |
| Standing Chest Stretch | tak | ok (dłonie splecione za plecami x −24, ramię 29° w tył) | general stretch | tak | — |
| Standing Elevated Quad Stretch | nie | bez figury | general stretch | tak | — |
| Standing Gastrocnemius Calf Stretch | tak | ok w walidacji; **rysunek = rozciąganie przy ścianie** (dłonie na ścianie x 72/ściana 75, wykrok: przednie kolano 41,9°, tylne 7,9°, wszystkie pięty i palce y = 0, brak stopnia) — dane identyczne z Wall Calf Stretch | general stretch (gcalf.*, zrecenzowany 28.10) | **nie** | **ACG-013** |
| Standing Hip Circles | nie | bez figury | general mobility | tak | — |
| Standing Lateral Stretch | tak | ok (`przechylTulowia` 20°, skręt 0°, pochylenie w przód 0°, lewa ręka nad głową) | general stretch (sb.plane) | tak | — |
| Standing Pelvic Tilt | nie | bez figury | general mobility | tak | — |
| Standing Soleus And Achilles Stretch | tak | ok (oba kolana ugięte 25–27°, pięty y = 0) | general stretch | tak | — |
| Standing Toe Touches | nie | bez figury | general stretch | tak | — |
| Torso Rotation | nie | bez figury | general mobility | tak | — |
| Wall Calf Stretch | tak | ok (jw. jak Standing Gastrocnemius — tylna noga prosta, pięta na podłodze) | general stretch | tak | — |
| Wall Lat Stretch | nie | bez figury | general stretch | tak | — |
| World's Greatest Stretch | nie | bez figury | general mobility | tak | — |
| Wrist Circles | nie | bez figury | general mobility | tak | — |

## triceps — 32 ćwiczenia, 29 z danymi (karty własne 4, w tym 1 ukryta; zestawy 25, brak 3)

Pomiary (ręka pracująca): kąt łokcia (0° = prosty) — zakres i najmniejsze zgięcie w wyproście; ramię od pionu i od osi tułowia (Δ — „ramiona nieruchomo”), łokieć poza linią barków (z, „łokcie nie rozchodzą się”), dół wyciskania francuskiego: gryf a obrys głowy (elipsa `head`), tułów, stopy, styki. Walidacja 29/29 bez błędów; `jakosc-raport` 0 naruszeń (z `--styk-wszystkie`: R17 tylko na 2 figurach z ławką ujemną — klasa fałszywych alarmów opisana w `v2-jakosc.mjs:657`). „uwaga W” = najmniejsze zgięcie łokcia w wyproście (raport sekcja 10, uwagi): w modelu v2 „prosta ręka” to ok. 11–16° (zrecenzowany pull_up: zwis 13,8–15,5°, Push Up góra 11,4°), więc wartości 14,5–17,9° są w tej konwencji; 19–24° — wyraźniej ugięte, bez znaleziska (pewność < 80%).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Band Overhead Triceps Extension | tak | ramię 12–14° od pionu (Δ2,4°), łokieć 14,5–124,2°, łokcie ≤ 2,2 cm poza linią barków | general triOver | tak | uwaga W (wyprost 14,5°) |
| Band Skull Crusher | tak | ok (ramię 8–10° od pionu, łokieć 14,8–109,6°, styk pleców, głowy, siedziska) | general triLying | tak | dół: dłoń nad czubkiem głowy (jak Skullcrusher (sztanga)) |
| Body-Up | nie | bez figury | none (open) | — | — |
| Bodyweight Triceps Extension | nie | bez figury | none (open) | — | — |
| Cable Incline Triceps Extension | tak | ok (oparcie 35°, ramię 8° od pionu, łokieć 20,7–75,9°) | general triOver | tak | uwaga W (wyprost 20,7°) |
| Cable Lying Triceps Extension | tak | ok (jak Skullcrusher (sztanga), łokieć 17,9–109,1°) | general triLying | tak | uwaga W (wyprost 17,9°) |
| Cable Overhead Extension | tak | ramię 12–14° od pionu, łokieć 20,6–122,7° (zgięcie spełnia `cote.move` v1 ≥ 110°) | own | — | uwaga W (wyprost 20,6°; kryterium v1 ≤ 9°) |
| Chain Handle Extension | tak | ok (łokieć 14,8–109,6°) | general triLying | tak | uwaga W (wyprost 14,8°) |
| Decline Dumbbell Triceps Extension | tak | ok (ławka −20°, stopy na końcu siedziska y 59 przy wałkach; łokieć 8,3–110,1°) | general triLying | tak | R17 `styk_z_podlozem` tylko z `--styk-wszystkie` — klasa „ławka ujemna” (fałszywy alarm, `v2-jakosc.mjs:657`) |
| Decline EZ Bar Triceps Extension | tak | ok (jw., łokieć 17,9–109,2°) | general triLying | tak | jw. (R17); zestaw bez `press.noLock` |
| Dumbbell One-Arm Triceps Extension | tak | ok (jedna ręka, łokieć 14,5–124,2°) | general triOver | tak | uwaga W (wyprost 14,5°) |
| Incline Barbell Triceps Extension | tak | ok (oparcie 35°, ramię 8° od pionu, łokieć 17,8–75,5°) | general triLying | tak | uwaga W (wyprost 17,8°) |
| Kettlebell Overhead Triceps Extension | tak | ok (łokieć 16,9–119,7°, łokcie 1–3 cm do środka) | general triOver | tak | uwaga W (wyprost 16,9°) |
| Kneeling Cable Triceps Extension | tak | **inny wariant**: klęk prosty, tułów 0°, ręce nad głową jak w Cable Overhead Extension (dane identyczne w górnej części), ławka narysowana przed ćwiczącym (x 55–170, łokcie x 6,5) i nieużyta, uchwyt lina; łokieć 20,6–122,7° | general triOver | tak* (opisuje rysunek) | **ACG-014**; uwaga W (wyprost 20,6°) |
| Lying Close-Grip Barbell Triceps Extension Behind The Head | tak | ok (ramię 19–20° w tył — gryf za głowę, łokieć 19,2–99,6°, łokcie ≤ 1,4 cm poza barki) | general triLying | tak | uwaga W (wyprost 19,2°) |
| Machine Triceps Extension | tak | ok (siad, ramię wzdłuż tułowia 8–11°, łokieć 10,2–100,1°) | general triPush | tak | — |
| One-Arm Lying Dumbbell Triceps Extension | tak | ok (łokieć 7,8–110,1°) | general triLying | tak | — |
| Overhead Triceps Extension (EZ) | tak | ok (łokieć 17,6–123,5°, łokcie ≤ 2,2 cm poza barki) | general triOver | tak | uwaga W (wyprost 17,6°) |
| Overhead Triceps Extension (hantel) | tak | ok (łokieć 16,9–119,7°) | own | — | uwaga W (wyprost 16,9°) |
| Reverse Grip Triceps Pushdown | tak | ok (łokcie przy bokach: ramię 8,6–10,5° od tułowia, Δ2,7°; łokieć 19,1–98,5°) | general triPush | tak | uwaga W (wyprost 19,1°) |
| Single Arm Triceps Pushdown | tak | ok (łokieć 15,5–98,4°) | general triPush | tak | uwaga W (wyprost 15,5°) |
| Skullcrusher (EZ) | tak | jak Skullcrusher (sztanga) (dane identyczne) | own — ukryta (`hidden`, brak wpisu w `data.json`) | — | karta ukryta (ACG-006, partia 3); figura v2 bez karty |
| Skullcrusher (hantle) | tak | ok (łokieć 7,8–110,1°) | general triLying | tak | — |
| Skullcrusher (sztanga) | tak | ok (ramię 8,5–10° od pionu — „mniej więcej pionowo”; łokieć 17,9–109,1°); dół: gryf [−82,9; 67,9], głowa (elipsa) środek [−72; 53,2], rx 10,6 poziomo — gryf nad czubkiem, ok. 10 cm od obrysu | general triLying | tak | `skull.depth` „tuż nad czołem — albo wcześniej” — kryterium v1 (`touch` tol 12) spełnione na granicy (11,9); bez znaleziska |
| Sled Overhead Triceps Extension | nie | bez figury | none (open) | — | — |
| Standing Low-Pulley One-Arm Triceps Extension | tak | ok (łokieć 14,5–124,2°) | general triOver | tak | uwaga W (wyprost 14,5°) |
| Standing Overhead Barbell Triceps Extension | tak | ok (łokieć 15,6–123,9°) | general triOver | tak | uwaga W (wyprost 15,6°) |
| Tate Press | tak | ok (łokcie 9–18 cm poza linią barków — cecha ćwiczenia; łokieć 0–145°, styk 5 punktów) | general bench | tak | — |
| Triceps Kickback | tak | ok (tułów 68°, ramię równolegle do tułowia 6–7°, Δ3,1°; łokieć 7,3–90,8°) | general triPush | tak | — |
| Triceps Kickback (linki) | tak | ok (jw.) | general triPush | tak | — |
| Triceps Pushdown | tak | ok poza dołem: łokcie przy bokach (ramię 8,7–10,3°, Δ2°), łokieć **23,9**–98,5° (góra 98,5° — kryterium v1 `tpd.move` ≥ 100° prawie spełnione) | own | — | uwaga W (wyprost 23,9°; kryterium v1 ≤ 11°) |
| Two-Arm Dumbbell Kickback | tak | ok (jw. jak Triceps Kickback) | general triPush | tak | — |

## pushup_plank — 30 ćwiczeń, 17 z danymi (karty własne 7, w tym 2 bez figury v2; zestawy 23, brak 0)

Pomiary: linia bark–biodro–kostka (kąt w biodrze na rzucie z boku; przy klęku bark–biodro–kolano), łokieć, bark i najniższy punkt tułowia w dole (kształty `torso`/`pelvis`), dłoń względem barku (x) i rozstaw dłoni (z) wobec szerokości barków, kolana, stopy, styki; Incline — odległość klatki od krawędzi skrzyni w dole; Mountain Climbers — faza nóg co u = 0,25. Walidacja 17/17 bez błędów, `jakosc-raport --styk-wszystkie` 0 naruszeń. W modelu v2 „prosta noga” ma kąt kolana ok. 11–17° (stanie: 11,6°) — nie oceniam tego jako ugięcia.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Ab Wheel | nie | bez figury | general rollout | tak | — |
| Barbell Rollout from Bench | tak | ok (klęk na ławce: kolano y 52, biodro 128 → 8,4°, na końcu linia bark–biodro–kolano −0,1°, łokieć 9–15°) | general rollout | tak | — |
| Clock Push-Up | nie | bez figury | general pushup | tak | — |
| Close-Grip Push-Up | tak | ok (linia bark–biodro–kostka ≤ 0,1°, dłonie 20 cm / barki 38, tułów w dole 5,8 cm nad podłogą, łokieć 11,5–144°) | general pushup | tak | — |
| Copenhagen Plank | nie | bez figury | general plank | tak | — |
| Decline Push Up | tak | ok (stopy na skrzyni 43 cm, dłonie na podłodze 44 / 38, linia ≤ 0,1°, tułów w dole 11 cm) | general pushup | tak | — |
| Diamond Push Up | tak | ok (dłonie 4,5 cm od osi — razem, 6–13 cm za barkami, pod klatką; linia 0°, tułów w dole 2,3 cm) | own | — | — |
| Drop Push | nie | bez figury | general pushup | tak | — |
| Incline Push Up | tak | ok (dłonie na skrzyni 45 cm, w dole klatka 1,7 cm od krawędzi, linia ≤ 0,1°, łokieć 12,4–148°) | own | — | — |
| Incline Push-Up Close-Grip | tak | ok (dłonie 20 cm, klatka 2,4 cm od krawędzi) | general pushup | tak | — |
| Incline Push-Up Depth Jump | nie | bez figury | general pushup | tak | — |
| Incline Push-Up Reverse Grip | nie | bez figury | general pushup | tak | — |
| Inverted Row | nie | bez figury | own | — | karta własna bez rysunku — sprawdzona w partii 3 |
| Isometric Wipers | nie | bez figury | general pushup | tak | — |
| Mountain Climbers | tak | ok (dłonie pod barkami 0 cm, nogi naprzemiennie i jednocześnie: kolano 17,7 ↔ 138,5°, tylna noga prosta; bark y stały 65,6–65,7) | own | — | — |
| Plank | tak | ok (przedramiona: łokieć x −bark 2,4 cm — pod barkiem, łokieć 89,3°; linia −0,1°; poza statyczna) | own | — | — |
| Plank Shoulder Taps | tak | ok (linia 0°, miednica stała 48,5, dłoń dotyka drugiego barku: rozstaw 38 → 2 cm) | general plank | tak | — |
| Plyo Kettlebell Push-Ups | nie | bez figury | general pushup | tak | — |
| Plyo Push-Up | tak | ok (linia ≤ 0,1°, bark do 77,5 — wybicie, tułów w dole 8,8 cm) | general pushup | tak | — |
| Push Up | tak | ok (dłonie 38 = barki, linia ≤ 0,1°, tułów w dole 7,7 cm — „prawie do podłogi”, łokieć 11,4–144,1°) | own | — | — |
| Push Up to Side Plank | nie | bez figury | general pushup | tak | — |
| Push-Up Wide | tak | ok (dłonie 66 / barki 38, tułów w dole 2,3 cm) | general pushup | tak | — |
| Push-Ups With Feet On A Stability Ball | nie | bez figury | general pushup | tak | — |
| Renegade Row | nie | bez figury | general pushup | tak | — |
| Rollout (sztanga) | tak | ok (klęk: kolano y 9,8, start biodro 64°, od u = 0,5 linia bark–biodro–kolano 0°, łokieć 6,7–11,4°) | general rollout | tak | — |
| Side Plank | nie | bez figury | own | — | karta własna bez rysunku — sprawdzona w partii 3 |
| Single-Arm Push-Up | tak | ok (jedna ręka pod osią ciała, druga ręka stała; linia 0°; dół płytszy: łokieć do 95°, tułów 25 cm nad podłogą) | general pushup | tak | zestaw nie ma `push.mis.partial` — płytszy dół nie przeczy |
| Standing Barbell Rollout | tak | ok (stopy na podłodze, biodro 107 → 3,6°, na końcu linia 3,5°, ramię–tułów 148°) | general rollout | tak | — |
| Suspended Fallout | tak | ok (linia bark–biodro–kolano 5,5–7,6°, ramię 83 → 158°, łokieć 22–24° stały) | general rollout | tak | — |
| Suspended Push-Up | tak | ok (dłonie w taśmach 45 cm nad podłogą, linia 0°, łokieć 11,4–144,1°) | general pushup | tak | — |
