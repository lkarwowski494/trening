# bench_press (cz. 1) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki”, „Źródła publicznie anonimowo”; brief fali W2 (grupa G5);
szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 1–3) i rozstrzygnięć koordynatora 1.1 z 02.11.2026
w przeliczeniu W1 (Major Fitness /blogs/wiki/ = 5, Bells of Steel = 5). Wszystkie strony przeczytane narzędziem WebFetch 02.11.2026.
Strony innych aplikacji treningowych odrzucone bez czytania i bez nazw. Punkt wyjścia: wyniki W1 `bench_press-cz1.md` i `bench_press-cz1b.md`
(gałąź `badania/g5-pchanie`) oraz przeliczenie szczebli W1.

Role mięśni: W1 nie wskazała luk ról dla rodziny bench_press (brak pliku `role-miesni-fala-w1/bench_press.md`, w STAN W1 luki tylko dla innych
rodzin) — pliku `role-miesni-fala-w2/bench_press-cz1.md` nie tworzę.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Decline Bench Press (hantle) | gotowe | ustawienie (nowe zdanie: NFPT + Fitness Volt), ruch (NFPT + BarBend + Fitness Volt), wskazówka łopatek (NFPT + BarBend), błąd wnioskowany z ruchu (łokcie pod hantlami). Bez `bench.decline.setup` (nogi pod wałkami — tylko BarBend) |
| Floor Press (sztanga) | gotowe | ustawienie i ruch: BarBend + Fitness Volt (nowe źródło, autor CSCS); wskazówka `bp.blades`; błąd ze źródeł „łopatki wychodzą do przodu na górze” (BarBend wprost + Fitness Volt standard — błąd = zaprzeczenie standardu) i błąd wnioskowany „za krótki ruch”. Spór o nogi W1 omija się: żadne zdanie nie mówi o nogach |
| Floor Press (hantle) | gotowe (z uproszczeniem w ustawieniu) | ruch: BarBend („kroki prawie identyczne z hantlami”) + Fitness Volt (sekcja o hantlach: łokcie dotykają podłogi); ustawienie — uproszczenie „wariant sprzętu Floor Press (sztanga)”; błąd wnioskowany „za krótki ruch” |
| Decline Bench Press | otwarte | po rozstrzygnięciu (Bells of Steel = 5): ustawienie tylko BarBend, ruch tylko NFPT (a podpis tej strony NFPT to „Guest” — szczebel wątpliwy, niżej), `bp.mis.arch` tylko NFPT. Fitness Volt opisuje wersję na Smicie i z hantlami, nie wolną sztangę |
| Smith Machine Bench Press | otwarte | nowe źródło szczebla 4: BarBend (E. Bugera, CSCS) — ustawienie, ruch, błąd „punkt styku”; drugiego źródła szczebla 4 brak (Major Fitness, RitFit = 5) |
| Smith Machine Incline Press | otwarte | BarBend (wariant skośny w artykule o Smicie) — jedno źródło |
| Smith Machine Decline Press | otwarte | Fitness Volt (V. Saini, ACE-CPT, 03.02.2024) — jedno źródło (ruch: gryf do klatki; błąd: odbijanie od klatki) |
| Wide-Grip Barbell Bench Press | otwarte | bez zmian względem W1 (jedno źródło szczebla 4: Fitness Volt 2021); w wyszukiwaniu tylko strony aplikacji i strony 403 |
| Reverse Grip Bench Press | otwarte | bez nowych źródeł (nie szukałem ponownie — limit kontekstu) |
| Squeeze Press (hantle) | otwarte | w wyszukiwaniu brak drugiego źródła szczebla 4 (wyniki: aplikacje, bazy ćwiczeń, blog Mikolo = 5); Fitness Volt ma tylko wersję skośną w dół (inny kąt ławki) |
| One-Arm Kettlebell Floor Press | otwarte | Fitness Volt (sekcja „Single-arm floor presses”: pojedynczy hantel albo kettlebell) + BarBend (kettle, wersja oburącz) — opis jednorącz bez kroków; jedno źródło dla wersji jednorącz |

