# Wskazówki techniki — rodzina `calf_raise` (wspięcia na palce)

Data: 02.11.2026 · Autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 2 (02.11.2026)

Zastosowano ROZSTRZYGNIĘCIE 2 koordynatora linii 1.1 (02.11.2026, ok. 07:55). Bez nowych źródeł.

- **Physitrack** (`physitrack-seated-calf-raises`, `physitrack-sl-heel-raise-step-board`, `physitrack-heel-raise-step`) 4 → **5** (lista koordynatora).
- **The Prehab Guys** (`prehab-sl-calf-raise-off-step`, `prehab-seated-heel-raise`, `prehab-seated-calf-raise-off-step`, `prehab-heel-raise-off-step`) 4 → **5**: strony `vimeo-video` bez autora i kwalifikacji (sprawdzone 02.11 na dwóch stronach tego serwisu — ten sam szablon: data i stopka firmy, bez autora; opis w `glute_floor.md` i `hip_bridge.md`).
- **UTHSC Campus Recreation** — 5 (bez zmian; uczelniane centrum rekreacji bez autora).
- **University of Illinois Extension** (`illinois-seated-calf-raises`) — oceniony 02.11 (WebFetch): strona programu Eat.Move.Save. uczelnianej służby upowszechniania wiedzy, bez autora, recenzenta i daty. To nie szpital, nie uczelniana służba zdrowia ani organizacja pacjentów; najbliżej mu do „uczelnianego programu dla ogółu bez autora” → zostaje **5**. Ocena nie zmienia wyniku: strona opisuje siad bez ciężaru („Sit tall in your chair with your feet flat on the floor”), więc i tak nie daje ustawienia z ciężarem na kolanach.
- Potwierdzone 4: ACE, NASM, Major Fitness (tylko Smith), Bodylastics i Performance Health (tylko gumy). NFPT „Guest” — 5 bez zmian.
- Reguła błędów: `calf.mis.partial` przy Smith Machine Calf Raise — oba źródła jawnie wymieniają błąd (Major Fitness „Cutting reps short”; NASM — szybkie, niepełne powtórzenia) — bez oznaczenia. Przy **Band Calf Raise** dodane `calf.mis.partial`: NASM (jawny błąd; wariant: stojąc na podeście) + Bodylastics (standard „as high on your toes as you can go” i „Lower your heels back to the floor under control”) — **błąd = zaprzeczenie standardu** (skrócony zakres to bezpośrednie zaprzeczenie pełnego wspięcia i opuszczenia). Źródło już przeczytane w tym pliku.
- Zmiany w kartach:
  - **Single Leg Calf Raise: gotowe → otwarte** — każde zdanie zostaje z 1 źródłem szczebla 4 (`calf.stepOne`, `calf.knees` — ACE 73; `calf.move`, `calf.mis.partial` — NASM).
  - **Seated Calf Raise (hantle), Barbell Seated Calf Raise, Dumbbell Seated One-Leg Calf Raise: gotowe → otwarte** — ustawienie siedzące (`calf.seated`, `calf.seatedOne`) i `calf.rise` opierały się wyłącznie na Physitrack + Prehab (oba 5); zostają `calf.pause` (tylko ACE), `calf.bigToe` (tylko Bodylastics), `calf.mis.partial` (tylko NASM).
  - **Smith Machine Calf Raise** — zostaje gotowe (Major Fitness + NASM/ACE, bez Physitrack i Prehab).
  - **Band Calf Raise** — zostaje gotowe: `calf.bigToe` usunięte (Bodylastics + Prehab → 1), w zamian `calf.mis.partial` (wyżej).
- Zdania usunięte z bloku JSON: 20 wpisów (Single Leg 4, trzy wersje siedzące po 5, Band Calf Raise 1 — `calf.bigToe`); dodany 1 (`calf.mis.partial` przy Band Calf Raise). Dane w pkt 2a.
- Nowe zdania wstrzymane: `calf.stepOne`, `calf.seated`, `calf.seatedOne`, `calf.bigToe` (brak 2 źródeł szczebla 4 przy każdym ćwiczeniu).
- Gotowe: przed 6 → po **2** (Smith Machine Calf Raise, Band Calf Raise).

## Korekta szczebli 02.11.2026

