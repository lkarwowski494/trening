# Role mięśni — rodzina figur `rotator_cuff` (fala W1, 02.11.2026)

Badacz merytoryczny. Dane wejściowe: `data/zrodla/role-miesni.json` (meta, assembly, functions, rules, exceptions, withoutRole, sources, open, nameRules),
`lib/muscleRoles.ts` (`matchRole`), `lib/catalog.generated.ts` (MUSCLE_LOAD, pattern, CATALOG_UNMAPPED), `docs/research/25-biblioteka/L2-zrodla.md` (Q1).
Nic w kodzie ani w `data/zrodla/*.json` nie zostało zmienione — poniżej propozycja do wklejenia przez programistę.

## Co znaczy region `rear_delt` / `front_delt` w ćwiczeniach rotacji

- `rear_delt` to **tylny akton mięśnia naramiennego**, nie podgrzebieniowy ani obły mniejszy. Stożek rotatorów nie ma regionu na mapie:
  ćwiczenia rotacji mają `CATALOG_UNMAPPED = "rotator_cuff"` (`lib/catalog.generated.ts`, `UNMAPPED_MUSCLES`) i oznaczenie „stożek rotatorów”
  na ekranie ćwiczenia; udział `rear_delt 0,5` / `front_delt 0,5` to naramienny jako mięsień **pomocniczy** (L2 Q1, wariant A: „bez partii
  głównej, »barki« pomocnicze, delt 0,5” — `docs/research/25-biblioteka/L2-zrodla.md`, „Pytania otwarte”, Q1; `docs/research/equipment/catalog-notes.md`, pole `unmapped`).
- Wniosek: zdanie roli opisuje **naramienny** (tylny akton: pomaga w rotacji zewnętrznej; przedni: pomaga w rotacji wewnętrznej), a nie stożek
  rotatorów. Słowo „pomaga” (rola `aux`) jest zgodne z tym, że główną pracę wykonuje stożek rotatorów (oznaczony osobno).
- Istniejąca funkcja `rear_delt.shoulder_ext` ma w polu `ruch` „wyprost (także poziomy) i rotacja zewnętrzna”, ale jej tekst („Odciąga ramię
  do tyłu”) nie opisuje rotacji — dlatego nowa funkcja, a nie ponowne użycie.

## Tabela ćwiczeń

| Ćwiczenie | Mięsień (udział) | Propozycja | Funkcja | Stan |
|---|---|---|---|---|
| External Rotation (linki) | rear_delt (0,5 → aux) | nameRule | `rear_delt.shoulder_er` (nowa) | gotowe |
| External Rotation (hantel) | rear_delt (0,5 → aux) | nameRule | `rear_delt.shoulder_er` (nowa) | gotowe |
| External Rotation with Band | rear_delt (0,5 → aux) | nameRule | `rear_delt.shoulder_er` (nowa) | gotowe |
| Internal Rotation with Band | front_delt (0,5 → aux) | nameRule | `front_delt.shoulder_ir` (nowa) | gotowe |
| Cable Internal Rotation | front_delt (0,5 → aux) | nameRule | `front_delt.shoulder_ir` (nowa) | gotowe |
| Band Pull Apart | upper_back (0,5 → aux) | nameRule | `upper_back.scap_retract` (istnieje; +źródła) | gotowe |
| Reverse Flyes With External Rotation | upper_back (0,5 → aux) | nameRule | `upper_back.scap_retract` (istnieje; +źródła) | gotowe |
| Cuban Press | side_delt (0,5 → aux) | nameRule | `side_delt.shoulder_abd` (istnieje) | gotowe |
| Cuban Press | front_delt (0,5 → aux) | brak (bez opisu) | — | [OTWARTE] |
| Cuban Press | upper_back (0,5 → aux) | brak (bez opisu) | — | [OTWARTE] |

Razem: 8 par (ćwiczenie, mięsień) gotowych, 2 otwarte. `rear_delt` główny w Band Pull Apart, Cuban Press i Reverse Flyes With External Rotation
ma już rolę (`isolation` + `rear_delt` + main) — bez zmian. Pary z udziałem 0,25 (np. `upper_back` w rotacjach zewnętrznych, `chest` w rotacjach
wewnętrznych) nie są podświetlane — ról nie dotyczy.

## Dlaczego nameRules, a nie reguły po `pattern`

