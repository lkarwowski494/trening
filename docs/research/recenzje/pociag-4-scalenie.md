# Recenzja niezależna scaleń pociągu 4 (KO-020)

- autor: sesja A (e8b72515), sesja A2 (4d2e19e) — programista scalenia
- recenzent: audytor (subagent, niezależny)
- data: 10.11.2026
- gałąź: `scal/pociag-4` (bez zmian w gałęzi; jedyny zapis to ten plik)

## Zakres

1. `e8b72515` — scalenie `figury/partia-4-thruster-wl` (P2 = 06d90e84) do stanu integracji (P1 = dfaeeefe), baza 1d6352ba.
2. `4d2e19e` — scalenie `figury/partia-2` (P2 = 7a09818f) do `scal/pociag-4` (P1 = 760afa88), baza 1d6352ba.
   Commit pośredni 760afa88 zmienia tylko wyjątek rozmiaru w `tests/architecture-limits.test.ts`.

Kryteria: (a) żaden wpis żadnej ze stron nie zginął ani nie zmienił się bez wytłumaczenia, (b) liczby w testach i celach = wynik skryptów,
(c) wyjątek rozmiaru `lib/figures/v2/poseData.ts` najwęższy, (d) rozwiązania konfliktów nie zmieniają logiki inaczej niż suma obu stron.

## Metoda (komendy)

- Lista plików w konflikcie i porównanie z automatycznym scaleniem: `git merge-tree --write-tree --name-only P1 P2`, potem `git diff <drzewo auto> <scalenie>`.
  Pliki bez konfliktu są identyczne z automatycznym scaleniem (wyjątek: `tests/architecture-limits.test.ts` w 4d2e19e — przeniesiony z 760afa88 i zawężony).
- Wiersze: skrypt porównujący wielozbiory wierszy B/P1/P2/M (wiersz dodany przez stronę musi być w M; wiersz usunięty przez stronę nie może zostać; wiersze nowe w M wypisane do ręcznej oceny) dla każdego pliku w konflikcie, `docs/brd/wymagania.md`, `docs/40-lekcje.md`, `families.ts`, `poseData.ts`, `figure.ts`.
- JSON: trójstronne porównanie kluczy (spłaszczenie do 4 poziomów) dla `docs/research/figury-recenzja.json`, `tests/tor-wyjatki.json`, `docs/research/pokrycie-cele.json`, `lib/figures/v2/reguly-cwiczen.json`, `lib/figures/data.json`, `lib/cues/data.json`, `lib/figures/v2/cue-sets.json`, `tests/fixtures/figury-v2-zlote.json`, `tests/fixtures/pokrycie-katalogu-min.json`, wszystkie `data/zrodla/*.json`.
- Liczby: `node scripts/pokrycie-symulacja.mjs` na 4d2e19e (kopia robocza) i na e8b72515 (`git archive` do katalogu tymczasowego); liczenie pętli z `lib/figures/v2/poses/*.json`; przez `scripts/strona/ts-loader.mjs`: `FAMILIES` (status ready), `POSE_FAMILIES`, `ISOMETRIC`, liczba `figureSpec` po katalogu; `buildFigures` z `scripts/zrodla-runtime.mjs` (jak w `tests/recenzja-wyjatki-1-1.test.ts`).
- Generatory `--check` na obu scaleniach: `readme`, `test-matrix`, `pokrycie-katalogu`, `figures/v2-gen`, `zrodla-runtime`, `decyzje` (na 4d2e19e także `cues/gen`, `figures/gen`, `check-znaczniki-konfliktu`).
- Rozmiar: `wc -c lib/figures/v2/poseData.ts` na każdym rodzicu i scaleniu.
- Jest nie był uruchamiany (polecenie: maszyna zajęta), więc znaleziska testowe wynikają z porównania oczekiwań testu z wartością policzoną tym samym kodem, którego używa test.

## Znaleziska

