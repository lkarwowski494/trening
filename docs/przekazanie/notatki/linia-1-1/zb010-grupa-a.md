# ZB-010 — grupa A (RNTL 14 / SDK 58): raport i stan (02.11.2026)

Sesja https://claude.ai/code/session_01T66VBz67FeP8xtERTjmhpy, gałąź `zb010/sdk` (start od `cdf3539`). Pomiar: każdy plik osobno `npx jest <plik> --runInBand --ci`.

## Wynik

| Plik | przed (czerwone / testy) | po |
|---|---|---|
| `tests/regress.test.tsx` | 12 / 321 | 1 / 321 (T-051 — sygnał, niżej) |
| `tests/figures-v2-chod-cykliczny.test.tsx` | 7 / 85 | 0 |
| `tests/figures-v2-katy-fazy.test.tsx` | 8 / 27 | 0 |
| `tests/edit-on-demand.test.tsx` | 5 / 23 | 0 |
| `tests/m3-components.test.tsx` | 26 / 27 | 0 |
| `tests/interaction-patterns.test.tsx` | 8 / 24 | 0 |
| `tests/figures-v2-petla-jednokierunkowa.test.tsx` | 9 / 87 | 0 |
| `tests/ux.test.tsx` | 1 / 10 | 0 |
| `tests/backlog-0410.test.tsx` | 1 / 5 | 0 |
| `tests/trening-naglowek.test.tsx` | 5 / 8 | 0 |
| `tests/audit-perf-ui.test.tsx` | 2 / 3 | 0 |
| `tests/audit-m1-066-pseudo.test.tsx` | 2 / 7 | 0 |
| `tests/m1-017-kalendarz-skala.test.tsx` | 2 / 3 | 0 |
| **razem** | **13 plików, 88 / 630** (pomiar na `cdf3539`; raport pkt 7 podawał 98 z `c9b256a`) | **1 plik, 1 / 630** |

`npx tsc --noEmit -p .` — w zmienionych plikach i w `tests/comp-by-type.ts`: 0 błędów.
Żadnej migawki nie przyjęto (`--ci`), żadnej asercji nie zmieniono.

## Sygnał (asercja, nie API — zostawiony czerwony)

- `tests/regress.test.tsx` › „runda 58 › T-051 CI (SDK 54+): … obraz EAS zgodny z SDK” — oczekiwane `sdk-58` (główny numer zainstalowanego `expo`), jest `sdk-57` w `eas.json` (`build.base.ios.image`). Skutek ZB-010: `eas.json` nie zaktualizowany razem z SDK. Do decyzji koordynatora: podbić obraz w `eas.json` albo (workflowy EAS usunięte 08.10.2026, docs/18) przejrzeć, czy ta część testu jest jeszcze potrzebna.
- Zachowanie aplikacji: w grupie A żaden test nie padł na asercji merytorycznej.

## Nowe wzorce API (dla innych grup)

- **Elementy natywne po typie:** `UNSAFE_getAllByType(TextInput|Text|View|ScrollView)` → `hostRoot().queryAll(n => n.type === 'TextInput' | 'Text' | 'View' | 'RCTScrollView')` (typy sprawdzone próbą: `ScrollView` → `RCTScrollView`, `Pressable` → `View`, react-native-svg → `RNSVGSvgView`, `RNSVGCircle`, `RNSVGRect`, `RNSVGPath`). Z wyniku `render()`: `r.container.queryAll(…)`.
- **Komponenty złożone po typie (nowy pomocnik, nowy plik — bez zmian we wspólnych):** `tests/comp-by-type.ts` → `compByType(root, Typ)` zwraca `{ props, type }[]` dla każdej instancji komponentu `Typ` (z `unstable_fiber`, bez powtórzeń). Użyte dla `FlatList`, `ScrollView`, `ActivityIndicator`, `View` (komponent), `Text` z react-native-svg. Ograniczenie: komponent, który nie renderuje żadnego elementu natywnego, nie zostanie znaleziony.
- `el.findAll(p)` / `el.findAllByType(T)` na elemencie → `el.queryAll(p, { includeSelf: true })` (dawne `findAll` obejmowało sam element).
- Kolor `fill` komponentów SVG jako napis: `compPropsAll(r.container).filter(x => typeof x.fill === 'string')` (wzór D).
- `render` / `renderHook` / `rerender` / `unmount` / `fireEvent` / `act` — `await` (testy synchroniczne → `async`); `ReturnType<typeof render>` → `Awaited<ReturnType<typeof render>>`.
- **Fałszywy zegar:** od SDK 58 `jest.useFakeTimers()` włącza dopiero `renderRouter` (`node_modules/expo-router/build/testing-library/index.js`, funkcja `renderRouter`). Testy bez `renderApp`, które przesuwają zegar (`jest.advanceTimersByTime`), muszą włączyć go same (`edit-on-demand`, 2 testy `lib/draft`).
- `router-store` → `navRef()` z `tests/app.tsx` (interaction-patterns, `route()`).

## Otwarte (niskie, nie blokuje)

- `tests/regress.test.tsx` wypisuje 12× ostrzeżenie Reacta „overlapping act() calls” (przed migracją 15×). W pliku nie ma już `act`/`fireEvent` bez `await`; źródło prawdopodobnie we wspólnych pomocnikach albo w kodzie wywołanym z testu — nie szukałem dalej (poza zakresem grupy A, testy zielone). Do sprawdzenia przy pełnym Jeście, czy ostrzeżenie nie przecieka między plikami.

## Stan

- Zrobione: `b636814` (ux, backlog-0410, audit-perf-ui, audit-m1-066-pseudo, m1-017), `0732a30` (comp-by-type, trening-naglowek, edit-on-demand, interaction-patterns), `023ef88` (3 × figures-v2), `fc46674` (m3-components), `2938c72` (regress), `8e90375` (raport).
- Zostało w grupie A: tylko sygnał T-051 (decyzja koordynatora).
- Następny krok (koordynator): po scaleniu grup — pełny Jest i verify; decyzja o `eas.json` / T-051.
