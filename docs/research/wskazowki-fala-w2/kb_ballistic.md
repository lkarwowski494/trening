# Wskazówki techniki — rodzina kb_ballistic, fala W2 (G3 „moc”)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W2, G3). Tylko zbieranie danych — nic nie trafia do `lib/` ani `data/zrodla/*.json` bez integracji (koordynator linii 1.1).
Podstawa: stan W1 po przeliczeniu szczebli 02.11.2026 (`kb_ballistic-cz1.md`, `kb_ballistic-cz2.md`, sekcje „Korekta szczebli…” i „Blok do wdrożenia (po przeliczeniu…)”).
Zasady: CLAUDE.md „Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki”; szczeble wg `szczeble-organizacji-2026-11-02.md` (Onnit, ACE 8250, Dangerously Fit = 5 — nieliczone).
Błąd wnioskowany = logiczne zaprzeczenie potwierdzonego zdania ustawienia/ruchu/wskazówki TEGO ćwiczenia: `["wniosek", "<id>"]`.
Wariant sprzętu/liczby rąk: `uproszczenie: wariant sprzętu <baza>` z uzasadnieniem w nawiasie miejsca. Teksty zdań bez nazw źródeł i organizacji.

## 1. Ćwiczenia — status po W2

| Klucz katalogu | Po W1 (przeliczenie) | Po W2 | Co dodano w W2 |
|---|---|---|---|
| Snatch (hantel) | własna bez błędów | **własna z błędami** | 3 błędy wnioskowane (`kbb.dbMisArmPull` + BarBend wprost, `kbb.mis.softElbow`, `mis.roundBack`) |
| Double Kettlebell Clean | własna bez błędów | **własna z błędami** | 2 błędy wnioskowane (`kbb.mis.castDbl` + uproszczenie z Kettlebell Clean, `kbb.mis.dblNarrow`) |
| One-Arm Kettlebell Jerk | własna bez błędów | **własna z błędami** | 3 błędy wnioskowane (`kbj.mis.early`, `kbj.mis.pressOut`, `kbj.mis.lean` + StrongFirst wprost) |
| Double Kettlebell Jerk | własna bez błędów | **własna z błędami** | jw. |
| Kettlebell Clean | otwarta (brak ustawienia) | **własna z błędami** | ustawienie `kbb.bellSetup` (BarBend + StrongFirst/Bolyard — nowe drugie źródło) |
| Kettlebell Snatch | otwarta (brak ustawienia i ruchu) | **własna z błędami** | `kbb.bellSetup` i `kbb.snatchMove` (nowe brzmienie) — StrongFirst + BarBend (kroki „Step One–Three”, przeczytane w W2) |
| One-Arm Kettlebell Swings | otwarta | **własna z błędami — uproszczenie** | ACE 392 wprost + ExRx (wersja oburącz) jako `uproszczenie: wariant sprzętu Kettlebell Swing`; 2 błędy wnioskowane |
| Double Kettlebell Push Press | otwarta (brak ustawienia) | **własna z błędami** | `kbb.rackStartDbl` (CrossFit + BarBend „from the racked position”); błąd wnioskowany `kbpp.mis.noLegs` |
| One-Arm Kettlebell Push Press | otwarta (brak ustawienia) | **własna z błędami** | `kbb.rackStart` (jw.); błąd wnioskowany `kbpp.mis.noLegs` |
| One-Arm Kettlebell Clean and Jerk | otwarta (brak ustawienia) | **własna z błędami** (zależna od „tej samej fazy” — decyzja audytora z W1) | `kbb.bellSetup` (ta sama faza: zarzut); błędy wnioskowane z fazy podrzutu |
| Double Kettlebell Snatch | otwarta | **własna z błędami — uproszczenie** | `kbb.dblStance` (uproszczenie: Double KB Clean), `kbb.dblSnatchMove`, `kbb.mis.bang` (uproszczenie: Kettlebell Snatch) |
| Dumbbell Clean | otwarta | **warunkowo własna z błędami** — zależy od szczebla REP Fitness (blok warunkowy) | CrossFit „Dumbbell Power Clean” (05.03.2020) + REP Fitness; 2 błędy (CrossFit wprost + wniosek) |
| One-Arm Kettlebell Split Jerk | otwarta | otwarta | brak drugiego źródła (sekcja 5) |
| Kettlebell Sumo High Pull | otwarta | otwarta | Prehab Guys — strona bez autora → nieliczona |
| Bottoms-Up Clean From The Hang Position | otwarta | otwarta | brak źródeł szczebla 4 |
| Kettlebell Pirate Ships | otwarta | otwarta | nie szukano ponownie (W1: brak źródeł szczebla 4) |

Wynik: 12 kart własnych z błędami (w tym 1 warunkowa — Dumbbell Clean), 0 bez błędów, 4 otwarte.

## 2. Blok do wdrożenia

Pełne karty po W2. Zdania i miejsca z W1 przepisane z bloków „po przeliczeniu” (źródła przeczytane w W1); nowe miejsca — przeczytane w W2 (sekcja 4).
Źródła `exrx-Kettlebell/KBTwoArmSwing`, `ace-391`, organizacje `ACE`, `BarBend` — istnieją w `data/zrodla/cues.json`. `StrongFirst`, `Rogue`, `CrossFit` — definicje z bloków W1.

### Blok do wdrożenia

