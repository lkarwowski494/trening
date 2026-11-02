# G5 (pchanie) — korekta szczebli, przeliczenie koordynatora 02.11.2026

Data: 02.11.2026 · autor: badacz-merytoryczny (przeliczenie na zlecenie koordynatora linii 1.1) · **Status: PROPOZYCJA**

Zakres (polecenie koordynatora): G5 zastosowała uzupełnienie 3 w 10 z 13 plików (`STAN-g5-pchanie.md:34`). Przeliczone tylko:
`overhead_press-cz2.md` (Landmine Press: BarBend + OriGym per autor), `chest_fly-cz2.md` oraz The Prehab Guys przy Kettlebell Press
i Band Shoulder Press (`overhead_press-cz1b.md:43`, uzupełnienie 2 — per strona). Reguły: `szczeble-organizacji-2026-11-02.md`
(rozstrzygnięcie, uzup. 1–3). Kryterium karty (02.11.2026): zdanie gotowe = ≥ 2 niezależne organizacje szczebla ≤ 4; karta własna =
min. 1 ustawienie + 1 ruch; „z błędami” = + min. 1 błąd. WebFetch 02.11.2026 tylko do sprawdzenia autora i daty stron już w plikach.

**Odstępstwo od briefu:** sekcja przeliczenia w tym pliku zamiast na końcu każdego pliku (narzędzie zapisu nadpisuje cały plik; limit
kontekstu). Bloki JSON wpisów do `exercises` w `overhead_press-cz1b.md:43`, `overhead_press-cz2.md:26` i `chest_fly-cz2.md:23` —
**NIEAKTUALNE — patrz przeliczenie 02.11.2026**; aktualne wpisy dla tych trzech plików — blok niżej. Bloki pozostałych 10 plików G5
nie były przeliczane w tym kroku (zob. „Ryzyko poza zakresem”).

## Wynik (trzy pliki)

| | przed | po |
|---|---|---|
| overhead_press — własne z błędami | 4 (Arnold, Seated Barbell Military, Kettlebell Press, Band Shoulder Press) | **2** (Arnold, Seated Barbell Military) |
| overhead_press — własne bez błędów | 1 (Landmine Press) | 1 (Landmine Press) |
| chest_fly-cz2 — własne bez błędów | 1 (Pullover (hantel)) | **0** |

## Szczeble źródeł

| źródło (id) | plik | szczebel | dowód (strona czytana 02.11.2026) |
|---|---|---|---|
| `barbend-landmine-press` | overhead_press-cz2 | 4 | „Written by Mike Dewar” (MS Exercise Physiology, CSCS); „Updated by Alex Polish, NASM-CNC, ACE-CPT… on November 25th, 2024” |
| `origym-landmine-press` | overhead_press-cz2 | 4 (warunkowe spełnione) | autor James Brady; biogram: „Personal Training Diploma with OriGym”, Level 4 Sports Nutrition; „Last Updated: 29 June 2026”. Uzup. 3, wiersz OriGym: liczy się autor z kwalifikacjami trenerskimi w biogramie |
| `hk-landmine-one-arm` | overhead_press-cz2 | 4 (bez zmian) | uzup. 2: fragment Human Kinetics, autor-trener → 4 (ocena G5, overhead_press-cz2.md:132) |
| `prehab-hk-sa-landmine-press` | overhead_press-cz2 | 5 (bez zmian) | strona bez autora (overhead_press-cz2.md:123) |
| `prehabguys-standing-single-arm-ohp-kb` | overhead_press-cz1b (Kettlebell Press) | **5** (było 4) | brak autora i kwalifikacji; tylko „The Prehab Guys”; daty „Updated Aug 3, 2021 Published Jul 18, 2020”; przycisk „Start Your Program” do cennika. Uzup. 2: liczy się artykuł z autorem |
| `prehabguys-overhead-press-band` | overhead_press-cz1b (Band Shoulder Press) | **5** (było 4) | brak autora; „Updated Aug 23, 2021”, „Published Apr 1, 2020”; „Start Your Program” |
| `repfitness-db-pullover` | chest_fly-cz2 | **5** (było 4) | „By: Jeremiah Sanchez”, **bez kwalifikacji** na stronie; ogólny poradnik w dziale „Guides”, nie instrukcja konkretnego produktu; baner „Add $1,000 more to unlock FREE Cork Massage Ball Set”. Uzup. 3 (Mikolo: blog producenta = 5; producent = 4 tylko dla instrukcji własnego sprzętu; serwisy — autor z kwalifikacjami) |
| `barbend-db-pullover` | chest_fly-cz2 | 4 | Mike Dewar, CSCS; „Updated by Alex Polish… November 26th, 2024” |
| `ace-37` | chest_fly-cz2 | 4 | bez zmian |
| Life Fitness SU60 (manualsdir, Machine Pullover) | chest_fly-cz2 | nie liczy się | uzup. 3: kopia nieutożsamiona z oryginałem (support.lifefitness.com 403) |

