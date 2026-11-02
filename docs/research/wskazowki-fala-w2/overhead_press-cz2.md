# overhead_press — wskazówki techniki, fala W2, runda 2 (badacz-merytoryczny, 02.11.2026)

Wejście: `overhead_press.md` (runda 1 W2 — źródła i id użyte ponownie), wyniki W1 grupy G5 i przeliczenie szczebli z 02.11.2026
(rozstrzygnięcia koordynatora 1.1 nadrzędne). Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`.
Strony niżej przeczytane WebFetch 02.11.2026. Strony aplikacji treningowych i sprzedawców pominięte. Floor Press with Chains (bench_press) — osobno w `bench_press-cz3.md`.

Pozy v2 (`lib/figures/v2/poses/overhead_press.json`): Kettlebell Press — stoi, jeden kettlebell w prawej ręce (l. 2573–2588);
Kettlebell Seated Press — ławka z oparciem 85°, jeden kettlebell (l. 6605–6627); Kettlebell Arnold Press — stoi, jeden kettlebell (l. 5326–5341);
Seated Cable Shoulder Press — ławka z oparciem 85°, dwa dolne wyciągi z tyłu (l. 7901–7927); oba jammery — rysunek jest (l. 12408, 13940).

## Ćwiczenia

| Ćwiczenie | Stan | Uwaga |
|---|---|---|
| Kettlebell Press | **gotowe** (było: częściowe bez ustawienia) | drugie źródło ustawienia: Catalyst #855 (opis dwóch kettlebelli — pozycja każdej ręki ta sama → uproszczenie). Ustawienie skrócone (`kbp.setup` bez „oparty o przedramię” — to tylko ACE). Błędy: `ohp.mis.sideLean` (z rundy 1), `ohp.mis.arch` (ISSA + NSCA), `kbp.mis.elbowOut` (wniosek z `kbp.setup`) |
| Kettlebell Seated Press | **gotowe — z uproszczeniem, do recenzji** | ISSA wymienia wprost „seated kettlebell press” i pisze, że górna część ciała pracuje jak na stojąco → ustawienie ręki i ruch z Kettlebell Press jako uproszczenie. Zdanie o siedzeniu (`ohp.seatBack`) poza blokiem — tylko ACE (jedna organizacja). Błędy: `ohp.mis.arch` (ISSA wprost o wersjach siedzących), `kbp.mis.elbowOut` (wniosek) |
| Seated Cable Shoulder Press | otwarte | brak ustawienia z 2 niezależnych źródeł: ACE 186 i ACE 43 to jedna organizacja; ExRx (karta w repo) — 403, nie przeczytany. Kandydaci niżej |
| Kettlebell Arnold Press | otwarte | wyszukiwanie: tylko strony aplikacji i Fitness Volt (4 warunkowo); opisy różnią się startem (rack przy barku vs przy mostku). Catalyst #855 opisuje obrót dłoni do przodu przy zwykłym wyciskaniu kettlebella — granica między „Arnold” a zwykłym wyciskaniem niejasna |
| Landmine Linear Jammer | otwarte | jedyny nowy trop (Stack, artykuł o ćwiczeniach z landmine na nogi) — HTTP 503, nieprzeczytany; reszta to strony aplikacji |
| Single-Arm Linear Jammer | otwarte | jak wyżej |

## Blok do wdrożenia

### Blok do wdrożenia
Pełne wpisy: Kettlebell Press, Kettlebell Seated Press. Oba ćwiczenia mają dziś zestaw ogólny (`lib/figures/v2/cue-sets.json:310–311`);
przy przejściu na kartę własną zdania zestawu ogólnego spoza bloku (`ohp.elbowsUnder`, `ohp.tall`, `ohp.fullExt`, `ohp.mis.lock`) znikają.

```json
{
 "Kettlebell Press": {
  "setup": [
   {"c": "kbp.setup", "s": [["ace-395", "opis (kettlebell in front of the chest near the shoulder; elbow close to the rib cage) — przeczytane w rundzie 1"], ["catalyst-kettlebell-press", "Description (a kettlebell in each hand at the shoulders… and the arms against the ribs)"]], "uproszczenie": "Catalyst opisuje wersję z dwoma kettlebellami — pozycja każdej ręki (kettlebell przy barku, ramię przy żebrach) jest ta sama"}
  ],
  "move": [
   {"c": "kbp.move", "s": [["nsca-etm4-one-arm-kb-press", "Upward Movement (press the kettlebell overhead, elbow fully extended); Downward Movement (lower slowly and under control)"], ["ace-395", "opis (press the arm straight overhead; pull the elbow back down to the rib cage)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.sideLean", "s": [["nsca-etm4-one-arm-kb-press", "Upward Movement (do not allow the spine to flex laterally) — błąd = zaprzeczenie standardu"], ["strongfirst-mastering-your-press-1", "When Things Get Heavy, punkt 5 (side lean increasing during the attempt)"]]},
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "wstęp (dumbbell, kettlebell, and resistance band variations) + Common Mistakes, punkt 6 (Arching the lower back)"], ["nsca-etm4-one-arm-kb-press", "wskazówki tułowia (keep the spine neutral) — błąd = zaprzeczenie standardu"]]},
   {"c": "kbp.mis.elbowOut", "s": [["wniosek", "kbp.setup"]]}
  ]
 },
 "Kettlebell Seated Press": {
  "setup": [
   {"c": "kbp.setup", "uproszczenie": "pozycja siedząca Kettlebell Press — ISSA: górna część ciała pracuje w wersji siedzącej bardzo podobnie jak na stojąco; zmienia się tylko podparcie (ławka zamiast stóp i bioder)", "s": [["ace-395", "opis (kettlebell near the shoulder; elbow close to the rib cage)"], ["catalyst-kettlebell-press", "Description (at the shoulders… arms against the ribs)"], ["issa-overhead-press-mistakes", "Seated Variations (seated kettlebell press; the upper body form is very similar… to the standing version)"]]}
  ],
  "move": [
   {"c": "kbp.move", "uproszczenie": "pozycja siedząca Kettlebell Press — ten sam tor ręki nad głowę i powrót do barku (ISSA, Seated Variations)", "s": [["nsca-etm4-one-arm-kb-press", "Upward Movement; Downward Movement"], ["ace-395", "opis (press straight overhead; elbow back down to the rib cage)"], ["issa-overhead-press-mistakes", "Seated Variations (very similar to the standing version)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Seated Variations (seated kettlebell press; seated position can help minimize a client's lower back arch) + Common Mistakes, punkt 6 (Arching the lower back)"], ["nsca-etm4-one-arm-kb-press", "wskazówki tułowia (keep the spine neutral; wersja stojąca) — błąd = zaprzeczenie standardu"]]},
   {"c": "kbp.mis.elbowOut", "s": [["wniosek", "kbp.setup"]]}
  ]
 }
}
```

Uwagi dla recenzenta: (1) `ohp.mis.sideLean` przy Kettlebell Press zależy od szczebla StrongFirst (brak daty na stronie — runda 1);
jeśli 5, błąd wypada, karta zostaje przy `ohp.mis.arch` i `kbp.mis.elbowOut`. (2) Fragmentu NSCA „keep the spine neutral” nie czytałem
ponownie w tej sesji (cytat z rundy 1, tabela „Kandydaci”). (3) Kettlebell Seated Press stoi na uproszczeniu „pozycja siedząca” — brief
zabrania rozciągania na inną pozycję ciała, ale tu źródło (ISSA) samo przenosi formę górnej części ciała na wersję siedzącą z kettlebellem;
jeśli recenzent tego nie przyjmie, karta wraca do „otwarte”. (4) `kbp.mis.elbowOut` — zaprzeczenie „łokieć blisko żeber”, widoczne na rysunku (łokieć odsunięty w bok w pozycji startowej).

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| kbp.setup (zmiana propozycji W1) | Kettlebell przy barku, łokieć blisko żeber. | Kettlebell at your shoulder, elbow close to your ribs. |
| kbp.mis.elbowOut | Łokieć odstaje od żeber, a kettlebell wisi z dala od tułowia. | Elbow drifting away from your ribs, with the kettlebell held away from your body. |
| ohp.seatBack (kandydat, poza blokiem) | Usiądź z plecami opartymi o oparcie, stopy mocno na podłodze. | Sit with your back against the backrest and your feet firmly on the floor. |

Bez zmian z rundy 1 (jeszcze nie w `pl.json`): `kbp.move` („Wypchnij kettlebell prosto nad głowę; opuść go spokojnie z powrotem do barku.”),
`ohp.mis.sideLean`, `ohp.mis.arch`. `kbp.setup` z W1 („…oparty o przedramię…”) — część o przedramieniu tylko w ACE 395, stąd krótszy tekst.

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| catalyst-kettlebell-press (NOWE) | https://catalystathletics.com/exercise/855/Ketllebell-Press/ | Catalyst Athletics (hasło biblioteki, bez autora i daty) | 4 — wiersz Catalyst w pliku szczebli (biblioteka firmowana przez Catalyst Athletics, Inc.) | Description: „Stand with a kettlebell in each hand at the shoulders with the palms facing inward and partially toward the chest and the arms against the ribs.” |
| issa-overhead-press-mistakes (runda 1) | https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes | ISSA, firmowane „ISSA”, 05.02.2024 | 4 (wiersz ISSA) | Seated Variations: „The upper body form is very similar in the seated overhead press to the standing version of the lift.”; lista wariantów siedzących z „seated kettlebell press”; Common Mistakes 1–8 — przeczytane ponownie 02.11.2026 |
| ace-186 (repo) | https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/ | ACE | 4 | przeczytane ponownie: **maszyna (Weight Machines / Selectorized)**, nie hantle; plecy oparte o oparcie, stopy na podłodze, „fully extended but not locked” — tylko kandydaci |
| ace-43 (repo) | https://www.acefitness.org/resources/everyone/exercise-library/43/ | ACE | 4 | przeczytane ponownie: Seated Shoulder Press ze sztangą (sit in a shoulder-press bench; keep the back straight; press the feet into the floor) — tylko kandydaci |
| nsca-etm4-one-arm-kb-press (runda 1) | https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press | NSCA ETM wyd. 4 (Human Kinetics) | 3 | Starting Position odsyła do zarzutu (nie opisuje pozycji przy barku — sprawdzone ponownie); Upward/Downward Movement |
| ace-395, strongfirst-mastering-your-press-1 (runda 1) | jak w `overhead_press.md` | ACE; StrongFirst | 4; 4 do potwierdzenia | jak w rundzie 1 |

Przeczytane, nieużyte: wyszukiwania „seated kettlebell press”, „seated cable shoulder press”, „kettlebell arnold press”, „linear jammer” — wyniki
to głównie strony aplikacji (pominięte), sprzedawcy kettlebelli (5), Prehab Guys (5), instrukcja domowego atlasu jednego producenta (dotyczy jego maszyny, nie dolnych wyciągów).
Niedostępne: Stack „The Best Lower-Body Landmine Exercises” (503).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Seated Cable Shoulder Press | Kandydaci: setup `ohp.seatBack` [ace-186 „back fully supported against the pad; feet on the floor” — maszyna; ace-43 „keep the back straight; press the feet into the floor” — sztanga; obie ACE = jedno źródło]; move `ohp.move` (wariant sprzętu Seated Shoulder Press — uchwyty wyciągu zamiast hantli, ten sam pionowy wypych); błąd `ohp.mis.arch` [ISSA Seated Variations + Common Mistakes]. Brakuje drugiej organizacji do ustawienia (ExRx 403). Zestaw ogólny `ohp.seat` mówi o hantlach — błąd zestawu (jak w W1) |
| `ohp.seatBack` (Kettlebell Seated Press, Seated Cable) | tylko ACE (186 i 43 — jedna organizacja); ISSA nie opisuje oparcia ani stóp |
| Karta repo „Seated Shoulder Press (hantle)” — źródło ace-186 | **do koordynatora:** ACE 186 opisuje wyciskanie na maszynie (Weight Machines / Selectorized), nie hantlami; karta cytuje je przy `ohp.seat`, `ohp.elbowsUnder`, `ohp.fullExt` bez oznaczenia uproszczenia. Ten sam wpis użyła runda 1 przy `ohp.mis.arch` (Seated Shoulder Press). Do oznaczenia jako „wariant sprzętu” albo zamiany źródła |
| Kettlebell Arnold Press | jak w tabeli ćwiczeń; zestaw ogólny (`ohp.move`, `ohp.tall`, `ohp.fullExt`, `ohp.mis.lock`) niepotwierdzony |
| Landmine Linear Jammer, Single-Arm Linear Jammer — także sygnał `pp.legs` | brak przeczytanego źródła szczebla ≤ 4; W1: jedyny opis (sprzedawca, 5) przeczy `pp.legs` (wyciskanie bez pracy nóg) |
| Role mięśni — jammery (czworogłowe) | brak źródła o pracy nóg → bez propozycji `nameRules`; pliku `role-miesni-fala-w2/overhead_press-cz2.md` nie tworzę |
| Sygnał `ohp.mis.lock` przy KB Seated / KB Arnold / Seated Cable | bez zmian względem rundy 1: ISSA (Common Mistakes 3) każe blokować łokcie, ACE 186 — „fully extended but not locked”; sprzeczność na szczeblu 4, część wspólna — wyprost rąk na górze; `ohp.mis.lock` nie trafia na karty |
| Double Kettlebell Press (poza zakresem rundy) | **trop:** Catalyst #855 opisuje wprost wyciskanie dwoma kettlebellami (ustawienie + ruch: „Press the weights up… Lower under control by reversing the motion”). Drugie źródło: NSCA/ACE jednorącz jako uproszczenie — do następnej rundy |

## Podsumowanie
- Ćwiczeń zbadanych: 6 (Kettlebell Press — ustawienie, Kettlebell Seated Press, Seated Cable Shoulder Press, Kettlebell Arnold Press, 2 jammery).
- Nowe karty z błędami: 2 (Kettlebell Press; Kettlebell Seated Press — z uproszczeniem, do recenzji); bez błędów: 0.
- Błędy wnioskowane: 1 zdanie (`kbp.mis.elbowOut`) w 2 kartach; błędy ze źródeł: `ohp.mis.sideLean`, `ohp.mis.arch`.
- Role mięśni gotowe: 0 (jammery otwarte). Otwarte ćwiczenia: 4 (Seated Cable, KB Arnold, 2 jammery).
- Nowe zdania: 1 (`kbp.mis.elbowOut`) + 1 zmiana propozycji (`kbp.setup`) + 1 kandydat poza blokiem (`ohp.seatBack`).

## Zostało (następny krok, pułapki)
- Seated Cable Shoulder Press: drugie źródło ustawienia siedzącego spoza ACE (np. ExRx, gdy dostępny; instrukcja producenta stacji z dwoma wyciągami — tylko dla jego sprzętu).
- Double Kettlebell Press: złożyć kartę z Catalyst #855 + NSCA/ACE (uproszczenie jednorącz → oburącz).
- Jammery: przeczytać Stack (503) albo artykuł z autorem z kwalifikacjami; bez tego `pp.legs` i rola czworogłowych otwarte.
- Pułapki: Human Kinetics — fragment o zarzucie kettlebellem 404; ACE 186 to maszyna, nie hantle.