Reguła w `rules` działa na każde ćwiczenie `isolation` z tym regionem i rolą. Sprawdzone grepem `MUSCLE_LOAD` (udział 0,5) i `pattern`
w `lib/catalog.generated.ts` (02.11.2026):

- **`isolation` + `rear_delt` + aux** objęłaby dodatkowo: **Y Raise (hantle), Cable Y Raise** (oba `isolation`) — to unoszenie ramienia, nie rotacja
  → zdanie byłoby błędne. Pozostałe ćwiczenia z `rear_delt 0,5` to wiosłowania i ściągania (`h_pull`, `v_pull`) — nie dotyczy.
- **`isolation` + `front_delt` + aux** objęłaby dodatkowo m.in. (sprawdzone `isolation`): Chest Fly (hantle), Band Chest Fly, Pec Deck, Svend Press,
  Around The Worlds, Front Raise And Pullover, Upright Row (hantle, linki, sztanga), Smith Machine Upright Row, Band Upright Row, Dumbbell One-Arm
  Upright Row, Smith Machine One-Arm Upright Row, Crucifix, Cuban Press; prawdopodobnie też pozostałe muchy (Cable Fly i warianty, Incline Chest Fly,
  Incline Cable Fly, Flat Bench Cable Fly — `pattern` niesprawdzony pojedynczo). Zdanie o rotacji wewnętrznej byłoby błędne → reguła po wzorcu odrzucona;
  zgadza się z `withoutRole.kombinacje` („triceps, front_delt, side_delt, chest jako pomocnicze w isolation”).
- **`isolation` + `upper_back` + aux** objęłaby 21 ćwiczeń: grupa „odwodzenie poziome” (8) — Reverse Fly (hantle), Reverse Pec Deck, Cable Reverse Fly,
  Band Pull Apart, Dumbbell Lying One-Arm Rear Lateral Raise, One-Arm Cable Rear Lateral Raise, Reverse Flyes With External Rotation, Sled Reverse Flye;
  oraz 13, w których łopatka się **unosi i obraca w górę**, a nie ściąga: Upright Row (hantle, linki, sztanga), Smith Machine Upright Row,
  Band Upright Row, Dumbbell One-Arm Upright Row, Smith Machine One-Arm Upright Row, Y Raise (hantle), Cable Y Raise, Dumbbell Scaption,
  Straight Raises on Incline Bench, Crucifix, Cuban Press. Reguła po wzorcu **nieuzasadniona** — zgodne z `withoutRole.kombinacje`
  („upper_back w isolation — unoszenie barków (szrugsy) vs ściąganie łopatek”). Face Pull, Cable Rope Rear-Delt Rows, Barbell Rear Delt Row mają
  `pattern` `h_pull` — nie dotyczy.
- To samo rozstrzygnięcie co dotąd dla szrugsów i nadgarstka: jawna lista `nameRules` (decyzja właściciela 26.10.2026 w `meta.decyzjaWlasciciela`).

**Kandydaci poza tym zleceniem (do sprawdzenia przez agenta właściwej rodziny figur, nie wklejać bez tego):** Reverse Fly (hantle), Reverse Pec Deck,
Cable Reverse Fly, Dumbbell Lying One-Arm Rear Lateral Raise, One-Arm Cable Rear Lateral Raise — ten sam ruch (odwodzenie poziome prostego ramienia)
co Band Pull Apart i Reverse Flyes With External Rotation; S30 (dodatek A) i S31 opisują ten ruch. Sled Reverse Flye — inny sprzęt (sanie),
wymaga osobnego sprawdzenia.

## Uzasadnienie (źródła przeczytane)

- **`rear_delt.shoulder_er`** — tylny akton naramiennego pomaga w rotacji zewnętrznej: S1 (OpenStax, szczebel 3: deltoid „facilitates … extension
  and lateral rotation”), S6 (TeachMeAnatomy, szczebel 4: posterior fibres „extension and lateral rotation”), S29 (Kenhub, szczebel 4: posterior part
  „assist in external (or lateral) rotation”); w samym ćwiczeniu: S30 (szczebel 3) podaje aktywność tylnego aktonu w rotacji zewnętrznej w leżeniu
  bokiem (~52% MVC). Trzy niezależne źródła anatomiczne + jedno o ćwiczeniu → **ustalone**.
