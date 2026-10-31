# Weryfikacja znalezisk audytu ćwiczeń i grafik (31.10.2026)

Niezależny weryfikator (nie autor audytu ani poprawek). Stan: gałąź `audyt/cwiczenia-grafiki-2026-10-31` @ 3a55a795. Pomiar silnikiem v2 przez
`scripts/figures/v2-build.mjs` (loadV2 → figureSpec, frameAt, jointAngles), bez Jesta. Raportu audytu nie czytałem przed wyrobieniem zdania.

## Kluczowy fakt wspólny dla ACG-001 i ACG-003

Zestaw ogólny wskazówek jest pokazywany tylko, gdy ćwiczenie jest na liście `general` w `lib/cues/data.json` (aktualna recenzja treści, bramka 4):
`components/ExerciseCues.tsx:34` i `lib/figures/v2/ui.ts:24` (`generalCuesReviewed`), eksport strony `scripts/strona/eksport.mjs:147` (dodatkowo `figureShown`).
Pomiar: 538 ćwiczeń w trybie `general`, na liście `general` jest 71; **żadne** z 5 ćwiczeń ACG-001 ani **żadne** z 214 ćwiczeń ACG-003 nie jest na tej liście.
Dodatkowo rodzina `pull_up` ma status `ready`, ale `shownFigureSpec` zwraca null dla wszystkich 5 ćwiczeń (brak aktualnej recenzji ruchu; recenzję
„wyswietlana” mają tylko squat, bench_press, hinge). Dziś użytkownik nie widzi ani tych zdań, ani tych rysunków — w aplikacji i na stronie.

## ACG-001 — CZĘŚCIOWO (pewność 95%)

- Potwierdzone: `lpd.fullStretch` = „Na górze wyprostuj ręce do końca.” (`lib/cues/text/pl.json:185`, EN `en.json:185`) jest przypisane 5 ćwiczeniom
  (`lib/figures/v2/cue-sets.json:245, 385, 394, 530, 700`). Zdanie pasuje do ściągania drążka (pozycja górna = ręce proste), nie do podciągania.
- Pomiar zgięcia łokcia (prawa strona, 0° = prosty) i wysokości miednicy:
  Gironda 0° / miednica 116 (u=0) → 126° / 168 (u=1); Mixed Grip, One Arm, Side To Side 14–15° / 119 → 142–143° / 170.5; Wide-Grip Rear 22° / 134 → 145° / 186.
  Na górze łokieć zgięty 126–145°, ręce proste na dole. Zdanie przeczy rysunkowi.
- Nie potwierdzone: waga WYSOKIE. Błędne twierdzenie nie dociera dziś do użytkownika (bramka 4 j.w.), więc nie blokuje wydania. To defekt treści czekający
  za bramką: wyjdzie na ekran dopiero po wpisaniu zestawu do recenzji „zestawy” — wtedy recenzja powinna go złapać; strażnik CUE_REQUIRES
  (`lib/figures/v2/cueSets.ts`) nie ma warunku dla `lpd.fullStretch`, więc automat go nie zatrzyma.
- Waga wg weryfikatora: ŚREDNIE (dziś); stałoby się WYSOKIE (błędne twierdzenie merytoryczne) w chwili zatwierdzenia zestawu. Realność: teoretyczny dziś
  (brak drogi przez UI), realny po recenzji: Biblioteka → Gironda Sternum Chins → Technika → „Ogólne wskazówki dla tego ruchu”. Naprawa tania (zmiana id w JSON) — zalecana przed jakąkolwiek recenzją zestawów vpull.

## ACG-002 — CZĘŚCIOWO (pewność 90%)

- Lista `V2_WSPOLNE` (`scripts/zrodla-runtime.mjs:94`, kopia `scripts/strona/recenzja-figur.mjs:16`): common, variants, draw, scene, skeleton, math, anim, errors, figure.
- Rodziny dziś pokazywane (rigi squat/bench_press/hinge): klatki liczą rigi + common + skeleton + math (wszystkie w skrócie); `poseDataFor` zwraca null (brak poses/squat|bench_press|hinge.json),
  więc `contract.ts` (keyframeFrame, `figure.ts:73`) i `gear.ts` (importowany tylko przez contract) **nie** wpływają na te rodziny — ta część twierdzenia obalona dla stanu dzisiejszego.
