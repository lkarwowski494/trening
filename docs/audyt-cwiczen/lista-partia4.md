# Lista per ćwiczenie — partia 4: rodziny `planned` (4A: core_floor, delt_raise, curl @ fbd00673; 4B: mobility_stand, triceps, pushup_plank @ 433289f7 — kod jak w 4A, `integracja-1-1` 1c683be3; 4C: plyo, olympic, lunge, overhead_press @ 294812ef — kod jak w 4A)

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

## plyo — 28 ćwiczeń, 27 z danymi (karty własne 1, zestawy 26 — wszystkie `jump`, brak 1) — partia 4C @ 294812ef (kod jak w 4A/4B)

Pomiary co u = 0,01 (`keyframeFrame`, kształty `dataShapes` z boku): lot = najniższy punkt kształtu stopy nad powierzchnią pod nią (`powierzchniePodparcia`), wybicie = ostatnia klatka przed lotem, lądowanie = pierwsza po locie; kolano, biodro (`jointAngles`), pięta − palce, miednica (x/y/z), chwyt; porównanie z notą ćwiczenia w `docs/research/equipment/catalog.json`. Arkusze (bok: Jump Squat, Split Jump, Broad Jump, Box Jump, Frog Hops, Dumbbell Seated Box Jump, Weighted Jump Squat; przód: Lateral Box Jump, Side to Side Box Shuffle, Star Jump) — PIL, poza repo. Walidacja 27/27 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 27/27 — plyo nie ma wpisów w `LOT` (`v2-jakosc.mjs:108`), więc każdy lot jest „wiszeniem”: fałszywy alarm reguły (uwaga U-4C-1). Zestaw `jump`: `jump.drive` „Wybij się, prostując biodra, kolana i kostki, z zamachem rąk”, `jump.land` „Ląduj miękko, na ugiętych kolanach”, błąd `jump.mis.stiff`. We wszystkich skokach pełny wyprost przed oderwaniem (kolano 8–14°, biodro 7–9°, pięta 21 cm nad palcami) i lądowanie z ugięciem do 85–123° — zdania zestawu zgodne z rysunkiem.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternate Leg Diagonal Bound | tak | ok (odbicie z jednej nogi, lot 30 cm, miednica x 0 → 81, z 0 → 45 — skos; lądowanie na drugą nogę, kolano do 122°) | general jump | tak | — |
| Alternate Leg Push-Off | tak | ok (prawa stopa na skrzyni 30 cm, lot 25 cm, zmiana nóg w powietrzu, lądowanie lewą na skrzyni) | general jump | tak | — |
| Bench Jump | tak | ok jako skok na skrzynię 40 cm (lot 43 cm, lądowanie na skrzyni, kolano do 90°) | general jump | tak | **ACG-014** (klasa: inny wariant niż nota — katalog „jumps over a bench or low box”, rysunek: wskok na skrzynię, kopia Box Jump z niższą skrzynią) |
| Box Jump | tak | ok (stopy 24 cm, lot 52 cm, lądowanie obiema stopami na skrzyni 50 cm, kolano 90°, biodro 93°; błąd `bj.mis.stiff` narysowany) | own | — | — |
| Box Skip | tak | ok (z jednej nogi na skrzynię 40 cm, druga noga uniesiona) | general jump | tak | — |
| Broad Jump | tak | ok (lot 25 cm, miednica x −17 → 126 — skok w dal, lądowanie kolano 90°) | general jump | tak | — |
| Depth Jump | tak | ok (zejście ze skrzyni 50 cm, lądowanie kolano 19 → 84°, wyskok 29 cm, lądowanie na podłodze) | general jump | tak | nota katalogu: wskok na drugą skrzynię — rysunek pokazuje częstszy wariant z wyskokiem w górę (bez znaleziska) |
| Double Leg Butt Kick | tak | ok (lot 26 cm, kolano do 99° w locie — pięty do pośladków) | general jump | tak | — |
| Dumbbell Seated Box Jump | tak | **wada**: dwa hantle w wyprostowanych rękach, zamach nad głowę (hantle do 256 cm) w locie; start z ławki 38 cm, lądowanie na skrzyni 50 cm | general jump | **nie** (`jump.drive` „z zamachem rąk” przy hantlu trzymanym przy klatce wg noty) | **ACG-015** |
| Frog Hops | tak | ok (głęboki przysiad: kolano 118°, biodro 129°, lot 21 cm, przemieszczenie do przodu 81 cm) | general jump | tak | — |
| Front Cone Hops | tak | ok (lot 17 cm, przemieszczenie 55 cm; pachołki nienarysowane — nota: „not in vocabulary”) | general jump | tak | — |
| Jump Squat | tak | ok (przysiad kolano 94°, wyprost przed oderwaniem 13,6°, lot 29 cm, lądowanie 21 → 90°) | general jump | tak | — |
| Kneeling Jump Squat | nie | bez figury | none (open) | — | — |
| Lateral Bound | tak | ok (z jednej nogi na drugą w bok: miednica z 0 → 90, lot 30 cm; widok z przodu) | general jump | tak | — |
| Lateral Box Jump | tak | ok (z przodu: skok w bok na skrzynię 40 cm, z = 55; lądowanie na wierzchu) | general jump | tak | z boku skrzynia nakłada się na sylwetkę (rzut; widok z przodu rozstrzyga) |
| Lateral Cone Hops | tak | ok (lot 17 cm, z 0 → 55) | general jump | tak | — |
| Side Hop-Sprint | tak | ok jako przeskok w bok (lot 19 cm, z 0 → 60); sprintu brak | general jump | tak | uproszczenie: pokazany tylko przeskok |
| Side Standing Long Jump | tak | ok (z 0 → 110 — skok w dal w bok, lot 25 cm) | general jump | tak | — |
| Side to Side Box Shuffle | tak | ok (skrzynia 12 cm, stopa na wierzchu zmienia się, miednica z −21 → 21) | general jump | tak | — |
| Single Leg Butt Kick | tak | ok (jedna noga, kolano wolnej 66–103°, lot 21 cm) | general jump | tak | — |
| Single Leg Push-Off | tak | ok (ta sama noga na skrzyni 30 cm przed i po locie) | general jump | tak | — |
| Single-Leg Hop Progression | tak | ok (jedna noga, lot 19 cm, przemieszczenie 50 cm) | general jump | tak | — |
| Single-Leg Lateral Hop | tak | ok (jedna noga, z 0 → 45) | general jump | tak | — |
| Single-Leg Stride Jump | tak | ok w walidacji; start na podłodze na jednej nodze, lądowanie na skrzyni 40 cm — ruch jak Box Skip | general jump | tak | **ACG-014** (klasa: nota „standing beside a box, inside foot on it; jump up driving the opposite knee” — stopa wewnętrzna nie stoi na skrzyni) |
| Split Jump | tak | ok (wykrok, lot 50 cm, zmiana nóg w powietrzu: przód R x 30 → tył; lądowanie w wykroku) | general jump | tak | — |
| Star Jump | tak | ok (z przodu: ręce i nogi rozchylone w locie, lot 29 cm) | general jump | tak | — |
| Tuck Jump | tak | ok (kolano do 110,5° w locie, lot 36 cm) | general jump | tak | — |
| Weighted Jump Squat | tak | ok (sztanga na plecach przez cały ruch, lot 23 cm, stojaki w tle) | general jump | tak | zestaw bez `jump.drive` (zamach rąk) — słusznie |

