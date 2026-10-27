# Waluta na ekranie zakupu — build 1031 (27.10.2026)

Zgłoszenie: konto testerki w polskim sklepie; arkusz Apple pokazuje 4,99 zł / 19,99 zł / 59,99 zł, a lista planów w aplikacji $0.99 / $6.99 / $14.99.
Ocena po analizie: **NISKIE** (objaw odpowiada znanemu zachowaniu środowiska testowego; w produkcji niepotwierdzone — ryzyko R-WAL w docs/40).

## Ustalenia z kodu (dowód)

1. **Adapter jest natywny, nie sztuczny.** `getStoreAdapter()` wybiera sztuczny sklep tylko przy `EXPO_PUBLIC_STORE_FAKE=1` (`lib/products.ts` `isFakeStoreBuild`); zmienną ustawia wyłącznie `e2e-ios.yml`, `testflight.yml` ją odrzuca (`tests/store-adapter.test.ts`). Gdyby to był sztuczny sklep, na ekranie zakupu byłby panel „Test store” (`app/paywall.tsx`, `fake`), a arkusz Apple by się nie otworzył.
2. **Ceny „$0.99 / $6.99 / $14.99” istnieją w repo tylko jako `FAKE_PRICES` (`lib/store-fake.ts`) i w `store/Trening.storekit`; nigdzie nie ma zapasowej ceny w buildzie.** `store/Trening.storekit` nie jest dołączony do aplikacji ani do projektu Xcode (szukane w `app.json`, `eas.json`, `plugins/`, workflowach: brak odwołań; plik jest używany tylko przez testy i dokumentację).
3. **Aplikacja nie formatuje ceny.** `productFromStore` (`lib/store-native.ts`) przepisuje `displayPrice` bez zmian; `app/paywall.tsx` `priceLine` tylko dokleja okres. Nie ma waluty, ustawień regionalnych ani pamięci podręcznej cen w naszym kodzie.
4. **Biblioteka (expo-iap 5.8.1 → openiap 3.6.0, `node_modules/expo-iap/openiap-versions.json`: apple 3.6.0) także nie formatuje.** `packages/apple/Sources/Helpers/StoreKitTypesBridge.swift` (tag 3.6.0, przeczytany 27.10.2026 z `raw.githubusercontent.com/hyodotdev/openiap/3.6.0/...`; kopia: nie w repo) buduje produkt z `displayPrice: product.displayPrice` (linie 24, 75, 105) oraz `currency: currencyCode(from: product)` = `product.priceFormatStyle.currencyCode` (linie 19, 70, 100, 575–586). To bezpośrednio `Product.displayPrice` i `Product.priceFormatStyle` ze StoreKit 2. `getStorefront()` (`OpenIapModule.swift`, ok. linii 1112–1120) zwraca `Storefront.current.countryCode`.
5. **Wniosek:** string „$6.99” pochodzi ze StoreKit. Błąd w kodzie aplikacji ani w warstwie biblioteki nie jest widoczny. Nie rozstrzygnięto, dlaczego lista produktów dała USD przy sklepie PL w arkuszu zakupu.

## Źródła

- Apple, `Product.displayPrice` (developer.apple.com/documentation/storekit/product/displayprice, przeczytane 27.10.2026): „The storefront that the user’s device is connected to determines the locale.”
- Apple, testowanie zakupów w piaskownicy (developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox, przeczytane 27.10.2026): „Apps that you download from TestFlight always run in the sandbox environment”; zmiana kraju/regionu App Store zmienia storefront w aplikacji; zmiany metadanych w App Store Connect mogą pojawić się w piaskownicy do godziny. Artykuł **nie wyjaśnia** rozbieżności listy produktów ze sklepem PL.
- RevenueCat (revenuecat.com/docs/test-and-launch/sandbox/apple-app-store, przeczytane 27.10.2026): „StoreKit product metadata can return prices in USD even when the purchase itself uses the correct local storefront.”
- Purchasely (docs.purchasely.com/docs/testing, przeczytane 27.10.2026): w sandbox/TestFlight ceny „frequently” w USD niezależnie od storefrontu, arkusz zakupu pokazuje walutę lokalną; „does not happen in production”.
- Dwa niezależne źródła szczebla 4 (dokumentacja usługodawców) opisują dokładnie nasz objaw; Apple tego wprost nie potwierdza — stąd ryzyko otwarte do sprawdzenia w produkcji.

## Decyzja (właściciel, 27.10.2026, wariant A; docs/18)

Bez diagnostyki storefrontu w aplikacji i bez łatki biblioteki. Plik `store/Trening.storekit` (lokalna konfiguracja StoreKit, która mogłaby nadpisywać ceny) nie trafia do buildu: brak odwołań w `app.json`, `eas.json`, `plugins/`, `scripts/ci` i `.github/workflows` (sprawdzone grepem 27.10.2026). Zrobione: potwierdzenie w kodzie i bibliotece, że cena idzie wyłącznie z `displayPrice` (powyżej) oraz strażnik `tests/cena-z-displayprice.test.ts` (brak symboli/kodów walut, `Intl`, `toLocaleString`, pamięci podręcznej cen w kodzie sklepu; produkt ma tylko `displayPrice`; ceny testowe tylko w `lib/store-fake.ts`; sztuczny sklep tylko przy `EXPO_PUBLIC_STORE_FAKE`).

## Zamknięcie ryzyka (R-WAL, docs/40)

Pierwszy dzień po wydaniu: ekran zakupu w wersji z App Store na polskim koncie (bez piaskownicy) pokazuje 4,99 zł / 19,99 zł / 59,99 zł zgodnie z arkuszem Apple. USD przy sklepie PL w produkcji = WYSOKIE; wtedy opcje: (A) formatowanie z `price` + waluty storefrontu (łatka `patch-package` na openiap albo własny moduł) — rozjeżdża się z Apple i dodaje utrzymanie; (B) zgłoszenie błędu w openiap/Apple i ukrycie ceny okresowej do czasu poprawki (zakup w arkuszu Apple pozostaje poprawny). Rekomendacja: dopiero po potwierdzeniu w produkcji.

## Czego nie da się sprawdzić bez telefonu

Ekran zakupu w wersji ze sklepu (produkcja, konto PL bez piaskownicy).
