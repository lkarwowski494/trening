# Audyt: Jakość (strategia testów, gotowość wydania) — Trening — 2026-11-12
Diagnoza nieudanego buildu TestFlight 1.1 (sesja AA, polecenie koordynatora `docs/koordynacja/polecenia/AA.md` @ a053ce13).
Commit: 37bb8a071f4ba2f17ca60a9b458bf5e69a04e5ec (`integracja-1-1`, zgodny z poleceniem) · Gałąź raportu: `diag/testflight-1-1-czas` · Tryb: audit (zakres zawężony do przebiegu 43267558799) · Środowisko: Linux 6.18, Node z `npm ci` (kod 0), `gh api` do logów Actions działa, sieć działa; macOS/Xcode niedostępne (przyczynę z macOS odtworzono na Linuksie przez dowiązanie katalogu tymczasowego).

## Werdykt: ZABLOKOWANE
Commit: 37bb8a07 · Kandydat do wydania: ten sam · Rozstrzygnął warunek: „otwarte P0 albo P1” (07-jakosc-001, 07-jakosc-002) i pełny zestaw testów czerwony na badanym SHA na macOS · Próg projektu: „wydanie blokują tylko znaleziska KRYTYCZNE i WYSOKIE: (…) awaria albo funkcja nie do użycia” (CLAUDE.md, „Audyty i wydania” pkt 1) — tu: build TestFlight nie powstaje.

## Podsumowanie
Build 1.1 (testflight.yml, przebieg 43267558799) ma **dwa niezależne blokery**: (1) krok `npm run verify` na macos-26 nie mieści się w limicie zadania 90 min (Jest doszedł do 805 z 810 plików po ~78 min; brakowało 5 najcięższych plików, ok. 20+ min); (2) nawet bez limitu verify byłoby czerwone, bo `tests/strona-eksport-recenzja.test.ts` pada na macOS z przyczyny odtworzonej: strażnik „uruchomiony bezpośrednio” w `scripts/strona/eksport.mjs` zawodzi, gdy skrypt leży pod ścieżką z dowiązaniem symbolicznym (`/var` → `/private/var` na macOS). Główną przyczyną wzrostu czasu jest skrót recenzji rodziny liczony z wyniku rysunku (commit 244be2f4b, 09.11) razy wzrost liczby rodzin `ready` z 7 do 40 — ten sam skrypt eksportu trwa dziś 24 s zamiast 4 s, skróty 21 s zamiast 1,7 s, a testy wołają je wielokrotnie. Rekomendacja: naprawić strażnika (001→002 najpierw), potem podzielić Jest w testflight.yml na części na macOS (ten sam zestaw kontroli), a obliczenia skrótów buforować (P2).

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 07-jakosc-001 | P1 | D | Build TestFlight nie mieści się w limicie: stały `timeout-minutes: 90` przy czasie verify rosnącym z danymi | otwarte |
| 07-jakosc-002 | P1 | D | `eksport.mjs` nic nie robi (kod 0) pod ścieżką z dowiązaniem — test czerwony na macOS, zielony na Ubuntu | otwarte |
| 07-jakosc-003 | P2 | D | Skrót recenzji z wyniku rysunku liczony od nowa przy każdym wywołaniu — koszt testów rośnie z liczbą rodzin | otwarte |

## Komendy (każda osobno)
| Komenda | Kod wyjścia | Wynik (liczby) | Uwagi (powtórka jednym procesem, czas) |
|---|---|---|---|
| `npm ci` | 0 | zależności z pliku blokady | — |
| `node <link-tmp>/sonda/x.mjs` (strażnik jak `scripts/strona/eksport.mjs:188`) | 0 | „NIE-MAIN”: `import.meta.url` = ścieżka realna, `argv[1]` = przez dowiązanie | dowody/testflight-czas-2026-11-12.md, sekcja a-sonda-symlink |
| `TMPDIR=<dowiązanie> npx jest tests/strona-eksport-recenzja.test.ts --runInBand --ci -t "pilotaż"` | 1 | FAIL, ENOENT `…/pilotaz/figury.json`, test:55 — identycznie jak na macOS | 85 s; sekcja a-odtworzenie-symlink |
| `TMPDIR=<katalog realny> npx jest … -t "pilotaż"` (kontrola) | 0 | 2 passed, 10 skipped | 104 s; sekcja a-kontrola-bez-symlink |
| `node scripts/strona/eksport.mjs --out … --langs en` na 1f339f4c / 37bb8a07 | 0 / 0 | 3,9 s / 24,2 s | sekcja b-eksport-czas |
| `node scripts/strona/recenzja-figur.mjs --skroty` na 1f339f4c / 37bb8a07 | 0 / 0 | 1,7 s / 21,3 s | sekcja b-eksport-czas |
| `gh api …/jobs/<id>` (kroki zadań build) | 0 | verify 38,2 / 56,9 / 89,2 min (anulowane) | sekcja b-kroki-build |

