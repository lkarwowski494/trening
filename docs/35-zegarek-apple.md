# 35. Zegarek Apple Watch (0.20 „Zegarki i głos”) — wdrożenie, testy, dopasowanie do protokołu

Stan z 13.10.2026, gałąź `f020-applewatch` (od `f018-dostosuj`). Specyfikacja: scratchpad koordynatora `spec-zegarek.md` (do docs przy starcie 0.20).
Protokół i model referencyjny zegarka: gałąź `f020-protokol` (docs/35, `lib/watch/*`) — ten dokument opisuje tylko stronę Apple Watch.
Decyzje właściciela 13.10.2026 (docs/18): zegarek **tylko wyświetla** i zarządza bieżącą akcją, **bez edycji** na zegarku; Apple Watch testowany **tylko
wirtualnie** (właściciel nie ma urządzenia); zapis do Apple Health z zegarka, jeśli prowadził sesję treningu, inaczej z telefonu — bez duplikatów.

## 1. Co zegarek robi
| Ekran (`clientView.screen`) | Zegarek pokazuje | Akcje |
|---|---|---|
| `idle` | „Zacznij trening na telefonie” | — |
| `set` | ćwiczenie, „seria k z n”, ciężar × powtórzenia (gotowe teksty z telefonu), etykieta superserii, „Pauza” | **Seria zrobiona** (przycisk + podwójne stuknięcie, watchOS 11), **Zrobione inaczej**, **Pomiń** (z potwierdzeniem: „Pominąć ćwiczenie?” Anuluj / Pomiń) |
| `rest` (od pierwszej sekundy) | odliczanie, zapowiedź = ten sam tekst co głos w słuchawkach (`cue`) | przycisk główny odhacza **następną** serię (P4-A), **Cofnij** przez `WATCH.UNDO_SEC` (5 s) |
| koniec przerwy | wibracja (`WKHapticType.notification`) i zdarzenie `restEnded` (telefon mówi „koniec przerwy”) | — |
| `done` | „Nic więcej do zrobienia” | — |
| `connect` | „Połącz z telefonem” — bez połączenia po `WATCH.OFFLINE_DONE_MAX` (2) odhaczeniach zegarek nie zna dalszych serii | — |
| `finished` | „Trening zakończony” | — |
| `update` | „Zaktualizuj aplikację na zegarku” (`welcome.upgrade = watch` albo komunikat o wyższej wersji `v`) | — |

Bez połączenia zegarek sam przechodzi do przerwy po „zrobione” (pole `after` migawki: długość przerwy, zapowiedź i następna seria policzone przez telefon),
a zdarzenia czekają w kolejce. Wygląd: czcionki systemowe (Dynamic Type), przewijanie przy długich tekstach, VoiceOver = widoczne etykiety, Always On:
przyciemnienie, odliczanie przez `Text(timerInterval:)` (liczy system). Ikona trwającej sesji treningu jest wymogiem Apple dla `HKWorkoutSession`.

