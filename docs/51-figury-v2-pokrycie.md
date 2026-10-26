# 51 — Figury v2: rodziny ruchu i pokrycie ćwiczeń (generowane)

AUTOMATYCZNIE WYGENEROWANE przez `scripts/figures/v2-gen.mjs` z `lib/figures/v2/families.ts` i katalogu `lib/catalog.generated.ts` — nie edytować ręcznie.
Sprawdzanie: `node scripts/figures/v2-gen.mjs --check` (część `npm run check:figures-v2`). Projekt i zasady: `docs/50-figury-v2.md`.

Ćwiczeń w katalogu: **709**; rodzin ruchu: **43** (gotowe: 4, do zrobienia: 39); ćwiczeń z gotową figurą: **98** (13,8%).

## Rodziny

| Rodzina | Stan | Ćwiczeń | Widoki | Szacunek pracy agenta (h) | Opis |
|---|---|---|---|---|---|
| `squat` | gotowa | 25 | side, front | — | Przysiad obustronny |
| `bench_press` | gotowa | 30 | side, top | — | Wyciskanie leżąc (ławka płaska, skośna, ujemna, podłoga) |
| `hinge` | gotowa | 32 | side, front | — | Zawias biodrowy (martwy ciąg, RDL, dzień dobry) |
| `pushup_plank` | do zrobienia | 30 | side, front | 4 | Pompki, deski, rollouty, ruchy w podporze — rig w podporze: dwie podpory (dłonie, stopy), obrót wokół kotwicy |
| `dip` | do zrobienia | 5 | side, front | 2 | Dipy (poręcze, ławka, maszyna, kółka) |
| `overhead_press` | do zrobienia | 21 | side, front | 4 | Wyciskanie nad głowę i pionowe (stojąc, siedząc, landmine, jerk) |
| `row` | do zrobienia | 13 | side, top | 4 | Wiosłowanie w pochyleniu / z podparciem / jednorącz |
| `cable_row` | do zrobienia | 10 | side, front | 3 | Wiosłowanie na linkach i maszynie, face pull |
| `pull_up` | gotowa | 13 | side, front | — | Podciąganie i zwis (drążek, kółka, lina) — pozy z danych (poses/pull_up.json); ćwiczenia bez wpisu w danych bez figury v2 |
| `pulldown` | do zrobienia | 7 | side, front | 2 | Ściąganie drążka (wyciąg górny) |
| `lunge` | do zrobienia | 24 | side, front | 5 | Wykroki, przysiad bułgarski, wejścia na stopień, pistolet |
| `leg_machine` | do zrobienia | 8 | side | 3 | Suwnice i maszyny nóg (leg press, hack, wahadło) |
| `leg_isolation` | do zrobienia | 14 | side | 3 | Prostowanie i uginanie nóg, nordic, sissy |
| `calf_raise` | do zrobienia | 13 | side | 2 | Wspięcia na palce |
| `hip_bridge` | do zrobienia | 11 | side | 3 | Hip thrust i mostki |
| `kb_ballistic` | do zrobienia | 17 | side | 3 | Kettlebell: swing, clean, snatch, wyciskania balistyczne |
| `olympic` | do zrobienia | 25 | side | 6 | Podrzut, rwanie i ich odmiany |
| `back_extension` | do zrobienia | 4 | side | 2 | Prostowanie tułowia na ławce, reverse hyper |
| `curl` | do zrobienia | 36 | side, front | 4 | Uginanie ramion (sztanga, hantle, linka, modlitewnik) |
| `triceps` | do zrobienia | 32 | side | 4 | Prostowanie ramion (francuskie, nad głową, wyciąg, odwodzenie w tył) |
| `delt_raise` | do zrobienia | 38 | front, side | 4 | Unoszenie ramion (bokiem, przodem, tyłem, wiosłowanie pionowe) |
| `chest_fly` | do zrobienia | 20 | top, side | 3 | Rozpiętki, pec deck, przenoszenie za głowę |
| `shrug` | do zrobienia | 8 | front, side | 1 | Szrugsy |
| `rotator_cuff` | do zrobienia | 8 | front, side | 2 | Rotacje zewnętrzne/wewnętrzne, taśmy do ramion |
| `core_floor` | do zrobienia | 44 | side | 4 | Brzuch na leżąco i siedząco (spięcia, unoszenie nóg, V-up) |
| `core_hang` | do zrobienia | 4 | side | 2 | Brzuch w zwisie (unoszenie nóg/kolan, toes to bar) |
| `core_standing` | do zrobienia | 19 | front, side | 4 | Core stojąc i rotacje (Pallof, drwal, skłony, windmill) |
| `carry` | do zrobienia | 7 | side | 2 | Noszenie |
| `cardio` | do zrobienia | 16 | side | 6 | Cardio i lokomocja (bieg, rower, wioślarz, skakanka, burpees) |
| `plyo` | do zrobienia | 28 | side | 4 | Skoki i plyometria |
| `sled_throw` | do zrobienia | 19 | side | 3 | Sanie, rzuty piłką, uderzenia |
| `strongman` | do zrobienia | 10 | side | 3 | Strongman i podnoszenia nietypowych ciężarów |
| `glute_floor` | do zrobienia | 7 | side, front | 4 | Pośladki i biodra na podłodze/linkach (clamshell, kickback, odwodzenie) |
| `hip_abd_add` | do zrobienia | 8 | front | 2 | Przywodzenie i odwodzenie (maszyny, linki, taśmy) |
| `mobility_stand` | do zrobienia | 36 | side, front | 6 | Mobilność i rozciąganie stojąc / w ruchu |
| `mobility_floor` | do zrobienia | 22 | side | 6 | Mobilność i rozciąganie na podłodze |
| `foam_roll` | do zrobienia | 11 | side | 2 | Rolowanie i automasaż |
| `neck` | do zrobienia | 8 | side | 1 | Szyja |
| `forearm` | do zrobienia | 12 | side | 2 | Przedramiona i chwyt |
| `thruster` | do zrobienia | 3 | side | 2 | Thruster i ruchy złożone przysiad + wyciskanie |
| `chest_press_machine` | do zrobienia | 5 | side | 3 | Maszyny wyciskające siedząc (klatka, barki) |
| `cable_press` | do zrobienia | 4 | side, top | 2 | Wyciskania na linkach |
| `kneeling_hinge` | do zrobienia | 2 | side | 1 | Zawias w klęku i siedząc (dzień dobry siedząc, klęczący przysiad) |