- Potwierdzone, wpływają na obraz rodzin rigowych, a nie ma ich w skrócie:
  `muscles.ts` + `muscles.generated.ts` — `shapesAt(..., muscles=true)` zawsze w aplikacji (`components/ExerciseFigureV2.tsx:35`, `figure.ts:147`);
  `guides.ts` (guideShapes/trailShapes), `contacts.ts` → `colliders.ts` (contactShapes) — w tej samej liście kształtów `ExerciseFigureV2.tsx:35`;
  `render.ts` (boundsOf, kadr — `figure.ts:13`); `families.ts` (przypisanie ćwiczenia do rodziny, widoki `viewsOf`) i `poseData.ts` (ISOMETRIC, `figure.ts:35/24`).
- Dla rodzin z danych póz (gdy dostaną recenzję) skrót = plik JSON + lista wspólna, a całą interpretację klatek robi `contract.ts` (556 linii) — wtedy luka dotyczy samego ruchu.
- Waga: ŚREDNIE (osłabienie bramki recenzji, bez błędu widocznego dziś). Realność: teoretyczny dla użytkownika (wymaga zmiany kodu po recenzji); ryzyko procesu realne przy każdej zmianie muscles/guides/contacts.

## ACG-003 — CZĘŚCIOWO (pewność 95%)

- Liczby potwierdzone pomiarem: zestawy `general` używają 185 id zdań; 52 id nie ma w żadnym z 31 słowników bazowych poza PL/EN (bg, cs, da, de, el, es, et, fi, fr, hr, hu, id, it, ja, ko, lt, lv, ms, nb, nl, pt, ro, ru, sk, sl, sr, sv, tr, uk, vi, zh-Hant; es-419 i pt-BR dziedziczą — razem 33 języki);
  214 ćwiczeń ma co najmniej jedno takie id. W PL/EN brak 0.
- Zachowanie: `cueText` (`lib/cues/index.ts`, fallback `dict(l) → en → pl → id`) zwraca zdanie angielskie; filtr w `ExerciseCues.tsx:34` usuwa tylko surowe id,
  więc użytkownik zobaczyłby angielskie zdanie wśród zdań w swoim języku (nie „nic”). `cueTextGaps` (`lib/figures/v2/cueSets.ts`) sprawdza tylko rodziny `ready` i PL/EN — potwierdzone.
- Nie potwierdzone jako dzisiejszy objaw: żadne z 214 ćwiczeń nie jest na liście `general`, więc dziś nic z tego nie jest widoczne. Objaw pojawi się po recenzji zestawów.
- Waga: ŚREDNIE (zgadzam się). Realność: teoretyczny dziś; realny po recenzji zestawu (język telefonu np. niemiecki → ćwiczenie z zestawem ogólnym → Technika → zdanie po angielsku).

# Część 2 — ŚREDNIE z partii 3–4E (ACG-006, 008, 009, 010, 012, 013, 015, 019, 020), 31.10.2026 wieczorem

Dwóch niezależnych weryfikatorów (rola audytor, nie autor audytu ani poprawek; L-047), stan `audyt/cwiczenia-grafiki-2026-10-31` @ 1a09dbba, 1.0 = `v1.0.0-b1033`. Pomiary własne przed lekturą raportu (skrypty w scratchpadzie sesji, nie w repo).

## Podsumowanie

