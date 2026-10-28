# Naprawy M2 — Trening — 2026-10-27/28
Pętla 1 · Audyt 025a50b · Baza 862f119 (naprawy-1-0) · Gałęzie: naprawy/M2-koordynator-napraw-2026-10-27-p1 (862f119..451862d), -p2 (451862d..4b6df8e), -p3 (8a3f4ec..b3e580e, zawiera p2 i -p2-ax5 testera 011)

## Podsumowanie
- Naprawione do weryfikacji: 34 z 37 zadań (statusy i commity w plan-napraw.json; tabela sprawdz-plan w dowody/M2/sprawdz-plan-koniec.txt).
- Zablokowane: 006 (zgoda właściciela na koszt przeglądu przez API), 033 (próg i data hipotezy Androidu — wybór właściciela), 036 (dane po premierze, punkt kontrolny 8 tygodni).
- 011: scenariusz 58 przy największym tekście zielony (e2e-ios 40624070610); zrzuty 580–589 bez ucięć ekranu Trening; stan „dziś bez treningu” z dużą ikoną startu kolejnego treningu nie pokryty (scenariusz zależy od dnia tygodnia) — krok telefonu T-04 zostaje.
- Przekazane rolom (sesje subagentów ze świeżym kontekstem): 005 (06), 009 (07), 010 (02), 014 (05), 019+031 (09), 020+021 (06), 022 (01), 024–029 (04), 037 (03), 011 (tester-e2e).

