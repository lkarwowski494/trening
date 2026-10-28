# 04-studio-projektowe · fix p3 (wznowienie) · M1-audytor-generalny-024…029 — wynik

Data: 27–28.10.2026 · Rola: 04-studio-projektowe, tryb fix · Zakres zatwierdzony przez właściciela 27.10.2026 (partia 3, D).
Kopia robocza: `/home/user/trening/.claude/worktrees/agent-a90e7bdbb600c35b4`, gałąź `worktree-agent-a90e7bdbb600c35b4`, baza `naprawy/M2-koordynator-napraw-2026-10-27-p3` = 4cb5a84. Bez wypychania i scalania.
Wznowienie: kopia z przerwanej sesji przepadła; materiały ze scratchpadu (wip026, wip027, rest.tar) użyte ponownie po sprawdzeniu, każdy test pokazany na czerwono od nowa na tej bazie.

| Commit | ID |
|---|---|
| 6577aa6 | M1-audytor-generalny-024 (04-studio-projektowe-005) |
| b41e44d | M1-audytor-generalny-024 — test K3 z podmienioną szerokością okna (patrz „Nowe znaleziska” 1) |
| b2afd44 | M1-audytor-generalny-025 (04-studio-projektowe-007) |
| e73df05 | M1-audytor-generalny-026 (04-studio-projektowe-009) |
| b37746a | M1-audytor-generalny-027 (04-studio-projektowe-010) |
| 6729c14 | M1-audytor-generalny-028 (04-studio-projektowe-004) |
| 1dcb400 | M1-audytor-generalny-029 (04-studio-projektowe-011) |

## ETAP 0 — środowisko i klasyfikacja
- Linux, Node 22, git (worktree), Playwright 1.63 (globalnie, przeglądarki w `/opt/pw-browsers`), bez Xcode i symulatora. Repo publiczne. Maszyna współdzielona: jest `--maxWorkers=1`, tylko testy związane; dwa razy proces jest przerwał obcy SIGTERM — zestawy powtórzone.
- Klasyfikacja: wszystkie sześć — D (naprawa w ramach systemu, bez nowego koloru i komponentu). W 029 jedna kwestia ma charakter P (ostrzejsza reguła dla podpisów startu) — niewdrożona, opcje niżej.
- Ścieżki wrażliwe (migracje, kopie, import/eksport, zakupy, workflowy, podpis): nie dotknięte — przegląd subagenta nie dotyczy.
- Zrzuty: eksport web (react-native-web) z sondą Dynamic Type roli 04 (`narzedzia/przygotuj.sh`, `narzedzia/eksport.sh`, zadania `narzedzia/jobs.json`), „przed” = 4cb5a84, „po” = 1dcb400, te same dane (`scripts/screens/seed.test.ts`), motyw ciemny. Pierwszy eksport „po” wziął stary kod z pamięci podręcznej bundlera — oba eksporty powtórzone z `--clear` (sprawdzone grepem w paczce); zrzuty porównane `cmp`.

## M1-audytor-generalny-024 (04-studio-projektowe-005): „Planowanie” w linii tytułu (DEC-07 K3 a)
- Poprawka: `app/(tabs)/index.tsx` — `PlanningButton` w wierszu `title-row` (po prawej, `marginLeft: 'auto'`), wiersz z `flexWrap`.
- Test: `tests/m3-p2-start.test.tsx` „K3 (23.10.2026)” (390 pt / skala 1 i 320 pt / skala 2). Przed: 2 czerwone, brak `planning-button` w wierszu tytułu — `dowody/024-przed.txt`; po: 43/43 w 4 zestawach (m3-p2-start, trening-naglowek, home-plan-header, home-b) — `dowody/024-po.txt`.
- Zrzuty: `zrzuty/przed/t024-390-fs1.png` (przycisk nad tytułem) → `zrzuty/po/t024-390-fs1.png` (w linii tytułu); `zrzuty/po/t024-320-fs2.png` (320 pt, tekst 200 %: przycisk przechodzi pod tytuł, nic nie ucięte).
- docs/18: wpis 21.10 i DEC-07 (23.10) — pole wdrożenia K3 → kod + test (`check:decyzje` bez błędów); docs/32 wzorzec 19 c; BRD BR-PLN-001.

## M1-audytor-generalny-025 (04-studio-projektowe-007): „Pierwsze kroki”
- Poprawka: `components/Dashboard.tsx` — krok 1 „Szablony i plan”, krok 2 „Planowanie” (oba → ekran planu, P4 A bez zmian); krok 3 z `lib/home` `mainStart` (bez szablonu: „Pusty trening”); „Przewodnik” tym samym rodzajem przycisku co pozostałe; „›” przy zdaniu o „Miejscach i sprzęcie”, ukryty dla VoiceOver.
- Test: `tests/audit-m1-025-pierwsze-kroki.test.tsx` — przed 5 z 7 czerwonych (brak „Szablony i plan”, krok 3 ze „Start”, Przewodnik `transparent` zamiast tła przycisku, brak „›”, EN) — `dowody/025-przed.txt`; po: zielony. Zmienione testy przypinające stary stan: dashboard, audit-0.10-ui H4, first-steps-empty, flows (B1, B1 EN), edit-on-demand, template-folders, scenario-full — `dowody/025-po.txt`, `dowody/025-po2.txt`, `dowody/025-po3.txt` (czerwone w `025-po.txt` przechodzą w `025-po2/3`, poza dwoma błędami sprzed tej pracy — „Nowe znaleziska” 2).
- Zrzuty: `zrzuty/przed/t025-390.png` → `zrzuty/po/t025-390.png`.
- Maestro: `.maestro/14-generator.yaml` — wejście przez „Templates and plan”. BRD BR-TRN-001.