Zastosowano rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = (a) organizacja szkoląca trenerów, serwis z redakcją i recenzją albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść firmowana; (c) nie marketing ani afiliacja).

- Zmienione szczeble: `UTHSC Campus Recreation` 4 → **5** (uczelniane centrum rekreacji, ten sam rodzaj co Western Univ. SRS = 5); `University of Illinois Extension` 4 → **5** (program uczelniany dla ogółu, strona bez autora i daty — sprawdzone 02.11; nie jest organizacją szkolącą trenerów ani serwisem z jawną recenzją ekspercką); `NFPT` (`nfpt-donkey-calf-raise`) 4 → **5** — sprawdzone 02.11: byline „by Guest”, autor niewskazany; biogram (Robert Bovee) i data 11.08.2025 są identyczne na drugiej sprawdzonej stronie NFPT (hack squat, `leg_machine.md`), więc to nie są dane autora artykułu.
- Sprawdzone i potwierdzone 4: Major Fitness — data 16.07.2026, marka sprzedająca własne maszyny Smitha, instrukcja użycia tego sprzętu (linki do własnych produktów na końcu, ale to nie zestawienie produktów) → 4 tylko dla maszyny Smitha. Bodylastics, Performance Health — producenci gum → 4 (przy innych ćwiczeniach liczą się jako źródło wariantu tego samego ruchu).
- Ćwiczenia, które spadły do otwartych: **Calf Raise (sztanga)** (gotowe → otwarte; `calf.feet` zostało z samym ACE 51).
- Zdania usunięte: 2 — `calf.feet` przy Calf Raise (sztanga) (wraz z kartą) i `calf.mis.bounce` przy Smith Machine Calf Raise (NASM + NFPT → 1). Smith Machine Calf Raise zostaje gotowe (`calf.pause` + `calf.mis.partial`).
- (Korekta 1 utrzymywała wersje siedzące dzięki Physitrack i Prehab — po korekcie 2 te źródła mają szczebel 5, patrz wyżej.)

Metoda: brief fali W1 (G4) i docs/research/33 („Metoda”). Każde zdanie ma ≥ 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4
z różnych organizacji. Wariant tego samego ćwiczenia (inny sprzęt, stojąc/siedząc, jednonóż/obunóż, bez obciążenia) liczy się z opisem
„(wariant: …)”. Wzór: `Standing Calf Raise`, `Łydki na stopniu` w `data/zrodla/cues.json`. Bez liczb (tempo, obciążenia) i bez uzasadnień zdrowotnych.

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Single Leg Calf Raise | otwarte (korekta 2) | Każde zdanie ma 1 źródło szczebla 4 (ACE 73 albo NASM); Physitrack i Prehab — 5. Dane w pkt 2a. |
| Calf Raise (sztanga) | otwarte (korekta 1) | Brak ustawienia: `calf.feet` ma tylko ACE 51 (UTHSC — 5). Dane w pkt 2a. |
| Seated Calf Raise (hantle) | otwarte (korekta 2) | Brak ustawienia i ruchu z 2 źródłami szczebla 4 (Physitrack, Prehab — 5). |
| Smith Machine Calf Raise | **gotowe** | Major Fitness (producent maszyn Smitha) + NASM; ACE 51 przy `calf.pause`. |
| Calf Raise (linki) | otwarte | Brak przeczytanego źródła wariantu z wyciągiem z listy organizacji; znalezione strony to aplikacje albo serwisy spoza listy. |
| Donkey Calf Raise | otwarte | Jedyne źródło wersji donkey (NFPT) — szczebel 5. |
| Barbell Seated Calf Raise | otwarte (korekta 2) | Jak wersja z hantlami. |
| Dumbbell Seated One-Leg Calf Raise | otwarte (korekta 2) | Jak wersja z hantlami. |
| Band Calf Raise | **gotowe** | Bodylastics + Performance Health (producenci gum); ustawienie tylko jako część wspólna (różnica w pkt 5); błąd `calf.mis.partial` — błąd = zaprzeczenie standardu (Bodylastics). |
| Smith Machine Reverse Calf Raise | otwarte | Inny ruch: unoszenie palców przy opartych piętach (mięsień piszczelowy przedni; notatka katalogu `catalog.json`: „Toe raise with heels on a platform”). Zestaw `calf` do niego nie pasuje; nie szukano źródeł w tej fali. |

