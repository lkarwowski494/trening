# Wskazówki techniki — fala „obowiązkowe 1.1”, grupa „mieszane” (18 ćwiczeń)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Podstawa: stan W1 i W2 (kopie w `kontekst-obow/<gałąź>/docs/research/wskazowki-fala-w{1,2}/`, miejsca podane przy każdym wierszu), reguły: CLAUDE.md „Merytoryczne podstawy”, docs/18 l.134–150, `szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`).
Ważne dla kart: wszystkie ćwiczenia z sekcji A poza Sissy Squat, Handstand Push Up i Meadows Row mają dane póz v2 (`docs/research/pokrycie-1-1-obowiazkowe.json`), więc **karta częściowa (bez błędu) nie wchodzi** (docs/18 l.147) — potrzebny błąd ze źródeł albo wnioskowany (docs/18 l.150). Role mięśni grupy — osobny plik `role-miesni.md`.
Strony z sekcji 4 przeczytane w tej sesji (WebFetch, 02.11.2026), chyba że zaznaczono „z zapisu W1/W2”. Przed statusem gotowym — recenzja niezależna (L-047).

## (1) Tabela ćwiczeń

| Ćwiczenie (rodzina) | Stan | Droga | Co i dlaczego |
|---|---|---|---|
| Hack Squat (leg_machine) | **karta z błędem** (bez zależności od NFPT) | 1 + błąd wnioskowany | Nowe źródło ISSA (23 Squat Variations, 05.02.2024, wpis Hack Squat: górna część pleców o poduszki, zejście do przysiadu; 4). Ustawienie rozbite: `hack.setup3` (plecy i barki o poduszki) — BarBend + ISSA; szerokość stóp zostaje poza zdaniem (BarBend + NFPT warunkowo). Ruch `hack.move` — BarBend + ISSA (ISSA mówi wprost tylko o zejściu — do oceny recenzenta). Błąd `hack.mis.hips` — BarBend wprost + wniosek z `hack.setup3` (+ NFPT, jeśli koordynator uzna ramkę „Guest Author”, STAN-w2-nogi pkt 1). |
| Hanging Leg Raise (core_hang) | otwarta | — | W1 `core_hang.md:16`, W2 `core_hang.md:13`: `hang.setup` i `hang.legs.move` po jednym źródle (Catalyst); błąd `hang.noSwing` ma 2 źródła. W tej sesji: strony NASM o zwisach — 404, ACE nie ma haseł zwisów (filtr „pull-up bar”: tylko Chin-ups i Pull-ups). |
| Hanging Knee Raise (core_hang) | otwarta | — | jw.; `hang.knees.move` tylko NASM, `hang.setup` tylko Catalyst (wariant). |
| Pec Deck (chest_fly) | otwarta | — | W1 `chest_fly-cz1.md:13`, W2 `chest_fly-cz1.md:17`: tylko Hoist (producent, jedna organizacja); w tej sesji nie badane ponownie. |
| Upright Row (hantle) (delt_raise) | **karta z błędem** | 1 + 3 | Wersja z hantlami oburącz wprost: UMass Memorial Health / WebMD Ignite (szpital, 4 — uzup. 2): ciężar w każdej ręce, dłonie do ciała, ręce proste, unoszenie wzdłuż linii środka ciała do obojczyków. Drugie źródło: NSCA ETM (przedruk, 3) + ISSA (4) dla sztangi jako „uproszczenie: wariant sprzętu” (W2 `delt_raise-cz1.md:20–21,141–152`). Ruch się nie różni (ciężar prowadzony pionowo przy ciele) — potwierdza recenzent. W W2 hasło pominięte, bo `cues.json:8895` miało wpis „otwarte”. |
| Hip Abduction (hip_abd_add) | otwarta | — | W1 `hip_abd_add.md:27`, W2 `hip_abd_add.md:18,158`: jedna instrukcja producenta (Life Fitness SL60), oryginał nieodnaleziony; nie badane ponownie. |
| Hip Adduction (hip_abd_add) | otwarta | — | jw. (SL55); ACE 104 i ISSA opisują wyciąg/gumę stojąc — inne ustawienie niż maszyna siedząca, więc wariant sprzętu nie ma zastosowania. |
| Triceps Dip (dip) | otwarta | (3?) | W2 `dip.md:12,98`: jedno źródło dla prostego tułowia (BarBend). Do decyzji recenzenta: przeniesienie `dip.setup`/`dip.move` z Chest Dip (to nie wariant sprzętu, tylko kąt tułowia — reguła z 02.11 tego nie obejmuje wprost). |
| Ring Dips (dip) | otwarta | — | W2 `dip.md:13,99`: tylko BarBend; kółka ≠ wariant sprzętu poręczy (zmienia pracę barku). Pytanie o bezpieczeństwo/progresję — sekcja 5. |
| Close-Grip Push-Up (pushup_plank) | otwarta | — | W1 `pushup_plank-cz1.md:15,93`, W2 `pushup_plank-cz1.md:16,113`: brak źródła szczebla 4; zmiana szerokości dłoni ≠ wariant sprzętu. |
| Push-Up Wide (pushup_plank) | otwarta | — | W2 `pushup_plank-cz1.md:15,112`: jedno źródło (Fitness Volt, P. Dale). |
| Pike Push Up (overhead_press) | otwarta | — | W1 `overhead_press-cz2.md:15,94`: tylko NASM. Nowe: ISSA (J. Liebl, 14.10.2026, „The Best Shoulder Exercises…”) — tylko „Keep the hips high and press up and slightly back” (bez ustawienia dłoni i opuszczania) → wspiera wskazówkę o biodrach, nie `pike.setup`/`pike.move`. |
| Seated Calf Raise (hantle) (calf_raise) | karta z błędem — **warunkowa** (decyzja koordynatora) | 3 | W2 `calf_raise.md:21,157–182`: `calf.seatedEdge`, `calf.move`, `calf.pause`, `calf.mis.partial` jako uproszczenie „wariant sprzętu — maszyna”; zależy od STAN-w2-nogi pkt 4 (krawędź podestu wprost tylko ISSA). Blok z W2 bez zmian. |
| Lateral Lunge (lunge) | otwarta | — | W1 `lunge.md:31,280`, W2 `lunge.md:30`: ustawienie stóp sprzeczne (ACE „na szerokość bioder” vs Eleiko „stopy razem”), ruch ACE + University of Calgary (szczebel otwarty). |
| Single Arm Cable Row (cable_row) | karta z błędem — **warunkowa** | 1 | W2 `cable_row.md:13,38,91`: ACE 337 (stojąc) + Healthline (recenzent DPT, krótka wzmianka o wersji jednorącz); STAN-w2-przyciaganie pkt 4 — decyzja, czy wzmianka wystarcza. Blok z W2 bez zmian. |
| Sissy Squat (leg_isolation; bez póz v2) | otwarta | — | W1 `leg_isolation.md:55`: ruch + 1 wskazówka mają ISSA + BarBend, brak ustawienia z 2 źródłami; bez póz v2, więc karta częściowa dozwolona — brakuje tylko ustawienia. Nie badane ponownie (kontekst). |
| Handstand Push Up (overhead_press; bez póz v2) | **karta z błędem** | 1 | Nowe drugie źródło: BarBend (M. Dewar, MSc, CSCS, akt. 06.11.2024; 4). Razem z CrossFit (W1 `overhead_press-cz2.md:16,57–59,99`): `hspu.setup`, `hspu.move`, `hspu.triangle`, `plank.brace`; błąd łokci na boki — BarBend wprost + CrossFit standard (łokcie do tyłu). |
| Meadows Row (row; bez póz v2) | otwarta | — | W1 `row.md:36`, W2 `row.md:19`: tylko Generation Iron; nie badane ponownie (kontekst). |

Bilans: **karty z błędem 3** (Hack Squat, Upright Row (hantle), Handstand Push Up) + **2 warunkowe z W2** (Seated Calf Raise (hantle), Single Arm Cable Row) — razem 5; częściowe 0; otwarte 13.
Drogi: 1 — 3 razy (Hack Squat, Upright Row, HSPU; plus Single Arm Cable Row z W2), 2 — 0 (książek w tej sesji nie czytałem; Delavier anulowany — docs/18 l.152), 3 — 1 nowe (Upright Row) + 1 z W2 (Seated Calf Raise), 4 — 0 nowych (NFPT przy Hack Squat przestaje być konieczne).

