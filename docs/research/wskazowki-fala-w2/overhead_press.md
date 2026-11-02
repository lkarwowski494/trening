# overhead_press — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Wejście: wyniki W1 grupy G5 (`overhead_press-cz1.md` — blok NIEWAŻNY, `-cz1b.md`, `-cz2.md`) i przeliczenie szczebli z 02.11.2026
(z rozstrzygnięciami koordynatora 1.1, nadrzędne). Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`.
Wszystkie strony niżej przeczytane WebFetch 02.11.2026 (nowe) albo w W1 tego samego dnia (id ponownie użyte — zaznaczone).
Strony aplikacji treningowych i sprzedawców pominięte. Ćwiczeń „gotowych” w W1 (Arnold Press, Seated Barbell Military Press) nie badałem ponownie.

## Ćwiczenia

| Ćwiczenie | Stan | Uwaga |
|---|---|---|
| Arnold Press | gotowe (W1) | nie badane ponownie |
| Seated Barbell Military Press | gotowe (W1) | nie badane ponownie |
| Landmine Press | częściowe W1 → z błędem | **dopisać do karty W1**: `lm.mis.vertical` (wniosek z `lm.move` + BarBend „Incorrect Bar Path”) |
| Band Shoulder Press | **gotowe** | po przeliczeniu straciła Prehab Guys (5); nowe drugie źródło: ColumbiaDoctors (materiał WebMD Ignite w placówce medycznej, data 01.05.2026 → 4). Błąd `ohp.mis.arch` z uproszczeniem (ISSA, wersja sztanga/hantle) |
| Single Arm Overhead Press (hantel) | **gotowe — z uproszczeniem, do recenzji** | ruch i błąd z jednorącz kettlebella (NSCA ETM, szczebel 3; ACE 395) jako wariant sprzętu; ustawienie ACE 395 + ColumbiaDoctors (hantle oburącz) — oba z uproszczeniem |
| Kettlebell Press | częściowe (ruch + 2 błędy, **bez ustawienia**) | ustawienie `kbp.setup` — tylko ACE 395 (NSCA nie opisuje pozycji przy barku w przeczytanym fragmencie, CrossFit opisuje inny „rack” — łokcie na biodrach). Poza blokiem; zdania w „Kandydaci” |
| Overhead Press (sztanga) — karta w repo bez błędu | karta w repo → z błędem | **dopisać `mistakes`**: `ohp.mis.arch`, `ohp.mis.flare` (ISSA + ACE) |
| Overhead Press (hantle) — karta w repo bez błędu | karta w repo → z błędem | **dopisać `mistakes`**: `ohp.mis.arch` (ISSA wprost o hantlach + ACE 71 jak w karcie) |
| Seated Shoulder Press (hantle) — karta w repo bez błędu | karta w repo → z błędem | **dopisać `mistakes`**: `ohp.mis.arch` (ISSA „Seated Variations” + ACE 186) |
| Push Press - Behind the Neck | otwarte | ustawienie `pp.btnSetup` — tylko Catalyst (4). Ruch, ugięcie i nogi dałyby się wziąć z karty Push Press jako uproszczenie (to samo ugięcie i wybicie), ale bez drugiego źródła ustawienia karty nie ma |
| Standing Barbell Press Behind Neck | otwarte | nadal tylko Catalyst; drugiego źródła szczebla 4 nie znalazłem (BarBend — strona główna zamiast artykułu) |
| Double Kettlebell Press | otwarte | CrossFit (Martone, 2008) opisuje „rack” do wybicia (łokcie na biodrach), wyciskania ścisłego nie opisuje; NSCA/ACE — jeden kettlebell. Karta byłaby w całości z uproszczeń — nie składam |
| Pike Push Up | otwarte | nadal tylko NASM; wyszukiwanie dało strony aplikacji i serwisy bez autora |
| Handstand Push Up | otwarte | nadal tylko CrossFit; bez rysunku v2 |
| Bradford Press | otwarte | bez zmian (jedno źródło 4 warunkowo, Fitness Volt); bez rysunku v2 |
| See-Saw Press (Alternating Side Press) | otwarte | bez zmian (W1: Catalyst #797 opisuje wersję bez pochylenia bocznego) |
| Kettlebell Seated Press, Kettlebell Arnold Press | otwarte | nie badane w tej fali (W1: brak źródeł spoza aplikacji) |
| Seated Cable Shoulder Press | otwarte | nie badane (W1: `ohp.seat` mówi o hantlach — nie pasuje) |
| Landmine Linear Jammer, Single-Arm Linear Jammer | otwarte | nie badane (W1: jedyny opis — sprzedawca, szczebel 5) |

## Blok do wdrożenia

### Blok do wdrożenia
Pełne wpisy: Band Shoulder Press, Single Arm Overhead Press (hantel). Tylko `mistakes` (dopisać do istniejącej karty): Landmine Press (karta z bloku
przeliczenia W1), Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle) (karty w `data/zrodla/cues.json`).

```json
{
 "Band Shoulder Press": {
  "setup": [
   {"c": "band.ohpSetup", "s": [["bodylastics-standing-shoulder-press", "Start and Finish Positions (stand on the bands; handles at shoulder level) — przeczytane w W1"], ["columbia-shoulder-press-band", "instrukcja (standing, pass the band under your feet; one end of the band in each hand)"]]}
  ],
  "move": [
   {"c": "band.ohpMove", "s": [["bodylastics-standing-shoulder-press", "Movement (press the handles overhead; lower under control) — przeczytane w W1"], ["columbia-shoulder-press-band", "instrukcja (slowly press your arms straight up over your head; slowly return to your starting position)"]]}
  ],
  "tips": [
   {"c": "ohp.tall", "s": [["bodylastics-standing-shoulder-press", "Start and Finish Positions (back straight, head straight, chest up) — przeczytane w W1"], ["columbia-shoulder-press-band", "instrukcja (sit or stand up straight; press straight up)"]]}
  ],
  "mistakes": [
   {"c": "ohp.mis.arch", "uproszczenie": "wariant sprzętu Overhead Press — guma zamiast sztangi/hantli, ten sam pionowy wypych nad głowę na stojąco", "s": [["issa-overhead-press-mistakes", "Common Mistakes (arching the lower back)"], ["bodylastics-standing-shoulder-press", "Start and Finish Positions (keep your back straight) — błąd = zaprzeczenie standardu"]]}
  ]
 },
 "Single Arm Overhead Press (hantel)": {
  "setup": [
   {"c": "ohp.saSetup", "uproszczenie": "wariant sprzętu: ACE 395 — jednorącz z kettlebellem, ColumbiaDoctors — hantle oburącz; pozycja startowa (stoisz, ciężar przy barku) ta sama", "s": [["ace-395", "opis (stand with the feet hip-width apart; kettlebell in front of the chest near the shoulder)"], ["columbia-shoulder-press-band", "instrukcja (stand up straight; hands near your shoulders; small weights such as dumbbells instead of a band)"]]}
  ],
  "move": [
   {"c": "ohp.saMove", "uproszczenie": "wariant sprzętu wyciskania jednorącz z kettlebellem — ten sam tor ręki nad głowę i powrót do barku; różni się tylko to, jak ciężar leży w dłoni", "s": [["nsca-etm4-one-arm-kb-press", "Upward Movement (press the kettlebell overhead, elbow fully extended); Downward Movement (lower slowly and under control back to the starting position)"], ["ace-395", "opis (press the right arm straight overhead; pull the elbow back down to the rib cage to lower)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.sideLean", "uproszczenie": "wariant sprzętu wyciskania jednorącz z kettlebellem — ciężar po jednej stronie ciała tak samo przechyla tułów", "s": [["nsca-etm4-one-arm-kb-press", "Upward Movement (do not allow the spine to flex laterally) — błąd = zaprzeczenie standardu"], ["strongfirst-mastering-your-press-1", "When Things Get Heavy, punkt 5 (leg drive and side lean increasing during the attempt) — przeczytane w W1 i ponownie 02.11.2026"]]}
  ]
 },
 "Landmine Press": {
  "mistakes": [
   {"c": "lm.mis.vertical", "s": [["wniosek", "lm.move"], ["barbend-landmine-press", "Common Landmine Press Mistakes: Incorrect Bar Path (a combination of a vertical and horizontal press); How to (a slight diagonal angle, not directly up and down)"]]}
  ]
 },
 "Overhead Press (sztanga)": {
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Common Mistakes (arching the lower back; keep the spine neutral)"], ["ace-71", "opis (back straight and tall) — błąd = zaprzeczenie standardu; miejsce jak w karcie (tips, ohp.tall)"]]},
   {"c": "ohp.mis.flare", "s": [["issa-overhead-press-mistakes", "Common Mistakes (letting the elbows flare out; the elbows should point forward)"], ["ace-43", "opis, zdanie 3 (keep the elbows pointed forward; siedząc — ten sam bój, jak w karcie przy ohp.bbSetup) — błąd = zaprzeczenie standardu"]]}
  ]
 },
 "Overhead Press (hantle)": {
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Standing Dumbbell Overhead Press (very similar to the standing barbell overhead press) + Common Mistakes (arching the lower back)"], ["ace-71", "opis (back straight and tall; sztanga — ten sam ruch, jak w karcie przy ohp.move/ohp.tall) — błąd = zaprzeczenie standardu"]]}
  ]
 },
 "Seated Shoulder Press (hantle)": {
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Seated Variations (seated position can help minimize the lower back arch) + Common Mistakes (arching the lower back)"], ["ace-186", "Step 1 (back against the backrest) — błąd = zaprzeczenie standardu; miejsce jak w karcie (setup, ohp.seat)"]]}
  ]
 }
}
```

Uwagi dla recenzenta: (1) przy kartach w repo cytaty ACE wziąłem z istniejących wpisów `cues.json` (ace-71, ace-43, ace-186) — stron ACE nie
otwierałem ponownie w tej sesji; (2) Single Arm Overhead Press stoi w całości na uproszczeniach (wariant sprzętu) — jeśli recenzent ich nie przyjmie,
karta wraca do „otwarte”; (3) `ohp.mis.arch` przy Band Shoulder Press — ISSA nie wymienia gumy.

## Kandydaci poza blokiem (karta niekompletna)

| Ćwiczenie | zdanie | źródła | brak |
|---|---|---|---|
| Kettlebell Press | `kbp.setup` (W1) | ace-395 (opis: forearm, elbow close to the ribs) | drugie źródło szczebla 4 albo jedno szczebla 3 |
| Kettlebell Press | `kbp.move` (nowy tekst, niżej) | ace-395 (press straight overhead; pull the elbow down to the rib cage) + nsca-etm4-one-arm-kb-press (Upward/Downward Movement) | — (gotowe) |
| Kettlebell Press | `ohp.mis.sideLean` | nsca-etm4-one-arm-kb-press (no lateral flexion — zaprzeczenie standardu) + strongfirst-mastering-your-press-1 (punkt 5) | — (gotowe) |
| Kettlebell Press | `ohp.mis.leanBack` (W1) | strongfirst-mastering-your-press-1 (punkt 3: lean back as a change of shape) + nsca-etm4-one-arm-kb-press („Keep the spine neutral” — zaprzeczenie standardu; słabsze: odchylenie może iść z bioder) | do oceny recenzenta |
| Push Press - Behind the Neck | `pp.btnSetup` | catalyst-push-press-behind-the-neck (Description: bar on the traps as for a back squat) | drugie źródło |
| Push Press - Behind the Neck | `pp.move`, `pp.dip`, `pp.legs`, `pp.mis.hipsBack` | Catalyst (Description: dip with knees only, trunk vertical; drive with the legs; Notes: hips back and chest forward as error) + źródła karty Push Press (ace-24, exrx) jako uproszczenie „to samo ugięcie i wybicie, sztanga za karkiem” | najpierw ustawienie |

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| lm.mis.vertical | Wypychanie sztangi pionowo w górę zamiast po skosie, w przód. | Pressing the bar straight up instead of up and forward on a diagonal. |
| ohp.mis.sideLean | Przechylanie się w bok, żeby wypchnąć ciężar. | Leaning to the side to get the weight up. |
| kbp.move (zmiana propozycji W1) | Wypchnij kettlebell prosto nad głowę; opuść go spokojnie z powrotem do barku. | Press the kettlebell straight overhead; lower it under control back to your shoulder. |

Bez zmian z W1 (jeszcze nie w `pl.json`, teksty w `overhead_press-cz1.md` / `-cz1b.md`): `band.ohpSetup`, `band.ohpMove`, `ohp.saSetup`, `ohp.saMove`,
`ohp.mis.arch`, `ohp.mis.flare`, `ohp.mis.leanBack`, `kbp.setup`. `kbp.move` z W1 („…wzdłuż boku…, łokieć blisko tułowia”) — część o łokciu tylko w ACE, stąd krótszy tekst.

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| nsca-etm4-one-arm-kb-press (NOWE) | https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press | NSCA, „Exercise Technique Manual for Resistance Training”, wyd. 4 — fragment u wydawcy Human Kinetics | **3** — wiersz Human Kinetics w pliku szczebli: autor = organizacja naukowo-szkoleniowa (NSCA) | Starting Position (z zarzutu jednorącz); Upward Movement; Downward Movement; wskazówki tułowia |
| columbia-shoulder-press-band (NOWE) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/ | ColumbiaDoctors (materiał WebMD Ignite, recenzja „Clinical Review Board”) | **4** — wiersz WebMD Ignite: materiał publikowany przez placówkę medyczną z datą („Current as of: May 1, 2026”) | instrukcja (guma pod stopami albo pod pośladkami; hantle jako zamiennik) |
| issa-overhead-press-mistakes (W1) | https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes | ISSA, firmowane „ISSA”, 05.02.2024 | 4 (wiersz ISSA) | Standing Dumbbell Overhead Press; Seated Variations; Common Mistakes — przeczytane ponownie 02.11.2026 |
| strongfirst-mastering-your-press-1 (W1) | https://www.strongfirst.com/mastering-your-press-part-i/ | StrongFirst, F. Zonin (Certified Master Instructor); data niewidoczna (komentarze 12.2021) | 4 (W1) — **do potwierdzenia**: brak widocznej daty; jeśli koordynator wymaga daty, 5 i wtedy `ohp.mis.sideLean` spada | When Things Get Heavy, punkty 3–5 — przeczytane ponownie 02.11.2026 |
| ace-395 (W1) | https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/ | ACE | 4 | opis — przeczytane ponownie 02.11.2026 |
| barbend-landmine-press (W1) | https://barbend.com/landmine-press/ | BarBend; M. Dewar (MS, CSCS), akt. A. Polish (NASM-CNC, ACE-CPT) 25.11.2024 | 4 | Common Landmine Press Mistakes; How to — przeczytane ponownie 02.11.2026 |
| bodylastics-standing-shoulder-press (W1) | https://bodylastics.com/standing-shoulder-press-with-bands | Bodylastics (producent gum) | 4 — tylko ćwiczenia z gumami (wiersz Bodylastics) | jak w W1 (nie otwierane ponownie) |
| catalyst-push-press-behind-the-neck (W1) | https://www.catalystathletics.com/exercise/88/Push-Press-Behind-The-Neck/ | Catalyst Athletics | 4 | Description; Notes — przeczytane ponownie 02.11.2026 (tylko kandydaci) |
| ace-71, ace-43, ace-186 (repo) | jak w `data/zrodla/cues.json` | ACE | 4 | miejsca z istniejących kart |

Przeczytane, nieużyte: NFPT „Instructions: Resistance Band Shoulder Press” (https://nfpt.com/blog/instructions-resistance-band-shoulder-press — autorka bez
kwalifikacji na stronie → 5 wg wiersza NFPT; wersja siedząca na ławce); CrossFit „Double-Kettlebell Push Press and Jerk” (ponownie — „rack” z łokciami na biodrach,
wyciskania ścisłego nie opisuje); BarBend `?p=8663` (strona główna, nie artykuł). Niedostępne: HK „one-arm-kettlebell-clean” (404), OriGym (weryfikacja „One moment, please” — nieprzeczytane).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Sygnał `ohp.mis.lock` / `ohp.fullExt` (zestawy ogólne: Kettlebell Press, Double KB Press, Single Arm, Band, KB Seated, Arnold, See-Saw, Push Press BTN) | nowe źródła też każą prostować do końca: NSCA ETM („elbow fully extended”), ISSA (Common Mistakes: „The elbows should be locked at the top of the press”), Catalyst BTN („lock out in a secure overhead position”). Żadne przeczytane nie mówi o „gwałtownym” blokowaniu. `ohp.mis.lock` nie trafia na żadną kartę; zestaw ogólny do zmiany (błąd zestawu, jak w W1) |
| Sygnał `ohp.mis.shrug` (Landmine Press, Band) | ISSA wymienia jako błąd odwrotność: „Not shrugging the shoulders” — sprzeczność z BarBend („shoulders back and down”). Nie dodaję |
| Sygnał `ohp.seat` (Seated Cable Shoulder Press) | bez zmian: zdanie mówi o hantlach; ćwiczenie nie badane |
| Sygnał `ohp.tall`/`ohp.elbowsUnder` (See-Saw, zza karku) | bez zmian: nie przenosić (See-Saw — pochylenie boczne; zza karku — Catalyst: tułów lekko w przód i stały) |
| Sygnał `pp.legs` (jammery) | brak przeczytanego źródła o pracy nóg w jammerze; zestaw ogólny niepotwierdzony |
| Kettlebell Press — `kbp.setup` | jedno źródło szczebla 4 (ACE 395); wyszukiwanie dało sprzedawców, serwisy bez autora i forum |
| Landmine Press — `ohp.mis.arch` (rib flare), nadgarstek | tylko BarBend |
| Band Shoulder Press — dłonie przy barkach, łokcie przy bokach | tylko ColumbiaDoctors („elbows bent and close to your sides”) — nie dodano |
| Double Kettlebell Press, Pike Push Up, Handstand Push Up, Standing BTN, Push Press BTN, Bradford, See-Saw | drugie źródło szczebla 4 nie znalezione (szczegóły w tabeli ćwiczeń) |
| StrongFirst — szczebel | brak daty na stronie; od tego zależy `ohp.mis.sideLean` przy obu kartach kettlebell/hantel |

## Podsumowanie
- Ćwiczeń w rodzinie (z listy W1 + 3 karty z repo bez błędu): 21; zbadanych w tej fali: 13 (pozostałe — gotowe W1 albo bez nowych tropów).
- Nowe karty z błędami: 2 (Band Shoulder Press, Single Arm Overhead Press — ta z uproszczeniem); bez błędów: 0.
- Dopisane błędy do kart bez błędu: 4 karty (Landmine Press z W1; Overhead Press sztanga i hantle, Seated Shoulder Press z repo) — 5 wpisów.
- Błędy wnioskowane: 1 (`lm.mis.vertical`). Częściowe poza blokiem: 1 (Kettlebell Press — brak ustawienia).
- Otwarte ćwiczenia: 13. Nowe zdania: 2 (+1 zmiana propozycji `kbp.move`).

## Zostało (następny krok, pułapki)
- Kettlebell Press: drugie źródło ustawienia przy barku (organizacja kettlebellowa z autorem i datą; RKC/Dragon Door poza siecią sesji w W1).
- Push Press BTN: drugie źródło ustawienia → wtedy karta z uproszczeniem z Push Press.
- Nie badane w W2: KB Seated, KB Arnold, Seated Cable, jammery.
- Pułapki: OriGym — weryfikacja przeglądarki; HK — część fragmentów 404; BarBend `?p=` przekierowuje na stronę główną.
