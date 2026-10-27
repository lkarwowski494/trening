### 01-odkrywanie-001 · Ekran zakupu pokazuje cenę w innej walucie niż pobiera App Store (T-11)
- Pozycja listy kontrolnej: ODK-02 (z ODK-08)
- Poziom: P1
- Realność: realny (konto testerki PL, build 1031, wszystkie 3 plany); w środowisku produkcyjnym nie sprawdzono · Pewność: wysoka (obserwacja), przyczyna nieustalona
- Rodzaj: D (defekt)
- Dowód: obserwacja właściciela T-11 (polecenie M1): lista planów 0.99 / 6.99 / 14.99, arkusz Apple 4,99 / 19,99 / 59,99 zł. Kod bierze cenę wyłącznie z `displayPrice` biblioteki: `lib/store-native.ts:53` (productFromStore) i `app/paywall.tsx:30` (priceLine); żaden test nie sprawdza zgodności waluty z kontem (testy używają `FAKE_PRICES` w USD, `lib/store-fake.ts:12`). Kod natywny openiap 3.6.0 (formatowanie `displayPrice`) poza `node_modules` — nie do sprawdzenia na Linuksie.
- Wzorzec lub źródło: App Review Guidelines (Last Updated October 16, 2026; odczyt 2026-10-27), 2.3.1(a): "promoting a false price ... is grounds for removal"; 3.1.2(c): "clearly describe what the user will get for the price".
- Kroki w aplikacji: konto Apple w PL → Więcej → Ustawienia → Subskrypcja → Pełna wersja → lista planów w USD → „Subskrybuj” → arkusz Apple w zł.

- Test akceptacyjny: na koncie PL lista planów pokazuje 4,99 zł / 19,99 zł / 59,99 zł (te same kwoty co arkusz Apple); test jednostkowy kontraktu adaptera z produktem w PLN.


### 01-odkrywanie-002 · Po zakupie ekran dalej sprzedaje plany; dożywotni przy aktywnej subskrypcji bez uwagi przed zakupem
- Pozycja listy kontrolnej: ODK-02 (z ODK-03 i ODK-08)
- Poziom: P1
- Realność: realny (każdy subskrybent, który wejdzie w Ustawienia → Subskrypcja; potwierdzone przez właściciela T-11) · Pewność: wysoka
- Rodzaj: P (decyzja produktowa: jak wygląda stan „masz plan”)
- Dowód: `app/paywall.tsx:66` — nagłówek o darmowych dniach także przy aktywnym dostępie; `app/paywall.tsx:76` — lista planów i przycisk zakupu ukrywane tylko przy dożywotnim (`!lifetime`), więc subskrybent widzi wszystkie plany i «Subskrybuj» także przy posiadanym; `app/paywall.tsx:69` — karta posiadania nie nazywa planu; uwaga o podwójnym płaceniu tylko po zakupie dożywotniego: `app/paywall.tsx:72` «Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.». Specyfikacja wymaga tej uwagi także przed zakupem: `docs/27-subskrypcja-spec.md:183` (ryzyko R8 «Podwójne płacenie» w tym samym dokumencie). BRD BR-ZAK-001..003 nie ma scenariusza stanu posiadania, błędu zakupu, oczekiwania na zgodę ani przywracania.
- Wzorzec lub źródło: App Review 3.1.2(b) (odczyt 2026-10-27): "Users should have a seamless upgrade/downgrade experience and should not be able to inadvertently subscribe to multiple variations of the same thing."
- Kroki w aplikacji: kup roczny → Ustawienia → Subskrypcja → ekran pokazuje „Trenuj 5 dni … za darmo”, roczny z „Subskrybuj” i dożywotni z „Kup na zawsze” bez ostrzeżenia → zakup dożywotniego = płatność obok odnawianej subskrypcji.

- Test akceptacyjny: test ekranu z aktywną subskrypcją roczną: brak „Subskrybuj” dla rocznego, widoczna nazwa planu, przy wyborze dożywotniego uwaga o odnawianiu przed przyciskiem zakupu; BR-ZAK z nowymi scenariuszami (posiadanie, błąd, oczekiwanie, przywracanie).


