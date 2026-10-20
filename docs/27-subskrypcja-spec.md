# 27. Subskrypcja i zakup w aplikacji — specyfikacja (11.10.2026)

Stan: **decyzje właściciela z 12.10.2026 zapisane niżej; wdrożenie w wydaniu 0.17.0 za przełącznikiem `PAYWALL.ENABLED` (domyślnie wyłączony).** Pierwotnie: projekt do decyzji właściciela, bez kodu. Autor: agent (rola analityk produktu). Realizuje decyzje z `docs/15-app-store.md`
(sekcja „Decyzje właściciela”) i pkt 5 kolejności z `docs/21-roadmapa-offline.md` („Przed wersją płatną: subskrypcja i blokada po wygaśnięciu”).
Niczego z tych decyzji nie zmienia; gdzie decyzji brak — opcje w rozdz. 7 („Pytania do właściciela”).

**Cel:** po okresie próbnym aplikacja pobiera opłatę (subskrypcja miesięczna, roczna albo dostęp dożywotni) wyłącznie przez Apple, bez
serwera i bez konta; bez zakupu zostają 4 treningi na żywo w miesiącu kalendarzowym, a dane użytkownika (historia, kopia, eksport) są
dostępne zawsze.

## Decyzje właściciela (12.10.2026)

Właściciel przyjął rekomendacje agenta („zgodnie z rekomendacją”). Wdrożone w 0.17.0 (kod: `lib/products.ts`, `lib/access.ts`, `lib/entitlement.ts`; testy: docs/09):

| Pytanie | Decyzja | Skutek w aplikacji |
|---|---|---|
| P1 | A — okres próbny jako oferta wprowadzająca Apple (miesiąc w obu planach) | tekst „1 miesiąc za darmo, potem {cena}/{okres}” tylko dla osób uprawnionych (`isEligibleForIntroOffer`) |
| P2 | B — ekran zakupu raz po pierwszym ukończonym treningu na żywo, potem tylko Ustawienia i start ponad limit | `PAYWALL_MOMENTS.AFTER_FIRST_WORKOUT`, `maybeShowPaywallAfterFirstWorkout` (znacznik w kv `paywallSeen`, poza kopią); nie dla osób z pełnym dostępem ani bez odpowiedzi sklepu |
| P3 | B — do limitu po wygaśnięciu liczą się tylko treningi rozpoczęte po wygaśnięciu | `PAYWALL.COUNT_FULL_STARTS_IN_EXPIRY_MONTH = false` |
| P4 | B — bez okna przed 4. darmowym treningiem, tylko licznik | brak okna; licznik w Ustawieniach → „Subskrypcja” (linia na ekranie głównym — poza zakresem 0.17, do osobnej decyzji o układzie) |
| P5 | A — lokalne powiadomienie 2 dni przed końcem próby | `PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS = 2`, `lib/trialReminder.ts`; zgoda na powiadomienia jak przy przerwach |
| P6 | A — 7 dni dostępu offline po dacie wygaśnięcia | `PAYWALL.OFFLINE_GRACE_DAYS = 7` |
| P7 | A — Billing Grace Period 16 dni | włączenie tylko w App Store Connect; w aplikacji stan karencji = pełny dostęp (adapter czyta `renewalInfo.gracePeriodExpirationDate` — docs/30 „Ustalenia przy wdrożeniu” pkt 4) |
| P8 | A — testerzy dostają kody ofertowe | tylko App Store Connect, nic w kodzie |
| P9 | A — standardowa licencja Apple | `TERMS_URL` = https://www.apple.com/legal/internet-services/itunes/dev/stdeula/ (przeczytane 12.10.2026: „Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a custom end user license agreement”; App Store Connect: „If you don’t provide a custom EULA, the standard EULA is applied to your app” — developer.apple.com/help/app-store-connect/manage-app-information/provide-a-custom-license-agreement). W App Store Connect nie dodajemy własnej umowy |
| P10 | A — `expo-iap` 5.8.1 (przypięta dokładnie), bez usługi weryfikacji | docs/30 |
| P11 | A — znacznik `Workout.live` | wydanie 0.16.0 |

Wyjście na model darmowy: jedna wartość `PAYWALL.ENABLED` (lib/access.ts). Uwaga: P7 A (karencja) i P9 A zamykają dawne punkty [DO DECYZJI]/[DO WYJAŚNIENIA] w rozdz. 3.10 i 5.4.

## 1. Decyzje wejściowe (z docs/15, nie zmieniane tutaj)

| Pozycja | Wartość | Źródło |
|---|---|---|
| Subskrypcja miesięczna (auto-odnawiana) | 0,99 USD / 0,99 EUR / 0,99 GBP / 4,99 zł | docs/15, 09.10 i 11.10.2026; PL 4,99 zł: docs/18, 14.10.2026 |
| Subskrypcja roczna (auto-odnawiana, płatna z góry) | 4,99 USD / EUR / GBP / 19,99 zł (= 5 × miesięczna) | docs/15 i docs/18, 13.10.2026 (M1) |
| Dostęp dożywotni (zakup jednorazowy, non-consumable) | 14,99 USD / EUR / GBP / 59,99 zł (= 3 × roczna) | docs/15 i docs/18, 13.10.2026 (M1) |
| Inne kraje | lokalny próg zakupu impulsowego; przeliczenie Apple tylko jako punkt wyjścia | docs/15, zasada cenowa 09.10 |
| Okres próbny | **14 dni** (2 tygodnie) jako oferta wprowadzająca Apple, w obu planach subskrypcji; stała `TRIAL_DAYS` (`lib/products.ts`). Model stały, decyzja właściciela 19.10.2026 (audyt M1-011) — zastępuje „1 miesiąc” z 09.10.2026; tekst `docs/27` poniżej zachowuje pierwotne brzmienie szkiców | docs/15, 19.10.2026 |
| Bez zakupu (po próbie / po wygaśnięciu) | 4 darmowe treningi na miesiąc kalendarzowy; liczone na telefonie; tylko treningi na żywo; trening wstecz bez limitu; historia, kopia i eksport bez limitu | docs/15, 09.10 pkt 5 |
| Kody | kody ofertowe Apple; przycisk „Zrealizuj kod” na ekranie zakupu i w Ustawieniach; dla kolegów własne kody bez automatycznego odnowienia (wariant A) | docs/15, 09.10 |
| Chmura rodzinna (Family Sharing) | TAK — subskrypcje i dożywotni | docs/15, 11.10.2026 |
| Wcześniejsi użytkownicy | **brak darmowych użytkowników** — ustalenie z 05.10 odwołane 06.10.2026 („Nie będzie użytkowników za darmo”) | docs/15 |
| Koszty | 0 zł poza Apple: bez serwera, bez płatnych usług weryfikacji | CLAUDE.md |

