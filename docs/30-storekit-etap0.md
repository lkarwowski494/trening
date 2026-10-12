# 30 — Subskrypcja (0.17.0), etap 0: rozpoznanie techniczne biblioteki StoreKit

## Decyzje właściciela (12.10.2026)

S1 — A: biblioteka `expo-iap` (wersja przypięta dokładnie, bez klucza usługi weryfikacji; zapas: własny moduł StoreKit 2).
S2 (docs/27 P3) — B: do limitu po wygaśnięciu liczą się tylko treningi rozpoczęte po wygaśnięciu. S3 (docs/27 P6) — A: 7 dni dostępu offline po dacie wygaśnięcia.
S4 — A: przy ewentualnym przejściu na model darmowy zdjąć subskrypcję ze sprzedaży i dać byłym płacącym wyróżnienie (research 36).
S5 — Family Sharing: TAK (potwierdzone, ze świadomością nieodwracalności).


Data: 12.10.2026. Tylko rozpoznanie: bez zmian w kodzie i zależnościach. Specyfikacja: `docs/27-subskrypcja-spec.md` (rozdz. 4.1, P10), decyzje cenowe
i produktowe: `docs/15-app-store.md`. Wzór dokumentu: `docs/28-healthkit-etap0.md`. Źródła przeczytane dziś (adresy przy twierdzeniach i w spisie na końcu).
Kodu bibliotek nie pobierałem lokalnie; pliki źródłowe czytałem przez `raw.githubusercontent.com` (gałąź `main` z 12.10.2026, nie tag wydania —
przy wdrożeniu powtórzyć przegląd na przypiętym tagu). Pozycje „do sprawdzenia” wymagają próby na buildzie.

## 1. Obecny stan

- `package.json`: `expo ~57.0.26`, `react-native 0.86.3`, `react 19.2.3`; brak jakiejkolwiek biblioteki zakupów i brak `react-native-nitro-modules`
  (pojawi się w 0.15 z healthkit 16 — `docs/28`).
- Docelowy iOS: SDK 57 wymaga iOS 16.4 (komentarz w `modules/rest-activity/RestActivity.podspec`: „SDK 56+: minimum iOS 16.4”); w `app.json` nie ustawiony jawnie.
- Mamy już własny lokalny moduł Expo w Swift (`modules/rest-activity`: `expo-module.config.json`, podspec, `ios/*.swift`) — wzór dla opcji C.
- `app.json` → `android.package` istnieje; `docs/15` (10.10.2026) mówi o „bibliotece iOS+Android” — Android dziś nie jest budowany, ale opcja C byłaby tylko iOS.
- Prywatność: `testflight.yml` (linie 63–65) sprawdza `PrivacyInfo.xcprivacy` z kategorią `NSPrivacyAccessedAPICategoryUserDefaults` (ważne dla opcji A, pkt 3.2).
- E2E: `e2e-ios.yml` buduje `xcodebuild … -configuration Release -sdk iphonesimulator` i instaluje `.app` przez `xcrun simctl install`; Maestro uruchamia
  aplikację sam — bez akcji „Run” schematu Xcode (istotne dla pliku `.storekit`, pkt 5).

## 2. Opcje — porównanie

