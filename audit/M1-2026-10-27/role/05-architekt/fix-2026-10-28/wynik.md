# 05-architekt · tryb fix · 28.10.2026 · M1-audytor-generalny-014 (05-architekt-002)

Gałąź kopii: `worktree-agent-ab4166706ebe13451` (od `naprawy/M2-koordynator-napraw-2026-10-27-p3` @ `f775eb5c`), commit `59fc6d71`.
Nie wypchnięte, nie scalone, workflowy nieuruchamiane.

## ETAP 0 — środowisko

| Sprawdzenie | Wynik |
|---|---|
| System, Node | Linux x86_64, Node v22.22.0; git działa w kopii roboczej |
| GitHub | nieużywany (polecenie: bez push i workflowów) |
| Xcode / symulator | brak (Linux) — zmiana nie dotyka kodu natywnego ani UI |
| Repo | publiczne; zapis wzorcowy to dane syntetyczne, `tests/public-repo.test.ts` zielony |
| Maszyna współdzielona | Jest tylko `--maxWorkers=1`, tylko testy związane |

## E0 — klasyfikacja i plan

| ID | Rodzaj | Rozstrzygnięcie | Plan |
|---|---|---|---|
| M1-audytor-generalny-014 (05-architekt-002) | P | DEC-03 b, właściciel 27.10.2026: reguła „zmiana normalizacji danych = podbicie numeru schematu”, pilnowana testem | reguła w docs (BRD NFR-DAN-001, docs/20, README zapisów wzorcowych), wpis w docs/18, test-strażnik; kodu aplikacji nie zmieniamy (opcja a odrzucona) |

Projekt nie ma katalogu ADR ani `docs/architektura/` — reguła trafiła do BRD (wymaganie niefunkcjonalne o danych), definicji ukończenia i README zapisów wzorcowych.

## E1 — co zrobione

1. **Reguła** (docs/brd/wymagania.md, NFR-DAN-001; docs/20-definicja-ukonczenia.md, rodzaj 6 „Dane”; tests/fixtures/released/README.md): każda zmiana kodu startu,
   po której zapis z poprzedniego builda wychodzi ze startu inny niż dotąd (także przy tym samym schemacie), podbija `SCHEMA_VERSION`.
   Dlaczego: kopia `premigrate_<schemat>` powstaje tylko przy innym numerze schematu (`lib/state/boot.ts:94`), a pierwszy zapis po starcie utrwala wynik normalizacji.
   Nie dotyczy: nowego pola opcjonalnego, którego brak zostaje brakiem, i treści katalogu biblioteki (własne rewizje). Koszt nazwany: kopia zapasowa
   z podbitym schematem jest odrzucana przez starsze wersje.
2. **Strażnik** `tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts`: odciski SHA-256 (po kluczach stanu, JSON z posortowanymi polami) wyniku
   startu aplikacji (`store.init` → `migrate`, z kluczami „live” i „cfg”, zegar przypięty do 28.10.2026 12:00 czasu lokalnego) na każdym zapisie
   z `tests/fixtures/released/`, zapisane w `tests/fixtures/odciski-normalizacji.json` z numerem schematu.
   - ten sam schemat i inny wynik → czerwony z komunikatem reguły i kluczem, który się zmienił;
   - podbity schemat → czerwony, dopóki odciski nie zostaną zapisane (`ODCISKI_ZAPISZ=1 npx jest <plik>`);
   - zapis odcisków przy tym samym schemacie tylko dopisuje nowe zapisy; zmienionego odcisku nie nadpisuje (odmowa);
   - nazwany wyjątek: ćwiczenia z biblioteki nieruszone przez użytkownika, znaczniki kroków katalogu (`libExtra`, `libExtraStep`) i metadane zapisu
     (`metaUpdatedAt`, `saveSeq`); własne ćwiczenia i ćwiczenia z biblioteki zmienione przez użytkownika (`catalogRev: 'user'`) są w odcisku;
   - samosprawdzenie mechanizmu w tym samym pliku: 7 zmian danych użytkownika daje różnicę, zmiana treści katalogu i kolejności pól — nie.
3. **Nowy zapis wzorcowy z wydanego builda 1.0** `tests/fixtures/released/state-v1.0.0-b1032-schema19.json` (kod tagu `v1.0.0-b1032` wypakowany
   `git archive` do scratchpada, generator `tests/fixtures/released/gen-fixture-1.0.ts.txt`): pola dodane w 0.20–1.0 bez podbicia schematu — trening
   na żywo i `liveDays`, pauzy, strefa startu, własne ćwiczenie, ćwiczenie z biblioteki zmienione przez użytkownika, `voice`, `haptics`, tydzień deload,
   zmiana dnia planu, okno „Uczciwe zasady”. Bez niego strażnik nie obejmowałby normalizacji z 1.0 (znalezisko: buildy 1019–1031 bez własnego zapisu
   wzorcowego). `tests/migrate-released.test.ts` biegnie też na nim (zielony).
4. **Decyzja w docs/18** (ostatni wpis): `[wdrożenie: kod] [test: tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts]`; `npm run check:decyzje` →
   325 wpisów decyzji, każdy z polem wdrożenia i testem albo powodem. Plan testów: nowa sekcja na końcu docs/09-plan-testow.md.
5. Wygenerowane: `node scripts/i18n-context.mjs --write`, `node scripts/test-matrix.mjs --write` (bez braków), `node scripts/readme.mjs --write` (licznik testów).

Kod aplikacji (`lib/`, `app/`) bez zmian — przekazania do roli 08 nie ma.

## E2 — dowody (katalog `dowody/`)

