# Recenzja niezależna r3 (ostatnia): figury v2 dla 1.0.1 (bramka 4, L-047, L-050)

- Recenzent: audytor (sesja 1.0.1, niezależny). Autor: programista r2/figury-v2. Nic nie poprawiałem ani nie commitowałem; worktree czysty.
- Kod: `r2/figury-v2`, HEAD 03a7575, diff `0b2e64e..03a7575` (bd35eb3 R2-1/R2-7, 6becb36 R2-6, 03a7575 R2-2..R2-5).
- Metoda: kopia stanu 03a7575 (`git archive`) w `/tmp/claude-0/-home-user-trening/22a5d54a-fd35-5956-8784-cf11c89aac0b/scratchpad/rec3/head`, porównana z 0b2e64e (`.../rec2/head`). Narzędzia w `.../rec3/tools/` (cmp, jm, cont, loop, cg, kadr). Kadry 3× w `.../rec3/png/`: head-JM-Press-side-tr.png, head-JM-Press-top.png, head-Decline-Close-Grip-Bench-To-Skull-Crusher-side-tr.png, head-Decline-Close-Grip-Bench-To-Skull-Crusher-top.png.
- Testy na 03a7575: figury-1-0-1-uwagi, figures-v2-geometry, figures-v2-tor, figury-1-0-recenzja i cues są zielone. Czerwone są tylko 3 testy, które czekają na wpisy recenzji:
  - figury-recenzja: wpis v2 „ready” z bieżącym skrótem;
  - karty-recenzja: wpis „wyswietlana” ze skrótem;
  - karty-recenzja: `generalCuesReviewed` dla Skull Crusher.

## Regresja (0b2e64e → 03a7575)

Porównałem 87 ćwiczeń: wszystkie widoki, 41 klatek, ślady, klatki błędów i mięśnie. 85 jest identycznych, zmienione są 2: JM Press i Decline Close-Grip Bench To Skull Crusher. To zgadza się z `odciski-roznice-po4.txt`. Razem z r2 (bf18a97 → 0b2e64e) każda zmiana geometrii od bf18a97 jest przejrzana.

## Poprawki R2

| ID | Werdykt | Pomiar / dowód |
|---|---|---|
| R2-1 | ZATWIERDZONE | zestaw Skull Crusher: ok = [`dcgsk.elbows`], err = [`mis.jerk`] (`cue-sets.json:174`); zgodne z decyzją 1a; test `figury-1-0-1-uwagi` R2-1 |
| R2-2 (wariant B) | ZATWIERDZONE | pętla 4 s (`rec3/tools/loop.mjs`): 0,5 s pauza na górze, 2 s prostowanie w dół, 0,5 s pauza na dole, 1 s powrót. Jedno prostowanie na pętlę, bez wyciskania, bez odbicia. Licznik pokazuje „Opuszczanie”, gdy gryf idzie w dół, i „Wypychanie”, gdy w górę. Tryb „Ogranicz ruch” pokazuje górę i dół prostowania |
| R2-3 | ZATWIERDZONE | JM: z dłoni = ±19,0 we wszystkich 41 klatkach (było 19 → 6) |
| R2-4 | ZATWIERDZONE | Skull: z dłoni = ±20,5 = z łokcia = z barku we wszystkich klatkach (było 19 → 10,9 → 12,5), przedramiona równoległe, chwyt na szerokość barków |
| R2-5 | ZATWIERDZONE | największy skok między klatkami (Δu 0,0005): Skull 0,05 cm, JM 0,04 cm (było 3,75 cm przy u 0,6) |
| R2-6 | ZATWIERDZONE | `rodzinaSkrot` obejmuje teraz `V2_WSPOLNE` (common, variants, draw, scene, skeleton, math, anim, errors, figure). Test „nieczułe pliki = []” jest zielony |
| R2-7 | ZATWIERDZONE | zestaw JM Press: ok = [`bp.contact`, `jm.elbows`] |

## JM Press: ramię 34° ku stopom (odstępstwo od 0–20°)

Pomiar (`rec3/tools/jm.mjs`):
- na dole (u = 1) ramię jest 33,9° od pionu w stronę stóp, łokieć 22,5 cm nad stawem barkowym i 15,1 cm ku stopom;
- w środku ruchu (u ≈ 0,7) ramię dochodzi do 42,3°, łokieć 19,0 cm nad barkiem;
- łokieć nigdy nie schodzi poniżej barku ani nie przechodzi za bark ku głowie;
- z góry ramię jest stale pod 45° (dx = dz w każdej klatce);
- zgięcie łokcia na dole 145,4° (kąt wewnętrzny 35°, przedramię przy bicepsie);
- gryf na dole 13 cm za barkiem ku głowie i 14 cm nad nim, czyli nad szyją/podbródkiem;
- kolizji brak.