Pełnego `npm run verify` nie uruchamiano (polecenie AA pkt 6).

## Twierdzenia projektu vs stan
| Twierdzenie (plik:linia) | Jak sprawdzone | Potwierdzone / obalone |
|---|---|---|
| Krok verify: `.github/workflows/testflight.yml:95` „3 GB na proces × 2 procesy mieści się w pamięci maszyny” | `scripts/ci/jest-sterta.json` ustawia `workerowMB: 4096` (od 02.11) | obalone (komentarz nieaktualny: 2 × 4 GB przy 7 GB RAM); skutek niepotwierdzony — „Do sprawdzenia” |
| „Pełne testy biegną w CI (`tests.yml`, ok. 14 min …)” (CLAUDE.md) | zadania 43205473216: Jest w 5 częściach 11:01–11:26 UTC | częściowo: ok. 25 min od startu do końca ostatniej części (czekanie na maszyny wliczone) |
| tests.yml zielony na 667d5074 (polecenie AA, zad. a) | log części jest (1): `PASS iOS tests/strona-eksport-recenzja.test.ts (712.664 s)` | potwierdzone (zielony na Ubuntu, ale 712 s) |

## Nie sprawdzono
| Co | Dlaczego (środowisko) | Krok i kto | Wpływ na werdykt |
|---|---|---|---|
| Odtworzenie na macOS | brak macOS w kontenerze | po naprawie 002: przebieg testflight.yml albo `ios-unsigned.yml` (koordynator, za zgodą wg CLAUDE.md) | brak — mechanizm odtworzony na Linuksie tą samą ścieżką kodu |
| Czy na macos-26 dochodzi do wymiany pamięci (swap) przy 2 × 4 GB sterty | logi nie zawierają metryk pamięci | dopisać `vm_stat` przed/po Jest w przebiegu próbnym (programista/koordynator) | brak (P2/„Do sprawdzenia”) |
| Limit równoległych zadań macOS na planie darmowym | nie przeczytano dziś strony GitHub | przeczytać docs.github.com („usage limits”) przed wdrożeniem opcji B — [DO USTALENIA] | dotyczy wykonalności opcji B |

## Otwarte P0/P1 innych ról z tego commitu
| ID | Rola | Tytuł | Status |
|---|---|---|---|
| — | — | Raport `docs/audyt-1-1/07-jakosc-2026-11-11.md` dotyczy innego SHA; raportów innych ról dla 37bb8a07 nie znaleziono w `docs/audyt-1-1/` | — |

## Lista wydania (moduł wydanie)
Zawężona do przyczyny porażki buildu. Pkt 1 (jeden SHA): 37bb8a07 = SHA przebiegu 43267558799. Pkt 3 (pełny zestaw): czerwony na macOS (002) i niedokończony (001). Pozostałe pozycje (E2E, aktualizacja z danymi, lista „tylko telefon”) — poza zakresem polecenia AA, stan w `docs/49`/`docs/48`.

## Linia bazowa i założenia
Linia bazowa od zera (soczewka „właściciel wydający wersję”): bramka buildu powinna (1) dawać ten sam wynik na każdym systemie, na którym biegnie, (2) mieć czas mierzony i limit wyliczany z pomiaru, który rośnie z danymi (rola, zasada 6; tak robi już `scripts/ci/czasy-tests.json` dla tests.yml), (3) nie liczyć drogich wartości wielokrotnie w jednym przebiegu.

