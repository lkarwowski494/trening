# 28 — Apple Zdrowie, etap 0: rozpoznanie techniczne (biblioteka healthkit 8 → 16)

Data: 11.10.2026. Tylko rozpoznanie — bez zmian w kodzie i zależnościach. Decyzje właściciela: `docs/18-przekazanie.md` (11.10.2026, „Apple Zdrowie (pkt 9)”
i „trening z zegarka (pkt 9, etap 2) — A”). Źródła: rejestr npm (metadane i paczki `@kingstinct/react-native-healthkit` 8.7.2 oraz 16.1.0, przeczytane
lokalnie: `src/specs/*.nitro.ts`, `ReactNativeHealthkit.podspec`), strona wydań biblioteki
(https://github.com/kingstinct/react-native-healthkit/releases), README biblioteki, dokumentacja Nitro (https://nitro.margelo.com/docs/minimum-requirements).
Nie udało się odczytać notatek wydań 9.x–13.x (brak dostępu do API GitHuba w sesji; strona wydań pokazuje tylko 14.0.2–16.1.0) — tam opieram się na
`peerDependencies` z npm i na porównaniu kodu 8.7.2 z 16.1.0. Pozycje oznaczone „do sprawdzenia” wymagają próby na buildzie.

## 1. Obecny stan

- `package.json`: `expo ~57.0.26`, `react-native 0.86.3`, `react 19.2.3`, `@kingstinct/react-native-healthkit ^8.7.2`; brak `react-native-nitro-modules`.
- Nowa architektura: w `app.json` brak `newArchEnabled` (nie ma czego wyłączać); RN 0.86 jest po usunięciu starej architektury (od RN 0.82), więc aplikacja
  działa na nowej architekturze (do potwierdzenia w logu `ios-unsigned.yml`). Katalog `ios/` jest w `.gitignore` (prebuild w CI).
- Config plugin w `app.json`: `@kingstinct/react-native-healthkit` z `NSHealthShareUsageDescription` („Trening nie odczytuje…” — do zmiany w etapie 1),
  `NSHealthUpdateUsageDescription`, `background: false`.
- `lib/health.ts` (93 linie) używa wyłącznie: `isHealthDataAvailable()`, `requestAuthorization([], [WORKOUT])`, `authorizationStatusFor(type)`,
  `saveWorkoutSample(type, [], start, { end, metadata })`. Moduł ładowany leniwie (`require`), brak = „niedostępne”. Komentarz w pliku („8.x bez Nitro,
  zgodna z RN 0.76”) będzie nieaktualny po aktualizacji.
- Testy dotykające biblioteki: globalny mock wirtualny w `tests/setup.js:39` (`isHealthDataAvailable`, `requestAuthorization`, `saveWorkoutSample`) +
  szpiegowanie `saveWorkoutSample` w ok. 10 plikach (`regress`, `pause`, `edit-history`, `matrix-invariants`, `audit-0.10-*`, `audit-io-*`);
  `audit-0.10-data.test.ts:205` czyta opcje pluginu z `app.json`; `scripts/verify-native.mjs` pilnuje entitlements (tylko HealthKit) i obu kluczy
  `NSHealth*UsageDescription`.

## 2. Wymagania i zmiany API wersji 9…16

| Wersja | Data | Wymagania (peerDependencies z npm) | Uwagi |
|---|---|---|---|
| 8.7.x | 06.2025 | react, react-native `*` | bez Nitro; to mamy |
| 9.0.0 | 17.06.2025 | + `react-native-nitro-modules` `*` | **przejście na Nitro Modules** (moduły natywne w Swift generowane przez nitrogen) |
| 10.x | 08–09.2025 | jak 9 | — |
| 11.x | 09–10.2025 | react 19.1.0, RN 0.81.4, nitro 0.29.6 (**przypięte** na sztywno) | dla nas nieużyteczna (sztywny RN) |
| 12.x–13.x | 11.2025–03.2026 | react ≥19, RN ≥0.79, nitro ≥0.30 | |
| 14.x | 04–08.2026 | nitro ≥0.35 | 14.1.0: `activityType` w `WorkoutActivity`; łapanie wyjątków ObjC w `requestAuthorization` (crash) |
| 15.x | 09.2026 | jak 14 | 15.1.0: plugin kompilowany z `app.plugin.ts` |
| 16.0.0–16.1.0 | 18.09 / 07.10.2026 | react ≥19, **RN ≥0.79**, nitro ≥0.35; zależność `@react-native-healthkit/core` (dokładna wersja) | 16.0.0: „All three packages moved to one shared version”; `deserializeHKQueryAnchor` rzuca błąd na zepsutej kotwicy (wcześniej ciche pełne zapytanie) |

- Nitro: minimum RN 0.75, Xcode 16.4+ (https://nitro.margelo.com/docs/minimum-requirements). Strona nie podaje jawnie wymogu nowej architektury; nasza i tak ją ma.
  Najnowszy `react-native-nitro-modules` to 0.37.1 (peer: react, RN `*`). iOS minimalny: podspec biblioteki bierze `min_ios_version_supported` z RN — bez własnego podnoszenia.
- Expo: biblioteka działa przez config plugin, „it will not work in Expo Go” (README) — my i tak budujemy natywnie.
- Wymóg RN ≥0.79 / react ≥19 spełniamy z zapasem (0.86.3 / 19.2.3).

**Zmiany API istotne dla nas** (porównanie 8.7.2 → 16.1.0, kod paczek):

| Funkcja | 8.x (dziś) | 16.x |
|---|---|---|
| `requestAuthorization` | `(read[], write[])` → boolean | `({ toRead, toShare })` → boolean (README: bez wywołania przed odczytem/zapisem aplikacja się wywraca) |
| `authorizationStatusFor` | `(type)` → Promise | `(type)` → **synchroniczne** `AuthorizationStatus`; czy „2 = sharingAuthorized” nadal obowiązuje (typ z `@react-native-healthkit/core`) — do sprawdzenia |
| `saveWorkoutSample` | `(type, quantities, start, { end, totals, metadata })` → `string \| boolean` | `(type, quantities, startDate, endDate, totals?, metadata?)` pozycyjnie → `Promise<WorkoutProxy>` (UUID z proxy; po użyciu `dispose()`); `metadata` jako `AnyMap` |
| rodzaj treningu | liczby (50, 20, 37…) | `enum WorkoutActivityType` liczbowy (np. `traditionalStrength`); wartości `HK_ACTIVITY` do potwierdzenia testem |
| zdarzenia pauzy | brak (obejście: przesunięty start, decyzja 08.10) | `WorkoutEventType.pause/resume` są w typach odczytu; w `saveWorkoutSample` v16 nie ma parametru zdarzeń — **prawdziwych pauz tą ścieżką nadal nie zapiszemy** (do sprawdzenia inne drogi, np. builder) |

**Funkcje potrzebne w etapach 1–2 (są w v16):**
- kroki dzienne: `queryStatisticsCollectionForQuantity('HKQuantityTypeIdentifierStepCount', ['cumulativeSum'], anchorDate, interval, options)`;
  pojedyncza suma: `queryStatisticsForQuantity`; wariant `…SeparateBySource`. Deduplikacja iPhone + zegarek w statystykach — do weryfikacji na danych;
- treningi w przedziale: `queryWorkoutSamples({ filter, limit, ascending })` → `WorkoutProxy[]` (`toJSON()`, `dispose()`), także `queryWorkoutSamplesWithAnchor`;
- tętno i aktywne kcal przypisane do treningu: `WorkoutProxy.getStatistic(quantityType, unitOverride?)` i `getAllStatistics()` (README podaje nazwy bez przykładów —
  kształt `QueryStatisticsResponse` i jednostki do sprawdzenia); alternatywa: `queryStatisticsForQuantity` z filtrem czasowym treningu;
- obserwator/anchored query: `subscribeToChanges(type, callback)`, `queryQuantitySamplesWithAnchor(type, { limit, anchor })`. Odczyt „na bieżąco” (decyzja 11.10, bez zapisu
  danych Health w aplikacji) wystarcza bez kotwic i obserwatorów — zapytanie przy otwarciu ekranu/aplikacji; kotwicy nie trzymamy w danych ani kopii.
- uprawnienia odczytu (`toRead`): `HKQuantityTypeIdentifierStepCount`, `HKWorkoutTypeIdentifier`, tętno, aktywna energia (do ustalenia w specyfikacji etapu 1).
  Uwaga iOS: aplikacja nie widzi, czy odmówiono odczytu (prywatność Apple) — brak danych = pusty wynik; wpływa na komunikaty UI.

## 3. Najwyższa wersja zgodna z obecnym SDK i czy wystarcza

**16.1.0 (najnowsza) jest zgodna z obecnym Expo SDK 57 / RN 0.86.3 / React 19.2.3 bez aktualizacji Expo ani RN** (peer: RN ≥0.79, react ≥19, Nitro ≥0.35 — jest 0.37.1; RN 0.86 działa
wyłącznie na nowej architekturze). Wszystkie funkcje etapów 1–2 (statystyki dzienne, zapytania o treningi, statystyki treningu z tętnem i aktywnymi kcal, kotwice/obserwatory) są w v16,
więc podnoszenie Expo/RN nie jest potrzebne. Nowe zależności natywne: `react-native-nitro-modules` (dodać jawnie) i `@react-native-healthkit/core` (ciągnięte przez bibliotekę);
pozostałe zależności z `package.json` (expo-*, reanimated, worklets, screens, svg, gesture-handler) już są pod nową architekturę i nie dzielą symboli z HealthKit.
Wersja 11.x odpada (sztywne RN 0.81.4).

## 4. Proponowana kolejność wydań

Zasada z CLAUDE.md: nie łączyć aktualizacji SDK ze zmianą schematu danych. Tu SDK się nie zmienia i schemat też nie (dane Health nie trafiają do danych aplikacji),
ale zmienia się natywna zależność, a StoreKit (subskrypcja) będzie kolejną natywną.

- **Wariant A — trzy osobne wydania:** (1) tylko aktualizacja biblioteki 8→16 + dopasowanie `lib/health.ts` (zapis jak dziś, zero nowych funkcji i uprawnień);
  (2) etapy 1–2 Health (odczyt, nowy opis uprawnień, privacy, formularz App Store); (3) StoreKit.
  Plus: jedna przyczyna błędu natywnego na wydanie, dym-test zapisu do Zdrowia na telefonie przed dołożeniem odczytu. Minus: 3 przebiegi testflight + E2E, dłużej.
- **Wariant B — aktualizacja biblioteki razem z etapem 1 (jedno wydanie Health), StoreKit osobno:** mniej wydań; minus: regresja zapisu miesza się z błędami odczytu.
- **Wariant C — wszystko natywne w jednym wydaniu (Health + StoreKit):** najmniej przebiegów; minus: dwie nowe powierzchnie natywne i przegląd Apple (subskrypcja + zdrowie) naraz,
  trudna diagnoza, największe ryzyko odrzucenia.

**Rekomendacja: A** (z dopuszczeniem B, jeśli właściciel woli mniej wydań); C odradzam. Wydanie 1 jest tanie, a chroni najcenniejszą istniejącą funkcję — zapis treningu
do Zdrowia z idempotencją (`HKMetadataKeySyncIdentifier`). StoreKit osobno od Health.

## 5. Ryzyka, testowanie, szacunek

Ryzyka:
- Kompilacja Swift/C++ Nitro w `ios-unsigned.yml` (`macos-26`, Xcode 26.x): kod generowany przez nitrogen; pierwszy build może wymagać poprawek
  (16.1.0 ma „static-framework build fix”). `verify:native` (entitlements, Info.plist) ma dalej przechodzić; test `audit-0.10-data.test.ts:205` zależy od kształtu opcji pluginu.
- Zmiana kształtu API (pozycyjne argumenty, `WorkoutProxy`, synchroniczne `authorizationStatusFor`): `lib/health.ts` łapie wszystkie błędy, więc pomyłka da cichy „failed”, nie awarię —
  obowiązkowy test prawdziwego zapisu na telefonie.
- Idempotencja zapisu i obejście pauz (decyzja 08.10): sprawdzić, czy `HKMetadataKeySyncVersion` jako liczba w `AnyMap` trafia poprawnie.
- Mocki testów: globalny mock w `tests/setup.js` i ok. 10 plików używa sygnatur 8.x — przepisać na kontrakt v16.
- Zależność od jednego małego utrzymującego (Kingstinct), jedno źródło — ryzyko porzucenia; rezerwa: własny moduł Expo w Swift (kosztowny).
- Prywatność/Apple: etap 1 zmienia deklarację (odczyt) — opis uprawnień, `site/privacy.html`, formularz prywatności App Store (Apple 5.1.3; decyzja 11.10 to uwzględnia).

Testowanie bez danych Health na symulatorze:
- Symulator ma aplikację Zdrowie z ręcznym dodawaniem danych (Przeglądaj → Kroki → Dodaj dane); automatyzacja tego w Maestro/CI — do sprawdzenia, nie zakładam.
- Plan: logika, ekran i scenariusze w jest na makiecie o kontrakcie v16 (fabryki danych: kroki dzienne, trening z tętnem i kcal, brak danych, odmowa);
  Maestro tylko: aplikacja startuje z modułem natywnym i pokazuje stan „brak danych / brak dostępu”. Prawdziwe dane: ręczny test na iPhonie z zegarkiem (właściciel).
- Definicja ukończenia (docs/20): rodzaj „E2E Maestro” dla odczytu z zapisanym powodem w docs/09 (brak sterowania danymi Health w CI).

Szacunek pracy agenta (wariant A; orientacyjny, nie zmierzony):
- Wydanie 1 (aktualizacja 8→16, `lib/health.ts`, mocki, testy kontraktu, dokumenty): ok. 2–3 h pracy agenta wraz z iteracjami po buildzie.
- Wydanie 2 (etapy 1–2: odczyt kroków i aktywności, dopasowanie treningu z zegarka, UI, 35 języków, privacy, testy): ok. 1–1,5 dnia pracy agenta z pracą równoległą.
- Czekanie: pierwszy `ios-unsigned.yml` ok. 20–40 min (+ ponowienia przy braku maszyn macOS), `e2e-ios.yml` (wolny symulator), `testflight.yml`, przegląd Apple
  (przy zmianie deklaracji zdrowotnej może trwać dłużej niż rutynowo — do potwierdzenia).
- Czas właściciela: test zapisu/odczytu na iPhonie z zegarkiem po każdym TestFlight, App Store Connect (formularz prywatności, opis uprawnień), decyzja o kolejności wydań.
