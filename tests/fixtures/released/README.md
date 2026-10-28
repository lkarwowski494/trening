# Zapisy bazy z wydanych buildów (fixture’y migracji)

Klucze `state`, `live` i `cfg` tabeli `kv` zapisane przez **kod wydanych tagów** (dane syntetyczne, bez danych osobowych); używa ich `tests/migrate-released.test.ts`
(M1-audytor-generalny-007). Schemat 17 nie został nigdzie wydany (tagi od `v0.11.0-b1005` mają schemat 18) — jego kształt odtwarza drabina w `tests/matrix-migrations.test.tsx`.

| plik | tag | schemat |
|---|---|---|
| `state-v0.11.0-b1005-schema18.json` | `v0.11.0-b1005` (najstarszy wydany z 18) | 18 |
| `state-v0.18.0-b1017-schema18.json` | `v0.18.0-b1017` (najnowszy wydany z 18) | 18 |
| `state-v0.20.0-b1018-schema19.json` | `v0.20.0-b1018` | 19 |
| `state-v1.0.0-b1032-schema19.json` | `v1.0.0-b1032` (1.0, build 2; generator `gen-fixture-1.0.ts.txt`) | 19 |

Jak powstały: `git worktree add --detach <katalog> <tag>`, `node_modules` podlinkowane z bieżącego repo, `gen-fixture.ts.txt` skopiowany jako `tests/gen-fixture.test.ts`
w worktree tagu i uruchomiony `FIXTURE_TAG=<tag> FIXTURE_OUT=<plik> npx jest tests/gen-fixture.test.ts`. Generator używa interfejsu magazynu z danego tagu
(szablony, miejsca, treningi, plan tygodnia i jego historia, trening w toku, zmiana konfiguracji → klucz `cfg`). Pliku nie edytujemy ręcznie; nowy wydany schemat = nowy plik.

**1.0 (M1-audytor-generalny-014, DEC-03 b, 27.10.2026):** `state-v1.0.0-b1032-schema19.json` powstał tak samo, z kopii tagu wypakowanej przez `git archive`
zamiast worktree, generatorem `gen-fixture-1.0.ts.txt` (to co `gen-fixture.ts.txt` plus pola dodane w 0.20–1.0 bez podbicia schematu: trening na żywo
i `liveDays`, pauzy, własne ćwiczenie, ćwiczenie z biblioteki zmienione przez użytkownika, `voice`, `haptics`, tydzień deload, zmiana dnia planu). Lista
`features` w pliku mówi, co weszło.

**Odciski normalizacji:** `tests/fixtures/odciski-normalizacji.json` trzyma odcisk wyniku startu aplikacji na każdym pliku stąd, z numerem schematu.
Reguła: zmiana normalizacji danych = podbicie `SCHEMA_VERSION` (docs/brd/wymagania.md NFR-DAN-001). Inny wynik przy tym samym schemacie → czerwony
`tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts`. Po podbiciu schematu (albo po dodaniu nowego pliku tutaj) odciski zapisuje
`ODCISKI_ZAPISZ=1 npx jest tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts`; przy tym samym schemacie zapis tylko dopisuje nowe pliki
i odmawia nadpisania zmienionego odcisku.
