# Wskazówki techniki — rodzina `mobility_stand`, część: rozciągania statyczne (2)

Kontynuacja `mobility_stand-statyczne.md`. Data: 02.11.2026. Autor: badacz-merytoryczny (agent), fala W1, grupa G2 mobilność.

**Metoda.** Jak w części 1: strony czytane przez WebFetch, PDF-y z zapisanego pliku jako obraz strony; zdanie „gotowe”, gdy potwierdzają je
≥ 2 przeczytane źródła szczebla ≤ 4 z różnych organizacji (wariant ćwiczenia liczy się z dopiskiem „wariant”). Zdania `st.*` tylko tam, gdzie
przeczytane źródła obejmują TO ćwiczenie. Platformy ćwiczeń dla fizjoterapeutów, biblioteki aplikacji i wydawcy arkuszy ćwiczeń dla klinik
nie są liczone. Liczby (czas trzymania, powtórzenia) nie wchodzą do zdań. Id źródeł i zdań z części 1 użyte bez zmian.
Szczeble ocenione wg „Rozstrzygnięcia szczebli źródeł” koordynatora (02.11.2026): przy każdym nowym źródle kryteria (a) rodzaj wydawcy,
(b) autor + data albo treść firmowana, (c) brak marketingu — tabela „Nowe źródła”.

## Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| Standing Toe Touches | gotowe | 3 organizacje (dwie uczelnie — materiały extension — i WebMD Ignite na stronie Columbia, wariant jednonóż) |
| Wall Lat Stretch | otwarte (warunkowo gotowe) | ACE #198 (wariant: dłonie na stole) + blog szpitala Parkview; Parkview nie spełnia jednoznacznie kryterium (a) (blog szpitala, autor: specjalista przygotowania motorycznego, bez wzmianki o recenzji eksperckiej) → dane w bloku „warunkowe”, NIE do `exercises`, dopóki koordynator nie uzna szczebla 4 |
| Chest And Front Of Shoulder Stretch | gotowe | ZAŁOŻENIE postaci: dłonie splecione za plecami (ACE #209 krok 3 nazywa ten wariant rozciąganiem przedniej części barku); kierunek dłoni źródła różnią — w „Otwarte” |
| One Knee To Chest | gotowe | wersja LEŻĄC (obie organizacje opisują leżenie na plecach; katalog zaleca matę) — figura rodziny „stojącej” do sprawdzenia |
| Overhead Stretch | częściowe | ruch gotowy; ustawienie słabe (drugie źródło mówi tylko „siedząc albo stojąc”); wskazówki po jednym źródle |
| Chest Stretch on Stability Ball | otwarte | postać nieustalona; nie znaleziono źródła szczebla ≤ 4 (tylko platformy ćwiczeń i biblioteki aplikacji) |

Uzupełnienie do części 1 (ćwiczenia już opisane): zdania `st.noBounce`, `st.breathe`, `st.mis.force` dla **Wall Calf Stretch** i **Overhead Triceps Stretch** — osobny blok niżej.

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "Standing Toe Touches": {
    "setup": [
      {"c": "mobility_stand.s.toeSet", "s": [["webmd-hamstring-standing", "krok 1: „…bend your knees slightly.” (wariant: jedna noga w przód)"], ["illinois-forward-fold", "krok 2: „Keep your knees a little bent if needed.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.toeMove", "s": [["illinois-forward-fold", "krok 1: „…bend forward from your hips, keeping your back straight and reaching for your toes.”"], ["uky-hsw-ap-006", "s. 4, Hamstring Stretch, kroki 2–3: skłon z bioder, plecy proste, rozciąganie z tyłu ud (wariant: dłonie na oparciu krzesła)"], ["webmd-hamstring-standing", "krok 3: „Keeping your back flat, bend forward at your hips.” (wariant)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.s.mis.roundBack", "s": [["illinois-forward-fold", "krok 1: „keeping your back straight”"], ["uky-hsw-ap-006", "s. 4, Hamstring Stretch, krok 2: „keeping back and shoulders straight at all times”"], ["webmd-hamstring-standing", "krok 3: „Keeping your back flat…”"]]}
    ]
  },
  "Chest And Front Of Shoulder Stretch": {
    "setup": [
      {"c": "mobility_stand.s.claspSet", "s": [["ace-209", "Step 1 (stań prosto) i Step 3: „extend your arms behind your back, clasping your hands together”"], ["medlineplus-chest-stretch", "„Clasp your hands behind your back with your palms facing up.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.claspMove", "s": [["ace-209", "Step 2: łopatki ściągnięte, „slightly lift your chest up and out”; Step 3: wariant rozciąga przednią część barku"], ["medlineplus-chest-stretch", "„…press your shoulder blades together. Your chest should stick out.”; rozciąganie w ramionach i klatce"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "One Knee To Chest": {
    "setup": [
      {"c": "mobility_stand.s.kneeChestSet", "s": [["webmd-single-knee-chest", "krok 1: „Lie on your back with your knees bent and your feet flat on the floor.”"], ["arthritis-uk-knee-chest", "„Lying on your back with bent knees…”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.kneeChestMove", "s": [["webmd-single-knee-chest", "krok 2: „Clasp your hands under one knee and bring the knee to your chest.”"], ["arthritis-uk-knee-chest", "„Pull your knee gently closer to your chest…”"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Overhead Stretch": {
    "setup": [
      {"c": "mobility_stand.s.overheadSet", "s": [["webmd-overhead-stretch", "kroki 1–2: stań swobodnie, „Looking straight ahead…”"], ["duke-oeso-stretches", "s. 1–2, Overhead Stretch: „While sitting or standing…” (potwierdza tylko pozycję stojącą)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.overheadMove", "s": [["webmd-overhead-stretch", "krok 2: „…raise both arms over your head and reach toward the ceiling.”"], ["duke-oeso-stretches", "s. 1–2, Overhead Stretch: „…push both arms straight up…”"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

### Warunkowe — Wall Lat Stretch (NIE wklejać, dopóki szczebel `parkview-wall-stretches` nie zostanie uznany za 4)

```json
{
  "Wall Lat Stretch": {
    "setup": [
      {"c": "mobility_stand.s.latSet", "s": [["parkview-wall-stretches", "Back and shoulder stretch, krok 1: „Put your hands on the wall. Bend your knees slightly.”"], ["ace-198", "Step 2: lekko ugięte kolana, wyprostowane ręce oparte o podporę (wariant: stół)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.latMove", "s": [["parkview-wall-stretches", "Back and shoulder stretch, krok 2: „Hinge at your hips and push back.”; krok 3: ręce wyciągnięte"], ["ace-198", "Step 3: dłonie na podporze, „leaning back into your hips”, tułów bliżej podłogi (wariant: stół)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

### Uzupełnienie części 1 — dodatkowe wpisy (do dopisania w istniejących kluczach)

```json
{
  "Wall Calf Stretch": {
    "tips": [
      {"c": "st.noBounce", "s": [["ccv-flexibility", "zasady ogólne (obejmują Calf stretch): bez sprężynowania"], ["duke-oeso-stretches", "s. 2, stopka: „Stretches should be gentle and slow, but not bouncy.” (dotyczy Sprinters Stretch — łydka, wariant z oparciem o krzesło)"]]},
      {"c": "st.breathe", "s": [["ccv-flexibility", "zasady ogólne: nie wstrzymuj oddechu"], ["uky-hsw-ap-006", "s. 1, Stretching Safely: „Remember to BREATHE; do not hold your breath in a stretch.”; s. 5, Calves, krok 7"]]}
    ],
    "mistakes": [
      {"c": "st.mis.force", "s": [["ccv-flexibility", "zasady ogólne: nie dociskaj rozciągania, które boli (parafraza)"], ["uky-hsw-ap-006", "s. 1, Stretching Safely: przy bólu „you are stretching too far”; s. 5, Calves: „you should not feel pain”"], ["duke-oeso-stretches", "s. 2, stopka: „Do not stretch to the point of pain.” (Sprinters Stretch, wariant)"]]}
    ]
  },
  "Overhead Triceps Stretch": {
    "tips": [
      {"c": "st.noBounce", "s": [["ccv-flexibility", "zasady ogólne (obejmują Triceps stretch)"], ["duke-oeso-stretches", "s. 2, Back Scratcher (ręce nad głową, łokieć dociągany drugą ręką) + stopka „not bouncy”"]]},
      {"c": "st.breathe", "s": [["ccv-flexibility", "zasady ogólne"], ["uky-hsw-ap-006", "s. 1, Stretching Safely; s. 4, Triceps Stretch, krok 8 (wariant z ręcznikiem)"]]}
    ],
    "mistakes": [
      {"c": "st.mis.force", "s": [["ccv-flexibility", "zasady ogólne"], ["duke-oeso-stretches", "s. 2, stopka (Back Scratcher)"], ["uky-hsw-ap-006", "s. 1, Stretching Safely (Triceps Stretch, wariant z ręcznikiem)"]]}
    ]
  }
}
```

Uwaga: `ccv-flexibility` w części 1 opisane jako zasady ogólne obejmujące łydkę i triceps (sprężynowanie, oddech, ból) — miejsce jak tam.
`duke-oeso-stretches` liczę dla łydki i tricepsa tylko jako wariant (Sprinters Stretch przy krześle; Back Scratcher = triceps nad głową).
Zastrzeżenie: uzupełnienie opiera się na `ccv-flexibility`, `uky-hsw-ap-006`, `duke-oeso-stretches` — wszystkie trzy mają szczebel „PROPOZYCJA” (patrz tabela); bez ich uznania blok nie spełnia reguły 2 źródeł.

## Nowe zdania

| Id | PL | EN (propozycja) | Uwaga |
|---|---|---|---|
| mobility_stand.s.toeSet | Stań prosto; kolana możesz lekko ugiąć. | Stand tall; it's fine to keep a slight bend in your knees. | WebMD Ignite, Illinois Extension |
| mobility_stand.s.toeMove | Pochyl się z bioder z prostymi plecami i sięgnij w stronę palców stóp, aż poczujesz rozciąganie z tyłu ud. | Hinge at the hips with a flat back and reach toward your toes until you feel the backs of your thighs stretch. | Illinois, Univ. of Kentucky, WebMD Ignite |
| mobility_stand.s.mis.roundBack | Zaokrąglanie pleców przy skłonie. | Rounding your back as you bend forward. | jw. (źródła: „plecy proste/płaskie”) |
| mobility_stand.s.latSet | Stań przodem do ściany, oprzyj o nią dłonie i lekko ugnij kolana. | Face the wall, put your hands on it and bend your knees slightly. | warunkowe: Parkview, ACE #198 (wariant: stół) |
| mobility_stand.s.latMove | Zegnij się w biodrach i odsuń biodra do tyłu; ręce zostają wyprostowane na ścianie. | Hinge at the hips and push them back, arms straight with your hands on the wall. | warunkowe: Parkview, ACE #198 |
| mobility_stand.s.claspSet | Stań prosto i spleć dłonie za plecami. | Stand tall and clasp your hands behind your back. | ACE #209, MedlinePlus |
| mobility_stand.s.claspMove | Ściągnij łopatki i lekko unieś klatkę — poczujesz rozciąganie w klatce i z przodu ramion. | Squeeze your shoulder blades together and lift your chest a little — you'll feel it across your chest and the front of your shoulders. | ACE #209, MedlinePlus |
| mobility_stand.s.kneeChestSet | Połóż się na plecach, kolana ugięte, stopy na podłodze. | Lie on your back, knees bent, feet flat on the floor. | WebMD Ignite, Arthritis UK |
| mobility_stand.s.kneeChestMove | Złap jedno kolano i delikatnie przyciągnij je do klatki. | Hold one knee and gently pull it toward your chest. | WebMD Ignite, Arthritis UK |
| mobility_stand.s.overheadSet | Stań swobodnie, patrz przed siebie. | Stand relaxed, looking straight ahead. | WebMD Ignite (pełne), Duke (tylko „stojąc”) |
| mobility_stand.s.overheadMove | Unieś obie ręce nad głowę i sięgnij w stronę sufitu. | Raise both arms overhead and reach for the ceiling. | WebMD Ignite, Duke |

## Nowe źródła

```json
{
  "illinois-forward-fold": {"org": "University of Illinois Extension", "title": "Forward Fold (Eat. Move. Save.)", "url": "https://eat-move-save.extension.illinois.edu/move/exercise/forward-fold", "level": 4},
  "uky-hsw-ap-006": {"org": "University of Kentucky Cooperative Extension", "title": "The Mind/Body Connection: Beginner Level Balance and Standing Stretches (HSW-AP.006)", "url": "https://fcs.mgcafe.uky.edu/sites/fcs.mgcafe.uky.edu/files/hsw-ap-006.pdf", "level": 4},
  "webmd-hamstring-standing": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Hamstring stretch (standing)", "url": "https://www.columbiadoctors.org/health-library/multimedia/hamstring-stretch-standing/", "level": 4},
  "ace-198": {"org": "ACE", "title": "90 Lat Stretch (#198)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/198/", "level": 4},
  "parkview-wall-stretches": {"org": "Parkview Health (Parkview Sports Medicine)", "title": "Experts in motion: Wall stretches", "url": "https://www.parkview.com/blog/experts-in-motion-wall-stretches", "level": 5},
  "medlineplus-chest-stretch": {"org": "MedlinePlus (U.S. National Library of Medicine)", "title": "Chest stretch (Medical Encyclopedia image page)", "url": "https://medlineplus.gov/ency/imagepages/19483.htm", "level": 4},
  "webmd-single-knee-chest": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Single knee-to-chest stretch", "url": "https://www.columbiadoctors.org/health-library/multimedia/single-knee-chest-stretch/", "level": 4},
  "arthritis-uk-knee-chest": {"org": "Arthritis UK (dawniej Versus Arthritis)", "title": "Knee to chest (single) — back pain exercises", "url": "https://www.arthritis-uk.org/information-and-support/living-with-arthritis/health-and-wellbeing/exercising-with-arthritis/exercises-for-healthy-joints/back-pain-exercises/knee-to-chest-single/", "level": 4},
  "webmd-overhead-stretch": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Overhead stretch", "url": "https://www.columbiadoctors.org/health-library/multimedia/overhead-stretch/", "level": 4},
  "duke-oeso-stretches": {"org": "Duke University Health System, Occupational and Environmental Safety Office", "title": "Stretches (handout, 2011)", "url": "https://www.safety.duke.edu/sites/default/files/Stretches.pdf", "level": 4}
}
```

| Id | Organizacja | Szczebel | (a) / (b) / (c) wg rozstrzygnięcia 02.11.2026 | Co potwierdza |
|---|---|---|---|---|
| webmd-hamstring-standing, webmd-single-knee-chest, webmd-overhead-stretch | WebMD Ignite na stronie ColumbiaDoctors (placówka medyczna) | 4 | (a) treść z recenzją kliniczną („Clinical Review Board”); (b) „Current as of: May 1, 2026”, „Author: WebMD Ignite Staff” (stopka każdej z 3 stron); (c) tak — spełnia warunek „placówka medyczna, z datą” | jedna organizacja — w każdym ćwiczeniu liczona raz |
| medlineplus-chest-stretch | MedlinePlus (NLM) | 4 | (a) redakcja + recenzja lekarska; (b) „Review Date 7/23/2024”, recenzent: lekarz (UW Medicine) i zespół redakcyjny A.D.A.M.; (c) tak | dłonie splecione za plecami, łopatki razem, klatka do przodu |
| ace-198 | ACE | 4 | (a) organizacja certyfikująca trenerów; (b) treść firmowana ACE; (c) tak | lat stretch z dłońmi na stole: ugięte kolana, biodra w tył, plecy płasko (wariant dla ściany) |
| illinois-forward-fold | University of Illinois Extension | 4 PROPOZYCJA | (a) materiał edukacyjny uczelni — recenzja ekspercka niewykazana; (b) tylko firmowane („University of Illinois Extension” w stopce), bez daty i autora; (c) tak | skłon z bioder, plecy proste, sięganie do palców, kolana lekko ugięte w razie potrzeby |
| uky-hsw-ap-006 | University of Kentucky Cooperative Extension | 4 PROPOZYCJA | (a) materiał edukacyjny uczelni (zasady bezpieczeństwa powołują National Institute on Aging); (b) autorki z kwalifikacjami, czerwiec 2011 (s. 6); (c) tak | skłon do tyłu ud z prostymi plecami (przy krześle); zasady ogólne: bez bólu, nie wstrzymuj oddechu; łydka przy ścianie; triceps z ręcznikiem |
| duke-oeso-stretches | Duke University Health System (BHP) | 4 PROPOZYCJA | (a) materiał BHP szpitala uczelnianego; (b) SŁABE — w treści brak nazwy organizacji i daty; firmuje go tylko domena safety.duke.edu (metadane PDF: OESO-DUHS, 2011); (c) tak | Overhead Stretch (ręce prosto w górę), Back Scratcher (triceps), Sprinters Stretch (łydka przy krześle); stopka: bez bólu, bez sprężynowania |
| arthritis-uk-knee-chest | Arthritis UK | 4 PROPOZYCJA | (a) organizacja zdrowia (charytatywna) — recenzja ekspercka niewykazana na stronie; (b) tylko firmowane (© Arthritis UK 2026), bez daty i autora; strona oznaczona jako tłumaczona automatycznie; (c) tak | leżenie na plecach z ugiętymi kolanami, kolano przyciągane do klatki |
| parkview-wall-stretches | Parkview Health | 5 (do czasu decyzji koordynatora) | (a) NIE jednoznacznie — blog szpitala, autor: specjalista przygotowania motorycznego, bez recenzji eksperckiej; (b) autor + „Last Modified: August 02, 2025”; (c) blog placówki (częściowo promocyjny) | dłonie na ścianie, ugięte kolana, zgięcie w biodrach i biodra w tył |

**Ryzyko dla koordynatora:** One Knee To Chest opiera się na WebMD Ignite + Arthritis UK, Overhead Stretch na WebMD Ignite + Duke, Standing Toe Touches na WebMD Ignite + 2 uczelniach — jeśli materiały uczelni/organizacji zdrowia bez wykazanej recenzji eksperckiej nie zostaną uznane za szczebel 4, te ćwiczenia spadają do „otwarte” (jedno źródło: WebMD Ignite). Chest And Front Of Shoulder (ACE + MedlinePlus) nie zależy od tej decyzji.

Uwaga o niezależności: Healthwise (strony m.in. kaiserpermanente, uofmhealth) traktuję jako tę samą organizację co WebMD Ignite (tak też rozstrzygnięcie koordynatora: „WebMD Ignite (Healthwise)”) — nie liczone osobno.
Wydawca arkuszy ćwiczeń dla klinik (strony „exkit” jednej z klinik, © wydawcy) — przeczytany dla Chest And Front Of Shoulder („Do not shrug shoulders”), nie liczony.

## Otwarte

- **Standing Toe Touches:** szerokość stóp (na szerokość bioder — tylko UKY „correct posture”); `st.*` — tylko UKY obejmuje skłon (oddech, bez bólu), drugiego źródła dla tego ćwiczenia brak.
- **Wall Lat Stretch:** szczebel Parkview (patrz wyżej). Poza tym „plecy płasko”, „broda lekko schowana”, „nie blokuj kolan”, „wydech przy odsuwaniu bioder”, „kciuki do sufitu pogłębiają” — tylko ACE #198. Wysokość dłoni na ścianie — nieustalona (Parkview nie podaje; ACE: stół).
- **Chest And Front Of Shoulder Stretch:** (1) postać ćwiczenia w katalogu nieustalona — przyjęto dłonie splecione za plecami (wariant ACE #209 nazwany rozciąganiem przedniego aktonu naramiennego); do potwierdzenia przy figurze. (2) Kierunek dłoni — ŹRÓDŁA RÓŻNE: ACE „pushing out through the hands and lifting up”, MedlinePlus „Pull your hands down” → do zdań weszła tylko część wspólna (dłonie splecione, łopatki razem, klatka lekko w górę). (3) „Bez wysuwania bioder i bez wyginania lędźwi” — tylko ACE #209. (4) „Nie unoś barków” — tylko wydawca arkuszy dla klinik (nie liczony).
- **One Knee To Chest:** „druga stopa zostaje na podłodze” i „lędźwie przyciśnięte do podłogi” — tylko WebMD Ignite; chwyt (pod kolanem vs „hold on to it with one hand”) — bez części wspólnej poza „złap kolano”. Pozycja leżąca a rodzina `mobility_stand` i wyjątek figury — do decyzji koordynatora/recenzenta ruchu.
- **Overhead Stretch:** „spleć palce, dłonie wnętrzem do sufitu” — tylko Duke; „nie odchylaj głowy do tyłu” — tylko WebMD Ignite; Duke dodaje „straight up and back slightly” — nie wpisane. `st.noBounce` / `st.mis.force` — tylko stopka Duke.
- **Chest Stretch on Stability Ball:** nie ustalono postaci (klęk z przedramieniem na piłce vs leżenie plecami na piłce); znalezione opisy wyłącznie na platformach ćwiczeń dla fizjoterapeutów i w bibliotekach aplikacji (nie są źródłem). ACE „Stretch and release” (PDF z komunikatu prasowego ACE, https://www.acefitness.org/media/stretchandrelease.pdf) — nie przeczytany; komunikat wymienia z piłką tylko wyprost pleców, skłon w bok w klęku i krążenia miednicy (bez rozciągania klatki). Fakultet University of Arkansas „Strength Training With Stability Balls” (FSFCS39) — s. 1–2 bez rozciągania klatki.
- **Chin To Chest Stretch, Standing Chest Stretch, Standing Biceps Stretch, „Elevated” w Standing Elevated Quad Stretch:** nie zbadane w tej sesji (limit kontekstu). Wskazówka: MedlinePlus (wersja z dłońmi splecionymi) podaje rozciąganie „in your upper arms and chest” — za mało, by uznać za źródło dla bicepsa.
- **Stwierdzenia zdrowotne:** nic nie dodano (UKY: „po endoprotezie biodra skonsultuj się z lekarzem” — jedno źródło, nie do aplikacji).

## Stan

- **Zrobione:** Standing Toe Touches, Chest And Front Of Shoulder Stretch, One Knee To Chest (gotowe — dwa ostatnie i Toe Touches z zastrzeżeniem szczebla, patrz „Ryzyko”); Wall Lat Stretch (otwarte, warunkowo gotowe); Overhead Stretch (częściowe); Chest Stretch on Stability Ball (otwarte); uzupełnienie `st.*` dla Wall Calf Stretch i Overhead Triceps Stretch.
- **Zostało:** drugie źródło dla Chin To Chest Stretch, Standing Chest Stretch, Standing Biceps Stretch; znaczenie „Elevated” w Standing Elevated Quad Stretch; Chest Stretch on Stability Ball (PDF ACE „stretchandrelease.pdf”); drugie źródło szczebla 4 dla Wall Lat Stretch zamiast Parkview.
- **Następny krok:** MedlinePlus ma serię stron z rozciąganiami (`/ency/imagepages/…`, recenzowane, z datą) — przeszukać ją pod kątem: neck flexion (Chin To Chest), chest stretch bez splatania dłoni (Standing Chest), biceps/lat; potem strony WebMD Ignite na columbiadoctors.org (`/health-library/multimedia/…`). „Elevated” — sprawdzić, czy w bibliotekach organizacji szkolących trenerów występuje „elevated quad stretch” (stopa na ławce za sobą) i porównać z figurą `piety_do_posladka`.
- **Pułapki:** jak w części 1; dodatkowo PDF-y uczelni (UKY, Duke, Arkansas) przez WebFetch nieczytelne — czytać zapisany plik przez Read z `pages`; arthritis-uk.org — tłumaczenie automatyczne na stronie (treść angielska czytelna); `ihacares.com` przekierowuje na inną stronę (PDF niedostępny); materiał UCR wellness (PDF) to same obrazy bez tekstu. Edytor w tej sesji: tylko Write (całe pliki).
