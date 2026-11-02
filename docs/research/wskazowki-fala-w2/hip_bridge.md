# Wskazówki techniki — rodzina `hip_bridge` (fala W2)

Data: 02.11.2026 · rodzina: `hip_bridge` · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: stan po W1 — `przeliczenie-szczebli-2026-11-02.md` (gałąź badania/g4-nogi; sekcje „leg_isolation.md, hip_bridge.md,
glute_floor.md” i „Blok do wdrożenia”) jest nadrzędny wobec korekt w pliku W1 `hip_bridge.md`. Szczeble: `szczeble-organizacji-2026-11-02.md`
(gałąź badania/lokalne-0211) z uzupełnieniami 1–3 i rozstrzygnięciami W1 (Major Fitness `/blogs/wiki/` = 5, Prehab Guys bez autora = 5,
sprzedawcy = 5). Wszystkie strony z tabeli Źródła przeczytane 02.11.2026 (WebFetch; NSCA — strony 59–60 z pliku PDF obejrzane bezpośrednio).
Ćwiczenia z kartą własną (`own` w `cue-sets.json`: Glute Bridge, Hip Thrust (sztanga), Hip Thrust (hantel)) — poza zakresem.

Reguła wariantu sprzętu (brief W2): Smith, maszyna i sztanga na podłodze korzystają ze źródeł wersji bazowej jako
`uproszczenie: wariant sprzętu <baza>`. Uzasadnienie przy każdej karcie w tabeli niżej.

## Ćwiczenia

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Glute Bridge (sztanga) | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu Glute Bridge) | nowe `gb.bbSetup`; ACE 318 (mostek ze sztangą na podłodze, czytany 02.11) + NASM Floor Bridge jako baza; `gb.move`, `gb.heels`, `ht.mis.arch` | `ht.hold` — tylko ACE (318) → otwarte. Uzasadnienie wariantu: ACE 318 opisuje ten sam ruch co mostek (stopy na podłodze, uniesienie i opuszczenie bioder), różni się tylko sztanga na biodrach |
| Single Leg Hip Thrust | tak | **gotowe z błędem** | drugie źródło szczebla 4: ISSA (sekcja „4. Single-Leg Hip Thrust”, firmowane, 05.02.2024); nowe brzmienie `ht.slSetup`; `ht.move`, `ht.rigid`, `ht.mis.arch` | pozycja wolnej nogi — źródła różne (Catalyst: prosta; ISSA: „lekko nad podłogą”), zdanie podaje część wspólną. `ht.rigid`/`ht.mis.arch`: drugie źródło to NSCA o wersji obunóż — uproszczenie (ISSA: poza jedną nogą ruch jak w podstawowym) |
| Smith Machine Hip Thrust | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu Hip Thrust (sztanga)) | `ht.setup`, `ht.move`, `ht.rigid`, `ht.mis.arch` ze źródeł wersji ze sztangą (ACE Certified 7403, NSCA, ISSA); ISSA wymienia Smitha jako sposób wykonania tego samego ćwiczenia | zdjęcie sztangi z haków (`ht.smithUnhook`) — Major Fitness i Dynamo = 5 → otwarte. Uzasadnienie wariantu: gryf Smitha leży tak samo w zgięciu bioder, plecy na ławce, ruch bioder ten sam; różni się tylko prowadzenie gryfu w szynach |
| Machine Hip Thrust | tak | **gotowe z błędem** (uproszczenie: wariant sprzętu Hip Thrust (sztanga)) | `ht.machSetup` (nowe brzmienie, bez szerokości stóp), `ht.move`, `ht.rigid`, `ht.mis.arch`: Bells of Steel (4 dla własnej maszyny) + baza (ACE Certified 7403, NSCA) | `ht.machNoRest` — różnica źródeł (Bells of Steel: ciężar nie dotyka podłoża; NSCA: technika standardowa — sztanga lekko wraca na ziemię) → otwarte; maszyny z wałkiem zamiast pasa — otwarte |
| Single Leg Glute Bridge | tak | gotowe z błędem (W1) | bez zmian (karta w „Bloku do wdrożenia” przeliczenia W1; błąd `ht.mis.arch` z 2 źródeł) | — |
| Frog Pump | tak | otwarte | wyszukiwanie ponowione 02.11 — wyniki: serwisy bez autora, aplikacje, sklepy | 2 źródła szczebla 4 |
| Stability Ball Hip Bridge | tak | otwarte | wyszukiwanie ponowione 02.11 — tylko wersje „stopy na piłce” (inne ćwiczenie) i strony szczebla 5 | źródło o wersji „łopatki na piłce, stopy na podłodze” |
| London Bridges | nie | otwarte — błędna rodzina | opis niżej (bez badania jako mostka, polecenie koordynatora) | decyzja o rodzinie |

