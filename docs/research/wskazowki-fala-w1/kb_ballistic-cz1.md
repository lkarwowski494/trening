# Wskazówki techniki — rodzina kb_ballistic (balistyka odważnikiem/hantlem), część 1

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: zbieranie danych (polecenie właściciela 02.11.2026) — nic nie trafia do `lib/` ani `data/zrodla/*.json` bez wdrożenia.
Zasady: CLAUDE.md „Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki” (2 niezależne przeczytane źródła szczebla 4);
szczeble źródeł wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (Breaking Muscle = 5 i nigdy niezależne od BarBend;
producent = 4 tylko dla własnego rodzaju sprzętu; BarBend = 4 tylko artykuły o technice; Garage Gym Reviews — nie liczyć).
Teksty zdań bez nazw źródeł i organizacji.

Dostęp do źródeł w tej sesji: exrx.net — 403, web.archive.org — zablokowany; NSCA Kinetic Select „One-Arm Dumbbell Snatch” — 403 (oba adresy);
blog producenta kettlebelli (kettlebellkings.com) — 402; blog RKC (rkcblog.dragondoor.com) — 503; NFPT (także archive25.nfpt.com) — 503/404;
IDEA (PDF) — 404; garagegymreviews.com — 404 (i tak „nie liczyć”); barbend.com/dumbbell-clean — 404; Onnit „one-arm-kettlebell-swing” — 404.
StrongFirst: adresy `?p=` czasem dają 307, czasem prowadzą do adresu kanonicznego. Te strony nie są źródłami w tym pliku.
Strony innych aplikacji treningowych z wyników wyszukiwania pominięto (nie są źródłem, nazwy nie trafiają do repo). Physitrack — nie użyty.

## (1) Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Kettlebell Clean | gotowe | setup (nowe, 02.11 druga sesja), move, 2 wskazówki, 3 błędy; po przeklasyfikowaniu Breaking Muscle (5) każde zdanie nadal ma ≥ 2 źródła szczebla 4 |
| Kettlebell Snatch | gotowe | setup, move, 3 wskazówki, 2 błędy; `kbb.close` przeniesione do „Otwarte” (po przeklasyfikowaniu Breaking Muscle zostało jedno źródło) |
| Snatch (hantel) | gotowe | setup, move, 2 wskazówki, 1 błąd (patrz uwaga o `kbb.dbMisArmPull` w „Otwarte”) |
| Double Kettlebell Clean | częściowe | setup + move; brak: błędy (żadne drugie źródło nie wymienia błędów wersji z dwoma odważnikami) |
| One-Arm Kettlebell Swings | otwarte | potwierdzona tylko wskazówka o wolnej ręce (`kbb.freeArm`, poza danymi do czasu setup/move/błędu); patrz „Otwarte” |
| Dumbbell Clean | otwarte | dwa przeczytane opisy, ale żaden nie spełnia pewnie szczebla 4 (patrz „Otwarte”) |
| Double Kettlebell Snatch | otwarte | patrz „Otwarte” |
| Kettlebell Sumo High Pull | otwarte | brak źródeł szczebla 4 (wyniki — bazy aplikacji, Muscle & Strength „nie liczyć”) |
| Bottoms-Up Clean From The Hang Position | otwarte | brak źródeł szczebla 4 |
| Kettlebell Pirate Ships | otwarte | brak źródeł szczebla 4 |

## (2) Dane