```json
{
 "orgs": {
  "StrongFirst": {"name": "StrongFirst — artykuły instruktorów szkoły kettlebell (strongfirst.com)", "level": 4, "kind": "org"},
  "Rogue": {"name": "Rogue Fitness — Movement Library producenta sztang i hantli (roguefitness.com/theindex); liczona tylko dla własnego rodzaju sprzętu", "level": 4, "kind": "maker"},
  "CrossFit": {"name": "CrossFit — Essentials (crossfit.com; organizacja certyfikująca trenerów)", "level": 4, "kind": "org"}
 },
 "sources": {
  "barbend-db-snatch": {"org": "BarBend", "title": "Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)", "url": "https://barbend.com/dumbbell-snatch/", "level": 4},
  "rogue-alt-db-snatch": {"org": "Rogue", "title": "Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)", "url": "https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch", "level": 4},
  "ace-5386-adv-kb": {"org": "ACE", "title": "Advanced Kettlebell Workout for Increased Strength and Conditioning (ACE, 21.04.2015)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4},
  "barbend-kb-clean": {"org": "BarBend", "title": "Kettlebell Clean (D. Fraiser, Canadian Kettlebell Instructor, 25.09.2023)", "url": "https://barbend.com/kettlebell-clean/", "level": 4},
  "barbend-kb-snatch": {"org": "BarBend", "title": "Kettlebell Snatch (A. Polish, NASM-CNC, ACE-CPT, SITA-SIFS; 09.08.2023)", "url": "https://barbend.com/kettlebell-snatch/", "level": 4},
  "sf-pak-clean": {"org": "StrongFirst", "title": "An Olympic Weightlifting Approach to Coaching the Kettlebell Clean (J. Pak, 2015)", "url": "https://www.strongfirst.com/an-olympic-weightlifting-approach-to-coaching-the-kettlebell-clean/", "level": 4},
  "sf-bolyard-kur": {"org": "StrongFirst", "title": "The Kur for Your Kettlebell Swing and Clean (K. Bolyard, Certified Team Leader; ok. 01.2025)", "url": "https://www.strongfirst.com/the-kur-for-your-kettlebell-swing-and-clean/", "level": 4},
  "sf-tsar-snatch": {"org": "StrongFirst", "title": "The Snatch: The Tsar of Kettlebell Lifts", "url": "https://www.strongfirst.com/the-snatch-the-tsar-of-kettlebell-lifts/", "level": 4},
  "sf-lions-roar-snatch": {"org": "StrongFirst", "title": "Lion's Roar Kettlebell Snatch (P. Macek)", "url": "https://www.strongfirst.com/lions-roar-kettlebell-snatch/", "level": 4},
  "sf-chains-dbl-snatch": {"org": "StrongFirst", "title": "Improve Your Double Kettlebell Snatch", "url": "https://www.strongfirst.com/improve-your-double-kettlebell-snatch/", "level": 4},
  "sf-free-hand": {"org": "StrongFirst", "title": "Free Hand One-Arm Swing (B. Jones, ok. 05.2016)", "url": "https://www.strongfirst.com/free-hand-one-arm-swing/", "level": 4},
  "sf-go-ballistic-jerk": {"org": "StrongFirst", "title": "Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia, Certified Senior Instructor)", "url": "https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/", "level": 4},
  "ace-392": {"org": "ACE", "title": "Single-arm Swing (#392)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/392/single-arm-swing/", "level": 4},
  "ace-385": {"org": "ACE", "title": "Push-jerk (#385; kettlebells)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/", "level": 4},
  "cf-dkb-pp-jerk": {"org": "CrossFit", "title": "Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)", "url": "https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk", "level": 4},
  "barbend-kb-jerk-vs-pp": {"org": "BarBend", "title": "Kettlebell Jerk vs Push Press (M. Dewar, CSCS, MS fizjologia wysiłku; akt. 24.08.2023)", "url": "https://barbend.com/kettlebell-jerk-vs-push-press", "level": 4}
 },
 "exercises": {
  "Snatch (hantel)": {
   "setup": [{"c": "kbb.dbSnatchSetup", "s": [["barbend-db-snatch", "Step 1: Squat Down (dumbbell directly below you; chest up; back flat)"], ["rogue-alt-db-snatch", "Set Up (dumbbell between your feet; hinge; deadlift set up; flat back)"]]}],
   "move": [{"c": "kbb.dbSnatchMove", "s": [["barbend-db-snatch", "Step 2–3 (forcefully extend your body; extend the arm from underneath; elbow locked out)"], ["rogue-alt-db-snatch", "Execution (drive the floor away; extend hips and knees, shrug; pull and punch overhead)"]]}],
   "tips": [
    {"c": "kbb.dbArmLate", "s": [["barbend-db-snatch", "Common Mistakes: Pulling With Your Arms (legs and hips do the work in the first half)"], ["rogue-alt-db-snatch", "Execution (Only use the arm after extending the hips and knees)"]]},
    {"c": "kbb.lockout", "s": [["barbend-db-snatch", "Step 3–4 (elbow is locked out)"], ["rogue-alt-db-snatch", "Execution (Arm locked out)"]]}
   ],
   "mistakes": [
    {"c": "kbb.dbMisArmPull", "s": [["wniosek", "kbb.dbArmLate"], ["barbend-db-snatch", "Common Mistakes: Pulling With Your Arms"]]},
    {"c": "kbb.mis.softElbow", "s": [["wniosek", "kbb.lockout"]]},
    {"c": "mis.roundBack", "s": [["wniosek", "kbb.dbSnatchSetup"]]}
   ]
  },
  "Double Kettlebell Clean": {
   "setup": [{"c": "kbb.dblStance", "s": [["ace-5386-adv-kb", "Double Kettlebell Swing (feet wider than hip-width apart)"], ["barbend-kb-clean", "Double Kettlebell Clean (wider stance to hike both bells between your legs)"]]}],
   "move": [{"c": "kbb.dblCleanMove", "s": [["ace-5386-adv-kb", "Double Kettlebell Clean (after hip extension pull the kettlebell in, rotate around the wrist, finish in the rack)"], ["barbend-kb-clean", "Double Kettlebell Clean (same form as the single-arm clean) + Steps 2–4"]]}],
   "tips": [],
   "mistakes": [
    {"c": "kbb.mis.castDbl", "s": [["wniosek", "kbb.dblCleanMove"], ["sf-pak-clean", "Common mistakes: casting the bell (uproszczenie: wariant sprzętu Kettlebell Clean — dwa odważniki zamiast jednego, ten sam tor; BarBend: same form as the single-arm clean)"], ["barbend-kb-clean", "Common Mistakes: Casting the bell out (uproszczenie: wariant sprzętu Kettlebell Clean)"]]},
    {"c": "kbb.mis.dblNarrow", "s": [["wniosek", "kbb.dblStance"]]}
   ]
  },
  "One-Arm Kettlebell Jerk": {
   "setup": [{"c": "kbj.rack", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (single kettlebell or pair; elbow down and close to your ribs)"], ["cf-dkb-pp-jerk", "The Rack (elbows directly over the hips; no space between arms and torso) (wariant: dwa kettlebelle)"], ["ace-385", "opis (elbows close to the rib cage) (wariant: dwa kettlebelle, podrzut nożycowy)"]]}],
   "move": [{"c": "kbj.move", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5"], ["barbend-kb-jerk-vs-pp", "Kettlebell Jerk (leg and hip drive; bend knees, hips and ankles to receive the load)"], ["cf-dkb-pp-jerk", "Jerk (drop under the weight; then stand) (wariant: dwa kettlebelle)"]]}],
   "tips": [
    {"c": "kbb.wrist", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (straight wrists)"], ["cf-dkb-pp-jerk", "The Rack (straight or just slightly flexed — część wspólna: prosto) (wariant: dwa kettlebelle)"]]},
    {"c": "kbb.dip", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (dip straight down)"], ["cf-dkb-pp-jerk", "Jerk, krok 2 (dip slightly, torso upright) (wariant: dwa kettlebelle)"]]},
    {"c": "kbj.fullExt", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, krok 3 (bells stay in the rack until hips and knees have fully extended)"], ["cf-dkb-pp-jerk", "Jerk (extend the hips completely before the second dip) (wariant: dwa kettlebelle)"]]},
    {"c": "kbj.lockFirst", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5"], ["cf-dkb-pp-jerk", "Jerk („drop and lock”; then extend the knees) (wariant: dwa kettlebelle)"]]}
   ],
   "mistakes": [
    {"c": "kbj.mis.early", "s": [["wniosek", "kbj.fullExt"]]},
    {"c": "kbj.mis.pressOut", "s": [["wniosek", "kbj.lockFirst"]]},
    {"c": "kbj.mis.lean", "s": [["wniosek", "kbb.dip"], ["sf-go-ballistic-jerk", "Ways To Improve Your Jerk (the bend comes at the knees and ankles, not the hips, or else you risk falling forward)"]]}
   ]
  },
  "Double Kettlebell Jerk": {
   "setup": [{"c": "kbj.rack", "s": [["cf-dkb-pp-jerk", "The Rack (elbows directly over the hips)"], ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (pair of kettlebells; elbow close to the ribs)"], ["ace-385", "opis (elbows close to the rib cage) (wariant: podrzut nożycowy)"]]}],
   "move": [{"c": "kbj.move", "s": [["cf-dkb-pp-jerk", "Jerk, kroki 1–5"], ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5 (one arm or both)"], ["barbend-kb-jerk-vs-pp", "Kettlebell Jerk"]]}],
   "tips": [
    {"c": "kbb.wrist", "s": [["cf-dkb-pp-jerk", "The Rack (straight or just slightly flexed)"], ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (straight wrists)"]]},
    {"c": "kbb.dip", "s": [["cf-dkb-pp-jerk", "Jerk, krok 2 (dip slightly, torso upright)"], ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (dip straight down)"]]},
    {"c": "kbj.fullExt", "s": [["cf-dkb-pp-jerk", "Jerk (extend the hips completely before the second dip)"], ["sf-go-ballistic-jerk", "kettlebell jerk, krok 3"]]},
    {"c": "kbj.lockFirst", "s": [["cf-dkb-pp-jerk", "Jerk („drop and lock”; then extend the knees)"], ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5"]]}
   ],
   "mistakes": [
    {"c": "kbj.mis.early", "s": [["wniosek", "kbj.fullExt"]]},
    {"c": "kbj.mis.pressOut", "s": [["wniosek", "kbj.lockFirst"]]},
    {"c": "kbj.mis.lean", "s": [["wniosek", "kbb.dip"], ["sf-go-ballistic-jerk", "Ways To Improve Your Jerk (bend at the knees and ankles, not the hips, or risk falling forward)"]]}
   ]
  },
  "Kettlebell Clean": {
   "setup": [{"c": "kbb.bellSetup", "s": [["barbend-kb-clean", "Step 1: Get Set, With Square Hips (bell about a foot in front; hinge and grab the handle)"], ["sf-bolyard-kur", "Clean setup (toes close to the kettlebell, about one foot-width away; hinge back into an athletic stance)"]]}],
   "move": [{"c": "kbb.cleanMove", "s": [["sf-pak-clean", "Low Swing High Pull (clean = swing redirected vertically into the rack)"], ["barbend-kb-clean", "Steps 2–4 (hike between the legs, drive hips forward, bell to the front rack)"]]}],
   "tips": [
    {"c": "kbb.rack", "s": [["sf-pak-clean", "Elbow and Hand (elbow attached to the rib cage)"], ["barbend-kb-clean", "Step 4 (elbow against your torso, bell in the rack)"]]},
    {"c": "kb.hips", "s": [["sf-pak-clean", "Low Swing High Pull (arms assist the leg drive)"], ["barbend-kb-clean", "Common Mistakes: Curling the bell (trust the power created by your hips)"]]}
   ],
   "mistakes": [
    {"c": "kbb.mis.armPull", "s": [["sf-pak-clean", "Common mistakes: arms overpowering the legs"], ["barbend-kb-clean", "Common Mistakes: Curling the bell"]]},
    {"c": "kbb.mis.cast", "s": [["sf-pak-clean", "Common mistakes: casting the bell"], ["barbend-kb-clean", "Common Mistakes: Casting the bell out"]]}
   ]
  },
  "Kettlebell Snatch": {
   "setup": [{"c": "kbb.bellSetup", "s": [["sf-tsar-snatch", "streszczenie na początku (start with a kettlebell on the ground in front of you)"], ["barbend-kb-snatch", "Step One: One-Handed Kettlebell Swing — ustawienie z progresji swingu (bell in front of you; hinge at the hips; grip the handle)"]]}],
   "move": [{"c": "kbb.snatchMove", "s": [["sf-tsar-snatch", "streszczenie na początku (swing it back between your legs … overhead lockout in one uninterrupted motion)"], ["barbend-kb-snatch", "Step One–Three (one-handed swing → high pull → use the momentum to push your hand through the bell into the top snatch position)"]]}],
   "tips": [{"c": "kbb.punch", "s": [["sf-lions-roar-snatch", "lista „eightfold path” (fast spear through the handle at about your eyes level)"], ["barbend-kb-snatch", "Step Three: Push Through; Common Mistakes: Keeping the lifting arm straight"]]}],
   "mistakes": [{"c": "kbb.mis.bang", "s": [["sf-lions-roar-snatch", "spear through the handle — to avoid banging the forearm"], ["barbend-kb-snatch", "Common Mistakes: Keeping the lifting arm straight (bell flops onto the forearm)"]]}]
  },
  "One-Arm Kettlebell Swings": {
   "setup": [{"c": "kbb.swing1Setup", "s": [["ace-392", "opis (feet shoulder-width apart; hold a kettlebell with the right hand; keep the back straight and sink back into the hips)"], ["exrx-Kettlebell/KBTwoArmSwing", "Preparation (feet slightly wider than shoulder width; bend at hip, back straight) (uproszczenie: wariant sprzętu Kettlebell Swing — różni się tylko chwyt jedną ręką; ustawienie i zawias biodrowy te same)"]]}],
   "move": [{"c": "kb.move", "s": [["ace-392", "opis (sink back into the hips to pull the kettlebell back between the legs; push the hips forward to swing it up in front of the body)"], ["exrx-Kettlebell/KBTwoArmSwing", "Execution (uproszczenie: wariant sprzętu Kettlebell Swing)"]]}],
   "tips": [
    {"c": "kb.hips", "s": [["ace-392", "opis (Tip: strength from the legs and hips, NOT the shoulders)"], ["exrx-Kettlebell/KBTwoArmSwing", "Comments (hips primarily drive) (uproszczenie: wariant sprzętu Kettlebell Swing)"]]},
    {"c": "hinge.back", "s": [["ace-392", "opis (keep the back straight)"], ["exrx-Kettlebell/KBTwoArmSwing", "Comments (back taut) (uproszczenie: wariant sprzętu Kettlebell Swing)"]]},
    {"c": "kbb.freeArm", "s": [["ace-392", "opis (allow the left arm to swing back … then swing it forward)"], ["sf-free-hand", "opcje wolnej ręki (ręka może iść razem z ręką pracującą)"]]}
   ],
   "mistakes": [
    {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]},
    {"c": "kbb.mis.armPull", "s": [["wniosek", "kb.hips"]]}
   ]
  },
  "Double Kettlebell Push Press": {
   "setup": [{"c": "kbb.rackStartDbl", "s": [["cf-dkb-pp-jerk", "The Rack; Push Press (start with the kettlebells firmly racked)"], ["barbend-kb-jerk-vs-pp", "The Push Press (accelerate the load from the racked position into a vertical trajectory)"]]}],
   "move": [{"c": "kbpp.move", "s": [["cf-dkb-pp-jerk", "Push Press (dip, drive, knees and elbows straight at the end)"], ["barbend-kb-jerk-vs-pp", "The Push Press (leg and hip drive, then the upper body pushes overhead)"]]}],
   "tips": [{"c": "pp.legs", "s": [["cf-dkb-pp-jerk", "Push Press (the hip drive is the power behind the movement)"], ["barbend-kb-jerk-vs-pp", "The Push Press (leg and hip strength accelerate the load)"]]}],
   "mistakes": [
    {"c": "kbpp.mis.rebend", "s": [["cf-dkb-pp-jerk", "Push Press (no rebend, or „double dip”)"], ["barbend-kb-jerk-vs-pp", "The Push Press (knees, ankles and hips are not rebent after the leg drive)"]]},
    {"c": "kbpp.mis.noLegs", "s": [["wniosek", "pp.legs"]]}
   ]
  },
  "One-Arm Kettlebell Push Press": {
   "setup": [{"c": "kbb.rackStart", "s": [["cf-dkb-pp-jerk", "The Rack; Push Press (kettlebells firmly racked) (wariant: dwa kettlebelle)"], ["barbend-kb-jerk-vs-pp", "The Push Press (from the racked position)"]]}],
   "move": [{"c": "kbpp.move", "s": [["cf-dkb-pp-jerk", "Push Press (dip, drive, knees and elbows straight) (wariant: dwa kettlebelle)"], ["barbend-kb-jerk-vs-pp", "The Push Press"]]}],
   "tips": [{"c": "pp.legs", "s": [["cf-dkb-pp-jerk", "Push Press (hip drive is the power behind the movement) (wariant: dwa kettlebelle)"], ["barbend-kb-jerk-vs-pp", "The Push Press"]]}],
   "mistakes": [
    {"c": "kbpp.mis.rebend", "s": [["cf-dkb-pp-jerk", "Push Press (no rebend) (wariant: dwa kettlebelle)"], ["barbend-kb-jerk-vs-pp", "The Push Press (not rebent following the initial leg drive)"]]},
    {"c": "kbpp.mis.noLegs", "s": [["wniosek", "pp.legs"]]}
   ]
  },
  "One-Arm Kettlebell Clean and Jerk": {
   "setup": [{"c": "kbb.bellSetup", "s": [["barbend-kb-clean", "Step 1 (ta sama faza: zarzut)"], ["sf-bolyard-kur", "Clean setup (ta sama faza: zarzut)"]]}],
   "move": [
    {"c": "kbcj.move", "s": [["cf-dkb-pp-jerk", "Jerk, krok 1 (clean to the rack), kroki 2–5 (jerk) (wariant: dwa kettlebelle)"], ["ace-385", "opis (bells from the floor to the rack; then the jerk) (wariant: dwa kettlebelle, podrzut nożycowy)"]]},
    {"c": "kbb.cleanMove", "s": [["sf-pak-clean", "Low Swing High Pull (ta sama faza: zarzut)"], ["barbend-kb-clean", "Steps 2–4 (ta sama faza: zarzut)"]]}
   ],
   "tips": [
    {"c": "kbb.rack", "s": [["sf-pak-clean", "Elbow and Hand (ta sama faza: zarzut)"], ["barbend-kb-clean", "Step 4 (ta sama faza: zarzut)"]]},
    {"c": "kbb.dip", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (ta sama faza: podrzut)"], ["cf-dkb-pp-jerk", "Jerk, krok 2 (ta sama faza: podrzut; wariant: dwa kettlebelle)"]]},
    {"c": "kbj.lockFirst", "s": [["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5 (ta sama faza: podrzut)"], ["cf-dkb-pp-jerk", "Jerk („drop and lock”) (ta sama faza: podrzut; wariant: dwa kettlebelle)"]]}
   ],
   "mistakes": [
    {"c": "kbb.mis.cast", "s": [["sf-pak-clean", "Common mistakes: casting the bell (ta sama faza: zarzut)"], ["barbend-kb-clean", "Common Mistakes: Casting the bell out (ta sama faza: zarzut)"]]},
    {"c": "kbb.mis.armPull", "s": [["sf-pak-clean", "Common mistakes: arms overpowering the legs (ta sama faza: zarzut)"], ["barbend-kb-clean", "Common Mistakes: Curling the bell (ta sama faza: zarzut)"]]},
    {"c": "kbj.mis.pressOut", "s": [["wniosek", "kbj.lockFirst"]]},
    {"c": "kbj.mis.lean", "s": [["wniosek", "kbb.dip"], ["sf-go-ballistic-jerk", "Ways To Improve Your Jerk (ta sama faza: podrzut)"]]}
   ]
  },
  "Double Kettlebell Snatch": {
   "setup": [{"c": "kbb.dblStance", "s": [["ace-5386-adv-kb", "Double Kettlebell Swing (feet wider than hip-width apart) (uproszczenie: wariant Double Kettlebell Clean — ten sam przerzut obu odważników między nogami)"], ["barbend-kb-clean", "Double Kettlebell Clean (wider stance to hike both bells between your legs) (uproszczenie: jw.)"]]}],
   "move": [{"c": "kbb.dblSnatchMove", "s": [["sf-chains-dbl-snatch", "„Using Chains…” (hip finish → bells float up; punch straight up)"], ["barbend-kb-snatch", "Double Kettlebell Snatch (same technical movements, a bell in each hand) + Step One–Three (uproszczenie: wariant sprzętu Kettlebell Snatch)"]]}],
   "tips": [],
   "mistakes": [
    {"c": "kbb.mis.bang", "s": [["sf-lions-roar-snatch", "spear through the handle — to avoid banging the forearm (uproszczenie: wariant sprzętu Kettlebell Snatch — BarBend: same technical movements)"], ["barbend-kb-snatch", "Common Mistakes: Keeping the lifting arm straight (uproszczenie: wariant sprzętu Kettlebell Snatch)"]]},
    {"c": "kbb.mis.dblNarrow", "s": [["wniosek", "kbb.dblStance"]]}
   ]
  }
 }
}
```