**London Bridges** (opis, bez researchu): w katalogu (`docs/research/equipment/catalog.json`, wpis „London Bridges”, pole `note`)
to zejście rękami po zwisającej linie ze stania na zablokowanej sztandze Smitha lub skrzyni do poziomu i powrót — ćwiczenie chwytu
i przyciągania (mięśnie w katalogu: najszersze grzbietu, przedramiona, biceps). Do rodziny trafia tylko przez dopasowanie po słowie
„london bridges” w `lib/figures/v2/families.ts:103`; nie ma pozy v2. Ruch nie ma nic wspólnego z mostkiem biodrowym.

### Blok do wdrożenia

```json
{
  "Glute Bridge (sztanga)": {
    "setup": [{"c": "gb.bbSetup", "s": [["ace-318", "opis, zdania 1–2 (lie underneath the bar, top of the hips directly under the bar; feet flat on the ground hip-width apart)"], ["acecert-7403", "The Origins of the Hip Thrust (lying face-up on the floor… knees bent and feet flat; barbell across the top of the hips, usually on a pad) — ta sama organizacja co ace-318"], ["nasm-floor-bridge", "Step 1: Setup (uproszczenie: wariant sprzętu Glute Bridge — bez sztangi)"]]}],
    "move": [{"c": "gb.move", "s": [["ace-318", "opis, zdania 4–5 (press the feet into the floor and lift the hips; slowly lower the tailbone)"], ["nasm-floor-bridge", "Step 3; Step 4 (uproszczenie: wariant sprzętu Glute Bridge)"], ["ace-49", "Step 2; Step 3 (linia barki–biodra–kolana; uproszczenie: wariant sprzętu Glute Bridge)"]]}],
    "tips": [{"c": "gb.heels", "s": [["ace-49", "Step 2 (press your heels into the floor; uproszczenie: wariant sprzętu Glute Bridge)"], ["nasm-floor-bridge", "Step 3; FAQ (driving through your heels; uproszczenie: wariant sprzętu Glute Bridge)"]]}],
    "mistakes": [{"c": "ht.mis.arch", "s": [["ace-49", "wskazówka końcowa (uproszczenie: wariant sprzętu Glute Bridge)"], ["nasm-floor-bridge", "Common Mistakes; FAQ (uproszczenie: wariant sprzętu Glute Bridge)"]]}]
  },
  "Single Leg Hip Thrust": {
    "setup": [{"c": "ht.slSetup", "s": [["catalyst-723", "opis (upper back on a padded bench, one leg bent and foot flat on the floor, the other extended straight forward)"], ["issa-hip-thrust-variations", "4. Single-Leg Hip Thrust (one foot lifted slightly off the ground) + Basic Hip Thrust Technique (back on a bench, feet flat)"]]}],
    "move": [{"c": "ht.move", "s": [["catalyst-723", "opis (push through the floor… extend your hip maximally; return to the floor under control)"], ["issa-hip-thrust-variations", "4. Single-Leg Hip Thrust (opposite glute controls the hip extension) + Basic Hip Thrust Technique (press hips up, pause, lower)"]]}],
    "tips": [{"c": "ht.rigid", "s": [["catalyst-723", "opis (ensure the motion is at the hip and not excessive lumbar extension)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (extension movement comes from the hips, not from the lumbopelvic region; uproszczenie: wersja obunóż — ISSA: poza jedną nogą jak w podstawowym)"]]}],
    "mistakes": [{"c": "ht.mis.arch", "s": [["catalyst-723", "opis (not excessive lumbar extension)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (excessive lumbar hyperextension; uproszczenie: wersja obunóż)"]]}]
  },
  "Smith Machine Hip Thrust": {
    "setup": [{"c": "ht.setup", "s": [["acecert-7403", "The Origins of the Hip Thrust (shoulders resting on a bench, knees bent, feet flat; barbell across the top of the hips, usually on a pad; uproszczenie: wariant sprzętu Hip Thrust (sztanga))"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (upper back across a padded bench; pad the barbell; bar at the crease of the hips; feet flat; uproszczenie: wariant sprzętu Hip Thrust (sztanga))"], ["issa-hip-thrust-variations", "5. Smith Machine Hip Thrust (Smith jako sposób wykonania tego ćwiczenia)"]]}],
    "move": [{"c": "ht.move", "s": [["acecert-7403", "akapit wstępny (lowers the tailbone… presses the hips upward; wariant sprzętu)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 60 (hips rise until torso parallel; eccentric under control; wariant sprzętu)"], ["issa-hip-thrust-variations", "Basic Hip Thrust Technique (wariant sprzętu)"]]}],
    "tips": [{"c": "ht.rigid", "s": [["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (extension comes from the hips, not from the lumbopelvic region; wariant sprzętu)"], ["bos-hip-thrust-machine", "Signs You've Set Up Wrong (hyperextending your back rather than using your glutes; analogia: maszyna)"]]}],
    "mistakes": [{"c": "ht.mis.arch", "s": [["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (excessive lumbar hyperextension; wariant sprzętu)"], ["bos-hip-thrust-machine", "Signs You've Set Up Wrong (hyperextending your back; analogia: maszyna)"]]}]
  },
  "Machine Hip Thrust": {
    "setup": [{"c": "ht.machSetup", "s": [["bos-hip-thrust-machine", "3. Position Yourself (upper back resting against the bench or pad; secure the strap over your hips; feet flat on the footplate)"], ["acecert-7403", "The Origins of the Hip Thrust (shoulders resting on a bench, feet flat, load across the hips; uproszczenie: wariant sprzętu Hip Thrust (sztanga))"]]}],
    "move": [{"c": "ht.move", "s": [["bos-hip-thrust-machine", "5. Perform the Thrust (pushing your hips upward; lower your hips back down)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 60 (wariant sprzętu)"], ["issa-hip-thrust-variations", "Basic Hip Thrust Technique (wariant sprzętu)"]]}],
    "tips": [{"c": "ht.rigid", "s": [["bos-hip-thrust-machine", "Signs You've Set Up Wrong (hyperextending your back rather than using your glutes)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (wariant sprzętu)"]]}],
    "mistakes": [{"c": "ht.mis.arch", "s": [["bos-hip-thrust-machine", "Signs You've Set Up Wrong (hyperextending your back rather than using your glutes)"], ["nsca-scj-hip-thrust", "Exercise Technique, s. 59 (excessive lumbar hyperextension; wariant sprzętu)"]]}]
  }
}
```