Razem do zrobienia: 39 rodzin, 609 ćwiczeń, ok. **123 h pracy agenta** (rig + testy geometrii + przegląd zrzutów; bez czekania na CI i bez czasu właściciela).

## Gotowe rodziny: ćwiczenia bez figury v2 (brak pozy w danych — v1 albo brak)

- `pull_up` (z figurą 11 z 13): Muscle Up; Rope Climb

## Ćwiczenia według rodzin

### squat (25) — gotowa

Back Squat; Band Squat; Barbell Hack Squat; Bodyweight Squat; Box Squat; Box Squat with Bands; Box Squat with Chains; Cable Squat; Dip Belt Squat; Double Kettlebell Front Squat; Dumbbell Squat; Front Squat; Goblet Squat; Landmine Squat; One-Arm Overhead Kettlebell Squat; Overhead Squat; Przysiad z pasem (linki); Reverse Band Box Squat; Reverse Band Power Squat; Smith Machine Squat; Squat with Bands; Squat with Chains; Sumo Squat (hantel); Wall Sit; Zercher Squat

### bench_press (30) — gotowa

Band Bench Press; Barbell Guillotine Bench Press; Bench Press (hantle); Bench Press (sztanga); Bench Press with Chains; Board Press; Chain Press; Close Grip Bench Press; Close-Grip Dumbbell Press; Close-Grip EZ-Bar Press; Decline Bench Press; Decline Bench Press (hantle); Decline Close-Grip Bench To Skull Crusher; Floor Press (hantle); Floor Press (sztanga); Floor Press with Chains; Incline Bench Press (hantle); Incline Bench Press (sztanga); JM Press; One Arm Dumbbell Bench Press; One-Arm Kettlebell Floor Press; Pin Press; Reverse Band Bench Press; Reverse Grip Bench Press; Smith Machine Bench Press; Smith Machine Close-Grip Bench Press; Smith Machine Decline Press; Smith Machine Incline Press; Squeeze Press (hantle); Wide-Grip Barbell Bench Press

