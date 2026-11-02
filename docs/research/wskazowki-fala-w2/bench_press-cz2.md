# bench_press (część 2) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zakres: 11 ćwiczeń otwartych z fali W1 (`bench_press-cz2.md` W1, gałąź `badania/g5-pchanie`). Rodzina jest `ready` — karta własna
ma sens tylko z co najmniej jednym błędem. Reguły: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026), szczeble wg
`docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 1–3) i rozstrzygnięć koordynatora 1.1 z 02.11.2026
(`przeliczenie-szczebli-2026-11-02.md`, sekcja końcowa). Strony odczytane narzędziem WebFetch 02.11.2026; „miejsce” = nagłówek
albo krok w odczytanej treści. Strony innych aplikacji treningowych pominięte. Role mięśni: W1 nie ma pliku luk dla bench_press
(`role-miesni-fala-w1/` zawiera tylko chest_fly, dip, overhead_press, pushup_plank) — pliku ról w W2 nie tworzę.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Pin Press | **gotowe** (ustawienie + ruch + 1 błąd) | nowe źródło Westside (pin press) + elitefts z W1 = 2 organizacje szczebla 4; `bp.mis.arch` nadal nie (Westside każe zachować wygięcie jak w zwykłym wyciskaniu) |
| Smith Machine Close-Grip Bench Press | **gotowe — uproszczenie** (wariant sprzętu Close Grip Bench Press) | źródła karty Close Grip Bench Press (ACE 311, NASM, ExRx); błąd wnioskowany `cgbp.mis.flare`; `press.noLock` — otwarte |
| Close-Grip EZ-Bar Press | **gotowe — uproszczenie** (wariant sprzętu Close Grip Bench Press) | jw.; do recenzji: W1 widziała w wynikach wyszukiwarki (nieprzeczytane) tezę, że łokcie „przy samych bokach” to błąd — patrz „Otwarte” |
| Close-Grip Dumbbell Press | otwarte (warunkowo gotowe) | nowe źródło BarBend „hex press” (szczebel 4) + Fitness Volt z W1 (data tylko w metadanych). Gotowe, jeśli koordynator uzna Fitness Volt za 4 — blok warunkowy w „Otwarte” |
| Board Press | otwarte | ruch i błąd mają po 2 źródła szczebla 4 (elitefts — warunkowo, Westside), ale ustawienie tylko 1 (elitefts); tempo opuszczania sprzeczne |
| Reverse Band Bench Press | otwarte | drugie źródło nie znalezione (elitefts 404, Cressey = 5) |
| Band Bench Press | otwarte | interpretacja: patrz „Interpretacja” niżej; brak źródeł szczebla ≤ 4 dla wariantu z uchwytami |
| Chain Press | otwarte | jw. |
| Floor Press with Chains | otwarte | nie badane w W2 (limit kontekstu); kandydat: BarBend „floor press” — patrz „Zostało” |
| Barbell Guillotine Bench Press | otwarte | bez zmian względem W1 (źródła się różnią, ostrzeżenia zdrowotne w źródłach) — nie badane ponownie |
| Decline Close-Grip Bench To Skull Crusher | otwarte | bez zmian względem W1 — nie badane ponownie |

Kart częściowych z W1 (ustawienie + ruch bez błędu) w tej części nie ma — klucze `mistakes` „dopisać do karty W1” nie występują.

Uproszczenie „wariant sprzętu Close Grip Bench Press” (Smith, gryf łamany): chwyt na szerokość barków lub węziej, łokcie przy
tułowiu i tor sztangi do dolnej części klatki są takie same; suwnica Smitha tylko prowadzi gryf w pionie, a gryf łamany zmienia
ułożenie dłoni na uchwycie, nie tor ruchu ramion. Uproszczenie nie dotyczy zablokowania łokci na górze (patrz „Otwarte”).

### Blok do wdrożenia

```json
{
 "Pin Press": {
  "setup": [
   {"c": "pin.setup", "s": [["elitefts-dynamic-pin-press", "punkty kluczowe (pins slightly above your touch point or just below your sticking point)"], ["westside-pin-press-bench", "How to Perform the Pin Press Bench (starting position with arms around 90 degrees)"]]}
  ],
  "move": [
   {"c": "pin.move", "s": [["elitefts-dynamic-pin-press", "true Pin Press (dead stop, explode off the pins)"], ["westside-pin-press-bench", "How to Perform the Pin Press Bench (break the barbell from the pins; lower the barbell back to the pins)"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "pin.mis.bounce", "s": [["westside-pin-press-bench", "Common Mistakes (failing to control the eccentric — the bar bounces in the rack)"], ["elitefts-dynamic-pin-press", "true Pin Press (dead stop) — błąd = zaprzeczenie standardu"]]}
  ]
 },
 "Smith Machine Close-Grip Bench Press": {
  "setup": [
   {"c": "cgbp.grip", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (hands directly in line with the shoulders)"], ["nasm-close-grip-bench-press", "Step 1; FAQ (grip width)"], ["exrx-Triceps/BBCloseGripBenchPress", "Preparation; Comments"]]}
  ],
  "move": [
   {"c": "cgbp.move", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis"], ["exrx-Triceps/BBCloseGripBenchPress", "Execution"], ["nasm-close-grip-bench-press", "Step 3; Step 4"]]}
  ],
  "tips": [
   {"c": "cgbp.elbows", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (elbows close to the ribs)"], ["exrx-Triceps/BBCloseGripBenchPress", "Execution (elbows close to body)"]]},
   {"c": "bp.contact", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (push the feet into the floor, press the hips into the bench)"], ["nasm-close-grip-bench-press", "Step 1 (back firmly against the bench, feet flat)"], ["nsca-basics-2012", "Bench press, setup: five-point body contact position"]]}
  ],
  "mistakes": [
   {"c": "cgbp.mis.flare", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["wniosek", "cgbp.move"]]}
  ]
 },
 "Close-Grip EZ-Bar Press": {
  "setup": [
   {"c": "cgbp.grip", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (hands directly in line with the shoulders)"], ["nasm-close-grip-bench-press", "Step 1; FAQ (grip width)"], ["exrx-Triceps/BBCloseGripBenchPress", "Preparation; Comments"]]}
  ],
  "move": [
   {"c": "cgbp.move", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis"], ["exrx-Triceps/BBCloseGripBenchPress", "Execution"], ["nasm-close-grip-bench-press", "Step 3; Step 4"]]}
  ],
  "tips": [
   {"c": "cgbp.elbows", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (elbows close to the ribs)"], ["exrx-Triceps/BBCloseGripBenchPress", "Execution (elbows close to body)"]]},
   {"c": "bp.contact", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["ace-311", "opis (push the feet into the floor, press the hips into the bench)"], ["nasm-close-grip-bench-press", "Step 1 (back firmly against the bench, feet flat)"], ["nsca-basics-2012", "Bench press, setup: five-point body contact position"]]}
  ],
  "mistakes": [
   {"c": "cgbp.mis.flare", "uproszczenie": "wariant sprzętu Close Grip Bench Press", "s": [["wniosek", "cgbp.move"]]}
  ]
 }
}
```

Uwagi do bloku:
- Źródła `ace-311`, `nasm-close-grip-bench-press`, `exrx-Triceps/BBCloseGripBenchPress`, `nsca-basics-2012` i miejsca przepisane z wpisu
  „Close Grip Bench Press” w `data/zrodla/cues.json:7378–7449` (nie czytane ponownie w W2 — ExRx dziś zwraca 403).
- `pin.setup` ma nowe brzmienie (węższe niż kandydat W1 — bez „tuż nad klatką”, bo Westside w „Common Mistakes” uznaje zbyt niskie
  ustawienie gryfu za błąd). `pin.move`, `pin.mis.bounce` — brzmienie kandydatów z W1 bez zmian.
- Przy przejściu Pin Press, Smith i EZ na `own` znikają z kart zdania zestawu ogólnego (`cue-sets.json:434, 578, 148`):
  `bp.contact`, `bp.blades`, `bp.mis.arch` (Pin), `bp.control`, `bp.mis.arch` (Smith, EZ) — nie potwierdzone dla tych wariantów.
- Kąt „około 90 stopni” z Westside nie trafia do zdania (liczba — nie w tej fali).

## Nowe zdania (id | PL | EN)

| id | PL | EN (propozycja) | użycie |
|---|---|---|---|
| pin.setup | Ławka w klatce; podpórki ustaw nad klatką, na wysokości, z której chcesz zaczynać wyciskanie. | Bench inside the rack; set the pins above your chest, at the height you want to press from. | Pin Press |
| pin.move | Sztanga zatrzymuje się całkiem na podpórkach; z martwego punktu wypchnij ją do wyprostu rąk. | The bar comes to a full stop on the pins; press it from the dead stop to lockout. | Pin Press (brzmienie z W1) |
| pin.mis.bounce | Odbijanie sztangi od podpórek zamiast pełnego zatrzymania. | Bouncing the bar off the pins instead of a full stop. | Pin Press (brzmienie z W1) |
| cgbp.mis.flare | Łokcie uciekają szeroko na boki — wtedy to już zwykłe wyciskanie. | Elbows flaring wide — then it's just a regular bench press. | Smith, EZ (wniosek z `cgbp.move`) |
| cgdb.setup, cgdb.move, cgdb.mis.squeeze | brzmienie z W1 (`bench_press-cz2.md` W1, „Nowe zdania”) | jw. | kandydaci — Close-Grip Dumbbell Press (warunkowo) |

Istniejące zdania użyte bez zmian: `cgbp.grip`, `cgbp.move`, `cgbp.elbows`, `bp.contact`.
`cgbp.mis.flare` nadaje się też do karty „Close Grip Bench Press” (dziś bez błędów, `cues.json:7449`) — poza zakresem tej fali, do decyzji koordynatora.

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| westside-pin-press-bench | https://www.westside-barbell.com/a/blog/pin-press-bench | Westside Barbell; podpis „WSBB Education”, 25.07.2023 | 4 — organizacja z certyfikacją trenerów (jak `westside-chains-bands` w W1, ta sama organizacja); w treści artykułu brak linków sprzedażowych (linki do książek tylko w „Sources”) | „How to Perform the Pin Press Bench”; „Common Mistakes” |
| elitefts-dynamic-pin-press | (W1) https://elitefts.com/blogs/coaching-logs/bench-press-builder-the-dynamic-pin-press-with-video | elitefts (C.J. Murphy), 12.05.2022 | 4 (W1) | punkty kluczowe; „true Pin Press” |
| westside-board-idea | https://westside-barbell.com/blogs/the-blog/the-board-idea | Westside Barbell, 29.10.2019 | 4 — jw.; brak linków sprzedażowych w treści | akapit o „slam the bar into the board” |
| elitefts-board-press-watts | https://elitefts.com/blogs/training/elitefts-board-press-for-sports-performance | elitefts; Mark Watts (Elitefts Director of Education), 14.07.2014 | 4 warunkowo — w treści linki do własnych desek i ławek elitefts (instrukcja własnego rodzaju sprzętu, uzup. 3); jeśli koordynator uzna to za materiał sprzedażowy — 5 | „Board Press Checklist”, kroki 1–4 |
| barbend-hex-press | https://barbend.com/hex-press/ | BarBend; Jake Dickson, NASM-CPT, USAW-L2; „Last updated on June 20th, 2024” | 4 — autor z kwalifikacjami i data widoczna | Step 1–3; „Common Mistakes”: Not Maintaining Contact, Elbows Flaring |
| fitnessvolt-cg-db-press | (W1) https://fitnessvolt.com/close-grip-dumbbell-press/ | Fitness Volt; Patrick Dale, PT; data tylko w metadanych | 4 warunkowo (W1) — brief W2 wymaga daty widocznej na stronie, więc do rozstrzygnięcia | Grip; Setup on the Bench; Pressing Up; Lowering; Common Mistakes |
| cressey-reverse-band | https://ericcressey.com/?p=16947 | EricCressey.com, gościnny wpis G. Robinsa | 5 — brak daty, brak kwalifikacji autora na stronie | — (nie użyte) |
| ace-311, nasm-close-grip-bench-press, exrx-Triceps/BBCloseGripBenchPress, nsca-basics-2012 | już w `data/zrodla/cues.json` | ACE, NASM, ExRx, NSCA | wg rejestru (4; NSCA — wg rejestru) | jak w `cues.json:7378–7449` |

Nieczytane (404): elitefts „1 board press”, „2 board press”, elitefts „reverse band bench press” (blog), BarBend „pin press guide”, Westside „board-press”.

## Interpretacja Band Bench Press i Chain Press (do koordynatora)

Rysunek już przyjął interpretację: wyciskanie na dwóch uchwytach (bez sztangi) — guma przełożona pod ławką
(`lib/figures/v2/variants.ts:108`, `rigs/benchPress.ts:44`), łańcuch przypięty do każdego uchwytu, tor jak w wyciskaniu hantli,
łokieć do 90° (`variants.ts:39–41, 109`; cytat z opisu katalogu ćwiczeń, czyli źródła szczebla 5). Źródła szczebla 4 z W1
(`nasm-bench-press-chains`, `westside-chains-bands`) opisują sztangę z łańcuchami/gumami, czyli inne ćwiczenie — nie wolno ich
przenieść na wariant z uchwytami (inny chwyt i tor). Dwie drogi: (a) zostać przy uchwytach — potrzebny research wyciskania na
uchwytach z gumą (np. ACE ma ćwiczenia z gumą) i z łańcuchami; (b) zmienić rysunek na sztangę z gumami/łańcuchami — wtedy Chain Press
może dostać blok „Bench Press with Chains” z W1. Rekomendacja: (a) dla Band Bench Press (wyciskanie z gumą na uchwytach to częsty
wariant domowy), Chain Press — do decyzji koordynatora, bo wariant z uchwytami ma tylko opis katalogu.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Close-Grip Dumbbell Press — całe ćwiczenie | BarBend „hex press” (4) opisuje ten sam ruch (hantle chwytem neutralnym, ściśnięte razem przez całą serię; strona: „if you lose contact… essentially a neutral-grip dumbbell press”), ale nie używa nazwy „close-grip dumbbell press”. Drugie źródło: Fitness Volt (data tylko w metadanych). Jeśli koordynator uzna Fitness Volt za 4 — karta gotowa: `cgdb.setup` [barbend-hex-press „Step 2: Hold the Weights Together”; fitnessvolt „Grip; Setup on the Bench”], `cgdb.move` [barbend „Step 3: Lower and Press”; fitnessvolt „Pressing Up; Lowering”], tip `cgbp.elbows` [barbend „Step 3, coach's tip (arms tucked tightly to your sides)”; fitnessvolt „Elbows”], błąd `cgdb.mis.squeeze` [barbend „Common Mistakes: Not Maintaining Contact”; fitnessvolt „Common Mistakes: Easing off the squeeze”]. |
| Board Press — ustawienie | `board.setup` (deski na klatce, partner albo mocowanie) ma tylko źródła szczebla 5 (W1); elitefts mówi tylko „Set up should be the same as Bench Press”. |
| Board Press — ruch i błąd | Tempo opuszczania sprzeczne: elitefts (krok 2) „bring the bar down fast to the board”, ale bez upuszczania; kandydaci W1 („powoli”) mają tylko szczebel 5. Część wspólna szczebla 4: sztanga schodzi na deskę pod kontrolą, bez uderzania w nią (Westside: błąd „slam the bar into the board”), i jest wypychana z deski do wyprostu (elitefts kroki 3–4). Kandydaci po nowemu: `board.move2` „Sprowadź sztangę na deskę pod kontrolą i wypchnij ją z deski do wyprostu rąk.” / „Bring the bar down to the board under control, then press it off the board to lockout.”; `board.mis.slam` „Uderzanie sztangą o deskę zamiast spokojnego dotknięcia.” / „Slamming the bar into the board instead of touching it under control.” [westside-board-idea; elitefts-board-press-watts — kroki 2–3, zaprzeczenie standardu]. Karta wymaga jeszcze ustawienia. |
| Reverse Band Bench Press | Nadal 1 źródło szczebla 4 (Westside). Cressey (5): gumy „lax at the top, tight at the bottom” — zgodne z `rband.setup`, ale się nie liczy. Kandydat: powerliftingtechnique.com (nieczytane — sprawdzić autora i datę). |
| Smith, EZ — `press.noLock` / `ohp.mis.lock` | Brak przeczytanego źródła o blokowaniu łokci w tych wariantach; uproszczenie nie obejmuje tego zdania. |
| Close-Grip EZ-Bar Press — `cgbp.elbows` | W1: w wynikach wyszukiwarki (nieprzeczytane) teza, że łokcie „przy samych bokach” to błąd. Przeczytane źródła bazowe (ACE 311, ExRx) mówią „close to the ribs/body” — recenzent sprawdza, czy to nie przeczy; jeśli znajdzie przeczytane źródło przeczące — zdanie i błąd `cgbp.mis.flare` wypadają z karty EZ. |
| Pin Press — łokcie, wygięcie | Westside: „bringing the elbows in towards the body” i zachowanie wygięcia jak w zwykłym wyciskaniu — jedno źródło; `bp.mis.arch` sprzeczne z Westside — nie dodawać. |
| Floor Press with Chains | Nie badane w W2 (patrz „Zostało”). |
| Barbell Guillotine Bench Press, Decline Close-Grip Bench To Skull Crusher | Bez zmian względem W1. |

## Podsumowanie

- Ćwiczeń w zakresie: 11; zbadanych w W2: 7 (Pin, Smith CG, EZ CG, CG Dumbbell, Board, Reverse Band, Band/Chain — interpretacja).
- Nowe karty z błędami: 3 (Pin Press; Smith Machine Close-Grip Bench Press i Close-Grip EZ-Bar Press — obie jako uproszczenie); bez błędów: 0.
- Błędy wnioskowane: 1 zdanie (`cgbp.mis.flare`, z `cgbp.move`) w 2 kartach; błędy ze źródeł: 1 (`pin.mis.bounce`).
- Warunkowo gotowe: 1 (Close-Grip Dumbbell Press — zależy od szczebla Fitness Volt).
- Otwarte: 8 (w tym Close-Grip Dumbbell warunkowo). Role mięśni: brak luk z W1 — 0.
- Nowe zdania: 2 do bloku (`pin.setup` w nowym brzmieniu, `cgbp.mis.flare`) + 2 z W1 wchodzące do bloku (`pin.move`, `pin.mis.bounce`); kandydaci poza blokiem: `board.move2`, `board.mis.slam`.

## Zostało (następny krok i pułapki)

1. Floor Press with Chains: przeczytać https://barbend.com/floor-press/ (autor, data) i drugie źródło szczebla 4 o wyciskaniu z podłogi
   (np. NASM/ACE exercise library); łańcuchy jako „wariant sprzętu Floor Press” — tylko jeśli opis ruchu się nie zmienia (łańcuchy
   zmieniają opór, nie tor). Błąd kandydat: odbijanie łokci od podłogi (W1: tylko RNT).
2. Board Press: drugie źródło szczebla 4 do ustawienia (deski na klatce, partner) — elitefts exercise-index zwraca 404.
3. Reverse Band: sprawdzić powerliftingtechnique.com (autor, kwalifikacje, data).
4. Pułapki: strony elitefts pod adresami z wyszukiwarki często 404; ExRx 403; Westside ma dwa układy adresów (`/a/blog/` i `/blogs/the-blog/`).
