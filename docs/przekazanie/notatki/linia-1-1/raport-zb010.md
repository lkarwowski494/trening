# ZB-010 — aktualizacja Expo SDK 57 → 58 (raport programisty, 01.11.2026)

Gałąź `zb010/sdk` od `origin/integracja-1-1` @ fba531d. Stan: **w toku — migracja testów RNTL 14** (pkt 7; szczegóły: `STAN-AGENTA.md`).

## 1. Dlaczego SDK 58 (sprawdzone w rejestrze npm, 01.11.2026)
- `decode-uri-component` 0.2.2 wchodziło tylko przez `expo-router` → `query-string` ^7.1.3.
- `npm view expo-router@<wersja> dependencies.query-string`: 57.0.24 i 57.0.29 (najnowsza linii SDK 57) — `^7.1.3`; 58.0.0–58.0.12 — `^7.1.3`; **od 58.0.13 bez `query-string`**. Najnowsza: 58.0.29 (`latest`), `expo` 58.0.22 (`latest`, wydane 31.10.2026; 58.0.0 — 29.09.2026).
- Wniosek: wymagany **SDK 58 z expo-router ≥ 58.0.13**; w linii SDK 57 poprawki nie ma. Po instalacji: `npm ls decode-uri-component query-string` → puste (brak w drzewie).

## 2. Wersje przed / po
| Pakiet | przed | po |
|---|---|---|
| expo | ~57.0.26 | ~58.0.22 |
| expo-router | ~57.0.24 | ~58.0.29 |
| react-native | 0.86.3 | 0.88.1 |
| react / react-dom / react-test-renderer | 19.2.3 | 19.3.0 |
| react-native-gesture-handler | ~2.32.0 | ~3.3.0 (major; aplikacja nie importuje go bezpośrednio) |
| react-native-reanimated / worklets | 4.5.1 / 0.10.1 | 4.7.1 / 0.13.0 |
| react-native-screens / safe-area-context / svg | ~4.26 / ~5.7 / 15.15.4 | ~4.30.1 / ~5.10.1 / 15.16.0 |
| expo-notifications | ~57.0.21 | ~58.1.7 |
| pozostałe expo-* | ~57.0.x | ~58.0.x (wg `npx expo install --fix`) |
| jest / @types/jest / jest-expo | 29.7 / 29.5 / 57.0.5 | ~30.5.2 / 30.0.0 / ~58.0.13 |
| @testing-library/react-native | 13.3.3 | 14.1.0 (+ `test-renderer` 1.3.1) |
| babel-preset-expo / eslint-config-expo / @expo/metro-runtime | 57 | 58 |

`npx expo install --check` po instalacji: „Dependencies are up to date”. Schemat danych bez zmian: `SCHEMA_VERSION = 19` (`lib/seed.ts:12`, test `tests/zb010-sdk.test.ts`).

