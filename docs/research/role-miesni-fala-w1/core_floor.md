# Role mięśni — fala W1, grupa g1: core na podłodze (core_floor)

Data: 02.11.2026 · autor: badacz-merytoryczny · status: zebrane dane, bez zmian w `data/zrodla/role-miesni.json` (polecenie właściciela 02.11.2026: tylko zbieranie danych).

Ten plik opisuje raz **wspólne funkcje i źródła** grupy g1; `core_standing.md`, `core_hang.md` i `back_extension.md` się do nich odwołują.
Szczeble źródeł 4–5 sprawdzone 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — sekcja „Korekta szczebli 02.11.2026” na końcu (źródła anatomiczne szczebla 3 bez zmian).

## Metoda

- Role par sprawdzone u źródła: `lib/catalog.generated.ts` (`MUSCLE_LOAD`, `pattern`) i `docs/research/equipment/catalog.json` (`muscles`, `secondaryMuscles`, `note`) z uwzględnieniem `muscleLoadOf` (`lib/seed.ts:153`: region z partii głównej podniesiony do 1, z pomocniczej obcięty do 0,5). Nie uruchamiałem `node` (brak powłoki w tej sesji) — role wyliczone ręcznie z tych plików; przed wklejeniem warto potwierdzić generatorem (`scripts/pokrycie-katalogu.mjs`).
- Funkcja jest „gotowa” tylko przy ≥ 2 przeczytanych, niezależnych źródłach, które zawierają twierdzenie wprost. Gdy źródła opisują tylko ruch koncentryczny (np. „odchyla miednicę do tyłu”), a tekst miałby mówić o utrzymaniu pozycji („nie pozwala wygiąć się lędźwiom”) — to **uproszczenie** (zostaje w danych bez tekstu).
- Strony i dokumentacja innych aplikacji treningowych nie były źródłem (uzupełnienie briefu koordynatora).

## Wspólne funkcje (nowe i zmienione)

| id | zmiana | PL main / aux | EN main / aux | źródła (po korekcie: liczone szczeble 2–4) | status |
|---|---|---|---|---|---|
| `abs.antilordosis` | **podniesienie** z `jedno_zrodlo` | bez zmian („Nie pozwala wygiąć się lędźwiom” / „Pomaga utrzymać lędźwie bez wygięcia”) | bez zmian | S17, S32-g1 (+ S33-g1 kierunkowo — po korekcie szczebel 5, S26 aktywność) | `dwa_zrodla` (bez zmiany) |
| `obliques.trunk_flex` | nowa | „Zgina tułów” / „Pomaga zginać tułów” | „Curls your trunk” / „Helps curl your trunk” | S18 (Kenhub), S29-g1 (Elsevier) (+ S30-g1 — Kenhub, nie niezależne; S31-g1 — po korekcie szczebel 5; S26 aktywność w brzuszkach) | `dwa_zrodla` (bez zmiany; zależy od S29-g1 — zob. korekta) |
| `obliques.rotate` | nowa (węższa od `rotate_bend`) | „Skręca tułów” / „Pomaga skręcać tułów” | „Twists your trunk” / „Helps twist your trunk” | S3, S16, S18, S29-g1 (S31-g1 — po korekcie szczebel 5) | `ustalone` (≥ 3 niezależne: OpenStax, Kenhub, Elsevier; TeachMeAnatomy — zob. korekta) |
| `obliques.side_bend` | nowa (węższa od `rotate_bend`) | „Pochyla tułów na bok” / „Pomaga pochylać tułów na bok” | „Bends your trunk to the side” / „Helps bend your trunk to the side” | S3, S18, S29-g1 (S31-g1 — po korekcie szczebel 5) | `ustalone` (3 niezależne: OpenStax, Kenhub, Elsevier) |
| `obliques.antilordosis` | nowa | „Nie pozwala wygiąć się lędźwiom” / „Pomaga utrzymać lędźwie bez wygięcia” | jak `abs.antilordosis` | S30-g1, S31-g1 (oba: odchylenie miednicy do tyłu — ruch, nie utrzymanie; S31-g1 po korekcie szczebel 5) | `uproszczenie` — bez tekstu |
| `obliques.antirotation` | nowa | „Nie pozwala skręcić się tułowiowi” / „Pomaga utrzymać tułów bez skrętu” | „Keeps your trunk from twisting” / „Helps keep your trunk from twisting” | S34-g1 (szczebel 5), S16/S18 tylko kierunkowo | `jedno_zrodlo` — bez tekstu |

