# pushup_plank (cz. 2: deski, rollouty, pompki plyometryczne) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Podstawa: W1 `pushup_plank-cz2.md` (gałąź `badania/g5-pchanie`), przeliczenie szczebli z 02.11.2026 z rozstrzygnięciami koordynatora 1.1,
`szczeble-organizacji-2026-11-02.md`. Wszystkie strony przeczytane narzędziem 02.11.2026, miejsce podane przy odwołaniu.
Liczb (serie, powtórzenia, czasy) i ostrzeżeń zdrowotnych ze źródeł nie przenoszę.

## Ćwiczenia

| Ćwiczenie | Rysunek v2 | Stan po W2 | Uwagi |
|---|---|---|---|
| Ab Wheel | nie | **gotowe** (karta W1 + błąd) — dopisać do karty W1 | błąd wnioskowany `rollout.mis.bentArms` (zaprzeczenie „ręce proste” z `rollout.wheel.setup`; Catalyst wprost „with straight arms”). `rollout.mis.arch` nadal otwarte (Otwarte 2) |
| Renegade Row | nie | **gotowe** (karta W1 + błąd) — dopisać do karty W1 | `renegade.mis.twist` ze źródeł: BarBend (Common Mistakes — Twisting Your Body, przeczytane w W1) + NASM Best Abs (sekcja Renegade Row, Common Mistake) — dwa niezależne źródła szczebla 4 |
| Plyo Push-Up | tak | **warunkowo gotowe** — blok osobny, nie do wdrożenia przed decyzją o szczeblu World Rugby | NASM (4) + World Rugby Passport (propozycja 4, Otwarte 1) |
| Plank Shoulder Taps | tak | otwarte (jedno źródło szczebla 4) | nowe: szpital NHS WWL (4); drugiego źródła szczebla 4 brak; opis szpitala różni się od `ptap.move` (Otwarte 3) |
| Copenhagen Plank | nie | otwarte | nadal tylko Catalyst; przegląd Schaber 2021 opisuje inną wersję (partner trzyma nogę, ruch dolnej nogi) — Otwarte 4 |
| Standing Barbell Rollout | tak | otwarte | Catalyst: tylko „kneeling or standing … wheel close to your knees or feet”; drugiego źródła brak |
| Barbell Rollout from Bench | tak | otwarte | bez nowych źródeł szczebla 4 (wyniki: bazy ćwiczeń, aplikacje, Fitness Volt bez rozstrzygniętego szczebla) |
| Suspended Fallout | tak | otwarte | nie badane ponownie w W2 (W1: brak źródła szczebla 4; limit kontekstu) |
| Drop Push | nie | otwarte | j.w. (W1: brak; Moore 2012 opisuje odwrotny kierunek) |
| Incline Push-Up Depth Jump | nie | otwarte | j.w. |
| Plyo Kettlebell Push-Ups | nie | otwarte | j.w. |

### Blok do wdrożenia

Ab Wheel i Renegade Row — tylko klucz `mistakes` (dopisać do kart częściowych z W1; ustawienie i ruch zostają z W1).

```json
{
 "Ab Wheel": {
  "mistakes": [
   {"c": "rollout.mis.bentArms", "s": [["wniosek", "rollout.wheel.setup"]]}
  ]
 },
 "Renegade Row": {
  "mistakes": [
   {"c": "renegade.mis.twist", "s": [["barbend-renegade-row", "Common Mistakes — Twisting Your Body"], ["nasm-best-abs", "sekcja Renegade Row — Common Mistake (hips shift side to side; excessive rotation) i Coaching Tip (square hips)"]]}
  ]
 }
}
```

### Propozycja warunkowa (NIE do wdrożenia przed rozstrzygnięciem szczebla World Rugby — Otwarte 1)

