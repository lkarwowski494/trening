# Wskazówki techniki — fala W1, rodzina „curl”, część 2 (2026-11)

Autor: badacz-merytoryczny (agent), 02.11.2026. Kontynuacja `docs/research/wskazowki-fala-w1/curl.md` (worktree agent-ab725cc87bc0c4452)
po odrzuceniu przez koordynatora dokumentacji innej aplikacji treningowej jako źródła. Ten plik **zastępuje** blok JSON z curl.md
dla wpisów, w których to źródło było drugim; Barbell Preacher Curl zostaje jak w curl.md (patrz jednak Otwarte pkt 1).

Reguła: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) — ustawienie, przebieg ruchu, częste błędy: 2 zgodne, niezależne źródła
szczebla 4 z różnych organizacji. Każde odwołanie przeczytane narzędziem WebFetch 02.11.2026 (miejsca wg nagłówków/kroków strony).
free-exercise-db liczy się jako jedno źródło (precedens ACG-010). Strony aplikacji treningowych pominięte (jedna znaleziona przy
spider curl — odrzucona, bez nazwy). ExRx (403) i web.archive.org (zablokowane) — niedostępne.

## 0. Nowe organizacje — ocena szczebla

| org | czym jest | szczebel | uwaga |
|---|---|---|---|
| ISSA (issaonline.com) | International Sports Sciences Association — organizacja certyfikująca trenerów personalnych (jak ACE, NASM) | 4 | blog edukacyjny ISSA, artykuł z 22.09.2025 i przewodnik po bicepsach |
| free-exercise-db | katalog ćwiczeń (Unlicense), już w L4-S29 | 4 | jedno źródło niezależnie od liczby stron |
| Western University — Sport and Recreation Services | przewodnik po sprzęcie siłowni uczelni | 4 | „uczelnie z opisami ćwiczeń” (brief koordynatora); analogicznie do HSS |
| BarBend | serwis specjalistyczny o sportach siłowych; artykuły podpisane przez trenerów z certyfikatami (CSCS, NASM-CPT) | **4 — do potwierdzenia** | nowy rodzaj; wpisy oparte na nim oznaczone „warunkowe” |

## 1. Wynik

| Klucz | Wynik | Zdania |
|---|---|---|
| Preacher Curl (EZ) | gotowe (Catalyst + ISSA + free-exercise-db) | preacher.arms, preacher.range, curl.control |
| One Arm Dumbbell Preacher Curl | gotowe (Catalyst + ISSA + free-exercise-db) | preacher.arms, preacher.range |
| Incline Curl (hantle) | gotowe (Catalyst + ISSA) | incline.setup |
| Zottman Curl | gotowe (Catalyst + ISSA) | zottman.move, curl.control |
| Reverse Curl | gotowe (Catalyst + ISSA + free-exercise-db) | curl.revGrip (nowe brzmienie), curl.elbows, curl.control |
| Concentration Curl (hantle) | gotowe; **dodane** curl.control (Catalyst + ISSA) | conc.setup, curl.control |
| Spider Curl | **warunkowe** (Catalyst + BarBend) | spider.setup, spider.arm |
| Machine Biceps Curl | gotowe (ACE + Western) | machineCurl.setup, curl.control |
| Incline Hammer Curl | gotowe (ISSA + free-exercise-db; Catalyst — ta sama pozycja, chwyt podchwytem) | incline.setup |
| Standing Dumbbell Reverse Curl | gotowe (ISSA + free-exercise-db) | curl.revGripDb, curl.elbows, curl.control |
| Reverse Cable Curl | gotowe (Catalyst + free-exercise-db) | curl.revCableSetup, curl.control |
| Reverse EZ-Bar Preacher Curl | gotowe (Catalyst + free-exercise-db; ISSA dla ustawienia i zakresu) | preacher.arms, curl.revGrip, preacher.range, curl.control |
| Hammer Curl (linki) | gotowe (Catalyst + free-exercise-db) | curl.ropeSetup, curl.control |
| Standing One-Arm Cable Curl | gotowe (Catalyst + free-exercise-db) | curl.cable1Setup, curl.control |
| Cable Preacher Curl | gotowe (ISSA + free-exercise-db) | preacher.arms, preacher.range |
| Preacher Hammer Dumbbell Curl | gotowe (ISSA + free-exercise-db) | preacher.arms, preacher.range |
| Zottman Preacher Curl | gotowe (ISSA + free-exercise-db); zottman.move = **uproszczenie** (patrz niżej) | preacher.arms, preacher.range, zottman.move |
| High Cable Curl | gotowe (ISSA + free-exercise-db) | curl.highArms |
| Drag Curl | **warunkowe** (free-exercise-db + BarBend) | drag.path, curl.control |
| Spider Curl (sztanga) | otwarte — free-exercise-db (gryf łamany, przednia strona modlitewnika); BarBend wymienia sztangę tylko jako odmianę | — |
| Bayesian Curl | otwarte — przeczytane tylko BarBend (nie czytane dalej); free-exercise-db nie ma | — |
| Cross Body Hammer Curl | otwarte — jedno źródło (free-exercise-db) | — |
| Cable Curl (dwie linki) | otwarte — brak przeczytanego opisu dwóch dolnych wyciągów | — |
| Lying Cable Curl | otwarte — nie znaleziono drugiego źródła | — |
| Lying Close-Grip Bar Curl On High Pulley | otwarte — jedno źródło (free-exercise-db) | — |
| Lying Supine Dumbbell Curl | otwarte — jedno źródło (free-exercise-db) | — |
| Standing Inner-Biceps Curl | otwarte — jedno źródło (free-exercise-db) | — |
| Reverse Plate Curls | otwarte — jedno źródło (free-exercise-db) | — |
| Standing Concentration Curl | otwarte — jedno źródło (free-exercise-db) | — |
| Seated Close-Grip Concentration Barbell Curl | otwarte — jedno źródło (free-exercise-db) | — |