Wymiary pokrycia:
- Rejestr ryzyk: sprawdzone, brak ryzyka danych w tym zakresie — dotyczy wyłącznie procesu wydania (build nie powstaje).
- Wyrocznie: nie dotyczy (diagnoza czasu i środowiska).
- Dane testowe: sprawdzone, brak — test używa danych repo.
- Platforma: znalezisko 002 (różnica macOS/Linux w ścieżkach).
- Dostępność: nie dotyczy zakresu.
- Bramki CI: znalezisko 001 (limit stały, brak pomiaru dla testflight.yml), 003 (koszt).
- Niestabilne testy: sprawdzone, brak — porażka 002 jest deterministyczna (odtworzona 1/1, kontrola 1/1).
- Siła testów: test strona-eksport-recenzja zadziałał prawidłowo — wykrył prawdziwy błąd skryptu.
- Dowody wydania: build nie powstał; SHA zgodne.

Wzorzec najlepszych: limit zadania z pomiaru p95 × zapas (już w projekcie: `scripts/ci/czasy-tests.json`, strażnik `tests/tests-yml-czas.test.ts`); Node: strażnik „główny moduł” porównujący ścieżki realne (`realpathSync`) — w projekcie już robi to `scripts/scal-galaz.mjs` (jedyny z 18 skryptów z `realpath`, sekcja a-mechanizm-grep).

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Log zadania build 43267558799 (11 078 linii) | tak, grep | dowody/testflight-czas-2026-11-12.md |
| Logi build 41183061869, 42298549942 | tak, grep | jw., sekcje b-top15, b-jest-czas |
| Logi 6 zadań tests.yml 43205473216 | tak, grep | jw., sekcja b-jest-czas |
| `tests/strona-eksport-recenzja.test.ts`, `tests/helpers/skrot-v2-kopia.ts`, `scripts/strona/eksport.mjs`, `scripts/strona/recenzja-figur.mjs` | przeczytane | — |
| `.github/workflows/testflight.yml`, `tests.yml`, `package.json` (verify, jest), `scripts/ci/jest-sterta.json` | przeczytane fragmenty | — |
| Pozostałe 17 skryptów ze strażnikiem `import.meta.url ===` | tylko grep wzorca, nie uruchamiane pod dowiązaniem | sekcja a-mechanizm-grep |
| Przyczyny wzrostu podpisy1/6 i matrix-dim-langs* | nie profilowano (wniosek z liczby rodzin i porównania z Ubuntu) | „Do sprawdzenia” |

## Kontrola dowodów i sekretów
`node sprawdz-raport.mjs docs/audyt-1-1/testflight-czas-2026-11-12.md . --rola 07-jakosc` → wynik wklejony niżej po ostatnim uruchomieniu.

```
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 07-jakosc
```

## Stosowalność listy kontrolnej
| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| JAK-01 | nie dotyczy — zakres polecenia AA to porażka buildu | — |
| JAK-02, JAK-03, JAK-04, JAK-06, JAK-07, JAK-08, JAK-13, JAK-14 | nie dotyczy — zakres AA | — |
| JAK-05 | dotyczy (wynik zależny od systemu) | 07-jakosc-002 |
| JAK-09 | dotyczy (limit stały, koszt bramki) | 07-jakosc-001, 07-jakosc-003 |
| JAK-10, JAK-11 | nie dotyczy — repo publiczne, minuty darmowe (CLAUDE.md), uprawnień nie zmieniano | — |
| JAK-12 | nie dotyczy — zakres AA | — |
| JAK-15 | dotyczy (komentarz `.github/workflows/testflight.yml:95`) | patrz sekcja Do sprawdzenia (pewność < 80% co do skutku) |
| JAK-16 | dotyczy | SHA zgodne (37bb8a07); pełny zestaw czerwony → werdykt |
| JAK-17 | dotyczy | ok — krok verify robi to, co mówi nazwa |
| JAK-18 | dotyczy częściowo (testflight.yml nie biegnie na main) | nie sprawdzano main — poza zakresem AA |

## Znaleziska (szczegóły)

