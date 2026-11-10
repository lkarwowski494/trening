# Recenzja niezależna r2 — rodzina v2 `mobility_floor` (partia 2, linia 1.1), 10.11.2026

Recenzent: audytor (sesja r2; nie pisał rodziny, kart, zestawów ani poprawek po r1; L-047). Stan: `figury/partia-2-mobility_floor` @ 3239067 (poprawki W1, Ś1, Ś2, N3 względem 8e98f323), odłączony worktree.
Skrót v2 (`node scripts/zrodla-runtime.mjs --skroty` w worktree r2): `mobility_floor` = `a80c9c3d7928` (r1: `0c88b49248f1`). Skróty kart i zestawów bez zmian względem r1. `assignAll()`: 22 ćwiczenia rodziny, 9 z rysunkiem (widok side), 13 bez pozy.

**Werdykt rodziny: wyświetlana** — W1 (WYSOKIE) usunięte, Ś1 i Ś2 poprawione. Nowe: 1 × ŚREDNIE (Ś3, skutek uboczny poprawki W1), 1 × NISKIE (N4). Nie blokują (próg: backlog z wersją).

## Jak sprawdzono
- `git diff 8e98f323..3239067`: zmienione pozy tylko Child's Pose, Butterfly Stretch, Side-Lying Quad Stretch (porównanie `cwiczenia` w `lib/figures/v2/poses/mobility_floor.json`); generator, PRZYBLIZENIA, nagłówek nakładki, nowy test.
- Arkusze `scripts/figures/arkusz-slad.mjs` (9 ćwiczeń × side, 21 kadrów co 0,05) wygenerowane samodzielnie na 3239067 i na 8e98f323: HTML i PNG 6 ćwiczeń bajtowo identyczne (`cmp`: The Straddle, Seated Calf, Seated Floor Hamstring, Kneeling Hip Flexor, Supine Hamstring, Cat-Cow), różne tylko 3 poprawiane. Kadry 3 zmienionych w skali 7 px/cm (pełna rozdzielczość, Read).
- Liczby z `frameAt`, `jointAngles`, `bodyColliders`/`gap`, `checkFrame` (0 problemów); `v2-validate.mjs` dla 9 póz: OK. Testy (`--runInBand`): `figures-v2-mobility-floor-poprawki-r1` i `figures-v2-nakladka-mobility-floor` 10/10 zielone; nowy test uruchomiony na danych 8e98f323: 6/6 czerwone (przypadek negatywny potwierdzony).

## Poprawki r1 — weryfikacja
- **W1 Child's Pose — usunięte.** Chwyt R/L (110; 3; ±22), bark x 52,0 → dłonie 58 cm przed barkiem, na podłodze (dolna krawędź przedramienia −0,3 cm), dłoń wnętrzem w dół. Łokieć zgięty 29,6° (bark–chwyt 92% sięgu) — ręce wyciągnięte, lekko ugięte; zgodne z kartą („Ręce zostaw wyciągnięte przed sobą”, „oprzyj dłonie o podłogę przed sobą”). Pośladki na piętach (miednica–stopa −3,2 cm, jak przed poprawką), czoło na podłodze (dolna krawędź głowy 0,3 cm), kolano 151,8°, biodro 134,5°, głowa–ramię 11,5 cm.
- **Ś1 Side-Lying Quad — poprawione.** Goleń górnej nogi: składowa boczna 0,33 (było 0,56), w tył 0,56, ku głowie 0,77 → obrót ok. 30° (było 59°). Kolano 140°, dłoń 1,8 cm od kostki, uda 1,7 cm od siebie.
- **Ś2 Butterfly — poprawione.** Ramię–udo 0,2 cm (było 4,1 w tej samej mierze), łokieć na 85% długości uda (przy kolanie), nad i od środka uda. Przedramię–goleń −6 cm bez zmian względem r1 (ręce trzymają stopy; silnik nie bada kolizji kończyna–kończyna, w rzucie side niewidoczne).
- **N3** — nagłówek nakładki poprawiony, MOB-F1/MOB-F2 w docs/21 (1.2). N1, N2 → MOB-F2.

## Znaleziska r2