## Per plik

### overhead_press-cz2.md
| zdanie / karta | stan |
|---|---|
| Landmine Press — `lm.setup` (BarBend + OriGym), `lm.move` (BarBend + OriGym + HK), `plank.brace` (BarBend + OriGym + HK) | zostają |
| Landmine Press — `ohp.mis.arch`, `ohp.mis.shrug` | bez zmian: tylko BarBend (Prehab = 5) — poza kartą |
| Landmine Press — karta | **własna bez błędów** (bez zmian) |
| pozostałe 8 ćwiczeń | **otwarte** (bez zmian) |

### overhead_press-cz1b.md
| zdanie / karta | stan |
|---|---|
| Kettlebell Press — `kbp.setup`, `kbp.move` | **spadają** (zostaje tylko ACE 395) |
| Kettlebell Press — `ohp.mis.leanBack` | **spada** (zostaje tylko StrongFirst) |
| Kettlebell Press — karta | gotowe → **otwarta** |
| Band Shoulder Press — `band.ohpSetup`, `band.ohpMove`, `ohp.tall`, `ohp.mis.arch` | **spadają** (zostaje tylko Bodylastics) |
| Band Shoulder Press — karta | gotowe → **otwarta** |
| Arnold Press — `arnold.setup`, `arnold.move`, `arnold.together`, `ohp.mis.arch` | zostają (BarBend + ISSA; Fitness Volt bez widocznej daty — trzecie źródło, nie potrzebne) — **własna z błędami** |
| Seated Barbell Military Press — `ohp.bbGrip`, `ohp.move`, `ohp.mis.flare`, `ohp.mis.arch` (błąd = zaprzeczenie standardu przy ACE) | zostają (ACE + ISSA) — **własna z błędami** |

### chest_fly-cz2.md
| zdanie / karta | stan |
|---|---|
| Pullover (hantel) — `po.dbSetup` | **spada** (REP Fitness = 5; zostaje tylko BarBend) |
| Pullover (hantel) — `po.move`, `front.elbows`, `po.lower` | zostają (ACE + BarBend; REP odpada jako trzecie) |
| Pullover (hantel) — karta | własna bez błędów → **otwarta** (brak ustawienia z 2 źródłami). Do sprawdzenia przy następnej fali: czy ACE 37 opisuje ustawienie (leżenie, chwyt) — wtedy `po.dbSetup` = ACE + BarBend i karta wraca jako własna bez błędów; tego w tym przeliczeniu nie czytano (brief: tylko autor/data) |
| Machine Pullover | **otwarte**; opis w pliku („1 źródło, szczebel 4”, chest_fly-cz2.md:95) nieaktualny — 0 źródeł |
| Svend Press i pozostałe | **otwarte** (bez zmian) |

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

Zastępuje bloki z `overhead_press-cz1b.md:43`, `overhead_press-cz2.md:26`, `chest_fly-cz2.md:23` (z `overhead_press-cz1.md` nadal nic), a po korekcie 2 (sekcja na końcu) także bloki `bench_press-cz1.md:25` i `chest_fly-cz1.md:24` (Decline Bench Press skrócony, Band Chest Fly bez zmian; Smith Machine Bench Press i Cable Fly (low to high) usunięte).
Brzmienie zdań — sekcje „Nowe zdania” tamtych plików. Bloki pozostałych plików G5 — bez zmian w tym kroku.

