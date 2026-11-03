# Zegarek Garmin (Connect IQ): koszt publikacji, prywatność SDK iOS, licencja — research 2026-11

Zadanie: ZB-040 (`docs/zobowiazania.md`), badacz, 03.11.2026. Kontekst: `docs/35-zegarki.md` (protokół, klient Monkey C, rozdz. 10 pkt 2 — nazwa sprzętu na ekranie parowania).
Dokument wewnętrzny (research): nazwy marek dozwolone tutaj, nie w kodzie ani w tekstach aplikacji (CLAUDE.md, „Treści cudze”).

**Szczeble.** Hierarchia z CLAUDE.md dotyczy wiedzy o treningu i zdrowiu. Tu chodzi o fakty umowne i techniczne, więc rozstrzyga **dokument pierwotny wydawcy**
(umowa i dokumentacja Garmin, dokumentacja i wytyczne Apple). Wpisy forum = szczebel 5 (tylko sygnał ryzyka).
Część stron developer.garmin.com renderuje treść skryptem; czytałem je przez czytnik `r.jina.ai` (zwraca tekst tej samej strony Garmin), adres w tabeli podaję oryginalny.

## Wnioski

| # | Wniosek | Ocena |
|---|---|---|
| W1 | Publikacja **darmowej** aplikacji w sklepie Connect IQ: ani strona o publikacji, ani umowa nie wymieniają opłaty za publikację; jedyne opłaty dotyczą usługi sprzedaży (Merchant). Brak zdania „publikacja jest bezpłatna” wprost. | potwierdzone (brak opłaty w przeczytanych dokumentach); zdanie „bezpłatnie” wprost — otwarte (O1) |
| W2 | Aplikacja **płatna** w sklepie Connect IQ: konto sprzedawcy 100 USD rocznie (bezzwrotne), prowizja Garmin 15% ceny bez podatku, wypłata 1. dnia miesiąca od 10 USD, okno zwrotu 48 h; Polska na liście krajów. | potwierdzone (strony Garmin „Merchant Onboarding”, „App Sales”, umowa II.c.2.C) |
| W3 | Przegląd w sklepie Connect IQ: zwykle do 72 h (poza świętami); ANT+ dodaje ok. 48 h; odrzucenie z powodami e-mailem. Garmin może odmówić lub usunąć aplikację z dowolnego powodu. | potwierdzone |
| W4 | Aplikacja Connect IQ musi mieć **własną politykę prywatności**, jasno mówiącą, że dane trafiają do nas, nie do Garmin; minimalizacja danych; zakaz domyślnego zbierania lokalizacji; ujawnienie zależności od sprzętu/oprogramowania (telefon z aplikacją Trening). | potwierdzone (umowa, Exhibit A I.a; wytyczne przeglądu 3(c), 4(a)) |
| W5 | Info.plist: `NSBluetoothAlwaysUsageDescription` (Apple: wymagany przy użyciu Bluetooth). Dokumentacja SDK Garmin (wersja 1.8.0) każe ustawić starszy `NSBluetoothPeripheralUsageDescription` — Apple wymaga go tylko przy celu wdrożenia < iOS 13. | potwierdzone (Apple); rozbieżność z dok. Garmin — opisana |
| W6 | Info.plist: `LSApplicationQueriesSchemes` z wpisem `gcm-ciq`; własny schemat URL (URL Types, unikalny ciąg); `CFBundleDisplayName`. Tło: „Uses Bluetooth LE accessories” (= `UIBackgroundModes: bluetooth-central`) — w dokumentacji SDK **opcjonalne**. | potwierdzone (dokumentacja SDK); nazwa klucza `bluetooth-central` = odpowiednik w Xcode — uproszczenie |
| W7 | Parowanie wymaga zainstalowanej aplikacji Garmin Connect Mobile (tylko do wykrycia urządzeń; potem komunikacja bez niej). Wybór urządzenia: SDK otwiera GCM, GCM wraca do naszej aplikacji z listą urządzeń w parametrach URL. | potwierdzone (dokumentacja SDK) |
| W8 | Manifest prywatności: SDK (repo GitHub, stan po commicie z 15.01.2026) **nie zawiera** `PrivacyInfo.xcprivacy`; ConnectIQ **nie jest** na liście Apple „commonly used SDKs”, więc manifest SDK nie jest obowiązkowy. Jeśli binarka używa „required reason API”, Apple wymaga deklaracji w manifeście tego SDK; App Store Connect wysyła e-mail / odrzuca przesyłkę. | potwierdzone (brak pliku — listing repo + 404 pod ścieżką; lista Apple); użycie API przez binarkę — otwarte (O3) |
| W9 | Telemetria SDK: ani dokumentacja SDK, ani umowa nie wspominają o zbieraniu danych lub analityce przez SDK. Binarka zamknięta; umowa zabrania dekompilacji (I.b). Etykieta „Data Not Collected” obejmuje też kod partnerów (SDK) — utrzymanie jej wymaga potwierdzenia, że SDK nic nie wysyła z urządzenia. | otwarte (O2) |
| W10 | Licencja: umowa daje licencję „do tworzenia i testowania Aplikacji” i zakazuje redystrybucji materiałów programu; **nie zawiera zdania, które wprost pozwala dołączyć binarkę Companion SDK do aplikacji w App Store**. Cel Companion SDK (def. IX.e: aplikacje na „platformy zewnętrzne”) wskazuje, że tak jest pomyślane. Atrybucji nie wymaga; zabrania marketingu nazwy i logo Garmin w aplikacji; zgodność wolno podawać zgodnie z wytycznymi marki. | licencja — otwarte (O4, interpretacja); atrybucja/marka — potwierdzone |
| W11 | Ryzyko przeglądu Apple 5.2.1: wątek forum Apple (05.2026) — aplikacja towarzysząca dla zegarków Garmin odrzucana w pętli za „funkcje Garmin bez autoryzacji”, mimo umowy dewelopera i statusu „Approved” w sklepie CIQ; bez rozstrzygnięcia. | jedno źródło (szczebel 5) — sygnał ryzyka, do rejestru ryzyk |
| W12 | Apple 4.2.3(i): aplikacja ma działać bez instalowania innej aplikacji — zegarek Garmin musi zostać funkcją dodatkową (bez GCM aplikacja działa w pełni). | potwierdzone (wytyczne Apple) |