## 2. Wpisy do `cues.json` → `exercises` (ćwiczenia gotowe)

```json
{
 "Smith Machine Calf Raise": {
  "setup": [
   {"c": "calf.edge", "s": [
    ["majorfitness-smith-calf-raise", "Get positioned (przednia część stóp na podeście, pięty poza tylną krawędzią)"],
    ["nasm-calf-blog", "The Exercise Menu („Standing calf raise (machine, smith, or dumbbell on a step)”); Technique Standards (pięty poniżej palców)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["majorfitness-smith-calf-raise", "Unrack and lift („rising up onto your toes as high as you can go”); Lower with control (pięty poniżej krawędzi, pełne rozciągnięcie)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["majorfitness-smith-calf-raise", "Unrack and lift (krótkie zatrzymanie na górze); Lower with control"],
    ["ace-51", "Step 6 (wariant: sztanga)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["majorfitness-smith-calf-raise", "Common Mistakes: Cutting reps short; Skipping the platform"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]}
  ]
 },
 "Band Calf Raise": {
  "setup": [
   {"c": "calf.band", "s": [
    ["bodylastics-standing-calf-raise-flat-bands", "Setup (uchwyt w każdej dłoni, tułów wyprostowany)"],
    ["theraband-ankle-calf-raise-standing", "Step One–Two (guma pod przednią częścią stóp, końce w dłoniach przy biodrach)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["bodylastics-standing-calf-raise-flat-bands", "Movement („as high on your toes as you can go”; „Lower your heels back to the floor under control.”)"],
    ["theraband-ankle-calf-raise-standing", "Step Three–Four"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["theraband-ankle-calf-raise-standing", "Step Four („Hold and slowly return.”)"],
    ["ace-51", "Step 6 (wariant: sztanga)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia jako częsty błąd; wariant: stojąc na podeście)"],
    ["bodylastics-standing-calf-raise-flat-bands", "Movement (pełne wspięcie i opuszczenie pięt na podłogę; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 }
}
```

Uwaga: źródła szczebla 5 (Physitrack, The Prehab Guys, `uthsc-calf-raises`, `illinois-seated-calf-raises`, `nfpt-donkey-calf-raise`) nie występują w blokach powyżej — nie liczą się do dwóch źródeł.

### 2a. Częściowe (ćwiczenia otwarte — nie do `cues.json`)

- **Single Leg Calf Raise** (korekta 2) — z 1 źródłem szczebla 4 każde zdanie:
  - `calf.stepOne`: ACE 73 Step 1 i Variation (1) (wariant: z podłogi); Prehab SL off step HOW, Physitrack step board — 5;
  - `calf.move`: NASM Technique Standards (wariant: obunóż); Physitrack, Prehab — 5;
  - `calf.knees`: ACE 73 Step 2 i Variation (1); Prehab, Physitrack — 5;
  - `calf.mis.partial`: NASM; Prehab — 5. ACE 73 nie był zapisany jako standard pełnego zakresu — reguła „błąd = zaprzeczenie standardu” niezastosowana.
- **Seated Calf Raise (hantle), Barbell Seated Calf Raise, Dumbbell Seated One-Leg Calf Raise** (korekta 2):
  - `calf.seated` / `calf.seatedOne`: tylko Physitrack Step 1 („Sit with a weighted object on your knees.”) i Prehab seated off step HOW — oba 5; Illinois — siad bez ciężaru, 5;
  - `calf.rise`: Physitrack Step 2, Prehab seated heel raise HOW, Illinois — wszystkie 5;
  - `calf.pause`: ACE 51 Step 6 (wariant: stojąc) albo ACE 73 (wariant: stojąc, jednonóż) — 1 organizacja; Physitrack Tips, Illinois — 5;
  - `calf.bigToe`: Bodylastics Tip (wariant: guma, stojąc); Prehab seated heel raise — 5;
  - `calf.mis.partial`: NASM; Prehab — 5.
