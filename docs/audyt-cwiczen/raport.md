# Raport audytu ćwiczeń i grafik — 31.10.2026 (stan `integracja-1-1` @ 46a8f1cc; partie 1–2 z 5)

Audytor niezależny (nie pisał figur ani kart). Zakres tej sesji: inwentarz całości i pełna ocena 4 rodzin `ready` (100 ćwiczeń, 98 z figurą). Partie 3–5 (widoczne w 1.0 poza 4 rodzinami, rodziny `planned`, reszta kart i zestawów) — w `STAN.md`. Znaleziska ŚREDNIE i wyższe czekają na weryfikację przez drugiego, niezależnego agenta (zleca koordynator) — do tego czasu status „do weryfikacji”.

## 1. Podsumowanie dla właściciela

- **1.0 nic nie blokuje** z tego, co sprawdziłem: wszystkie znaleziska dotyczą 1.1 (rodzina pull_up i zestawy rodzin, które w 1.0 nie są pokazywane) albo procesu.
- **1.1 dziś nie pokazuje żadnej figury v2** (0 z 98): wszystkie 4 rodziny są ukryte, bo pliki wspólne zmieniły się po recenzji 1.0.1. Mechanizm działa tak, jak powinien.
- **Squat, bench_press, hinge (87):** 62 rysunki są identyczne z wersją zrecenzowaną w 1.0.1. 25 różni się drobno: 16 tylko błędem „pięty” z przodu, 8 sprzętem albo stopą z przodu lub z góry, a 1 (Smith SLDL) torem gryfu. W pomiarach nie znalazłem wady ruchu. Do powrotu wystarczy jedna ponowna recenzja tych 25 z arkuszami i nowe skróty.
- **Pull_up (11 figur):** ruch w pomiarach bez wady, ale rodzina nigdy nie przeszła bramki 4. Potrzebna pierwsza recenzja. 5 zestawów wskazówek mówi „na górze wyprostuj ręce”, co przy podciąganiu jest odwrotnie — do poprawy przed pokazaniem.
- **Gotowe do pokazania po recenzji (bez poprawek): 92 z 98.** Wymaga poprawek: 6 (5 zestawów pull_up i 1 przekład).
- **Zestawy ogólne (538):** 71 ma aktualną recenzję treści; w 4 rodzinach 73 z 78 pasuje do ćwiczenia. 467 zestawów rodzin `planned` nie oceniłem (następna partia). 214 z nich ma teksty tylko po polsku i angielsku.
- **Trzy największe ryzyka:** (1) skrót recenzji nie obejmuje części plików, które zmieniają rysunek (interpolacja póz, ślad toru, styki, mięśnie), więc rysunek może się zmienić po recenzji bez sygnału — ACG-002; (2) zestawy ogólne przypisywane po rodzinie słownika mogą przeczyć ruchowi (ACG-001), a strażnik tego nie łapie; (3) 214 ćwiczeń z planu 1.1 i strony w 33 językach pokaże angielskie zdania (ACG-003).

## 2. Tabela rodzin (partia 2)

| Rodzina | Status | Ćw. / figur | Rysunek vs 1.0.1 | Werdykt ruchu | Werdykt treści | K / W / Ś / N | Może być `ready` i eksportowana |
|---|---|---|---|---|---|---|---|
| squat | ready (ukryta) | 25 / 25 | 5 identycznych, 16 tylko „pięty” z przodu, 4 skrzynia z przodu | bez wady w pomiarach; otwarte OP-1 (Barbell Hack) | ok (5 kart, 20 zestawów z recenzją) | 0 / 0 / 0 / 0 | tak — po ponownej recenzji 20 zmienionych i nowym skrócie |
| bench_press | ready (ukryta) | 30 / 30 | 29 identycznych, 1 kettlebell z góry | bez wady | ok (5 kart, 25 zestawów) | 0 / 0 / 0 / 0 | tak — po recenzji 1 zmienionego i nowym skrócie |
| hinge | ready (ukryta) | 32 / 32 | 28 identycznych, 4 zmienione (Smith SLDL ruch, Deficit podest, SL RDL ×2 stopa) | bez wady | ok (7 kart, 25 zestawów) | 0 / 0 / 0 / 0 | tak — po recenzji 4 zmienionych i nowym skrócie |
| pull_up | ready (ukryta, bez wpisu v2) | 13 / 11 | brak recenzji | bez wady w pomiarach; ACG-005 | 3 karty ok; zestawy: 5 × ACG-001, ACG-003, ACG-004 | 0 / 1 / 1* / 2 | nie — najpierw pierwsza recenzja ruchu i poprawka zestawów |
| (przekrojowe) | — | — | — | — | — | 0 / 0 / 1 (ACG-002) / 0 | — |

\* ACG-003 liczony raz (dotyczy też rodzin `planned`).

Razem: **KRYTYCZNE 0, WYSOKIE 1, ŚREDNIE 2, NISKIE 2.**

## 3. Znaleziska

