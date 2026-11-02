# bench_press (część 2) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zakres: 13 ćwiczeń rodziny bench_press (lista koordynatora). Reguła: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) —
zdanie ustalone przy ≥ 2 zgodnych, niezależnych źródłach szczebla 4, żadne przeczytane nie przeczy. Wszystkie źródła odczytane
narzędziem WebFetch 02.11.2026; „miejsce” to nagłówek lub krok w odczytanej treści strony. ExRx (403) i web.archive.org (zablokowane)
niedostępne. Strony innych aplikacji treningowych pominięte (uzupełnienie briefu).
Szczeble źródeł poprawione wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcje „Korekta szczebli (02.11.2026)” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Close-Grip Dumbbell Press | otwarte | po uzupełnieniu 3: Fitness Volt (P. Dale, PT; data w metadanych) → 4, Mikolo → 5; zostaje 1 źródło szczebla 4; kandydaci w „Otwarte” |
| Close-Grip EZ-Bar Press | otwarte | brak 2 przeczytanych opisów wariantu (patrz „Otwarte”) |
| Smith Machine Close-Grip Bench Press | otwarte | 1 źródło (sprzedawca sprzętu — szczebel 5), patrz „Otwarte” |
| JM Press | gotowe | po uzupełnieniu 3 (Onnit = 5) każde zdanie ma 2 źródła szczebla 4: elitefts + Catalyst; `bp.contact` i `bp.mis.arch` usunięte (nie potwierdzone) |
| Board Press | otwarte | po uzupełnieniu 3 brak źródła szczebla 4 (Barbell Logic — strona bez autora i daty → 5; Inspire US = 5) |
| Pin Press | otwarte | po korekcie szczebli tylko 1 źródło szczebla 4 (elitefts); Inspire US i Steel Supplements = 5; blok częściowy w „Otwarte” |
| Band Bench Press | otwarte | nieustalone, co pokazuje ćwiczenie (katalog: guma + ławka, bez sztangi) |
| Reverse Band Bench Press | otwarte | po korekcie szczebli tylko 1 źródło szczebla 4 (Westside); strona J. Rusina = 5; blok częściowy w „Otwarte” |
| Bench Press with Chains | gotowe | 2 źródła szczebla 4 (NASM, Westside); `bp.control` sprzeczne ze źródłem, `bp.elbowsMid`, `bp.blades`, `bp.contact`, `bp.mis.arch` nie potwierdzone dla wariantu |
| Chain Press | otwarte | nieustalone, co pokazuje ćwiczenie (katalog: łańcuchy + ławka, bez sztangi) |
| Floor Press with Chains | otwarte | opisy wyciskania z podłogi bez łańcuchów (analogia) — patrz „Otwarte” |
| Barbell Guillotine Bench Press | otwarte | źródła się różnią (łokcie, tor), ryzyko opisywane w źródłach — bez zdań zdrowotnych |
| Decline Close-Grip Bench To Skull Crusher | otwarte | brak przeczytanego opisu (serwis z opisem płatny, reszta to strony aplikacji) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Tylko ćwiczenia „gotowe”. Bloki częściowe ćwiczeń otwartych — w sekcji „Otwarte” (nie do aplikacji).