### hinge (32) — gotowa

Axle Deadlift; Band Good Morning; Cable Deadlift; Cable Pull Through; Clean Deadlift; Deadlift (hantle); Deadlift (sztanga); Deadlift with Bands; Deadlift with Chains; Deficit Deadlift; Good Morning; Good Morning off Pins; Leverage Deadlift; One-Arm Side Deadlift; Rack Pull; Rack Pull with Bands; RDL (hantle/linki); RDL (sztanga); Reverse Band Deadlift; Reverse Band Sumo Deadlift; Rickshaw Deadlift; Single Arm RDL (hantel/linka); Single Leg RDL (hantel); Single Leg RDL (linki); Smith Machine Stiff-Legged Deadlift; Snatch Deadlift; Stiff-Legged Barbell Deadlift; Sumo Deadlift; Sumo Deadlift (kettlebell); Sumo Deadlift with Bands; Sumo Deadlift with Chains; Trap Bar Deadlift

### pushup_plank (30) — do zrobienia

Ab Wheel; Barbell Rollout from Bench; Clock Push-Up; Close-Grip Push-Up; Copenhagen Plank; Decline Push Up; Diamond Push Up; Drop Push; Incline Push Up; Incline Push-Up Close-Grip; Incline Push-Up Depth Jump; Incline Push-Up Reverse Grip; Inverted Row; Isometric Wipers; Mountain Climbers; Plank; Plank Shoulder Taps; Plyo Kettlebell Push-Ups; Plyo Push-Up; Push Up; Push Up to Side Plank; Push-Up Wide; Push-Ups With Feet On A Stability Ball; Renegade Row; Rollout (sztanga); Side Plank; Single-Arm Push-Up; Standing Barbell Rollout; Suspended Fallout; Suspended Push-Up

### dip (5) — do zrobienia

Chest Dip; Dip Machine; Ring Dips; Triceps Dip; Triceps Dips (ławka)

### overhead_press (21) — do zrobienia

Arnold Press; Band Shoulder Press; Bradford Press; Double Kettlebell Press; Handstand Push Up; Kettlebell Arnold Press; Kettlebell Press; Kettlebell Seated Press; Landmine Linear Jammer; Landmine Press; Overhead Press (hantle); Overhead Press (sztanga); Pike Push Up; Push Press; Seated Barbell Military Press; Seated Cable Shoulder Press; Seated Shoulder Press (hantle); See-Saw Press (Alternating Side Press); Single Arm Overhead Press (hantel); Single-Arm Linear Jammer; Wyciskanie nad głowę (linki)

### row (13) — do zrobienia

Barbell Rear Delt Row; Bent Over Row (hantle); Bent Over Row (linki); Bent Over Row (sztanga); Chest Supported Row; Lying T-Bar Row; Meadows Row; One Arm Row (hantle); Pendlay Row; Reverse Grip Bent Over Row; Seal Row (sztanga); Smith Machine Bent Over Row; T-Bar Row

### cable_row (10) — do zrobienia

Cable Rope Rear-Delt Rows; Face Pull; Kneeling High Pulley Row; Leverage High Row; Machine Row; Seated Cable Row; Single Arm Cable Row; Sled Row; Standing Cable Row; Wiosłowanie na linkach (siedząc)

### pull_up (13) — gotowa

Chin Up; Dead Hang; Gironda Sternum Chins; Gorilla Chin/Crunch; Mixed Grip Chin; Muscle Up; Neutral Grip Pull Up; One Arm Chin-Up; Pull Up; Rope Climb; Scapular Pull-Up; Side To Side Chins; Wide-Grip Rear Pull-Up

### pulldown (7) — do zrobienia

