# Recenzja W-22: „Co nowego” w metadanych sklepu

- autor: programista sesji X (W-11)
- recenzent: audytor (subagent, niezależny)
- data: 12.11.2026
- zakres: bccd857b, 9259012d (stan na HEAD a378a224, gałąź naprawy/w11b-1-1)

## Metoda

- `git show bccd857b`, `git show 9259012d`, `git diff 9259012d HEAD -- scripts/store-whatsnew.mjs tests/store-whatsnew.test.ts lib/whatsnew-wpisy.ts` (bez zmian po 9259012d).
- Przeczytane: `scripts/store-whatsnew.mjs`, `scripts/strona/ts-loader.mjs`, `lib/i18n.ts` (`t`, `lookup`, `applyLang`), `lib/locales/index.ts` (nakładki es-419/pt-BR),
  `scripts/asc/metadane.mjs` (LIMITY, `buildWanted`, pole whatsNew pomijane dla pierwszej wersji), `scripts/pochodne.mjs`, `scripts/ci/kontrole.mjs`, `scripts/ci/blokada-wydania.mjs`,
  `scripts/pliki-generowane.mjs`, `tests/store-whatsnew.test.ts`, `tests/backlog-0.10.1-dane.test.ts` (LOG2-05), `package.json`.
- `node scripts/store-whatsnew.mjs --check` w repo → kod 0, 33 lokalizacje.
- Kopia w katalogu tymczasowym (scripts, lib, store, dowiązanie node_modules), repo nietknięte:
  - ręczna zmiana whatsNew `ja` → `--check` kod 1; `--write` → `--check` kod 0, plik bajtowo identyczny z repo (`cmp`);
  - zmiana tłumaczenia w `lib/locales/de.json` → `--check` kod 1;
  - usunięty klucz „Zapowiedzi głosowe używają najlepszego głosu…” z `lib/locales/cs.json` → `--check` kod 1, ale `--write` kończy się kodem 0 i wpisuje do `cs` wiersz angielski „• Voice announcements use the best voice installed on your phone.”;
  - dodana lokalizacja `fr-CA` → błąd „lokalizacje sklepu bez języka aplikacji: fr-CA”, kod 1;
  - nieznany argument → kod 2.
- Porównanie JSON pliku sklepu przed/po 9259012d i HEAD z pominięciem whatsNew → identyczne (inne pola nietknięte); plik przed zmianą miał już format `JSON.stringify(…, null, 2)+"\n"`.
- Porównanie każdej lokalizacji z en-US/pl: żadna lokalizacja nieangielska nie ma dziś wiersza z zapasu EN/PL (stan na HEAD i na 9259012d).
- `diff` treści przeniesionej z `lib/whatsnew.ts` (bccd857b~1) do `lib/whatsnew-wpisy.ts` → różnią się tylko puste wiersze.
- `npx jest --ci --runInBand tests/store-whatsnew.test.ts tests/whats-new.test.tsx` → zielone (pierwszy przebieg na zimno: 1 porażka w whats-new.test.tsx, dwa kolejne zielone — limit czasu przy starcie, nie błąd treści);
  `tests/whatsnew-biezacy-build.test.tsx tests/release-1.1.0.test.tsx tests/backlog-0.10.1-dane.test.ts -t "LOG2-05|Co nowego|whats|W-08"` → zielone.
- `node scripts/i18n-context.mjs --check`, `node scripts/claims.mjs --check` → kod 0.

## Znaleziska

| # | Poziom | Pewność | Znalezisko | Dowód | Kroki / scenariusz | Realność |
|---|--------|---------|------------|-------|--------------------|----------|
| 1 | ŚREDNIE | 95% | Brakujące tłumaczenie punktu „Co nowego” nie jest błędem generatora — `--write` cicho wpisuje tekst angielski (a bez EN polski) do whatsNew lokalizacji nieangielskiej; `--check` przechodzi po takim zapisie. | `scripts/store-whatsnew.mjs:24-26` (`WHATS_NEW[0].items()` przez `t()`), `lib/i18n.ts:106` (`lookup`: słownik → EN → PL); test w kopii z usuniętym kluczem `cs` (Metoda). `tests/i18n-locales.test.ts:36` dopuszcza brak klucza z `PENDING_NEW` (rodzaj „nowy”), a `scripts/ci/blokada-wydania.mjs:18-19` blokuje tylko rodzaj „zmieniony”. | Programista dopisuje punkt do wpisu „Co nowego” (np. 1.2), klucz czeka w zestawie przekładu jako „nowy”, `store-whatsnew --write` → np. `de-DE`, `ja` dostają angielskie zdanie; `check:release` i `check:whatsnew-sklep` zielone; `asc-metadane.yml` wysyła angielski tekst do niemieckiej karty sklepu. Aplikacja też pokaże ten punkt po angielsku (parytet zachowany), więc to nie rozjazd z aplikacją, tylko brak bramki, o którą pytał brief. | brzegowy (wymaga wysyłki metadanych przed przekładem; dziś 0 przypadków) |
| 2 | NISKIE | 85% | Nowy `check:*` dodany do haka pre-push (przez `check:pochodne`) i do verify bez testu przypadku „gałąź z wcześniejszymi zmianami względem main” (L-080); test wprost deklaruje, że to nie strażnik procesu. Merytorycznie skrypt nie zależy od gita ani od bazy (czyta tylko drzewo), więc ryzyko pominięcia na gałęzi jest zerowe — rozjazd z literą reguły z CLAUDE.md, nie błąd działania. | `tests/store-whatsnew.test.ts:4`, `scripts/pochodne.mjs:31`, `package.json:27` | — (proces, bez drogi przez UI) | teoretyczny |

