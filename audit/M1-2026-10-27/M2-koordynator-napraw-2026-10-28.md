# Naprawy M2 — Trening — 2026-10-28
Pętla 2 · Audyt 025a50b · Reaudyt pętli 1 2385e75 · Baza 4c116d0 (`audyt/m1-reaudit-2026-10-28`) · Gałęzie: `naprawy/M2-koordynator-napraw-2026-10-28-p1` (4c116d0..a41cdbc), `naprawy/M2-koordynator-napraw-2026-10-28-p2` (a41cdbc..4e1ef08; partie 2 i 3 na jednej gałęzi — odstępstwo 4)

## Podsumowanie
- 21 zadań ponownie zatwierdzonych 28.10.2026 („1. Pełen zakres 2a 3a 4a 5b 6a 7b”): **20 naprawione-do-weryfikacji**, 1 czeka (039 — kod i testy gotowe, E2E na symulatorze czeka na maszynę macOS) — szczegóły w tabeli. Poza ID planu, z osobnej decyzji właściciela przekazanej przez koordynatora pętli 1: L-047 A (strażnik recenzji niezależnej) i L-048 A (`check:slowniki`) — zrobione.
- Role: 04 (039), 06 ×2 (038 recenzja kart i zestawów; 038 po decyzji 1a + 021), tłumacz + recenzent-lokalizacji (048), 07 (009); przegląd ścieżek wrażliwych (start/migracja, zakup, workflowy): brak P0/P1.
- tests.yml był czerwony na obu gałęziach po wypchnięciach przed końcem pełnego verify (lekcja L-NNN w docs/40, systemowa; właściciel wybrał A 28.10.2026 — znacznik zielonego verify w haku pre-push, wdrożone 65bffd8). Poprawione; pełne verify na głowie p2: kod 0, 556/556 zestawów, 10 861 testów, znacznik zapisany (65bffd8).
- Dla właściciela: L-045 (otwarte z pętli 1), kroki telefonu i App Store Connect (niżej), scalenie z `main` po reaudycie.

