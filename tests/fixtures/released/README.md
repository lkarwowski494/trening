# Zapisy bazy z wydanych buildów (fixture’y migracji)

Klucze `state`, `live` i `cfg` tabeli `kv` zapisane przez **kod wydanych tagów** (dane syntetyczne, bez danych osobowych); używa ich `tests/migrate-released.test.ts`
(M1-audytor-generalny-007). Schemat 17 nie został nigdzie wydany (tagi od `v0.11.0-b1005` mają schemat 18) — jego kształt odtwarza drabina w `tests/matrix-migrations.test.tsx`.

| plik | tag | schemat |
|---|---|---|
| `state-v0.11.0-b1005-schema18.json` | `v0.11.0-b1005` (najstarszy wydany z 18) | 18 |
| `state-v0.18.0-b1017-schema18.json` | `v0.18.0-b1017` (najnowszy wydany z 18) | 18 |
| `state-v0.20.0-b1018-schema19.json` | `v0.20.0-b1018` | 19 |

Jak powstały: `git worktree add --detach <katalog> <tag>`, `node_modules` podlinkowane z bieżącego repo, `gen-fixture.ts.txt` skopiowany jako `tests/gen-fixture.test.ts`
w worktree tagu i uruchomiony `FIXTURE_TAG=<tag> FIXTURE_OUT=<plik> npx jest tests/gen-fixture.test.ts`. Generator używa interfejsu magazynu z danego tagu
(szablony, miejsca, treningi, plan tygodnia i jego historia, trening w toku, zmiana konfiguracji → klucz `cfg`). Pliku nie edytujemy ręcznie; nowy wydany schemat = nowy plik.