## 2. Architektura (gdzie co leży)
| Część | Pliki | Uwagi |
|---|---|---|
| Cel watchOS | `targets/watch-app/` (`expo-target.config.js`, `Info.plist`, `Assets.xcassets`; manifest prywatności dokłada CocoaPods, patrz niżej) | `@bacons/apple-targets` 5.0.0, typ `watch`; `MARKETING_VERSION` ustawia Expo (= `app.json`), pilnuje go `verify:native`; watchOS 11, HealthKit w uprawnieniach, tryb tła `workout-processing`, `WKRunsIndependentlyOfCompanionApp = false` |
| Model zegarka (czysty Swift) | `Core/WatchClient.swift` — port `lib/watch/client.ts` (`clientStep`, `clientView`, projekcja niepotwierdzonych zdarzeń) | zachowanie = model referencyjny; sprawdza je odtworzenie scenariuszy z TS (XCTest `ScenarioReplayTests`) |
| Protokół | `Core/WatchProtocol.swift` (typy `Codable` = lustro `lib/watch/protocol.ts`) | schemat ↔ typy Swift pilnuje `tests/watch-apple-contract.test.ts` |
| Warstwa platformy | `Core/WatchStore.swift` (transport, sesja treningu, wibracja, ponawianie niepotwierdzonych zdarzeń, język z migawki), `WatchPersistence`, `WatchFakes` | zależności wstrzykiwane; XCTest `WatchStoreTests` na fałszywych |
| Ekrany, łączność, sesja | `RootView.swift`, `TreningWatchApp.swift`, `WatchConnectivityClient.swift`, `WorkoutController.swift` | tylko cel watchOS |
| Testy logiki | `targets/Package.swift` + `targets/watch-tests/WatchCoreTests/` | `cd targets && swift test` (macOS); pakiet leży w `targets/`, bo SwiftPM nie wskaże źródeł poza własnym katalogiem, a katalog celu jest w całości kompilowany przez Xcode |
| Testy ekranów | `targets/watch-ui-tests/WatchUITests.swift` + `scripts/ci/add-watch-ui-tests.mjs` | cel XCUITest dokładany po `expo prebuild` (apple-targets go nie tworzy); `verify:native` sprawdza, że skrypt działa na świeżym projekcie |
| Teksty zegarka | `lib/watchLabels.ts` → `Core/WatchLabelTable.swift`, `<język>.lproj/InfoPlist.strings`, `tests/fixtures/watch-app/{labels,lang-cases}.json` | generowane testem `tests/watch-apple-i18n.test.ts` (`UPDATE_WATCH_APPLE=1`), wzór `widget-i18n`; 35 języków z tego samego słownika `t()` co telefon; identyfikatory etykiet = `WATCH_LABEL_IDS` z protokołu (+ `workoutOn` tylko Apple); zegarek wybiera język z migawki, bez migawki — z systemu (`WatchLabels.resolve` = `resolveLang`) |
| Moduł iPhone’a | `modules/watch-link/` (Swift: `WatchLinkHub`, `WatchLinkModule`, `WatchLinkAppDelegate`; TS: `transport.ts`, `index.ts`) | WatchConnectivity; komunikaty z zegarka trafiają do **trwałej kolejki** (UserDefaults) przed odpowiedzią dla zegarka; JS pobiera `takeMessages()`; adapter `toLinkTransport` pasuje do `WatchTransport` z `lib/watch/link.ts`; `createFakeWatchLink()` do testów i E2E |
| Pliki wzorcowe | `watch-fixtures/` (protokół: scenariusze, migawki, komunikaty, `protocol.json`, etykiety — generuje je telefon, docs/35); `tests/fixtures/watch-app/` (etykiety z `workoutOn` i przypadki języka — generuje `tests/watch-apple-i18n.test.ts`) | czytają je Jest i XCTest |
| Rejestracja łącza | `lib/watch/apple.ts` (`startAppleWatchLink`, wołane z `app/_layout.tsx`) | łącze protokołu startuje samo, gdy iPhone ma sparowany zegarek z zainstalowaną aplikacją, i zatrzymuje się po odparowaniu |

Wersja aplikacji zegarka = wersja telefonu: Expo ustawia `MARKETING_VERSION` we wszystkich celach (`verify:native`: jedna wartość = `app.json`),
numer buildu (`CURRENT_PROJECT_VERSION`) przekazuje się w poleceniu `xcodebuild` dla całego projektu (łatki workflowów, `testflight.patch`).

### Komunikacja (WatchConnectivity)
Klucz słownika: `msg` (wartość = cały komunikat JSON). Migawka telefon → zegarek: `updateApplicationContext` (stan, także gdy zegarek był nieosiągalny) i `sendMessage`,
gdy osiągalny. Pozostałe komunikaty telefonu (`ack`, `welcome`, `session`) i wszystkie komunikaty zegarka (`hello`, zdarzenia): `sendMessage` (budzi aplikację
w tle), bez połączenia `transferUserInfo` (kolejka systemu; symulator go nie obsługuje). Zdarzenia zegarka zostają w jego kolejce do `ack` protokołu i są wysyłane
ponownie po `welcome` (po powrocie łączności, po starcie aplikacji) — telefon pomija powtórzone `eventId`.
Polecenie `session start` wysyła dodatkowo `HKHealthStore.startWatchApp` (adapter `toLinkTransport`), żeby aplikacja na zegarku ruszyła bez ręcznego otwierania.

