# Reaudyt M1 pętla 2 — grupa 10-wydanie (wydanie, jakość procesu, lokalizacja, BRD)

Commit: 0a566a1 (HEAD odłączony, gałąź naprawy/duzy-tekst-trening; `main` = 5d79c3a) · Baza: 4c116d0 · Tryb: tylko odczyt, testy celowane `--maxWorkers=1`, bez pełnego Jest · Data: 29.10.2026

## Podsumowanie

Zadania planu (test akceptacyjny odtworzony na 0a566a1; 9 plików testów zadań: 85/85 zielone — dowody/jest-zadania.txt):

| Zadanie | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-006 (P1, R-010) | zweryfikowane — R-010 zamknięte z datą, zakresem i trwałym dowodem w repo; po 2385e75 brak zmian w lib/locales i lib/cues/text | docs/40-lekcje.md:22, docs/16-jezyki-i-marka.md:368, docs/lokalizacja/raport-api-2026-10-28/README.md:1, dowody/jest-zadania.txt |
| M1-audytor-generalny-009 | zweryfikowane — wpis K1 nie ma już „otwarte → M1-009”; pozycje 1.0.1 w docs/21; test dec07 3/3 | dowody/047-sonda-recznie.txt, dowody/jest-zadania.txt |
| M1-audytor-generalny-012 | zweryfikowane — bramka `check:release` działa (kod 1: R-005, R-004, R-013, R-014, R-RES) i jest krokiem listy wydania Z-25b; każde ryzyko ma stan z datą | docs/48-zgloszenie-1-0.md:95, dowody/check-release.txt (zob. 10-wydanie-701) |
| M1-audytor-generalny-017 | zweryfikowane — `check-urls.mjs` przez sieć: kod 0, 5 adresów 200, treść stron prywatności, wsparcia i espresso zgodna z site/ | dowody/check-urls.txt, docs/18-przekazanie.md:628 |
| M1-audytor-generalny-023 | zweryfikowane — tryb ścisły opisany jako pomiar, bramka App Store = pakiet pełny z jednym ponowieniem | .github/workflows/e2e-ios.yml:53, dowody/diff-workflows.txt |
| M1-audytor-generalny-034 | zweryfikowane w kodzie (5 modułów w stryker.config.json i macierzy nightly.yml, test kalendarza zielony w 3 losowych kolejnościach); przebieg dowodowy nocny — nie sprawdzono (patrz „Nie sprawdzono”) | .github/workflows/nightly.yml:77, dowody/034-kalendarz-losowo.txt, dowody/gh-nightly-runs.txt |
| M1-audytor-generalny-041 | zweryfikowane — el „1 κιλό” w etykiecie VoiceOver kroku ±, nagłówek kolumny z `adjustsFontSizeToFit` | components/WorkoutBlocks.tsx:165, dowody/jest-zadania.txt |
| M1-audytor-generalny-045 | zweryfikowane — notatki EN prowadzą do „See Pro plans” / „Your plan: …”; 16 etykiet z notatek istnieje w lib/i18n.en.ts | store/review-notes.md:34, lib/i18n.en.ts:1192, dowody/jest-zadania.txt |
| M1-audytor-generalny-047 | zweryfikowane — sonda: na docs/18 z 2385e75 sprawdzenie wskazuje 5 nieaktualnych „otwarte → ID” (034, 017, 009, 024, 006), na HEAD 0; płytka kopia → null | scripts/decyzje.mjs:110, dowody/047-sonda-recznie.txt |
| M1-audytor-generalny-048 | zweryfikowane — „szablony” w 29 językach bez obietnicy gotowych szablonów (PL „Twoje szablony w folderach”); vi — otwarte pytanie (M2-koordynator-napraw-007, P3) | store/screenshot-captions.json, dowody/jest-zadania.txt |

Nowe znaleziska:

| ID | Poziom | Realność | Opis | Dowód |
|---|---|---|---|---|
| 10-wydanie-701 | P2 | realny | R-RES (blokujące ryzyko, kopia ratunkowa bazy) nie ma kroku w docs/48 ani scenariusza: `check:release` w Z-25b zablokuje zgłoszenie bez zaplanowanej drogi zamknięcia | docs/40-lekcje.md:36, dowody/check-release.txt, dowody/docs48-pr85.md |

## Kroki właściciela

