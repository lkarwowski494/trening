# Badacz: Standing Gastrocnemius Calf Stretch i ugięcie kolan przy wiosłowaniu w opadzie (2026-10-28)

Uwaga o zakresie: agent nie miał powłoki (`git show` było niedostępne), więc pliki repo czytał z katalogu roboczego `/home/user/trening`
(catalog.json, L3.json, L3-zrodla.md, lib/catalog.generated.ts, docs/research/28-figury.md). Rysunku `mobility_stand` z gałęzi
origin/rodziny-mobilnosc nie oglądał; opis rysunku pochodzi ze zlecenia.

## Pytanie 1 — Standing Gastrocnemius Calf Stretch

### Co jest w repo
- `docs/research/equipment/catalog.json` (rid 507613d6): note „Heel on a step, knee straight, reach for the toes; any step or curb works.”,
  recommended `box`, muscleLoad calves 0,25 + hamstrings 0,25, confidence „jedno źródło” (L3-S17, L3-S1, L3-S3, L3-S9).
- L3-S1 (ACSM), L3-S3 (Page) i L3-S9 (kanał RSS ACE) potwierdzają ogólne zasady rozciągania i mięśnie, ale **nie opisują tego ustawienia**.
  Ustawienie „pięta na stopniu + przyciąganie palców” pochodzi wyłącznie z L3-S17.
- Do tego wpisu scalono „Standing Hamstring and Calf Stretch” (L3.json: „ta sama pozycja”).

### Przeczytane źródła
| # | Źródło (szczebel) | Miejsce | Cytat (≤ 2 zdania) | Wariant |
|---|---|---|---|---|
| G1 | free-exercise-db, `exercises/Standing_Gastrocnemius_Calf_Stretch.json` + `…/0.jpg` (4) https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Gastrocnemius_Calf_Stretch.json | pole instructions, krok 1 i 3; zdjęcie 0.jpg; `equipment: null` | „Set your right heel on a step with that knee straight… lean forward and grab your right toe” (parafraza narzędzia; sens: pięta na stopniu, kolano proste, chwyt palców, przyciąganie palców do kolana) | stopień (wysoka platforma do step aerobiku na zdjęciu), noga z przodu prosta, przyciąganie palców — w praktyce rozciąganie łydki **i** tylnej strony uda |
| G2 | ACE Exercise Library #152 „Standing Dorsi-Flexion (Calf Stretch)” (4) https://www.acefitness.org/resources/everyone/exercise-library/152/standing-dorsi-flexion-calf-stretch/ | krok 2 | „Increase the flexion (bend) in your LEFT (front) knee while keeping the opposite leg straightened.” | ściana, tylna noga prosta, pięta na ziemi; wariant „soleus” z ugiętym tylnym kolanem |
| G3 | ACE Exercise Library #211 „Step Stretch” (4), sprzęt „Raised Platform/Box”, mięsień „Gastrocnemius” (RSS) https://www.acefitness.org/resources/everyone/exercise-library/211/step-stretch/ | krok 2 | „Slowly lower the left (back) heel toward the ground while bending at the right knee.” | stopień: pięta tylnej nogi opuszczana poza krawędź (śródstopie na krawędzi) |
| G4 | Physitrack, „Gastrocnemius stretch on a step” (4) https://au.physitrack.com/home-exercise-video/gastrocnemius-stretch-on-step | instrukcje, kroki 2–3; sprzęt „Step” | „Place your affected heel off the edge of the step so that you just have the ball of your foot on the step.” „Push down into your heel, keeping your knee straight.” | stopień: opuszczenie pięty poza krawędź, kolano proste |
| G5 | Physitrack, „Gastrocnemius stretch in standing (holding on)… hands on wall” (4) https://us.physitrack.com/home-exercise-video/gastrocnemius-stretch-in-standing-%2528holding-on%2529 | instrukcje, krok 4 | „Make sure your heel does not come off the floor and your back knee does not bend.” | ściana |
| G6 | MSD Manual Professional, film „Standing Gastrocnemius Stretch” (dzięki uprzejmości Tomah Memorial Hospital, Dział Fizjoterapii) (4) https://www.msdmanuals.com/professional/multimedia/video/standing-gastrocnemius-stretch | opis filmu | „Stand facing or next to wall with hands on the wall for support.” „Keep rear leg straight with knees and toes pointing toward the wall.” | ściana — **ta sama nazwa** co w katalogu (bez „Calf”) |
| G7 | AAOS OrthoInfo, Foot and Ankle Conditioning Program, „Heel Cord Stretch” (4; = L3-S15) https://www.orthoinfo.org/en/recovery/foot-and-ankle-conditioning-program/ | Heel Cord Stretch | „Your affected leg is straight and behind you, with the heel flat and the toes pointed in slightly.” | ściana; mięśnie „Gastrocnemius-soleus complex” |
| G8 | NHS, Flexibility exercises, Calf stretch (4; = L3-S11) https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/flexibility-exercises/ | Calf stretch, B | „The left calf muscle is stretched by keeping the left leg as straight as possible and the left heel on the floor.” | ściana |
| G9 | free-exercise-db, `Calf_Stretch_Hands_Against_Wall.json` (4; to samo źródło co G1, więc nie jest niezależne od G1) | instructions | „Attempt to keep your heel on the ground.” | ściana (= Wall Calf Stretch w aplikacji) |

