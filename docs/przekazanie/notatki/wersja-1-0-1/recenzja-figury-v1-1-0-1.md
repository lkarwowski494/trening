# Recenzja niezależna figur v1 — wersja 1.0.1 (bramka 4, L-047, L-050)

Recenzent: audytor (sesja 1.0.1, niezależny; nie autor). Data: 2026-10-29.
Kod: worktree `/home/user/trening/.claude/worktrees/agent-abc4768548b4d536c`, gałąź `r2/figury-v1`, HEAD `64a8145` (drzewo czyste).
Porównanie z 1.0: `wersja-1-0-1-r2:data/zrodla/figures.json`.
Metoda: pomiar punktów z `lib/figures/geom.ts` (ten sam moduł co aplikacja; 21–101 próbek na przejście), podglądy PNG
`scratchpad/figury-v1/recenzja/<Ćwiczenie>/podglad.png`, karty `lib/cues/data.json` + `lib/cues/text/pl.json`,
`npx jest tests/figures.test.tsx tests/figury-podparcie.test.ts tests/figury-recenzja.test.tsx tests/close-button-guard.test.tsx` (133/133 zielone),
`node scripts/figures/gen.mjs --check` (OK). Skrypty pomiarowe: `scratchpad/aud/m.mjs`, `drag.mjs`, `old.mjs`.
Kryterium „styk” = punkt ≤ 1,5 j. nad podłożem (LIM.contact); „ślizg” jak w istniejących strażnikach: punkt w styku nie dalej niż 2 j. od położenia w najbliższej pozie kluczowej
(`tests/figury-recenzja.test.tsx:186-189`), precedens: Push Up — ślizg dłoni 5,7 j. uznany za wadę.

## Werdykty

| Figura | Werdykt | Nie gorsza od 1.0? | Główny pomiar |
|---|---|---|---|
| Reverse Lunge | DO POPRAWY (pomiar) | w 1.0 ukryta — bez zmian dla użytkownika | palce tylnej stopy suną po podłodze (i pod nią) 11,8 j. w tył przed oderwaniem; po lądowaniu dryf 3,2 j. w tył i 5,7 j. w przód |
| Walking Lunges | DO POPRAWY (pomiar) | NIE jednoznacznie: naprawia ŚREDNIE z 1.0 (krok drugą nogą), ale wprowadza ślizg tylnych palców 8,1 j. | palce tylnej stopy suną 8,1 j. w przód przy odbiciu |
| Push Press | DO POPRAWY (pomiar, tania) | w 1.0 ukryta | gryf 6,66 j. od środka głowy poniżej czubka (strażnik OHP wymaga ≥ 7) — dłoń na czole w „W trakcie 2” |
| Step Up | ZATWIERDZONE | TAK (lepsza: ręce pionowo, stopa ≥ 3 j. od krawędzi) | dłoń = bark w x w każdej pozie; ślizg palców ≤ 1,55 j. |
| Incline Push Up | ZATWIERDZONE | TAK (lepsza: dłoń 2,2 j. ślizgu zamiast 3,2; 2,1–4,3 j. od krawędzi zamiast 5,6–8,8) | bark 8,7 j. od dłoni w dole, bez przenikania |
| Lunges (hantle) | ZATWIERDZONE | TAK — dane figury identyczne z 1.0 (sha c4129536dca1 jak na wersja-1-0-1-r2) | znana NISKA (tylna stopa pionowo w „w trakcie”, przednie palce 3,2 j.) — backlog, bez zmian |

Silnik (czwarta pozycja): ZATWIERDZONY, bez regresji — szczegóły niżej. Jedna uwaga ŚREDNIA (brak testu ekranu dla siatki 2×2 i „W trakcie {n}”).

## Znaleziska (od najpoważniejszego)