### Blok warunkowy — Dumbbell Clean (tylko jeśli koordynator uzna REP Fitness za szczebel 4)

```json
{
 "orgs": {"REP Fitness": {"name": "REP Fitness — poradniki producenta hantli (repfitness.com/blogs/training); liczona tylko dla własnego rodzaju sprzętu", "level": 4, "kind": "maker"}},
 "sources": {
  "cf-db-power-clean": {"org": "CrossFit", "title": "The Dumbbell Power Clean (CrossFit Essentials, 05.03.2020)", "url": "https://crossfit.com/essentials/the-dumbbell-power-clean", "level": 4},
  "rep-db-clean": {"org": "REP Fitness", "title": "How to Master the Dumbbell Clean (A. Gutman, NASM-CPT; 10.09.2025, akt. 03.08.2026)", "url": "https://repfitness.com/blogs/training/how-to-dumbbell-clean", "level": 4}
 },
 "exercises": {
  "Dumbbell Clean": {
   "setup": [{"c": "kbb.dbCleanSetup", "s": [["cf-db-power-clean", "Starting position (feet approximately hip-width and inside of the dumbbells)"], ["rep-db-clean", "Steps — starting position (feet hip-width, a dumbbell on either side of you; push your hips back)"]]}],
   "move": [{"c": "kbb.dbCleanMove", "s": [["cf-db-power-clean", "Movement (extend the legs and hips fully; violent shrug and pull; receive in a partial front squat)"], ["rep-db-clean", "Steps (snap hips forward, shrug; quickly drop under the weight with a slight knee bend until the dumbbells rest on your shoulders)"]]}],
   "tips": [{"c": "kbb.dbArmsLate", "s": [["cf-db-power-clean", "Movement (arms remain straight in the deadlift phase); Faults (shoulders should not shrug until the hips and knees have fully extended)"], ["rep-db-clean", "Common Mistakes: Incorrect Sequencing (hip snap, then shoulder-driven pull)"]]}],
   "mistakes": [
    {"c": "kbb.mis.dbEarlyPull", "s": [["wniosek", "kbb.dbArmsLate"], ["cf-db-power-clean", "Faults (shrugging or pulling early)"]]},
    {"c": "kbb.mis.shortExt", "s": [["wniosek", "kbb.dbCleanMove"], ["cf-db-power-clean", "Faults (cut this extension short by not fully extending the hips)"]]}
   ]
  }
 }
}
```