### ACG-001 — zestaw „vpull” w podciąganiu: „Na górze wyprostuj ręce do końca”
- **Ćwiczenia:** Gironda Sternum Chins, Mixed Grip Chin, One Arm Chin-Up, Side To Side Chins, Wide-Grip Rear Pull-Up (pull_up). **Perspektywa:** karta a rysunek; podstawy merytoryczne.
- **Waga:** WYSOKIE (błędne twierdzenie techniczne sprzeczne z rysunkiem). **Pewność:** 90%. **Widoczne w 1.0:** nie. **Wersja:** 1.1.
- **Realność:** dziś teoretyczny (zestawy pull_up bez recenzji → lista `general` ich nie ma, `lib/cues/index.ts:71`); realny, gdy rodzina pull_up wróci zgodnie z celem 1.1 (A) i zestaw zostanie zatwierdzony: Biblioteka → np. „One Arm Chin-Up” → sekcja Technika → „Ogólne wskazówki dla tego ruchu”.
- **Dowód:** `lib/figures/v2/cue-sets.json:245, 385, 394, 530, 700` (ok zawiera `lpd.fullStretch`); `lib/cues/text/pl.json:185` „Na górze wyprostuj ręce do końca.” — zdanie z ściągania drążka (na wyciągu ręce proste są w pozycji górnej). Figura: u = 0 zwis, łokieć 14°; u = 1 broda 3 cm nad drążkiem, łokieć 142° (pomiar `frameAt`, Pull Up/Chin Up/One Arm Chin-Up). Karty własne tej rodziny mówią odwrotnie: `pu.pull` „opuść się do pełnego wyprostu rąk”.