| ID | Werdykt | Waga wg weryfikatora | Realność | Widoczne w 1.0 | Naprawa (1.1) |
|---|---|---|---|---|---|
| ACG-006 | POTWIERDZONE (95%) | **WYSOKIE** (80%; raport: ŚREDNIE) | realny w 1.0; w 1.1 teoretyczny (ukrycie przypadkowe) | **TAK** | `data/zrodla/figures.json` klatka `end` + ostrzejsze `touch skull.depth`; tylko dane |
| ACG-008 | POTWIERDZONE (95%) | ŚREDNIE | teoretyczny | nie | `poses/core_floor.json` (`chwyt`); dane |
| ACG-009 | POTWIERDZONE (90%) | ŚREDNIE | teoretyczny | nie | `poses/core_floor.json` (kierunek kolana) + reguła walidacji L-E |
| ACG-010 | POTWIERDZONE (90%) | ŚREDNIE | teoretyczny | nie | `poses/delt_raise.json` + `cue-sets.json`; **badacz** (technika z jednej noty, szczebel 4) |
| ACG-012 | POTWIERDZONE (90%) | ŚREDNIE | teoretyczny (v1 w 1.0 w normie: 18° od pionu) | nie | `poses/curl.json` klatka u=1; dane |
| ACG-013 | POTWIERDZONE (97%) | ŚREDNIE (wyjdzie pierwsze: zestaw już na liście `general` z recenzją) | teoretyczny | nie | `poses/mobility_stand.json` — figura na stopniu; recenzja ruchu |
| ACG-015 | POTWIERDZONE (95%) | ŚREDNIE (po włączeniu plyo ≥ WYSOKIE — badacz) | teoretyczny | nie | `poses/plyo.json` (jeden hantel przy klatce), `cue-sets.json`, `data/zrodla/figury-sens.json`, `tests/figury-tresc-plyo-sanie.test.ts` |
| ACG-019 | POTWIERDZONE (92%) | ŚREDNIE; rozszerzenie 3 szrugsy — NISKIE (85%) | teoretyczny | nie | `poses/leg_isolation.json` (Seated Band); Slider — inny zestaw (`ht.rigid`, `gb.move`, nie `lcurl.still`); `poses/shrug.json` |
| ACG-020 | POTWIERDZONE (88%) | ŚREDNIE | teoretyczny | nie (karta Seated Calf Raise bez rysunku, tekst poprawny) | `poses/calf_raise.json` — podest pod przodostopiem |

**ACG-006 — ŚREDNIE czy WYSOKIE:** WYSOKIE. Precedens JM Press / Decline Close-Grip (docs/18, 28.10 ~21:10 UTC, zatwierdzone 29.10): rysunek przeczący wskazówce karty = błędne twierdzenie, bez argumentu bezpieczeństwa; skala porównywalna (gryf ok. 11–12 cm od czoła, ok. 6 cm za czubkiem głowy; karta trzykrotnie „nad czołem”/„w stronę czoła”). Widoczne w 1.0 (karta + figura v1). W 1.1 ukryte tylko dlatego, że zmiana brzmienia `skull.depth` unieważniła skrót recenzji (`scripts/zrodla-runtime.mjs:82–88`) — odświeżenie recenzji karty przed poprawką figury przywróci błąd. Recenzja v1 z 27.10 (`docs/research/figury-recenzja.json:488`) go nie złapała; `touch` przechodzi przy tolerancji 12 (wynik 10,28). Decyzja właściciela 31.10 (w 1.0 nic nie zmieniamy) — konflikt z progiem do rozstrzygnięcia przez właściciela (opcje w raporcie koordynatorowi).

Wspólne dla ACG-008…020: rodziny `planned`, w 1.1 `lib/figures/data.json` `v2: []` (`shownFigureSpec` = null), w tagach 1.0/1.0.1 brak plików póz; eksport strony bierze tylko rodziny `ready` z recenzją. Każde stałoby się WYSOKIE po włączeniu rodziny bez poprawki → naprawa przed recenzją rodziny.

## Szczegóły — weryfikator A