Razem (23 klucze z zadania + Concentration Curl): gotowe 17, warunkowe 2, otwarte 11 (licząc Spider Curl i Drag Curl jako warunkowe).

Zdania zestawu ogólnego **pominięte** świadomie (żadne dwa przeczytane źródła ich nie potwierdzają dla wariantu): `curl.elbows` przy
linie, jednorącz z wyciągu, ławce skośnej, modlitewniku i wyciągu z nachwytem; `curl.noSwing` wszędzie poza zestawem ogólnym;
`mis.jerk` i `curl.mis.elbows` wszędzie (źródła rzadko mają sekcję błędów); `preacher.range` przy maszynie (tylko ACE);
`curl.control` przy Incline Curl, Incline Hammer, One Arm DB Preacher, Cable/Hammer/Zottman Preacher i High Cable Curl (jedno źródło).

## 2. Blok JSON do `data/zrodla/cues.json`

### 2a. Organizacje (`orgs`) — dopisać do Catalyst z curl.md (bez org odrzuconej)

```json
"ISSA": {"name": "International Sports Sciences Association — blog edukacyjny (issaonline.com)", "level": 4, "kind": "org"},
"free-exercise-db": {"name": "free-exercise-db (katalog ćwiczeń, Unlicense; jedno źródło — ACG-010)", "level": 4, "kind": "site"},
"Western University": {"name": "Western University, Sport and Recreation Services — przewodnik po sprzęcie (uwo.ca)", "level": 4, "kind": "site"},
"BarBend": {"name": "BarBend — przewodniki ćwiczeń (artykuły trenerów z certyfikatami) — SZCZEBEL DO POTWIERDZENIA", "level": 4, "kind": "site"}
```

### 2b. Źródła (`sources`) — dopisać do catalyst-* z curl.md; usunąć wszystkie `sl-*`