## Źródła z cytatami

| ID | Źródło (przeczytane 03.11.2026) | Miejsce | Cytat / wskazanie |
|---|---|---|---|
| G1 | https://developer.garmin.com/downloads/connect-iq/sdks/agreement.html (Connect IQ Developer Agreement, „Updated August 6, 2024”) | I.a | licencja „limited, non-exclusive, personal, revocable, non-assignable” …, „to develop and test Applications” (dalsza część zdania streszczona). |
| G1 | j.w. | I.b | „You agree not to rent, lease, lend, upload to or host on any website or server, sell, redistribute” (materiały programu); tamże zakaz „decompile, reverse engineer, disassemble”. |
| G1 | j.w. | IX (def.) | „Companion SDK” — „the SDK provided by Garmin to enable the development of Applications for third-party platforms.”; „Application(s)” — „any software programs that you develop by using components of the Program Materials.” |
| G1 | j.w. | II.a.5 | „Garmin may, but is not obligated to, review your Application before it is uploaded to the CIQ Store.”; może „refuse to upload or remove your Application for any reason”. |
| G1 | j.w. | II.c.2.C | Merchant Service: „Garmin will collect (i) a non-refundable annual fee; and (ii) a service fee that is a percentage of revenue collected by Garmin”. |
| G1 | j.w. | VIII.a, VIII.e | „You shall not include any marketing of Garmin's name, logo or other trademarks in your Application”; wolno promować zgodność („compatibility with certain Garmin products”) zgodnie z wytycznymi marki; VIII.e: koszty udziału w programie po stronie dewelopera. |
| G1 | j.w. | Exhibit A I.a, I.b | „you must have a privacy policy for the Application that complies with all applicable Laws”; ma jasno mówić, że dane trafiają do dewelopera, nie do Garmin; zakaz przechowywania danych dłużej niż potrzeba. Lokalizacja: aplikacja „does not default to collect location data”. |
| G2 | https://developer.garmin.com/connect-iq/core-topics/publishing-to-the-store/ | sekcja o przeglądzie | „Aside from special circumstances, such as national holidays, reviews are completed within 72 hours.” ANT+ — ok. 48 h dłużej. Brak wzmianki o opłacie. |
| G3 | https://developer.garmin.com/connect-iq/app-review-guidelines/ | 3(c), 4(a), 4(d), 1(c) | 3(c): „Publish and make available your own privacy policy or other notice concerning your processing of personal data”; 4(a): „Identify whether your app requires any specific Garmin or third-party hardware or software to operate.” |
| G4 | https://developer.garmin.com/connect-iq/monetization/merchant-onboarding/ | Program fee, kraje | „an annual, non-refundable fee of $100 USD”; lista krajów UE obejmuje Polskę („subject to change”); wymagane dokumenty podatkowe. |
| G5 | https://developer.garmin.com/connect-iq/monetization/app-sales/ | prowizja, wypłaty | „Garmin receives 15% of the tax-exclusive price point.”; wypłaty 1. dnia miesiąca, minimum 10 USD; środki pobierane po 48 h oknie zwrotu. |
| G6 | https://developer.garmin.com/connect-iq/sdk/ | góra strony | „By downloading any of the following SDKs, you accept our license agreement.” (brak zdania o bezpłatności). |
| S1 | https://github.com/garmin/connectiq-companion-app-sdk-ios — `documentation/ConnectIQ_iOS_SDK.html` (wersja 1.8.0) | „Set Bluetooth usage description” | „The NSBluetoothPeripheralUsageDescription key must be set in Info.plist to explain your app's usage of BLE”. |
| S1 | j.w. | „Set background execution mode (optional)” | włączyć „Uses Bluetooth LE accessories” w Background Modes (opcjonalne). |
| S1 | j.w. | „Establishing communication between the companion app and Garmin Connect Mobile (GCM) app” | „add an entry for gcm-ciq to LSApplicationQueriesSchemes”; własny schemat URL — „A string that is not likely to collide with any other apps on the iOS device should be chosen.”; aplikacje „require GCM to initially discover Connect IQ-compatible devices”. |
| S1 | j.w. | „Finding Connect IQ-compatible devices” | GCM wraca do aplikacji „passing the list of devices as serialized URL query items”; `parseDeviceSelectionResponseFromURL:`. Brak słów o prywatności, analityce, manifeście. |
| S2 | https://github.com/garmin/connectiq-companion-app-sdk-ios/commits/main, PR #8 (15.01.2026, 9 plików), `Package.swift` | listing `ConnectIQ.xcframework/ios-arm64/ConnectIQ.framework`; `raw…/PrivacyInfo.xcprivacy` → HTTP 404 | Brak `PrivacyInfo.xcprivacy` w frameworku i w `Package.swift` (brak `resources`, brak `platforms`). PR #8 dodał sekcję o identyfikatorze odtwarzania `CBCentralManager`. |
| A1 | https://developer.apple.com/documentation/bundleresources/information-property-list/nsbluetoothalwaysusagedescription | Discussion | „This key is required if your app uses the device's Bluetooth interface.” Starszy klucz dodatkowo tylko przy celu wdrożenia < iOS 13. |
| A2 | https://developer.apple.com/support/third-party-SDK-requirements/ | lista SDK | wymóg manifestu i podpisu dotyczy SDK z listy; ConnectIQ/Garmin na liście brak. |
| A3 | https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api | wstęp | „Your third-party SDK can't rely on the privacy manifest files for apps that link the third-party SDK … to report your third-party SDK's use of required reasons API.”; od 01.05.2024 App Store Connect odrzuca brak deklaracji. |
| A4 | https://developer.apple.com/app-store/app-privacy-details/ | wstęp, „Data collection” | dane prywatności obejmują „the practices of third-party partners whose code you integrate into your app”; „Collect” = przesłanie danych poza urządzenie dłużej niż na obsługę żądania; dane przetwarzane tylko na urządzeniu nie są „collected”. |
| A5 | https://developer.apple.com/app-store/review/guidelines/ | 2.5.4, 4.2.3(i), 5.2.1, 2.3.7 | 2.5.4: tryby tła tylko „for their intended purposes”; 4.2.3(i): „Your app should work on its own without requiring installation of another app to function.” |
| F1 | https://developer.apple.com/forums/thread/826067 (05.2026, szczebel 5) | pierwszy wpis | odrzucenie 5.2.1: „The app includes content or features from Garmin, or is marketed to control external hardware from Garmin, without the necessary authorization.” Brak odpowiedzi i rozstrzygnięcia. |