- **Calf Raise (sztanga)** — brak ustawienia (`calf.feet`: tylko `ace-51` Step 4; `uthsc-calf-raises` — 5). Po korekcie 2:
  - ruch `calf.rise`: `ace-51` Step 5–6; `physitrack-heel-raise-step` — 5 → 1 źródło;
  - wskazówki `calf.knees`: `ace-51` Step 5; Prehab, Physitrack — 5 → 1 źródło. UWAGA: ACE 51 mówi o lekko ugiętych kolanach („slight bend in knees”), pozostałe o prostych; brzmienie do sprawdzenia przed integracją;
  - `calf.pause`: `ace-51` Step 6; `theraband-ankle-calf-raise-standing` Step Four (wariant: guma) → 2 źródła;
  - błąd `calf.mis.partial`: `nasm-calf-blog`; Prehab — 5 → 1 źródło. `calf.mis.bounce` — tylko NASM (NFPT — 5).
- **Donkey Calf Raise** — żadne zdanie nie ma 2 źródeł szczebla 4 (NFPT — 5; ruch `calf.move` i błąd `calf.mis.bounce` mają tylko NASM jako wariant).

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `calf.rise` | Wspinaj się na palce, potem pod kontrolą opuść pięty. | Rise up onto your toes, then lower your heels under control. | `calf.move` zakłada rozciągnięcie poniżej poziomu palców (podest); źródła wersji z podłogi tego nie potwierdzają. Używane w Band Calf Raise. |
| `calf.band` | Stań prosto, trzymając w dłoniach końce gumy albo uchwyty. | Stand tall, holding the band ends or handles. | Część wspólna dwóch ustawień z gumą. |

Wstrzymane w korekcie 2 (brak 2 źródeł szczebla 4 przy każdym ćwiczeniu): `calf.stepOne` („Stań jedną stopą na krawędzi stopnia, pięta poza krawędzią; przytrzymaj się czegoś dla równowagi.” / „Stand on one foot on the edge of a step, heel hanging off; hold on to something for balance.”), `calf.seated` („Usiądź i połóż ciężar na kolanach.” / „Sit and rest the weight on your knees.”), `calf.seatedOne` („Usiądź i połóż hantel na kolanie ćwiczącej nogi.” / „Sit and rest the dumbbell on the knee of the working leg.”), `calf.bigToe` („Wspinając się, dociskaj duży palec do podłoża.” / „Press your big toe down as you rise.”).

Wycofane w korekcie 1 (1 źródło szczebla 4): `calf.feet` („Stopy rozstaw najwyżej na szerokość bioder.” / „Feet no wider than hip-width apart.”), `calf.mis.bounce` („Odbijanie się w najniższym punkcie.” / „Bouncing at the bottom.”).

## 4. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `uthsc-calf-raises` | https://webprod8.uthsc.edu/studentsuccess/campus-rec/documents/calf-raises.pdf | UTHSC Campus Recreation | 5 | „Raise up to the balls of your feet without leaning forward.” |
| `illinois-seated-calf-raises` | https://eat-move-save.extension.illinois.edu/move/exercise/seated-calf-raises | University of Illinois Extension | 5 (ocena 02.11, korekta 2) | Step 1: „Sit tall in your chair with your feet flat on the floor.” |
| `physitrack-seated-calf-raises` | https://www.physitrack.com/exercise-library/how-to-perform-the-seated-calf-raises-exercise | Physitrack | **5** (korekta 2) | „Sit with a weighted object on your knees.” |
| `physitrack-sl-heel-raise-step-board` | https://ca.physitrack.com/home-exercise-video/single-leg-heel-raise-on-a-step-board | Physitrack | **5** (korekta 2) | „Stand on one leg on a step with your heel over the edge.” |
| `prehab-sl-calf-raise-off-step` | https://theprehabguys.com/vimeo-video/single-leg-calf-raises-off-step/ | The Prehab Guys | **5** (korekta 2: bez autora) | COMPENSATION: „Do not let your knee bend as that is a different exercise.” |
| `prehab-seated-heel-raise` | https://theprehabguys.com/vimeo-video/seated-heel-raise/ | The Prehab Guys | **5** (korekta 2) | COMPENSATION: kontakt dużego palca z podłożem |
| `prehab-seated-calf-raise-off-step` | https://theprehabguys.com/vimeo-video/seated-calf-raise-off-step-quick/ | The Prehab Guys | **5** (korekta 2) | HOW (ustawienie; tempo tej wersji — szybkie) |
| `majorfitness-smith-calf-raise` | https://www.majorfitness.com/blogs/wiki/how-to-do-calf-raises-on-smith-machine-a-step-by-step-guide | Major Fitness | 4 (tylko maszyna Smitha) | „Don't just let gravity take over on the way down” (Lower with control) |
| `nfpt-donkey-calf-raise` | https://nfpt.com/?p=4330 | NFPT | 5 (korekta 1: byline „Guest”) | „Do not bounce as you reach the point where your calf is in a stretched position.” |
| `bodylastics-standing-calf-raise-flat-bands` | https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands | Bodylastics | 4 (tylko gumy) | „Push through your big toe as you raise your heels.” |
| `theraband-ankle-calf-raise-standing` | https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html | Performance Health | 4 (tylko gumy) | „Hold and slowly return.” |