Uwagi:
- `obliques.rotate` i `obliques.side_bend` rozdzielają istniejące `obliques.rotate_bend` („Skręca tułów i pochyla go na bok”), żeby skręty nie dostawały zdania o skłonie bocznym i odwrotnie. Jeśli koordynator woli nie dodawać funkcji, te same listy `nameRules` mogą wskazywać `obliques.rotate_bend` (źródła te same; zdanie mniej precyzyjne). Rekomendacja: rozdzielić.
- `abs.antilordosis`: S17 mówi wprost „controls tilt of the pelvis (antilordosis)”, S32-g1 (przegląd systematyczny) — „controlling anterior pelvic tilt” (w części „Context”, tło przeglądu, nie jego wynik — liczę jako źródło zawierające twierdzenie wprost, ale nie jako „ustalone” z samego przeglądu; dla tego twierdzenia ma wagę pojedynczej publikacji, nie wyniku przeglądu). Dwa różne zespoły → `dwa_zrodla`. Skutek: wszystkie 9 par reguły `core_anti_ext` + `abs` + `main` (m.in. Dead Bug, Hollow Hold, Dragon Flag) zaczynają pokazywać zdanie.

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
| Superman [other] | lower_back | main | `lower_back.spine_ext` | nameRules (unoszenie klatki i nóg w leżeniu przodem) | gotowe (funkcja istniejąca; S10 TeachMeAnatomy — zob. korekta) |
| Superman | glutes | aux | `glutes.hip_ext` | nameRules (unoszenie nóg w leżeniu przodem = wyprost biodra) | gotowe |
| Stomach Vacuum [core_other] | obliques | main | — | — | otwarte (region „skośne” zastępuje mięsień poprzeczny; ćwiczenie na czas) |
| Scissor Kick [core_flexion] | abs | main | (`abs.antilordosis`?) | zostaje w `exceptions.noRole` | otwarte (analogia do Hollow Hold) |

Uwagi do par:
- Reguły `core_flexion` + `aux` obejmą też przyszłe ćwiczenia z tej rodziny; dziś (wg `MUSCLE_LOAD`) skośne 0,5 w `core_flexion` mają: Cable Crunch, Reverse Crunch, V-Up, Cable Seated Crunch, Standing Rope Crunch, Hanging Leg Raise, Hanging Knee Raise, Toes to Bar (te trzy — `core_hang.md`). Prosty 0,5 w `core_flexion`: Cross-Body Crunch, Decline Oblique Crunch. Generator powinien potwierdzić liczby (`pairs`).
- Kolejność reguł: istniejąca `core_flexion`+`obliques`+`main` → `rotate_bend` zostaje bez zmian (dotyczy innych ćwiczeń); nowe reguły są tylko dla `aux`.
- Superman i Lower Back Curl: funkcja `lower_back.spine_ext` (S4, S10) opisuje wyprost kręgosłupa; S26 (4.1, tab. 3, Park i in. 2015): „Back extension elicited the greatest ES activation.” — wyprost pleców w leżeniu przodem angażuje prostowniki. Rodzina `other` jest mieszana, więc tylko jawna lista.

## Blok do wklejenia (format role-miesni.json; dotyczy całej grupy g1)

Po korekcie 02.11.2026 zmienione tylko pola `tier`/`uwaga` źródeł S31-g1 i S33-g1 oraz `uwaga` przy funkcjach, które je wymieniają; statusy funkcji bez zmian.