## Otwarte pytania

- **O1** Czy publikacja darmowej aplikacji i konto dewelopera Connect IQ są bezpłatne — zdanie wprost na stronie Garmin (nie znalazłem; brak opłat w G1/G2 to wniosek z milczenia). Sprawdzić przy zakładaniu konta (właściciel).
- **O2** Czy binarka ConnectIQ.framework wysyła cokolwiek z urządzenia (analityka, raporty błędów). Bez tego „Data Not Collected” jest założeniem. Dekompilacja zabroniona (G1 I.b). Opcje: (A, rekomendacja) zapytanie pisemne do wsparcia Connect IQ + obserwacja ruchu sieciowego aplikacji testowej na telefonie (bez analizy binarki); (B) przyjąć brak zbierania na podstawie milczenia dokumentacji — ryzyko błędnej etykiety.
- **O3** Czy binarka używa „required reason API” (UserDefaults, znaczniki czasu plików itp.) bez własnego manifestu — rozstrzygnie pierwsza przesyłka do App Store Connect (e-mail ITMS-91053) albo odpowiedź Garmin. Nie deklarować kategorii za SDK „na zapas” bez potwierdzenia (A3: SDK nie może polegać na manifeście aplikacji).
- **O4** Licencja: czy umowa pozwala osadzić binarkę Companion SDK w aplikacji dystrybuowanej przez App Store (brak zdania wprost; I.b zakazuje redystrybucji). Rekomendacja: zapytanie pisemne do Garmin przed wydaniem; decyzja ryzyka — właściciel (sprawa prawna, nie merytoryczna).
- **O5** Ryzyko 5.2.1 (F1): jaki dowód autoryzacji akceptuje Apple dla aplikacji towarzyszącej Garmin. Do rejestru ryzyk w `docs/40` z warunkiem zamknięcia (np. przegląd Apple wersji z tą funkcją). Rozważyć dopisek w uwagach dla recenzenta.
- **O6** Czy SDK 1.8.0 działa z samym `NSBluetoothAlwaysUsageDescription` (dokumentacja Garmin nieaktualna względem Apple) i czy tryb tła `bluetooth-central` jest potrzebny dla odbioru zdarzeń z zegarka przy zablokowanym telefonie — test na telefonie z fēnix 8 (właściciel).
- **O7** Wytyczne marki Garmin (G1 VIII.a odsyła do nich) — nieprzeczytane; dotyczy pytania 2 z `docs/35` rozdz. 10 (nazwa sprzętu na ekranie parowania). Do czasu przeczytania: wariant A (neutralnie), zgodny z CLAUDE.md i A5 2.3.7/5.2.1.
- **O8** Minimalna wersja iOS SDK — nie podana (brak `platforms` w `Package.swift`, dokumentacja milczy).