### 07-jakosc-001 · Build TestFlight nie mieści się w limicie: stały `timeout-minutes: 90` przy czasie verify rosnącym z danymi
- Pozycja listy kontrolnej: JAK-09
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `.github/workflows/testflight.yml:73` „timeout-minutes: 90”; log 43267558799: `##[error]The operation was canceled.` 19:35:00 (sekcja b-jest-czas); czas kroku verify 38,2 → 56,9 → 89,2 min (anul.), Jest `Time:` 2202 s → 3311 s → >~5300 s; liczba plików testów 591 → 717 → 810; doszło 805/810, nie doszły `audit-k1-bl-mer-podpisy2/3/4/5/7` (każdy ~550 s na macOS) — sekcja b-top15. Kroki poza verify: ok. 16 min (31.10) i 23 min (06.11) (sekcja b-kroki-build).
- Mechanizm: limit zadania build jest stały, a czas verify zależy od liczby plików i rodzin `ready`; w odróżnieniu od tests.yml (`scripts/ci/czasy-tests.json`, strażnik `tests/tests-yml-czas.test.ts`) testflight.yml nie ma pomiaru ani strażnika czasu; `grep -n "timeout-minutes" .github/workflows/testflight.yml` → 2 trafienia (linie 42, 73), oba stałe.
- Powraca: nie (pierwsze przekroczenie) → trwała kontrola: limit build z pomiaru (rozszerzenie `czasy-tests.json`/strażnika na testflight.yml).
- Wzorzec lub źródło: rola 07, zasada 6 („limity czasu w CI rosną z danymi”); CLAUDE.md „Liczby (progi, limity, czasy) w jednym miejscu”.
- Kroki w aplikacji: brak — dotyczy wydania: właściciel uruchamia testflight.yml, build nie powstaje po 90 min.
- Opcje: patrz „Decyzje dla właściciela” (A–F); Rekomendacja: B (części Jest na macOS) + 003 (bufor skrótów).
- Test akceptacyjny: testflight.yml na SHA kandydata kończy krok testów w limicie z zapasem ≥ 25% wg pomiaru; strażnik czasu obejmuje testflight.yml (wzór `tests/tests-yml-czas.test.ts`).
- Status: otwarte

### 07-jakosc-002 · `eksport.mjs` nic nie robi (kod 0) pod ścieżką z dowiązaniem — test czerwony na macOS, zielony na Ubuntu
- Pozycja listy kontrolnej: JAK-05
- Poziom: P1
- Realność: realny (każdy przebieg verify na macOS) · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/strona/eksport.mjs:188` „if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {”; test uruchamia skrypt z kopii drzewa w `os.tmpdir()` (`tests/helpers/skrot-v2-kopia.ts:43`, `tests/strona-eksport-recenzja.test.ts:54`), na macOS tmpdir to `/var/folders/…` = dowiązanie do `/private/var/…`; Node podaje w `import.meta.url` ścieżkę realną → warunek fałszywy, skrypt kończy się kodem 0 bez zapisu, `readFileSync` w linii 55 → ENOENT. Odtworzenie: sonda (sekcja a-sonda-symlink) i test z `TMPDIR` przez dowiązanie → FAIL z tym samym ENOENT, kontrola bez dowiązania → PASS (sekcje a-odtworzenie-symlink, a-kontrola-bez-symlink). Test zmieniony na wariant z kopią drzewa w 9691863 (10.11) — po obu zielonych buildach (31.10, 06.11), więc pierwszy przebieg macOS z tym kodem to 43267558799. tests.yml (Ubuntu, `/tmp` bez dowiązania): PASS.
- Mechanizm: strażnik „moduł główny” porównuje ścieżkę realną z nierozwiązaną; `grep -rn "import.meta.url ===" scripts --include=*.mjs` → 18 plików, tylko `scripts/scal-galaz.mjs` używa realpath (sekcja a-mechanizm-grep); ten sam wzorzec `new URL(process.argv[1], 'file://')`: `scripts/strona/eksport.mjs:188`, `scripts/strona/silnik-build.mjs:41`, `scripts/pokrycie-katalogu.mjs:238`, `scripts/pokrycie-symulacja.mjs:109`, `scripts/equipment/gen-nazwy-en.mjs:51`; pozostałe z `pathToFileURL(argv[1])` lub `file://${argv[1]}` mają tę samą wadę. Dziś z katalogu tymczasowego uruchamiany jest tylko eksport.mjs.
- Powraca: nie → trwała kontrola: test-strażnik wzorca (np. wspólny pomocnik `jestGlowny(import.meta.url)` z `realpathSync` + test, że żaden skrypt nie porównuje `import.meta.url` z `argv[1]` bez niego; przypadek gałęzi długo żyjącej wg L-080).
- Wzorzec lub źródło: Node — główny moduł ESM ładowany jest po ścieżce realnej (odtworzone sondą, sekcja a-sonda-symlink); dokumentacji Node dziś nie czytano — dowodem jest wynik sondy.
- Kroki w aplikacji: brak wpływu na aplikację (skrypt eksportu strony); wpływ na wydanie: verify na macOS czerwone.
- Opcje: (a) naprawa w kodzie skryptów: strażnik przez `realpathSync(argv[1])` (wzór `scripts/scal-galaz.mjs`) + test-strażnik wzorca — usuwa klasę błędu, dotyka 18 skryptów; (b) naprawa w teście: `fs.realpathSync(os.tmpdir())` w `tests/helpers/skrot-v2-kopia.ts:43` — 1 linia, ale zostawia kruchy strażnik w 18 skryptach (ten sam błąd przy każdym uruchomieniu spod dowiązania, np. katalog roboczy w dowiązanym folderze). Rekomendacja: (a), w tym samym commicie test odtwarzający z `TMPDIR` przez dowiązanie (czerwony przed poprawką).
- Test akceptacyjny: `TMPDIR=<dowiązanie> npx jest tests/strona-eksport-recenzja.test.ts --runInBand` → kod 0; strażnik wzorca czerwony na 37bb8a07.
- Status: otwarte

