# Recenzja niezależna treści kart — partia B2 (nogi), 09.11.2026

- Gałąź: `figury/b2-nogi` @ 01953ee4 (autor: sesja B #4 / programista A2; recenzent: badacz-merytoryczny).
- Uwaga o metodzie: w tej sesji nie było powłoki, więc nie dało się uruchomić `git show`. Treść kart (id zdań, źródła, miejsca) wziąłem
  z różnicy `integracja-1-1...01953ee4` na github.com (`.diff`), teksty PL/EN z `lib/cues/text/{pl,en}.json` @ 01953ee4 (raw),
  a adresy źródeł z rekordów `sources` w tej samej różnicy. Każde źródło niżej przeczytałem 09.11.2026, chyba że zaznaczono inaczej.
- Zasada: CLAUDE.md „Merytoryczne podstawy”. Błąd techniki potrzebuje 2 zgodnych, niezależnych organizacji szczebla 4. Uproszczenie
  „wariant sprzętu” jest dozwolone, gdy jest nazwane, kierunkowo zgodne i żadne przeczytane źródło mu nie przeczy.
  hk-landow-stepup = szczebel 4 (rozstrzygnięte 09.11, nie oceniam ponownie).

## Przeczytane źródła (miejsca)

| id | org | adres | miejsce i co potwierdza |
|---|---|---|---|
| nasm-bulgarian-split-squat | NASM | https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat | Common Mistakes: „Allowing the front knee to cave inward (valgus)…” oraz zejście za płytko. Nie wspomina wersji ze sztangą ani na suwnicy Smitha. |
| nsca-ptq-lunge | NSCA (PTQ 4.4, Boyd i Milton) | https://www.nsca.com/contentassets/24dd7222ed1b4caeb8a0a46b81bd11f3/ptq-4.4.9-the-undervalued-lunge.pdf | s. 45, tab. 1 „Forward Torso Lean”: „the torso can lean forward during the downward phase”; tab. 1 „Over-Pronation of the Foot/Knee Caves Inward”: „In all cases of the lunge, the toes and knees (of the same leg) should point in the same direction.”; tab. 2 „Completely Stationary”; tab. 3 „Make it Mobile” (wykroki w marszu) i „Add Resistance” (zmiana obciążenia na sztangę/hantle „as long as the movement can still be performed correctly”); s. 44–45 „Teaching cues” (ustawienie, faza opuszczania i wstawania). |
| ace-366 | ACE | https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/ | Tylna stopa na ławce, „Keep the back straight…”, wersja z hantlem. O kolanie nic (nie potwierdza, nie przeczy). |
| exrx-Quadriceps/DBSingleLegSplitSquat | ExRx.net | https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat | **Nieprzeczytane w tej sesji**: strona i archiwum zwracają 403 albo są zablokowane. Źródło stoi w zrecenzowanym już zestawie BSS (hantle). |
| catalyst-174 | Catalyst Athletics | https://catalystathletics.com/exercise/174/Split-Squat/ | „Keep the trunk upright…” (z lekkim, naturalnym przeniesieniem w stronę przedniej nogi); tylne kolano lekko dotyka podłogi. |
| catalyst-354 | Catalyst Athletics | https://catalystathletics.com/exercise/354/Lunge/ | Obciążenie „barbell on the back”; „maintain an upright trunk”; powrót przez odepchnięcie przednią nogą. |
| ace-8 | ACE | https://www.acefitness.org/resources/everyone/exercise-library/8/forward-lunge/ | Wersja ze sztangą; „keep the back straight through the entire movement”. |
| catalyst-600 | Catalyst Athletics | https://catalystathletics.com/exercise/600/Overhead-Walking-Lunge/ | „upright posture instead of leaning forward”; jeden ciągły krok. Wersja z ciężarem nad głową, czyli nazwane uproszczenie wariantu. |
| catalyst-560 | Catalyst Athletics | https://www.catalystathletics.com/exercise/560/Step-up/ | „Using the raised leg with minimal assistance from the other foot”; „control the motion back down as much as possible instead of just dropping”; „barbell on the back”. |
| hk-landow-stepup | Human Kinetics (Landow, Jarmon) | https://us.humankinetics.com/blogs/excerpt/want-to-boost-your-acceleration-try-this-strength-move | Sztanga na górze pleców; „driving his left foot into the box”; „controls his descent”; „upright posture through his trunk and shoulders”. |
| ace-28 | ACE | https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/ | **Przeczy:** „Push off with the trailing (left) leg to raise your body onto the platform.” Pisze też „lean slightly forward during the step-down”. |
| nismat-hamstring-sliders | NISMAT | https://nismat.org/2023/12/11/hamstring-sliders/amp/ | Leżenie na plecach, kolana ugięte, ręcznik pod stopami; „push your hips up… bridge”; wysunięcie nóg; „return your legs… without dropping your hips”; „Engage your abdominals”. |
| ncsf-single-leg-ball-curl | NCSF | https://www.ncsf.org/blog/183-single-leg-stability-ball-leg-curl | Wersja jednonóż na piłce, start z wyprostowanymi biodrami: „the hips should not sag and there should be no rotation of the pelvis.” |
| ace-59 | ACE | https://www.acefitness.org/resources/everyone/exercise-library/59/stability-ball-hamstring-curl/ | Wersja na piłce: biodra uniesione (krok 2), przyciąganie pięt przy biodrach w górze (krok 3), napięty brzuch, nie unosić bioder za wysoko (przeprost). |

## (1) Bulgarian Split Squat (sztanga) i Smith Machine Bulgarian Split Squat — `lunge.mis.kneeIn`

- Zdanie: „Przednie kolano uciekające do środka.” / „Front knee collapsing inwards.”
- **NASM BSS** podaje ten błąd wprost (Common Mistakes, „cave inward (valgus)”) — potwierdzone.
- **ExRx** (drugie źródło na karcie) — w tej sesji nie dało się przeczytać (403). Drugą organizację, którą przeczytałem i która mówi to
  wprost, daje **NSCA PTQ 4.4, tab. 1 „Knee Caves Inward”**: „In all cases of the lunge…”, czyli we wszystkich wersjach wykroku.
  BSS należy do wzorca wykroku, a A2 przypisuje go temu wzorcowi. Rekomenduję dopisać `nsca-ptq-lunge` (tab. 1) jako odwołanie przy
  tym zdaniu. To nie blokuje: ExRx jest w zestawie BSS (hantle), który już zrecenzowano.
- **Przeniesienie na sztangę i suwnicę Smitha:** kierunkowo zgodne. Sposób trzymania ciężaru nie zmienia ustawienia kolana względem stopy
  w płaszczyźnie czołowej. NSCA tab. 3 („Add Resistance”) dopuszcza zmianę rodzaju obciążenia, w tym sztangę, pod warunkiem poprawnej
  techniki. Żadne przeczytane źródło nie przeczy (ACE 366 i NASM milczą o wersji ze sztangą). Uproszczenie „wariant sprzętu” potwierdzam.
- Pozostałe zdania obu kart (bss.setup, bss.move, lunge.torso, lunge2.mis.shallow) to te same źródła, co BSS (hantle), z nazwanym
  uproszczeniem. NASM wprost podaje płytkie zejście jako błąd, a ACE 366 opisuje głębokość jako standard. Bez uwag.
- **Werdykt: obie karty — wyswietlana** (uwaga, nie bloker: dopisać NSCA tab. 1 przy `lunge.mis.kneeIn`).

## (2) Karty z błędami tylko w tekście

### Split Squat — `lunge2.mis.lean` („Pochylanie tułowia mocno w przód przy schodzeniu.”)
- NSCA PTQ tab. 1 „Forward Torso Lean” — wprost. Catalyst 174 „Keep the trunk upright” — standard (błąd = zaprzeczenie standardu).
  Słowo „mocno” w zdaniu zgadza się z Catalyst, które dopuszcza lekkie, naturalne przeniesienie. Dwie organizacje.
- Uwaga (niska): przy `split.setup` i `bss.move` miejsce w NSCA to „Teaching cues — Starting position / Lowering / Upward” (s. 44–45),
  nie „table 2” (tab. 2 to „Completely Stationary”, czyli tylko uzasadnienie, że wykrok w miejscu = przysiad wykroczny). Poprawić opis miejsca.
- **Werdykt: wyswietlana.**

### Lunges (sztanga) — `lunge2.mis.lean`
- NSCA tab. 1 (wprost) + Catalyst 354 „upright trunk” (wersja ze sztangą na plecach) + ACE 8 „back straight” (wersja ze sztangą).
- **Werdykt: wyswietlana.**

### Barbell Walking Lunge — `lunge2.mis.lean`
- NSCA tab. 1 (wprost; wykroki w marszu w tab. 3) + Catalyst 600 „instead of leaning forward” (wprost; wersja z ciężarem nad głową,
  uproszczenie nazwane na karcie). Dwie organizacje, kierunkowo zgodne.
- **Werdykt: wyswietlana.**

### Barbell Step Up — `stepup.mis.drop`, `stepup.mis.push`
- `stepup.mis.drop` („Opadanie z podwyższenia zamiast kontrolowanego zejścia.”): Catalyst 560 wprost („instead of just dropping”) +
  HK „controls his descent” (standard). ACE 28 („Slowly load…”) nie przeczy. **Potwierdzone.**
- `stepup.mis.push` („Odbijanie się nogą z podłogi zamiast wchodzenia nogą na podwyższeniu.”): Catalyst 560 pisze o „minimal assistance
  from the other foot”, a HK o wypychaniu się nogą na skrzyni. **Ale ACE 28 — źródło cytowane na tej samej karcie (move, tips) — mówi
  wprost „Push off with the trailing (left) leg to raise your body onto the platform.”** To sprzeczność na tym samym szczeblu 4.
  Część wspólna: główną pracę wykonuje noga na podwyższeniu, a noga z podłogi pomaga co najwyżej minimalnie (Catalyst). Różnica: ACE
  zaleca odbicie z tylnej nogi. Obecne brzmienie „zamiast” można czytać jako zakaz każdego odbicia, czyli wbrew ACE.
- **Werdykt: poprawki** — zmienić zdanie na część wspólną, np. PL: „Wybijanie się głównie nogą z podłogi — większość pracy ma zrobić
  noga na podwyższeniu.” / EN: „Driving mostly off the floor foot — let the leg on the box do most of the work.” (najpierw recenzent
  lokalizacji, potem `claims.mjs --rehash`). Różnicę z ACE 28 wpisać w miejscu źródła. Ten sam problem dotyczy otwartej pozycji P2
  (Step Up — `stepup.mis.push`). Druga możliwość: wycofać `stepup.mis.push` z karty (zostaje `stepup.mis.drop`, karta ma wtedy błąd).

## (3) Slider Hamstring Curl — „biodra cały czas w górze”

- `slcurl.move`: „Unieś biodra, wysuń nogi do wyprostu, potem przyciągnij pięty z powrotem — biodra cały czas w górze.”
  NISMAT wprost (mostek, wysunięcie, powrót „without dropping your hips”) + NCSF wprost („hips should not sag” podczas przyciągania,
  wariant piłki jednonóż) + ACE 59 (biodra w górze przy przyciąganiu, wariant piłki). **Potwierdzone, 2+ organizacje.**
- `ballcurl.mis.sag` („Biodra opadające w trakcie ruchu.”): NISMAT + NCSF — oba wprost. **Potwierdzone.**
- `plank.brace`: NISMAT „Engage your abdominals” + ACE 59 (napięty brzuch przez cały ruch). Potwierdzone.
- Uwaga (niska): w `slcurl.setup` szczegół „kolana ugięte” podaje wprost tylko NISMAT. ACE 59 i NCSF zaczynają z wyprostowanymi nogami
  na piłce (inny wariant), więc to nie sprzeczność: ruch przechodzi przez obie pozycje. Przy NCSF i ACE wpisać „uproszczenie: wariant
  piłki”, tak jak jest. NISMAT pisze o „ręczniku”, a nie o ślizgaczach — to ten sam ślizg po podłodze (tytuł strony „Hamstring Sliders”).
- Zgodność z rysunkiem: animowany błąd `ht.mis.arch` usunięty, `ballcurl.mis.sag` tylko w tekście. ACE 59 ostrzega też przed za wysokim
  uniesieniem bioder (przeprost), co nie przeczy karcie.
- **Werdykt: wyswietlana.**

## Otwarte

- [OTWARTE] ExRx DBSingleLegSplitSquat (Comments) — nieprzeczytane w tej sesji (403). Zastępczo przeczytana NSCA PTQ tab. 1.
- [OTWARTE] `stepup.mis.push` — sprzeczność ACE 28 z Catalyst 560 i HK; dotyczy też karty Step Up (P2). Rozstrzygnięcie przez zmianę
  brzmienia (część wspólna) albo wycofanie zdania.

## JSON do sekcji „karty” (`docs/research/figury-recenzja.json`) — runda 1

Pole `sha` pominięte (wpisuje koordynator). Barbell Step Up z werdyktem „poprawki” — wpis „wyswietlana” dopiero po rundzie 2.

```json
{
  "Split Squat": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 174", "uwagi": "Niska: miejsce NSCA przy split.setup/bss.move to „Teaching cues” s. 44–45, nie „table 2”." },
  "Lunges (sztanga)": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 354 + ACE 8" },
  "Barbell Walking Lunge": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 600 (uproszczenie: ciężar nad głową → sztanga na plecach, potwierdzone)" },
  "Barbell Step Up": { "werdykt": "poprawki", "data": "2026-11-09", "stan": "recenzja niezależna — poprawki (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; stepup.mis.drop potwierdzone (Catalyst 560 + HK)", "uwagi": "Wysoka: stepup.mis.push sprzeczne z ACE 28 („Push off with the trailing leg”) cytowanym na tej samej karcie — przeredagować na część wspólną (noga na podwyższeniu robi większość pracy) albo wycofać zdanie." },
  "Bulgarian Split Squat (sztanga)": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; uproszczenie hantle → sztanga potwierdzone; lunge.mis.kneeIn: NASM BSS + NSCA PTQ tab. 1", "uwagi": "Niska: dopisać nsca-ptq-lunge (tab. 1 „Knee Caves Inward”) przy lunge.mis.kneeIn; ExRx nieprzeczytane w tej recenzji (403)." },
  "Smith Machine Bulgarian Split Squat": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; uproszczenie hantle → suwnica Smitha potwierdzone; lunge.mis.kneeIn: NASM BSS + NSCA PTQ tab. 1", "uwagi": "Niska: jak Bulgarian Split Squat (sztanga)." },
  "Slider Hamstring Curl": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A2 / sesja B #4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; „biodra cały czas w górze” i ballcurl.mis.sag: NISMAT + NCSF (wprost), ACE 59", "uwagi": "Niska: „kolana ugięte” w slcurl.setup wprost tylko NISMAT; ACE 59/NCSF to wariant piłki (nazwane uproszczenie)." }
}
```

## Rozstrzygnięcie koordynatora (09.11.2026)

- Barbell Step Up: zdanie `stepup.mis.push` usunięte z karty (wariant „wycofać zdanie”); zostaje `stepup.mis.drop`, potwierdzone w tej recenzji. Runda 2 niepotrzebna — karta zawiera tylko zatwierdzony materiał.
- Dopiski (NSCA tab. 1 przy `lunge.mis.kneeIn`; miejsce NSCA „Teaching cues” s. 44–45) wprowadzone w `data/zrodla/cues.json`.