- **`front_delt.shoulder_ir`** — przedni akton pomaga w rotacji wewnętrznej: S1 (deltoid „facilitates flexing and medial rotation”), S6 (anterior fibres
  „flexion and medial rotation”), S29 (anterior part „active during internal (medial) rotation”). Trzy niezależne → **ustalone**. Źródło o samym
  ćwiczeniu wskazuje podłopatkowy jako główny (S30 „chosen for activation of the subscapularis”) — zgodne z rolą „pomocniczy”; brak przeczytanego
  pomiaru przedniego aktonu w tym ćwiczeniu (patrz Otwarte).
- **`upper_back.scap_retract` w Band Pull Apart** — S32 (Catalyst Athletics, szczebel 4: „Squeezing the shoulder blades back together”), S30 dodatek A
  (szczebel 3, odwodzenie poziome z gumą stojąc — to jest Band Pull Apart: „move your arms out to pull the band apart while moving your shoulder blades back”);
  funkcja mięśni: S1, S5 (już w danych). Dwa niezależne o ćwiczeniu → **dwa_zrodla** (jak funkcja).
- **`upper_back.scap_retract` w Reverse Flyes With External Rotation** (ławka skośna, hantle — `requires bench.incline`) — S31 (ACE, szczebel 4,
  Incline Reverse Fly: „Squeeze your scapulae (shoulder blades) together as you reach the end position.”), S33 (Ekstrom 2003, szczebel 3: największa
  aktywność czworobocznego części środkowej m.in. w wyproście poziomym z rotacją zewnętrzną), S30 dodatek A (ogólnie odwodzenie poziome) → **dwa_zrodla**.
- **`side_delt.shoulder_abd` w Cuban Press** — pierwsza faza to uniesienie łokci w bok do 90°: S34 (BarBend, szczebel 4: „Bring your elbows up to a 90-degree
  angle, ensuring they are parallel to the floor.”), S35 (Coach, szczebel 4/5: „Lift your arms out to the sides until your elbows are bent at 90°”);
  że akton boczny odwodzi ramię — S1, S6, S23 (funkcja już **ustalone**). Faza wyciskania nad głowę też jest odwodzeniem (S34 „Press your arms overhead”).

## Blok JSON do wklejenia

`functions` (nowe):

```json
{
"rear_delt.shoulder_er": {
  "region": "rear_delt",
  "staw": "ramienny",
  "ruch": "rotacja zewnętrzna (tylny akton naramiennego jako mięsień pomocniczy stożka rotatorów)",
  "pl": { "main": "Obraca ramię na zewnątrz", "aux": "Pomaga obracać ramię na zewnątrz" },
  "en": { "main": "Rotates your upper arm outward", "aux": "Helps rotate your upper arm outward" },
  "pewnosc": "ustalone (3 niezależne anatomiczne + S30 o ćwiczeniu)",
  "zrodla": ["S1", "S6", "S29", "S30"],
  "status": "ustalone",
  "uwaga": "Tylko ćwiczenia z jawnej listy nameRules (rotacja zewnętrzna). Region rear_delt = naramienny, nie podgrzebieniowy (stożek rotatorów: CATALOG_UNMAPPED, L2 Q1)."
},
"front_delt.shoulder_ir": {
  "region": "front_delt",
  "staw": "ramienny",
  "ruch": "rotacja wewnętrzna (przedni akton naramiennego jako mięsień pomocniczy)",
  "pl": { "main": "Obraca ramię do środka", "aux": "Pomaga obracać ramię do środka" },
  "en": { "main": "Rotates your upper arm inward", "aux": "Helps rotate your upper arm inward" },
  "pewnosc": "ustalone (3 niezależne anatomiczne)",
  "zrodla": ["S1", "S6", "S29"],
  "status": "ustalone",
  "uwaga": "Tylko ćwiczenia z jawnej listy nameRules (rotacja wewnętrzna). Główny: podłopatkowy (S30) — poza mapą regionów."
}
}
```

`functions` (zmiana istniejącej — tylko źródła): `upper_back.scap_retract.zrodla` → `["S1", "S5", "S24", "S30", "S31", "S32", "S33"]`,
`pewnosc` → „dwa źródła (+ S24 wiosłowania; S30–S33 odwodzenie poziome)”.

`nameRules.reguly` (dopisać):