```json
{
  "functions": {
    "abs.antilordosis": {
      "pewnosc": "dwa źródła",
      "uwaga": "S17 (szczebel 4) wprost: kontrola przodopochylenia miednicy (antylordoza); S32-g1 (przegląd systematyczny, część Context) wprost: kontrola przedniego pochylenia miednicy; S33-g1 kierunkowo (odchyla miednicę do tyłu; szczebel 5 — nie liczy się); S26 — aktywność w desce.",
      "zrodla": ["S17", "S32-g1", "S33-g1", "S26"],
      "status": "dwa_zrodla"
    },
    "obliques.trunk_flex": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "zgięcie (skurcz obustronny)",
      "pl": { "main": "Zgina tułów", "aux": "Pomaga zginać tułów" },
      "en": { "main": "Curls your trunk", "aux": "Helps curl your trunk" },
      "pewnosc": "dwa źródła",
      "uwaga": "Liczą się S18 (Kenhub) i S29-g1 (Elsevier); S30-g1 to ten sam wydawca co S18, S31-g1 szczebel 5 (korekta 02.11.2026).",
      "zrodla": ["S18", "S29-g1", "S30-g1", "S31-g1", "S26"], "status": "dwa_zrodla"
    },
    "obliques.rotate": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "rotacja",
      "pl": { "main": "Skręca tułów", "aux": "Pomaga skręcać tułów" },
      "en": { "main": "Twists your trunk", "aux": "Helps twist your trunk" },
      "pewnosc": "ustalone (≥ 3 niezależne)",
      "uwaga": "Liczą się S3 (OpenStax), S18 (Kenhub), S29-g1 (Elsevier), S16 (TeachMeAnatomy); S31-g1 szczebel 5 (korekta 02.11.2026).",
      "zrodla": ["S3", "S16", "S18", "S29-g1", "S31-g1"], "status": "ustalone"
    },
    "obliques.side_bend": {
      "region": "obliques", "staw": "kręgosłup", "ruch": "zgięcie boczne",
      "pl": { "main": "Pochyla tułów na bok", "aux": "Pomaga pochylać tułów na bok" },
      "en": { "main": "Bends your trunk to the side", "aux": "Helps bend your trunk to the side" },
      "pewnosc": "ustalone (≥ 3 niezależne)",
      "uwaga": "Liczą się S3 (OpenStax), S18 (Kenhub), S29-g1 (Elsevier); S31-g1 szczebel 5 (korekta 02.11.2026).",
      "zrodla": ["S3", "S18", "S29-g1", "S31-g1"], "status": "ustalone"
    },
    "obliques.antilordosis": {
      "region": "obliques", "staw": "kręgosłup lędźwiowy/miednica", "ruch": "kontrola przodopochylenia",
      "pl": { "main": "Nie pozwala wygiąć się lędźwiom", "aux": "Pomaga utrzymać lędźwie bez wygięcia" },
      "en": { "main": "Keeps your lower back from arching", "aux": "Helps keep your lower back from arching" },
      "pewnosc": "uproszczenie",
      "uproszczenie": "S30-g1 i S31-g1 podają odchylenie miednicy do tyłu (ruch); że skośne utrzymują lędźwie w ćwiczeniach przeciw wyprostowi — wniosek z tego ruchu, bez przeczytanego źródła wprost. S31-g1 po korekcie szczebel 5.",
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
      "cytaty": ["„during bilateral contraction, it flexes the trunk;”", "„during unilateral contraction, it laterally flexes the trunk to the same side;” / „it rotates the trunk to the opposite side;”"],
      "uwaga": "korekta 02.11.2026: szczebel 4 — treść firmowana przez wydawnictwo, oparta na podręczniku (Last's Anatomy); bez autora i daty strony; strona promuje aplikację 3D wydawcy (reklama wokół treści, nie treść)" },
    { "id": "S30-g1", "tier": 4,
      "cite": "Sendić G. Internal abdominal oblique muscle. Kenhub (rec. 30.10.2023)",
      "url": "https://www.kenhub.com/en/library/anatomy/internal-abdominal-oblique-muscle",
      "miejsce": "Function",
      "cytaty": ["„Upon bilateral contraction, the internal abdominal oblique flexes the trunk.”", "„If the rib cage is fixed, the bilateral contraction of the internal abdominal oblique lifts the anterior part of the pelvis”"],
      "uwaga": "ten sam wydawca co S17 i S18 — nie liczyć jako niezależne od nich" },
    { "id": "S31-g1", "tier": 5,
      "cite": "Muscolino J. External abdominal oblique. learnmuscles.com (11.11.2020)",
      "url": "https://learnmuscles.com/glossary/external-abdominal-oblique/",
      "miejsce": "Actions",
      "cytaty": ["„The external abdominal oblique flexes, laterally flexes, and contralaterally rotates the trunk at the spinal joints.”", "„It also posteriorly tilts and ipsilaterally rotates the pelvis …”"],
      "uwaga": "korekta 02.11.2026: było 4 → 5 (zachowawczo) — serwis jednego autora sprzedający kursy dla terapeutów manualnych, na stronie kod rabatowy i odnośnik polecający (warunek c); brak opisanej redakcji/recenzji; nie zmienia statusu żadnej funkcji" },
    { "id": "S32-g1", "tier": 2,
      "cite": "Aragón Salamanca JC. Abdominal Drawing-In Maneuver is Less Effective for Core Stability During High Load Tasks: A Systematic Review. Asian J Sports Med 2024;15(3):e148003",
      "url": "https://brieflands.com/articles/asjsm-148003",
      "miejsce": "1. Context",
      "cytaty": ["„RA plays a critical role in controlling anterior pelvic tilt and transmitting loads from the thorax to the pelvis.”"],
      "uwaga": "twierdzenie w części wprowadzającej (tło), nie wynik przeglądu" },
    { "id": "S33-g1", "tier": 5,
      "cite": "Muscolino J. Rectus abdominis. learnmuscles.com (10.11.2020)",
      "url": "https://learnmuscles.com/glossary/rectus-abdominis-2/",
      "miejsce": "Actions",
      "cytaty": ["„It posteriorly tilts the pelvis at the lumbosacral joint.”"],
      "uwaga": "korekta 02.11.2026: było 4 → 5 (jak S31-g1, ten sam serwis); i tak tylko kierunkowo" },
    { "id": "S34-g1", "tier": 5,
      "cite": "Sussex Sport (University of Sussex). Level Three: Anti Rotations and Pallof Press (materiał ćwiczeniowy, 2012)",
      "url": "https://www.sussex.ac.uk/sport/documents/anti-rotations-pallof-press.pdf",
      "miejsce": "Target Muscles; Note",
      "cytaty": ["Primary Muscles: „… obliques”; „the exercise is about avoiding rotation towards the load”"] }
  ]
}
```