## (2) Blok do wdrożenia

```json
{
  "_tryb": "dopisz",
  "exercises": {
    "Hack Squat": {
      "_uwaga": "zastępuje blok W2 (leg_machine.md:44–67); hack.setup2 → hack.setup3 (bez szerokości stóp), żeby para źródeł nie zależała od NFPT",
      "setup": [
        {"c": "hack.setup3", "s": [
          ["barbend-hack-squat-machine", "Step 2: Set Your Stance (back against the backrest; head between the shoulder pads)"],
          ["issa-squat-variations", "Hack Squat (place the top of your back against the pads)"]
        ]}
      ],
      "move": [
        {"c": "hack.move", "s": [
          ["barbend-hack-squat-machine", "Step 3: Squat (slide down into a deep squat; push into the plate to return)"],
          ["issa-squat-variations", "Hack Squat (lower into the squat position; the machine guides the movement)"]
        ]}
      ],
      "tips": [],
      "mistakes": [
        {"c": "hack.mis.hips", "s": [
          ["barbend-hack-squat-machine", "Common Mistakes (hips and torso connected with the pad at all times)"],
          ["wniosek", "hack.setup3"],
          ["nfpt-hack-squat", "Cautions — tylko jeśli koordynator uzna ramkę autora (STAN-w2-nogi pkt 1)"]
        ]}
      ]
    },
    "Upright Row (hantle)": {
      "setup": [{"c": "urow.setup", "s": [
        ["ummhealth-urow", "instrukcja (one weight in each hand, palms facing the body, elbows straight)"],
        ["issa-urow", "How to (overhand grip, arms fully extended) — uproszczenie: wariant sprzętu sztanga"],
        ["nsca-etm-urow", "Starting position — uproszczenie: wariant sprzętu sztanga"]
      ]}],
      "move": [{"c": "urow.move", "s": [
        ["ummhealth-urow", "instrukcja (raise the weights along the midline of your body up to your collarbone)"],
        ["issa-urow", "How to (close to the front of the body) — uproszczenie: wariant sprzętu sztanga"],
        ["nsca-etm-urow", "Upward/Downward movement — uproszczenie: wariant sprzętu sztanga"]
      ]}],
      "tips": [
        {"c": "ur.elbows", "uproszczenie": "wariant sprzętu sztanga", "s": [["nsca-etm-urow", "Upward movement (elbows level with or higher than wrists)"], ["issa-urow", "How to (each elbow stays above the forearm)"]]}
      ],
      "mistakes": [
        {"c": "urow.mis.curl", "uproszczenie": "wariant sprzętu sztanga", "s": [["nsca-etm-urow", "Upward movement (do not curl the bar upward)"], ["wniosek", "ur.elbows"]]},
        {"c": "urow.mis.away", "s": [["wniosek", "urow.move"]]}
      ]
    },
    "Handstand Push Up": {
      "setup": [{"c": "hspu.setup", "s": [
        ["crossfit-hspu-master", "Hand placement"],
        ["barbend-hspu", "Setup (hands slightly wider than shoulder width, about six inches from the wall)"]
      ]}],
      "move": [{"c": "hspu.move", "s": [
        ["crossfit-hspu-master", "Head position (top of the head to the floor)"],
        ["barbend-hspu", "Lowering and pressing (head toward the pad; press back up)"]
      ]}],
      "tips": [
        {"c": "hspu.triangle", "s": [["crossfit-hspu-master", "Head position (triangle)"], ["barbend-hspu", "Head rests closer to the wall than the hands — triangular base"]]},
        {"c": "plank.brace", "s": [["crossfit-hspu-master", "Body position"], ["barbend-hspu", "Brace the core as in a hollow hold or plank"]]}
      ],
      "mistakes": [
        {"c": "hspu.mis.flare", "s": [["barbend-hspu", "Common mistakes (elbows flaring out)"], ["crossfit-hspu-master", "Elbows travel back when lowering — błąd = zaprzeczenie standardu (uzup. 2)"]]}
      ]
    },
    "Seated Calf Raise (hantle)": "(blok W2 `w2-nogi/.../calf_raise.md:157–182` bez zmian — warunkowo, STAN-w2-nogi pkt 4)",
    "Single Arm Cable Row": "(blok W2 `w2-przyciaganie/.../cable_row.md:38` bez zmian — warunkowo, STAN-w2-przyciaganie pkt 4)"
  },
  "sources": {
    "issa-squat-variations": {"org": "ISSA", "title": "23 Squat Variations for a Mind-Blowing Lower Body Workout (By ISSA, 05.02.2024) — wpis Hack Squat", "url": "https://www.issaonline.com/blogs/strength/23-squat-variations-for-a-mind-blowing-lower-body-workout", "level": 4},
    "ummhealth-urow": {"org": "UMass Memorial Health (treść WebMD Ignite)", "title": "Upper Body Exercises: Upright Row", "url": "https://www.ummhealth.org/health-library/upper-body-exercises-upright-row", "level": 4},
    "barbend-hspu": {"org": "BarBend", "title": "Turn Your Training On Its Head With the Handstand Push-Up (M. Dewar, MSc, CSCS; akt. 06.11.2024)", "url": "https://barbend.com/handstand-push-up/", "level": 4}
  }
}
```

Uwagi do bloku: `ummhealth-urow` = ten sam dokument co `webmd-ignite-urow` w W2 (`delt_raise-cz1.md:174`) — przy scalaniu użyć jednego id. `crossfit-hspu-master`, `issa-urow`, `nsca-etm-urow`, `barbend-hack-squat-machine`, `nfpt-hack-squat` — wpisy z W1/W2. Przy HSPU tekst `hspu.move` mówi „aż czubek głowy dotknie podłogi”; BarBend mówi o głowie zmierzającej do podkładki (przy nauce — klocki ograniczające zakres) — recenzent oceni, czy zdanie nie jest zbyt kategoryczne (alternatywa: „opuść głowę do podłogi albo podkładki”).

## (3) Nowe zdania PL + EN

| id | PL | EN | uwaga |
|---|---|---|---|
| `hack.setup3` | Oprzyj plecy o oparcie, a barki o poduszki maszyny. | Rest your back against the pad and your shoulders under the shoulder pads. | `hack.setup2` bez części o stopach (stopy: BarBend + NFPT warunkowo) |
| `hspu.mis.flare` | Łokcie uciekają szeroko na boki. | Elbows flaring out wide. | jeśli istniejące `push.mis.flare` ma ten sam sens — użyć go zamiast nowego id |

Pozostałe zdania (`hack.move`, `urow.*`, `ur.elbows`, `hspu.setup`, `hspu.move`, `hspu.triangle`, `plank.brace`, `hack.mis.hips`) — brzmienia z `lib/cues/text/pl.json` / W1 `overhead_press-cz2.md:57–59` / W2 `delt_raise-cz1.md`, `leg_machine.md:106–107`.

## (4) Źródła (nowe w tej sesji; odczyt 02.11.2026)

| id | adres | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|
| issa-squat-variations | https://www.issaonline.com/blogs/strength/23-squat-variations-for-a-mind-blowing-lower-body-workout | 4 — organizacja certyfikująca trenerów, artykuł firmowany „ISSA” z datą (szczeble, wiersz ISSA) | wpis „Hack Squat”: „Essentially, the machine assists with proper movement and form.” |
| ummhealth-urow | https://www.ummhealth.org/health-library/upper-body-exercises-upright-row | 4 — system szpitalny, treść firmowana (uzup. 2: firmowanie wystarcza, data nie jest warunkiem) | instrukcja: „raise the weights along the midline of your body up to your collarbone” |
| barbend-hspu | https://barbend.com/handstand-push-up/ | 4 — artykuł o technice, autor CSCS, data (BarBend warunkowo 4 — warunek spełniony) | Setup; head position; lowering; common mistakes |
| issa-shoulder-noequip | https://issaonline.com/blogs/training-tips/9-great-shoulder-exercises-with-no-equipment | 4 (J. Liebl, 14.10.2026) | Pike push-up: „Keep the hips high and press up and slightly back.” — nie użyte w bloku (tylko wskazówka, bez ustawienia i ruchu) |
| (nieudane) NASM exercise library — hanging-knee-raise, hanging-leg-raise, lateral-lunge, close-grip-push-up, triceps-dip | nasm.org/resource-center/exercise-library/… | — | 404 (adresy zgadywane z wzoru) |
| (nieudane) ACE, filtr „pull-up bar” | https://www.acefitness.org/resources/everyone/exercise-library/equipment/pull-up-bar/ | 4 | tylko Chin-ups i Pull-ups — brak zwisów |