| # | Poziom | Pewność | Figura | Opis | Kroki w aplikacji | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| 1 | WYSOKIE (bramka 4: ruch przeczy karcie, figura nie może być wyświetlana) | 95% | Reverse Lunge | Notatka i karta: „tylna noga cofa się łukiem w powietrzu”. Pomiar: start→mid k=0,05–0,45 palce tylnej stopy na wysokości −1,0…+0,4 j. (pod podłogą do 1 j.), x 0 → −12,4 — stopa sunie po podłodze ok. 12 j. (ok. 20 cm), dopiero potem się unosi. W 1.0 było 27 j. — poprawa, ale nadal ślizg. Dodatkowo po lądowaniu (mid2→end) palce cofają się do −52,8 (3,2 j. od lądowania) i wracają do −47,1 (5,7 j.); w pozie końcowej 2,5 j. przed miejscem lądowania. Test `stopa idzie łukiem` sprawdza tylko szczyt (≥ 8 j.) i monotoniczność x, nie styk; test dryfu dopuszcza 4 j. | Ćwiczenie Reverse Lunge → Technika → animacja (po zatwierdzeniu) | realny (każde wyświetlenie animacji) | `scratchpad/aud/m.mjs "Reverse Lunge"`: start>mid 0.25 toe2=(−7.0,−1.0), 0.45 (−12.4,−0.1); mid2>end 0.40 toe2=(−52.8,0.0), end (−47.1,0.8); `drag.mjs new "Reverse Lunge"`: toe2 11,78 j.; podgląd Reverse_Lunge/podglad.png kadr „start→mid 0.25”; `data/zrodla/figures.json` Reverse Lunge mid/mid2/end; `tests/figury-podparcie.test.ts:213-222` |
| 2 | WYSOKIE (bramka 4) | 90% | Walking Lunges | Przy odbiciu (start→mid k=0–0,27) palce tylnej stopy zostają w styku (y −0,8…1,44 j.) i przesuwają się 8,1 j. w przód (x −41,1 → −33,0) — stopa sunie po podłodze, zanim się uniesie. Ten sam typ wady co Push Up (5,7 j.) i przednia stopa Lunges (próg 2 j.). Strażnik sprawdza tylko stopę bliższą. Reszta ruchu poprawna: stopa bliższa stoi w miejscu (0 j.), dalsza ląduje piętą przed ciałem (dryf po lądowaniu 0,85 j.), tylne kolano ≤ 8 j., tułów pionowo, dłonie przy biodrach. | Walking Lunges → Technika → animacja | realny | `drag.mjs new "Walking Lunges"`: toe2 8,08 j. przy k=0,27; `m.mjs`: start toe2=(−41.1,−0.8), k 0.10 (−38.8,0.0), k 0.20 (−35.7,0.8); `tests/figury-podparcie.test.ts:231-235` (tylko `toe`) |
| 3 | WYSOKIE (bramka 4; poprawka tania) | 90% | Push Press | W „W trakcie 2” (mid2) dłoń/gryf (−4,3; 99,4) leży 6,66 j. od środka głowy (−9,3; 95,0) przy promieniu głowy 6,5 j. — gryf dotyka czoła (0,16 j. odstępu, kreska przedramienia 4,5 j. nachodzi na głowę). Ten sam strażnik dla Overhead Press (sztanga) wymaga ≥ 7 j. „mija twarz” (`tests/figury-recenzja.test.tsx:128-131`), wprowadzony po wadzie „gryf przez twarz”. Dotyczy też mid→mid2 k ≥ 0,9 (6,77 j.). Statyczny kadr pokazuje to wprost (siatka 2×2). Reszta zgodna z kartą: krótkie ugięcie (kolano 25°), nogi i biodra prosto zanim ręce wyciskają (kolano 0°, łokieć 116°), wyprost rąk, gryf nad kostką, tor bez łuku przed twarz. | Push Press → Technika (animacja albo „Ogranicz ruch”) | realny | `m.mjs "Push Press" hand head`: KEY mid2 hand=(−4.3,99.4) head=(−9.3,95.0); podgląd Push_Press/podglad.png kadr „KLATKA mid2” |
| 4 | ŚREDNIE (proces, DoD; nie blokuje) | 95% | silnik | Nowe zachowanie ekranu bez testu: siatka 2×2 (`flexWrap`, `flexBasis: '47%'`, wysokość 120) i podpisy „W trakcie 1/2” (`frameLabel(n, 4)`) nie mają testu ekranu ani logiki — `tests/figures.test.tsx:210` sprawdza tylko 3 pozycje; brak testu `frame-mid2`. Dziś nieosiągalne (wszystkie figury 4-pozycyjne ukryte), osiągalne od pierwszego „wyswietlana”. Rekomendacja: test przed zmianą werdyktu którejkolwiek figury 4-pozycyjnej. | — | brzegowy (dziś), realny po zatwierdzeniu | `components/ExerciseFigure.tsx:67-71`, `lib/figures/index.ts:35-39`, grep `W trakcie {n}|frame-mid2|flexBasis` w tests/ — brak |
| 5 | NISKIE | 85% | Walking Lunges | Ping-pong odtwarza drugą połowę pętli wstecz — widać krok w tył (nazwane uproszczenie w notatce; ograniczenie silnika). Statyczne kadry poprawne. | animacja | realny | `lib/figures/geom.ts:129-136` |