```json
{
 "sources": {
  "sf-lions-roar-snatch": {"org": "StrongFirst", "title": "Lion's Roar Kettlebell Snatch (P. Macek)", "url": "https://www.strongfirst.com/lions-roar-kettlebell-snatch/", "level": 4},
  "sf-tsar-snatch": {"org": "StrongFirst", "title": "The Snatch: The Tsar of Kettlebell Lifts", "url": "https://www.strongfirst.com/the-snatch-the-tsar-of-kettlebell-lifts/", "level": 4},
  "sf-pak-clean": {"org": "StrongFirst", "title": "An Olympic Weightlifting Approach to Coaching the Kettlebell Clean (J. Pak, 2015)", "url": "https://www.strongfirst.com/an-olympic-weightlifting-approach-to-coaching-the-kettlebell-clean/", "level": 4},
  "onnit-kb-clean": {"org": "Onnit", "title": "One Arm Kettlebell Clean", "url": "https://www.onnit.com/academy/one-arm-kettlebell-clean", "level": 4},
  "onnit-kb-snatch": {"org": "Onnit", "title": "Kettlebell Snatch", "url": "https://onnit.com/academy/kettlebell-snatch", "level": 4},
  "ace-press-8250-snatch": {"org": "ACE", "title": "How to Do the Kettlebell Snatch… (przedruk artykułu magazynu; trener z certyfikatem ACE)", "url": "https://www.acefitness.org/about-ace/press-room/in-the-news/8250/how-to-do-the-kettlebell-snatch-to-feel-totally-powerful-shape/", "level": 4},
  "ace-5386-adv-kb": {"org": "ACE", "title": "Advanced Kettlebell Workout for Increased Strength and Conditioning (ACE, 21.04.2015)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4},
  "barbend-kb-clean": {"org": "BarBend", "title": "Kettlebell Clean (D. Fraiser, instruktorka kettlebell)", "url": "https://barbend.com/kettlebell-clean/", "level": 4},
  "barbend-kb-snatch": {"org": "BarBend", "title": "Kettlebell Snatch (A. Polish, ACE-CPT)", "url": "https://barbend.com/kettlebell-snatch/", "level": 4},
  "barbend-db-snatch": {"org": "BarBend", "title": "Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)", "url": "https://barbend.com/dumbbell-snatch/", "level": 4},
  "rogue-alt-db-snatch": {"org": "Rogue", "title": "Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)", "url": "https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch", "level": 4}
 },
 "orgs": {
  "StrongFirst": {"name": "StrongFirst — artykuły instruktorów szkoły kettlebell (strongfirst.com)", "level": 4, "kind": "org"},
  "Onnit": {"name": "Onnit Academy — biblioteka ćwiczeń producenta kettlebelli (onnit.com/academy); liczona tylko dla kettlebelli", "level": 4, "kind": "maker"},
  "Rogue": {"name": "Rogue Fitness — Movement Library producenta sztang i hantli (roguefitness.com/theindex); liczona tylko dla własnego rodzaju sprzętu", "level": 4, "kind": "maker"}
 },
 "exercises": {
  "Kettlebell Clean": {
   "setup": [
    {"c": "kbb.cleanSetup", "s": [
     ["onnit-kb-clean", "Step 1 (kettlebell on the floor in front of you; feet between hip and shoulder-width; bend your hips back)"],
     ["barbend-kb-clean", "Step 1: Get Set, With Square Hips (bell about a foot in front; feet slightly wider than hip distance; hinge and grab the handle)"]
    ]}
   ],
   "move": [
    {"c": "kbb.cleanMove", "s": [
     ["sf-pak-clean", "Low Swing High Pull; core idea (clean = swing redirected vertically into the front rack)"],
     ["onnit-kb-clean", "Step 2 (row elbow back, extend hips and knees, bell wraps around the wrist)"],
     ["barbend-kb-clean", "Steps 2–4 (hike between the legs, drive hips forward, bring the bell to the front rack)"]
    ]}
   ],
   "tips": [
    {"c": "kbb.rack", "s": [
     ["onnit-kb-clean", "Step 2–3 (forearm vertical; wrist straight and aligned with your forearm)"],
     ["sf-pak-clean", "Elbow and Hand (elbow attached to the rib cage)"],
     ["barbend-kb-clean", "Step 4 (finish with your elbow against your torso, bell in the rack)"]
    ]},
    {"c": "kb.hips", "s": [
     ["sf-pak-clean", "Low Swing High Pull (arms assist the leg drive rather than overpowering it)"],
     ["barbend-kb-clean", "Common Mistakes: Curling the bell (trust the power and speed created by your hips)"]
    ]}
   ],
   "mistakes": [
    {"c": "kbb.mis.bang", "s": [
     ["onnit-kb-clean", "Step 2 (clean WITHOUT banging the weight against your wrist)"],
     ["sf-pak-clean", "Common mistakes: casting the bell → violent jerk into the rack, excessive impact at the top"]
    ]},
    {"c": "kbb.mis.armPull", "s": [
     ["sf-pak-clean", "Common mistakes: arms overpowering the legs"],
     ["barbend-kb-clean", "Common Mistakes: Curling the bell (bicep curl the kettlebell into the rack)"]
    ]},
    {"c": "kbb.mis.cast", "s": [
     ["sf-pak-clean", "Common mistakes: casting the bell"],
     ["barbend-kb-clean", "Common Mistakes: Casting the bell out (vertical trajectory, not an arc); Step 5 coach's tip"]
    ]}
   ]
  },
  "Kettlebell Snatch": {
   "setup": [
    {"c": "kbb.snatchSetup", "s": [
     ["ace-press-8250-snatch", "krok A (feet shoulder-width apart; bell about a foot in front of the toes; hinge; grip with one hand)"],
     ["sf-tsar-snatch", "streszczenie na początku (start with a kettlebell on the ground in front of you)"],
     ["onnit-kb-snatch", "Step 1 (feet between hip and shoulder-width) i Common Mistakes (avoid rounding your back to pick up the kettlebell)"]
    ]}
   ],
   "move": [
    {"c": "kbb.snatchMove", "s": [
     ["ace-press-8250-snatch", "kroki B–F (hike between the thighs, drive hips, bell rises, punch, lockout)"],
     ["sf-tsar-snatch", "streszczenie na początku (swing it back between your legs … overhead lockout in one uninterrupted motion)"],
     ["onnit-kb-snatch", "Step 4–5 (hike between the legs, snap hips, punch fist to the ceiling)"]
    ]}
   ],
   "tips": [
    {"c": "kb.hips", "s": [
     ["sf-lions-roar-snatch", "lista „eightfold path”, punkt 2 (Generating the force from your legs and hips)"],
     ["onnit-kb-snatch", "Common Mistakes: Using grip and shoulders to lift (not the primary movers)"]
    ]},
    {"c": "kbb.punch", "s": [
     ["sf-lions-roar-snatch", "lista „eightfold path” (Fast spear through the handle at about your eyes level)"],
     ["onnit-kb-snatch", "Step 5 (punch your fist straight to the ceiling)"],
     ["ace-press-8250-snatch", "krok E (punch the bell upward)"],
     ["barbend-kb-snatch", "Common Mistakes: Keeping the lifting arm straight (push up and through the bell)"]
    ]},
    {"c": "kbb.lockout", "s": [
     ["ace-press-8250-snatch", "krok F (arm straight overhead)"],
     ["onnit-kb-snatch", "Step 2 (locking out your elbow)"]
    ]}
   ],
   "mistakes": [
    {"c": "kbb.mis.bang", "s": [
     ["onnit-kb-snatch", "Common Mistakes: Letting the bell hit your forearm"],
     ["sf-lions-roar-snatch", "spear through the handle — to avoid banging the forearm"],
     ["barbend-kb-snatch", "Common Mistakes: Keeping the lifting arm straight (bell dropping onto the forearm)"]
    ]},
    {"c": "kbb.mis.armPull", "s": [
     ["onnit-kb-snatch", "Common Mistakes: Using grip and shoulders to lift"],
     ["sf-lions-roar-snatch", "punkt 2 (force from legs and hips)"]
    ]}
   ]
  },
  "Snatch": {
   "setup": [
    {"c": "kbb.dbSnatchSetup", "s": [
     ["barbend-db-snatch", "Step 1: Squat Down (dumbbell directly below you; deadlift-like start, chest up; back flat)"],
     ["rogue-alt-db-snatch", "Set Up (dumbbell between your feet; hinge, one hand on the dumbbell in a deadlift set up; flat back)"]
    ]}
   ],
   "move": [
    {"c": "kbb.dbSnatchMove", "s": [
     ["barbend-db-snatch", "Step 2–3 (forcefully extend your body; guide it vertically; extend the arm from underneath; elbow locked out)"],
     ["rogue-alt-db-snatch", "Execution (drive the floor away; extend hips and knees, shrug; pull and punch the dumbbell overhead)"]
    ]}
   ],
   "tips": [
    {"c": "kbb.dbArmLate", "s": [
     ["barbend-db-snatch", "Common Mistakes: Pulling With Your Arms (arm relaxed, legs and hips do the work in the first half)"],
     ["rogue-alt-db-snatch", "Execution (Only use the arm after extending the hips and knees)"]
    ]},
    {"c": "kbb.lockout", "s": [
     ["barbend-db-snatch", "Step 3–4 (elbow is locked out; keeping your loaded arm locked out)"],
     ["rogue-alt-db-snatch", "Execution (Arm locked out)"]
    ]}
   ],
   "mistakes": [
    {"c": "kbb.dbMisArmPull", "s": [
     ["barbend-db-snatch", "Common Mistakes: Pulling With Your Arms"],
     ["rogue-alt-db-snatch", "Execution (Only use the arm after extending the hips and knees)"]
    ]}
   ]
  },
  "Double Kettlebell Clean": {
   "setup": [
    {"c": "kbb.dblStance", "s": [
     ["ace-5386-adv-kb", "Double Kettlebell Swing (feet wider than hip-width apart; neutral spine as the bells go back between the legs)"],
     ["barbend-kb-clean", "Double Kettlebell Clean (you'll need a wider stance to hike both bells between your legs)"]
    ]}
   ],
   "move": [
    {"c": "kbb.dblCleanMove", "s": [
     ["ace-5386-adv-kb", "Double Kettlebell Clean (after hip extension pull the kettlebell in at the hip, rotate around the wrist, finish in the rack on arm and chest)"],
     ["barbend-kb-clean", "Double Kettlebell Clean (same form as the single-arm clean, one bell in each hand) + Steps 2–4"]
    ]}
   ],
   "tips": [],
   "mistakes": []
  }
 }
}
```

