# Role mięśni — fala W1, grupa g1: core na podłodze (core_floor)

Data: 02.11.2026 · autor: badacz-merytoryczny · status: zebrane dane, bez zmian w `data/zrodla/role-miesni.json` (polecenie właściciela 02.11.2026: tylko zbieranie danych).

Ten plik opisuje raz **wspólne funkcje i źródła** grupy g1; `core_standing.md`, `core_hang.md` i `back_extension.md` się do nich odwołują.

## Metoda

- Role par sprawdzone u źródła: `lib/catalog.generated.ts` (`MUSCLE_LOAD`, `pattern`) i `docs/research/equipment/catalog.json` (`muscles`, `secondaryMuscles`, `note`) z uwzględnieniem `muscleLoadOf` (`lib/seed.ts:153`: region z partii głównej podniesiony do 1, z pomocniczej obcięty do 0,5). Nie uruchamiałem `node` (brak powłoki w tej sesji) — role wyliczone ręcznie z tych plików; przed wklejeniem warto potwierdzić generatorem (`scripts/pokrycie-katalogu.mjs`).
- Funkcja jest „gotowa” tylko przy ≥ 2 przeczytanych, niezależnych źródłach, które zawierają twierdzenie wprost. Gdy źródła opisują tylko ruch koncentryczny (np. „odchyla miednicę do tyłu”), a tekst miałby mówić o utrzymaniu pozycji („nie pozwala wygiąć się lędźwiom”) — to **uproszczenie** (zostaje w danych bez tekstu).
- Strony i dokumentacja innych aplikacji treningowych nie były źródłem (uzupełnienie briefu koordynatora).

## Wspólne funkcje (nowe i zmienione)

| id | zmiana | PL main / aux | EN main / aux | źródła | status |
|---|---|---|---|---|---|
| `abs.antilordosis` | **podniesienie** z `jedno_zrodlo` | bez zmian („Nie pozwala wygiąć się lędźwiom” / „Pomaga utrzymać lędźwie bez wygięcia”) | bez zmian | S17, S32-g1 (+ S33-g1 kierunkowo, S26 aktywność) | `dwa_zrodla` |
| `obliques.trunk_flex` | nowa | „Zgina tułów” / „Pomaga zginać tułów” | „Curls your trunk” / „Helps curl your trunk” | S18, S29-g1 (+ S30-g1, S31-g1; S26 aktywność w brzuszkach) | `dwa_zrodla` |
| `obliques.rotate` | nowa (węższa od `rotate_bend`) | „Skręca tułów” / „Pomaga skręcać tułów” | „Twists your trunk” / „Helps twist your trunk” | S3, S16, S18, S29-g1, S31-g1 | `ustalone` (≥ 3 niezależne) |
| `obliques.side_bend` | nowa (węższa od `rotate_bend`) | „Pochyla tułów na bok” / „Pomaga pochylać tułów na bok” | „Bends your trunk to the side” / „Helps bend your trunk to the side” | S3, S18, S29-g1, S31-g1 | `ustalone` (≥ 3 niezależne) |
| `obliques.antilordosis` | nowa | „Nie pozwala wygiąć się lędźwiom” / „Pomaga utrzymać lędźwie bez wygięcia” | jak `abs.antilordosis` | S30-g1, S31-g1 (oba: odchylenie miednicy do tyłu — ruch, nie utrzymanie) | `uproszczenie` — bez tekstu |
| `obliques.antirotation` | nowa | „Nie pozwala skręcić się tułowiowi” / „Pomaga utrzymać tułów bez skrętu” | „Keeps your trunk from twisting” / „Helps keep your trunk from twisting” | S34-g1 (szczebel 5), S16/S18 tylko kierunkowo | `jedno_zrodlo` — bez tekstu |