Uwagi poniżej progu (bez wpisu): Reverse Lunge start toe2 −1 j. pod podłogą (część znaleziska 1); Walking Lunges start toe2 −0,8 j.; Incline Push Up dłoń do 0,9 j. pod blatem (niewidoczne pod kreską); Push Press głębokość ugięcia 1,2 j. spadku barku (opisana jako ilustracyjna, karta: „krótko”).

## Propozycje poprawek (pomiar, kadr) — do decyzji autora

- Reverse Lunge: w „mid” podnieść palce szybciej (np. większe zgięcie kolana tylnej nogi / stopa skierowana bardziej w dół, albo dodatkowe uniesienie palców już w k≈0,1), tak by toe2 > 1,5 j. dla każdego k, przy którym |Δx| od startu > 2 j.; mid2→end: dobrać kąty end albo mid2 tak, by palce w styku nie oddalały się > 2 j. od miejsca lądowania. Strażnik: ślizg wg `tests/figury-recenzja.test.tsx:186-189` dla `toe2`.
- Walking Lunges: w „start→mid” tylna stopa ma się odrywać prawie pionowo (np. większe zgięcie kolana `knee2` lub ft2 bliżej −90° w „mid”), próg jak wyżej dla `toe2`; dodać `toe2` do testu „stopa w miejscu”.
- Push Press: w mid2 dłoń ok. 1 j. w przód (np. x −3,0 → 7,7 j. od głowy; nadal ≤ start + 1,5) albo głowa lekko w tył; dodać strażnik „mija twarz ≥ 7 j.” jak dla OHP.
- Alternatywa dla Walking Lunges, jeśli poprawka nie zdąży: przywrócić dane z 1.0 (`like: Lunges (hantle)` bez własnych klatek) — wraca ŚREDNIE „brak kroku drugą nogą”, ale bez nowej wady; wtedy wpis „wyswietlana” z 1.0 po przeliczeniu skrótu.

## Regresja silnika i układ

- Runtime `lib/figures/data.json` HEAD vs wersja-1-0-1-r2: żadna wyświetlana figura nie zmieniła się bajtowo; usunięte z runtime tylko 4 figury ukryte do recenzji (Incline Push Up, Lunges (hantle), Walking Lunges, Step Up); `rom` bez zmian; 13 figur 3-pozycyjnych bez zmian.
- `components/ExerciseFigure.tsx`: przy ≤ 3 pozycjach styl identyczny (`flex: 1`, wysokość 110/140, bez `flexWrap`), `frameLabel(n, len)` daje te same napisy dla 1–3 pozycji; 4 pozycje — `flexWrap` + `flexBasis 47%` + `gap 8` mieści 2 w rzędzie przy szerokości ≥ 134 pt (dwa rzędy po 120 pt + podpisy).
- `loopAt`/`poseBetween`/`loopMs` ogólne dla n; pętla 4 pozycji 9,3 s → przycisk „Zatrzymaj animację” jest (> 5 s, WCAG 2.2.2).
- `FRAME_ORDER` w jednym miejscu dla silnika (geom.ts) i powielony w `scripts/figures/gen.mjs` (te same wartości).
- Tłumaczenia „W trakcie {n}” we wszystkich lokalach (np. en „Midway {n}”, de „Während der Bewegung {n}”).

