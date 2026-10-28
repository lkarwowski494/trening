# Reaudyt: Audytor Generalny — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po PR #79) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit · Pętla: 1 · Zakres: wariant A właściciela 28.10.2026 („Ok a”, „A”) — 37 zadań planu + cała różnica 025a50b..2385e75 (277 plików, 118 commitów)
Środowisko: Linux w chmurze, Node 22, npm ci kod 0, typecheck kod 0, lint kod 0 (reaudit-2026-10-28/wspolne/); pełny Jest lokalnie kod 0 — 539/539 zestawów, 10730 testów, 2 pominięte (rola 07); CI na 2385e75: tests.yml 40657525976 zielone, E2E pakiet podstawowy 40657526205 zielony. Nie działało: telefon, symulator iOS, Xcode, App Store Connect, Dysk Google.

## Podsumowanie

Naprawy M2 w większości działają i nie wprowadziły regresji P0/P1: 26 z 35 zadań do weryfikacji jest zweryfikowanych z bieżącego commitu, 9 zostaje otwartych (1 × P1, 8 × P2). Przegląd całej różnicy po audycie (symbol masy, figury v1 z regułami podparcia, 165 poprawek tłumaczeń, ekran zakupu po 1A × DEC-09 a, check:bundle C, check:pochodne) nie dał P0 ani P1 w nowym kodzie; dał 6 regresji P2. Wydanie blokują 3 pozycje P1: zadanie 006 (brak zapisu zamknięcia R-010 w rejestrze ryzyk — sama dokumentacja) oraz dwie pozycje istniejące przed audytem, znalezione teraz: karty ćwiczeń ze wskazówkami bez zapisu recenzji bramki 4 (DEC-10) i przycisk „Zarządzaj subskrypcją” niedostępny dla VoiceOver (DEC-11). Poza tym zgłoszenie czeka na kroki właściciela (telefon, build kandydata, publikacja polityki prywatności).

