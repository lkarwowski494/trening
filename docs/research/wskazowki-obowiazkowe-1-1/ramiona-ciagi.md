# Wskazówki techniki — fala „obowiązkowe 1.1”, grupa `ramiona-ciagi` (2026-11)

- Data: 02.11.2026; autor: badacz-merytoryczny (agent). Status: **PROPOZYCJA** — do recenzji niezależnej (L-047) i integracji przez koordynatora 1.1.
- Zakres: 17 ćwiczeń z `docs/research/pokrycie-1-1-obowiazkowe.json` (rodziny `curl` — 14, `pulldown` — 3); wszystkie mają wpis póz v2.
- Podstawa: brief wspólny fali, CLAUDE.md „Merytoryczne podstawy”, docs/18 linie 134–150, `szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`),
  pliki W1 (`wskazowki-fala-w1/curl.md`, `curl-2.md`, `pulldown.md`) i W2 (`wskazowki-fala-w2/curl-cz1.md`, `curl-cz2.md`, `pulldown.md`, `STAN-w2-ramiona.md`).
- Stan repo sprawdzony: żadne zdanie z W1/W2 dla tych ćwiczeń nie jest jeszcze w `lib/cues/text/pl.json` (są tylko `curl.cableMove`, `curl.cableSetup`,
  `curl.hammerSetup`, `curl.elbows`, `curl.control`, `curl.mis.elbows`, `mis.jerk`, `lpd.*`), a źródła `catalyst-*`, `issa-*`, `nasm-lpd-biomech` nie są w
  `data/zrodla/cues.json` — ten blok zakłada wdrożenie bloków W1/W2 (te same id źródeł).
- Każda strona w tabeli źródeł otwarta narzędziem WebFetch 02.11.2026 w tej sesji, chyba że zaznaczono „odczyt W2” (ten sam dzień, inny agent).

**Ważne dla wszystkich kart:** docs/18:147 — ćwiczenie z wpisem póz v2 dostaje własną kartę dopiero z co najmniej jednym błędem; inaczej zostaje zestaw ogólny.
Wszystkie 17 ćwiczeń ma pozy v2, więc każda karta niżej ma błąd (ze źródła albo wnioskowany, docs/18:150).

## 0. Rozstrzygnięcia między W2 cz. 1 i cz. 2

1. **Wspólne zdanie ruchu uginania — jedno id: `curl.move` (oburącz) / `curl.move1` (jednorącz)**; `curl2.move`/`curl2.move1` z cz. 2 nie wdrażać.
   Brzmienie z cz. 1 („…potem opuść go na dół”), bo nie mówi więcej niż wszystkie źródła (ISSA 9 „lower back down”; „pełny wyprost” mają tylko Catalyst 872/873 i ACE 184).
   Potwierdzenie: ISSA (sekcje 3, 5, 7, 9, 11 — każda „curl … towards your shoulder(s) by flexing at the elbow(s)”) i Catalyst (każda strona wariantu: „curl … lower under control”) —
   dwie organizacje szczebla 4, wprost dla wersji z hantlami/sztangą. **Wariant sprzętu (droga 3):** dla wyciągu (dwa uchwyty, jednorącz) zdanie obejmują źródła wersji bazowej
   tylko jako „uproszczenie” — przy każdym wpisie podane, czym ruch się różni (zawsze tylko przyrząd/chwyt; zgięcie łokcia to samo). Potwierdzenie „ruch się nie różni” — recenzent.
2. **Bayesian Curl** — cz. 1 „warunkowe” (Fitness Volt), cz. 2 „otwarte”. Tu: **karta** po zmianie brzmienia ustawienia — dodane badanie Attarieh i in. 2025 (szczebel 3),
   które razem z BarBend (4) potwierdza samo „ramię cofnięte za tułów, zgięcie łokcia”; „tyłem do dolnego wyciągu” wypada ze zdania (tylko BarBend + Fitness Volt — warunek otwarty).