Weryfikator: audytor (nie autor raportu). Drzewa: 1.1 = worktree gałęzi audytu @ 1a09dbba; 1.0 = `git archive v1.0.0-b1033` (scratchpad `t10/`). Pomiary własne przed lekturą raportu: skrypty `wer-A/vis.mjs` (widoczność: `figureSpec`/`shownFigureSpec`/`figureWithheld`/`figureFor`/`hasTechnique`), `wer-A/skull.mjs` (v1: `framePoints`, `evalCheck`), `wer-A/m.mjs` i `wer-A/curl.mjs` (v2: `keyframeFrame` na `poses/<rodzina>.json`, `jointAngles`). TypeScript początkowo z scratchpadu (`nm/`, dowiązanie było puste); po naprawie dowiązania (→ `node_modules`) pomiary curl i Crunch powtórzone — wyniki identyczne.
Widoczność wspólna: w 1.1 `lib/figures/data.json` `v2: []` → `shownFigureSpec` = null dla każdej rodziny v2 (`lib/figures/v2/figure.ts:53`); `general` w `lib/cues/data.json` nie zawiera żadnego z ćwiczeń poniżej. W 1.0 `figureSpec` = null dla rodzin `planned` (poses nieładowane). Eksport strony (`scripts/strona/eksport.mjs:71,133`) bierze tylko figury v2 rodzin `ready` z recenzją i karty z `CUE_DATA` — figur v1 nie eksportuje.

## ACG-006 — POTWIERDZONE (pewność 95%)
- Pomiar v1 (1.0 i 1.1 identyczne, `data/zrodla/figures.json:5141`; 1.0: `:542`): pozycja końcowa `t 180, sh 100, el 105` → dłoń/gryf (−51,3; 39,3), głowa — środek (−41; 30), r 6,5 j. Gryf 10,3 j. od środka głowy w stronę czubka, 3,8 j. poza czubkiem (x −47,5) i 2,8 j. nad górną krawędzią głowy; talerz r 10 przy dłoni nachodzi na czubek. Skala (r głowy 6,5 j. ≈ 10 cm): gryf ok. 11–12 cm od czoła, ok. 6 cm za czubkiem. `touch skull.depth` przechodzi tylko dzięki tol 12 j. (v = 10,28) przy celu głowa + [0,10] — kryterium za luźne.
- Karta: `skull.setup` „trzymaj go nad czołem”, `skull.move` „w stronę czoła”, `skull.depth` „tuż nad czołem” (1.0 `lib/cues/text/pl.json`; 1.1 `:316`). Recenzja v1 (`docs/research/figury-recenzja.json:488`, 27.10, werdykt „wyswietlana”: „gryf opuszczany do czoła”) przeoczyła różnicę.
- Widoczność: 1.0 — TAK (karta + figura v1: `hasCues` true, `figureFor` ≠ null, `components/ExerciseCues.tsx:45`). 1.1 — ukryte, ale przypadkiem: zmiana brzmienia `skull.depth` dała `figuraSkrot` 2f246dfb6716 ≠ 6de63df3cc7d z recenzji → lista `hidden` (`scripts/zrodla-runtime.mjs:82–88`), znika cała karta i figura. Ponowna recenzja treści (rehash) przywróci tę samą figurę. Strona: nie (v1 nieeksportowane; karta w 1.1 ukryta).
- Waga: **WYSOKIE** (pewność 80%). Precedensy z docs/18 (integracja-1-1, ~672/682): JM Press 25 cm od wskazówki, Close Grip BP chwyt ±12 przy barkach ±19 (ok. 7 cm/stronę) — WYSOKIE jako „błędne twierdzenie”, bez argumentu bezpieczeństwa. Tu skala podobna (11–12 cm), też bez zagrożenia zdrowia (wariant „za głowę” istnieje, ramię 10° od pionu mieści się w „mniej więcej pionowo”), ale rysunek przeczy trzem zdaniom karty. Raportowa ocena ŚREDNIE jest niespójna z precedensem.
- Realność: realny w 1.0 — Biblioteka → Skullcrusher (EZ) → Technika › → animacja / pozycja końcowa. 1.1: teoretyczny dziś, realny po ponownej recenzji karty bez poprawki figury.
- Naprawa (1.1, wg decyzji właściciela 1.0 bez zmian): tylko dane — `data/zrodla/figures.json:5141` (klatka `end`: gryf nad czołem, np. ramię bliżej pionu/stóp) + zaostrzenie `touch` (cel = czoło, mniejsza tol) + test odtwarzający; recenzja niezależna (bramka 4). Badacz niepotrzebny (karta ma źródła). Warunek: nie odświeżać skrótu recenzji karty przed poprawką figury.