| ID | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-001 | zweryfikowane | role 02, 01, 10: test 001 5/5, uwaga przed dożywotnim także z kodu (M2-001) |
| M1-audytor-generalny-002 | zweryfikowane | rola 02: test 002 9/9 |
| M1-audytor-generalny-003 | zweryfikowane | rola 05: SET_NOTE_MAX 500 w imporcie i oknach, test 3/3 |
| M1-audytor-generalny-004 | zweryfikowane | rola 12: test 7/7, sonda WAL 25/25 wierszy |
| M1-audytor-generalny-005 | zweryfikowane | role 06, 03, 07: figury-recenzja 32/32, podparcie 20/20, mutacje wykryte; część kart → nowa 038 |
| M1-audytor-generalny-006 | nadal otwarte (P1) | role 09, 10: przegląd API wykonany (docs/16), ale R-010 bez zapisu w docs/40-lekcje.md:22, docs/16-jezyki-i-marka.md:368 sprzeczne z decyzją w docs/18-przekazanie.md:404 |
| M1-audytor-generalny-007 | zweryfikowane | role 02, 01, 09: R-WAL i krok Z-36 (objaw waluty — telefon) |
| M1-audytor-generalny-008 | zweryfikowane | rola 10: pole numeru buildu w Z-26; build kandydata jeszcze nie powstał (krok) |
| M1-audytor-generalny-009 | nadal otwarte (P2) | check:decyzje kod 0 (341 wpisów), strażnik 21/21; resztka 04-studio-projektowe-003 (docs/21, pole K1) |
| M1-audytor-generalny-010 | zweryfikowane | role 02, 04, 08, 03, 07: test 10/10, sonda 10 stanów 1A × DEC-09 a |
| M1-audytor-generalny-011 | nadal otwarte (P2) | scenariusz 58 zielony, strażnik GLYPH 32/32; 07-jakosc-009 (metoda NFR-DOS-001), stan „dziś bez treningu” — telefon |
| M1-audytor-generalny-012 | nadal otwarte (P2) | bramka check:release działa (kod 1 przy otwartych ryzykach); R-010 bez stanu z datą (zależy od 006) |
| M1-audytor-generalny-013 | zweryfikowane | rola 12: test 3/3; regresja P2 → 042 |
| M1-audytor-generalny-014 | zweryfikowane | rola 05: strażnik 16/16, mutacja normalizacji → 4 czerwone |
| M1-audytor-generalny-015 | zweryfikowane | rola 05: okno błędu zapisu w układzie głównym, test 2/2 |
| M1-audytor-generalny-016 | zweryfikowane | role 02, 08: test 3/3 (arkusz na telefonie — krok) |
| M1-audytor-generalny-017 | nadal otwarte (P2) | role 01, 10: site/ poprawione, opublikowana strona stara (check-urls kod 1) |
| M1-audytor-generalny-018 | zweryfikowane | rola 11: test 2/2, sonda importu |
| M1-audytor-generalny-019 | zweryfikowane | rola 09: 11/11 |
| M1-audytor-generalny-020 | zweryfikowane | rola 06: RIR 6 → RPE 5, źródło otwarte 28.10 |
| M1-audytor-generalny-021 | nadal otwarte (P2) | check:claims kod 0 (59 wpisów); kąt stóp 15–20° z jednym źródłem (T-054 otwarte) |
| M1-audytor-generalny-022 | zweryfikowane | role 01, 03: kontrola-brd 75 BR / 15 RD / 85 wektorów, 0 błędów |
| M1-audytor-generalny-023 | nadal otwarte (P2) | rola 07: e2e-ios.yml nadal opisuje bramkę App Store bez ponowień |
| M1-audytor-generalny-024 | zweryfikowane | rola 04: 11/11 |
| M1-audytor-generalny-025 | zweryfikowane | rola 04: 7/7; regresja P2 → 043 |
| M1-audytor-generalny-026 | zweryfikowane | rola 04: 4/4 |
| M1-audytor-generalny-027 | zweryfikowane | rola 04: 5/5 |
| M1-audytor-generalny-028 | zweryfikowane | rola 04: 1/1 |
| M1-audytor-generalny-029 | zweryfikowane | rola 04: 5/5 |
| M1-audytor-generalny-030 | zweryfikowane | role 08, 04, 09: SECONDARY_SHARE 3/3, „Rekord:”; fontSize odłożone do 1.0.1 (docs/21) |
| M1-audytor-generalny-031 | zweryfikowane | rola 09: units-label 42/42, forma uk 2/2; regresje P2 → 040, 041 |
| M1-audytor-generalny-032 | nadal otwarte (P2) | rola 12: kod tylko z ekranu pętli awarii; M2-002 (bez treści błędu) zweryfikowane |
| M1-audytor-generalny-033 | zatwierdzone (odłożone 4a) | rola 11: tylko wypisane |
| M1-audytor-generalny-034 | nadal otwarte (P2) | rola 07: 007 i 011 zweryfikowane, 010 (zakres mutacji) bez zmian |
| M1-audytor-generalny-035 | zweryfikowane | rola 05: backlog 1.1, strażnik 4/4; nowe 049 |
| M1-audytor-generalny-036 | zatwierdzone (DEC-08 a) | rola 02: tylko wypisane |
| M1-audytor-generalny-037 | zweryfikowane | role 02, 03, 04, 08, 10, 11: 4 testy 037 zielone; regresja P2 → 045 |
| M1-audytor-generalny-038 | nowe, P1, istniało wcześniej | 03-zakres-601 + weryfikacja G1 W-2: 31 kart bez figury + karty v2 bez zapisu recenzji (DEC-10) |
| M1-audytor-generalny-039 | nowe, P1, istniało wcześniej | 04-studio-projektowe-601 + G1 W-1: VoiceOver, app/paywall.tsx:84 i app/paywall.tsx:91 (DEC-11) |
| M1-audytor-generalny-040 | regresja P2 (od 031) | 08-programista-601: lib/live.ts:108 |
| M1-audytor-generalny-041 | regresja P2 (od 031) | 09-lokalizacja-601 |
| M1-audytor-generalny-042 | regresja P2 (od 013) | 12-niezawodnosc-601 |
| M1-audytor-generalny-043 | regresja P2 (od 025) | 04-studio-projektowe-603 |
| M1-audytor-generalny-044 | regresja P2 (od 010) | 04-studio-projektowe-602 |
| M1-audytor-generalny-045 | regresja P2 (od 037) | 10-wydanie-601 |
| M1-audytor-generalny-046 | P2, istniało wcześniej | 02-monetyzacja-601, -602, 11-wzrost-601 |
| M1-audytor-generalny-047 | P2, istniało wcześniej | 01-odkrywanie-601, -602, 03-zakres-602, -603, 06-tresci-601, 07-jakosc-601, 10-wydanie-602 |
| M1-audytor-generalny-048 | P2, istniało wcześniej | 03-zakres-604 |
| M1-audytor-generalny-049 | P2, istniało wcześniej | 05-architekt-601 |