## Źródła (przeczytane 02.11.2026)

| id | adres | organizacja | szczebel (po korekcie 02.11.2026) |
|---|---|---|---|
| S3 (istn.) | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax | OpenStax (Rice University), tab. 11.6 | 3 (bez zmian) |
| S16 (istn., sprawdzone ponownie) | https://teachmeanatomy.info/abdomen/muscles/the-abdominal-wall/ | TeachMeAnatomy — External Oblique, Actions: „Contralateral rotation of the torso.” | 4 w rejestrze; **(a) do decyzji koordynatora linii** (zob. korekta) — nie zmienia statusów w tym pliku |
| S17 (istn.) | https://www.kenhub.com/en/library/anatomy/rectus-abdominis-muscle | Kenhub — Function | 4 |
| S18 (istn., sprawdzone ponownie) | https://www.kenhub.com/en/library/anatomy/external-abdominal-oblique-muscle | Kenhub — Function: „to flex the trunk anteriorly” (skurcz obustronny) | 4 |
| S26 (istn.) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/ | IJERPH 2020, przegląd systematyczny — 4.1 / tab. 3 | 2 (tu: dane o aktywności, nie o funkcji) |
| S29-g1 | jw. w bloku | Elsevier (podręcznik Sinnatamby) | 4 (oceniony — zob. korekta) |
| S30-g1 | jw. | Kenhub | 4 |
| S31-g1 | jw. | learnmuscles (J. Muscolino, autor podręczników kinezjologii) | **5** (było 4) |
| S32-g1 | jw. | Asian J Sports Med 2024, przegląd systematyczny | 2 |
| S33-g1 | jw. | learnmuscles (J. Muscolino) | **5** (było 4) |
| S34-g1 | jw. | Sussex Sport, Uniwersytet w Sussex (materiał ćwiczeniowy) | 5 (bez zmian) |

