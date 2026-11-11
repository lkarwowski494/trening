# Raport APL — ryzyko odrzucenia przez Apple i funkcje natywne (audyt 1.1, commit 79117f33)

Data: 11.11.2026. Audytor: APL (soczewka: recenzent App Store, użytkownik płacący).

## Zakres i pokrycie

Przeczytane (kod): app/paywall.tsx; lib/access.ts (konfiguracja, stany, effectiveAccess); lib/entitlement.ts; lib/products.ts; lib/store-adapter.ts; lib/store-native.ts;
components/SubscriptionCard.tsx, ImportProCard.tsx (fragmenty); lib/health.ts; lib/healthRead.ts / healthQuery.ts (grep zapisu/sieci); lib/timer.ts (powiadomienia, Live Activity);
lib/watch/health.ts, lib/watch/link.ts (fragmenty); targets/watch-app/WorkoutController.swift, Info.plist, expo-target.config.js, en.lproj; modules/watch-link/ios/WatchLinkHub.swift (grep);
modules/voice-cue/ios/VoiceCueModule.swift (grep sesji audio); modules/rest-activity/ios + targets/rest-widget (dostępność iOS 16.2); app.json (ios, plugins, Info.plist,
privacy manifest); locales/*.json (35 plików, te same 3 klucze); store/app-store-metadata.json (opis EN, podtytuły, słowa kluczowe PL/EN), store/review-notes.en.txt; app/more/settings.tsx (przełączniki Zdrowia).
Biblioteka expo-iap 5.8.1 (build/index.js requestPurchase iOS, build/types.d.ts kody błędów i pola renewalInfoIOS).
Diff od 1.0: monetyzacja zmieniona minimalnie (paywall.tsx 1 linia, access.ts +3, store-native.ts +4 — pole willAutoRenew, 101-28); app.json: nazwa RepsGoat i teksty Zdrowia.

Wytyczne Apple — odczyt 11.11.2026, https://developer.apple.com/app-store/review/guidelines/ (strona bez daty aktualizacji; przeczytane znaki 0–100000 ze 114428):
- 3.1.1: „you should make sure you have a restore mechanism for any restorable in-app purchases.”
- 3.1.2(a): „If you offer an auto-renewable subscription, you must provide ongoing value to the customer, and the subscription period must last at least seven days and be available across all of the user's devices.”
- 3.1.2(c): „Before asking a customer to subscribe, you should clearly describe what the user will get for the price.”
- 5.1.3(ii): „Apps must not write false or inaccurate data into HealthKit … and may not store personal health information in iCloud.”
- 2.3.7: „Metadata such as app names, subtitles, screenshots, and previews should not include prices, terms, or descriptions that are not specific to the metadata type.”
- 1.4.1: „Apps should remind users to check with a doctor in addition to using the app and before making medical decisions.”
(„27.x HealthKit” nie istnieje w obecnej numeracji — HealthKit = 5.1.3.)

Nie przeczytane: docs/27, docs/28, docs/29, docs/30, docs/monetyzacja.md w całości (tylko fragmenty cytowane w kodzie); pozostałe pliki Swift zegarka (UI, Core poza grepem); strona prywatności na żywo (patrz „Nie sprawdzono”).

## Znaleziska

### APL-01 — Trening cardio prowadzony z zegarkiem trafia do Zdrowia jako „Trening siłowy tradycyjny”
- Waga: ŚREDNIE (niedokładny rodzaj aktywności w HealthKit, nie fałszywe wartości; 5.1.3(ii) mówi o „inaccurate data” — ryzyko odrzucenia niskie, bo recenzent tego nie zobaczy bez zegarka i cardio). Realność: realny (użytkownik z zegarkiem, sesja z samego cardio, np. „Bieg” na bieżni).
- Kroki: włącz „Zapisuj zakończone treningi do Apple Health”, sparowany zegarek z aplikacją; rozpocznij trening z samym ćwiczeniem „Bieg”; zakończ. W Zdrowiu: trening „Traditional Strength Training” (zegarek), a nie „Running”.
- Dowód: telefon wybiera rodzaj z ćwiczeń — `lib/health.ts:21-26` (`workoutActivityType`: same cardio → running/walking/…/mixedCardio). Zegarek zawsze siłowy: `targets/watch-app/WorkoutController.swift:44` `c.activityType = .traditionalStrengthTraining` oraz `modules/watch-link/ios/WatchLinkHub.swift:70` (to samo dla `startWatchApp`). Telefon prosi o sesję zegarka dla każdego treningu bez względu na rodzaj: `lib/watch/link.ts:101` (`kind: 'session', action: 'start', … save`), a gdy zegarek zapisał — telefon nie zapisuje własnej kopii: `lib/watch/health.ts:20` (`saved === true ? { writer: 'watch' }`) → `lib/health.ts` `syncAfterFinish` → `markWatch`.
- Mechanizm (grep `activityType` w targets/ i modules/): 2 trafienia, oba `.traditionalStrengthTraining`; protokół `session start` (lib/watch/protocol.ts) nie niesie rodzaju aktywności. Brak wpisu w docs/21 i docs/35 (grep „cardio”, „activityType”: 0 trafień).
- Naprawa: dodać do polecenia `session start` pole rodzaju (wynik `workoutActivityType(w)` z bieżących ćwiczeń, HKWorkoutActivityType rawValue) i użyć go w `HKWorkoutConfiguration` na zegarku i w `startWatchApp`; albo — prościej — dla treningu z samego cardio nie prosić zegarka o zapis (`save: false`), zapisuje telefon. Zaktualizować NSHealthUpdateUsageDescription zegarka („trening siłowy”) w 35 językach, jeśli zegarek zapisze też cardio.
- Test akceptacyjny: Jest — `lib/watch/link` wysyła `session start` z rodzajem = `workoutActivityType` dla treningu „Bieg” (37) i „Przysiad” (50); WatchCoreTests — konfiguracja sesji bierze rodzaj z polecenia.

### APL-02 — Wybrany „nieistniejący” chip miejsca w edycji szablonu jest przyciskiem bez działania
- Waga: NISKIE. Realność: brzegowy (szablon przypisany do miejsca, które potem usunięto).
- Dowód: `app/template/[id].tsx:115` `<Chip label={locationLabel(tpl.locationId)} on onPress={() => {}} />` — VoiceOver czyta przycisk, stuknięcie nic nie robi (wzorce docs/32: element tego samego typu działa tak samo). Inne trafienia wzorca `onPress={() => {}}` w app/ i components/: 0.
- Naprawa: element nieaktywny (`disabled`, rola tekstu) albo stuknięcie = „przypisz do głównego”. Test: strażnik interakcji (brak `onPress={() => {}}` w app/components).

KRYTYCZNE: 0. WYSOKIE: 0. ŚREDNIE: 1. NISKIE: 1.

## Do sprawdzenia (pewność ≤ 80%)

- D-1 Ask to Buy (zakup czeka na zgodę rodzica): `lib/store-native.ts` zwraca `pending` tylko przy wyjątku z kodem `pending`/`deferred-payment`. expo-iap 5.8.1 (`build/index.js:718-731`) przy braku zakupu zwraca `[]`/`null` bez wyjątku — wtedy aplikacja zwraca `success` i nie pokazuje „Czeka na zgodę organizatora rodziny.” (`app/paywall.tsx` buy). Zależy od natywnego openiap (pod CocoaPods, nieobecny w node_modules): czy `.pending` rzuca błąd, czy zwraca nil. Skutek najwyżej mylący brak komunikatu (dostęp się nie pojawia, nic nie jest udawane) — NISKIE, jeśli potwierdzone. Krok: przeczytać `OpenIapModule.requestPurchase` w źródle openiap-apple dla wersji z Podfile.lock albo test w piaskownicy z kontem dziecka.
- D-2 Ten sam rodzaj „siłowy” przy sesjach mieszanych z masą ciała (telefon: `functionalStrength` dla samych ćwiczeń z masą ciała, zegarek: `traditionalStrength`) — wariant APL-01, kosmetyczny.

## Co działa dobrze

- Ceny wyłącznie z App Store (`displayPrice`, `lib/store-native.ts` productFromStore; `lib/products.ts:2-3` bez cen); okres z `subscriptionPeriodUnitIOS`.
- Ekran zakupu (`app/paywall.tsx`): „Przywróć zakupy” zawsze widoczne (także offline, z komunikatem błędu), „Zrealizuj kod”, link „Warunki korzystania” (standardowa EULA Apple, `lib/products.ts` TERMS_URL) i „Prywatność”; tekst odnowienia automatycznego pod przyciskiem subskrypcji; opis tego, co się dostaje (3.1.2(c)); stany ładowania / brak sieci / pusty sklep z „Spróbuj ponownie”; ostrzeżenie o podwójnej płatności przy dożywotnim; „Zarządzaj subskrypcją” arkuszem systemowym. Opis App Store zawiera linki do EULA i prywatności (store/app-store-metadata.json, wszystkie lokalizacje PL/EN sprawdzone).
- Kod nie udaje zakupu: sztuczny sklep tylko przy `EXPO_PUBLIC_STORE_FAKE=1` (`lib/store-adapter.ts:56`), ustawione wyłącznie w `e2e-ios.yml:100`; `testflight.yml:104` przerywa build, gdy zmienna jest ustawiona. Błąd odczytu uprawnień = `unknown` (nigdy `free`), karencja offline 7 dni.
- Za zaporą tylko start treningu na żywo ponad limit dni; historia, kopia, eksport, import i trening wstecz zawsze dostępne — zgodnie z tekstami paywalla i opisu.
- Monetyzacja niemal bez zmian od zatwierdzonej 1.0 (diff 8 linii) — niskie ryzyko nowego odrzucenia 3.1.x.
- HealthKit: telefon prosi o zapis tylko `HKWorkoutType` (`lib/health.ts:38`), odczyt tylko 4 typów (`lib/healthRead.ts:11-15`) — zgodne z NSHealthShare/UpdateUsageDescription; odmowa → komunikat i przełącznik zostaje wyłączony (`app/more/settings.tsx:67`), przy przywróceniu kopii bez zgody synchronizacja wyłączana (`lib/backup.ts:172-174`). Dane z odczytu nie są zapisywane (grep save/flush/runAsync w healthRead/healthQuery/healthUse: 0) i brak jakiegokolwiek `fetch`/XHR w lib/app/components/modules. Zegarek zapisuje do Zdrowia tylko gdy włączony zapis na telefonie (`lib/watch/link.ts:100-106`, `discardWorkout` przy save=false).
- Teksty Info.plist: 35 plików `locales/*.json` z tymi samymi 3 kluczami (CFBundleDisplayName, NSHealthShare…, NSHealthUpdate…); zegarek i widżet mają 35 katalogów `.lproj`; zegarek ma własne opisy Zdrowia.
- Bez sparowanego zegarka: WatchLinkHub sprawdza `isPaired`/`isWatchAppInstalled` przed każdym wysłaniem (`WatchLinkHub.swift:45,62,68`), aplikacja działa bez zegarka. Zegarek bez treningu: „Start a workout on your phone”.
- Live Activity i widżet za `@available(iOS 16.2)`; mowa bez trybu audio w tle (`.playback` + `duckOthers`, tylko na wierzchu); brak uprawnienia push (`plugins/withoutPushEntitlement.js`), powiadomienia lokalne, Time Sensitive z uprawnieniem w app.json.
- Porady medyczne: `components/MedicalNote.tsx` (odesłanie do lekarza/fizjoterapeuty) na karcie ćwiczenia i w generatorze; to samo zdanie w opisie sklepu. Brak „wkrótce/coming soon” w UI (grep app/ components/: 0); brak nazw obcych marek w słowniku EN (grep listy marek: 0); podtytuł/słowa kluczowe bez cen (strażnik tests/store-metadata.test.ts).
- Twierdzenie opisu „animated drawings for over 100 exercises” prawdziwe z ZAMKNIĘTĄ bramką 4 (test sklepu otwiera bramkę mockiem, więc sprawdziłem osobno): sonda `testy-APL/apl-sonda-rysunki.test.ts` → `{"lib":708,"animated":509,"v2shown":528, squat/bench_press/hinge: ready}`; `lib/figures/data.json` ma w `v2` 40 rodzin, legenda mięśni przy 528/528.
- Natywne: ostatni `ios-unsigned.yml` zielony (43027324931, aeab7fa0 — przodek 79117f33; `git diff aeab7fa0 79117f33 -- targets modules app.json plugins package.json` pusty). `e2e-ios.yml` zielony 11.11 na main 2d975814 (nie przodek 79117f33) i 06.11 na integracji 1f339f4c (nie przodek) — E2E dla dokładnie badanego commitu brak (W-13/W-15 w docs/49).

## Nie sprawdzono

- Natywny build, symulator, telefon: zachowanie arkusza zakupu, Ask to Buy (D-1), Live Activity na ekranie blokady, zegarek (krok: lista „tylko telefon” W-20).
- Strony apps4brew.com na żywo (privacy/support/espresso) — host zablokowany w sieci tej sesji (curl: CONNECT 403; WebFetch: ENOTFOUND); źródło `site/privacy.html` wymienia RepsGoat, Apple Health, Apple Watch. Krok: `node scripts/check-urls.mjs` / W-18.
- Stan produktów IAP i wersji 1.1.0 w App Store Connect (W-21) — poza repo.
- Wersja w app.json nadal 1.0.1 — już ujęte jako W-08 w docs/49 (nie znalezisko).
- Pozostała część wytycznych (znaki 100000–114428 strony) nie przeczytana.