**Źródło stanu.** Na audytowanym commicie 0a566a1 docs/48 **nie ma kolumny „Stan”**. Stan jest zapisany tylko w ostatniej kolumnie, w 6 wierszach: docs/48-zgloszenie-1-0.md:59 (Z-01), :61 (Z-03), :70 (Z-10b), :84 (Z-15), :94 (Z-25), :98 (Z-27). Kolumna „Stan (28.10.2026)” z regułą (zrobione / w toku / otwarte / do potwierdzenia, z datą i dowodem) jest w otwartym PR #85 (`naprawy/M2-telefon-do-main`, head ba3b535, niescalony). Kopia pliku: dowody/docs48-pr85.md (wiersz 72 — reguła, wiersze 76–139 — stany). Reguła „jedyne źródło stanu = kolumna Stan” nie występuje w CLAUDE.md na 0a566a1. Tabela niżej podaje stan **dokładnie wg kolumny z PR #85**. Obok jest stan na HEAD i porównanie u źródła. Bez scalenia PR #85 docs/48 na `main` nadal nie ma stanów Z-11–Z-23. To ta sama luka, przez którą pętla 1 pokazała zrobione kroki jako niezrobione.

Kroki przed zgłoszeniem (fazy A i B), w których jest właściciel:

| Krok | Stan wg kolumny „Stan” (PR #85) | Stan na HEAD 0a566a1 | Porównanie u źródła |
|---|---|---|---|
| Z-01 scalenie zakresu do main | w toku | docs/48-zgloszenie-1-0.md:59 — zgoda na scalenie pętli 2 | zgodne: #80, #81, #82, #84 scalone, #83 (duży tekst) otwarty, main = 5d79c3a (dowody/gh-pr-list.txt) |
| Z-07 zatwierdzenie `release` (build 1.0) | otwarte | brak wpisu | brak kandydata; zgodne |
| Z-08 telefon (docs/39 + R-004, R-013, R-014) | w toku — R-004 i R-014 zamknięte 28.10 | brak wpisu; na HEAD docs/40 R-004 i R-014 nadal otwarte | rozbieżność tylko przez niescalony PR #85 — `check:release` na HEAD wymienia R-004 i R-014 (dowody/check-release.txt) |
| Z-09 zakup w piaskownicy | częściowo | brak wpisu | nie da się sprawdzić z repo (wpisy z 27.10 w docs/18) |
| Z-10b ceny a espresso | zrobione 28.10 | docs/48-zgloszenie-1-0.md:70 — zrobione | zgodne z docs/18 (wariant A) |
| Z-11 umowy | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589 |
| Z-12 Small Business Program | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589 |
| Z-13 wersja 1.0 w ASC | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589; app.json = 1.0.0 |
| Z-14 metadane (zatwierdzenie zapisu) | otwarte | brak wpisu | zgodne (zapis po buildzie kandydata) |
| Z-15 Copyright, Marketing URL | zrobione 28.10 | docs/48-zgloszenie-1-0.md:84 — zrobione | zgodne |
| Z-16 zrzuty (zatwierdzenie) | w toku | brak wpisu | podpis 048 zmieniony po 27.10 — potrzebny nowy przebieg zrzutów (docs/18, wpis 048) |
| Z-17 prywatność aplikacji | zrobione 26.10 | brak wpisu (kolumna „Kto”: „zweryfikować, że opublikowane”) | potwierdzone: docs/18-przekazanie.md:589 („opublikowana”) |
| Z-18 adres polityki i wsparcia | zrobione 26.10; treść aktualna 28.10 | brak wpisu | potwierdzone: check-urls kod 0 dziś (dowody/check-urls.txt) |
| Z-19 ocena wieku | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589 |
| Z-20 kategoria | zrobione 26.10 | „(wpisane)” | potwierdzone: docs/18-przekazanie.md:589 |
| Z-21 cena, dostępność | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589 |
| Z-22 wyrób medyczny „No” | zrobione 26.10 | brak wpisu | potwierdzone: docs/18-przekazanie.md:589 |
| Z-23 status tradera | zrobione 26.10 | „zweryfikowany 20.10” | potwierdzone: docs/18-przekazanie.md:589 |
| Z-24 zakupy (lokalizacje IAP) | otwarte | brak wpisu | zgodne |
| Z-25 App Review Information | częściowo 28.10 (Notes po scaleniu) | docs/48-zgloszenie-1-0.md:94 — częściowo | zgodne; notatki do wklejenia są aktualne (045) |
| Z-25a wygaszenie buildów 1031, 1032 | otwarte | brak wpisu | zgodne |
| Z-26 build do wersji | otwarte | brak wpisu | zgodne (brak kandydata) |
| Z-27 wydanie ręczne | zrobione 28.10 | docs/48-zgloszenie-1-0.md:98 — zrobione | zgodne |
| Z-28 zakupy w zgłoszeniu | otwarte | brak wpisu | zgodne |
| Z-29 „Submit for Review” | otwarte | brak wpisu | zgodne |

Wynik: 25 kroków przed zgłoszeniem z udziałem właściciela. 13 zrobionych (Z-10b, Z-11, Z-12, Z-13, Z-15, Z-17–Z-23, Z-27). **12 otwartych** wg kolumny „Stan”: 7 „otwarte” (Z-07, Z-14, Z-24, Z-25a, Z-26, Z-28, Z-29) i 5 „w toku / częściowo” (Z-01, Z-08, Z-09, Z-16, Z-25). Faza C (po zgłoszeniu): 8 wierszy, wszystkie otwarte, zgodnie z naturą kroków. Poza tabelą: R-RES nie ma kroku (10-wydanie-701).

## Przegląd różnicy

- **Workflowy** (dowody/diff-workflows.txt). `e2e-ios.yml`: zmiana tylko komentarzy i opisu wejścia `tryb_scisly`, bez zmian logiki. `nightly.yml`: 5 nowych modułów w macierzy mutacji (`state/migrate` daje ścieżkę `lib/state/migrate.ts`; nazwa artefaktu z `job-index`, więc „/” nie przeszkadza). Bez nowych sekretów i uprawnień: `permissions` bez zmian, `issues: write` nadal tylko w zadaniu „zgloszenie”. Przebieg dowodowy: dla `nightly.yml` nie było przebiegu przed scaleniem (#80, 19:03 UTC 28.10). Ostatni przebieg nocny to 03:21 UTC 28.10 na 025a50b, który nie zawiera 9511202 (dowody/gh-nightly-runs.txt). Koordynator zgłosił to sam (M2-koordynator-napraw-008, P2), więc nie zgłaszam ponownie.
- **Hak i znacznik L-049** (scripts/hooks/pre-push:35, scripts/verify-znacznik.mjs:43). Sonda (dowody/sonda-znacznik.txt): brak znacznika → kod 1; znacznik „dokumenty” przy zmianach kodu → kod 1; znacznik „pelne” → kod 0. Znacznik zapisuje się tylko po całym łańcuchu `verify` (`&&`) i tylko przy czystej kopii roboczej, a drzewo commitu wiąże go ze stanem plików. Obejścia są tylko jawne: `--no-verify` i `VERIFY_ZNACZNIK_PLIK`. Commit z samymi dokumentami przechodzi ze znacznikiem `verify:docs`, gdy cała różnica od origin/main to dokumenty. Commit z dokumentami na gałęzi, która ma już niescalony kod, wymaga pełnego verify. To ta sama definicja co w verify-docs.mjs przed zmianą, nie regresja. Testy haka, verify-docs, pochodne, l048 i review-notes: 119/119 (dowody/jest-hak-skrypty.txt).
- **check:decyzje / 047.** W płytkiej kopii sprawdzenie „otwarte → ID” po cichu się pomija. Ta kopia audytu też jest płytka, więc `check:decyzje` = kod 0 bez tego sprawdzenia. Odtworzyłem je ręcznie z `git log` (dowody/047-sonda-recznie.txt). Ograniczenie jest nazwane w scripts/decyzje.mjs:106, bez znaleziska.
- **verify:docs** w kopii bez `origin/main` kończy się nieobsłużonym wyjątkiem `git merge-base` (dowody/verify-docs.txt). W normalnej kopii tego nie ma; hak przechwytuje błąd (`> /dev/null`). Uwaga środowiskowa, bez znaleziska. Pliki śledzone bez zmian (dowody/git-status-koniec.txt).
- **Wyniki kontroli:** `check:decyzje` 0 (365 wpisów), `check:i18n` 0, `check:matrix` 0 (2666 pozycji, bez testu 0), `check:readme` 0, `check:claims` 0, `check:slowniki` 0, `check:pochodne` 0 (16 kroków), `check:zrodla-runtime` 0, `check:release` 1 (oczekiwane: 5 otwartych ryzyk), kontrola BRD: 0 błędów i 1 uwaga RD-09, ta sama na 4c116d0 (dowody/kontrola-brd.txt). Pliki: dowody/check-decyzje.txt, check-i18n.txt, check-matrix.txt, check-readme.txt, check-claims.txt, check-slowniki.txt, check-pochodne.txt, check-zrodla-runtime.txt.
- **BRD.** Zmiany zachowania z różnicy mają scenariusze w docs/brd: bramka 4 kart, Zarządzaj subskrypcją z VoiceOver, były subskrybent, kod diagnostyczny, limit 200% w AppText (docs/brd/wymagania.md:860).
- **docs/lokalizacja.** 36 plików raportu API z 28.10 i konteksty.json, bez sekretów i danych osobowych. Testy public-repo, zrodla-wiedzy i slownik-terminow: 167/167 (dowody/jest-publiczne.txt).
- **Drobne, bez ID (P3, istniały na 4c116d0):** CLAUDE.md:19 opisuje hak jako „lint, check:readme, check:matrix, ok. 35 s”, a od 28.10 hak to znacznik + lint + check:pochodne (ok. 80 s). docs/16-jezyki-i-marka.md:374 wiąże „przegląd native speakerów nadal niewykonany” z R-010, choć R-010 zamyka przegląd przez Claude (:368). Komentarz w tests/m1-041-el-jednostka.test.ts:6 podaje `minimumFontScale 0,7`, którego nie ma w components/WorkoutBlocks.tsx:165 (bez wpływu: iOS zmniejsza krój bez dolnej granicy).

## Znaleziska

### 10-wydanie-701

- **Poziom:** P2 (ŚREDNIE — proces wydania; samo w sobie nie psuje danych). **Realność:** realny — dotyczy najbliższego zgłoszenia. **Istniało na 4c116d0** (R-RES dopisane 27.10).
- **Opis:** `check:release` (Z-25b, docs/48-zgloszenie-1-0.md:95) blokuje zgłoszenie przy otwartym ryzyku.
  R-RES w docs/40-lekcje.md:36 ma stan „otwarte (27.10.2026)”, a warunek zamknięcia to „przebieg na symulatorze albo telefonie, w którym kopia ratunkowa powstaje”, z folderem widocznym w Plikach.
  Bramka blokuje zgłoszenie, dopóki R-RES jest otwarte (dowody/check-release.txt). Ani lista docs/48 (HEAD i PR #85, dowody/docs48-pr85.md), ani docs/39 i docs/49, ani `.maestro/` czy `tests/przeplywy.json` nie mają kroku ani scenariusza, który ten warunek wykona (grep „R-RES|rescue|ratunkow”: brak trafień). Dla porównania R-004, R-013 i R-014 mają krok Z-08, a R-005 — Z-06 (sekcja 7 docs/48).
- **Kroki:** przygotowanie kandydata → Z-25b `npm run check:release` → kod 1 z R-RES. W planie nie ma kroku, który daje dowód, więc zostaje albo zatrzymanie zgłoszenia, albo zamknięcie wpisu bez dowodu.
- **Test akceptacyjny:** w docs/48 (kolumna „Stan”) jest krok zamykający R-RES z wykonawcą (scenariusz Maestro z bazą zastąpioną plikiem nie-SQLite albo punkt listy telefonu z „Pliki → Trening → Backup → Rescue-…”). Inne wyjście: R-RES odroczone decyzją właściciela z datą. Strażnik: każde ryzyko otwarte w docs/40 jest wymienione w docs/48 (kroki albo sekcja 7).

## Nie sprawdzono

- **034 — przebieg dowodowy mutacji nocnych z 5 nowymi modułami.** Żaden przebieg `nightly.yml` nie obejmuje jeszcze 9511202. Ostatni: 40626206591, 03:21 UTC 28.10, sha 025a50b (dowody/gh-nightly-runs.txt). Warunek: pierwszy przebieg harmonogramu na `main` po #80 (spodziewany ok. 02:41 UTC 29.10) z zadaniami `mutacje (main, access|entitlement|guard|csvimport|state/migrate)`, każde z raportem i w limicie 300 min, oraz podsumowaniem z wynikiem wobec progu `break` 40. Stryker lokalnie nie uruchamiany (koszt).
- **Stan u źródła w App Store Connect** (Z-09, Z-14, Z-16, Z-24, Z-25 Notes) — poza zasięgiem repo i API GitHub.
- **apps4brew-www PR #2** — API dla tego repo niedostępne w tej sesji (dowody/gh-pr-list.txt). Treść na żywo potwierdza `check-urls` kod 0.
- **verify:docs na tej kopii** — brak `origin/main` w płytkiej kopii (dowody/verify-docs.txt). Plan względem 4c116d0: dowody/verify-docs-plan-4c116d0.txt (zmiany nie tylko w dokumentach, więc ścieżka pełnego verify).

## Kontrola dowodów i sekretów

- Każde twierdzenie ma plik dowodu w dowody/ albo odwołanie plik:linia. Wynik skryptu sprawdzającego: dowody/sprawdz-raport.txt (kod 0).
- Różnica 4c116d0..HEAD (docs, scripts, store, CLAUDE.md, README, workflowy) przeszukana pod kątem kluczy, tokenów, e-maili poza adresem wsparcia i UDID: brak trafień. Raport bez danych osobowych i bez nazw innych aplikacji.
- `git status --porcelain` na starcie i końcu puste (dowody/git-status-start.txt, dowody/git-status-koniec.txt). Pliki śledzone nie były zmieniane, `verify:docs` nic nie zapisał.