Sprawdzone, nieprzydatne: artykuł edukacyjny organizacji szkolącej trenerów o treningu przeciw rotacji (2018) — nie łączy żadnego mięśnia z oporem przed skrętem; streszczenie pilotażu EMG (Int J Exerc Sci Conf Proc 2021, 4 osoby) — mierzy skośne w wyciskaniu Pallofa, ale nie nazywa funkcji; strona Elsevier o mięśniu prostym brzucha — tylko zgięcie tułowia, bez miednicy.

## Otwarte

- [OTWARTE] **Skośne przeciw rotacji** (Bird Dog, Pallof Press — `core_anti_rot`): po tej rundzie jedno źródło szczebla 5 (S34-g1). Anatomia (S16, S18, S29-g1) opisuje skręt jako ruch; „opór przed skrętem” byłby wnioskiem (uproszczenie). Do zamknięcia potrzebne: podręcznik kinezjologii albo badanie/przegląd, który wprost nazywa skośne mięśniami przeciwdziałającymi rotacji (np. pełne teksty prac o wyciskaniu Pallofa lub o „bird dog” w czasopismach — nie dało się przeczytać w tej sesji).
- [OTWARTE] **Skośne pomocnicze przeciw wyprostowi** (Dead Bug, Hollow Hold, Dragon Flag): źródła opisują odchylenie miednicy do tyłu (ruch), nie utrzymanie — uproszczenie.
- [OTWARTE] **Prosty brzucha pomocniczy** w Bird Dog, Alternate Heel Touchers, Side Jackknife — brak przeczytanego źródła roli w tych ruchach.
- [OTWARTE] **Stomach Vacuum** (skośne główne): ćwiczenie dotyczy mięśnia poprzecznego (`note` katalogu); region „skośne” go zastępuje. Funkcja „napina/ściska brzuch” ma źródła dla skośnego wewnętrznego (S16: „Bilateral contraction compresses the abdomen”; S30-g1), ale zdanie przy „skośnych” opisywałoby inny mięsień niż ten, o który chodzi w ćwiczeniu — decyzja produktowa/katalogowa, nie dane.
- [OTWARTE] **Scissor Kick** (prosty, `noRole`): wariant z pozycji Hollow Hold; przypisanie `abs.antilordosis` byłoby analogią — bez źródła wprost zostaje wyjątek.
- [OTWARTE] Liczby `pairs` dla nowych reguł — do przeliczenia generatorem (`tests/muscle-roles.test.ts`).
- [DO DECYZJI KOORDYNATORA LINII] **TeachMeAnatomy** (S10, S16 i kilkanaście innych źródeł w `data/zrodla/role-miesni.json`) — zob. korekta niżej.

## Stan

- Zrobione: funkcje wspólne grupy g1 (abs.antilordosis — podniesienie; obliques.trunk_flex, obliques.rotate, obliques.side_bend gotowe; obliques.antilordosis i obliques.antirotation w danych bez tekstu), źródła S29-g1…S34-g1, tabela par core_floor.
- Korekta szczebli 02.11.2026: learnmuscles (S31-g1, S33-g1) 4 → 5; żaden status funkcji ani pary się nie zmienił. **Pary gotowe: 18 przed → 18 po** (w tym Superman `lower_back` zależny od decyzji o TeachMeAnatomy, jak każda para z `lower_back.spine_ext` w danych).
- Zostało: przeniesienie do `data/zrodla/role-miesni.json` (programista; poza zakresem tej fali), przeliczenie `pairs`, aktualizacja `withoutRole.kombinacje` i `open` (wpis o core_anti_rot zmienia się na „jedno źródło”), teksty EN do przeglądu tłumacza, wpisy w rejestrze twierdzeń (`npm run check:claims`) dla nowych zdań; decyzja koordynatora o TeachMeAnatomy.
- Pułapki: S30-g1 to ten sam wydawca co S17/S18 (nie liczyć jako niezależne); S32-g1 to tło przeglądu, nie jego wynik; role wyliczone ręcznie, bez uruchomienia `muscleLoadOf`; `obliques.trunk_flex` stoi na dwóch źródłach (Kenhub + Elsevier) — utrata szczebla Elsevier = „jedno źródło” dla 8 par (5 tutaj + 3 w `core_hang.md`).

## Kontrola koordynatora (02.11.2026)