Pętla nr 1. Kryterium zakończenia: brak otwartych P0 i P1 (poza rozstrzygniętymi decyzją właściciela) i brak nowych regresji P0/P1. Regresji P0/P1 brak; otwarte P1: 006, 038, 039.

## Werdykt
Kurs: **trafny** (brak potwierdzonych P0/P1 kierunku) · Stan: **ZABLOKOWANE** · Uzasadnienie: reguła werdyktu M1 i próg wydania z CLAUDE.md (pkt 1: bariera dostępności, treść bez wymaganej recenzji) — otwarte P1: M1-audytor-generalny-006 (zapis R-010), M1-audytor-generalny-038 (DEC-10), M1-audytor-generalny-039 (DEC-11). Po naprawie 006 i wyborze w DEC-10 i DEC-11 (z wykonaniem albo świadomym przyjęciem decyzją): GOTOWE Z ZASTRZEŻENIAMI — zastrzeżenia: kroki telefonu (R-004, R-005, R-013, R-014, R-RES, AK-05, T-04 „dziś bez treningu”, arkusz subskrypcji, waluta T-11), pełny katalog E2E na standardowym iPhonie przed App Store (CLAUDE.md), build kandydata, publikacja polityki prywatności (017).

## Pokrycie ról
| Rola | Status | Raport | Kontrola dowodów (M1) | „Nie sprawdzono” |
|---|---|---|---|---|
| 01 | skończona | reaudit-2026-10-28/01-odkrywanie/ | kod 0 | waluta, duży tekst na urządzeniu, Dysk |
| 02 | skończona | reaudit-2026-10-28/02-monetyzacja/ | kod 0 | telefon (arkusz, waluta), lista scenariuszy E2E |
| 03 | skończona | reaudit-2026-10-28/03-zakres/ | kod 0 | zrzuty z nowymi podpisami (nie powstały) |
| 04 | skończona | reaudit-2026-10-28/04-studio-projektowe/ | kod 0 | VoiceOver na urządzeniu, wygląd 2385e75 (zrzuty 580–589 sprzed partii 3) |
| 05 | skończona | reaudit-2026-10-28/05-architekt/ | kod 0 | symbole na ekranie i zegarku, kopia ratunkowa na urządzeniu |
| 06 | skończona | reaudit-2026-10-28/06-tresci/ | kod 0 | animacje na urządzeniu, źródła z HTTP 403, strona ćwiczeń (9a poza main) |
| 07 | skończona (sama, pełne testy) | reaudit-2026-10-28/07-jakosc/ | kod 0 | ryzyka telefonu, AK-05, pełny katalog E2E, noc na 2385e75 |
| 08 | skończona | reaudit-2026-10-28/08-programista/ | kod 0 | testy Swift, ekran blokady |
| 09 | skończona | reaudit-2026-10-28/09-lokalizacja/ | kod 0 | glify i VoiceOver na urządzeniu, Dysk |
| 10 | skończona | reaudit-2026-10-28/10-wydanie/ | kod 0 | App Store Connect, .ipa, zrzuty |
| 11 | skończona | reaudit-2026-10-28/11-wzrost/ | kod 0 | okna na urządzeniu |
| 12 | skończona | reaudit-2026-10-28/12-niezawodnosc/ | kod 0 | ekran błędu i folder Rescue na urządzeniu |