3. Błędy o tym samym sensie z cz. 1 i cz. 2 — po jednym id; w moich ćwiczeniach dotyczy tylko `curl2.mis.crossVertical` (zostaje, cz. 1 go nie ma).

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan | Droga | Ustawienie / ruch / wskazówki / błędy | Powód / uwaga |
|---|---|---|---|---|
| Incline Curl (hantle) | **karta z błędem** | 1 | incline.setup / curl.move / curl.control / mis.jerk (wniosek) | ISSA 7 + Catalyst 850 wprost. Błąd wnioskowany z `curl.control` — ten sam błąd pokazuje dziś zestaw ogólny; recenzent oceni, czy nie trywialny |
| Incline Hammer Curl | **karta z błędem** | 1 (+3 dla Catalyst) | incline.setup / curl.move / curl.control / mis.jerk (wniosek) | ISSA 7 wprost dopuszcza chwyt młotkowy; Catalyst 850 — podchwyt (uproszczenie: chwyt) |
| Reverse Cable Curl | **karta z błędem** | 1 + 3 | curl.revCableSetup / curl.cableMove / curl.elbows / curl.mis.elbows (wniosek) | ustawienie: Catalyst 872 + ISSA 6 wprost; ruch: Catalyst 872 wprost + Cable Curl (uproszczenie: chwyt); łokcie: ISSA 5 (Reverse Curl, gryf→wyciąg) + ACE 322 (Cable Curl, podchwyt→nachwyt) |
| Hammer Curl (linki) | **karta z błędem** | 1 + 3 | curl.ropeSetup / curl.cableMove / curl.control / mis.jerk (wniosek) | ustawienie: Catalyst 881 + ISSA 6; ruch: Catalyst 881 + Cable Curl (uproszczenie). Bez `curl.elbows` — Catalyst 881 (Purpose) pisze, że lina pozwala rękom „poruszać się swobodniej” |
| Standing One-Arm Cable Curl | **karta z błędem** | 3 | curl.cable1Setup / curl.move1 / curl.elbows / curl.mis.elbows (wniosek) | Catalyst 887 wprost (ustawienie, ruch); drugi głos — Cable Curl (oburącz → jednorącz, uproszczenie); łokcie tylko z Cable Curl (uproszczenie) |
| Cable Curl (dwie linki) | **karta z błędem** | 3 | curl.cable2Setup (nowe) / curl.move / curl.elbows / curl.mis.elbows (wniosek) | figura: dolny wyciąg, dwa uchwyty. ISSA 6 (uchwyty, podchwyt na wyciągu) + Cable Curl (drążek → dwa uchwyty, uproszczenie) |
| Cross Body Hammer Curl | **karta z błędem** | 1 (+4 sprawdzone) | curl.hammerSetup / curl2.crossMove / — / curl2.mis.crossVertical (wniosek) | Healthline (warunek spełniony na stronie) + ISSA 1 (crossbody curl, uproszczenie: chwyt); ustawienie: Healthline + ISSA 3 (+ ace-10, exrx z karty Hammer Curl) |
| Bayesian Curl | **karta z błędem** | 1 (4 + 3) | bayes.setup (**nowe brzmienie**) / curl.move1 / — / bayes.mis.arm (**nowe brzmienie**; BarBend wprost + wniosek) | BarBend + Attarieh 2025; patrz pkt 0.2 |
| High Cable Curl | **warunkowe** | 4 | curl.highArms / curl2.highMove / — / — | bez zmian względem W2: ISSA 6 opisuje skutek pozycji, ruch tylko J. Stoppani (szczebel nieustalony); nowe strony: Fitness Volt „Dr. Malik, MD” bez recenzenta (nieustalony) |
| Single Arm Lat Pulldown | **karta z błędem** | 3 | lpd.thighs; lpd1.setup / lpd1.pull / lpd1.blade / lpd.mis.lean, lpd.mis.shrug | Catalyst 895 wprost; drugi głos — Lat Pulldown ACE 158 (oburącz drążek → jednorącz uchwyt, uproszczenie). Eleiko (inspire360) = 5, BarBend single-arm = 5 (autor bez kwalifikacji) |
| Lying Cable Curl | otwarte | — | — | jedyna znaleziona strona z autorem (weighttraining.guide, E. Lord) bez kwalifikacji = 5; ExRx 403 |
| Lying Close-Grip Bar Curl On High Pulley | otwarte | — | — | tylko bazy bez autora (5); ustawienie inne niż wersja bazowa — droga 3 niedostępna |
| Lying Supine Dumbbell Curl | otwarte | — | — | jw. |
| Standing Concentration Curl | otwarte | — | — | przeczytane: Coach (tylko wersja siedząc), OriGym (strona nie załadowała się); ustawienie inne niż Concentration Curl (bez podparcia uda) — droga 3 niedostępna |
| Standing Inner-Biceps Curl | otwarte | — | — | brak opisu szczebla ≤ 4 (W1: tylko free-exercise-db = 5); nie znaleziono nowego |
| Full Range-Of-Motion Lat Pulldown | otwarte | — | — | figura: dwa uchwyty z rozstawionych bloczków (`pulldown.json`, wpis „Full Range-Of-Motion Lat Pulldown”, `dwa: true`, `z: 60`); tor rąk inny niż z drążkiem (do boków) — droga 3 niedostępna; opisy znalezione tylko na platformie Eleiko inspire360 (5) i w instrukcji domowego atlasu (inna maszyna) |
| Wide-Grip Pulldown Behind The Neck | otwarte | — | — | brak przeczytanego opisu techniki; NASM (4) odradza wariant — sprawa zdrowia, pytanie 5.1 |