Close-Grip Front Lat Pulldown; Full Range-Of-Motion Lat Pulldown; Lat Pulldown; Single Arm Lat Pulldown; Straight Arm Pulldown; Underhand Lat Pulldown; V-Bar Pulldown

### lunge (24) — do zrobienia

Barbell Side Split Squat; Barbell Step Up; Barbell Walking Lunge; Bulgarian Split Squat (hantle); Bulgarian Split Squat (sztanga); Cossack Squat; Crossover Reverse Lunge; Curtsy Lunge; Elevated Back Lunge; Lateral Lunge; Lunge Pass Through; Lunges (hantle); Lunges (sztanga); Pistol Squat; Reverse Lunge; Single-Leg High Box Squat; Slider Reverse Lunge; Smith Machine Bulgarian Split Squat; Smith Machine Pistol Squat; Split Squat; Split Squat (linki); Step Up; Suspended Split Squat; Walking Lunges

### leg_machine (8) — do zrobienia

Belt Squat Machine; Calf Press (leg press); Hack Squat; Leg Press; Lying Machine Squat; Pendulum Squat; Single Leg Press; Smith Machine Leg Press

### leg_isolation (14) — do zrobienia

Glute Ham Raise; Leg Curl; Leg Curl (hantel); Leg Extension; Lying Leg Curl; Nordic Curl; Reverse Nordic; Seated Band Hamstring Curl; Single-Leg Leg Extension; Sissy Squat; Slider Hamstring Curl; Stability Ball Hamstring Curl; Standing Cable Leg Curl; Standing Leg Curl

### calf_raise (13) — do zrobienia

Band Calf Raise; Barbell Seated Calf Raise; Calf Raise (linki); Calf Raise (sztanga); Donkey Calf Raise; Dumbbell Seated One-Leg Calf Raise; Łydki na stopniu; Seated Calf Raise; Seated Calf Raise (hantle); Single Leg Calf Raise; Smith Machine Calf Raise; Smith Machine Reverse Calf Raise; Standing Calf Raise

### hip_bridge (11) — do zrobienia

Frog Pump; Glute Bridge; Glute Bridge (sztanga); Hip Thrust (hantel); Hip Thrust (sztanga); London Bridges; Machine Hip Thrust; Single Leg Glute Bridge; Single Leg Hip Thrust; Smith Machine Hip Thrust; Stability Ball Hip Bridge

### kb_ballistic (17) — do zrobienia

Bottoms-Up Clean From The Hang Position; Double Kettlebell Clean; Double Kettlebell Jerk; Double Kettlebell Push Press; Double Kettlebell Snatch; Dumbbell Clean; Kettlebell Clean; Kettlebell Pirate Ships; Kettlebell Snatch; Kettlebell Sumo High Pull; Kettlebell Swing; One-Arm Kettlebell Clean and Jerk; One-Arm Kettlebell Jerk; One-Arm Kettlebell Push Press; One-Arm Kettlebell Split Jerk; One-Arm Kettlebell Swings; Snatch (hantel)

### olympic (25) — do zrobienia

Barbell Snatch; Block Clean; Block Power Clean; Block Power Snatch; Block Snatch; Clean; Clean and Jerk; Clean Pull; Clean Shrug; Hang Clean; Hang Snatch; Jerk Balance; Jerk Dip Squat; Muscle Snatch; Power Clean; Power Jerk; Power Snatch; Rack Delivery; Snatch Balance; Snatch Pull; Snatch Shrug; Split Clean; Split Jerk; Split Snatch; Squat Jerk

### back_extension (4) — do zrobienia

Back Extension; Lower Back Curl; Reverse Hyperextension; Weighted Ball Hyperextension

### curl (36) — do zrobienia