```json
[
{
  "muscle": "rear_delt", "roles": ["aux"], "function": "rear_delt.shoulder_er",
  "exercises": ["External Rotation (linki)", "External Rotation (hantel)", "External Rotation with Band"]
},
{
  "muscle": "front_delt", "roles": ["aux"], "function": "front_delt.shoulder_ir",
  "exercises": ["Internal Rotation with Band", "Cable Internal Rotation"]
},
{
  "muscle": "upper_back", "roles": ["aux"], "function": "upper_back.scap_retract",
  "exercises": ["Band Pull Apart", "Reverse Flyes With External Rotation"],
  "pominiete": {
    "Cuban Press": "łopatka unosi się i obraca w górę (wiosłowanie pionowe, wyciskanie), nie ściąga — bez opisu"
  }
},
{
  "muscle": "side_delt", "roles": ["aux"], "function": "side_delt.shoulder_abd",
  "exercises": ["Cuban Press"]
}
]
```

Uwaga do formatu: w runtime (`lib/muscleRoles.ts`) nameRule ma pola `m`, `o`, `x`, `f`, `s` — generuje je `scripts/zrodla-runtime.mjs` z powyższego.
Teksty PL/EN nowych funkcji przed wdrożeniem: przegląd `recenzent-lokalizacji` i wpis w rejestrze twierdzeń (`node scripts/claims.mjs --stub`).

## Nowe źródła (`sources`)

ID S29–S35 to kolejne wolne na 02.11.2026 (ostatnie w danych: S28). Inni agenci fali W1 mogą nadać te same numery — koordynator przenumeruje przy scalaniu.

```json
[
{
  "id": "S29", "tier": 4,
  "cite": "Pirie E. Deltoid muscle. Kenhub (rec. 30.10.2023)",
  "url": "https://www.kenhub.com/en/library/anatomy/the-deltoid-muscle",
  "miejsce": "Function",
  "cytaty": [
    "anterior (clavicular) part: „These fibers are also active during internal (medial) rotation of the humerus.”",
    "posterior (spinal) part: „In addition, these fibers will assist in external (or lateral) rotation of the humerus.”"
  ]
},
{
  "id": "S30", "tier": 3,
  "cite": "Mullaney M, Nicholas S, Tyler T, Fukunaga T, McHugh M. Evidence Based Arm Care: The Throwers 10 Revisited. Int J Sports Phys Ther 2021;16(6):1379–1386",
  "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8637269/",
  "miejsce": "Side Plank with External Rotation; Shoulder Internal Rotation at 90/90 Position; Appendix A (horizontal abduction, standing)",
  "cytaty": [
    "rotacja zewnętrzna w leżeniu bokiem: „… and posterior deltoid 52% MVC.”",
    "„This exercise was chosen for activation of the subscapularis.”",
    "dodatek A: „Keeping your elbows straight, move your arms out to pull the band apart while moving your shoulder blades back”"
  ],
  "uwaga": "Komentarz kliniczny (program ćwiczeń dla rzucających) z przeglądem badań EMG — szczebel 3."
},
{
  "id": "S31", "tier": 4,
  "cite": "American Council on Exercise. Incline Reverse Fly. ACE Exercise Library",
  "url": "https://www.acefitness.org/exercise-library-details/3/34/",
  "miejsce": "Steps, krok 2",
  "cytaty": [
    "„Squeeze your scapulae (shoulder blades) together as you reach the end position.”"
  ]
},
{
  "id": "S32", "tier": 4,
  "cite": "Catalyst Athletics. Band Pull Apart. Exercise Library",
  "url": "https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/",
  "miejsce": "opis ćwiczenia (początek strony); Purpose",
  "cytaty": [
    "„Squeezing the shoulder blades back together and keeping them down”",
    "„The band pull apart is a simple shoulder prep exercise to improve scapular control and stability.”"
  ]
},
{
  "id": "S33", "tier": 3,
  "cite": "Ekstrom RA i in. Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles. J Orthop Sports Phys Ther 2003 (PMID 12774999)",
  "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12774999%20AND%20SRC:MED&resultType=core&format=json",
  "miejsce": "streszczenie (Results)",
  "cytaty": [
    "„For the middle trapezius, the greatest EMG amplitudes were generated with 2 exercises” — w tym „shoulder horizontal extension with external rotation”"
  ],
  "uwaga": "Przeczytane tylko streszczenie (Europe PMC); pełny tekst płatny. Tom i strony uzupełnić z rekordu przy wklejaniu."
},
{
  "id": "S34", "tier": 4,
  "cite": "Lubinsky C. Cuban Press. BarBend (akt. 17.06.2024)",
  "url": "https://barbend.com/cuban-press/",
  "miejsce": "How to Do the Cuban Press, kroki 1 i 3",
  "cytaty": [
    "„Bring your elbows up to a 90-degree angle, ensuring they are parallel to the floor.”",
    "„Press your arms overhead, ensuring your body stays straight.”"
  ]
},
{
  "id": "S35", "tier": 4,
  "cite": "Hutchings N. Cuban press. Coach (coachweb.com, 03.09.2009)",
  "url": "https://coachweb.com/exercises/shoulder-exercises/208/cuban-press",
  "miejsce": "opis wersji stojącej, pierwszy krok",
  "cytaty": [
    "„Lift your arms out to the sides until your elbows are bent at 90° and the weights are hanging straight down.”"
  ],
  "uwaga": "Magazyn ogólny o treningu — słabsze z dwóch źródeł opisu ruchu (bliżej szczebla 5); opis ruchu zgodny z S34."
}
]
```