## Gotowe wpisy do `docs/research/figury-recenzja.json`, sekcja `v1` (zatwierdzone)

Skróty z `node scripts/zrodla-runtime.mjs --skroty` na HEAD 64a8145.

```json
"Step Up": {
 "rodzina": "lunge",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4 (L-047, L-050): podgląd klatek i póz pośrednich, arkusz śladu toru, pomiar z lib/figures/geom.ts (21–101 próbek na przejście), karta lib/cues (stepup.setup, stepup.move, lunge.torso, stepup.knee); raport recenzja-figury-v1-1-0-1.md",
 "sha": "f4ab0f6bfec7",
 "uwagi": "Poprawka 1.0.1 nie gorsza od 1.0 (lepsza): dłonie z hantlami pionowo pod barkiem w każdej pozie (|Δx| = 0 j.; było 19 j. za barkiem), stopa nogi zakrocznej ≥ 3 j. od krawędzi skrzyni i nad blatem (palce ≥ 4 j. nad wierzchem w przejściu mid→end), ślizg tylnych palców przy oderwaniu 1,55 j., środek ciężkości z hantlami nad stopą na skrzyni (reguła jednej podpory spełniona). Pozycja końcowa z uniesionym kolanem bez zmian względem 1.0 (nazwane uproszczenie).",
 "autor": "programista r2/figury-v1",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "slad": "arkusz śladu toru: scratchpad/figury-v1/recenzja/Step_Up/podglad.png (pozy kluczowe, pozy pośrednie 0,25/0,5/0,75, nałożony ślad punktów); pomiar: scratchpad/aud/m.mjs, drag.mjs",
 "poprzedniWerdykt": "wyswietlana",
 "poprzedniaRecenzja": "2026-10-28"
},
"Incline Push Up": {
 "rodzina": "pushup_plank",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4 (L-047, L-050): podgląd klatek i póz pośrednich, arkusz śladu toru, pomiar z lib/figures/geom.ts, karta lib/cues (ipush.setup „o krawędź”, ipush.move, push.rigid, ipush.height); raport recenzja-figury-v1-1-0-1.md",
 "sha": "a9864ecbbd56",
 "uwagi": "Poprawka 1.0.1 nie gorsza od 1.0 (lepsza): dłoń przesuwa się po blacie o 2,2 j. w całym ruchu (było 3,2), leży 2,1–4,3 j. od krawędzi podwyższenia (było 5,6–8,8) — zgodnie z kartą „o krawędź”; w dolnej pozycji bark 8,7 j. od dłoni w poziomie i 10,4 j. nad blatem, ciało w linii, bez przenikania w blat; palce stóp w miejscu (≤ 1 j.).",
 "autor": "programista r2/figury-v1",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "slad": "arkusz śladu toru: scratchpad/figury-v1/recenzja/Incline_Push_Up/podglad.png; pomiar: scratchpad/aud/m.mjs, old.mjs (porównanie z wersja-1-0-1-r2)",
 "poprzedniWerdykt": "wyswietlana",
 "poprzedniaRecenzja": "2026-10-28"
},
"Lunges (hantle)": {
 "rodzina": "lunge",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4 (L-047, L-050): dane figury identyczne z 1.0 (wersja-1-0-1-r2, wariant B — przywrócona poza tylnej stopy), skrót bez zmian; podgląd i arkusz śladu toru; raport recenzja-figury-v1-1-0-1.md",
 "sha": "c4129536dca1",
 "uwagi": "Figura bajtowo taka sama jak wyświetlana w 1.0 (ten sam skrót) — nie gorsza. Uwagi NISKIE z 28.10.2026 bez zmian i w backlogu (docs/21): tylna stopa pionowo na palcach w „w trakcie”, przednie palce przesuwają się w styku o 3,2 j. przy odbiciu.",
 "autor": "programista r2/figury-v1",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "slad": "arkusz śladu toru: scratchpad/figury-v1/recenzja/Lunges__hantle_/podglad.png (odświeżony po 64a8145); pomiar: scratchpad/aud/drag.mjs (old = new)",
 "poprzedniWerdykt": "wyswietlana",
 "poprzedniaRecenzja": "2026-10-28"
}
```

