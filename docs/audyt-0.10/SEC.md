# Audyt 0.10.0 — bezpieczeństwo, App Store, wydajność (SEC)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Commit d2a1e85 (po korekcie koordynatora; wcześniejszy eksport f435c8c porzuciłem, wszystko sprawdziłem ponownie na d2a1e85). Nie zmieniałem stanu gita i nic nie commitowałem. Zostawiłem tylko pliki robocze `tests/zz-audit-sec-perf{,2,3}.test.tsx`.

**SEC – co sprawdziłem**
- **Cała historia (`git log --all`):** 280 commitów, 2572 bloby, 509 ścieżek, w tym 8 plików usuniętych. Bloby i wiadomości commitów przeskanowałem skryptem pod 20 wzorców: klucze prywatne, PEM i base64 DER, tokeny GH/AWS/Google/Slack, JWT, przypisania EXPO_TOKEN, AuthKey_*, Issuer ID, hasła, ProvisionedDevices, UDID w obu formatach (40-hex odfiltrowane względem SHA obiektów gita), e-maile, Team ID, telefony.
- **Metadane commitów:** autorzy i committerzy.
- **Pliki binarne:** 6 PNG, w tym chunki tEXt/iTXt/eXIf.
- **Workflowy (8):** uprawnienia, wyzwalacze, wyrażenia `${{ }}`, przypięcie akcji, artefakty i logi.
- **Publiczne dane z API GitHuba:**
  - 29 artefaktów, jeden xcodebuild.log pobrałem i przejrzałem.
  - Pełny log przebiegu iphone-local 37337769218 przeskanowany pod kątem UDID i e-maili.
  - Ustawienia repozytorium.
- **Zależności:**
  - `npm audit` w obu wariantach;
  - licencje 750+ pakietów produkcyjnych;
  - fonty (tabela `name` w TTF);
  - pochodzenie katalogu ćwiczeń i ikon.
- **Prywatność w aplikacji:** grep wywołań sieciowych; HealthKit, powiadomienia, backup, eksport i import.

**NAT – co sprawdziłem**
- `npm run verify:native` w worktree (przez jslot): **„natywne: OK”** (POTWIERDZONE).
- Pełny `expo prebuild` w kopii roboczej i przegląd wyniku: Info.plist, entitlements, 26× InfoPlist.strings, pbxproj, AppIcon, Podfile.
- Manifest prywatności:
  - analiza 34 podów (Expo autolinking i RN) pod kątem API „required reason”;
  - logika agregacji manifestu w RN (`privacy_manifest_utils.rb`).
- Pozostałości po wycofaniu widżetu i przycisków (commit 89bd71e).
- Numery wersji i buildów: historia przebiegów `testflight.yml` z API.

**PERF – co zmierzyłem**
- Istniejący zestaw `npm run perf` przy `PERF_N=2000`.
- Trzy własne testy na syntetycznym stanie:
  - 2000 treningów w 4 lata, po 7 ćwiczeń × 5 serii;
  - 60 szablonów, 300 własnych ćwiczeń (razem 1154);
  - plan tygodnia i 5 planów zapisanych, zmiany planu, 40 tygodni deload.
- Mierzone ok. 35 funkcji z `lib/`, 6 ekranów i koszt wpisania znaku w zależności od tego, które zakładki są zamontowane.

**Zastrzeżenie do liczb PERF:** to czasy z Node/Jest. Według docs/09 F4 Jest spowalnia dostęp do zmiennych globalnych ok. 30×. Liczby służą do porównań i proporcji, nie są czasem na telefonie.

---

## Znaleziska

### SEC-01 — Dane osobowe właściciela (waga ciała, Body Battery, daty treningów) zostały w historii publicznego repozytorium
- **Waga:** KRYTYCZNA według skali audytu (dane osobowe/zdrowotne w publicznym repo). Właściciel świadomie przyjął to ryzyko 06.10.
- **Dowód:** POTWIERDZONE.
  - Blob `1bcaeb9501…` pliku `tests/fixtures/web03-backup.json` jest w commitach od 09a4c9a (02.10) do e55986a^.
  - Zawiera prawdziwy wpis poranny: pola `weight` i `bb`, data 02.10.2026, a także znaczniki czasu dwóch treningów.
  - Commit e55986a zamienił dane na fikcyjne. docs/15 zapisuje decyzję: „stare wartości zostają w historii git (przepisanie historii — nie)”.
  - Blob jest osiągalny z każdej gałęzi, także z `main`.
  - API: `forks_count: 0`, `stargazers: 0`.