Barbell Curl; Barbell Preacher Curl; Bayesian Curl; Biceps Curl (hantle); Cable Curl; Cable Curl (dwie linki); Cable Preacher Curl; Concentration Curl (hantle); Cross Body Hammer Curl; Drag Curl; EZ Bar Curl; Hammer Curl; Hammer Curl (linki); High Cable Curl; Incline Curl (hantle); Incline Hammer Curl; Lying Cable Curl; Lying Close-Grip Bar Curl On High Pulley; Lying Supine Dumbbell Curl; Machine Biceps Curl; One Arm Dumbbell Preacher Curl; Preacher Curl; Preacher Curl (EZ); Preacher Hammer Dumbbell Curl; Reverse Cable Curl; Reverse Curl; Reverse EZ-Bar Preacher Curl; Seated Close-Grip Concentration Barbell Curl; Spider Curl; Spider Curl (sztanga); Standing Concentration Curl; Standing Dumbbell Reverse Curl; Standing Inner-Biceps Curl; Standing One-Arm Cable Curl; Zottman Curl; Zottman Preacher Curl

### triceps (32) — do zrobienia

Band Overhead Triceps Extension; Band Skull Crusher; Body-Up; Bodyweight Triceps Extension; Cable Incline Triceps Extension; Cable Lying Triceps Extension; Cable Overhead Extension; Chain Handle Extension; Decline Dumbbell Triceps Extension; Decline EZ Bar Triceps Extension; Dumbbell One-Arm Triceps Extension; Incline Barbell Triceps Extension; Kettlebell Overhead Triceps Extension; Kneeling Cable Triceps Extension; Lying Close-Grip Barbell Triceps Extension Behind The Head; Machine Triceps Extension; One-Arm Lying Dumbbell Triceps Extension; Overhead Triceps Extension (EZ); Overhead Triceps Extension (hantel); Reverse Grip Triceps Pushdown; Single Arm Triceps Pushdown; Skullcrusher (EZ); Skullcrusher (hantle); Skullcrusher (sztanga); Sled Overhead Triceps Extension; Standing Low-Pulley One-Arm Triceps Extension; Standing Overhead Barbell Triceps Extension; Tate Press; Triceps Kickback; Triceps Kickback (linki); Triceps Pushdown; Two-Arm Dumbbell Kickback

### delt_raise (38) — do zrobienia

Alternating Deltoid Raise; Band Lateral Raise; Band Upright Row; Barbell Front Raise to Overhead; Barbell Incline Shoulder Raise; Cable Front Raise; Cable Lateral Raise; Cable Reverse Fly; Cable Seated Lateral Raise; Cable Y Raise; Car Drivers; Dumbbell Front Raise to Overhead; Dumbbell Incline Shoulder Raise; Dumbbell Lying One-Arm Rear Lateral Raise; Dumbbell One-Arm Upright Row; Dumbbell Scaption; Front Incline Dumbbell Raise; Front Plate Raise; Front Raise; Kettlebell Halo; Kettlebell Halo with Overhead Extension; Lateral Raise (hantle); Machine Lateral Raise; One-Arm Cable Rear Lateral Raise; One-Arm Incline Lateral Raise; One-Arm Lateral Raise (hantel); Reverse Fly (hantle); Reverse Pec Deck; Single Dumbbell Front Raise; Sled Reverse Flye; Smith Incline Shoulder Raise; Smith Machine One-Arm Upright Row; Smith Machine Upright Row; Straight Raises on Incline Bench; Upright Row (hantle); Upright Row (linki); Upright Row (sztanga); Y Raise (hantle)

### chest_fly (20) — do zrobienia

Around The Worlds; Band Chest Fly; Bent-Arm Barbell Pullover; Cable Fly; Cable Fly (high to low); Cable Fly (low to high); Chest Fly (hantle); Crucifix; Decline Dumbbell Fly; Flat Bench Cable Fly; Front Raise And Pullover; Incline Cable Fly; Incline Chest Fly (hantle); Machine Pullover; One-Arm Flat Bench Dumbbell Fly; Pec Deck; Pullover (hantel); Single Arm Cable Fly; Svend Press; Wide-Grip Decline Barbell Pullover

### shrug (8) — do zrobienia

Barbell Shrug Behind The Back; Calf-Machine Shoulder Shrug; Leverage Shrug; Middle Back Shrug; Shrugs (hantle); Shrugs (linki); Shrugs (sztanga); Smith Machine Behind the Back Shrug

### rotator_cuff (8) — do zrobienia