```json
"issa-12-curls": {"org": "ISSA", "title": "12 Biceps Curl Variations to Keep Your Arms Engaged (22.09.2025)", "url": "https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged", "level": 4},
"issa-biceps-guide": {"org": "ISSA", "title": "Your Best Guide to Building Biceps", "url": "https://www.issaonline.com/blogs/strength/your-best-guide-to-building-biceps", "level": 4},
"ace-184": {"org": "ACE", "title": "Seated Biceps Curl (#184)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/184/seated-biceps-curl/", "level": 4},
"uwo-biceps-triceps": {"org": "Western University", "title": "Equipment guides — Biceps and Triceps", "url": "https://uwo.ca/campusrec/orientation/equipment_guides/biceps_and_triceps.html", "level": 4},
"catalyst-872": {"org": "Catalyst Athletics", "title": "Reverse Cable Curl (#872)", "url": "https://www.catalystathletics.com/exercise/872/Reverse-Cable-Curl/", "level": 4},
"catalyst-874": {"org": "Catalyst Athletics", "title": "Reverse Preacher Curl (#874)", "url": "https://www.catalystathletics.com/exercise/874/Reverse-Preacher-Curl/", "level": 4},
"catalyst-881": {"org": "Catalyst Athletics", "title": "Rope Cable Curl (#881)", "url": "https://www.catalystathletics.com/exercise/881/Rope-Cable-Curl/", "level": 4},
"catalyst-887": {"org": "Catalyst Athletics", "title": "Single-Arm Cable Curl (#887)", "url": "https://www.catalystathletics.com/exercise/887/Single-Arm-Cable-Curl/", "level": 4},
"fedb-preacher-curl": {"org": "free-exercise-db", "title": "Preacher Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Preacher_Curl.json", "level": 4},
"fedb-one-arm-db-preacher": {"org": "free-exercise-db", "title": "One Arm Dumbbell Preacher Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/One_Arm_Dumbbell_Preacher_Curl.json", "level": 4},
"fedb-reverse-barbell-curl": {"org": "free-exercise-db", "title": "Reverse Barbell Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Reverse_Barbell_Curl.json", "level": 4},
"fedb-incline-hammer": {"org": "free-exercise-db", "title": "Incline Hammer Curls", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Incline_Hammer_Curls.json", "level": 4},
"fedb-standing-db-reverse": {"org": "free-exercise-db", "title": "Standing Dumbbell Reverse Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Standing_Dumbbell_Reverse_Curl.json", "level": 4},
"fedb-reverse-cable": {"org": "free-exercise-db", "title": "Reverse Cable Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Reverse_Cable_Curl.json", "level": 4},
"fedb-reverse-bb-preacher": {"org": "free-exercise-db", "title": "Reverse Barbell Preacher Curls", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Reverse_Barbell_Preacher_Curls.json", "level": 4},
"fedb-cable-hammer-rope": {"org": "free-exercise-db", "title": "Cable Hammer Curls - Rope Attachment", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Cable_Hammer_Curls_-_Rope_Attachment.json", "level": 4},
"fedb-standing-one-arm-cable": {"org": "free-exercise-db", "title": "Standing One-Arm Cable Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Standing_One-Arm_Cable_Curl.json", "level": 4},
"fedb-cable-preacher": {"org": "free-exercise-db", "title": "Cable Preacher Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Cable_Preacher_Curl.json", "level": 4},
"fedb-preacher-hammer": {"org": "free-exercise-db", "title": "Preacher Hammer Dumbbell Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Preacher_Hammer_Dumbbell_Curl.json", "level": 4},
"fedb-zottman-preacher": {"org": "free-exercise-db", "title": "Zottman Preacher Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Zottman_Preacher_Curl.json", "level": 4},
"fedb-high-cable": {"org": "free-exercise-db", "title": "High Cable Curls", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/High_Cable_Curls.json", "level": 4},
"fedb-drag-curl": {"org": "free-exercise-db", "title": "Drag Curl", "url": "https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Drag_Curl.json", "level": 4},
"barbend-spider-curl": {"org": "BarBend", "title": "Spider Curl (J. Dickson, NASM-CPT)", "url": "https://barbend.com/spider-curl/", "level": 4},
"barbend-drag-curl": {"org": "BarBend", "title": "Drag Curl (E. Bugera, CSCS)", "url": "https://barbend.com/drag-curl/", "level": 4}
```

### 2c. Wpisy ćwiczeń

Wpisy z curl.md dla Barbell Preacher Curl zostają (bez `sl-*`). Pozostałe — poniższe zastępują wersje z curl.md.