Uwaga: `ht.rigid` i `ht.mis.arch` przy Smith Machine Hip Thrust — drugie źródło (Bells of Steel) opisuje maszynę, nie Smitha:
analogia, oznaczona. Gdyby koordynator jej nie przyjął, oba zdania mają jedno źródło szczebla 3 (NSCA) — „jedno źródło”; karta
nadal ma ustawienie i ruch z 3 źródeł (ACE, NSCA, ISSA), a błąd spadłby do „jedno źródło” (reguła docs/18:147 wymaga ≥1 błędu).

## Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| `gb.bbSetup` | Połóż się na plecach pod sztangą, tak żeby leżała na biodrach; kolana ugięte, stopy płasko na podłodze na szerokość bioder. | Lie on your back under the bar so it rests across your hips; knees bent, feet flat on the floor, hip-width apart. | `gb.setup` nie mówi o sztandze; ACE 318 zdania 1–2. Zastępuje propozycję W1 `gb.bbSetup` (dodane „na szerokość bioder” z ACE 318) |
| `ht.slSetup` | Oprzyj plecy o ławkę, jedną stopę postaw płasko na podłodze, drugą nogę unieś nad podłogę. | Rest your back against a bench, one foot flat on the floor, the other leg lifted off the floor. | Część wspólna Catalyst 723 (noga prosta) i ISSA (stopa lekko nad podłogą). Zastępuje propozycję W1 („wyprostuj albo przyciągnij kolano do klatki” — wersja z kolanem tylko w Prehab Guys = 5) |
| `ht.machSetup` | Oprzyj górną część pleców o oparcie, zapnij pas na biodrach, stopy płasko na platformie. | Rest your upper back on the pad, fasten the strap across your hips, feet flat on the platform. | Brzmienie W1 bez „mniej więcej na szerokość barków” (tylko Bells of Steel; ISSA podaje to dla wersji ze sztangą — nie dokładam) |

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `ace-318` (istnieje) | https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/ | ACE | firmowane ACE, bez daty; sprzęt: sztanga | 4 — organizacja szkoląca trenerów, treść firmowana |
| `acecert-7403` (istnieje) | https://www.acefitness.org/continuing-education/certified/november-2019/7403/understanding-the-barbell-hip-thrust/ | ACE (to samo źródło co ace-318) | Pete McCall, MS, CSCS; XI 2019 | 4 — liczone razem z ace-318 jako jedno źródło |
| `ace-49` (istnieje) | https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/ | ACE | firmowane ACE | 4 (tylko jako baza wariantu) |
| `nasm-floor-bridge` (istnieje) | https://www.nasm.org/resource-center/exercise-library/floor-bridge | NASM | firmowane NASM | 4 (baza wariantu) |
| `nsca-scj-hip-thrust` (nowe, z W1) | Contreras B, Cronin J, Schoenfeld B. Barbell Hip Thrust. Strength Cond J 33(5):58–61, 2011; kopia czytana: https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf | NSCA (czasopismo) | autorzy naukowi; X 2011; strony 59–60 z nagłówkiem czasopisma i stopką wydawcy | 3 — recenzowane czasopismo (jak W1). Kopia na stronie trzeciej; tekst zgodny z układem stron czasopisma |
| `issa-hip-thrust-variations` (nowe) | https://issaonline.com/blog/post/hip-thrusts-benefits-and-variations-for-stronger-glutes | ISSA | firmowane „ISSA”, 05.02.2024 | 4 — organizacja szkoląca trenerów; szczeble-organizacji: „artykuł z autorem i datą albo firmowany ISSA”. Strona kończy się reklamą kursu ISSA (poza treścią techniki) |
| `catalyst-723` (nowe, z W1) | https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/ | Catalyst Athletics | biblioteka firmowana, bez daty | 4 — lista koordynatora |
| `bos-hip-thrust-machine` (nowe, z W1) | https://bellsofsteel.us/blogs/content/how-to-do-hip-thrusts-with-a-machine | Bells of Steel | firmowane, 27.05.2024, bez autora | 4 tylko dla maszyny do hip thrustu (producent własnego rodzaju sprzętu); przy Smicie — analogia |