## 3. Zmiany łamiące (przeczytane 01.11.2026: https://expo.dev/changelog/sdk-58, https://docs.expo.dev/router/migrate/sdk-57-to-58/, https://github.com/callstack/react-native-testing-library/releases/tag/v14.0.0) i jak obsłużone
| Zmiana | Dotyczy nas? | Obsługa |
|---|---|---|
| RN 0.87 Strict TypeScript API (typy instancji zamiast klas, style tylko do odczytu) | tak, 20 błędów tsc w kodzie aplikacji | `components/Scroll.tsx` (`ScrollViewInstance`), `components/AppText.tsx` (`TextInstance`), `lib/theme.ts` + `docs/design/theme.ts` (zapisywalna kopia stylu), `components/ui.tsx`, `components/Segmented.tsx` (bez `delete`), `app/(tabs)/history.tsx` (`ListEmptyComponent` undefined) |
| Usunięte API RN: `InteractionManager`, `Touchable*` z korzenia, `Modal animated`, część propsów `StatusBar` | nie (grep `app components lib`) | — |
| expo-router: `unstable_settings.initialRouteName` usunięte → `anchor` | tak (`app/_layout.tsx:34`) | `{ anchor: '(tabs)' }` + test |
| expo-router: `headerTransparent` domyślnie true na iOS 26+, nagłówki krojem systemowym | tak (build na macos-26) | `headerTransparent: false` w `Stack` (`app/_layout.tsx`), `fontFamily` w `headerTitleStyle` już był; test |
| expo-router: `renderRouter` zwraca obietnicę; wymaga RNTL ≥ 14 | tak (`tests/app.tsx`, `tests/smoke.test.tsx`) | `await renderRouter` |
| expo-router: `global-state/router-store` usunięty | tak (`tests/app.tsx`, odtworzenie `runOnlyPendingTimers`) | `global-state/navigationRef` |
| expo-router: `navigation.dispatch` po zatwierdzeniu renderu, `useNavigation` rzuca poza nawigatorem | możliwe (`components/OwnPlan.tsx` używa `useNavigation`) | sprawdzają testy ekranowe i E2E |
| RNTL 14: `render`/`fireEvent`/`act` asynchroniczne, usunięte `UNSAFE_root`, `UNSAFE_*ByType`, `cleanupAsync` | tak: 44 pliki z `UNSAFE_*` (91× `UNSAFE_root`), 484 błędy tsc w `tests/` | **w toku** |
| expo-notifications: powiadomienia na pierwszym planie domyślnie widoczne | nie zmienia zachowania — `lib/timer.ts:24` ustawia `setNotificationHandler` jawnie | — |
| expo-file-system: `File.write()` asynchroniczne | nie — kopia używa API „legacy” (`lib/backup.ts:59`) | — |
| expo-sqlite: usunięte libSQL | nie używamy | — |
| Node ≥ 22.13 | lokalnie 22.23.4; CI — do sprawdzenia w przebiegu | — |
| Android R8, macOS, web `output: server` | nie dotyczy (iOS; `app.json` web `output: single`) | — |

## 4. Wyniki (uzupełniane)
- `tests/zb010-sdk.test.ts`: przed zmianą 2 czerwone (decode-uri-component 0.2.2, expo-router 57), po — 5/5 zielone.
- `npx tsc --noEmit`: kod aplikacji 0 błędów; `tests/` — w toku.
- Pełny Jest (c9b256a): 15 781 testów, 14 939 zielonych, 839 czerwonych (129 z 653 plików). Pełne `npm run verify`: — (po migracji testów).
- `npm audit` dla decode-uri-component: — (po migracji; `npm ls` już puste).
- `ios-unsigned.yml`: — ; `e2e-ios.yml` pakiet podstawowy: — .

## 5. Otwarte ryzyka (do Rejestru ryzyk docs/40)
- R-ZB010-1: kompilacja natywna RN 0.88 + moduły własne (`modules/rest-activity`, `voice-cue`, `watch-link`), nitro/healthkit, expo-iap 5.8.1 — rozstrzyga `ios-unsigned.yml`.
- R-ZB010-2: zmiana wyglądu nagłówków/zakładek na iOS 26 mimo `headerTransparent: false` — rozstrzyga E2E (zrzuty) i telefon.
- R-ZB010-3: kolejność nawigacji (dispatch po commicie) — rozstrzyga pełny Jest + E2E.

## 6. Proponowany wpis decyzji do docs/18 (dla koordynatora)
- 01.11.2026 (koordynator linii 1.1, ZB-010 wykonanie wariantu A z 28.10.2026): aktualizacja Expo SDK 57 → 58 (expo-router 58.0.29 bez `query-string`, `decode-uri-component` usunięte z drzewa) w linii 1.1 bez zmiany schematu (19). Odrzucone: pozostanie na SDK 57 (brak poprawki w expo-router 57.x). [wdrożenie: kod] [test: tests/zb010-sdk.test.ts]

## 7. Stan po 02.11.2026 i plan migracji testów do RNTL 14 (dla nowych sesji)

