# Weryfikacja przeciwna G1 — 2026-10-27

Commit: 025a50b9

Zakres: pieniądze. Trzy mechanizmy: (a) waluta na liście planów różna od waluty w arkuszu Apple, (b) ekran zakupu przy aktywnym dostępie, (c) P3 B po wygaśnięciu. Dowody komend: `dowody/G1-sonda.txt` (sonda Jest w kopii roboczej w scratchpadzie, każdy test osobno, exit=0), `dowody/G1-konfiguracja.txt` (konfiguracja buildu i kod openiap 3.6.0), `dowody/G1-zrodla.txt` (źródła Apple przeczytane dziś).

| ID | Wynik | Dowód | Realność | Poziom (zgłoszony → właściwy) |
|---|---|---|---|---|
| 01-odkrywanie-001 | niepewne: objaw w TestFlight potwierdzony, ale jako defekt aplikacji obalony (kod nie ma przyczyny) | lib/store-native.ts:57 „displayPrice: x.displayPrice”; openiap przepisuje `product.displayPrice` 1:1 (dowody/G1-konfiguracja.txt); Apple: o locale decyduje storefront | realny w TestFlight; w produkcji brzegowy, niepotwierdzony | P1 → P2 jako defekt kodu; to samo ryzyko ma wpis w rejestrze przez 02-monetyzacja-502 |
| 09-lokalizacja-002 | niepewne (ten sam mechanizm co 01-odkrywanie-001) | .github/workflows/testflight.yml:102 „EXPO_PUBLIC_STORE_FAKE ustawione w buildzie TestFlight”; plik .storekit nieużywany w buildzie (dowody/G1-konfiguracja.txt) | jak wyżej | P1 → P2 (jak wyżej) |
| 02-monetyzacja-502 | potwierdzone (ryzyko otwarte, brak wpisu w rejestrze, brak punktu na liście telefonu); hipotezę o koncie Sandbox osłabiono | docs/40-lekcje.md:9 „## Rejestr ryzyk (otwarte blokują wydanie)” bez wpisu o walucie; docs/49-testflight-1-0.md:26 „arkusz Apple pokazuje właściwą cenę” | realny w TestFlight; w produkcji brzegowy, do zamknięcia | P1 → P1 (CLAUDE.md: otwarte ryzyko blokuje wydanie) |
| 01-odkrywanie-002 | potwierdzone; teza o ryzyku odrzucenia za 3.1.2(b) słaba | app/paywall.tsx:76 „{!lifetime ? <>”; app/paywall.tsx:72 „Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.”; sonda S-B | stan posiadania: realny; dożywotni przy subskrypcji: brzegowy | P1 → P1 za brak uwagi przed dożywotnim; część o stanie posiadania P2 |
| 10-wydanie-002 | potwierdzone (mechanizm); „recenzent przechodzi dokładnie tę drogę” i ryzyko odrzucenia niepotwierdzone | app/paywall.tsx:66 „Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit.”; app/paywall.tsx:32 „p.period === null ? t('Kup na zawsze') : t('Subskrybuj')” | jak 01-odkrywanie-002 | P1 → P1 (część dożywotnia); reszta P2 |
| 04-studio-projektowe-001 | potwierdzone | app/paywall.tsx:69 „lifetime ? t('Masz dostęp na zawsze') : t('Masz pełną wersję')” (bez nazwy planu); sonda S-B: headline=true, przycisk_Subskrybuj=true | realny | P1 → P2 |
| 02-monetyzacja-503 | potwierdzone | docs/27-subskrypcja-spec.md:183 „Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem.”; sonda S-B: ostrzezenie_przed_zakupem=false | brzegowy | P1 → P1 |
| 02-monetyzacja-501 | potwierdzone | lib/store-native.ts:70 „getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })”; lib/access.ts:238 „const days = trainingDays(starts, now, nowOffMin, freeSince(entitlements, now), cfg)”; sonda S-C | realny | P1 → P1 |

## (a) Waluta: 01-odkrywanie-001, 09-lokalizacja-002, 02-monetyzacja-502