Uwaga do wpisów: pole `slad` jest nowe (w pliku żaden wpis go jeszcze nie ma) — test `tests/figury-recenzja.test.tsx` go nie wymaga ani nie blokuje; ścieżki scratchpad są lokalne dla sesji, przy zapisie do repo można je zastąpić opisem „arkusz PNG klatek, póz pośrednich i śladu toru (L-050), sesja 1.0.1”.
Reverse Lunge, Walking Lunges, Push Press — zostają „ukryta” do poprawki; poprawkę sprawdza test odtwarzający + verify (zasada audytów pkt 2), ale zmiana figury wymaga nowej niezależnej recenzji bramki 4 (L-047).

---

# Runda 2 (29.10.2026) — HEAD 1f599d6, zmiany `git diff ceb24fe 1f599d6`

Recenzent: audytor (sesja 1.0.1, niezależny). Drzewo czyste. `npx jest tests/figures.test.tsx tests/figury-podparcie.test.ts tests/figury-recenzja.test.tsx` — 115/115 zielone (w tym `test.failing` dla Reverse Lunge).
Korekta własnej rundy 1: nie sprawdziłem wtedy zakresu stawów (rom) i zatwierdziłem Incline Push Up z kostką 51,8° przy granicy 37°. Teraz zakres każdego stawu liczę dla 101 póz na przejście (`scratchpad/aud/rom.mjs`) wobec `rom` z `data/zrodla/figures.json` (= `lib/figures/data.json`), z tolerancją 0,5° i pominięciem rąk przy `armProj` jak w `tests/figures.test.tsx:63-75`. Sprawdziłem też ponownie figury zatwierdzone w rundzie 1.

## Zakres stawów (wszystkie pozy kluczowe i pośrednie)

| Figura | Wynik | Skrajne wartości |
|---|---|---|
| Incline Push Up | w zakresie | kostka −50,4…26,1 [−60; 37], łokieć 1,6…136,3 [0; 149], bark −50,5…34,5 [−53; 171] |
| Walking Lunges | w zakresie | kostka −51,7…36,6 [−60; 37], biodro −1,5…73,1, kolano 2,7…108,3 |
| Push Press | w zakresie (ręce `armProj` pominięte jak w strażniku) | biodro −5…15, kolano 0…25, kostka 0…10 |
| Step Up (zatw. r1) | w zakresie | kostka 0…37,4 (w tolerancji 0,5) |
| Lunges (hantle) (zatw. r1) | w zakresie | kostka −40,5…37,0 |

## Werdykty rundy 2

| Figura | Werdykt | Nie gorsza od 1.0? | Pomiar |
|---|---|---|---|
| Walking Lunges | ZATWIERDZONE | TAK (lepsza) | przy odbiciu tylne palce ≤ 1,7 j. przesunięcia zanim wzniosą się > 1,5 j. (było 8,1 j. w r1); stopa bliższa w miejscu (0 j.); po lądowaniu przednia stopa w styku w granicach 2 j. (42,4 → 42,9 → 40,9); koniec = lustro startu (tylne kolano 7,2 j. nad podłogą); tułów 83,4–94,9° (w tolerancji ± 8 karty); w 1.0 była pętla bez kroku drugą nogą (ŚREDNIE) i przednie palce ślizgały się 3,2 j. |
| Push Press | ZATWIERDZONE | w 1.0 ukryta | gryf ≥ 7,22 j. od środka głowy poniżej jej czubka (najbliżej mid→mid2 k = 0,99; strażnik OHP ≥ 7); gryf nie wysuwa się przed start o więcej niż 1,2 j. (x maks. −2,5 przy starcie −3,7); w końcu nad kostką (x −11,0); nogi prostują się przed wyciskaniem (kolano 0°, łokieć 113,8°) |
| Incline Push Up | DO POPRAWY (pomiar) | NIE jednoznacznie — dłonie lepiej, stopy gorzej | szczegóły w znalezisku R2-1 |