```json
"Preacher Curl (EZ)": {
 "setup": [{"c": "preacher.arms", "s": [
  ["catalyst-868", "opis („Keeping the arms supported on the bench…”; gryf łamany lub prosty)"],
  ["issa-12-curls", "9. Preacher Curl (ramiona na ławce przez cały ruch)"],
  ["fedb-preacher-curl", "krok 2 (ramiona o podpórkę; gryf łamany)"]]}],
 "move": [],
 "tips": [
  {"c": "preacher.range", "s": [
   ["issa-12-curls", "9. Preacher Curl (maksymalne zgięcie, potem wyprost)"],
   ["fedb-preacher-curl", "kroki 3–4 (do wyprostu ramienia i do pełnego zgięcia)"],
   ["catalyst-868", "opis (do dołu, bez przeprostu)"]]},
  {"c": "curl.control", "s": [
   ["catalyst-868", "opis („return to the bottom under control”)"],
   ["fedb-preacher-curl", "krok 3 (opuszczaj powoli)"]]}],
 "mistakes": []
},
"One Arm Dumbbell Preacher Curl": {
 "setup": [{"c": "preacher.arms", "s": [
  ["catalyst-889", "opis („Brace the upper arm on a preacher bench…”)"],
  ["issa-12-curls", "9. Preacher Curl (jednorącz, hantle; ramię na ławce)"],
  ["fedb-one-arm-db-preacher", "krok 1"]]}],
 "move": [],
 "tips": [{"c": "preacher.range", "s": [
  ["issa-12-curls", "9. Preacher Curl (maksymalne zgięcie, potem wyprost)"],
  ["fedb-one-arm-db-preacher", "kroki 2–3 (do wyprostu, potem do wysokości barku)"],
  ["catalyst-889", "opis (do dołu, bez przeprostu)"]]}],
 "mistakes": []
},
"Incline Curl (hantle)": {
 "setup": [{"c": "incline.setup", "s": [
  ["catalyst-850", "opis („…the arms hanging vertically”)"],
  ["issa-12-curls", "7. Incline Dumbbell Curl („arms hanging down fully extended”)"]]}],
 "move": [], "tips": [], "mistakes": []
},
"Incline Hammer Curl": {
 "setup": [{"c": "incline.setup", "s": [
  ["issa-12-curls", "7. Incline Dumbbell Curl (chwyt podchwytem lub młotkowy — wprost)"],
  ["fedb-incline-hammer", "krok 1 (ławka skośna, hantle zwisają, chwyt neutralny)"],
  ["catalyst-850", "opis (ta sama pozycja; chwyt podchwytem — słabsze)"]]}],
 "move": [], "tips": [], "mistakes": []
},
"Zottman Curl": {
 "setup": [],
 "move": [{"c": "zottman.move", "s": [
  ["catalyst-915", "opis (w górę podchwytem, na górze obrót, w dół nachwytem)"],
  ["issa-12-curls", "8. Zottman Curl"],
  ["issa-biceps-guide", "4. Zottman Curls"]]}],
 "tips": [{"c": "curl.control", "s": [
  ["catalyst-915", "opis („lower under control in this pronated position”)"],
  ["issa-12-curls", "8. Zottman Curl („slowly lower the weights with palms facing down”)"]]}],
 "mistakes": []
},
"Reverse Curl": {
 "setup": [{"c": "curl.revGrip", "s": [
  ["catalyst-873", "opis (gryf łamany, nachwyt)"],
  ["issa-12-curls", "5. Reverse Curl (sztanga dozwolona; dłonie w dół)"],
  ["fedb-reverse-barbell-curl", "krok 1 (nachwyt)"]]}],
 "move": [],
 "tips": [
  {"c": "curl.elbows", "s": [
   ["catalyst-873", "opis („keeping the elbows close to the sides”)"],
   ["issa-12-curls", "5. Reverse Curl („elbows close to your body”)"],
   ["fedb-reverse-barbell-curl", "kroki 1–2 (łokcie przy tułowiu, pracują tylko przedramiona)"]]},
  {"c": "curl.control", "s": [
   ["catalyst-873", "opis („return under control to full extension”)"],
   ["issa-12-curls", "5. Reverse Curl („lower the weight slowly”)"],
   ["fedb-reverse-barbell-curl", "krok 3"]]}],
 "mistakes": []
},
"Standing Dumbbell Reverse Curl": {
 "setup": [{"c": "curl.revGripDb", "s": [
  ["issa-12-curls", "5. Reverse Curl (hantle wymienione wprost; dłonie w dół)"],
  ["fedb-standing-db-reverse", "krok 1 (nachwyt)"]]}],
 "move": [],
 "tips": [
  {"c": "curl.elbows", "s": [
   ["issa-12-curls", "5. Reverse Curl („elbows close to your body”)"],
   ["fedb-standing-db-reverse", "krok 2 („Only the forearms should move.”)"]]},
  {"c": "curl.control", "s": [
   ["issa-12-curls", "5. Reverse Curl („lower the weight slowly”)"],
   ["fedb-standing-db-reverse", "krok 3"]]}],
 "mistakes": []
},
"Concentration Curl (hantle)": {
 "setup": [{"c": "conc.setup", "s": [
  ["catalyst-816", "opis (siad, tył ramienia o wewnętrzną stronę uda)"],
  ["issa-12-curls", "11. Concentration Curl (łokieć na wewnętrznej stronie uda)"],
  ["issa-biceps-guide", "3. Concentration Curls (tył ramienia na udzie, ręka zwisa)"],
  ["ace-prosource-2014-biceps", "opis koncentracyjnego („the humerus is pressed against the leg”)"]]}],
 "move": [],
 "tips": [{"c": "curl.control", "s": [
  ["catalyst-816", "opis („then lower under control”)"],
  ["issa-biceps-guide", "3. Concentration Curls („Control the weight back to the starting position.”)"]]}],
 "mistakes": []
},
"Machine Biceps Curl": {
 "setup": [{"c": "machineCurl.setup", "s": [
  ["ace-184", "Step 1 (ramiona na podpórce, regulacja siedziska)"],
  ["uwo-biceps-triceps", "Preacher Curl („Adjust seat height so that your arms comfortably rest on the pad…”)"]]}],
 "move": [],
 "tips": [{"c": "curl.control", "s": [
  ["ace-184", "Step 3 („slow, controlled manner”)"],
  ["uwo-biceps-triceps", "Preacher Curl („lower down with control”)"]]}],
 "mistakes": []
},
"Reverse Cable Curl": {
 "setup": [{"c": "curl.revCableSetup", "s": [
  ["catalyst-872", "opis (drążek prosty lub łamany, dolny wyciąg, nachwyt)"],
  ["fedb-reverse-cable", "krok 1 (drążek, dolny wyciąg, dłonie w dół)"]]}],
 "move": [],
 "tips": [{"c": "curl.control", "s": [
  ["catalyst-872", "opis („return under control to full extension”)"],
  ["fedb-reverse-cable", "krok 3"]]}],
 "mistakes": []
},
"Reverse EZ-Bar Preacher Curl": {
 "setup": [
  {"c": "preacher.arms", "s": [
   ["catalyst-874", "opis („Keeping the arms supported on the bench…”)"],
   ["fedb-reverse-bb-preacher", "krok 2"],
   ["issa-12-curls", "9. Preacher Curl"]]},
  {"c": "curl.revGrip", "s": [
   ["catalyst-874", "opis (gryf łamany lub prosty, nachwyt)"],
   ["fedb-reverse-bb-preacher", "krok 1 (gryf łamany, dłonie w dół)"]]}],
 "move": [],
 "tips": [
  {"c": "preacher.range", "s": [
   ["fedb-reverse-bb-preacher", "kroki 3–4 (do wysokości barku, do wyprostu)"],
   ["issa-12-curls", "9. Preacher Curl (maksymalne zgięcie, potem wyprost)"]]},
  {"c": "curl.control", "s": [
   ["catalyst-874", "opis („return to the bottom under control”)"],
   ["fedb-reverse-bb-preacher", "krok 4 (opuszczaj powoli)"]]}],
 "mistakes": []
},
"Hammer Curl (linki)": {
 "setup": [{"c": "curl.ropeSetup", "s": [
  ["catalyst-881", "opis („…low cable with the palms facing each other”)"],
  ["fedb-cable-hammer-rope", "kroki 1–2 (lina na dolnym wyciągu, chwyt neutralny)"]]}],
 "move": [],
 "tips": [{"c": "curl.control", "s": [
  ["catalyst-881", "opis („lower under control”)"],
  ["fedb-cable-hammer-rope", "krok 6 (powoli)"]]}],
 "mistakes": []
},
"Standing One-Arm Cable Curl": {
 "setup": [{"c": "curl.cable1Setup", "s": [
  ["catalyst-887", "opis („single-arm handle attached to a low cable with the palm up”)"],
  ["fedb-standing-one-arm-cable", "kroki 1–2 (pojedynczy uchwyt, dolny wyciąg, dłoń do przodu)"]]}],
 "move": [],
 "tips": [{"c": "curl.control", "s": [
  ["catalyst-887", "opis („then lower under control”)"],
  ["fedb-standing-one-arm-cable", "krok 5 (powoli)"]]}],
 "mistakes": []
},
"Cable Preacher Curl": {
 "setup": [{"c": "preacher.arms", "s": [
  ["issa-12-curls", "9. Preacher Curl (wyciąg wymieniony wprost; ramiona na ławce)"],
  ["fedb-cable-preacher", "kroki 3–4 (łokcie i ramiona na podpórce)"]]}],
 "move": [],
 "tips": [{"c": "preacher.range", "s": [
  ["issa-12-curls", "9. Preacher Curl (maksymalne zgięcie, potem wyprost)"],
  ["fedb-cable-preacher", "kroki 4–5 (start z pełnego wyprostu, do barków)"],
  ["pmc-7460162", "2.5 (pełny zakres; szczebel 3, dodatkowo)"]]}],
 "mistakes": []
},
"Preacher Hammer Dumbbell Curl": {
 "setup": [{"c": "preacher.arms", "s": [
  ["issa-12-curls", "9. Preacher Curl (hantle; ramiona na ławce)"],
  ["fedb-preacher-hammer", "krok 1"]]}],
 "move": [],
 "tips": [{"c": "preacher.range", "s": [
  ["issa-12-curls", "9. Preacher Curl"],
  ["fedb-preacher-hammer", "kroki 3–4 (pełne rozciągnięcie, pełne zgięcie)"]]}],
 "mistakes": []
},
"Zottman Preacher Curl": {
 "setup": [{"c": "preacher.arms", "s": [
  ["issa-12-curls", "9. Preacher Curl (hantle; ramiona na ławce)"],
  ["fedb-zottman-preacher", "krok 1"]]}],
 "move": [{"c": "zottman.move", "s": [
  ["fedb-zottman-preacher", "kroki 2–5 (w dół nachwytem, na dole obrót, w górę podchwytem) — wprost"],
  ["issa-12-curls", "8. Zottman Curl (wersja stojąca — UPROSZCZENIE/analogia)"],
  ["catalyst-915", "opis (wersja stojąca — UPROSZCZENIE/analogia)"]]}],
 "tips": [{"c": "preacher.range", "s": [
  ["issa-12-curls", "9. Preacher Curl"],
  ["fedb-zottman-preacher", "kroki 2 i 4 (pełne rozciągnięcie, pełne zgięcie)"]]}],
 "mistakes": []
},
"High Cable Curl": {
 "setup": [{"c": "curl.highArms", "s": [
  ["issa-12-curls", "6. Cable Curl („A high cable position holds the upper arm parallel to the floor…”)"],
  ["fedb-high-cable", "krok 1 („…parallel to the floor.”)"]]}],
 "move": [], "tips": [], "mistakes": []
}
```