Istniejące, przeczytane ponownie 02.11.2026: `ace-51`, `ace-73`, `nasm-calf-blog`, `physitrack-heel-raise-step` (5 po korekcie 2), `prehab-heel-raise-off-step` (5 po korekcie 2).

```json
{
 "orgs": {
  "Major Fitness": {"name": "Major Fitness — wiki marki sprzedającej własne maszyny Smitha i stojaki (szczebel 4 tylko dla tego sprzętu)", "level": 4, "kind": "maker"},
  "Bodylastics": {"name": "Bodylastics — biblioteka ćwiczeń producenta gum oporowych (szczebel 4 tylko dla gum)", "level": 4, "kind": "maker"},
  "Performance Health": {"name": "Performance Health Academy — instrukcje ćwiczeń producenta gum Thera-Band (szczebel 4 tylko dla gum)", "level": 4, "kind": "maker"}
 },
 "sources": {
  "majorfitness-smith-calf-raise": {"org": "Major Fitness", "title": "How to Do Calf Raises on Smith Machine (wiki, 16.07.2026)", "url": "https://www.majorfitness.com/blogs/wiki/how-to-do-calf-raises-on-smith-machine-a-step-by-step-guide", "level": 4},
  "bodylastics-standing-calf-raise-flat-bands": {"org": "Bodylastics", "title": "Standing Calf Raises With Flat Bands", "url": "https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands", "level": 4},
  "theraband-ankle-calf-raise-standing": {"org": "Performance Health", "title": "Thera-Band Ankle Calf Raise in Standing", "url": "https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html", "level": 4}
 }
}
```

Źródła szczebla 5 i ich organizacje — bez wpisu do `cues.json`, dopóki nie zasilają gotowej karty (gdyby koordynator chciał je zapisać: `level: 5`). `physitrack-heel-raise-step` i `prehab-heel-raise-off-step` są już w `cues.json` jako szczebel 4 — patrz pkt 5.

## 5. Otwarte