## olympic — 25 ćwiczeń, 23 z danymi (karty własne 0; zestawy: `oly` 18, `pushPress` 4, `squat` 1; brak 2) — partia 4C

Pomiary co u = 0,01: start (zgięcie kręgosłupa, pochylenie tułowia, kolano, biodro, łokieć), szerokość chwytu wobec barków, odstęp sztangi od obrysu nogi/tułowia w rzucie z boku (kształty `shank`/`thigh`/`shorts`/`torso`/`pelvis` na wysokości osi gryfu), wyprost (najmniejszy kąt biodra przed najwyższym położeniem sztangi) i łokieć w tej chwili, odbiór (najniższa miednica po szczycie): miednica wobec kolana, łokieć, rozkrok; środek ciężkości (`srodekCiezkosci` z `v2-jakosc.mjs`, z gryfem jako dodatkową masą) wobec wielokąta podparcia (`otoczka(punktyPodparcia)`). Arkusz z boku (Jerk Dip Squat, Power Clean, Clean, Barbell Snatch, Snatch Balance; u = 0 / 0,25 / 0,5 / 0,75 / 1) — PIL, poza repo. Walidacja 23/23 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 21 figurach (wspięcie na palce i podskok przy podsiadzie 1,1–1,8 cm, bez wpisu w `LOT`) — fałszywy alarm (U-4C-1). Wspólne dla zestawu `oly`: start z płaskimi plecami (zgięcie kręgosłupa 0, tułów 49–54°), sztanga 2–11 cm od obrysu nóg i bioder przez cały ciąg (`oly.close`), łokcie proste (18–23°) do pełnego wyprostu bioder i kolan, w rwaniu ugięcie zaczyna się w chwili wyprostu (28–45° przy biodrze 5°) — `oly.legs` zgodne; chwyt podrzutowy 50 cm / barki 38, rwaniowy 80 cm.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Snatch | tak | ok (z podłogi, odbiór w pełnym przysiadzie: miednica 37,8 < kolano 40,2; łokcie 19°) | general oly | tak | OP-8 (b): gryf w odbiorze 5 cm przed palcami (x 23,7, palce 18,7) |
| Block Clean | tak | ok (talerze na skrzyniach 29,5 cm — start nad kolanem; odbiór jak Clean) | general oly | tak | — |
| Block Power Clean | tak | ok (start z bloków, odbiór wysoki: miednica 68,5 > kolano 45,2) | general oly | tak | OP-8 (c) |
| Block Power Snatch | tak | ok (start z bloków, odbiór wysoki, łokcie 19°) | general oly | tak | OP-8 (c) |
| Block Snatch | tak | ok (start z bloków, odbiór w pełnym przysiadzie) | general oly | tak | OP-8 (b) |
| Clean | tak | ok (z podłogi, odbiór w przysiadzie — miednica 40,3 ≈ kolano 41,5; gryf na przednich barkach: 14 cm nad i 12 cm przed stawem barkowym, łokieć 146°) | general oly | tak | — |
| Clean Pull | tak | ok (bez odbioru, wyprost na palcach, łokcie 19–20°) | general oly | tak | — |
| Clean Shrug | tak | ok (start z połowy uda — gryf 72 cm, wyprost i wzruszenie barków na palcach) | general oly | tak | — |
| Clean and Jerk | tak | ok (zarzut w przysiad, podrzut z odbiorem w nożyce: rozkrok 47 cm, łokcie 16°) | general oly | tak | — |
| Hang Clean | tak | ok (start gryf 72 cm — nad kolanem, odbiór jak Clean) | general oly | tak | — |
| Hang Snatch | tak | ok (start gryf 76 cm, odbiór w pełnym przysiadzie) | general oly | tak | OP-8 (b) |
| Jerk Balance | nie | bez figury | none (open) | — | — |
| Jerk Dip Squat | tak | ok w walidacji; ugięcie kolan 10 → 51°, gryf cofa się o 15,5 cm (x 8,3 → −7,2) przy zejściu o 11 cm; środek ciężkości 4,6–5,3 cm za piętami w dole | general pushPress | tak* | `pp.legs` („ręce kończą ruch”) nie dotyczy — figura nie wybija; OP-8 (a) |
| Muscle Snatch | tak | ok (kolana nie uginają się ponownie: odbiór kolano 9,7°; ręce ciągną od u 0,34, gryf nad głową, łokcie 19°) | general oly | tak | zestaw bez `oly.legs` — słusznie |
| Power Clean | tak | ok (odbiór wysoki: miednica 68,5 > kolano 45,2; gryf na barkach) | general oly | tak | OP-8 (c): gryf nad piętą (x −5,7, pięta −5,9), środek ciężkości 2,4–3,1 cm za piętami |
| Power Jerk | tak | ok (z przedniego podparcia, ugięcie i wybicie, odbiór w półprzysiadzie, łokcie 15°) | general pushPress | tak | OP-8 (c) |
| Power Snatch | tak | ok (odbiór wysoki, gryf nad stopą x 1) | general oly | tak | OP-8 (c) |
| Rack Delivery | nie | bez figury | none (open) | — | — |
| Snatch Balance | tak | ok (gryf z karku, zejście pod gryf do przysiadu nad głową, łokcie 19°) | general squat | tak* | `sq.kneesToes` — tylko widok z boku; OP-8 (b) |
| Snatch Pull | tak | ok (bez odbioru, chwyt rwaniowy, łokcie 21°) | general oly | tak | — |
| Snatch Shrug | tak | ok (z połowy uda, chwyt rwaniowy) | general oly | tak | — |
| Split Clean | tak | ok (odbiór w nożycach: rozkrok 47 cm) | general oly | tak | — |
| Split Jerk | tak | ok (odbiór w nożycach, łokcie 16°) | general pushPress | tak | — |
| Split Snatch | tak | ok (odbiór w nożycach, łokcie 20°) | general oly | tak | — |
| Squat Jerk | tak | ok (odbiór w pełnym przysiadzie nad głową, łokcie 14°) | general pushPress | tak | OP-8 (b) |