## Zadania
| ID | Rodzaj | Wykonawca | Test (nazwa) | Przed → po | Commit | Dowód | Status |
|---|---|---|---|---|---|---|---|
| 001 | D | M2 | tests/audit-m1-2026-10-27-001-dozywotni-przy-subskrypcji.test.tsx | 2/4 czerwone → 4/4 | a90caba | dowody/M2/M1-audytor-generalny-001-przed.txt | naprawione-do-weryfikacji |
| 002 | D | M2 | tests/audit-m1-2026-10-27-002-limit-po-wygasnieciu.test.ts | 5/6 → 9/9 | 8c12be9 | dowody/M2/M1-audytor-generalny-002-przed.txt | naprawione-do-weryfikacji |
| 003 | D | M2 | tests/audit-m1-2026-10-27-003-notatka-serii.test.tsx | 300 → 450 | e66902b | dowody/M2/M1-audytor-generalny-003-przed.txt | naprawione-do-weryfikacji |
| 004 | D | M2 | tests/audit-m1-2026-10-27-004-ratunek.test.tsx | 5/5 → 7/7 | 451862d | dowody/M2/M1-audytor-generalny-004-przed.txt | naprawione-do-weryfikacji |
| 005 | P | rola 06 | tests/figury-recenzja.test.tsx | 28/31 → zielone | 562798d | role/06-tresci/fix-2026-10-27/wynik.md | naprawione-do-weryfikacji |
| 007 | D | M2 | tests/audit-m1-2026-10-27-007-waluta-ryzyko.test.ts | 2/2 → zielone | bd47ff1 | dowody/M2/M1-audytor-generalny-007-przed.txt | naprawione-do-weryfikacji |
| 008 | D | M2 | tests/audit-m1-2026-10-27-008-build-do-zgloszenia.test.ts | 3/3 → zielone | 8c2c77b | dowody/M2/M1-audytor-generalny-008-przed.txt | naprawione-do-weryfikacji |
| 009 | P | rola 07 | tests/decyzje-straznik.test.ts | 11/21 → 21/21 | ee1713b | role/07-jakosc/fix-2026-10-27/wynik.md | naprawione-do-weryfikacji |
| 010 | P | rola 02 | tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx | 9/10 → 10/10 | 72338f0 | role/02-monetyzacja/fix-2026-10-27/wynik.md | naprawione-do-weryfikacji |
| 012 | D | M2 | tests/audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.test.ts | 3/4 → zielone | 1a95b76 | dowody/M2/M1-audytor-generalny-012-przed.txt | naprawione-do-weryfikacji |
| 013 | D | M2 | tests/audit-m1-2026-10-27-013-wyjatek-migracji.test.tsx | 1/2 → 3/3 | 8f3fb6f | dowody/M2/M1-audytor-generalny-013-przed.txt | naprawione-do-weryfikacji |
| 014 | P | rola 05 | tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts | czerwony → zielony | 59fc6d7 | role/05-architekt/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 015 | D | M2 | tests/audit-m1-2026-10-27-015-blad-zapisu.test.tsx | 2/2 → zielone | ca84668 | dowody/M2/M1-audytor-generalny-015-przed.txt | naprawione-do-weryfikacji |
| 016 | D | M2 | tests/audit-m1-2026-10-27-016-arkusz-subskrypcji.test.tsx | 2/3 → 3/3 | f775eb5 | dowody/M2/M1-audytor-generalny-016-przed.txt | naprawione-do-weryfikacji |
| 017 | D | M2 | tests/audit-m1-2026-10-27-017-polityka-poczta.test.ts | 2/2 → zielone | d0ae52e | dowody/M2/M1-audytor-generalny-017-przed.txt | naprawione-do-weryfikacji |
| 018 | D | M2 | tests/audit-m1-2026-10-27-018-jedno-okno.test.tsx | 2/2 → zielone | a2300a1 | dowody/M2/M1-audytor-generalny-018-przed.txt | naprawione-do-weryfikacji |
| 019, 031 | D | rola 09 | tests/i18n-skrot-liczebnik.test.ts, tests/i18n-forma-uk.test.ts, tests/check-i18n-script.test.ts | czerwone → zielone | d8efe02, c4a5f48 | role/09-lokalizacja/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 020, 021 | M | rola 06 | testy RD-02, tests/audit-m1-048-claims-registry.test.ts | czerwone → zielone | 7fb4f1a, 1cc402f | role/06-tresci/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 022 | D | rola 01 | tests/audit-m1-2026-10-27-022-brd-aktualny.test.ts | czerwone → zielone | bc81d06 | role/01-odkrywanie/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 023 | D | M2 | tests/audit-m1-2026-10-27-023-bramki-dokumenty.test.ts | 2/4 → 4/4 | 25a72d0 | dowody/M2/M1-audytor-generalny-023-przed.txt | naprawione-do-weryfikacji |
| 024–029 | D | rola 04 | testy w role/04-studio-projektowe/fix-2026-10-28/wynik.md | czerwone → zielone | b41e44d, b2afd44, e73df05, b37746a, 6729c14, 1dcb400 | role/04-studio-projektowe/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 030 | D | M2 | tests/audit-m1-2026-10-27-030-liczby-w-kodzie.test.ts | 3/3 → zielone | 7985755 | dowody/M2/M1-audytor-generalny-030-przed.txt | naprawione-do-weryfikacji |
| 032 | D | M2 | tests/audit-m1-2026-10-27-032-kod-diagnostyczny.test.tsx | 2/2 → zielone | dbc9f3b | dowody/M2/M1-audytor-generalny-032-przed.txt | naprawione-do-weryfikacji |
| 034 | D | M2 | tests/maestro-tap-tekst-guard.test.ts, tests/history-calendar.test.tsx | czerwone (ziarno 42) → 5 ziaren zielonych | 321d287 | dowody/M2/M1-audytor-generalny-034-kalendarz-przed.txt | naprawione-do-weryfikacji |
| 035 | D | M2 | tests/audit-m1-2026-10-27-035-duze-pliki.test.ts | 1/2 → 2/2 | a414b66 | dowody/M2/M1-audytor-generalny-035-przed.txt | naprawione-do-weryfikacji |
| 037 | P | rola 03 | 4 testy tests/audit-m1-2026-10-27-037-*.test.ts(x) | czerwone → zielone | 848f9b0 | role/03-zakres/fix-2026-10-28/wynik.md | naprawione-do-weryfikacji |
| 006 | D | M2 | — | — | — | dowody/M2/szacunek-006/szacunek.json | zatwierdzone + blokada |
| 011 | D | tester-e2e | e2e-ios scenariusz 58 (rozmiar_tekstu) | brak przebiegu z dużym tekstem → przebieg 40624070610 zielony (1 ponowienie, wyścig skryptu z oknem przypomnienia) | 4c73243 (scalone b3e580e) | role/07-jakosc/fix-2026-10-27/wynik-011-ax5.md | naprawione-do-weryfikacji |
| 033 | D | M2 | tests/audit-m1-2026-10-27-033-hipoteza-android.test.ts | 2/2 → zielone (część dokumentu) | e2d8f2b | dowody/M2/M1-audytor-generalny-033-przed.txt | zatwierdzone + blokada |
| 036 | M | rola 02 | — | — | — | — | zatwierdzone + blokada |

