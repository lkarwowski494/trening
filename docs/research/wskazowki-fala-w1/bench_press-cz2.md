# bench_press (część 2) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zakres: 13 ćwiczeń rodziny bench_press (lista koordynatora). Reguła: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) —
zdanie ustalone przy ≥ 2 zgodnych, niezależnych źródłach szczebla 4, żadne przeczytane nie przeczy. Wszystkie źródła odczytane
narzędziem WebFetch 02.11.2026; „miejsce” to nagłówek lub krok w odczytanej treści strony. ExRx (403) i web.archive.org (zablokowane)
niedostępne. Strony innych aplikacji treningowych pominięte (uzupełnienie briefu).

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Close-Grip Dumbbell Press | gotowe | Traktowane jako wyciskanie hantli złączonych chwytem neutralnym (źródło `fitnessvolt-cg-db-press` wprost: ta sama nazwa, „także squeeze/crush press”). 2 źródła na każde zdanie. Usunięte z zestawu ogólnego: `bp.contact`, `bp.control`, `bp.mis.arch` (nie potwierdzone dla wariantu). |
| Close-Grip EZ-Bar Press | otwarte | brak 2 przeczytanych opisów wariantu (patrz „Otwarte”) |
| Smith Machine Close-Grip Bench Press | otwarte | 1 źródło (producent sprzętu), patrz „Otwarte” |
| JM Press | gotowe | 3 źródła; `jm.elbows` zachowane (potwierdzone); `bp.contact` i `bp.mis.arch` usunięte (nie potwierdzone) |
| Board Press | gotowe | 2 źródła; `bp.mis.arch` usunięte — jedno źródło wprost zaleca utrzymać zwykłe wygięcie (sprzeczność, „Otwarte”) |
| Pin Press | gotowe | 3 źródła (jakość dwóch niższa, patrz uwaga przy źródłach); `bp.contact`, `bp.blades`, `bp.mis.arch` usunięte |
| Band Bench Press | otwarte | nieustalone, co pokazuje ćwiczenie (katalog: guma + ławka, bez sztangi) |
| Reverse Band Bench Press | gotowe | 2 źródła; `bp.control` sprzeczne ze źródłem (szybkie opuszczanie), usunięte |
| Bench Press with Chains | gotowe | 2 źródła; `bp.control` sprzeczne ze źródłem, `bp.elbowsMid`, `bp.blades`, `bp.contact`, `bp.mis.arch` nie potwierdzone dla wariantu |
| Chain Press | otwarte | nieustalone, co pokazuje ćwiczenie (katalog: łańcuchy + ławka, bez sztangi) |
| Floor Press with Chains | otwarte | opisy wyciskania z podłogi bez łańcuchów (analogia) — patrz „Otwarte” |
| Barbell Guillotine Bench Press | otwarte | źródła się różnią (łokcie, tor), ryzyko opisywane w źródłach — bez zdań zdrowotnych |
| Decline Close-Grip Bench To Skull Crusher | otwarte | brak przeczytanego opisu (serwis z opisem płatny, reszta to strony aplikacji) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Close-Grip Dumbbell Press": {
  "setup": [
   {"c": "cgdb.setup", "s": [["fitnessvolt-cg-db-press", "Grip; Setup on the Bench (neutral grip, dumbbells against each other)"], ["mikolo-db-squeeze-press", "Setup on Bench, krok 2; Grip, krok 4; Dumbbells Pressed Together, krok 5"]]}
  ],
  "move": [
   {"c": "cgdb.move", "s": [["fitnessvolt-cg-db-press", "Pressing Up; Lowering (keeping the inward squeeze)"], ["mikolo-db-squeeze-press", "Lowering, krok 7; Press, krok 8"]]}
  ],
  "tips": [
   {"c": "cgbp.elbows", "s": [["fitnessvolt-cg-db-press", "Elbows (tuck your upper arms in against your sides)"], ["mikolo-db-squeeze-press", "Elbows, krok 6 (avoid flaring your elbows out)"]]}
  ],
  "mistakes": [
   {"c": "cgdb.mis.squeeze", "s": [["fitnessvolt-cg-db-press", "Common Mistakes: Easing off the squeeze"], ["mikolo-db-squeeze-press", "Mistakes to Avoid: Losing the squeeze"]]}
  ]
 },
 "JM Press": {
  "setup": [
   {"c": "jm.grip", "s": [["onnit-jm-press", "Step 2 (roughly shoulder width)"], ["catalyst-jm-press", "opis (shoulder-width grip)"], ["elitefts-jm-press", "The Setup (grip similar to a close-grip bench)"]]}
  ],
  "move": [
   {"c": "jm.move", "s": [["elitefts-jm-press", "Step-by-Step Execution: The Descent; The Ascent"], ["onnit-jm-press", "Step 4; Step 5; Step 6"], ["catalyst-jm-press", "opis (lower the bar toward your neck or chin)"]]}
  ],
  "tips": [
   {"c": "jm.elbows", "s": [["elitefts-jm-press", "The Setup (45-degree angle); The Descent (Keep the Elbows UP)"], ["onnit-jm-press", "Step 4 (elbows about 45 degrees from your sides)"], ["catalyst-jm-press", "opis (without letting the elbows drop)"]]}
  ],
  "mistakes": [
   {"c": "jm.mis.elbowsDrop", "s": [["elitefts-jm-press", "Common Mistakes: Dropping the elbows"], ["catalyst-jm-press", "opis (press back up without letting the elbows drop)"]]}
  ]
 },
 "Board Press": {
  "setup": [
   {"c": "board.setup", "s": [["barbell-logic-board-press", "Set Up (center board implement on bar / partner hold board on chest)"], ["inspireusa-board-press", "How to Do the Board Bench Press: Board Placement (partner, wrapping to the bar)"]]}
  ],
  "move": [
   {"c": "board.move", "s": [["barbell-logic-board-press", "Movement (slow, controlled descent; full pause)"], ["inspireusa-board-press", "How to Do the Board Bench Press: lowering, complete stop, press to lockout"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "board.mis.drop", "s": [["inspireusa-board-press", "Common Mistakes: Dropping the Bar Onto the Boards"], ["barbell-logic-board-press", "Movement (slow, controlled descent)"]]}
  ]
 },
 "Pin Press": {
  "setup": [
   {"c": "pin.setup", "s": [["inspireusa-pin-press", "How to Do a Pin Press, krok 1 (just below the sticking point)"], ["steel-pin-press", "krok 1: Set up your barbell (above chest level; higher for lockout)"], ["elitefts-dynamic-pin-press", "punkty kluczowe (pins slightly above your touch point or just below your sticking point)"]]}
  ],
  "move": [
   {"c": "pin.move", "s": [["inspireusa-pin-press", "krok 3; krok 4"], ["elitefts-dynamic-pin-press", "akapit o „true Pin Press” (dead stop, explode off the pins)"], ["steel-pin-press", "krok 4; krok 5"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "pin.mis.bounce", "s": [["inspireusa-pin-press", "Common Pin Press Mistakes: Not fully stopping the bar"], ["steel-pin-press", "krok 5 (reset on the pins each rep removes the bounce)"]]}
  ]
 },
 "Reverse Band Bench Press": {
  "setup": [
   {"c": "rband.setup", "s": [["rusin-reverse-band", "Band Setup (choke the bands around the top of a squat rack); tension bottom vs top"], ["westside-chains-bands", "Band Setup: bands from the top (bar nearly weightless at the chest)"]]}
  ],
  "move": [
   {"c": "rband.move", "s": [["rusin-reverse-band", "Technique: eccentric; concentric (drive up hard)"], ["westside-chains-bands", "Technique Cues: Speed (reverse it as fast as you can)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "rband.mis.slow", "s": [["rusin-reverse-band", "pressing without intent (slow, non-explosive reps)"], ["westside-chains-bands", "Technique Cues: Speed; Bands (fast start)"]]}
  ]
 },
 "Bench Press with Chains": {
  "setup": [
   {"c": "chain.setup", "s": [["nasm-bench-press-chains", "Step 1: Setup (slack at the bottom, rise as you press)"], ["westside-chains-bands", "Chain Setup (Speed Day): at the chest all of the chain on the floor"]]}
  ],
  "move": [
   {"c": "chain.move", "s": [["nasm-bench-press-chains", "Step 3: Execute/Drive (accelerating through the concentric)"], ["westside-chains-bands", "Technique Cues: Speed; Launch"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "chain.mis.slow", "s": [["nasm-bench-press-chains", "Common Mistakes: not accelerating through the top"], ["westside-chains-bands", "Technique Cues: Speed (reverse it as fast as you can)"]]}
  ]
 }
}
```

Uwaga do koordynatora: w `lib/figures/v2/cue-sets.json` te ćwiczenia mają dziś tryb `general` z listami `ok`/`err`;
przy przejściu na `own` zdania z zestawu ogólnego niewymienione wyżej znikają z karty (zgodnie z pkt 3 uzupełnienia briefu).

## Nowe zdania (id | PL | EN)

| id | PL | EN (propozycja) |
|---|---|---|
| cgdb.setup | Połóż się na ławce, hantle trzymaj chwytem neutralnym nad klatką i dociśnij je do siebie. | Lie on the bench, hold the dumbbells over your chest with palms facing each other and press them together. |
| cgdb.move | Opuść hantle w stronę klatki, cały czas ściskając je razem, i wypchnij je w górę. | Lower the dumbbells toward your chest while squeezing them together, then press them back up. |
| cgdb.mis.squeeze | Hantle rozjeżdżają się — zamiast ściskać je razem przez całą serię. | Letting the dumbbells drift apart instead of squeezing them together the whole set. |
| jm.grip | Chwyć sztangę mniej więcej na szerokość barków. | Grip the bar about shoulder-width apart. |
| jm.move | Zginając łokcie, prowadź sztangę w stronę szyi i brody, aż przedramiona dotkną bicepsów; potem wypchnij ją prosto w górę. | Bend your elbows and bring the bar toward your throat and chin until your forearms meet your biceps, then press straight up. |
| jm.mis.elbowsDrop | Łokcie opadają do boków i ruch zamienia się w zwykłe wąskie wyciskanie. | Elbows drop to your sides and it turns into a regular close-grip press. |
| board.setup | Połóż deski na klatce pod sztangą — niech je trzyma partner albo zamocuj je na gryfie. | Place the boards on your chest under the bar — have a partner hold them or strap them to the bar. |
| board.move | Opuść sztangę powoli na deski, zatrzymaj ją na chwilę i wypchnij do wyprostu rąk. | Lower the bar slowly onto the boards, stop it for a moment, then press to lockout. |
| board.mis.drop | Rzucanie sztangi na deski zamiast powolnego opuszczania. | Dropping the bar onto the boards instead of lowering it slowly. |
| pin.setup | Ławka w klatce; podpórki ustaw tam, skąd chcesz pchać — tuż nad klatką albo wyżej, gdzie zwykle się zacinasz. | Bench inside the rack; set the pins where you want to press from — just above your chest or higher, where you usually stall. |
| pin.move | Sztanga zatrzymuje się całkiem na podpórkach; z martwego punktu wypchnij ją do wyprostu rąk. | The bar comes to a full stop on the pins; press it from the dead stop to lockout. |
| pin.mis.bounce | Odbijanie sztangi od podpórek zamiast pełnego zatrzymania. | Bouncing the bar off the pins instead of a full stop. |
| rband.setup | Ławka w klatce; gumy zaczep u góry klatki i załóż na końce gryfu — najmocniej pomagają przy klatce, w górze prawie wcale. | Bench inside the rack; anchor the bands at the top of the rack and loop them on the bar ends — they help most at the chest, hardly at all at the top. |
| rband.move | Opuść sztangę do klatki, a potem wypchnij ją mocno i szybko do wyprostu rąk. | Lower the bar to your chest, then drive it up hard and fast to lockout. |
| rband.mis.slow | Wolne, ospałe wypychanie zamiast mocnego i szybkiego. | Pressing slowly and lazily instead of hard and fast. |
| chain.setup | Zawieś łańcuchy na końcach gryfu tak, żeby przy klatce leżały na podłodze, a przy wypychaniu stopniowo się z niej podnosiły. | Hang the chains on the bar ends so they rest on the floor at your chest and lift off gradually as you press. |
| chain.move | Wypychaj sztangę mocno i przyspieszaj aż do wyprostu rąk — w górze robi się ciężej. | Drive the bar up hard and keep accelerating to lockout — it gets heavier at the top. |
| chain.mis.slow | Zwalnianie w górnej części ruchu zamiast przyspieszania. | Slowing down near the top instead of accelerating. |

Istniejące zdania użyte: `cgbp.elbows`, `jm.elbows` (bez zmian brzmienia).

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | odczyt |
|---|---|---|---|---|
| fitnessvolt-cg-db-press | https://fitnessvolt.com/close-grip-dumbbell-press/ | Fitness Volt | 4 | 02.11.2026 |
| mikolo-db-squeeze-press | https://gym-mikolo.com/blogs/home-gym/squeeze-more-gains-from-your-chest-with-the-dumbbell-squeeze-press | Gym Mikolo (producent sprzętu) | 4 | 02.11.2026 |
| elitefts-jm-press | https://elitefts.com/blogs/training/how-to-perform-the-jm-press-a-step-by-step-guide-from-the-inventor | elitefts (D. Tate) | 4 | 02.11.2026 |
| onnit-jm-press | https://www.onnit.com/academy/jm-press | Onnit Academy | 4 | 02.11.2026 |
| catalyst-jm-press | https://catalystathletics.com/exercise/801/JM-Press/ | Catalyst Athletics | 4 | 02.11.2026 |
| barbell-logic-board-press | https://barbell-logic.com/?p=78119 | Barbell Logic | 4 | 02.11.2026 |
| inspireusa-board-press | https://www.inspireusafoundation.org/?p=13617 | Inspire USA Foundation | 4 | 02.11.2026 |
| inspireusa-pin-press | https://www.inspireusafoundation.org/?p=15107 | Inspire USA Foundation | 4 | 02.11.2026 |
| steel-pin-press | https://steelsupplements.com/blogs/steel-blog/how-to-pin-press-pros-cons-tips-alternative-exercises | Steel Supplements | 4 | 02.11.2026 |
| elitefts-dynamic-pin-press | https://elitefts.com/blogs/coaching-logs/bench-press-builder-the-dynamic-pin-press-with-video | elitefts (C.J. Murphy) | 4 | 02.11.2026 |
| rusin-reverse-band | https://drjohnrusin.com/how-to-use-the-lightening-band-aka-reverse-band-method | John Rusin | 4 | 02.11.2026 |
| westside-chains-bands | https://www.westside-barbell.com/a/blog/chains-and-bands | Westside Barbell (L. Simmons) | 4 | 02.11.2026 |
| nasm-bench-press-chains | https://www.nasm.org/resource-center/exercise-library/barbell-bench-press-with-chains | NASM | 4 | 02.11.2026 |

Uwagi o jakości: `inspireusa-*` i `steel-pin-press` to serwisy treści (Inspire ma recenzenta: fizjoterapeutę), słabsze od organizacji
szkolących trenerów; elitefts (dwa różne artykuły, dwóch autorów) liczone jako jedna organizacja. W Pin Press zdanie `pin.mis.bounce`
opiera się na Inspire (wprost) i Steel (pośrednio: „reset na podpórkach usuwa odbicie”) — do oceny recenzenta.
Źródło `training-conditioning.com` o hantlach odrzucone: przedruk z Fitness Volt (nie niezależne).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Close-Grip EZ-Bar Press | Wyniki to głównie strony aplikacji (pominięte), serwis z opisem płatny (przekierowanie na członkostwo). Brak 2 przeczytanych opisów. W wynikach wyszukiwarki (nieprzeczytane) pojawia się teza, że łokcie „prawie przy bokach” to błąd — sprawdzić przed użyciem `cgbp.elbows` dla tego wariantu. |
| Smith Machine Close-Grip Bench Press | Tylko 1 przeczytany opis (blog producenta sprzętu Dynamo Fitness: łokcie blisko tułowia, sztanga do klatki — ale chwyt „na szerokość barków”). Drugi producent (RitFit) opisuje JM press na suwnicy, nie to ćwiczenie. |
| Band Bench Press | Katalog: guma + ławka, bez sztangi — nie wiadomo, czy to wyciskanie z samą gumą, czy sztanga z gumami; od tego zależą wskazówki. Do ustalenia z figurą/opisem ćwiczenia; potem research. |
| Chain Press | Jw.: katalog: łańcuchy + ławka, bez sztangi. Jeśli to wyciskanie sztangi z łańcuchami — może dostać blok „Bench Press with Chains”. |
| Floor Press with Chains | Przeczytane opisy wyciskania z podłogi (Barbell Logic „Gym Shorts: The Floor Press”, RNT Fitness) są bez łańcuchów; Westside wspomina tylko przewieszenie łańcucha na gryfie. Kandydaci: `flp.setup` „Połóż się na podłodze pod sztangą, nogi wyprostowane, pięty wbite w podłogę.”, `flp.move` „Opuść sztangę kontrolowanie, aż ramiona dotkną podłogi, i wypchnij ją do wyprostu rąk.” — analogia do wariantu bez łańcuchów; błąd „odbijanie łokci od podłogi” tylko 1 źródło (RNT). Obecny `bp.blades` potwierdza tylko RNT. |
| Barbell Guillotine Bench Press | Źródła się różnią: BarBend (Step 1–3) — chwyt szerszy niż zwykle, łokcie szeroko na boki, sztanga do obojczyków; Coach (Coach Staff) — chwyt nieco szerszy niż barki, ręce „do środka”, sztanga w stronę szyi. Część wspólna: sztanga schodzi wyżej niż do środka klatki, powoli. Oba źródła ostrzegają przed ciężarem i bliskością szyi — twierdzeń zdrowotnych nie formułuję; decyzja, czy pokazywać to ćwiczenie z kartą, do właściciela/koordynatora. |
| Decline Close-Grip Bench To Skull Crusher | Jedyny opis tego połączenia to płatny serwis i strony aplikacji. Obecne `dcgsk.elbows` — źródła nie znalezione. |
| `bp.control` (Bench Press with Chains, Reverse Band) | Sprzeczne: Westside (Technique Cues) każe opuszczać szybko i od razu odwracać ruch („Never pause”); NASM i Rusin — opuszczanie kontrolowane. Wspólne: bez rzucania i odbijania? — nie potwierdzone wprost; zdanie pominięte. |
| `bp.mis.arch` (Board Press, Pin Press) | Inspire (Board: „Reduced Arch Usage” jako błąd; Pin: krok 2 „lower back arched”) zaleca wygięcie — przeczy brzmieniu „nadmierne wyginanie lędźwi” jako błędu; nie dodawać. |
| `bp.contact`, `bp.blades`, `bp.elbowsMid` (warianty) | Dla JM, Board, Pin, łańcuchów, gum, hantli — co najwyżej 1 przeczytane źródło na wariant (np. NASM chains Step 2; Inspire Pin krok 2; Mikolo krok 3). Pominięte. |
| JM Press — nadgarstki | elitefts („Rock the Wrists Back”) i Catalyst („curl the wrists”) vs Onnit (nadgarstki nie mają uciekać w wyprost) — różne sformułowania, nie rozstrzygam. |
| Reverse Band — pauza | Rusin: krótka pauza na dole; Westside: bez pauzy — pominięte. |
| Close-Grip Dumbbell — wyprost łokci | Fitness Volt: bez blokowania łokci; Mikolo: do pełnego wyprostu — pominięte. |