## lunge — 24 ćwiczenia, 24 z danymi (karty własne 6; zestawy: `lunge` 15, `pistol` 2, `mobility` 1) — partia 4C

Pomiary co u = 0,02: dół = najniższa miednica; noga przednia = większe zgięcie biodra; przednie kolano i biodro, nachylenie goleni, tylne kolano (staw i najniższy punkt obrysu `shank`/`thigh` nad podłogą), kolano przednie wobec kostki i palców (x, z), kierunek stopy (pięta → palce) a kierunek kolana w rzucie na podłogę, R11 (`katOsiStopyOdPlaszczyzny`), tułów i zgięcie kręgosłupa, stopy (pięta/palce y, x, z) na starcie, w dole i na końcu, chwyty; arkusze z boku (Bulgarian Split Squat (hantle), Step Up, Single-Leg High Box Squat, Pistol Squat, Walking Lunges) i z przodu (Lateral Lunge, Cossack Squat, Split Squat, Curtsy Lunge) — PIL, poza repo. Walidacja 24/24 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 5 figurach (stopa w kroku 1,5–4,2 cm nad podłogą, gdy druga stoi na podłodze albo skrzyni) — fałszywy alarm (U-4C-1). Wspólne: tylne kolano w dole 4,4–7 cm nad podłogą (obrys; „tuż nad podłogą” w `lunge.fwd`/`lunge.back`/`lunge.walk`/`bss.move` zgodne), kręgosłup 0°, tułów 6° (`lunge.torso` zgodne), przednie kolano nad stopą w osi (z kolana − z kostki 2,6–3,8 cm, kierunek kolana 5–16° od osi stopy) we wszystkich wykrokach w przód i w tył.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Side Split Squat | tak | ok w walidacji (szeroki rozkrok z 30 / −50, zejście w bok na prawą: kolano 100°, lewa prosta; sztanga na plecach) — dane nóg identyczne z Lateral Lunge | general lunge | tak* | OP-9 (stopa prowadząca palcami do środka 20°, kolano 29,5° od osi stopy; nota: „angled lead foot”) |
| Barbell Step Up | tak | ok (jak Step Up, sztanga na plecach) | general lunge | tak | — |
| Barbell Walking Lunge | tak | ok w walidacji; krok w przód i powrót do startu (wahadło) — rysunek Lunges (sztanga) | general lunge | **nie** (`lunge.walk` „wstań na przedniej nodze i od razu zrób krok drugą”) | **ACG-016** |
| Bulgarian Split Squat (hantle) | tak | ok (grzbiet tylnej stopy na ławce 30 cm — palce 32, pięta 44,5; przednia goleń pionowo −0,8°; tylne kolano 6 cm nad podłogą; hantle w dół) | own | — | — |
| Bulgarian Split Squat (sztanga) | tak | ok (jak wyżej, sztanga na plecach, stojaki) | general lunge | tak | — |
| Cossack Squat | tak | ok w walidacji (zejście w bok: kolano 112°, druga noga prosta) | general lunge | tak* | OP-9 (stopa pracująca palcami do środka 28°, kolano 41° od osi stopy; R11 34° — wyjątek `OS_STOPY_WYJATKI` „do przeglądu przy rodzinie”, `v2-jakosc.mjs:358`) |
| Crossover Reverse Lunge | tak | ok w walidacji; dane identyczne z Curtsy Lunge (`klatki` równe), skręt tułowia brak | general mobility | tak | **ACG-014** (klasa: nota „reverse lunge with a torso rotation” — rotacji nie ma); R11 tylnej nogi 54° (wyjątek `v2-jakosc.mjs:357`) |
| Curtsy Lunge | tak | ok (tylna noga skrzyżowana za przednią: z kostki −10 → 22) | general lunge | tak | R11 tylnej nogi 54° (wyjątek `:356`) — nie dotyczy zdania o przednim kolanie |
| Elevated Back Lunge | tak | ok (przednia stopa na podwyższeniu 12 cm, krok w tył na podłogę, tylne kolano 4,4 cm) | general lunge | tak | — |
| Lateral Lunge | tak | ok w walidacji (zejście w bok, druga noga prosta) | general lunge | tak* | OP-9 (jak Barbell Side Split Squat) |
| Lunge Pass Through | tak | ok (kettlebell przekładany pod przednim udem: chwyt w dole x −15, y 34; tułów 35°) | general lunge | tak | — |
| Lunges (hantle) | tak | ok (stopy 20 cm — z ±10, hantle w dół; krok w przód 89 cm, tylne kolano 4,4 cm, powrót do startu) | own | — | — |
| Lunges (sztanga) | tak | ok (jak wyżej, sztanga na plecach) | general lunge | tak | — |
| Pistol Squat | tak | ok (stopa wolnej nogi 4–43 cm nad podłogą, ręce w przód; dół kolano 128°, biodro 126°) | own | — | wolna noga zgięta 31° w kolanie przy `pistol.setup` „drugą wyprostuj” — ponad konwencję prostej nogi v2 (11–17°), pewność niezgodności < 80% (uwaga U-4C-3) |
| Reverse Lunge | tak | ok (krok w tył 89 cm, tylne kolano 4,4 cm) | own | — | — |
| Single-Leg High Box Squat | tak | ok w walidacji; stopa podporowa na podłodze, skrzynia 43,6 cm za postacią, w dole siad na skrzyni (miednica 53,4) — przysiad na skrzynię | general pistol | tak | **ACG-014** (klasa: nota „standing on a high box, free leg hanging”) |
| Slider Reverse Lunge | tak | ok (tylna stopa na ślizgaczu — palce y 2, przesuw 90 cm) | general lunge | tak | — |
| Smith Machine Bulgarian Split Squat | tak | ok (jak Bulgarian, gryf w suwnicy Smitha) | general lunge | tak | — |
| Smith Machine Pistol Squat | tak | ok (gryf Smitha na plecach, dół jak Pistol) | general pistol | tak | — |
| Split Squat | tak | ok (pozycja stała rozkroku, tylne kolano 4,4 cm) | general lunge | tak | — |
| Split Squat (linki) | tak | ok (uchwyty z dolnych wyciągów w dłoniach) | general lunge | tak | — |
| Step Up | tak | ok (cała stopa na skrzyni 40 cm, wyprost nogi na skrzyni — miednica 129,8; druga stopa w górze; powrót tą samą drogą) | own | — | — |
| Suspended Split Squat | tak | ok (tylna stopa w taśmie 20–42 cm, tylne kolano 11,4 cm) | general lunge | tak | — |
| Walking Lunges | tak | ok w walidacji; dane identyczne z Lunges (hantle) — krok w przód i powrót do startu | own | — | **ACG-016** (`lunge.walk`) |