| # | Poziom | Pewność | Scalenie | Znalezisko | Realność |
|---|--------|---------|----------|------------|----------|
| 1 | ŚREDNIE (blokuje zielony `tests.yml` i `scal-galaz`, nie wydanie) | 95% | 4d2e19e | `tests/figures-v2-mapping.test.ts:45` — kolejność listy rodzin `ready` nie odpowiada kolejności w `families.ts` | realny (każdy przebieg Jest) |
| 2 | ŚREDNIE (blokuje zielony `tests.yml` i `scal-galaz`, nie wydanie) | 95% | 4d2e19e | `tests/recenzja-wyjatki-1-1.test.ts:97` — zgubione oczekiwanie strony partii 2 (pushup_plank, mobility_floor, mobility_stand) | realny (każdy przebieg Jest) |
| 3 | NISKIE | 95% | e8b72515 | Commit scalenia nie przechodzi limitu rozmiaru (`poseData.ts` 22 081 B > 20 480 B bez wyjątku); naprawione dopiero w 760afa88 | brzegowy (tylko przy sprawdzaniu samego e8b72515, np. `git bisect`) |
| 4 | NISKIE | 90% | e8b72515 (przechodzi do 4d2e19e) | `docs/research/pokrycie-cele.json` `wersje.1.1.opis` — zginęły 2 zdania historii strony partii 4 | teoretyczny dla danych, dotyczy tylko historii w dokumencie |
| 5 | NISKIE | 90% | e8b72515 | Wpisy decyzji KO-012 i KO-020 w `docs/18-przekazanie.md:387-388` dopisane w samym commicie scalenia (nie ma ich u żadnego rodzica) | teoretyczny (ślad w historii) |

### 1. Kolejność rodzin `ready` (4d2e19e)

- Oczekiwanie (`tests/figures-v2-mapping.test.ts:45`): `[..., 'shrug', 'hip_abd_add', 'thruster', 'chest_press_machine', 'cable_press', 'mobility_stand', 'mobility_floor']`.
- Kod: `lib/figures/v2/families.ts:61-62` (`mobility_stand`, `mobility_floor`) stoi przed `:66-68` (`thruster`, `chest_press_machine`, `cable_press`). `FAMILIES.filter(f => f.status === 'ready')` przez `ts-loader` daje
  `[..., 'shrug', 'hip_abd_add', 'mobility_stand', 'mobility_floor', 'thruster', 'chest_press_machine', 'cable_press']`. `toEqual` na tablicy uwzględnia kolejność, więc test jest czerwony.
- Przyczyna: przy łączeniu list rodzice dokleili rodziny na koniec w różnej kolejności (P1 kończy na `thruster, chest_press_machine, cable_press`, P2 na `mobility_stand, mobility_floor`), a scalenie wzięło P1 + P2 zamiast kolejności z `families.ts`.
  Zbiór się zgadza (27 rodzin), różni się tylko kolejność, więc aplikacja działa poprawnie. Pozostałe asercje tego pliku (`POSE_FAMILIES` :52, liczba `figureSpec` = 394) zgadzają się z kodem.
- Kroki: `npx jest tests/figures-v2-mapping.test.ts` na 4d2e19e. Nie dotyczy aplikacji.

### 2. Zgubione oczekiwanie partii 2 w `recenzja-wyjatki-1-1` (4d2e19e)

- `tests/recenzja-wyjatki-1-1.test.ts:97` w 4d2e19e = wiersz z P1 (760afa88) bez zmian: `v2` i `fam` mają 24 rodziny, kończą się na `'thruster'`.
- Strona P2 (7a09818f:95) dodała `pushup_plank`, `mobility_floor`, `mobility_stand`; w scaleniu tej zmiany nie ma (wiersz z P2 zginął, nowego wiersza łączącego brak).
- Kod: `buildFigures(full, recenzja()).v2` i `rodzinyZAktualnaRecenzja(recenzja())` na 4d2e19e zwracają 27 rodzin `[..., 'thruster', 'pushup_plank', 'mobility_floor', 'mobility_stand']`; to samo w `lib/figures/data.json` `.v2` (sprawdzone przez `zrodla-runtime --check`, wynik 0). Test jest więc czerwony.
- To jedyny przypadek w kryterium (a), w którym rozwiązanie konfliktu odrzuciło zmianę jednej strony. Dane runtime są poprawne, zła jest tylko asercja.

### 3. Pośredni commit bez wyjątku rozmiaru (e8b72515)

- `git show e8b72515:lib/figures/v2/poseData.ts | wc -c` = 22 081, `LIMIT = 20 * 1024` (`tests/architecture-limits.test.ts:8`), a w e8b72515 nie ma wpisu `poseData.ts` w `WYJATKI`. Wyjątek dochodzi dopiero w 760afa88.
- W stanie końcowym kryterium (c) jest spełnione: `wc -c` = 24 736 B = próg w `tests/architecture-limits.test.ts:36` (warunek testu to `n > próg`, więc próg nie ma zapasu i nie da się go zawęzić). Wpis KO-022 w `docs/21-roadmapa-offline.md:172-173` podaje tę samą liczbę.