| | A. `expo-iap` | B. `react-native-iap` | C. własny moduł Expo (Swift, StoreKit 2) |
|---|---|---|---|
| Wersja (npm, 12.10.2026) | **6.0.1** (12.10.2026); 6.0.0 — 09.10; 5.8.3 — 07.10; 5.8.2 — 30.09 | **17.0.1** (12.10.2026); 17.0.0 — 09.10; 16.7.3 — 07.10 | — |
| Licencja | MIT (npm `latest`; podspec `openiap`: MIT) | MIT | własny kod |
| Repozytorium | monorepo `hyodotdev/openiap` (`libraries/expo-iap`), natywnie pod `openiap` (`packages/apple`, wersja 4.0.1) | to samo monorepo (`libraries/react-native-iap`) | `modules/` w naszym repo |
| Utrzymanie | wydania co kilka dni (sierpień–październik 2026: 15 wersji od 29.08); pakiet od 2022; 156 gwiazdek, sponsorzy Meta i Amazon (strona repozytorium) | pakiet od 2017; ten sam rytm wydań | my |
| StoreKit 2 | tak: README — „openiap-apple (StoreKit 2)”; kod `OpenIapStoreKitModule.swift` używa `Transaction.currentEntitlements`, `Transaction.updates`, `AppStore.sync()` | tak (ten sam pod `openiap`); strona instalacji: „iOS 15.0+ (StoreKit 2)” | tak, bezpośrednio |
| Wymagania | `peerDependencies`: expo, react, react-native `*`; config plugin `./app.plugin.js`; **bez Nitro**; „Expo SDK 53+; SDK 57 / React Native 0.86 is the validated baseline”, iOS wg SDK („SDK 57: iOS 16.4+”); `devDependencies`: expo ^57.0.12, RN 0.86.2 | `react-native-nitro-modules >=0.36.5`; RN 0.79+; **„Expo support ended in v15.0.0”**, dla Expo autorzy każą „use expo-iap instead” | Expo Modules (`ExpoModulesCore`, już mamy) |
| Zgodność z SDK 57 / RN 0.86.3 | tak — to deklarowana „validated baseline” | technicznie RN tak, ale bez wsparcia Expo (my używamy `expo prebuild`) | tak |
| Pody iOS | `ExpoIap` (iOS 13.4) + `openiap` z CocoaPods trunk (iOS 15.0, framework `StoreKit`) | `openiap` + Nitro | tylko nasz pod |
| Wysyłka danych | jedno wywołanie HTTP w całym kodzie natywnym: `verifyPurchaseWithProvider` → `https://kit.openiap.dev/v1/purchase/verify` (IAPKit), tylko gdy wywołamy; reszta to StoreKit (Apple) — pkt 3 | jak A (ten sam pod) | nic poza StoreKit |
| Android | tak (Play Billing) | tak | nie |
| Koszt | 0 zł (IAPKit pomijamy) | 0 zł | 0 zł |