- Wypchnięcie gałęzi roboczej z `--no-verify` — wyjątek nazwany, decyzja właściciela 02.11.2026 ~05:10 PL (docs/18, ZB-010 A). Do `integracja-1-1` dopiero po migracji testów i pełnym verify (wtedy hak sam przepuści).
- Pełny Jest (lokalnie, c9b256a): 653 pliki, 129 czerwonych; 15 781 testów, 839 czerwonych. Kod aplikacji typecheck czysty; `tests/` — 484 błędy tsc.
- Zasada wspólna: najpierw pomocniki (`tests/app.tsx`, `tests/helpers.ts`, `tests/maestro-runner.ts`, `swipeDelete` używa `UNSAFE_root`) — jedna sesja (grupa D) zaczyna od nich i wypycha przed startem A–C/E, inaczej konflikty. Agenci uruchamiają pojedyncze pliki (`npx jest <plik> --runInBand`); pełny Jest i verify raz, po scaleniu grup. Nie zmieniać asercji merytorycznie — tylko API testów; test, który po migracji pada na asercji, to sygnał zmiany zachowania (SDK 58) do zgłoszenia, nie do „poprawienia” oczekiwania.
- Pliki migawek (`*.snap.ios`): pełny Jest zmienił `tests/figures.test.tsx.snap.ios` (1 linia) — cofnięte; przy migracji uruchamiać z `--ci`.

### Grupa A — 13 plików, 98 czerwonych testów
zapytania po typie komponentu (`UNSAFE_*ByType`) — przepisanie na testID/etykiety (test-renderer widzi tylko elementy natywne); najtrudniejsza.

- `tests/regress.test.tsx` (21)
- `tests/figures-v2-chod-cykliczny.test.tsx` (7)
- `tests/figures-v2-katy-fazy.test.tsx` (8)
- `tests/edit-on-demand.test.tsx` (5)
- `tests/m3-components.test.tsx` (26)
- `tests/interaction-patterns.test.tsx` (8)
- `tests/figures-v2-petla-jednokierunkowa.test.tsx` (9)
- `tests/ux.test.tsx` (2)
- `tests/backlog-0410.test.tsx` (1)
- `tests/trening-naglowek.test.tsx` (5)
- `tests/audit-perf-ui.test.tsx` (2)
- `tests/audit-m1-066-pseudo.test.tsx` (2)
- `tests/m1-017-kalendarz-skala.test.tsx` (2)

### Grupa B — 33 plików, 253 czerwonych testów
`UNSAFE_root.findAll` → `screen.root`/`container.queryAll` (sprawdzić, czy predykat dotyczy propsów elementu natywnego).

- `tests/motyw.test.tsx` (17)
- `tests/audit-0.10-live.test.tsx` (2)
- `tests/audit-0.10-ui.test.tsx` (4)
- `tests/figures.test.tsx` (17)
- `tests/audit-0.10-plan-ui.test.tsx` (20)
- `tests/guard-ui.test.tsx` (20)
- `tests/matrix-a11y.test.tsx` (9)
- `tests/audit-k1-bl-mer.test.tsx` (3)
- `tests/figures-v2-styk.test.tsx` (3)
- `tests/progression-ui.test.tsx` (12)
- `tests/audit-0.10-lang-ui.test.tsx` (22)
- `tests/audit-0.10-data-ui.test.tsx` (4)
- `tests/figures-v2-ui.test.tsx` (20)
- `tests/period-bars.test.tsx` (7)
- `tests/home-b.test.tsx` (3)
- `tests/set-goals-ui.test.tsx` (2)
- `tests/pick-template.test.tsx` (9)
- `tests/m3-p2-start.test.tsx` (4)
- `tests/home-plan-header.test.tsx` (5)
- `tests/m3-p5d-settings-ui.test.tsx` (3)
- `tests/dec01a-podglad-liczb.test.tsx` (9)
- `tests/muscle-map.test.tsx` (1)
- `tests/tokeny-odcisk.test.tsx` (3)
- `tests/i18n-wave4-ui.test.tsx` (15)
- `tests/i18n-wave3-ui.test.tsx` (8)
- `tests/i18n-wave2-ui.test.tsx` (5)
- `tests/figura-klatka-zrzutu.test.tsx` (3)
- `tests/sets-mark.test.tsx` (1)
- `tests/audit-records-live.test.tsx` (1)
- `tests/audit-records-ui.test.tsx` (16)
- `tests/m1-043-pierwsze-kroki-glyph.test.tsx` (1)
- `tests/ui2-08-saved-plan-title.test.tsx` (3)
- `tests/ui2-09-leftovers.test.tsx` (1)