Warunkowe (wkleić tylko po potwierdzeniu BarBend jako szczebla 4):

```json
"Spider Curl": {
 "setup": [{"c": "spider.setup", "s": [
  ["catalyst-835", "opis („Lie prone on an incline bench… hanging at arms' length”)"],
  ["barbend-spider-curl", "How to (klatka o oparcie, ręce zwisają prosto w dół)"]]}],
 "move": [],
 "tips": [{"c": "spider.arm", "s": [
  ["catalyst-835", "opis („keeping the upper arm approximately vertical”)"],
  ["barbend-spider-curl", "How to („Your upper arm should remain static the entire time.”)"]]}],
 "mistakes": []
},
"Drag Curl": {
 "setup": [],
 "move": [{"c": "drag.path", "s": [
  ["fedb-drag-curl", "kroki 1–3 (gryf przy tułowiu, łokcie do tyłu)"],
  ["barbend-drag-curl", "How to (ciężar jak najbliżej ciała; ramię w linii tułowia lub lekko za nim)"]]}],
 "tips": [{"c": "curl.control", "s": [
  ["fedb-drag-curl", "krok 3 (powoli)"],
  ["barbend-drag-curl", "How to („Lower the weight under eccentric control…”)"]]}],
 "mistakes": []
}
```

## 3. Nowe zdania (PL + EN)