### 07-jakosc-003 · Skrót recenzji z wyniku rysunku liczony od nowa przy każdym wywołaniu — koszt testów rośnie z liczbą rodzin
- Pozycja listy kontrolnej: JAK-09
- Poziom: P2
- Realność: realny · Pewność: wysoka (pomiar), średnia (udział w całym wzroście)
- Rodzaj: D
- Dowód: `scripts/skrot-v2-wynik.mjs:74` `rodzinaSkrot = … skrotZWyniku(rodzina, wynikiRodziny(rodzina, czytaj), czytaj)` (od 244be2f4b, 09.11: skrót recenzji rodziny z wyniku rysunku); `scripts/strona/recenzja-figur.mjs:20` liczy go przy każdym eksporcie dla każdej rodziny ready (`scripts/strona/eksport.mjs:72`); rodziny ready 7 → 40 (1f339f4c → 37bb8a07). Pomiar lokalny: eksport 3,9 → 24,2 s, `--skroty` 1,7 → 21,3 s (sekcja b-eksport-czas). `tests/strona-eksport-recenzja.test.ts` woła eksport ok. 15× i skróty ok. 9× (grep, sekcja b-eksport-czas) → ~550 s samego liczenia; czas pliku: 86 s (06.11, macOS) → 624 s (12.11, macOS), 712 s na Ubuntu. Grupa plików figur/skrótów: 1102 s → 1796 s, podpisy: 718 → 1097 s (niepełne — 5 z 7 plików nie doszło) (sekcja b-top15).
- Mechanizm: brak bufora wyniku `rodzinaSkrot` między procesami w jednym przebiegu; `grep -rln "recenzja-figur.mjs\|skrot-v2-wynik.mjs" tests` wskazuje pliki wołające skrypty (m.in. strona-eksport*, skrot-v2-*, figures-v2-delt-raise-*) — nie liczono wszystkich wywołań.
- Powraca: nie.
- Wzorzec lub źródło: rola 07, zasada 6; pomiar własny.
- Kroki w aplikacji: brak (koszt CI i czas sprzężenia zwrotnego).
- Opcje: (a) bufor na dysku kluczowany skrótem treści wejść rysunku (np. w `node_modules/.cache`) — największy zysk, ryzyko nieaktualnego bufora, wymaga testu unieważnienia; (b) w testach liczyć skróty raz w `beforeAll` i przekazywać do eksportu (eksport już przyjmuje gotowe `skroty`, `scripts/strona/recenzja-figur.mjs:18`) — zysk tylko w testach, bez ryzyka bufora. Rekomendacja: (b) teraz, (a) po pomiarze.
- Test akceptacyjny: czas `tests/strona-eksport-recenzja.test.ts` na Ubuntu < 200 s (dziś 712 s); wyniki testów bez zmian.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **Wymiana pamięci na macos-26:** `scripts/ci/jest-sterta.json` — `workerowMB: 4096` × 2 procesy robocze przy 7 GB RAM (dane maszyny z komentarza `.github/workflows/testflight.yml:94`), a komentarz linii 95 mówi o 3 GB. Na macOS podpisy1/6 trwały 556/541 s, na Ubuntu (4 rdzenie, 16 GB w tym kontenerze; maszyny Actions nie mierzono) 272/267 s. Brakuje: metryk pamięci z przebiegu (`vm_stat`). Jeśli potwierdzone — część wzrostu na macOS to swap, nie sam test.
- **Wzrost podpisy1/6 i matrix-dim-langs*:** hipoteza: więcej figur ready (7 → 40) = więcej renderowanych kart w każdym języku. Brakuje: profilu jednego pliku na 1f339f4c i 37bb8a07.

