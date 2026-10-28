# 02-monetyzacja — reaudyt M1 pętla 2 (pieniądze, dane, niezawodność)

Commit: 0a566a1 · Baza: 4c116d0 · Tryb: tylko odczyt; testy celowane `--maxWorkers=1`; eksport `expo export --platform ios` do /tmp (poza repo); worktree bazy w /tmp/m02-base.

## Podsumowanie

| Zadanie | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-046 (71a0e41, 9cf1c90) | zweryfikowane | dowody/jest-celowane.txt; dowody/jest-testy-na-bazie-4c116d0.txt (5 przypadków czerwonych na bazie); app/paywall.tsx:62, app/paywall.tsx:95, lib/fairrules.ts:23 |
| M1-audytor-generalny-032 (525fe5c, c37dd58) | zweryfikowane | lib/state/boot.ts:43, components/StartError.tsx:38; testy m1-032 czerwone na bazie (dowody/jest-testy-na-bazie-4c116d0.txt) |
| M1-audytor-generalny-042 (c85b71b) | zweryfikowane | lib/state/boot.ts:38, lib/state/boot.ts:108; test m1-042 czerwony na bazie, zielony na HEAD |
| M1-audytor-generalny-049 (97f9347) | zweryfikowane | tests/architecture-limits.test.ts:9 (figures usunięte z pominięć), nowy przypadek zielony (dowody/jest-celowane.txt) |
| M1-audytor-generalny-040 (18ad8e9) | zweryfikowane | lib/live.ts:94; 5 języków czerwonych na bazie, zielonych na HEAD |
| d4af580 (pomocniczo: spokenUnit/spokenNoun do lib/units.ts) | zweryfikowane (przeniesienie bez zmiany logiki; `wu()` → `unit` w tym samym module) | lib/units.ts:103, tests/m1-041-el-jednostka.test.ts zielony |
| PRIORYTET: `forgetAccessMemory` / panel "Test store" w buildzie sklepowym | zweryfikowane — brak P0/P1 | dowody/bundle-sklepowy.txt; app/paywall.tsx:78; tests/store-adapter.test.ts:82 |

| ID | Poziom | Realność | Opis | Dowód |
|---|---|---|---|---|
| 02-monetyzacja-701 | — (teoretyczne) | teoretyczny | `forgetAccessMemory` jest eksportem publicznym bez strażnika "wołane tylko w panelu Test store" | lib/entitlement.ts:83 |

Pilne (P0/P1): brak — pilne.md nie utworzony.

## Przegląd różnicy

- `forgetAccessMemory` (lib/entitlement.ts:83) — jedyne wywołanie w aplikacji: app/paywall.tsx:139 wewnątrz panelu renderowanego tylko gdy `fake` (app/paywall.tsx:78 "isFakeStoreBuild() ? (getStoreAdapter() as unknown as FakeStoreControl) : null"). `isFakeStoreBuild` = `process.env.EXPO_PUBLIC_STORE_FAKE === '1'` (lib/products.ts:54). Zmienną ustawia tylko e2e-ios.yml (.github/workflows/e2e-ios.yml:98); testflight.yml przerywa build, gdy jest ustawiona (.github/workflows/testflight.yml:102); w repo brak plików .env, a app.json/eas.json/package.json jej nie zawierają (strażnik tests/store-adapter.test.ts:78). Eksport bez zmiennej: w pakiecie Hermes łańcuch `EXPO_PUBLIC_STORE_FAKE` nie występuje (wartość wstawiona jako undefined), kod panelu i nazwa funkcji są w pakiecie, ale gałąź jest nieosiągalna (dowody/bundle-sklepowy.txt). Panel z "expire access" istniał już na 4c116d0 — nowa funkcja nie poszerza ekspozycji. Strażnik panelu: tests/store-adapter.test.ts:82 (panel tylko za `isFakeStoreBuild()`), zielony.
- Skutek hipotetycznego wywołania u płacącego: kasuje tylko pamięć `access` w kv (nie zakupy, nie dane treningowe); online następne odświeżenie sklepu odtwarza pełny dostęp; offline poziom spada do "free/silent" do powrotu sieci. Darmowego dostępu nie daje (czyści pamięć "full", nie dodaje uprawnień).
- app/paywall.tsx:62 `knownFull` = poziom full bez aktywnego uprawnienia — możliwe tylko przy `ent === null` (sklep bez odpowiedzi, pamięć "full"); ukrywa wstęp, plany i stopkę dla darmowych; "Przywróć zakupy" zostaje. Rada "anuluj" tylko przy `paysSub` (bez Chmury rodzinnej, app/paywall.tsx:95).
- lib/fairrules.ts:23 — były subskrybent (lista sklepu albo `endedAt` w pamięci) nie dostaje okna; nie dotyka treningów ani limitu.
- Start: lib/state/boot.ts:43 opakowuje `initInner`; `startFailureDiag` dopisuje tylko etap, czas, data/empty, schemat, licznik (lib/state/bootphase.ts:31) — bez treści błędu. E-mail "Napisz do nas" dostaje wyłącznie `diag` (components/StartError.tsx:38), treść błędu (`detail`) tylko na ekranie. Prywatność bez uwag.
- `handledBootFailure` (lib/state/boot.ts:38) zapisuje wyłącznie klucz `bootguard` = 0 po obsłużonym wyjątku migracji / danych z nowszej wersji; nie dotyka `state`, `premigrate_*` ani kopii; test m1-042 sprawdza "state" bez zmian po dwóch zimnych startach. Pętla startu: każdy start kończy się tym samym ekranem z "Wyślij dane" — bez zapętlenia, bez utraty danych. Awarie natywne (bez obsłużonego wyjątku) nadal liczą się w strażniku.
- lib/live.ts:94, lib/board.ts:9, lib/units.ts — tylko teksty/etykiety, bez wpływu na dane. app/_layout.tsx i FairRulesSheet/StartError — tylko import `Text` z AppText.
- .maestro/56-uczciwe-zasady.yaml — przełączony na `fake-new-user` (stan nowego użytkownika), zgodnie z nowym warunkiem okna.

## Znaleziska

### 02-monetyzacja-701
Teoretyczne (bez drogi przez UI w buildzie sklepowym): lib/entitlement.ts:83 eksportuje `forgetAccessMemory`, a strażnik pilnuje tylko panelu (tests/store-adapter.test.ts:82), nie miejsc wywołania funkcji — przyszłe użycie poza panelem przeszłoby testy. Istnieje od 9cf1c90 (regresja zakresu strażnika, nie zachowania). Propozycja do backlogu: test "forgetAccessMemory wołane tylko w app/paywall.tsx w gałęzi fake".

## Nie sprawdzono

- Scenariusz Maestro 56 na symulatorze (brak macOS); sprawdzony tylko odpowiednik w Jest (m1-046, przypadek "forgetAccessMemory + pusta lista").
- Build podpisany TestFlight — sprawdzono `expo export` bez zmiennych (ten sam etap JS co w testflight.yml), nie natywny pakiet .ipa.

## Kontrola dowodów i sekretów

Dowody: dowody/jest-celowane.txt (19 plików, 437 testów zielonych), dowody/jest-testy-na-bazie-4c116d0.txt (nowe testy na kodzie bazy: 17 czerwonych), dowody/bundle-sklepowy.txt, dowody/git-status-start.txt, dowody/git-status-koniec.txt, dowody/sprawdz-raport.txt (kod 0). Raport bez e-maili, UDID, tokenów i nazw innych marek.