Sygnały W1: `press.noLock`/`ohp.mis.lock` przy Smicie — BarBend (Smith) kończy ruch „before you untuck your shoulders”, bez słowa o łokciach;
Fitness Volt (Smith decline) — „drive … to return to the start”; nie da się ustalić ani „prostuj do końca”, ani „nie blokuj” → zestaw ogólny
Smitha zostaje do recenzji, [OTWARTE]. `bp.grip` przy szerokim chwycie — bez zmian (W1: zestaw ogólny mylący dla Wide-Grip).

### Blok do wdrożenia

```json
{
  "Decline Bench Press (hantle)": {
    "setup": [
      {"c": "bench.decline.dbSetup", "s": [
        ["fitnessvolt-decline-bench-press", "sekcja „Decline Dumbbell Bench Press” (lie face up on a decline bench, a dumbbell in each hand, arms extended toward the ceiling)"],
        ["nfpt-decline-db-bench-press", "Starting Position (decline bench, a dumbbell in each hand); Movement (press the dumbbells straight up to the starting position)"]
      ]}
    ],
    "move": [
      {"c": "bench.decline.dbMove", "s": [
        ["nfpt-decline-db-bench-press", "Movement (dumbbells outside your chest; forearms straight up and down; press straight up)"],
        ["barbend-decline-bench-press", "How to Do a Decline Bench Press, kroki 3–4 (elbows positioned under the weights; press back up to the locked out position)"],
        ["fitnessvolt-decline-bench-press", "sekcja „Decline Dumbbell Bench Press” (lower the weights to your sides by bending your elbows, then drive them back up)"]
      ]}
    ],
    "tips": [
      {"c": "bench.bladesTogether", "s": [
        ["nfpt-decline-db-bench-press", "Starting Position (squeeze your shoulder blades together)"],
        ["barbend-decline-bench-press", "How to Do a Decline Bench Press, krok 2 (set your shoulder blades together)"]
      ]}
    ],
    "mistakes": [
      {"c": "bench.decline.mis.elbows", "s": [["wniosek", "bench.decline.dbMove"]]}
    ]
  },
  "Floor Press (sztanga)": {
    "setup": [
      {"c": "bench.floor.setup", "s": [
        ["fitnessvolt-floor-press", "To do the floor press, kroki 1–2 (squat rack, J-hooks about knee height; eyes directly beneath the bar)"],
        ["barbend-floor-press", "How to Do the Floor Press, krok 1 (on the floor underneath the barbell, eyes underneath)"]
      ]}
    ],
    "move": [
      {"c": "bench.floor.move", "s": [
        ["fitnessvolt-floor-press", "To do the floor press, kroki 4–5 (lower until the back of your upper arms lightly touch the floor; push back up to arms' length)"],
        ["barbend-floor-press", "How to Do the Floor Press, kroki 2–4 (once the back of your arms touches the floor… drive until your elbows are fully extended)"]
      ]}
    ],
    "tips": [
      {"c": "bp.blades", "s": [
        ["fitnessvolt-floor-press", "To do the floor press, krok 3 (pull your shoulders back and down and press your upper back into the floor)"],
        ["barbend-floor-press", "How to Do the Floor Press, krok 3 (do not over protract — bring the shoulder blades forward — at the top)"]
      ]}
    ],
    "mistakes": [
      {"c": "bench.floor.mis.protract", "s": [
        ["barbend-floor-press", "How to Do the Floor Press, krok 3 (make sure to not over protract at the top)"],
        ["fitnessvolt-floor-press", "krok 3 — standard (shoulders back and down); błąd = zaprzeczenie standardu"]
      ]},
      {"c": "bench.floor.mis.short", "s": [["wniosek", "bench.floor.move"]]}
    ]
  },
  "Floor Press (hantle)": {
    "setup": [
      {"c": "bench.floor.dbSetup", "uproszczenie": "wariant sprzętu Floor Press (sztanga)", "s": [
        ["barbend-floor-press", "How to Do the Floor Press (the steps are nearly identical if you were to use dumbbells or kettlebells)"],
        ["fitnessvolt-floor-press", "To do the floor press, krok 4 (hold the weight with your arms straight) — wersja ze sztangą"]
      ]}
    ],
    "move": [
      {"c": "bench.floor.dbMove", "s": [
        ["barbend-floor-press", "How to Do the Floor Press (steps nearly identical with dumbbells); kroki 2–4"],
        ["fitnessvolt-floor-press", "sekcja „Dumbbell floor press” (lower both weights at the same speed so that your elbows touch the floor at the same time)"]
      ]}
    ],
    "mistakes": [
      {"c": "bench.floor.mis.short", "s": [["wniosek", "bench.floor.dbMove"]]}
    ]
  }
}
```