## Co działa dobrze i należy zachować
- `tests/strona-eksport-recenzja.test.ts` wykrył prawdziwy błąd skryptu zależny od systemu — test robi to, co powinien; nie osłabiać go przy naprawie.
- Pomiar i limity z jednego pliku dla tests.yml (`scripts/ci/czasy-tests.json`) — gotowy wzór dla testflight.yml.
- `scripts/jest-ponow.mjs` przekazuje argumenty Jest (`--shard`) — `scripts/jest-ponow.mjs:73`, użyte w `.github/workflows/tests.yml:58`.

## Decyzje dla właściciela
Tryb analogia (polecenie AA pkt 6; repo portfela: brak użytych decyzji o podziale buildu) — rekomendacja koordynatora do weta właściciela.

**Najpierw zawsze:** naprawa 002 (bez niej każda opcja daje czerwony build).

Opcje **bez zmiany zestawu kontroli**:
- **A. Podział Jest na części na macos-26** (zadanie `testy` z macierzą `czesc: [1..N]`, `node scripts/jest-ponow.mjs --shard=K/N`, plus `npm run verify:kontrole` w jednej części; zadanie `build` z `needs: [bramka, testy]`). Wykonalność: `.github/workflows/tests.yml:43` (macierz), `.github/workflows/tests.yml:58` (`--shard` przez jest-ponow), `scripts/jest-ponow.mjs:73` (przekazanie argumentów), `.github/workflows/testflight.yml:65` (`needs`), `package.json` skrypt `verify:kontrole` (`.github/workflows/tests.yml:35`). Szacunek: Jest ~110 min ÷ 3 części ≈ 37–40 min na część, + build ~23 min ≈ 65 min ścieżki krytycznej. Kompromis: ten sam system i zestaw; więcej maszyn macOS naraz (kolejka; limit równoległych zadań macOS — [DO USTALENIA]); liczba części musi rosnąć z danymi (wpis w `czasy-tests.json`).
- **B. Podział jak A, ale części na ubuntu-latest** (macOS tylko build). Wykonalność: jak A, `runs-on: ubuntu-latest` (`.github/workflows/tests.yml:38`). ~25 min + build ~23 min. Kompromis: szybciej i bez kolejki macOS, ale traci się przebieg testów na macOS — dziś to on złapał 002. Zestaw kontroli ten sam, system inny → **graniczne; oznaczam: zmienia kontrolę → decyzja właściciela**.
- **C. `--maxWorkers=3` na macOS.** Wykonalność: niesprawdzona pozytywnie — `scripts/ci/jest-sterta.json` (4096 MB na proces) × 3 > 7 GB RAM; opis tego pliku wymienia dawne „out of memory”. Zysk ≤ 1,5× (110 → ~75 min + 23 > 90). Odrzucam.
- **D. Bufor skrótów (07-jakosc-003 b, potem a).** Wykonalność: `scripts/strona/recenzja-figur.mjs:18` przyjmuje gotowe `skroty`. Zmniejsza czas, nie rozwiązuje wzrostu z danymi — uzupełnienie A, nie zamiennik.