### 4. Historia w `pokrycie-cele.json` (e8b72515)

- Strona P2 (06d90e84) dopisała w `wersje.1.1.opis` dwa zdania: „10.11.2026 (scalenie partii 4 z integracją …): … po wstrzymaniu Triceps Dips (ławka) … figura.v2 531 → 530, pelnaKarta 455 → 454 …” oraz „10.11.2026 (thruster włączony po recenzji r2 …): animowanyBlad 257 → 258 …”. Zastąpiło je jedno zdanie łączące z liczbami ze scalenia, przez co oba zdania zginęły.
- Wartości `min` są poprawne (pkt (b)), więc to strata samego zapisu historii, nie liczb.

### 5. Decyzje dopisane w commicie scalenia (e8b72515)

- `docs/18-przekazanie.md:387` (KO-012, podział Jesta w CI; wdrożenie `tests/ci-jest-sekwencer.test.ts` już u rodzica P1) i `:388` (KO-020). Nie ma ich u żadnego rodzica.
- Treść nie budzi zastrzeżeń i `decyzje --check` przechodzi, ale `git log -S` bez `-m` takich zmian w commitach scalenia nie pokazuje. Uwaga tylko o śladzie w historii.

## Sprawdzone bez znalezisk

- (a) JSON-y rejestrów, oba scalenia: `figury-recenzja.json` (4 986 / 5 169 kluczy), `tor-wyjatki.json`, `reguly-cwiczen.json`, `cue-sets.json`, `figury-v2-zlote.json`, `pokrycie-katalogu-min.json`, wszystkie `data/zrodla/*.json`. Każda zmiana strony jest w wyniku, wpis zmieniony przez obie strony nie występuje. Konflikty w `lib/figures/data.json` (`v2`, `replaced`) i `lib/cues/data.json` (`general`) to pliki pochodne, przeliczone (`zrodla-runtime --check` = 0 na obu scaleniach).
- (a) Rejestry TS: `families.ts`, `poseData.ts` (LOAD, DATA_UI, listy wyjątków, `ISOMETRIC` = 19 = 17 + Crucifix + Plank), `overlay.ts` (`TECHNIQUE`: 24 rodziny w e8b72515, 27 w 4d2e19e, suma obu stron, importy kompletne). `figure.ts` `V2_WSTRZYMANE` to suma: e8b72515 ma 6 wpisów (+ Triceps Dips (ławka), Standing/Seated Calf Raise), 4d2e19e ma 7 (+ Plyo Push-Up); zmienił się tylko komentarz nagłówka.
- (a) Dokumenty: `docs/brd/wymagania.md`, `docs/40-lekcje.md`, `docs/18` (4d2e19e), `docs/21` (oprócz zastąpionego zdania z liczbą „poza pełną kartą”: 256 = 708 − 452 i 250 = 708 − 458, zgodne z symulacją; dopisany backlog KO-022).
- (a) Oczekiwania w testach: listy wstrzymanych w `figures-v2-wstrzymane`, `store-review-notes`, `strona-eksport-recenzja`, `cel-1-1-bez-ciezkich`; `figures-v2-nakladka-fix4` (`odciete` = suma obu stron); `figures-v2-nakladka-triceps-olympic` (27 rodzin); `skrot-v2-wynik` (wyrażenie regularne = suma); `figury-generator-odtwarza` (`W_ZAKRESIE` = suma); `gemini-polecenia`; `figury-mobilnosc-reguly`.
- (b) Cele i liczby: `pokrycie-symulacja.mjs` daje dokładnie `min` z `pokrycie-cele.json`, czyli 528/532/534/260/309/197/571/444/517/452/528/632 na e8b72515 i 527/531/534/259/309/197/570/443/524/458/527/632 na 4d2e19e. Zmiana `figura.wAplikacji` 532 → 531 w 4d2e19e też wynika z symulacji. Pętla: 10 `cykl_lustro` + 66 `jednokierunkowa` (65 pokazywanych) = `figures-v2-petla-jednokierunkowa` (76) i `figures-v2-delt-raise-p4` (65). Liczba `figureSpec` = 359 / 394 = suma w `figures-v2-mapping`. `strona-eksport` 352 → 386 = przyrost strony P2 (+34) dodany do P1.
- (b) Pliki generowane: `readme`, `test-matrix`, `pokrycie-katalogu`, `figures/v2-gen` (docs/51), `zrodla-runtime`, `decyzje`, `check-znaczniki-konfliktu` mają `--check` = 0 na 4d2e19e. Na e8b72515 (kopia z `git archive`) wynik 0 dają wszystkie oprócz `readme`, która w kopii bez `.git` nie działa — to ograniczenie kopii, nie błąd scalenia.
- (c) Wyjątek rozmiaru w stanie końcowym: patrz pkt 3.
- (d) Logika `tests/figures-v2-data.test.tsx`: filtr rodzin (:49) to suma wykluczeń obu stron. Warunek izometrii (:109) łączy `TIMED_DYNAMIC` (P2) z `weight_time && poseStala` (P1). Pole kadru (:158) łączy Lower Back Curl, `NISKIE_POZY` i Crucifix/top. `dd` (:151) łączy wersję wielu `u` (P4) z `ZAOKRAGLONE_PLECY_KB` (P1). `JERK_TEMPO_RODZINY` (:167) to suma rodzin. `tests/figures-v2-delt-raise-p4.test.tsx` ma filtr `V2_WSTRZYMANE` z P2 i liczbę 65 zgodną z danymi.
- Prywatność i sekrety: w zmienionych plikach nie ma adresów e-mail, tokenów ani identyfikatorów urządzeń. Dane użytkownika i migracje: obu scaleń nie dotyczą (zmieniają tylko dane figur, testy i dokumenty).
- Nie oceniane: `scripts/pochodne.mjs` (uruchamia Jest) zwrócił 1 w kroku „pliki zegarka i widżetu + strażniki tekstowe” na zajętej maszynie. Związku ze scaleniami nie badałem (pliki zegarka i widżetu nie są w diffach).