## Wpływ na wdrożenie (dla programisty)

1. Info.plist (przez `app.json`/plugin Expo, nie ręcznie): `NSBluetoothAlwaysUsageDescription` z tekstem przez słownik (35 języków — `InfoPlist.strings`), `LSApplicationQueriesSchemes` += `gcm-ciq`, własny schemat URL (unikalny ciąg) do powrotu z GCM, `CFBundleDisplayName` jeśli brak. `NSBluetoothPeripheralUsageDescription` tylko gdy cel wdrożenia < iOS 13 (u nas nie — sprawdzić cel w konfiguracji).
2. `UIBackgroundModes: bluetooth-central` — **nie dodawać domyślnie**; tylko jeśli test O6 pokaże potrzebę (A5 2.5.4 — tło tylko do zamierzonego celu; uzasadnienie w uwagach dla recenzenta).
3. Obsługa powrotu z GCM: `parseDeviceSelectionResponseFromURL:` w obsłudze otwarcia URL (Expo Linking / AppDelegate); brak GCM → własny komunikat przez `t()` zamiast alertu SDK (SDK pozwala nadpisać alert delegatem UI), bez nazwy marki w tekście (CLAUDE.md, A5 2.3.7/5.2.1).
4. Funkcja opcjonalna i za flagą: aplikacja bez GCM i bez zegarka działa w pełni (A5 4.2.3(i)); zgodne z `docs/35` rozdz. 9 („wyłączony flagą”).
5. Manifest prywatności: `scripts/ensure-privacy-manifest.mjs --check` i `tests/privacy-manifest.test.ts` (docs/15:449) nie znajdą manifestu SDK, bo go nie ma — nie dopisywać kategorii za Garmin bez O3; po pierwszej przesyłce sprawdzić e-mail App Store Connect.
6. Etykieta prywatności App Store (`docs/15`): nie zmieniać bez rozstrzygnięcia O2; przy zmianie — aktualizacja polityki prywatności i BRD w tym samym commicie.
7. Aplikacja Connect IQ (Monkey C): polityka prywatności własna (W4) — link przy publikacji; opis w sklepie CIQ ujawnia zależność od aplikacji na iPhonie; bez zbierania lokalizacji; bez logo i marketingu Garmin w aplikacji.
8. Darmowa w sklepie CIQ → bez konta sprzedawcy (100 USD/rok tylko przy sprzedaży).
9. Przed wydaniem: O4 (licencja) i O5 (5.2.1) do rejestru ryzyk w `docs/40` — otwarte ryzyko blokuje wydanie.