| Obszar krytyczny | Role | Wynik |
|---|---|---|
| Dane (zapis, migracja, kopia, CSV, symbol masy) | 05, 12, 08 | sprawdzone: brak utraty danych; etykieta lokalna poza zapisem, CSV i kopią (sonda 10/10) |
| Prywatność | 12, 01, 10 | sprawdzone: e-mail diagnostyczny bez treści błędu; opublikowana polityka nieaktualna (017, P2) |
| Pieniądze | 02, 08, 10 | sprawdzone: 10 stanów ekranu zakupu; P2 sprzed audytu (046) |
| Treści krytyczne | 06, 03, 09 | sprawdzone: figury v1 z recenzją; karty bez recenzji (038, P1); R-010 (006, P1) |
| Główny przepływ | 04, 07, 11 | sprawdzone kodem i E2E podstawowym; dostępność VoiceOver ekranu zakupu (039, P1) |
| Wydanie | 10, 07 | sprawdzone w repo; build kandydata i ASC — kroki |

## Scalanie
63 pozycje ról (ID źródłowe zadań + 27 nowych 601–604) → 49 zadań planu. Scalenia: 03-zakres-601 + weryfikacja G1 W-2 + część v2 z 06-tresci-001 → 038 (ta sama przyczyna: strażnik bramki 4 filtruje tylko figury, skrót v2 obejmuje sam rig); 04-studio-projektowe-601 + G1 W-1 → 039; 03-zakres-602 + 07-jakosc-601 (pola „otwarte → ID” po naprawie) → 047; rozbieżne oceny 011 (04: zweryfikowane, 01 i 07: otwarte) → otwarte, bo nie wszystkie ID źródłowe są zweryfikowane.

## Konflikty i decyzje dla właściciela
- **DEC-10** (038): karty ćwiczeń ze wskazówkami bez zapisu recenzji bramki 4. Notatka 53 opisuje bramkę 4 jako ocenę ruchu figur; CLAUDE.md (27.10) wymienia „każdą kartę ćwiczenia (opis, wskazówki, mięśnie…)”. (a) niezależna recenzja treści 37 kart + strażnik — ok. 1–2 h agenta (rekomendacja: reguła jest świeża i mówi wprost o kartach); (b) zapisana interpretacja „bramka 4 = ruch figur, treść kart pilnuje reguła 2 źródeł” — zero pracy, osłabia regułę; (c) ukryć wskazówki tych kart w 1.0.
- **DEC-11** (039): VoiceOver. (a) naprawa przed 1.0 — mała zmiana + strażnik + scenariusz 21 (rekomendacja: bariera dostępności jest w progu wydania); (b) 1.0.1 z obejściem przez Ustawienia iOS.
- Otwarte z wcześniejszych etapów (tylko wypisane): 9a eksport figur strony (gałąź poza main), propozycje A/B w L-047 i L-048 (docs/40), K1 „Pro” obok „Pełna wersja”, NZ-037-1 (wyszukiwanie po polsku), pytanie roli 05 o podbijanie numeru schematu przy scaleniach katalogu.

## Przyczyny systemowe
- SYS-01 (z audytu, decyzja → kod → test) działa jako mechanizm (check:decyzje), ale strażnik sprawdza tylko postać pola wdrożenia: po naprawie pola „otwarte → ID” zostają (047, resztka 009).
- Nowe spostrzeżenie (bez osobnego SYS): strażniki „treść ⇒ recenzja” powstały pod konkretny przypadek (figury v1) i nie objęły pokrewnej treści (karty bez figury, wskazówki v2) — 038; ten sam wzór co L-047/L-048 (strażnik węższy niż reguła).