Liczby (ceny, limit 4, długość próby) w kodzie w jednym miejscu (proponowane `lib/paywall.ts`, stała `PAYWALL`); ceny wyświetlane
**zawsze z App Store** (`Product.displayPrice`), nigdy z kodu — kod zna tylko identyfikatory produktów i limit 4.

## 2. Model stanów dostępu

Jedna funkcja `access(state, entitlements, now)` → jeden z czterech stanów (logika w `lib/`, testowalna bez StoreKit):

| Stan | Kiedy | Treningi na żywo |
|---|---|---|
| `full` | aktywna subskrypcja (także w okresie próbnym, w okresie karencji płatności, z Chmury rodzinnej, z kodu) albo dożywotni | bez limitu |
| `free` | brak uprawnienia (nigdy nie kupił, próba się skończyła, subskrypcja wygasła, zwrot) | 4 na miesiąc kalendarzowy |
| `unknown` | StoreKit jeszcze nie odpowiedział przy starcie (krótko) albo brak danych przy pierwszym uruchomieniu offline | jak ostatni zapamiętany stan; bez zapamiętanego — jak `free`, ale bez komunikatu o blokadzie, dopóki start treningu nie przekroczy limitu |
| `testflight` | build z TestFlight (piaskownica Apple) | jak wynik StoreKit (zakupy w piaskownicy są bez opłat) — patrz 3.12 |

Zawsze dostępne niezależnie od stanu (wymaganie twarde): historia i szczegóły sesji, edycja historii, **trening wstecz**, postępy i rekordy,
szablony i plan (przeglądanie i edycja), biblioteka ćwiczeń, ustawienia, **kopia zapasowa, przywracanie kopii, eksport CSV**, „Przywróć
zakupy”, „Zrealizuj kod”, „Zarządzaj subskrypcją”. Blokowany jest **wyłącznie start nowego treningu na żywo** ponad limit
(„Start” z szablonu, „Pusty trening”, „Powtórz ostatni”, start z kalendarza/planu, z podpowiedzi deload) — jedno miejsce w kodzie: strażnik w
`lib/start.ts` obok istniejącego strażnika „trening w toku” (F7/LIVE-12).

### Licznik 4 treningów — co się liczy

- Liczy się trening na żywo, którego **start** wypada w bieżącym miesiącu kalendarzowym (dzień liczony jak wszędzie — `store.wallTs`
  z `tzOffsetMin`, J3), **zakończony albo trwający**. Anulowany („Anuluj trening”) nie liczy się — nie ma go w historii.
- Nie liczy się: trening wstecz, edycja treningu z historii, treningi sprzed włączenia płatności (patrz rozdz. 4 — znacznik).
- Czy treningi rozpoczęte w stanie `full` liczą się do limitu miesiąca, w którym subskrypcja wygasła — **decyzja 12.10.2026, P3 B**
  (liczone tylko starty od chwili wygaśnięcia).
- Zmiana miesiąca: licznik od nowa o północy 1. dnia (czas telefonu). Trening rozpoczęty 31. o 23:30 liczy się do miesiąca startu.
- Licznik z historii (bez osobnego licznika): usunięcie treningu z historii zwalnia miejsce. Ocena realności (CLAUDE.md pkt 6): **brzegowy**
  (kosztem własnych danych) → bez naprawy, notatka. Zmiana daty w Ustawieniach iOS — **teoretyczny/brzegowy**, bez naprawy.

## 3. Przepływy użytkownika