Udziały główny/pomocniczy z tabel w plikach `core_floor.md`, `core_standing.md`, `core_hang.md` i `back_extension.md` porównane z wyliczeniem
aplikacji (`muscleRoleRows` z `lib/muscleRoles.ts` i `muscleLoadOf` z `lib/seed.ts`, uruchomione przez `scripts/strona/ts-loader.mjs` na
`integracja-1-1` @ 15abc58): 69 par bez opisu w czterech rodzinach, wszystkie role zgodne (wiersze zbiorcze w core_standing sprawdzone ręcznie).
Liczby `pairs` w regułach i tak przelicza generator przy wdrożeniu.

## Korekta szczebli 02.11.2026

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026) — szczebel 4 wymaga naraz (a) organizacji szkolącej/certyfikującej trenerów, serwisu
z redakcją i recenzją ekspercką albo producenta, (b) autora z datą albo treści jawnie firmowanej, (c) braku marketingu i linków afiliacyjnych.
Sprawdzone tylko źródła szczebla 4–5 (polecenie koordynatora); OpenStax (szczebel 3) i prace naukowe bez zmian. Strony learnmuscles, Elsevier
i TeachMeAnatomy otwarte ponownie (WebFetch 02.11.2026); Kenhub oceniony z zapisów w plikach fali (autor, recenzent, data).

| źródło | przed | po | powód | wpływ na statusy |
|---|---|---|---|---|
| S31-g1, S33-g1 (learnmuscles, J. Muscolino) | 4 | 5 (zachowawczo) | (b) spełnione (autor, data); (a) wątpliwe — serwis jednego autora, dostawca kursów dla terapeutów manualnych (nie trenerów), bez opisanej redakcji/recenzji; (c) na stronie kod rabatowy na kurs i odnośnik polecający (afiliacja). Autor jest uznanym autorem podręczników — gdyby koordynator chciał to uznać, właściwą drogą jest jego podręcznik (szczebel 3), nie ta strona. | brak: każda funkcja ma inne liczone źródła (trunk_flex: Kenhub + Elsevier; rotate/side_bend: OpenStax + Kenhub + Elsevier; antilordosis skośnych — i tak uproszczenie; S33-g1 i tak kierunkowo) |
| S29-g1 (Elsevier) | 4 | 4 (oceniony) | (a) wydawnictwo naukowo-medyczne z redakcją; (b) treść jawnie firmowana przez wydawcę i oparta na podręczniku (Last's Anatomy, 2011), bez autora i daty strony; (c) strona reklamuje aplikację anatomiczną wydawcy, ale sama treść o mięśniu nie jest reklamą. | gdyby 5: `obliques.trunk_flex` → „jedno źródło” (8 par: Cable Crunch, Reverse Crunch, V-Up, Cable Seated Crunch, Standing Rope Crunch + 3 w `core_hang.md`) |
| S17, S18, S30-g1 (Kenhub) | 4 | 4 | serwis edukacyjny z autorem, recenzentem medycznym i datą przeglądu (zapisane przy każdym wpisie); treść edukacyjna. | — |
| S16 (TeachMeAnatomy; także S10 i inne w rejestrze) | 4 | 4 w rejestrze — **do decyzji koordynatora linii** | (b) autor (Dr O. Jones) i data aktualizacji (01.02.2026); (c) reklama własnej płatnej wersji serwisu, bez afiliacji; (a) strona nie opisuje redakcji ani recenzji — wątpliwe. Źródło całego istniejącego rejestru ról mięśni, więc decyzja wykracza poza ten plik. | w tym pliku: `obliques.rotate` bez zmian (OpenStax + Kenhub + Elsevier). Poza nim: gdyby 5, `lower_back.spine_ext` (S4 + S10) → „jedno źródło” dla wszystkich par w danych, w tym Superman i Lower Back Curl z tej fali |
| S34-g1 (Sussex Sport) | 5 | 5 | bez zmiany. | — |
| S32-g1 | 2 | 2 (bez zmian; poza zakresem) | uwaga: twierdzenie stoi w tle przeglądu, więc dla niego ma wagę pojedynczej publikacji — status `dwa_zrodla` (nie „ustalone”) pozostaje właściwy. | — |