Band Pull Apart; Cable Internal Rotation; Cuban Press; External Rotation (hantel); External Rotation (linki); External Rotation with Band; Internal Rotation with Band; Reverse Flyes With External Rotation

### core_floor (44) — do zrobienia

Alternate Heel Touchers; Bicycle Crunch; Bird Dog; Butt-Ups; Cable Crunch; Cable Reverse Crunch; Cable Seated Crunch; Cocoons; Cross-Body Crunch; Crunch; Crunch - Hands Overhead; Crunch - Legs On Exercise Ball; Dead Bug; Decline Crunch; Decline Oblique Crunch; Decline Reverse Crunch; Dragon Flag; Frog Sit-Ups; GHD Sit Up; Hollow Hold; Janda Sit-Up; Kneeling Cable Crunch With Alternating Oblique Twists; Leg Pull-In; Lying Leg Raise; Machine Crunch; Oblique Crunches - On The Floor; Otis-Up; Press Sit-Up; Reverse Crunch; Scissor Kick; Seated Flat Bench Leg Pull-In; Side Jackknife; Sit Up; Smith Machine Hip Raise; Stability Ball Crunch; Stability Ball Knee Tuck; Standing Rope Crunch; Stomach Vacuum; Superman; Suspended Reverse Crunch; Toe Touchers; Tuck Crunch; V-Up; Weighted Sit-Ups - With Bands

### core_hang (4) — do zrobienia

Hanging Knee Raise; Hanging Leg Raise; L-Sit; Toes to Bar

### core_standing (19) — do zrobienia

Barbell Side Bend; Bent Press; Bosu Ball Cable Crunch With Side Bends; Cable Judo Flip; Cable Russian Twists; Cable Woodchop; Double Kettlebell Windmill; Kettlebell Figure 8; Kettlebell Windmill; Landmine Rotation; Medicine Ball Full Twist; One-Arm High-Pulley Cable Side Bends; Pallof Press; Pallof Press With Rotation; Russian Twist; Seated Barbell Twist; Side Bend (hantel); Spell Caster; Weighted Ball Side Bend

### carry (7) — do zrobienia

Double Kettlebell Front Rack Carry; Farmer's Walk; Farmer's Walk (Farmers Handles); Farmer's Walk (trap bar); Overhead Carry (hantle); Rickshaw Carry; Suitcase Carry

### cardio (16) — do zrobienia

Assault Bike; Battle Ropes; Bieg; Burpees; Carioca Quick Step; Fast Skipping; High Knees; Incline Walk (bieżnia); Jumping Jacks; Orbitrek; Rower; Rowing Machine; Skakanka; Ski Erg; Stair Climber; Treadmill Walking

### plyo (28) — do zrobienia

Alternate Leg Diagonal Bound; Alternate Leg Push-Off; Bench Jump; Box Jump; Box Skip; Broad Jump; Depth Jump; Double Leg Butt Kick; Dumbbell Seated Box Jump; Frog Hops; Front Cone Hops; Jump Squat; Kneeling Jump Squat; Lateral Bound; Lateral Box Jump; Lateral Cone Hops; Side Hop-Sprint; Side Standing Long Jump; Side to Side Box Shuffle; Single Leg Butt Kick; Single Leg Push-Off; Single-Leg Hop Progression; Single-Leg Lateral Hop; Single-Leg Stride Jump; Split Jump; Star Jump; Tuck Jump; Weighted Jump Squat

### sled_throw (19) — do zrobienia

Backward Drag; Backward Medicine Ball Throw; Bear Crawl Sled Drag; Medicine Ball Chest Pass; Medicine Ball Scoop Throw; Medicine Ball Slam; One-Arm Medicine Ball Slam; Sled Drag (Harness); Sled Forward Drag with Press; Sled Overhead Backward Walk; Sled Push; Sledgehammer Swings; Spider Crawl; Standing Two-Arm Overhead Throw; Supine Chest Throw; Supine One-Arm Overhead Throw; Supine Two-Arm Overhead Throw; Turkish Get Up; Wall Ball

### strongman (10) — do zrobienia