## (5) Pytania dla koordynatora

1. **Hack Squat**: przyjąć `hack.setup3` (BarBend + ISSA) zamiast `hack.setup2` w karcie, a `hack.move` z ISSA, które mówi wprost tylko o zejściu („lower into the squat position”) — czy wystarcza do zdania „opuść się…, potem wstań”? Jeśli nie — ruch zostaje przy BarBend + NFPT (warunek ramki).
2. **Upright Row (hantle)**: recenzent niezależny potwierdza, że ruch hantlami oburącz nie różni się od sztangi (ciężar prowadzony pionowo przy ciele; jedyna różnica — chwyt neutralny/nachwyt i brak sztywnego gryfu). Rozbieżność wysokości: UMass „do obojczyków”, NSCA „dolna część mostka–broda”, ISSA „wysokość barków” — `urow.move` ma część wspólną z W2.
3. **Handstand Push Up — bezpieczeństwo i progresja (zdrowie, bez własnych ostrzeżeń w aplikacji)**: BarBend pisze, że poprawne ułożenie ciała chroni nadgarstki, łokcie i barki; do nauki — klocki ograniczające zakres i miękkie podłoże na wypadek upadku; wersja z wymachem może obciążać szyję przy lądowaniu na głowie. CrossFit (W1) — kolejność progresji. Czy karta ma mieć zdanie o nauce na podkładce/klockach (to nie porada medyczna, ale dotyka bezpieczeństwa) — decyzja produktowa; bez decyzji nic nie wpisuję.
4. **Ring Dips** — w W2 BarBend radzi ustabilizować się na prostych rękach przed zejściem; pytanie o warunki (siła na poręczach przed kółkami) nie zbadane — otwarte.
5. **Triceps Dip**: czy przeniesienie `dip.setup`/`dip.move` z Chest Dip (różnica tylko w pochyleniu tułowia) traktować jak „wariant sprzętu” (reguła 02.11 mówi o sprzęcie, nie o pozycji) — decyzja koordynatora/recenzenta; jeśli tak, karta z błędem `dip.mis.depth` (BarBend + ISSA).
6. Seated Calf Raise (hantle) i Single Arm Cable Row — rozstrzygnięcia z W2 (STAN-w2-nogi pkt 4, STAN-w2-przyciaganie pkt 4) decydują o 2 kartach z tej listy.

## Stan agenta

