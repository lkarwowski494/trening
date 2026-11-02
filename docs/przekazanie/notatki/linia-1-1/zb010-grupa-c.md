# ZB-010 — grupa C (migracja testów do RNTL 14 / SDK 58), 02.11.2026

Gałąź `zb010/sdk`, start od `cdf3539`. Plan: `raport-zb010.md` pkt 7 (grupa C, 26 plików). Pomiar: każdy plik osobno `npx jest <plik> --runInBand --ci`
(stan „przed” — ten sam kod testów na `cdf3539`, z pomocnikami grupy D). Pełnego verify nie uruchamiano (koordynator, po scaleniu grup).

## Stan

- **Zrobione:** wszystkie 26 plików grupy C — commity `ad01993` (1/3), `2b55eda` (2/3), `745f325` (3/3); raport — ten plik.
- **Zostało:** 1 czerwony test (sygnał niżej, do decyzji koordynatora). Pomocników wspólnych (`tests/app.tsx`, `tests/helpers.ts`, `tests/maestro-runner.ts`) nie zmieniano.
- **Następny krok:** koordynator — decyzja w sprawie sygnału 1; pełny Jest i verify po scaleniu grup.

## Wynik (testy czerwone / wszystkie)

| Plik | Przed | Po |
|---|---|---|
| matrix-logic | 5/81 | 0/81 |
| audit-k1-fala2b | 10/31 | 0/31 |
| subscription-ui | 2/41 | 0/41 |
| swipe-delete | 31/32 | 0/32 |
| figury-recenzja | 1/34 | 0/34 (1 pominięty jak przed) |
| audit-0.10-tst | 1/14 | 0/14 |
| figures-v2-data | 3/17 | 0/17 |
| audit-m1-031-asekuracja-zakres | 34/43 | 0/43 |
| figures-v2-wstrzymane | plik się wywracał (`require` po zamknięciu środowiska Jest — niedoczekany `render`) | **1/58** (sygnał 1) |
| info-tip | 20/20 | 0/20 |
| karty-recenzja | 2/14 | 0/14 |
| cues | 4/16 | 0/16 |
| audit-m1-031-hantle-asekuracja | 36/42 | 0/42 |
| whats-new | 2/14 | 0/14 |
| cues-014 | 2/10 | 0/10 |
| audit-0.10-tst-ui | 1/9 | 0/9 |
| audit-m1-015-asekuracja | 44/52 | 0/52 |
| postep-tygodnia-zmiana-planu | 3/42 | 0/42 |
| audit-m1-031-contrast | 1/5 | 0/5 |
| audit-m1-024-bold | 1/5 | 0/5 |
| audit-m1-012-status | 1/6 | 0/6 |
| audit-m1-2026-10-27-032-kod-diagnostyczny | 1/3 | 0/3 |
| health-use | 5/5 | 0/5 |
| audit-m1-p3-coverage | 2/5 | 0/5 |
| whatsnew-biezacy-build | 5/5 | 0/5 |
| audit-ac5d764 | 1/2 | 0/2 |
| **Razem** | **25 czerwonych plików + 1 wywrócony; 218 testów** | **1 plik, 1 test** |

`npx tsc --noEmit -p .`: błędy w plikach grupy C 141 → 0 (cały projekt w chwili pomiaru: 443 → 302, w tym zmiany innych grup).

## Sygnały (nie poprawione — do decyzji koordynatora)

1. **`tests/figures-v2-wstrzymane.test.ts` › „JM Press: sekcja „Technika” widoczna z rysunkiem v2, bez zdania o łokciach”** — przekroczony limit 5 s.
   Pomiar (tylko ten test, `-t`): 23,7 s; ten sam test dla „Decline Close-Grip Bench To Skull Crusher” 0,47 s, „kontrast” (Smith) 0,45 s.
   W tym samym pliku test geometrii „JM Press: łokieć nigdy za barkiem…” trwa 12,4 s (przechodzi z własnym limitem). Wniosek: wolny jest
   render/obliczenie figury JM Press, nie zimny start pliku. Przed migracją nie da się porównać (plik wywracał się w całości). Asercji ani limitu
   nie zmieniałem. Opcje: (A) zmierzyć to samo na `main` (RNTL 13) — jeśli też ~20 s, podnieść limit tego testu z powodem; jeśli nie — regresja
   wydajności w SDK 58 do zbadania; (B) od razu limit 60 s z komentarzem. Rekomendacja: A (pomiar to jedno uruchomienie na `main`).
2. **`tests/health-use.test.tsx` (2 testy) — zmiana semantyki RNTL 14, nie zachowania aplikacji:** `await renderHook`/`await rerender`
   opróżnia mikrozadania, więc natychmiast rozwiązana obietnica `load` kończy się przed asercją stanu pośredniego `loading`.
   Poprawione bez zmiany asercji: `load` czeka na bramkę (`release()` przed `flush()`), wzór z testu 5 tego samego pliku. Kod `lib/healthUse.ts` bez zmian.

## Wzorce API (nowe względem pkt 7 raportu, dla grup A, B, E)

- `act(() => …)` / `act as hookAct` / `rtlAct` wywołane jako instrukcja bez `await` — w RNTL 14 zwraca obietnicę; bez `await` hook nie widzi zmiany
  (matrix-logic: `useDraftTick` 0 zamiast 1) **i przeciek psuje kolejne testy w pliku** (tu: `useTheme` zwracał `null`, 9 testów ekranu `/swap`
  czerwonych). Po samym `await render` bez `await act` plik miał 16 czerwonych zamiast 5 — przy migracji zawsze razem.
- Wynik `render(...)` użyty łańcuchowo (`render(x).getByTestId`) → `(await render(x)).getByTestId`; funkcja pomocnicza zwracająca `render` (np. `mount`) — `await mount()` w miejscu wywołania.
- `test.each(...)('…', k => {…})` — `async k =>` (dopisanie `async` tylko do `(…) =>` pomija formę bez nawiasów).
- `jest.spyOn(Linking, 'openURL').mockResolvedValue(true)` — typ SDK 58 to `Promise<void>`: `mockResolvedValue(undefined)` (tylko tsc; zachowanie bez zmian).
- Przekształcenie mechaniczne (skrypt w notatniku sesji, nie w repo): `await` przed `render`/`renderHook`/`fireEvent*`/`unmount`/`rerender` i instrukcjami
  `act`, nawias przy łańcuchu, `async` tylko w callbackach testów, których ciało zawiera `await` (żeby nie dopisywać `async` do testów czysto logicznych).
  Ręcznie: ciała strzałek-wyrażeń (`() => render(...)`), `test.each` bez nawiasów, `findAll` → `queryAll`, `router-store` → `require('./app').navRef()`.

## Uwagi środowiskowe

- Kontener startował bez `node_modules` — `npm ci` (58 s) przed pierwszym pomiarem.