Istniejące w `lib/cues/text/pl.json` użyte bez zmian: `preacher.range`, `curl.control`, `curl.elbows`. Z curl.md (jeszcze nie w pl.json):
`conc.setup`, `incline.setup`, `spider.setup`, `spider.arm`, `zottman.move` — bez zmian; `curl.revGrip` — **nowe, krótsze brzmienie**
(„ręce wyprostowane w dół” potwierdza tylko Catalyst; free-exercise-db i ISSA tego nie mówią).

| id | PL | EN (propozycja) | Źródła |
|---|---|---|---|
| `curl.revGrip` (zmiana względem curl.md) | Chwyć gryf nachwytem. | Grip the bar overhand. | catalyst-873/874, issa-12-curls, fedb-reverse-* |
| `curl.revGripDb` | Trzymaj hantle nachwytem. | Hold the dumbbells with an overhand grip. | issa-12-curls, fedb-standing-db-reverse |
| `curl.revCableSetup` | Chwyć drążek dolnego wyciągu nachwytem. | Grip the low-cable bar overhand. | catalyst-872, fedb-reverse-cable |
| `curl.ropeSetup` | Chwyć linę dolnego wyciągu chwytem młotkowym — dłonie zwrócone do siebie. | Hold the rope on the low cable with palms facing each other. | catalyst-881, fedb-cable-hammer-rope |
| `curl.cable1Setup` | Chwyć pojedynczy uchwyt dolnego wyciągu podchwytem. | Grab a single handle on the low cable, palm up. | catalyst-887, fedb-standing-one-arm-cable |
| `preacher.arms` | Ramię opierasz o podpórkę modlitewnika i nie odrywasz go przez cały ruch. | Keep your upper arm resting on the preacher pad the whole time. | catalyst-868/874/889, issa-12-curls, issa-biceps-guide, fedb-*-preacher |
| `machineCurl.setup` | Ustaw siedzisko tak, żeby ramiona wygodnie leżały na podpórce. | Set the seat so your upper arms rest comfortably on the pad. | ace-184, uwo-biceps-triceps |
| `curl.highArms` | Ramiona trzymaj równolegle do podłogi. | Keep your upper arms parallel to the floor. | issa-12-curls, fedb-high-cable |
| `drag.path` (warunkowe) | Prowadź gryf blisko tułowia, cofając łokcie do tyłu. | Keep the bar close to your body as you draw your elbows back. | fedb-drag-curl, barbend-drag-curl |