Uwaga do wdrożenia: klucz „Snatch” w bloku to ćwiczenie „Snatch (hantel)” z listy zadań — przed wdrożeniem sprawdzić dokładny klucz w katalogu (`lib/catalog.generated.ts`).
`kb.hips` użyte słowo w słowo z istniejącego `lib/cues/text/pl.json` („Siła idzie z bioder, nie z barków — ręce tylko prowadzą kettlebell.”) — pasuje do clean i snatch.
`kb.setup` i `kb.move` NIE pasują (chwyt oburącz; kettlebell tylko „unosi się przed tobą”) — nie użyte. Zdania `oly.*` (sztanga) nie pasują do kettlebella ani hantla jednorącz.
`kbb.lockout` nie wspomina rodzaju odważnika — użyte też dla hantla.

## (3) Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| kbb.cleanSetup | Postaw kettlebell trochę przed stopami, stopy na szerokość bioder lub trochę szerzej; cofnij biodra i chwyć uchwyt jedną ręką. | Set the bell a little in front of your feet, feet hip-width or a bit wider; push your hips back and grab the handle with one hand. |
| kbb.cleanMove | Zrób zamach jak przy swingu, ale prowadź kettlebell blisko ciała i zakończ ruch z kettlebellem w pozycji rack przy klatce. | Swing it like a swing, but keep the bell close and finish with it in the rack at your chest. |
| kbb.rack | W pozycji rack łokieć przy tułowiu, przedramię pionowo, nadgarstek prosty. | In the rack: elbow against your side, forearm vertical, wrist straight. |
| kbb.snatchSetup | Postaw kettlebell trochę przed stopami, stopy na szerokość bioder–barków; cofnij biodra z prostymi plecami i chwyć uchwyt jedną ręką. | Set the bell a little in front of your feet, feet hip- to shoulder-width; push your hips back with a flat back and grab the handle with one hand. |
| kbb.snatchMove | Przerzuć kettlebell między nogami, mocno wypchnij biodra i jednym płynnym ruchem doprowadź go nad głowę na prostą rękę. | Hike the bell between your legs, drive your hips hard and take it overhead to a straight arm in one smooth move. |
| kbb.punch | Gdy kettlebell mija twarz, wsuń dłoń w uchwyt i wypchnij pięść w sufit. | As the bell passes your face, slide your hand through the handle and punch your fist to the ceiling. |
| kbb.lockout | Na górze zablokuj łokieć — ręka prosta nad głową. | At the top, lock your elbow — arm straight overhead. |
| kbb.mis.bang | Kettlebell z impetem uderza w przedramię. | The bell slams into your forearm. |
| kbb.mis.armPull | Ciągniesz kettlebell ręką zamiast wypchnąć go biodrami. | Pulling the bell with your arm instead of driving it with your hips. |
| kbb.mis.cast | Kettlebell odjeżdża łukiem od ciała, zamiast iść w górę blisko ciebie. | The bell swings out in an arc instead of travelling up close to you. |
| kbb.dbSnatchSetup | Postaw hantel między stopami; zejdź jak do martwego ciągu — plecy proste, klatka w górę — i chwyć hantel jedną ręką. | Set the dumbbell between your feet; get down like for a deadlift — flat back, chest up — and grab it with one hand. |
| kbb.dbSnatchMove | Odepchnij podłogę nogami, mocno wyprostuj biodra i kolana, a potem poprowadź hantel w górę i wypchnij go nad głowę. | Push the floor away, drive your hips and knees straight, then guide the dumbbell up and punch it overhead. |
| kbb.dbArmLate | Ręka włącza się dopiero po wyproście bioder i kolan — wcześniej tylko luźno trzyma hantel. | Your arm only kicks in after your hips and knees straighten — until then it just holds the dumbbell loosely. |
| kbb.dbMisArmPull | Ciągniesz hantel ręką, zamiast wybić go nogami i biodrami. | Pulling the dumbbell with your arm instead of driving it with your legs and hips. |
| kbb.dblStance | Stań szerzej niż na szerokość bioder, żeby oba kettlebelle przeszły między nogami. | Stand wider than hip-width so both bells fit between your legs. |
| kbb.dblCleanMove | Zrób zamach oboma kettlebellami jak przy swingu, po wyproście bioder przyciągnij je blisko ciała i zakończ w pozycji rack przy klatce. | Swing both bells like a swing, pull them in close as your hips finish and end in the rack at your chest. |
| kbb.freeArm (kandydat, poza danymi) | Wolna ręka może iść razem z ręką z kettlebellem — w tył i w przód. | Your free arm can move with the working arm — back and forward. |