### Grupa C — 26 plików, 218 czerwonych testów
`render`/`renderHook` bez `await` (RNTL 14 zwraca obietnicę) i wyniki render używane synchronicznie.

- `tests/matrix-logic.test.tsx` (5)
- `tests/audit-k1-fala2b.test.tsx` (10)
- `tests/subscription-ui.test.tsx` (2)
- `tests/swipe-delete.test.tsx` (31)
- `tests/figury-recenzja.test.tsx` (1)
- `tests/audit-0.10-tst.test.ts` (1)
- `tests/figures-v2-data.test.tsx` (3)
- `tests/audit-m1-031-asekuracja-zakres.test.tsx` (34)
- `tests/figures-v2-wstrzymane.test.ts` (0)
- `tests/info-tip.test.tsx` (20)
- `tests/karty-recenzja.test.tsx` (2)
- `tests/cues.test.tsx` (4)
- `tests/audit-m1-031-hantle-asekuracja.test.tsx` (36)
- `tests/whats-new.test.tsx` (2)
- `tests/cues-014.test.tsx` (2)
- `tests/audit-0.10-tst-ui.test.tsx` (1)
- `tests/audit-m1-015-asekuracja.test.tsx` (44)
- `tests/postep-tygodnia-zmiana-planu.test.tsx` (3)
- `tests/audit-m1-031-contrast.test.tsx` (1)
- `tests/audit-m1-024-bold.test.tsx` (1)
- `tests/audit-m1-012-status.test.ts` (1)
- `tests/audit-m1-2026-10-27-032-kod-diagnostyczny.test.tsx` (1)
- `tests/health-use.test.tsx` (5)
- `tests/audit-m1-p3-coverage.test.tsx` (2)
- `tests/whatsnew-biezacy-build.test.tsx` (5)
- `tests/audit-ac5d764.test.tsx` (1)

### Grupa D — 33 plików, 199 czerwonych testów
pozostałe przez `tests/app.tsx`/`maestro-runner` — najpierw `tests/maestro-runner.ts` (router-store → navigationRef), potem kolejność nawigacji, `fireEvent` w `act`, asercje (część 1).

- `tests/intro.test.tsx` (13)
- `tests/maestro-e2e38563.test.tsx` (11)
- `tests/maestro-e2e91.test.tsx` (9)
- `tests/maestro-zycie.test.tsx` (5)
- `tests/maestro-flows.test.tsx` (49)
- `tests/maestro-e2e105.test.tsx` (4)
- `tests/maestro-script.test.tsx` (2)
- `tests/maestro-e2e-modal.test.tsx` (3)
- `tests/scenario-full.test.tsx` (13)
- `tests/matrix-ui.test.tsx` (7)
- `tests/edit-history.test.tsx` (5)
- `tests/public-repo.test.ts` (1)
- `tests/m3-p2-board-ui.test.tsx` (1)
- `tests/adapt-ui.test.tsx` (19)
- `tests/places-ui.test.tsx` (10)
- `tests/store-adapter.test.ts` (1)
- `tests/health-read-ui.test.tsx` (2)
- `tests/m3-p3-postepy-historia.test.tsx` (1)
- `tests/audit-r83.test.tsx` (1)
- `tests/guide.test.tsx` (1)
- `tests/m3-fix-e2e.test.tsx` (3)
- `tests/live2-split-template.test.tsx` (1)
- `tests/readme.test.ts` (4)
- `tests/tabs-four.test.tsx` (5)
- `tests/generator-ui.test.tsx` (4)
- `tests/reorder-t010.test.tsx` (6)
- `tests/flows.test.tsx` (1)
- `tests/swap-alternates.test.tsx` (1)
- `tests/locations-ui.test.tsx` (1)
- `tests/m3-p5-delete.test.tsx` (6)
- `tests/deload-ui.test.tsx` (4)
- `tests/motyw-miesiac.test.tsx` (2)
- `tests/m3-p4-generator.test.tsx` (3)

### Grupa E — 24 plików, 71 czerwonych testów
pozostałe (część 2) — jak D.