- **Physitrack i The Prehab Guys w `cues.json`** (korekta 2) — obie organizacje zapisane tam jako szczebel 4; wg rozstrzygnięcia 2 Physitrack = 5, a strony `vimeo-video` Prehab Guys nie mają autora. Istniejące karty (np. `Standing Calf Raise`, `Łydki na stopniu`) mogą przez to stracić drugie źródło — do przeglądu przez koordynatora.
- **Single Leg Calf Raise** (korekta 2) — rozstrzygnie: drugie źródło szczebla 4 o wersji jednonóż na stopniu (ustawienie, ruch, proste kolano).
- **Wersje siedzące z ciężarem** (korekta 2) — rozstrzygnie: dwa źródła szczebla 4 o ustawieniu siedzącym z ciężarem na kolanach (np. organizacja szkoląca trenerów albo producent maszyny do wspięć siedząc).
- **Calf Raise (sztanga) — ustawienie** (korekta 1) — `calf.feet` ma tylko ACE 51 (szczebel 4); UTHSC to szczebel 5. Rozstrzygnie: drugie źródło szczebla 4 o ustawieniu stóp przy wspięciach ze sztangą (albo wariancie stojącym). Przy integracji sprawdzić też brzmienie `calf.knees` (ACE 51: lekko ugięte kolana; inne: proste).
- **`calf.mis.bounce`** (korekta 1) — tylko NASM (NFPT — 5). Rozstrzygnie: drugie źródło szczebla 4 o odbijaniu się w dolnym punkcie.
- **NFPT „Guest”** — jeśli koordynator ustali, że biogram (Robert Bovee) to autor artykułów NFPT, `nfpt-donkey-calf-raise` wraca do 4 i wraca `calf.mis.bounce` przy Smith Machine Calf Raise (NASM + NFPT).
- **Calf Raise (linki)** — brak przeczytanego źródła wersji z wyciągiem od organizacji szczebla 4. Formalnie wystarczyłyby źródła wariantów (inny sprzęt) — `calf.edge`, `calf.move`, `calf.mis.partial` jak dla maszyny Smitha; nie wpisuję bez decyzji, czy uchwyty z dolnych bloczków to tylko „inny sprzęt”. Rozstrzygnie: 2 źródła szczebla 4 (np. producent stacji z wyciągami) o wspięciach z wyciągiem.
- **Donkey Calf Raise** — jedyne źródło wersji donkey (NFPT) ma szczebel 5. Rozstrzygnie: dwa źródła szczebla 4 o wersji donkey (strony ACE/NASM go nie mają).
- **Smith Machine Reverse Calf Raise** — inny ruch: unoszenie palców przy opartych piętach, pracuje mięsień piszczelowy przedni. Zestaw `calf` jest błędny; potrzebna osobna rodzina albo osobne zdania i źródła o tym ruchu. Nie badane.
- **Tempo przy jednej nodze** — przeczytana strona `https://us.physitrack.com/home-exercise-video/single-leg-calf-raise` (szczebel 5) każe „Continue this movement at a fast pace”. Inne źródła (ACE 73, Prehab SL, Physitrack step board) mówią o powolnym, kontrolowanym opuszczaniu. Do rozstrzygnięcia, czy szybkie wersje to osobne ćwiczenia.
- **Podest a podłoga (sztanga, guma, wersje siedzące)** — ACE 51 (sztanga) i źródła siedzące, a także te z gumą, opisują ćwiczenie z podłogi. NASM (wersje stojące) oraz Major Fitness (Smith) — z podestu; Major Fitness wymienia brak podestu jako błąd („Skipping the platform”). Część wspólna: `calf.rise` bez rozciągnięcia poniżej poziomu palców. Przy Band Calf Raise `calf.mis.partial` z NASM (podest) dotyczy tylko skróconego zakresu — nie przenosi wymogu podestu. Opcjonalna wskazówka „możesz stanąć na podeście” — [OTWARTE].
- **Band Calf Raise — ustawienie** — Bodylastics: guma zaczepiona nisko w drzwiach, uchwyty na wysokości barków. Performance Health: guma pod przednią częścią stóp, końce przy biodrach. Do aplikacji idzie tylko część wspólna `calf.band`. Który wariant opisuje klucz katalogu (`fedb`: „Calf Raises - With Bands”) — [OTWARTE].
- **Błędy w zestawach ogólnych `cue-sets.json` (informacja dla koordynatora)**:
  - zestaw `calf` (`calf.move`, `calf.pause`, `calf.mis.partial`) przy Calf Raise (sztanga), wersjach siedzących i Band Calf Raise używa `calf.move` („…aż poczujesz rozciągnięcie”). Przeczytane źródła tych wersji (z podłogi) tego nie potwierdzają;
  - przy Single Leg Calf Raise `calf.pause` ma przeczącą stronę (tempo, wyżej);
  - przy Smith Machine Reverse Calf Raise zestaw `open` jest prawidłowy.
- **Kąt stóp (palce do środka/na zewnątrz)** — ACE 51, ACE 73 i NFPT wiążą go z naciskiem na część łydki. To twierdzenie o działaniu mięśni, nie wskazówka techniki, więc go nie wpisuję.

## 6. Dostęp

- ExRx.net (403) i web.archive.org (zablokowane narzędziem) — nie używane (polecenie koordynatora 02.11).
- NSCA Basics manual PDF — 403.
- myhealth.ucsd.edu — domena poza siecią sesji (nie rozwiązuje się).
- library.theprehabguys.com/?p=16280 — przekierowanie do logowania. Użyto publicznego adresu theprehabguys.com/vimeo-video/….
- PDF UTHSC — tekst odczytany z obrazu strony (narzędzie nie rozpakowało strumienia PDF).
- Strony aplikacji treningowych z wyników wyszukiwania pominięte (nie są źródłem, nie zapisano nazw).
