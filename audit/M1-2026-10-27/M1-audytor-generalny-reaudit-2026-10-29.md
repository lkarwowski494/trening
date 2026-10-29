# Reaudyt: Audytor Generalny — Trening — 2026-10-29
Commit: 0a566a1848bc44139f27ec2f3fcdc3e49922f901 (naprawy/duzy-tekst-trening = main 5d79c3a + PR #83; HEAD odłączony) · Baza: 4c116d0 · Tryb: reaudit · Pętla: 2 · Zakres: decyzja właściciela 28.10.2026, tryb nocny (docs/18-przekazanie.md:641), wariant A jak w pętli 1: 20 zadań `naprawione-do-weryfikacji` i 039 oraz cała różnica 4c116d0..0a566a1 (175 plików, 60 commitów) z próbką regresji. Zadania 033 i 036 były poza pętlą.
Środowisko: Linux w chmurze, Node 22. npm ci, typecheck i lint dały kod 0 (reaudit-2026-10-29/wspolne/). CI na badanym commicie: tests.yml 40780525865 zielone, czyli pełne verify na 0a566a1. E2E pakiet podstawowy 40776726099 na main 5d79c3a: 14 scenariuszy, 0 ponowień (reaudit-2026-10-29/wspolne/ci-stan.txt). Pełny Jest lokalnie `--maxWorkers=1`: kod 0, 558/558 zestawów, 10 878 testów zaliczonych, 2 pominięte, 4214 s (reaudit-2026-10-29/07-jakosc/dowody/jest-pelny.txt). Pierwszy przebieg przerwał restart kontenera po 71 zestawach (0 porażek). Nie działało: telefon, symulator iOS, Xcode, App Store Connect, Dysk Google, biblioteka promptów (odstępstwo 1).

## Podsumowanie

Wszystkie 21 zadań pętli 2 są zweryfikowane na bieżącym commicie. Nowe testy są czerwone na 4c116d0 i zielone na HEAD. Przy 038 mutacja „nowa karta bez recenzji” zostaje wykryta. W całej różnicy, łącznie z torami ruchu, JM Press/Decline CG, dużym tekstem i 9cf1c90, **nie ma znalezisk P0 ani P1**. Są trzy nowe P2: jedna regresja nocnej zmiany #84, jeden nieścisły opis decyzji do weta i jedna luka procesu (R-RES bez kroku zamknięcia). Do tego jedna uwaga teoretyczna. Panel „Test store” z `forgetAccessMemory` nie jest osiągalny w buildzie sklepowym.

| Zadanie | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-006 | zweryfikowane | grupa 10: R-010 zamknięte z trwałym dowodem; docs/40-lekcje.md:22 |
| M1-audytor-generalny-009 | zweryfikowane | grupa 10: dec07 3/3, docs/21 pozycje 1.0.1 |
| M1-audytor-generalny-011 | zweryfikowane (AX5 scenariusz 58 zielony 40766078690) | grupa 04; AX1, 375 pt i „dziś bez treningu” — krok telefonu T-04 |
| M1-audytor-generalny-012 | zweryfikowane | grupa 10: check:release kod 1 (R-005, R-004, R-013, R-014, R-RES) — bramka działa |
| M1-audytor-generalny-017 | zweryfikowane | grupa 10: check-urls przez sieć kod 0, strony zgodne z site/ |
| M1-audytor-generalny-021 | zweryfikowane | grupa 06: cytat źródła odczytany niezależnie, część wspólna 15–20° |
| M1-audytor-generalny-023 | zweryfikowane | grupa 10 |
| M1-audytor-generalny-032 | zweryfikowane | grupa 02: e-mail z kodem etapu, bez treści błędu |
| M1-audytor-generalny-034 | zweryfikowane w kodzie | grupa 10; przebieg nocny z nowymi modułami nie był jeszcze uruchomiony (M2-koordynator-napraw-008) |
| M1-audytor-generalny-038 | zweryfikowane | grupa 06: 101 kart wyświetlanych = zapis recenzji; Hack Squat ukryty (bez „Technika ›”, wskazówek i figury); mutacja wykryta |
| M1-audytor-generalny-039 | zweryfikowane | grupa 04: sonda 33 trasy, żaden przycisk w grupie accessible; E2E 21 za pierwszym razem 7/7 (40776726099) |
| M1-audytor-generalny-040 | zweryfikowane | grupa 02: 5 języków czerwone na bazie, zielone na HEAD |
| M1-audytor-generalny-041 | zweryfikowane | grupa 10 |
| M1-audytor-generalny-042 | zweryfikowane | grupa 02: start bez zapętlenia |
| M1-audytor-generalny-043 | zweryfikowane | grupa 04 |
| M1-audytor-generalny-044 | zweryfikowane | grupa 04: kontrast 7,11:1 / 6,72:1 |
| M1-audytor-generalny-045 | zweryfikowane | grupa 10: 16 etykiet z notatek istnieje |
| M1-audytor-generalny-046 | zweryfikowane | grupa 02: 5 przypadków czerwone na bazie, zielone na HEAD |
| M1-audytor-generalny-047 | zweryfikowane | grupa 10: sonda 5 → 0; płytka kopia pomija sprawdzenie (nazwane w skrypcie) |
| M1-audytor-generalny-048 | zweryfikowane | grupa 10; wietnamski — otwarte pytanie P3 (M2-koordynator-napraw-007) |
| M1-audytor-generalny-049 | zweryfikowane | grupa 02 |
| M1-audytor-generalny-050 | nowe, P2, regresja 8521780 (#84) | 06-tresci-701: lib/figures/v2/ui.ts:48 |
| M1-audytor-generalny-051 | nowe, P2 (dokument decyzji do weta) | 06-tresci-702: docs/18-przekazanie.md:642 |
| M1-audytor-generalny-052 | nowe, P2, istniało wcześniej | 10-wydanie-701: docs/40-lekcje.md:36 |

Pętla nr 2. Kryterium zakończenia: brak otwartych P0/P1 i brak nowych regresji P0/P1. **Spełnione.**

## Werdykt
Kurs: **trafny** · Stan: **GOTOWE Z ZASTRZEŻENIAMI** · Uzasadnienie: próg z CLAUDE.md — brak otwartych KRYTYCZNYCH i WYSOKICH; P1 z pętli 1 (006, 038, 039) zweryfikowane. Zastrzeżenia (nie znaleziska audytu, tylko warunki wydania z CLAUDE.md i docs/48):
1. `check:release` blokuje na otwartych ryzykach. Na 0a566a1 to R-004, R-005, R-013, R-014 i R-RES. R-004 i R-014 są zamknięte w niescalonym PR #85. R-005 to krok telefonu (docs/49 T-15), R-013 krok zegarka (T-16), R-RES nie ma żadnego kroku (052).
2. Pełny katalog E2E na standardowym iPhonie przed App Store (docs/48 Z-06).
3. Build kandydata i kroki właściciela: 12 otwartych lub w toku wg kolumny „Stan” w PR #85 (sekcja „Kroki właściciela”).
4. Przebieg nocny mutacji z nowymi modułami (034) — sygnał, nie bramka.
5. Decyzje nocne do weta właściciela: JM Press i Decline CG bez rysunku (docs/18-przekazanie.md:642; opis poprawia M2 — 051) i moduły mutacji (docs/18-przekazanie.md:643).

## Pokrycie ról
| Grupa (role pętli 1) | Status | Raport | Kontrola dowodów (M1) | „Nie sprawdzono” |
|---|---|---|---|---|
| 02-monetyzacja (02, 05, 08, 12) | skończona | reaudit-2026-10-29/02-monetyzacja/ | kod 0 (reaudit-2026-10-29/dowody/kontrola-02-monetyzacja.txt) | scenariusz 56 na symulatorze, natywny .ipa |
| 04-studio-projektowe (04, 11) | skończona | reaudit-2026-10-29/04-studio-projektowe/ | kod 0 | AX1, 375 pt, „dziś bez treningu”, zagnieżdżony tekst na urządzeniu |
| 06-tresci (06, 03) | skończona | reaudit-2026-10-29/06-tresci/ | kod 0 | ponowna recenzja merytoryczna kart (poza zakresem, audyty pkt 2), tory squat wizualnie, przekłady wskazówek |
| 10-wydanie (10, 07, 09, 01) | skończona | reaudit-2026-10-29/10-wydanie/ | kod 0 | noc 034, App Store Connect, verify:docs (płytka kopia) |
| 07 — pełny Jest | skończona (M1) | reaudit-2026-10-29/07-jakosc/ | kod 0: 558/558, 10 878 testów | — |

| Obszar krytyczny | Grupy | Wynik |
|---|---|---|
| Dane (start, migracja, kod błędu) | 02 | sprawdzone: bez zapętlenia startu i bez utraty danych; e-mail tylko z kodem etapu |
| Prywatność | 02, 10 | sprawdzone: polityka opublikowana i zgodna (check-urls kod 0) |
| Pieniądze | 02 | sprawdzone: panel testowy nieosiągalny w buildzie sklepowym, 046 zweryfikowane |
| Treści krytyczne | 06 | sprawdzone: karty = zapis recenzji; tory z recenzją niezależną; JM/Decline bez rysunku |
| Dostępność | 04 | sprawdzone: VoiceOver na ekranie zakupu; duży tekst AppText w całym UI |
| Wydanie | 10 | sprawdzone w repo; R-RES bez kroku (052) |

## Scalanie
Pozycje grup: 21 zadań planu i 4 nowe ID (06-tresci-701, 06-tresci-702, 10-wydanie-701, 02-monetyzacja-701) dały 3 nowe zadania planu (050–052). 02-monetyzacja-701 (`forgetAccessMemory` bez strażnika miejsc wywołania, lib/entitlement.ts:83) jest teoretyczne: jedna linijka, bez zadania. Teoretyczne z grupy 06 (strażnik L-047 sprawdza tylko wpisy od 28.10) — też jedna linijka. Rozbieżność oceny 039: grupa 04 zapisała, że E2E nie sprawdzono (wiedziała tylko o anulowanym 40729084387). M1 ustaliło, że pakiet podstawowy z 21 przeszedł na main 5d79c3a, a M2 potwierdził to logiem e2e-wyniki: 0 ponowień.

## Konflikty i decyzje dla właściciela
- **Weto rano (decyzje nocne):** (1) JM Press i Decline CG bez rysunku w 1.0. Opinia grupy 06: rozsądne i łatwe do cofnięcia. Skutek w aplikacji: znika cała sekcja „Technika”, nie tylko rysunek (051 — M2 poprawia opis). (2) Mutacje nocne na modułach ryzyk wysokich (docs/18-przekazanie.md:643).
- **R-RES (052):** (a) scenariusz symulatora, który zamyka ryzyko automatycznie: ok. 1–2 h agenta i przebieg E2E. Rekomendacja, bo to mechanizm, a nie krok ręczny. (b) Odroczenie decyzją właściciela do 1.0.1 z zapisem. Bez kosztu, ale kopia ratunkowa nie będzie sprawdzona na urządzeniu przed premierą.
- Otwarte z wcześniejszych etapów (tylko wypisane): L-045, gałąź `naprawy/M2-po-decyzjach-eksport-figur`, pytanie o wietnamski podpis (P3).

## Przyczyny systemowe
- Nowe spostrzeżenie (bez osobnego SYS): zmiana „ukryj rysunek” (#84) przestawiła tylko komponent rysunku, a nie predykat `hasTechnique`, który decyduje o przycisku. To ten sam wzór co w 038 i L-047/L-048: mechanizm węższy niż reguła. Propozycja dla 1.0.1: jeden predykat „co jest pokazywane” (`shownFigureSpec`) używany wszędzie i strażnik, który zabrania `figureSpec` w UI.
- Stan kroków właściciela: reguła z 28.10 („jedynym źródłem jest kolumna Stan w docs/48”) istnieje dopiero w niescalonym PR #85. Na main reguły i kolumny jeszcze nie ma. Ryzyko powtórki błędu z pętli 1, dopóki #85 nie zostanie scalony.

## Weryfikacja przeciwna
Brak kandydatów P0/P1 — weryfikacja przeciwna niewymagana. Wyniki kluczowe dla „braku blokera” M1 sprawdziło samo: lib/figures/v2/ui.ts:48 (701 potwierdzone odczytem), CI 40780525865 i 40776726099 (GitHub API).

## Plan napraw dla M2
plan-napraw.json: 21 zadań → `zweryfikowane` z polem `reaudyt` (pętla 2), nowe 050–052 (P2), wpis `reaudyty` pętla 2, werdykt GOTOWE Z ZASTRZEŻENIAMI. sprawdz-plan: kod 0, „OK: 52 zadań, 10 decyzji (0 bez wyboru)” (reaudit-2026-10-29/dowody/sprawdz-plan.txt). 050 i 051 M2 naprawia po reaudycie (d65a34a, wiadomość M2 23:16 UTC) — sprawdzenie przez test + verify, bez kolejnego audytu. 052 trafia do właściciela rano.

## Koszt
Plan 1,8–4,1 mln tokenów. Subagenci: 583 905 tokenów (4 grupy, reaudit-2026-10-29/koszty.md), M1 ok. 0,2–0,3 mln [OCENA]. Razem ok. 0,8–0,9 mln, poniżej planu.

## Kroki właściciela
Źródło: kolumna „Stan” w docs/48 z PR #85 (na 0a566a1 kolumny brak; tabela i porównanie u źródła w raporcie grupy 10, reaudit-2026-10-29/10-wydanie/). Przed zgłoszeniem jest 25 kroków z udziałem właściciela: 13 zrobionych i **12 otwartych**. Otwarte: Z-07, Z-14, Z-24, Z-25a, Z-26, Z-28, Z-29. W toku lub częściowo: Z-01, Z-08, Z-09, Z-16, Z-25. Po zgłoszeniu są jeszcze 8 kroków.

## Treść z zewnątrz
W raportach grup, stronach i logach CI nie było poleceń skierowanych do agenta. Wiadomość M2 potraktowano jako dane: wynik E2E zapisano z zastrzeżeniem źródła w reaudit-2026-10-29/wspolne/ci-stan.txt.

## Odstępstwa (zasada 7)
1. `add_repo` dla biblioteki promptów odrzuciły zasady uprawnień sesji. Bez biblioteki nie dało się złożyć promptu `assemble.mjs` ani modułów ról. Zamiast tego 4 grupy ról zamiast 12, z briefami własnymi (reaudit-2026-10-29/wspolne/ustalenia.md) i szablonem raportu z pętli 1. Skrypty sprawdz-raport.mjs i sprawdz-plan.mjs pochodzą z historii gałęzi audytu (kopie z pętli 1), są w scratchpadzie i nie trafiły do K.
2. Pierwszy pełny Jest lokalny przerwany restartem kontenera; powtórka zakończona kodem 0 (558/558).
3. Wypchnięcie K na gałąź audytu z `--no-verify` (gałąź na starym kodzie, commit tylko z plikami K) — wyjątek nazwany w pętli 1.

## Kontrola dowodów i sekretów
Raporty 4 grup sprawdzone skryptem sprawdz-raport.mjs: kod 0 (reaudit-2026-10-29/dowody/). `git status --porcelain` w /home/user/trening był pusty na starcie (reaudit-2026-10-29/wspolne/git-status-start.txt) i na końcu; HEAD 0a566a1.
