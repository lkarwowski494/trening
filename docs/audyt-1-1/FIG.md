# Raport FIG — figury v2 i karty ćwiczeń (bramka 4), audyt 1.1 @ 79117f33

## Zakres i pokrycie
Przeczytano / uruchomiono (worktree <scratchpad>/wt-FIG @ 79117f33):
- `npm run check:figures-v2` → kod 0 („figury v2: aktualne”, schemat aktualny).
- `npm run check:pokrycie` → kod 0.
- `npm run check:claims` → kod 0 („61 wpisów, 42 tekstów dziedzinowych, rejestr zgodny”).
- `npx jest tests/figures-v2-tor.test.ts tests/l047-recenzja-niezalezna.test.ts --runInBand --ci` → kod 0 (2 zestawy, 212 testów).
- `npx jest tests/figury-recenzja.test.tsx tests/karty-recenzja.test.tsx tests/recenzja-wyjatki-1-1.test.ts --runInBand --ci` → kod 0 (60 zal., 1 pominięty).
- Źródło statusu: lib/figures/v2/families.ts:26-69 — 43 rodziny, 40 `ready`, 3 `planned` (cardio, foam_roll, neck).
- Recenzje: docs/research/figury-recenzja.json `v2` = 40 wpisów = 40 rodzin ready; każdy `werdykt: wyswietlana`, `slad` niepusty, autor ≠ recenzent; skróty `sha` równe bieżącym z `node scripts/zrodla-runtime.mjs --skroty` (0 niezgodności, 40/40).
- Bramka w aplikacji (fail-closed): lib/figures/v2/figure.ts:58-63 (`familyReviewed` z lib/figures/data.json `v2` = 40 rodzin; `shownFigureSpec` dodatkowo odrzuca V2_WSTRZYMANE, figure.ts:46-53, 6 ćwiczeń). Rodziny planned nie są w data.json → nie rysowane.
- Bramka strony: scripts/strona/eksport.mjs:72-74 i :134 — tylko rodziny ready z aktualną recenzją (recenzja-figur.mjs), bez V2_WSTRZYMANE; karty tylko z lib/cues/data.json i zrecenzowane zestawy (:145).
- Zakres strażników (plik:linia): L-047 — tests/l047-recenzja-niezalezna.test.ts:27-36 (wszystkie sekcje v1/v2/karty/zestawy, wpisy „wyswietlana” z datą ≥ 2026-10-28); ślad L-050 — tests/figures-v2-tor.test.ts:136-138 (tylko sekcja `.v2`, data ≥ 2026-10-29); geometria toru — tests/figures-v2-tor.test.ts:16-18 (rodziny ready, ćwiczenia z figureSpec, bez statycznych, widoki RODZINY).
- Pominięte przez L-047 (data < 28.10) wpisy „wyswietlana”: tylko 3 w v1 (Triceps Dips (ławka), Calf Press (leg press), Rowing Machine, 27.10.2026); v2/karty/zestawy — 0.
- Karty: lib/cues/data.json = 310 kart (209 nowych od v1.0.0-b1033, 7 zmienionych). Skrypt <scratchpad>/testy-FIG/zrodla-kart.py sprawdził każdą wskazówkę każdej wyświetlanej karty wobec data/zrodla/cues.json: 0 kart bez wpisu źródeł, 0 wskazówek bez źródła; 6 wskazówek „Czego unikać” z jednym źródłem szczebla 4/5 (One-Arm Incline Lateral Raise, Barbell Front Raise to Overhead, Car Drivers ×2) albo z pseudoźródłem „wniosek” (Incline Chest Fly (hantle), Decline Push Up) — zgodne z wyjątkiem „Etap 2” CLAUDE.md („Czego unikać — wnioskowane z tego ruchu”), nie znalezisko.
- Rejestr twierdzeń: scripts/claims.mjs:22 skanuje tylko słownik interfejsu lib/i18n.en.ts; teksty kart (lib/cues/text/*.json) mają rejestr źródeł data/zrodla/cues.json + recenzję w „karty” — taki jest projekt, nie luka.
- Próbka rysunek ↔ karta (arkusze śladu, Playwright): Power Clean, Upright Row (hantle), Skullcrusher (hantle), Barbell Step Up, Hanging Leg Raise, Single Leg Hip Thrust, Kettlebell Windmill, Decline Push Up, Arnold Press (9 z figurą) + Meadows Row, Atlas Stones, Zottman Curl (karty bez figury v2 — sama karta). Obejrzane w pełni: Power Clean, Kettlebell Windmill (przód), Skullcrusher, Arnold Press (przód), Upright Row (bok), Barbell Step Up, Hanging Leg Raise. Pozostałe wyrenderowane, nie obejrzane kadr po kadrze.
- Przegląd sprzętu (nazwa vs `impl` wariantu) dla 87 z 529 rysowanych ćwiczeń, które mają pole impl (<scratchpad>/testy-FIG/sprzet2.cjs): 11 „niezgodności” to warianty z gumami/Smith, gdzie gryf jest rysowany, a guma/prowadnica jest flagą (variants.ts:77 `smith: true`) — bez błędu typu „Deadlift (hantle)”. 442 ćwiczeń z danych póz (inne pola) nie objęto tym przeglądem.
- Pokrycie: <scratchpad>/testy-FIG/obowiazkowe.mjs na docs/research/pokrycie-1-1-obowiazkowe.json (51): 39 pełnych, 8 z listy `poza11` (1.2, decyzja 09.11), 4 bez ról mięśni (Dead Bug, Hollow Hold, Bird Dog, Medicine Ball Slam). docs/55:48 „pełna karta 523 (cel) | 447 (stan) | 76” — śledzone w docs/49 W-01 („w toku”), więc nie jest to znalezisko.

Nie przeczytano: treść raportów recenzentów w docs/research/recenzje/*.md (227 plików), przekłady kart w 33 językach, rysunki v1 (brak skryptu renderującego v1 w scripts/figures), pozostałe ~500 rysunków.

## Znaleziska

### FIG-01 — Triceps Dips (ławka): decyzja mówi „bez rysunku”, a aplikacja pokazuje rysunek v1 — ŚREDNIE, realny
- Kroki: Biblioteka → Triceps Dips (ławka) → Technika ▸ → widać rysunek (v1, z boku).
- Dowód: docs/18-przekazanie.md:368 „**Triceps Dips (ławka) wstrzymane w aplikacji** (`V2_WSTRZYMANE`, ćwiczenie bez rysunku …)”. components/ExerciseCues.tsx:45 `v2 ? <ExerciseFigureV2/> : key && figureWithheld(key) ? null : <ExerciseFigure exercise={exercise} />`; figure.ts:70 `figureWithheld` wymaga, żeby v1 był w `replaced`, a figury-recenzja.json v1 „Triceps Dips (ławka)” ma `werdykt: wyswietlana`, data 2026-10-27 (nie „zastapiona”); lib/figures/data.json ma ten klucz w `exercises`, a nie w `replaced`. Licznik scripts/pokrycie-katalogu.mjs zgłasza `figura.v1 = 3` (Triceps Dips (ławka), Calf Press (leg press), Rowing Machine) — <scratchpad>/testy-FIG/v1-pokazywane.mjs.
- Dlaczego nie blokuje: ten sam rysunek v1 był w 1.0 (App Store) i przeszedł recenzję bramki 4 27.10 (agent spoza autorów; poprawione pięty/biodra). Wada W5 v2 dotyczy toru łokcia w widoku z przodu, a v1 jest tylko z boku (pozy end: el 90, sh −52 — w granicach). Rozbieżność dotyczy zapisu decyzji i bramki, nie wiadomo o błędnym ruchu.
- Mechanizm: każde ćwiczenie z V2_WSTRZYMANE, które ma v1 „wyswietlana”, wraca do v1. Dziś to jedyne takie ćwiczenie z 6 wstrzymanych (pozostałe nie mają v1 w `exercises`; v1-pokazywane.mjs wypisuje tylko 3 v1, a z nich tylko to jest w V2_WSTRZYMANE).
- Naprawa (decyzja koordynatora): (a) v1 → `zastapiona` (rysunek znika, zgodnie z docs/18) albo (b) poprawić docs/18 („zostaje rysunek v1 z 1.0”) i dodać recenzję v1 z arkuszem śladu. Test akceptacyjny: test w tests/figures-v2-wstrzymane.test.ts — dla każdego klucza V2_WSTRZYMANE `figureWithheld(key) || !figureByKey(key)` (wariant a) albo jawna lista wyjątków z powodem (wariant b).

### FIG-02 — 3 rysunki v1 w wydaniu bez arkusza śladu i bez pól autor/recenzent — NISKIE, realny (proces)
- Dowód: wpisy v1 dla Triceps Dips (ławka), Calf Press (leg press), Rowing Machine: `data 2026-10-27`, brak `autor`/`recenzent`/`slad`. Strażnik śladu czyta tylko `.v2` (tests/figures-v2-tor.test.ts:136), a L-047 pomija daty < 2026-10-28 (tests/l047-recenzja-niezalezna.test.ts:30). Rowing Machine należy do rodziny `cardio` (planned), a rysunek pokazuje się przez v1.
- CLAUDE.md wymaga dogłębnej recenzji „także rodzin uznanych wcześniej za gotowe” z arkuszem śladu (L-050). Formalnie reguła `slad` jest przypięta do wpisów v2, więc to luka zakresu strażnika, a nie złamanie testu.
- Naprawa: recenzja śladu 3 rysunków v1 albo ukrycie ich (`zastapiona`), a strażnik L-050 rozszerzyć na wpisy v1 „wyswietlana” pokazywane w aplikacji (FIG_DATA.exercises bez v2). Test: lista v1 pokazywanych ⊆ wpisy ze `slad`.

### FIG-03 — Strażnik geometrii toru nie obejmuje widoków ustawionych na poziomie ćwiczenia — NISKIE, brzegowy
- Dowód: tests/figures-v2-tor.test.ts:18 `FAMILIES.find(f => f.id === fam)!.views` zamiast `viewsOf(k, fam)` (families.ts:59-62). Wall Ball ma w aplikacji widoki ['side','front'] (EXERCISE_VIEWS, families.ts:53), a rodzina sled_throw ma tylko 'side', więc widok z przodu Wall Ball nie jest sprawdzany przez ten test (sprawdzone w runtime: `shownFigureSpec('Wall Ball').views = side,front`).
- Naprawa: użyć `figureSpec(k).views`. Test: przypadek „Wall Ball|front” jest w CASES.

## Do sprawdzenia (pewność ≤ 80%)
- Skullcrusher (hantle): w najniższej pozycji (u = 0) hantle są na wysokości czubka głowy, lekko za nim; karta mówi „Opuszczaj, aż dłonie będą tuż nad czołem” (skull.depthFree). Kadr: <scratchpad>/zrzuty-FIG/skull-u0-kadr.png (pełna rozdzielczość). Recenzja z 04.11 przyjęła „nad czołem ≈ ear level”. To raczej rozjazd kosmetyczny; prośba o potwierdzenie przez recenzenta ruchu.
- Upright Row (hantle): na górze (u = 1) łokcie są na wysokości barków, a hantle mniej więcej w połowie klatki — karta: „mniej więcej do wysokości barków”. Kierunkowo zgodne („łokcie prowadzą”, „łokieć nad przedramieniem”); <scratchpad>/zrzuty-FIG/Upright-Row-hantle-side.png.
- Arnold Press (przód): łokcie rozchodzą się, a hantle obracają w u 0–0,35, kiedy przebyta jest dopiero ok. 1/3 wysokości; karta: „Obracaj i wyciskaj naraz”. Raczej jednocześnie, z obrotem na prowadzeniu; <scratchpad>/zrzuty-FIG/Arnold-Press-front.png.
- Hanging Leg Raise: pionowy słupek stojaka biegnie przez sylwetkę w widoku z boku (konwencja rysunku stojaka?) — <scratchpad>/zrzuty-FIG/Hanging-Leg-Raise-side.png.
- L-047 porównuje autora i recenzenta jako napisy z nazwą roli („programista A1” ≠ „badacz-merytoryczny”); strażnik nie dowodzi, że to różne sesje — tak jest zaprojektowany, odnotowane jako ograniczenie.

## Co działa dobrze
- Bramka 4 jest fail-closed w trzech miejscach (data.json z aktualnym skrótem, shownFigureSpec, eksport strony) i wszystkie 40 rodzin ready ma aktualną recenzję ze śladem — 0 rozjazdów skrótów.
- 310 wyświetlanych kart: każda wskazówka ma wpis źródeł; wyjątki „jedno źródło”/„praktyka” są zgodne z regułami CLAUDE.md.
- Obejrzane próbki: Power Clean (start z podłogi, wyprost, łokcie pod gryf, przyjęcie powyżej równoległej; tor gryfu blisko ciała), Kettlebell Windmill (biodra w stronę ręki z ciężarem, wolna dłoń po wewnętrznej stronie przeciwnej nogi, nogi prawie proste), Barbell Step Up, Hanging Leg Raise (proste nogi do poziomu) — tekst zgodny z rysunkiem, właściwy sprzęt, nieodwrócony kierunek.
- Wstrzymania (V2_WSTRZYMANE) mają powód i ID backlogu.

## Nie sprawdzono
- Rysunki v1 (brak renderera v1 w scripts/figures; ocena tylko z danych póz).
- Pozostałe ~520 rysunków v2 i ~300 kart poza próbką; przekłady kart; raporty recenzentów *.md.
- Wygląd na urządzeniu (animacja, VoiceOver) — symulator/telefon.
- Eksport strony nie był uruchomiony na sucho (`node scripts/strona/eksport.mjs --out …`); bramkę sprawdzono tylko w kodzie.

Testy robocze: <scratchpad>/testy-FIG/ (zrodla-kart.py, karta.py, obowiazkowe.mjs, sprzet.mjs, sprzet2.cjs, v1-pokazywane.mjs). Zrzuty: <scratchpad>/zrzuty-FIG/*.png (14 arkuszy + skull-u0-kadr.png).
