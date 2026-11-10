# Recenzja niezależna r3 (różnicy) — rodzina v2 `core_standing` (partia 8), 10.11.2026

Recenzent: audytor (sesja r3; nie pisał rodziny ani poprawek). Zakres: `git diff d3e22931..9abbba74` (gear.ts — środek sztangi `podazaZaChwytem` obiema dłońmi także w z; test R2-W1; wyjątek toru „Landmine Rotation|front” 13,1 cm). SHA: 9abbba74 (figury/partia-8-core_standing).
Skrót v2 (`node scripts/zrodla-runtime.mjs --skroty`, liczony przez recenzenta @ 9abbba74): `a08a92274da8` (r2: `0e202db15319`). `assignAll()`: 19.

**Werdykt rodziny: do poprawy** — 1 × WYSOKIE (R3-W1: R2-W1 usunięte w danych i w śladzie, ale nie w rysunku).

## R2-W1 — stan: częściowo usunięte
- Dane (`frameAt`, 21 klatek co 0,05): `barbell.c` i `info.load` = środek chwytów (odległość maks. 0,00 cm); koniec gryfu (`pivot.to`) w środku chwytów; długość gryfu stała 200 cm (u = 0: 200,0; u = 0,5: 200,0), koniec przy podłodze (206; 5; 0).
- Ślad toru w rzucie z przodu (`trailFor`): x 19,1 → 0 → −19,1 cm, y 86,9 → 100 → 86,9 cm — przy dłoniach. Arkusze front i side wygenerowane samodzielnie, obejrzane w pełnej rozdzielczości (kadry u = 0 i u = 0,5 powiększone).
- Rzut z boku: koniec sztangi jako koło w środku chwytów; gryf od dłoni do osi przed stopami, nie przenika ciała.

## Nowe znalezisko
| ID | Klasa | Pewność | Ćwiczenie | Opis i miara | Realność |
|---|---|---|---|---|---|
| R3-W1 | WYSOKIE | 95% | Landmine Rotation, rzut z przodu | Rysowany odcinek „sztanga” 20 cm nadal stoi na osi ciała: `shapesAt(…, 'front')` w u = 0 daje linię `bar` od (−10; 86,9) do (10; 86,9), a środek chwytów w rzucie to (19,1; 86,9) — 19,1 cm obok dłoni (u = 0,25: 13,5 cm; u = 1: 19,1 cm). Na arkuszu poprzeczka wisi na środku bioder, dłonie i ślad z boku. Przyczyna: `lib/figures/v2/draw.ts:426` rysuje sztangę z przodu od `-half` do `half` bez przesunięcia o `o[0]` (rzut `c`), więc poprawka gear.ts zmienia dane, nie rysunek. Test R2-W1 sprawdza `barbell.c` i `info.load`, nie narysowany kształt. Miara: środek linii `bar` (i talerzy) w rzucie z przodu ≤ 3 cm od rzutu środka chwytów w każdej klatce. Alternatywa: wstrzymać ćwiczenie. | realny — każde otwarcie rysunku z przodu |

Uwaga do poprawki: draw.ts to kod wspólny; dla sztang z symetrycznym chwytem `o[0]` = 0, więc przesunięcie nie powinno zmieniać innych rodzin — sprawdzić `--skroty`.

## Wyjątek toru „Landmine Rotation|front” 13,1 cm
Zgodny z pomiarem: cięciwa śladu y = 86,9 cm (x ± 19,1), szczyt łuku (0; 100) — odchylenie 13,1 cm, x monotoniczne. Łuk zamierzony: koniec gryfu na stałym promieniu 200 cm wokół osi przy podłodze, ruch zgodny z regułami rodziny (`_obrot`: skręt jednostronny, bez skłonu bocznego). Przyjęty.

## Kod wspólny i testy (K14)
- `--skroty` @ 9abbba74 vs @ d3e22931: różni się tylko `v2.core_standing` (0e202db15319 → a08a92274da8). Zestawy i karty z r2 — skróty bez zmian (potwierdzone w r3).
- Test W4: dodane sprawdzenie „sztanga przy chwycie”, `pv.len ?? NaN` (brak długości teraz oblewa) — bez poluzowań. Nowy test R2-W1 (front i side, 21 klatek). `tests/figury-core-standing-poprawki-r1.test.ts` i `tests/figures-v2-tor.test.ts`: 213/213 zielone (`--runInBand`).