```json
{
 "Plyo Push-Up": {
  "setup": [{"c": "plyo.setup", "s": [["nasm-plyometric-push-up", "Steps 1–2 (push-up position; straight line from head to heels)"], ["worldrugby-activate-plyo", "Plyo Press Up — coaching points (Start in press up position) i key cues (Shoulders level with hips)"]]}],
  "move": [{"c": "plyo.move", "s": [["nasm-plyometric-push-up", "Step 3 (press up explosively so the hands leave the floor)"], ["worldrugby-activate-plyo", "Plyo Press Up — coaching points (explosively extend the elbows; clap hands in the air)"]]}],
  "tips": [
   {"c": "plyo.land", "s": [["nasm-plyometric-push-up", "Step 3 (Land softly with bent elbows)"], ["worldrugby-activate-plyo", "Plyo Press Up — coaching points (catching with the elbows slightly bent)"]]},
   {"c": "plank.brace", "s": [["nasm-plyometric-push-up", "Step 2 (Engage your core)"], ["worldrugby-activate-plyo", "Plyo Press Up — key cues (Brace through the trunk)"]]}
  ],
  "mistakes": [
   {"c": "plyo.mis.stiff", "s": [["nasm-plyometric-push-up", "Common Mistakes (landing with straight elbows)"], ["worldrugby-activate-plyo", "Plyo Press Up — coaching points (catching with the elbows slightly bent) — reguła: błąd = zaprzeczenie standardu"]]}
  ]
 }
}
```
Uwaga do bloku warunkowego: `plank.mis.sag` NIE wpisane — NASM wprost („hips sag”), World Rugby tylko „Shoulders level with hips”, a zdanie `plank.mis.sag` mówi też o łuku lędźwi, którego World Rugby nie wymienia.
`push.setup` nie użyte — zawiera szerokość dłoni, której World Rugby nie podaje.

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| rollout.mis.bentArms | Zginanie rąk w łokciach zamiast trzymania ich prosto. | Bending your elbows instead of keeping your arms straight. |
| renegade.mis.twist | Skręcanie bioder i tułowia, żeby dźwignąć hantel. | Twisting the hips and torso to heave the dumbbell up. |
| plyo.setup (warunkowe) | Wejdź w pozycję do pompki, ciało proste od głowy do pięt. | Get into a push-up position, body straight from head to heels. |
| plyo.move (warunkowe) | Zejdź w dół jak w pompce i wypchnij się mocno, aż dłonie oderwą się od podłogi. | Lower as in a push-up, then push up hard enough for your hands to leave the floor. |
| plyo.land (warunkowe) | Ląduj miękko, na lekko ugiętych łokciach. | Land softly on slightly bent elbows. |
| plyo.mis.stiff (warunkowe) | Lądowanie na prostych, sztywnych rękach. | Landing on straight, locked arms. |

`renegade.mis.twist` i `plyo.move` — brzmienie z propozycji W1 (nie ma ich jeszcze w `lib/cues/text/pl.json`). `rollout.mis.bentArms` — błąd widoczny na rysunku (ugięte łokcie przy wytaczaniu).
Zdanie istniejące użyte: `plank.brace` (tylko blok warunkowy).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| barbend-renegade-row | https://www.barbend.com/renegade-row/ | BarBend; J. Boly, CSCS; akt. 26.11.2024 (z W1, ten sam id) | 4 (autor z kwalifikacjami i data) | Common Mistakes — Twisting Your Body (przeczytane w W1) |
| nasm-best-abs | https://www.nasm.org/resource-center/blog/training/best-abs-exercises | NASM; H. Cherry (CPT i in.), akt. 23.07.2026 (istniejące w repo) | 4 (organizacja certyfikująca, autor i data) | sekcja Renegade Row: Common Mistake „Allowing the hips to shift excessively from side to side.”; Coaching Tip „maintain square hips throughout the row” |
| catalyst-ab-rollout | https://catalystathletics.com/exercise/135/Ab-Rollout | Catalyst Athletics (z W1) | 4 (rozstrzygnięcie koordynatora) | opis: trzymanie kółka „with straight arms” (potwierdzenie zdania, z którego wnioskowany jest błąd) |
| nasm-plyometric-push-up | https://www.nasm.org/resource-center/exercise-library/plyometric-push-up | NASM (z W1) | 4 (organizacja certyfikująca, treść firmowana) | Steps 1–3; Common Mistakes: „Poor landing mechanics with straight elbows” |
| worldrugby-activate-plyo | https://passport.world.rugby/injury-prevention-and-risk-management/activate/under-18-age-16-18-years/level-2/part-d/ | World Rugby (międzynarodowa federacja; Passport = jej platforma szkoleniowa dla trenerów, z certyfikatami ukończenia modułów; program Activate) | **propozycja 4 — [OTWARTE]**: treść jawnie firmowana przez organizację szkolącą trenerów (pkt 1–2 kryteriów), ale federacji sportowej nie ma w tabeli szczebli; brak daty programu (tylko stopka © 2009–2026) | Plyo Press Up: „Clap hands in the air before catching with the elbows slightly bent”; key cues „Brace through the trunk” |
| nhs-wwl-shoulder-l3 | https://www.wwl.nhs.uk/pdfreader/accessiblePDF/cnv-wwl-68ca8bcea9f618.75465388 | Wrightington, Wigan and Leigh Teaching Hospitals NHS FT, MSK Physiotherapy, ulotka Tpy 028 „Shoulder Exercises Level 3”, wersja 2 (wyprodukowana 01.2024, „Expiry Date: January 2026”, plik zmodyfikowany 02.11.2026) | 4 (szpital, firmowanie — uzupełnienie 2) | s. 15, ćwiczenie „Plank Taps”: „Shift the weight onto one arm and tap the supporting arm with the other hand.”; „keep pelvis as level as possible” |
| schaber-2021 (= W1G5-4, L6-S6) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8486394/ | Schaber i in., IJSPT 2021, przegląd systematyczny | 2 | Methods, Eligibility Criteria — tylko do Otwartych (inna wersja ćwiczenia) |
| webmd-plyo-push-ups | https://www.webmd.com/fitness-exercise/how-to-do-plyometric-push-ups | WebMD; autor Venkat S.R. bez kwalifikacji, recenzja medyczna Shruthi N, MD, 07.08.2024 | 5 (autor bez kwalifikacji — reguła ogólna uzupełnienia 3); tylko do Otwartych | Steps 1–5 (start z klęku — inny wariant) |

