# Recenzja niezależna W-02 delt_raise (audytor, 11.11.2026)

Zakres: `git diff 5721a16e..HEAD` na w02/a-delt (c45ce604, 91fb380e, ab4de90f). Autor: programista W-02; recenzent: audytor (L-047). Bez zmian w kodzie i danych.

## 1. Straight Raises on Incline Bench — werdykt: wyswietlana

Arkusz własny: `node scripts/figures/arkusz-slad.mjs --out <scratchpad>/ark --key "Straight Raises on Incline Bench"` (side + front, 21 kadrów co 0,05), kadry u=0 i u=1 obejrzane w pełnej rozdzielczości (wycinek ×3).

Pole `slad`: tor sztangi (chwyt) to łuk ok. 90° wokół barku w płaszczyźnie strzałkowej — od zwisu pionowo pod barkiem (u=0, chwyt [-26,3; 25,5] cm) do poziomu przed głową (u=1, chwyt y = 87,4 cm przy barku y = 87,5 cm, czyli na wysokości barków); łuk gładki, monotoniczny, bez cofania; w widoku z przodu sztanga wznosi się prosto, symetrycznie, chwyt ~ szerokość barków (z = ±22 przy barkach ±19). Odstęp ciężar–ciało rośnie 32,7 → ok. 50,8 cm i stabilizuje się od u≈0,45. Tułów i miednica stałe we wszystkich klatkach (ruch tylko w barkach, łokieć stały lekko zgięty).

Pomiary (keyframeFrame, u = 0 / 0,5 / 1; tymczasowy test usunięty):
- kolano: zgięcie 6,8° (było ok. 67° ku plecom) — identycznie jak Y Raise (hantle), kostka na podłodze (y = 7 = ankleH), x = 78,2;
- siedzisko: `siedzisko: 2`, wejście kształtów ciała w siedzisko 0,00 cm (było do 0,7 cm przy 20 cm);
- podpór: miednica [9,1; 52,1], przegub ławki [0; 43], oparcie 45° do [-26,9; 69,9]; klatka i brzuch na oparciu (min. odległość ze znakiem −3,5 cm, w Y Raise −3,6 cm — to samo ułożenie, ugięcie tkanek w rzucie), ciało nie wisi w powietrzu; podpór = oparcie + stopy na podłodze (nogi proste, deska).
- Porównanie z Y Raise: miednica, kostki, kolana, ławka — wartości identyczne; różnią się tylko ręce (zgodnie z intencją).

Zgodność z kartą: sri.setup „klatką na ławce skośnej… na prostych, zwisających rękach” — zgodne (u=0 zwis pionowy); sri.move „prawie prostymi rękami unieś przed siebie, potem powoli opuść” — zgodne; yr.mis.chest — klatka stale na oparciu. Test autora (tests/figures-v2-delt-raise-w02.test.ts) ma negatyw i pozytyw odniesienia — sprawdzone.

Znaleziska:
| # | Poziom | Pewność | Opis | Dowód | Realność |
|---|---|---|---|---|---|
| 1 | ŚREDNIE | 85% | W u≈0 (zwis, punkt spoczynku między powtórzeniami) gryf sztangi styka się z przednią nogą ławki: chwyt x = −26,3, przednia noga x = −24,4 o grubości 3,2 cm (krawędź −26,0) — oś gryfu 0,3 cm od krawędzi słupka, gryf go przecina; ręce i barki sprzed W-02 (nie wprowadzone tą zmianą). Od u=0,05 czysto. | lib/figures/v2/draw.ts:22 (benchLegW 3,2), :268; benchPolys(...).legs = [−2,6; −24,4]; wycinek u=0 arkusza side | brzegowy (widoczne tylko w pierwszym kadrze, drobne); backlog, nie blokuje |

Uwaga procesowa: plik póz zmienił skrót rodziny, więc cała rodzina delt_raise jest ukryta (fail-closed, scripts/zrodla-runtime.mjs:98) do nowego wpisu recenzji ruchu z bieżącym `sha` — wpis musi zrobić koordynator na podstawie tej recenzji.

## 2. Front Incline Dumbbell Raise — `fidr.move` — werdykt: wyswietlana (treść karty)

- Hierarchia: oba źródła szczebla 5 (oznaczenie „praktyka”, etap 2 z CLAUDE.md). app-s1 „parallel or slightly above shoulder level” / weighttraining.guide „way above the height of your shoulders” — sprzeczność na tym samym szczeblu; „co najmniej do wysokości barków” to poprawna część wspólna (obie wersje ją spełniają), różnica pokazana w data/zrodla/cues.json i docs/research/27. Usuwa znalezisko WYSOKIE z r2 (04.11.2026).
- Rysunek: koniec ruchu chwyt y = 106,7 cm przy barku y = 96,5 cm (ok. 10 cm nad barkiem) — zgodny z „co najmniej do wysokości barków”.
- Naturalność: PL „Unieś hantle przed sobą, łokcie lekko ugięte, co najmniej do wysokości barków; opuść je powoli.” i EN „…at least to shoulder height…” — brzmią jak trener; bez uwag blokujących.
- `npm run check:claims`: rejestr zgodny.
- Usunięcie 33 przekładów: bezpieczne. cueText (lib/cues/index.ts:55) ma rezerwę en → pl; Front Incline Dumbbell Raise nie występuje w runtime lib/cues/data.json (karta ukryta, werdykt „do poprawy”), więc żaden użytkownik nie zobaczy angielskiego zastępstwa; `fidr.move` używany tylko przez to ćwiczenie (1 wystąpienie w data/zrodla/cues.json); zestaw przekładu W-03 wymienia klucz (test autora).

Znaleziska: brak (KRYTYCZNE/WYSOKIE/ŚREDNIE). Poza zakresem zmiany, do recenzji ruchu rodziny: w rysunku FIDR kształty ciała wchodzą w siedzisko do 3,8 cm (pomiar sdPoly jak w teście autora) — niezweryfikowane, czy to przyjęta tolerancja siedzenia; nie zgłaszam jako znaleziska (pewność < 80%).
