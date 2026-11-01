# ZB-010 — aktualizacja Expo SDK 57 → 58 (raport programisty, 01.11.2026)

Gałąź `zb010/sdk` od `origin/integracja-1-1` @ fba531d. Stan: **w toku** (szczegóły i następny krok: `STAN-AGENTA.md` w katalogu głównym gałęzi).

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
- Pełne `npm run verify`: — (po migracji testów).
- `npm audit` dla decode-uri-component: — (po migracji; `npm ls` już puste).
- `ios-unsigned.yml`: — ; `e2e-ios.yml` pakiet podstawowy: — .

## 5. Otwarte ryzyka (do Rejestru ryzyk docs/40)
- R-ZB010-1: kompilacja natywna RN 0.88 + moduły własne (`modules/rest-activity`, `voice-cue`, `watch-link`), nitro/healthkit, expo-iap 5.8.1 — rozstrzyga `ios-unsigned.yml`.
- R-ZB010-2: zmiana wyglądu nagłówków/zakładek na iOS 26 mimo `headerTransparent: false` — rozstrzyga E2E (zrzuty) i telefon.
- R-ZB010-3: kolejność nawigacji (dispatch po commicie) — rozstrzyga pełny Jest + E2E.

## 6. Proponowany wpis decyzji do docs/18 (dla koordynatora)
- 01.11.2026 (koordynator linii 1.1, ZB-010 wykonanie wariantu A z 28.10.2026): aktualizacja Expo SDK 57 → 58 (expo-router 58.0.29 bez `query-string`, `decode-uri-component` usunięte z drzewa) w linii 1.1 bez zmiany schematu (19). Odrzucone: pozostanie na SDK 57 (brak poprawki w expo-router 57.x). [wdrożenie: kod] [test: tests/zb010-sdk.test.ts]