Bez REP Fitness: Dumbbell Clean = otwarta (tylko CrossFit; Human Kinetics/Shimonek nieliczony — sekcja 4).

## 3. Zdania

Istniejące w `lib/cues/text/pl.json` (bez zmian): `kb.hips`, `kb.move`, `hinge.back`, `mis.roundBack`, `pp.legs`.
Zdania z W1 (jeszcze nie w `pl.json`) użyte bez zmian: `kbb.dbSnatchSetup`, `kbb.dbSnatchMove`, `kbb.dbArmLate`, `kbb.lockout`, `kbb.dbMisArmPull`, `kbb.dblStance`, `kbb.dblCleanMove`,
`kbb.cleanMove`, `kbb.rack`, `kbb.mis.armPull`, `kbb.mis.cast`, `kbb.punch`, `kbb.mis.bang`, `kbb.freeArm`, `kbj.rack`, `kbj.move`, `kbb.wrist`, `kbb.dip`, `kbj.fullExt`, `kbj.lockFirst`,
`kbb.rackStart`, `kbpp.move`, `kbpp.mis.rebend`, `kbcj.move` (treść — pliki W1, sekcja 3).
Zastąpione: `kbb.cleanSetup` i `kbb.snatchSetup` z W1 → jedno `kbb.bellSetup` (część wspólna czterech źródeł; szerokość stóp podawało tylko jedno źródło na ćwiczenie).