Razem 17: **karty z błędem 9** (droga 1: 4 z czego 2 częściowo przez 3; droga 3: 5), **warunkowe 1** (droga 4), **otwarte 7**.

## 2. Blok do wdrożenia

Format `data/zrodla/cues.json`; `"s": [["wniosek", "<id>"]]` = błąd wnioskowany; `uproszczenie` — pole przy wpisie zdania (jak W2). Tryb tych kluczy w
`lib/figures/v2/cue-sets.json` z `general` na własny — przy integracji.

```json
{
 "_tryb": "dopisz",
 "exercises": {
  "Incline Curl (hantle)": {
   "setup": [{"c": "incline.setup", "s": [["catalyst-850", "opis zd. 1 („…arms hanging vertically”)"], ["issa-12-curls", "7. Incline Dumbbell Curl (ręce zwisają w pełnym wyproście)"]]}],
   "move": [{"c": "curl.move", "s": [["catalyst-850", "opis zd. 2 („Curl the weights up in front of yourself, then lower under control”)"], ["issa-12-curls", "7. Incline Dumbbell Curl („curl the weights towards your shoulders by flexing at the elbows”)"]]}],
   "tips": [{"c": "curl.control", "s": [["catalyst-850", "opis zd. 2 („lower under control”)"], ["issa-12-curls", "7. Incline Dumbbell Curl (opuszczanie z kontrolą)"]]}],
   "mistakes": [{"c": "mis.jerk", "s": [["wniosek", "curl.control"]]}]
  },
  "Incline Hammer Curl": {
   "setup": [{"c": "incline.setup", "uproszczenie": "Catalyst 850: ta sama pozycja, podchwyt zamiast chwytu młotkowego", "s": [["issa-12-curls", "7. Incline Dumbbell Curl („supinated or hammer grip” — wprost)"], ["catalyst-850", "opis zd. 1"]]}],
   "move": [{"c": "curl.move", "uproszczenie": "Catalyst 850: podchwyt — zgięcie łokcia to samo", "s": [["issa-12-curls", "7. Incline Dumbbell Curl"], ["catalyst-850", "opis zd. 2"]]}],
   "tips": [{"c": "curl.control", "uproszczenie": "Catalyst 850: podchwyt", "s": [["issa-12-curls", "7. Incline Dumbbell Curl (opuszczanie z kontrolą)"], ["catalyst-850", "opis zd. 2 („lower under control”)"]]}],
   "mistakes": [{"c": "mis.jerk", "s": [["wniosek", "curl.control"]]}]
  },
  "Reverse Cable Curl": {
   "setup": [{"c": "curl.revCableSetup", "s": [["catalyst-872", "opis zd. 1 (drążek prosty lub łamany, dolny wyciąg, nachwyt)"], ["issa-12-curls", "6. Cable Curl (nachwyt na wyciągu)"]]}],
   "move": [{"c": "curl.cableMove", "uproszczenie": "drugi głos z karty Cable Curl (podchwyt → nachwyt; tor i zakres łokcia te same)", "s": [["catalyst-872", "opis („curl completely, then return under control to full extension”)"], ["ace-322", "opis (karta Cable Curl)"], ["exrx-Biceps/CBCurl", "Execution (karta Cable Curl)"]]}],
   "tips": [{"c": "curl.elbows", "uproszczenie": "ISSA 5: nachwyt z hantlami/sztangą (przyrząd → wyciąg); ACE 322: wyciąg z podchwytem (chwyt → nachwyt)", "s": [["issa-12-curls", "5. Reverse Curl („elbows close to your body”)"], ["ace-322", "opis („keep the elbows in close to the sides”)"]]}],
   "mistakes": [{"c": "curl.mis.elbows", "s": [["wniosek", "curl.elbows"]]}]
  },
  "Hammer Curl (linki)": {
   "setup": [{"c": "curl.ropeSetup", "s": [["catalyst-881", "opis zd. 1 („…low cable with the palms facing each other”)"], ["issa-12-curls", "6. Cable Curl (chwyt młotkowy na wyciągu)"]]}],
   "move": [{"c": "curl.cableMove", "uproszczenie": "drugi głos z karty Cable Curl (drążek, podchwyt → lina, chwyt młotkowy; zgięcie łokcia to samo)", "s": [["catalyst-881", "opis zd. 2 („Curl the arms as far as possible, and lower under control.”)"], ["ace-322", "opis"], ["exrx-Biceps/CBCurl", "Execution"]]}],
   "tips": [{"c": "curl.control", "uproszczenie": "ACE 322: karta Cable Curl", "s": [["catalyst-881", "opis zd. 2 („lower under control”)"], ["ace-322", "opis (lower slowly)"]]}],
   "mistakes": [{"c": "mis.jerk", "s": [["wniosek", "curl.control"]]}]
  },
  "Standing One-Arm Cable Curl": {
   "setup": [{"c": "curl.cable1Setup", "uproszczenie": "drugi głos z karty Cable Curl (oburącz drążek → jednorącz uchwyt)", "s": [["catalyst-887", "opis zd. 1 („Hold a single-arm handle attached to a low cable with the palm up.”)"], ["ace-322", "opis (podchwyt)"], ["exrx-Biceps/CBCurl", "Preparation"]]}],
   "move": [{"c": "curl.move1", "uproszczenie": "drugi głos z karty Cable Curl (oburącz → jednorącz)", "s": [["catalyst-887", "opis zd. 2 („Curl the arm as far as possible, then lower under control.”)"], ["ace-322", "opis"], ["exrx-Biceps/CBCurl", "Execution"]]}],
   "tips": [{"c": "curl.elbows", "uproszczenie": "karta Cable Curl (oburącz → jednorącz); Catalyst 887 nie mówi o łokciu", "s": [["ace-322", "opis („keep the elbows in close to the sides”)"], ["exrx-Biceps/CBCurl", "Execution (with elbows to side)"]]}],
   "mistakes": [{"c": "curl.mis.elbows", "s": [["wniosek", "curl.elbows"]]}]
  },
  "Cable Curl (dwie linki)": {
   "setup": [{"c": "curl.cable2Setup", "uproszczenie": "karta Cable Curl: drążek → dwa uchwyty", "s": [["issa-12-curls", "6. Cable Curl (podchwyt; uchwyty jako jedna z końcówek)"], ["ace-322", "opis (palms facing the ceiling)"], ["exrx-Biceps/CBCurl", "Preparation"]]}],
   "move": [{"c": "curl.move", "uproszczenie": "karta Cable Curl: drążek → dwa uchwyty; zgięcie łokci to samo", "s": [["ace-322", "opis"], ["exrx-Biceps/CBCurl", "Execution"]]}],
   "tips": [{"c": "curl.elbows", "uproszczenie": "karta Cable Curl: drążek → dwa uchwyty", "s": [["ace-322", "opis („keep the elbows in close to the sides”)"], ["exrx-Biceps/CBCurl", "Execution (with elbows to side)"]]}],
   "mistakes": [{"c": "curl.mis.elbows", "s": [["wniosek", "curl.elbows"]]}]
  },
  "Cross Body Hammer Curl": {
   "setup": [{"c": "curl.hammerSetup", "s": [["healthline-hammer-curls", "Cross-body hammer curl, krok 1 („hold dumbbells at your sides with your palms facing each other”)"], ["issa-12-curls", "3. Hammer Curl (dłonie do środka ciała)"], ["ace-10", "Step 1 (karta Hammer Curl)"]]}],
   "move": [{"c": "curl2.crossMove", "uproszczenie": "ISSA 1: crossbody curl w sekcji uginania z podchwytem (chwyt → młotkowy; tor ten sam)", "s": [["healthline-hammer-curls", "Cross-body hammer curl, krok 3 („bringing the dumbbell up toward your right chest/shoulder”) i 4 (powrót do boku)"], ["issa-12-curls", "1. Dumbbell Biceps Curl, wariant crossbody („curling it towards the opposite shoulder”)"]]}],
   "tips": [],
   "mistakes": [{"c": "curl2.mis.crossVertical", "s": [["wniosek", "curl2.crossMove"]]}]
  },
  "Bayesian Curl": {
   "setup": [{"c": "bayes.setup", "uproszczenie": "Attarieh 2025: wariant siedząc na krześle — zdanie nie mówi o postawie", "s": [["barbend-bayesian-curl", "How to, kroki 1–3 (pojedynczy uchwyt; ramię cofnięte za tułów ok. 45°)"], ["pmc-11906226", "2.4 (uchwyt wyciągu podchwytem, bark w wyproście ok. 50°) i ryc. 1"]]}],
   "move": [{"c": "curl.move1", "s": [["barbend-bayesian-curl", "How to, krok 4 („bend at the elbow, curling the weight”)"], ["pmc-11906226", "2.4–2.5 (uginanie przedramienia na wyciągu w tej pozycji)"]]}],
   "tips": [],
   "mistakes": [{"c": "bayes.mis.arm", "s": [["barbend-bayesian-curl", "Common Mistakes — „Moving Your Upper Arm”"], ["wniosek", "bayes.setup"]]}]
  },
  "Single Arm Lat Pulldown": {
   "setup": [
    {"c": "lpd.thighs", "uproszczenie": "karta Lat Pulldown (oburącz → jednorącz); siedzisko z wałkami jak na figurze", "s": [["ace-158", "Step 1 (wałek na udach)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation"]]},
    {"c": "lpd1.setup", "uproszczenie": "ACE 158: drążek oburącz → uchwyt jednorącz", "s": [["catalyst-895", "opis zd. 1 („Hold a cable attachment overhead with a single hand.”)"], ["ace-158", "Step 1 (chwyt nad głową, ręce wyprostowane)"]]}
   ],
   "move": [{"c": "lpd1.pull", "uproszczenie": "ACE 158: drążek do klatki → uchwyt do barku (ten sam ruch jedną ręką)", "s": [["catalyst-895", "opis zd. 2–3 („pull the handle to the shoulder… return to the extended position under control”)"], ["ace-158", "Step 2–4"]]}],
   "tips": [{"c": "lpd1.blade", "uproszczenie": "ACE 158: oburącz", "s": [["catalyst-895", "opis (łopatka w dół i do tyłu)"], ["ace-158", "Step 2 („initiate the downward pull by first depressing… your scapulae”)"]]}],
   "mistakes": [
    {"c": "lpd.mis.lean", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: jednorącz)"], ["ace-158", "Step 2 — standard"], ["catalyst-895", "opis (tułów usztywniony) — standard"]]},
    {"c": "lpd.mis.shrug", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: jednorącz)"], ["catalyst-895", "opis (łopatka w dół) — standard"]]}
   ]
  }
 },
 "sources": {
  "healthline-hammer-curls": {"org": "Healthline", "title": "Hammer Curls (T. Edwards, PT, MPT; recenzja: J. Tipane, CPT; 16.03.2022)", "url": "https://www.healthline.com/health/fitness/hammer-curls", "level": 4},
  "pmc-11906226": {"org": "European Journal of Sport Science", "title": "Attarieh i in. 2025, Preacher versus Bayesian Cable Curls, 25(4):e12279", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11906226/", "level": 3},
  "catalyst-881": {"org": "Catalyst Athletics", "title": "Rope Cable Curl (#881)", "url": "https://www.catalystathletics.com/exercise/881/Rope-Cable-Curl/", "level": 4},
  "catalyst-887": {"org": "Catalyst Athletics", "title": "Single-Arm Cable Curl (#887)", "url": "https://www.catalystathletics.com/exercise/887/Single-Arm-Cable-Curl/", "level": 4},
  "catalyst-895": {"org": "Catalyst Athletics", "title": "Single-Arm Pulldown (#895)", "url": "https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/", "level": 4}
 },
 "orgs": {
  "Healthline": {"name": "Healthline — artykuły z autorem, datą i nazwanym recenzentem (healthline.com)", "level": 4, "kind": "site"},
  "European Journal of Sport Science": {"name": "European Journal of Sport Science (czasopismo recenzowane)", "level": 3, "kind": "journal"}
 }
}
```