| Krok | Wynik | Plik |
|---|---|---|
| Przed: strażnik bez odcisków | czerwony, 6 testów (brak odcisków), exit 1 | `dowody/01-przed-brak-odciskow.txt` |
| Po: testy związane (16 plików, w tym strażnik, `migrate-released`, `audit-m1-002-premigrate`, `audit-m1-044-brd`, `verify-docs`, `public-repo`) | 241 zielonych, 1 pominięty (zapis odcisków), exit 0 | `dowody/11-testy-zwiazane-po.txt` |
| Strażnik w 7 strefach z `tests-tz.yml` | 16/16 w każdej; plik jest na liście `scripts/ci/pin-wykluczenia.mjs` (własny zegar) | `dowody/12-strefy-czasowe.txt` |
| Typecheck, lint, check:matrix, check:readme, kontrola BRD | `tsc --noEmit` exit 0; eslint bez błędów; macierz bez braków; BRD 0 błędów (1 uwaga RD-04 sprzed tej zmiany) | — |

Pełne `npm run verify` nieuruchomione (polecenie: tylko testy związane, maszyna współdzielona) — do zrobienia raz po scaleniu partii.

**Strażnik potrafi paść — celowe błędy w kopii kodu** (`git archive HEAD` do scratchpada; gałąź nietknięta):

| Celowa zmiana | Wynik | Pliki |
|---|---|---|
| A. `migrate()` przycina `settings.defaultRest` do 100 s, schemat bez zmian | czerwony: 4 zapisy, „settings (zmieniony)” + komunikat reguły | `dowody/02-celowy-blad.diff`, `dowody/03-celowy-blad-ten-sam-schemat.txt` |
| B. ten sam błąd + `ODCISKI_ZAPISZ=1` | odmowa zapisu przy tym samym SCHEMA_VERSION 19; plik odcisków bez zmian (`cmp`) | `dowody/04-zapis-odciskow-odmowa.txt` |
| C. ten sam błąd + `SCHEMA_VERSION = 20` | czerwony: odciski są dla schematu 19; po zapisie odcisków zielony | `dowody/05-podbity-schemat-bez-odciskow.txt`, `dowody/06-podbity-schemat-zapis-odciskow.txt`, `dowody/07-podbity-schemat-po-zapisie.txt` |
| D. normalizacja `liveDays` gubi strefę startu (zmiana tylko dla danych 1.0) | czerwony tylko na zapisie 1.0: „liveDays (zmieniony)”; `migrate-released` tego nie łapie, łapie też `m5s1-dni-zapis` | `dowody/08-celowy-blad-1.0.diff`, `dowody/09-celowy-blad-1.0.txt`, `dowody/10-celowy-blad-1.0-inne-testy.txt` |

Zrzuty ekranu: nie dotyczy (bez zmian widocznych). Status: naprawione-do-weryfikacji (status „zweryfikowane” nadaje reaudit).

## Przegląd ścieżki wrażliwej — nieodbyty

Zmiana dotyczy obszaru migracji (choć bez kodu aplikacji). Jako subagent nie mam narzędzia subagentów: polecenie przeglądu w
`narzedzia/przeglad-polecenie.md` — uruchamia koordynator albo właściciel.

## Nowe znaleziska i otwarte (nie naprawiane tutaj)

1. **Odwołania przepinane przez katalog** (`LIB_MERGED`, wycofane ćwiczenia) zmieniają treningi i szablony użytkownika. Według reguły to normalizacja → podbicie
   schematu. Strażnik złapie to tylko, gdy zapis wzorcowy zawiera scalane ćwiczenie. `[DO USTALENIA]` dla właściciela: czy scalenia w katalogu też podbijają
   schemat (opcja 1: tak, jak brzmi reguła — kopia sprzed zmiany, ale starsze wersje odrzucą nowe kopie zapasowe; opcja 2: nazwany wyjątek z własnym
   znacznikiem rewizji i testem 1:1 scalenia). Rekomendacja: 1 (reguła bez wyjątków jest łatwiejsza do pilnowania; scalenia są rzadkie).
2. **Zasięg strażnika = treść zapisów wzorcowych.** Normalizacja pola, którego nie ma w żadnym zapisie z `released/`, przejdzie. Zapis 1.0 poszerza zasięg;
   pola dodawane bez podbicia schematu warto dopisywać do generatora przy następnym wydaniu (propozycja kroku listy wydania dla roli 10 / wydawcy). P2.
3. **Wcześniejsze normalizacje bez podbicia** (np. `voiceSpeaker: true` → `voice: 'speaker'` z 19.10.2026, uzupełnianie `liveDays` z historii z 22.10.2026)
   są już wydane; reguła działa od 27.10.2026, strażnik przypina obecny wynik. Bez działania.

## Propozycja zmiany CLAUDE.md (decyzja właściciela; nie wprowadzałem)

- **Opcja A (rekomendacja):** jedna linia w sekcji o danych: „Zmiana normalizacji danych przy starcie (inny wynik `migrate` na zapisie poprzedniego builda)
  = podbicie `SCHEMA_VERSION` (DEC-03 b, 27.10.2026; reguła docs/brd NFR-DAN-001, strażnik `tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts`).”
  Zaleta: agent zna regułę przed pisaniem kodu, nie dopiero z czerwonego testu. Wada: jeszcze jedna linia w długim pliku.
- **Opcja B:** bez zmiany CLAUDE.md — regułę pokazuje komunikat strażnika. Zaleta: krótszy CLAUDE.md. Wada: agent może najpierw próbować „naprawić” test.

## Czas

Praca agenta ok. 1 h. Czekanie: brak (bez CI). Właściciel: decyzja w sprawie CLAUDE.md (A/B) i pkt 1 z otwartych.

## Kontrola dowodów i sekretów

```
$ node narzedzia/sprawdz-raport.mjs wynik.md <kopia robocza> .
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone (exit 0)
```