**Co mogło podać ceny w USD z kodu albo z konfiguracji: nic.** Każdą ścieżkę sprawdziłem osobno.
- **Adapter testowy:** sztuczny sklep wybiera tylko `process.env.EXPO_PUBLIC_STORE_FAKE === '1'` (lib/products.ts:54 „process.env.EXPO_PUBLIC_STORE_FAKE === '1'”). testflight.yml przerywa build, gdy ta zmienna jest ustawiona (.github/workflows/testflight.yml:102 „EXPO_PUBLIC_STORE_FAKE ustawione w buildzie TestFlight”). Jedyna zmienna `EXPO_PUBLIC_*` dodawana w tym workflow to numer buildu (dowody/G1-konfiguracja.txt). Sztuczny sklep nie otwiera też arkusza Apple, a właściciel ten arkusz widział.
- **Plik .storekit:** ceny w nim to wartości bez waluty (store/Trening.storekit:49 „"displayPrice" : "0.99"”). Pliku nie używa żaden workflow, app.json ani schemat. Odwołuje się do niego tylko generator README i testy. Katalog `ios/` nie jest w repo, bo powstaje z `expo prebuild --clean` (dowody/G1-konfiguracja.txt).
- **Biblioteka:** expo-iap 5.8.1 z openiap 3.6.0 (`openiap-versions.json`). Kod 3.6.0 pobrałem z repozytorium wskazanego w podspec CocoaPods (tag 3.6.0). `fetchProducts` woła `StoreKit.Product.products(for:)`, a most przepisuje `displayPrice: product.displayPrice` bez przeliczeń. Adapter aplikacji przekazuje wartość dalej bez zmian (lib/store-native.ts:57 „displayPrice: x.displayPrice”). Sonda S-A: produkt „4,99 zł” daje wiersz „4,99 zł/miesiąc” (dowody/G1-sonda.txt). Lista na ekranie to więc dokładnie `Product.displayPrice` ze StoreKit na telefonie testerki.
- **Kwoty 0.99 / 6.99 / 14.99** to ceny bazowe USD z App Store Connect (docs/18-przekazanie.md:203 „Apple przelicza 0,99 USD na 4,99 zł”). Wynika z tego, że StoreKit oddał produkty dla storefrontu USA, a nie dla PL.

**Co mówi Apple (przeczytane dziś, dowody/G1-zrodla.txt):**
- `Product.displayPrice`: „The storefront that the user’s device is connected to determines the locale.”
- „Apps that you download from TestFlight always run in the sandbox environment.”
- Region produktów w piaskownicy wyznacza konto Sandbox.

**Wskazówka szczebla 4, nie dowód przyczyny:** dokumentacja testów piaskownicy jednego z dostawców SDK subskrypcji opisuje dokładnie ten objaw jako znane zachowanie TestFlight. StoreKit „may return prices in USD when testing through TestFlight”, a arkusz Apple „may still show the correct local currency”; w produkcji „isn't commonly seen”. Wątki forum Apple Developer o tym objawie (USD przy arkuszu w EUR, JPY lub GBP) znalazłem w wyszukiwarce, ale ich treści nie przeczytałem, bo strona wymaga weryfikacji przeglądarki. Nie traktuję ich jako źródła.

**Hipoteza 02-monetyzacja-502 o koncie Sandbox z regionem USA jest możliwa, ale nie jest konieczna.** Według powyższej wskazówki objaw pojawia się w TestFlight także bez konta Sandbox. Do tego właściciel 23.10 nie znalazł w ogóle opcji konta Sandbox (docs/40-lekcje.md:174 „Właściciel nie znalazł tej opcji.”).

**Ryzyko produkcyjne.** W produkcji lista i arkusz biorą storefront z tego samego konta App Store. Aplikacja nie wymusza waluty ani storefrontu, więc w kodzie nie ma mechanizmu rozjazdu. Ryzyka nie da się jednak zamknąć z Linuksa: jest **niepotwierdzone, brzegowe**.

