# 01-odkrywanie · tryb fix · 2026-10-28 · M1-audytor-generalny-022 (BRD aktualny i pełny)

Zadanie planu: M1-audytor-generalny-022 (P2, D, pozycja zbiorcza). Źródła: 01-odkrywanie-004, -005, -006, -009, -010, -011; 03-zakres-003, -004, -009; dodatkowo naprawa nocna M1-audytor-generalny-018 (BR). Raporty źródłowe czytane jako dane.

## ETAP 0 — środowisko

| Sprawdzenie | Wynik |
|---|---|
| System, Node | Linux 6.18 x86_64, Node v22.22.0 |
| Kopia robocza | Worktree agenta powstał w repo `prompts` (nie `trening`), a narzędzie blokuje operacje git w `/home/user/trening`. Dlatego: `git clone /home/user/trening` do `/home/user/prompts/.claude/worktrees/agent-a78c9b424e0891050/trening`, gałąź `naprawy/M1-audytor-generalny-022-brd` od `origin/naprawy/M2-koordynator-napraw-2026-10-27-p3` (= 321d287b), `node_modules` jako dowiązanie. Stan sprzed zmian: drugi worktree tego klonu (321d287b) do dowodów czerwieni. |
| GitHub, push | Nie wypychano (polecenie). Koordynator pobiera gałąź z klonu: `git fetch /home/user/prompts/.claude/worktrees/agent-a78c9b424e0891050/trening naprawy/M1-audytor-generalny-022-brd`. |
| Sieć | Działa (wytyczne App Review pobrane `curl`, HTTP 200, 2026-10-27). |
| Symulator, przeglądarka | Nie dotyczy (zmiany tylko w dokumentach i testach). |
| Repo | Publiczne; w zmianach brak sekretów i danych osobowych (`git diff --cached` przed każdym commitem). |

## E0 — klasyfikacja i plan

| ID | Rodzaj | Uzasadnienie | Zmiana |
|---|---|---|---|
| 01-odkrywanie-006, 03-zakres-004 | D | BRD sprzeczny z decyzjami 20–27.10 | BR-ZRO-001 wycofane, ZP-09, BR-JEZ-002/003/004, K9 (BR-TRN-011), README, errata |
| 01-odkrywanie-004, 03-zakres-003, M1-018 | D | funkcje z decyzjami i testami bez BR | `docs/brd/wymagania-uzupelnienie.md`: PR-10…PR-12, J-06, 25 BR; pole „Ekrany:”; strażnik tras |
| 01-odkrywanie-009 | D | brak wektora błędnych danych | RD-04-W5 |
| 01-odkrywanie-005 | D (M dla celu „Siła” u początkujących → OP-07, nie rozstrzygane) | progi i wzory z kodu bez RD | RD-05…RD-15, S-05…S-14 z istniejących rejestrów |
| 01-odkrywanie-010 | D | OG bez cytatu i daty | S-15…S-24, OG-01…OG-10 |
| 01-odkrywanie-011 | D | liczby bez podstawy | OP-05, (D-102), D-123 |
| 03-zakres-009 | D (wariant A = P → OP-10) | brak śladu BR → test | pole „Test:” + strażnik (wariant B) |

Kod aplikacji bez zmian. Zmienione pliki: `docs/brd/*`, `tests/wektory/brd.json`, `tests/audit-m1-044-brd.test.ts`, nowy `tests/audit-m1-2026-10-27-022-brd-aktualny.test.ts`, generowane `README.md` i `docs/19-macierz-testow.md`. Ścieżki wrażliwe (dane, migracje, zakupy, workflowy): brak zmian, przegląd subagenta niepotrzebny.

## E2 — dowody (SHA → ID)

| Commit | ID | Test i wynik przed (baza 321d287b) / po |
|---|---|---|
| 2dfb31b7 | 01-odkrywanie-006, 03-zakres-004 | `tests/audit-m1-2026-10-27-022-brd-aktualny.test.ts`: 5/5 czerwone (dowody/czerwien-006.txt) → zielone |
| d957a67b | 01-odkrywanie-004, 03-zakres-003, M1-audytor-generalny-018 | ten sam plik, testy tras i funkcji: 7/7 czerwone (dowody/czerwien-004.txt) → zielone |
| c36724b8 | 01-odkrywanie-009 | kontrola-brd: „UWAGA … RD-04: brak wektora błędnych danych” (dowody/kontrola-przed.txt) → brak uwagi dla RD-04; RD-04-W5 na kodzie w `tests/audit-m1-044-brd.test.ts` |
| aaa41454 | 01-odkrywanie-005 | `tests/audit-m1-044-brd.test.ts`: 13 z 24 czerwonych (dowody/czerwien-005.txt) → 24/24 zielone; wektory RD-05…RD-15 na `canStartLive`, `qualifiesForDay`, `REPS`, `REST`/`DEFAULT_REST`, `setsBudget`, `deloadHint`, `clampGoal`/`setsGoal`, `liftedLoad`+`e1rm`, `backToBack`, `stepOf`, `progressGuard` |
| eb2b8983 | 01-odkrywanie-010 | test OG: czerwony (dowody/czerwien-010.txt) → zielony; cytaty S-15…S-24 dosłownie na surowym tekście strony (dowody/apple-cytaty.txt; strona „Last Updated: October 16, 2026”, sha256 622a12c0…) |
| f9c280c9 | 01-odkrywanie-011 | test liczb: czerwony — znacznik „DO USTALENIA: badacz” bez OP w BR-TRN-009 na bazie (dowody/czerwien-011.txt) → zielony |
| bc81d06b | 03-zakres-009 | test śladu: czerwony od BR-TRN-001 (dowody/czerwien-009z.txt) → zielony; 75/75 aktywnych BR wskazuje istniejący test albo scenariusz |

