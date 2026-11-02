# Wskazówki techniki — fala „obowiązkowe 1.1”, grupa „triceps”

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Zakres: 13 ćwiczeń z listy `docs/research/pokrycie-1-1-obowiazkowe.json` (rodzina triceps; wszystkie mają pozy v2, brak wskazówek).
Podstawa: fale W1 (`wskazowki-fala-w1/triceps.md`, `triceps-2.md`, gałąź `badania/lokalne-0211`) i W2 (`wskazowki-fala-w2/triceps.md`, gałąź W2 ramiona);
zasady: CLAUDE.md „Merytoryczne podstawy” (wyjątek dla wskazówek techniki, reguły z 02.11.2026), docs/18 linie 134–150, `szczeble-organizacji-2026-11-02.md` z uzupełnieniami 2 i 3.
Strony w sekcji 4 oznaczone „przeczytane 02.11.2026 (ta sesja)” otwarte w tej sesji przez WebFetch. Przed statusem gotowym — recenzja niezależna (L-047),
a przy drodze 3 recenzent potwierdza, że ruch się nie różni (CLAUDE.md, wyjątek dla wskazówek techniki, zdanie o wariancie sprzętu).

**Ważne dla integracji:** wszystkie 13 ćwiczeń ma wpis póz v2 (`lib/figures/v2/poses/triceps.json`), więc wg docs/18:147 karta bez błędu nie wchodzi
(zasłoniłaby błędy zestawu ogólnego). Dlatego każda proponowana karta ma co najmniej jeden błąd („Czego unikać”: ze źródeł albo wnioskowany, docs/18:150).

## (1) Tabela ćwiczeń