### 3.1 Pierwsze uruchomienie
1. Animacja startowa (lib/intro) → ekran główny jak dziś (aplikacja działa od razu, bez konta — App Review 5.1.1(v): „If your app doesn’t
   include significant account-based features, let people use it without a login.” — https://developer.apple.com/app-store/review/guidelines/).
2. Moment pokazania ekranu zakupu — rozdz. 5 (warianty A/B/C). Do czasu rozpoczęcia próby użytkownik jest w stanie `free` (4 treningi).
3. Okres próbny = oferta wprowadzająca Apple, więc **wymaga potwierdzenia zakupu w systemowym oknie Apple** (Face ID / hasło); bez tego
   nie ma próby. To różni się od „30 dni od instalacji liczone przez aplikację” — **pytanie P1**.
4. Offline przy pierwszym uruchomieniu: brak cen z App Store → ekran zakupu pokazuje „Ceny są niedostępne bez połączenia z internetem”
   i przycisk „Spróbuj ponownie”; nie pokazujemy cen z kodu (cena musi być lokalna i z App Store). Aplikacja działa w stanie `free`.

### 3.2 Okres próbny
- Na ekranie zakupu przy planie z próbą: „1 miesiąc za darmo, potem {cena}/{okres}” — cena po próbie jako najwyraźniejszy element (rozdz. 5.4).
- Kwalifikacja do próby z `isEligibleForIntroOffer`: „true if the customer is eligible for an introductory offer on this auto-renewable
  subscription, or any auto-renewable subscription in the same subscription group” (https://developer.apple.com/documentation/storekit/product/subscriptioninfo/iseligibleforintrooffer).
  Kto już raz miał próbę (także na innym urządzeniu / po reinstalacji) — tekst bez „za darmo”.
- W Ustawieniach → „Subskrypcja”: „Okres próbny do {data}” (data z `expirationDate` transakcji), przycisk „Zarządzaj subskrypcją”.
- Przypomnienie przed końcem próby — **pytanie P5** (lokalne powiadomienie; Apple sam wysyła e-mail o odnowieniu — nie sprawdzono, dla
  jakich ofert, [DO WYJAŚNIENIA]).

### 3.3 Koniec próby
- Bez anulowania: Apple pobiera opłatę, stan `full` bez przerwy, aplikacja nic nie pokazuje.
- Po anulowaniu: przy pierwszym uruchomieniu po wygaśnięciu jednorazowa informacja (karta na ekranie głównym, nie okno blokujące):
  „Okres próbny się skończył. Masz 4 darmowe treningi w miesiącu — w tym miesiącu zostało {n}. Twoje dane są bezpieczne: historia, kopia
  i eksport działają zawsze.” + „Zobacz plany”.

### 3.4 Limit 4 treningów (stan `free`)
- Ekran główny: dyskretna linia „Darmowe treningi w tym miesiącu: {n} z 4” (tylko w stanie `free`).
- Start 1.–4. treningu: bez przeszkód. Przy starcie 4.: okno informacyjne „To ostatni darmowy trening w tym miesiącu” — **pytanie P4**
  (pokazywać czy nie).
- Start 5.: zamiast treningu ekran zakupu z nagłówkiem „Wykorzystano 4 darmowe treningi w {miesiąc}. Kolejne od {1. dnia następnego
  miesiąca}.” oraz „Dopisz trening wstecz” (dozwolone bez limitu — decyzja 09.10, wariant A) i „Nie teraz”.
- **Trening w toku przy przekroczeniu:** nigdy nie przerywamy. Trening rozpoczęty legalnie (w próbie, w subskrypcji, w limicie) kończy się
  normalnie, także gdy w trakcie wygaśnie subskrypcja albo zmieni się miesiąc; zapis, Apple Zdrowie, kopia automatyczna — jak dziś.
  Strażnik działa tylko przy starcie. „Kontynuuj” porzuconego treningu (staleAck) — to nie jest nowy start, bez limitu.
- VoiceOver: licznik jako jeden element („Darmowe treningi w tym miesiącu: 2 z 4”); okno limitu — fokus na nagłówku.

### 3.5 Zmiana miesiąca
- O północy 1. dnia licznik wraca do 4. Gdy aplikacja jest otwarta przez północ — licznik przelicza się przy powrocie z tła i przy próbie
  startu (nie potrzeba stopera). Zmiana strefy czasowej: miesiąc treningu wg `tzOffsetMin` z chwili startu (jak kalendarz).

### 3.6 Offline
- Cała aplikacja offline; StoreKit przechowuje transakcje na urządzeniu. Inżynier Apple na forum deweloperów: „To get the latest transactions
  the device will need internet access but it does cache data locally and new transactions are pushed to the device when online” —
  https://developer.apple.com/forums/thread/706450 (forum, nie dokumentacja — **szczebel niższy, do potwierdzenia testem w trybie samolotowym**).
- Zasada bezpieczna dla użytkownika: aplikacja zapamiętuje ostatni znany stan i datę wygaśnięcia; offline po dacie wygaśnięcia subskrypcji,
  której odnowienia telefon nie mógł pobrać — **P6 A (12.10.2026)** (karencja offline vs natychmiast `free`).
- Zakup, kod i przywracanie offline — komunikat „Potrzebne połączenie z internetem”, bez zmiany stanu.

### 3.7 Przywracanie zakupów
- Dokumentacja Apple: „Include some mechanism in your app, such as a Restore Purchases button, to let users restore their Apple In-App
  Purchases.” oraz „When users reinstall your app or download it on a new device, the app automatically has all transactions available to it
  upon initial launch.” — https://developer.apple.com/documentation/storekit/appstore/sync().
- Przycisk „Przywróć zakupy” na ekranie zakupu i w Ustawieniach → `AppStore.sync()` (systemowe logowanie Apple; tylko na wyraźne naciśnięcie).
  Wynik: „Przywrócono: {plan}” albo „Nie znaleziono zakupów dla tego konta Apple”.
- Dane treningowe NIE są częścią zakupu — po reinstalacji przywraca się je z kopii (jak dziś). Na ekranie przywracania krótka uwaga:
  „Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.”

### 3.8 Kody ofertowe
- „Zrealizuj kod” (ekran zakupu + Ustawienia) → systemowe okno Apple. Apple: „Customers can only redeem these offers in your app through the
  redemption sheet; don’t use a custom UI.” — https://developer.apple.com/documentation/storekit/appstore/presentoffercoderedeemsheet(in:).
- Wynik przychodzi przez nasłuch transakcji (`Transaction.updates`), który musi działać od startu aplikacji („Set up a transaction listener
  as soon as your app launches” — ta sama strona).
- Ograniczenia Apple (https://developer.apple.com/app-store/subscriptions/): „In order for offer codes to be redeemed, your app must be
  available on the App Store.” oraz „Existing subscribers can only redeem codes that are an upgrade from or at the same level as their
  current subscription.” → kodów nie przetestujemy przed publikacją w App Store (ryzyko R6); osoba z dożywotnim kodu nie potrzebuje.
- Kod bez automatycznego odnowienia (koledzy, docs/15): po końcu okresu kodu stan `free`, karta jak w 3.3 („Okres z kodu się skończył…”).

### 3.9 Chmura rodzinna (Family Sharing)
- Apple: „Family Sharing allows a customer to share access to auto-renewable subscriptions or non-consumables with up to five family members
  on all of their Apple devices.” — https://developer.apple.com/documentation/storekit/supporting-family-sharing-in-your-app.
- W aplikacji: członek rodziny dostaje uprawnienie jak kupujący (`ownershipType = familyShared`); w Ustawieniach „Dostęp z Chmury rodzinnej”.
  Odejście z rodziny / wyłączenie udostępniania → uprawnienie znika (`revocationDate`), stan `free` przy najbliższym sprawdzeniu.
- **Nieodwracalne:** „Keep in mind that once you turn on Family Sharing for an In-App Purchases in App Store Connect, you can't turn it off.” —
  https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases
  (zamyka [OTWARTE] z docs/15, 11.10.2026). Wniosek: włączyć dopiero po potwierdzeniu właściciela w kroku listy (rozdz. 6, krok 9).

### 3.10 Zwrot i anulowanie
- Anulowanie subskrypcji (Ustawienia iOS lub „Zarządzaj subskrypcją” w aplikacji → systemowy arkusz, `showManageSubscriptions`): dostęp do końca
  opłaconego okresu, potem `free`.
- Zwrot (przez Apple): „Products that the App Store has refunded or revoked don’t appear in the current entitlements.” —
  https://developer.apple.com/documentation/storekit/transaction/currententitlements → stan `free` bez komunikatu oskarżającego; dane nietknięte.
- Problem z płatnością przy odnowieniu: włączyć w App Store Connect „Billing Grace Period” — Apple: „Apple attempts to address the billing issue
  and recover the subscription while the subscriber retains subscription access.” (do wyboru 3, 16 albo 28 dni —
  https://developer.apple.com/app-store/subscriptions/) — **pytanie P7**.
- Prośba o zwrot z aplikacji (StoreKit ma `beginRefundRequest`) — nie w pierwszym wydaniu (backlog), zwrot przez Apple działa bez tego.

### 3.11 Zmiana planu miesięczna ↔ roczna ↔ dożywotnia
- Miesięczna i roczna w **jednej grupie subskrypcji** (jedna próba na osobę w grupie: „Customers can redeem one introductory offer per
  subscription group.” — https://developer.apple.com/app-store/subscriptions/). Zmiana w systemowym arkuszu „Zarządzaj subskrypcją” albo
  przez zakup drugiego planu na naszym ekranie. Zasady Apple (ta sama strona): podwyższenie — „They're immediately upgraded and receive a
  refund of the prorated amount of their original subscription.”; obniżenie — „The subscription continues until the next renewal date, then is
  renewed at the lower level and price.” Poziomy w grupie: roczna wyżej niż miesięczna — **[DO WYJAŚNIENIA]** w App Store Connect, czy
  przy tej samej treści roczna to „upgrade” czy „crossgrade” (inny czas trwania → od następnego odnowienia).
- Dożywotni przy aktywnej subskrypcji: Apple **nie anuluje** subskrypcji sam (to osobne produkty) — po zakupie dożywotniego ekran
  „Masz dostęp na zawsze. Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.” + „Zarządzaj subskrypcją”.
  Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem.
- Dożywotni → subskrypcja: ekran zakupu przy stanie „dożywotni” pokazuje tylko „Masz dostęp na zawsze” (bez przycisków kupna).

### 3.12 Wcześniejsi testerzy TestFlight
- Decyzja 06.10: bez darmowych użytkowników. Technicznie: build z TestFlight korzysta z piaskownicy Apple — „Apps you download from
  TestFlight” używają sandbox, a „Transactions from test accounts don’t incur charges” (https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox).
  W TestFlight testerzy „kupują” bez opłat — limit i ekran zakupu da się w ten sposób sprawdzić.
- `originalAppVersion` nie pozwoli rozpoznać testerów: „In the sandbox testing environment, the originalAppVersion value is always 1.0.” —
  https://developer.apple.com/documentation/storekit/apptransaction/originalappversion.
- Po wejściu do App Store tester instaluje wersję ze sklepu jak nowy użytkownik (dane przenosi kopią zapasową). Podziękowanie dla testerów —
  własne kody ofertowe (już zdecydowane dla kolegów, docs/15) — **pytanie P8** (czy także dla testerów i na jak długo).

## 4. Technika (bez wdrażania)

### 4.1 Biblioteka StoreKit dla Expo (stan 11.10.2026, rejestr npm i dokumentacja czytane dziś)

| Opcja | Stan | Licencja | Wymagania | Za | Przeciw |
|---|---|---|---|---|---|
| A. `expo-iap` | 6.0.0 z 09.10.2026 (5.8.3 z 07.10); repozytorium hyodotdev/openiap | MIT (0 zł) | „In-app purchases require native modules that are not available in Expo Go”; „The validated SDK 57 setup requires iOS 16.4+.” (https://openiap.dev/docs/setup/expo) | moduł Expo (jak nasz `expo-sqlite`), StoreKit 2 („openiap-apple … (StoreKit 2)” — README w npm), API na wszystko z rozdz. 3: `getAvailablePurchases`, `restorePurchases`, `openRedeemOfferCode`, `showManageSubscriptionsIOS` | wersja 6.0.0 ma 2 dni (świeże wydanie główne); wtyczka konfiguracyjna podpina opcjonalną płatną usługę weryfikacji („IAPKit publishable key … for hosted” weryfikację) — **nie używamy**, sprawdzić, że bez klucza nic nie wysyła do sieci (prywatność, 0 zł); w zależnościach opcjonalnych pakiety innych sklepów |
| B. `react-native-iap` | 17.0.0 z 09.10.2026, ten sam zespół | MIT | wymaga `react-native-nitro-modules` ≥ 0.36.5 (druga natywna zależność) | dojrzała historia projektu | dodatkowa natywna zależność; dla Expo autorzy wskazują A („Expo Module with tighter integration”) |
| C. Własny moduł Expo w Swift (StoreKit 2 bezpośrednio) | — | własny kod | jak `modules/rest-activity` (mamy już lokalny moduł Expo w Swift) | zero cudzych zależności i sieci; tylko 8–10 wywołań, których potrzebujemy; pełna kontrola prywatności | więcej kodu natywnego do napisania i testowania (sprawdzalny tylko w `ios-unsigned.yml`/E2E/TestFlight) |

**Rekomendacja: A, przypięte do wersji ≥ 2 tygodnie od wydania** w chwili wdrożenia (dziś 5.8.x albo 6.0.x po 23.10.2026), z przeglądem,
że bez klucza usługi weryfikacji biblioteka nie łączy się z niczym poza Apple. Gdy przegląd wykaże wysyłkę danych albo niezgodność z SDK 57
— C. Zgodność z naszym celem wdrożenia iOS (16.4+) — **[DO WYJAŚNIENIA]** przy wdrożeniu (dziś w `app.json` nie ustawiono jawnie). Biblioteka
trafia do `lib/licenses.generated.ts` (ekran licencji).

### 4.2 Weryfikacja uprawnień bez serwera
- StoreKit 2 sam weryfikuje podpis transakcji: „StoreKit automatically verifies the …” wartości (https://developer.apple.com/documentation/storekit/verificationresult);
  aplikacja przyjmuje tylko `.verified`. Źródło prawdy: `Transaction.currentEntitlements` (subskrypcje aktywne lub w karencji + dożywotni,
  bez zwróconych) przy starcie i powrocie z tła + nasłuch `Transaction.updates` od startu.
- Bez serwera nie dostaniemy powiadomień serwerowych Apple (np. o zwrocie) — aplikacja dowie się przy najbliższym odświeżeniu lokalnym.
  Akceptowalne (cena kilku zł, brak kosztu na użytkownika). Obejście przez manipulację urządzeniem — teoretyczne, bez naprawy.
- Prywatność: aplikacja nie wysyła nic sama; StoreKit kontaktuje się z Apple. Do aktualizacji: `site/privacy.html` (zakupy obsługuje Apple,
  aplikacja przechowuje lokalnie tylko stan uprawnienia), formularz prywatności App Store — **[DO WYJAŚNIENIA]**, czy zakupy obsługiwane
  wyłącznie przez Apple zmieniają deklarację „dane niezbierane” (nie czytano wytycznych formularza).

### 4.3 Czy potrzebna zmiana schematu danych?
Licznik da się policzyć z historii (`workouts` + `active`), ale dziś **nie da się odróżnić treningu na żywo od treningu wstecz**: oba to
`Workout` z tymi samymi polami (lib/edit.ts tworzy trening wstecz tak samo, `sessionMode: 'solo'`), a edycja historii zmienia `startedAt`.
Opcje:

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| A. Znacznik `Workout.live?: true` | ustawiany przy starcie na żywo (lib/start.ts), nigdy przez edycję; pole opcjonalne bez podnoszenia `SCHEMA_VERSION` (jak `doneEarly` w 18) | licznik = filtr historii, kopia i eksport przenoszą go same; przejrzyste | to zmiana modelu danych — osobne wydanie; treningi sprzed znacznika się nie liczą (korzystne dla użytkownika) |
| B. Heurystyka bez zmian modelu | „na żywo” = `createdAt` w tym samym miesiącu co `startedAt` i `createdAt ≤ startedAt + 1 min` | zero zmian danych | edycja daty treningu „przenosi” go poza licznik; nieczytelne reguły; łatwo o błąd przy migracji |
| C. Osobny licznik w stanie (`liveStarts: {miesiąc: [id]}`) | zapis przy starcie | usunięcie z historii nie zwalnia miejsca | nowa struktura do kopii/importu/migracji; większa zmiana schematu niż A |

**Rekomendacja: A.** Kopia z wersji ze znacznikiem w starszej wersji — pole ignorowane (zgodne w obie strony); test „dane” z docs/20 pkt 6.
**[DO WYJAŚNIENIA programisty]**: czy dodanie pola opcjonalnego bez podnoszenia schematu jest zgodne z regułą w `lib/backup.ts`
(precedens `doneEarly`).

### 4.4 Kolejność wydań (CLAUDE.md: nie łączyć natywnej zależności ze zmianą schematu)
1. **Wydanie N (tylko dane i logika, bez natywnej zależności):** znacznik `live` przy starcie, `lib/paywall.ts` (stany, licznik, teksty
   przez `t()` we wszystkich językach) z flagą wyłączoną — w aplikacji nic nie widać poza testami. TestFlight jak zwykle.
2. **Wydanie N+1 (natywna zależność, bez zmiany schematu):** biblioteka StoreKit, ekran zakupu, Ustawienia → „Subskrypcja”, plik
   konfiguracyjny StoreKit, włączenie flagi. TestFlight (piaskownica) → testy z rozdz. 6–7 → App Store.
   Odrzucona kolejność odwrotna (najpierw biblioteka): ekran zakupu i tak potrzebuje licznika, więc logika w N+1 oznaczałaby zmianę danych
   razem z natywną zależnością.

## 5. Ekran zakupu — warianty wyglądu i momentu pokazania

### 5.1 Wariant A — „miękki” (bez ekranu na starcie)
Aplikacja startuje jak dziś; karta na ekranie głównym „Wypróbuj pełną wersję — 1 miesiąc za darmo” + wpis w Ustawieniach. Ekran zakupu
pokazuje się sam dopiero przy 5. treningu w miesiącu.
```
┌ Ekran główny ─────────────────────────┐
│ Dzisiaj: Push A            [ Start ]  │
│ ┌───────────────────────────────────┐ │
│ │ Pełna wersja: 1 miesiąc za darmo  │ │
│ │ Darmowe treningi: 3 z 4    [Zobacz]│ │
│ └───────────────────────────────────┘ │
```
Za: najmniej natarczywy (płatności to skarga nr 1 w researchu, docs/15); zgodne z „4 darmowe treningi” jako stałym trybem. Przeciw: mniej
osób zacznie próbę (bez próby nie ma konwersji do płatnej).

### 5.2 Wariant B — ekran po pierwszym treningu (rekomendacja)
Pierwszy trening bez przeszkód (użytkownik widzi wartość), po „Zakończ” i podsumowaniu jednorazowo ekran zakupu z „Nie teraz”; potem jak A.
```
┌ Pełna wersja ────────────────── [✕] ┐
│ Treningi bez limitu. Bez reklam.    │
│ Wszystko zostaje na Twoim telefonie.│
│                                      │
│ ( ) Rocznie        19,99 zł / rok    │
│     1 miesiąc za darmo, potem        │
│     19,99 zł co rok                  │
│ (•) Miesięcznie     4,99 zł / mies.  │
│     1 miesiąc za darmo, potem        │
│     4,99 zł co miesiąc               │
│ ( ) Na zawsze      59,99 zł raz      │
│                                      │
│ [   Zacznij miesiąc za darmo   ]     │
│ Odnawia się automatycznie, dopóki    │
│ nie anulujesz w Ustawieniach (co     │
│ najmniej 24 h przed końcem okresu).  │
│ Bez subskrypcji: 4 treningi / mies.; │
│ historia, kopia i eksport — zawsze.  │
│ Przywróć zakupy · Zrealizuj kod      │
│ Warunki korzystania · Prywatność     │
└──────────────────────────────────────┘
```
Za: moment, gdy użytkownik zna wartość; jeden raz, potem tylko przy limicie. Przeciw: dodatkowy ekran po pierwszym treningu.
Zdanie o „24 h przed końcem” — **[DO WYJAŚNIENIA]**: brzmienie warunków odnowienia z Schedule 2 umowy Apple (nie czytano) — przed
wdrożeniem przeczytać i dopasować; w aplikacji tylko sformułowania potwierdzone źródłem.

### 5.3 Wariant C — ekran przy pierwszym uruchomieniu
Po animacji startowej ekran zakupu z wyraźnym „Nie teraz — 4 darmowe treningi w miesiącu”.
Za: najwięcej rozpoczętych prób. Przeciw: „ściana płatności” przed poznaniem aplikacji — wg researchu skarg najostrzej oceniana (docs/15);
ryzyko złych ocen na starcie.

**Rekomendacja: B** (z elementami A: karta na ekranie głównym w stanie `free`). Wybór — **pytanie P2**.

### 5.4 Wymagania Apple dla ekranu (przeczytane 11.10.2026)
- App Review 3.1.1: „If you want to unlock features or functionality within your app, … you must use in-app purchase.” oraz „you should make
  sure you have a restore mechanism for any restorable in-app purchases.” — https://developer.apple.com/app-store/review/guidelines/.
- App Review 3.1.2(a): „the subscription period must last at least seven days and be available across all of the user’s devices.” (spełnione:
  miesiąc/rok; uprawnienie z konta Apple). 3.1.2(c): „Before asking a customer to subscribe, you should clearly describe what the user will
  get for the price.” — ta sama strona.
- Ekran rejestracji subskrypcji (https://developer.apple.com/app-store/subscriptions/): musi zawierać „Subscription name and duration, and
  the content or services provided during the subscription period”, „Full renewal price, shown clearly and prominently, and localized in
  available currencies” oraz „A way for current subscribers to sign in or restore purchases”; „the amount that will be billed must be the most
  prominent pricing element in the layout”; przy próbie „clearly indicate how long the free trial lasts and the price billed once the free trial
  is over.”; linki: „your app and App Store metadata must include links to your Terms of Use and Privacy Policy.”
- Skutek dla szkicu B: cena po próbie (np. „4,99 zł co miesiąc”) większa niż „za darmo”; nazwa planu i okres przy każdej pozycji; linki
  „Warunki korzystania” i „Prywatność” na ekranie i w opisie sklepu. Polityka prywatności istnieje (`site/privacy.html`); **warunków korzystania
  nie mamy** — pytanie P9.
- 5.1.1: aplikacja bez konta i bez danych osobowych — zakupy przypisane do konta Apple, nic nie zbieramy (spełnione bez zmian).

### 5.5 Stany ekranu
pierwszy raz / kwalifikuje się do próby / próba już wykorzystana (bez „za darmo”) / ładowanie cen / offline (bez cen, „Spróbuj ponownie”) /
błąd zakupu (komunikat Apple, ekran zostaje) / zakup anulowany przez użytkownika (bez komunikatu) / oczekuje na zgodę („Zapytaj o zakup”,
Ask to Buy — „Czeka na zgodę organizatora rodziny”) / aktywna subskrypcja (plan, data odnowienia, „Zarządzaj”) / dożywotni / z Chmury
rodzinnej / z kodu (data końca). Długie teksty: 35 języków (najdłuższe nazwy planów w de/fi/ru), Dynamic Type, ciemny wygląd, VoiceOver
(każdy plan = jeden przycisk z ceną i okresem w etykiecie), małe ekrany (przewijanie, linki zawsze osiągalne).

## 6. Lista dla właściciela — App Store Connect krok po kroku

1. **Umowa Paid Apps:** Business → Agreements. Apple: „To sell your apps on the App Store or offer In-App Purchases, the Account Holder must sign
   the Paid Apps Agreement.” (wymagana rola: Account Holder) — https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements.
2. **Dane bankowe i podatkowe** w tej samej sekcji (formularze podatkowe, w tym W-8BEN — kwestie podatkowe w docs/15, do księgowego).
   Status DSA „trader” — już zaplanowany (docs/15).
3. **Grupa subskrypcji:** Monetization → Subscriptions → nowa grupa (np. „Pełna wersja”), nazwa wyświetlana w 35 językach (dostarczy tłumacz).
4. **Produkty subskrypcji** w grupie (identyfikatory proponowane, nie do zmiany po utworzeniu — [DO WYJAŚNIENIA] w ASC):
   `pl.lukasz.trening.full.monthly` (1 miesiąc), `pl.lukasz.trening.full.yearly` (1 rok); poziomy: roczna wyżej (3.11).
5. **Produkt dożywotni:** In-App Purchases → Non-Consumable `pl.lukasz.trening.full.lifetime`.
6. **Ceny per kraj:** cena bazowa USD, ręcznie EUR/GBP/PLN wg tabeli z rozdz. 1; potem przegląd krajów wydania (zasada progu impulsowego).
   Punkty cenowe sprawdzone w App Store Connect 14.10.2026 (docs/18): 3,99 PLN nie ma w siatce, miesięczna PL = 4,99 zł; 19,99 i 59,99 zł ustawione ręcznie.
7. **Okres próbny** jako oferta wprowadzająca w obu subskrypcjach: typ „Free Trial”, 1 miesiąc, wszystkie kraje. Dostępne długości:
   „3 Days. 1 or 2 Weeks. 1, 2, 3, or 6 Months. 1 Year.”; „each person is only eligible to redeem one introductory offer per subscription
   group.” — https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions.
8. **Billing Grace Period** (3/16/28 dni) — wg decyzji P7.
9. **Family Sharing:** w każdym z 3 produktów sekcja Family Sharing → Turn On → Confirm. **Nieodwracalne** (cytat w 3.9) — dopiero po
   ostatecznym „tak” właściciela (decyzja 11.10 już jest; ten krok to tylko świadome potwierdzenie).
10. **Kody ofertowe:** w subskrypcji → Offer Codes; dla kolegów własne kody bez automatycznego odnowienia (docs/15); sprawdzić limit
    „1 użycie na kod” (otwarte w docs/15). Działają dopiero, gdy aplikacja jest w App Store (3.8).
11. **Lokalizacje produktów:** nazwa i opis każdego produktu w 35 językach (tłumacz) + zrzut ekranu zakupu do przeglądu (wymagany przy
    pierwszym zgłoszeniu produktu — [DO WYJAŚNIENIA] w ASC).
12. **Testerzy piaskownicy:** Users and Access → Sandbox → (+). Apple: „Use an email address that hasn't been used as Apple Account or to purchase
    iTunes or App Store content.” — https://developer.apple.com/help/app-store-connect/test-in-app-purchases/create-a-sandbox-apple-account.
    Adres testowy nie trafia do repo (CLAUDE.md — dane osobowe).
13. **Metadane sklepu:** link do polityki prywatności (jest) i warunków korzystania (P9); opis cen bez nazw innych aplikacji.
14. **Zgłoszenie:** produkty dołączone do wersji aplikacji przy pierwszym przeglądzie (pierwsze produkty IAP zatwierdzane razem z wersją —
    [DO WYJAŚNIENIA], nie czytano).

Czas właściciela: ok. 1–2 h w App Store Connect (kroki 1–2 mogą czekać na weryfikację Apple — dni, poza naszą kontrolą).

## 7. Testy (wg docs/20) i ryzyka

### 7.1 Rodzaje testów
| # | Rodzaj | Co |
|---|---|---|
| 1 | Logika | `lib/paywall.ts`: `access()` dla każdej kombinacji uprawnień (brak, próba, miesięczna, roczna, dożywotni, rodzina, kod, zwrot, wygasła, karencja); licznik: granice miesiąca, 31. 23:30, strefy (`tests-tz.yml`), anulowany, trening wstecz, edycja daty, trening w toku, treningi bez znacznika |
| 2 | Ekran | ekran zakupu we wszystkich stanach z 5.5 (w testach Jest sztuczny adapter sklepu w miejscu modułu natywnego, jak dziś mocki innych modułów), licznik na ekranie głównym, blokada 5. startu ze wszystkich 5 dróg startu, trening wstecz przy wyczerpanym limicie, kopia/eksport przy `free` |
| 3 | Scenariusz | próba → wygaśnięcie → 4 treningi → 5. zablokowany → zmiana miesiąca (fałszywy zegar) → odblokowany; z restartem aplikacji w trakcie treningu po wygaśnięciu |
| 4 | Macierz | stany dostępu i plany jako stałe w `lib/` (bramka wygeneruje wymiar); nowy ekran w przeglądzie dostępności i 35 językach |
| 5 | Niezmienniki | akcje „wygaśnięcie”, „zakup”, „zmiana miesiąca” w alfabecie losowych sekwencji; niezmiennik: w stanie `free` liczba treningów na żywo w miesiącu ≤ 4 + ewentualny trening rozpoczęty w `full`; żadna akcja zakupu nie zmienia `workouts` |
| 6 | Dane | znacznik `live` przeżywa zapis/restart, kopię/import, eksport CSV bez nowej kolumny; kopia ze znacznikiem w starszej wersji |
| 7 | Języki i wygląd | wszystkie teksty przez `t()`, 35 języków, ceny tylko z App Store (formatowanie lokalne Apple) |
| 8 | Regresja | każdy błąd z TestFlight/piaskownicy — test odtwarzający |
| 9 | E2E | Maestro: patrz 7.2 |

### 7.2 Jak testować StoreKit
- **Plik konfiguracyjny StoreKit** (`.storekit`) z 3 produktami i ofertą próbną: „StoreKit Testing in Xcode is a local test environment for
  testing in-app purchases without requiring a connection to App Store servers.” — https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode.
  Plik bez danych osobowych, można go trzymać w repo.
- **E2E Maestro na symulatorze** (`e2e-ios.yml`): plik `.storekit` działa, gdy jest podpięty w schemacie Xcode; czy zadziała przy naszym
  sposobie budowania i instalacji aplikacji w CI — **[DO WYJAŚNIENIA, próba w CI]**. Plan zapasowy: w buildzie E2E (zmienna środowiskowa,
  nigdy w TestFlight/App Store) sztuczny adapter sklepu z tym samym interfejsem; Maestro przechodzi: limit → ekran zakupu → „zakup” → start
  działa → „Przywróć zakupy”. Prawdziwy StoreKit sprawdzany ręcznie w piaskownicy.
- **Piaskownica (TestFlight, telefon właściciela):** lista ręczna: zakup każdego planu, próba, anulowanie i wygaśnięcie (piaskownica
  pozwala „change the subscription renewal rate” w ustawieniach konta testowego — strona piaskownicy z 3.12), zwrot, przywrócenie po reinstalacji,
  tryb samolotowy po zakupie i po wygaśnięciu (3.6), zmiana planu, dożywotni przy aktywnej subskrypcji.
- Kody ofertowe i Chmura rodzinna — tylko po publikacji w App Store (ryzyko R6), sprawdzenie na żywo z pierwszym kodem kolegi.

### 7.3 Ryzyka (w tym odrzucenia przez Apple)
| # | Ryzyko | Ocena | Przeciwdziałanie |
|---|---|---|---|
| R1 | Odrzucenie: brak ceny po próbie jako najwyraźniejszej, brak linków do warunków/prywatności, brak „Przywróć zakupy” | wysokie przy niedopatrzeniu | lista kontrolna 5.4 w teście ekranu (teksty i linki obecne we wszystkich językach) |
| R2 | Brak warunków korzystania (Terms of Use) | blokuje zgłoszenie | P9 |
| R3 | Zablokowanie dostępu do danych przy `free` | KRYTYCZNE (utrata danych) | test: kopia, przywracanie, eksport, historia w stanie `free` i offline |
| R4 | Błędny stan offline/`unknown` blokuje płacącego | WYSOKIE (funkcja nie do użycia) | zapamiętany ostatni stan, P6, test trybu samolotowego |
| R5 | Świeża biblioteka (6.0.0 z 09.10) / niezgodność z SDK 57 | średnie | wersja ≥ 2 tyg., `ios-unsigned.yml`, wariant C w zapasie |
| R6 | Kody i Chmura rodzinna nietestowalne przed App Store | średnie | prosty kod ścieżki (StoreKit robi resztę), sprawdzenie zaraz po publikacji |
| R7 | Family Sharing nieodwracalne | decyzja jest | krok 9 świadomie, na końcu |
| R8 | Podwójne płacenie (dożywotni + subskrypcja) | skarga/zwrot | ostrzeżenie 3.11 |
| R9 | Biblioteka wysyła dane do usługi trzeciej | prywatność | przegląd kodu biblioteki, bez klucza usługi weryfikacji; inaczej wariant C |
| R10 | Formularz prywatności App Store niezgodny po dodaniu zakupów | odrzucenie | [DO WYJAŚNIENIA] 4.2 przed zgłoszeniem |

Czas pracy agenta (szacunek): wydanie N ~0,5 dnia; wydanie N+1 ~1–1,5 dnia (ekran, adapter, testy wszystkich rodzajów, 35 języków równolegle).
Czeka się na: `ios-unsigned.yml`, E2E, TestFlight, przegląd Apple pierwszych produktów IAP; czas właściciela: rozdz. 6 + testy w piaskownicy (~1 h).

## 8. Pytania do właściciela (pojedynczo; każde z rekomendacją)

- **P1. Skąd okres próbny?** A) oferta wprowadzająca Apple (jak w docs/15): użytkownik potwierdza w oknie Apple, po miesiącu płaci
  automatycznie, jeśli nie anuluje; przed potwierdzeniem — 4 treningi/mies. Kompromis: pewne wobec Apple i zgodne z decyzją; część osób nie
  zacznie próby, bo boi się automatycznej płatności. B) miesiąc pełnej wersji od instalacji liczony przez aplikację, bez okna Apple, potem
  subskrypcja bez próby. Kompromis: bez bariery; wytyczna 3.1.1 opisuje taki tryb dla aplikacji **bez** subskrypcji („Non-subscription apps
  may offer a free time-based trial”) — dla aplikacji z subskrypcją niejasne (ryzyko odrzucenia), reinstalacja = nowa próba.
  **Rekomendacja: A.**
- **P2. Kiedy pokazać ekran zakupu?** A) tylko karta + przy 5. treningu; B) raz po pierwszym treningu, potem jak A; C) na starcie.
  **Rekomendacja: B** (5.1–5.3).
- **P3. Czy treningi z okresu próbnego/subskrypcji liczą się do limitu w miesiącu wygaśnięcia?** A) tak — limit to „4 treningi w miesiącu”
  bez wyjątków (prosto, jedna reguła); B) nie — liczone tylko treningi od chwili wygaśnięcia (hojniej; po wygaśnięciu 20. dnia jeszcze 4
  treningi w tym miesiącu). **Rekomendacja: B** — nie karze za wcześniejszą subskrypcję, różnica w przychodzie pomijalna.
- **P4. Ostrzeżenie przy starcie 4. darmowego treningu?** A) tak, okno „To ostatni darmowy trening w tym miesiącu” (bez niespodzianki przy
  5.); B) nie, tylko licznik na ekranie głównym (mniej okien). **Rekomendacja: B** — licznik wystarcza, mniej przerywania przed treningiem.