Wobec przeczytanych źródeł (`scratchpad/badacz-jm.md`):
- **J1** („elbows … stay high and pointing towards the ceiling”, „do not allow … elbows to drop”): łokieć jest 19–31 cm nad barkiem przez cały ruch i nie opada. Zgodne.
- **J2** („point them forward (toward your feet) … in front of the bar”): łokieć jest 15 cm ku stopom, a gryf 13 cm ku głowie, więc łokieć jest przed gryfem. Zgodne.
- **J3** („keep the elbows above the shoulders”): łokieć jest wyraźnie wyżej niż bark. Zgodne. W pozycji leżącej „nad” znaczy „wyżej”, a nie „dokładnie pionowo nad”.
- **J4** („forward and up”): kierunek ramienia 34° od pionu to właśnie „w przód i w górę”. Zgodne.

Przedział 0–20° badacz oznaczył sam jako „uproszczenie — kąty przybliżone, nie ze źródeł poza ok. 45°”. Nie jest to twierdzenie źródłowe. Żadne przeczytane źródło nie przeczy 34° (ani 42° w środku ruchu). Na kadrze z boku łokieć wskazuje w górę i ku stopom, a przedramię opada do szyi, czyli obraz JM Press, a nie wąskiego wyciskania ani francuskiego wyciskania zza głowy. **Werdykt: to nie jest wada. Odstępstwo akceptowalne jako uproszczenie wynikające ze stałego chwytu.**

Do poprawy w dokumentach (r3-1, NISKIE): `docs/brd/wymagania.md` (scenariusz figur 1.0.1) nadal mówi „ramię 0–20° od pionu ku stopom na dole”. Figura (34°) i test (≤ 40°) mówią co innego. Trzeba to zmienić na „ok. 30–40° ku stopom, łokieć wysoko, ≥ 20 cm nad barkiem” w tym samym commicie co wpisy recenzji (zasada BRD z CLAUDE.md). Test sprawdza ≤ 40° tylko na dole; w środku ruchu kąt dochodzi do 42°. To informacyjne, granicy nie trzeba zmieniać.

## Skull Crusher: „tylko prostowanie” wobec nazwy i karty

- **Figura (ZATWIERDZONE):**
  - ramię nieruchome, od 0° do −3° (ku głowie), zgodnie z D3 i D4;
  - łokcie na szerokość barków (z = z barku), więc nie rozchodzą się na boki, zgodnie z D3, D4 i D5;
  - przedramię obraca się wokół łokcia, kąt wewnętrzny na dole 56°;
  - gryf 8 cm nad czubkiem głowy, nad czołem;
  - kolizji brak, łuk toru zamierzony (wyjątek toru opisany poprawnie).
- **Karta (`dcgsk.elbows`): tekstu nie trzeba zawężać.** Brzmi: „Łokcie wąsko przez cały ruch: przy wyciskaniu blisko tułowia, przy prostowaniu nad barkami — nie rozchodzą się na boki.” Opisuje całe ćwiczenie, które użytkownik wykonuje, a nie tylko to, co rysuje figura. Część o prostowaniu zgadza się z figurą. Część o wyciskaniu dotyczy fazy, której figura nie pokazuje, ale nic w figurze jej nie przeczy. Zawężenie usunęłoby poprawną informację o połowie ćwiczenia, z której nadal się korzysta.
- **Nazwa:** figura pokazuje drugą część nazwy („… To Skull Crusher”). Pominięcie wyciskania jest nazwane uproszczeniem w `docs/21` i BRD, a pełna wersja ma wersję docelową 1.1.
- **r3-2 (NISKIE, realny, pewność 85%):** w aplikacji nic nie mówi, że figura pokazuje tylko część ruchu. Użytkownik, który ogląda figurę bez czytania wskazówek, może pominąć wyciskanie. Nie blokuje wydania (karta opisuje obie fazy). Do decyzji właściciela przy 1.1. Opcje:
  - (a) pełna oś czasu z dwiema fazami (już w backlogu 1.1);
  - (b) krótki podpis pod figurą „Figura pokazuje fazę prostowania”, wymagający tłumaczeń.
  
  Rekomendacja (a). Właściciel powinien dostać informację o wyborze wariantu B: to uproszczenie treści wybrane w recenzji, nie przez niego.

## Pozostałe

- **r3-3 (NISKIE):** nieaktualna nazwa testu w `tests/figury-1-0-1-uwagi.test.ts:237` („Skull Crusher: dcgsk.elbows + skull.upperArm + skull.depth”), choć test sprawdza już tylko `dcgsk.elbows`. Kosmetyka, ale opis wprowadza w błąd przy czytaniu wyników.
- Sprawdzone bez znalezisk:
  - regresja (85/87 identycznych);
  - ciągłość ruchu, kolizje, ślady;
  - dane i migracje, import/kopia, prywatność i sekrety (zmiana tylko geometrii rysunku, zestawów wskazówek, skrótu recenzji i dokumentów; brak sekretów w diffie);
  - Apple (brak nazw marek w tekstach aplikacji);
  - dostępność („Ogranicz ruch” pokazuje dwie sensowne pozycje).