Wyszukiwanie wariantu „pięta na stopniu + przyciąganie palców” znalazło tylko serwis powielający free-exercise-db (repstack.pages.dev), czyli
nie jest to niezależne źródło. Strony Prehab Guys przekierowują do logowania (nieprzeczytane). ExRx zwraca 403.

### Wnioski
1. **Pod nazwą „(standing) gastrocnemius stretch” niezależne źródła opisują wariant przy ścianie**: tylna noga prosta, pięta na ziemi, przednie
   kolano ugięte (G2, G5, G6, G7, G8 — pięć niezależnych źródeł szczebla 4, w tym G6 z tą samą nazwą). Status: **ustalone** (wyjątek dla techniki: ≥ 2 zgodne źródła szczebla 4).
2. **Wariant na stopniu z opuszczeniem pięty** (śródstopie na krawędzi, pięta w dół, kolano proste) ma dwa niezależne źródła szczebla 4 (G3 ACE #211
   z mięśniem „Gastrocnemius”, G4 Physitrack z nazwą „Gastrocnemius stretch on a step”). Status: **ustalone** jako wariant rozciągania łydki (mięśnia brzuchatego) na stopniu.
3. **Opis katalogu („Heel on a step, knee straight, reach for the toes”) ma tylko jedno źródło (G1)**. Nie ma 2 niezależnych źródeł szczebla 4.
   To inne ćwiczenie niż oba warianty wyżej: pięta leży *na* stopniu, a rozciąganie powstaje przez skłon i przyciągnięcie palców, więc rozciąga
   też tylną stronę uda (stąd hamstrings 0,25 w katalogu). Status: **jedno źródło**. Dodatkowo: free-exercise-db nie podaje sprzętu (`equipment: null`),
   więc `recommended: box` to wniosek z tekstu „step”.
4. **Rysunek przy ścianie (z ACE #152) zgadza się ze źródłami pod tą nazwą, ale nie z opisem katalogu**, a przy tym dubluje Wall Calf Stretch (rid 93f182b0;
   ten sam wariant, siła dowodów „mocne”). Dwa ćwiczenia z identycznym rysunkiem i ruchem to w praktyce duplikat.