- **P5. Przypomnienie przed końcem próby?** A) lokalne powiadomienie 2 dni przed końcem (uczciwe, mniej zwrotów i złych ocen; wymaga zgody na
  powiadomienia — już ją mamy dla przerw); B) bez przypomnienia (Apple informuje sam — nie sprawdzono, w jakim zakresie). **Rekomendacja: A.**
- **P6. Offline po dacie odnowienia, gdy telefon nie mógł pobrać odnowienia?** A) zostaw `full` jeszcze np. 7 dni od daty wygaśnięcia, potem
  `free` (płacący nie traci dostępu w górach/na siłowni bez zasięgu; 7 dni — liczba produktowa, nie merytoryczna); B) od razu `free`
  (ściśle, ale płacący może być zablokowany). **Rekomendacja: A.**
- **P7. Karencja przy problemie z płatnością (Billing Grace Period)?** A) włączyć, 16 dni, dla wszystkich odnowień (bez przerw dla
  użytkownika, Apple odzyskuje płatność); B) wyłączona (dostęp przerywa się od razu przy błędzie płatności). **Rekomendacja: A.**
- **P8. Testerzy TestFlight po premierze?** A) każdy tester dostaje własny kod ofertowy (np. rok za darmo, bez odnowienia) — jak koledzy;
  B) bez podziękowania, jak nowi użytkownicy (decyzja 06.10). **Rekomendacja: A** — mieści się w decyzji o kodach, testerzy to pierwsi
  polecający.