### ACG-002 — skrót recenzji rodziny nie obejmuje plików, które zmieniają rysunek
- **Zakres:** wszystkie rodziny v2 (rig i dane). **Perspektywa:** technika i jakość kodu figur; luki procesu.
- **Waga:** ŚREDNIE (obejście bramki 4; nie powoduje dziś wady widocznej). **Pewność:** 90%. **Widoczne w 1.0:** nie (1.0 ma starszy mechanizm). **Wersja:** 1.1 i strona.
- **Realność:** brzegowy: zmiana któregoś z pominiętych plików po recenzji zmienia rysunek w aplikacji i na stronie bez unieważnienia wpisu.
- **Dowód:** `scripts/zrodla-runtime.mjs:94` `V2_WSPOLNE` = common, variants, draw, scene, skeleton, math, anim, errors, figure. Poza listą zostają pliki, które aplikacja rysuje albo z których liczy pozę:
  - `contract.ts` (interpolacja póz rodzin z danymi, `figure.ts:73` `keyframeFrame`) i `gear.ts` (sprzęt z danych);
  - `guides.ts` (ślad toru) i `contacts.ts`/`colliders.ts` (styki) — oba rysowane w `components/ExerciseFigureV2.tsx:29,35`;
  - `muscles.ts`/`muscles.generated.ts` (podświetlenie mięśni, `shapesAt(..., true)`), `poseData.ts`, `overheadException.ts`, `render.ts`.
  - Od e796c7ed zmieniły się contract.ts (+351/−?), guides.ts (groty na końcach śladu) i muscles.generated.ts (Child's Pose). Gdyby nie zmiana plików z listy, rysunek ze zmienionym śladem byłby pokazany jako zrecenzowany.
  - `scripts/strona/recenzja-figur.mjs:15` ma tę samą listę, więc luka obejmuje też stronę.

### ACG-003 — zestawy ogólne bez przekładu na 33 języki
- **Zakres:** 214 ćwiczeń (zestawy ogólne rodzin `planned` + Gorilla Chin/Crunch). Najwięcej: mobility_stand 35, plyo 26, mobility_floor 21, olympic 18, overhead_press 12, kb_ballistic 11, foam_roll 10. 52 id zdań (np. `ohp.mis.lock`, `ur.elbows`, `hang.slow`, `oly.*`, `st.*`, `smr.*`). **Perspektywa:** lokalizacja.
- **Waga:** ŚREDNIE. **Pewność:** 95%. **Widoczne w 1.0:** nie (zestawy pokazywane tylko przy figurze v2 rodzin `ready`). **Wersja:** 1.1 i strona (35 języków).
- **Realność:** realny po włączeniu rodzin z celu 1.1: język np. niemiecki → ćwiczenie „Push Press” → wskazówki po angielsku (`lib/cues/index.ts:55`, rezerwa en).
- **Dowód:** pomiar audytora (każdy język z `LANGS` wobec `lib/cues/text/<l>.json`, nakładki es-419/pt-BR jak `lib/cues/index.ts:47`); strażnik `cueTextGaps` (`lib/figures/v2/cueSets.ts:62`) sprawdza tylko rodziny `ready` i tylko PL/EN.

### ACG-004 — Dead Hang: „Chwyć uchwyty…”
- **Waga:** NISKIE. **Pewność:** 85%. **Widoczne w 1.0:** nie. **Wersja:** 1.1. **Realność:** realny po włączeniu pull_up.
- **Dowód:** `lib/figures/v2/cue-sets.json:167` → `npu.hang` (`lib/cues/text/pl.json:213`): zdanie z „Neutral Grip Pull Up” (uchwyty równoległe), a figura Dead Hang wisi na drążku (`poses/pull_up.json`, sprzęt „sztanga” y 230).

### ACG-005 — Side To Side Chins przesuwa się tylko w jedną stronę
- **Waga:** NISKIE. **Pewność:** 85%. **Widoczne w 1.0:** nie. **Wersja:** 1.1. **Realność:** realny po włączeniu pull_up (widok z przodu).
- **Dowód:** głowa/barki z = 0 → 5 → 10 cm (u 0 → 0,5 → 1), pętla wahadło wraca do środka; strona lewa nie występuje. Nazwa ćwiczenia mówi „na zmianę w obie strony”; brak oznaczenia „uproszczenie”.

## 4. Luki procesu

| Luka | Co przepuściło | Mechanizm zamykający |
|---|---|---|
| L-A (ACG-002) | `V2_WSPOLNE` zawiera tylko część modułów, z których liczy się rysunek | test: skrót rodziny = zamknięcie importów `figure.ts`, `ExerciseFigureV2.tsx` i plików sprzętu (graf importów liczony w teście, nie lista ręczna); test czerwony, gdy plik importowany przez figurę nie jest w skrócie |
| L-B (ACG-001) | zestaw przypisany po rodzinie słownika badacza (`f: vpull`) obejmuje wyciąg i podciąganie, a zdania „na górze/na dole” zależą od kierunku ruchu | reguła w `tests/`: zdania z kierunkiem (`lpd.*`) zakazane w rodzinie pull_up (lista dozwolonych id per rodzina figury) + krok listy bramki 4: „zestaw ogólny czytany przy figurze, nie przy nazwie wzorca” |
| L-C (ACG-003) | `cueTextGaps` liczy tylko rodziny `ready` i PL/EN | strażnik: każda wskazówka ćwiczenia z celu wydania (lista z decyzji pokrycia 1.1) ma tekst w 35 językach; uruchamiany przed zmianą statusu rodziny na `ready` |
| L-D | rodzina `pull_up` ma status `ready` bez wpisu recenzji v2 (fail-closed ją ukrywa, ale status mówi „gotowa”) | test: status `ready` wymaga wpisu v2 w `figury-recenzja.json` albo jawnego wpisu „czeka na recenzję” |

## 5. Zadania — `zadania.md`

## 6. Decyzje dla właściciela

**D-1. Kolejność powrotu rodzin w 1.1.**
- (a) Najpierw squat, bench_press i hinge: jedna ponowna recenzja 25 zmienionych rysunków, nowe skróty, 87 figur wraca szybko. Pull_up później, po pierwszej recenzji i poprawce zestawów.
- (b) Wszystkie 4 rodziny naraz: jeden termin, ale czeka się na pull_up.
- **Rekomendacja: (a).** 87 figur jest gotowych; pull_up nie powinien ich blokować.

**D-2. Zestawy ogólne bez przekładu (214) w 1.1.**
- (a) Przekład 52 zdań przed włączeniem rodzin (tłumacz + recenzent lokalizacji).
- (b) Włączać rodziny tylko z kompletem języków; reszta czeka.
- **Rekomendacja: (a).** To tylko 52 zdania, a strona startuje w 35 językach.

## 7. Otwarte pytania

- **OP-1 Barbell Hack Squat:** na dole gryf jest 22 cm za piętą, pod pośladkami, a ręce odchylone ok. 37° w tył (`frameAt` u = 1: chwyt x −27,9, pięta −5,8). Recenzja 1.0.1 uznała wyjątek toru za „uzasadniony torem bioder”. Nie mam przeczytanego źródła, gdzie gryf jest na dole: przy łydkach czy przy pośladkach. Do sprawdzenia przez badacza (2 źródła szczebla 4).
- **OP-2 Pin Press i Good Morning off Pins:** figura zaczyna od góry („Opuszczanie”), a nazwa sugeruje start z podpór. Wymaga źródła, czy to konwencja pętli.
- **OP-3 Barbell Guillotine Bench Press** (gryf do szyi): nie sprawdziłem, czy decyzje w docs/18 wymagają ostrzeżenia przy tym ćwiczeniu.
- Arkusze PNG z nałożonym śladem (L-050) nie zostały wygenerowane w tej sesji. Ocena wizualna zasłaniania (skrzynia, podest) należy do recenzji z D-1.

## Aneks: obalone przy sprawdzaniu (jedno zdanie każde)

- Deadlift (hantle) z ciężarem przed stopami: tor −1,7…+0,1 cm od śródstopia, wada usunięta.
- Belt squat z ciężarem 23 cm za stopą: tym punktem jest miednica, nie gryf, więc to poprawne.
- Pull Up/Chin Up z identycznym obrotem przedramienia: z boku nie da się tego zmierzyć, nie zgłaszam.
- Good Morning płytko (tułów 42°): karta mówi „nie dalej niż do poziomu” (`gm.depth`), więc rysunek jest zgodny.
