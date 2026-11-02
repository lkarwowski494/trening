# cable_press — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`
(uzupełnienia 1–3) i przeliczenia G5 (rozstrzygnięcia koordynatora 1.1). Strony przeczytane 02.11.2026 przez WebFetch.
Punkt wyjścia: W1 (`cable_press.md` na gałęzi `badania/g5-pchanie`) — 3 ćwiczenia otwarte.

## Ćwiczenia

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| Seated Cable Chest Press | **gotowe** (ustawienie + ruch + 2 błędy), z uproszczeniem | ACE #165 (bezpośrednio, szczebel 4) + NASM „Chest Press Machine” (szczebel 4) jako **wariant sprzętu Machine Chest Press**. Uzasadnienie uproszczenia: w katalogu ćwiczenie wymaga ławki i dwóch wyciągów (`lib/catalog.generated.ts`, wpis „Seated Cable Chest Press”), a rysunek pokazuje siad prawie pionowo (`poses/cable_press.json`, `pochylenieTulowia` −5) — pozycja ciała (siad, plecy oparte, stopy na podłodze), tor (poziome wypchnięcie uchwytów sprzed środka klatki) i kryterium końca ruchu są takie same jak na maszynie; różni się tylko źródło oporu (linka zamiast dźwigni). Recenzent to sprawdzi. |
| Single Arm Cable Chest Press | otwarte | Bez zmian względem W1: 1 źródło szczebla 4 (ACE #338). NASM ma tylko wersję z hantlem leżąc (inna pozycja ciała — nie wariant sprzętu). OriGym (cable chest press) — strona weryfikacji, nieprzeczytana. |
| Incline Cable Chest Press | otwarte | Brak przeczytanego źródła szczebla ≤ 4; ławka skośna (`pochylenieTulowia` −35 w rysunku) — inny kąt niż Seated, więc uproszczenie z Seated/Machine Chest Press niedozwolone. |

## Blok do wdrożenia

### Blok do wdrożenia

```json
{
 "Seated Cable Chest Press": {
  "setup": [
   {"c": "cpress.seated", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["ace-165", "Step 1 (back firmly supported against the backrest; hands level with your mid-chest region; feet firmly on the floor)"],
    ["nasm-chest-press-machine", "Step 1: Setup (back firmly against the backrest; handles align with mid-chest height; feet on the floor) — wariant sprzętu"]
   ]}
  ],
  "move": [
   {"c": "cpress.seatedMove", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["ace-165", "Step 2–3 (extending your arms forward at the level of your mid-chest; slowly return … moving the handles back towards your chest)"],
    ["nasm-chest-press-machine", "Step 3: Execute (press the handles forward); Step 4: Return (with control) — wariant sprzętu"]
   ]}
  ],
  "tips": [
   {"c": "mcp.blades", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["ace-165", "Step 1 (depress and retract your scapulae); Step 2 (contact with your back and shoulder blades against the backrest; minimize rounding your shoulder blades)"],
    ["nasm-chest-press-machine", "Step 2: Brace (position your shoulders back and down) — wariant sprzętu"]
   ]},
   {"c": "plank.brace", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["ace-165", "Step 1 (stiffen („brace”) your abdominal muscles)"],
    ["nasm-chest-press-machine", "Step 2: Brace (engage your core) — wariant sprzętu"]
   ]}
  ],
  "mistakes": [
   {"c": "press.mis.lock", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["nasm-chest-press-machine", "Common Mistakes (locking out elbows at the top) — wariant sprzętu"],
    ["ace-165", "Step 3 (fully extended, but not locked) — błąd = zaprzeczenie standardu"]
   ]},
   {"c": "mis.jerk", "uproszczenie": "wariant sprzętu Machine Chest Press", "s": [
    ["nasm-chest-press-machine", "Common Mistakes (jerky or uncontrolled movements) — wariant sprzętu"],
    ["ace-165", "Step 3 (slow, controlled manner); Step 4 (control the speed, range and direction of movement) — błąd = zaprzeczenie standardu"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- Zestaw ogólny `machinePress` (`mcp.move` „do wyprostu rąk”, `press.noLock` „prostuj ręce do końca”) zastąpiony własnymi zdaniami: W1 zgłosił sprzeczność z przeczytanym tekstem (Western, szczebel 5: „soft bend in your elbows”). Wyższy szczebel (ACE, NASM: wyprost bez blokowania) by wygrał, ale `cpress.seatedMove` + `press.mis.lock` mówią to samo bez sporu o „do końca”, więc `press.noLock` nie wchodzi do karty.
- `press.mis.lock` — to samo id co kandydat z W1 (cable_press i chest_press_machine); dodać raz do słowników.
- Wysokość uchwytów „barki albo środek klatki” (ACE) — NASM tylko „mid-chest”; w `cpress.seated` jest „przy klatce” (część wspólna).

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| cpress.seated | Usiądź plecami przy oparciu, stopy na podłodze; uchwyty przy klatce, łokcie ugięte. | Sit with your back against the pad and feet on the floor; handles by your chest, elbows bent. |
| cpress.seatedMove | Wypchnij uchwyty przed siebie, potem powoli wróć w stronę klatki. | Press the handles straight out, then slowly bring them back toward your chest. |
| press.mis.lock | Blokowanie łokci na końcu ruchu. | Locking out the elbows at the end of the press. |

Brzmienie trzech zdań bez zmian względem kandydatów W1. Istniejące użyte: `mcp.blades`, `plank.brace`, `mis.jerk` (treść pasuje dosłownie: łopatki przy oparciu i barki nie idą w przód — ACE Step 2; napięty brzuch — oba; szarpanie zamiast kontroli — oba).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| ace-165 | https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/ | ACE | 4 — organizacja szkoląca i certyfikująca trenerów; biblioteka firmowana przez ACE (id istniejące w `data/zrodla/cues.json`; odczyt ponowny 02.11.2026) | Step 1–4 |
| nasm-chest-press-machine | https://www.nasm.org/resource-center/exercise-library/chest-press-machine | NASM | 4 — organizacja szkoląca; biblioteka firmowana przez NASM, bez autora i daty (id istniejące; odczyt ponowny 02.11.2026) | Step 1–4; „Common Mistakes” |

Niezależność: ACE i NASM — różne organizacje.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Single Arm Cable Chest Press — karta | 1 źródło szczebla 4 (ACE #338); kandydaci W1 `cpress1.setup`, `cpress1.move`, `cpress.base` bez zmian. Szukano: NASM (tylko hantle leżąc), BarBend (brak artykułu w wynikach), OriGym (strona weryfikacji — nieprzeczytana). |
| Incline Cable Chest Press — karta | brak przeczytanego źródła szczebla ≤ 4; inny kąt ławki niż Seated |
| Seated Cable Chest Press — „nie dociskaj lędźwi do oparcia, zachowaj naturalne wygięcie” | tylko ACE #165 (Step 1) |
| Seated Cable Chest Press — `push.mis.partial`/niepełny zakres | NASM „Not achieving full range of motion” + ACE (pełny wyprost, powrót do klatki) — możliwe „błąd = zaprzeczenie standardu”, ale istniejące zdanie `push.mis.partial` mówi o pompkach („za płytko w dół”) — nie pasuje dosłownie; nowe zdanie odłożone (karta ma już 2 błędy) |
| Seated Cable Chest Press — łokcie ok. 45° od tułowia | tylko NASM (liczba, maszyna) |

## Podsumowanie

Ćwiczeń zbadanych: 3. Nowe karty z błędami: 1 (Seated Cable Chest Press: 2 błędy ze źródeł jako „błąd = zaprzeczenie standardu” + wariant sprzętu), bez błędów: 0. Błędy wnioskowane: 0. Role gotowe: nie dotyczy (luk ról w tej rodzinie nie zgłoszono w W1). Otwarte: 2 ćwiczenia. Nowe zdania: 3 (wszystkie z kandydatów W1).