### 10-wydanie-002 · Ekran zakupu po zakupie dalej oferuje plany i „darmowe dni”; dożywotni bez ostrzeżenia przed zakupem przy aktywnej subskrypcji
- Pozycja listy kontrolnej: MON-10 (cudza; zgłoszona tu z jej ID, bo raportu roli 02 nie czytam); ryzyko recenzji WYD-12
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: wstęp jest renderowany zawsze, gdy nie ma `reason=limit`, bez warunku na `view.active`: `app/paywall.tsx:66` „Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit.”; lista planów i przycisk zakupu pokazują się każdemu, kto nie ma dożywotniego: `app/paywall.tsx:76` „{!lifetime ? <>”; etykieta przycisku także dla posiadanego planu: `app/paywall.tsx:32` „p.period === null ? t('Kup na zawsze') : t('Subskrybuj')”; ostrzeżenie pojawia się dopiero po kupnie dożywotniego: `app/paywall.tsx:72` „Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.”. Karta stanu nie nazywa posiadanego planu. Zgodne z obserwacją właściciela T-11 na buildzie 1031; od 001ecf28 te pliki się nie zmieniły (`dowody/tagi.txt`).
- Wzorzec lub źródło: App Review Guidelines 3.1.2(b) (odczyt 27.10.2026, `dowody/wytyczne-odczyt.txt`): użytkownik „should not be able to inadvertently subscribe to multiple variations of the same thing”; 3.1.2(c) o jasnym opisie, co się dostaje.
- Kroki w aplikacji: Więcej → Ustawienia → Subskrypcja → Pełna wersja → kup roczny → ekran nadal pokazuje „Trenuj 5 dni… za darmo”, trzy plany i „Subskrybuj”; „Kup na zawsze” można kupić bez uprzedzenia, że subskrypcja dalej się odnawia (podwójna płatność). Recenzent przechodzi dokładnie tę drogę przy sprawdzaniu zakupów.

- Test akceptacyjny: test ekranu ze sztucznym sklepem: aktywna subskrypcja roczna → brak `paywall-headline`, brak przycisku zakupu dla planu rocznego, karta stanu zawiera nazwę planu; zakup dożywotniego przy aktywnej subskrypcji wymaga potwierdzenia z ostrzeżeniem; scenariusz Maestro zakupu rozszerzony o ten stan.


### 04-studio-projektowe-001 · Ekran „Pełna wersja” po zakupie nie mówi, jaki plan masz, i dalej sprzedaje ten sam plan
- Pozycja listy kontrolnej: SP-10
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: nagłówek o darmowych dniach nie zależy od stanu dostępu — `app/paywall.tsx:66` (Text `paywall-headline` w gałęzi bez limitu); karta posiadania pokazuje tylko „Masz pełną wersję” i datę, bez nazwy planu — `app/paywall.tsx:68`; lista planów i przycisk zakupu rysują się dla każdego stanu poza dożywotnim, bez oznaczenia posiadanego planu — `app/paywall.tsx:80`, `app/paywall.tsx:88`. Zrzut po zakupie rocznym (sztuczny sklep): `zrzuty/pw-po-zakupie-rocznym-390-dark.png`, `zrzuty/pw-po-zakupie-rocznym-390-light.png`, `zrzuty/ark-paywall.png` (kolumny 3–4). Obserwacja właściciela T-11 (build 1031, konto testerki PL) — ta sama.
- Wzorzec lub źródło: macierz stanów roli (stan „ostrzeżenie/praca w tle”: widoczny status), heurystyka Nielsena 1 (widoczność stanu) i 6; przejście poznawcze P7 krok 3 — porażka Q4 (`przeplywy-as-is.md`).
- Kroki w aplikacji: Więcej → Ustawienia → Pełna wersja → wybierz plan → Subskrybuj → zakup w arkuszu Apple → ekran wraca na górę: „Masz pełną wersję”, pod nią „Trenuj 5 dni w miesiącu za darmo…”, posiadany plan zaznaczony i „Subskrybuj”.

- Test akceptacyjny: test ekranu z uprawnieniem miesięcznym, rocznym, z kodu i z Chmury rodzinnej: brak nagłówka o darmowych dniach, nazwa posiadanego planu widoczna i czytana przez VoiceOver, przy posiadanym planie brak przycisku zakupu; scenariusz Maestro 21 rozszerzony o stan po zakupie.


### 02-monetyzacja-501 · Po wygaśnięciu albo cofnięciu Pro dni treningowe z okresu Pro zużywają darmowy limit (P3 B nie działa z prawdziwym sklepem)
- Pozycja listy kontrolnej: MON-09
- Poziom: P1
- Realność: realny (każdy, kto anuluje subskrypcję, trenował w Pro co najmniej 5 dni w miesiącu wygaśnięcia, a potem chce trenować dalej za darmo; to samo przy cofnięciu z Chmury rodzinnej i przy zwrocie) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: P3 B wymaga, żeby wygasłe uprawnienie było na liście: `freeSince` liczy start okresu darmowego z końca uprawnień przekazanych w liście (`lib/access.ts:135-143`, użyte w `lib/access.ts:238`). Natywny adapter czyta `getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })` (`lib/store-native.ts:70`), a openiap 3.6.0 przy tej opcji pomija transakcje z datą wygaśnięcia w przeszłości. Zwrotów i cofnięć nie ma w currentEntitlements. Po wygaśnięciu lista jest więc pusta, `freeSince` = null i liczą się wszystkie dni miesiąca. Sonda (dowody/sonda-dostep-ekran.txt, exit 0): "pusta lista (kształt natywny) -> allowed=false used=7" oraz "lista z wygasłym (kształt sztucznego sklepu) -> allowed=true used=0"; adapter natywny z makietą expo-iap: "level=free used=7 allowed=false". Testy decyzji podają wygasły wpis wprost (`tests/entitlement.test.ts:123`, test 10b w tests/m5s1-dni-treningowe.test.ts). Sztuczny sklep zachowuje wygasłe wpisy, więc E2E (scenariusz 21, panel "expire access") też tego nie widzi. Kod biblioteki: (dowody/biblioteka-expo-iap-openiap.txt).
- Wzorzec lub źródło: decyzja właściciela 12.10.2026 P3 B (`docs/18-przekazanie.md:176`); docs/monetyzacja.md: "Po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia (P3 B)". Apple, currentEntitlements: "Products that the App Store has refunded or revoked don’t appear" (cytat z modułu storekit-expo).
- Kroki w aplikacji: kup miesięczny 1.11 → trenuj na żywo 8 dni → anuluj, subskrypcja wygasa 20.11 → 21.11 „Start” w nowym dniu → ekran „Jesteśmy z Ciebie dumni! … wykorzystujesz wszystkie darmowe dni treningowe (5)” zamiast startu. Licznik na ekranie Trening pokazuje 0 z 5. Tekst pochwały mówi o darmowych dniach, które w rzeczywistości były dniami Pro.

- Test akceptacyjny: adapter natywny z makietą expo-iap, która nie zwraca wygasłej subskrypcji (dokładnie jak openiap): 7 dni treningu w Pro przed wygaśnięciem, 0 po → start w nowym dniu dozwolony, licznik 5 z 5. Test P3 B w tests/m5s1-dni-treningowe.test.ts i tests/entitlement.test.ts działa na kształcie z adaptera natywnego, nie na liście z wygasłym wpisem. To samo dla cofnięcia z rodziny i zwrotu.


### 02-monetyzacja-502 · T-11: cena na liście planów (USD) różna od ceny w arkuszu Apple (PLN); przyczyna niewyjaśniona, ryzyka nie ma w rejestrze, a lista telefonu tego nie sprawdza
- Pozycja listy kontrolnej: MON-10
- Poziom: P1 (otwarte, niepotwierdzone ryzyko wprowadzenia w błąd przy płatności; według CLAUDE.md otwarte ryzyko blokuje wydanie; gdyby wystąpiło w produkcji, byłoby P0)
- Realność: realny w TestFlight (obserwacja właściciela, build 1031, konto testerki PL, wszystkie 3 plany); w produkcji brzegowy — [DO USTALENIA] · Pewność: wysoka co do braku zamknięcia ryzyka; średnia co do przyczyny
- Rodzaj: M (zachowanie StoreKit i sklepu)
- Dowód: aplikacja pokazuje wyłącznie `displayPrice` ze StoreKit (`lib/store-native.ts:52-57`, `app/paywall.tsx:29-31`). openiap 3.6.0 bierze go z `StoreKit.Product.products(for:)` bez przeliczeń i bez pamięci podręcznej między wejściami na ekran (dowody/biblioteka-expo-iap-openiap.txt). Sztuczny sklep (ceny w USD, `lib/store-fake.ts:12`) jest wykluczony: arkusz Apple się pokazał, a testflight.yml przerywa build ze zmienną sztucznego sklepu. Apple, Product.displayPrice: "The storefront that the user’s device is connected to determines the locale." Sandbox: "Apps that you download from TestFlight always run in the sandbox environment" oraz "you see the Apple In-App Purchases appropriate to the region assigned to your Sandbox Apple Account" (dowody/apple-zrodla-2026-10-27.txt). Najbardziej prawdopodobna przyczyna: na telefonie zalogowane jest konto Sandbox (Ustawienia → Programista) z regionem USA, które decyduje o storefroncie pobranych produktów, a arkusz zakupu przypisuje zakup kontu produkcyjnemu PL. To hipoteza; z Linuksa jej nie potwierdzę. Kwoty: lista miesięczna 0,99 USD ≈ 3,91 zł, pobranie 4,99 zł (sekcja "Rachunek"). W rejestrze ryzyk brak wpisu (`docs/40-lekcje.md:9`); lista telefonu sprawdza tylko cenę w arkuszu (`docs/49-testflight-1-0.md:26`).
- Wzorzec lub źródło: developer.apple.com/app-store/subscriptions/ (27.10.2026): "Full renewal price, shown clearly and prominently, and localized in available currencies"; 5.6: "trick them into making unwanted purchases".
- Kroki w aplikacji: TestFlight, konto PL → Ustawienia → Subskrypcja → „Pełna wersja” → lista „$0.99/miesiąc”… → „Subskrybuj” → arkusz 4,99 zł.

- Test akceptacyjny: zapis z datą i buildem: telefon z kontem PL bez konta Sandbox, lista 4,99 / 19,99 / 59,99 zł = arkusz. Wpis w rejestrze ryzyk zamknięty tym dowodem. Punkt listy kontrolnej dopisany.


### 02-monetyzacja-503 · Subskrybent wybierający plan dożywotni nie widzi przed zakupem, że subskrypcja dalej się odnawia (podwójna płatność; wymóg docs/27 3.11 bez wdrożenia)
- Pozycja listy kontrolnej: MON-10
- Poziom: P1
- Realność: brzegowy (subskrybent, który przechodzi na dożywotni — typowa ścieżka „podoba mi się, kupię na zawsze”; skutek pieniężny dotyczy użytkownika) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: przy aktywnej subskrypcji ekran pokazuje pełną listę planów (`app/paywall.tsx:76`) z "Kup na zawsze" dla dożywotniego (`app/paywall.tsx:32`), a uwaga o odnawianiu pojawia się dopiero po zakupie dożywotniego (`app/paywall.tsx:72`). Spec przyjęta 12.10: "Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem." (`docs/27-subskrypcja-spec.md:183`). Sonda S2 (dowody/sonda-dostep-ekran.txt): "ostrzeżenie o odnawiającej się subskrypcji PRZED zakupem=false"; po zakupie w sklepie są monthly i lifetime.
- Wzorzec lub źródło: 3.1.2(b) (odczyt 27.10.2026): "should not be able to inadvertently subscribe to multiple variations of the same thing"; zasada roli 6 („Uczciwie albo wcale”).
- Kroki w aplikacji: aktywny miesięczny → Ustawienia → „Pełna wersja” → zaznacz „Trening to moje życie” → „Kup na zawsze” → arkusz Apple → zapłacone; subskrypcja odnawia się dalej.

- Test akceptacyjny: render ekranu z aktywną subskrypcją (także z Chmury rodzinnej i z kodu — wtedy bez sugestii „anuluj”, jeśli nie płaci sam) i zaznaczonym dożywotnim → widoczne zdanie przed zakupem (PL, EN, VoiceOver).


### 09-lokalizacja-002 · Ekran zakupu pokazuje ceny w USD, a arkusz Apple pobiera PLN (T-11)
- Pozycja listy kontrolnej: LOK-07 (ceny → MON-10, rola 02)
- Poziom: P1 (użytkownik w PL widzi inną kwotę i walutę niż płaci — myli w przepływie zakupu; ryzyko wytycznej 3.1.2 o jasnej cenie)
- Realność: realny · Pewność: wysoka co do objawu (obserwacja właściciela, build 1031, konto testerki w PL, wszystkie 3 plany); przyczyna [DO USTALENIA]
- Rodzaj: D
- Dowód: kod bierze cenę tylko ze sklepu — `lib/store-native.ts:54` („typeof x.displayPrice !== 'string'”); widoczne kwoty 0.99 / 6.99 / 14.99 są identyczne z cenami testowymi `lib/store-fake.ts:12` („monthly: '$0.99', yearly: '$6.99', lifetime: '$14.99'”) i z plikiem `store/Trening.storekit`, ale build TestFlight odrzuca sztuczny sklep (`.github/workflows/testflight.yml:102`), a arkusz zakupu działał natywnie — więc kwoty przyszły z `displayPrice` StoreKit/biblioteki (expo-iap 5.8.1, OpenIAP apple 3.6.0) w innej walucie niż arkusz. Kodu natywnego biblioteki 3.6.0 nie było w `node_modules` — nie sprawdzono.
- Wzorzec lub źródło: zasada roli 6 („ceny tylko ze sklepu (MON-10)”); obserwacja T-11 z polecenia M1.
- Kroki w aplikacji: konto Apple w PL, TestFlight → Ustawienia → Subskrypcja → lista planów: „$0.99/miesiąc”; „Subskrybuj” → arkusz Apple: „4,99 zł”.

- Test akceptacyjny: na telefonie z kontem PL lista planów pokazuje te same kwoty i walutę co arkusz Apple (krok właściciela po buildzie); test jednostkowy adaptera z produktem w PLN.