Źródła z bloków W1/W2 użyte bez ponownego wpisu (te same id): `catalyst-850`, `catalyst-872`, `issa-12-curls`, `barbend-bayesian-curl`, `nasm-lpd-biomech`;
istniejące w repo: `ace-10`, `ace-158`, `ace-322`, `exrx-Biceps/CBCurl`, `exrx-LatissimusDorsi/CBFrontPulldown`. Pole `kind` dla czasopisma — sprawdzić dozwolone
wartości w schemacie przy integracji (może być potrzebne `study`/inna wartość).

## 3. Zdania — nowe i zmienione (PL + EN)

Z W1/W2 bez zmian brzmienia (jeszcze nie w `pl.json`): `curl.move`, `curl.move1` (curl-cz1 sekcja 3), `incline.setup`, `curl.revCableSetup`, `curl.ropeSetup`, `curl.cable1Setup`
(curl-2 W1 sekcja 3), `curl2.crossMove`, `curl2.mis.crossVertical`, `curl2.highMove` (curl-cz2 sekcja 3), `lpd1.setup`, `lpd1.pull`, `lpd1.blade` (pulldown W1 sekcja 4),
`lpd.mis.lean`, `lpd.mis.shrug` (pulldown W2). Istniejące w `pl.json`: `curl.cableMove`, `curl.hammerSetup`, `curl.elbows`, `curl.control`, `curl.mis.elbows`, `mis.jerk`, `lpd.thighs`.