```json
{
 "JM Press": {
  "setup": [
   {"c": "jm.grip", "s": [["catalyst-jm-press", "opis (shoulder-width grip)"], ["elitefts-jm-press", "The Setup (grip similar to a close-grip bench)"]]}
  ],
  "move": [
   {"c": "jm.move", "s": [["elitefts-jm-press", "Step-by-Step Execution: The Descent; The Ascent"], ["catalyst-jm-press", "opis (lower the bar toward your neck or chin)"]]}
  ],
  "tips": [
   {"c": "jm.elbows", "s": [["elitefts-jm-press", "The Setup (45-degree angle); The Descent (Keep the Elbows UP)"], ["catalyst-jm-press", "opis (without letting the elbows drop)"]]}
  ],
  "mistakes": [
   {"c": "jm.mis.elbowsDrop", "s": [["elitefts-jm-press", "Common Mistakes: Dropping the elbows"], ["catalyst-jm-press", "opis (press back up without letting the elbows drop)"]]}
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
Uwaga do `jm.move`: element „aż przedramiona dotkną bicepsów” — sprawdzić przy recenzji, czy elitefts (The Descent) albo Catalyst mówią to wprost
(wcześniej trzecim źródłem był Onnit Step 4–6, teraz szczebel 5); jeśli nie — skrócić zdanie do „…prowadź sztangę w stronę szyi i brody, potem wypchnij ją prosto w górę.”

## Nowe zdania (id | PL | EN)

Do aplikacji tylko zdania z bloku JSON (`jm.*`, `chain.*`). Pozostałe to kandydaci dla ćwiczeń otwartych (sekcja „Otwarte”), nie do aplikacji.

| id | PL | EN (propozycja) | użycie |
|---|---|---|---|
| cgdb.setup | Połóż się na ławce, hantle trzymaj chwytem neutralnym nad klatką i dociśnij je do siebie. | Lie on the bench, hold the dumbbells over your chest with palms facing each other and press them together. | kandydat (otwarte) |
| cgdb.move | Opuść hantle w stronę klatki, cały czas ściskając je razem, i wypchnij je w górę. | Lower the dumbbells toward your chest while squeezing them together, then press them back up. | kandydat (otwarte) |
| cgdb.mis.squeeze | Hantle rozjeżdżają się — zamiast ściskać je razem przez całą serię. | Letting the dumbbells drift apart instead of squeezing them together the whole set. | kandydat (otwarte) |
| jm.grip | Chwyć sztangę mniej więcej na szerokość barków. | Grip the bar about shoulder-width apart. | JM Press |
| jm.move | Zginając łokcie, prowadź sztangę w stronę szyi i brody, aż przedramiona dotkną bicepsów; potem wypchnij ją prosto w górę. | Bend your elbows and bring the bar toward your throat and chin until your forearms meet your biceps, then press straight up. | JM Press |
| jm.mis.elbowsDrop | Łokcie opadają do boków i ruch zamienia się w zwykłe wąskie wyciskanie. | Elbows drop to your sides and it turns into a regular close-grip press. | JM Press |
| board.setup | Połóż deski na klatce pod sztangą — niech je trzyma partner albo zamocuj je na gryfie. | Place the boards on your chest under the bar — have a partner hold them or strap them to the bar. | kandydat (otwarte) |
| board.move | Opuść sztangę powoli na deski, zatrzymaj ją na chwilę i wypchnij do wyprostu rąk. | Lower the bar slowly onto the boards, stop it for a moment, then press to lockout. | kandydat (otwarte) |
| board.mis.drop | Rzucanie sztangi na deski zamiast powolnego opuszczania. | Dropping the bar onto the boards instead of lowering it slowly. | kandydat (otwarte) |
| pin.setup | Ławka w klatce; podpórki ustaw tam, skąd chcesz pchać — tuż nad klatką albo wyżej, gdzie zwykle się zacinasz. | Bench inside the rack; set the pins where you want to press from — just above your chest or higher, where you usually stall. | kandydat (otwarte) |
| pin.move | Sztanga zatrzymuje się całkiem na podpórkach; z martwego punktu wypchnij ją do wyprostu rąk. | The bar comes to a full stop on the pins; press it from the dead stop to lockout. | kandydat (otwarte) |
| pin.mis.bounce | Odbijanie sztangi od podpórek zamiast pełnego zatrzymania. | Bouncing the bar off the pins instead of a full stop. | kandydat (otwarte) |
| rband.setup | Ławka w klatce; gumy zaczep u góry klatki i załóż na końce gryfu — najmocniej pomagają przy klatce, w górze prawie wcale. | Bench inside the rack; anchor the bands at the top of the rack and loop them on the bar ends — they help most at the chest, hardly at all at the top. | kandydat (otwarte) |
| rband.move | Opuść sztangę do klatki, a potem wypchnij ją mocno i szybko do wyprostu rąk. | Lower the bar to your chest, then drive it up hard and fast to lockout. | kandydat (otwarte) |
| rband.mis.slow | Wolne, ospałe wypychanie zamiast mocnego i szybkiego. | Pressing slowly and lazily instead of hard and fast. | kandydat (otwarte) |
| chain.setup | Zawieś łańcuchy na końcach gryfu tak, żeby przy klatce leżały na podłodze, a przy wypychaniu stopniowo się z niej podnosiły. | Hang the chains on the bar ends so they rest on the floor at your chest and lift off gradually as you press. | Bench Press with Chains |
| chain.move | Wypychaj sztangę mocno i przyspieszaj aż do wyprostu rąk — w górze robi się ciężej. | Drive the bar up hard and keep accelerating to lockout — it gets heavier at the top. | Bench Press with Chains |
| chain.mis.slow | Zwalnianie w górnej części ruchu zamiast przyspieszania. | Slowing down near the top instead of accelerating. | Bench Press with Chains |

Istniejące zdania użyte: `jm.elbows` (bez zmian brzmienia); `cgbp.elbows` tylko w bloku częściowym Close-Grip Dumbbell Press (otwarte).

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | odczyt |
|---|---|---|---|---|
| fitnessvolt-cg-db-press | https://fitnessvolt.com/close-grip-dumbbell-press/ | Fitness Volt; podpis „By Patrick Dale, PT, ex-Marine” (biogram: trener personalny, asesor kwalifikacji fitness); data tylko w metadanych strony (01.06.2021 / 11.08.2024); bez recenzenta | 4 warunkowo (uzupełnienie 3: autor z kwalifikacjami i data; jeśli koordynator wymaga daty widocznej na stronie — 5) | 02.11.2026 |
| mikolo-db-squeeze-press | https://gym-mikolo.com/blogs/home-gym/squeeze-more-gains-from-your-chest-with-the-dumbbell-squeeze-press | Gym Mikolo — blog, bez autora i daty; hantli w ofercie nie ma | 5 | 02.11.2026 |
| elitefts-jm-press | https://elitefts.com/blogs/training/how-to-perform-the-jm-press-a-step-by-step-guide-from-the-inventor | elitefts (producent sprzętu siłowego i serwis z artykułami trenerów), D. Tate, 28.07.2026; w treści brak linków produktowych | 4 | 02.11.2026 |
| onnit-jm-press | https://www.onnit.com/academy/jm-press | Onnit Academy; autor J. Wuebben, 10.07.2025 | 5 (uzupełnienie 3: Onnit = 5) | 02.11.2026 |
| catalyst-jm-press | https://catalystathletics.com/exercise/801/JM-Press/ | Catalyst Athletics | 4 (rozstrzygnięcie koordynatora) | 02.11.2026 |
| barbell-logic-board-press | https://barbell-logic.com/?p=78119 | Barbell Logic — „Gym Shorts: The Board Bench Press”; bez autora i bez daty (tylko „©2026 Barbell Logic”) | 5 (uzupełnienie 3: warunkowo 4 tylko z autorem z kwalifikacjami i datą) | 02.11.2026 |
| inspireusa-board-press | https://www.inspireusafoundation.org/?p=13617 | Inspire US (serwis informacyjny „for people looking to start their fitness journey”); autorka bez formalnych kwalifikacji, recenzent z niewyjaśnionymi skrótami „TE, PTRP”, data tylko „Last Updated” | 5 (uzupełnienie 3: porady ogólne = 5) | 02.11.2026 |
| inspireusa-pin-press | https://www.inspireusafoundation.org/?p=15107 | Inspire US — jw. | 5 | 02.11.2026 |
| steel-pin-press | https://steelsupplements.com/blogs/steel-blog/how-to-pin-press-pros-cons-tips-alternative-exercises | Steel Supplements (sprzedawca suplementów — blog marketingowy) | 5 | 02.11.2026 |
| elitefts-dynamic-pin-press | https://elitefts.com/blogs/coaching-logs/bench-press-builder-the-dynamic-pin-press-with-video | elitefts (C.J. Murphy), 12.05.2022; artykuł instruktażowy w serii „Coaching Log”; ta sama organizacja co elitefts-jm-press | 4 | 02.11.2026 |
| rusin-reverse-band | https://drjohnrusin.com/how-to-use-the-lightening-band-aka-reverse-band-method | John Rusin (strona osobista; bez daty artykułu; w treści promocja własnych gum z linkiem i reklamy programu członkowskiego) | 5 | 02.11.2026 |
| westside-chains-bands | https://www.westside-barbell.com/a/blog/chains-and-bands | Westside Barbell (L. Simmons), 18.10.2016; organizacja z certyfikacją trenerów (menu „Get Certified”, poziomy 1–3); w treści brak linków zakupowych | 4 | 02.11.2026 |
| nasm-bench-press-chains | https://www.nasm.org/resource-center/exercise-library/barbell-bench-press-with-chains | NASM | 4 | 02.11.2026 |

Uwagi: elitefts (dwa różne artykuły, dwóch autorów) liczone jako jedna organizacja.
Źródło `training-conditioning.com` o hantlach odrzucone: przedruk z Fitness Volt (nie niezależne).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Close-Grip Dumbbell Press — całe ćwiczenie | Po uzupełnieniu 3: fitnessvolt-cg-db-press = 4 (warunkowo), mikolo-db-squeeze-press = 5 → 1 źródło szczebla 4. Kandydaci (zgodne w obu tekstach, potrzebne 2 źródła szczebla 4): `cgdb.setup` [fitnessvolt „Grip; Setup on the Bench”; mikolo „Setup on Bench, krok 2; Grip, krok 4; Dumbbells Pressed Together, krok 5”]; `cgdb.move` [fitnessvolt „Pressing Up; Lowering”; mikolo „Lowering, krok 7; Press, krok 8”]; tip `cgbp.elbows` [fitnessvolt „Elbows”; mikolo „Elbows, krok 6”]; `cgdb.mis.squeeze` [fitnessvolt „Common Mistakes: Easing off the squeeze”; mikolo „Mistakes to Avoid: Losing the squeeze”]. Usunięte z zestawu ogólnego: `bp.contact`, `bp.control`, `bp.mis.arch` (nie potwierdzone dla wariantu). |
| Close-Grip EZ-Bar Press | Wyniki to głównie strony aplikacji (pominięte), serwis z opisem płatny (przekierowanie na członkostwo). Brak 2 przeczytanych opisów. W wynikach wyszukiwarki (nieprzeczytane) pojawia się teza, że łokcie „prawie przy bokach” to błąd — sprawdzić przed użyciem `cgbp.elbows` dla tego wariantu. |
| Smith Machine Close-Grip Bench Press | Tylko 1 przeczytany opis (blog sprzedawcy sprzętu Dynamo Fitness, szczebel 5: łokcie blisko tułowia, sztanga do klatki — ale chwyt „na szerokość barków”). Drugi producent (RitFit) opisuje JM press na suwnicy, nie to ćwiczenie. |
| Board Press — całe ćwiczenie | Po uzupełnieniu 3: barbell-logic-board-press = 5 i inspireusa-board-press = 5 → 0 źródeł szczebla 4. Kandydaci: `board.setup` [barbell-logic „Set Up (center board implement on bar / partner hold board on chest)”; inspireusa „Board Placement”]; `board.move` [barbell-logic „Movement (slow, controlled descent; full pause)”; inspireusa „lowering, complete stop, press to lockout”]; `board.mis.drop` [inspireusa „Common Mistakes: Dropping the Bar Onto the Boards”; barbell-logic „Movement (slow, controlled descent)”]. Potrzebne 2 źródła szczebla 4. |
| Pin Press — całe ćwiczenie | Korekta szczebli 02.11.2026: inspireusa-pin-press i steel-pin-press = 5, zostaje 1 źródło szczebla 4 (elitefts-dynamic-pin-press). Kandydaci: `pin.setup` [elitefts „punkty kluczowe (pins slightly above your touch point or just below your sticking point)”; inspireusa krok 1; steel krok 1]; `pin.move` [elitefts „true Pin Press (dead stop, explode off the pins)”; inspireusa kroki 3–4; steel kroki 4–5]; `pin.mis.bounce` [inspireusa „Common Pin Press Mistakes: Not fully stopping the bar”; steel krok 5 — pośrednio; elitefts błędu nie opisuje]. |
| Reverse Band Bench Press — całe ćwiczenie | Korekta szczebli 02.11.2026: rusin-reverse-band = 5, zostaje 1 źródło szczebla 4 (westside-chains-bands). Kandydaci: `rband.setup` [westside „Band Setup: bands from the top”; rusin „Band Setup”]; `rband.move` [westside „Technique Cues: Speed”; rusin „Technique”]; `rband.mis.slow` [westside „Technique Cues: Speed; Bands”; rusin „pressing without intent”]. |
| Band Bench Press | Katalog: guma + ławka, bez sztangi — nie wiadomo, czy to wyciskanie z samą gumą, czy sztanga z gumami; od tego zależą wskazówki. Do ustalenia z figurą/opisem ćwiczenia; potem research. |
| Chain Press | Jw.: katalog: łańcuchy + ławka, bez sztangi. Jeśli to wyciskanie sztangi z łańcuchami — może dostać blok „Bench Press with Chains”. |
| Floor Press with Chains | Przeczytane opisy wyciskania z podłogi (Barbell Logic „Gym Shorts: The Floor Press” — szczebel 5 po uzupełnieniu 3, RNT Fitness) są bez łańcuchów; Westside wspomina tylko przewieszenie łańcucha na gryfie. Kandydaci: `flp.setup` „Połóż się na podłodze pod sztangą, nogi wyprostowane, pięty wbite w podłogę.”, `flp.move` „Opuść sztangę kontrolowanie, aż ramiona dotkną podłogi, i wypchnij ją do wyprostu rąk.” — analogia do wariantu bez łańcuchów; błąd „odbijanie łokci od podłogi” tylko 1 źródło (RNT). Obecny `bp.blades` potwierdza tylko RNT. |
| Barbell Guillotine Bench Press | Źródła się różnią: BarBend (Step 1–3) — chwyt szerszy niż zwykle, łokcie szeroko na boki, sztanga do obojczyków; Coach (Coach Staff) — chwyt nieco szerszy niż barki, ręce „do środka”, sztanga w stronę szyi. Część wspólna: sztanga schodzi wyżej niż do środka klatki, powoli. Oba źródła ostrzegają przed ciężarem i bliskością szyi — twierdzeń zdrowotnych nie formułuję; decyzja, czy pokazywać to ćwiczenie z kartą, do właściciela/koordynatora. |
| Decline Close-Grip Bench To Skull Crusher | Jedyny opis tego połączenia to płatny serwis i strony aplikacji. Obecne `dcgsk.elbows` — źródła nie znalezione. |
| `bp.control` (Bench Press with Chains, Reverse Band) | Sprzeczne: Westside (Technique Cues) każe opuszczać szybko i od razu odwracać ruch („Never pause”); NASM i Rusin — opuszczanie kontrolowane. Wspólne: bez rzucania i odbijania? — nie potwierdzone wprost; zdanie pominięte. |
| `bp.mis.arch` (Board Press, Pin Press) | Inspire (Board: „Reduced Arch Usage” jako błąd; Pin: krok 2 „lower back arched”) zaleca wygięcie — przeczy brzmieniu „nadmierne wyginanie lędźwi” jako błędu; nie dodawać (Inspire ma szczebel 5, ale nadal jest przeczytanym źródłem sprzecznym). |
| `bp.contact`, `bp.blades`, `bp.elbowsMid` (warianty) | Dla JM, Board, Pin, łańcuchów, gum, hantli — co najwyżej 1 przeczytane źródło na wariant (np. NASM chains Step 2; Inspire Pin krok 2; Mikolo krok 3). Pominięte. |
| JM Press — nadgarstki | elitefts („Rock the Wrists Back”) i Catalyst („curl the wrists”) vs Onnit (5; nadgarstki nie mają uciekać w wyprost) — różne sformułowania, nie rozstrzygam. |
| Reverse Band — pauza | Rusin: krótka pauza na dole; Westside: bez pauzy — pominięte. |
| Close-Grip Dumbbell — wyprost łokci | Fitness Volt: bez blokowania łokci; Mikolo: do pełnego wyprostu — pominięte. |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria a–c). Autor/data/charakter każdej strony sprawdzone ponownie WebFetch 02.11.2026.

Źródła:
- fitnessvolt-cg-db-press: 4 → 5 (serwis treści bez recenzji eksperckiej — kryterium a niespełnione). (Zmienione w uzupełnieniu 3 — niżej.)
- mikolo-db-squeeze-press: 4 → 5 (producent maszyn Smitha i ławek; ćwiczenie z hantlami — nie własny rodzaj sprzętu; bez autora i daty).
- inspireusa-board-press, inspireusa-pin-press: 4 → 5 (serwis informacyjny dla początkujących; autorka bez kwalifikacji, recenzent z niewyjaśnionymi uprawnieniami — nie da się potwierdzić „recenzji eksperckiej” ani uznania serwisu; gdy koordynator uzna Inspire za 4, Board Press wraca do „gotowe”, a Pin Press do „częściowe” — bez błędu, bo `pin.mis.bounce` miałby wtedy tylko Inspire wprost).
- steel-pin-press: 4 → 5 (blog sprzedawcy suplementów).
- rusin-reverse-band: 4 → 5 (strona osobista bez daty artykułu; promocja własnych gum i programu w treści — kryteria b i c niespełnione).
- Bez zmiany (4, potwierdzone): elitefts-jm-press, elitefts-dynamic-pin-press (jedna organizacja), onnit-jm-press (autor, data, recenzja Advisory Board), catalyst-jm-press, barbell-logic-board-press (organizacja szkoląca trenerów), westside-chains-bands (autor, data, certyfikacja trenerów), nasm-bench-press-chains. (Onnit i Barbell Logic zmienione w uzupełnieniu 3 — niżej.)

Ćwiczenia (4 zmiany stanu):
- Close-Grip Dumbbell Press: gotowe → otwarte (0 źródeł szczebla 4).
- Board Press: gotowe → otwarte (1 źródło szczebla 4).
- Pin Press: gotowe → otwarte (1 źródło szczebla 4).
- Reverse Band Bench Press: gotowe → otwarte (1 źródło szczebla 4).
- Bez zmian: JM Press — gotowe; Bench Press with Chains — gotowe; pozostałe — otwarte.
- Blok JSON: usunięte bloki „Close-Grip Dumbbell Press”, „Board Press”, „Pin Press”, „Reverse Band Bench Press” (przeniesione do „Otwarte” jako kandydaci).

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (Onnit 5; Mikolo blog 5; Inspire US porady ogólne 5; Barbell Logic i Fitness Volt
warunkowo 4 per strona — autor z kwalifikacjami i data). Podpisy stron Barbell Logic i Fitness Volt sprawdzone WebFetch 02.11.2026.

Źródła:
- onnit-jm-press: 4 → 5; usunięte z bloku JSON.
- barbell-logic-board-press: 4 → 5 (brak autora i daty na stronie).
- fitnessvolt-cg-db-press: 5 → 4 warunkowo (P. Dale, PT, biogram z kwalifikacjami; data tylko w metadanych strony).
- mikolo-db-squeeze-press, inspireusa-board-press, inspireusa-pin-press: 5 → 5 (potwierdzone). Uwaga: inspireusafoundation.org to serwis informacyjny, nie producent maszyn — wyjątek „instrukcja własnej maszyny” go nie dotyczy.

Ćwiczenia:
- JM Press: gotowe → gotowe (każde zdanie nadal ma elitefts + Catalyst; Onnit usunięty). Do recenzji: fragment `jm.move` „aż przedramiona dotkną bicepsów” (uwaga pod blokiem JSON).
- Board Press: otwarte → otwarte (teraz 0 źródeł szczebla 4).
- Close-Grip Dumbbell Press: otwarte → otwarte (teraz 1 źródło szczebla 4 — Fitness Volt warunkowo).
- Pozostałe: bez zmian.
