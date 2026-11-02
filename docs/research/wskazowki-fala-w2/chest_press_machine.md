# chest_press_machine — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`
(uzupełnienia 1–3) i przeliczenia G5 (rozstrzygnięcia koordynatora 1.1). Strony przeczytane 02.11.2026 przez WebFetch.
Punkt wyjścia: W1 (`chest_press_machine.md` na gałęzi `badania/g5-pchanie`) — 3 ćwiczenia otwarte, 0 źródeł szczebla 4.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Leverage Incline Chest Press | otwarte | Hoist RPL-5303 (strona produktu producenta) opisuje tylko start „with the handles positioned at chest level”, bez kroków. Uproszczenie z Machine Chest Press niedozwolone (inny kąt wyciskania). Kandydaci W1 `mcpi.*` bez zmian. |
| Leverage Decline Chest Press | otwarte | Brak przeczytanego źródła (jak W1). |
| Smith Machine Shoulder Press | otwarte | Brak 2 źródeł. Wariant sprzętu wyciskania sztangi nad głowę siedząc — możliwy kierunek, ale karta „Overhead Press (sztanga)” opisuje wersję stojąc (`ohp.bbSetup` ze stojaka; inna pozycja ciała), a źródło siedzące (ACE #43) to jedno źródło; ExRx — 403. Sygnał `press.noLock`/`ohp.mis.lock` nierozstrzygnięty (brak przeczytanego tekstu o łokciach na górze dla Smitha). |
| Machine Chest Press (poza listą briefu; ma rysunek w `poses/chest_press_machine.json` i kartę bez błędów w `data/zrodla/cues.json`) | **dopisać do istniejącej karty** — tylko `mistakes` | Karta ma ustawienie, ruch i wskazówki (ACE #188, NASM, ExRx), `mistakes: []`. Oba źródła przeczytane ponownie — 2 błędy. Do decyzji koordynatora, czy przyjąć (poza zakresem briefu, ale ta sama rodzina i bez nowego źródła). |

## Blok do wdrożenia

### Blok do wdrożenia

Tylko klucz `mistakes` — dopisać do istniejącej karty „Machine Chest Press” (nie z W1).

```json
{
 "Machine Chest Press": {
  "mistakes": [
   {"c": "press.mis.lock", "s": [
    ["nasm-chest-press-machine", "Common Mistakes (locking out elbows at the top)"],
    ["ace-188", "Step 3 (fully extended, but not locked) — błąd = zaprzeczenie standardu"]
   ]},
   {"c": "mis.jerk", "s": [
    ["nasm-chest-press-machine", "Common Mistakes (jerky or uncontrolled movements)"],
    ["ace-188", "Step 3 (elbows flex in a slow, controlled manner) — błąd = zaprzeczenie standardu"]
   ]}
  ]
 }
}
```

Uwaga: karta ma we wskazówkach `press.noLock` („Prostuj ręce do końca, ale bez gwałtownego blokowania łokci.”), a NASM w Step 4 każe przy powrocie zatrzymać się „just short of full arm flexion” (dotyczy powrotu, nie wyprostu) — bez sprzeczności z `press.mis.lock`. `press.mis.lock` — to samo nowe id co w `cable_press.md`; dodać raz.

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. |

(To samo zdanie co w `cable_press.md` — jeden wpis w słownikach.) Istniejące użyte: `mis.jerk`.

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| nasm-chest-press-machine | https://www.nasm.org/resource-center/exercise-library/chest-press-machine | NASM | 4 — organizacja szkoląca; biblioteka firmowana przez NASM (id istniejące; odczyt ponowny 02.11.2026) | „Common Mistakes”; Step 1–4 |
| ace-188 | https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/ | ACE | 4 — organizacja szkoląca; biblioteka firmowana przez ACE (id istniejące; odczyt ponowny 02.11.2026) | Step 3 |
| hoist-rpl-5303 | https://www.hoistfitness.com/products/rpl-5303-incline-chest-press | HOIST (producent) | 4 tylko dla tej maszyny; strona nie ma kroków wykonania | opis produktu i lista cech |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Leverage Incline Chest Press — karta | 0 źródeł szczebla 4 z opisem wykonania (Hoist RPL-5303 — tylko wysokość uchwytów na starcie: „at chest level”; kopia Life Fitness z W1 — nie źródło). Potrzebna instrukcja producenta maszyny skośnej z krokami albo biblioteka organizacji szkolącej. |
| Leverage Decline Chest Press — karta | brak przeczytanych źródeł |
| Smith Machine Shoulder Press — karta | brak 2 źródeł; patrz tabela |
| Machine Shoulder Press — `ohp.mis.lock` | ACE #186 podaje standard („łokcie prawie proste, nie zablokowane” wg `data/zrodla/cues.json`), drugie źródło (Eleiko, „Resources”) ma po uzupełnieniu 3 szczebel 5 → błąd niepotwierdzony; nie czytałem ACE #186 w tej fali |
| Role mięśni tej rodziny | W1 nie zgłosił luk ról dla tych ćwiczeń (brak pliku `role-miesni-fala-w1/chest_press_machine.md`); w tej fali nie sprawdzałem tego w `lib/muscleRoles.ts` — pliku ról nie tworzę |

## Podsumowanie

Ćwiczeń zbadanych: 3 z briefu (+1 poza listą: Machine Chest Press, tylko błędy). Nowe karty z błędami: 0; dopisane błędy do istniejącej karty: 2 (Machine Chest Press, oba „błąd = zaprzeczenie standardu”). Błędy wnioskowane: 0. Role gotowe: nie dotyczy. Otwarte: 3 ćwiczenia z briefu. Nowe zdania: 1 (`press.mis.lock`, wspólne z cable_press).