## Werdykt zbiorczy

Wszystkie trzy rodziny (squat, hinge, bench_press) i oba zestawy (JM Press, Decline Close-Grip Bench To Skull Crusher) są ZATWIERDZONE na 03a7575. Znaleziska r3-1..r3-3 są NISKIE i nie blokują wydania. r3-1 (BRD) warto poprawić tanio w tym samym commicie co wpisy.

## Gotowe wpisy do docs/research/figury-recenzja.json

Skróty: `node scripts/zrodla-runtime.mjs --skroty` na 03a7575. Wzór jest ten sam co w `tests/figury-recenzja.test.tsx` (rig + V2_WSPOLNE). Liczby ćwiczeń z `assignAll()` (test wymaga liczby, nie tekstu; dotychczasowy wpis squat miał `"25"` jako tekst).

```json
"v2": {
 "squat": {
  "werdykt": "wyswietlana", "data": "2026-10-28", "sha": "7383d6d2196e", "liczba": 25,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047 A) — figury v2 1.0.1, rundy r1–r3 (bf18a97 → 0b2e64e → 03a7575)",
  "autor": "programista r2/figury-v2",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "kto": "audytor — recenzja niezależna ruchu i geometrii figur v2 1.0.1 (bramka 4, L-047, L-050), HEAD 03a7575",
  "uwagi": "Zatwierdzone: zaczepy gum stałe (Squat/Box Squat with Bands), Band Squat — guma przy wewnętrznej krawędzi buta, +0,7 cm od uda (było −3,0). Reszta rodziny bez zmian geometrii od bf18a97 (odciski identyczne); zmiana skrótu w r3 wynika z poszerzenia skrótu o pliki wspólne (R2-6). NISKIE w backlogu 1.0.1 (docs/21): Band Squat łokcie szeroko, Overhead Squat bark 183–198°.",
  "slad": "rec3 (03a7575): odciski 87 ćwiczeń vs 0b2e64e — 85 identycznych (rodzina squat bez zmian); r2: kadry rec2/png/head-Band-Squat-front.png u 0/0,33/0,6/1, pomiar odstępu gumy od uda i podudzia (rec2/tools/bsq.mjs), zaczepy gum (rec2/tools/band.mjs)"
 },
 "hinge": {
  "werdykt": "wyswietlana", "data": "2026-10-28", "sha": "8a00c9653779", "liczba": 32,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047 A) — figury v2 1.0.1, rundy r1–r3 (bf18a97 → 0b2e64e → 03a7575)",
  "autor": "programista r2/figury-v2",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "kto": "audytor — recenzja niezależna ruchu i geometrii figur v2 1.0.1 (bramka 4, L-047, L-050), HEAD 03a7575",
  "uwagi": "Zatwierdzone: stojak z bolcami wewnątrz talerzy (słupki ±61 przy talerzach 64,6–72,4; Rack Pull, Rack Pull with Bands, Good Morning off Pins), dolne zaczepy gum stałe (Deadlift/Sumo/Rack Pull with Bands, Band Good Morning), trap bar/Leverage/Rickshaw, Cable Pull Through, Reverse Band, bloczki. Bez zmian geometrii w r3 (zmiana skrótu: R2-6). NISKIE w backlogu 1.0.1 (docs/21): N3 GM off Pins, N6 kolano na wyproście, sumo tor ukośny, RDL ramiona 23°, łańcuch jedzie z gryfem.",
  "slad": "r1/r2: kadry rec/png i rec2/png (Rack Pull with Bands przód u 0/1, GM off Pins przód, Trap Bar, Cable Pull Through), pomiar zaczepów i kolizji z bolcami (rec2/tools/band.mjs, dmax.mjs); rec3: odciski vs 0b2e64e identyczne dla całej rodziny"
 },
 "bench_press": {
  "werdykt": "wyswietlana", "data": "2026-10-28", "sha": "7417214ebad8", "liczba": 30,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047 A) — figury v2 1.0.1, rundy r1–r3 (bf18a97 → 0b2e64e → 03a7575)",
  "autor": "programista r2/figury-v2",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "kto": "audytor — recenzja niezależna ruchu i geometrii figur v2 1.0.1 (bramka 4, L-047, L-050), HEAD 03a7575",
  "uwagi": "Zatwierdzone: wąski chwyt ±19 (4 ćw.; przedramię 0,9°/11,5°, kolizje w błędach 14→0), ławka ujemna, Board Press (deska widoczna z góry), Pin Press (stojak wewnątrz talerzy), Band Bench Press (zaczep stały), JM Press (łokcie wysoko: na dole ramię 34° ku stopom, łokieć 22,5 cm nad barkiem, z góry 45° stałe, chwyt ±19 stały, gryf nad szyją; 34° zamiast 0–20° — uproszczenie ze stałego chwytu, zgodne z J1–J4: wysoko, ku stopom, przed gryfem, nad barkami), Decline Close-Grip Bench To Skull Crusher (figura pokazuje tylko fazę prostowania — uproszczenie nazwane w docs/21 i BRD, pełne dwie fazy w 1.1; ramię 0…−3°, łokcie na szerokość barków, chwyt ±20,5 stały, jedna faza na pętlę). NISKIE: BRD nadal „0–20°” dla JM (r3-1), brak informacji w aplikacji o pominiętym wyciskaniu (r3-2), nazwa testu figury-1-0-1-uwagi:237 (r3-3).",
  "slad": "rec3 (03a7575): odciski 87 ćwiczeń vs 0b2e64e — zmienione tylko JM Press i Skull Crusher; kadry 3× rec3/png (JM bok ze śladem i góra u 0/0,7/1; Skull Crusher bok ze śladem u 0/0,5/1 i góra u 0/1) oraz arkusz czasowy autora figury-v2/po4/czas/slad-0.png (Skull Crusher u co 0,1; miniatury — ocena pętli na pomiarze loop.mjs; czas/slad-1.png nie istnieje); pomiary: JM ramię/łokieć/z dłoni w 21 klatkach (rec3/tools/jm.mjs), ciągłość co Δu 0,0005 (cont.mjs: maks. 0,05 cm), pętla 4 s co 100 ms (loop.mjs: jedno prostowanie, licznik zgodny z kierunkiem), z dłoni stałe (JM ±19, Skull ±20,5); r1/r2: wąski chwyt, ławka ujemna, Board/Pin Press, Band Bench (rec2/png, rec2/tools/cg.mjs, band.mjs)"
 }
}
```