## Zablokowane
- 006 — R-010: przegląd tłumaczeń przez API po ostatnich zmianach tekstów; koszt ok. 10,7 USD (Opus) albo 5,3 USD (Sonnet) z kredytów API właściciela; następny krok: zgoda właściciela → przeglad-tlumaczen.yml na głowie p3 → zapis w docs/16 i stan R-010.
- 033 — próg pobrań i minimalna liczba zgłoszeń dla hipotezy Androidu (wybór właściciela, zasada roli 9); data oceny po dacie premiery.
- 036 — przeliczenie bramki W0 z danymi App Store Connect w punkcie kontrolnym 8 tygodni po premierze (DEC-08 a).

## Sesje ról
Wszystkie jako subagenci z pełnym promptem roli (assemble.mjs, tryb fix) i poleceniem w naprawy/polecenia/; kontrola dowodów (sprawdz-raport) w wynikach ról: OK. Przeglądy ścieżek wrażliwych (świeży subagent, tylko diff i zasady 10–14): p1, p2–p3, 010, 037 — brak uwag P0/P1 (dowody/M2/przeglad-wrazliwe-p1.txt, dowody/M2/przeglad-wrazliwe-p3.txt). Recenzje lokalizacji po każdej zmianie tekstów (004, 010, 019/031, 024–029, 037) — poprawki naniesione, pytania do native speakerów w raportach ról.

## Nowe znaleziska
### M2-koordynator-napraw-001 · Uwaga przed zakupem dożywotniego pomija subskrypcję z kodu promocyjnego, która po promocji odnawia się płatnie
- Pozycja listy kontrolnej: MON-10 · Poziom: P2 · Realność: brzegowy · Rodzaj: P
- Dowód: app/paywall.tsx — warunek `paysSub` tylko dla `source === 'purchase'` (test akceptacyjny M1-001 wprost wyłączał „code”).
- Opcje: (a) pokazać uwagę także przy subskrypcji z kodu; (b) zostawić. Rekomendacja: (a). Status: otwarte.
### M2-koordynator-napraw-002 · Treść błędu rysowania ekranu trafia do e-maila „Napisz do nas” i może zawierać fragment tekstu z ekranu
- Pozycja listy kontrolnej: NIE-06 · Poziom: P2 · Realność: brzegowy · Rodzaj: D
- Dowód: components/StartError.tsx — `[diag, detail]` w treści wiadomości; użytkownik widzi treść przed wysłaniem. Status: otwarte.
### M2-koordynator-napraw-003 · Znak „×” między ciężarem a powtórzeniami na tablicy treningu jest ucięty i wygląda jak „^”
- Pozycja listy kontrolnej: WYG (czytelność) · Poziom: P2 · Realność: realny (prawdopodobnie przy każdym rozmiarze tekstu, nie tylko dużym) · Rodzaj: D
- Dowód: zrzut zrzuty/M2/ax5/run40624070610-586-trening-w-toku.png (przebieg e2e-ios 40624070610) (kadr w pełnej rozdzielczości 1206×2622: „lb ^ 8”); components/NowBoard.tsx:82 — `fontSize: Math.round(size * 0.45)` przy `lineHeight: 22` z tokenu `boardMeta` (lib/tokens.ts:114), więc dolna połowa znaku wypada poza linię. Kod sprzed audytu (a707a0a, jest w main) — nie regresja napraw.
- Do potwierdzenia zrzutem przy zwykłym tekście; naprawa tania (wysokość linii liczona z rozmiaru). Status: otwarte (poza planem — do decyzji i reaudytu).
- Pozostałe nowe znaleziska ról (bez naprawy): 06-tresci-005, 01-odkrywanie-012/013, NZ-037-1/2/4, uwagi P2 roli 04 — w ich wynik.md.

