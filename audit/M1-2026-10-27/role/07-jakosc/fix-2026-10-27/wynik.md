# 07-jakosc — tryb fix, 27.10.2026 — wynik

Zadanie planu: **M1-audytor-generalny-009** (SYS-01, P2, P), decyzja właściciela **DEC-02 a** („strażnik w verify dla wszystkich decyzji, także wstecz, z tabel audytu”). Znalezisko roli: **07-jakosc-005**; źródła zadania: 01-odkrywanie-007, 02-monetyzacja-003, 02-monetyzacja-507, 03-zakres-002, 04-studio-projektowe-003, 08-programista-003, 10-wydanie-006.

Gałąź kopii roboczej: `worktree-agent-ab915f07c6864e560` (przed pracą ustawiona na `naprawy/M2-koordynator-napraw-2026-10-27-p1` = 862f119). Bez pushu i bez scalania.

## E0 — środowisko, klasyfikacja, plan

- Linux (kontener), Node 22.22.0, git; `node_modules` jako dowiązanie do /home/user/trening. Brak macOS, Xcode, symulatora i przeglądarki. E2E, natywny build i workflowy tej zmiany nie dotyczą (tylko skrypt, testy i dokumenty).
- Klasyfikacja: **P** (model pracy). Wybór właściciela już jest (DEC-02 a); dowodu przeciw niemu nie znalazłem.
- Stan zastany: commit c9cacfa dodał w `tests/paywall-kolejnosc-domyslna.test.ts` strażnika, ale tylko dla wpisów od 28.10.2026 ze słowami kluczowymi. Rozbudowałem go do pełnego strażnika zamiast dublować. Starą regułę usunąłem, bo nowa ją obejmuje.
- Plan:
  1. Skrypt `scripts/decyzje.mjs` i `npm run check:decyzje` w `verify` i `verify:docs`.
  2. Pola dla wszystkich 319 wpisów decyzji w docs/18 wstecz, według tabel zgodności decyzja–kod z raportów audytu (role 01, 02, 02-b, 03, 04, 07, 08) i własnego przeglądu testów.
  3. Test-strażnik z próbkami i regresją tabeli audytu.
  4. 02-monetyzacja-507 (c): próg minut i P3 w `tests/limity-wydan.json`.
- Ryzyko: powiązanie wsteczne wymaga tylko, żeby wskazany test zawierał datę decyzji albo wskazany fragment. To dowodzi, że powiązanie istnieje, ale nie że test sprawdza całą decyzję (patrz „Otwarte”).

## Commity (SHA → ID)

| SHA | Zakres | ID |
|---|---|---|
| ee1713b | `scripts/decyzje.mjs`, `tests/decyzje-straznik.test.ts`, pola `[wdrożenie: …]` przy 319 wpisach `docs/18-przekazanie.md`, `package.json` (check:decyzje w verify), `scripts/verify-docs.mjs` (+ test), stara reguła z c9cacfa zastąpiona, CLAUDE.md (reguła pola), docs/40 (akcja 4 lekcji z 27.10), README i docs/19 przegenerowane | M1-audytor-generalny-009; 07-jakosc-005 |
| 88e3c9c | `tests/limity-wydan.json` + `tests/m5s1-dni-zapis.test.ts`: `MIN_LIVE_MINUTES_FOR_DAY` może tylko rosnąć; P3 (`COUNT_FULL_STARTS_IN_EXPIRY_MONTH`) zapisane jako false nie wraca do true | M1-audytor-generalny-009 (02-monetyzacja-507 c); 07-jakosc-005 |

Kod aplikacji nietknięty: `git diff --exit-code 862f119..HEAD -- app lib components modules targets` → 0.

## Reguła strażnika (scripts/decyzje.mjs)

Wpis decyzji to punkt listy z datą (`- 23.10.2026 …`, `- **13.10.2026 …`, `- 14–18.10.2026 …`) albo rozdział `## … DD.MM.RRRR …` z własną treścią, od sekcji „## Decyzje” do końca pliku. Każdy wpis ma dokładnie jedno pole:

- `[wdrożenie: kod]` + `[test: ścieżka]`: plik istnieje i zawiera datę decyzji, a dla wpisów sprzed 28.10.2026 wystarczy wskazany fragment (`[test: ścieżka :: fragment]`). Zamiast testu dozwolone `[bez testu: powód ≥ 10 znaków]`.
- `[wdrożenie: bez kodu — powód]`.
- `[wdrożenie: zastąpione DD.MM.RRRR]` (data nie wcześniejsza niż wpis).
- `[wdrożenie: otwarte → ID]`.
- `[wdrożenie: odłożone → wersja]`.

Od 28.10.2026 wskazany test musi zawierać datę decyzji (test akceptacyjny 07-jakosc-005).

Stan po uzupełnieniu (319 wpisów). Decyzje, które audyt uznał za niewdrożone, mają pole „otwarte → zadanie napraw”:
- 12.10 P3 B → 002;
- 12.10 spec docs/27 → 001 i 016;
- 13.10 Ukraina → 037;
- 18.10 pkt 2 (stuknięcia po tekście) → 034;
- 21.10 Porkbun w polityce → 017;
- 21.10 STOP 3 M3 i 23.10 K3 → 024;
- 23.10 K1 („Pro” obok „Pełna wersja”) → 009, czeka na decyzję właściciela;
- 27.10 bramka 4 → 005.

Wpis z 23.10 o kolejności planów ma „zastąpione 27.10.2026”, a wpis z 27.10 ma „kod” i test `tests/paywall-kolejnosc-domyslna.test.ts`. Pełna mapa wpisów: `dowody/mapa-wpisow.mjs`. Wyciąg z tabel audytu: `dowody/tabele-decyzji-audytu.md`.

## Testy przed → po

| Test | Przed | Po |
|---|---|---|
| `npm run check:decyzje` | kod 1, 319 błędów na 319 wpisach (`dowody/check-decyzje-przed.txt`) | kod 0, 319 wpisów (`dowody/check-decyzje-po.txt`) |
| `tests/decyzje-straznik.test.ts` na bazie 862f119 (nowy test i skrypt, stary docs/18) | 11 z 21 czerwonych: dziennik, CLI w verify, 8 wierszy tabeli audytu, kolejność planów (`dowody/jest-przed-baza-862f119.txt`) | 21/21 zielonych |
| testy czytające docs/18, CLAUDE.md i docs/40 (35 plików, `--maxWorkers=1`) | — | 468/468 zielonych (`dowody/jest-po-testy-dokumentow.txt`) |
| `tests/m5s1-dni-zapis.test.ts`, „limit tylko się luzuje” | nowy test czerwony przed zmianą JSON (`dowody/limity-wydan-przed.txt`) | 24/24 zielonych (`dowody/limity-wydan-po.txt`) |
| `npx tsc --noEmit`, eslint zmienionych plików, `check:matrix`, `check:readme` | — | kod 0 (eslint: pliki poza konfiguracją, 0 błędów) |

Mutacje robiłem w osobnej kopii w scratchpadzie (`git worktree`, cofnięta po każdej próbie i usunięta na końcu). Wszystkie mutanty zabite:
- M1: brak sprawdzenia, czy plik testu istnieje;
- M2: wyłączona reguła daty od 28.10;
- M3: wpis „Ukraina” przemianowany na „bez kodu”;
- M4: dopisana decyzja bez pola;
- M5: brak kontroli daty zastąpienia;
- M6: próg obniżony z 7 do 5 min;
- M7: P3 = true.

Dowody: `dowody/mutacje-straznika-decyzji.txt`, `dowody/mutacje-limity-wydan.txt`. Przy M3 samo `check:decyzje` przechodzi, bo pole ma poprawną postać. Mutanta zabija test regresji tabeli w Jest, a Jest jest częścią verify.