## Znaleziska rundy 2

| # | Poziom | Pewność | Figura | Opis | Kroki | Realność | Dowód |
|---|---|---|---|---|---|---|---|
| R2-1 | WYSOKIE (bramka 4: podpora sunie; figura nie może być wyświetlana w tej postaci) | 90% | Incline Push Up | Poprawka kostki zmieniła zakotwiczenie stóp `at` między pozami (−31,76 / −30,84 / −34,47), więc palce stóp — podpora — przesuwają się po podłodze o 3,6 j. w całym ruchu (x −34,47…−30,84). W 1.0 stopy stały w miejscu (0,0 j.), w rundzie 1 — 1,0 j. Precedens: Push Up — ślizg podpory 5,7 j. uznany za wadę, próg po poprawce 2,5 j.; nowy strażnik ślizgu stóp (Walking Lunges) ma próg 2 j. Dłonie są lepsze niż w 1.0 (ślizg 1,8 j. zamiast 3,2; 2,5–4,3 j. od krawędzi). Strażnik ogólny „punkt stały ≤ 3,5 j.” tego nie łapie, bo pomija punkty, które różnią się już w pozach kluczowych. | Incline Push Up → Technika → animacja (widać też w kadrach statycznych) | realny | `data/zrodla/figures.json` Incline Push Up `at` [−31.76,0] / [−30.84,0] / [−34.47,0]; `scratchpad/aud/rng.mjs`: HEAD toe x −34,47…−30,84 (rozrzut 3,63), wersja-1-0-1-r2 toe 0,00, ceb24fe 1,00; podgląd Incline_Push_Up/podglad.png (stopy w kadrach start / mid / end w innych miejscach) |
| R2-2 | NISKIE | 85% | test siatki 2×2 | Test (`tests/figures.test.tsx`, 723f78d) jest dobry: wstrzykuje Push Press 4-pozycyjny, „Ogranicz ruch”, sprawdza `row`+`wrap`, kolejność start/mid/mid2/end, podpisy „W trakcie 1/2”, brak samego „W trakcie”, `frameLabel` dla 3 i 4 pozycji, pętla > 5 s, sprzątanie w `finally`. Nie sprawdza szerokości komórki (`flexBasis 47%`) ani wysokości 120 — czyli tego, że w rzędzie mieszczą się dokładnie dwie klatki. Do backlogu. | — | brzegowy | `tests/figures.test.tsx` (test „cztery pozycje (Ogranicz ruch)…”) |
| R2-3 | NISKIE | 80% | Walking Lunges | Bez zmian względem rundy 1: druga połowa pętli ping-pong pokazuje krok w tył (nazwane uproszczenie, ograniczenie silnika). Przednia stopa po lądowaniu schodzi do 0,8 j. pod podłogę (niewidoczne pod kreską). | animacja | realny | `lib/figures/geom.ts:129-136`; `m.mjs` mid2>end 0,55–0,65 toe2 y −0,8 |

Propozycja do R2-1, do decyzji koordynatora:
- **Opcja A (rekomendowana):** w 1.0.1 przywrócić dane Incline Push Up z 1.0 (`wersja-1-0-1-r2`). Są w zakresie stawów (sprawdzone), stopy stoją w miejscu, a znana uwaga NISKA o dłoniach (3,2 j., ok. 7 j. od krawędzi) zostaje w backlogu. Wpis „wyswietlana” z 1.0 po przeliczeniu skrótu. Zero ryzyka.
- **Opcja B:** stałe `at` stóp (jak w 1.0, −30) i dobór `ft` w zakresie kostki dla każdej pozy, potem `sh`/`el` tak, by dłoń została na blacie. Strażnik: ślizg `toe` ≤ 2 j. (funkcja `slizg` z `tests/figury-podparcie.test.ts`) i nowa recenzja bramki 4.