## Werdykt

Scalenia zachowują dane i rejestry obu stron, a liczby celów i pliki generowane zgadzają się ze skryptami. Nie ma znalezisk KRYTYCZNYCH ani WYSOKICH.
Przed `scal-galaz` trzeba poprawić dwie asercje testów w 4d2e19e (pkt 1 i 2). Inaczej `tests.yml` będzie czerwony, a `scal-galaz` odmówi scalenia.
Znaleziska NISKIE (3–5) można zostawić na backlog.

Uwaga do stanu kopii roboczej: pod koniec recenzji w kopii roboczej były niezatwierdzone zmiany innej sesji w `tests/figures-v2-mapping.test.ts`, `tests/recenzja-wyjatki-1-1.test.ts`, `lib/figures/v2/figure.ts` (komentarz) i `docs/18-przekazanie.md`.
Znaleziska 1 i 2 dotyczą zatwierdzonego commitu 4d2e19e (sprawdzone przez `git show 4d2e19e:<plik>`). Tych zmian nie oceniałem.

## Odpowiedź autora (sesja A2, 10.11.2026; po przeglądzie, bez drugiego przeglądu — brak znalezisk WYSOKICH)

- ŚREDNIE 1 (`tests/figures-v2-mapping.test.ts`, kolejność `ready`) i ŚREDNIE 2 (`tests/recenzja-wyjatki-1-1.test.ts`, brak trzech rodzin partii 2): poprawione w commicie po 4d2e19e. Liczby i listy wzięte z wyniku testów: `npx jest` 5 plików (gemini-polecenia, pokrycie-katalogu, figures-v2-mapping, recenzja-wyjatki-1-1, architecture-limits) — 112 testów zielonych.
- NISKIE (opis w `pokrycie-cele.json`): 2 zdania partii 4 przywrócone w opisie (liczby `min` bez zmian).
- NISKIE (e8b72515 sam bez wyjątku rozmiaru): poprawione już w 760afa88; próg zawężony w 4d2e19e.
- NISKIE (wpisy KO-012 i KO-020 w commicie scalenia): wpisy koordynatora dopisane przez sesję A przy scaleniu; bez zmiany.
- Dodatkowo (poza przeglądem): `lib/figures/v2/figure.ts` przekroczył limit 20 480 B (20 583 B) po złączeniu komentarzy; komentarz skrócony (20 458 B), bez nowego wyjątku; skróty rysunków `zrodla-runtime --skroty` przed i po tej zmianie identyczne (`cmp`).