- `tests/places-scenario.test.tsx` (1)
- `tests/plan-reminder.test.tsx` (3)
- `tests/plans-multi-ui.test.tsx` (4)
- `tests/audit-close2-a.test.tsx` (7)
- `tests/close-button-guard.test.tsx` (16)
- `tests/audit-m1-026-kolejnosc-menu.test.tsx` (2)
- `tests/adapt-scenario.test.tsx` (1)
- `tests/scenario-0.10.test.tsx` (2)
- `tests/audit-m1-065-week-start.test.tsx` (3)
- `tests/ui2-06-gen-back-to-plan.test.tsx` (5)
- `tests/muscle-roles-ui.test.tsx` (6)
- `tests/xcheck-0610b.test.tsx` (1)
- `tests/audit-m1-027-pasek-tygodnia.test.tsx` (2)
- `tests/audit-records-misc.test.tsx` (1)
- `tests/audit-m1-032-total-bars.test.tsx` (3)
- `tests/audit-m1-025-muscle-caption.test.tsx` (4)
- `tests/audit-m1-038-exname-lang.test.tsx` (1)
- `tests/audit-journey-b.test.tsx` (2)
- `tests/audit-m1-033-session-row.test.tsx` (3)
- `tests/sec-link-z-parametrami.test.tsx` (0)
- `tests/template-cards.test.tsx` (1)
- `tests/audit-final2-ui.test.tsx` (2)
- `tests/audit-final-auto.test.tsx` (1)
- `tests/matrix-dim-langs-routes3.test.tsx` (0)


### Grupa D — wynik (02.11.2026)
Sesja https://claude.ai/code/session_01T66VBwRidsQAVnEimA1vFF. Commity: `698105f` (pomocniki, wypchnięte przed startem A–C/E), `fe1110e` (reszta grupy D). Pomiar: każdy plik osobno `npx jest <plik> --runInBand --ci` (jeden proces dla 33 plików kończył się brakiem pamięci).

**Wspólne pomocniki (do użycia w A, B, C, E):**
- `tests/app.tsx`: `navRef()` — ref nawigacji zamiast usuniętego `expo-router/build/global-state/router-store` (zamiana: `const rs = { navigationRef: require('./app').navRef() }` albo `require('./app').navRef()`; router-store używają jeszcze m.in. `places-scenario`, `interaction-patterns`, `home-plan-header`, `audit-k1-fala2b`, `close-button-guard`, `pick-template`, `ui2-06-gen-back-to-plan`, `audit-0.10-ui`, `subscription-ui`, `adapt-scenario`); `hostRoot()` = `screen.container` (następca `UNSAFE_root`); `compPropsAll(el)` — propsy komponentów złożonych pod elementem przez `unstable_fiber` (np. `Rect` z react-native-svg, którego element natywny ma kolor jako liczbę); `swipeDelete`/`deleteActions` przez `queryAll`; `tap`/`type`/`openInfo`/`closeInfo` czekają na `fireEvent`.
- `tests/maestro-runner.ts`: `navRef()`, `queryAll(…, { includeSelf: true })` jako odpowiednik `findAll`, `unstable_fiber` zamiast `_fiber`, kontener korzenia (typ `''`) poza `isHost`.
- Wzorce API RNTL 14 znalezione w D (dotyczą też innych grup): `act(() => …)` bez `await` przecieka do kolejnych kroków i testów (deload-ui, generator-ui) → `await act(…)`; `fireEvent` zwraca obietnicę — bez `await` poza `act` przeciek między testami (reorder-t010: test przechodził sam, padał po poprzednim); `findByProps`/`findAll` → `queryAll`; `within(el)` nie dopasowuje samego `el` (testID na `<Text>`); `render`/`rerender`/`unmount` → `await`.

**Wynik:** grupa D 33 pliki — przed: 33 czerwone pliki, 200/714 czerwonych testów; po `fe1110e`: 3 pliki, 7 testów (store-adapter 1, public-repo 1, readme 5 — niżej). `npx tsc` w `tests/`: 484 → 452 błędów, w zmienionych plikach 0.