## ACG-008 — POTWIERDZONE (pewność 95%)
- Pomiar (`lib/figures/v2/poses/core_floor.json:5`): `chwyt` [13,3; 7; ±24] → [13,6; 4,5; ±24] (u 0→1) — dłonie przy biodrach (miednica x 0), łokieć 14–33° (ręce proste wzdłuż ciała); bark x −50/−42, głowa x −72/−61. Karta: `crunch.setup` „dłonie przy głowie”, `crunch.neck` „nie ciągnij głowy rękami” (`lib/cues/text/pl.json`).
- Widoczność: 1.0 i 1.1 — karta TAK, figura NIE (core_floor `planned`; v1 dla Crunch odrzucona: `data/zrodla/figures.json:6615`). Strona: figura nie.
- Waga: ŚREDNIE (nie dociera do użytkownika); warunek włączenia core_floor — bez poprawki byłoby WYSOKIE. Realność: teoretyczny dziś; realny po włączeniu rodziny (Biblioteka → Crunch → Technika ›).
- Naprawa: tylko dane (`core_floor.json:5`, `chwyt` przy głowie/skroniach w każdej klatce); badacz niepotrzebny.

## ACG-009 — POTWIERDZONE (pewność 90%)
- Pomiar u=0: Crunch/Sit Up/Janda/Oblique — kolano [12,1; 13,7; ±48,3] (13,7 cm nad podłogą, 48 cm od osi), kostka [35; 7; ±15], zgięcie kolana 129°; Frog Sit-Ups (wyróżnik: kolana na boki) — kolano [17,1; 8,4; ±46,9]. Różnica Crunch–Frog w odchyleniu kolana 1,4 cm. Sit Up/Janda u=1: kolano z ±45,1, y 25,2. Przy zgięciu 129° i stopach na podłodze kolano powinno być ok. 40+ cm nad podłogą. Wpisy `core_floor.json:5, 305, 535, 679` (Crunch, Janda, Oblique, Sit Up).
- Widoczność: 1.0 i 1.1 — nie (rodzina `planned`; Sit Up/Janda/Oblique bez karty i spoza `general` → bez sekcji „Technika”; Crunch — tylko karta). Strona: nie.
- Waga: ŚREDNIE (nie dociera; rysunek pokazałby ustawienie innego ćwiczenia przy karcie „kolana ugięte”) — warunek włączenia rodziny. Realność: teoretyczny dziś.
- Naprawa: tylko dane (kierunek kolana jak w ćwiczeniach rodziny z `biegunKolana`), plus reguła walidacji kolana w leżeniu; badacz niepotrzebny.

## ACG-010 — POTWIERDZONE (pewność 90%)
- Pomiar (`delt_raise.json:4427`): prawa ręka u=1 shSag 89,9°, shAbd 0° (czyste unoszenie przodem; klatki identyczne z Front Raise), lewa stale w dół (chwyt [6,7; 76,2; −24]); w górze łokieć y 139,4 < dłoń 147,5. Zestaw `raiseSide` (`cue-sets.json:9`): `lat.elbows` „Łokcie … na wysokości dłoni lub wyżej”, `lat.height`. Notatka biblioteki (`docs/research/25-biblioteka/L2.json`): ćwiczenie to para ruchów „w przód i bokiem” — rysunek pokazuje połowę, zestaw drugą połowę.
- Widoczność: 1.0 i 1.1 — nie (rodzina `planned`; brak na liście `general`, brak karty → bez sekcji). Strona: nie.
- Waga: ŚREDNIE (nie dociera); warunek włączenia delt_raise i zatwierdzenia zestawu. Realność: teoretyczny dziś.
- Naprawa: dane pozy (faza bokiem, cykl z lustrem/naprzemiennie) i dobór zestawu; **wymaga badacza** (docelowa technika z jednej noty katalogu — szczebel 4, jedno źródło; potrzebne drugie źródło).

