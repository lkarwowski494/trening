# Stan agenta AB (programista, tryb fix), gałąź napr/testflight-1-1-czas, 12.11.2026

Polecenie: `origin/koordynacja:docs/koordynacja/polecenia/AB.md` @ 193f2e4. Raport źródłowy: `docs/audyt-1-1/testflight-czas-2026-11-12.md`.

## Zrobione (SHA na gałęzi, wypchnięte; głowa c2910df)
- 07-jakosc-002 (868000b…): `scripts/modul-glowny.mjs` (`jestGlowny`, realpath), 67 kruchych porównań podmienionych w scripts/ i docs/; `tests/modul-glowny-symlink.test.ts` (skan wszystkich .mjs — strażnik nowych skryptów).
- 07-jakosc-003 D(b): `eksport.mjs --skroty <plik>` + `createExporter({skroty})`; test liczy skróty raz. strona-eksport-recenzja (Linux): 446 s → 162 s, te same 12 asercji.
- 07-jakosc-001 A: `testflight.yml` zadanie `testy` (macos-26, **6 części, max-parallel 3** — limit planu 5 zadań macOS, macierze ≤ 3: `tests/macos-max-parallel.test.ts`; verify:kontrole w części 1; jest-ponow --shard=K/6; po bramce E2E), `build` needs [bramka, testy], bez kroku verify. Liczby: `scripts/ci/czasy-tests.json` → `testflight_macos` (czesci_jest 6, limit_tymczasowy_min 45, probka_min pusta, minimalna_probka 10). Strażnik: `tests/testflight-testy-czas.test.ts`. Odczyt swap po Jest (`sysctl vm.swapusage`).
- Poprawione strażniki starego kształtu / kopii skryptów (testy kopiujące pojedyncze skrypty do tmp wymagają teraz `scripts/modul-glowny.mjs`: kontrole-ci, jest-ponow-sygnal-ko038, waskie-gardla-zb041, hak-pre-push, blokada-wydania-stan, maestro-failures, jest-sterta; przeglad-tlumaczen whitelist importów; regress T-051; public-repo; ponowienia-workflow.json).
- Lekcje: 2 × `## L-NNN` na górze docs/40 (bramka E2E vs SHA; build TestFlight 1.1).
- `verify:lekkie` zielone (c2910df). Pierwszy tests.yml (034bf94, 43321959915) czerwony z powodów wyżej — naprawione w c2910df, NIE potwierdzone w CI.

## Zostało (następca; AB nie wyzwala CI)
1. tests.yml na c2910df (push już poszedł): ma być zielony; gdy czerwony — pliki FAIL z logów zadań jest (1)–(5). Testy kopiujące skrypty do tmp: sprawdź, czy któryś nie ma modul-glowny.mjs.
2. e2e-ios.yml (pakiet podstawowy) na nowym SHA (e2e 43321971898 jest na 034bf94 — nie liczy się).
3. Po zielonym e2e: `testflight.yml` TYLKO z `bez_wysylki: true` (bez pomin_bramke_e2e). Odczytać czasy 6 części macOS i `vm.swapusage`; wpisać czasy do `probka_min` w czasy-tests.json (pole `czesc`, `min`, `przebieg`), limit dalej tymczasowy (min. próbka 10). Dopisać czasy do raportu i do lekcji (stan akcji b „otwarte”).
4. Zmiana decyzji względem KO-058: 6 części po max 3 (nie 5) — do weta; powód: strażnik max-parallel (decyzja właściciela 27.10.2026). Limit równoległych zadań macOS = 5 (z docs/40 i testu), strona docs.github.com niedostępna z kontenera.

## Pułapki
- Hak pre-push wymaga znacznika; po zmianie kodu `npm run verify:lekkie`; macierz i README: `node scripts/test-matrix.mjs --write`, `node scripts/readme.mjs --write` (bez tego verify:lekkie czerwone).
- Nie używać `pomin_bramke_e2e`; nie podnosić timeout-minutes.
- Plik stanu leży w docs/audyt-1-1 (STAN-AGENTA.md w korzeniu jest w .gitignore, generator README go nie zna).