```json
{
 "Arnold Press": {
  "setup": [{"c": "arnold.setup", "s": [["barbend-arnold-press", "How to: Set Up (palms facing you)"], ["issa-overhead-press-mistakes", "Arnold Press (dumbbell in each hand, palms facing the body)"]]}],
  "move": [{"c": "arnold.move", "s": [["barbend-arnold-press", "How to: Rotate and Press; Reverse It"], ["issa-overhead-press-mistakes", "Arnold Press (rotate the weights about 180 degrees away from the face while pressing; slowly reverse to the start)"]]}],
  "tips": [{"c": "arnold.together", "s": [["barbend-arnold-press", "Coach's tip (rotate and press at the same time)"], ["issa-overhead-press-mistakes", "Arnold Press (in one controlled motion)"]]}],
  "mistakes": [{"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Common mistakes: Lower back arch"], ["barbend-arnold-press", "FAQ — wersja stojąca (avoid overextending your lower back)"]]}]
 },
 "Seated Barbell Military Press": {
  "setup": [{"c": "ohp.bbGrip", "s": [["ace-43", "opis, zdania 1–2 (grip a little wider than shoulder-width; bar lowered to the front of the shoulders, about chin height)"], ["issa-overhead-press-mistakes", "Standing Barbell Overhead Press (grip just outside shoulder width; bar across the front of the shoulders) + Seated Variations (upper-body form very similar)"]]}],
  "move": [{"c": "ohp.move", "s": [["ace-43", "opis, zdania 3–4 (press directly overhead; slowly lower to chin height)"], ["issa-overhead-press-mistakes", "Standing Barbell Overhead Press (press straight up until the elbows are extended; return to the start) + Seated Variations"]]}],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.flare", "s": [["issa-overhead-press-mistakes", "Common mistakes: Elbow flare (the elbows should point forward)"], ["ace-43", "opis, zdanie 3 (keep the elbows pointed forward) — błąd = zaprzeczenie standardu"]]},
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Common mistakes: Lower back arch; Seated Variations (seated helps minimize the arch)"], ["ace-43", "opis, zdanie 1 (keep the back straight) — błąd = zaprzeczenie standardu"]]}
  ]
 },
  "Decline Bench Press": {
    "setup": [{"c": "bench.decline.setup", "s": [["barbend-decline-bench-press", "How to Do a Decline Bench Press, krok 1 (feet secured properly)"], ["bellsofsteel-decline-bench-press", "Step 1: Setup (head at the lower end, feet secure under the leg supports)"]]}],
    "move": [{"c": "bench.decline.move", "s": [["bellsofsteel-decline-bench-press", "Step 3: The Press (towards your lower chest; fully extending your arms)"], ["nfpt-decline-bench-straight-bar", "opis wykonania (lower part of your chest; straight up to the starting position)"]]}],
    "tips": [{"c": "bench.bladesTogether", "s": [["nfpt-decline-bench-straight-bar", "pozycja wyjściowa (squeeze your shoulder blades together)"], ["barbend-decline-bench-press", "How to Do a Decline Bench Press, krok 2 (set your shoulder blades together)"]]}],
    "mistakes": [{"c": "bp.mis.arch", "s": [["nfpt-decline-bench-straight-bar", "wskazówki (do not excessively arch your back or raise your hips off the bench)"], ["bellsofsteel-decline-bench-press", "Step 1: Setup (back should be flat against the bench)"]]}]
  },
  "Band Chest Fly": {
    "setup": [{"c": "bfly.setup", "s": [["therabend-chest-flies", "kroki 1–3 (anchor at shoulder height, face away, staggered stance)"], ["ace-160", "opis (sprzęt: Resistance Bands/Cables; step forward so arms extend out to the sides)"]]}],
    "move": [{"c": "bfly.move", "s": [["therabend-chest-flies", "kroki 4–5 (pull inward in front of you; slowly let the bands return)"], ["ace-160", "opis (slowly bring hands together in front; slowly return)"], ["bodylastics-crossover-fly", "Movement; Return (sweep in front of chest; back under control)"]]}],
    "tips": [{"c": "bfly.arms", "s": [["therabend-chest-flies", "kroki 3–4 (keeping your elbows straight)"], ["bodylastics-crossover-fly", "Arm and elbow (slight bend, hold it throughout)"]]}],
    "mistakes": []
  },
 "Landmine Press": {
  "setup": [{"c": "lm.setup", "s": [["barbend-landmine-press", "How to (hold the sleeve, clean it to shoulder height)"], ["origym-landmine-press", "Set-up / hand position (hold the bar at chest height)"]]}],
  "move": [{"c": "lm.move", "s": [["barbend-landmine-press", "How to (lean forward slightly; press on a slight diagonal; lower under control)"], ["origym-landmine-press", "Movement 1 i 3 (press forward and up; lower under control to the chest)"], ["hk-landmine-one-arm", "kroki (press the bar out in front, lower under control)"]]}],
  "tips": [{"c": "plank.brace", "s": [["barbend-landmine-press", "How to (brace your core)"], ["origym-landmine-press", "Hand and bar position (brace your core for stability)"], ["hk-landmine-one-arm", "kroki (brace the core)"]]}],
  "mistakes": []
 }
}
```