## ACG-012 — POTWIERDZONE (pewność 90%)
- Pomiar v2 (`curl.json:5, 429, 2084`), u=1: zgięcie łokcia 135,2° / 135,1° / 133,8°, ramię 7,7–7,8° od pionu, przedramię **40,4° / 41,5° / 40,2°** przed pionem (chwyt x 23,8 przed łokciem x 2,6; dłoń 5,6 cm pod barkiem) — ruch kończy się za wcześnie. Karta: `curl.bbMove` „aż przedramiona będą pionowo”, `curl.hammerMove` „aż przedramię będzie pionowo”. Projekt sam mierzy to w v1 z tol 20° (`data/zrodla/figures.json:4652`). Te same pozy mają Biceps Curl (hantle) i Cable Curl, ale ich karty nie mówią „pionowo” — bez sprzeczności.
- Figura v1 (widoczna w 1.0 i 1.1): łokieć 148°, ramię 14°, przedramię 18° od pionu — w tolerancji, bez znaleziska.
- Widoczność v2: 1.0 i 1.1 — nie (rodzina `planned`, karty pokazują figurę v1). Strona: nie.
- Waga: ŚREDNIE (nie dociera); warunek włączenia rodziny curl (v2 zastąpi v1). Realność: teoretyczny dziś.
- Naprawa: tylko dane (`curl.json`, klatka u=1: zgięcie ok. 150–160° lub lekkie wysunięcie łokcia jak v1, przedramię ≤ 20° od pionu) + strażnik „karta a rysunek” (L-F); badacz niepotrzebny.

## Szczegóły — weryfikator B

Niezależny weryfikator (nie autor audytu). Drzewo `audyt/cwiczenia-grafiki-2026-10-31` @ 1a09dbba, tylko odczyt. Pomiar: kopia `scripts/figures/v2-build.mjs`
(typescript z /opt/node-tools, bo dowiązanie node_modules w worktree wskazuje na nieistniejący katalog), `keyframeFrame` na `poses/<rodzina>.json`, `jointAngles`
(0° = prosty). Skrypty: `scratchpad/wer-B/{m,k,vis}.mjs`. Raport przeczytany dopiero po pomiarze.

## Widoczność (wspólna dla wszystkich czterech)
- Rodziny mobility_stand, plyo, leg_isolation, calf_raise, shrug: `status: 'planned'` (`lib/figures/v2/families.ts:39,40,49,56,61`); `poseData.ts:14` ładuje tylko `pull_up.json`,
  więc `figureSpec` = null dla wszystkich 15 sprawdzonych ćwiczeń, `shownFigureSpec` = null, `figureWithheld` = false; `lib/figures/data.json` `v2: []`, figur v1 dla nich brak.
- Zestaw ogólny wymaga figury v2 pokazywanej (`components/ExerciseCues.tsx:34`, eksport `scripts/strona/eksport.mjs:147` + `figureShown`). Na liście `general`
  (`lib/cues/data.json`) jest tylko Standing Gastrocnemius Calf Stretch; reszta — nie.
- 1.0 (v1.0.0-b1033) i 1.0.1 (b1035): brak plików `poses/` tych rodzin, rodziny `planned`, lista `general` bez tych ćwiczeń — nic z tego nie widać w aplikacji ani na stronie.
- Jedyna widoczna rzecz: karta własna Seated Calf Raise (`calf.move`, `llc.control`) — bez rysunku (aplikacja i eksport `eksport.mjs:146`); sam tekst poprawny dla maszyny w siadzie.
- 1.1: widoczne dopiero po włączeniu rodziny (status, ładowanie danych w `poseData.ts`, recenzja ruchu w `figury-recenzja.json`). Dla ACG-013 bramka treści jest już otwarta (`general`), więc zestaw pokaże się automatycznie z pierwszą recenzją ruchu mobility_stand.