- **P9. Warunki korzystania (Terms of Use) — wymagane linkiem na ekranie i w sklepie.** A) standardowa licencja Apple dla użytkownika (link
  do niej; zero pracy — [DO WYJAŚNIENIA]: przeczytać stronę Apple o standardowej licencji przed wdrożeniem); B) własne warunki na stronie
  aplikacji (PL/EN, obok polityki prywatności; więcej pracy, możliwość dopisania np. „aplikacja nie udziela porad medycznych”).
  **Rekomendacja: A** na start, B później razem ze stroną w domenie.
- **P10. Biblioteka StoreKit.** A) `expo-iap`; B) `react-native-iap`; C) własny moduł Swift. **Rekomendacja: A** z warunkami z 4.1 (C, jeśli
  przegląd wykaże wysyłkę danych).
- **P11. Znacznik treningu na żywo (zmiana danych).** A) pole `live` w treningu, osobne wydanie przed biblioteką; B) heurystyka bez zmiany
  danych; C) osobny licznik. **Rekomendacja: A** (4.3–4.4).

## 9. Kryteria ukończenia (testowalne)
1. W stanie `free` 5. start treningu na żywo w miesiącu pokazuje ekran zakupu ze wszystkich dróg startu; trening wstecz, historia, kopia,
   przywracanie kopii i eksport działają (także offline).