**Ocena per ID:**
- 01-odkrywanie-001 i 09-lokalizacja-002 twierdzą, że to defekt aplikacji. Wynik: **niepewne**. Objaw jest realny w TestFlight, przyczyny w kodzie nie ma, najpewniej to artefakt piaskownicy. Jako defekt kodu P2. Test jednostkowy „adapter z produktem w PLN” jest tani i przechodzi już dziś (S-A).
- 02-monetyzacja-502 dotyczy procesu i to jest **potwierdzone**. W rejestrze ryzyk nie ma wpisu o walucie (docs/40-lekcje.md:9 „## Rejestr ryzyk (otwarte blokują wydanie)”). Lista telefonu sprawdza tylko arkusz (docs/49-testflight-1-0.md:26 „arkusz Apple pokazuje właściwą cenę”). CLAUDE.md wymaga wpisu dla ryzyka „niepotwierdzone / rozstrzygnie build” (CLAUDE.md:45 „każde ryzyko „niepotwierdzone / rozstrzygnie build” trafia do sekcji „Rejestr ryzyk””). Według tej reguły otwarte ryzyko blokuje wydanie, więc P1 zostaje.
- Wytyczne 2.3.1(a) („promoting a false price”) i 3.1.2(c) nie dają realnego ryzyka odrzucenia, dopóki przyczyną jest piaskownica. Recenzja też działa w piaskownicy, więc recenzent może zobaczyć ten sam rozjazd. To niepewne, bo przeczytanego źródła o storefroncie recenzenta nie ma.

## (b) Stan po zakupie i dożywotni przy subskrypcji: 01-odkrywanie-002, 10-wydanie-002, 04-studio-projektowe-001, 02-monetyzacja-503

**Sonda S-B** (sztuczny sklep, aktywny roczny, ekran z Ustawień; dowody/G1-sonda.txt):
- `owned=true headline=true plany=plan-yearly,plan-monthly,plan-lifetime wybrany_roczny=true przycisk_Subskrybuj=true`;
- po wyborze dożywotniego: `ostrzezenie_przed_zakupem=false`;
- po zakupie dożywotniego: `ostrzezenie=true uprawnienia=["yearly","lifetime"]`.

Wszystkie opisane mechanizmy są więc **potwierdzone**:
- nagłówek o darmowych dniach widać także przy aktywnym dostępie (app/paywall.tsx:66);
- karta posiadania nie nazywa planu (app/paywall.tsx:69);
- plany i „Subskrybuj” są widoczne dla każdego bez dożywotniego (app/paywall.tsx:76, app/paywall.tsx:32);
- uwaga o podwójnym płaceniu pojawia się dopiero po zakupie (app/paywall.tsx:72).

Spec wymaga tej uwagi także przed zakupem (docs/27-subskrypcja-spec.md:183). W BRD nie ma scenariusza stanu posiadania: BR-ZAK-003 opisuje tylko start ponad limit, nagłówek z Ustawień i brak samoczynnych okien (docs/brd/wymagania.md:686).

**Co osłabia znaleziska:**
- **Pokazywanie planów subskrybentowi jest zamierzone.** Zmiana miesięczna ↔ roczna ma iść także „przez zakup drugiego planu na naszym ekranie” (docs/27-subskrypcja-spec.md:177 „przez zakup drugiego planu na naszym ekranie”). Obie subskrypcje są w jednej grupie. Apple: „Since people can only buy one subscription within a group at a time, creating a single group is the best practice for most apps as it prevents people from accidentally purchasing multiple subscriptions.” (dowody/G1-zrodla.txt). „Subskrybuj” przy rocznym lub miesięcznym nie prowadzi więc do podwójnej subskrypcji.
- **3.1.2(b)** (odczyt dziś, wersja z 16.10.2026: „should not be able to inadvertently subscribe to multiple variations of the same thing”) dotyczy wariantów subskrypcji. Grupa to załatwia. Dożywotni to zakup jednorazowy, nie „subscribe”.
- **5.6** dotyczy nakłaniania podstępem („trick them into making unwanted purchases”). Ekran ma nazwę „Kup na zawsze”, opis „Płacisz raz i masz na zawsze.” i „Zarządzaj subskrypcją” w karcie posiadania. Podstępu tu nie ma.
- **Ryzyko odrzucenia jest niskie i niepotwierdzone.** Nie znalazłem źródła, że recenzent kupuje dożywotni na koncie z aktywną subskrypcją. Teza 10-wydanie-002 „recenzent przechodzi dokładnie tę drogę” nie ma dowodu.

**Co zostaje:** realny skutek pieniężny dla użytkownika (podwójna płatność) i niewdrożona kontrola ryzyka R8 ze specyfikacji. To P1 („wyraźnie gorsza jakość”), ale nie P0.

**Ocena per ID:**
- **02-monetyzacja-503:** potwierdzone, brzegowe, P1.
- **01-odkrywanie-002 i 10-wydanie-002:** łączą oba mechanizmy. Część o dożywotnim to P1. Część o stanie posiadania (nagłówek, brak nazwy planu, „Subskrybuj” przy posiadanym planie) to P2. Apple nie pozwala kupić drugiej subskrypcji w grupie, a karta pokazuje „Masz pełną wersję” i datę.
- **04-studio-projektowe-001:** dotyczy tylko stanu posiadania. Potwierdzone, realne, P1 → P2.

Nie sprawdziłem, co StoreKit pokazuje przy próbie ponownego zakupu dokładnie tego samego, aktywnego planu. Nie da się tego sprawdzić na Linuksie.

## (c) 02-monetyzacja-501: P3 B z prawdziwym StoreKit

**Potwierdzone, z trzech niezależnych stron:**
1. **Apple.** `currentEntitlements` emituje dla subskrypcji tylko „the latest transaction for each auto-renewable subscription that has a [RenewalState] state of [subscribed] or [inGracePeriod]”. Wygasłej subskrypcji nie ma tam więc nawet bez filtra biblioteki. Zwroty i cofnięcia też nie trafiają do listy: „Products that the App Store has refunded or revoked don’t appear in the current entitlements.” (dowody/G1-zrodla.txt).
2. **openiap 3.6.0.** Przy `onlyIncludeActiveItemsIOS` dodatkowo `if onlyActive, let expirationDate = transaction.expirationDate, expirationDate <= Date() { continue }` (dowody/G1-konfiguracja.txt). Projekt sam to zapisał: docs/30-storekit-etap0.md:186 „pomija transakcje z `expirationDate` w przeszłości” oraz lib/store-native.ts:64 „onlyIncludeActiveItemsIOS odrzuca transakcje z expirationDate w przeszłości”. Wniosku dla P3 B nikt jednak nie wyciągnął.
3. **Kod aplikacji.**
   - `freeSince` zwraca null przy pustej liście (lib/access.ts:135 „export function freeSince(entitlements: readonly Entitlement[] | null | undefined, now: number): number | null {”), a `canStartLive` liczy wtedy wszystkie dni miesiąca (lib/access.ts:238).
   - Zapamiętany stan nie ratuje sytuacji: pusta lista nadpisuje `lastKnown` na `free` bez daty końca (lib/entitlement.ts:56 „if (list) { lastKnown = lastKnownFrom(list, now); await persist(lastKnown, now); }”).
   - Zapytanie o status odnowienia daje datę tylko dla karencji (lib/store-native.ts:77).

**Sonda S-C** (natywny adapter, makieta expo-iap filtrująca wygasłe jak openiap, status `expired`, 7 dni Pro przed wygaśnięciem; dowody/G1-sonda.txt):
- `natywna lista=[] -> level=free used=7 allowed=false remaining=0`;
- dla porównania lista z wygasłym wpisem (kształt sztucznego sklepu): `used=0 allowed=true remaining=5`.

**Dlaczego testy tego nie łapią:** makieta w testach zwraca listę bez filtra (tests/setup.js:64 „getAvailablePurchases: async (...a) => { rec('getAvailablePurchases', a); maybeFail(); return g().purchases; }”). Testy P3 B podają wygasły wpis wprost (tests/entitlement.test.ts:122, tests/m5s1-dni-treningowe.test.ts:61).

**Decyzja, którą to łamie:** docs/18-przekazanie.md:176 „limit po wygaśnięciu: tylko starty po wygaśnięciu (B)”.

**Realność:** realny. W TestFlight subskrypcja wygasa sama po 6 dziennych odnowieniach w tygodniu („Each subscription is renewed daily, up to 6 times within a 1-week period”), więc testerzy trafią na to szybko. W produkcji dotyczy każdego, kto anuluje subskrypcję po ≥ 5 dniach treningu w miesiącu wygaśnięcia, a także zwrotu i cofnięcia z rodziny.

**Poziom:** P1 pasuje: błędna liczba (licznik i blokada wbrew decyzji), bez utraty danych. Trening wstecz i dane zostają dostępne.