```json
"zestawy": {
 "JM Press": {
  "rodzina": "bench", "werdykt": "wyswietlana", "data": "2026-10-28", "sha": "71c7740b2215",
  "stan": "zrecenzowana niezależnie (bramka 4, zestaw ogólny po zmianie wskazówek 1.0.1: bp.contact + jm.elbows, bez cgbp.elbows i bp.control)",
  "autor": "programista r2/figury-v2",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "kto": "audytor — recenzja niezależna r1–r3 zestawu karty JM Press (bramka 4, L-047), HEAD 03a7575",
  "uwagi": "jm.elbows „Łokcie cały czas wysoko i pod skosem od tułowia — nie opadają w dół ani nie uciekają na boki.” — 3 zgodne źródła szczebla 4 (wskazowki-ogolne.json: J1, J2, J4), bez liczby w tekście, zgodne z figurą (łokcie 19–31 cm nad barkiem, 45° z góry stałe). bp.contact zgodne. bp.control usunięte (gryf nie dotyka klatki, R2-7). Błąd bp.mis.arch bez figury błędu (stan zastany)."
 },
 "Decline Close-Grip Bench To Skull Crusher": {
  "rodzina": "triLying", "werdykt": "wyswietlana", "data": "2026-10-28", "sha": "6ffcc65b01c7",
  "stan": "zrecenzowana niezależnie (bramka 4, zestaw ogólny 1.0.1: dcgsk.elbows + mis.jerk; skull.upperArm i skull.depth nie wracają — decyzja właściciela 1a z 28.10.2026)",
  "autor": "programista r2/figury-v2",
  "recenzent": "audytor (sesja 1.0.1, niezależny)",
  "kto": "audytor — recenzja niezależna r1–r3 zestawu karty Decline Close-Grip Bench To Skull Crusher (bramka 4, L-047), HEAD 03a7575",
  "uwagi": "dcgsk.elbows opisuje obie fazy ćwiczenia; faza prostowania zgodna z figurą (łokcie nad barkami, na szerokość barków) i ze źródłami ACE, weighttraining.guide, Fitness Volt; faza wyciskania — analogia do cgbp.elbows (oznaczona uproszczeniem). Figura pokazuje tylko prostowanie — tekstu nie zawężać (karta opisuje całe wykonywane ćwiczenie, nic w figurze mu nie przeczy). mis.jerk zgodne."
 }
}
```

Uwaga: w zestawach `autor` to programista r2/figury-v2, bo to on zmienił przypisania wskazówek (e46e6af, bd35eb3). Teksty `jm.elbows` i `dcgsk.elbows` pochodzą od badacza (28.10.2026). Recenzent nie jest autorem żadnego z nich (strażnik `tests/l047-recenzja-niezalezna.test.ts`).