**kontrola-brd** (`node scripts/kontrola-brd.mjs docs/brd`): przed — 5 plików, 49 BR, 4 RD, 26 wektorów, 0 błędów, 1 uwaga (RD-04); po — 7 plików, 75 BR (+ BR-ZRO-001 wycofane), 15 RD, 85 wektorów, 10 OP, **0 błędów**, 1 uwaga (RD-09 bez wektora błędnych danych, opisane w OP-08). Pliki: dowody/kontrola-przed.txt i dowody/kontrola-po.txt ; wektory: `tests/wektory/brd.json` przegenerowany w każdym commicie z RD.

Wybrane miejsca w BRD (klon): `docs/brd/wymagania.md:708` (BR-ZRO-001 wycofane), `docs/brd/wymagania.md:125` (BR-TRN-011), `docs/brd/wymagania-uzupelnienie.md:224` (BR-ZAK-007), `docs/brd/reguly.md:83` (RD-05), `docs/brd/odkrywanie.md:51` (OG-04).

Testy uruchomione (`--maxWorkers=1`), wszystkie zielone: `tests/audit-m1-044-brd.test.ts`, `tests/audit-m1-2026-10-27-022-brd-aktualny.test.ts`, `tests/audit-1-0-docs.test.ts`, `tests/verify-docs.test.ts`, `tests/audit-m1-2026-10-27-018-jedno-okno.test.tsx`, `tests/public-repo.test.ts`, `tests/forbidden-names.test.ts`, `tests/zrodla-wiedzy.test.ts`, `tests/architecture-limits.test.ts`, `tests/audit-m1-2026-10-27-023-bramki-dokumenty.test.ts`, `tests/readme.test.ts`, `tests/readme-ls-files.test.ts`, `tests/research-quotes.test.ts`, `tests/flows.test.tsx`, `tests/package-scripts.test.ts`, `tests/slownik-terminow.test.ts` (307 przypadków; dowody/jest-zestaw.txt, dowody/jest-zestaw2.txt). `tsc --noEmit` kod 0; `check:readme`, `check:matrix`, `check:decyzje`, `check:claims` kod 0. Pełne `npm run verify` nie uruchomione (zasada: raz po scaleniu); `npm run verify:docs` odmawia, bo gałąź p3 względem `main` zawiera zmiany kodu.

Status: naprawione-do-weryfikacji (statusu „zweryfikowane” nie nadaję — reaudit).

## Co otwarte

- OP-03: źródła S-01…S-03 i S-05…S-14 przeniesione z `docs/research` bez ponownego odczytu (S-12 to cytat z drugiej ręki) — badacz.
- OP-05: kroki ± czasu (5 s) i dystansu (50 m / 50 yd) bez źródła — badacz. OP-06: przelicznik %1RM ↔ powtórzenia — badacz.
- OP-07 (M): cel „Siła” daje 4–6 powtórzeń każdemu, bez stażu; ACSM 2009 dla początkujących 8–12 RM, A26 nieprzeczytane — rola 06/badacz, rozstrzyga hierarchia.
- OP-08: `setsBudget` dla czasu < 10 min daje liczbę ujemną (teoretyczne, nieosiągalne z interfejsu) — rola 08; RD-09 bez wektora błędu.
- OP-09: czy kopie w folderze aplikacji (kopia urządzenia w iCloud) podpadają pod wytyczną 5.1.3(ii) — rola 10 i 05.
- OP-10 (P): ślad BR → test przez ID BR w nazwach `describe` (wariant A 03-zakres-009) zamiast pola „Test:” — decyzja o kolejności prac; dziś wariant B ze strażnikiem.
- `docs/brd/wymagania.md` ma ok. 54 KB, `wymagania-uzupelnienie.md` ok. 28 KB — powyżej konwencji roli ok. 20 KB; podział na pliki modułów osobnym commitem strukturalnym (backlog).

## Nowe znaleziska (nie naprawiane)

- 01-odkrywanie-012 (P2, teoretyczny, D): `setsBudget` (`lib/generator.ts`) bez dolnej granicy czasu — dla czasu krótszego niż rozgrzewka zwraca liczbę ujemną; interfejs pozwala tylko 45/60/90 min. Polecenie dla roli 08: `Math.max(0, …)` z testem albo wektor błędu w RD-09 (OP-08).
- 01-odkrywanie-013 (P2, brzegowy, M/P): OG-09 — wytyczna 5.1.3(ii) („may not store personal health information in iCloud”) a kopie automatyczne w folderze aplikacji; ocena roli 10 i 05 (OP-09).

## Polecenia dla ról i kroki właściciela

- Rola 07: przy zmianie kryterium BR zmieniać test wskazany w polu „Test:”; wariant A śladu po decyzji z OP-10.
- Rola 06 / badacz: OP-03, OP-05, OP-06, OP-07 (ponowny odczyt S-05…S-14, A26).
- Rola 10: OP-09; opis w sklepie zgodny z OG-01, OG-03, OG-07 (przed zgłoszeniem; przegląd wytycznych do 2027-01-27).
- Właściciel: decyzja OP-10 (kolejność prac, nie blokuje 1.0).

## Kontrola dowodów i sekretów

`node narzedzia/sprawdz-raport.mjs wynik.md <klon trening> .` → „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone” (kod 0, 2026-10-28; pierwsze uruchomienie: 2 błędy w odwołaniach raportu, poprawione).