## overhead_press — 23 ćwiczenia, 21 z danymi (karty własne 5; zestawy: `ohp` 11, `press` 3, `pushPress` 1, `pushup` 1; brak 2) — partia 4C

Pomiary co u = 0,02 dla każdej ręki z zakresem łokcia > 20°: łokieć w górze i w dole, chwyt i bark (y, x), odchylenie przedramienia od pionu z boku i z przodu (`ohp.elbowsUnder`), chwyt x − bark (tor ciężaru), rotacja przedramienia (Arnold), pochylenie i skłon boczny tułowia, kolano (ugięcie w podrzucie), stopy, szerokość chwytu wobec barków. Walidacja 21/21 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Wspólne dla wariantów stojących: dół — chwyt 14 cm nad stawem barkowym i 22 cm przed nim (przód barków), góra — łokieć 9,2°, chwyt 7 cm przed barkiem i głową (ciężar nad głową, `ohp.move`/`ohp.tall`/`ohp.fullExt` zgodne), przedramię −13…3° od pionu z boku i −5…3° z przodu (`ohp.elbowsUnder` zgodne), tułów 0°, stopy na podłodze. Siedzące: ławka 45 cm, oparcie 85°, tułów −5° (oparty), kolano 78°, stopy na podłodze.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Arnold Press | tak | ok (rotacja przedramienia −75 → 80°, dłonie z 12 → 24 cm od osi, łokieć 9°) | general ohp | tak | zestaw bez `ohp.elbowsUnder` — słusznie (łokcie z przodu w dole) |
| Band Shoulder Press | tak | ok (guma, tor jak sztanga) | general ohp | tak | — |
| Bradford Press | nie | bez figury | none (open) | — | — |
| Double Kettlebell Press | tak | ok (dwa kettlebelle z przedniego podparcia) | general ohp | tak | — |
| Handstand Push Up | nie | bez figury | none (open) | — | — |
| Kettlebell Arnold Press | tak | ok (jedna ręka, rotacja −75 → 80°) | general ohp | tak | — |
| Kettlebell Press | tak | ok (jedna ręka, druga nieruchomo) | general ohp | tak | — |
| Kettlebell Seated Press | tak | ok w walidacji; siad na ławce z oparciem 85° (dane jak Seated Shoulder Press), jedna ręka | general ohp | tak | **ACG-014** (klasa: nota „Seated on the floor, legs spread”) |
| Landmine Press | tak | ok (oburącz, koniec gryfu 16 → 55 cm przed barkiem, łokieć 141 → 16°) | general press | tak | nota: „usually one arm at a time” — oburącz dopuszczalne |
| Landmine Linear Jammer | tak | ok (wybicie z nóg: kolano 7 → 67 → 7°, tułów do 12°, oburącz) | general press | tak | — |
| Overhead Press (hantle) | tak | ok (hantle przy barkach, przedramię pionowo) | own | — | — |
| Overhead Press (sztanga) | tak | ok (chwyt 52 cm / barki 38, gryf przy przedniej części barków, stopy na podłodze) | own | — | — |
| Pike Push Up | tak | ok (biodra wysoko, dłonie pod barkami, łokieć 15 → 115°, bark y 64,5 → 36,5) | general pushup | tak | — |
| Push Press | tak | ok (ugięcie kolan do 54°, tułów do 10° w przód w ugięciu, wybicie, łokieć 9°) | own | — | OP-8 (a): tułów pochyla się 10° w przód w ugięciu przy `pp.dip` „tułów napięty” |
| Push Press - Behind the Neck | tak | ok (gryf z karku: chwyt 13 cm za barkiem, 92 cm szeroko; ugięcie jak Push Press) | general pushPress | tak | — |
| Seated Barbell Military Press | tak | ok (siad z oparciem, stojaki, sztanga) | general ohp | **nie** (`ohp.seat` „…; hantle przy barkach” przy sztandze) | **ACG-017** |
| Seated Cable Shoulder Press | tak | ok (siad z oparciem, uchwyty z wyciągów) | general ohp | **nie** (`ohp.seat` „hantle przy barkach” przy linkach) | **ACG-017** |
| Seated Shoulder Press (hantle) | tak | ok (plecy na oparciu 85°, stopy na podłodze, hantle przy barkach) | own | — | — |
| See-Saw Press (Alternating Side Press) | tak | ok w walidacji; ręce naprzemiennie, skłon boczny tułowia 0° | general ohp | tak | **ACG-014** (klasa: nota „press one side while leaning the torso to the opposite side” — skłonu nie ma) |
| Single Arm Overhead Press (hantel) | tak | ok (jedna ręka) | general ohp | tak | — |
| Single-Arm Linear Jammer | tak | ok (jedna ręka, wybicie z nóg) | general press | tak | — |
| Standing Barbell Press Behind Neck | tak | ok (gryf z karku 13 cm za barkiem, chwyt 92 cm, łokieć 122 → 16°) | general ohp | tak | — |
| Wyciskanie nad głowę (linki) | tak | ok (uchwyty przy barkach, łokcie w dół) | own | — | — |
