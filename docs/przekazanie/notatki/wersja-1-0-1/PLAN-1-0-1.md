# Linia 1.0.1 — plan pracy agentów (stan 29.10.2026)

Źródła: `wersja-1-0-1-r2` (STAN-2026-10-29, docs/21), `main` 412e063 (docs/21, `V2_WSTRZYMANE`, zobowiązania; zawiera #90–#93). Zrobione na r2 pominięte (STAN, `git log main..r2`).

## A. Zadania 1.0.1
Rodzaj: D zatwierdzone, P decyzja właściciela, M rozstrzygnięcie źródłami. Żadne nie zmienia danych użytkownika.

| ID | Zadanie | Pliki | Rodz. | macOS | Zależy |
|---|---|---|---|---|---|
| 101-00 | Scalenie `main` (412e063) → `wersja-1-0-1-r2` | wiele (sekcja C) | D | nie | — |
| 101-01 | JM Press, Decline CG Skull Crusher: sprawdzić pomiar z main (łokieć vs `cgbp.elbows`) na rigu r2 → zdjąć z `V2_WSTRZYMANE`; test zawęzić, nie usuwać | `lib/figures/v2/figure.ts`, `tests/figures-v2-wstrzymane.test.ts` | D | nie | 00 |
| 101-02 | Hinge z podłogi: kolano jako osobny ruch + strażnik odstępu ciężar–noga + L-056 A (dwie miary w teście, kadry co 0,05); 11 martwych ciągów do odblokowania | `lib/figures/v2/rigs/hinge.ts`, nowy `tests/figury-styk.test.ts`, `tests/figures-v2-tor.test.ts` | D | nie | 00 |
| 101-03 | Ten sam pomiar: Sumo ×4, SLDL, RDL sztanga, SL RDL linki; stałe wyjątki Smith SL, Sumo KB | `rigs/hinge.ts`, test styku | D | nie | 02 |
| 101-04 | Sumo tor ukośny 6–8 cm; RDL ramiona 23° | `rigs/hinge.ts` | P (D2, D3) | nie | 02 |
| 101-05 | Band Bench Press: tylko gumy, bez sztangi | `rigs/benchPress.ts`, `variants.ts`, `scene.ts`/`draw.ts` | D | nie | 00, 02 (miara) |
| 101-06 | Chain Press: łańcuchy na uchwytach, bez sztangi | j.w. | D+M | nie | 00, F |
| 101-07 | Close Grip BP: pomiar po scaleniu; zgodny z kartą → do zdjęcia | `benchPress.ts`, testy | D | nie | 00 |
| 101-08 | Board/Pin Press: potwierdzić, że deska/bolce z r2 zamykają ŚREDNIE z main | test | D | nie | 00 |
| 101-09 | Zercher Squat: gryf w zgięciach łokci przez cały ruch | `rigs/squat.ts`, `variants.ts` | D | nie | 00, 02 |
| 101-10 | Sumo Squat (hantel): pionowy tor pod barkami | `rigs/squat.ts` | D | nie | 00, 02 |
| 101-11 | Overhead Squat i One-Arm OH KB: bark 183–198° | `rigs/squat.ts`, wyjątek kontraktu | P (D1) | nie | F |
| 101-12 | 14 torów z wyjątkiem: recenzja śladu; błąd → poprawka i usunięcie wyjątku | `tests/tor-wyjatki.json`, rigi squat/hinge | D/M | nie | 00 |
| 101-13 | v1 NISKIE: Reverse Lunge (kolano, lądowanie), test szerokości komórki 2×2, Lunges tylna stopa, Incline Push Up dłoń | `lib/figures/data.json`, `scripts/figures/gen.mjs`, `tests/figury-podparcie.test.ts`, `tests/figures.test.tsx` | D + P (D4, D5) | nie | 00 |
| 101-14 | Niestabilny test „+” w nagłówku list S4: zmierzyć, podzielić albo jawny limit z powodem | `tests/interaction-patterns.test.tsx` | D | nie | — |
| 101-15 | ms VoiceOver „Lukisan pergerakan” → „Animasi pergerakan”; słownik: el „κινούμενα σχέδια” zakazane, el squat/bench press/deadlift zalecane, ms termin marketingowy | `lib/locales/ms.json`, `docs/lokalizacja/slownik-terminow.json`, `tests/slownik-terminow.test.ts` | D | nie | 00 |
| 101-16 | Import CSV: zakres dat bez roku przy dacie końcowej | `app/more/import.tsx` / formatowanie dat + test | D | nie | 00 |
| 101-17 | „Adjust to: …” ucinany w el | komponent okna Dostosuj + test | D | nie | 00 |
| 101-18 | Gastro stretch: źródło szczebla 2 dla czasu przytrzymania | `docs/research/*` | M | nie | — |
| 101-19 | Testy podparcia: ciężar w dłoni = 10% masy ciała na rękę — źródło | `docs/research/*`, stała w teście | M | nie | — |
| 101-20 | Zegarek: „Trening wstrzymany” nachodzi na „Przerwa”; zrzut „paused” | `targets/watch-app/RootView.swift`, `scripts/ci/watch-screenshots.sh` | D | TAK | 1.0 wysłane |
| 101-21 | Tokeny: literały 12/14 pt, promienie 10/12/2 | `components/Dashboard.tsx`, `GuardSection.tsx`, `tests/i18n-wave2.test.ts`, `tests/tokeny-odcisk.json` | P (D6) | przy A tak | 00 |
| 101-22 | E2E po 1.0 (`tylko_scenariusze` 13, 14, 31, 56, 58, 59 + zmienione); `watch-sim.yml`, `ios-unsigned.yml` dla B-04 | `.maestro/*` | D | TAK | pakiety, 1.0 wysłane |
| 101-23 | E2E „Device became unreachable”: ponowienie | `.github/workflows/e2e-ios.yml` | P (D7) | TAK | 1.0 wysłane |
| 101-24 | Zrzuty sklepu: czas przebiegu | workflow + `scripts/ci/` | D | TAK | 1.0 wysłane |
| 101-25 | `store/review-notes.md` i docs/45: lista rodzin z rysunkiem po odblokowaniu | `store/review-notes.md`, `tests/store-review-notes.test.ts` | D | nie | A–D |
| 101-26 | Przebieg dowodowy `jest-ponow` przy scaleniu do main | CI | D | nie | polecenie właściciela |

Poza 1.0.1: ZB-010 decode-uri-component (z SDK); „Standing Hamstring and Calf Stretch” jako osobne ćwiczenie (1.0.x, migracja, nie z SDK); DEC-07 b i ZB-011 (1.0.x); Skull Crusher dwie fazy i podział plików >20 KB (1.1); pytania do native speakerów (docs/16); ZB-018 (decyzje procesu po wysłaniu 1.0).

## B. Pakiety
Figury: autor (programista) ≠ recenzent (audytor, nowy agent na gałęzi pakietu); recenzja: ślad toru (L-050), kadry co 0,05, dwie miary (L-056 A), wpis `autor` ≠ `recenzent` w `docs/research/figury-recenzja.json`.

| Pakiet | ID | Obszar plików (wyłączny) | Autor / recenzent | Czas agenta |
|---|---|---|---|---|
| 0 Scalenie | 00, 01 | całe repo (przed innymi) | koordynator albo programista | 1–1,5 h + verify |
| A Hinge | 02, 03, 04, część 12 | `rigs/hinge.ts`, `tests/figury-styk.test.ts`, hinge w `figures-v2-tor.test.ts` | programista / audytor | 5–6 h + 1,5 h |
| B Bench | 05, 06, 07, 08 | `rigs/benchPress.ts`, bench w `variants.ts`, rysowanie gum i łańcuchów | programista / audytor | 3–4 h + 1 h |
| C Squat | 09, 10, 11, część 12 | `rigs/squat.ts`, squat w `variants.ts` | programista / audytor | 4–5 h + 1,5 h |
| D Figury v1 | 13 | `lib/figures/data.json`, `scripts/figures/gen.mjs`, `components/ExerciseFigure.tsx`, testy v1 | programista / audytor | 2–3 h + 1 h |
| E Drobne UI i lokalizacja | 14, 15, 16, 17 (+21 przy D6 = B) | `lib/locales/ms.json`, słownik, import CSV, okno Dostosuj, `interaction-patterns` | programista + tlumacz / recenzent-lokalizacji | 2–3 h |
| F Źródła | 18, 19, część M 06 i 11 | nowe pliki `docs/research/…` | badacz-merytoryczny | 1–1,5 h |
| Koordynator (fala 3) | 01 (wpisy), 25, 26 | `V2_WSTRZYMANE`, review-notes, docs/21, pliki generowane | koordynator | 1 h + verify |
| G1 E2E (fala 4) | 22 | `.maestro/` | tester-e2e | 1–2 h + CI |
| G2 Wygląd macOS (fala 4) | 20, 21 przy D6 = A | `RootView.swift`, `Dashboard.tsx`, `GuardSection.tsx` | programista / recenzent ze zrzutami | 2 h + CI |
| G3 Workflowy (fala 4) | 23, 24 | `.github/workflows/`, `scripts/ci/` | koordynator (przebieg dowodowy) | 1–1,5 h + CI |

## C. Pliki wspólne i scalanie
- Tylko dopisywanie, przy scaleniu obie strony: `docs/18`, `docs/40` (`## L-NNN` nad numerowanymi), `docs/research/figury-recenzja.json` (każdy pakiet tylko swoje wpisy).
- Tylko koordynator, raz po scaleniu fali: docs/21; `V2_WSTRZYMANE` (pakiety zgłaszają „do zdjęcia”); `store/review-notes.md`; skróty rodzin v2 (`node scripts/zrodla-runtime.mjs --skroty`); `skroty-przekladu.json`; `konteksty.json`; `tests/wektory`; najpierw `node scripts/test-matrix.mjs --write`, potem `node scripts/readme.mjs --write`, na końcu `npm run -s check:pochodne`.
- `variants.ts`, `tests/tor-wyjatki.json`: każdy pakiet tylko wiersze swoich ćwiczeń; przy konflikcie sąsiednich linii — obie strony.
- Kolejność scalania do r2: 0 → F → E → A1 (pierwszy commit A: miara styku + helper dwóch miar, scalony od razu — B i C go używają) → A → B → C → D → fala 3 → fala 4.
- Pakiet 0, znane konflikty: `docs/lokalizacja/konteksty.json` (37), `docs/19` (16), README (2) — wygenerować; docs/21, docs/18, `docs/brd/wymagania.md`, `store/app-store-metadata.json` — ręcznie; `components/RecordsCard.tsx`, `PeriodSummary.tsx` (`F.heavy` → `FONT.title700` na r2 vs zmiany main); auto-scalone do sprawdzenia: `lib/figures/v2/ui.ts`, `components/ExerciseFigure.tsx`, `Dashboard.tsx`, `WorkoutBlocks.tsx`, `app/history/edit/[id].tsx`, CLAUDE.md, `.claude/settings.json`; `figure.ts` (`V2_WSTRZYMANE` tylko na main); `tests/tokeny-odcisk.test.tsx` (main zmienił Dashboard, Rekordy, Okres w #83 — `ODCISK_ZAPIS=1` tylko dla różnic z main); bramka 4: żadna karta ani figura widoczna w 1.0 nie znika przez zmianę skrótu; `grep -rln '^<<<<<<< '` przed `git add`.

## D. Ograniczenia na czas wydania 1.0
- Nic na `main` ani PR do `main` (scalenie linii tylko na polecenie właściciela po wydaniu). Nie dotykać `testflight.yml`.
- Żadnych workflowów macOS (`e2e-ios`, `watch-sim`, `ios-unsigned`, zrzuty) przed wysłaniem 1.0 do recenzji Apple — fala 4 dopiero po tym; warunek sprawdza koordynator u koordynatora 1.0 (docs/48 Z-29).
- Pełne lokalne verify jedno naraz (kolejka koordynatora); pakiety: testy własnych plików i `test:fast`; koordynator pełne verify po każdej fali. `tests.yml` na wypchniętych gałęziach wystarcza jako dowód CI.
- Worktree: symlink `node_modules` albo własne `npm ci`. `verify:docs` porównuje z `origin/main` i na gałęzi z kodem odmawia — to nie porażka.

## E. Decyzje właściciela (29.10.2026 ~11:05 UTC: „D0 B, reszta zgodnie z rekomendacją”; docs/18)
- D0 = B: start linii teraz, tylko fale 0–3 (bez macOS, bez `main`); fala 4 po wysłaniu 1.0 do recenzji Apple (sygnał od koordynatora 1.0). Zastępuje wpis 29.10 ~10:25 (start po wysłaniu 1.0).
- D1 = A: Overhead Squat / One-Arm OH KB — wyjątek kontraktu barku z powodem (cecha rozpoznawcza); zakres barku potwierdza pakiet F.
- D2 = A: sumo — tor ukośny zostaje; ponowna ocena po pomiarze z nowym ruchem kolan (pakiet A).
- D3 = B: RDL — ramiona pionowo pod barkami, razem z ruchem kolan (pakiet A).
- D4 = A: Lunges (hantle) — tylna stopa zostaje (NISKIE).
- D5 = A: Incline Push Up — dane z 1.0, `test.failing` zostaje, powrót w 1.1.
- D6 = B: tokeny — nowe tokeny o dzisiejszych wartościach (render bez zmian, odcisk na Linuksie); 101-21 do pakietu E; ujednolicenie ról w 1.1.
- D7 = B: E2E „Device became unreachable” — restart symulatora i jedno ponowienie scenariusza w tym samym przebiegu (101-23, fala 4, zmiana workflowu z przebiegiem dowodowym).