Atlas Stones; Circus Bell; Conan's Wheel; Jefferson Squat; Keg Load; Log Lift; Power Stairs; Sandbag Load; Tire Flip; Yoke Walk

### glute_floor (7) — do zrobienia

Cable Kickback; Clamshell; Donkey Kick; Fire Hydrant; Hip Extension with Bands; Machine Glute Kickback; Prone Flutter Kicks

### hip_abd_add (8) — do zrobienia

Band Hip Adduction; Cable Hip Abduction; Cable Hip Adduction; Hip Abduction; Hip Adduction; Hip Flexion with Band; Lateral Band Walk; Monster Walk

### mobility_stand (36) — do zrobienia

Ankle Circles; Arm Circles; Chest And Front Of Shoulder Stretch; Chest Stretch on Stability Ball; Chin To Chest Stretch; Cross-Body Shoulder Stretch; Dynamic Back Stretch; Dynamic Chest Stretch; Groiners; Hip Circles (Prone); Inchworm; Iron Crosses (Stretch); Knee Circles; Leg Swings (Front-to-Back); Leg Swings (Side-to-Side); Lying Leg Crossover Swings; One Knee To Chest; Overhead Stretch; Overhead Triceps Stretch; Round The World Shoulder Stretch; Shoulder Circles; Side Neck Stretch; Standing Biceps Stretch; Standing Chest Stretch; Standing Elevated Quad Stretch; Standing Gastrocnemius Calf Stretch; Standing Hip Circles; Standing Lateral Stretch; Standing Pelvic Tilt; Standing Soleus And Achilles Stretch; Standing Toe Touches; Torso Rotation; Wall Calf Stretch; Wall Lat Stretch; World's Greatest Stretch; Wrist Circles

### mobility_floor (22) — do zrobienia

Butterfly Stretch; Cat-Cow; Child's Pose; Downward Facing Balance; Intermediate Groin Stretch; IT Band and Glute Stretch; Kneeling Forearm Stretch; Kneeling Hip Flexor Stretch; Middle Back Stretch; Peroneals Stretch; Posterior Tibialis Stretch; Runner's Stretch; Seated Calf Stretch; Seated Floor Hamstring Stretch; Seated Rotation Stretch; Side Lying Groin Stretch; Side-Lying Quad Stretch; Supine Figure-Four Stretch; Supine Hamstring Stretch; Supine Spinal Twist; The Straddle; Upper Back Stretch

### foam_roll (11) — do zrobienia

Adductor-SMR; Calves-SMR; Foam Roll: Hamstrings; Foam Roll: Quadriceps; Foot-SMR; Iliotibial Tract-SMR; Latissimus Dorsi-SMR; Peroneals-SMR; Piriformis-SMR; Rhomboids-SMR; Wrist Roller

### neck (8) — do zrobienia

Isometric Neck Exercise - Front And Back; Isometric Neck Exercise - Sides; Lying Neck Extension (talerz); Lying Neck Flexion (talerz); Neck Harness Extension; Push Press - Behind the Neck; Standing Barbell Press Behind Neck; Wide-Grip Pulldown Behind The Neck

### forearm (12) — do zrobienia

Barbell Reverse Wrist Curl; Barbell Wrist Curl; Behind-the-Back Barbell Wrist Curl; Cable Wrist Curl; Dumbbell Lying Pronation; Dumbbell Lying Supination; One-Arm Dumbbell Reverse Wrist Curl; One-Arm Dumbbell Wrist Curl; Plate Pinch; Reverse Plate Curls; Reverse Wrist Curl (hantle); Wrist Curl (hantle)

### thruster (3) — do zrobienia

Clean and Press; Kettlebell Thruster; Thruster (hantle)

### chest_press_machine (5) — do zrobienia

Leverage Decline Chest Press; Leverage Incline Chest Press; Machine Chest Press; Machine Shoulder Press; Smith Machine Shoulder Press

### cable_press (4) — do zrobienia

Incline Cable Chest Press; Seated Cable Chest Press; Single Arm Cable Chest Press; Wyciskanie na linkach (stojąc)

### kneeling_hinge (2) — do zrobienia

Kneeling Squat; Seated Good Mornings