Uwaga do `kbb.punch`: wysokość („gdy mija twarz”) podaje wprost jedno źródło (StrongFirst: „at about your eyes level”); pozostałe mówią o wypchnięciu pięści/dłoni przez uchwyt bez wysokości.
Jeśli recenzja uzna to za za mało — wersja bez wysokości: „Wsuń dłoń w uchwyt i wypchnij pięść w sufit.”
Uwaga do `kbb.dbSnatchMove`: łapanie hantla w przysiadzie podaje tylko BarBend — pominięte.

## (4) Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| sf-lions-roar-snatch | https://www.strongfirst.com/lions-roar-kettlebell-snatch/ | StrongFirst | 4 | lista „eightfold path” |
| sf-tsar-snatch | https://www.strongfirst.com/the-snatch-the-tsar-of-kettlebell-lifts/ | StrongFirst | 4 | streszczenie ruchu na początku |
| sf-pak-clean | https://www.strongfirst.com/an-olympic-weightlifting-approach-to-coaching-the-kettlebell-clean/ | StrongFirst | 4 | progresja, błędy (casting, impact, arms overpowering legs) |
| sf-free-hand (poza danymi) | https://www.strongfirst.com/free-hand-one-arm-swing/ | StrongFirst (B. Jones, ok. 05.2016) | 4 | barki „squared-off” wymagane; opcje wolnej ręki; błędy: wolna ręka jako napęd, dłoń na udzie |
| sf-chains-dbl-snatch (poza danymi) | https://www.strongfirst.com/improve-your-double-kettlebell-snatch/ | StrongFirst | 4 | „Using Chains…” (hip finish → bell floats up; punch straight up); błędów brak |
| onnit-kb-clean | https://www.onnit.com/academy/one-arm-kettlebell-clean | Onnit (producent kettlebelli) | 4 | kroki 1–4 |
| onnit-kb-snatch | https://onnit.com/academy/kettlebell-snatch | Onnit (producent kettlebelli) | 4 | kroki 1–5, „Common Mistakes” |
| ace-press-8250-snatch | https://www.acefitness.org/about-ace/press-room/in-the-news/8250/how-to-do-the-kettlebell-snatch-to-feel-totally-powerful-shape/ | ACE (przedruk artykułu magazynu) | 4 (PROPOZYCJA) | kroki A–G |
| ace-5386-adv-kb | https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/ | ACE (21.04.2015) | 4 | Double Kettlebell Swing, Double Kettlebell Clean |
| ace-392 (poza danymi) | https://www.acefitness.org/resources/everyone/exercise-library/392/single-arm-swing/ | ACE | 4 | opis (stopy na szer. barków, chwyt jedną ręką, plecy proste, siła z nóg i bioder, wolna ręka w tył i w przód) |
| barbend-kb-clean | https://barbend.com/kettlebell-clean/ | BarBend (D. Fraiser) | 4 | kroki 1–5, Common Mistakes, Double Kettlebell Clean |
| barbend-kb-snatch | https://barbend.com/kettlebell-snatch/ | BarBend (A. Polish, ACE-CPT) | 4 | Common Mistakes, Double Kettlebell Snatch (jedno zdanie) |
| barbend-db-snatch | https://barbend.com/dumbbell-snatch/ | BarBend (M. Dewar, CSCS) | 4 | kroki 1–4, Common Mistakes |
| rogue-alt-db-snatch | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch | Rogue (producent hantli) | 4 | Set Up, Execution |