### Zapis do Apple Health (bez duplikatu)
Telefon (`lib/watch/link.ts`, `lib/watch/health.ts`) prosi o sesję poleceniem `session start {save}`; zegarek startuje `HKWorkoutSession` i zgłasza `sessionStarted`. Po „Zakończ” telefon wysyła
`session end {save}`: przy `save = true` zegarek kończy sesję i zapisuje `HKWorkout` z **tym samym** `HKMetadataKeySyncIdentifier` (= id treningu) i `SyncVersion = 1`
co zapis telefonu (`lib/health.ts`), po czym zgłasza `sessionEnded {saved}`; przy `save = false` odrzuca sesję. HealthKit odrzuca drugi zapis tego samego treningu,
więc duplikatu nie ma, kto by pierwszy nie zapisał. Telefon czeka na raport `WATCH.HEALTH_WAIT_SEC` i zapisuje sam, gdy zegarek nie zapisał. Gdy sesję przerwie system
(np. systemowe Treningi), zegarek zgłasza `sessionEnded {saved: false}`; bez żywej sesji na polecenie `end` odpowiada od razu `saved: false` (telefon nie czeka).
Zgoda HealthKit na zegarku jest pytana przy pierwszej sesji; bez zgody ekrany działają, ale bez wibracji w tle (zapisuje telefon).

## 3. Co sprawdzamy wirtualnie, czego nie
| Warstwa | Jak | Gdzie liczone |
|---|---|---|
| Teksty 35 języków, opisy zgód, kontrakt Swift ↔ schemat ↔ pliki złote, liczby = stałe protokołu | Jest | `npm run verify` (Linux) |
| Konfiguracja celu (watchOS 11, HealthKit, tryb tła, manifest prywatności, ikona, wersja, autolinking `WatchLink`, cel XCUITest) | `verify:native` (prebuild na Linuksie) | `npm run verify` |
| Moduł iPhone’a (logika TS, adapter łącza, atrapa zegarka, zgodność z kodem Swift) | Jest | `npm run verify` |
| Zachowanie zegarka: wszystkie scenariusze z modelu referencyjnego krok po kroku (zdarzenia i widok), trwałość stanu w każdym kroku, granice (offline, ack, powtórzenia, sesja) | XCTest, `swift test` na macOS | **CI (łatka)** |
| Store zegarka z fałszywym transportem, sesją i wibracją (polecenia sesji, zapis, ponawianie, język) | XCTest | **CI (łatka)** |
| Ekrany: seria → zrobione → przerwa z zapowiedzią → Cofnij → Pomiń → brak połączenia → wskaźnik sesji; etykiety w 35 językach | XCUITest na symulatorze watchOS | **CI (łatka)** |
| Zrzuty (App Store: 35 języków, największa czcionka) | `simctl launch --setenv` + `simctl io screenshot` (konfiguracja Debug) | **CI (łatka)** |
| Kompilacja celu watchOS, podpis, eksport | `xcodebuild` | **CI (łatka)** |

