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