Uzasadnienie uproszczenia (Floor Press, hantle — ustawienie): pozycja leżąca na podłodze i start z wyprostowanymi rękami nad klatką są takie
same jak ze sztangą; hantle zmieniają tylko to, że każda ręka niesie osobny ciężar (BarBend wprost: kroki „prawie identyczne”). Bez stojaka —
dlatego osobne zdanie bez „sztanga w stojaku”.

Uwagi do recenzenta:
- `bench.decline.dbMove` — tekst W1 zmieniony: usunięte „powoli” (tylko NFPT podaje tempo opuszczania; BarBend i Fitness Volt — nie).
- `bench.floor.setup` — tekst W1 zmieniony: zamiast „chwyć ją jak do wyciskania na ławce” (tylko The Performance Menu, szczebel wątpliwy) — „oczy pod gryfem”
  (BarBend + Fitness Volt). Szerokość chwytu (`bp.grip`) — tylko Fitness Volt („slightly wider than shoulder-width”) → otwarte.
- `bp.blades` przy Floor Press (sztanga): Fitness Volt mówi „barki w tył i w dół” (shoulders back and down), BarBend — „nie wysuwaj łopatek do przodu na górze”;
  razem pokrywają „do siebie i w dół … przez cały ruch”. Jeśli recenzent uzna „barki” ≠ „łopatki”, wskazówkę skreślić — karta zostaje z błędami.
- `bench.floor.mis.protract`: BarBend podaje błąd wprost, Fitness Volt standard (ta sama część ciała, to samo kryterium — położenie łopatek) → reguła
  „błąd = zaprzeczenie standardu” (szczeble, uzupełnienie 2).