KRYTYCZNE / WYSOKIE: brak.

## Sprawdzone bez znalezisk

- Wybór języka: `es-MX→es-419`, `pt-BR→pt-BR`, `pt-PT→pt`, `zh-Hant→zh-Hant`, `no→nb`, `en-GB/AU/CA→en` (`scripts/store-whatsnew.mjs:14-18`); nakładki regionalne idą tą samą ścieżką co w aplikacji (`lib/locales/index.ts`, scalenie bazowy + wariant), więc es-MX/pt-BR = tekst aplikacji w es-419/pt-BR. Języki aplikacji bez lokalizacji sklepu (bg, sr, lt, lv, et) nie są potrzebne; lokalizacja sklepu bez wpisu → błąd (sprawdzone na fr-CA).
- Kolejność i treść: whatsNew każdej lokalizacji = punkty `WHATS_NEW[0]` w kolejności z aplikacji, w tym warunkowy punkt o nazwach (pomijany dla `en`, jak w aplikacji: 5 wierszy EN, 6 pozostałe); test `tests/store-whatsnew.test.ts:22-31` porównuje wszystkie 33 lokalizacje.
- Limit 4000: nie w generatorze, ale w teście (`tests/store-whatsnew.test.ts:33-39`, LIMITY z `scripts/asc/metadane.mjs:19`) i w walidacji przed zapisem do ASC; najdłuższy tekst 840 znaków (fr-FR). Pierwsza wersja aplikacji nie dostaje whatsNew (`scripts/asc/metadane.mjs:142`).
- `--check` wykrywa rozjazd (ręczna zmiana pola, zmiana słownika, brak klucza); `--write` deterministyczny, idempotentny, nie rusza innych pól ani kolejności lokalizacji; pusta historia usuwa pole.
- CI: `check:whatsnew-sklep` jest w łańcuchu `verify`, więc trafia do zadania `kontrole` w tests.yml (`scripts/ci/kontrole.mjs` czyta łańcuch verify) — scalenie dwóch gałęzi zmieniających wpisy/słowniki zostanie złapane.
- bccd857b: przeniesienie bez zmiany kodu (różnica tylko w pustych wierszach), `lib/whatsnew.ts` reeksportuje `WHATS_NEW` i typ; komponent `components/WhatsNew.tsx` i testy importują dalej z `@/lib/whatsnew`; strażnik LOG2-05 czyta nowy plik; konteksty tłumaczeń i rejestr twierdzeń aktualne; rola wydawcy wskazuje nowy plik.
- Bezpieczeństwo/prywatność: brak sekretów i danych osobowych w obu commitach; skrypt pisze tylko `store/app-store-metadata.json`, bez sieci i bez App Store Connect (zapis do ASC tylko `asc-metadane.yml` w środowisku `release`).
- Dane użytkownika, migracje, import/kopia, dostępność: obu commitów nie dotyczy (brak zmian w magazynie i UI).

## Werdykt

Brak blokerów (KRYTYCZNE/WYSOKIE: 0). Generator robi to, co deklaruje, a `--check` działa. Znalezisko 1 (ŚREDNIE, brzegowe) do backlogu z wersją — proponowana naprawa: generator albo `check:release` odmawia, gdy którykolwiek punkt najnowszego wpisu nie ma tłumaczenia w słowniku danej lokalizacji (`own(dictOf(l), klucz)`), z testem na kopii słownika bez klucza. Znalezisko 2 (NISKIE) — notatka.