| id | PL | EN (propozycja) | uwaga |
|---|---|---|---|
| kbb.bellSetup | Postaw kettlebell przed stopami, cofnij biodra i chwyć uchwyt. | Set the kettlebell in front of your feet, push your hips back and grab the handle. | nowe; zastępuje `kbb.cleanSetup`/`kbb.snatchSetup` |
| kbb.snatchMove | Przerzuć kettlebell między nogami jak przy swingu i jednym ruchem doprowadź go nad głowę. | Hike the bell between your legs like a swing and take it overhead in one move. | NOWE BRZMIENIE (W1: „…mocno wypchnij biodra… na prostą rękę”) — prosta ręka i biodra tylko w jednym źródle |
| kbb.swing1Setup | Stopy mniej więcej na szerokość barków; pochyl się w biodrach z prostymi plecami i chwyć kettlebell jedną ręką. | Feet about shoulder-width; hinge at the hips with a flat back and grab the kettlebell with one hand. | nowe |
| kbb.rackStartDbl | Zacznij z kettlebellami w pozycji przy barkach. | Start with the kettlebells racked at your shoulders. | nowe (liczba mnoga do `kbb.rackStart`) |
| kbb.dblSnatchMove | Przerzuć oba kettlebelle między nogami jak przy swingu i jednym ruchem doprowadź je nad głowę. | Hike both bells between your legs like a swing and take them overhead in one move. | nowe |
| kbb.mis.softElbow | Na górze łokieć zostaje ugięty — ręka nie jest wyprostowana. | Your elbow stays bent at the top — the arm isn't locked out. | błąd wnioskowany |
| kbb.mis.castDbl | Kettlebelle odjeżdżają łukiem od ciała, zamiast iść w górę blisko ciebie. | The bells swing out in an arc instead of travelling up close to you. | błąd (liczba mnoga do `kbb.mis.cast`) |
| kbb.mis.dblNarrow | Stoisz za wąsko i kettlebelle nie mieszczą się swobodnie między nogami. | Your stance is too narrow, so the bells don't fit easily between your legs. | błąd wnioskowany |
| kbj.mis.early | Schodzisz pod ciężar, zanim do końca wyprostujesz nogi i biodra. | Dropping under the weight before your legs and hips have fully straightened. | błąd wnioskowany |
| kbj.mis.pressOut | Wstajesz, zanim zablokujesz ciężar nad głową, i dopychasz go dopiero na stojąco. | Standing up before the weight is locked out, then pressing it out once you're up. | błąd wnioskowany |
| kbj.mis.lean | Przy ugięciu tułów pochyla się w przód. | Your torso tips forward in the dip. | błąd wnioskowany + StrongFirst |
| kbpp.mis.noLegs | Wyciskasz ciężar samymi rękami, bez wybicia z nóg. | Pressing with your arms alone, without the leg drive. | błąd wnioskowany |
| kbb.dbCleanSetup | Stopy na szerokość bioder, po hantlu w każdej ręce po bokach nóg; cofnij biodra. | Feet hip-width, a dumbbell in each hand at your sides; push your hips back. | warunkowe (Dumbbell Clean) |
| kbb.dbCleanMove | Mocno wyprostuj biodra i kolana, unieś barki i podciągnij hantle, a potem szybko zejdź pod nie i przyjmij je na barki na lekko ugiętych nogach. | Drive your hips and knees straight, shrug and pull the dumbbells up, then drop quickly under them and catch them on your shoulders with soft knees. | warunkowe |
| kbb.dbArmsLate | Barki i ręce włączają się dopiero po pełnym wyproście bioder i kolan. | Your shoulders and arms only kick in once your hips and knees are fully straight. | warunkowe |
| kbb.mis.dbEarlyPull | Ciągniesz hantle rękami, zanim biodra i kolana się wyprostują. | Pulling the dumbbells with your arms before your hips and knees straighten. | warunkowe |
| kbb.mis.shortExt | Skracasz wybicie — biodra nie prostują się do końca. | Cutting the drive short — your hips don't fully straighten. | warunkowe |

