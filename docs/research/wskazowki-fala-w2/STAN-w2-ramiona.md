# Stan — fala W2, grupa G7 (ramiona i wykroki), 02.11.2026

Gałąź `badania/w2-ramiona` (od `integracja-1-1` @ 2dc54e2). Tylko dane badań — bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach.
Podstawa: W1 po przeliczeniu szczebli (`origin/badania/lokalne-0211` @ 379a7d3), szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` (ta sama gałąź).
Wszystkie wyniki to raporty badaczy (agenci `badacz-merytoryczny`, WebFetch 02.11.2026) — przed wdrożeniem recenzja niezależna (L-047).

## Verify bazy

Pełne `npm run verify` na czystej bazie 2dc54e2 — zielone (znacznik pełny, drzewo 8063b655e26c). Commity z dokumentami: `npm run verify:docs` zielone przed każdym wypchnięciem.

## Wynik na rodzinę

| Rodzina | Plik | Ćwiczeń w zakresie | Karty własne z błędami | Bez błędów | Częściowe | Otwarte | Nowe zdania | Role (gotowe / otwarte) |
|---|---|---|---|---|---|---|---|---|
| curl | `curl-cz1.md` | 14 | 11 (w tym Bayesian warunkowo) | 2 | — | 0 | 9 (+ zmiana `spider.setup`) | 6 / 0 |
| curl | `curl-cz2.md` | 30 | 13 | 4 | 3 warunkowe | 10 | 7 (+ 3 warunkowe) | (jw.) |
| delt_raise | `delt_raise-cz1.md` | 18 (4 oddane cz. 2) | 13 | 0 | — | 1 | 9 | 15 / 7 (+ 7 jedno źródło, 3 uproszczenie) |
| delt_raise | `delt_raise-cz2.md` | 17 | 2 warunkowo (Kettlebell Halo, Band Lateral Raise) | 0 | 2 | 13 | 9 (5 z W1 + 4) + 1 propozycja | (jw.) |
| triceps | `triceps.md` | 28 (+4 KARTA) | 11 (W1: 1) | 0 | — | 17 | 9 | 0 / 0 (Body-Up — uproszczenie, jedno źródło, bez wyświetlania) |
| lunge | `lunge.md` | 22 (19 W1 + 3 partial) | 6 + 3 partial z błędem | 1 warunkowo (Curtsy) | — | 12 | 5 | brak wierszy |

Role mięśni: `docs/research/role-miesni-fala-w2/` (curl, delt_raise, triceps, lunge). Nowe funkcje: `forearms.elbow_flex`, `upper_back.scap_elev_rot`, `upper_back.scap_upward_rot` (dwa źródła), `front_delt.abd_assist` (jedno źródło).

## Pułapki przy integracji (WAŻNE)

1. **curl cz. 1 i cz. 2 nakładają się w 10 ćwiczeniach** (błąd podziału koordynatora G7: tabela W1 `curl.md` zawiera też ćwiczenia z `curl-2.md`; nie sprawdziłem rozłączności przed zleceniem). Wspólne: Preacher Curl (EZ), One Arm Dumbbell Preacher Curl, Concentration Curl (hantle), Incline Curl (hantle), Spider Curl, Zottman Curl, Reverse Curl, Reverse EZ-Bar Preacher Curl, Reverse Cable Curl, Cable Preacher Curl. Tylko cz. 1: Barbell Preacher Curl, Spider Curl (sztanga), Bayesian Curl, Drag Curl. Tylko cz. 2: Preacher Hammer Dumbbell Curl, Zottman Preacher Curl, Machine Biceps Curl, Incline Hammer Curl, Standing Dumbbell Reverse Curl, Hammer Curl (linki), Standing One-Arm Cable Curl.
   Propozycja scalenia: jedno zdanie ruchu — `curl.move`/`curl.move1` (cz. 1) = `curl2.move`/`curl2.move1` (cz. 2), zostawić jedno id; błędy o tym samym sensie (`preacher.mis.arms` ≈ `curl2.mis.preacherLift`, `conc.mis.thigh` ≈ `curl2.mis.concLift`, `zottman.mis.rotate` ≈ `curl2.mis.zottNoTurn`, `spider.mis.arm` ≈ `curl2.mis.spiderArm`) — po jednym. Dwa niezależne przebiegi to zarazem kontrola: przy rozbieżności źródeł/wniosków dla wspólnego ćwiczenia — recenzent rozstrzyga. Rozbieżność już widoczna: Bayesian Curl (cz. 1 — warunkowo z Fitness Volt; cz. 2 — otwarte, jedno źródło), Drag Curl (cz. 1 — karta; cz. 2 — warunkowe).
2. **Machine Lateral Raise — niezbadany**: cz. 1 i cz. 2 delt_raise oddały go sobie nawzajem. Otwarte do następnej fali.
3. `urow.setup` (delt_raise cz. 1) odwraca stan pilnowany przez `tests/cues-014.test.tsx:49` (brak zdania w słowniku PL) — przy wdrożeniu zmiana testu w tym samym commicie + wpis w docs/18. `tests/cues-014.test.tsx:44` wymaga ≥ 2 wskazówek na kartę spoza `partial`.
4. Bloki JSON delt_raise cz. 1 mają skróty („jak Upright Row (sztanga)”) — do rozwinięcia; pole `uproszczenie` przy wpisie zdania — sprawdzić schemat `cues.json`.
5. HSS (Sutton) i MGH Sports PT — niemal identyczny tekst = jedno źródło.
6. Bloki zakładają wdrożenie bloków W1 po przeliczeniu (np. `ace-8`, `catalyst-*`, `hk-landow-stepup`, `ace-prosource-2014-biceps`).

## Do decyzji (koordynator 1.1 / recenzent)

- Szczebel: AMA (Curtsy Lunge), Fitness Volt per strona (Bayesian, Drag, Cross Body Hammer, One-Arm Cable Rear Lateral Raise), strona J. Stoppaniego (High Cable Curl), BarBend „Kettlebell Halo” (bez nazwy certyfikatu), przedruk NSCA ETM w CAO (upright row), NFPT „Guest” z biogramem (One-Arm Incline Lateral Raise — badacz uznał 4).
- Niezależność: BarBend + Fitness Volt (Drag, Bayesian); ACE + Naternicola (triceps).
- Skull crusher: kierunek opuszczania (czoło / za głowę / uszy — badacz dał część wspólną „w stronę głowy”, odstępstwo od „gotowego z W1 nie badaj” — `skull.move`) i blokowanie łokcia (Catalyst vs ISSA) — sprzeczność na szczeblu 4.
- Upright row: wzruszanie barkami (NSCA zabrania, Catalyst dopuszcza).
- Incline Shoulder Raise ×3: `chest 0,5` w katalogu prawdopodobnie zastępuje zębaty przedni (protrakcja) — dane katalogu do sprawdzenia (role-miesni-fala-w2/delt_raise.md).
- Poza zakresem, do rozważenia: Step Up (KARTA, bez błędów) — `stepup.mis.push`/`stepup.mis.drop` pasują; Lateral Raise (hantle) (KARTA, bez błędów) — `delt2.handsHigh`/`delt2.archBack`; karta Preacher Curl ma `"move": []` — `curl.move` by ją uzupełnił.
- Ćwiczenia bez żadnego opisu szczebla ≤ 4 (np. Y Raise, Car Drivers, Front Raise to Overhead, warianty leżące curl) — decyzja produktowa właściciela: ukryć na stałe czy szukać dalej.

## Zostało (następna fala)

curl: 10 otwartych (cz. 2, sekcja 5); delt_raise: 13 otwartych + Machine Lateral Raise + Incline Shoulder Raise ×3 i Sled Reverse Flye nie szukane ponownie; triceps: 17 otwartych; lunge: 12 otwartych (8 niebadanych albo z jednym wyszukiwaniem). Środowisko: ExRx, Muscle & Strength, Mayo — 403 w narzędziu.

## Commity

Role: 13c1067; triceps: 0fee8bf; curl cz. 1: a64911f; lunge: e68ef34; delt_raise cz. 1: 37e9eaf; delt_raise cz. 2: c0a1578; curl cz. 2 i ten plik: ostatni commit gałęzi.