Każde nowe zdanie: 35 języków, wpis w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`, potem `--rehash`), recenzja lokalizacji.

Krótkie cytaty (jedno zdanie na źródło):
- issa-12-curls, 9: „Sit or stand with your upper arms resting firmly on the bench.”
- issa-12-curls, 7: „Begin with your arms hanging down fully extended, holding dumbbells with a supinated or hammer grip.”
- issa-12-curls, 5: „Whether you use dumbbells, kettlebells, or a barbell, hold the weight with palms facing downward.”
- issa-biceps-guide, 3: „Control the weight back to the starting position.”
- ace-184, Step 3: „…allowing your elbows to extend in a slow, controlled manner…”
- uwo-biceps-triceps, Preacher Curl: „Adjust seat height so that your arms comfortably rest on the pad…”
- catalyst-881: „Hold a rope handle attached to a low cable with the palms facing each other.”
- catalyst-887: „Hold a single-arm handle attached to a low cable with the palm up.”
- catalyst-872: „Hold a straight or EZ handle attached to a low cable with a pronated grip and curl completely…”
- catalyst-874: „Keeping the arms supported on the bench, curl the bar up and return to the bottom under control.”
- fedb-high-cable, krok 1: „Position your upper arms in a way that they are parallel to the floor.”
- barbend-spider-curl: „Your upper arm should remain static the entire time.”

## 4. Otwarte

1. **[OTWARTE] Pacha przy krawędzi w `preacher.setup`.** Żadne przeczytane źródło szczebla 4 (Catalyst, ISSA, free-exercise-db) nie mówi o pasze;
   mówi to tylko Havers 2025 (szczebel 3, ustawienie testowe) — „jedno źródło”. Dotyczy też Barbell Preacher Curl z curl.md i istniejącego wpisu
   Preacher Curl. Propozycja: dla nowych wpisów `preacher.arms` (wyżej); decyzja co do starych wpisów — koordynator/audytor.
2. **[OTWARTE] BarBend jako szczebel 4** — serwis specjalistyczny, artykuły podpisane przez trenerów z certyfikatami; bez recenzenta. Od tego zależą
   Spider Curl i Drag Curl.
3. **[OTWARTE] ISSA i Western University** — nowe organizacje; zaproponowane jako szczebel 4 (organizacja certyfikująca trenerów; uczelnia). Do potwierdzenia przy recenzji.
4. **[OTWARTE] `curl.elbows` + `curl.mis.elbows` w zestawie ogólnym** przy Hammer Curl (linki), Standing One-Arm Cable Curl, Incline Hammer Curl, Reverse Cable Curl,
   Cross Body Hammer Curl, Standing Inner-Biceps Curl, Reverse Plate Curls: potwierdza je tylko free-exercise-db. Catalyst przy linie pisze, że lina pozwala
   rękom poruszać się swobodniej („allowing the arms to move more freely”) — nie przeczy wprost (chodzi o obciążenie łokcia), ale nie potwierdza.
   Ocena wg progu wydania: zdania techniki z jednym źródłem — do decyzji koordynatora (karta tylko z potwierdzonymi zdaniami po przełączeniu z `general`).
5. **[OTWARTE] Zottman Preacher Curl — `zottman.move`**: wprost tylko free-exercise-db; ISSA i Catalyst opisują ten sam obrót w wersji stojącej → oznaczone „uproszczenie”.
   Uwaga: free-exercise-db zaczyna ten wariant od góry (opuszczanie nachwytem, obrót na dole) — kolejność faz ta sama co w zdaniu.
6. **[OTWARTE] Jedno źródło (free-exercise-db):** Cross Body Hammer Curl, Lying Close-Grip Bar Curl On High Pulley, Lying Supine Dumbbell Curl, Standing Inner-Biceps Curl,
   Reverse Plate Curls, Standing Concentration Curl, Seated Close-Grip Concentration Barbell Curl, Spider Curl (sztanga — free-exercise-db opisuje gryf łamany na przedniej
   stronie modlitewnika, BarBend tylko wzmianka). Lying Cable Curl, Cable Curl (dwie linki), Bayesian Curl — brak drugiego przeczytanego źródła (Bayesian: BarBend nieczytany do końca).
7. **[OTWARTE] Muscle & Strength, PureGym, Garage Gym Reviews, Breaking Muscle** — mają strony wielu z tych wariantów; szczebel nieustalony (sklep / sieć siłowni / serwisy ogólne) — nie użyte.
   Gdyby właściciel/audytor uznał jeden z nich za szczebel 4, pkt 6 w większości da się zamknąć.

## Stan

- Zrobione: 17 gotowych + 2 warunkowe (sekcja 1), wszystkie z WebFetch 02.11.2026.
- Zostało: 11 otwartych (pkt 6) i decyzje z pkt 1–4.
- Następny krok: po decyzji o BarBend/M&S — Cross Body Hammer, Bayesian i warianty leżące (BarBend ma Bayesian; przeczytać w całości).
- Pułapki: WebFetch streszcza — cytaty wyżej to krótkie dosłowne fragmenty z odpowiedzi narzędzia; free-exercise-db ma błędy kopiowania (Seated Close-Grip Concentration — krok 3 mówi o hantlach).