## ACG-013 — POTWIERDZONE (pewność 97%)
- `lib/figures/v2/poses/mobility_stand.json:603` jest identyczny z Wall Calf Stretch (`:758`) poza polem `cwiczenie` (porównanie JSON = równe). Sprzęt: podłoga + `sciana` x 75; brak stopnia/skrzyni.
- Pomiar (u 0 = u 1, poza statyczna): przednie kolano 42°, tylne 8°, tylna kostka 32° zgięcia grzbietowego, dłonie na ścianie [72; 132]; stopy na podłodze.
- Zestaw `cue-sets.json:625`: `gcalf.set` „…na krawędzi stopnia, pięta poza krawędzią” i `gcalf.move` „…opuść piętę poniżej krawędzi” (`lib/cues/text/pl.json:124–125`) przeczą rysunkowi; `gcalf.knee` (tylne kolano proste) i `gcalf.support` zgodne. Nota katalogu (`docs/research/equipment/catalog.json`): „Ball of the foot on the edge of a step…” — to rysunek jest błędny, nie zestaw.
- Waga: ŚREDNIE (dziś niewidoczne; rysunek pokazuje inny, bezpieczny wariant rozciągania). Uwaga: zestaw ma już werdykt „wyswietlana” (`docs/research/figury-recenzja.json:1992`), więc to najbliższy ujawnienia z czterech — w chwili włączenia mobility_stand byłoby widoczne bez dalszej recenzji treści.
- Realność: teoretyczny dziś; realny po włączeniu rodziny: Biblioteka → Standing Gastrocnemius Calf Stretch → Technika › → rysunek przy ścianie obok zdań o stopniu.
- Naprawa (1.1): nowe dane figury na stopniu (skrzynia/stopień w `sprzet`, pięta poniżej krawędzi, kolano proste) w `mobility_stand.json:603`; technika już ustalona źródłami (`docs/research/1-0-1-zrodla-2026-10-29.md`, recenzja 28.10) — badacz niepotrzebny, potrzebna recenzja ruchu figury.

## ACG-015 — POTWIERDZONE (pewność 95%)
- `lib/figures/v2/poses/plyo.json:15701`: `sprzet` z `hantel`, w klatce dwa obiekty `dumbbell` (chwyty R/L z = ±28). Chwyt: u 0 [8; 35] (przy ławce), u 0,385 [105; 158], u 0,641 [88,5; 271,7] (szczyt), u 1 [188; 126]; bark 138–140° (ręce nad głową) w u 0,5–0,6, łokieć 19–38°.
- Nota katalogu: „One dumbbell held at the chest, jump from seated on a bench onto a box.” (`docs/research/equipment/catalog.json:21540`). Rysunek przeczy nocie liczbą ciężarów i torem.
- Dodatkowo: recenzja treści dopasowała zestaw do błędnego rysunku — `data/zrodla/figury-sens.json:2993` („ręce trzymają hantle i zamachują nimi (rysunek) — reguła zamach_rak pominięta; zestaw zgodny z rysunkiem”), test to utrwala (`tests/figury-tresc-plyo-sanie.test.ts:22`). Naprawa musi zmienić też ten wpis i test.
- Waga: ŚREDNIE dziś (niewidoczne); po włączeniu rodziny rysunek + `jump.drive` „z zamachem rąk” (`pl.json:163`) przy ciężarze uczyłby innego wariantu niż w nocie — wtedy co najmniej WYSOKIE do rozstrzygnięcia przez badacza (ryzyko nieustalone źródłem).
- Realność: teoretyczny dziś; realny po włączeniu plyo: Biblioteka → Dumbbell Seated Box Jump → Technika › → animacja z hantlami nad głową w locie.
- Naprawa (1.1): dane figury (jeden hantel przy klatce przez cały ruch) w `plyo.json:15701`, zestaw `cue-sets.json:211` bez `jump.drive`, korekta `figury-sens.json:2993` i testu; badacz — potwierdzenie wariantu i ewentualnego zdania o rękach.