Zmiany względem starych bloków: usunięte wpisy Kettlebell Press, Band Shoulder Press (overhead_press-cz1b) i Pullover (hantel)
(chest_fly-cz2); z `ohp.mis.arch` przy Arnold Press usunięte `fitnessvolt-arnold-press-mistakes` (bez widocznej daty — uzup. 3,
„Reguła ogólna”); przy `ohp.mis.flare` dopisane oznaczenie „błąd = zaprzeczenie standardu” (ACE podaje tylko standard — do oceny
recenzenta, jak w `STAN-g5-pchanie.md:50`). Do `orgs`/`sources`: nie dodawać REP Fitness, `prehabguys-*` z tych dwóch stron.

## Ryzyko poza zakresem (do decyzji koordynatora)

1. **Major Fitness w G5** — `majorfitness-decline-bench-press`, `majorfitness-smith-bench-press` (bench_press-cz1.md:34–100; karty
   gotowe Decline BP i Smith Bench) i `majorfitness-cable-fly` (chest_fly-cz1.md:32, 37; Cable Fly). W G4 przeczytana strona tego
   samego działu Major Fitness („/blogs/wiki/”, Smith calf raise) nie ma autora, nie jest instrukcją konkretnej maszyny, ma banery
   sprzedaży → oceniona 5 (jak blog Mikolo w uzup. 3). Stron G5 nie otwierałem (poza zakresem). Spójność wymaga tej samej oceny —
   jeśli 5, mogą spaść Decline Bench Press, Smith Machine Bench Press i Cable Fly (low to high).
2. **The Prehab Guys w innych plikach G5** — `overhead_press-cz1.md:73–89` (blok i tak nieaktualny); innych odwołań w blokach G5
   nie znalazłem (grep po id `prehab*` w blokach).
3. **REP Fitness w innych plikach** — w blokach G5 występuje tylko w chest_fly-cz2.

## Otwarte
- [OTWARTE] Pullover (hantel): czy ACE 37 opisuje ustawienie (wtedy karta wraca).
- [OTWARTE] Kettlebell Press, Band Shoulder Press: potrzebne drugie źródło szczebla 4 (np. strona The Prehab Guys z autorem-fizjoterapeutą, organizacja szkoląca, producent gum/kettlebelli z instrukcją).
- [OTWARTE] Major Fitness w bench_press-cz1 i chest_fly-cz1 — ocena per strona.

## Korekta 2 — Major Fitness (rozstrzygnięcie koordynatora 02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 do „Ryzyka poza zakresem” pkt 1 — Major Fitness, dział „/blogs/wiki/”
(bez autora, nie instrukcja konkretnej maszyny, banery sprzedaży) = 5, spójnie z G4; 4 tylko dla instrukcji konkretnej maszyny
producenta. Strony otwarte WebFetch 02.11.2026 tylko dla autora, daty i charakteru.

| źródło (id) | szczebel | dowód (strona czytana 02.11.2026) |
|---|---|---|
| `majorfitness-decline-bench-press` (/blogs/wiki/) | **5** (było 4) | brak autora; data 17.07.2024; ogólny poradnik (nie instrukcja konkretnej maszyny), karty produktów (F22, B52), baner „Black Friday: Up to $734 OFF…” |
| `majorfitness-smith-bench-press` (/blogs/wiki/) | **5** (było 4) | brak autora; data 27.11.2025; ogólny poradnik wyciskania na Smicie, linki do produktów, ten sam baner |
| `majorfitness-cable-fly` (/blogs/training-tips/) | **5** (było 4) | inny dział, ale ten sam charakter: autor A. Wang (NSCA-CPT, NASM-CES), data 13.05.2026 — **jednak ogólny poradnik, nie instrukcja konkretnej maszyny**; w tekście polecane własne wyciągi (Flex Arms, B52 Evo) z linkami, ten sam baner. Wg reguły koordynatora (producent = 4 tylko dla instrukcji własnej maszyny; blog producenta = 5, jak Mikolo i REP Fitness) → 5. Wątpliwość niżej |