Cytaty (po 1 zdaniu): ACE 318 — „Place a barbell on the ground and lie underneath it so that the top of the hips are directly under the bar.”
ISSA — jedna stopa „lifted slightly off the ground”, a pośladek drugiej nogi kontroluje wyprost biodra. NSCA s. 59 — „the extension movement
comes from the hips, not from the lumbopelvic region.” Bells of Steel — „Secure the strap over your hips.”

## Otwarte

| ćwiczenie / zdanie | powód |
|---|---|
| Glute Bridge (sztanga) — `ht.hold` | tylko ACE (318 zdanie 3); NSCA mówi o chwycie sztangi tylko przy jej przetaczaniu |
| Smith Machine Hip Thrust — zdjęcie z haków | Major Fitness (`/blogs/wiki/`) i Dynamo (sprzedawca) = 5 |
| Machine Hip Thrust — `ht.machNoRest` | różnica źródeł: Bells of Steel — ciężar nie dotyka podłoża; NSCA s. 60 — w technice standardowej sztanga lekko wraca na ziemię, „stałe napięcie” to osobna strategia; ISSA — opuszczasz i wypychasz, zanim pośladki dotkną podłogi. Brak części wspólnej do zdania |
| Machine Hip Thrust — maszyny z wałkiem | `ht.machSetup` mówi o pasie (Bells of Steel); instrukcje TKO (PDF u sprzedawcy) — 403 |
| Hip thrust (wszystkie) — kolana nad palcami | NSCA s. 59 („knees should track directly over the toes and not cave inward”) — jedno źródło; drugiego nie ma |
| Hip thrust — `gb.heels` | NSCA s. 59: stopy płasko, nacisk całą stopą, ewentualnie przez pięty — nie dokładam `gb.heels` do wersji z ławką |
| Frog Pump, Stability Ball Hip Bridge | brak 2 przeczytanych źródeł szczebla 4 (wyniki 02.11: aplikacje, sklepy, strony bez autora) |
| London Bridges | błędna rodzina (`families.ts:103`); decyzja koordynatora |
| Zestawy ogólne (`cue-sets.json`) | po wdrożeniu kart: Glute Bridge (sztanga), Single Leg Hip Thrust, Smith, Machine — zmiana na kartę własną; zestaw Single Leg Hip Thrust zawiera `gb.move`/`gb.heels` bez źródeł dla tej wersji (W1) |