## Gotowe wpisy do `docs/research/figury-recenzja.json`, sekcja `v1` (runda 2, HEAD 1f599d6)

```json
"Walking Lunges": {
 "rodzina": "lunge",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4, runda 2 (L-047, L-050): podgląd klatek i póz pośrednich, arkusz śladu toru, pomiar z lib/figures/geom.ts (101 póz na przejście), zakres stawów wobec rom we wszystkich pozach, karta lib/cues (lunge.dbSetup, lunge.walk, lunge.torso); raport recenzja-figury-v1-1-0-1.md",
 "sha": "fd687120c1be",
 "uwagi": "Poprawka 1.0.1 nie gorsza od 1.0 (lepsza): krok drugą nogą zgodnie z kartą (cztery pozycje: wykrok, wstawanie z przejściem tylnej nogi, krok postawiony, wykrok lustrzany do startu) — usuwa ŚREDNIE z 28.10.2026. Stopa bliższa w miejscu przez cały ruch (0 j.), tylne palce przy odbiciu ≤ 1,7 j. przesunięcia w styku (w rundzie 1 było 8,1 j.), przednia stopa po lądowaniu w granicach 2 j., tylne kolano ≤ 8 j. nad podłogą, wszystkie stawy w zakresie. NISKIE (backlog): druga połowa pętli ping-pong pokazuje krok w tył — ograniczenie silnika, nazwane uproszczenie.",
 "autor": "programista r2/figury-v1",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "slad": "arkusz PNG klatek kluczowych, póz pośrednich (0,25 / 0,5 / 0,75) i nałożonego śladu toru punktów (L-050) oraz pomiar punktów stóp, biodra i zakresu stawów z modułu geometrii aplikacji — sesja recenzji 1.0.1, runda 2",
 "poprzedniWerdykt": "wyswietlana",
 "poprzedniaRecenzja": "2026-10-28"
},
"Push Press": {
 "rodzina": "overhead_press",
 "werdykt": "wyswietlana",
 "data": "2026-10-29",
 "kto": "audytor (sesja 1.0.1, niezależny) — recenzja bramki 4, runda 2 (L-047, L-050): podgląd klatek i póz pośrednich, arkusz śladu toru, pomiar z lib/figures/geom.ts (201 póz na przejście), zakres stawów wobec rom, karta lib/cues (pp.setup, pp.move, pp.legs, pp.dip); raport recenzja-figury-v1-1-0-1.md",
 "sha": "1a6202fc3925",
 "uwagi": "Czwarta pozycja silnika (1.0.1): krótkie ugięcie (kolano 25°, tułów pionowo), potem wyprost nóg i bioder z gryfem nad barkami i zgiętymi rękami (kolano 0°, łokieć 113,8°), dopiero potem wyciskanie do wyprostu rąk — zgodnie z kartą „siła z nóg, ręce kończą ruch”. Gryf mija twarz w odległości ≥ 7,2 j. od środka głowy (ten sam próg co Overhead Press (sztanga)), nie wysuwa się przed pozycję startową o więcej niż 1,2 j., w pozycji końcowej nad kostką. Głębokość ugięcia ilustracyjna (nazwana w notatce).",
 "autor": "programista r2/figury-v1",
 "recenzent": "audytor (sesja 1.0.1, niezależny)",
 "slad": "arkusz PNG klatek kluczowych, póz pośrednich i nałożonego śladu toru gryfu (L-050) oraz pomiar odległości gryfu od głowy i toru dłoni z modułu geometrii aplikacji — sesja recenzji 1.0.1, runda 2"
}
```

Incline Push Up — bez wpisu „wyswietlana” w tej postaci (R2-1); zostaje „ukryta” (sha c04034595fcd) do czasu decyzji A albo B.