Odrzucone usługi zewnętrzne (sprawdzone, powód zapisany):
- **RevenueCat** (`react-native-purchases`): wymaga konta i klucza projektu — „configure the SDK with your project's API key”
  (https://www.revenuecat.com/docs/getting-started/installation/reactnative); płatny powyżej progu — „Pay nothing for up to $2,500 in monthly tracked revenue.”,
  potem 1% (https://www.revenuecat.com/pricing/); wysyła historię zakupów na swój serwer — „RevenueCat collects purchase history from users.”
  (https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy, sekcja „Purchases”) → koniec z „Data Not Collected”.
  Łamie: 0 zł, bez serwera, bez wysyłki danych.
- **Adapty** (i podobne usługi z panelem): darmowe „While you earn under $5K/month”, potem 1% przychodu (https://adapty.io/pricing/) — ten sam model
  (konto, serwer pośredniczący, opłata od przychodu). Odrzucone z tych samych powodów; dokumentacji SDK Adapty nie czytałem (nie było potrzeby).
- **`expo-in-app-purchases`**: ostatnia wersja w npm 14.5.0 (bez wersji 57.x, czyli poza obecnym SDK Expo) — porzucona przez Expo; nie rozważam.
  (Wniosek z numeru wersji; komunikatu o wycofaniu w metadanych npm nie ma.)

## 3. Opcja A pod lupą (prywatność, offline, zachowanie)

### 3.1 Czy coś wysyła poza Apple
- `OpenIapStoreKitModule.swift` (pod `openiap`, `main` z 12.10.2026): jedyny `URLSession` to `verifyPurchaseWithProvider` → IAPKit,
  adres domyślny `let defaultBaseUrl = "https://kit.openiap.dev"`. Pozostałe adresy to tylko otwieranie stron Apple na macOS i link podany przez aplikację.
  `initConnection`, `fetchProducts`, `getAvailablePurchases`, `requestPurchase`, `restorePurchases` — bez własnych wywołań sieci (tylko StoreKit).
- `OpenIapProvider.swift`: domyślnie dostawca Apple; inny tylko po ustawieniu klucza `dev.hyo.openiap.PROVIDER` w Info.plist (nie ustawiamy).
- `AppOwnershipVerification.swift`, `OpenIapFirstPurchaseNotice.swift`: bez sieci; ten drugi zapisuje flagę w `UserDefaults`
  (`dev.hyo.openiap.firstPurchaseNoticeShown`). Po stronie JS `utils/firstPurchaseNotice.ts` tylko `console.log`, warunek `__DEV__` (build debug).
- `src/kit-api.ts` (JS): klient IAPKit; „Importing the module runs no network code” — żądanie tylko przy wywołaniu metod klienta z kluczem.
  Klucz `iapkitApiKey` czytany z `expo.extra` — nie ustawiamy.
- Config plugin (`plugin/src/withIAP.ts`): bez opcji nie zmienia Info.plist ani entitlements; dopisuje do Podfile `source 'https://cdn.cocoapods.org/'`
  i włącza `ExpoIapModule` + `ExpoIapAppDelegateSubscriber` w autolinkingu. Onside (alternatywny sklep) tylko po włączeniu opcji.
- **Wniosek:** bez klucza IAPKit i bez wywołań `verifyPurchaseWithProvider`/`kitApi` biblioteka kontaktuje się wyłącznie z Apple przez StoreKit.
  Przy wdrożeniu: test w Jest, że kod aplikacji nie importuje `kitApi` ani nie wywołuje `verifyPurchaseWithProvider` (grep w teście), i powtórzony przegląd
  na przypiętym tagu.

### 3.2 App Privacy („Data Not Collected”)
- Apple: „You are not responsible for disclosing data collected by Apple.” oraz „Data that is processed only on device is not "collected" and does not
  need to be disclosed in your answers.” (https://developer.apple.com/app-store/app-privacy-details/, „Additional guidance”); definicja „collect” = przesyłanie
  danych poza urządzenie tak, że my lub partnerzy mamy do nich dostęp (ta sama strona).
- Wniosek (agent, dwa zdania z jednej strony Apple — oznaczam „jedno źródło”): przy A bez IAPKit albo C deklaracja „Data Not Collected” może zostać.
  Zamyka `[DO WYJAŚNIENIA]` z `docs/27` 4.2 / R10 w tym zakresie; `docs/privacy.html` i tak do uzupełnienia o zdanie o zakupach przez Apple.
- Privacy manifest: pod `openiap` nie ma własnego `PrivacyInfo` (podspec bez `resource_bundles`), a używa `UserDefaults`. Nasz `PrivacyInfo.xcprivacy`
  już deklaruje kategorię UserDefaults (sprawdza `testflight.yml`) — do potwierdzenia w buildzie, że po dodaniu podu plik nadal ją ma.

### 3.3 Offline i źródło prawdy o dostępie
- `Transaction.currentEntitlements` (https://developer.apple.com/documentation/storekit/transaction/currententitlements, „Discussion”): zawiera transakcję
  każdego zakupu non-consumable i ostatnią transakcję subskrypcji w stanie „subscribed or inGracePeriod”; „Products that the App Store has refunded or revoked
  don't appear in the current entitlements.”
- `expo-iap`: `getAvailablePurchases` z `onlyIncludeActiveItemsIOS: true` → `Transaction.currentEntitlements` (kod: `onlyActive ? Transaction.currentEntitlements : Transaction.all`).
  Dokumentacja OpenIAP (https://openiap.dev/docs/apis/get-available-purchases) jest sprzeczna co do wartości domyślnej (tabela: `true`, opis: `Transaction.all`)
  → **zawsze przekazywać jawnie `true`**.
- **Pułapka 1 (6.0.0):** notatki wydania: „answer `hasActiveSubscriptions` on iOS from the active flag; a subscriber in billing grace reads inactive.”
  (https://openiap.dev/docs/updates/releases, 09.10.2026); w kodzie `isActive = expiration.map { $0 > Date() }`. Spec `docs/27` (stan `full` także w karencji)
  → **nie używać `hasActiveSubscriptions`/`getActiveSubscriptions` do decyzji o dostępie**; tylko `currentEntitlements`.
- **Pułapka 2:** `checkVerified` przy `.unverified` rzuca błąd (`transactionValidationFailed`), a w `getAvailablePurchases` błąd przerywa całą listę.
  Jedna niezweryfikowana transakcja = brak listy. W `lib/` traktować błąd jako stan `unknown` (ostatni zapamiętany), nigdy jako `free` (R4 z docs/27).
- Offline: dokumentacja `Transaction` mówi tylko, że StoreKit „automatically makes up-to-date transactions available to your app” — o pamięci podręcznej
  nic. Jedyne źródło o pamięci lokalnej: odpowiedź inżyniera Apple na forum („it does cache data locally and new transactions are pushed to the device when
  online” — https://developer.apple.com/forums/thread/706450, maj 2022, odpowiedź zaakceptowana). Szczebel niski, **jedno źródło → [OTWARTE], test w trybie
  samolotowym na telefonie (TestFlight)**. Niezależnie od wyniku aplikacja zapamiętuje ostatni stan (docs/27, P6).

### 3.4 Weryfikacja bez serwera
- Apple: „StoreKit automatically verifies the Transaction, Product.SubscriptionInfo.RenewalInfo, and AppTransaction values.”
  (https://developer.apple.com/documentation/storekit/verificationresult, „Overview”); weryfikacja na serwerze jest opcjonalna („you might want to verify
  the signed information yourself, either on the device, or on your server”).
- „If StoreKit returns a transaction as verified, the transaction is valid for the device.” (https://developer.apple.com/documentation/storekit/transaction,
  sekcja o JWS).
- Wniosek: bez serwera wystarcza przyjmowanie tylko `.verified` (A robi to w `checkVerified`, C — nasz kod). Własna weryfikacja `jwsRepresentation` na
  urządzeniu niczego nie dodaje przy tym samym zaufaniu do urządzenia (decyzja: nie robimy; obejście przez manipulację urządzeniem — teoretyczne, CLAUDE.md pkt 6).
  App Store Server API / powiadomienia serwerowe — wymagają serwera, odpadają (już w docs/27 4.2). Wymogu walidacji serwerowej w wytycznych 3.1.1 nie
  znalazłem (czytane w docs/27).

## 4. Opcja C — zakres własnego modułu
Potrzebne wywołania StoreKit 2 (z docs/27): `Product.products(for:)`, `product.purchase(...)`, `Transaction.currentEntitlements`, nasłuch `Transaction.updates`
od startu, `transaction.finish()`, `AppStore.sync()`, `subscription.isEligibleForIntroOffer`, `AppStore.presentOfferCodeRedeemSheet(in:)`,
`AppStore.showManageSubscriptions(in:)`, odczyt `ownershipType`/`expirationDate`/`revocationDate`. Ok. 9–10 funkcji + mostek zdarzeń do JS.
- Za: zero cudzego kodu i sieci, brak zależności od CocoaPods trunk (pkt 6), dokładnie nasza semantyka (karencja, błędy jako `unknown`).
- Przeciw: kod natywny sprawdzalny tylko w `ios-unsigned.yml`/E2E/TestFlight; sami odpowiadamy za przypadki brzegowe (Ask to Buy, przerwane zakupy,
  nieukończone transakcje) — A ma je już obsłużone i przetestowane przez wielu użytkowników; brak Androida.
- Szczegóły API (np. wymagana scena przy `purchase` w nowszych iOS) — do sprawdzenia w dokumentacji przy wdrożeniu, nie czytałem.

## 5. Testowanie

- **Plik StoreKit Configuration (`.storekit`)**: „StoreKit Testing in Xcode is a local test environment for testing in-app purchases without requiring a
  connection to App Store servers.”; włącza się go w schemacie: „select the Run action … For the StoreKit Configuration option, select a configuration file”
  (https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode, „Enable StoreKit Testing in Xcode”). Ta sama strona: pełna
  funkcjonalność dostępna w automatyzacji przez StoreKit Test.
- **`SKTestSession`** (https://developer.apple.com/documentation/storekittest/sktestsession): sterowanie środowiskiem testowym z XCTest — `buyProduct`,
  `expireSubscription`, `refundTransaction`, `timeRate`, `askToBuyEnabled`, `billingGracePeriodIsEnabled`, `disableDialogs` („to run tests without showing
  test environment UI”). To API XCTest, nie Maestro.
- **Maestro w `e2e-ios.yml`**: aplikacja jest instalowana przez `simctl` i uruchamiana przez Maestro, nie akcją „Run” schematu. Dokumentacja RevenueCat
  (szczebel 4): „StoreKit testing only works if you are running your app directly through Xcode.” oraz narzędzia wiersza poleceń oparte na `xcodebuild` „won't
  use the StoreKit Configuration File specified in your scheme” (https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store.md, ramka
  „StoreKit testing requires running app from Xcode”); na forum Apple pytanie o to samo przy XCUITest bez odpowiedzi (https://developer.apple.com/forums/thread/664110, 10.2020).
  Wniosek: **prawdziwy StoreKit z plikem `.storekit` w obecnym przebiegu Maestro najpewniej nie zadziała — [OTWARTE], jedna próba w CI**; czy Maestro
  umie przejść systemowe okno zakupu — [OTWARTE].
- **Plan (bez zmian względem docs/27 7.2):** w buildzie E2E sztuczny adapter sklepu za tym samym interfejsem co prawdziwy (wybór przy budowaniu, np. zmienna
  `EXPO_PUBLIC_*` tylko w `e2e-ios.yml`) + **straż w `testflight.yml`/`verify:native`, że build TestFlight ma prawdziwy adapter**. Maestro: limit → ekran zakupu
  → „zakup” → start działa → „Przywróć zakupy”. Prawdziwy StoreKit: (1) ewentualnie XCTest z `SKTestSession` na `macos-26` jako osobne zadanie (do oceny —
  koszt: projekt testów w prebuildzie); (2) ręcznie w piaskownicy.
- **Piaskownica**: „Apps you download from TestFlight” i „Development-signed apps you build and run from Xcode” używają sandboxu; „Transactions from test accounts
  don't incur charges” (https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox). Strona nie wspomina symulatora.
  Na telefonie z TestFlight konto testowe w Ustawienia → Deweloper (ta sama strona). Lista ręczna — docs/27 7.2.

## 6. Kolizje i ryzyka

- **healthkit 8→16 (Nitro) w 0.15:** A nie używa Nitro — brak wspólnej zależności. B wymaga `react-native-nitro-modules >=0.36.5`, healthkit 16 `>=0.35`
  (docs/28) — wspólna jedna wersja (dziś 0.37.1), zgodne, ale każda aktualizacja Nitro dotyka dwóch bibliotek naraz. C — brak kolizji.
- **CocoaPods trunk:** pod `openiap` jest pobierany z trunk (4.0.1 opublikowany 12.10.2026, https://trunk.cocoapods.org/api/v1/pods/openiap). Trunk:
  „November 1-7, 2026” próbny tryb tylko do odczytu, od „December 2, 2026” bez nowych podspeców; „This will keep all existing builds working.”
  (https://blog.cocoapods.org/CocoaPods-Specs-Repo/). Skutek: przypięta wersja nadal się zainstaluje, ale **nowe wersje `openiap` po 02.12.2026 nie dotrą
  przez trunk** — jak autorzy to rozwiążą (SPM, pod lokalny — plugin ma opcję `localPath`/`withLocalOpenIAP`, nie czytałem) — **[OTWARTE]**. Dotyczy A i B, nie C.
- **Świeżość:** 6.0.0 (09.10) zmieniło zachowanie (pkt 3.3), 6.0.1 z dziś. Rytm: kilka wydań tygodniowo. Przypiąć dokładną wersję (bez `^`/`~`),
  najnowszą, która w dniu wdrożenia ma ≥ 14 dni (reguła z docs/27), i przeczytać notatki wydań między nią a 6.0.1.
- **Xcode 27:** strona instalacji: projekty budowane Xcode 27 muszą używać cyklu życia UIScene (https://openiap.dev/docs/setup/expo); CI ma dziś Xcode 26.6 —
  dotyczy przyszłej aktualizacji SDK, nie 0.17.
- **Kolejność wydań (docs/27 4.4):** znacznik `Workout.live` i `lib/paywall.ts` muszą wejść w wydaniu **przed** 0.17.0 (zmiana danych osobno od natywnej
  zależności) — do potwierdzenia w planie wersji przez koordynatora.

## 7. Rekomendacja

**A — `expo-iap`, wersja przypięta dokładnie (≥ 14 dni od wydania w dniu wdrożenia), bez klucza IAPKit**, z warunkami:
1. dostęp liczony wyłącznie z `getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })` (= `currentEntitlements`) + nasłuch zakupów; nie z
   `hasActiveSubscriptions` (karencja = nieaktywny w 6.0.0);
2. błąd odczytu uprawnień → stan `unknown` (ostatni zapamiętany), nigdy `free`;
3. test w Jest blokujący użycie `kitApi`/`verifyPurchaseWithProvider` i opcji `iapkitApiKey` w `app.json`;
4. powtórny przegląd sieci na przypiętym tagu; sprawdzenie `PrivacyInfo.xcprivacy` po `pod install`.

Uzasadnienie: jedyna opcja z deklarowaną zgodnością z SDK 57 / RN 0.86, bez Nitro (zero kolizji z 0.15), StoreKit 2, MIT, 0 zł, bez wysyłki danych
przy naszej konfiguracji, obsłużone przypadki brzegowe; Android w zapasie. **C jako plan zapasowy** — gdy przegląd przypiętej wersji wykaże sieć, albo gdy
po 02.12.2026 `openiap` nie dostanie ścieżki aktualizacji poza trunk. **B odradzam**: autorzy zakończyli wsparcie Expo w v15, dodatkowa zależność Nitro.

Decyzja produktowa należy do właściciela (P10 w docs/27): A (szybciej, cudzy kod z przeglądem) vs C (więcej pracy agenta, pełna kontrola, brak ryzyka trunk).

Szacunek pracy agenta (orientacyjny): A — integracja adaptera, nasłuch, ekran i testy wg docs/27 ok. 1–1,5 dnia (jak w docs/27); C — dodatkowo ok. 0,5–1 dnia
na moduł Swift i iteracje po `ios-unsigned.yml`. Czekanie: `ios-unsigned.yml`, E2E, TestFlight, przegląd Apple pierwszych produktów IAP.
Czas właściciela: App Store Connect (docs/27 rozdz. 6), testy w piaskownicy na telefonie (w tym tryb samolotowy).

## 8. Otwarte pytania
- [OTWARTE] Czy StoreKit przechowuje uprawnienia offline (jedno źródło: forum Apple) — test w trybie samolotowym na TestFlight.
- [OTWARTE] Czy plik `.storekit` da się podpiąć przy uruchomieniu przez Maestro/`simctl` i czy Maestro przejdzie systemowe okno zakupu — jedna próba w CI.
- [OTWARTE] Ścieżka aktualizacji podu `openiap` po zamknięciu CocoaPods trunk (02.12.2026).
- [OTWARTE] Czy `PrivacyInfo.xcprivacy` po dodaniu podu nadal zawiera kategorię UserDefaults (build).
- [OTWARTE] Zachowanie `getAvailablePurchases` przy transakcji `.unverified` na przypiętym tagu (dziś na `main` rzuca dla całej listy).

## Źródła (przeczytane 12.10.2026)
- npm: https://registry.npmjs.org/expo-iap/latest, https://registry.npmjs.org/react-native-iap/latest (wersje, licencje, `peerDependencies`); pole `time`
  w https://registry.npmjs.org/expo-iap i https://registry.npmjs.org/react-native-iap (daty wydań); https://registry.npmjs.org/expo-in-app-purchases/latest
- Repozytorium https://github.com/hyodotdev/openiap: `libraries/expo-iap/package.json`, `ios/ExpoIap.podspec`, `ios/ExpoIapModule.swift`, `src/index.ts`,
  `src/kit-api.ts`, `src/utils/firstPurchaseNotice.ts`, `plugin/src/withIAP.ts`, `CHANGELOG.md` (odsyła do notatek centralnych); `packages/apple/openiap.podspec`,
  `Sources/OpenIapModule.swift`, `Sources/OpenIapStoreKitModule.swift`, `Sources/OpenIapProvider.swift`, `Sources/Helpers/AppOwnershipVerification.swift`,
  `Sources/Helpers/OpenIapFirstPurchaseNotice.swift`; `openiap-versions.json`
- OpenIAP: https://openiap.dev/docs/setup/expo, https://openiap.dev/docs/setup/react-native, https://openiap.dev/docs/updates/releases,
  https://openiap.dev/docs/apis/get-available-purchases
- CocoaPods: https://trunk.cocoapods.org/api/v1/pods/openiap, https://blog.cocoapods.org/CocoaPods-Specs-Repo/
- Apple: https://developer.apple.com/documentation/storekit/transaction/currententitlements, https://developer.apple.com/documentation/storekit/verificationresult,
  https://developer.apple.com/documentation/storekit/transaction, https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode,
  https://developer.apple.com/documentation/storekittest/sktestsession, https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox,
  https://developer.apple.com/app-store/app-privacy-details/, https://developer.apple.com/forums/thread/706450, https://developer.apple.com/forums/thread/664110
- Usługi odrzucone: https://www.revenuecat.com/pricing/, https://www.revenuecat.com/docs/getting-started/installation/reactnative,
  https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy, https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store.md,
  https://adapty.io/pricing/