## Komendy końcowe
- Pełne `npm run verify` na p3 bb5fdcd (dowody/M2/verify-p3.txt): kod 1 — 10 zestawów czerwonych; 5 z obciążenia maszyny (przechodzą osobno), 5 realnych (etykieta „PR:”, pole decyzji K3, liczba w BR, nazwa marki w zapisie wzorcowym, lista bazowa stuknięć) naprawionych w kolejnym commicie; zestawy powtórzone osobno — zielone.
- Pełne verify na p1 (dowody/M2/verify-p1.txt): 3 realne porażki (konteksty, test strony, dziennik wydań) naprawione na p2; reszta to przekroczenia czasu przy obciążeniu.
- Stan wyjściowy: typecheck 0, lint 0, CI tests.yml zielone na 862f119 — wynik nie gorszy po naprawach w powtórkach; CI tests.yml na głowie p3: 8ec46df czerwony (1 test, znacznik „PR:” w tests/przeplywy.json — lekcja w docs/40), po poprawce 4b87a48 przebieg 40619381340 zielony; po scaleniu 011 głowa b3e580e — przebieg 40627304812 zielony (pełne verify w CI: typy, tłumaczenia, wszystkie testy Jest, eksport iOS).

## Lista kontrolna KOO
- KOO-01 plan sprawdzony na starcie i na końcu (sprawdz-plan kod 0). KOO-02 stan repo zapisany w postępie. KOO-03 zgody z datą i słowami w postępie. KOO-04 test przed i po każdego D w dowody/M2/. KOO-05 osobne commity z ID; scalenia ról osobnymi commitami. KOO-06 nic poza zakresem — znaleziska spoza planu opisane, nie naprawione (wyjątek: regresje wywołane naprawami, naprawione z ID zadania). KOO-07 zmiany danych: brak zmiany schematu; testy na prawdziwym SQLite (004), na zapisach wydanych wersji (014). KOO-08 P/M przez role. KOO-09 przeczytane reguły w postępie przy zadaniach. KOO-10 konflikty: inna sesja na naprawy-1-0 (ekran zakupu, „Plan: miesięczny”) — do decyzji właściciela przy scalaniu. KOO-11 postęp aktualny. KOO-12 statusy tylko naprawione-do-weryfikacji/blokada. KOO-13 verify końcowe jak wyżej. KOO-14 przekazanie niżej.

## Przekazanie
### Przekazanie do M1 (reaudit)
- Zakończono: M2 fix, pętla 1; gałąź naprawy/M2-koordynator-napraw-2026-10-27-p3, baza 862f119; raport K/M2-koordynator-napraw-2026-10-27.md
- Nowa sesja (D-015), w repo na gałęzi p3:
  `node <prompts>/tools/assemble.mjs M1-audytor-generalny --tryb reaudit --wyjscie <K> --baza 025a50b96f504ea9d16d573720d1e92dc951a103`
- Paczka wejściowa: K/plan-napraw.json, ten raport, K/naprawy/, K/role/<rola>/fix-2026-10-27 i fix-2026-10-28
- Otwarte: 006, 033, 036; decyzje dla właściciela w odpowiedzi porannej; scalenie z main: po reaudycie (rekomendacja)