Pełnego `npm run verify` nie uruchamiałem (zgodnie z poleceniem uruchomi go koordynator).

## Przegląd ścieżek wrażliwych

Zmiany dotykają testów zakupów i limitu (`tests/limity-wydan.json`, `tests/m5s1-dni-zapis.test.ts`), ale nie kodu aplikacji. Niezależny przegląd subagentem **nie odbył się**: jako subagent nie mam narzędzia do jego uruchomienia. Polecenie dla koordynatora: przegląd `git diff 862f119..88e3c9c -- tests/limity-wydan.json tests/m5s1-dni-zapis.test.ts` (tylko P0/P1). Oczekiwany wynik: brak uwag, bo zmienione są wyłącznie testy.

## Nowe obserwacje (nie naprawiane)

- Tabela roli 08 wskazuje `tests/watch-availability.test.ts` jako strażnika decyzji z 22.10 o ikonie zegarka (pole `icon:`). Ten plik ikony nie sprawdza. Sprawdza ją `tests/m3-system.test.tsx` (test „ikona zegarka … pole icon:”) i ten test wskazałem w docs/18.
- Trzy wpisy „kod” nie mają testu wartości, tylko zapisany powód: 18.10 zrzuty z ciemnej wersji, 18.10 treść pliku `LICENSE`, 21.10 słowo kluczowe „domu”. To kandydaci na testy w 1.0.x (P2).

## Otwarte

1. **Archiwum `docs/18-archiwum-do-11.10.md`** (zamrożone, 105 punktów z datą z 06–11.10) jest poza strażnikiem. Decyzje z tego okresu, które sprawdzał audyt, są zgodne z kodem. Objęcie archiwum zajmie agentowi ok. 40 min (pola we wpisach i plik w `PLIKI` skryptu). Opcje dla koordynatora: (a) objąć archiwum teraz; (b) zostawić je zamrożone. Rekomendacja: (b), bo to plik historyczny, a bieżące decyzje są w docs/18.
2. **Powiązania wsteczne są mechaniczne.** Wskazany test zawiera datę decyzji albo wskazany fragment, ale nikt nie ocenił, czy sprawdza każdą część złożonej decyzji. Wpisy zbiorcze (np. 20.10 DEC-01…27, 23.10 STOP 2) mają jedno pole i kilka testów. Przy reaudycie warto sprawdzić próbkę 10–15 powiązań.
3. **04-studio-projektowe-003:** pozycja „podgląd liczb po przytrzymaniu — 1.0.1” (DEC-01 a) nadal nie jest w backlogu docs/21 z wersją. W docs/18 jest odnotowana w polu wpisu z 23.10. Dopisanie do backlogu należy do koordynatora (zasady docs/21).
4. **Poza wyborem DEC-02 a, niewdrożone:** 10-wydanie-006 (a), czyli krok przed wydaniem z `git merge-base` dla gałęzi wskazanych w decyzjach, oraz 08-programista-003 (b), czyli lista zadań gałęzi w PR.
5. **Wpisy „otwarte” w kodzie aplikacji** prowadzą zadania 001, 002, 005, 016, 017, 024, 034 i 037 (role 08 i 02). Przy naprawie wykonawca zmienia pole na „kod” i wskazuje test z datą decyzji; test regresji tabeli na to pozwala.
6. **K1 (03-zakres-002)** wymaga decyzji właściciela: jedna nazwa płatnej części („Pro” w 5 tekstach obok „Pełna wersja”). Opcje: (a) wszędzie „Pełna wersja”, kosztem zmiany 5 tekstów w 35 językach; (b) „Pro” jako skrót uznany za zgodny z K1, kosztem wyjątku dopisanego do decyzji. Rekomendacja roli 03: (a).

## Kontrola dowodów i sekretów

`node narzedzia/sprawdz-raport.mjs wynik.md <kopia robocza> . --rola 07-jakosc` → wynik niżej.

```
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 07-jakosc (kod wyjścia 0)
```