## ACG-019 — POTWIERDZONE (pewność 92%); rozszerzenie o szrugsy — POTWIERDZONE (85%)
- Slider Hamstring Curl (`leg_isolation.json:2485`, zestaw `bridge`, `cue-sets.json:570`): kolano 100° → 12°, biodro 28° → −16°, miednica stała y 20, kostka x 51 → 81.
  `ht.rigid` „Ruch tylko w biodrach…” (`pl.json:150`) przeczy rysunkowi (ruch głównie w kolanie). Uwaga: Slider nie ma `lcurl.still` — sprzeczne jest `ht.rigid`; także `gb.move` („Unieś biodra…”, `pl.json:120`) nie pasuje: miednica nie zmienia wysokości (y 20 przez cały ruch).
- Seated Band Hamstring Curl (`:2106`, zestaw `legCurl`, `cue-sets.json:502`): biodro 66° → 92°, kolano 10° → 91°, kolano-staw y 31 → 50 przy biodrze y 48 i tułowiu nieruchomym (lean 0) — udo obraca się o ok. 26°. `lcurl.still` „Uda i biodra nieruchomo…” (`pl.json:174`) przeczy; nota: „Seated on a bench, band anchored low…”.
- Szrugsy (`shrug.json:922, 1155, 1388`): łokieć 21 → 38° (Smith Behind the Back), 32 → 45° (Leverage, Calf-Machine), wobec `shrug.tall` „…pracują tylko barki” (`pl.json:315`). NISKIE — zgadzam się.
- Waga: ŚREDNIE (Slider, Seated Band), NISKIE (szrugsy); dziś niewidoczne. Realność: teoretyczny dziś; realny po włączeniu leg_isolation/shrug (Biblioteka → ćwiczenie → Technika ›).
- Naprawa (1.1): Seated Band — dane figury (udo na ławce, biodro stałe); Slider — przypisanie innego zestawu w `cue-sets.json:570` (uginanie nóg z biodrami w górze; zdanie nowe → rejestr twierdzeń/badacz do potwierdzenia brzmienia); szrugsy — stały łokieć w danych. Technika znana, badacz tylko przy nowym zdaniu.

## ACG-020 — POTWIERDZONE (pewność 88%)
- `calf_raise.json:3774, 4153, 4686, 5222`: u 0 pięta y 0 = palce y 0, kostka 0°; u 1 pięta 14–16, kostka −45°. Zakres tylko w zgięciu podeszwowym; brak podestu pod przodostopiem (skrzynia/ławka to siedzisko). Dla porównania stojące na stopniu: kostka +21°, pięta ok. 5 cm poniżej palców.
- `calf.move` „…opuść pięty, aż poczujesz rozciągnięcie łydek” (`pl.json:35`) i błąd `calf.mis.partial` (`:34`) przeczą rysunkowi. Noty: Barbell Seated i Dumbbell Seated One-Leg — „toes on a block”; Seated Calf Raise (hantle) — nota bez bloczka (sprzeczność tylko z tekstem); Seated Calf Raise — maszyna (podest w maszynie).
- Karta własna Seated Calf Raise jest widoczna w 1.0 i na stronie bez rysunku — sam tekst poprawny, więc nic sprzecznego dziś nie dociera.
- Waga: ŚREDNIE (dziś niewidoczne; nie niebezpieczne). Realność: teoretyczny dziś; realny po włączeniu calf_raise: Biblioteka → Seated Calf Raise → Technika › → stopy płasko na podłodze obok zdania o rozciągnięciu.
- Naprawa (1.1): dane figury — podest pod przodostopiem i kostka w dole ok. +15–20° (jak warianty stojące) w czterech wpisach `calf_raise.json`; badacz niepotrzebny (zdanie i nota zgodne), wymagana recenzja ruchu.