Żadna z trzech stron nie jest instrukcją konkretnej maszyny — wyjątku „4 dla tej maszyny” nie ma.

| zdanie | źródła po korekcie | stan |
|---|---|---|
| Decline BP — `bench.decline.setup` | BarBend + Bells of Steel | zostaje |
| Decline BP — `bp.grip` | Bells of Steel | **spada** |
| Decline BP — `bench.decline.move` | Bells of Steel + NFPT | zostaje |
| Decline BP — `bench.bladesTogether` | NFPT + BarBend | zostaje |
| Decline BP — `bp.control` | NFPT | **spada** |
| Decline BP — `bp.mis.arch` | NFPT + Bells of Steel | zostaje |
| Smith Bench — `bench.smith.bench`, `bench.smith.catches`, `bp.grip`, `bench.smith.unrack`, `bench.smith.move`, `bp.control`, `bench.smith.mis.position` | RitFit (każde) | **spadają** |
| Cable Fly (low to high) — `cfly.low.setup`, `cfly.low.move` | ACE 163 (każde) | **spadają** |

| karta | przed | po |
|---|---|---|
| Decline Bench Press | własna z błędami | **własna z błędami** (krótsza: bez `bp.grip`, `bp.control`) |
| Smith Machine Bench Press | własna z błędami | **otwarta** |
| Cable Fly (low to high) | własna bez błędów | **otwarta** |

Wynik G5: własne z błędami **8 → 7**, własne bez błędów **5 → 4**, otwarte **81 → 83** (bench_press: 5/0/20 → 4/0/21; chest_fly: 0/2/16 → 0/1/17).
Nowe zdania wstrzymane: `bench.smith.bench`, `bench.smith.catches`, `bench.smith.unrack`, `bench.smith.move`, `bench.smith.mis.position`,
`cfly.low.setup`, `cfly.low.move`. Blok do wdrożenia wyżej poprawiony: dopisane Decline Bench Press (skrócony) i Band Chest Fly
(bez zmian, przeniesiony z `chest_fly-cz1.md`); bloki `bench_press-cz1.md:25` i `chest_fly-cz1.md:24` oznaczone jako nieaktualne.
Do `orgs`/`sources`: Major Fitness — poziom 5 (albo nie dodawać).

### Wątpliwości po korekcie 2
1. **Bells of Steel** (`bellsofsteel-decline-bench-press`, /blogs/content/) — ten sam charakter co Major Fitness: WebFetch 02.11.2026 —
   brak autora, data 23.10.2023, ogólny poradnik (jedyna wzmianka produktu: ławka FID), baner „ON SALE UP TO 41% OFF”, „SHOP BENCHES”.
   Nie zmieniałem (poza poleceniem). Jeśli ta sama reguła → 5, Decline Bench Press traci ustawienie (zostaje tylko BarBend) i ruch
   (tylko NFPT) → **otwarta** (wtedy G5: 6 / 4 / 84). Do decyzji koordynatora.
2. **Major Fitness, poradnik z autorem z certyfikatami** (Cable Fly) — przyjąłem 5 jak blog producenta; jeśli koordynator uzna autora
   z kwalifikacjami za wystarczający (jak warunkowe 4 dla serwisów), Cable Fly (low to high) wraca jako własna bez błędów.
3. **RitFit** (`ritfit-smith-bench-press`) — w G4 inna strona tego bloga = 5 (zespół redakcyjny bez kwalifikacji); tu nie wpływa na wynik (Smith Bench i tak otwarte).

## Rozstrzygnięcia koordynatora 1.1 (02.11.2026) — nadrzędne wobec bloku wyżej
- Bells of Steel (poradnik bez autora, banery sprzedaży) = 5, spójnie z Major Fitness → **Decline Bench Press: otwarta** (usunąć z bloku do wdrożenia przy integracji).
- Poradnik Major Fitness o Cable Fly z autorem z certyfikatem (NSCA-CPT) i datą widoczną na stronie = 4 wg reguły ogólnej uzupełnienia 3 (szczebel daje konkretna strona, nie marka) → **Cable Fly (low to high): własna bez błędów** (wraca do bloku). Rodzina chest_fly ma pozy v2 — karta bez błędów zostaje przy zestawie ogólnym do czasu karty z błędem (docs/18, 02.11.2026).
- Wynik G5 po rozstrzygnięciach: 6 z błędami / 5 bez błędów / 83 otwarte (do potwierdzenia przy integracji liczeniem programisty).