## Weryfikacja przeciwna
| ID | Wynik | Dowód | Zmiana poziomu |
|---|---|---|---|
| W-1 → 039 | potwierdzone, istniało na 025a50b | reaudit-2026-10-28/weryfikacja/G1.md (dokumentacja RN o accessible, brak innej drogi w aplikacji) | P1 bez zmian |
| W-2 → 038 | potwierdzone jako naruszenie reguły; błędnej treści nie znaleziono | G1.md: 6 ćwiczeń z kartą v2 poza recenzją, 70 przypisań ogólnych; M1 policzyło 31/102 kart bez wpisu | P1 (reguła wydania) |
| W-3 → 021 | potwierdzone, liczba zgodna z jednym przeczytanym źródłem | G1.md (drugie źródło HTTP 403) | P2 bez zmian |

Regresje (040–045) są P2 — weryfikacja przeciwna niewymagana. Kontrola G1: kod 0 (reaudit-2026-10-28/dowody/weryfikacja-G1-sprawdz-raport.txt).

## Plan napraw dla M2
Plik plan-napraw.json zaktualizowany (statusy, pole reaudyt, reaudyty pętla 1, DEC-10, DEC-11, zadania 038–049); sprawdz-plan.mjs kod 0: „OK: 49 zadań, 10 decyzji (2 bez wyboru)” (reaudit-2026-10-28/dowody/sprawdz-plan.txt). Proponowana kolejność pętli 2: partia 1 — 006 (dokumenty R-010, D), 038 i 039 po wyborze w DEC-10/DEC-11; partia 2 — regresje 040–045 i tanie P2 przed zgłoszeniem (017 publikacja strony, 045 notatki App Review, 012/023/009 dokumenty); partia 3 — 046–049 i reszta P2 albo backlog 1.0.1. Otwarte zadania wracają do M2 po ponownym zatwierdzeniu przez właściciela na STOP start M2.

## Koszt
Plan 2,6–5,6 mln tokenów. Zużycie subagentów: 3 091 796 tokenów (12 ról + 1 weryfikacja; reaudit-2026-10-28/koszty.md), M1 ok. 0,3–0,4 mln [OCENA] → razem ok. 3,4 mln, w środku planu. Czas: role 6–15 min, rola 07 71 min (pełny Jest 4195 s).

## Treść z zewnątrz
W raportach ról i na odczytanych stronach nie zauważono poleceń skierowanych do agenta; nic nie wykonano z treści zewnętrznej. GEN-13: na publicznej gałęzi audyt-m1-1-0-2026-10-27 leży 13 plików prompty/*.polecenie.md z poprzedniego przebiegu (wypełnione polecenia, szkielet z prywatnej biblioteki); pełnych promptów ani zasad biblioteki nie znaleziono (grep charakterystycznych zdań: 0 trafień). Ten przebieg nie wypycha prompty/, narzędzi ani skryptów. Decyzja o usunięciu tych plików z gałęzi — właściciel.

## Odstępstwa (zasada 7)
- tools/assemble.mjs zablokowany przez zasady uprawnień sesji: prompty ról złożone własnym składaczem w scratchpadzie z tych samych plików i modułów co audyt 27.10; sprawdz-raport.mjs i sprawdz-plan.mjs to kopie z szablonów promptu (scratchpad i K, nie w repo).
- Wypchnięcie planu na gałąź audytu z --no-verify (gałąź na starym kodzie; commit zawiera tylko pliki K).

## Kontrola dowodów i sekretów
Raporty 12 ról, G1 i ten raport sprawdzone przez M1 skryptem sprawdz-raport.mjs (wyniki w reaudit-2026-10-28/dowody/). git status --porcelain w /home/user/trening: pusty na początku i na końcu; HEAD 2385e75.