- **Skutek:** każdy może odczytać wartości z publicznej historii. To jedyne realne dane osobowe w całej historii (zob. „w porządku”).
- **Propozycja (decyzja produktowa):**
  - **A — zostawić** (stan obecny). Dane są o niskiej wrażliwości (jedna waga, jedna wartość BB, dwie daty), zero kosztu.
  - **B — przepisać historię teraz** (`git filter-repo` na ten jeden blob), force-push wszystkich gałęzi, poprosić GitHub Support o usunięcie widoków z pamięci podręcznej. Zero forków oznacza, że teraz jest to najtańsze. Później może być niemożliwe. Koszt: wszystkie worktree i sesje agentów trzeba założyć od nowa.
  - **Rekomendacja:** A, zgodnie z decyzją z 06.10. Właściciel powinien jednak wiedzieć, że B jest wykonalne tylko dopóki repo nie ma forków.

### PERF-01 — Zakładka „Ćwiczenia” renderuje bez wirtualizacji wszystkie ~854+ ćwiczeń i przelicza się przy każdym wpisanym znaku
- **Waga:** WYSOKA. Dotyczy każdego użytkownika, także świeżej instalacji.
- **Dowód:** POTWIERDZONE (`tests/zz-audit-sec-perf3.test.tsx`, perf2) oraz Z KODU.
  - `app/(tabs)/exercises.tsx:15–26`:
    - `ScrollView` z `SwipeRow` (PanResponder i Animated.Value na każdy wiersz) dla każdego widocznego ćwiczenia;
    - sortowanie z `localeCompare(…, locale())` przy każdym renderze;
    - w każdym wierszu od razu `exerciseInHistory(e.id)` (`lib/store.ts:1458`, przegląd całej historii), czyli koszt O(ćwiczenia × treningi × bloki).
  - Zakładka subskrybuje `useHistTick`, a `save(e)` i `save(tpl)` podbijają `histRev` (store.ts:412–418). Ekrany edycji zapisują przy każdym znaku: `exercise/[id].tsx:21,35,36` (nazwa, tempo, notatki do 2000 znaków) i `template/[id].tsx:45`.

| Pomiar (Jest) | N=0 (854 ćw.) | N=2000 |
|---|---|---|
| Render zakładki | 843 ms | 1010 ms (854 ćw.) / 2681 ms (1154 ćw.) |
| `exerciseInHistory` w 1 renderze | 0 ms | 160 ms |
| Znak w notatce ćwiczenia, zakładka niezamontowana | **25 ms** | — |
| Znak w notatce ćwiczenia, zakładka pod spodem | **618 ms** | 843 ms |
| Znak w nazwie szablonu, zamontowane Trening+Szablony+Kalendarz → +Ćwiczenia | — | 297 → **1553 ms** |

- **Skutek:**
  - Naturalna ścieżka „Ćwiczenia → ćwiczenie → notatki” przelicza ukrytą listę 854+ wierszy przy każdym znaku: w Jest 24× wolniej. Na telefonie to odczuwalne opóźnienie pisania.
  - Otwarcie zakładki tworzy setki PanResponderów.
  - Picker już przeszedł na FlatList (komentarz `app/picker.tsx:73`); ta zakładka nie.
- **Propozycja:**
  1. `FlatList` lub `SectionList` (sekcje według grupy), jak w pickerze.
  2. Komunikat o usunięciu (`exerciseInHistory`) liczyć dopiero w `onDelete`/Alert, nie przy renderze. Alternatywnie Set ćwiczeń z historią z `memoHist`, wzorem `withHistory` w stats.ts.
  3. Jeden `Intl.Collator` zamiast `localeCompare(locale)` w komparatorze, także w `more/progress.tsx`.

### NAT-01 — Brak strony polityki prywatności, a jest wymagana przed wysyłką do App Store (aplikacja z HealthKit)
- **Waga:** WYSOKA. Blokuje wydanie w sklepie. To znany, otwarty punkt.
- **Dowód:**
  - Z KODU/doc: docs/15:122, pkt 6 „Strona polityki prywatności i wsparcia na GitHub Pages” jest otwarty; „Data Not Collected — do potwierdzenia” (docs/15:117).
  - POTWIERDZONE: API repo `has_pages: false`. W `docs/` nie ma strony prywatności.
- **Skutek:** wytyczne App Store wymagają linku do polityki prywatności dla każdej aplikacji, a szczególnie dla aplikacji z HealthKit. Bez niego zgłoszenie do recenzji nie przejdzie.
- **Propozycja:**
  - Strona `docs/privacy.md` (PL/EN) przez GitHub Pages, koszt 0 zł. Treść zgodna ze stanem faktycznym, który potwierdziłem w kodzie:
    - brak jakichkolwiek wywołań sieciowych;
    - HealthKit tylko zapis (`requestAuthorization([], [WORKOUT_TYPE])`, `lib/health.ts:28`);
    - powiadomienia wyłącznie lokalne;
    - kopie zapasowe lokalnie (Pliki/Udostępnij).
  - Etykieta App Privacy: „Data Not Collected” jest spójna z kodem.