## Zadania
| ID | Rodzaj | Wykonawca | Test (nazwa) | Przed → po | Commit | Dowód | Status |
|---|---|---|---|---|---|---|---|
| 006 | D | M2 | tests/audit-m1-006-r010-zamkniecie.test.ts (+ 049-critical-content, 067) | 6/6 czerwone → 64/64 | e6114d1 | dowody/M2/p2/M1-audytor-generalny-006-przed.txt, -po.txt, 006-zmiany-vs-uwagi.txt | naprawione-do-weryfikacji |
| 009 | P | rola 07 | tests/dec07-odeslanie-docs21.test.ts | 2/3 czerwone → 3/3 | 0158aa5 | role/07-jakosc/fix-2026-10-28-p2/wynik.md | naprawione-do-weryfikacji |
| 011 | D | M2 | tests/m1-011-duzy-tekst-metoda.test.ts | czerwony → zielony | cd90610 | dowody/M2/p2/M1-audytor-generalny-011-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 012 | D | M2 | tests/audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.test.ts | resztka R-010 → zielony | 0d074a9 | dowody/M2/p2/M1-audytor-generalny-012-po.txt | naprawione-do-weryfikacji |
| 017 | D | M2 | scripts/check-urls.mjs (sieć, poza verify); apps4brew-www tests/tresc-podstron.json | check-urls kod 1 → 0 (po PR apps4brew-www#2) | 83a1883 | dowody/M2/p2/017-check-urls-start.txt, 017-check-urls-po.txt | naprawione-do-weryfikacji |
| 021 | M | rola 06 | tests/zrodla-pelne-wskazowki-ogolne.test.ts | T-054 otwarte → potwierdzone (2 źródła szczebla 4) | ab54392 | role/06-tresci/fix-2026-10-28-p2b/wynik.md | naprawione-do-weryfikacji |
| 023 | D | M2 | tests/audit-m1-2026-10-27-023-bramki-dokumenty.test.ts | 2 czerwone → 35/35 | b1a744f | dowody/M2/p2/M1-audytor-generalny-023-przed.txt, -po.txt, 023-yaml.txt | naprawione-do-weryfikacji |
| 032 | D | M2 | tests/m1-032-kod-migracja.test.tsx | czerwony → zielony | 525fe5c, c37dd58 | dowody/M2/p2/M1-audytor-generalny-032-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 034 | D | M2 | tests/nocne-workflowy.test.ts | czerwone → zielone | 9511202 | dowody/M2/p2/M1-audytor-generalny-034-przed.txt, -po.txt | naprawione-do-weryfikacji (przebieg dowodowy nocny — nowe moduły w najbliższej nocy) |
| 038 | P | rola 06 + M2 | tests/karty-recenzja.test.tsx, tests/figury-recenzja.test.tsx, tests/cues-014.test.tsx | 8/13 czerwone → 14/14; CI cues-014 czerwony → 39/39 | 6935d54, f67c438, a41cdbc | role/06-tresci/fix-2026-10-28-p2/wynik.md, role/06-tresci/fix-2026-10-28-p2b/wynik.md, dowody/M2/p2/038-1a-testy.txt | naprawione-do-weryfikacji |
| 039 | P | rola 04 + M2 | tests/interaction-guards.test.ts (S19), tests/voiceover-grupa-przycisk.test.tsx, symulacja scenariusza 21 | S19 czerwony → 43/43; 3 czerwone → 3/3 | ee43b82, f8a7806 | role/04-studio-projektowe/fix-2026-10-28-p2/wynik.md, dowody/M2/p2/039-maestro-flows-21.txt | zatwierdzone + blokada (E2E) |
| 040 | D | M2 | tests/m1-040-podpis-dystans.test.ts (+ watch-cue) | 6/7 czerwone → 174/174 (z powiązanymi) | 18ad8e9 | dowody/M2/p2/M1-audytor-generalny-040-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 041 | D | M2 | tests/m1-041-el-jednostka.test.ts | 2/5 czerwone → 5/5 | d4af580, 0abb9ea | dowody/M2/p2/M1-audytor-generalny-041-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 042 | D | M2 | tests/m1-042-migracja-drugi-start.test.tsx | czerwony → 30/30 | c85b71b | dowody/M2/p2/M1-audytor-generalny-042-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 043 | D | M2 | tests/m1-043-pierwsze-kroki-glyph.test.tsx | czerwony → 17/17 | 791d5ab | dowody/M2/p2/M1-audytor-generalny-043-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 044 | D | M2 | tests/m1-044-posiadany-plan-kontrast.test.tsx | czerwony → 45/45 | 2398cc8 | dowody/M2/p2/M1-audytor-generalny-044-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 045 | D | M2 | tests/m1-045-notatki-sciezka-zakupu.test.ts | 4/5 czerwone → 35/35 | 1131ee4 | dowody/M2/p2/M1-audytor-generalny-045-przed.txt, -po.txt | naprawione-do-weryfikacji |
| 046 | D | M2 | tests/m1-046-monetyzacja-stany.test.tsx, symulacja scenariusza 56 | 3 czerwone → 72/72; CI symulacja 56 czerwona → zielona (7/7) | 71a0e41, 9cf1c90 | dowody/M2/p2/M1-audytor-generalny-046-przed.txt, -po.txt, ci-czerwone-28-10-p1-p2.txt | naprawione-do-weryfikacji |
| 047 | D | M2 | tests/m1-047-otwarte-wskazniki.test.ts | czerwony → zielony; CI płytka kopia → null (5/5) | c1a0936, e87086a, 12a54dd | dowody/M2/p2/M1-audytor-generalny-047-przed.txt, -po.txt, ci-czerwone-28-10-p1-p2.txt | naprawione-do-weryfikacji |
| 048 | D | M2 + tłumacz + recenzent | tests/m1-048-podpis-szablony.test.ts | 30 czerwonych → 31/31 | b277a22 | dowody/M2/p2/M1-audytor-generalny-048-przed.txt, -po.txt, role/09-lokalizacja/fix-2026-10-28-p2/ | naprawione-do-weryfikacji |
| 049 | D | M2 | tests/architecture-limits.test.ts | czerwony → zielony | 97f9347 | dowody/M2/p2/M1-audytor-generalny-049-przed.txt, -po.txt | naprawione-do-weryfikacji |

Poza ID planu: decyzja 003 → 1.0.1 (4e1ef08, docs/18 i docs/21), L-047 A (939fbfe; tests/l047-recenzja-niezalezna.test.ts 4 wpisy + CLAUDE.md czerwone → 3/3), L-048 A (2053485, ba697d2; tests/l048-check-slowniki.test.ts 10/10 czerwone → 23/23), lekcja L-NNN (7cc3760; mechanizm A 65bffd8).

## Zablokowane
- **039** — status `zatwierdzone`: commity ee43b82, f8a7806, testy Jest i symulacja scenariusza 21 zielone; brakuje E2E na symulatorze (e2e-ios.yml 40729084387, `tylko_scenariusze` 21 56). Próby 1–3 anulowane bez maszyny macOS („not acquired by Runner”), ponawiane wg CLAUDE.md. Właściciel 28.10.2026: „A” — przekazanie do reaudytu bez czekania na E2E. Następny krok: wynik E2E → `naprawione-do-weryfikacji` (M2 dopisze do planu i postępu); reaudyt ocenia 039 na podstawie kodu i testów, E2E jako uzupełnienie.
- Poza zakresem pętli 2 (nie zatwierdzone ponownie): 033, 036 — bez zmian, stan jak w planie.

## Sesje ról
| Rola | Polecenie | Wynik | Kontrola dowodów |
|---|---|---|---|
| 04-studio-projektowe (039) | naprawy/polecenia/04-studio-projektowe-p1-petla2.md | role/04-studio-projektowe/fix-2026-10-28-p2/wynik.md — commit roli + mój f8a7806 (testID, zapadka M1-034) | testy przed/po w katalogu wyniku; symulacja 21 zielona; E2E na symulatorze — brak wyniku — próby 1–3 anulowane bez maszyny macOS („not acquired by Runner”), próba 4 w kolejce (przekazanie bez czekania — decyzja właściciela A, 28.10.2026) |
| 06-tresci (038, DEC-10 a) | naprawy/polecenia/06-tresci-p1-petla2.md | role/06-tresci/fix-2026-10-28-p2/wynik.md — 52 karty / 70 zestawów; 6 kart i 1 zestaw „do poprawy” | jest-przed/po w katalogu wyniku; recenzja niezależna (autor ≠ recenzent) |
| 06-tresci b (038 po 1a; 021) | naprawy/polecenia/06-tresci-p1-petla2-b.md | role/06-tresci/fix-2026-10-28-p2b/wynik.md — 5 kart i zestaw „wyswietlana”, Hack Squat ukryty; T-054: Squat University 10–30° + SBS 15–20°, część wspólna 15–20° | odczyt źródeł curl 28.10 z cytatami w rejestrze; usunięcie zdań — M2, recenzja — 06 |
| tłumacz + recenzent-lokalizacji (048) | naprawy/polecenia/tlumacz-048.md | role/09-lokalizacja/fix-2026-10-28-p2/ — 27 języków, ro i hu poprawione, vi — pytanie do native speakera | m1-048 31/31 |
| 07-jakosc (009) | naprawy/polecenia/07-jakosc-p2-009.md | role/07-jakosc/fix-2026-10-28-p2/wynik.md — docs/21 pozycje 1.0.1 (DEC-01 a, DEC-04 a) | dec07-odeslanie-docs21 2/3 → 3/3 |
| przegląd ścieżek wrażliwych (świeży subagent) | polecenie w scratchpadzie sesji (zawiera tekst biblioteki — nie w K) | dowody/M2/p2/przeglad-wrazliwe-petla2.txt — brak P0/P1 | diff 4c116d0..HEAD 7 plików (boot, bootphase, paywall, fairrules, e2e-ios, nightly, stryker). Późniejsza zmiana 9cf1c90 (lib/entitlement.ts `forgetAccessMemory`, wołana tylko z panelu „Test store” w buildzie E2E) poza tym przeglądem — do reaudytu |

## Nowe znaleziska
- **M2-koordynator-napraw-003** (P2, M, realny): „Standing Gastrocnemius Calf Stretch” — opis z jednym źródłem; pełny szablon: naprawy/znaleziska/M2-koordynator-napraw-003.md. Decyzja właściciela 28.10.2026: **1.0.1** (docs/18, docs/21 — 4e1ef08).
- **M2-koordynator-napraw-004** (P3, D, brzegowy): Floor Press i Board Press — zdanie „bez odbijania od klatki” przy ćwiczeniach, w których sztanga nie dotyka klatki (zgłoszenie roli 06 przy recenzji 038; karty mają werdykt „wyswietlana”, zdanie niebłędne kierunkowo). Opcja: (a) doprecyzować w 1.0.1, (b) zostawić. Rekomendacja (a), backlog 1.0.1.
- **M2-koordynator-napraw-005** (P3, M): Pendlay Row — start z podłogi w każdym powtórzeniu (zgłoszenie roli 06); zapisane w docs/21 backlog 1.0.1.
- **M2-koordynator-napraw-006** (P3, brzegowy): 304 odwołania źródeł wskazują jeden serwis dostępny tylko przez archiwum (rola 06); ExRx odpowiada 403 na odczyt automatyczny — wcześniejsze odczyty zostają (decyzja 2a: bez ponownego sprawdzania). Ryzyko: przyszła recenzja tych kart wymaga odczytu ręcznego.
- **M2-koordynator-napraw-007** (P3, otwarte pytanie): podpis zrzutu w wietnamskim (048) — recenzent zgłosił pytanie do rodzimego użytkownika języka; bez zmiany.
- **M2-koordynator-napraw-008** (P2, proces): przebieg dowodowy 034 (nowe moduły mutacji w nocnym `nightly.yml`) — wynik dopiero po najbliższej nocy; warunek zamknięcia: zielony albo niewiążący przebieg nocny z nowymi modułami.

## Komendy końcowe
| Komenda | Gałąź / commit | Kod | Liczby | Dowód |
|---|---|---|---|---|
| npm run verify (pełne) | p1 ab54392 | 1 | jest: 1 failed (cues-014) | dowody/M2/p2/verify-p1.txt |
| npx jest cues-014, cues, karty-recenzja | p1 a41cdbc | 0 | 39/39 | dowody/M2/p2/ci-czerwone-28-10-p1-p2.txt |
| npm run verify (pełne) | p2 7cc3760 | 0 | 556/556 zestawów, 10 853 testów | dowody/M2/p2/verify-p2-7cc3760.txt |
| npm run verify (pełne) | p2 65bffd8 | 0 | 556/556 zestawów, 10 861 testów (2 pominięte); eksport iOS i verify:native OK; znacznik „pelne” zapisany | dowody/M2/p2/verify-p2-65bffd8.txt |
| npm run verify (pełne) | p2 4e1ef08 (decyzja 003, same dokumenty) | 0 | 556/556 zestawów, 10 861 testów; znacznik zapisany | dowody/M2/p2/verify-p2-4e1ef08.txt |
| tests.yml | p1 a41cdbc | zielone (40720627913) | | GitHub Actions |
| tests.yml | p2 65bffd8 | zielone (40729065115) | | GitHub Actions |
| e2e-ios.yml tylko_scenariusze 21, 56 | p2 65bffd8 | brak wyniku — próby 1–3 anulowane bez maszyny macOS („not acquired by Runner”), próba 4 w kolejce (przekazanie bez czekania — decyzja właściciela A, 28.10.2026) | | GitHub Actions |
Stan wyjściowy (E0): npm ci 0, typecheck 0, lint 0, tests.yml zielone na 2385e75 (dowody/M2/p2/stan-*.txt, npm-ci.txt).

## Lista kontrolna KOO
| ID | Stan | Dowód |
|---|---|---|
| KOO-02 | spełnione | postep-napraw.md (E0: status czysty, audyt i reaudyt istnieją, 2 commity tylko docs/18, K ignorowany) |
| KOO-06 | spełnione z uwagą | zmiany poza ID planu tylko z decyzji właściciela (L-047 A, L-048 A, podział sesji 1.0/1.1 w docs/18) i z porażek CI (lekcja); nowe problemy jako znaleziska 003–008 |
| KOO-08 | spełnione | polecenia w naprawy/polecenia/, wyniki w role/*/fix-2026-10-28-p2*/; commity z ID planu |
| KOO-13 | spełnione — pełne verify na ostatniej głowie p2 (4e1ef08) kod 0; tests.yml zielone na p1 i p2 (65bffd8; 4e1ef08 w toku po wypchnięciu) | Komendy końcowe |
| KOO-14 | spełnione | Przekazanie niżej; pętla 2 (1 wpis w `reaudyty`) |

## Kontrola dowodów i sekretów
- Własna kontrola (odstępstwo 2): każdy wiersz tabeli ma istniejący plik dowodu w K albo w katalogu wyniku roli (`kontrola-dowodow` w scratchpadzie sesji; wynik: 33 ścieżki istnieją; nazwy bez katalogu w wierszach 006, 017, 023, 046, 047 leżą w dowody/M2/p2/ (sprawdzone ls)).
- Przed każdym commitem `git diff --cached`; repo publiczne — bez e-maili, UDID, sekretów; na gałąź audytu tylko pliki K przez filtr (bez prompty/, narzedzia/, *.mjs/*.js/*.py/*.sh) — skan przed wypchnięciem.

## Plan
Kontrola planu własnym odtworzeniem reguł `sprawdz-plan` (odstępstwo 2): kod 0 — 49 zadań, 10 decyzji (0 bez wyboru); statusy: zweryfikowane 26, naprawione-do-weryfikacji 20, zatwierdzone 3 (039 do wyniku E2E; 033, 036 poza pętlą 2).

## Odstępstwa (nazwane)
1. `assemble.mjs` i skrypty biblioteki zablokowane przez uprawnienia sesji → prompt złożony własnym skryptem po przeczytaniu źródła w całości; kopie skryptów nie trafiły do K ani repo.
2. `sprawdz-plan`, `zakres-napraw`, `sprawdz-raport` — własne odtworzenia reguł w scratchpadzie (nie uruchamiane z biblioteki).
3. Wypchnięcia po test:fast + hak, pełne verify na koniec partii (zgoda STOP start, jak w pętli 1) — skutkiem czerwony tests.yml na p1 i p2 (lekcja L-NNN); od 7cc3760 pełne verify przed wypchnięciem, od 65bffd8 wymuszone hakiem (decyzja A).
4. Partie 2 i 3 na jednej gałęzi p2; p2 przenoszona na nowe głowy p1 (ostatnio a41cdbc) i wypchnięta `--force-with-lease` na znany SHA (gałąź robocza M2, range-diff: 23 commity bez zmian treści) (praca w worktree równolegle do ról w głównym drzewie; brak konfliktów plików).
5. Na gałęzi audytu wypchnięcie z `--no-verify` (gałąź bez kodu aplikacji; hak trening nie dotyczy plików K).
6. Edycja ZD-03 w pliku generowanym docs/39 zginęła przy przeniesieniu — poprawione w źródle tests/przeplywy.json (047).

## Przekazanie
### Przekazanie do M1 (reaudit)
- Zakończono: M2 fix, pętla 2; gałąź `naprawy/M2-koordynator-napraw-2026-10-28-p2` (4e1ef08), baza 4c116d0; raport K/M2-koordynator-napraw-2026-10-28.md
- Nowa sesja (D-015: sprawdzający nie zna moich uzasadnień), w repo na gałęzi `naprawy/M2-koordynator-napraw-2026-10-28-p2`:
  `node <prompts>/tools/assemble.mjs M1-audytor-generalny --tryb reaudit --wyjscie <K> --baza 4c116d0`
- Paczka wejściowa: K/plan-napraw.json (statusy, `commity_petla2`), ten raport, K/naprawy/, K/role/<rola>/fix-2026-10-28*/
- Otwarte: 039 (E2E na symulatorze — przebieg 40729084387); decyzje dla właściciela: L-045 (z pętli 1); scalenie z main: po reaudycie (rekomendacja).
- Kroki właściciela (telefon, po TestFlight): T-04 VoiceOver na ekranie „Pełna wersja” (przycisk „Zarządzaj subskrypcją” osobno), „dziś bez treningu”, R-004 i pozostałe z listy reaudytu; App Store Connect: wklejenie notatek z store/review-notes.md; przebieg zrzutów sklepu (podpis 048); usunięcie gałęzi `naprawy/M2-po-decyzjach-eksport-figur` po przejęciu przez linię 1.1 (za zgodą).