### Rekomendacja
**(d) inne: przedefiniować „Standing Gastrocnemius Calf Stretch” na wariant na stopniu z opuszczeniem pięty** (śródstopie na krawędzi stopnia,
pięta w dół poniżej krawędzi, kolano proste, ręka na ścianie lub poręczy dla równowagi) i narysować go na stopniu. Uzasadnienie:
- wariant ma 2 niezależne źródła szczebla 4 (G3, G4), więc przy zasadzie dla techniki spełnia próg „ustalone”, a nazwa „gastrocnemius” zgadza się z G4 („Gastrocnemius stretch on a step”) i z mięśniem w G3;
- zostaje `recommended: box` (G3: „Raised Platform/Box”, G4: „Step”), więc ćwiczenie nadal różni się od Wall Calf Stretch (ściana) — nie powstaje duplikat;
- ID, rid i historia użytkowników zostają bez zmian (nie ma scalania).
Konsekwencje do wykonania przez programistę lub analityka:
- note w catalog.json zmienić (np. „Balls of the foot on the edge of a step, heel lowered below it, knee straight; hold a wall or rail for balance.”), źródła: dodać G3, G4; confidence podnieść z „jedno źródło”;
- muscleLoad: G3 podaje tylko „Gastrocnemius”, a G4 tylko łydkę. **Hamstrings 0,25 nie ma podstawy w tym wariancie** → do usunięcia (tylko calves 0,25);
- rysunek: nowa poza na stopniu (śródstopie na krawędzi, pięta poniżej, kolano proste), nie ta sama co Wall Calf;
- scalenie „Standing Hamstring and Calf Stretch” → ten wpis opierało się na podobieństwie do wariantu z przyciąganiem palców (taśma, noga z przodu prosta, palce w górę). Po zmianie to podobieństwo znika — **[OTWARTE]** decyzja: scalenie przenieść (np. do rozciągania tylnej strony uda na stojąco) albo zostawić jako przybliżenie oznaczone „uproszczenie”;
- rejestr twierdzeń i BRD, jeśli wskazówki techniki tego ćwiczenia trafią do UI.

Odrzucone opcje:
- (a) opis katalogu zmienić na wariant przy ścianie — dobrze udokumentowany (5 źródeł), ale robi z wpisu duplikat Wall Calf Stretch (ten sam ruch, rysunek, sprzęt); wtedy należałoby uczciwie scalić oba wpisy, co zmienia historię (scalenie w danych). Dopuszczalne tylko jako (a′) „scalić z Wall Calf Stretch” — droższe i z migracją.
- (b) rysunek na stopniu w wariancie z G1 (pięta na stopniu, przyciąganie palców) — wariant ma jedno źródło; zostałby oznaczony „jedno źródło”. Gorsze od (d) przy tym samym nakładzie.
- (c) rozdzielić na dwa ćwiczenia — wariant przy ścianie już istnieje (Wall Calf Stretch), więc (c) sprowadza się do (d) albo dodaje trzecie ćwiczenie z jednym źródłem (G1). Dodanie nowego ćwiczenia jest też decyzją produktową właściciela.

Decyzja o zmianie definicji ćwiczenia (opis i rysunek) jest techniczna i merytoryczna (rozstrzyga ją hierarchia). Scalenie lub nowe ćwiczenie to sprawa produktowa dla właściciela.

## Pytanie 2 — „lekko ugięte kolana” przy wiosłowaniu w opadzie tułowia

### Przeczytane źródła
| # | Źródło (szczebel) | Miejsce | Cytat |
|---|---|---|---|
| R1 | ACE Exercise Library #12 „Bent-over Row” (4) https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/ | opis | „Lift the bar from the rack, bend forward at the hips, and keep the back straight with a slight bend in the knees.” |
| R2 | ExRx BBBentOverRow (4), już w repo: docs/research/27-wskazowki-zrodla.md:160 (`row.hinge`, Preparation); w tej sesji 403, nie przeczytane ponownie | — | (jakościowo „knees slightly bent”, według wpisu w repo) |
| R3 | MSD/Tomah, AAOS, NHS — nie dotyczą wiosłowania | — | — |