Uwagi: `kbpp.move` mówi „wyprostu rąk” — w One-Arm Push Press tłumacz może dać wariant „ręki” (uwaga z W1). `mis.roundBack` („…żeby dociągnąć ciężar”) w snatchu hantlem i swingu jednorącz dotyczy startu/opuszczania — brzmienie pasuje.
`kbb.mis.bang` w Double Kettlebell Snatch — liczba pojedyncza czytana jako „każdy kettlebell”; jeśli recenzja woli mnogą — osobne id.

## 4. Źródła przeczytane w W2

| id | adres | organizacja | szczebel | co przeczytano / dowód szczebla |
|---|---|---|---|---|
| sf-bolyard-kur | https://www.strongfirst.com/the-kur-for-your-kettlebell-swing-and-clean/ | StrongFirst | 4 | autor Kenneth Bolyard, „StrongFirst Certified Team Leader and Elite instructor”; data nie podana (komentarze 30.01–03.02.2025). Sekcja o ustawieniu zarzutu: „Begin by standing with your toes close to the kettlebell (approximately one foot-width away from the bell).” Chwytu przy zarzucie nie opisuje. Ta sama organizacja co sf-pak-clean (jedno źródło StrongFirst na zdanie) |
| barbend-kb-snatch | https://barbend.com/kettlebell-snatch/ | BarBend | 4 | Alex Polish, NASM-CNC, ACE-CPT, SITA-SIFS; „Last updated” 09.08.2023; bez etykiety „Expert Verified”. Kroki „Step Zero–Five” (swing jednorącz → high pull → „push your hand through the bell and into the top snatch position”), ustawienie z progresji swingu (dzwon przed sobą, zawias biodrowy, chwyt oburącz w swingu), „Top 3 Kettlebell Snatch Mistakes”, wariant Double |
| barbend-kb-jerk-vs-pp | https://barbend.com/kettlebell-jerk-vs-push-press | BarBend | 4 | Mike Dewar, CSCS, MS fizjologii wysiłku; akt. 24.08.2023. Sekcja „The Push Press”: ciężar przyspieszany „from the racked position into a vertical trajectory”; sekcja dotyczy dowolnego przyrządu w artykule o kettlebellu |
| sf-go-ballistic-jerk | https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/ | StrongFirst | 4 | (ponownie) „Ways To Improve Your Jerk”: „The bend during the dip comes at the knees and ankles not the hips or else your risk falling forward.” Opuszczania do pozycji przy barku nie opisuje → `kbb.lower` nadal jedno źródło |
| ace-392 | https://www.acefitness.org/resources/everyone/exercise-library/392/single-arm-swing/ | ACE | 4 | biblioteka ćwiczeń ACE, treść firmowana. „Keep the back straight and sink back slightly into the hips” …; wskazówka o sile z nóg i bioder; wolna ręka. Start z kettlebellem w dłoni (nie z podłogi) |
| cf-db-power-clean | https://crossfit.com/essentials/the-dumbbell-power-clean | CrossFit | 4 | CrossFit Essentials, 05.03.2020. Start z podłogi („feet start at approximately hip-width and inside of the dumbbells”), neutralny kręgosłup, pełny wyprost, przyjęcie w częściowym przysiadzie przednim; błędy: biodra za wysoko, za wczesny skok, wczesne wzruszenie barków, niepełny wyprost bioder, za szerokie stopy przy przyjęciu |
| rep-db-clean | https://repfitness.com/blogs/training/how-to-dumbbell-clean | REP Fitness (producent hantli) | **warunkowo 4 — do decyzji koordynatora** | autor Andrew Gutman, „NASM-CPT and health and fitness journalist”; 10.09.2025, akt. 03.08.2026; cytowany ekspert CSCS. Za 4: producent — instrukcja własnego rodzaju sprzętu (jak Rogue), autor z certyfikatem trenerskim i datą. Przeciw (pkt 3): strona z koszykiem, rabatami i linkami do kolekcji własnych hantli. Start z zwisu (hantle po bokach), przyjęcie z lekkim ugięciem kolan; „Common Mistakes” (m.in. „Incorrect Sequencing”) |
| hk-shimonek | https://us.humankinetics.com/blogs/excerpt/how-to-perform-a-dumbbell-clean | Human Kinetics (B. Gozo Shimonek, „Women's Muscle & Strength”, ©2025) | nieliczony | kwalifikacje: strona książki https://us.humankinetics.com/products/women-s-muscle-strength — „over a decade of experience as a certified trainer”, bez nazwy certyfikatu → kwalifikacja niesprawdzalna (uzup. 2: „4, gdy autor ma sprawdzalne kwalifikacje”). Treść zgodna z CrossFit/REP co do wyprostu i przyjęcia; łokcie „to your side” — inaczej niż CrossFit („forward and up”) |
| prehab-sumo-hp | https://theprehabguys.com/vimeo-video/sumo-deadlift-high-pull-kettlebell/ | The Prehab Guys | nieliczony (5) | brak autora (tylko wydawca), data 23.12.2021/21.04.2022; uzup. 2: liczy się artykuł z autorem. Treść: szeroki rozkrok, palce na zewnątrz, ręce wewnątrz kolan, high pull do klatki |