Bazy drogi 3 (karty potwierdzone wcześniej): Skullcrusher (EZ) — karta w aplikacji (ACG-006: ACE #36 + ExRx); Skullcrusher (sztanga) i (hantle) — W1/W2;
Overhead Triceps Extension (hantel) — karta w aplikacji; Overhead (EZ) / Standing Overhead Barbell — W1/W2 (`ote.setupLoad`, `ote.moveLoad`);
Triceps Kickback — W1/W2 (`kick.*`); Triceps Pushdown — karta w aplikacji (ACE #185 + ExRx).

| Ćwiczenie | Stan | Droga | Uzasadnienie (krótko; szczegóły w „Czym ruch się różni”) |
|---|---|---|---|
| Band Overhead Triceps Extension | **karta z błędami** | 3 + 1 źródło bezpośrednie | BarBend (lista ćwiczeń, autor CSCS, recenzent) opisuje wprost wersję z gumą pod stopami; reszta zdań z bazy Overhead (ACE #74, Naternicola, ISSA — hantel) |
| Band Skull Crusher | **karta z błędem (warunkowa)** | 3 | brak źródła o gumie na leżąco; Catalyst #903 nazywa wariant „low cable” — guma zaczepiona nisko za głową działa jak dolny wyciąg; uproszczenie podwójne (guma ↔ wyciąg ↔ sztanga) — decyzja recenzenta |
| Cable Incline Triceps Extension | otwarta | — | figura: ławka 55°, wyciąg **wysoko** za głową, lina — to nie jest wariant „low cable” z Catalyst ani stojące prostowanie nad głową; brak źródła; ustawienia nie da się opisać bez zgadywania |
| Cable Lying Triceps Extension | **karta z błędem** | 3 (wariant nazwany w źródle) | Catalyst #903, Variations: „low cable” jako wersja skull crushera; figura: ławka płaska, dolny wyciąg za głową, drążek |
| Decline Dumbbell Triceps Extension | **karta warunkowa** | 3 + 4 | jedyne źródło o ławce ujemnej: Fitness Volt (Dr. Malik, „MD and fitness expert”) — warunek szczebla 4 niejasny (pyt. 2); bez niego wariant ławki nienazwany w żadnym źródle ≤ 4 → otwarta |
| Decline EZ Bar Triceps Extension | **karta warunkowa** | 3 + 4 | jw. (Fitness Volt opisuje sztangę) |
| Incline Barbell Triceps Extension | **karta z błędem** | 3 (wariant nazwany w dwóch źródłach) | Catalyst #903 („can also be done on an incline bench”) + BarBend (skull crusher na ławce 10–20°, „Make It Harder”); kąt figury 55° — żadne źródło nie podaje (pyt. 3) |
| Kneeling Cable Triceps Extension | otwarta | — | ustawienie (klęk, łokcie na ławce, lina) — brak źródła ≤ 4; to inne podparcie niż w bazie Cable Overhead Extension, nie sam wariant sprzętu |
| Lying Close-Grip Barbell Triceps Extension Behind The Head | **karta z błędem** | 1 | Catalyst #903 („bring the bar past the top of the head”) + ACE #36 (Step 2: w stronę czoła „or slightly behind your head”) — dwie organizacje szczebla 4; „wąski chwyt” niepotwierdzony (żadne nie podaje szerokości) — nie trafia do tekstu |
| One-Arm Lying Dumbbell Triceps Extension | **karta z błędem (warunkowa)** | 3 | baza Skullcrusher (hantle): ISSA #2 wersja leżąc + ACE #36; jedna ręka — uproszczenie (ISSA dopuszcza jedną rękę tylko w wersji stojąc/siedząc); pyt. 4 o kierunek opuszczania w figurze |
| Reverse Grip Triceps Pushdown | **karta z błędem** | 4 (albo 3) | Catalyst #878 wprost + NFPT (2025, biogram R. Bovee — warunek do potwierdzenia, pyt. 1); bez NFPT: droga 3 — wariant chwytu bazy Triceps Pushdown (pyt. 5) |
| Triceps Kickback (linki) | **karta z błędami** | 1 (jedno ze źródeł o gumie) | BarBend (wyciąg, tułów prawie poziomo, ramię przy tułowiu) + ISSA (guma zaczepiona przed sobą, krok w tył, skłon z neutralnym kręgosłupem — ten sam układ oporu co wyciąg) |
| Two-Arm Dumbbell Kickback | **karta z błędami (warunkowa)** | 3 | baza Triceps Kickback: ACE #55 (skłon, dłoń na udzie, nie na ławce) + ISSA guma (skłon bez podparcia); oburącz bez podparcia — uproszczenie |

Bilans: karty 11 (w tym warunkowe: 5 — Band Skull Crusher, One-Arm Lying, Two-Arm Kickback zależą od recenzenta drogi 3; Decline ×2 od warunku Fitness Volt), otwarte 2.
Drogi: 1 — 2 (Behind The Head, Kickback linki); 3 — 8 (Band Overhead, Band Skull, Cable Lying, Incline Barbell, One-Arm Lying, Two-Arm Kickback, Decline ×2 z drogą 4);
4 — 3 (Reverse Grip, Decline ×2); 2 — 0 (brak dostępu do książek szczebla 3 w tej sesji: Delavier odrzucony 02.11, wyciągi NSCA niedostępne agentowi).

### Czym ruch się różni od wersji bazowej (do potwierdzenia przez recenzenta — nie rozstrzygam sam)

Opis stawów to mój rachunek geometryczny (wniosek), nie cytat ze źródła.

- **Band Overhead** vs Overhead (hantel/EZ): stawy te same — zgięcie i wyprost łokcia przy barku w zgięciu nad głową, bark nieruchomo. Różni się opór:
  guma pod stopami ciągnie w dół jak ciężar, ale napięcie rośnie wraz z rozciągnięciem gumy (przy wyproście). Ustawienie inne (stanie na gumie) — opisane nowym zdaniem z BarBend.
- **Band Skull Crusher** vs Skullcrusher: stawy te same (łokieć, bark nieruchomo). Opór: guma zaczepiona nisko za głową (figura: `mocowanie: zaczep`, x −110, y 25) ciągnie
  w stronę zaczepu, nie pionowo w dół — jak dolny wyciąg z Catalyst #903. Ryzyko: przy pionowym ramieniu kierunek siły względem przedramienia inny niż przy sztandze.
- **Cable Lying** vs Skullcrusher: stawy te same; opór z dolnego bloczka za głową (figura: wyciąg x −115, y 58). Catalyst sam traktuje to jako wariant tego ćwiczenia.
- **Incline Barbell** (ławka 55°) i **Decline** (−20°) vs Skullcrusher na ławce płaskiej: ruchomy staw ten sam (tylko łokieć), ale **stały kąt w barku inny**.
  Jeśli ramiona zostają mniej więcej pionowo w przestrzeni, zgięcie barku względem tułowia wynosi ok. 90° + kąt skosu (skos dodatni: ok. 145° przy 55°, bliżej prostowania nad głową)
  albo ok. 90° − kąt (ława ujemna: ok. 70° przy −20°). Dlatego **nie używam `skull.upperArm`** („mniej więcej pionowo”) na skosie — źródła płaskiej ławki nie mówią, gdzie trzymać ramię na skosie
  (wniosek W1 z pilotu potwierdzony rachunkiem). Zdania ustawienia i ruchu nie zależą od tego kąta („nad sobą”, „w stronę głowy”).
- **Behind The Head** — to nie wariant, tylko jedna z dwóch dopuszczalnych głębokości tego samego ćwiczenia (ACE: czoło albo tuż za głową; Catalyst: za czubek głowy).
- **One-Arm Lying** vs Skullcrusher (hantle): stawy te same, jedna ręka; ISSA #2 dopuszcza pracę jedną ręką (w wersji stojąc/siedząc). Istnieje też odmiana z opuszczaniem w poprzek,
  do przeciwnego barku — jeśli figura tak pokazuje, zdanie „w stronę głowy” jest nieprawdziwe (pyt. 4).
- **Kickback (linki)** vs Kickback (hantel): stawy te same (wyprost łokcia, ramię przy tułowiu). Opór: linka z bloczka przed sobą ciągnie w przód, nie w dół —
  napięcie także na dole ruchu. Ustawienie inne (stanie przodem do wyciągu, bez ławki) — nowe zdanie z BarBend i ISSA (guma).
- **Two-Arm Dumbbell Kickback** vs Kickback jednorącz: w ramionach ten sam ruch; różni się podparcie — obie ręce zajęte, tułów trzymany w skłonie bez podparcia
  (więcej pracy prostowników grzbietu; figura już to ma: `lower_back: 0.25` w `muscles.generated.ts:682`). ACE #55 i ISSA (guma) opisują skłon bez opierania o ławkę, więc ustawienie tułowia ma oparcie w źródłach bazowych.
- **Reverse Grip Pushdown** vs Triceps Pushdown: ten sam staw i tor; inny chwyt (przedramię w supinacji zamiast pronacji). To wariant chwytu, nie sprzętu — reguła z CLAUDE.md wymienia sprzęt (pyt. 5).

## (2) Blok do wdrożenia

### Blok do wdrożenia

`_tryb: dopisz` — jak W2. Wpis `["wniosek", "<id>"]` = błąd wnioskowany z zdania tej karty (docs/18:150). `"uproszczenie"` — droga 3 (wariant sprzętu/ławki/chwytu).
Ćwiczenia oznaczone w tabeli „warunkowa” wchodzą tylko po rozstrzygnięciu pytań z sekcji 5. Źródła ace-*, issa-*, hk-naternicola, catalyst-878/903/910, barbend-ote, nfpt-reverse — z bloków W1/W2 (wdrażane razem).

```json
{
  "_tryb": "dopisz",
  "exercises": {
    "Band Overhead Triceps Extension": {
      "setup": [{"c": "tri.bandOte.setup", "s": [["barbend-tri-best", "Overhead Triceps Extension, How to Do It (band underneath the middle of both feet; handles up behind your ears)"], ["ace-74", "Step 2 (elbows pointing up; wariant: hantel)"]], "uproszczenie": "wariant sprzętu guma — łokcie w górę z bazy hantla"}],
      "move": [{"c": "tri.bandOte.move", "s": [["barbend-tri-best", "Overhead Triceps Extension, How to Do It (extend the elbows until lockout)"], ["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]}],
      "tips": [
        {"c": "ote.upperArm", "uproszczenie": "wariant sprzętu guma", "s": [["ace-74", "Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (keep your upper arm still; wariant: hantel)"]]},
        {"c": "ote.elbowsIn", "s": [["barbend-tri-best", "Overhead Triceps Extension, How to Do It (keeping your elbows tucked in)"], ["ace-74", "wskazówka końcowa (elbows shoulder-width apart; wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.archBack", "uproszczenie": "wariant sprzętu hantel / wyciąg", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["barbend-ote", "Coach's Tips (wariant: wyciąg)"], ["ace-74", "Step 2; Step 3 — błąd = zaprzeczenie standardu; wariant: hantel"]]}
      ]
    },
    "Band Skull Crusher": {
      "setup": [{"c": "tri.skullBand.setup", "uproszczenie": "wariant sprzętu guma (≈ dolny wyciąg z Catalyst #903)", "s": [["catalyst-903", "Description (lie supine on a bench … pressed up above you); Variations (low cable)"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
      "move": [{"c": "tri.skullBand.move", "uproszczenie": "wariant sprzętu guma", "s": [["catalyst-903", "Description (bend the elbows … past the top of the head; extend); Variations (low cable)"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"], ["issa-tri-top5", "#2 wersja leżąc (lowered to ear level; wariant: hantle)"]]}],
      "tips": [],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "wariant sprzętu sztanga", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip (keep your elbows shoulder-width apart) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Cable Lying Triceps Extension": {
      "setup": [{"c": "tri.skullCb.setup", "uproszczenie": "wariant sprzętu wyciąg (nazwany w Catalyst #903)", "s": [["catalyst-903", "Description; Variations (low cable)"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
      "move": [{"c": "tri.skullCb.move", "uproszczenie": "wariant sprzętu wyciąg", "s": [["catalyst-903", "Description; Variations (low cable)"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"]]}],
      "tips": [
        {"c": "skull.upperArm", "uproszczenie": "wariant sprzętu wyciąg", "s": [["ace-36", "Final Tip (upper arms vertical; wariant: sztanga)"], ["issa-tri-top5", "#2 wersja leżąc (upper arm does not move; wariant: hantle)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "wariant sprzętu wyciąg", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Incline Barbell Triceps Extension": {
      "setup": [{"c": "tri.skullInc.setup", "s": [["catalyst-903", "Variations (can also be done on an incline bench); Description (bar pressed up above you)"], ["barbend-tri-best", "Skull Crusher, Make It Harder (adjustable bench … low (10 to 20-degree) incline)"]]}],
      "move": [{"c": "tri.skullBb.move", "uproszczenie": "skos ławki — ruch łokcia ten sam, inny stały kąt barku", "s": [["catalyst-903", "Description; Variations (incline bench)"], ["ace-36", "Step 2; Step 3 (ławka płaska)"]]}],
      "tips": [],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "skos ławki", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip — błąd = zaprzeczenie standardu; ławka płaska"]]}
      ]
    },
    "Decline EZ Bar Triceps Extension": {
      "_warunek": "pyt. 2 (Fitness Volt) i recenzent drogi 3",
      "setup": [{"c": "tri.skullDec.setup", "s": [["fv-decline-skull", "How to (Lie on a decline bench while holding a barbell straight up … above chin level)"], ["catalyst-903", "Description (wariant: ławka płaska)"]]}],
      "move": [{"c": "tri.skullBb.move", "uproszczenie": "ławka ujemna — ruch łokcia ten sam, inny stały kąt barku", "s": [["fv-decline-skull", "How to (slowly lower the barbell to your forehead)"], ["catalyst-903", "Description (ławka płaska)"], ["ace-36", "Step 2; Step 3 (ławka płaska)"]]}],
      "tips": [],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "ławka ujemna", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Decline Dumbbell Triceps Extension": {
      "_warunek": "pyt. 2 (Fitness Volt) i recenzent drogi 3",
      "setup": [{"c": "tri.skullDbDec.setup", "uproszczenie": "wariant sprzętu hantle", "s": [["fv-decline-skull", "How to (decline bench; wariant: sztanga)"], ["issa-tri-top5", "#2 wersja leżąc (dumbbells raised above the head; ławka płaska)"]]}],
      "move": [{"c": "skullDb.move", "uproszczenie": "ławka ujemna", "s": [["issa-tri-top5", "#2 wersja leżąc (lowered to ear level)"], ["fv-decline-skull", "How to (lower … to your forehead; wariant: sztanga)"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"]]}],
      "tips": [],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "uproszczenie": "wariant sprzętu i ławka ujemna", "s": [["catalyst-903", "Description; Variations (dumbbells)"], ["ace-36", "Final Tip — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Lying Close-Grip Barbell Triceps Extension Behind The Head": {
      "setup": [{"c": "tri.skullBb.setup", "s": [["catalyst-903", "Description (lie supine on a bench with a barbell … pressed up above you)"], ["ace-36", "Step 1"]]}],
      "move": [{"c": "tri.skullBehind.move", "s": [["catalyst-903", "Description (bend the elbows … bring the bar past the top of the head; extend)"], ["ace-36", "Step 2 (towards your forehead or slightly behind your head); Step 3"]]}],
      "tips": [],
      "mistakes": [
        {"c": "tri.mis.elbowsFlare", "s": [["catalyst-903", "Description (avoiding flaring them out to the sides)"], ["ace-36", "Final Tip (keep your elbows shoulder-width apart) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "One-Arm Lying Dumbbell Triceps Extension": {
      "_warunek": "recenzent drogi 3 + pyt. 4 (kierunek w figurze)",
      "setup": [{"c": "tri.skullDb1.setup", "uproszczenie": "jedna ręka", "s": [["issa-tri-top5", "#2 wersja leżąc (dumbbells raised above the head); #2 (one arm at a time — wersja stojąc/siedząc)"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
      "move": [{"c": "tri.skullDb1.move", "uproszczenie": "jedna ręka", "s": [["issa-tri-top5", "#2 wersja leżąc (lowered to ear level)"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"]]}],
      "tips": [
        {"c": "skull.upperArm", "uproszczenie": "jedna ręka, hantel", "s": [["ace-36", "Final Tip (upper arms vertical; wariant: sztanga)"], ["issa-tri-top5", "#2 wersja leżąc (upper arm does not move)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.lyingArm", "s": [["wniosek", "skull.upperArm"], ["issa-tri-top5", "#2 wersja leżąc (upper arm does not move) — błąd = zaprzeczenie standardu"]]}
      ]
    },
    "Reverse Grip Triceps Pushdown": {
      "_warunek": "pyt. 1 (NFPT) albo pyt. 5 (wariant chwytu)",
      "setup": [{"c": "rgpd.setup", "s": [["catalyst-878", "Description (straight handle; high cable attachment; elbows flexed; palms up)"], ["nfpt-reverse", "Setup (under grip, palms facing up; elbows at your sides)"]]}],
      "move": [{"c": "rgpd.move", "s": [["catalyst-878", "Description (extend the elbows fully, then return under control)"], ["nfpt-reverse", "Movement (2–3 s up; press the handle down to the extended position)"]]}],
      "tips": [
        {"c": "tpd.elbows", "s": [["catalyst-878", "Description (elbows close to the sides)"], ["nfpt-reverse", "Setup (elbows at your sides)"]]}
      ],
      "mistakes": [
        {"c": "mis.elbowsAway", "s": [["wniosek", "rgpd.setup"], ["catalyst-878", "Description (elbows close to the sides) — błąd = zaprzeczenie standardu"], ["ace-185", "wskazówka końcowa (wariant: nachwyt; wg W1 triceps-2.md:363)"]]}
      ]
    },
    "Triceps Kickback (linki)": {
      "setup": [{"c": "tri.kickCb.setup", "s": [["barbend-tri-best", "Cable Kickback, How to Do It (cable fixture … waist height; torso roughly parallel to the floor; upper arm back and against your torso)"], ["issa-band-20", "Triceps Kickback (band secure; one hand; few steps away from the attachment point; hinge … neutral spine; wariant: guma)"]]}],
      "move": [{"c": "kick.move", "s": [["barbend-tri-best", "Cable Kickback, How to Do It (use your triceps to extend your elbow)"], ["ace-55", "Step 3; Step 4 (wariant: hantel)"], ["issa-band-20", "Triceps Kickback (wariant: guma)"]]}],
      "tips": [
        {"c": "kick.upperArm", "s": [["barbend-tri-best", "Cable Kickback (upper arm back and against your torso)"], ["ace-55", "Step 2; Step 3 (wariant: hantel)"], ["issa-band-20", "Triceps Kickback (wariant: guma)"]]},
        {"c": "press.noLock", "uproszczenie": "wariant sprzętu hantel", "s": [["ace-55", "Step 3 (wariant: hantel)"], ["issa-tri-top5", "#3 (Don't lock the elbow; wariant: hantel)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.kickArm", "uproszczenie": "wariant sprzętu hantel", "s": [["ace-55", "Step 3 (upper arm … stationary)"], ["catalyst-910", "Description (upper arm horizontal and against your side) — błąd = zaprzeczenie standardu"], ["wniosek", "kick.upperArm"]]},
        {"c": "tri.mis.kickBack", "uproszczenie": "wariant sprzętu hantel", "s": [["ace-55", "Step 3 (back doesn't arch or rotate)"], ["wniosek", "tri.kickCb.setup"]]}
      ]
    },
    "Two-Arm Dumbbell Kickback": {
      "_warunek": "recenzent drogi 3 (oburącz bez podparcia)",
      "setup": [{"c": "tri.kick2.setup", "uproszczenie": "oburącz bez podparcia", "s": [["ace-55", "Step 1; Step 2 (lean forward; upper arm parallel to, and close to, your torso; elbow about 90°)"], ["issa-band-20", "Triceps Kickback (hinge … neutral spine, bez podparcia; wariant: guma)"], ["barbend-tri-best", "Cable Kickback (torso roughly parallel to the floor; wariant: wyciąg)"]]}],
      "move": [{"c": "tri.kick2.move", "uproszczenie": "oburącz", "s": [["ace-55", "Step 3; Step 4"], ["catalyst-910", "Description (extend the elbow completely, then return under control)"]]}],
      "tips": [
        {"c": "kick.upperArm", "uproszczenie": "oburącz", "s": [["ace-55", "Step 3"], ["catalyst-910", "Description (upper arm horizontal and against your side)"]]}
      ],
      "mistakes": [
        {"c": "tri.mis.kickArm", "uproszczenie": "oburącz", "s": [["ace-55", "Step 3"], ["catalyst-910", "Description — błąd = zaprzeczenie standardu"], ["wniosek", "kick.upperArm"]]},
        {"c": "tri.mis.kickBack", "uproszczenie": "oburącz", "s": [["ace-55", "Step 3 (back doesn't arch or rotate)"], ["wniosek", "tri.kick2.setup"]]}
      ]
    }
  },
  "sources": {
    "barbend-tri-best": {"org": "BarBend", "title": "Best triceps exercises (M. Dewar, CSCS; Expert Verified: J. Dickson, NASM-CPT, USAW-L2; akt. 28.07.2026)", "url": "https://barbend.com/best-triceps-exercises/", "level": 4},
    "fv-decline-skull": {"org": "Fitness Volt", "title": "Decline Skull Crusher (Dr. Malik; akt. 11.08.2024)", "url": "https://fitnessvolt.com/23999/decline-skull-crusher/", "level": "4 warunkowo — pyt. 2"}
  },
  "orgs": {"Fitness Volt": "tylko jeśli koordynator uzna warunek (pyt. 2)"}
}
```

## (3) Nowe zdania PL + EN

Id sprawdzone: brak w `lib/cues/text/pl.json`; `tri.skullBb.setup`/`tri.skullBb.move`/`tri.mis.*` — propozycje W2; `skullDb.move`, `kick.*` — W1; `rgpd.*`, `mis.elbowsAway` — W1 (`triceps-2.md`).
Zdania bez nazw źródeł, bez liczb i twierdzeń o zdrowiu.

| Id | PL | EN (propozycja) |
|---|---|---|
| tri.bandOte.setup | Stań na środku gumy, chwyć jej końce i unieś dłonie za głowę, łokcie skierowane w górę. | Stand on the middle of the band, grab the ends and bring your hands up behind your head, elbows pointing up. |
| tri.bandOte.move | Prostuj łokcie, wypychając dłonie nad głowę; zginając je, wróć dłońmi za głowę. | Straighten your elbows to push your hands overhead; bend them to bring your hands back behind your head. |
| tri.skullBand.setup | Połóż się na ławce i trzymaj gumę nad sobą na prostych rękach. | Lie on a bench and hold the band above you with straight arms. |
| tri.skullBand.move | Zginaj łokcie, opuszczając dłonie w stronę głowy; wyprostuj ręce do pozycji wyjściowej. | Bend your elbows to lower your hands toward your head; straighten your arms back to the start. |
| tri.skullCb.setup | Połóż się na ławce i trzymaj drążek wyciągu nad sobą na prostych rękach. | Lie on a bench and hold the cable bar above you with straight arms. |
| tri.skullCb.move | Zginaj łokcie, opuszczając drążek w stronę głowy; wyprostuj ręce do pozycji wyjściowej. | Bend your elbows to lower the bar toward your head; straighten your arms back to the start. |
| tri.skullInc.setup | Połóż się na ławce skośnej i trzymaj sztangę nad sobą na prostych rękach. | Lie back on an incline bench and hold the bar above you with straight arms. |
| tri.skullDec.setup | Połóż się na ławce skośnej głową w dół i trzymaj sztangę nad sobą na prostych rękach. | Lie on a decline bench and hold the bar above you with straight arms. |
| tri.skullDbDec.setup | Połóż się na ławce skośnej głową w dół i trzymaj hantle nad sobą na prostych rękach. | Lie on a decline bench and hold the dumbbells above you with straight arms. |
| tri.skullBehind.move | Zginaj łokcie, opuszczając sztangę za czubek głowy; wyprostuj ręce do pozycji wyjściowej. | Bend your elbows to lower the bar just past the top of your head; straighten your arms back to the start. |
| tri.skullDb1.setup | Połóż się na ławce i trzymaj hantel nad sobą na prostej ręce. | Lie on a bench and hold the dumbbell above you with a straight arm. |
| tri.skullDb1.move | Zginaj łokieć, opuszczając hantel w stronę głowy; wyprostuj rękę do pozycji wyjściowej. | Bend your elbow to lower the dumbbell toward your head; straighten your arm back to the start. |
| tri.kickCb.setup | Stań przodem do wyciągu, chwyć uchwyt jedną ręką i cofnij się o krok; pochyl się do przodu z prostymi plecami, ramię przy tułowiu. | Face the cable, grab the handle with one hand and step back; lean forward with a flat back, upper arm by your side. |
| tri.kick2.setup | Z hantlami w obu dłoniach pochyl się do przodu z prostymi plecami; ramiona przy tułowiu, łokcie zgięte pod kątem prostym. | Holding a dumbbell in each hand, lean forward with a flat back; upper arms by your sides, elbows bent to about 90°. |
| tri.kick2.move | Prostuj łokcie, odprowadzając dłonie do tyłu, aż ręce będą proste; wróć do kąta prostego. | Straighten your elbows, moving your hands back until your arms are straight; return to about 90°. |
| tri.mis.lyingArm | Ramię ucieka w przód albo w tył zamiast stać w miejscu. | Upper arm drifting forward or back instead of staying put. |

Kontrola sformułowań:
- `tri.bandOte.setup` — BarBend: guma pod środkiem stóp, uchwyty za uszami; „łokcie w górę” z bazy (ACE #74, Naternicola — hantel). „Krok w przód jedną nogą” z BarBend pominięty (jedno źródło, figura stoi w rozkroku).
- `tri.skullCb.setup` / `tri.skullBand.setup` — bez położenia bloczka/zaczepu („głową do wyciągu”): żadne źródło tego nie podaje, figura to pokazuje.
- `tri.skullInc.setup` — bez kąta (Catalyst nie podaje, BarBend 10–20°, figura 55°).
- `tri.skullDec.setup` — Fitness Volt: sztanga „above chin level”; zdanie mówi tylko „nad sobą” (część wspólna z bazą).
- `tri.skullBehind.move` — „za czubek głowy”: Catalyst wprost; ACE dopuszcza „tuż za głowę”. Nie dodaję „ramiona lekko w tył” (Catalyst „slightly behind vertical” vs ACE „vertical” — różnica).
- `tri.kickCb.setup` — bez wysokości bloczka: BarBend „waist height”, Fitness Volt (nieliczony) „lowest notch”, figura — nisko (y 40); część wspólna: nie podawać.
  Wolna ręka: BarBend „brace yourself against the cable tree” — jedno źródło, pominięte.
- `tri.kick2.setup` „kąt prosty” — ACE #55 (ok. 90°); `tri.kick2.move` to `kick.move` w liczbie mnogiej.
- `tri.mis.lyingArm` — zaprzeczenie `skull.upperArm` / ISSA „upper arm does not move”.

## (4) Źródła

| Id | Adres i miejsce | Organizacja | Szczebel | Odczyt / uwagi |
|---|---|---|---|---|
| barbend-tri-best | https://barbend.com/best-triceps-exercises/ — sekcje „Overhead Triceps Extension” (How to Do It, z gumą), „Cable Kickback” (How to Do It), „Skull Crusher” (Make It Harder) | BarBend | 4 (warunek spełniony: autor M. Dewar — mgr fizjologii wysiłku, CSCS; Expert Verified J. Dickson; akt. 28.07.2026) | przeczytane 02.11.2026 (ta sesja). Narzędzie nie pokazało przekierowania. To prawdopodobnie ta sama lista, którą W2 otworzyło przez inny adres (W2 sekcja 4) |
| catalyst-903 | https://www.catalystathletics.com/exercise/903/Skullcrusher/ — Description; Variations | Catalyst Athletics | 4 | przeczytane 02.11.2026 (ta sesja). Cytat: „Skull crushers can be done with a barbell, EZ curl bar, dumbbells, kettlebells, or low cable.” |
| catalyst-878 | https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/ — Description | Catalyst Athletics | 4 | przeczytane 02.11.2026 (ta sesja). Cytat: „Hold a straight handle in front of you on a high cable attachment with the elbows flexed and the palms up.” |
| catalyst-910 | https://www.catalystathletics.com/exercise/910/Tricep-Kickback/ — Description | Catalyst Athletics | 4 | przeczytane 02.11.2026 (ta sesja); z 878/903 = jedna organizacja |
| ace-36 | https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/ — Step 1–3, Final Tip | ACE | 4 | przeczytane 02.11.2026 (ta sesja); fragment Step 2 „or slightly behind your head” — narzędzie podało go skrócony, pełne brzmienie z odczytu W2 (ten sam dzień) — recenzent sprawdzi |
| ace-55 | https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/ — Step 1–4 | ACE | 4 | przeczytane 02.11.2026 (ta sesja); dłoń wolna na udzie/kolanie, skłon w wykroku — bez ławki |
| ace-74, ace-185 | strony ACE #74, #185 (adresy w W1 sekcja 4) | ACE | 4 | nie otwierane ponownie w tej sesji — użyte tylko jako źródła bazowe już przyjęte w W1/W2 |
| issa-tri-top5 | https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout — #2 (wersja leżąc; jedna ręka tylko stojąc/siedząc), #3 | ISSA | 4 | przeczytane 02.11.2026 (ta sesja); autor „ISSA”, 05.02.2024 |
| issa-band-20 | https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout — Triceps Kickback | ISSA | 4 | przeczytane 02.11.2026 (ta sesja); jednorącz, skłon, guma zaczepiona, bez podparcia; z issa-tri-top5 = jedno źródło |
| hk-naternicola, barbend-ote | adresy w W1/W2 | Human Kinetics; BarBend | 4 | nie otwierane ponownie — źródła bazowe z W1/W2 |
| nfpt-reverse | https://nfpt.com/how-to-do-reverse-tricep-pushdown/ — Setup, Movement | NFPT | **4 warunkowo — pyt. 1** | przeczytane 02.11.2026 (ta sesja). Podpis „Guest”, ale pod tekstem biogram Roberta Bovee („Certified Master PPT, RTS, ETS, FTS”, trener personalny); data 11.08.2025. W2 oceniło jako 5 bez wzmianki o biogramie |
| fv-decline-skull | https://fitnessvolt.com/23999/decline-skull-crusher/ — kroki | Fitness Volt | **4 warunkowo — pyt. 2** | przeczytane 02.11.2026 (ta sesja). Autor „Dr. Malik … an MD and fitness expert”; bez recenzenta; akt. 11.08.2024 |

Przeczytane, nieliczone:
- The Prehab Guys, „Overhead Tricep Extension – Band” (https://theprehabguys.com/vimeo-video/overhead-tricep-extension-band/; 01.04.2020, akt. 23.08.2021) — bez autora na stronie → warunek „artykuł z autorem” (szczeble, wiersz The Prehab Guys) niespełniony. Treść zgodna z BarBend (guma pod stopami, łokcie wysoko, nie wyginać pleców).
- Fitness Volt, „Cable Triceps Kickbacks” (https://fitnessvolt.com/cable-tricep-kickback-triceps/; Dr. Malik; akt. 11.08.2024) — warunek jak pyt. 2; podaje łokieć „higher than your torso” — różni się od ACE/Catalyst (ramię równolegle/przy tułowiu); nieużyte.
- Szpitalna biblioteka zdrowia (WebMD Ignite, „Your Exercise Routine: Standing Tricep Extension”) — to wypychanie w dół nachwytem, nie żaden z wariantów; nieużyte.
- ExRx — nadal 403 (sprawdzone 02.11.2026, `CBLyingTriExt`).
- Wyniki wyszukiwania (serwisy bez autora, sprzedawcy, strony aplikacji) — nieotwierane jako źródła, nigdzie nie zapisane.

## (5) Pytania dla koordynatora

1. **[DO DECYZJI] NFPT — Reverse Grip Pushdown.** Strona ma podpis „Guest”, ale pod tekstem biogram R. Bovee z certyfikatami trenerskimi i datę 11.08.2025.
   Czy to spełnia warunek „artykuł z autorem, datą i kwalifikacjami w biogramie” (szczeble, wiersz NFPT)? Tak → karta drogą 1 (Catalyst #878 + NFPT). Nie → pyt. 5.
2. **[DO DECYZJI] Fitness Volt, Dr. Malik („MD and fitness expert”)** — czy lekarz bez kwalifikacji trenerskich i bez recenzenta spełnia warunek „autor-ekspert” (uzupełnienie 3)?
   Od tego zależą obie karty Decline (jedyne przeczytane źródło, które nazywa ławkę ujemną). Nie → Decline ×2 otwarte.
3. **[OTWARTE — figura] Kąt ławki w Incline Barbell / Cable Incline: 55°** (`triceps.json:5445`, `:5808`). Źródła: Catalyst — skos bez kąta; BarBend — 10–20°. Tekst kąta nie podaje,
   ale recenzent figury powinien wiedzieć, że 55° nie ma oparcia w przeczytanych źródłach (przy 55° ruch zbliża się do prostowania nad głową).
4. **[OTWARTE — figura] One-Arm Lying Dumbbell** — czy figura opuszcza hantel obok głowy (zgodnie z „w stronę głowy”), czy w poprzek do przeciwnego barku? W drugim przypadku zdanie ruchu do zmiany, a odmiana „w poprzek” nie ma źródła.
5. **[DO DECYZJI] Wariant chwytu jako droga 3** (Reverse Grip vs Triceps Pushdown) — reguła CLAUDE.md mówi o wariancie sprzętu; czy podchwyt zamiast nachwytu można traktować tak samo, skoro staw i tor są te same? Catalyst #878 i tak opisuje podchwyt wprost.
6. **[OTWARTE] Cable Incline Triceps Extension** — figura: wyciąg wysoko za głową (`triceps.json:5814`, y 200) z liną na ławce 55°. Brak źródła; potrzebne źródło o tej wersji albo decyzja, że to wariant Cable Overhead Extension z podparciem pleców (inne ustawienie — nie proponuję).
7. **[OTWARTE] Kneeling Cable Triceps Extension** — klęk, łokcie na ławce, lina; brak źródła ≤ 4 o ustawieniu.
8. **Recenzent drogi 3** — potwierdzić opisy z „Czym ruch się różni” (sekcja 1), szczególnie Band Skull Crusher (podwójne uproszczenie) i Two-Arm Kickback (tułów bez podparcia).
9. `tri.mis.kickBack` przy Kickback (linki) i Two-Arm — oparty na ACE #55 (hantel) + wniosku z nowego zdania ustawienia; recenzent sprawdza sens zaprzeczenia (docs/18:150).