**Próbka innych grup (tylko uruchomienie, 12 plików):** przed 43/109 czerwonych, po 41/109 — A: `ux` 2→1, `backlog-0410` 1→1, `trening-naglowek` 5→5; B: `home-b` 3→3, `sets-mark` 1→1, `muscle-map` 1→1; C: `whats-new` 2→2, `cues-014` 2→2, `info-tip` 20→20; E: `plan-reminder` 3→3, `template-cards` 1→0, `audit-journey-b` 2→2. Pozostałe błędy próbki to API w samych plikach (`UNSAFE_getAllByType`, `row.findAll`, `UNSAFE_root.findAll`, `render()` bez `await`) — zgodnie z podziałem na grupy; pomocniki nie dały regresji.

**Sygnały zmiany zachowania / stanu (nie poprawione — asercje, nie API; do decyzji koordynatora):**
- `tests/store-adapter.test.ts` › „package.json: expo-iap przypięte… expo-store-review w zakresie SDK 57” — oczekuje `/^~57\./`, jest `~58.0.2` (skutek ZB-010; test przypina wersję SDK).
- `tests/public-repo.test.ts` › „SEC-06: query-string nie jest zależnością bezpośrednią… zostaje jako zależność expo-router” — `lock.packages['node_modules/expo-router'].dependencies['query-string']` jest puste: expo-router ≥ 58.0.13 nie zależy od `query-string` (cel ZB-010, pkt 1); założenie testu nieaktualne.
- `tests/readme.test.ts` (5) — `scripts/readme.mjs`: „dodaj opis STAN-AGENTA.md do TOP” (plik stanu agenta śledzony w git w korzeniu) oraz nieaktualne bloki generowane README (wersje Expo/RN z package.json, liczba plików testów). Nie API RNTL: koordynator usuwa `STAN-AGENTA.md` przed scaleniem i regeneruje README (`node scripts/readme.mjs --write`) po scaleniu grup.
- W D żaden test po migracji nie padł na asercji merytorycznej zachowania aplikacji.

## 8. Domknięcie (02.11.2026)

Gałąź `zb010/sdk` po scaleniu `origin/integracja-1-1` (jeden konflikt: `tests/figury-recenzja.test.tsx` — wzięta migracja RNTL 14 + zmiana z integracji „Lat Pulldown”). Decyzje koordynatora 2a–2f wdrożone: strażnik braku `decode-uri-component` i `query-string` w lockfile (`tests/zb010-sdk.test.ts`, 02.11.2026), usunięte 3 testy parsera w `sec-link-z-parametrach`, SEC-06 i SEC-08 jako asercje braku, `eas.json` obraz `sdk-58`, wersja `expo-store-review` liczona z głównego numeru `expo`, limit 60 s dla „JM Press: sekcja Technika…” (pomiar na SDK 58: 12,6 s), `STAN-AGENTA.md` usunięty, pliki generowane odświeżone.
Poprawki po scaleniu (API testów): `maestro-runner.ts` — `longPressOn` szuka `onPress`/`onLongPress` w łańcuchu fiber (drzewo RNTL 14 ma tylko elementy natywne), `container` zamiast `UNSAFE_root`; `figures-v2-pull-up-jedna-strona` — `await render/unmount`; typy `mockResolvedValue(true as never)` i `flat` w 3 plikach; limity czasu: `catalog-library25` (60 s), `karty-recenzja` (60 s), `audit-k1-bl-mer` MER2-07 (480 s).
Sygnał (pamięć): otwarta karta ćwiczenia (sekcja Technika z rysunkiem) zostawia po `unmount` ok. 160 KB sterty na render (RNTL 14; bez otwarcia brak wzrostu). `audit-k1-bl-mer` MER2-07 (26 języków × wszystkie ćwiczenia) trwa ok. 240 s pojedynczo; `maestro-flows` (170 s) i `matrix-dim-langs-routes3` (80 s) przechodzą pojedynczo, ale w równoległym verify worker kończy się „out of memory” (sterta 2 GB), czego `jest-ponow` nie ponawia. Verify z `NODE_OPTIONS=--max-old-space-size=4096`: 660/661 plików zielone (15992 testów), jedyna czerwień `tests/jest-ponow-29-10-2026.test.ts` (a) — artefakt tej zmiennej środowiska (test sprawdza brak 4096 w pierwszym wywołaniu). Do decyzji koordynatora: stała sterta workerów w verify i CI (CI ma 2 rdzenie) albo naprawa przecieku.