2. Trening w toku nigdy nie jest przerywany wygaśnięciem ani zmianą miesiąca.
3. Ekran zakupu spełnia listę 5.4 we wszystkich 35 językach; ceny wyłącznie z App Store.
4. Zakup, przywrócenie, kod, Chmura rodzinna i zwrot zmieniają stan bez restartu (nasłuch od startu).
5. Wszystkie rodzaje testów z 7.1 lub zapisany powód „nie dotyczy” w docs/09; E2E zielone.
6. Kolejność wydań z 4.4: zmiana danych i natywna zależność w różnych wydaniach.

## Źródła (przeczytane 11.10.2026)
- App Review Guidelines 3.1.1, 3.1.2(a), 3.1.2(c), 5.1.1(v): https://developer.apple.com/app-store/review/guidelines/
- Subskrypcje (ekran, próba, zmiana planu, karencja, kody): https://developer.apple.com/app-store/subscriptions/
- Oferty wprowadzające: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions
- Family Sharing (ASC): https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases
- Family Sharing (StoreKit): https://developer.apple.com/documentation/storekit/supporting-family-sharing-in-your-app
- StoreKit: `currentEntitlements`, `updates`, `AppStore.sync()`, `presentOfferCodeRedeemSheet`, `showManageSubscriptions`, `VerificationResult`,
  `isEligibleForIntroOffer`, `AppTransaction.originalAppVersion` — developer.apple.com/documentation/storekit/… (adresy przy cytatach)
- Testowanie: https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode,
  https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox
- Umowy i piaskownica: https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements,
  https://developer.apple.com/help/app-store-connect/test-in-app-purchases/create-a-sandbox-apple-account
- Offline (forum Apple, szczebel niższy): https://developer.apple.com/forums/thread/706450
- Biblioteki: rejestr npm (`expo-iap` 6.0.0, `react-native-iap` 17.0.0, licencja MIT), https://openiap.dev/docs/setup/expo