- `bench.decline.mis.elbows` i `bench.floor.mis.short` — wnioskowane; oba da się pokazać na rysunku (przechylone przedramiona; łokcie nad podłogą w dolnym punkcie).
- Rysunek: rodzina bench_press nie ma pliku `lib/figures/v2/poses/bench_press.json` (jest rig `lib/figures/v2/rigs/benchPress.ts`) — nie sprawdzałem,
  czy rig pokazuje wersję na podłodze i na ławce skośnej w dół; do sprawdzenia przy wdrożeniu.

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| bench.decline.dbSetup | Połóż się na ławce skośnej w dół z hantlami w wyprostowanych rękach nad klatką. | Lie on the decline bench with the dumbbells held straight up over your chest. |
| bench.decline.dbMove (tekst W1 poprawiony) | Opuść hantle po bokach klatki, łokcie pod hantlami, potem wypchnij je w górę do wyprostu rąk. | Lower the dumbbells beside your chest, elbows under the weights, then press them up until your arms are straight. |
| bench.decline.mis.elbows | Łokcie uciekają spod hantli i przedramiona się przechylają. | Elbows drifting out from under the dumbbells, forearms tilting. |
| bench.bladesTogether (z W1, nie ma w pl.json) | Ściągnij łopatki i trzymaj je tak przez cały ruch. | Squeeze your shoulder blades together and keep them there the whole set. |
| bench.floor.setup (tekst W1 poprawiony) | Połóż się na podłodze pod sztangą w stojaku, oczy tuż pod gryfem. | Lie on the floor under the racked bar, eyes right below it. |
| bench.floor.move (z W1) | Opuść sztangę, aż łokcie dotkną podłogi, potem wypchnij ją do wyprostu rąk. | Lower the bar until your elbows touch the floor, then press it up until your arms are straight. |
| bench.floor.dbSetup | Połóż się na podłodze z hantlami w wyprostowanych rękach nad klatką. | Lie on the floor with the dumbbells held straight up over your chest. |
| bench.floor.dbMove (tekst W1 poprawiony) | Opuść hantle, aż łokcie dotkną podłogi, potem wypchnij je do wyprostu rąk. | Lower the dumbbells until your elbows touch the floor, then press them up until your arms are straight. |
| bench.floor.mis.protract | Na górze wypychasz barki do przodu i łopatki się rozjeżdżają. | Pushing your shoulders forward at the top so your shoulder blades spread apart. |
| bench.floor.mis.short | Za krótki ruch — wracasz w górę, zanim łokcie dotkną podłogi. | Cutting the rep short — pressing back up before your elbows touch the floor. |

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| fitnessvolt-floor-press (nowe) | https://fitnessvolt.com/floor-press/ | Fitness Volt | 4 — podpis „Tom Miller, CSCS”, opublikowano 02.11.2019, zmiana 24.11.2020 (dane strukturalne); bez recenzenta (reguła uzupełnienia 3: autor z kwalifikacjami i data) | „To do the floor press” kroki 1–5; „Dumbbell floor press”; „Single-arm floor presses” |
| fitnessvolt-decline-bench-press (nowe) | https://fitnessvolt.com/decline-bench-press/ | Fitness Volt | 4 — autorzy Vidur Saini (ACE-certified personal trainer) i Steve Theunissen (PT, certyfikaty ISSA), 03.02.2024; bez recenzenta | sekcje „Smith Machine Decline Bench Press”, „Decline Dumbbell Bench Press” (opis i Pro Tips) |
| barbend-smith-machine-bench-press (nowe) | https://barbend.com/smith-machine-bench-press/ | BarBend | 4 — artykuł o technice, autor Eric Bugera (CSCS, CISSN), aktualizacja 17.06.2024; bez znacznika „Expert Verified” | kroki 1–5 z „Coach's Tip”; błędy „Too Much ROM”, „Too Little ROM”, „Adjusting to the Bar”; wariant skośny (tylko do Otwartych) |
| barbend-floor-press (W1, odczytane ponownie) | https://barbend.com/floor-press/ | BarBend | 4 — autor Mike Dewar (CSCS, MS fizjologia wysiłku), aktualizacja 17.06.2024 | „How to Do the Floor Press” kroki 1–4 i zdanie o hantlach/kettlach; uwaga: W1 cytowała „kroki 5 i 7”, dziś strona ma 4 kroki |
| barbend-decline-bench-press (W1, odczytane ponownie) | https://barbend.com/decline-bench-press/ | BarBend | 4 — autor Mike Dewar (CSCS), aktualizacja 13.03.2025 | „How to Do a Decline Bench Press” kroki 1–4 (wersja z hantlami; „can also be done with a barbell”) |
| nfpt-decline-db-bench-press (W1, odczytane ponownie) | https://nfpt.com/how-to-do-a-decline-bench-press-with-dumbbells/ | NFPT | 4 — „Guest Authored by Robert Bovee” (Certified Master PPT, RTS, ETS, FTS), 11.08.2025 | Starting Position; Movement; Warning Tips |
| nfpt-decline-bench-straight-bar (W1, odczytane ponownie; nieużyte) | https://nfpt.com/decline-bench-straight-bar/ | NFPT | wątpliwy (4 albo 5): podpis „Guest”, biogram Bovee pod tekstem, ale strona nie mówi wprost, że to jego tekst — reguła NFPT wymaga autora z kwalifikacjami | do Otwartych (Decline Bench Press) |
| performancemenu-floor-press (W1; nieużyte w bloku) | https://www.performancemenu.com/article/199/The-Floor-Press/ | The Performance Menu (Catalyst Athletics) | wątpliwy: autor S. Shafley — w biogramie zawodnik trójboju/strongman, BS biologii, bez kwalifikacji trenerskich; 01.2007. Wg reguły „szczebel daje konkretna strona” raczej 5 → do decyzji koordynatora | — |
| lifefitness-au-decline-bench-press (przeczytane, nieużyte) | https://www.lifefitness.com.au/news-stories/decline-bench-press-stronger-lower-chest-guide | Life Fitness (producent ławek) | 5 — brak autora, „Shop now…”, karta zapytań sprzedażowych (jak Major Fitness / Bells of Steel) | — |
| inspireus-floor-press (przeczytane, nieużyte) | https://www.inspireusafoundation.org/?p=14809 | Inspire US | 5 do rozstrzygnięcia — autorka bez kwalifikacji, recenzent „Daniel Dominick, TE, PTRP”, aktualizacja 11.01.2024; serwisu brak w pliku szczebli | — |