### SEC-02 — `testflight.yml`: Key ID i Issuer ID klucza ASC trafią do publicznego artefaktu, gdy przebieg się nie uda
- **Waga:** ŚREDNIA.
- **Dowód:**
  - Z KODU: `.github/workflows/testflight.yml:66–71` i `91–93` przekazują `-authenticationKeyID "$KID" -authenticationKeyIssuerID "$ISS"` jako argumenty `xcodebuild … 2>&1 | tee xcodebuild.log` / `export.log`. Przy `failure()` oba logi idą do artefaktu (`:99–106`), a w artefaktach GitHub nie maskuje sekretów.
  - POTWIERDZONE: xcodebuild zaczyna log od bloku „Command line invocation:” z pełną linią poleceń. Sprawdziłem na publicznym artefakcie `xcodebuild-log-sim` (id 11553361036) z e2e-ios.
  - Nie potwierdziłem, czy xcodebuild maskuje wartości tych dwóch flag. Bez Maca nie da się tego sprawdzić. Przykłady wywołań z tymi flagami: [Apple Developer Forums 764554](https://developer.apple.com/forums/thread/764554), [800352](https://developer.apple.com/forums/thread/800352).
  - `tests/public-repo.test.ts:66` sprawdza tylko brak `"$ASC_KEY_ID"` w wywołaniu, więc daje fałszywe poczucie ochrony (komentarz w teście: „logi w artefakcie bez identyfikatorów”).
  - Na razie nic nie wyciekło: 2 przebiegi, oba `success` (API).
- **Skutek:** wyciekają identyfikatory klucza, nie sam klucz .p8. Jest to jednak sprzeczne z intencją przeglądu CI z 06.10 i ułatwia nadużycie, gdyby kiedyś wyciekł plik .p8.
- **Propozycja:**
  - Logi do artefaktu przepuszczać przez `sed "s/$KID/<KID>/g; s/$ISS/<ISS>/g"` albo pomijać pierwsze linie z wywołaniem.
  - Alternatywa: uploadować tylko wynik `xcbeautify`.
  - Test powinien sprawdzać filtr, nie nazwę zmiennej.

### SEC-03 — `iphone-local.yml` / `iphone-eas.yml`: sekrety dostępne dla `npm ci`, testów i nieprzypiętych zależności eas-cli
- **Waga:** ŚREDNIA.
- **Dowód:** Z KODU oraz POTWIERDZONE dla eas-cli.
  - `iphone-local.yml:26`: `EXPO_TOKEN` jest zmienną środowiskową całego workflow, więc widzą go `npm ci` (:47) i cały Jest (:49).
  - `iphone-eas.yml:101–106`: EXPO_TOKEN i ASC_* w env całego workflow. Plik `.p8` jest zapisywany do workspace (:131) **przed** `npm ci` (:133) i testami (:136).
  - `npx --yes eas-cli@24.8.0` i `npm i eas-cli@24.8.0` (:142): tarball eas-cli 24.8.0 nie ma `npm-shrinkwrap`, ma 92 zależności z zakresami `^`. Zależności przechodnie rozwiązują się na nowo przy każdym przebiegu, poza lockfile.
  - `testflight.yml` robi to dobrze: sekrety przypisane do kroku, klucz zapisany po `npm ci`, testach, prebuild i pod install.
- **Skutek:** przejęta zależność (npm worm w stylu 2025) w drzewie eas-cli lub w kodzie testów odczyta EXPO_TOKEN albo klucz ASC.
- **Propozycja (decyzja właściciela):**
  - **A — usunąć oba workflowy EAS** i sekrety EXPO_TOKEN/ASC_API_KEY_P8, skoro instalacja idzie przez TestFlight (docs/15). Duplikat klucza .p8 w dwóch sekretach też znika.
  - **B — utwardzić:** env na poziomie kroków; `npm ci` przed zapisem klucza; eas-cli z własnego lockfile (np. `tools/eas/package-lock.json`) zamiast `npx --yes`.
  - **Rekomendacja:** A, jeśli EAS nie wraca po 01.11; inaczej B.

### SEC-04 — Sekrety repozytorium są dostępne dla workflow z każdej wypchniętej gałęzi; brak środowisk, ochrony `main` i secret scanning
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE przez API:
  - `security_and_analysis`: secret_scanning i push_protection mają status `disabled`;
  - `branches/main/protection`: „Branch not protected”.
  - Z KODU: `tests.yml` uruchamia się przy `push` na dowolnej gałęzi. Workflowy używają sekretów na poziomie repo (`secrets.ASC_KEY_*`, `EXPO_TOKEN`), bez `environment:`.
- **Skutek:** zmieniony plik workflow wypchnięty na dowolną gałąź uruchomi się z dostępem do wszystkich sekretów. Gałęzie wypychają też sesje agentów. Push protection, który blokowałby commit z kluczem, jest wyłączony, choć dla repo publicznego jest darmowy.
- **Propozycja:**
  - Włączyć Secret scanning i Push protection (Settings → Code security), 0 zł.
  - Przenieść ASC_*/EXPO_TOKEN do Environment „release” z wymaganym recenzentem (właściciel) i gałęzią wdrożeniową `main`, a w `testflight.yml` dodać `environment: release`.
  - Opcjonalnie ochrona `main`.

### PERF-02 — Każda zmiana poza treningiem unieważnia wszystkie cache historii i przelicza ukryte zakładki przy każdym znaku
- **Waga:** ŚREDNIA.
- **Dowód:** Z KODU i POTWIERDZONE.
  - `lib/store.ts:412–418`: `save(x)` z czymkolwiek poza `active` wykonuje `bump(true)`, czyli `histRev++`. Unieważnia to `finishedCache`, `exIndex`, `allSessions`, `recordsPrefix` i `prev*`, mimo że historia się nie zmieniła (zmienia się np. nazwa szablonu albo ustawienie).
  - Subskrybenci `useTick`/`useHistTick` w ukrytych zakładkach liczą się od nowa: Home/dashboard, Kalendarz, Ćwiczenia, DeloadHint, PlanReminderSync.
- **Pomiary (N=2000, Jest):**
  - znak w nazwie szablonu: 205 ms przy samej zakładce Trening, 258 ms z Szablonami, 297 ms z Kalendarzem;
  - z dodatkowym zapisem po 300 ms (stringify plus SQLite) średnio 1985 ms na znak w scenariuszu ze wszystkimi zakładkami;
  - dla porównania znak w serii w trakcie treningu (bez `histRev`): 47–73 ms niezależnie od zakładek.
- **Propozycja:**
  - Rozdzielić licznik: `histRev` tylko dla zmian w `workouts`/`exercises` (metryka, mięśnie, tryb obciążenia), osobny `cfgRev` dla szablonów i ustawień.
  - Pola tekstowe zapisywać w `onEndEditing` (edycja na szkicu), nie przy każdym znaku.

### PERF-03 — Cały stan zapisywany jako jeden blob JSON: koszt startu, każdego zapisu, kopii, CSV i importu rośnie z historią
- **Waga:** ŚREDNIA.
- **Dowód:** POTWIERDZONE (perf, N=2000).

| Operacja | Czas |
|---|---|
| Rozmiar `state` | 17,4 MB (6×4 serie w `npm run perf`: 12,2 MB) |
| `JSON.stringify` | 138 ms |
| Zapis pełny po zmianie ustawienia | 112 ms |
| Start: `JSON.parse` | 94 ms |
| Start: parse + `migrate` | **471 ms** (`npm run perf`: 292 ms) |
| `buildBackup` + stringify | 118 ms (po każdym treningu, `autoBackup`) |
| `buildCsv` | 467 ms |
| Import (`parseBackup`) | 444 ms |

  - `store.ts:375–389`: każda zmiana poza treningiem zapisuje cały stan (17 MB) do jednego wiersza SQLite.
- **Propozycja:**
  - **A (teraz):**
    - szybka ścieżka w `migrate`, gdy `schemaVersion` jest bieżący i zapis pochodzi z tej wersji;
    - osobne klucze kv dla `settings`/`templates`/`plans`, żeby zmiana ustawienia nie przepisywała historii;
    - pomiar na telefonie przy 1000 treningów.
  - **B (później):** treningi jako wiersze SQLite (wiersz na trening). To zmiana schematu, więc zgodnie z CLAUDE.md nie w tym samym wydaniu co SDK.
  - **Rekomendacja:** A.

### NAT-02 — „Co nowego” pokazuje testerom „Wersja testowa 1004”, a z `testflight.yml` powstały tylko buildy 1001 i 1002
- **Waga:** NISKA (nieprawdziwa informacja w UI).
- **Dowód:**
  - `lib/whatsnew.ts:25` ma wpis `build: 1004`; `components/WhatsNew.tsx:12` wyświetla „Wersja testowa {n}”.
  - API: `testflight.yml` ma tylko przebiegi #1 (5a8bcc5) i #2 (f435c8c). Formuła z `testflight.yml:46` daje 1000 + numer przebiegu, czyli 1001 i 1002.
  - docs/18:149 twierdzi, że na telefonie jest build 1004 z f435c8c, a docs/18:85 mówi, że do grupy „Koledzy” poszedł 1002.
  - Następny przebieg da build **1003**, czyli mniej niż 1004 pokazywane w aplikacji.
- **Propozycja:** sprawdzić numer w App Store Connect i poprawić `build` w whatsnew oraz docs/18. Dodać test, że `build` ≤ 1000 + liczba przebiegów (albo wpisywać numer po przebiegu).

### NAT-03 — Numer buildu zależy od licznika przebiegów konkretnego pliku workflow
- **Waga:** NISKA.
- **Dowód:** Z KODU, `testflight.yml:46`. Licznik `run_number` jest liczony osobno dla każdego pliku workflow. Zmiana nazwy albo ponowne utworzenie `testflight.yml` zaczyna od 1, czyli znowu 1001. App Store Connect odrzuci taki upload. Równolegle działa niezależny licznik EAS (`eas.json`: `appVersionSource: remote`, `autoIncrement`).
- **Propozycja:**
  - **A:** stała baza w zmiennej repo (np. `BUILD_BASE`) i komentarz w workflow.
  - **B:** `manageAppVersionAndBuildNumber: true` w ExportOptions, wtedy Xcode bierze kolejny numer z App Store Connect.
  - **Rekomendacja:** A (prościej, zgodne z testem `public-repo`).

### NAT-04 — Manifest prywatności powstaje dopiero przy `pod install` i nic go nie sprawdza
- **Waga:** NISKA.
- **Dowód:** POTWIERDZONE (prebuild i analiza podów).
  - Prebuild nie tworzy `PrivacyInfo.xcprivacy`: szablon SDK 57 go nie ma, `ios.privacyManifests` nie jest ustawione.
  - Plik tworzy RN przy `pod install` (`privacy_manifest_utils.rb`, agregacja domyślnie włączona). Kategorie z rdzenia: FileTimestamp C617.1, UserDefaults CA92.1, SystemBootTime 35F9.1. Do tego dochodzą manifesty podów: ExpoFileSystem (DiskSpace, FileTimestamp), EXConstants, ExpoLocalization i ExpoNotifications (UserDefaults), EXApplication (FileTimestamp).
  - Pody bez własnego manifestu, które używają tych API: `ExtensionStorage` (UserDefaults, z @bacons/apple-targets), `ExpoSharing` (UserDefaults), `ExpoDocumentPicker` (FileTimestamp). Pokrywają je kategorie zagregowane.
  - Kod widżetu i RestActivity nie używa API „required reason”.
  - App Store Connect przyjął 2 buildy, więc dziś jest OK.
- **Propozycja:** w `testflight.yml` po `pod install` sprawdzić, że `ios/Trening/PrivacyInfo.xcprivacy` istnieje i ma te 4 kategorie. Zapisać mechanizm w docs/15.

### NAT-05 — Zakres `verify:native`
- **Waga:** NISKA (luka w pokryciu).
- **Co sprawdza** (Z KODU `scripts/verify-native.mjs`, POTWIERDZONE „natywne: OK” w ok. 7 s):
  - prebuild i entitlements (tylko HealthKit, bez aps);
  - InfoPlist.strings tylko dla pl i en;
  - brak UIBackgroundModes;
  - NSSupportsLiveActivities, UIFileSharingEnabled, LSSupportsOpeningDocumentsInPlace;
  - identyczne `RestTimerAttributes.swift` w module i widżecie;
  - cel RestWidget w pbxproj, kolor akcentu, autolinking RestActivity.
- **Czego nie sprawdza:**
  - pozostałych 24 języków InfoPlist (osobno robią to testy i18n);
  - manifestu prywatności (NAT-04);
  - zgodności MARKETING_VERSION aplikacji i widżetu (dziś obie 0.10.0);
  - deployment target (aplikacja 16.4, widżet 16.2) i TARGETED_DEVICE_FAMILY (aplikacja 1, widżet „1,2”);
  - AppIcon (1024, dark, tinted), braku zbędnych kluczy prywatności, `ITSAppUsesNonExemptEncryption` (to sprawdza test);
  - kompilacji Swift (niemożliwe na Linuksie).
- **Propozycja:** dopisać tanie sprawdzenia: wersje i targety w pbxproj, AppIcon Contents.json, lista kluczy `NS*UsageDescription` dokładnie równa {HealthShare, HealthUpdate}.

### NAT-06 — Odmowa zgody na powiadomienia nie jest widoczna w Ustawieniach
- **Waga:** NISKA.
- **Dowód:** Z KODU.
  - Prośba o zgodę pada przy pierwszym treningu (`ActiveWorkout.tsx:40`), czyli w kontekście, i to jest dobre.
  - Przełącznik „Przypomnienie o treningu z planu” jest domyślnie włączony (`planReminder !== false`, `settings.tsx:43`) niezależnie od zgody iOS.
  - Przycisk „Sprawdź zgodę” pokazuje Alert bez przycisku do Ustawień iOS (`settings.tsx:44`).
- **Propozycja:** odczytać `getPermissionsAsync()` przy wejściu w Ustawienia i przy odmowie pokazać opis plus `Linking.openSettings()`.

### NAT-07 — Drobne sprawy konfiguracji natywnej
- **Waga:** NISKA.
- **Dowód:** Z KODU / prebuild.
  - **Opis HealthKit:** `NSHealthShareUsageDescription` brzmi „…nie odczytuje danych zdrowotnych — iOS wymaga tego opisu…” (app.json). Aplikacja nie prosi o odczyt, więc tekst się nie pokaże. W wydaniu „Health” (odczyt kcal, docs/18) trzeba go napisać od nowa w 26 językach.
  - **Ekran startowy w trybie ciemnym:** `expo-splash-screen` ma tylko tło `#F4F3EF`, bez wariantu `dark`, przy `userInterfaceStyle: automatic`.
  - **Martwy moduł natywny:** pod `ExtensionStorage` (@bacons/apple-targets, UserDefaults z App Group) jest linkowany do aplikacji, choć po wycofaniu widżetu JS go nie używa. Można go wykluczyć przez `expo.autolinking.exclude`.
  - **Przestarzała biblioteka HealthKit:** `@kingstinct/react-native-healthkit` 8.7.2 z 06.2025; najnowsza to 16.1.0. Gałąź 8.x działa na RN 0.86 przez warstwę zgodności i jest zaplanowana do wymiany w wydaniu „Health”.
- **Pozostałości po wycofaniu z 07.10:** brak. Nie ma SummaryWidget, RestIntents, App Group, `lib/widget.ts` ani tekstów i18n; bundle widżetu zawiera tylko `RestLiveActivity`. `NSSupportsLiveActivities` i `appExtensions: RestWidget` zostają celowo, bo Live Activity przerwy nadal działa.

### SEC-05 — Kod spoza repo w CI bez przypięcia wersji
- **Waga:** NISKA.
- **Dowód:** Z KODU.
  - `e2e-ios.yml:113`: `curl -fsSL https://get.maestro.mobile.dev | bash` bez wersji i sumy kontrolnej. Job ma tylko token do odczytu, ale wpływa na wiarygodność E2E i artefaktów.
  - Akcje przypięte do tagów głównych (`checkout@v5`, `setup-node@v5`, `setup-java@v4`, `upload/download-artifact@v4`), nie do SHA. Wszystkie są od GitHuba, akcji z zewnątrz nie ma.
  - `checkout` z domyślnym `persist-credentials`.
- **Propozycja:** `MAESTRO_VERSION=x.y.z` w instalatorze (albo pobranie wydania i sprawdzenie sumy), akcje przypięte do SHA, `persist-credentials: false`.

### SEC-06 — `npm audit`: 0 krytycznych; jeden problem w kodzie wykonywanym w aplikacji, przez nieużywaną zależność bezpośrednią
- **Waga:** NISKA.
- **Dowód:** POTWIERDZONE.
  - `--omit=dev`: 67 (19 moderate, 48 high, 0 critical). Pełny: 80 (5 low, 22 moderate, 53 high).
  - Przyczyny źródłowe to narzędzia buildu i testów: braces/micromatch (metro, jest), @xmldom/xmldom (@expo/plist), node-forge (@expo/code-signing-certificates), uuid (xcode), sprintf-js/js-yaml (jest), tmp/ajv/@babel/core (stryker).
  - W runtime aplikacji jest tylko **decode-uri-component 0.2.2** (DoS przy zniekształconym `%`) przez `query-string` 7.1.3 (expo-router).
  - `query-string` jest w `dependencies`, ale kod go nie importuje (grep: 0 trafień; dodane w 09a4c9a).
  - Większość poprawek wymaga zmian major albo SDK 58 (`fixAvailable: false` lub major).
- **Propozycja:** usunąć `query-string` z `package.json` (zostanie jako zależność przechodnia expo-router). Nie wymuszać `npm audit fix --force`. Sprawdzić znowu przy SDK 58. Zależności z install scripts: tylko `fsevents` (dev).

### SEC-07 — Luki w `.gitignore`
- **Waga:** NISKA (zapobiegawczo).
- **Dowód:** POTWIERDZONE (`git check-ignore`). Nieignorowane są:
  - `credentials.json` (lokalne poświadczenia EAS z hasłem .p12);
  - `*.pem`, `*.key`, `*.jks`/`*.keystore`, `*.xcarchive/`;
  - `upload.json`, `build.json`, `build.err`, `e2e-out/`, `Trening-sim.zip`;
  - `.claude/` (w głównym checkoucie chroni tylko lokalny `.git/info/exclude`, i to tylko `.claude/worktrees/`).
- **Propozycja:** dopisać te wzorce i rozszerzyć listę w `tests/public-repo.test.ts:73`.

### SEC-08 — Brak ekranu „Licencje” w aplikacji
- **Waga:** NISKA (nie blokuje App Store).
- **Dowód:** POTWIERDZONE.
  - Fonty IBM Plex (OFL-1.1): notka i licencja są w metadanych TTF (`name` ID 0, 13 i 14), co OFL dopuszcza.
  - W pakiecie aplikacji jest kod 605 pakietów MIT (React, RN, Expo); licencja MIT wymaga dołączenia notki.
  - Brak copyleftu w runtime: MPL tylko lightningcss (build web), node-forge podwójnie licencjonowany (build).
- **Propozycja:** wygenerować listę licencji skryptem z `package-lock` do pliku JSON (0 zł) i pokazać ją w „Więcej → Licencje”.

### SEC-09 — Pozostałości plików
- **Waga:** NISKA.
- **Dowód:**
  - Z KODU: eksporty `trening-backup-*.json`, `trening-*.csv`, `trening-odzysk-*.json` (`lib/backup.ts:20,115,157`) i kopia z DocumentPicker (`copyToCacheDirectory: true`) zostają w Caches i nie są usuwane. Przy N=2000 każda kopia ma ok. 17 MB.
  - POTWIERDZONE (API): 2 artefakty `Trening-unsigned-ipa` z 03.10 (gałąź upgrade/sdk-57, sprzed `retention-days: 1`) wygasają dopiero 2027-01-01. Nie zawierają sekretów: binarka niepodpisana, kod i tak publiczny.
- **Propozycja:** usuwać plik po zamknięciu arkusza udostępniania. Stare artefakty można skasować ręcznie.

### PERF-04 — Dashboard i kalendarz liczą dni przeglądając całą historię
- **Waga:** NISKA.
- **Dowód:** POTWIERDZONE, N=2000.
  - `plan.dayStatus` (`lib/plan.ts:113`) dla każdego dnia formatuje datę każdego treningu.
  - Pomiary: 7×dayStatus (`weekStrip`) 9,1 ms; `weekTiles` 11,9 ms (wywołuje `weekStrip` drugi raz); 42 dni 46 ms.
  - `periodSummary('week')` na zimnym cache 98 ms; PR z sesji z 30 dni na zimnym cache 251 ms; `weeklyTotals(8)` 5,8 ms.
  - Home oblicza `weekStrip` i `weekTiles` przy każdym renderze (`index.tsx:66`, `useTick`).
- **Propozycja:** `workoutsByDay` przez `memoHist` i użyć tej mapy w `dayStatus`. `weekTiles` może przyjmować gotowy `weekStrip`.

### PERF-05 — Drobne koszty stałe
- **Waga:** NISKA.
- **Dowód:** POTWIERDZONE / Z KODU.
  - `exById` to liniowe `find` po 1154 ćwiczeniach; dla wszystkich bloków 2000 treningów 43 ms (CSV, okresy, mięśnie). Wystarczy Map z memo po tożsamości `state.exercises`.
  - `lib/locales/index.ts` od razu ładuje 24 słowniki (2,1 MB JSON) przy starcie, choć wystarczy jeden. Lepiej ładować tylko aktywny język.
  - `localeCompare(…, locale())` w komparatorach. W V8 0,74 ms, ale koszt na Hermesie jest nieznany. Lepiej jeden `Intl.Collator`.

### PERF-06 — Odświeżanie podczas przerwy
- **Waga:** NISKA (bateria).
- **Dowód:**
  - POTWIERDZONE: 1 s zegara w trakcie przerwy kosztuje 40,9 ms (Jest), bez przerwy 3,9 ms. Na to składa się pasek przerwy 4×/s (zgodnie z projektem) plus `TabsLayout` 1×/s.
  - Z KODU:
    - `app/(tabs)/_layout.tsx:19` co sekundę wymusza render całego `Tabs` (nowe `screenOptions`, re-render `PlanReminderSync`), choć plakietka „2m” zmienia się raz na minutę aż do ostatniej minuty;
    - `TimedRing` (`ActiveWorkout.tsx:475`) ma bezwarunkowy interwał 250 ms.
- **Propozycja:** w `TabsLayout` wywoływać `force` tylko przy zmianie tekstu plakietki. W `TimedRing` warunek `timer.S.on`.

---

## Sprawdzone i w porządku

**SEC**
- **Historia gita:**
  - 0 kluczy prywatnych, certyfikatów, .p8/.p12/.mobileprovision/.env;
  - 0 tokenów GH/AWS/Google/Slack/Expo i 0 JWT;
  - 0 prawdziwych UDID (trafienia 40-hex i 8-16 to wyłącznie syntetyczne wartości w `tests/public-repo.test.ts`).
- **E-maile w treści:**
  - `i***@izs.me` (autor pakietów npm, package-lock, 84×);
  - publiczne adresy wsparcia `tr***@fitbod.me` i `ap***@strengthlog.com` w researchu.
- **E-maile w metadanych commitów:** `no***@anthropic.com` (277) i `33***@users.noreply.github.com` właściciela (3), bez prywatnego adresu.
- **Pozostałe dane w historii:**
  - Team ID (`8NQ9…GF`) jest w app.json; to informacja publiczna;
  - 8 usuniętych plików bez sekretów;
  - PNG bez metadanych;
  - fixtures (poza SEC-01) są fikcyjne;
  - plik Strong właściciela nie trafił do repo.
- **Logi CI:**
  - publiczny log iphone-local: 34 UDID zamaskowane, niezamaskowane 40-hex to tylko SHA commitów i akcji;
  - w CN certyfikatu są imię i nazwisko oraz numer seryjny certyfikatu (informacje publiczne);
  - link rejestracji urządzenia jest zablokowany na publicznym repo.
- **Workflowy:**
  - wszystkie mają jawne `permissions` tylko do odczytu;
  - brak `pull_request` i `pull_request_target`;
  - `${{ github.event.repository.private }}` to wartość logiczna, a wejścia `urzadzenie`/`wyglad` idą przez env (bez wstrzyknięcia);
  - artefakty mają `retention-days: 1`;
  - `testflight.yml` poprawnie przypisuje sekrety do kroków i sprząta klucz.
- **Prywatność w aplikacji:**
  - zero wywołań sieciowych (fetch/XHR/WebSocket, expo-updates, analityka, push token);
  - `aps-environment` jest usuwany przez plugin;
  - HealthKit tylko zapis, `SyncIdentifier` chroni przed duplikatami;
  - baza SQLite przeniesiona do `Library/` (niewidoczna w Plikach);
  - kopie zapisywane atomowo w `Documents/Backup` (świadomie widoczne);
  - import nie wykonuje akcji z URL;
  - deep linki tylko nawigują.
- **Licencje:** katalog ćwiczeń z free-exercise-db (Unlicense; tylko nazwy i fakty), mapa mięśni i ikony to własne rysunki, research to parafrazy bez długich cytatów.

**NAT**
- **Tożsamość i zasięg:**
  - bundle `pl.lukasz.trening`, widżet `.restwidget`;
  - wersja 0.10.0 zgodna w app.json, package.json, MARKETING_VERSION aplikacji i widżetu;
  - tylko iPhone (`TARGETED_DEVICE_FAMILY=1`), tylko pion;
  - iOS 16.4, arm64.
- **Uprawnienia i Info.plist:**
  - entitlements tylko HealthKit;
  - brak UIBackgroundModes;
  - ATS bez arbitrary loads;
  - `ITSAppUsesNonExemptEncryption=false` (expo-crypto mieści się w zwolnieniu);
  - teksty HealthKit i nazwa aplikacji we wszystkich 26 lproj (każdy ma 3 klucze);
  - brak zbędnych `NS*UsageDescription` (aparat, zdjęcia, lokalizacja);
  - DocumentPicker i Sharing nie wymagają uprawnień.
- **Ikony:** 1024 px; jasna bez kanału alfa (wymóg App Store), warianty dark i tinted wygenerowane.
- **Live Activity:** `#available`, `staleDate`, jedna aktywność naraz.
- **Brak OTA (expo-updates).**
- Wszystkie `setInterval`/`addEventListener`/`subscribe` mają sprzątanie.

**PERF**
- **Trening w toku:** zapis tylko do klucza „live” (0,2 ms), znak w serii 47–73 ms niezależnie od zakładek.
- **Cache i listy:**
  - `prMap`/`recordsFor` na ciepłym cache ok. 0,1–0,2 ms (sumy narastające z wyszukiwaniem binarnym);
  - Historia na FlatList;
  - picker na FlatList.
- **Pomiary N=2000:**
  - `planReminderKey` 0,03 ms;
  - `suggest` 0,9 ms;
  - mapa mięśni (miesiąc plus SVG) 0,5 ms;
  - `deloadHint` 2,2 ms;
  - `workoutsByDay` 1,5 ms.
- **Render ekranów (Jest, N=2000):** start z ekranem Trening 5,5 s, Kalendarz 867 ms, Szablony 176 ms, Postępy 492 ms, Plan 267 ms.