| id | PL | EN (propozycja) | Źródła |
|---|---|---|---|
| `curl.cable2Setup` (nowe) | Chwyć dwa uchwyty dolnego wyciągu podchwytem; ręce wyprostowane w dół. | Grab two handles on the low cable, palms up, arms straight down. | issa-12-curls 6; ace-322, exrx CBCurl (uproszczenie) |
| `bayes.setup` (**zmiana** względem curl-cz1) | Uchwyt wyciągu w jednej ręce; ramię cofnięte za tułów. | Cable handle in one hand, upper arm drawn back behind your body. | barbend-bayesian-curl; pmc-11906226 |
| `bayes.mis.arm` (**zmiana** względem curl-cz1) | Ramię ucieka do przodu, przed tułów. | Upper arm drifting forward in front of your body. | barbend-bayesian-curl (błąd wprost); wniosek z `bayes.setup` |

Powód zmiany `bayes.setup`: brzmienie cz. 1 („Stań tyłem do dolnego wyciągu…; ramię lekko za tułowiem”) ma „tyłem do wyciągu” i „lekko” tylko z BarBend i Fitness Volt
(szczebel FV nieustalony); badanie ustawia bark w wyproście ok. 50°, więc „lekko” byłoby sprzeczne. Nowe zdanie mówi tylko to, co mówią oba źródła. `curl.move1` przy
Bayesian: „w stronę barku” — BarBend nie podaje kierunku, FV „do wysokości barku”; recenzent niech oceni z rysunkiem (ramię za tułowiem).
Każde nowe zdanie: 35 języków, wpis w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`), recenzja lokalizacji.

## 4. Źródła (odczyt 02.11.2026)

| id | adres / miejsce | szczebel | uzasadnienie / krótki cytat |
|---|---|---|---|
| issa-12-curls | https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged — sekcje 1, 3, 5, 6, 7, 11 | 4 | firmowane „ISSA”, 22.09.2025. S. 1: „A variation called the crossbody curl involves starting the dumbbell on one side of the body” i „curling it towards the opposite shoulder”. S. 7: „Begin with your arms hanging down fully extended, holding dumbbells with a supinated or hammer grip.” S. 6: „…underhand grip, overhand grip, or hammer grip with handles” |
| healthline-hammer-curls | https://www.healthline.com/health/fitness/hammer-curls — sekcja „Cross-body hammer curl” | 4 (warunkowo — **spełnia**: autor Travis Edwards, PT, MPT; recenzent Jake Tipane, CPT; 16.03.2022) | „Bend your left elbow, bringing the dumbbell up toward your right chest/shoulder.” |
| pmc-11906226 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11906226/ — Methods 2.4, 2.5, ryc. 1 | 3 (badanie w recenzowanym czasopiśmie, EJSS 2025) | „the shoulder was positioned at about 50° in flexion or extension for PREA and BAYE, respectively”; uchwyt podchwytem; krzesło „BAYE chair” (siedząc) |
| barbend-bayesian-curl | https://barbend.com/bayesian-curl/ — How to, kroki 1–4; Common Mistakes | 4 (warunek spełniony: Jake Dickson, NASM-CPT, USAW-L2; 17.06.2024; bez recenzenta) | krok 3: ramię „drawn back behind your torso at about a 45-degree angle”; błąd: „Your upper arm needs to remain motionless the entire time.” |
| catalyst-850 | https://www.catalystathletics.com/exercise/850/Incline-Dumbbell-Curl/ — opis | 4 | „Curl the weights up in front of yourself, then lower under control,” |
| catalyst-872 | https://www.catalystathletics.com/exercise/872/Reverse-Cable-Curl/ — opis | 4 | „Hold a straight or EZ handle attached to a low cable with a pronated grip and curl completely,” |
| catalyst-881 | https://www.catalystathletics.com/exercise/881/Rope-Cable-Curl/ — opis i Purpose | 4 | „Curl the arms as far as possible, and lower under control.” |
| catalyst-887 | https://www.catalystathletics.com/exercise/887/Single-Arm-Cable-Curl/ — opis | 4 | „Hold a single-arm handle attached to a low cable with the palm up.” |
| catalyst-895 | https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/ — opis | 4 | „Hold a cable attachment overhead with a single hand.” |
| ace-158 | https://www.acefitness.org/resources/everyone/exercise-library/158/lat-pulldown/ — Steps 1–4 | 4 | Step 2: „initiate the downward pull by first depressing (lower) your scapulae” |
| nasm-lpd-biomech | https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form — Common Compensations, FAQ | 4 (B. Sutton, NASM-CPT; 2021, akt. 21.07.2026) | o wariancie zza karku: „One variation that's generally best avoided is the behind-the-neck pulldown.” (tylko do pytania 5.1, nie do karty) |
| ace-322, ace-10, exrx-Biceps/CBCurl, exrx-LatissimusDorsi/CBFrontPulldown | istniejące w `data/zrodla/cues.json` (karty Cable Curl, Hammer Curl, Lat Pulldown) | 4 | baza uproszczeń; nieczytane ponownie (ExRx — 403) |
| stoppani-high-cable | https://www.jimstoppani.com/training/high-cable-curl | nieustalony | odczyt W2 (curl-cz2 sekcja 4) — nie czytane ponownie |

Odrzucone / nieliczone (przeczytane): fitnessvolt.com/bayesian-curl (P. Dale „PT, ex-Marine”, bez recenzenta — szczebel do decyzji, jak W2);
fitnessvolt.com/overhead-cable-curl-biceps („Dr. Malik, MD”, bez recenzenta; wersja jednorącz — nieustalony); barbend.com/single-arm-lat-pulldown (D. DuChateau, bez kwalifikacji — 5);
weighttraining.guide/exercises/lying-cable-curl (E. Lord, bez kwalifikacji — 5); coachweb.com concentration curl (dziennikarz, tylko wersja siedząc); origym ?p=23614 (nie załadowała się);
nsuworks.nova.edu (Kolber i in. 2010 — tylko streszczenie, bez słowa o wariancie zza karku). Serwis programów treningowych z nagraniami (wynik wyszukiwania „cable curl”) — pominięty jako materiał innej aplikacji treningowej.
Eleiko inspire360 (pulldowny z dwoma uchwytami, single-arm) — 5 wg przeliczenia W1.

## 5. Pytania dla koordynatora

1. **Wide-Grip Pulldown Behind The Neck — zdrowie.** NASM (4) pisze, że wariant „is generally best avoided” i w FAQ „For most clients, no.” — bez cytowanego badania.
   Przegląd Kolber i in. 2010 (JSCR 24(6):1696–1704, „brief review”, czyli przegląd narracyjny, nie systematyczny) według streszczeń z drugiej ręki wymienia ten wariant wśród
   ryzykownych — **pełnego tekstu nie przeczytałem** (PDF 503, repozytorium uczelni bez pliku). Źródła szczebla 1–2, które odradza wariant wprost — nie znalazłem. Nie piszę
   ostrzeżenia. Do decyzji (produkt + zdrowie): zostawić ćwiczenie z zestawem ogólnym `vpull` (W1 pkt 3: zdania „do klatki” są dla tego wariantu błędne), ukryć je, czy szukać
   pełnego tekstu przeglądu. Obowiązkowość tego ćwiczenia w 1.1 warto potwierdzić u właściciela.
2. **Błąd `mis.jerk` jako wniosek z `curl.control`** (Incline Curl, Incline Hammer Curl, Hammer Curl (linki)) — dziś ten sam błąd pokazuje zestaw ogólny; recenzent niech oceni,
   czy nie jest trywialny (docs/18:150). Jeśli tak — te trzy karty wracają do „częściowych”, a przez docs/18:147 zostają przy zestawie ogólnym.
3. **Uproszczenia do potwierdzenia przez recenzenta** (droga 3): Cable Curl → Reverse Cable / Rope / One-Arm / dwie linki; ISSA 5 → wyciąg przy `curl.elbows`; Lat Pulldown →
   Single Arm (jednorącz: dochodzi możliwy obrót tułowia — czy ruch „się nie różni”?); ISSA 1 crossbody (podchwyt) → chwyt młotkowy.
4. **Healthline (Cross Body Hammer Curl)** — recenzent „Jake Tipane, CPT” bez nazwy organizacji certyfikującej; uznałem warunek uzup. 3 za spełniony (autor PT, MPT, data, nazwany recenzent).
5. **Bayesian — badanie z wariantem siedzącym** jako drugi głos dla zdania bez postawy (uproszczenie). Jeśli koordynator uzna to za za mało — Bayesian wraca do „warunkowe” (Fitness Volt).
6. **Fitness Volt i J. Stoppani** — szczebel nadal nieustalony (High Cable Curl, Bayesian — wariant FV). Bez decyzji High Cable Curl zostaje warunkowe.
7. **Siedem otwartych** (warianty leżące ×3, Standing Concentration, Standing Inner-Biceps, Full ROM Pulldown, Behind The Neck) — brak opisu szczebla ≤ 4 po dwóch falach i tej sesji;
   ExRx (403) ma większość z nich. Propozycja produktowa dla właściciela (ukryć / zostawić zestaw ogólny / ręczne otwarcie ExRx w innym narzędziu) — poza moją rolą.
8. **Full Range-Of-Motion Lat Pulldown — czy figura pokazuje zamierzony wariant** (dwa uchwyty z rozstawionych bloczków, siedząc)? Nazwa nie definiuje ruchu; bez definicji wariantu nie da się szukać źródeł.

## Stan agenta

Zrobione: wszystkie 17 ćwiczeń ocenione; plik kompletny. Zostało: recenzja niezależna, decyzje z sekcji 5. Pułapki: ExRx 403; OriGym blokuje narzędzie; ISSA czasem odmawia
cytatów dosłownych (wtedy streszczenie — przy sekcji 7 brzmienie „opuszczanie z kontrolą” z odczytu W2 i streszczenia narzędzia, recenzent niech otworzy stronę).