Nieprzeczytane: barbellmedicine.com (strona weryfikacji „Please wait…”), The Prehab Guys (przekierowanie do logowania),
fitnessvolt.com/dumbbell-squeeze-press/ i healthline.com/health/decline-bench-press (404).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Decline Bench Press — całe ćwiczenie | ustawienie `bench.decline.setup` tylko BarBend; ruch `bench.decline.move` tylko NFPT (strona „Guest”, szczebel wątpliwy); `bp.mis.arch` tylko NFPT. Następny krok: drugie źródło szczebla 4 dla wolnej sztangi na ławce skośnej w dół (ISSA, Healthline z recenzentem, szpital/HSS) |
| Decline Bench Press (hantle) — `bench.decline.setup` (nogi pod wałkami) | tylko BarBend krok 1; NFPT i Fitness Volt nie mówią o nogach |
| Decline Bench Press (hantle) — `bp.mis.arch`, `bp.control` | tylko NFPT (Warning Tips) |
| Floor Press (sztanga) — `bp.grip` | tylko Fitness Volt (krok 3); Inspire US (5) i Performance Menu (wątpliwy) się nie liczą |
| Floor Press (sztanga) — „bez odbijania łokci od podłogi” | standard tylko Fitness Volt („Without bouncing”, krok 5); Inspire US (5) |
| Floor Press — nogi | źródła różne: Fitness Volt — ugięte albo proste, BarBend — bez wskazania, Performance Menu — proste; nie wpisuję |
| Smith Machine Bench Press — całe ćwiczenie | tylko BarBend (szczebla 4); `bench.smith.mis.position` ≈ BarBend „Adjusting to the Bar” — jedno źródło |
| Smith Machine Incline Press — całe ćwiczenie | tylko BarBend (wariant skośny: ławka na 1.–2. pozycji, gryf do klatki) |
| Smith Machine Decline Press — całe ćwiczenie | tylko Fitness Volt (ławka na najniższej pozycji, gryf do klatki, Pro Tip: bez odbijania od klatki) |
| Smith (3 ćwiczenia) — `press.noLock` / `ohp.mis.lock` | żadne przeczytane źródło szczebla 4 nie rozstrzyga wyprostu łokci na Smicie |
| Wide-Grip Barbell Bench Press, Reverse Grip Bench Press | bez zmian względem W1 (`bench_press-cz1b.md`, „Otwarte”) |
| Squeeze Press (hantle) | tylko BarBend (hex press); brak drugiego źródła szczebla 4 |
| One-Arm Kettlebell Floor Press | Fitness Volt opisuje wersję jednorącz bez kroków („obliques and legs to stop you from rolling toward the load” — kandydat na wskazówkę, jedno źródło); BarBend — kettle tylko oburącz |
| Szczeble: performancemenu-floor-press, nfpt-decline-bench-straight-bar, Inspire US | do decyzji koordynatora (wyżej); wynik tego pliku od nich nie zależy |

## Podsumowanie

- Ćwiczeń: 11. Nowe karty z błędami: 3 (Decline Bench Press (hantle), Floor Press (sztanga), Floor Press (hantle) — ta z uproszczeniem w ustawieniu); bez błędów: 0; otwarte: 8.
- Błędy wnioskowane: 3 wpisy (2 zdania: `bench.decline.mis.elbows`, `bench.floor.mis.short` ×2); ze źródeł: 1 (`bench.floor.mis.protract`, błąd = zaprzeczenie standardu).
- Role mięśni: brak luk z W1 — 0 gotowych, 0 otwartych.
- Nowe zdania: 10 wierszy w tabeli (6 nowych, 4 z W1 — 3 z poprawionym tekstem; żadnego nie ma jeszcze w `lib/cues/text/pl.json`).
- Nowe źródła: 3 (fitnessvolt-floor-press, fitnessvolt-decline-bench-press, barbend-smith-machine-bench-press).

## Zostało (następny krok, pułapki)

- Decline Bench Press (sztanga): szukać drugiego źródła dla wolnej sztangi (ISSA, Healthline z recenzentem, ACE). Smith ×3: drugie źródło szczebla 4
  (instrukcja producenta maszyny Smitha — tylko dla jego maszyny; Fitness Volt/Healthline z autorem). Wide-Grip, Reverse Grip, Squeeze, KB jednorącz — jak w W1.
- Pułapki: barbellmedicine.com — strona weryfikacji; The Prehab Guys — logowanie; Healthline i Fitness Volt — adresy zgadywane często 404, szukać przez wyszukiwarkę;
  strona Fitness Volt „decline-bench-press” to w praktyce zestaw wariantów (Smith, hantle, maszyna) — wolnej sztangi nie opisuje.