Uzupełnienie istniejącego S1 (cytat sprawdzony 02.11.2026 w tym samym podrozdziale): pełne zdanie o naramiennym — „it also facilitates flexing and
medial rotation, as well as extension and lateral rotation” (Muscles That Move the Humerus, tekst główny). Obecny cytat w danych urywa je po „medial rotation”.

## Otwarte

- [OTWARTE] **Cuban Press — front_delt (aux):** w fazie wyciskania z ramion odwiedzionych i obróconych na zewnątrz ramię nie idzie „do przodu”;
  `front_delt.shoulder_flex` („Pomaga unosić ramię do przodu”) nie opisuje ruchu. Żadne przeczytane źródło nie przypisuje przedniemu aktonowi konkretnej
  pracy w tym ćwiczeniu (S34: „the three heads of the delt are used” — bez fazy). Bez opisu.
- [OTWARTE] **Cuban Press — upper_back (aux):** łopatka unosi się i obraca w górę (wiosłowanie pionowe, wyciskanie) — w danych nie ma funkcji „obrót
  łopatki w górę”, a `upper_back.scap_retract` opisywałby inny ruch. S34 mówi tylko, że czworoboczny „work in tandem with the scapula”. Bez opisu.
- [OTWARTE] **Rotacja wewnętrzna — pomiar przedniego aktonu w samym ćwiczeniu:** funkcja ustalona z anatomii (3 źródła), ale nie znalazłem przeczytanego
  źródła z EMG przedniego aktonu w rotacji wewnętrznej z gumą/linką (ExRx — 403, archiwum zablokowane). Nie blokuje — rola „pomocniczy” zgodna z S30.
- [OTWARTE] **Reinold 2004 (L2-S24):** streszczenie (Europe PMC) nie podaje aktywności tylnego aktonu w rotacji zewnętrznej w leżeniu bokiem ani stojąc —
  tylko maksimum w odwodzeniu poziomym w leżeniu przodem; nie użyte jako źródło roli.
- Naturalność tekstów EN/PL nowych funkcji („Rotates your upper arm outward”, „Obraca ramię na zewnątrz”) — przegląd `recenzent-lokalizacji`.

## Stan

- **Zrobione (02.11.2026):** 8 ćwiczeń rodziny `rotator_cuff` przeanalizowane: 8 par gotowych (3× ER, 2× IR, 2× upper_back, 1× side_delt w Cuban Press),
  2 pary otwarte (Cuban Press: front_delt, upper_back). Nowe funkcje: `rear_delt.shoulder_er`, `front_delt.shoulder_ir`. Nowe źródła S29–S35.
  Sprawdzony wpływ reguł po wzorcu (wszystkie trzy odrzucone na rzecz nameRules).
- **Zostało:** wklejenie przez programistę (functions, nameRules, sources, zmiana źródeł `upper_back.scap_retract`, uzupełnienie cytatu S1), wpisy w rejestrze
  twierdzeń, przegląd tekstów; decyzja agenta rodziny „odwodzenie poziome” co do kandydatów (Reverse Fly i in.).
- **Następny krok:** programista — wklejenie + `node scripts/zrodla-runtime.mjs` + test `tests/muscle-roles.test.ts` (liczby w `data/zrodla/role-miesni-liczby.json`).
- **Pułapki:** (1) numery S29–S35 mogą kolidować z innymi agentami fali; (2) nie dodawać reguł po `pattern` `isolation` dla rear_delt/front_delt/upper_back aux
  (łapią Y Raise, muchy, wiosłowania pionowe); (3) `rear_delt` ≠ stożek rotatorów — tekst mówi „pomaga”, nie „obraca” jako główny; (4) S33 przeczytane tylko
  w streszczeniu.
