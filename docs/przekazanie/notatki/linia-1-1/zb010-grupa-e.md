# ZB-010 — grupa E: migracja testów do RNTL 14 / SDK 58 (02.11.2026)

Gałąź `zb010/sdk`, start od `cdf3539` (pomocniki grupy D). Pomiar: każdy plik osobno `npx jest tests/<plik> --runInBand --ci`, lokalnie 02.11.2026. Pomocników wspólnych (`tests/app.tsx`, `tests/helpers.ts`, `tests/maestro-runner.ts`) nie zmieniano. Asercji nie zmieniano.

## Wynik

- Przed (raport-zb010 pkt 7): 24 pliki, 71 czerwonych testów.
- Po: **23 pliki zielone, 1 czerwony** (`tests/sec-link-z-parametrami.test.tsx` — zestaw nie startuje, sygnał niżej). Lista: places-scenario 1/1, plan-reminder 10/10, plans-multi-ui 6/6, audit-close2-a 7/7, close-button-guard 29/29, audit-m1-026-kolejnosc-menu 4/4, adapt-scenario 1/1, scenario-0.10 5/5, audit-m1-065-week-start 28/28, ui2-06-gen-back-to-plan 5/5, muscle-roles-ui 44/44, xcheck-0610b 7/7, audit-m1-027-pasek-tygodnia 5/5, audit-records-misc 5/5, audit-m1-032-total-bars 4/4, audit-m1-025-muscle-caption 6/6, audit-m1-038-exname-lang 6/6, audit-journey-b 2/2, audit-m1-033-session-row 4/4, template-cards 2/2, audit-final2-ui 2/2, audit-final-auto 1/1, matrix-dim-langs-routes3 7/7.
- `npx tsc --noEmit -p .`: w zmienionych plikach 0 błędów; łącznie 429 (po D: 452 — reszta w plikach innych grup).
- `npx eslint` na plikach grupy E: 0 błędów (tylko ostrzeżenia „file ignored”).

## Zmiany API (bez zmiany asercji)

- `expo-router/build/global-state/router-store` → `require('./app').navRef()` (places-scenario, close-button-guard, ui2-06-gen-back-to-plan, adapt-scenario).
- `el.findAll(…)` → `el.queryAll(…)` (audit-m1-065, muscle-roles-ui, audit-m1-027, audit-m1-032, audit-m1-025, audit-m1-038, audit-m1-033).
- `x.type === Text` (komponent) → `x.type === 'Text'` (element natywny) — audit-m1-027; usunięty nieużywany import `Text`.
- `act(() => …)` → `await act(async () => …)`; `act(async () => { fireEvent… })` → `await fireEvent` w środku (plan-reminder, plans-multi-ui, audit-m1-026, scenario-0.10 i in.).
- `r1.unmount()` → `await r1.unmount()` (audit-close2-a, audit-journey-b, audit-final2-ui, audit-final-auto). Bez `await` następny `renderApp` startował przed końcem odmontowania → „store not initialised” (audit-close2-a 7/7 czerwonych).
- audit-m1-026: `layoutRows` asynchroniczne (`await act(async () => { await fireEvent(p, 'layout', …) })`) i wywołania z `await`.

## Nowe wzorce API (uzupełnienie listy grupy D)

- `unmount()` zwraca obietnicę w RNTL 14 — zawsze `await` przed kolejnym `renderApp` (inaczej błąd stanu sklepu, nie komunikat o `act`).
- Porównanie typu elementu z komponentem (`n.type === Text`) nie trafia — w drzewie są tylko elementy natywne, porównywać z napisem `'Text'`/`'View'`.

## Sygnały (nie poprawione — do decyzji koordynatora)

- `tests/sec-link-z-parametrami.test.tsx` — zestaw nie startuje: `Cannot find module 'query-string'` (wiersz 15, `createRequire(__filename)('query-string')`). Przyczyna: expo-router 58 nie zależy już od `query-string`; `npm ls decode-uri-component` → puste, `node_modules/query-string` nie istnieje — to cel ZB-010 (podatność GHSA-vcc3-ghjq-m6fr usunięta z drzewa). To samo założenie co `public-repo` SEC-06 w grupie D. Sprawdzone na tymczasowej kopii bez opisu `query-string` (nie w commicie, usunięta): 3/3 testy „ekran: otwarcie linku z parametrami” (poprawny, spreparowany `%E0%A4%A`, nieznana wartość) przechodzą na SDK 58 — otwieranie linków działa.
  Opcje: **A (rekomendacja)** — usunąć opis `query-string` (3 testy parsera, który nie istnieje), zostawić 3 testy ekranowe i dopisać strażnik „`decode-uri-component` i `query-string` nieobecne w package-lock” (pilnuje celu ZB-010); koszt: test parsera zastąpiony testem braku. **B** — przepiąć 3 testy parsera na parser linków expo-router 58 (`node_modules/expo-router/build/loaders/utils.js` albo publiczne API) — zachowuje test zniekształconego %-kodowania na poziomie parsera, ale wiąże test z wewnętrzną ścieżką `build/` (to właśnie zepsuło router-store). Decyzja o treści strażnika bezpieczeństwa należy do koordynatora/właściciela.

## Stan

- Zrobione: wszystkie 24 pliki grupy E (commit niżej).
- Zostało: decyzja w sprawie `sec-link-z-parametrami` (A/B wyżej).
- Następny krok: koordynator — pełny Jest/verify po scaleniu grup.