Opcje **zmieniające kontrolę → decyzja właściciela**:
- **E. Wyższy limit** (`.github/workflows/testflight.yml:73`: 90 → ≥ 170 min z pomiaru). Najprostsze, 0 zł (repo publiczne), ale build ~2,5 h i dalej rośnie; bez strażnika powtórzy się.
- **F. Zastąpienie Jest w testflight.yml dowodem z tests.yml na tym samym SHA** (zielony `tests.yml` dla `$GITHUB_SHA`, jak bramka E2E: `scripts/ci/bramka-e2e.sh`, `.github/workflows/testflight.yml:62`), a na macOS tylko `npm run verify:kontrole`. Build ~30 min, bez dublowania Jest. Kompromis: brak Jest na macOS (002 wyszłoby dopiero gdzie indziej), zależność od zielonego tests.yml przed buildem.

**Rekomendacja:** 002 (a) → A z liczbą części z pomiaru i strażnikiem czasu (001) → D(b). Wpis do weta: „12.11.2026, sesja AA, tryb analogia: testflight.yml — Jest w częściach na macos-26 (A); odrzucone: C (pamięć), E (rośnie z danymi), B i F (zmieniają kontrolę — do decyzji właściciela, jeśli kolejka macOS okaże się wąskim gardłem)”.

Czas: naprawa 002 ok. 1 h pracy agenta (18 skryptów + strażnik); A ok. 1–1,5 h + przebieg dowodowy (czekanie: CI macOS ~65 min); D(b) ok. 30 min. Od właściciela: tylko zatwierdzenie wysyłki w środowisku `release` przy kolejnym buildzie.

### Szkic lekcji (do scalenia przez koordynatora po W-19, docs/40)

```
## L-NNN · Build TestFlight 1.1 przekroczył limit 90 min i miał czerwony test tylko na macOS (12.11.2026)
- Co: testflight.yml 43267558799 (37bb8a07) anulowany po 89 min kroku verify; dodatkowo FAIL tests/strona-eksport-recenzja.test.ts (ENOENT) tylko na macOS.
- Przyczyna źródłowa: (1) limit zadania build stały, bez pomiaru i strażnika — tests.yml miał je od ZB-029, testflight.yml nie; czas Jest wzrósł 36,7 → 55 → >88 min (pliki 591 → 810, rodziny ready 7 → 40, skrót recenzji z wyniku rysunku od 09.11); (2) strażnik „moduł główny” w 18 skryptach porównuje ścieżkę realną z nierozwiązaną — na macOS tmpdir jest dowiązaniem; tests.yml biegnie tylko na Ubuntu, więc błąd wyszedł dopiero przy buildzie.
- Dlaczego nie wcześniej: jedyny przebieg Jest na macOS to sam build wydania (rzadko, ostatni 06.11, przed zmianą testu 10.11).
- Akcje: strażnik wzorca main + naprawa 18 skryptów (07-jakosc-002); limit build z pomiaru + strażnik (07-jakosc-001); bufor skrótów (07-jakosc-003).
- Zakres: systemowa — każda bramka z limitem stałym rośnie z danymi; propozycja: (A) wszystkie `timeout-minutes` z pomiaru w jednym pliku + strażnik [rekomendacja], (B) przegląd limitów przy każdym wydaniu (lista kontrolna).
```

## Proponowane polecenie naprawy
`node tools/assemble.mjs 08-programista --tryb fix --zadania 07-jakosc-002,07-jakosc-003` (kod skryptów i testów), następnie `node tools/assemble.mjs 07-jakosc --tryb fix --zadania 07-jakosc-001` (workflow i strażnik czasu), potem reaudit przebiegiem testflight.yml na nowym SHA (za zgodą właściciela).

`git status --porcelain` na początku: pusty. Na końcu (przed commitem raportu): tylko nowe pliki `docs/audyt-1-1/testflight-czas-2026-11-12.md` i `docs/audyt-1-1/dowody/testflight-czas-2026-11-12.md`; pliki śledzone nietknięte.