**Nie do sprawdzenia wirtualnie (lista ręczna — tester z Apple Watch, opcjonalnie P2-B):**
1. Siła i odczucie wibracji; wibracja po opuszczeniu ręki (tło z aktywną sesją) — symulator nie wibruje.
2. Podwójne stuknięcie (Series 9 / Ultra 2 i nowsze) — gest fizyczny.
3. Always On na prawdziwym ekranie (czytelność, brak migotania).
4. `transferUserInfo` (symulator go nie obsługuje; zdarzenia bez połączenia ratuje kolejka zegarka, ale droga systemowa jest nieprzetestowana).
5. Wybudzenie zablokowanego iPhone’a przez `sendMessage` i opóźnienie (cel < 2 s).
6. Zgoda HealthKit na zegarku, start sesji z telefonu (`startWatchApp`), zachowanie przy równoległym systemowym treningu.
7. Instalacja zegarka z TestFlight razem z aplikacją, wymiary zrzutów w App Store Connect.
8. Jeden trening w Apple Zdrowiu po sesji prowadzonej przez zegarek (brak duplikatu, tętno i energia przy treningu).
Skrócona lista dla testera: instalacja z TestFlight, zgoda HealthKit, start na telefonie, odhaczenie przyciskiem i podwójnym stuknięciem, wibracja po opuszczeniu
ręki, koniec treningu, jeden trening w Zdrowiu.

## 4. CI — łatki do wklejenia przez właściciela
Workflowy zmienia właściciel (agent nie commituje `.github/workflows`). Gotowe łatki i instrukcja krok po kroku: scratchpad koordynatora `latki-zegarek/` (README).
Skrót: `ios-unsigned.yml` i `e2e-ios.yml` (usunąć `-sdk …` — wymuszał SDK iOS na celu watchOS; `swift test`; sprawdzenie zegarka w paczce), nowy `watch-sim.yml`
(XCUITest + zrzuty), `testflight.yml` (kontrola zegarka w archiwum; podpis automatyczny; uwaga na limit certyfikatów i App ID z HealthKit).

## 5. Dopasowanie do protokołu (stan z 13.10.2026: gałąź `f020-protokol` scalona do `f020-applewatch`)
Zegarek odtwarza **oficjalne pliki wzorcowe** protokołu (`watch-fixtures/`): XCTest `ScenarioReplayTests` uruchamia na Swift każdy krok każdego scenariusza z modelu
referencyjnego i porównuje zdarzenia i widok. Pilnują tego też testy Jest: `tests/watch-apple-contract.test.ts` (schemat komunikatów i widoku ↔ pliki wzorcowe ↔ typy Swift,
`WatchLimits` ↔ `protocol.json` ↔ `lib/watch/protocol.ts`, listy wartości, komunikaty zegarka przechodzą `parseWatchMessage`) i `tests/watch-apple-link.test.ts` (moduł natywny na atrapie →
adapter → `WatchLink` → trening: hello/welcome, sesja, zdarzenie „zrobione”, ack po migawce, duplikat).
Gdy protokół się zmieni (nowa wersja `v`, nowe pole): odtworzyć pliki wzorcowe (`UPDATE_WATCH=1 npx jest tests/watch-fixtures.test.ts`), poprawić typy w `WatchProtocol.swift` i schemat
w teście kontraktu — czerwone testy wskażą każde miejsce po stronie Swift. Zmiana zachowania modelu (`lib/watch/client.ts`) = zmiana `WatchClient.swift` (scenariusze nie przejdą bez tego).
Rejestr łącza jest jeden (`startWatchLink` zatrzymuje poprzednie) — jednoczesna praca Apple Watch i drugiego zegarka wymaga rejestru wielu transportów (poza zakresem 0.20).

## Manifest prywatności zegarka (14.10.2026)

Przebieg kompilacji 38486942752 padł na „Multiple commands produce TreningWatch.app/PrivacyInfo.xcprivacy”. Przyczyna: krok CocoaPods
„Privacy Manifest Aggregation” (React Native, `privacy_manifest_utils.rb`) dopisuje `PrivacyInfo.xcprivacy` do każdego celu typu aplikacja,
także zegarka, a nasz własny plik w `targets/watch-app/` kopiowała jako zasób grupa zsynchronizowana. Naprawa: zegarek nie ma własnego pliku;
manifest zbiorczy (bez śledzenia, z powodami użycia UserDefaults z rdzenia RN) dokłada jedyny producent. Strażnik: `verify:native`
(brak `*.xcprivacy` w folderze celu, brak jawnego odwołania w projekcie, brak zasobów o tej samej nazwie).