| # | Poziom | Pewność | Ćwiczenie | Opis | Miara | Realność |
|---|---|---|---|---|---|---|
| Ś3 | ŚREDNIE | 85% | Child's Pose | Skutek uboczny W1: pochylenie tułowia 100 → 92 (commit: zakres barku ≤ 171°, zgięcie barku teraz 169,6°). Tułów poziomo (−2°; było −10°), barki 24,3 cm nad podłogą (było 17,3), dolna krawędź tułowia 14,8 cm (było 7,8) — klatka na wysokości bioder (miednica 26). Żeby czoło sięgnęło podłogi, głowa zgięta względem tułowia o 50,7° (było 12,3°) — na rysunku głowa podwinięta pod barki. Karta („klatkę opuść w stronę podłogi”, „cofnij biodra w stronę pięt”) spełniona kierunkowo, nie sprzeczna; wierność pozy spadła. | kąt `up`–`headUp` 50,7° (próg szyi neutralnej w silniku `szyjaMaxDeg` 40°, stosowany w pushup_plank); tułów −2° od poziomu | realny (każde otwarcie karty), nie blokuje |
| N4 | NISKIE | 85% | Side-Lying Quad Stretch | Stopa górnej nogi po zmianie rotacji 40 → 55: oś stopy 29,3° od płaszczyzny biodro–kolano–kostka (było ok. 8°), tuż pod progiem R11 (30°); palce w stronę sufitu (składowa boczna osi stopy 0,73). Na rysunku „płetwa” stopy nad biodrem. Komentarz generatora („oś w płaszczyźnie…”) i PRZYBLIZENIA („dłoń 1,3 cm”, jest 1,8) nieścisłe. | asin(0,49) = 29,3°; próg `osStopyDeg` 30 | realny, kosmetyczne |

## Poprawki (dla autora; test odtwarzający)
- Ś3 (backlog z wersją albo przy okazji): tułów opadający ku barkom (barki niżej niż miednica, dolna krawędź tułowia ≤ ok. 8 cm) i szyja ≤ 40° przy zgięciu barku ≤ 171° — np. dłonie bliżej (łokcie bardziej ugięte) albo nazwany wyjątek zakresu barku; test: kąt głowa–tułów ≤ 40° i y barku < y miednicy.
- N4: rotacja stopy tak, by oś stopy była ≤ ok. 15° od płaszczyzny nogi; poprawić liczby w komentarzu i PRZYBLIZENIA.

## Zestawy ogólne (K12) — `stretch`
Seated Calf, Seated Floor Hamstring, Kneeling Hip Flexor, Supine Hamstring: rysunki bajtowo identyczne z r1 (`cmp`), skróty zestawów bez zmian — werdykt r1 przeniesiony: wyświetlane.

## Karty własne (K11)
- Child's Pose — ponownie wobec rysunku: zgodna (W1 usunięte); uwaga Ś3. Wyświetlana.
- Butterfly Stretch — ponownie: zgodna (łokcie na udach, pochylenie z bioder 32°, plecy proste). Wyświetlana.
- Side-Lying Quad Stretch — ponownie: zgodna (pięta ku pośladkowi w płaszczyźnie ciała, dłoń trzyma stopę, kolana razem); uwaga N4. Wyświetlana.
- The Straddle, Cat-Cow — rysunki bez zmian (`cmp`), werdykt r1 przeniesiony: wyświetlane.

## v1 → zastąpiona (K10)
Bez zmian względem r1: brak wpisów v1 dla ćwiczeń rodziny — lista pusta.

## Testy (K14) — `git diff f808d8c1..3239067 -- tests/` (od stanu r1)
- Nowy `figures-v2-mobility-floor-poprawki-r1.test.ts`: progi z karty (chwyt ≥ 20 cm przed barkiem, y 2–4; ramię–udo ≤ 1; składowa boczna goleni ≤ 0,35), każda klatka; na danych sprzed poprawki 6/6 czerwone. Bez poluzowania.
- `interaction-guards.test.ts` (S20): nazwany wyjątek „nakładka bez elementów” tylko dla `mobility_floor.ts` i to ścisły (`toEqual([])`); inne rodziny nadal ≥ 1 element — zgodne z rozstrzygnięciem koordynatora 09.11.2026 (wariant A, MOB-F1). Nie poluzowanie poza nazwanym wyjątkiem.

Nakładka pusta — wyjątek A (docs/18, MOB-F1), nie znalezisko. Mięśnie: brak (decyzja 04.11.2026 (4) B). Ślad: bez ciężaru/przyrządu — 8 póz statycznych bez śladu (`trailFor` = 0 kształtów), Cat-Cow — miednica nieruchoma (N1 → MOB-F2).