## M1-audytor-generalny-026 (04-studio-projektowe-009): kolejność bez przeciągania
- Poprawka: `components/DragList.tsx` — przy każdym wierszu „⋯” (etykieta „Opcje ćwiczenia: {nazwa}”, 44 pt) → arkusz „Przesuń wyżej / Przesuń niżej / Anuluj” (tylko możliwe kierunki), ta sama droga zapisu co akcja VoiceOver i upuszczenie; `app/reorder.tsx` — „⋯” na końcu wiersza. Bez nowych tekstów.
- Test: `tests/audit-m1-026-kolejnosc-menu.test.tsx` — przed 4/4 czerwone (brak `move-menu-…`) — `dowody/026-przed.txt`; po zielony, z reorder-t010, haptyką, strażnikami i `maestro-flows` — `dowody/026-po.txt` (jedyny czerwony: S5, sprzed tej pracy).
- Strażnik S16 (`tests/interaction-guards.test.ts`): DragList na liście arkuszy z powodem. Maestro `.maestro/03-kolejnosc.yaml`: „Exercise options: …” → „Move down”. docs/32 wzorzec 9, BRD BR-TRN-001.
- Zrzuty: `zrzuty/przed/t026-390.png` → `zrzuty/po/t026-390.png`.

## M1-audytor-generalny-027 (04-studio-projektowe-010): pasek tygodnia 320 pt
- Poprawka: `lib/calendar.ts` — `fmtWeekdayNarrow`, `stripColumnPt`, `stripLabelsFit` i stałe paska (odstęp, wcięcie = `SPACE.s`, ramka) w jednym miejscu; szerokość skrótu szacowana zachowawczo (0,62 em na znak — przybliżenie, nie pomiar). `components/TodayPlan.tsx` — skrót w jednej linii z `adjustsFontSizeToFit`, przy braku miejsca jednoliterowy (data pod spodem, pełna nazwa w VoiceOver).
- Test: `tests/audit-m1-027-pasek-tygodnia.test.tsx` — przed 5/5 czerwonych (ekran 320 pt/130 %: „pon.” … „niedz.” bez `numberOfLines`; funkcji reguły nie było) — `dowody/027-przed.txt`; po: zielony w 14 zestawach (782 testy, jedyny czerwony: StartError, sprzed tej pracy) — `dowody/027-po.txt`.
- Zrzuty: `zrzuty/przed/t027-320-fs13.png` („SOB.NIEDZ.” zlane) → `zrzuty/po/t027-320-fs13.png` (P W Ś C P S N). BRD BR-PLN-001.

## M1-audytor-generalny-028 (04-studio-projektowe-004): stoper i RPE 44 pt
- Poprawka: `components/WorkoutBlocks.tsx` — `slopTo(w)`: `hitSlop` po bokach do `SIZE.hit` dla kolumny węższej niż cel dotyku (COMPACT 40 pt); układ bez zmian (C4 w `tests/ux.test.tsx` zielony).
- Test: `tests/audit-m1-028-cele-44-compact.test.tsx` — przed czerwony („Expected: >= 44, Received: 40”) — `dowody/028-przed.txt`; po zielony — `dowody/028-po.txt`, `dowody/028-po2.txt`. Wersja testu z przerwanej sesji przechodziła także przed poprawką (opcja `width` w `renderApp` nic nie robi) — test podmienia teraz `Dimensions`.
- Zmiana niewidoczna na zrzucie (pole dotyku) — zrzutów nie ma. BRD BR-TRN-007.