Źródła przeczytane, ale NIE liczone (szczebel wg rozstrzygnięcia koordynatora 02.11.2026):
- bm-read-clean, bm-read-snatch (https://breakingmuscle.com/how-to-do-the-perfect-kettlebell-clean/, …-snatch/) i Breaking Muscle „3 Deadly Sins of the One-Armed Kettlebell Swing” (S. Mozen) — szczebel 5, nigdy niezależne od BarBend. Usunięte z danych (wcześniej przy `kbb.cleanMove`, `kbb.rack`, `kb.hips`, `kbb.mis.armPull`, `kbb.close`, `kbb.punch`, `kbb.lockout`, `kbb.mis.bang`).
- weck-one-arm-kb (https://www.weckmethod.com/articles/functional-strength-training-8-one-arm-kettlebell-exercises) — producent sprzętu, ale nie potwierdziłem, że kettlebell to jego własny rodzaj sprzętu → nie liczę (do decyzji koordynatora).
- BoxLife Magazine „One Arm Kettlebell Swing” (https://boxlifemagazine.com/one-arm-kettlebell-swing/) — autor bez podanych kwalifikacji, brak recenzji eksperckiej → 5.
- Human Kinetics, fragment „Women's Muscle & Strength” (B. Gozo Shimonek), „How to Perform a Dumbbell Clean” (https://us.humankinetics.com/blogs/excerpt/how-to-perform-a-dumbbell-clean) — autorka nie jest autorem NSCA ani naukowcem → nie szczebel 3; czy szczebel 4 — do decyzji koordynatora.
- Onnit „Dumbbell Clean and Press” (https://www.onnit.com/academy/2-hand-clean-from-ground-to-press) — Onnit to producent kettlebelli, nie hantli → 5 dla hantla.
- Rogue „Best Kettlebell Exercises for Overall Strength” — jedno zdanie o clean, bez autora; nie użyte.

## (5) Otwarte

- **Kettlebell Snatch — `kbb.close` („Prowadź kettlebell blisko ciała — w górę i w dół.”):** po przeklasyfikowaniu Breaking Muscle zostaje tylko StrongFirst (Lion's Roar, punkt 3); BarBend snatch nie mówi tego wprost → poza danymi.
- **Kettlebell Snatch — „nie zginaj bioder za wcześnie przy opuszczaniu”:** tylko StrongFirst (Lion's Roar) → jedno źródło.
- **Kettlebell Snatch — `kbb.lockout`:** po usunięciu Breaking Muscle zostają ACE (przedruk, PROPOZYCJA) i Onnit. Jeśli recenzja nie uzna przedruku ACE — zdanie do „Otwarte” (ćwiczenie zostaje „gotowe”).
- **ACE „press room” 8250:** przedruk artykułu magazynu, nie biblioteka ćwiczeń ACE — do decyzji, czy szczebel 4. `kbb.snatchSetup` i `kbb.snatchMove` mają poza nim StrongFirst + Onnit.
- **`kbb.mis.armPull` (snatch) i `kbb.dbMisArmPull` (hantel):** jedno źródło mówi to wprost jako błąd (Onnit; BarBend), drugie jako zasadę odwrotną (StrongFirst „siła z nóg i bioder”; Rogue „rękę włącz dopiero po wyproście”). Jeśli recenzja wymaga obu wprost jako błędu — w snatch przenieść tutaj (ćwiczenie zostaje „gotowe” dzięki `kbb.mis.bang`); w hantlu ćwiczenie spadnie do „częściowe” (brak błędu).
- **One-Arm Kettlebell Swings:** przeczytane źródła szczebla 4 — ACE 392 (pełny opis) i StrongFirst „free hand” (tylko wolna ręka i barki). Wspólne: wolna ręka może iść razem z ręką pracującą (`kbb.freeArm`). Ustawienie, przebieg i błędy ma tylko ACE 392; „barki przodem, bez skrętu” i „dłoń na udzie” — tylko StrongFirst (WECKMETHOD, BoxLife i Breaking Muscle nie liczone). Sprzeczność: ACE każe zacząć chwytem jedną ręką, WECKMETHOD — oburącz. Zdań zestawu ogólnego (`kb.move`, `kb.hips`, `hinge.back`, `mis.roundBack`) nie przenoszę bez drugiego źródła dla wariantu (uzupełnienie koordynatora, pkt 3) — **informacja o zestawie ogólnym:** te zdania mają dziś źródła tylko dla swingu oburącz.
- **Dumbbell Clean (dwa hantle):** przeczytano Human Kinetics (Shimonek: start stojąc, hantle przed udami, lekkie cofnięcie bioder, wyprost, łokcie szybko w dół, hantle na barkach, kolana miękko) i Onnit (start z podłogi albo z zwisu, łokcie w przód pod hantle, łapanie w ćwierćprzysiadzie; „nie zamieniaj w bujane uginanie”). Część wspólna: lekkie cofnięcie bioder → wyprost bioder i kolan → szybkie przełożenie łokci → hantle na barkach z ugiętymi kolanami. Żadne nie spełnia pewnie szczebla 4 wg rozstrzygnięcia 02.11 → poza danymi; błędów nie podaje wprost żadne. Szukać: NSCA (Kinetic Select — 403), Rogue (producent hantli — strona dumbbell power clean pod zgadniętym adresem 404).
- **Double Kettlebell Clean — błędy:** BarBend mówi tylko, że technika jak w wersji jednorącz (błędy jednorącz: rzucanie łukiem, uginanie ręką); ACE 5386 błędów nie podaje → bez drugiego źródła. Także `kbb.rack` i `hinge.back` dla wersji z dwoma odważnikami — po jednym źródle.
- **Double Kettlebell Snatch:** StrongFirst „chains” (wyprost bioder unosi kettlebell, ręka wypycha go prosto w górę) i BarBend snatch (jedno zdanie: „te same ruchy techniczne, inna równowaga”) — za mało na zdania ustawienia, przebiegu i błędów; ACE 5386 nie opisuje snatcha.
- **Kettlebell Sumo High Pull:** wyniki wyszukiwania — wyłącznie bazy aplikacji i Muscle & Strength („nie liczyć”); StrongFirst (Pak) opisuje inny ruch (Low Swing High Pull). Zestaw ogólny (`sumo.kneesOut`, `hinge.back`, `oly.close`, `mis.roundBack`) bez przeczytanego źródła o tym wariancie — `sumo.kneesOut` i `oly.close` mówią o sztandze.
- **Bottoms-Up Clean From The Hang Position, Kettlebell Pirate Ships:** wyniki — wyłącznie bazy aplikacji i serwisy bez autora; brak źródeł szczebla 4. Pirate Ships ma dziś `b: open`.

## (6) Stan

Zrobione (02.11.2026): Kettlebell Clean (gotowe, z setup), Kettlebell Snatch (gotowe), Snatch (hantel) (gotowe), Double Kettlebell Clean (częściowe);
przeklasyfikowanie źródeł wg rozstrzygnięcia koordynatora (Breaking Muscle usunięte z danych, Onnit tylko dla kettlebelli, WECKMETHOD nie liczony);
próby dla One-Arm Swing, Dumbbell Clean, Double Snatch, Sumo High Pull, Bottoms-Up Clean, Pirate Ships — w „Otwarte”.
Dla drugiego badacza (kb_ballistic-cz2, Clean and Jerk): zdania zarzutu z Kettlebell Clean — `kbb.cleanSetup`, `kbb.cleanMove`, `kbb.rack`, `kb.hips`, `kbb.mis.bang`, `kbb.mis.armPull`, `kbb.mis.cast` — każde z ≥ 2 źródłami szczebla 4.

Zostało: One-Arm Kettlebell Swings (drugie źródło szczebla 4 o wariancie jednorącz: setup/move/błąd), Dumbbell Clean (źródło szczebla 4), Double Kettlebell Clean (błędy),
Double Kettlebell Snatch, Kettlebell Sumo High Pull, Bottoms-Up Clean From The Hang Position, Kettlebell Pirate Ships; `kbb.close` w snatch (drugie źródło).

Następny krok: ISSA (szczebel 4) i Catalyst Athletics (4) — artykuły o swingu jednorącz, dumbbell clean i high pull; Rogue Movement Library — szukać stron z sekcją „Set Up/Execution” dla dumbbell clean (adres zgadnięty `movement-demo-dumbbell-power-clean` — 404; listę stron zwraca tylko przycisk „Show More”);
NFPT — ponowić później (503, nagłówek Retry-After 3600 s), liczyć tylko artykuł z autorem, datą i kwalifikacjami.

Pułapki: exrx.net 403 i web.archive.org zablokowane; nsca.com/…/kinetic-select 403; kettlebellkings.com 402; rkcblog.dragondoor.com 503; garagegymreviews.com 404 (i tak nie liczyć);
strongfirst.com — `?p=` czasem 307, czasem prowadzi do adresu kanonicznego; zgadnięte adresy StrongFirst i Rogue często 404 — szukać adresu wyszukiwarką.
Wyszukiwarka zwraca głównie strony aplikacji treningowych — nie są źródłem.