## Otwarte (ćwiczenie/zdanie | powód)

1. **Plyo Push-Up — szczebel World Rugby Passport** | federacja sportowa z platformą szkoleniową dla trenerów nie jest w `szczeble-organizacji`; proponuję 4 (treść firmowana, organizacja szkoli trenerów, program zapobiegania urazom). Decyzja koordynatora 1.1. Po uznaniu 4 blok warunkowy przechodzi do wdrożenia (karta z błędem). Program Activate ma podobno publikację recenzowaną (RCT) — nieprzeczytana, nie liczę.
2. **Ab Wheel — `rollout.mis.arch`, `rollout.range`, `plank.brace`** | nadal tylko Catalyst. NASM Best Abs (sekcja Ab Wheel Rollout) pisze o celu, nie o błędzie: „the harder the core must work to prevent lumbar extension” — recenzent może uznać to za zaprzeczenie standardu dla `rollout.mis.arch`; bez tej decyzji otwarte. BarBend: strona techniki rolloutu nieznaleziona (404); Body-Solid: strona bez treści ćwiczenia; Sussex (centrum sportu uczelni) = 5.
3. **Plank Shoulder Taps** | jedno źródło szczebla 4 (NHS WWL, s. 15). Szpital opisuje dotknięcie **ręki podporowej** („tap the supporting arm”), a propozycja W1 `ptap.move` — przeciwnego **barku**; przy drugim źródle trzeba ustalić brzmienie. NHS: „keep pelvis as level as possible” — kandydat do `ptap.mis.rock` (zaprzeczenie standardu) po znalezieniu drugiego źródła. Ulotka ma datę ważności 01.2026 przy pliku zmodyfikowanym 02.11.2026 — do oceny recenzenta. Nieprzydatne: Prehab Guys (strona biblioteki bez autora = 5), Provide CIC (Issuu — nieprzeczytane), strony aplikacji.
4. **Copenhagen Plank** | tylko Catalyst. Schaber 2021 (szczebel 2) opisuje wersję z partnerem trzymającym górną nogę i ruchem dolnej nogi — inne ustawienie i ruch niż wersja z ławką i utrzymaniem; nie potwierdza `cph.setup`/`cph.move`. Strony w wynikach: aplikacje, sklepy, E3 Rehab (5), StrengthLog (aplikacja).
5. **Standing Barbell Rollout, Barbell Rollout from Bench, Suspended Fallout, Drop Push, Incline Push-Up Depth Jump, Plyo Kettlebell Push-Ups** | bez źródeł szczebla 4 (W1 + jedno wyszukiwanie W2). Analogii do rolloutu z klęku nie wpisuję (inna pozycja ciała — poza regułą wariantu sprzętu).
6. **Plyo Push-Up — `plank.mis.sag`** | NASM wprost; World Rugby tylko „Shoulders level with hips” (nie mówi o lędźwiach).
7. **Renegade Row — pompka między wiosłowaniami** | bez zmian od W1 (ACE 355; NASM Best Abs tylko jako progresja) — jeśli rysunek pokaże pompkę, potrzebny drugi opis.

## Zostało (następny krok, pułapki)

- Następny krok: decyzja o szczeblu World Rugby (Otwarte 1); szukać drugiego źródła szczebla 4 dla Plank Shoulder Taps (np. inne ulotki szpitalne; Provide CIC poza Issuu) i Copenhagen Plank (szpitale, NASM/ACE/ISSA z autorem).
- Pułapki: BarBend `/ab-wheel-rollout/` 404; NASM `/exercise-library/plank-shoulder-taps` 404; PDF NHS WWL nie daje tekstu przez WebFetch — trzeba czytać strony PDF (ćwiczenie „Plank Taps” na s. 15 z 18).

## Podsumowanie liczb

Ćwiczeń: 11 (zbadane w W2: 6 — Ab Wheel, Renegade Row, Plyo Push-Up, Plank Shoulder Taps, Copenhagen Plank, Barbell Rollout from Bench; pozostałe 5 bez nowych wyszukiwań poza Standing Barbell Rollout przez Catalyst).
Karty z błędem po W2: 2 (Ab Wheel, Renegade Row — dopisanie do kart W1) + 1 warunkowa (Plyo Push-Up). Nowe karty bez błędu: 0.
Błędy: wnioskowane 1 (`rollout.mis.bentArms`), ze źródeł 1 (`renegade.mis.twist`) + 1 warunkowy (`plyo.mis.stiff`).
Otwarte ćwiczenia: 8 (w tym Plyo Push-Up do decyzji). Nowe zdania: 6 (2 do wdrożenia, 4 warunkowe; 2 z nich z propozycji W1). Nowe źródła: 3 (worldrugby-activate-plyo, nhs-wwl-shoulder-l3, webmd-plyo-push-ups).