Szukano wartości liczbowych w organizacjach szkolących trenerów (NSCA, NASM, ACSM, ACE) i w badaniach biomechanicznych (Fenwick i in. 2009, JSCR — PDF
nieczytelny dla narzędzia; inne prace o kącie tułowia bez kąta kolana). **Nie znaleziono żadnego przeczytanego źródła, które podaje kąt zgięcia
kolan w wiosłowaniu w opadzie.** Wszystkie przeczytane źródła opisują kolano słownie: „slight bend” / „slightly bent”.

Nieprzeczytane, do sprawdzenia: NSCA Exercise Technique Manual / Essentials (za płatną ścianą). Fiszka użytkownika w serwisie Brainscape (bez źródła, nie liczy się) cytuje
„knees slightly to moderately flexed” — jeśli tak pisze NSCA, górna granica „lekkiego” ugięcia byłaby szersza niż „slight”. **[OTWARTE]**: potwierdzić
w podręczniku NSCA (strona, wydanie).

### Wnioski
1. **Jakościowo ustalone**: przy wiosłowaniu w opadzie kolana są lekko ugięte, a ugięcie pozostaje stałe przez cały ruch (R1, R2 — 2 zgodne źródła szczebla 4).
2. **Liczba (30° albo 40°) nie ma podstawy źródłowej** — każdy próg to **konwencja**. Wyjątek dla przedziałów kątów („2 zgodne źródła szczebla 4 i żadne nie przeczy”) nie ma zastosowania, bo żadne źródło nie podaje kąta.
3. Niespójność w repo: specyfikacja figur `docs/research/28-figury.md:348–387` dla `row.hinge` ma już zgięcie kolana 20° (±15°), czyli 5–35°.
   Reguła ≤ 40° jest więc luźniejsza niż specyfikacja, a 7 póz z 34,7–37,7° wychodzi poza 5–35° w 6 z 7 przypadków (34,7° mieści się na granicy).
   Mobilność przyjęła ≤ 30°. Te same słowa („lekko ugięte”) mają dziś trzy różne granice: 30, 35 i 40.

### Rekomendacja
- Zapisać „lekko ugięte kolano” jako **jedną konwencję w jednym miejscu** (zasada „liczby w jednym miejscu”) dla wszystkich rodzin, oznaczoną
  „konwencja” z odnośnikiem do R1/R2 (jakościowo) i adnotacją „brak źródła liczbowego”.
- Wartość: **≤ 30° albo ≤ 35°**, nie 40°. Przy ≤ 30° konwencja zgadza się z mobilnością i mieści się w specyfikacji 28-figury (5–35°), ale trzeba
  przestawić 7 póz wiosłowania (o ok. 5–8°). Przy ≤ 35° konwencja zgadza się z istniejącą specyfikacją figur, a pozy przestawia się o mniej niż 3°, ale mobilność trzeba podnieść do 35°.
  Rekomendacja: **≤ 30° wszędzie i przestawić pozy**, bo to najwęższa granica, z którą zgadzają się oba miejsca w repo. Wybór 30 czy 35 to konwencja, a nie
  rozstrzygnięcie merytoryczne. Podniesienie do 40° tylko po to, żeby pozy przeszły test, byłoby uzasadnieniem dopisanym po fakcie.
- [OTWARTE]: jeśli podręcznik NSCA potwierdzi „slightly to moderately flexed”, wrócić do górnej granicy dla wiosłowania (może być szersza niż w mobilności).

## Podsumowanie statusów
- Ustalone: wariant przy ścianie pod nazwą „standing gastrocnemius stretch” (5 źródeł szczebla 4); wariant na stopniu z opuszczeniem pięty (2 źródła szczebla 4); kolana lekko ugięte i stałe przy wiosłowaniu w opadzie (2 źródła szczebla 4, jakościowo).
- Jedno źródło: obecny opis katalogu „pięta na stopniu, przyciąganie palców” (tylko free-exercise-db).
- Konwencja: każdy próg liczbowy „lekko ugiętego” kolana (30/35/40°).
- Otwarte: scalenie „Standing Hamstring and Calf Stretch” po przedefiniowaniu; brzmienie NSCA („slightly to moderately flexed”?) dla wiosłowania.