Uwagi:
- `obliques.rotate` i `obliques.side_bend` rozdzielają istniejące `obliques.rotate_bend` („Skręca tułów i pochyla go na bok”), żeby skręty nie dostawały zdania o skłonie bocznym i odwrotnie. Jeśli koordynator woli nie dodawać funkcji, te same listy `nameRules` mogą wskazywać `obliques.rotate_bend` (źródła te same; zdanie mniej precyzyjne). Rekomendacja: rozdzielić.
- `abs.antilordosis`: S17 mówi wprost „controls tilt of the pelvis (antilordosis)”, S32-g1 (przegląd systematyczny) — „controlling anterior pelvic tilt” (w części „Context”, tło przeglądu, nie jego wynik — liczę jako źródło zawierające twierdzenie wprost, ale nie jako „ustalone” z samego przeglądu). Dwa różne zespoły → `dwa_zrodla`. Skutek: wszystkie 9 par reguły `core_anti_ext` + `abs` + `main` (m.in. Dead Bug, Hollow Hold, Dragon Flag) zaczynają pokazywać zdanie.

## Pary core_floor

| ćwiczenie [pattern] | mięsień | rola | propozycja funkcji | przypisanie | stan |
|---|---|---|---|---|---|
| Dead Bug [core_anti_ext] | abs | main | `abs.antilordosis` | istniejąca reguła (podniesienie statusu funkcji) | gotowe |
| Dead Bug | obliques | aux | `obliques.antilordosis` | nowa reguła core_anti_ext+obliques+aux | otwarte (uproszczenie) |
| Hollow Hold [core_anti_ext] | abs | main | `abs.antilordosis` | istniejąca reguła | gotowe |
| Hollow Hold | obliques | aux | `obliques.antilordosis` | jw. | otwarte (uproszczenie) |
| Dragon Flag [core_anti_ext] | abs | main | `abs.antilordosis` | istniejąca reguła | gotowe |
| Dragon Flag | obliques | aux | `obliques.antilordosis` | jw. | otwarte (uproszczenie) |
| Bird Dog [core_anti_rot] | obliques | main | `obliques.antirotation` | nowa reguła core_anti_rot+obliques+main | otwarte (jedno źródło) |
| Bird Dog | abs | aux | — | — | otwarte (brak źródła roli) |
| Cable Crunch [core_flexion] | obliques | aux | `obliques.trunk_flex` | nowa reguła core_flexion+obliques+aux | gotowe |
| Reverse Crunch [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| V-Up [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| Cable Seated Crunch [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| Standing Rope Crunch [core_flexion] | obliques | aux | `obliques.trunk_flex` | jw. | gotowe |
| Cross-Body Crunch [core_flexion] | abs | aux | `abs.trunk_flex` | nowa reguła core_flexion+abs+aux | gotowe |
| Decline Oblique Crunch [core_flexion] | abs | aux | `abs.trunk_flex` | jw. | gotowe |
| Otis-Up [core_flexion] | front_delt | aux | `front_delt.shoulder_flex` | nameRules (wyciśnięcie talerza nad głowę na górze ruchu — `note` katalogu) | gotowe |
| Press Sit-Up [core_flexion] | front_delt | aux | `front_delt.shoulder_flex` | nameRules (sztanga wypychana w górę, gdy tułów się unosi — `note`) | gotowe |
| Press Sit-Up | triceps | aux | `triceps.elbow_ext` | nameRules | gotowe |
| Alternate Heel Touchers [core_other] | obliques | main | `obliques.side_bend` | nameRules („side-to-side reach to the heels (lateral flexion)”) | gotowe |
| Alternate Heel Touchers | abs | aux | — | — | otwarte (brak źródła roli) |
| Oblique Crunches - On The Floor [core_other] | obliques | main | `obliques.side_bend` | nameRules („Lying on the side … lateral crunch”) | gotowe |
| Side Jackknife [core_other] | obliques | main | `obliques.side_bend` | nameRules („lateral V-up”) | gotowe |
| Side Jackknife | abs | aux | — | — | otwarte (brak źródła roli) |
| Superman [other] | lower_back | main | `lower_back.spine_ext` | nameRules (unoszenie klatki i nóg w leżeniu przodem) | gotowe |
| Superman | glutes | aux | `glutes.hip_ext` | nameRules (unoszenie nóg w leżeniu przodem = wyprost biodra) | gotowe |
| Stomach Vacuum [core_other] | obliques | main | — | — | otwarte (region „skośne” zastępuje mięsień poprzeczny; ćwiczenie na czas) |
| Scissor Kick [core_flexion] | abs | main | (`abs.antilordosis`?) | zostaje w `exceptions.noRole` | otwarte (analogia do Hollow Hold) |

Uwagi do par:
- Reguły `core_flexion` + `aux` obejmą też przyszłe ćwiczenia z tej rodziny; dziś (wg `MUSCLE_LOAD`) skośne 0,5 w `core_flexion` mają: Cable Crunch, Reverse Crunch, V-Up, Cable Seated Crunch, Standing Rope Crunch, Hanging Leg Raise, Hanging Knee Raise, Toes to Bar (te trzy — `core_hang.md`). Prosty 0,5 w `core_flexion`: Cross-Body Crunch, Decline Oblique Crunch. Generator powinien potwierdzić liczby (`pairs`).
- Kolejność reguł: istniejąca `core_flexion`+`obliques`+`main` → `rotate_bend` zostaje bez zmian (dotyczy innych ćwiczeń); nowe reguły są tylko dla `aux`.
- Superman i Lower Back Curl: funkcja `lower_back.spine_ext` (S4, S10) opisuje wyprost kręgosłupa; S26 (4.1, tab. 3, Park i in. 2015): „Back extension elicited the greatest ES activation.” — wyprost pleców w leżeniu przodem angażuje prostowniki. Rodzina `other` jest mieszana, więc tylko jawna lista.

## Blok do wklejenia (format role-miesni.json; dotyczy całej grupy g1)

```json
{
  "functions": {
    "abs.antilordosis": {
      "pewnosc": "dwa źródła",
      "uwaga": "S17 (szczebel 4) wprost: kontrola przodopochylenia miednicy (antylordoza); S32-g1 (przegląd systematyczny, część Context) wprost: kontrola przedniego pochylenia miednicy; S33-g1 kierunkowo (odchyla miednicę do tyłu); S26 — aktywność w desce.",
      "zrodla": ["S17", "S32-g1", "S33-g1", "S26"],
      "status": "dwa_zrodla"
    },
    "obliques.trunk_flex": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "zgięcie (skurcz obustronny)",
      "pl": { "main": "Zgina tułów", "aux": "Pomaga zginać tułów" },
      "en": { "main": "Curls your trunk", "aux": "Helps curl your trunk" },
      "pewnosc": "dwa źródła", "zrodla": ["S18", "S29-g1", "S30-g1", "S31-g1", "S26"], "status": "dwa_zrodla"
    },
    "obliques.rotate": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "rotacja",
      "pl": { "main": "Skręca tułów", "aux": "Pomaga skręcać tułów" },
      "en": { "main": "Twists your trunk", "aux": "Helps twist your trunk" },
      "pewnosc": "ustalone (≥ 3 niezależne)", "zrodla": ["S3", "S16", "S18", "S29-g1", "S31-g1"], "status": "ustalone"
    },
    "obliques.side_bend": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "zgięcie boczne",
      "pl": { "main": "Pochyla tułów na bok", "aux": "Pomaga pochylać tułów na bok" },
      "en": { "main": "Bends your trunk to the side", "aux": "Helps bend your trunk to the side" },
      "pewnosc": "ustalone (≥ 3 niezależne)", "zrodla": ["S3", "S18", "S29-g1", "S31-g1"], "status": "ustalone"
    },
    "obliques.antilordosis": {
      "region": "obliques", "staw": "kręgosłup lędźwiowy/miednica", "ruch": "kontrola przodopochylenia",
      "pl": { "main": "Nie pozwala wygiąć się lędźwiom", "aux": "Pomaga utrzymać lędźwie bez wygięcia" },
      "en": { "main": "Keeps your lower back from arching", "aux": "Helps keep your lower back from arching" },
      "pewnosc": "uproszczenie",
      "uproszczenie": "S30-g1 i S31-g1 podają odchylenie miednicy do tyłu (ruch); że skośne utrzymują lędźwie w ćwiczeniach przeciw wyprostowi — wniosek z tego ruchu, bez przeczytanego źródła wprost.",
      "zrodla": ["S30-g1", "S31-g1"], "status": "uproszczenie"
    },
    "obliques.antirotation": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "opór przed rotacją",
      "pl": { "main": "Nie pozwala skręcić się tułowiowi", "aux": "Pomaga utrzymać tułów bez skrętu" },
      "en": { "main": "Keeps your trunk from twisting", "aux": "Helps keep your trunk from twisting" },
      "pewnosc": "jedno źródło",
      "uwaga": "Tylko S34-g1 (materiał uczelnianego centrum sportu, szczebel 5) łączy skośne z ćwiczeniem przeciw rotacji; S16/S18 opisują rotację (ruch), nie opór. Bez tekstu do czasu drugiego źródła.",
      "zrodla": ["S34-g1"], "status": "jedno_zrodlo"
    }
  },
  "rules": [
    { "pattern": "core_flexion", "muscle": "obliques", "roles": ["aux"], "function": "obliques.trunk_flex", "phase": false,
      "uwaga": "obustronny skurcz skośnych zgina tułów (S18, S29-g1); główne skośne w core_flexion zostają przy rotate_bend (reguła wyżej)" },
    { "pattern": "core_flexion", "muscle": "abs", "roles": ["aux"], "function": "abs.trunk_flex", "phase": false,
      "uwaga": "brzuszki skośne: prosty pomocniczy przy zgięciu tułowia" },
    { "pattern": "core_anti_ext", "muscle": "obliques", "roles": ["aux"], "function": "obliques.antilordosis", "phase": false,
      "pewnosc": "uproszczenie — w danych bez tekstu" },
    { "pattern": "core_anti_rot", "muscle": "obliques", "roles": ["main"], "function": "obliques.antirotation", "phase": false,
      "pewnosc": "jedno źródło — w danych bez tekstu; Pallof Press With Rotation ma nameRule (obliques.rotate) sprawdzaną wcześniej" }
  ],
  "nameRules": [
    { "muscle": "obliques", "roles": ["main"], "function": "obliques.side_bend",
      "exercises": ["Alternate Heel Touchers", "Oblique Crunches - On The Floor", "Side Jackknife",
                    "Side Bend (hantel)", "Barbell Side Bend", "One-Arm High-Pulley Cable Side Bends", "Weighted Ball Side Bend"] },
    { "muscle": "obliques", "roles": ["main"], "function": "obliques.rotate",
      "exercises": ["Russian Twist", "Cable Woodchop", "Landmine Rotation", "Cable Judo Flip", "Cable Russian Twists",
                    "Medicine Ball Full Twist", "Seated Barbell Twist", "Spell Caster", "Pallof Press With Rotation"] },
    { "muscle": "front_delt", "roles": ["aux"], "function": "front_delt.shoulder_flex", "exercises": ["Otis-Up", "Press Sit-Up"] },
    { "muscle": "triceps", "roles": ["aux"], "function": "triceps.elbow_ext", "exercises": ["Press Sit-Up"] },
    { "muscle": "lower_back", "roles": ["main"], "function": "lower_back.spine_ext", "exercises": ["Superman", "Lower Back Curl"] },
    { "muscle": "glutes", "roles": ["aux"], "function": "glutes.hip_ext", "exercises": ["Superman"] }
  ],
  "sources": [
    { "id": "S29-g1", "tier": 4,
      "cite": "Elsevier, Anatomy resources: External Abdominal Oblique Muscle (na podstawie Sinnatamby 2011)",
      "url": "https://www.elsevier.com/resources/anatomy/muscular-system/muscles-of-abdomen/external-abdominal-oblique-muscle/21869",
      "miejsce": "Actions",
      "cytaty": ["„during bilateral contraction, it flexes the trunk;”", "„during unilateral contraction, it laterally flexes the trunk to the same side;” / „it rotates the trunk to the opposite side;”"] },
    { "id": "S30-g1", "tier": 4,
      "cite": "Sendić G. Internal abdominal oblique muscle. Kenhub (rec. 30.10.2023)",
      "url": "https://www.kenhub.com/en/library/anatomy/internal-abdominal-oblique-muscle",
      "miejsce": "Function",
      "cytaty": ["„Upon bilateral contraction, the internal abdominal oblique flexes the trunk.”", "„If the rib cage is fixed, the bilateral contraction of the internal abdominal oblique lifts the anterior part of the pelvis”"],
      "uwaga": "ten sam wydawca co S17 i S18 — nie liczyć jako niezależne od nich" },
    { "id": "S31-g1", "tier": 4,
      "cite": "Muscolino J. External abdominal oblique. learnmuscles.com (11.11.2020)",
      "url": "https://learnmuscles.com/glossary/external-abdominal-oblique/",
      "miejsce": "Actions",
      "cytaty": ["„The external abdominal oblique flexes, laterally flexes, and contralaterally rotates the trunk at the spinal joints.”", "„It also posteriorly tilts and ipsilaterally rotates the pelvis …”"] },
    { "id": "S32-g1", "tier": 2,
      "cite": "Aragón Salamanca JC. Abdominal Drawing-In Maneuver is Less Effective for Core Stability During High Load Tasks: A Systematic Review. Asian J Sports Med 2024;15(3):e148003",
      "url": "https://brieflands.com/articles/asjsm-148003",
      "miejsce": "1. Context",
      "cytaty": ["„RA plays a critical role in controlling anterior pelvic tilt and transmitting loads from the thorax to the pelvis.”"],
      "uwaga": "twierdzenie w części wprowadzającej (tło), nie wynik przeglądu" },
    { "id": "S33-g1", "tier": 4,
      "cite": "Muscolino J. Rectus abdominis. learnmuscles.com (10.11.2020)",
      "url": "https://learnmuscles.com/glossary/rectus-abdominis-2/",
      "miejsce": "Actions",
      "cytaty": ["„It posteriorly tilts the pelvis at the lumbosacral joint.”"] },
    { "id": "S34-g1", "tier": 5,
      "cite": "Sussex Sport (University of Sussex). Level Three: Anti Rotations and Pallof Press (materiał ćwiczeniowy, 2012)",
      "url": "https://www.sussex.ac.uk/sport/documents/anti-rotations-pallof-press.pdf",
      "miejsce": "Target Muscles; Note",
      "cytaty": ["Primary Muscles: „… obliques”; „the exercise is about avoiding rotation towards the load”"] }
  ]
}
```

## Źródła (przeczytane 02.11.2026)

| id | adres | organizacja | szczebel |
|---|---|---|---|
| S3 (istn.) | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax | OpenStax (Rice University), tab. 11.6 | 3 |
| S16 (istn., sprawdzone ponownie) | https://teachmeanatomy.info/abdomen/muscles/the-abdominal-wall/ | TeachMeAnatomy — External Oblique, Actions: „Contralateral rotation of the torso.” | 4 |
| S17 (istn.) | https://www.kenhub.com/en/library/anatomy/rectus-abdominis-muscle | Kenhub — Function | 4 |
| S18 (istn., sprawdzone ponownie) | https://www.kenhub.com/en/library/anatomy/external-abdominal-oblique-muscle | Kenhub — Function: „to flex the trunk anteriorly” (skurcz obustronny) | 4 |
| S26 (istn.) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/ | IJERPH 2020, przegląd systematyczny — 4.1 / tab. 3 | 2 (tu: dane o aktywności, nie o funkcji) |
| S29-g1 | jw. w bloku | Elsevier (podręcznik Sinnatamby) | 4 |
| S30-g1 | jw. | Kenhub | 4 |
| S31-g1 | jw. | learnmuscles (J. Muscolino, autor podręczników kinezjologii) | 4 |
| S32-g1 | jw. | Asian J Sports Med 2024, przegląd systematyczny | 2 |
| S33-g1 | jw. | learnmuscles (J. Muscolino) | 4 |
| S34-g1 | jw. | Sussex Sport, Uniwersytet w Sussex (materiał ćwiczeniowy) | 5 |

Sprawdzone, nieprzydatne: artykuł edukacyjny organizacji szkolącej trenerów o treningu przeciw rotacji (2018) — nie łączy żadnego mięśnia z oporem przed skrętem; streszczenie pilotażu EMG (Int J Exerc Sci Conf Proc 2021, 4 osoby) — mierzy skośne w wyciskaniu Pallofa, ale nie nazywa funkcji; strona Elsevier o mięśniu prostym brzucha — tylko zgięcie tułowia, bez miednicy.

## Otwarte

- [OTWARTE] **Skośne przeciw rotacji** (Bird Dog, Pallof Press — `core_anti_rot`): po tej rundzie jedno źródło szczebla 5 (S34-g1). Anatomia (S16, S18, S29-g1) opisuje skręt jako ruch; „opór przed skrętem” byłby wnioskiem (uproszczenie). Do zamknięcia potrzebne: podręcznik kinezjologii albo badanie/przegląd, który wprost nazywa skośne mięśniami przeciwdziałającymi rotacji (np. pełne teksty prac o wyciskaniu Pallofa lub o „bird dog” w czasopismach — nie dało się przeczytać w tej sesji).
- [OTWARTE] **Skośne pomocnicze przeciw wyprostowi** (Dead Bug, Hollow Hold, Dragon Flag): źródła opisują odchylenie miednicy do tyłu (ruch), nie utrzymanie — uproszczenie.
- [OTWARTE] **Prosty brzucha pomocniczy** w Bird Dog, Alternate Heel Touchers, Side Jackknife — brak przeczytanego źródła roli w tych ruchach.
- [OTWARTE] **Stomach Vacuum** (skośne główne): ćwiczenie dotyczy mięśnia poprzecznego (`note` katalogu); region „skośne” go zastępuje. Funkcja „napina/ściska brzuch” ma źródła dla skośnego wewnętrznego (S16: „Bilateral contraction compresses the abdomen”; S30-g1), ale zdanie przy „skośnych” opisywałoby inny mięsień niż ten, o który chodzi w ćwiczeniu — decyzja produktowa/katalogowa, nie dane.
- [OTWARTE] **Scissor Kick** (prosty, `noRole`): wariant z pozycji Hollow Hold; przypisanie `abs.antilordosis` byłoby analogią — bez źródła wprost zostaje wyjątek.
- [OTWARTE] Liczby `pairs` dla nowych reguł — do przeliczenia generatorem (`tests/muscle-roles.test.ts`).

## Stan

- Zrobione: funkcje wspólne grupy g1 (abs.antilordosis — podniesienie; obliques.trunk_flex, obliques.rotate, obliques.side_bend gotowe; obliques.antilordosis i obliques.antirotation w danych bez tekstu), źródła S29-g1…S34-g1, tabela par core_floor.
- Zostało: przeniesienie do `data/zrodla/role-miesni.json` (programista; poza zakresem tej fali), przeliczenie `pairs`, aktualizacja `withoutRole.kombinacje` i `open` (wpis o core_anti_rot zmienia się na „jedno źródło”), teksty EN do przeglądu tłumacza, wpisy w rejestrze twierdzeń (`npm run check:claims`) dla nowych zdań.
- Pułapki: S30-g1 to ten sam wydawca co S17/S18 (nie liczyć jako niezależne); S32-g1 to tło przeglądu, nie jego wynik; role wyliczone ręcznie, bez uruchomienia `muscleLoadOf`.

## Kontrola koordynatora (02.11.2026)

Udziały główny/pomocniczy z tabel w plikach `core_floor.md`, `core_standing.md`, `core_hang.md` i `back_extension.md` porównane z wyliczeniem
aplikacji (`muscleRoleRows` z `lib/muscleRoles.ts` i `muscleLoadOf` z `lib/seed.ts`, uruchomione przez `scripts/strona/ts-loader.mjs` na
`integracja-1-1` @ 15abc58): 69 par bez opisu w czterech rodzinach, wszystkie role zgodne (wiersze zbiorcze w core_standing sprawdzone ręcznie).
Liczby `pairs` w regułach i tak przelicza generator przy wdrożeniu.