## M1-audytor-generalny-029 (04-studio-projektowe-011): ciągi „A · B · C”
- Poprawka: przecinek zamiast „·” w listach zmiennej długości — `lib/swap.ts` (powody), `app/plan.tsx` `planSummary`, `app/generator.tsx`, `components/OwnPlan.tsx` (dni), `components/ExerciseProgress.tsx` (serie), `app/exercise/[id].tsx` (partie), `components/PeriodSummary.tsx` (pobite wartości). Bez nowych kluczy.
- Strażnik: `tests/kropka-srodkowa.json` (każdy plik z „·”: liczba + powód) i `tests/audit-m1-029-kropka-srodkowa.test.ts`. Przed: 5/5 czerwonych — `dowody/029-przed.txt`; po: zielony z testami generatora, planu, zamiany, języków, regresji i Maestro — `dowody/029-po.txt` (czerwone tam: data w teście i asercje generatora — poprawione), `dowody/029-po2.txt`, `dowody/029-po3.txt` (matrix-dim-langs2 przerwany obcym SIGTERM), `dowody/029-po4.txt` (powtórzony: zielony).
- `docs/14a-e2-top3.md` wygenerowany ponownie (`UPDATE_TOP3=1`); Maestro 14-generator i `subflows/generator-plan`, `tests/maestro-center-baza.json`; docs/32 wzorzec 28 bez „[OTWARTE]”; BRD BR-PLN-001.
- Zrzuty: `zrzuty/przed/t029-gen-390.png` → `zrzuty/po/t029-gen-390.png` („pon. FBW A, śr. FBW B, pt. FBW A”). `t029-plan-390` bez zmian (`cmp`: identyczne) — ekran planu w danych zrzutów nie pokazuje listy zapisanych planów.

## Decyzja dla właściciela (P, niewdrożona) — podpisy przycisków startu
Znalezisko 011 wskazało `components/StartPanel.tsx` („dziś w planie · 8 ćw.”, „Upper A · 12.10”). To dwa pola w stałej kolejności, więc reguła DEC-17 a ich nie zakazuje; zostały z wpisem w wykazie.
- (a) zostawić, jak jest — zgodne z decyzją z 20.10, bez pracy i bez nowych tekstów;
- (b) ostrzejsza reguła: podpisy startu jako zdanie albo osobna linia („Dziś w planie, 8 ćwiczeń”) — 4 teksty × 35 języków, wyższy podpis w przycisku startu.
Rekomendacja: (a) — oszczędna forma pasuje do podpisu przycisku, a strażnik pilnuje nowych użyć.

## Nowe teksty — do recenzji lokalizacji (recenzent-lokalizacji)
Dwa klucze z commita b2afd44 w `lib/i18n.en.ts` i 31 słownikach `lib/locales/*.json` — przekład złożony z istniejących tłumaczeń „Pusty trening”, „Szablony”, „Wygeneruj szablony i plan”, bez recenzji:
1. `Szablony i plan` (EN „Templates and plan”) — przycisk kroku 1 „Pierwszych kroków”;
2. `Pierwszy trening: duży przycisk „Pusty trening” u góry.` (EN „First workout: the big “Empty workout” button at the top.”).
es-419 i pt-BR dziedziczą po es/pt. Narzędzia subagentów w tej sesji nie było — recenzja nieodbyta, do zlecenia przez koordynatora.

## Inne kontrole
`tsc --noEmit` 0 (`dowody/tsc.txt`); eslint zmienionych plików 0 błędów; `check:i18n`, `check:decyzje` (324 wpisy), `check:claims`, `check:matrix` (bez testu: 0), `check:readme`, `kontrola-brd` (0 błędów) — zielone. Pełnego `npm run verify` i pełnego jest nie uruchamiałem (maszyna współdzielona; koordynator po scaleniu). Scenariusze Maestro (03, 14, subflows/generator-plan) zmienione, nieuruchomione — do przebiegu `tylko_scenariusze`.

## Nowe znaleziska (poza zakresem, nienaprawiane)
1. **Opcja `width` w `renderApp` (tests/app.tsx) nic nie robi** (P1 dla testów, realny): testy „320 pt” renderują domyślną szerokość okna, np. `tests/trening-naglowek.test.tsx` (przypadki 320), `tests/home-plan-header.test.tsx` „320 pt: długa nazwa planu…” — fałszywie zielone testy wąskiego ekranu. Naprawa: `renderApp` podmienia `Dimensions` dla `width` + test strażnik. Testy 024/027/028 podmieniają `Dimensions` same.
2. **Dwa czerwone testy na bazie partii 3 sprzed tej pracy**: `tests/interaction-guards.test.ts` S5 — `app/_layout.tsx` `style: 'cancel'` przy „OK” (commit ca84668, M1-audytor-generalny-015); `tests/m3-token-guard.test.ts` — `components/StartError.tsx` 4 literały `fontSize` > 3 (commit dbc9f3b, M1-audytor-generalny-032). Do naprawy przez właścicieli tych ID przed verify.
3. (P2) Podpowiedź na ekranie Kolejność „Przeciągnij za ≡, by zmienić kolejność.” nie wspomina o „⋯” (`zrzuty/po/t026-390.png`). Opcja: dopisek o „⋯” (nowy tekst, 35 języków) — do decyzji.
4. (P2) Etykieta „⋯” przy supersecie brzmi „Opcje ćwiczenia: superset A: …” — istniejący klucz; osobna etykieta wymaga nowego tekstu.
5. (P2) `Btn nav` nie dokleja „›” (docs/32 wzorzec 17) — dotyczy m.in. „Planowanie” i „Szablony i plan” w „Pierwszych krokach”; zmiana komponentu wspólnego, osobna decyzja.

## Kontrola dowodów i sekretów
Wynik: `dowody/sprawdz-raport.txt`.