- Zrobione: plik ról (`role-miesni.md`, priorytet B) — 4 z 5 ćwiczeń z rolami; sekcja A — 18 ćwiczeń przejrzanych w plikach W1/W2, nowe źródła dla Hack Squat, Upright Row (hantle), Handstand Push Up (3 karty z błędem), próby dla Pike Push Up i zwisów.
- Zostało (w kolejności listy, otwarte): Hanging Leg/Knee Raise (drugie źródło `hang.setup` i ruchów — szukać: ISSA/BarBend artykuł o unoszeniu nóg w zwisie z autorem, CrossFit „hanging knee raise”), Pec Deck (instrukcja drugiego producenta maszyny: Technogym, Matrix, Life Fitness — oryginał PDF), Hip Abduction/Adduction (oryginał instrukcji Life Fitness SL55/SL60 albo innego producenta), Triceps Dip (decyzja pkt 5), Ring Dips, Close-Grip/Wide Push-Up (ISSA „How to Maximize Your Push-ups” — https://www.issaonline.com/blogs/training-tips/how-to-maximize-your-pushups — nieprzeczytane, kandydat), Pike Push Up (drugie źródło ustawienia i ruchu), Lateral Lunge (rozstrzygnięcie ustawienia stóp — część wspólna bez szerokości?), Sissy Squat (ustawienie), Meadows Row (drugie źródło obok Generation Iron).
- Następny krok: ISSA „How to Maximize Your Push-ups” (Close-Grip, Wide, Pike — możliwe trzy zdania naraz), potem Catalyst „The Push-up” (https://pm.catalystathletics.com/article/221/The-Push-up/).
- Pułapki: adresy biblioteki NASM nie dają się zgadywać (404) — szukać przez wyszukiwarkę z `allowed_domains`; Fitness Volt — każdą stronę sprawdzać osobno (medicine-ball-slam-guide: autor student → nie 4); strony aplikacji treningowych w wynikach (np. dzienniki z bazą ćwiczeń) — pomijać bez wpisu.

## Kontynuacja 02.11.2026

Autor: badacz merytoryczny (drugi agent, kontynuacja). Status: **PROPOZYCJA**. Odpowiedzi koordynatora uwzględnione (docs/18, wpisy 02.11.2026 dla grup triceps i mieszane): Triceps Dip **nie** korzysta ze źródeł Chest Dip; zmiana chwytu/szerokości dłoni nie jest wariantem sprzętu; NFPT „Guest” z biogramem i datą = 4; Fitness Volt z autorem z kwalifikacjami i datą = 4 per strona.
**Reguła daty na stronach Fitness Volt (stosowana tu):** liczę datę widoczną w tekście strony („Article Updates Timeline”, „Recent Updates”); data tylko w metadanych JSON-LD = brak daty → 5 (precedens W2 `dip.md:88`, `fitnessvolt-dips`). Trzy ćwiczenia zależą od tej reguły — pytanie K1.
Wszystkie strony z tabeli źródeł przeczytane w tej sesji (WebFetch / PDF), chyba że zaznaczono „z zapisu W1/W2”. Rysunki v2: wszystkie ćwiczenia tej kontynuacji poza Sissy Squat i Meadows Row mają pozy v2 → karta wymaga błędu.

### (1) Tabela ćwiczeń (13)

| Ćwiczenie | Stan | Droga | Co i dlaczego |
|---|---|---|---|
| Close-Grip Push-Up | **karta z błędem** | 1 | `cpush.setup2`: BarBend (bez ciężarów, M. Dewar/S. McLean, CSCS, akt. 02.07.2024: „hands underneath the shoulders”, „solid front plank”) + Healthline (Triceps pushup; rec. D. Bubnis, NASM-CPT: „hands directly below shoulders, your neck and spine neutral”). `cpush.move` (W1): Healthline („elbows pinned to your sides”, „Lower down until your chest reaches the floor and return to start”) + BarBend („elbows tucked alongside your ribcage”). Błąd `push.mis.flare`: BarBend wprost („without flaring them”) + Healthline (łokcie przy bokach — błąd = zaprzeczenie standardu). ISSA („hands closer together, also known as diamond”) nie użyte — Diamond Push Up to osobne hasło katalogu (`lib/catalog.generated.ts:24`). FV „Dr. Malik” — data tylko w metadanych → 5. Recenzent: czy Healthline „Triceps pushup” = nasze Close-Grip Push-Up. |
| Push-Up Wide | **karta z błędem — warunkowa** (ruch) | 1 + wniosek | `wpush.setup2`: FV (P. Dale, PT; recenzent Dr. Malik; data widoczna 20.01.2024 — 4) „about 1 ½ shoulder-widths apart”, „legs and body form a straight line” + ISSA (Maximize, 05.02.2024) „Moving your hands further apart…”, pompka „as one unit”. `wpush.move2` (bez kierunku łokci): FV krok 3–4 + ISSA (opis podstawowej pompki; szeroki wariant zmienia tylko dłonie) — recenzent oceni, czy opis ogólny ISSA wystarcza. Błąd `plank.mis.sag`: wniosek z `wpush.setup2` (ciało w linii). Kierunek łokci „na boki” — tylko FV → poza kartą. |
| Pike Push Up | **karta z błędem — warunkowa** (ruch) | 1 + wniosek | `pike.setup2` (bez szerokości dłoni): NASM (z zapisu W1, Step 1) + ISSA Maximize („lift your hips up… an upside-down V”) + Catalyst „The Push-up” (G. Everett, 2007: „walk the feet up closer to the hands, bending only at the hips”). `pike.move` (W1): NASM Step 3 + Catalyst pośrednio (klocki pod dłonie, „to give the head somewhere to go” — głowa schodzi w dół) + ISSA shoulder („press up and slightly back”) — recenzent. Błąd `pike.mis.hips`: NASM wprost („allowing hips to sag”, z zapisu W1) + wniosek z `pike.setup2`. |
| Hanging Leg Raise | **karta z błędem** | 1 | `hang.setup`: Catalyst 45 (z zapisu W1) + BarBend HLR (E. Bugera, CSCS, akt. 21.06.2024: „Set your hands on a pull-up bar about shoulder-width apart”, „completely dead hang”). `hang.legs.move`: Catalyst + BarBend HLR („raising your legs until… 90 degrees of hip flexion”, „Slowly lower your legs back”). `hang.noSwing`: istniejące 2 źródła + BarBend („not momentum”). |
| Hanging Knee Raise | **karta z błędem** | 1 | `hang.setup`: BarBend HKR (Bugera, akt. 27.11.2024: dead hang, dłonie ok. na szerokość barków) + Healthline HKR (T. Read, BSc, CPT; rec. D. Bubnis; 04.06.2021: „Grip your pullup bar… and start to hang.”). `hang.knees.move`: NASM Best Abs (z zapisu W1) + BarBend HKR („pull the knees towards your chest”, powrót „under control”) + Healthline („raise your knees upward toward your chest”, „Slowly lower your legs”). `hang.noSwing`: NASM („Avoid using momentum…”) + Healthline („swinging their legs and using momentum”) + BarBend (swaying). |
| Pec Deck | **karta z błędem** | 1 + wniosek | Bez producentów (ogólna maszyna). `pdeck.back2`: BarBend chest flye machine (Bugera, akt. 09.04.2024: „tall, resting against the back pad”) + Healthline Pec Deck (rec. D. Bubnis; 31.05.2019: „Press your back firmly against the back of the platform”). `pdeck.move` (W1): Healthline („Bring the handles or arm pads in front of your chest… slowly release back”) + BarBend (łuk jak przy „objęciu”, kontrolowany powrót). Błąd `pdeck.mis.sway`: Healthline wprost („not so difficult that your body sways or rocks”) + wniosek z `pdeck.back2`. Wysokość siedziska — rozbieżna (BarBend: uchwyty na wysokości pach; Healthline: łokcie na wysokości klatki; W1/Hoist: barki) → poza kartą. Stopy: Healthline „flat on the floor”, Hoist RS-1302 podnóżki → poza kartą. |
| Hip Abduction | otwarta — **warunkowa** (K1) | 1 / 4 | `habd.move`: BarBend (glute kickbacks, sekcja Machine Hip Abduction, Bugera, akt. 24.04.2024: „Drive your legs out against the pads…”) + Cleveland Clinic (glutes, 17.03.2025: „push your legs apart”) — 2 źródła. `habd.setup`: tylko BarBend („outer legs snug against the pads and your back flat against the backrest”, „legs… as close together as possible”); FV (P. Dale: „knees inside the leg pads”, „Sit up tall”) — data tylko w metadanych → 5. Jeśli K1 = tak: karta z błędem `habd.mis.lean` (FV „Do not lean forward from your hips” + wniosek z `habd.setup`). Uwaga: wiadomości BarBend cytują trenerów zalecających pochylenie w przód (Nippard 30°, Stern) — to artykuły-relacje, nie artykuły techniki; recenzent oceni, czy to „przeczy”. |
| Hip Adduction | **karta z błędem — warunkowa** (uproszczenie) | 1 + 3 | `hadd.mseat`: FV „Hip Adductor Exercises” (V. Saini, ACE-CPT; data widoczna „Recent Updates” 10.06.2024 — 4): „upright position with your back against the pad and your spine neutral” + Healthline Adductor Exercises (D. Preiato, RD, CSCS; rec. G. Minnis, DPT; akt. 13.10.2026) — wersja z gumami siedząc jako zamiennik maszyny („Sit on a chair or bench.”, „Maintain a straight back”) = **uproszczenie: wariant sprzętu** (guma zamiast maszyny, ten sam ruch siedząc — potwierdza recenzent). `hadd.mmove`: FV („pull the legs together as you squeeze the pads inward”, „Return… in a controlled motion”) + Healthline („Squeeze your thighs together…”, „Slowly reverse the movement”). Błąd `hadd.mis.snap`: wniosek z `hadd.mmove`. |
| Triceps Dip | otwarta — **warunkowa** (K1, K2) | — | Bez źródeł Chest Dip (decyzja 02.11, pkt 4). Ogólne źródła dipów, nie „na klatkę”: BarBend dips (z zapisu W2; tułów „nearly vertical”) i Catalyst 547 Dip („bend the elbows and shoulders to lower yourself…”, „Press back up into full elbow extension”; pochylenie opisane tylko jako zmiana akcentu) → `dip.setup`/`dip.move` mają 2 źródła ogólne. `dip.upright`: BarBend + FV „Weighted Parallel Bar Dips” (Saini, ACE-CPT: „maintain an upright torso to target the triceps”) — data tylko w metadanych → 5. Błąd z 2 źródłami brak: `dip.mis.overLean` = BarBend + FV (5); wyprost na górze sprzeczny (Catalyst: pełny wyprost; FV/ISSA ławka: bez blokowania). NFPT „How To Do Bodyweight Dips” (M. Rogers, 09.08.2025) — bez biogramu na stronie → 5. |
| Ring Dips | **karta z błędem — warunkowa** | 1 + wniosek | `rdip.setup`: BarBend dips, akapit Ring Dips (z zapisu W2: wskocz do podporu, „steady at lockout before dipping down”) + CrossFit Journal „Applications of the Support on Rings” (T. Hass, nr 57, 05.2007, s. 2–4 — start z podporu na prostych rękach). `rdip.move`: Hass s. 3–4 („Depth… ‘hands to your armpits’”, „sure you lock out at the top of the rep”) + BarBend (ruch dipu, akapit Ring Dips). Głębokość jako miara („dłonie przy pachach”) — tylko Hass → poza zdaniem. Błąd `rdip.mis.lockout`: Hass wprost + wniosek z `rdip.move`. „Opieranie rąk o linki” — tylko Hass (dwa jego teksty = jedno źródło) → poza kartą. Hass jest producentem kółek (biogram s. 4) — CrossFit Journal jako wydawca, szczebel 4 jak precedens `crossfit-hspu-master`; niezależny od BarBend. |
| Lateral Lunge | **karta z błędem** | 1 | `lunge.stand` (istniejące): ACE 50 (z zapisu W1, stopy na szerokość bioder) + NASM Squat Alternatives (H. Cherry, CPT; akt. 01.10.2025: „feet hip width apart”) + Healthline Lunges (T. Edwards, PT, MPT; rec. D. Bubnis; 14.04.2023: „Stand with your feet hip-width apart.”). Sprzeczność z W1 znika: Eleiko inspire360 („stopy razem”) = 5 (W2 `lunge.md:14`). `latl.move`: ACE + NASM („Step one foot laterally… sitting the hips back”, „trailing leg is straight”, „Push through the mid-foot… to return”) + Healthline („Bend your ‘stepping’ knee while keeping the other knee straight”). Błąd `sq.mis.heels`: ACE 50 (z zapisu W1) + Healthline („keeping your other foot flat” — błąd = zaprzeczenie standardu; dotyczy stopy nogi prostej — recenzent). |
| Sissy Squat | otwarta — **warunkowa** (K1) | — / 4 | Ustawienie: BarBend (J. Dickson, NASM-CPT, USAW-L2, akt. 19.11.2024: „feet under your hips”, „hold onto a door frame, a barbell held in a rack, or other stable fixture”) + FV „Sissy Squat” (S. Theunissen, PT, certyfikaty ISSA: „hold onto it with one (or both) hand for balance”) — data FV tylko w metadanych → 5. Szerokość stóp rozbieżna (BarBend pod biodrami; FV nieco szerzej niż barki) → poza zdaniem. Jeśli K1 = tak: karta częściowa (bez póz v2 — dozwolona) `sissy.setup` + `sissy.move` + `sissy.torso` (W1). |
| Meadows Row | **karta** (bez błędu; bez póz v2) | 1 / 4 | `meadows.setup2` i `meadows.pull`: BarBend (S. McLean, CPT; „Best Unilateral Exercises”, akt. 04.06.2025, oraz „Deadlift Accessory Exercises”, akt. 03.07.2024, ekspert J. Dickson — jedna organizacja) + Generation Iron (T. Ramos, B.S. Kinesiology, ACSM-CPT, ISSA CSCS; akt. 24.01.2025; „Fact checked by Don Saladino” bez kwalifikacji). GI per strona: autor z kwalifikacjami na stronie + data → warunek uzup. 3 — do potwierdzenia (K3). Błąd „bez rozpędu” — tylko GI → poza kartą. |

Bilans kontynuacji: **karty z błędem bez warunku 5** (Close-Grip Push-Up, Hanging Leg Raise, Hanging Knee Raise, Pec Deck, Lateral Lunge); **warunkowe 4** (Push-Up Wide, Pike Push Up — ocena ruchu przez recenzenta; Hip Adduction — uproszczenie; Ring Dips — szczebel CrossFit Journal/Hass); **karta bez błędu 1** (Meadows Row, warunek K3); **otwarte warunkowo 3** (Hip Abduction, Triceps Dip, Sissy Squat — wszystkie zależą od K1).
Drogi: 1 — 10 ćwiczeń; 2 — 0; 3 (wariant sprzętu) — 1 (Hip Adduction); 4 (zdanie warunkowe per strona) — 4 (FV ×3 w K1, GI w K3). Błędy wnioskowane: 6 (`plank.mis.sag`, `pike.mis.hips` [+NASM], `pdeck.mis.sway` [+Healthline], `hadd.mis.snap`, `rdip.mis.lockout` [+Hass], warunkowo `habd.mis.lean`).

### (2) Blok do wdrożenia (kontynuacja)

```json
{
  "_tryb": "dopisz",
  "exercises": {
    "Close-Grip Push-Up": {
      "setup": [{"c": "cpush.setup2", "s": [
        ["barbend-chest-noweights", "Close-grip push-up (hands underneath the shoulders; solid front plank)"],
        ["healthline-tri-pushup", "Triceps pushup (hands directly below shoulders, neck and spine neutral)"]
      ]}],
      "move": [{"c": "cpush.move", "s": [
        ["healthline-tri-pushup", "Triceps pushup (elbows pinned to your sides; lower until chest reaches the floor; return)"],
        ["barbend-chest-noweights", "Close-grip push-up (elbows tucked alongside your ribcage)"]
      ]}],
      "tips": [],
      "mistakes": [
        {"c": "push.mis.flare", "s": [
          ["barbend-chest-noweights", "Close-grip push-up (without flaring them either in or out)"],
          ["healthline-tri-pushup", "Triceps pushup (elbows pinned to your sides) — błąd = zaprzeczenie standardu"]
        ]}
      ]
    },
    "Push-Up Wide": {
      "_warunek": "recenzent: czy opis podstawowej pompki ISSA potwierdza ruch wariantu szerokiego",
      "setup": [{"c": "wpush.setup2", "s": [
        ["fv-wide-push-ups", "Correct form, kroki 1–2 (about 1 ½ shoulder-widths apart; legs and body form a straight line)"],
        ["issa-max-pushups", "Wide (moving your hands further apart); podstawowa pompka (lower your body as one unit)"]
      ]}],
      "move": [{"c": "wpush.move2", "s": [
        ["fv-wide-push-ups", "Correct form, kroki 3–4 (bend your elbows and lower your chest; push back up until arms are straight)"],
        ["issa-max-pushups", "podstawowa pompka (lower your body to the ground as one unit until your elbows reach 90 degrees)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "plank.mis.sag", "s": [["wniosek", "wpush.setup2"]]}]
    },
    "Pike Push Up": {
      "_warunek": "recenzent: Catalyst potwierdza ruch głowy w dół tylko pośrednio",
      "setup": [{"c": "pike.setup2", "s": [
        ["nasm-pike-push-up", "Step 1 (z zapisu W1)"],
        ["issa-max-pushups", "Pike (lift your hips up; upside-down V)"],
        ["catalyst-pushup-221", "Pike push-up (walk the feet up closer to the hands, bending only at the hips)"]
      ]}],
      "move": [{"c": "pike.move", "s": [
        ["nasm-pike-push-up", "Step 3 (z zapisu W1)"],
        ["catalyst-pushup-221", "Pike push-up (elevating the hands on blocks to give the head somewhere to go)"],
        ["issa-shoulder-noequip", "Pike push-up (press up and slightly back)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "pike.mis.hips", "s": [["nasm-pike-push-up", "Common Mistakes (allowing hips to sag; z zapisu W1)"], ["wniosek", "pike.setup2"]]}]
    },
    "Hanging Leg Raise": {
      "setup": [{"c": "hang.setup", "s": [
        ["catalyst-45", "opis, zdanie 2 (Hang from a pull-up bar or stall bars; z zapisu W1)"],
        ["barbend-hlr", "Step-by-step (hands about shoulder-width apart; completely dead hang)"]
      ]}],
      "move": [{"c": "hang.legs.move", "s": [
        ["catalyst-45", "opis (unieś proste nogi; powrót pod kontrolą; z zapisu W1)"],
        ["barbend-hlr", "Step-by-step (raise legs to ~90° hip flexion; slowly lower your legs back)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "hang.noSwing", "s": [
        ["catalyst-45", "Without swinging (z zapisu W1)"],
        ["barbend-hlr", "Common Mistakes — Momentum"]
      ]}]
    },
    "Hanging Knee Raise": {
      "setup": [{"c": "hang.setup", "s": [
        ["barbend-hkr", "Step-by-step 1–2 (hands about shoulder-width apart or slightly wider; dead-hang)"],
        ["healthline-hkr", "How-to (Grip your pullup bar… and start to hang)"]
      ]}],
      "move": [{"c": "hang.knees.move", "s": [
        ["nasm-best-abs", "Hanging Knee Raise (z zapisu W1)"],
        ["barbend-hkr", "Step-by-step 3–4 (pull the knees towards your chest; return under control)"],
        ["healthline-hkr", "How-to (raise your knees upward toward your chest; slowly lower your legs)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "hang.noSwing", "s": [
        ["nasm-best-abs", "Coaching Tip (Avoid using momentum to swing the legs upward)"],
        ["healthline-hkr", "Common mistakes (swinging their legs and using momentum)"],
        ["barbend-hkr", "Common Mistakes — swaying"]
      ]}]
    },
    "Pec Deck": {
      "setup": [{"c": "pdeck.back2", "s": [
        ["barbend-chest-flye-machine", "Steps (tall, resting against the back pad)"],
        ["healthline-pec-deck", "How-to (press your back firmly against the back of the platform)"]
      ]}],
      "move": [{"c": "pdeck.move", "s": [
        ["healthline-pec-deck", "How-to (bring the handles in front of your chest; slowly release back)"],
        ["barbend-chest-flye-machine", "Steps (sweeping hug-like motion; controlled eccentric)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "pdeck.mis.sway", "s": [
        ["healthline-pec-deck", "Tips (not so difficult that your body sways or rocks)"],
        ["wniosek", "pdeck.back2"]
      ]}]
    },
    "Hip Adduction": {
      "_warunek": "uproszczenie: wariant sprzętu (guma siedząc zamiast maszyny) — potwierdza recenzent niezależny",
      "setup": [{"c": "hadd.mseat", "s": [
        ["fv-hip-adductor", "13. Hip Adduction Machine (back against the pad, spine neutral)"],
        ["healthline-adductor", "Adductor hip machine — wersja z gumami (sit on a chair or bench; straight back) — uproszczenie: wariant sprzętu"]
      ]}],
      "move": [{"c": "hadd.mmove", "s": [
        ["fv-hip-adductor", "13. (pull the legs together as you squeeze the pads inward; return in a controlled motion)"],
        ["healthline-adductor", "wersja z gumami (squeeze your thighs together; slowly reverse) — uproszczenie: wariant sprzętu"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "hadd.mis.snap", "s": [["wniosek", "hadd.mmove"]]}]
    },
    "Ring Dips": {
      "_warunek": "szczebel CrossFit Journal (T. Hass) — jak precedens crossfit-hspu-master",
      "setup": [{"c": "rdip.setup", "s": [
        ["barbend-dips", "akapit Ring Dips (steady at lockout before dipping down; z zapisu W2)"],
        ["crossfit-hass-rings", "s. 2–3 (ring dip zaczyna się z podporu; podpór na zablokowanych rękach)"]
      ]}],
      "move": [{"c": "rdip.move", "s": [
        ["crossfit-hass-rings", "s. 3–4, Ring dip (depth; lock out at the top of the rep)"],
        ["barbend-dips", "How to Do the Dip + akapit Ring Dips (z zapisu W2)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "rdip.mis.lockout", "s": [
        ["crossfit-hass-rings", "s. 4 (make sure you lock out at the top of the rep)"],
        ["wniosek", "rdip.move"]
      ]}]
    },
    "Lateral Lunge": {
      "setup": [{"c": "lunge.stand", "s": [
        ["ace-50", "Step 1 (z zapisu W1)"],
        ["nasm-squat-alternatives", "Lateral Lunge (feet hip width apart)"],
        ["healthline-lunges", "Lateral lunge, krok 1 (feet hip-width apart)"]
      ]}],
      "move": [{"c": "latl.move", "s": [
        ["ace-50", "Step 2–3 (z zapisu W1)"],
        ["nasm-squat-alternatives", "Lateral Lunge (step laterally, sitting the hips back; trailing leg straight; push through the mid-foot to return)"],
        ["healthline-lunges", "Lateral lunge, kroki 2–5 (bend the stepping knee, other knee straight; push off to return)"]
      ]}],
      "tips": [],
      "mistakes": [{"c": "sq.mis.heels", "s": [
        ["ace-50", "z zapisu W1"],
        ["healthline-lunges", "Lateral lunge, krok 2 (keeping your other foot flat) — błąd = zaprzeczenie standardu"]
      ]}]
    },
    "Meadows Row": {
      "_warunek": "Generation Iron per strona (K3)",
      "setup": [{"c": "meadows.setup2", "s": [
        ["barbend-unilateral", "Meadows Row (staggered stance; hinge; overhand grip on the end of the barbell; forearm on forward leg)"],
        ["generationiron-meadows-row", "Steps 1–3 (staggered stance; hinge; overhand grip on the end; forearm on forward leg)"]
      ]}],
      "move": [{"c": "meadows.pull", "s": [
        ["barbend-unilateral", "Meadows Row (drive your elbow behind your body; pull toward your back hip; slowly lower)"],
        ["generationiron-meadows-row", "Steps 5–7 (pull to your back hip; slowly lower until your elbow is straight)"]
      ]}],
      "tips": [],
      "mistakes": []
    }
  },
  "warunkowe_K1": {
    "Hip Abduction": {"setup": "habd.setup [barbend-glute-kickbacks + fv-hip-abduction]", "move": "habd.move [barbend-glute-kickbacks + clevelandclinic-glutes]", "mistakes": "habd.mis.lean [fv-hip-abduction + wniosek habd.setup]"},
    "Triceps Dip": {"setup": "dip.setup [barbend-dips + catalyst-547]", "move": "dip.move [barbend-dips + catalyst-547]", "tips": "dip.upright [barbend-dips + fv-weighted-dips]", "mistakes": "dip.mis.overLean [barbend-dips + fv-weighted-dips]"},
    "Sissy Squat": {"setup": "sissy.setup [barbend-sissy-squat + fv-sissy]", "move": "sissy.move (W1)", "tips": "sissy.torso (W1)"}
  },
  "sources": {
    "issa-max-pushups": {"org": "ISSA", "title": "How to Maximize Your Push-ups (By ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blogs/training-tips/how-to-maximize-your-pushups", "level": 4},
    "catalyst-pushup-221": {"org": "Catalyst Athletics", "title": "The Push-up (G. Everett, Performance Menu nr 26, 03.2007)", "url": "https://pm.catalystathletics.com/article/221/The-Push-up/", "level": 4},
    "barbend-chest-noweights": {"org": "BarBend", "title": "6 Chest Exercises Without Weights… (M. Dewar, CSCS; akt. S. McLean, 02.07.2024)", "url": "https://barbend.com/best-chest-exercises-without-weights/", "level": 4},
    "healthline-tri-pushup": {"org": "Healthline", "title": "Pushups for Triceps (N. Davis; rec. D. Bubnis, M.S., NASM-CPT; 19.12.2018)", "url": "https://www.healthline.com/health/fitness-exercise/push-ups-for-triceps", "level": 4},
    "barbend-hlr": {"org": "BarBend", "title": "How to Do Hanging Leg Raises… (E. Bugera, CSCS; akt. 21.06.2024)", "url": "https://barbend.com/hanging-leg-raises/", "level": 4},
    "barbend-hkr": {"org": "BarBend", "title": "Lift Up Your Ab Workouts with the Hanging Knee Raise (E. Bugera, CSCS; akt. 27.11.2024)", "url": "https://barbend.com/hanging-knee-raises/", "level": 4},
    "healthline-hkr": {"org": "Healthline", "title": "Hanging Knee Raises (T. Read, BSc, CPT; rec. D. Bubnis; 04.06.2021)", "url": "https://www.healthline.com/health/fitness/hanging-knee-raises", "level": 4},
    "barbend-chest-flye-machine": {"org": "BarBend", "title": "How to Use a Chest Flye Machine… (E. Bugera, CSCS; akt. 09.04.2024)", "url": "https://barbend.com/chest-flye-machine/", "level": 4},
    "healthline-pec-deck": {"org": "Healthline", "title": "How and Why to Use a Pec Deck Machine (V. Higuera; rec. D. Bubnis; 31.05.2019)", "url": "https://www.healthline.com/health/pec-deck", "level": 4},
    "fv-hip-adductor": {"org": "Fitness Volt", "title": "13 Best Hip Adductor Exercises (V. Saini, ACE-CPT; Recent Updates 10.06.2024) — sekcja 13", "url": "https://fitnessvolt.com/hip-adductor-exercises/", "level": 4},
    "healthline-adductor": {"org": "Healthline", "title": "Adductor Exercises (D. Preiato, RD, CSCS; rec. G. Minnis, DPT; akt. 13.10.2026)", "url": "https://www.healthline.com/health/adductor-exercises", "level": 4},
    "crossfit-hass-rings": {"org": "CrossFit Journal", "title": "Applications of the Support on Rings (T. Hass, nr 57, 05.2007)", "url": "https://library.crossfit.com/free/pdf/57_07_Support_on_Rings.pdf", "level": 4},
    "nasm-squat-alternatives": {"org": "NASM", "title": "Squat Alternatives (H. Cherry, CPT; akt. 01.10.2025) — Lateral Lunge", "url": "https://www.nasm.org/resource-center/blog/squat-alternatives", "level": 4},
    "healthline-lunges": {"org": "Healthline", "title": "Lunges: Muscles Worked, How-To… (T. Edwards, PT, MPT; rec. D. Bubnis; 14.04.2023)", "url": "https://www.healthline.com/health/fitness-exercise/lunges-muscles-worked", "level": 4},
    "barbend-unilateral": {"org": "BarBend", "title": "The Best Unilateral Exercises… (S. McLean, CPT; akt. 04.06.2025) — Meadows Row", "url": "https://barbend.com/best-unilateral-exercises/", "level": 4},
    "generationiron-meadows-row": {"org": "Generation Iron", "title": "Meadows Row Exercise Guide (T. Ramos, ACSM-CPT, ISSA CSCS; akt. 24.01.2025)", "url": "https://generationiron.com/meadows-row-exercise-guide/", "level": "4 warunkowo (K3)"}
  }
}
```

Uwagi do bloku: `catalyst-45`, `nasm-best-abs`, `nasm-pike-push-up`, `ace-50`, `barbend-dips`, `fv-wide-push-ups`, `issa-shoulder-noequip` — wpisy z W1/W2/poprzedniej sekcji. Źródła z `warunkowe_K1` (`barbend-glute-kickbacks`, `clevelandclinic-glutes`, `fv-hip-abduction`, `catalyst-547`, `fv-weighted-dips`, `barbend-sissy-squat`, `fv-sissy`) — w tabeli (4) niżej; do `sources` dopiero po K1. Id `hang.setup`, `hang.legs.move`, `hang.knees.move`, `pdeck.move`, `cpush.move`, `pike.move`, `pike.mis.hips`, `latl.move`, `meadows.pull`, `sissy.*`, `dip.*` — brzmienia z W1/W2 (sprawdzić, czy są już w `lib/cues/text/pl.json`; w tej sesji znalazłem tam tylko `hang.noSwing`, `push.*`, `plank.*`, `lunge.*`).

### (3) Nowe zdania PL + EN

| id | PL | EN | uwaga |
|---|---|---|---|
| `cpush.setup2` | Dłonie pod barkami, ciało proste od głowy do pięt. | Hands under your shoulders, body straight from head to heels. | `cpush.setup` (W1) bez „albo trochę węziej” (jedno źródło) |
| `wpush.setup2` | Dłonie wyraźnie szerzej niż barki, ciało proste od głowy do pięt. | Hands clearly wider than your shoulders, body straight from head to heels. | `wpush.setup` (W1) bez ustawienia palców (tylko FV) |
| `wpush.move2` | Zginając łokcie, opuść klatkę w stronę podłogi; wypchnij się z powrotem do wyprostu rąk. | Bend your elbows to lower your chest toward the floor; push back up until your arms are straight. | bez „łokcie na boki” (tylko FV) |
| `pike.setup2` | Biodra wysoko, ciało w kształcie odwróconego V. | Hips high, so your body makes an upside-down V. | `pike.setup` (W1) bez szerokości dłoni (tylko NASM) |
| `pdeck.back2` | Usiądź prosto, plecy oparte o oparcie. | Sit tall with your back against the pad. | `pdeck.back` (W1) bez stóp (źródła różne: podłoga / podnóżki) |
| `pdeck.mis.sway` | Bujanie tułowiem, żeby dokończyć powtórzenie. | Rocking your body to finish the rep. | |
| `hadd.mseat` | Usiądź prosto, plecy przy oparciu; nogi rozsunięte, poduszki po wewnętrznej stronie ud. | Sit tall with your back against the pad, legs apart, pads on the inside of your thighs. | maszyna siedząc (inaczej niż `hadd.setup` — wyciąg/guma stojąc) |
| `hadd.mmove` | Złącz nogi, ściskając poduszki udami, potem powoli je rozsuń. | Squeeze the pads together with your thighs, then let your legs open slowly. | |
| `hadd.mis.snap` | Puszczanie nóg — poduszki szybko odskakują na boki. | Letting go — the pads spring back out fast. | wniosek z „powoli” |
| `rdip.setup` | Unieś się w podpór na kółkach na prostych rękach i złap równowagę, zanim zaczniesz. | Push up into a support on the rings with straight arms and get steady before you start. | zastępuje kandydata `dip.rings` z W2 (bez wysokości kółek — tylko BarBend) |
| `rdip.move` | Zegnij łokcie i opuść się z kontrolą, potem wypchnij się z powrotem do prostych rąk. | Bend your elbows and lower yourself under control, then press back up to straight arms. | |
| `rdip.mis.lockout` | Kończenie powtórzenia bez pełnego wyprostu rąk na górze. | Finishing the rep without fully straightening your arms at the top. | |
| `meadows.setup2` | Stań bokiem do gryfu w wykroku, pochyl tułów w biodrach i chwyć końcówkę gryfu nachwytem; drugie przedramię oprzyj o udo z przodu. | Stand side-on to the bar in a staggered stance, hinge at the hips and grab the end of the bar overhand; rest your other forearm on your front thigh. | łączy `meadows.setup` i `meadows.grip` z W1 bez „noga bliżej gryfu z przodu” (0 źródeł) i bez „w rogu” |
| `habd.setup` (K1) | Usiądź plecami przy oparciu, nogi złączone, poduszki przy zewnętrznej stronie kolan. | Sit with your back against the pad, legs together, pads on the outside of your knees. | tylko po K1 |
| `habd.move` | Rozsuń nogi na boki, napierając na poduszki, potem wróć do złączenia. | Push your legs out against the pads, then bring them back together. | 2 źródła; karta dopiero z `habd.setup` |
| `habd.mis.lean` (K1) | Pochylanie tułowia w przód z bioder. | Leaning forward from your hips. | tylko po K1 |
| `dip.upright` (K1) | Trzymaj tułów prawie pionowo. | Keep your torso nearly upright. | kandydat z W2 |
| `sissy.setup` (K1) | Stań prosto i przytrzymaj się jedną albo obiema rękami czegoś stabilnego. | Stand tall and hold on to something sturdy with one or both hands. | bez szerokości stóp (rozbieżna) |

Istniejące użyte: `push.mis.flare`, `plank.mis.sag`, `lunge.stand`, `sq.mis.heels`, `hang.noSwing`.

### (4) Źródła (odczyt 02.11.2026)

| id | adres | szczebel (uzasadnienie) | miejsce / cytat |
|---|---|---|---|
| issa-max-pushups | https://www.issaonline.com/blogs/training-tips/how-to-maximize-your-pushups | 4 — ISSA, firmowane „ISSA”, 05.02.2024 | warianty dłoni; pike: „Instead of keeping your body in a straight line, lift your hips up.” |
| catalyst-pushup-221 | https://pm.catalystathletics.com/article/221/The-Push-up/ | 4 — Catalyst Athletics, autor G. Everett, 03.2007 | Pike push-up: „From a standard push-up position, walk the feet up closer to the hands, bending only at the hips,” |
| barbend-chest-noweights | https://barbend.com/best-chest-exercises-without-weights/ | 4 — artykuł techniki, autor CSCS, data | Close-grip push-up: „Keep your elbows tucked alongside your ribcage without flaring them either in or out.” |
| healthline-tri-pushup | https://www.healthline.com/health/fitness-exercise/push-ups-for-triceps | 4 — autor, nazwany recenzent NASM-CPT, data (uzup. 3) | Triceps pushup: „On the descent, keep your elbows pinned to your sides and your upper arms straight back.” |
| fv-wide-push-ups | https://fitnessvolt.com/?p=236595 | 4 — P. Dale (PT), „Reviewed By Dr. Malik”, data widoczna 20.01.2024 | krok 1: „Your hands should be about 1 ½ shoulder-widths apart.” |
| fv-close-grip-push-up | https://fitnessvolt.com/close-grip-push-up-triceps-chest | 5 — „By Dr. Malik” (MD w biogramie), data tylko w metadanych | nie użyte |
| barbend-hlr | https://barbend.com/hanging-leg-raises/ | 4 — E. Bugera, CSCS, akt. 21.06.2024 | „Slowly lower your legs back to the starting position, avoiding momentum or undue swaying.” |
| barbend-hkr | https://barbend.com/hanging-knee-raises/ | 4 — E. Bugera, CSCS, akt. 27.11.2024 | „Allow your legs to return to the starting position under control.” |
| healthline-hkr | https://www.healthline.com/health/fitness/hanging-knee-raises | 4 — T. Read, BSc, CPT; rec. D. Bubnis; 04.06.2021 | „Slowly raise your knees upward toward your chest while maintaining braced lower abs and a hollowed position.” |
| barbend-chest-flye-machine | https://barbend.com/chest-flye-machine/ | 4 — E. Bugera, CSCS, akt. 09.04.2024 | ustawienie: „…the handles rest at approximately armpit height.” |
| healthline-pec-deck | https://www.healthline.com/health/pec-deck | 4 — autor, rec. D. Bubnis, 31.05.2019 | „Press your back firmly against the back of the platform with your feet flat on the floor.” |
| barbend-glute-kickbacks | https://barbend.com/glute-kickbacks/ | 4 — E. Bugera, CSCS, akt. 24.04.2024 | Machine Hip Abduction: „Sit down in the machine with your outer legs snug against the pads and your back flat against the backrest.” |
| clevelandclinic-glutes | https://health.clevelandclinic.org/glute-exercises | 4 — szpital, treść firmowana, 17.03.2025 (uzup. 2) | seated abduction machine: „…as you push your legs apart.” |
| fv-hip-abduction | https://fitnessvolt.com/hip-abduction/ | 5 (K1) — „By Patrick Dale, PT, ex-Marine”, data tylko w metadanych, bez recenzenta | „Do not lean forward from your hips.” |
| fv-hip-adductor | https://fitnessvolt.com/hip-adductor-exercises/ | 4 — V. Saini (ACE-CPT), data widoczna w „Recent Updates” (10.06.2024) | sekcja 13: „Setup in an upright position with your back against the pad and your spine neutral.” |
| healthline-adductor | https://www.healthline.com/health/adductor-exercises | 4 — D. Preiato, RD, CSCS; rec. G. Minnis, DPT; akt. 13.10.2026 | „This exercise uses resistance bands as an alternative to the machine for hip adductor work.” |
| catalyst-547 | https://www.catalystathletics.com/exercise/547/Dip/ | 4 — biblioteka Catalyst | „Press back up into full elbow extension.” |
| fv-weighted-dips | https://fitnessvolt.com/weighted-parallel-bar-dips/ | 5 (K1) — V. Saini (ACE-CPT), data tylko w metadanych | „…you must maintain an upright torso to target the triceps.” |
| fv-triceps-dip | https://fitnessvolt.com/triceps-dip/ | 5 — „By Dr. Malik”, data tylko w metadanych; zaleca lekkie pochylenie w przód | nie użyte |
| nfpt-dips | https://nfpt.com/how-to-do-dips/ | 5 — M. Rogers, 09.08.2025, bez biogramu na stronie, bez oznaczenia „Guest” | nie użyte |
| issa-triceps-dips | https://www.issaonline.com/blog/post/mastering-triceps-dips-proper-form-variations-and-more | 4 — ale opisuje dip na ławce (bench dip), poręcze tylko jako wariant | nie użyte dla Triceps Dip na poręczach |
| crossfit-hass-rings | https://library.crossfit.com/free/pdf/57_07_Support_on_Rings.pdf | 4 — CrossFit Journal (wydawca jak `crossfit-hspu-master`), autor z biogramem (założyciel firmy z kółkami, s. 4) | s. 3, Ring dip: „The CrossFit standard is ‘hands to your armpits.’” |
| crossfit-support-rings | https://www.crossfit.com/essentials/support-strength-on-the-rings | 4 — ten sam autor (T. Hass, 04.2007) → nie jest drugim niezależnym | podpór: ręce proste, kółka obrócone na zewnątrz — nie użyte jako para |
| nasm-squat-alternatives | https://www.nasm.org/resource-center/blog/squat-alternatives | 4 — NASM, autorka CPT, data | „Take a big enough step so that the trailing leg is straight…” |
| healthline-lunges | https://www.healthline.com/health/fitness-exercise/lunges-muscles-worked | 4 — T. Edwards, PT, MPT; rec. D. Bubnis; 14.04.2023 | „Step out wide to the side while keeping your other foot flat.” |
| barbend-sissy-squat | https://barbend.com/sissy-squat/ | 4 — J. Dickson, NASM-CPT, USAW-L2, akt. 19.11.2024 | „Start by standing upright in a clear area with your feet under your hips.” |
| fv-sissy | https://fitnessvolt.com/sissy-squat-guide/ | 5 (K1) — „By Steve Theunissen, PT”, data tylko w metadanych | „Stand in front of something stable (such as a power rack) and hold onto it with one (or both) hand for balance.” |
| barbend-unilateral | https://barbend.com/best-unilateral-exercises/ | 4 — S. McLean, CPT, akt. 04.06.2025 | „Pull the barbell handle toward your back hip until your elbow is level with your torso.” |
| barbend-deadlift-acc | https://barbend.com/best-deadlift-accessory-exercises/ | 4 — S. McLean; ekspert J. Dickson; akt. 03.07.2024 — ta sama organizacja co wyżej (nie druga para) | „Stand side on to the landmine with a staggered stance.” |
| generationiron-meadows-row | https://generationiron.com/meadows-row-exercise-guide/ | 4 warunkowo (K3) — autor z kwalifikacjami na stronie, data; „Fact checked by” bez kwalifikacji; informacja o linkach afiliacyjnych | „Pull the barbell to your back hip until your elbow is level with your torso.” |
| ace-182 | https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/ | 4 | nie użyte tutaj (patrz `role-miesni.md`, Kontynuacja) |
| (nieudane) | barbend.com/hip-abduction-machine/, barbend.com/meadows-row/ | — | 404 |

### (5) Pytania dla koordynatora

- **K1 (Fitness Volt — data tylko w metadanych)**: strona z autorem z kwalifikacjami w podpisie (P. Dale „PT”, V. Saini ACE-CPT, S. Theunissen „PT”), ale bez daty w treści strony (data tylko w JSON-LD). Liczyć jako 4 czy 5? Przyjąłem 5 (precedens W2 `dip.md:88`). Odpowiedź „4” daje: Hip Abduction — karta z błędem; Sissy Squat — karta częściowa; Triceps Dip — karta z `dip.upright` i błędem `dip.mis.overLean` (setup/ruch z ogólnych źródeł dipów, nie Chest Dip).
- **K2 (Triceps Dip)**: czy `dip.setup`/`dip.move` mogą korzystać z BarBend dips i Catalyst 547 — to opisy dipu na poręczach w ogóle (Catalyst nie zaleca pochylenia, tylko opisuje akcent), nie źródła Chest Dip? ISSA chest dips nie jest użyte.
- **K3 (Generation Iron, Meadows Row)**: autor T. Ramos z kwalifikacjami w podpisie i data na stronie; recenzent „Fact checked by” bez kwalifikacji; strona z informacją o linkach afiliacyjnych. Spełnia warunek uzup. 3 („osoba z listy ekspertów z kwalifikacjami”)? Nie sprawdzałem, czy Ramos jest na liście ekspertów serwisu.
- **K4 (do recenzenta niezależnego)**: (a) Healthline „Triceps pushup” = Close-Grip Push-Up; (b) Push-Up Wide — ruch z ogólnego opisu pompki ISSA; (c) Pike — Catalyst pośrednio o ruchu głowy; (d) Hip Adduction — guma siedząc jako wariant sprzętu maszyny; (e) Lateral Lunge — `sq.mis.heels` a zdanie Healthline o stopie nogi prostej; (f) Hip Abduction — artykuły-relacje BarBend z pochyleniem w przód a błąd `habd.mis.lean`.
- **K5 (zdrowie i bezpieczeństwo — bez własnych ostrzeżeń w aplikacji; decyzja produktowa)**: Ring Dips — Hass (s. 2) uważa, że przed treningiem dipów na kółkach warto utrzymać pełny podpór przez minutę, a przy kłopotach z barkami dochodzić do pełnej głębokości stopniowo (s. 3); NFPT (5) radzi zaczynać od wersji z pomocą. Zwisy — źródła nie podają ostrzeżeń zdrowotnych; BarBend HKR mówi o dociążaniu zbyt wcześnie (przenosi pracę na zginacze bioder — to nie zdrowie). Czy karta Ring Dips ma mieć zdanie o kolejności (podpór → dipy) — dwa źródła (BarBend „steady at lockout”, Hass) mówią o stabilizacji w podporze, ale tylko Hass o progresji. Bez decyzji nic nie wpisuję.
- **K6 (Pec Deck)**: wysokość siedziska — trzy różne punkty odniesienia (pachy / łokcie na wysokości klatki / barki); proponuję poza kartą do czasu trzeciego źródła albo sformułowania „uchwyty mniej więcej na wysokości klatki” jako części wspólnej (do oceny recenzenta).

### Stan agenta (kontynuacja)

- Zrobione: 13 ćwiczeń z listy — 5 kart z błędem, 4 warunkowe, 1 karta bez błędu (warunek K3), 3 otwarte warunkowo (K1); role Medicine Ball Slam — `role-miesni.md`, sekcja „Kontynuacja”.
- Zostało: odpowiedzi K1–K6; recenzja niezależna (L-047) przed statusem gotowym.
- Pułapki: Fitness Volt — przy każdej stronie pytać narzędzie osobno o datę w treści (często tylko JSON-LD); PDF z CrossFit Journal da się czytać narzędziem Read (strony jako obrazy); NFPT — biogram nie zawsze na stronie.