Źródła z W1 w bloku (przeczytane w W1, miejsca przepisane): barbend-db-snatch, rogue-alt-db-snatch, ace-5386-adv-kb, barbend-kb-clean, sf-pak-clean, sf-tsar-snatch, sf-lions-roar-snatch, sf-chains-dbl-snatch,
sf-free-hand, ace-385, cf-dkb-pp-jerk. Istniejące w cues.json: exrx-Kettlebell/KBTwoArmSwing, ace-391 (ACE 391 i ACE 392 — jedna organizacja, w swingu jednorącz liczę tylko ACE 392).

## 5. Otwarte

- **One-Arm Kettlebell Split Jerk** — tylko ACE 385 (dwa kettlebelle, podrzut nożycowy). Fragment Human Kinetics „Split Alternating-Feet One-Arm Jerk” (hantel) — adres przekierowuje na stronę sklepu bez treści. Wyniki wyszukiwania: bazy aplikacji i serwisy bez autora. `kbj.rack` pasowałby (ACE 385 + StrongFirst), ale bez zdania ruchu (wykrok) karta nie powstaje. Szukać: CrossFit Essentials (split jerk sztangą — analogia), Catalyst Athletics (split jerk — analogia sztangi, wymagałby oznaczenia „uproszczenie (analogia)”).
- **Kettlebell Sumo High Pull** — Prehab Guys bez autora (nieliczony); ACE nie ma hasła w wynikach; reszta to bazy aplikacji. Zestaw ogólny bez źródła o tym wariancie.
- **Bottoms-Up Clean From The Hang Position** — StrongFirst „The Bottoms Up Experiment” mówi o celu i warunkach wstępnych, nie o technice (z wyszukiwarki — strony nie czytałem); reszta: blogi bez autora, sklep kettlebelli (402 w W1). Otwarte.
- **Kettlebell Pirate Ships** — nie szukano ponownie w W2 (W1: brak źródeł szczebla 4). Otwarte.
- **Dumbbell Clean** — szczebel REP Fitness (pkt 3, otoczenie handlowe) — decyzja koordynatora; drugie możliwe źródło: Human Kinetics, gdy da się sprawdzić certyfikat autorki.
- **`kbb.lower` (Push Press, Jerk)** — StrongFirst „Go Ballistic” nie opisuje opuszczania; nadal tylko CrossFit.
- **`kbb.lockout` w Kettlebell Snatch** — BarBend mówi „top snatch position”, nie „łokieć zablokowany” wprost → nadal poza kartą; dlatego `kbb.snatchMove` bez „prostej ręki”.
- **Pozycja przy barku w One-Arm Push Press** — CrossFit opisuje dwa kettlebelle; BarBend sekcja „The Push Press” — dowolny przyrząd. Oba liczone jako wariant; recenzent może uznać za uproszczenie.
- **„Ta sama faza” w Clean and Jerk** — nadal decyzja audytora (z W1). Bez niej C&J ma tylko `kbcj.move` i błędy wnioskowane z podrzutu nie mają zdań-podstaw w karcie.
- **Uproszczenia do recenzji:** One-Arm Kettlebell Swings (ExRx wersji oburącz), Double Kettlebell Snatch (stance z Double Clean/Swing, błąd z Kettlebell Snatch), Double Kettlebell Clean (`kbb.mis.castDbl` z Kettlebell Clean). Uzasadnienie: ten sam tor i zawias biodrowy, różni się liczba odważników lub rąk; BarBend wprost: „same form as the single-arm clean”, „same technical movements” (snatch).

## 6. Stan

Zrobione (02.11.2026): wszystkie 16 kart rodziny przejrzane; 4 karty bez błędów → z błędami (wnioskowane); 7 otwartych → z błędami (KB Clean, KB Snatch, One-Arm Swings, oba Push Press, C&J, Double Snatch); Dumbbell Clean warunkowo.
Zostało: Split Jerk, Sumo High Pull, Bottoms-Up Clean (hang), Pirate Ships; decyzje: REP Fitness (szczebel), „ta sama faza” w C&J, uproszczenia.
Następny krok: Catalyst Athletics / CrossFit — split jerk (z oznaczeniem analogii); certyfikat B. Gozo Shimonek (strona autorki).
Pułapki: ExRx 403, web.archive.org zablokowane, nsca.com 403, kettlebellkings.com 402, rkcblog 503; fragmenty Human Kinetics pod `shop.` przekierowują na `us.` i czasem na stronę bez treści; wyszukiwarka zwraca głównie bazy aplikacji (nie są źródłem).
