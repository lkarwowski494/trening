# Wskazówki techniki — fala W2, rodzina „lunge” (wykroki, przysiad bułgarski, wejścia na podwyższenie)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Podstawa: stan W1 (`wskazowki-fala-w1/lunge.md` i `lunge-2.md`, sekcje „Korekta szczebli — przeliczenie koordynatora 02.11.2026”).
Zdania „zostaje” z W1 nie były badane ponownie. Szczeble wg `szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 2–3).

## Metoda

- Kolejność: (1) 3 karty „własne bez błędów” z W1 + karty częściowe (`partial`) z `cues.json` — tylko błędy; (2) otwarte z flagą POZA i popularne — drugie źródło; (3) reszta.
- Błędy: (a) ze źródeł — źródło nazywające błąd + drugie, niezależne źródło podające standard dokładnie w tym samym kryterium (ta sama część ciała); (b) wniosek — zaprzeczenie potwierdzonego zdania karty, `["wniosek", "<id>"]`. Wniosek dopisany tylko tam, gdzie zaprzecza zdaniu wprost.
- Nie wnioskowałem „zaokrąglonych pleców” z `lunge.torso` („Plecy proste przez cały ruch”) — byłby to błąd ogólny, nie specyficzny dla wykroku. Błąd „tułów pochyla się w przód” NIE jest zaprzeczeniem zdania „plecy proste” (można się pochylić z prostymi plecami), więc ma podstawę wyłącznie ze źródeł (a), nie z wniosku.
- „Za płytko” jako błąd tylko w przysiadzie bułgarskim: w wykroku NSCA PTQ (Table 2 „Reduce ROM”) podaje skrócony zakres jako łatwiejszą wersję — w wykrokach go nie wpisuję.
- Dostęp 02.11.2026: ExRx — 403 (wpisy ExRx z `cues.json` nie liczą się do nowych zdań), Mayo Clinic — 403, biogram autorki w University of Calgary — 403.
- Strony innych aplikacji, platforma Eleiko inspire360, PhysioRehab, RitFit, Dynamo — nieużyte (szczebel 5). The Prehab Guys (strona „Lateral Lunge”, bez autora) — 5.

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W2 | Zdania / powód |
|---|---|---|
| Lunges (sztanga) | **własna z błędami** | z W1: `lunge.bbSetup`, `lunge.fwd`, `lunge.torso`; nowy błąd `lunge2.mis.lean` (NSCA PTQ + Catalyst #354, ACE #8) |
| Barbell Walking Lunge | **własna z błędami** | z W1: `lunge.bbSetup` (wariant), `lunge.walk`, `lunge.torso`; nowy błąd `lunge2.mis.lean` (NSCA PTQ Table 1 + Table 3 „walking lunges” + Catalyst #600) |
| Barbell Step Up | **własna z błędami** | z W1: `lunge.bbSetup`, `stepup.move`, `lunge.torso`; nowe błędy `stepup.mis.push`, `stepup.mis.drop` (Catalyst #560 + Landow i Jarmon + wniosek z `stepup.move`) |
| Split Squat | **własna z błędami** (nowa) | `split.setup` (skrócone, z W1), `bss.move` (Catalyst #174 + NSCA PTQ — drugie źródło ruchu dopięte w W2), `lunge.torso`, błąd `lunge2.mis.lean` |
| Bulgarian Split Squat (sztanga) | **własna z błędami** (nowa) — uproszczenie: wariant sprzętu (hantle) | `bss.setup`, `bss.move`, `lunge.torso` (ACE #366 + NASM BSS — W1 nie uwzględnił NASM z karty hantlowej), błąd `lunge2.mis.shallow` (NASM + ACE #366 + wniosek z `bss.move`) |
| Smith Machine Bulgarian Split Squat | **własna z błędami** (nowa) — uproszczenie: wariant sprzętu (hantle) | jak wyżej; ustawienie ławki względem prowadnic — dalej otwarte (O-3 z W1) |
| Lunges (hantle) — `partial` | **+ błąd** | `lunge2.mis.lean` (NSCA PTQ, Table 3 hantle + Catalyst #354 — wariant sprzętu: sztanga) |
| Walking Lunges — `partial` | **+ błąd** | `lunge2.mis.lean` (NSCA PTQ Table 1 + Table 3 + ACE #139) |
| Reverse Lunge — `partial` | **+ błąd** (uproszczenie: analogia) | `lunge2.mis.lean` (NSCA PTQ — opis dla wykroku w przód; ACE #319 „chest raised”) |
| Curtsy Lunge | **własna bez błędów, warunkowo** (szczebel AMA do potwierdzenia) | `lunge.stand`, nowe `curtsy.move`, `lunge.torso` (AMA + canfitpro); `lunge.knee` i `lunge.mis.kneeIn` — tylko AMA → nie wpisane |
| Lateral Lunge | otwarte | ustawienie sprzeczne (O-4 z W1); ruch: ACE #50 + University of Calgary (szczebel [OTWARTE] — autorka bez kwalifikacji na stronie, biogram 403) |
| Crossover Reverse Lunge | otwarte | to, że to ten sam ruch co Curtsy Lunge, wynika tylko z opisu klucza w free-exercise-db (szczebel 5); canfitpro „Crossover Lunge” to krok skrzyżny w przód — inny ruch; O-8 z W1 |
| Cossack Squat, Barbell Side Split Squat | otwarte | dalej tylko Catalyst; wyszukiwanie zwróciło tylko serwisy bez rozstrzygniętego szczebla albo 5 |
| Elevated Back Lunge, Split Squat (linki), Suspended Split Squat, Slider Reverse Lunge, Lunge Pass Through, Single Leg Press, Single-Leg High Box Squat, Smith Machine Pistol Squat | otwarte | bez zmian z W1 (nie szukano w W2 — kontekst); Smith Machine Pistol Squat: `pistol.setup` („ręce przed sobą”) nie pasuje do sztangi na plecach — wariant sprzętu nie wystarcza |

Poza zleceniem (KARTA, nie partial): **Step Up** (hantle) ma `mistakes: []` — `stepup.mis.push` i `stepup.mis.drop` pasują wprost (wariant sprzętu: sztanga; Catalyst #560 jest wariantem bez określonego ciężaru, ACE #28 — standard). Do decyzji koordynatora, nie w bloku.

### Blok do wdrożenia

Zależność: blok W1 (`lunge.md`, „Blok do wdrożenia (po przeliczeniu)”) wdrożony wcześniej — dla trzech kart z W1 poniżej tylko `mistakes` do dopisania; źródła `ace-8`, `catalyst-354`, `catalyst-560`, `catalyst-600`, `hk-landow-stepup` i org „Catalyst Athletics”, „Landow, Jarmon (Human Kinetics)” — z bloku W1.

```json
{
  "exercises": {
    "Lunges (sztanga)": {
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean (Error/Solution); Table 3, Add Resistance (barbell)"], ["catalyst-354", "opis (maintain an upright trunk) — standard"], ["ace-8", "Step 2 (lift the chest) — standard"]]}
      ]
    },
    "Barbell Walking Lunge": {
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean; Table 3, Make it Mobile (walking lunges)"], ["catalyst-600", "opis (upright posture) — standard"]], "uproszczenie": "wariant sprzętu: sztanga (NSCA — bez określonego ciężaru, Catalyst #600 — ciężar nad głową)"}
      ]
    },
    "Barbell Step Up": {
      "mistakes": [
        {"c": "stepup.mis.push", "s": [["catalyst-560", "opis (using the raised leg with minimal assistance from the other foot)"], ["hk-landow-stepup", "Bottom-Up Step-Up (drive the foot into the box) — standard"], ["wniosek", "stepup.move"]]},
        {"c": "stepup.mis.drop", "s": [["catalyst-560", "opis (control the motion back down … instead of just dropping)"], ["hk-landow-stepup", "Bottom-Up Step-Up (controls his descent) — standard"], ["wniosek", "stepup.move"]]}
      ]
    },
    "Split Squat": {
      "setup": [
        {"c": "split.setup", "s": [["nsca-ptq-lunge", "s. 44, Starting Position (one foot in front and one behind the torso, similar to a split stance); Table 2, Completely Stationary"], ["catalyst-174", "opis (split stance)"]]}
      ],
      "move": [
        {"c": "bss.move", "s": [["catalyst-174", "opis (bend both knees until the back knee lightly touches the floor; reverse)"], ["nsca-ptq-lunge", "s. 45, Lowering Phase (lower the hips until both knees are bent at about 90°); Upward Phase (push through the front heel); Table 2, Completely Stationary"]]}
      ],
      "tips": [
        {"c": "lunge.torso", "s": [["catalyst-174", "opis (trunk upright)"], ["nsca-ptq-lunge", "s. 45, Starting Position (torso should be straight)"]]}
      ],
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean; Table 2, Completely Stationary"], ["catalyst-174", "opis (trunk upright) — standard"]]}
      ]
    },
    "Bulgarian Split Squat (sztanga)": {
      "setup": [
        {"c": "bss.setup", "s": [["ace-366", "opis (rear foot on a bench or box about knee height)"], ["nasm-bulgarian-split-squat", "Step 1"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "move": [
        {"c": "bss.move", "s": [["ace-366", "opis"], ["nasm-bulgarian-split-squat", "Step 3; Step 4"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "tips": [
        {"c": "lunge.torso", "s": [["ace-366", "opis (keep the back straight)"], ["nasm-bulgarian-split-squat", "Step 2 (upright posture)"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "mistakes": [
        {"c": "lunge2.mis.shallow", "s": [["nasm-bulgarian-split-squat", "Common Mistakes (not descending far enough)"], ["ace-366", "opis (before the knee hits the floor, press the front foot) — standard"], ["wniosek", "bss.move"]], "uproszczenie": "wariant sprzętu: hantle"}
      ]
    },
    "Smith Machine Bulgarian Split Squat": {
      "setup": [
        {"c": "bss.setup", "s": [["ace-366", "opis"], ["nasm-bulgarian-split-squat", "Step 1"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "move": [
        {"c": "bss.move", "s": [["ace-366", "opis"], ["nasm-bulgarian-split-squat", "Step 3; Step 4"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "tips": [
        {"c": "lunge.torso", "s": [["ace-366", "opis (keep the back straight)"], ["nasm-bulgarian-split-squat", "Step 2 (upright posture)"]], "uproszczenie": "wariant sprzętu: hantle"}
      ],
      "mistakes": [
        {"c": "lunge2.mis.shallow", "s": [["nasm-bulgarian-split-squat", "Common Mistakes (not descending far enough)"], ["ace-366", "opis — standard"], ["wniosek", "bss.move"]], "uproszczenie": "wariant sprzętu: hantle"}
      ]
    },
    "Lunges (hantle)": {
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean; Table 3, Add Resistance (dumbbell)"], ["catalyst-354", "opis (maintain an upright trunk) — standard"]], "uproszczenie": "wariant sprzętu: sztanga (Catalyst #354)"}
      ]
    },
    "Walking Lunges": {
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean; Table 3, Make it Mobile (walking lunges)"], ["ace-139", "Step 3 (keep the spine extended); wskazówka końcowa (tall, straight spine) — standard"]]}
      ]
    },
    "Reverse Lunge": {
      "mistakes": [
        {"c": "lunge2.mis.lean", "s": [["nsca-ptq-lunge", "Table 1, Forward Torso Lean (opis dla wykroku w przód); Table 3 (walking lunges forward and backward)"], ["ace-319", "opis (keeping the chest raised towards the ceiling) — standard"]], "uproszczenie": "analogia: wykrok w przód (NSCA)"}
      ]
    },
    "Curtsy Lunge": {
      "setup": [
        {"c": "lunge.stand", "s": [["ama-curtsy", "transkrypcja (standing tall with your feet about hip-width apart)"], ["canfitpro-curtsey", "Phase 3 (feet about hip width apart)"]]}
      ],
      "move": [
        {"c": "curtsy.move", "s": [["ama-curtsy", "transkrypcja (step your right leg back and across your body; bend both knees and lower your hips)"], ["canfitpro-curtsey", "Phase 3 (cross it in behind your torso and come down into a lunge; push off the front leg)"]]}
      ],
      "tips": [
        {"c": "lunge.torso", "s": [["ama-curtsy", "transkrypcja (keep your chest lifted / chest tall)"], ["canfitpro-curtsey", "Phase 3 (maintain a tall spine)"]]}
      ],
      "mistakes": []
    }
  },
  "sources": {
    "nsca-ptq-lunge": {"org": "NSCA", "title": "Boyd J, Milton K: The Undervalued Lunge, NSCA Personal Training Quarterly 4(4)", "url": "https://www.nsca.com/contentassets/24dd7222ed1b4caeb8a0a46b81bd11f3/ptq-4.4.9-the-undervalued-lunge.pdf", "level": 4},
    "catalyst-174": {"org": "Catalyst Athletics", "title": "Split Squat (exercise library #174)", "url": "https://catalystathletics.com/exercise/174/Split-Squat/", "level": 4},
    "canfitpro-curtsey": {"org": "canfitpro", "title": "Movement of the Month: Crossover Lunge to Curtsey Lunge (K. Lodato, 2018)", "url": "https://www.canfitpro.com/blog/mom-crossover-lunge-to-curtsey-lunge/", "level": 4},
    "ama-curtsy": {"org": "AMA", "title": "Curtsy Lunge: Challenge your balance (wideo z transkrypcją, 15.10.2026)", "url": "https://www.ama-assn.org/public-health/prevention-wellness/curtsy-lunge-challenge-your-balance", "level": 4}
  },
  "orgs": {
    "canfitpro": {"name": "canfitpro", "level": 4, "kind": "site"},
    "AMA": {"name": "American Medical Association", "level": 4, "kind": "site"}
  }
}
```

Uwagi dla wdrażającego: `ama-curtsy` i org „AMA” — tylko po potwierdzeniu szczebla przez koordynatora (sekcja 4); bez tego karta Curtsy Lunge wraca do otwartych.
Format pola `orgs` — dopasować do istniejących wpisów w `cues.json` (tu skrót). Nazwy organizacji tylko w `data/zrodla/cues.json` — sprawdzić `tests/forbidden-names.json` dla „AMA” i „canfitpro” przed wpisem.

## 3. Nowe zdania PL + EN

Id sprawdzone: brak w `lib/cues/text/pl.json` i w plikach W1 (grep 02.11.2026). Kolizja możliwa tylko z równoległymi plikami W2 — sprawdzić przy scaleniu.

| Id | PL | EN (propozycja) |
|---|---|---|
| `lunge2.mis.lean` | Pochylanie tułowia mocno w przód przy schodzeniu. | Tipping your torso far forward on the way down. |
| `lunge2.mis.shallow` | Za płytkie zejście — tylne kolano zostaje wysoko nad podłogą. | Not going deep enough — back knee stays well off the floor. |
| `stepup.mis.push` | Odbijanie się nogą z podłogi zamiast wchodzenia nogą na podwyższeniu. | Pushing off the floor foot instead of stepping up with the leg on the box. |
| `stepup.mis.drop` | Opadanie z podwyższenia zamiast kontrolowanego zejścia. | Dropping off the box instead of stepping down under control. |
| `curtsy.move` | Zrób krok jedną nogą w tył i za drugą nogę, jak przy dygnięciu; ugnij oba kolana, opuść biodra i wróć. | Step one leg back and behind the other, like a curtsy; bend both knees to lower your hips, then come back up. |

Istniejące zdania użyte bez zmian: `lunge.stand`, `lunge.torso`, `bss.setup`, `bss.move`, `stepup.move`; z W1: `split.setup` (wersja skrócona „Stań w wykroku: jedna stopa z przodu, druga z tyłu.”), `lunge.bbSetup`.
Uwaga do `bss.move` w Split Squat: NSCA podaje głębokość jako „oba kolana ok. 90°, jeśli możliwe”, Catalyst — „tylne kolano lekko dotyka podłogi”; zdanie („tylne kolano tuż nad podłogą”) leży w części wspólnej — do oceny recenzenta.
Uwaga do `lunge2.mis.lean`: NSCA uzasadnia błąd ryzykiem dla kolana — w aplikacji tylko nazwa błędu, bez twierdzenia zdrowotnego.

## 4. Źródła (przeczytane 02.11.2026, WebFetch; PDF przez Read)

| Id | Adres | Organizacja | Szczebel | Uzasadnienie szczebla / miejsce |
|---|---|---|---|---|
| nsca-ptq-lunge | https://www.nsca.com/contentassets/24dd7222ed1b4caeb8a0a46b81bd11f3/ptq-4.4.9-the-undervalued-lunge.pdf | NSCA | 4 | organizacja szkoląca (przeliczenie W1); autorki na s. 44: „Joni Boyd, PhD, CSCS, and Katy Milton, MS”; PTQ 4.4. Miejsca: s. 44–45 Starting Position („The torso should be straight…”), Lowering/Upward Phase, Table 1 „Forward Torso Lean” („the torso can lean forward during the downward phase”), Table 2 „Completely Stationary”, Table 3 „Make it Mobile”, „Add Resistance” |
| catalyst-174 | https://catalystathletics.com/exercise/174/Split-Squat/ | Catalyst Athletics | 4 | wiersz Catalyst w szczeble-organizacji; treść przeczytana w W1 (sekcja 4 `lunge.md`), w W2 nie otwierana ponownie |
| catalyst-560 | https://www.catalystathletics.com/exercise/560/Step-up/ | Catalyst Athletics | 4 | opis: „Using the raised leg with minimal assistance from the other foot…”; „control the motion back down as much as possible instead of just dropping” |
| hk-landow-stepup | (blok W1) | Landow, Jarmon (Human Kinetics) | 4 | przeliczenie W1; miejsca jak w W1 (drive the foot into the box; controls his descent) |
| ace-8 | (blok W1) | ACE | 4 | „Lift the chest and squeeze the shoulder blades together to keep the back straight through the entire movement.” |
| ace-366 | (już w danych) | ACE | 4 | „Keep the back straight while lowering the left knee towards the floor.”; „Before the left knee hits the floor, press the right foot into the ground.”; brak sekcji błędów |
| nasm-bulgarian-split-squat | (już w danych) | NASM | 4 | Step 1–4; Common Mistakes: front knee caves inward, leaning excessively forward, niedostateczne zejście; brak autora i daty (precedens NASM) |
| ace-319, ace-139, ace-363 | (już w danych) | ACE | 4 | #319: „while keeping the chest raised towards the ceiling”; #363: „Keep the back straight…”, „Descend to a comfortable range of motion” (nieużyte w błędach); ACE nie ma sekcji błędów na tych stronach |
| canfitpro-curtsey | https://www.canfitpro.com/blog/mom-crossover-lunge-to-curtsey-lunge/ | canfitpro | 4 | autor Kennedy Lodato („Coach Kennedy”) — biogram na stronie: 27 lat jako trener, master instructor canfitpro, trzykrotny PRO TRAINER of the Year; data 24.10.2018. Phase 3: „take your right leg and cross it in behind your torso and come down into a lunge”; „Push off the front leg…” |
| ama-curtsy | https://www.ama-assn.org/public-health/prevention-wellness/curtsy-lunge-challenge-your-balance | American Medical Association | **4 — PROPOZYCJA** | organizacja lekarzy, dział „public health / prevention-wellness”, materiał firmowany przez AMA, data 15.10.2026, bez autora. W szczeble-organizacji brak wiersza AMA; najbliżej uzup. 2 („organizacje zdrowia publicznego i pacjentów … jawne firmowanie — data nie jest wymagana”). Transkrypcja: „step your right leg back and across your body almost like you're doing a curtsy”; „try not to let your front knee collapse inward” |
| ucalgary-latl | https://ucalgary.ca/shred-injuries/all-sports/soccer/lateral-lunges | SIPRC (Sport Injury Prevention Research Centre), University of Calgary — program SHRed Injuries | **[OTWARTE]** | autorka Carla van den Berg — kwalifikacje nie widoczne na stronie, biogram na ucalgary.ca → 403; brak daty. Treść: „'Back' leg straight”, „Sit back into the hips”, „Both feet flat on floor”, błędy: kolano do środka, nadmierne pochylenie. Nie użyte w bloku |
| prehab-lateral-lunge | https://theprehabguys.com/vimeo-video/lateral-lunge/ | The Prehab Guys | 5 | bez autora (warunkowo 4 tylko z autorem); nieużyte |

## 5. Otwarte

- **W2-O1 Szczebel AMA** — brak wiersza w `szczeble-organizacji`; decyzja koordynatora. Bez niej Curtsy Lunge = otwarta (canfitpro = jedno źródło).
- **W2-O2 Lateral Lunge** — ruch `latl.move` miałby ACE #50 + University of Calgary (gdy biogram potwierdzi kwalifikacje, np. CSEP-CEP — tylko z wyszukiwarki, nie przeczytane); ustawienie dalej sprzeczne (O-4 z W1); Calgary daje też `sq.mis.heels` („Both feet flat on floor”) i błąd kolana. Następny krok: przeczytać biogram (inny adres lub kopia).
- **W2-O3 Kolano w wykrokach (`lunge.knee`, `lunge.mis.kneeIn`)** — Lunges (sztanga), Walking, Split Squat: tylko NSCA PTQ; BSS (sztanga/Smith): tylko NASM (ExRx 403); Curtsy: tylko AMA. Drugie źródło nie znalezione (NASM nie ma strony zwykłego wykroku; Mayo Clinic 403).
- **W2-O4 Reverse Lunge — `lunge2.mis.lean`** oparte na analogii do wykroku w przód (NSCA); jeśli recenzent odrzuci analogię — usunąć z karty.
- **W2-O5 `lunge2.mis.lean` w BSS** — NASM wprost, ale ACE #366 mówi tylko „plecy proste” (inne kryterium) → nie wpisane do BSS (jedno źródło).
- **W2-O6 Step Up (KARTA)** — propozycja dopisania `stepup.mis.push` i `stepup.mis.drop` (sekcja 1) — poza zleceniem, decyzja koordynatora.
- **W2-O7 Bez zmian z W1**: O-3 (ustawienie ławki w maszynie Smitha), O-4, O-8 (Crossover Reverse Lunge — definicja i `f: "mobility"`), O2-5 (definicja Single-Leg High Box Squat), O2-6 (Smith Machine Pistol Squat).
- **W2-O8 Nie badane w W2** (kolejność, kontekst): Elevated Back Lunge, Split Squat (linki), Suspended Split Squat, Slider Reverse Lunge, Lunge Pass Through, Single Leg Press, Cossack Squat i Barbell Side Split Squat (jedno wyszukiwanie — bez źródła ≤ 4).

## Stan

- Zrobione: 3 karty W1 → z błędami; 3 nowe karty z błędami (Split Squat, BSS sztanga, Smith BSS); 3 karty `partial` + błąd; Curtsy Lunge warunkowo bez błędów; 5 nowych zdań; 4 nowe źródła.
- Zostało: W2-O1…O8.
- Następny krok: decyzja o AMA; biogram SIPRC (Lateral Lunge); drugie źródło kolana w wykroku (np. strona szpitala z autorem/datą).
- Pułapki: PDF NSCA przez WebFetch nie daje tekstu — zapisany plik czytać narzędziem Read (strony 1–3); ExRx 403 — nie liczyć do nowych zdań, choć jest w danych; „pochylanie tułowia” nie jest zaprzeczeniem „pleców prostych”.
