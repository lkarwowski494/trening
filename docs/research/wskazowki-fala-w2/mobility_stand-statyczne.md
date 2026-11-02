# Wskazówki techniki — fala W2, rodzina `mobility_stand`, rozciągania statyczne otwarte/częściowe po W1 (02.11.2026)

Zakres: Standing Chest Stretch, Standing Lateral Stretch (pozy figur v2), Standing Biceps Stretch, Standing Toe Touches, Wall Lat Stretch,
Standing Pelvic Tilt, Chest Stretch on Stability Ball, Round The World Shoulder Stretch. Stan wyjściowy: przeliczenie G2 z 02.11.2026
(tabela ćwiczeń i „Zdania do pominięcia”) oraz pliki fali W1 `mobility_stand-statyczne*.md`. Wszystkie strony czytane 02.11.2026 przez WebFetch
(PDF-y przez odczyt pliku). Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 2–3).

## 1. Ćwiczenia

| Ćwiczenie | Stan po W1 | Stan po W2 | Błędy (ze źródeł / wnioskowane) | Uwagi |
|---|---|---|---|---|
| Standing Chest Stretch | otwarte | **gotowe** | 1 / 1 | postać wg figury v2 (ręce proste za plecami, dłonie splecione = ACE #209 krok 3); patrz „Uwagi dla integratora” pkt 1 |
| Standing Lateral Stretch | otwarte (`sideSet`, `sideMove`, `sb.plane` do pominięcia) | **gotowe** | 1 (uproszczenie: wariant pozycji) / 1 | drugie źródło: WebMD Ignite (StayWell) na stronie Vanderbilt Health, z datą i recenzentami — zamiast strony na portalu UMass |
| Standing Biceps Stretch | częściowe (`bicepsMove` do pominięcia) | **gotowe** | 1 / 2 | blok tylko `move` + `mistakes` (setup `claspSet` z W1 zostaje) |
| Wall Lat Stretch | otwarte (`latSet`, `latMove` do pominięcia) | **gotowe warunkowo** | 0 / 2 | zależy od szczebla Parkview (uzupełnienie 2 → 4; przeliczenie przyjęło 5 „wg badacza”) — decyzja koordynatora |
| Standing Toe Touches | otwarte | otwarte | — | drugiego źródła szczebla 4 dla ustawienia nie ma; źródła przeczą sobie co do kolan |
| Standing Pelvic Tilt | otwarte | otwarte | — | wersji stojącej w źródłach szczebla ≤ 4 nie znaleziono |
| Chest Stretch on Stability Ball | otwarte | otwarte | — | nie badane ponownie (W1 przeszukało; postać nieustalona) |
| Round The World Shoulder Stretch | otwarte | otwarte | — | postać nieustalona (krążenie ramienia vs przekładanie drążka/gumy) |

## 2. Blok do wdrożenia

```json
{
  "Standing Chest Stretch": {
    "setup": [
      {"c": "mobility_stand.s.claspSet", "s": [["w2g2-mss-ace-209", "Step 3 (Exercise Variation): „extend your arms behind your back, clasping your hands together”"], ["w2g2-mss-medlineplus-chest", "„Clasp your hands behind your back with your palms facing up.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.claspMove", "s": [["w2g2-mss-ace-209", "Step 2: „slightly lift your chest up and out…”, łopatki ściągnięte; Step 3: wariant rozciąga przód barku"], ["w2g2-mss-medlineplus-chest", "„…press your shoulder blades together.” „Your chest should stick out.”"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.s.mis.archLow", "s": [["w2g2-mss-ace-209", "Step 1: „…without arching your low back”; Step 3: „without shifting the hips forward or increasing the amount of lumbar lordosis”"], ["w2g2-mss-origym-biceps", "#8 Standing Arms-Behind-The-Back Bicep Stretch, „Mistakes to avoid”: „Arching your lower back…” (ta sama poza — patrz uwaga 2)"]]},
      {"c": "mobility_stand.s.mis.roundShoulders", "s": [["wniosek", "mobility_stand.s.claspMove"]]}
    ]
  },
  "Standing Lateral Stretch": {
    "setup": [
      {"c": "mobility_stand.s.sideSet", "s": [["w2g2-mss-nhs-flexibility", "Sideways bend, A: „Stand upright with your feet hip-width apart and arms by your sides.”"], ["w2g2-mss-staywell-sidebend-vumc", "„Or you can start in a standing position (not shown) with your arms by your side and your feet shoulder-width apart.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.sideMove", "s": [["w2g2-mss-nhs-flexibility", "Sideways bend, B: „Slide your left arm down your side as far as is comfortable.”"], ["w2g2-mss-staywell-sidebend-vumc", "krok: „Slowly bend to the left.”"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.s.mis.sideTwist", "s": [["w2g2-mss-staywell-sidebend-vumc", "„Don't twist your torso.”"], ["ace-212", "Step 2 (odczyt W1): skłon w bok bez skrętu — uproszczenie: wariant pozycji (siedząc w rozkroku), ten sam ruch tułowia"]]},
      {"c": "mobility_stand.s.mis.sideForward", "s": [["wniosek", "mobility_stand.s.sideMove"]]}
    ]
  },
  "Standing Biceps Stretch": {
    "move": [
      {"c": "mobility_stand.s.bicepsMove", "s": [["w2g2-mss-ace-209", "Step 3: ręce wyprostowane za plecami, „slowly pushing out through the hands and lifting up”"], ["w2g2-mss-origym-biceps", "#8, Execution: „Keeping your elbows extended, gently lift your clasped hands away from your lower back.”"]]},
      {"c": "mobility_stand.s.claspMove", "s": [["w2g2-mss-origym-biceps", "#8, Execution: „Open your chest and draw your shoulder blades together.”"], ["w2g2-mss-medlineplus-chest", "„…press your shoulder blades together.” „Your chest should stick out.”"], ["w2g2-mss-ace-209", "Step 2–3 (łopatki ściągnięte, klatka lekko w górę; wariant z dłońmi splecionymi)"]]}
    ],
    "mistakes": [
      {"c": "mobility_stand.s.mis.archLow", "s": [["w2g2-mss-ace-209", "Step 3: „without shifting the hips forward or increasing the amount of lumbar lordosis”"], ["w2g2-mss-origym-biceps", "#8, „Mistakes to avoid”: „Arching your lower back rather than maintaining a tall, neutral posture.”"]]},
      {"c": "mobility_stand.s.mis.bentElbows", "s": [["wniosek", "mobility_stand.s.bicepsMove"], ["w2g2-mss-origym-biceps", "#8, „Mistakes to avoid”: „Bending your elbows…”"]]},
      {"c": "mobility_stand.s.mis.roundShoulders", "s": [["wniosek", "mobility_stand.s.claspMove"], ["w2g2-mss-origym-biceps", "#8, „Mistakes to avoid”: „Rounding your shoulders instead of lifting your chest.”"]]}
    ]
  },
  "Wall Lat Stretch": {
    "setup": [
      {"c": "mobility_stand.s.latSet", "s": [["w2g2-mss-parkview-wall", "Back and shoulder stretch, krok 1: „Put your hands on the wall. Bend your knees slightly.”"], ["w2g2-mss-ace-198", "Step 2: kolana lekko ugięte, ręce proste oparte na podporze — uproszczenie: wariant podpory (stół zamiast ściany)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.latMove", "s": [["w2g2-mss-parkview-wall", "krok 2: „Hinge at your hips and push back.”; krok 3: ręce wyciągnięte"], ["w2g2-mss-ace-198", "Step 2–3: zgięcie w biodrach z płaskimi plecami, ręce proste, „leaning back into your hips” — uproszczenie: wariant podpory (stół)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.s.mis.latBentArms", "s": [["wniosek", "mobility_stand.s.latMove"]]},
      {"c": "mobility_stand.s.mis.lockKnees", "s": [["wniosek", "mobility_stand.s.latSet"], ["w2g2-mss-ace-198", "Step 5: „Be sure not to fully “lock” the knees”"]]}
    ]
  }
}
```

Uwagi do bloku:
- `claspSet`, `claspMove`, `sideSet`, `sideMove`, `latSet`, `latMove`, `bicepsMove` — zdania z fali W1 (brzmienie bez zmian, por. W1 „Nowe zdania”).
- Wall Lat Stretch: wpis do `exercises` tylko, jeśli koordynator uzna `w2g2-mss-parkview-wall` za szczebel 4 (uwaga 3). Bez tego — otwarte (jedno źródło: ACE #198, wariant).
- `ace-212` to id źródła z W1 (nie czytałem ponownie; brzmienie wg W1 „Step 2: skłon w bok bez skrętu i bez pochylenia w przód (wariant: siedząc)”). Recenzent: sprawdzić, czy wariant siedzący może być drugim źródłem dla błędu stojącego.
- Uproszczenie „wariant podpory” (Wall Lat): ruch ten sam — zgięcie w biodrach, biodra w tył, ręce proste na podporze; różni się tylko wysokość i rodzaj podpory (ściana vs stół). Recenzent sprawdzi.

## 3. Nowe zdania

| Id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| mobility_stand.s.mis.archLow | Wyginanie lędźwi w łuk. | Arching your lower back. | ACE #209 (kroki 1 i 3) + OriGym #8 — błąd ze źródeł (część wspólna: wygięcie lędźwi; „biodra w przód” tylko ACE — nie weszło) |
| mobility_stand.s.mis.roundShoulders | Barki uciekają do przodu zamiast otwartej klatki. | Letting your shoulders roll forward instead of opening your chest. | wniosek: zaprzeczenie `claspMove` („ściągnij łopatki, unieś klatkę”); przy bicepsie także OriGym #8 |
| mobility_stand.s.mis.bentElbows | Uginanie łokci. | Bending your elbows. | wniosek: zaprzeczenie `bicepsMove` („wyprostuj ręce”); także OriGym #8 |
| mobility_stand.s.mis.sideTwist | Skręcanie tułowia w trakcie skłonu. | Twisting your torso as you bend. | StayWell/Vanderbilt („Don't twist your torso.”) + ACE #212 (wariant siedzący — uproszczenie) |
| mobility_stand.s.mis.sideForward | Pochylanie się w przód zamiast w bok. | Leaning forward instead of to the side. | wniosek: zaprzeczenie `sideMove` („skłoń się w bok”) |
| mobility_stand.s.mis.latBentArms | Uginanie rąk w łokciach — ręce mają zostać proste. | Bending your elbows — keep your arms straight. | wniosek: zaprzeczenie `latMove` („ręce zostają wyprostowane”) |
| mobility_stand.s.mis.lockKnees | Prostowanie kolan do oporu. | Locking your knees out. | wniosek: zaprzeczenie `latSet` („lekko ugnij kolana”); także ACE #198 Step 5 |

## 4. Źródła

| Id | Adres | Organizacja | Szczebel i uzasadnienie | Co potwierdza |
|---|---|---|---|---|
| w2g2-mss-ace-209 | https://www.acefitness.org/resources/everyone/exercise-library/209/ | ACE | 4 — organizacja certyfikująca trenerów, treść firmowana ACE (= `ace-209` z W1) | Standing Chest Stretch: kroki 1–3; wariant z dłońmi splecionymi; bez wyginania lędźwi i wysuwania bioder; „do not force your chest forward” |
| w2g2-mss-medlineplus-chest | https://medlineplus.gov/ency/imagepages/19483.htm | MedlinePlus (NLM) | 4 — organizacja zdrowia publicznego; „Review Date 7/23/2024”, recenzent lekarz (UW Medicine) i zespół A.D.A.M. (= `medlineplus-chest-stretch` z W1) | dłonie splecione za plecami, łopatki razem, klatka do przodu |
| w2g2-mss-origym-biceps | https://www.origym.co.uk/blog/bicep-stretches/ | OriGym | warunkowo 4 → 4: autor James Brady (Personal Training Diploma OriGym, Level 4 Advanced Sports Nutrition), „verified by” Abbie Watkins, „Last updated 2 July 2026” (wg narzędzia) | #8 Standing Arms-Behind-The-Back Bicep Stretch: ustawienie, uniesienie rąk z prostymi łokciami, łopatki razem; 4 błędy |
| w2g2-mss-nhs-flexibility | https://www.nhs.uk/live-well/exercise/flexibility-exercises/ | NHS (nhs.uk) | 4 — system ochrony zdrowia; „Page last reviewed: 20 November 2023” (= `nhs-flexibility` z W1) | Sideways bend: ustawienie i ruch |
| w2g2-mss-staywell-sidebend-vumc | https://healthlibrary.vanderbilthealth.com/RelatedItems/3,85887 | WebMD Ignite (StayWell) na stronie Vanderbilt Health | 4 — materiał dla pacjentów na stronie centrum medycznego, „Date Last Reviewed: 4/1/2024”, nazwani recenzenci (m.in. PT DPT). Ta sama organizacja co wszystkie `webmd-*` — w ćwiczeniu liczona raz | Back Exercises: Side Bend Stretch — wersja stojąca, ręce wzdłuż ciała; „Slowly bend to the left.”; „Don't twist your torso.”; „avoid rounding your back” |
| w2g2-mss-webmd-side-stretch | https://www.columbiadoctors.org/health-library/multimedia/side-stretch/ | WebMD Ignite na stronie ColumbiaDoctors | 4, ale ta sama organizacja co poprzednie — NIE liczone osobno; nie użyte w bloku | wersja z ręką nad głową (zgodna z figurą: lewa ręka nad głową) — „Raise one arm over your head, and then lean to the other side.” |
| w2g2-mss-parkview-wall | https://www.parkview.com/blog/experts-in-motion-wall-stretches | Parkview Health (Parkview Sports Medicine) | **do decyzji: 4 wg uzupełnienia 2** (szpital/system ochrony zdrowia, jawne firmowanie „© 2026 Parkview Health”; autorka Tiffany Patterson, „lead performance specialist”, bez podanych kwalifikacji; „Last Modified: August 02, 2025”; bez reklam produktów obcych) — przeliczenie G2 przyjęło 5 „wg badacza” W1 | Back and shoulder stretch: dłonie na ścianie, kolana lekko ugięte, biodra w tył, ręce wyciągnięte |
| w2g2-mss-ace-198 | https://www.acefitness.org/resources/everyone/exercise-library/198/ | ACE | 4 (= `ace-198` z W1) | 90 Lat Stretch (stół): kolana lekko ugięte, zgięcie w biodrach z płaskimi plecami, ręce proste, biodra w tył; „Be sure not to fully “lock” the knees” |
| w2g2-mss-kentcht-stretching | https://www.kentcht.nhs.uk/?p=41139 | Kent Community Health NHS FT | 4 — trust NHS; „Published and last edited 26/03/2025” | nie użyte w bloku: rozciąganie tyłu uda ze stopą na podwyższeniu, „legs straight”, „lean forward with a straight back” (Toe Touches — tylko wariant, patrz Otwarte) |
| w2g2-mss-prehab-pec-biceps | https://theprehabguys.com/vimeo-video/pec-and-bicep-stretch/ | The Prehab Guys | 5 — strona bez autora (data publikacji 22.03.2020, aktualizacja 19.08.2021); warunek „artykuł z autorem” niespełniony. Nie liczone | zgodne kierunkowo: dłonie splecione za plecami, łopatki razem, klatka w górę, uniesienie rąk |
| w2g2-mss-kmpt-stretches | https://www.kentmedwaymentalhealth.nhs.uk/media/2613/km1237-physiotherapy-stretches-exercise-booklet.pdf | Kent and Medway NHS and Social Care Partnership Trust | 4 — trust NHS, fizjoterapeuci KMPT (s. 1) | przeczytane s. 1–5: brak ćwiczeń z tego zakresu (pośladek, tył uda leżąc, przywodziciele, udo leżąc, łydka, pozycja dziecka, kot, wyprost pleców) — nie użyte |

## 5. Otwarte

- **Standing Toe Touches** — drugie źródło szczebla 4 nie znalezione. `toeSet` („kolana możesz lekko ugiąć”): WebMD Ignite (Columbia, wariant jednonóż) „bend your knees slightly” vs Kent CHT (wariant ze stopą na podwyższeniu) „keeping your legs straight” — źródła różne, część wspólna tylko „stań prosto”. `toeMove`: wprost tylko WebMD Ignite (wariant) + Illinois/UKY (szczebel 5 wg przeliczenia). Błąd „zaokrąglone plecy”: WebMD Ignite („Keeping your back flat”) + Kent CHT („lean forward with a straight back”) — dwa źródła 4, oba warianty; do wpisu dopiero, gdy ćwiczenie będzie miało ustawienie i ruch. Przeszukano: wyszukiwarka (NHS trusty, szpitale, ACE — ACE nie ma w bibliotece stojącego skłonu do palców), Kent CHT, KMPT, Physitrack (5).
- **Standing Pelvic Tilt** — wersja stojąca tylko na platformach ćwiczeń i w bibliotekach aplikacji (nie źródło) oraz Prehab Guys bez autora (5). Szpitalne strony (Cedars-Sinai, UMass, U-M Health) opisują wersję leżącą — inne ustawienie. Ćwiczenie ma też wyjątek figury (ruch niewidoczny w szkielecie).
- **Round The World Shoulder Stretch** — postać nieustalona: figura v2 `ramie_duzy_luk` (duży łuk ramienia), pole „recommended: bands” w starym zestawie pól katalogu (`scripts/equipment/catalog-1002-fields.json`), w obecnym katalogu brak sprzętu. Znalezione opisy (przekładanie drążka/gumy, „around the world” przy ścianie) — Physitrack, Prehab Guys, serwisy aplikacji: szczebel 5 albo nie źródło. Najpierw ustalić postać (sprawa katalogu/figury).
- **Chest Stretch on Stability Ball** — nie badane ponownie; stan z W1 (postać nieustalona, brak źródeł ≤ 4).
- **Standing Lateral Stretch — ręka nad głową** (figura: lewa ręka nad głową): WebMD Ignite (Columbia; StayWell/Vanderbilt „Stretch your right arm overhead”) — jedna organizacja; NHS — ręce wzdłuż ciała. Wskazówka „druga ręka nad głową” — jedno źródło (organizacja), nie wpisana. `sb.plane` — StayWell/Vanderbilt + ACE #212 (wariant siedzący); nie dopisałem do `tips`, bo pokrywa się z błędami `sideTwist` / `sideForward`.
- **Standing Biceps / Chest — kierunek dłoni:** OriGym „palms facing in towards your body”, MedlinePlus „palms facing up”, Healthline (W1) „palms … face down” — różne; zdania nie określają kierunku dłoni.
- **„Nie unoś rąk na siłę za wysoko”** (OriGym #8) i „do not force your chest forward” (ACE #209) — różne kryteria; nie wpisane (`st.mis.force` wymaga dwóch źródeł dla tego ćwiczenia).
- **Wall Lat — „plecy płasko”, „broda schowana”** (figura `lat_plecy_plasko`): tylko ACE #198; Parkview nie podaje. Błąd „zaokrąglone plecy” nie wpisany.
- Czasy trzymania (ACE 15–30 s, MedlinePlus 10–20 s, OriGym 20–30 s, Parkview 20–30 s) — liczby, poza blokiem.

## 6. Uwagi dla integratora

1. **Postać Standing Chest Stretch.** W1 przyjęło postać „Elbows Back” (dłonie na dole pleców, łokcie w tył). Źródło tej postaci w repo to tylko alias nazwy z otwartego katalogu (`lib/catalog.generated.ts:2845`, mapa `"Elbows Back":"Standing Chest Stretch"`; otwarty katalog = szczebel 5). Figura v2 rysuje ręce proste za plecami, dłonie splecione (`scripts/figures/agent-pozy/mobility_stand.mjs:37`, reguła `rece_proste_za_plecami` w `data/zrodla/figury-sens.json:6854–6863`, źródło ACE #209 wariant). Karta w bloku opisuje postać figury. Jeśli właściciel woli postać ACE #209 bez splatania (ręce wzdłuż ciała), karta wymaga zmiany figury i drugiego źródła dla tej postaci (W1: brak).
2. **Trzy ćwiczenia, ta sama poza.** Standing Chest Stretch, Standing Biceps Stretch i Chest And Front Of Shoulder Stretch (W1) mają teraz to samo ustawienie (`claspSet`) i prawie ten sam ruch; biceps różni się uniesieniem rąk (`bicepsMove`). OriGym (strona o bicepsie) liczę dla błędu `archLow` przy Standing Chest Stretch, bo opisuje identyczną pozycję — recenzent oceni, czy to dopuszczalne; bez tego błąd ma jedno źródło (ACE #209) i powinien zostać pominięty.
3. **Szczebel Parkview.** Uzupełnienie 2 (szczeble, tabela pierwsza) daje szpitalom i systemom ochrony zdrowia szczebel 4 „z samego firmowania”; przeliczenie G2 (wiersz reguły, „Parkview — 5 wg badacza”) zostawiło 5 na podstawie oceny W1 (blog, autorka bez kwalifikacji). Rozstrzyga koordynator; od tego zależy Wall Lat Stretch.
4. Błędy wnioskowane podają id zaprzeczanego zdania; tam, gdzie jest też źródło, dopisałem je obok (kontrola dla recenzenta).
5. Standing Lateral Stretch: w W1 drugim źródłem była strona WebMD Ignite na portalu UMass (szczebel 5 wg przeliczenia). Zastępuje ją ta sama treść StayWell na stronie Vanderbilt Health (data przeglądu i recenzenci widoczne) — to nadal jedna organizacja WebMD Ignite, więc liczona raz, obok NHS.
